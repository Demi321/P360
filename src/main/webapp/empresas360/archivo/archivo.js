/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global RequestPOST, directorio_usuario, AWS, sesion_cookie, NotificacionToas, moment, Swal, lottieLoader_blockpage, superCm, swal, Notification, PathRecursos, pdfjsLib, perfil */

var vueArchivos, tablaArchivos, detailRows = [], usuariosReenviaArchivo = [], tipoVistaArchivos = 0, creandoNuevoEnvioArchivo = false;
var banderaD = false, banderaR = false, banderaDCorreos = false, banderaRCorreos = false;
var BackupCorreos = {};
const selectOrigen = $("#origenArchivo");
const destinatarioArchivo = $("#destinatarioArchivo");
const remitenteArchivo = $("#remitenteArchivo");
const archivosEncontrados = $("#contentArchivos");
const archivosNoEncontrados = $("#sinArchivos");
const buttonBorrarArchivos = $("#eliminarArchivos");
const refrescarArchivos = $("#refrescarArchivos");
var recibirArchivoSocket;

/*VARIABLES GLOBALES VISTA DE CORREOS */
const remitenteArchivoVistaCorreos = $("#remitenteVistaCorreosValor");
const destinatarioArchivoVistaCorreos = $("#destinatarioVistaCorreosValor");
var agregarRespuestaDeCorreo;
var agregaDivProyectoCorreo;
var cargarArchivosCorreo;
var agregaItemArchivoCorreo;

/* NOTIFICACION SONIDOS */
var buttonNotificacionCorreo = $("<button></button>").addClass("d-none");
var sonidoCorreo = document.getElementById('sonidoCorreos');
$("body").append(buttonNotificacionCorreo);

buttonNotificacionCorreo.click(() => {

    sonidoCorreo.muted = true;
    sonidoCorreo.muted = false;
    sonidoCorreo.play();

});

const loaderArchivos = $("#loaderArchivos");

/* VENTANA MODAL PARA CONFIRMAR O DECLINAR UNA ACCION */
const confirmArchivos = (message, textConfirm, textCancel) => {
    return new Promise((resolve, reject) => {
        swal.fire({
            text: message,
            showCancelButton: true,
            confirmButtonText: textConfirm,
            cancelButtonText: textCancel
        }).then((result) => {
            if (result.dismiss)
                resolve(false);
            if (result.value)
                resolve(true);
        });
    });
};

/* METODO PARA MOSTRAR UN LOADER DE CARGA PARA PROCESOS CON RETRASO */
const muestraLoaderArchivo = () => {
    loaderArchivos.removeClass("d-none");
};

/* METODO PARA ELIMINAR EL LOADER DE CARGA */
const ocultaLoaderArchivo = () => {
    loaderArchivos.addClass("d-none");
};

/* METODO PARA REALIZAR UNA NOTIFICACION TOAST DENTRO DEL MODULO */
const NotificacionToasArchivos = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

/* METODO PARA BUSCAR UN ID360 DENTRO DEL DIRECTORIO Y DEVOLVER LA DATA COMPLETA */
const buscaEnDirectorioCompletoArchivos = (id360) => {
    let user;
    $.each(directorio_usuario, (i) => {
        if (id360 === directorio_usuario[i].id360) {
            user = directorio_usuario[i];
            return false;
        }
    });
    return user;
};

recibirArchivoSocket = (mensaje) => {

    /* VERIFICAR SI EL PROYECTO ESTA PINTADO */
    if (!$("#itemProyectoArchivosVistaCorreo_proyectoArchivos_" + mensaje.id_proyecto).length) {
        agregaDivProyectoCorreo(mensaje.id_proyecto, "proyectoArchivos_" + mensaje.id_proyecto, mensaje.proyecto, 1, false);
    } else {

        let divProyecto = $("#itemProyectoArchivosVistaCorreo_" + mensaje.id_proyecto);

        /* AUMENTAR LA CANTIDAD DEL SPAN */
        let spanCantidad = divProyecto.find("span");
        let cantidad = parseInt(spanCantidad.text());
        spanCantidad.text(cantidad + 1);

        /* SABER SI EL INPUT ESTA MARCADO */
        let proyectoSeleccionado = $("input[name=proyectoSeleccionado]:checked").val();
        if ((proyectoSeleccionado === mensaje.id_proyecto || proyectoSeleccionado === "0") && $("input[name=origenSeleccionado]:checked").val() !== "2") {

            console.log("Pasa condiciones, a pintar ");
            mensaje.cantidadRespuestasNoLeidas = "0";
            mensaje.leido = "0";
            agregaItemArchivoCorreo(mensaje);

        }

    }

    buttonNotificacionCorreo.click();

};

/* METODO PARA PINTAR RESPUESTAS SOBRE UN CORREO SELECCIONADO */
agregarRespuestaDeCorreo = (respuesta) => {

    let contenedorRespuestas = $("#contenedorRespuestasCorreo_" + respuesta.id_archivo);

    if (contenedorRespuestas.length) {
        let divRespuesta = $("<div></div>").addClass("w-100 respuestaCorreo card");

        let usuario = null;
        if (respuesta.id360 === perfil.id360) {
            usuario = {
                "img": perfil.img,
                "nombre": perfil.nombre,
                "apellido_paterno": perfil.apellido_paterno,
                "apellido_materno": perfil.apellido_materno,
                "correo": perfil.correo
            };
        } else {
            usuario = buscaEnDirectorioCompletoArchivos(respuesta.id360);
        }

        let divCabecera = $("<div></div>").addClass("w-100 card-header");
        divCabecera.attr("id", "cabeceraRespuestaCorreo_" + respuesta.id_archivo_conversacion);
        divCabecera.attr("data-toggle", "collapse");
        divCabecera.attr("data-target", "#cuerpoRespuestaCorreo_" + respuesta.id_archivo_conversacion);
        divCabecera.attr("aria-expanded", "true");
        divCabecera.attr("aria-controls", "cuerpoRespuestaCorreo_" + respuesta.id_archivo_conversacion);

        let divFoto = $("<div></div>").addClass("w-100");
        let foto = $("<img>").addClass("w-100");
        foto.attr("src", usuario.img);
        divFoto.append(foto);
        divCabecera.append(divFoto);

        let divNombre = $("<div></div>").addClass("w-100 text-left");
        divNombre.text(usuario.nombre + " " + usuario.apellido_paterno + " " + usuario.apellido_materno + " ");
        divNombre.append(" <<a href='mailto:'" + usuario.correo + ">" + usuario.correo + "</a>>");
        divCabecera.append(divNombre);

        let divFecha = $("<div></div>").addClass("w-100 text-right");

        divFecha.text(moment(respuesta.date_created + " " + respuesta.time_created).format("DD-MMM-YY hh:mm A"));
        divFecha.append('<i class="fas fa-reply ml-3"></i>');
        divCabecera.append(divFecha);

        let divCuerpo = $("<div></div>").addClass("w-100 collapse");
        divCuerpo.attr("aria-labelledby", "cabeceraRespuestaCorreo_" + respuesta.id_archivo_conversacion);
        divCuerpo.attr("id", "cuerpoRespuestaCorreo_" + respuesta.id_archivo_conversacion);
        let divContenido = $("<div></div>").addClass("card-body");

        let descripcion = $("<div></div>").addClass("w-100");
        descripcion.html(respuesta.cuerpo_conversacion);

        divContenido.append(descripcion);
        divCuerpo.append(divContenido);

        if (respuesta.archivos_conversacion !== "N/A") {

            let adjuntos = $("<div></div>").addClass("w-100");

            adjuntos.css({
                "display": "grid",
                "grid-template-columns": "1fr 1fr 1fr 1fr 1fr",
                "grid-gap": "10px"
            });

            let rutasAdjuntos = respuesta.archivos_conversacion.split(",");
            $.each(rutasAdjuntos, (index, ruta) => {

                let partes = ruta.split(".");
                let extension = partes[ partes.length - 1 ];

                let imgPreview = $("<img>").addClass("w-100");
                imgPreview.attr("src", PathRecursos + "images/icono_default.png");
                imgPreview.css({
                    "max-height": "100px"
                });

                switch (extension) {

                    case "jpg":
                    case "png":
                    case "gif":
                    case "jpeg":
                        imgPreview.attr("src", ruta);
                        break;

                    case "docx":
                    case "docm":
                    case "dotx":
                    case "dotm":
                    case "doc":
                        imgPreview.attr("src", PathRecursos + "images/icono_word.png");
                        break;

                    case "xlsx":
                    case "xlsm":
                    case "xlsb":
                    case "xltx":
                    case "xltm":
                    case "xls":
                    case "xlt":
                        imgPreview.attr("src", PathRecursos + "images/icono_excel.png");
                        break;

                    case "pptx":
                    case "pptm":
                    case "ppt":
                    case "xps":
                    case "potx":
                    case "ppsx":
                        imgPreview.attr("src", PathRecursos + "images/icono_powerpoint.png");
                        break;

                    case "pdf":
                        imgPreview.attr("src", PathRecursos + "images/icono_pdf.png");
                        break;

                }

                let divAdjunto = $("<div></div>").addClass("w-100");
                divAdjunto.css({
                    "display": "grid"
                });

                let divImagen = $("<div></div>").addClass("w-100");
                divImagen.css({
                    "height": "100px",
                    "display": "flex",
                    "justify-content": "center",
                    "align-items": "center"
                });
                divImagen.append(imgPreview);

                let partesPorDiagonal = ruta.split("/");
                let nombreCorto = partesPorDiagonal[partesPorDiagonal.length - 1];
                let botonDescargar = $("<a></a>").addClass("btn btn-block btn-ligth mt-2");
                botonDescargar.css({
                    "background-color": "#0097a9",
                    "border-color": "#0097a9",
                    "color": "#fff"
                });
                botonDescargar.attr("href", ruta);
                botonDescargar.attr("download", nombreCorto);
                botonDescargar.attr("target", "_blank");
                botonDescargar.html('<i class="fas fa-download"></i>');

                divAdjunto.append(divImagen);
                divAdjunto.append(botonDescargar);
                adjuntos.append(divAdjunto);

            });

            divContenido.append(adjuntos);
        }

        divRespuesta.append(divCabecera);
        divRespuesta.append(divCuerpo);

        contenedorRespuestas.append(divRespuesta);
    }

};

/* METODO PARA PINTAR UN PROYECTO EN EL LISTADO */
agregaDivProyectoCorreo = (value, id, text, cantidad, selected) => {

    const listadoProyectos = $(".listadoDeProyectos .radio-proyectos");

    let div = $("<div></div>").addClass("form-group");
    div.attr("id", "itemProyectoArchivosVistaCorreo_" + id);
    let input = $("<input>");
    input.attr("value", value);
    input.attr("type", "radio");
    input.attr("name", "proyectoSeleccionado");
    input.attr("id", id);
    let label = $("<label></label>");
    label.attr("for", id);
    label.text(text);

    let cantidadArchivosProyecto = $("<span></span>").addClass("badge bg-secondary");
    cantidadArchivosProyecto.css({
        "position": "absolute",
        "right": "5px",
        "color": "#fff"
    });
    cantidadArchivosProyecto.text(cantidad);
    label.append(cantidadArchivosProyecto);

    div.append(input);
    div.append(label);

    listadoProyectos.append(div);

    if (selected) {
        input.attr("checked", true);
    }
};

/* METODO PARA PINTAR UN ARCHIVO EN EL LISTADO */
agregaItemArchivoCorreo = (data, resaltar) => {

    const contenedorArchivos = $("#archivosVistaCorreo .listadoArchivosVistaCorreo");
    const contenedorDetalleArchivo = $("#archivosVistaCorreo .detalleArchivo");

    let div = $("<div></div>").addClass("itemArchivo");
    div.attr("id", "itemArchivoVistaCorreo_" + data.id_archivo);

    let divData = $("<div></div>").addClass("dataItemArchivo");
    let divDataContent = $("<div></div>").addClass("w-100");
    let remitente = $("<h5></h5>").addClass("remitenteArchivo");

    let nombreRemitente = "";
    let imgRemitente = "";
    let correoRemitente = "";
    if (data.id360 === perfil.id360) {
        nombreRemitente = perfil.nombre + " " + perfil.apellido_paterno + " " + perfil.apellido_materno;
        imgRemitente = perfil.img;
        correoRemitente = perfil.correo;
    } else {

        let userRe = buscaEnDirectorioCompletoArchivos(data.id360);
        nombreRemitente = userRe.nombre + " " + userRe.apellido_paterno + " " + userRe.apellido_materno;
        imgRemitente = userRe.img;
        correoRemitente = userRe.correo;

    }

    remitente.text(nombreRemitente);
    divDataContent.append(remitente);
    let asunto = $("<p></p>").addClass("asunto");
    asunto.text(data.titulo_archivo);
    divDataContent.append(asunto);

    let divDataCantidadRespuestas = $("<div></div>").addClass("w-100 cantidadRespuestasArchivo");
    divDataCantidadRespuestas.attr("id", "cantidadRespuestasArchivo_" + data.id_archivo);

    let cantidadAlertas = parseInt(data.cantidadRespuestasNoLeidas);
    if (data.leido === "0" && data.id360 !== perfil.id360) {
        cantidadAlertas++;
    }

    divDataCantidadRespuestas.append('<span>' + cantidadAlertas + '</span>');
    if (cantidadAlertas === 0) {
        divDataCantidadRespuestas.css({
            "display": "none"
        });
    }

    divData.append(divDataContent);
    divData.append(divDataCantidadRespuestas);

    let divControles = $("<div></div>").addClass("controlesItemArchivo");
    let buttonEliminar = $("<button></button>").addClass("btn btn-sm btn-ligth");
    buttonEliminar.html('<i class="fas fa-trash"></i>');
    divControles.append(buttonEliminar);
    let buttonReenviar = $("<button></button>").addClass("btn btn-sm btn-ligth");
    buttonReenviar.html('<i class="fas fa-share-alt"></i>');
    divControles.append(buttonReenviar);

    let divFecha = $("<div></div>").addClass("fechaArchivo");
    let fechaMoment = moment(data.date_created + " " + data.time_created);
    let fechaArchivo = fechaMoment.format("DD-MMM-YY hh:mm A");
    divFecha.text(fechaArchivo);

    div.append(divControles);
    div.append(divData);
    div.append(divFecha);

    contenedorArchivos.prepend(div);

    div.mouseenter(() => {
        divControles.css({"display": "block"});
    }).mouseleave(() => {
        divControles.css({"display": "none"});
    });

    div.click(() => {

        if ($("#detalleDeArchivo_" + data.id_archivo).length)
            return false;

        contenedorDetalleArchivo.empty();
        let divPadre = $("<div></div>").addClass("w-100");
        divPadre.attr("id", "detalleDeArchivo_" + data.id_archivo);

        muestraLoaderArchivo();

        let divDetalle = $("<div></div>");
        divDetalle.css({
            "padding": "20px 0"
        });

        /* TITULO CON BOTONES */
        let divTituloDetalle = $("<div></div>");
        divTituloDetalle.css({
            "position": "relative"
        });
        let asuntoDetalle = $("<h5></h5>");
        asuntoDetalle.css({
            "font-size": "2rem"
        });
        asuntoDetalle.text(data.titulo_archivo);
        divTituloDetalle.append(asuntoDetalle);
        let divBotoneraDetalle = $("<div></div>");
        divBotoneraDetalle.css({
            "position": "absolute",
            "top": "5px",
            "right": "5px"
        });

        let buttonReenviarC = buttonReenviar;
        buttonReenviarC.removeClass("btn-sm");

        let buttonEliminarC = buttonEliminar;
        buttonEliminarC.removeClass("btn-sm");

        divBotoneraDetalle.append(buttonReenviarC);
        divBotoneraDetalle.append(buttonEliminarC);
        divTituloDetalle.append(divBotoneraDetalle);

        divDetalle.append(divTituloDetalle);

        /* INFORMACION REMITENTE */
        let divInfo = $("<div></div>");
        divInfo.css({
            "display": "grid",
            "grid-template-columns": "50px 1fr 150px",
            "align-items": "center"
        });
        let divFoto = $("<div></div>");
        let foto = $("<img>").addClass("w-100");
        foto.attr("src", imgRemitente);
        foto.css({
            "max-height": "100%",
            "border-radius": "50%"
        });
        divFoto.append(foto);
        divInfo.append(divFoto);
        let divNombre = $("<div></div>").addClass("pl-3");
        let nDetalle = nombreRemitente;
        if (correoRemitente !== "") {
            nDetalle = nDetalle + " <<a href='mailto:'" + correoRemitente + ">" + correoRemitente + "</a>>";
        }
        divNombre.html(nDetalle);
        divInfo.append(divNombre);
        let divFechaD = $("<div></div>");
        divFechaD.text(fechaArchivo);
        divInfo.append(divFechaD);

        /* DESTINATARIOS */
        let divDestinatarios = $("<div></div>").addClass("w-100 mt-3");

        let arrayDestinatarios;

        try {
            arrayDestinatarios = data.destinatarios.split(",");
        } catch (error) {
            console.log(error);
            arrayDestinatarios = data.destinatarios;
        }

        $.each(arrayDestinatarios, (index, destinatario) => {

            let user = buscaEnDirectorioCompletoArchivos(destinatario);

            if (user !== undefined) {

                let pDestinatario = $("<p></p>");
                pDestinatario.css({
                    "margin-bottom": "0.3rem",
                    "color": "darkcyan"
                });
                let nDestinatario = user.nombre + " " + user.apellido_paterno + " " + user.apellido_materno + "< <a style='color:gray' href='mailto:'" + user.correo + ">" + user.correo + "</a> >";
                pDestinatario.html(nDestinatario);
                divDestinatarios.append(pDestinatario);

            }

        });

        let divCuerpoArchivo = $("<div></div>").addClass("w-100 mt-3");
        divCuerpoArchivo.html(data.descripcion_archivo);

        divPadre.append(divDetalle);
        divPadre.append(divInfo);
        divPadre.append(divDestinatarios);
        divPadre.append(divCuerpoArchivo);

        if (data.ruta_archivo !== "N/A") {
            let divAdjuntos = $("<div></div>").addClass("w-100 adjuntosDetalleArchivo");
            divAdjuntos.css({
                "display": "grid",
                "grid-template-columns": "1fr 1fr 1fr 1fr 1fr",
                "grid-gap": "10px"
            });

            let rutasAdjuntos = data.ruta_archivo.split(",");
            $.each(rutasAdjuntos, (index, ruta) => {

                let partes = ruta.split(".");
                let extension = partes[ partes.length - 1 ];

                let imgPreview = $("<img>").addClass("w-100");
                imgPreview.attr("src", PathRecursos + "images/icono_default.png");
                imgPreview.css({
                    "max-height": "100px"
                });

                switch (extension) {

                    case "jpg":
                    case "png":
                    case "gif":
                    case "jpeg":
                        imgPreview.attr("src", ruta);
                        break;

                    case "docx":
                    case "docm":
                    case "dotx":
                    case "dotm":
                    case "doc":
                        imgPreview.attr("src", PathRecursos + "images/icono_word.png");
                        break;

                    case "xlsx":
                    case "xlsm":
                    case "xlsb":
                    case "xltx":
                    case "xltm":
                    case "xls":
                    case "xlt":
                        imgPreview.attr("src", PathRecursos + "images/icono_excel.png");
                        break;

                    case "pptx":
                    case "pptm":
                    case "ppt":
                    case "xps":
                    case "potx":
                    case "ppsx":
                        imgPreview.attr("src", PathRecursos + "images/icono_powerpoint.png");
                        break;

                    case "pdf":
                        imgPreview.attr("src", PathRecursos + "images/icono_pdf.png");
                        break;

                }

                let divAdjunto = $("<div></div>").addClass("w-100");
                divAdjunto.css({
                    "display": "grid"
                });

                let divImagen = $("<div></div>").addClass("w-100");
                divImagen.css({
                    "height": "100px",
                    "display": "flex",
                    "justify-content": "center",
                    "align-items": "center"
                });
                divImagen.append(imgPreview);

                let partesPorDiagonal = ruta.split("/");
                let nombreCorto = partesPorDiagonal[partesPorDiagonal.length - 1];
                let botonDescargar = $("<a></a>").addClass("btn btn-block btn-ligth mt-2");
                botonDescargar.css({
                    "background-color": "#0097a9",
                    "border-color": "#0097a9",
                    "color": "#fff"
                });
                botonDescargar.attr("href", ruta);
                botonDescargar.attr("download", nombreCorto);
                botonDescargar.attr("target", "_blank");
                botonDescargar.html('<i class="fas fa-download"></i>');

                divAdjunto.append(divImagen);
                divAdjunto.append(botonDescargar);
                divAdjuntos.append(divAdjunto);

            });

            divPadre.append(divAdjuntos);

        }

        let divRespuestasDeCorreo = $("<div></div>").addClass("w-100 mt-4 accordion contenedorRespuestas");
        divRespuestasDeCorreo.attr("id", "contenedorRespuestasCorreo_" + data.id_archivo);
        divPadre.append(divRespuestasDeCorreo);

        let dataConsultaConversacion = {
            "id_archivo": data.id_archivo,
            "id360": perfil.id360
        };

        RequestPOST("/API/empresas360/consultar_conversacion_archivo", dataConsultaConversacion).then((response) => {

            if (response.length > 0) {

                $.each(response, (index, mensaje) => {

                    agregarRespuestaDeCorreo(mensaje);

                });

            }

            let divBotonResponde = $("<div></div>").addClass("w-100 mt-4");
            let buttonResponder = $("<button></button>").addClass("btn btn-ligth");
            buttonResponder.html('<i class="fas fa-reply"></i> Añadir respuesta');
            divBotonResponde.append(buttonResponder);
            divPadre.append(divBotonResponde);

            /* CONTENEDOR PARA RESPONDER CORREO */
            let divEnviarMensaje = $("<div></div>").addClass("w-100 mt-4");
            divEnviarMensaje.css({
                "padding": "10px",
                "border": "0.5px solid lightgray",
                "display": "none"
            });

            let pLeyendaEnviarMensaje = $("<p></p>");
            pLeyendaEnviarMensaje.text("Responder");
            divEnviarMensaje.append(pLeyendaEnviarMensaje);

            let formGroupContenido = $("<div></div>").addClass("form-group");
            let textareaContenido = $('<textarea></textarea>').addClass("form-control");
            textareaContenido.attr("row", "15");
            formGroupContenido.append(textareaContenido);
            divEnviarMensaje.append(formGroupContenido);

            let formGroupAdjuntos = $("<div></div>").addClass("form-group");
            let divFileInput = $("<div></div>").addClass("file-loading");
            let fileInput = $("<input>");
            fileInput.attr("id", "inputArchivosRespuestaCorreo_" + data.id_archivo);
            fileInput.attr("name", "adjuntos[]");
            fileInput.attr("type", "file");
            fileInput.attr("multiple", "true");
            divFileInput.append(fileInput);
            formGroupAdjuntos.append(divFileInput);
            divEnviarMensaje.append(formGroupAdjuntos);

            let divBotonera = $("<div></div>").addClass("w-100 mt-2");
            let buttonCancelarResponde = $("<button></button>").addClass("btn btn-dark mr-3");
            buttonCancelarResponde.text("Cancelar");
            divBotonera.append(buttonCancelarResponde);
            let buttonGuardarRespuesta = $("<button></button>").addClass("btn btn-danger");
            buttonGuardarRespuesta.text("Responder");
            divBotonera.append(buttonGuardarRespuesta);
            divEnviarMensaje.append(divBotonera);

            divPadre.append(divEnviarMensaje);

            ocultaLoaderArchivo();

            fileInput.fileinput({
                theme: 'fa',
                language: 'es',
                maxFileCount: 5,
                validateInitialCount: true,
                overwriteInitial: false
            });

            textareaContenido.summernote();
            $(".detalleArchivo .note-editing-area").css("height", "150px");

            buttonResponder.click(() => {

                divBotonResponde.slideUp("fast", () => {
                    divEnviarMensaje.slideDown("fast");
                });

            });

            buttonCancelarResponde.click(() => {

                divEnviarMensaje.slideUp("fast", () => {

                    fileInput.fileinput('clear');
                    textareaContenido.summernote('code', '');

                    divBotonResponde.slideDown("fast");
                });

            });

            buttonGuardarRespuesta.click(() => {

                let filesRespuesta = document.getElementById("inputArchivosRespuestaCorreo_" + data.id_archivo).files;
                let cantidadFilesRespuesta = filesRespuesta.length;
                if (textareaContenido.summernote('code') === "" && cantidadFilesRespuesta === 0)
                    return false;

                muestraLoaderArchivo();

                let arregloBanderasRespuesta = [];
                let cadenaArchivosRespuesta = '';

                let registraArchivosDBRespuesta = () => {

                    if (cadenaArchivosRespuesta !== "") {
                        cadenaArchivosRespuesta = cadenaArchivosRespuesta.slice(0, -1);
                    } else {
                        cadenaArchivosRespuesta = "N/A";
                    }

                    let dataNuevaRespuesta = {
                        "id_archivo": data.id_archivo,
                        "id360": perfil.id360,
                        "cuerpo_conversacion": textareaContenido.summernote('code'),
                        "archivos_conversacion": cadenaArchivosRespuesta,
                        "fecha": getFecha(),
                        "hora": getHora(),
                        "agrupador": data.agrupador
                    };

                    RequestPOST("/API/empresas360/guardar_archivo_empresas_respuesta", dataNuevaRespuesta).then((response) => {

                        if (response.success) {
                            console.log("Respuesta registrada, se debe enviar por socket");
                        }

                        ocultaLoaderArchivo();
                        buttonCancelarResponde.click();

                    });

                };

                let addFileRespuesta = () => {

                    let bucketName = "proyecto-backend";
                    let bucketRegion = "us-east-1";
                    let IdentityPoolId = "us-east-1:715df460-b915-49bc-81a9-501b8e9177b6";

                    AWS.config.update({
                        region: bucketRegion,
                        credentials: new AWS.CognitoIdentityCredentials({
                            IdentityPoolId: IdentityPoolId
                        })
                    });

                    let s3 = new AWS.S3({
                        apiVersion: "2006-03-01",
                        params: {Bucket: bucketName}
                    });

                    arregloBanderasRespuesta = [];
                    cadenaArchivosRespuesta = '';

                    for (let x = 0; x < cantidadFilesRespuesta; x++) {

                        arregloBanderasRespuesta[x] = false;
                        let file = filesRespuesta[x];
                        let file_name = file.name;
                        let file_storage_key = encodeURIComponent("Prueba") + "/";
                        let file_key = file_storage_key + file_name;
                        let upload = new AWS.S3.ManagedUpload({
                            partSize: 5 * 1024 * 1024, // 5 MB
                            params: {
                                Bucket: bucketName,
                                Key: file_key,
                                Body: file
                            }
                        });

                        let promise = upload.on('httpUploadProgress', function (evt) {

                            console.log("Cargando :: " + parseInt((evt.loaded * 100) / evt.total) + '%');

                        }).promise();

                        promise.then((data) => {

                            arregloBanderasRespuesta[x] = true;
                            cadenaArchivosRespuesta += data.Location + ",";

                        }, (error) => {
                            console.log("error", error);
                        });

                    }

                    var esperaCargaRespuesta = setInterval(function () {
                        let yaAcabo = true;
                        let cantidadArchivos = arregloBanderasRespuesta.length;
                        for (let x = 0; x < cantidadArchivos; x++) {
                            if (!arregloBanderasRespuesta[x]) {
                                yaAcabo = false;
                                break;
                            }
                        }

                        if (yaAcabo) {

                            registraArchivosDBRespuesta();

                            clearInterval(esperaCargaRespuesta);
                        }

                    }, 500);

                };

                if (cantidadFilesRespuesta > 0) {
                    addFileRespuesta();
                } else {
                    registraArchivosDBRespuesta();
                }

            });

        });

        contenedorDetalleArchivo.append(divPadre);

    });

    if (resaltar) {
        let resaltar = setInterval(() => {
            div.toggleClass("correoNuevo");
        }, 250);

        setTimeout(() => {
            clearInterval(resaltar);
            div.removeClass("correoNuevo");
        }, 2000);
    }

};

/* METODO PARA HACER UNA CARGA DE ARCHIVOS MEDIANTE FILTROS */
cargarArchivosCorreo = () => {

    muestraLoaderArchivo();

    const contenedorArchivos = $("#archivosVistaCorreo .listadoArchivosVistaCorreo");
    const contenedorDetalleArchivo = $("#archivosVistaCorreo .detalleArchivo");

    let dataSolicitaArchivos = {
        "id360": sesion_cookie.idUsuario_Sys,
        "sinFiltros": "true"
    };

    let proyecto = $("input[name=proyectoSeleccionado]:checked").val();
    if (proyecto !== "0") {
        dataSolicitaArchivos.proyecto = proyecto;
    }
    ;

    let origen = $("input[name=origenSeleccionado]:checked").val();
    if (origen !== "0") {
        dataSolicitaArchivos.sinFiltros = "false";
        if (origen === "1") {
            dataSolicitaArchivos.to_id360 = perfil.id360;

            let remitente = remitenteArchivoVistaCorreos.val();
            if (remitente !== "0") {
                dataSolicitaArchivos.id360 = remitente;
                dataSolicitaArchivos.conversacion = true;
            }

        } else {
            dataSolicitaArchivos.id360 = perfil.id360;

            let destinatario = destinatarioArchivoVistaCorreos.val();
            if (destinatario !== "0") {
                dataSolicitaArchivos.to_id360 = destinatario;
                dataSolicitaArchivos.conversacion = true;
            }

        }
    }

    RequestPOST("/API/empresas360/consultar_archivos_empresas_filtros", dataSolicitaArchivos).then((response) => {

        contenedorArchivos.empty();

        BackupCorreos = {};

        if (response.length > 0) {
            $.each(response, (index, archivo) => {

                let respuestasNoLeidas = archivo.respuestasNoLeidas !== null ? archivo.respuestasNoLeidas.split(",") : [];

                BackupCorreos[archivo.id_archivo] = {
                    leido: parseInt(archivo.leido),
                    cantidadRespuestasNoLeidas: parseInt(archivo.cantidadRespuestasNoLeidas),
                    respuestasNoLeidas: respuestasNoLeidas
                };

                agregaItemArchivoCorreo(archivo);
            });
        } else {
            contenedorArchivos.append("<p class='sinResultados'>sin resultados</p>");
        }

        ocultaLoaderArchivo();

    });

};

const initVistaArchivos = () => {

    vuewModalReenviaArchivo = () => {

        usuariosReenviaArchivo = new Array();
        var json = directorio_usuario;
        vue = new Vue({
            components: {
                Multiselect: window.VueMultiselect.default
            },
            data: {

                value: [
                ],
                options: json


            },
            methods: {
                customLabel(option) {
                    return  option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno;
                },
                onSelect(op) {
                    usuariosReenviaArchivo.push(op.id360);
                },
                onClose() {
                    //console.info(this.value);
                },
                onRemove(op) {
                    var i = usuariosReenviaArchivo.indexOf(op.id360);
                    console.log(i);
                    usuariosReenviaArchivo.splice(i, 1);
                }

            }
        }).$mount('#usuariosReenviaArchivo');

    };

    function detalleArchivo(d) {

        let destinatarios = d[12];
        let arrayDestinatarios = destinatarios.split(",");
        let msjDestinatarios = "";

        let cantidadDestinatarios = arrayDestinatarios.length;
        $.each(arrayDestinatarios, (index, destinatario) => {

            let user = buscaEnDirectorioCompletoArchivos(destinatario);

            if (user !== undefined) {

                let nombre = "";

                if (destinatario !== perfil.id360) {
                    nombre = buscaEnDirectorioCompletoArchivos(destinatario).nombre;
                } else {
                    nombre = perfil.nombre;
                }

                if (index === 0) {
                    msjDestinatarios += nombre;
                } else if (index === (cantidadDestinatarios - 2)) {
                    msjDestinatarios += ", " + nombre;
                } else {
                    msjDestinatarios += " y con " + nombre;
                }

            }

        });

        let nombreRemitente = "";
        if (d[11] !== perfil.id360) {
            nombreRemitente = buscaEnDirectorioCompletoArchivos(d[11]).nombre;
        } else {
            nombreRemitente = perfil.nombre;
        }

        let detalle = '<table cellpadding="5" class="tablaDetalle" cellspacing="0" border="0" style="padding-left:50px; width: 100%;">' +
                '<tr>' +
                '<td>Remitente:</td>' +
                '<td>' + nombreRemitente + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="width: 15%;">Compartido con:</td>' +
                '<td style="width: 30%;">' + msjDestinatarios + '</td>' +
                '<td rowspan="5" style="width: 55%; text-align: center;">';
        detalle += '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>Proyecto:</td>' +
                '<td>' + d[3] + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>Título:</td>' +
                '<td>' + d[2] + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>Descripción:</td>' +
                '<td>' + d[10] + '</td>' +
                '</tr>' +
                '</table>';

        return detalle;
    }

    const buscaArchivosEnviado = (tituloDefault) => {

        muestraLoaderArchivo();

        let services = "/API/empresas360/consultar_archivos_empresas";
        let dataArchivos = {
            "id360": sesion_cookie.idUsuario_Sys
        };

        if (selectOrigen.val() !== "0") {

            if (selectOrigen.val() === "1") {

                if (destinatarioArchivo.val() === "0") {
                    services = "/API/empresas360/consultar_archivos_empresas_enviados_por_mi";
                } else {
                    services = "/API/empresas360/consultar_archivos_empresas_enviados_por_mi_a";
                    dataArchivos.to_id360 = destinatarioArchivo.val();
                }

            } else {

                if (remitenteArchivo.val() === "0") {
                    services = "/API/empresas360/consultar_archivos_empresas_enviados_a_mi";
                } else {
                    services = "/API/empresas360/consultar_archivos_empresas_enviados_a_mi_de";
                    dataArchivos.to_id360 = remitenteArchivo.val();
                }

            }

        }

        RequestPOST(services, dataArchivos).then((response) => {

            if (response.length > 0) {

                if (tablaArchivos !== undefined) {
                    tablaArchivos.clear();
                    tablaArchivos.destroy();
                }

                /* DESPLIEGUE DE ARCHIVOS ENCONTRADOS */
                let archivos = response;
                let arrayArchivos = [];
                $.each(archivos, (index, archivo) => {

                    let iconSeleccionar = '<input type="checkbox">';
                    let buttonCompartir = '<button class="btn btn-app"><i class="fas fa-share"></i></button>';
                    let buttonDescargar = '<a href="' + archivo.ruta_archivo + '" download="' + archivo.titulo_archivo + '" target="_blank" class="btn btn-app"><i class="fas fa-cloud-download-alt"></i></a>';

                    arrayArchivos.push([
                        iconSeleccionar,
                        "",
                        archivo.titulo_archivo,
                        archivo.nombre_proyecto,
                        archivo.fecha_envio,
                        archivo.hora_envio,
                        buttonCompartir,
                        buttonDescargar,
                        archivo.id_archivo,
                        archivo.ruta_archivo,
                        archivo.descripcion_archivo,
                        archivo.id360,
                        archivo.destinatarios,
                        archivo.agrupador
                    ]);

                });

                console.log(arrayArchivos);
                tablaArchivos = $('#tablaArchivos').DataTable({
                    "data": arrayArchivos,
                    "columns": [
                        {
                            "class": "seleccionar-archivo",
                            "orderable": false,
                            "title": "Selec."
                        },
                        {
                            "class": "details-control",
                            "orderable": false,
                            "title": "Detalle",
                            "defaultContent": ""
                        },
                        {"title": "Título"},
                        {"title": "Proyecto"},
                        {"title": "Fecha de envío"},
                        {"title": "Hora de envío"},
                        {
                            "class": "compartirArchivo",
                            "title": "Compartir",
                            "orderable": false
                        },
                        {
                            "title": "Descargar",
                            "orderable": false
                        }
                    ],
                    "order": [[1, 'asc']],
                    initComplete: function () {
                        this.api().columns([2, 3, 4]).every(function () {
                            var column = this;

                            var containerSelect = $("<div></div>");
                            containerSelect.css({
                                "width": "100%",
                                "margin": "5px 0"
                            });
                            var select = $('<select style="width: 80%; margin-left: 10%; height: 15px; margin-top: 10px; margin-bottom: 10px;" class="custom-select select2"><option value="">Todos</option></select>')
                                    .appendTo(containerSelect)
                                    .on('change', function () {
                                        var val = $.fn.dataTable.util.escapeRegex(
                                                $(this).val()
                                                );

                                        column
                                                .search(val ? '^' + val + '$' : '', true, false)
                                                .draw();


                                    });

                            containerSelect.appendTo($(column.header()));

                            containerSelect.click(function (e) {
                                e.stopPropagation();
                            });

                            column.data().unique().sort().each(function (d, j) {
                                select.append('<option value="' + d + '">' + d + '</option>');
                            });

                        });

                    },
                    "aoColumnDefs": [
                        {"bSearchable": true, "aTargets": [1]}
                    ]
                });

                $("#tablaArchivos .select2").select2();

                $('#tablaArchivos').css({
                    "width": "100%"
                });

                $('.archivo tbody').off();

                /* SELECCIONAR FILA */
                $('.archivo tbody').on('click', 'tr td.seleccionar-archivo input', function () {
                    $(this).parent().toggleClass('selected');
                });

                /* COMPARTIR ARCHIVO */
                $('.archivo tbody').on('click', 'tr td.compartirArchivo button', function () {
                    var tr = $(this).closest('tr');
                    var row = tablaArchivos.row(tr);
                    let data = row.data();

                    let contenedorReenviaArchivo = $("<div></div>");

                    let formReenviaArchivo = $("<form></form>");
                    formReenviaArchivo.attr("id", "formReenviaArchivo");
                    formReenviaArchivo.attr("autocomplete", "off");

                    let formGroupReenviaArchivo = $("<div></div>").addClass("form-group");
                    let labelUsuariosReenvia = $("<label></label>");
                    labelUsuariosReenvia.text("Reenviar a:");
                    let selectUsuariosReenvia = '<div class="col-12" id="usuariosReenviaArchivo">' +
                            '<multiselect ' +
                            'placeholder=""' +
                            'v-model="value" ' +
                            ':options="options"' +
                            'track-by="id360"' +
                            ':multiple="true"' +
                            ':taggable="false"' +
                            ':close-on-select="false"' +
                            ':custom-label="customLabel" ' +
                            ':select-label="\'Seleccionar\'" ' +
                            ':selected-Label="\'Seleccionado\'"' +
                            ':deselect-Label="\'Remover\'"' +
                            ':hide-selected="true"' +
                            '@select="onSelect"' +
                            '@Close="onClose"' +
                            '@Remove="onRemove">' +
                            '</multiselect>' +
                            '<pre class="language-json" style="display:none"><code>{{ value  }}</code></pre>' +
                            '</div>';
                    formGroupReenviaArchivo.append(labelUsuariosReenvia);
                    formGroupReenviaArchivo.append(selectUsuariosReenvia);
                    formReenviaArchivo.append(formGroupReenviaArchivo);

                    let buttonSubmitReenviaMensaje = $("<button></button>").addClass("btn btn-danger btn-block mt-4");
                    buttonSubmitReenviaMensaje.attr("type", "submit");
                    buttonSubmitReenviaMensaje.text("Reenviar mensaje");
                    formReenviaArchivo.append(buttonSubmitReenviaMensaje);

                    contenedorReenviaArchivo.append(formReenviaArchivo);

                    Swal.fire({
                        html: contenedorReenviaArchivo,
                        showCancelButton: true,
                        showConfirmButton: false,
                        cancelButtonText: 'Cancelar',
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then((result) => {
                    });

                    vuewModalReenviaArchivo();

                    $("#usuariosReenviaArchivo .multiselect__content-wrapper").css({"background-color": "#fff"});

                    $("#formReenviaArchivo").submit((e) => {

                        e.preventDefault();
                        if (usuariosReenviaArchivo.length) {

                            Swal.close();
                            muestraLoaderArchivo();

                            let rutaArchivo = data[10];
                            let partes = rutaArchivo.split(".");
                            let tipo = partes[ partes.length - 1 ];
                            tipo = tipo.toLowerCase();
                            let dataArchivo = {
                                'titulo_archivo': data[2],
                                'descripcion_archivo': data[11],
                                'ruta_archivo': rutaArchivo,
                                'tipo_archivo': tipo,
                                'proyecto': data[4],
                                'id360': sesion_cookie.idUsuario_Sys,
                                'destinatarios': usuariosReenviaArchivo,
                                "tipo_usuario": sesion_cookie.tipo_usuario,
                                'tipo_servicio': sesion_cookie.tipo_servicio,
                                'tipo_area': sesion_cookie.tipo_area,
                                "fecha": getFecha(),
                                "hora": getHora()
                            };

                            RequestPOST("/API/empresas360/guardar_archivo_empresas", dataArchivo).then((response) => {
                                console.log(response);

                                ocultaLoaderArchivo();

                                if (response.success) {
                                    usuariosReenviaArchivo = [];
                                    buscaArchivosEnviado();
                                }

                            });

                        }

                    });

                });

                /* MOSTRAR DETALLE */
                $('.archivo tbody').on('click', 'tr td.details-control', function () {
                    var tr = $(this).closest('tr');
                    var row = tablaArchivos.row(tr);
                    var idx = $.inArray(tr.attr('id'), detailRows);

                    console.log(row);
                    if (row.child.isShown()) {
                        tr.removeClass('details');
                        row.child.hide();
                        detailRows.splice(idx, 1);
                    } else {
                        tr.addClass('details');
                        row.child(detalleArchivo(row.data())).show();

                        if (idx === -1) {
                            detailRows.push(tr.attr('id'));
                        }

                        $(".tablaDetalle").parent().css({
                            "padding": "10px",
                            "background-color": "lightgray",
                            "border-radius": "20px"
                        });

                    }
                });

                if (tablaArchivos !== undefined && tituloDefault !== undefined && tituloDefault !== null && tituloDefault !== "") {
                    $("#contentArchivos input").val(tituloDefault);
                    tablaArchivos.columns(2).search(tituloDefault).draw();
                }

                $("#tablaArchivos_wrapper").css({
                    "padding-bottom": "10rem"
                });

                archivosEncontrados.removeClass("d-none");
                archivosNoEncontrados.addClass("d-none");

            } else {

                /* SIN ARCHIVOS ENCONTRADOS */
                archivosEncontrados.addClass("d-none");
                archivosNoEncontrados.removeClass("d-none");

            }

            ocultaLoaderArchivo();

            if (!creandoNuevoEnvioArchivo) {
                $("#padreArchivosVistaCorreo").slideUp("fast", () => {
                    $("#padreArchivosVistaArchivos").slideDown("fast");
                });
            }

        });

    };

    buttonBorrarArchivos.click((e) => {

        let myMenu = [{
                icon: 'fas fa-trash-alt',
                label: 'Eliminar todos los archivos',
                action: function (option, contextMenuIndex, optionIndex) {

                    confirmArchivos("¿Borrar todos los archivos?", "Borrar", "Mantener").then(response => {

                        if (response) {

                            RequestPOST("/API/empresas360/eliminar_todos_los_archivos", {"id360": sesion_cookie.idUsuario_Sys}).then((response) => {
                                if (response.success) {
                                    buscaArchivosEnviado();
                                }
                            });

                        }

                    });

                },
                submenu: null,
                disabled: false
            }, {
                icon: 'fas fa-trash-alt',
                label: 'Eliminar archivos seleccionados',
                action: function (option, contextMenuIndex, optionIndex) {

                    let cantidadFilasSeleccionadas = parseInt(tablaArchivos.rows('.selected').data().length);

                    if (cantidadFilasSeleccionadas === 0) {
                        swal.fire({"text": "Aún no selecciona ningún archivo. Da click sobre cualquiera de ellos para seleccionarlo"});
                        return false;
                    }

                    let agrupadores = [];
                    $.each(tablaArchivos.rows('.selected').data(), (index, archivo) => {

                        let agrupador = archivo[13];
                        agrupadores.push(agrupador);

                    });

                    console.log(agrupadores);
                    confirmArchivos("¿Eliminar los " + cantidadFilasSeleccionadas + " archivos seleccionados?", "Eliminar", "Mantener archivos").then((response) => {

                        if (response) {

                            RequestPOST("/API/empresas360/eliminar_archivos_seleccionados", {"agrupadores": agrupadores, "id360": sesion_cookie.idUsuario_Sys}).then((response) => {
                                if (response.success) {
                                    buscaArchivosEnviado();
                                }
                            });

                        }

                    });

                },
                submenu: null,
                disabled: false
            }];

        superCm.createMenu(myMenu, e);

    });

    refrescarArchivos.click(() => {
        buscaArchivosEnviado();
    });

    buscaArchivosEnviado();

    const selectDestinatario = $("#selectDestinatarioArchivos");
    const selectRemitente = $("#selectRemitenteArchivos");


    let optionTodosR = $("<option value='0'>Todos</option>");
    let optionTodosD = $("<option value='0'>Todos</option>");
    destinatarioArchivo.append(optionTodosR);
    remitenteArchivo.append(optionTodosD);

    $.each(directorio_usuario, (index, usuario) => {
        let optionR = $("<option></option>");
        optionR.text(usuario.nombre + " " + usuario.apellido_paterno + " " + usuario.apellido_materno);
        optionR.attr("value", usuario.id360);

        let optionD = $("<option></option>");
        optionD.text(usuario.nombre + " " + usuario.apellido_paterno + " " + usuario.apellido_materno);
        optionD.attr("value", usuario.id360);

        destinatarioArchivo.append(optionD);
        remitenteArchivo.append(optionR);

    });

    remitenteArchivo.select2();
    destinatarioArchivo.select2();

    $(".filtrosArchivos .select2").css({
        "width": "100%"
    });

    selectOrigen.change(() => {

        let opcionOrigen = parseInt(selectOrigen.val());

        banderaD = false;
        banderaR = false;

        destinatarioArchivo.val("0");
        destinatarioArchivo.trigger("change");
        remitenteArchivo.val("0");
        remitenteArchivo.trigger("change");

        switch (opcionOrigen) {
            case 0:
                selectDestinatario.addClass("d-none");
                selectRemitente.addClass("d-none");
                break;
            case 1:
                selectDestinatario.removeClass("d-none");
                selectRemitente.addClass("d-none");
                break;
            case 2:
                selectDestinatario.addClass("d-none");
                selectRemitente.removeClass("d-none");
                break;
        }

        buscaArchivosEnviado();

        banderaD = true;
        banderaR = true;

    });

    destinatarioArchivo.change(() => {
        if (banderaD) {
            buscaArchivosEnviado();
        }
    });

    remitenteArchivo.change(() => {
        if (banderaR) {
            buscaArchivosEnviado();
        }
    });

    $("#padreArchivosVistaArchivos").css("display", "block");

};

const initVistaCorreo = () => {

    let dataProyectosMios = {
        "tipo_usuario": sesion_cookie.tipo_usuario,
        "id360": sesion_cookie.idUsuario_Sys
    };

    muestraLoaderArchivo();

    RequestPOST("/API/empresas360/consultar_proyectos_mios", dataProyectosMios).then((response) => {

        $(".listadoDeProyectos .radio-proyectos").empty();

        agregaDivProyectoCorreo("0", "todosLosProyectos", "Todos los proyectos", '0', true);
        let suma = 0;

        $.each(response, (index, proyecto) => {

            suma += parseInt(proyecto.cantidadArchivos);
            agregaDivProyectoCorreo(proyecto.id_proyecto, "proyectoArchivos_" + proyecto.id_proyecto, proyecto.nombre_proyecto, proyecto.cantidadArchivos, false);

        });

        cargarArchivosCorreo();

        $("body").on("change", "input[name=proyectoSeleccionado]", () => {
            cargarArchivosCorreo();
        });

        ocultaLoaderArchivo();

        if (!creandoNuevoEnvioArchivo) {
            $("#padreArchivosVistaArchivos").slideUp("fast", () => {
                $("#padreArchivosVistaCorreo").slideDown("fast");
            });
        }

        $("input[name=proyectoSeleccionado]").first().next().find("span").text(suma);

    });

    const origenVistaCorreos = $("input[name=origenSeleccionado]");
    origenVistaCorreos.off();
    origenVistaCorreos.change(function () {

        let opcionOrigen = parseInt($("input[name=origenSeleccionado]:checked").val());

        banderaDCorreos = false;
        banderaRCorreos = false;

        destinatarioArchivoVistaCorreos.val("0");
        destinatarioArchivoVistaCorreos.trigger("change");
        remitenteArchivoVistaCorreos.val("0");
        remitenteArchivoVistaCorreos.trigger("change");

        switch (opcionOrigen) {
            case 0:
                destinatarioArchivoVistaCorreos.parent().addClass("d-none");
                remitenteArchivoVistaCorreos.parent().addClass("d-none");
                break;
            case 1:
                destinatarioArchivoVistaCorreos.parent().addClass("d-none");
                remitenteArchivoVistaCorreos.parent().removeClass("d-none");
                break;
            case 2:
                destinatarioArchivoVistaCorreos.parent().removeClass("d-none");
                remitenteArchivoVistaCorreos.parent().addClass("d-none");
                break;
        }

        banderaDCorreos = true;
        banderaRCorreos = true;

        cargarArchivosCorreo();

    });

    destinatarioArchivoVistaCorreos.change(() => {
        if (banderaDCorreos) {
            cargarArchivosCorreo();
        }
    });

    remitenteArchivoVistaCorreos.change(() => {
        if (banderaRCorreos) {
            cargarArchivosCorreo();
        }
    });

};

var init_archivo = (json) => {
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;
    let vuewModelDestinatariosArchivos;
    let destinatarios_archivos = [];

    $("body").on("click", "#menu_section_Archivo", () => {

        /*if( $("#modulo_section_8604").hasClass("d-none") ){
         
         }*/

        $("#toggle div").click();
        initVistaCorreo();
    });

    var lottieLoader_archivos = document.createElement("div");
    lottieLoader_archivos.style = "width: 200px;height: 200px;";
    lottieLoader_archivos.id = "lottie_blockpage";
    document.getElementById("loaderArchivos").appendChild(lottieLoader_archivos);

    var lottieAnimation_archivos = bodymovin.loadAnimation({
        container: lottieLoader_archivos, // ID del div
        path: "https://empresas.claro360.com/p360_v4/json/Rayas rojo.json", // Ruta fichero .json de la animación
        renderer: 'svg', // Requerido
        loop: true, // Opcional
        autoplay: true, // Opcional
//                name: "Hello World" // Opcional
    });


    $("#archivos_envio").fileinput({
        theme: 'fa',
        language: 'es',
        maxFileCount: 5,
        validateInitialCount: true,
        overwriteInitial: false
    });

    $('#descripcionArchivo').summernote();
    $(".note-editing-area").css("height", "200px");

    const buttonNuevoEnvio = $("#enviar_nuevo_archivo");
    const buttonCancelarEnvio = $("#btnCancelarEnvio");
    const buttonEnviarArchivo = $("#btnEnviarArchivo");
    const contenedorNuevoEnvio = $("#nuevo_envio_archivo");

    const contenedorVistaArchivos = $("#padreArchivosVistaArchivos");
    const contenedorVistaCorreo = $("#padreArchivosVistaCorreo");
    const formEnvioArchivo = $("#form-enviar-archivo");
    const listadoDeProyectos = $("#listado_proyectos");

    vuewModelDestinatariosArchivos = () => {

        destinatarios_archivos = new Array();
        var json = directorio_usuario;
        vueArchivos = new Vue({
            components: {
                Multiselect: window.VueMultiselect.default
            },
            data: {

                value: [
                ],
                options: json


            },
            methods: {
                customLabel(option) {
                    return  option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno;
                },
                onSelect(op) {
                    destinatarios_archivos.push(op.id360);
                },
                onClose() {
                    //console.info(this.value);
                },
                onRemove(op) {
                    var i = destinatarios_archivos.indexOf(op.id360);
                    destinatarios_archivos.splice(i, 1);
                }

            }
        }).$mount('#destinatario_archivos');

        $("#destinatario_archivos").css({
            "padding": "0",
            "border-bottom": "1px solid lightgray"
        });

        $("#destinatario_archivos .multiselect__single").css({
            "padding": "0",
            "color": "#495057"
        });

    };
    vuewModelDestinatariosArchivos();

    buttonNuevoEnvio.click(() => {

        creandoNuevoEnvioArchivo = true;
        if (contenedorNuevoEnvio.css("display") === "none") {
            formEnvioArchivo[0].reset();

            listadoDeProyectos.empty();
            let dataConsultaProyectos = {
                "tipo_usuario": tipo_usuario
            };

            RequestPOST("/API/empresas360/consultar_proyectos", dataConsultaProyectos).then((response) => {
                $.each(response, (index, proyecto) => {
                    let item = $("<option>");
                    item.attr("value", proyecto.nombre_proyecto);
                    listadoDeProyectos.append(item);
                });
            });

            if (tipoVistaArchivos === 0) {
                contenedorVistaCorreo.slideUp("fast", () => {
                    contenedorNuevoEnvio.slideDown("fast", () => {
                    });
                });
            } else {
                contenedorVistaArchivos.slideUp("fast", () => {
                    contenedorNuevoEnvio.slideDown("fast", () => {
                    });
                });
            }


        }

    });

    buttonCancelarEnvio.click(() => {
        contenedorNuevoEnvio.slideUp("fast", () => {
            if (tipoVistaArchivos === 0) {
                contenedorVistaCorreo.slideDown("fast", () => {
                });
            } else {
                contenedorVistaArchivos.slideDown("fast", () => {
                });
            }
        });
    });

    const validaCamposArchivos = () => {

        if (destinatarios_archivos.length === 0) {
            document.getElementById("labelDestinatariosArchivos").scrollIntoView();
            NotificacionToasArchivos.fire({
                title: 'Selecciona al menos un destinatario'
            });
            return false;
        }

        if ($("#list_proj").val() === "") {
            document.getElementById("labelProyectoArchivos").scrollIntoView();
            NotificacionToasArchivos.fire({
                title: 'Selecciona/Ingresa a que proyecto pertenece'
            });
            $("#list_proj").focus();
            return false;
        }

        if ($("#tituloArchivo").val() === "") {
            document.getElementById("labelTituloArchivos").scrollIntoView();
            NotificacionToasArchivos.fire({
                title: 'Ingresa el titulo de tu archivo'
            });
            $("#tituloArchivo").focus();
            return false;
        }

        if ($("#descripcionArchivo").summernote('code') === "") {
            document.getElementById("labelDescripcionArchivos").scrollIntoView();
            NotificacionToasArchivos.fire({
                title: 'Ingresa la descripción del archivo'
            });
            $("#descripcionArchivo").focus();
            return false;
        }

        /* SOLICITAR OBLIGAOTRIAMENTE UN ARCHIVO PARA EL ENVíO */
        /*if( $("#archivos_envio").fileinput('getFilesCount') === 0 ){
         document.getElementById("archivos_envio").scrollIntoView();
         NotificacionToasArchivos.fire({
         title: 'Ingresa un archivo para enviar'
         });
         return false;
         }*/

        return true;

    };

    buttonEnviarArchivo.click(() => {

        if (validaCamposArchivos()) {
            muestraLoaderArchivo();

            let arregloBanderas = [];
            let cadenaArchivos = '';

            const registraArchivosDB = () => {
                if (cadenaArchivos !== "") {
                    cadenaArchivos = cadenaArchivos.slice(0, -1);
                } else {
                    cadenaArchivos = "N/A";
                }
                let dataArchivo = {
                    'titulo_archivo': $("#tituloArchivo").val(),
                    'descripcion_archivo': $("#descripcionArchivo").summernote('code'),
                    'ruta_archivo': cadenaArchivos,
                    'proyecto': $("#list_proj").val(),
                    'id360': sesion_cookie.idUsuario_Sys,
                    'destinatarios': destinatarios_archivos,
                    "tipo_usuario": tipo_usuario,
                    'tipo_servicio': tipo_servicio,
                    'tipo_area': tipo_area,
                    'fecha': getFecha(),
                    'hora': getHora()
                };

                RequestPOST("/API/empresas360/guardar_archivo_empresas", dataArchivo).then((response) => {

                    ocultaLoaderArchivo();

                    if (response.success) {
                        formEnvioArchivo[0].reset();
                        $("#descripcionArchivo").summernote('code', '');
                        //Limpiar el input del vue
                        vueArchivos.value = null;
                        contenedorNuevoEnvio.slideUp("fast", () => {
                            creandoNuevoEnvioArchivo = false;
                            if (tipoVistaArchivos === 0) {
                                initVistaCorreo();
                            } else {
                                initVistaArchivos();
                            }
                            NotificacionToasArchivos.fire({
                                title: 'Archivo enviado'
                            });
                        });

                    }

                });
            };

            let files = document.getElementById('archivos_envio').files;
            let cantidadFiles = files.length;

            let addFile = () => {

                let bucketName = "proyecto-backend";
                let bucketRegion = "us-east-1";
                let IdentityPoolId = "us-east-1:715df460-b915-49bc-81a9-501b8e9177b6";

                AWS.config.update({
                    region: bucketRegion,
                    credentials: new AWS.CognitoIdentityCredentials({
                        IdentityPoolId: IdentityPoolId
                    })
                });

                let s3 = new AWS.S3({
                    apiVersion: "2006-03-01",
                    params: {Bucket: bucketName}
                });

                arregloBanderas = [];
                cadenaArchivos = '';

                for (let x = 0; x < cantidadFiles; x++) {

                    arregloBanderas[x] = false;
                    let file = files[x];
                    let file_name = file.name;
                    let file_storage_key = encodeURIComponent("Prueba") + "/";
                    let file_key = file_storage_key + file_name;
                    let upload = new AWS.S3.ManagedUpload({
                        partSize: 5 * 1024 * 1024, // 5 MB
                        params: {
                            Bucket: bucketName,
                            Key: file_key,
                            Body: file
                        }
                    });

                    let promise = upload.on('httpUploadProgress', function (evt) {

                        console.log("Cargando :: " + parseInt((evt.loaded * 100) / evt.total) + '%');

                    }).promise();

                    promise.then((data) => {

                        arregloBanderas[x] = true;
                        cadenaArchivos += data.Location + ",";

                    }, (error) => {
                        console.log("error", error);
                    });

                }

                var esperaCarga = setInterval(function () {
                    let yaAcabo = true;
                    let cantidadArchivos = arregloBanderas.length;
                    for (let x = 0; x < cantidadArchivos; x++) {
                        if (!arregloBanderas[x]) {
                            yaAcabo = false;
                            break;
                        }
                    }

                    if (yaAcabo) {

                        registraArchivosDB();

                        clearInterval(esperaCarga);
                    }

                }, 500);

            };

            if (cantidadFiles > 0) {
                addFile();
            } else {
                registraArchivosDB();
            }

        }

    });

    $(".archivo input[name=tVista]").change(() => {
        tipoVistaArchivos = parseInt($(".archivo input[name=tVista]:checked").val());

        if (tipoVistaArchivos === 0)
            initVistaCorreo();
        else
            initVistaArchivos();

    });

    /* LLENADO DE SELECT REMITENTES Y DESTINATARIOS CON EL DIRECTORIO GENERAL */

    let optionTodosR = $("<option value='0'>Todos</option>");
    let optionTodosD = $("<option value='0'>Todos</option>");
    destinatarioArchivoVistaCorreos.append(optionTodosR);
    remitenteArchivoVistaCorreos.append(optionTodosD);

    $.each(directorio_usuario, (index, usuario) => {
        let optionR = $("<option></option>");
        optionR.text(usuario.nombre + " " + usuario.apellido_paterno + " " + usuario.apellido_materno);
        optionR.attr("value", usuario.id360);

        let optionD = $("<option></option>");
        optionD.text(usuario.nombre + " " + usuario.apellido_paterno + " " + usuario.apellido_materno);
        optionD.attr("value", usuario.id360);

        destinatarioArchivoVistaCorreos.append(optionD);
        remitenteArchivoVistaCorreos.append(optionR);

    });

    remitenteArchivoVistaCorreos.select2();
    destinatarioArchivoVistaCorreos.select2();

    $(".archivo .select2").css({
        "width": "100%"
    });

};