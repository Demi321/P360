/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global RequestPOST, DEPENDENCIA, Vue, perfil, sesion_cookie, Swal, directorio_usuario, PathRecursos, Notification, data, dataG, connectionCount, OT, DEPENDENCIA_ALIAS, Incidente, infowindow, google, map, prefijoFolio, vue, swal, configuracionEmpleado, configuracionUsuario, moment, Promise, Directorio, superCm, swalConfirmDialog, guarda_adjunto_chat, FgEmojiPicker, objectEmojis, AWS, json, perfil_usuario */

const init_comunicacion = (json) => {

    $("#profile-nombre").text(perfil_usuario.nombre + " " + perfil_usuario.apellido_paterno + " " + perfil_usuario.apellido_materno);
    $("#profile-img").css({
        "background": "url('" + perfil_usuario.img + "')",
        "background-size": "cover",
        "background-position": "center",
        "background-repeat": "no-repeat"
    });

};

var BucketName = "lineamientos";
var bucketRegion = "us-east-1";
var IdentityPoolId = "us-east-1:a8460f87-8d3f-4452-935a-b95a4fcc83ed";
var NotificacionesActivadas = false;
var CantidadMensajesPorChat = {};
var iconGroupDefault = 'https://bucketmoviles121652-dev.s3.amazonaws.com/public/MobileCard/perfil.png';
var spinCargando = $(".spin-comunicacion");
var dataLlamada = {};
var usuariosReenviaMensaje = null;

var banderaEditando = false, banderaRespondiendo = false, banderaEditandoGrupo = false;
var idMensajeEditando = null, idMensajeRespondiendo = null;
let array_llamar = new Array();
Vue.component("multiselect", window.VueMultiselect.default);
var perfil = perfil_usuario;

var configuracionUsuario = null;
RequestPOST("/API/empresas360/configuracionUsuario", {id360: JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario}).then((response) => {
    if (response.length > 0) {
        configuracionUsuario = response[0];
    }
});

AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
    })
});

var s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: {Bucket: BucketName}
});

/* LISTENER SOCKET CON RESPECTO AL CHAT EMPRESARIAL */
//const funcionesSocket = () => {

    const menuContectualMensaje = (msj, user, type) => {

        let mensaje = msj.message;
        let iconOpciones = $("#mensaje_" + msj.id + " span.iconOpciones");
        iconOpciones.off();

        const eliminaMensaje = (tipo) => {
            //PEDIR CONFIRMACION DE ELIMINAR
            swalConfirmDialog("¿Eliminar mensaje?", "Eliminar", "Cancelar").then((response) => {
                if (response) {
                    //PROCESO DE ELIMINACION

                    let dataMensaje = {
                        "idMensaje": msj.id
                    };

                    let services;

                    if (tipo === 0) {
                        services = "/API/empresas360/eliminaMensaje";
                        dataMensaje.id360 = sesion_cookie.idUsuario_Sys;
                        dataMensaje.to_id360 = user.id360;

                        if (msj.idGroup !== undefined && msj.idGroup !== null && msj.idGroup !== "") {
                            dataMensaje.esGrupo = true;
                        }

                    } else {
                        services = "/API/empresas360/eliminaMensajeParaMi";
                        dataMensaje.idUser = sesion_cookie.idUsuario_Sys;
                    }

                    RequestPOST(services, dataMensaje).then((response) => {
                        apagaValores();
                        console.log("Se elimino el mensaje");
                        console.log("Se debe enviar por socket");
                    });

                }
            });
        };

        const responderMensaje = () => {
            let idParaResponder = msj.idGroup !== undefined && msj.idGroup !== null ? msj.idGroup : user.id360;
            let contenedorResponde = $("#filaMensajesOperaciones_" + idParaResponder);
            contenedorResponde.removeClass("d-none");
            contenedorResponde.find("span").text(mensaje);
            $("#accionMensajesOpciones_" + idParaResponder).text("Respondiendo");
            banderaRespondiendo = true;
            idMensajeRespondiendo = msj.id;
        };

        let myMenu = [{
                icon: 'fas fa-trash-alt',
                label: 'Eliminar mensaje para mi',
                action: function (option, contextMenuIndex, optionIndex) {
                    eliminaMensaje(1);
                },
                submenu: null,
                disabled: false
            }];

        if (type === "replies") {

            myMenu.push({
                icon: 'fas fa-trash',
                label: 'Eliminar mensaje para todos',
                action: function (option, contextMenuIndex, optionIndex) {
                    eliminaMensaje(0);
                },
                submenu: null,
                disabled: false
            });

            if (msj.type === "text") {

                myMenu.push({
                    icon: 'fas fa-edit',
                    label: 'Editar mensaje',
                    action: function (option, contextMenuIndex, optionIndex) {

                        let idSeguir = null;
                        if (msj.idGroup !== undefined && msj.idGroup !== null && msj.idGroup !== "") {
                            idSeguir = msj.idGroup;
                            banderaEditandoGrupo = true;
                        } else {
                            banderaEditandoGrupo = false;
                            idSeguir = user.id360;
                        }

                        let contenedorReenvia = $("#filaMensajesOperaciones_" + idSeguir);
                        contenedorReenvia.removeClass("d-none");
                        $("#accionMensajesOpciones_" + idSeguir).text("Editando");
                        $("#message_input_" + idSeguir).val(mensaje);
                        $("#message_input_" + idSeguir).select();
                        contenedorReenvia.find("span").text(mensaje);
                        $("#accionMensajesOpciones_" + idSeguir).text("Editando");
                        banderaEditando = true;
                        idMensajeEditando = msj.id;

                    },
                    submenu: null,
                    disabled: false
                });

            }

        }

        myMenu.push({
            icon: 'fas fa-share-square',
            label: 'Reenviar mensaje',
            action: function (option, contextMenuIndex, optionIndex) {
                reenviaMensaje(mensaje, msj.type);
            },
            submenu: null,
            disabled: false
        });

        myMenu.push({
            icon: 'fas fa-reply',
            label: 'Responder mensaje',
            action: function (option, contextMenuIndex, optionIndex) {
                responderMensaje();
            },
            submenu: null,
            disabled: false
        });

        if (msj.destacado === "0") {
            myMenu.push({
                icon: 'fas fa-star',
                label: 'Destacar mensaje',
                action: function (option, contextMenuIndex, optionIndex) {

                    let dataDestacar = {
                        "idUser": sesion_cookie.idUsuario_Sys,
                        "idMensaje": msj.id
                    };

                    RequestPOST("/API/empresas360/destacar_mensaje", dataDestacar).then((response) => {

                        NotificacionToas.fire({
                            title: 'Mensaje destacado'
                        });

                        $("body").click();
                        console.log("Se debio destacar");
                        console.log("Se envio por socket");
                    });

                },
                submenu: null,
                disabled: false
            });
        } else {
            myMenu.push({
                icon: 'fas fa-times',
                label: 'No destacar mensaje',
                action: function (option, contextMenuIndex, optionIndex) {

                    let dataDestacar = {
                        "idUser": sesion_cookie.idUsuario_Sys,
                        "idMensaje": msj.id
                    };

                    RequestPOST("/API/empresas360/eliminar_destacado", dataDestacar).then((response) => {

                        NotificacionToas.fire({
                            title: 'Mensaje eliminado como destacado'
                        });

                        $("body").click();
                        console.log("Se debio destacar");
                        console.log("Se envio por socket");
                    });

                },
                submenu: null,
                disabled: false
            });
        }

        iconOpciones.click((e) => {
            superCm.createMenu(myMenu, e);
        });

    };

    const cambioIconoGrupo = (mensaje) => {
        let idGrupo = mensaje.idGroup;
        let imagen = mensaje.valor;
        //imagen del listado de chats
        let fotoListadoChats = $("#profile_chat" + idGrupo).find(".img");
        fotoListadoChats.css({
            "background": "url('" + imagen + "')",
            "background-size": "cover",
            "background-position": "center",
            "background-repeat": "no-repeat"
        });
        //imagen de la parte superior
        let fotoParteSuperior = $("#contenedor_mensajes_" + idGrupo).find(".contact-profile").find(".img");
        fotoParteSuperior.css({
            "background": "url('" + imagen + "')",
            "background-size": "cover",
            "background-position": "center",
            "background-repeat": "no-repeat"
        });
        //imagen panel de descripcion
        let fotoPanelDescripcion = $("#imagenPanelDescripcion_" + idGrupo);
        fotoPanelDescripcion.attr("src", imagen);
    };

    const cambioTituloGrupo = (mensaje) => {
        let titulo = mensaje.valor;
        let idGrupo = mensaje.idGroup;
        //Titulo del listado de chats
        let tituloListadoChats = $("#profile_chat" + idGrupo).find(".name");
        tituloListadoChats.text(titulo);
        //Titulo de la parte superior
        let tituloParteSuperior = $("#contenedor_mensajes_" + idGrupo).find(".contact-profile").find("p").first();
        tituloParteSuperior.text(titulo);
        //titulo panel de descripcion
        let tituloPanelDescripcion = $("#tituloGrupoDescripcion_" + idGrupo);
        tituloPanelDescripcion.text(titulo);
    };

    const cambioDescripcionGrupo = (mensaje) => {
        console.log("Cambiar descripcion");
        let descripcion = mensaje.valor;
        let idGrupo = mensaje.idGroup;
        //descripcion panel de descripcion
        let descripcionPanelDescripcion = $("#descripcionGrupoDescripcion_" + idGrupo);
        descripcionPanelDescripcion.text(descripcion);
    };

    const cambioParametroGrupoChat = (mensaje) => {
        switch (mensaje.columna) {
            case "icono_grupo":
                cambioIconoGrupo(mensaje);
                break;
            case "nombre_grupo":
                cambioTituloGrupo(mensaje);
                break;
            case "descripcion_grupo":
                cambioDescripcionGrupo(mensaje);
                break;
        }
    };

    const eliminadoParticipanteGrupoChat = (mensaje) => {
        let idUsuarioEliminado = mensaje.id360;
        let idGrupo = mensaje.idGroup;

        $("#" + idGrupo + "_" + idUsuarioEliminado).remove();

        if (idUsuarioEliminado === sesion_cookie.idUsuario_Sys) {
            let input = $("#message_input_" + idUsuarioEliminado);
            let button = $("#btn_enviar" + idUsuarioEliminado);

            input.attr("disabled", true);
            input.attr("placeholder", "No puedes enviar mensajes en este chat");
            input.css({
                "text-align": "center",
                "font-weight": "bold",
                "text-transform": "uppercase"
            });
            button.attr("disabled", true);
        }
    };

    const nuevoMensajeDestacado = (mensaje) => {
        console.log("Nuevo mensaje destacado");

        const panelDespliegueDestacados = $("#panelMensajesDestacados");
        if (panelDespliegueDestacados.css("display") === "block") {

            let ulMensajes = $(".listadoMensajesDestacados");
            agregarItemMensajeDestacado(mensaje.data, ulMensajes, true);

        }

        mensaje.data.destacado = "1";

        let userDestacado = {};
        if (mensaje.data.id360 === sesion_cookie.idUsuario_Sys) {
            userDestacado.id360 = sesion_cookie.idUsuario_Sys;
        } else {
            userDestacado = buscaEnDirectorioCompleto(mensaje.data.id360);
        }

        let typeMessage = "send";
        if (mensaje.data.id360 === sesion_cookie.id_usuario) {
            typeMessage = "replies";
        }
        menuContectualMensaje(mensaje.data, userDestacado, typeMessage);

        const pMensaje = $("#mensaje_" + mensaje.idMensaje).find("p").first();
        console.log(pMensaje.length);
        let iconoDestacado = $("<span></span>").addClass("iconoDestacado");
        iconoDestacado.append('<i class="fas fa-star"></i>');
        pMensaje.append(iconoDestacado);
        console.log("Ya lo agregue");
    };

    const eliminarMensajeDestacado = (mensaje) => {
        const panelDespliegueDestacados = $("#panelMensajesDestacados");
        if (panelDespliegueDestacados.css("display") === "block") {

            const item = $("#itemMensajeDestacado" + mensaje.data.id);
            item.slideUp("slow", () => {
                item.remove();
            });

        }

        mensaje.data.destacado = "0";

        let userDestacado = {};
        if (mensaje.data.id360 === sesion_cookie.idUsuario_Sys) {
            userDestacado.id360 = sesion_cookie.idUsuario_Sys;
        } else {
            userDestacado = buscaEnDirectorioCompleto(mensaje.data.id360);
        }

        let typeMessage = "send";
        if (mensaje.data.id360 === sesion_cookie.id_usuario) {
            typeMessage = "replies";
        }
        menuContectualMensaje(mensaje.data, userDestacado, typeMessage);

        const pMensaje = $("#mensaje_" + mensaje.idMensaje);
        pMensaje.find(".iconoDestacado").remove();
    };

    const nuevoUsuarioFavorito = (mensaje) => {
        const contenedorFavorito = $("#iconoFavorito" + mensaje.id360Favorito);
        let icon_favorito = $("<i></i>").addClass("fas fa-star");
        ;
        icon_favorito.css({
            "background": "#fff",
            "padding": "10px",
            "font-size": "60px",
            "width": "50px",
            "cursor": "pointer",
            "color": "yellowgreen"
        });
        contenedorFavorito.empty().append(icon_favorito);

        if ($('#soloFavoritos').prop('checked')) {
            $("#profile_chat" + mensaje.id360Favorito).slideToggle();
        }

        $("#profile_chat" + mensaje.id360Favorito).removeClass("contactoNoFavorito").addClass("contactoFavorito");

        CantidadMensajesPorChat[mensaje.id360Favorito].esFavorito = true;
    };

    const eliminaUsuarioFavorito = (mensaje) => {
        const contenedorFavorito = $("#iconoFavorito" + mensaje.id360Favorito);
        let icon_favorito = $("<i></i>").addClass("far fa-star");
        ;
        icon_favorito.css({
            "background": "#fff",
            "padding": "10px",
            "font-size": "60px",
            "width": "50px",
            "cursor": "pointer",
            "color": "yellowgreen"
        });
        contenedorFavorito.empty().append(icon_favorito);

        if ($('#soloFavoritos').prop('checked')) {
            $("#profile_chat" + mensaje.id360Favorito).slideToggle();
        }

        $("#profile_chat" + mensaje.id360Favorito).addClass("contactoNoFavorito").removeClass("contactoFavorito");

        CantidadMensajesPorChat[mensaje.id360Favorito].esFavorito = false;
    };

    const nuevoGrupoChatEmpresarial = (mensaje) => {
        let participantesParaGrupo = mensaje.participantes;
        participantesParaGrupo.push(mensaje.idUser);
        let dataContac = {
            "id360": mensaje.id_grupo,
            "nombre_grupo": mensaje.nombre_grupo,
            "img": mensaje.icono_grupo,
            "descripcion_grupo": mensaje.descripcion_grupo,
            "participantes": participantesParaGrupo.toString(),
            "nombre": mensaje.nombre_grupo,
            "apellido_paterno": "",
            "apellido_materno": ""
        };
        directorio_usuario.push(dataContac);
        contacto_chat(dataContac, true);
        NotificacionToas.fire({
            title: 'Bienvenido al grupo ' + mensaje.nombre_grupo
        });
    };

    const nuevoMensajeChatEmpresarial = (mensaje) => {
        if (mensaje.chat_empresarial_mio) {
            agregar_chat_enviado(mensaje, false);
        } else {
            if ((mensaje.idGroup !== undefined && mensaje.idGroup !== null) && mensaje.id360 === sesion_cookie.idUsuario_Sys) {
                agregar_chat_enviado(mensaje, false);
            }
            if (mensaje.id360 === undefined || mensaje.id360 === null) {
                despliegaMensajeSistema(mensaje.message, mensaje.to_id360, mensaje.date_created, mensaje.time_created, false);
            } else {
                let group = mensaje.idGroup !== undefined && mensaje.idGroup !== null ? true : false;
                recibir_chat(mensaje, false, group, true);
            }
        }
    };

    const nuevoParticipanteGrupoChat = (mensaje) => {
        let idGrupo = mensaje.idGrupo;

        console.log(mensaje.participantes);
        let participantesGrupos = mensaje.participantes;
        let ulParticipantes = $("#listadoParticipantesGrupo_" + idGrupo);
        $.each(participantesGrupos, (index, participante) => {

            let id360Participante = participante;

            let userGrupo = null;
            if (id360Participante === sesion_cookie.idUsuario_Sys) {
                userGrupo = {
                    img: perfil.img,
                    id360: sesion_cookie.idUsuario_Sys,
                    apellido_paterno: sesion_cookie.apellido_p,
                    apellido_materno: sesion_cookie.apellido_m,
                    nombre: sesion_cookie.nombre
                };

                let input = $("#message_input_" + idGrupo);

                let button = $("#btn_enviar" + idGrupo);

                input.removeAttr("disabled");
                input.attr("placeholder", "Escribe un mensaje aqui....");
                input.css({
                    "text-align": "left",
                    "font-weight": "normal",
                    "text-transform": "none"
                });
                button.removeAttr("disabled");

            } else {
                userGrupo = buscaEnDirectorioCompleto(id360Participante);
            }

            if (userGrupo !== undefined) {
                let liParticipante = $("<li></li>");
                liParticipante.attr("id", idGrupo + "_" + id360Participante);
                liParticipante.css({
                    "text-align": "left",
                    "color": "#32465a",
                    "font-size": "1.4rem",
                    "cursor": "pointer",
                    "padding": "15px 0 15px 20px"
                });
                let imgParticipante = $("<img>");
                imgParticipante.attr("src", userGrupo.img);
                imgParticipante.css({
                    "width": "30px",
                    "height": "30px",
                    "border-radius": "50%"
                });
                let spanParticipante = $("<span></span>").addClass("ml-2");
                spanParticipante.text(userGrupo.nombre + " " + userGrupo.apellido_paterno + " " + userGrupo.apellido_materno);

                liParticipante.append(imgParticipante);
                liParticipante.append(spanParticipante);

                ulParticipantes.append(liParticipante);

                liParticipante.mouseenter(() => {
                    liParticipante.css({"background-color": "rgba(0, 0, 0, 0.1)"});
                }).mouseleave(() => {
                    liParticipante.css({"background-color": "transparent"});
                });

                if (userGrupo.id360 !== sesion_cookie.idUsuario_Sys) {
                    liParticipante.click(() => {
                        $("#profile_chat" + userGrupo.id360).click();
                    });
                }

                if (userGrupo.id360 !== sesion_cookie.idUsuario_Sys) {

                    liParticipante.on('contextmenu', function (e) {
                        e.preventDefault();

                        var myMenu = [{
                                icon: 'fa fa-trash',
                                label: 'Eliminar participante',
                                action: function (option, contextMenuIndex, optionIndex) {
                                    eliminaParticipanteGrupo(id360Participante, idGrupo);
                                },
                                submenu: null,
                                disabled: false
                            }];

                        let opcionHacerAdmin = {
                            icon: 'fas fa-user-shield',
                            label: 'Designar como administrador',
                            action: function (option, contextMenuIndex, optionIndex) {
                                hacerAdministrador(id360Participante, idGrupo);
                            },
                            submenu: null,
                            disabled: false
                        };
                        myMenu.push(opcionHacerAdmin);

                        superCm.createMenu(myMenu, e);
                    });
                } else {
                    liParticipante.on('contextmenu', function (e) {
                        e.preventDefault();

                        var myMenu = [{
                                label: '(vacío)',
                                submenu: null,
                                disabled: true
                            }];

                        superCm.createMenu(myMenu, e);
                    });
                }

            }
        });
    };

    const edicionMensajeChatEmpresarial = (mensaje) => {
        const li = $("#mensaje_" + mensaje.idMensaje);
        let pMensaje = $("#mensaje_" + mensaje.idMensaje).find("p");
        pMensaje.empty();

        pMensaje.html(verificaLinks(mensaje.mensaje_editado));
        pMensaje.css({
            "word-break": "break-all"
        });

        let fechaDespliega = moment().format("DD-MMM-YY hh:mm A");

        let fecha = $("<span></span>").addClass("time");
        fecha.text(fechaDespliega);
        let iconClock = $("<li></li>").addClass("far fa-clock");
        let spanEdit = $("<span></span>");
        let iconEdit = $("<li></li>").addClass("fas fa-edit");
        spanEdit.append(iconEdit);
        iconEdit.attr("id", "historial_ediciones_" + mensaje.idMensaje);

        //ICONO MENU DE OPCION PARA EL MENSAJE

        console.log("Agregar el menu");
        let iconOpciones = $("<span></span>").addClass("iconOpciones");
        let iconDespliegaMenu = $('<i class="fas fa-chevron-down"></i>');
        iconOpciones.append(iconDespliegaMenu);
        pMensaje.append(iconOpciones);

        const eliminaMensaje = (tipo) => {
            //PEDIR CONFIRMACION DE ELIMINAR
            swalConfirmDialog("¿Eliminar mensaje?", "Eliminar", "Cancelar").then((response) => {
                if (response) {
                    //PROCESO DE ELIMINACION

                    let dataMensaje = {
                        "idMensaje": mensaje.idMensaje
                    };

                    let services;

                    if (tipo === 0) {
                        services = "/API/empresas360/eliminaMensaje";
                        dataMensaje.id360 = sesion_cookie.idUsuario_Sys;
                        dataMensaje.to_id360 = mensaje.to_id360;

                        if (mensaje.nuevo.idGroup !== undefined && mensaje.nuevo.idGroup !== null && mensaje.nuevo.idGroup !== "") {
                            dataMensaje.esGrupo = true;
                        }

                    } else {
                        services = "/API/empresas360/eliminaMensajeParaMi";
                        dataMensaje.idUser = sesion_cookie.idUsuario_Sys;
                    }

                    RequestPOST(services, dataMensaje).then((response) => {
                        apagaValores();
                        console.log("Se elimino el mensaje");
                        console.log("Se debe enviar por socket");
                    });

                }
            });
        };

        const responderMensaje = () => {
            let idParaResponder = mensaje.nuevo.idGroup !== undefined && mensaje.nuevo.idGroup !== null ? mensaje.nuevo.idGroup : mensaje.to_id360;
            let contenedorResponde = $("#filaMensajesOperaciones_" + idParaResponder);
            contenedorResponde.removeClass("d-none");
            contenedorResponde.find("span").text(mensaje.mensaje_editado);
            $("#accionMensajesOpciones_" + idParaResponder).text("Respondiendo");
            banderaRespondiendo = true;
            idMensajeRespondiendo = mensaje.idMensaje;
        };

        console.log("Menu context");
        let myMenu = [{
                icon: 'fas fa-trash-alt',
                label: 'Eliminar mensaje para mi',
                action: function (option, contextMenuIndex, optionIndex) {
                    eliminaMensaje(1);
                },
                submenu: null,
                disabled: false
            }];

        console.log("Eliminar para todos");
        myMenu.push({
            icon: 'fas fa-trash',
            label: 'Eliminar mensaje para todos',
            action: function (option, contextMenuIndex, optionIndex) {
                eliminaMensaje(0);
            },
            submenu: null,
            disabled: false
        });

        console.log("Editar");
        if (mensaje.nuevo.type === "text") {

            myMenu.push({
                icon: 'fas fa-edit',
                label: 'Editar mensaje',
                action: function (option, contextMenuIndex, optionIndex) {

                    let idSeguir = null;
                    if (mensaje.nuevo.idGroup !== undefined && mensaje.nuevo.idGroup !== null && mensaje.nuevo.idGroup !== "") {
                        idSeguir = mensaje.nuevo.idGroup;
                        banderaEditandoGrupo = true;
                    } else {
                        banderaEditandoGrupo = false;
                        idSeguir = mensaje.nuevo.to_id360;
                    }

                    let contenedorReenvia = $("#filaMensajesOperaciones_" + idSeguir);
                    contenedorReenvia.removeClass("d-none");
                    $("#accionMensajesOpciones_" + idSeguir).text("Editando");
                    $("#message_input_" + idSeguir).val(mensaje.mensaje_editado);
                    $("#message_input_" + idSeguir).select();
                    contenedorReenvia.find("span").text(mensaje.mensaje_editado);
                    $("#accionMensajesOpciones_" + idSeguir).text("Editando");
                    banderaEditando = true;
                    idMensajeEditando = mensaje.idMensaje;

                },
                submenu: null,
                disabled: false
            });

        }

        console.log("Reenviar");
        myMenu.push({
            icon: 'fas fa-share-square',
            label: 'Reenviar mensaje',
            action: function (option, contextMenuIndex, optionIndex) {
                reenviaMensaje(mensaje.mensaje_editado, mensaje.nuevo.type);
            },
            submenu: null,
            disabled: false
        });

        console.log("Responder");
        myMenu.push({
            icon: 'fas fa-reply',
            label: 'Responder mensaje',
            action: function (option, contextMenuIndex, optionIndex) {
                responderMensaje();
            },
            submenu: null,
            disabled: false
        });

        console.log("Destacar o no destacar");
        if (mensaje.nuevo.destacado === "0") {
            myMenu.push({
                icon: 'fas fa-star',
                label: 'Destacar mensaje',
                action: function (option, contextMenuIndex, optionIndex) {

                    let dataDestacar = {
                        "idUser": sesion_cookie.idUsuario_Sys,
                        "idMensaje": mensaje.nuevo.id
                    };

                    RequestPOST("/API/empresas360/destacar_mensaje", dataDestacar).then((response) => {

                        NotificacionToas.fire({
                            title: 'Mensaje destacado'
                        });

                        $("body").click();
                        console.log("Se debio destacar");
                        console.log("Se envio por socket");
                    });

                },
                submenu: null,
                disabled: false
            });
        } else {
            myMenu.push({
                icon: 'fas fa-times',
                label: 'No destacar mensaje',
                action: function (option, contextMenuIndex, optionIndex) {

                    let dataDestacar = {
                        "idUser": sesion_cookie.idUsuario_Sys,
                        "idMensaje": mensaje.nuevo.id
                    };

                    RequestPOST("/API/empresas360/eliminar_destacado", dataDestacar).then((response) => {

                        NotificacionToas.fire({
                            title: 'Mensaje eliminado como destacado'
                        });

                        $("body").click();
                        console.log("Se debio destacar");
                        console.log("Se envio por socket");
                    });

                },
                submenu: null,
                disabled: false
            });
        }

        console.log("Crear el menu");
        iconOpciones.click((e) => {
            console.log("Creando menu");
            superCm.createMenu(myMenu, e);
        });

        li.dblclick(() => {
            responderMensaje();
        });

        console.log("Aparecer y desparecer icono de menu");
        pMensaje.mouseenter(() => {
            console.log("Aparecer");
            iconOpciones.css({"display": "block"});
        }).mouseleave(() => {
            console.log("Desaparecer");
            iconOpciones.css({"display": "none"});
        });

        if (mensaje.nuevo.idResponse !== null && mensaje.nuevo.idResponse !== undefined) {
            let mensajeRespuesta = mensaje.nuevo.mensajeRespuesta === undefined ? mensaje.mensajeRespondido.message : mensaje.nuevo.mensajeRespuesta;
            let smallRespuesta = $("<small></small>").addClass("respuesta-mensaje");
            smallRespuesta.text(mensajeRespuesta);
            message.prepend(smallRespuesta);

            smallRespuesta.click(() => {

                const remarcaMensaje = (idMensaje) => {
                    document.querySelector("#mensaje_" + idMensaje).scrollIntoView();
                    let resaltar = setInterval(() => {
                        $("#mensaje_" + idMensaje).toggleClass("respondida");
                    }, 250);

                    setTimeout(() => {
                        clearInterval(resaltar);
                        $("#mensaje_" + idMensaje).removeClass("respondida");
                    }, 2000);
                };

                if ($("#mensaje_" + mensaje.nuevo.idResponse).length) {

                    remarcaMensaje(mensaje.nuevo.idResponse);

                } else {

                    const buscaMensajeRespuesta = () => {
                        if ($("#contact_messaging" + mensaje.to_id360).find(".liMasMensajes").length) {
                            let esGrupo = mensaje.idGroup !== undefined && mensaje.idGroup !== null ? true : false;
                            cargaMasMensajes(mensaje.to_id360, esGrupo).then((response) => {
                                if ($("#mensaje_" + mensaje.nuevo.idResponse).length) {
                                    remarcaMensaje(mensaje.nuevo.idResponse);
                                } else if (response) {
                                    buscaMensajeRespuesta();
                                } else {
                                    NotificacionToas.fire({
                                        title: 'No se ha encontrado el mensaje'
                                    });
                                }

                            });
                        } else {
                            NotificacionToas.fire({
                                title: 'No se ha encontrado el mensaje'
                            });
                        }
                    };

                    buscaMensajeRespuesta();

                }

            });

            apagaValores();

        }

        spanEdit.click(() => {
            mensajeViejo(mensaje.nuevo.oldMessage, mensaje.mensaje_editado);
        });

        apagaValores();
    };

    const eliminacionMensajeChatEmpresarial = (mensaje) => {
        let liMensaje = $("#mensaje_" + mensaje.idMensaje);
        let pMensaje = liMensaje.find('p');
        pMensaje.empty();
        pMensaje.text("Mensaje eliminado");
        let iconMensajeEliminado = $("<i></i>").addClass("fas fa-comment-slash");

        if (mensaje.eliminacion_mensaje_chat_empresarial_mio) {
            iconMensajeEliminado.css({"margin-right": "10px"});
            pMensaje.prepend(iconMensajeEliminado);
        } else {
            iconMensajeEliminado.css({"margin-left": "10px"});
            pMensaje.append(iconMensajeEliminado);
        }
        pMensaje.css({
            "background-color": "transparent",
            "font-style": "italic",
            "font-size": "1.1rem",
            "color": "#434343"
        });
    };

    const eliminacionMensajeChatEmpresarialMio = (mensaje) => {
        let liMensaje = $("#mensaje_" + mensaje.idMensaje);
        liMensaje.remove();
    };

//};

//funcionesSocket();

const ocultaSpin = () => {
    spinCargando.addClass("d-none");
};

const muestraSpin = () => {
    spinCargando.removeClass("d-none");
};

const NotificacionToas = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

const buscaEnDirectorioCompleto = (id360) => {
    let user;
    $.each(directorio_usuario, (i) => {
        if (id360 === directorio_usuario[i].id360) {
            user = directorio_usuario[i];
            return false;
        }
    });
    return user;
};

/*FILTRAR SOLO FAVORITOS */
$("#soloFavoritos").change(() => {
    if ($('#soloFavoritos').prop('checked')) {

        $(".contactoNoFavorito").slideToggle();

        $("#filtrarFavoritos label").css({
            "background": "darkcyan"
        });
    } else {

        $(".contactoNoFavorito").slideToggle();

        $("#filtrarFavoritos label").css({
            "background": "transparent"
        });
    }
});

/*
 * REPRODUCIR SONIDO AL LLEGAR NOTIFICACION
 */
var buttonNotificacionMensaje = $("<button></button>").addClass("d-none");
buttonNotificacionMensaje.text("Reproducir notificacion m");

var buttonNotificacionLlamada = $("<button></button>").addClass("d-none");
buttonNotificacionLlamada.text("Reproducir notificacion l");

$("body").append(buttonNotificacionMensaje);
$("body").append(buttonNotificacionLlamada);

var reproduccionSonidoNotificacion = document.getElementById('sonido1');

const reproduceNotificacion = (tipo) => {

    if (configuracionUsuario !== null && configuracionUsuario[tipo] !== undefined) {

        let tonoUsuario = configuracionUsuario[tipo];

        if (tonoUsuario !== "silenciado") {
            reproduccionSonidoNotificacion = document.getElementById(tonoUsuario);

            reproduccionSonidoNotificacion.muted = true;
            reproduccionSonidoNotificacion.muted = false;
            if (tipo === "tono_llamada") {
                reproduccionSonidoNotificacion.loop = true;
            }
            reproduccionSonidoNotificacion.play();
        }

    } else {
        reproduccionSonidoNotificacion = document.getElementById('sonido1');
        reproduccionSonidoNotificacion.muted = true;
        reproduccionSonidoNotificacion.muted = false;
        if (tipo === "tono_llamada") {
            reproduccionSonidoNotificacion.loop = true;
        }
        reproduccionSonidoNotificacion.play();
    }

};

buttonNotificacionMensaje.click(() => {

    reproduceNotificacion("tono_mensaje");

});

buttonNotificacionLlamada.click(() => {

    reproduceNotificacion("tono_llamada");

});

let buttonConfiguracion = $("#settings");

let arrayTonos = ['sonido1', 'sonido2', 'sonido3', 'sonido4', 'sonido5', 'sonido6', 'sonido7', 'sonido8', 'sonido9', 'sonido10'];

let contenedorConfig = $("<div></div>");

let formGroupTonoMensaje = $("<div></div>").addClass("form-group mb-4");
let labelTonoMensaje = $("<label></label>");
labelTonoMensaje.text("Tono para mensajes");
let selectTonoMensaje = $("<select></select>").addClass("form-control custom-select");
selectTonoMensaje.attr("id", "seleccionarTonoMensaje");
selectTonoMensaje.attr("onchange", "escuchaSonido(this.value)");
formGroupTonoMensaje.append(labelTonoMensaje);
formGroupTonoMensaje.append(selectTonoMensaje);

let formGroupTonoLlamada = $("<div></div>").addClass("form-group");
let labelTonoLlamada = $("<label></label>");
labelTonoLlamada.text("Tono para llamadas");
let selectTonoLlamada = $("<select></select>").addClass("form-control custom-select");
selectTonoLlamada.attr("id", "seleccionarTonoLLamada");
selectTonoLlamada.attr("onchange", "escuchaSonido(this.value)");
formGroupTonoLlamada.append(labelTonoLlamada);
formGroupTonoLlamada.append(selectTonoLlamada);

$.each(arrayTonos, (index, tono) => {
    let option = $("<option></option>");
    option.attr("value", tono);
    option.text("Tono " + (index + 1));
    selectTonoMensaje.append(option);
});

$.each(arrayTonos, (index, tono) => {
    let option = $("<option></option>");
    option.attr("value", tono);
    option.text("Tono " + (index + 1));
    selectTonoLlamada.append(option);
});

selectTonoMensaje.prepend("<option value='silenciado'>Silenciar</option>");
selectTonoLlamada.prepend("<option value='silenciado'>Silenciar</option>");

contenedorConfig.append(formGroupTonoMensaje);
contenedorConfig.append(formGroupTonoLlamada);

const escuchaSonido = (sonido) => {
    if (sonido !== "silenciado") {
        let sonidoPreview = document.getElementById(sonido);
        sonidoPreview.muted = true;
        sonidoPreview.muted = false;
        sonidoPreview.play();
    }
};

buttonConfiguracion.click(() => {

    Swal.fire({
        html: contenedorConfig,
        showCancelButton: true,
        confirmButtonText: 'Aplicar cambios!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) {

            let data = {
                "id360": sesion_cookie.idUsuario_Sys,
                "tono_mensaje": $("#seleccionarTonoMensaje").val(),
                "tono_llamada": $("#seleccionarTonoLLamada").val(),
                "fecha": getFecha(),
                "hora": getHora()
            };

            RequestPOST("/API/empresas360/cambiaConfiguracionUsuario", data).then((response) => {

                configuracionUsuario = {};
                configuracionUsuario.id360 = sesion_cookie.idUsuario_Sys;
                configuracionUsuario.tono_mensaje = $("#seleccionarTonoMensaje").val();
                configuracionUsuario.tono_llamada = $("#seleccionarTonoLLamada").val();

                swal.fire({text: 'Se ha guardado tu configuracion exitosamente'});

            });

        }
    });

});

var participantesParaGrupo = null;
vuewModalParticipantesGrupo = (id_componente, participantes) => {

    participantesParaGrupo = new Array();
    var json = directorio_usuario;

    //quitar los participantes del grupo para el select
    if (participantes !== undefined && participantes !== null) {

        json = [];
        $.each(directorio_usuario, (index, user) => {
            if (participantes.indexOf(user.id360) === -1) {
                json.push(user);
            }
        });

    }

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
                participantesParaGrupo.push(op.id360);
            },
            onClose() {
                //console.info(this.value);
            },
            onRemove(op) {
                var i = participantesParaGrupo.indexOf(op.id360);
                participantesParaGrupo.splice(i, 1);
            }

        }
    }).$mount('#' + id_componente);

};

/*
 * FIN REPRODUCCION DE SONIDOS
 */

/*
 * BOTON CREACION DE GRUPOS
 */
let contenedorAgregarGrupo = $("<div></div>");

let formCreaGrupo = $("<form></form>");
formCreaGrupo.attr("id", "formCreaGrupo");
formCreaGrupo.attr("autocomplete", "off");

let formGroupNombreGrupo = $("<div></div>").addClass("form-group");
let labelNombreGrupo = $("<label></label>");
labelNombreGrupo.text("Título del grupo");
labelNombreGrupo.attr("for", "inputNombreGrupo");
let inputNombreGrupo = $("<input>").addClass("form-control");
inputNombreGrupo.attr("id", "inputNombreGrupo");
inputNombreGrupo.attr("type", "text");
inputNombreGrupo.attr("required", "true");
formGroupNombreGrupo.append(labelNombreGrupo);
formGroupNombreGrupo.append(inputNombreGrupo);
formCreaGrupo.append(formGroupNombreGrupo);

let formGroupDescripcionGrupo = $("<div></div>").addClass("form-group");
let labelDescripcionGrupo = $("<label></label>");
labelDescripcionGrupo.text("Descripción breve");
labelDescripcionGrupo.attr("for", "inputDescripcionGrupo");
let inputDescripcionGrupo = $("<input>").addClass("form-control");
inputDescripcionGrupo.attr("id", "inputDescripcionGrupo");
inputDescripcionGrupo.attr("type", "text");
inputDescripcionGrupo.attr("required", "true");
formGroupDescripcionGrupo.append(labelDescripcionGrupo);
formGroupDescripcionGrupo.append(inputDescripcionGrupo);
formCreaGrupo.append(formGroupDescripcionGrupo);

let formGroupParticipantesGrupo = $("<div></div>").addClass("form-group");
let labelParticipantesGrupo = $("<label></label>");
labelParticipantesGrupo.text("Participantes");
let selectParticipantesGrupo = '<div class="col-12" id="agregaParticipantesGrupo">' +
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
formGroupParticipantesGrupo.append(labelParticipantesGrupo);
formGroupParticipantesGrupo.append(selectParticipantesGrupo);
formCreaGrupo.append(formGroupParticipantesGrupo);

let buttonSubmitCreaGrupo = $("<button></button>").addClass("btn btn-danger btn-block mt-4");
buttonSubmitCreaGrupo.attr("type", "submit");
buttonSubmitCreaGrupo.text("Crear Grupo");
formCreaGrupo.append(buttonSubmitCreaGrupo);

contenedorAgregarGrupo.append(formCreaGrupo);

const mensajeSistema = (mensaje, id, esGrupo) => {

    let input = $("<input>");
    input.val(mensaje);

    let ulJS = document.getElementById("contact_messaging" + id);
    let ul = $(ulJS);

    let previewJS = document.getElementById("preview_" + id);
    let preview = $(previewJS);

    let messagesJS = document.getElementById("messages_" + id);
    let messages = $(messagesJS);

    let user = {"id360": id, "mensajeSistema": true};

    if (esGrupo) {
        user.idGroup = id;
    }
    ;

    let rutaAdjunto = null;

    console.log("A enviar mensaje del sistema");
    send_chat_messages(input, ul, preview, user, messages, rutaAdjunto);

};

const despliegaMensajeSistema = (mensaje, idChat, fecha, hora, viejo) => {

    if ($("#contact_messaging" + idChat).length) {
        let li = $("<li></li>").addClass("mensajeSistema");
        li.text(mensaje + " - ");
        if (fecha !== undefined && hora !== undefined) {
            let smallFecha = $("<small></small>");
            let fechaMoment = moment(fecha + " " + hora);
            smallFecha.text(fechaMoment.format("DD/MMM/YY hh:mm A"));
            li.append(smallFecha);
        }
        if (viejo)
            $("#contact_messaging" + idChat).prepend(li);
        else {
            $("#contact_messaging" + idChat).append(li);
            $("#preview_" + idChat).text(mensaje);
        }
    }

};

const nuevoMensaje = () => {
    console.log("Nuevo mensaje");
};

const nuevoGrupo = () => {

    Swal.fire({
        html: contenedorAgregarGrupo,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        allowEscapeKey: false
    });

    vuewModalParticipantesGrupo("agregaParticipantesGrupo");

    $("#agregaParticipantesGrupo .multiselect__content-wrapper").css({"background-color": "#fff"});

    $("#formCreaGrupo").submit((e) => {

        e.preventDefault();
        let nombreGrupo = $("#inputNombreGrupo").val().trim();
        let descripcionGrupo = $("#inputDescripcionGrupo").val().trim();

        if (participantesParaGrupo.length) {

            let dataGrupo = {
                "idUser": sesion_cookie.idUsuario_Sys,
                "nombre_grupo": nombreGrupo,
                "icono_grupo": iconGroupDefault,
                "descripcion_grupo": descripcionGrupo,
                "fecha": getFecha(),
                "hora": getHora(),
                "participantes": participantesParaGrupo
            };

            muestraSpin();
            RequestPOST("/API/empresas360/crear_grupo", dataGrupo).then((response) => {

                if (response.success) {

                    let idGrupo = response.id_grupo;

                    Swal.close();
                    participantesParaGrupo.push(sesion_cookie.idUsuario_Sys);

                    let dataContac = {
                        "id360": idGrupo,
                        "nombre_grupo": nombreGrupo,
                        "img": iconGroupDefault,
                        "descripcion_grupo": descripcionGrupo,
                        "participantes": participantesParaGrupo.toString()
                    };

                    contacto_chat(dataContac, true);
                    $("#profile_chat" + idGrupo).click();

                    let mensajeBienvenida = sesion_cookie.nombre + " " + sesion_cookie.apellidos + " ha creado este grupo";
                    console.log("Mensaje de Bienvenida");
                    console.log("Id del grupo: " + idGrupo);
                    console.log(mensajeBienvenida);
                    mensajeSistema(mensajeBienvenida, idGrupo, true);

                    ocultaSpin();
                    swal.fire({text: "Invitación enviada a los participantes"});
                }

            });

        } else {



        }

    });

};
/*
 * FIN CREACION DE GRUPO
 */

$("#nuevaConversacion").on('click', function (e) {

    var myMenu = [{
            icon: 'fa fa-user-plus',
            label: 'Nuevo mensaje',
            action: function (option, contextMenuIndex, optionIndex) {
                nuevoMensaje();
            },
            submenu: null,
            disabled: false
        }, {
            icon: 'fas fa-users',
            label: 'Nuevo grupo',
            action: function (option, contextMenuIndex, optionIndex) {
                nuevoGrupo();
            },
            submenu: null,
            disabled: false
        }];

    superCm.createMenu(myMenu, e);

});

const cerrarDestacados = () => {
    $("#panelMensajesDestacados").slideUp("slow", () => {
        $("#contacts").slideDown("slow");
        $("#panelMensajesDestacados").find("ul").remove();
    });
};

const agregarItemMensajeDestacado = (mensaje, ul, alInicio) => {

    let usuarioEnvia = {};
    let leyenda = "";
    if (mensaje.id360 === sesion_cookie.idUsuario_Sys) {
        usuarioEnvia = {
            img: perfil.img,
            id360: sesion_cookie.idUsuario_Sys,
            apellido_paterno: sesion_cookie.apellido_p,
            apellido_materno: sesion_cookie.apellido_m,
            nombre: sesion_cookie.nombre
        };
        leyenda += "Tú > ";
    } else {
        usuarioEnvia = buscaEnDirectorioCompleto(mensaje.id360);
        leyenda += usuarioEnvia.nombre + " " + usuarioEnvia.apellido_paterno + " " + usuarioEnvia.apellido_materno + " > ";
    }

    let usuarioRecibe = {};
    if (mensaje.to_id360 === sesion_cookie.idUsuario_Sys) {
        usuarioRecibe = {
            img: perfil.img,
            id360: sesion_cookie.idUsuario_Sys,
            apellido_paterno: sesion_cookie.apellido_p,
            apellido_materno: sesion_cookie.apellido_m,
            nombre: sesion_cookie.nombre
        };
        leyenda += "Tú";
    } else {
        usuarioRecibe = buscaEnDirectorioCompleto(mensaje.to_id360);
        leyenda += usuarioRecibe.nombre + " " + usuarioRecibe.apellido_paterno + " " + usuarioRecibe.apellido_materno;
    }

    let item = $("<li></li>").addClass("mensajeDestacado");
    item.attr("id", "itemMensajeDestacado" + mensaje.id);
    let contenedor = $("<div></div>").addClass("contenidoMensajeDestacado");

    let cabecera = $("<div></div>").addClass("cabeceraDestacado");

    let imgUsuario = $("<img>");
    imgUsuario.attr("src", usuarioEnvia.img);

    let leyendaEnvio = $("<p></p>");
    leyendaEnvio.text(leyenda);

    let fechaDestacado = $("<span></span>");
    fechaDestacado.text(mensaje.fechaDestacado + " >");

    cabecera.append(imgUsuario);
    cabecera.append(leyendaEnvio);
    cabecera.append(fechaDestacado);
    contenedor.append(cabecera);

    let contenedorMensaje = $("<div></div>").addClass("mensaje");
    if (mensaje.id360 === sesion_cookie.idUsuario_Sys) {
        contenedorMensaje.addClass("mio");
    }

    if (mensaje.type === "text") {
        contenedorMensaje.text(mensaje.message);
    } else {

        let imgPreview = $("<img>");
        let extension = mensaje.type;

        imgPreview.attr("src", PathRecursos + "images/icono_default.png");
        imgPreview.css({
            "max-height": "80px"
        });

        switch (extension) {

            case "jpg":
            case "png":
            case "gif":
            case "jpeg":
                imgPreview.attr("src", mensaje.message);
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

        contenedorMensaje.append(imgPreview);

        let partesPorDiagonal = mensaje.message.split("/");
        let nombreCorto = partesPorDiagonal[partesPorDiagonal.length - 1];

        let nombreAdjunto = $("<p></p>").addClass("text-center");
        ;
        nombreAdjunto.css({
            "color": "black",
            "word-break": "break-all"
        });
        nombreAdjunto.text(nombreCorto.replaceAll("%20", " ") + " ");
        contenedorMensaje.append(nombreAdjunto);

        let pBotonera = $("<p></p>").addClass("text-center");

        let botonDescargar = $("<a></a>").addClass("btn btn-sm btn-light mr-3");
        botonDescargar.attr("href", mensaje.message);
        botonDescargar.attr("download", nombreCorto);
        botonDescargar.attr("target", "_blank");
        botonDescargar.html('<i class="fas fa-download"></i>');
        pBotonera.append(botonDescargar);

        if (extension === "pdf") {

            let buttonVerPreview = $("<button></button>").addClass("btn btn-sm btn-light");
            buttonVerPreview.attr("type", "button");
            buttonVerPreview.append('<i class="far fa-eye"></i>');

            /* IFRAME */
            let iframePreviewPDF = $("<iframe></iframe>");
            iframePreviewPDF.css({
                "height": "500px",
                "width": "700px"
            });
            iframePreviewPDF.attr("frameborder", "0");
            iframePreviewPDF.attr("src", mensaje.message);

            buttonVerPreview.click(() => {
                Swal.fire({
                    width: 800,
                    showCancelButton: false,
                    showConfirmButton: false,
                    html: iframePreviewPDF
                });
            });

            pBotonera.append(buttonVerPreview);

        }

        contenedorMensaje.append(nombreAdjunto);
        contenedorMensaje.append(pBotonera);

    }

    contenedor.append(contenedorMensaje);

    item.append(contenedor);

    if (alInicio) {
        ul.prepend(item);
    } else {
        ul.append(item);
    }

    item.click(() => {

        console.log(mensaje.id);
        console.log("To_id360: " + mensaje.to_id360);
        console.log("id360: " + mensaje.id360);

        let id360Seguir = null;
        if (mensaje.id360 === sesion_cookie.idUsuario_Sys) {
            id360Seguir = mensaje.to_id360;
        } else {
            if (mensaje.idGroup !== null) {
                id360Seguir = mensaje.idGroup;
            } else {
                id360Seguir = mensaje.id360;
            }
        }
        console.log(id360Seguir);

        const remarcaMensaje = (idMensaje) => {
            document.querySelector("#mensaje_" + idMensaje).scrollIntoView();
            document.querySelector("#mensaje_" + idMensaje).scrollIntoView();
            let resaltar = setInterval(() => {
                $("#mensaje_" + idMensaje).toggleClass("respondida");
            }, 250);

            setTimeout(() => {
                clearInterval(resaltar);
                $("#mensaje_" + idMensaje).removeClass("respondida");
            }, 2000);
        };

        const iniciaBusqueda = () => {
            console.log($("#mensaje_" + mensaje.id).length);
            if ($("#mensaje_" + mensaje.id).length) {

                remarcaMensaje(mensaje.id);

            } else {

                const buscaMensajeRespuesta = () => {
                    if ($("#contact_messaging" + id360Seguir).find(".liMasMensajes").length) {
                        console.log("Voy a buscar mas mensajes " + id360Seguir);
                        let esGrupo = mensaje.idGroup !== undefined && mensaje.idGroup !== null ? true : false;
                        cargaMasMensajes(id360Seguir, esGrupo).then((response) => {
                            if ($("#mensaje_" + mensaje.id).length) {
                                remarcaMensaje(mensaje.id);
                            } else if (response) {
                                buscaMensajeRespuesta();
                            } else {
                                NotificacionToas.fire({
                                    title: 'No se ha encontrado el mensaje'
                                });
                            }

                        });
                    } else {
                        NotificacionToas.fire({
                            title: 'No se ha encontrado el mensaje'
                        });
                    }
                };

                buscaMensajeRespuesta();

            }
        };

        if ($("#contenedor_mensajes_" + id360Seguir).hasClass("d-none")) {
            $("#profile_chat" + id360Seguir).click();
            setTimeout(function () {
                iniciaBusqueda();
            }, 250);
        } else {
            iniciaBusqueda();
        }

    });

};

$("#verMensajesDestacados").click(() => {

    if ($("#panelMensajesDestacados").css("display") === "none") {
        let dataVerDestacados = {
            "idUser": sesion_cookie.idUsuario_Sys
        };

        RequestPOST("/API/empresas360/consultar_mensajes_destacados", dataVerDestacados).then((response) => {

            const panelMensajesDestacados = $("#panelMensajesDestacados");

            panelMensajesDestacados.find("p").remove();
            panelMensajesDestacados.find("ul").remove();

            if (response.length) {

                let ulMensajes = $("<ul></ul>").addClass("listadoMensajesDestacados");

                $.each(response, (index, mensaje) => {
                    if (mensaje.idGroup !== null) {
                        mensaje.to_id360 = mensaje.idGroup;
                    }
                    agregarItemMensajeDestacado(mensaje, ulMensajes, false);
                });

                panelMensajesDestacados.append(ulMensajes);

            } else {
                panelMensajesDestacados.append("<p class='sinMensajesDestacados'>Sin mensajes destacados</p>");
            }

        });

        $("#contacts").slideUp("slow", () => {
            $("#panelMensajesDestacados").slideDown("slow");
        });
    }

});

$("#btnCerrarMensajesDestacados").click(() => {

    cerrarDestacados();

});

$("#eliminarTodosLosMensajesDestacados").click(() => {

    swalConfirmDialog(
            "¿Seguro deseas eliminar todos los mensajes destacados?",
            "Si, eliminar",
            "Mantener mensajes"
            ).then((response) => {
        if (response) {

            console.log("Eliminando mensajes destacados");

        }
    });

});

let contenedorNuevosParticipantes = $("<div></div>");

let formNuevosParticipantes = $("<form></form>");
formNuevosParticipantes.attr("id", "formAgregaParticipantesGrupo");
formNuevosParticipantes.attr("autocomplete", "off");

let formGroupNuevosParticipantes = $("<div></div>").addClass("form-group");
let labelNuevosParticipantes = $("<label></label>");
labelNuevosParticipantes.text("Participantes");
let selectNuevosParticipantes = '<div class="col-12" id="agregarNuevosParticipantes">' +
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
formGroupNuevosParticipantes.append(labelNuevosParticipantes);
formGroupNuevosParticipantes.append(selectNuevosParticipantes);
formNuevosParticipantes.append(formGroupNuevosParticipantes);

let buttonSubmitNuevosParticipantes = $("<button></button>").addClass("btn btn-danger btn-block mt-4");
buttonSubmitNuevosParticipantes.attr("type", "submit");
buttonSubmitNuevosParticipantes.text("Agregar participantes");
formNuevosParticipantes.append(buttonSubmitNuevosParticipantes);

contenedorNuevosParticipantes.append(formNuevosParticipantes);

const agregarParticipanteGrupo = (id_grupo, participantes) => {

    Swal.fire({
        html: contenedorNuevosParticipantes,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        allowEscapeKey: false
    });

    vuewModalParticipantesGrupo("agregarNuevosParticipantes", participantes);

    $("#agregarNuevosParticipantes .multiselect__content-wrapper").css({"background-color": "#fff"});

    $("#formAgregaParticipantesGrupo").submit((e) => {

        e.preventDefault();

        if (participantesParaGrupo.length) {

            let dataGrupo = {
                "idGrupo": id_grupo,
                "participantes": participantesParaGrupo
            };

            muestraSpin();
            RequestPOST("/API/empresas360/agrega_participantes_grupo_chat_empresarial", dataGrupo).then((response) => {

                if (response.success) {

                    let idGrupo = response.id_grupo;

                    Swal.close();
                    let msj = "Se agregó a ";

                    let cantidadParticipantes = participantesParaGrupo.length;
                    $.each(participantesParaGrupo, (index, participante) => {

                        let userGrupo = buscaEnDirectorioCompleto(participante);

                        if (userGrupo !== undefined) {

                            let nombre_eliminado = buscaEnDirectorioCompleto(participante).nombre;
                            if (index === 0) {
                                msj += nombre_eliminado;
                            } else if (index === (cantidadParticipantes - 2)) {
                                msj += ", " + nombre_eliminado;
                            } else {
                                msj += " y a " + nombre_eliminado;
                            }

                        }

                    });

                    msj += " al grupo";
                    mensajeSistema(msj, id_grupo, true);

                    participantesParaGrupo = [];
                    ocultaSpin();
                    swal.fire({text: "Invitación enviada a los participantes"});
                }

            });

        }

    });

};

const eliminaParticipanteGrupo = (id_participante, id_grupo) => {

    swalConfirmDialog(
            "¿Seguro deseas eliminar este participante del grupo?",
            "Si, eliminar",
            "Mantener en el grupo"
            ).then((response) => {
        if (response) {

            let data = {
                idGroup: id_grupo,
                id360: id_participante
            };

            RequestPOST("/API/empresas360/elimina_participante_grupo", data).then((response) => {
                if (response.success) {
                    let nombre_eliminado = buscaEnDirectorioCompleto(id_participante).nombre;
                    let msj = "Se eliminó a " + nombre_eliminado + " del grupo";
                    mensajeSistema(msj, id_grupo, true);
                }
            });

        }
    });

};

const hacerAdministrador = (id_participante, id_grupo) => {

    swalConfirmDialog(
            "¿Dar permisos de administrador?",
            "Si, hacer administrador",
            "Cancelar"
            ).then((response) => {
        if (response) {

            let data = {
                idGroup: id_grupo,
                id360: id_participante
            };

            RequestPOST("/API/empresas360/agrega_administrador_grupo", data).then((response) => {
                if (response.success) {
                    let iconAdmin = $("<i></i>").addClass("mr-2");
                    iconAdmin.addClass("fas fa-user-shield");
                    let liParticipante = $("#" + id_grupo + "_" + id_participante);

                    liParticipante.off();
                    liParticipante.on('contextmenu', function (e) {
                        e.preventDefault();

                        var myMenu = [{
                                icon: 'fa fa-trash',
                                label: 'Eliminar participante',
                                action: function (option, contextMenuIndex, optionIndex) {
                                    eliminaParticipanteGrupo(id_participante, id_grupo);
                                },
                                submenu: null,
                                disabled: false
                            }, {
                                icon: 'fas fa-user-times',
                                label: 'Descartar como administrador',
                                action: function (option, contextMenuIndex, optionIndex) {
                                    quitarAdministrador(id_participante, id_grupo);
                                },
                                submenu: null,
                                disabled: false
                            }];

                        superCm.createMenu(myMenu, e);
                    });

                    liParticipante.find("span").prepend(iconAdmin);
                    let nombre_eliminado = buscaEnDirectorioCompleto(id_participante).nombre;
                    let msj = "Se designó a " + nombre_eliminado + " como administrador";
                    mensajeSistema(msj, id_grupo, true);
                }
            });

        }
    });

};

const quitarAdministrador = (id_participante, id_grupo) => {

    swalConfirmDialog(
            "¿Quitar permisos de administrador?",
            "Si, quitar administrador",
            "Cancelar"
            ).then((response) => {
        if (response) {

            let data = {
                idGroup: id_grupo,
                id360: id_participante
            };

            RequestPOST("/API/empresas360/elimina_administrador_grupo", data).then((response) => {
                if (response.success) {
                    let iconAdmin = $("<i></i>").addClass("mr-2");
                    iconAdmin.addClass("fas fa-user-shield");
                    let liParticipante = $("#" + id_grupo + "_" + id_participante);

                    liParticipante.off();
                    liParticipante.on('contextmenu', function (e) {
                        e.preventDefault();

                        var myMenu = [{
                                icon: 'fa fa-trash',
                                label: 'Eliminar participante',
                                action: function (option, contextMenuIndex, optionIndex) {
                                    eliminaParticipanteGrupo(id_participante, id_grupo);
                                },
                                submenu: null,
                                disabled: false
                            }, {
                                icon: 'fas fa-user-times',
                                label: 'Designar como administrador',
                                action: function (option, contextMenuIndex, optionIndex) {
                                    hacerAdministrador(id_participante, id_grupo);
                                },
                                submenu: null,
                                disabled: false
                            }];

                        superCm.createMenu(myMenu, e);
                    });

                    liParticipante.find("span").find("svg").remove();
                    let nombre_eliminado = buscaEnDirectorioCompleto(id_participante).nombre;
                    let msj = "Se denegó a " + nombre_eliminado + " como administrador";
                    mensajeSistema(msj, id_grupo, true);
                }
            });

        }
    });

};

function agregar_chat_enviado(mensaje, viejo) {
    if (!$("#profile_chat" + mensaje.to_id360).length) {
        RequestPOST("/API/get/perfil360", {id360: mensaje.to_id360}).then((response) => {
            if (response.sucesss) {
                contacto_chat(response);
                directorio_usuario.push(response);
                agregar_chat(mensaje, response, "replies", viejo);
            }
        });
    } else {
        if (mensaje.idGroup !== undefined && mensaje.idGroup !== null) {
            let user = sesion_cookie;
            agregar_chat(mensaje, user, "replies", viejo);
        } else {
            let user = null;
            $.each(directorio_usuario, (i) => {
                if (mensaje.to_id360 === directorio_usuario[i].id360) {
                    user = directorio_usuario[i];
                    return false;
                }
            });
            if (user !== null)
                agregar_chat(mensaje, user, "replies", viejo);
        }
    }

}
function recibir_chat(mensaje, viejo, group, aumenta) {

    const aumentaMensajeNoLeido = () => {
        /*
         * desplegar mensaje no leido
         */
        if (mensaje.id360 !== sesion_cookie.idUsuario_Sys) {

            let idParaAumentar = null;
            if (mensaje.idGroup !== undefined && mensaje.idGroup !== null && mensaje.idGroup !== "") {
                idParaAumentar = mensaje.idGroup;
            } else {
                idParaAumentar = mensaje.id360;
            }

            let contenedorMensajesNoLeidos = $("#mensajesNoLeidos_" + idParaAumentar);
            if (CantidadMensajesPorChat[idParaAumentar] !== undefined) {
                if (CantidadMensajesPorChat[idParaAumentar].cantidadMensajesNoLeidos <= 0) {
                    contenedorMensajesNoLeidos.removeClass("d-none");
                }
                CantidadMensajesPorChat[idParaAumentar].cantidadMensajesNoLeidos++;
                CantidadMensajesPorChat[idParaAumentar].mensajesNoLeidos.push(mensaje.id);
                contenedorMensajesNoLeidos.find("span.cantidadMensajesNoLeidos").text(CantidadMensajesPorChat[idParaAumentar].cantidadMensajesNoLeidos);

                let divMensajesNoLeidosPadre = $("#contenedor_mensajes_" + idParaAumentar);
                if (!divMensajesNoLeidosPadre.hasClass("d-none")) {
                    $("#mensajesNoLeidos_" + idParaAumentar).addClass("d-none");
                    CantidadMensajesPorChat[idParaAumentar].cantidadMensajesNoLeidos = 0;
                    let chats = {
                        chats: CantidadMensajesPorChat[idParaAumentar].mensajesNoLeidos
                    };
                    CantidadMensajesPorChat[idParaAumentar].mensajesNoLeidos = [];

                    RequestPOST("/API/empresas360/marcar_chats_leidos", chats).then((response) => {
                    });
                } else
                    console.log("Fuera de la conversacion");

            } else {
                //Crear el componente
                CantidadMensajesPorChat[idParaAumentar] = {
                    cantidad: 1,
                    cantidadMensajesNoLeidos: 1,
                    mensajesNoLeidos: [mensaje.id]
                };
                contenedorMensajesNoLeidos.find("span.cantidadMensajesNoLeidos").text("1");
                contenedorMensajesNoLeidos.removeClass("d-none");

                if (!divMensajesNoLeidosPadre.hasClass("d-none")) {
                    console.log("Dentro de la conversacion");
                    $("#mensajesNoLeidos_" + idParaAumentar).addClass("d-none");
                    CantidadMensajesPorChat[idParaAumentar].cantidadMensajesNoLeidos = 0;
                    let chats = {
                        chats: CantidadMensajesPorChat[idParaAumentar].mensajesNoLeidos
                    };
                    CantidadMensajesPorChat[idParaAumentar].mensajesNoLeidos = [];

                    RequestPOST("/API/empresas360/marcar_chats_leidos", chats).then((response) => {
                    });
                } else
                    console.log("Fuera de la conversacion");

            }
        } else
            console.log("Es un mensaje mio, asi que no aumento");
    };

    if (!$("#profile_chat" + mensaje.id360).length) {
        if (mensaje.idGroup !== undefined && mensaje.idGroup !== null) {
            if (!$("#profile_chat" + mensaje.to_id360).length) {
                console.log("Tampoco existe el componente del grupo");
            } else {
                let user = null;
                $.each(directorio_usuario, (i) => {
                    if (mensaje.id360 === directorio_usuario[i].id360) {
                        user = directorio_usuario[i];
                        return false;
                    }
                });
                if (user !== null) {
                    if (NotificacionesActivadas) {

                        let body = '';
                        if (mensaje.type === "text") {
                            body = user.nombre + " " + user.apellido_paterno + " dice: " + mensaje.message;
                        } else {
                            body = user.nombre + " " + user.apellido_paterno + " ha enviado un adjunto";
                        }

                        notificacion_mensaje("Nuevo mensaje", body, () => {
                        });

                        buttonNotificacionMensaje.click();

                    }

                    agregar_chat(mensaje, user, "send", viejo);
                    if (aumenta)
                        aumentaMensajeNoLeido();
                } else
                    console.log("No encontre al usuario");
            }
        } else {
            if (group) {
                RequestPOST("/API/empresas360/infoGrupo", {"id_grupo": mensaje.idGroup}).then((response) => {
                    console.log(response);
                });
            } else {
                console.log("****************************************");
                console.log("No existe el usuario");
                console.log("****************************************");
                RequestPOST("/API/get/perfil360", mensaje).then((response) => {
                    if (response.success) {
                        contacto_chat(response);
                        directorio_usuario.push(response);

                        CantidadMensajesPorChat[mensaje.id360] = {
                            cantidad: 1,
                            cantidadMensajesNoLeidos: 1,
                            mensajesNoLeidos: [mensaje.id]
                        };

                        agregar_chat(mensaje, response, "send", viejo);
                        if (aumenta)
                            aumentaMensajeNoLeido();
                    }
                });
            }
        }
    } else {
        let user = null;
        $.each(directorio_usuario, (i) => {
            if (mensaje.id360 === directorio_usuario[i].id360) {
                user = directorio_usuario[i];
                return false;
            }
        });
        if (user !== null) {
            if (NotificacionesActivadas) {
                console.log("HACER NOTIFICACION");
                let body = '';
                if (mensaje.type === "text") {
                    body = user.nombre + " " + user.apellido_paterno + " dice: " + mensaje.message;
                } else {
                    body = user.nombre + " " + user.apellido_paterno + " ha enviado un adjunto";
                }

                notificacion_mensaje("Nuevo mensaje", body, () => {
                });

                buttonNotificacionMensaje.click();

            }

            agregar_chat(mensaje, user, "send", viejo);
            if (aumenta)
                aumentaMensajeNoLeido();
        } else
            console.log("No encontre al usuario");
    }

}

function notificacion_mensaje(title, body, onclick) {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    } else {

        var options = {
            body: body,
            icon: PathRecursos + "images/claro2min.png",
            silent: true
        };

        var notificacion = new Notification(title, options);
        setTimeout(notificacion.close.bind(notificacion), 15000);

        notificacion.onshow = function () {
            //document.getElementById('').play();
        };

        notificacion.onclick = onclick;

        notificacion.silent = true;

    }

}

vuewModalReenviaMensaje = () => {

    usuariosReenviaMensaje = new Array();
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
                console.log("agrego a :" + op.nombre + " con id " + op.id360);
                usuariosReenviaMensaje.push(op.id360);
            },
            onClose() {
                //console.info(this.value);
            },
            onRemove(op) {
                console.log("quito a :" + op.nombre + " con id " + op.id360);
                var i = usuariosReenviaMensaje.indexOf(op.id360);
                console.log(i);
                usuariosReenviaMensaje.splice(i, 1);
            }

        }
    }).$mount('#usuariosReenviaMensaje');

};

const reenviaMensaje = (mensaje, type) => {
    let contenedorReenviaMensaje = $("<div></div>");

    let formReenviaMensaje = $("<form></form>");
    formReenviaMensaje.attr("id", "formReenviaMensaje");
    formReenviaMensaje.attr("autocomplete", "off");

    let formGroupReenviaMensaje = $("<div></div>").addClass("form-group");
    let labelUsuariosReenvia = $("<label></label>");
    labelUsuariosReenvia.text("Reenviar a:");
    let selectUsuariosReenvia = '<div class="col-12" id="usuariosReenviaMensaje">' +
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
    formGroupReenviaMensaje.append(labelUsuariosReenvia);
    formGroupReenviaMensaje.append(selectUsuariosReenvia);
    formReenviaMensaje.append(formGroupReenviaMensaje);

    let buttonSubmitReenviaMensaje = $("<button></button>").addClass("btn btn-danger btn-block mt-4");
    buttonSubmitReenviaMensaje.attr("type", "submit");
    buttonSubmitReenviaMensaje.text("Reenviar mensaje");
    formReenviaMensaje.append(buttonSubmitReenviaMensaje);

    contenedorReenviaMensaje.append(formReenviaMensaje);

    Swal.fire({
        html: contenedorReenviaMensaje,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (!result.value) {
            apagaValores();
        }
    });

    vuewModalReenviaMensaje();

    $("#usuariosReenviaMensaje .multiselect__content-wrapper").css({"background-color": "#fff"});

    $("#formReenviaMensaje").submit((e) => {

        e.preventDefault();
        console.log(usuariosReenviaMensaje);
        if (usuariosReenviaMensaje.length) {

            Swal.close();

            const buscaYreenvia = (id) => {
                console.log("****************************************");
                console.log("No existe el usuario");
                console.log("****************************************");
                RequestPOST("/API/get/perfil360", {id360: id}).then((response) => {
                    if (response.success) {
                        contacto_chat(response);
                        enviaElMensaje(id);
                    }
                });
            };

            const enviaElMensaje = (id) => {
                let input = $("<input>");
                input.val(mensaje);

                let ulJS = document.getElementById("contact_messaging" + id);
                let ul = $(ulJS);

                let previewJS = document.getElementById("preview_" + id);
                let preview = $(previewJS);

                let messagesJS = document.getElementById("messages_" + id);
                let messages = $(messagesJS);

                let user = {"id360": id};

                let rutaAdjunto = null;
                if (type !== "text")
                    rutaAdjunto = mensaje;

                send_chat_messages(input, ul, preview, user, messages, rutaAdjunto);
            };

            let cantidadU = usuariosReenviaMensaje.length;
            for (let x = 0; x < cantidadU; x++) {
                let id = usuariosReenviaMensaje[x];
                console.log(id);
                if (!$("#profile_chat" + id).length) {
                    buscaYreenvia(id);
                } else {
                    enviaElMensaje(id);
                }

            }

        }

    });
};

const apagaValores = () => {
    banderaEditando = false;
    banderaEditandoGrupo = false;
    banderaRespondiendo = false;
    idMensajeEditando = null;
    idMensajeRespondiendo = null;
    $(".filaMensajesOperaciones").addClass("d-none");
};

const mensajeViejo = (viejo, nuevo) => {

    let div = $("<div></div>");

    let formGroupViejo = $("<div></div>").addClass("form-group");
    let labelViejo = $("<label></label>");
    labelViejo.text("Mensaje Anterior");
    let inputViejo = $("<textarea>").addClass("form-control");
    inputViejo.attr("disabled", "true");
    inputViejo.val(viejo);
    formGroupViejo.append(labelViejo);
    formGroupViejo.append(inputViejo);

    let formGroupNuevo = $("<div></div>").addClass("form-group");
    let labelNuevo = $("<label></label>");
    labelNuevo.text("Mensaje Actual");
    let inputNuevo = $("<textarea>").addClass("form-control");
    inputNuevo.attr("disabled", "true");
    inputNuevo.val(nuevo);
    formGroupNuevo.append(labelNuevo);
    formGroupNuevo.append(inputNuevo);

    div.append(formGroupViejo);
    div.append(formGroupNuevo);

    Swal.fire({
        html: div,
        showConfirmButton: false
    });

};

const verificaLinks = (mensaje) => {
    let partesMensaje = mensaje.split(" ");
    let cadenaConLinks = "";
    $.each(partesMensaje, (index, parte) => {

        if (parte.slice(0, 7) === "http://" || parte.slice(0, 8) === "https://" || parte.slice(0, 4) === "www.") {
            if (parte.slice(0, 4) === "www.") {
                cadenaConLinks += "<a style='color: currentColor; text-decoration: underline;' href='http://" + parte + "' target='_blank'>" + parte + "</a> ";
            } else {
                cadenaConLinks += "<a style='color: currentColor; text-decoration: underline;' href='" + parte + "' target='_blank'>" + parte + "</a> ";
            }
        } else {
            cadenaConLinks += parte + " ";
        }

    });
    return cadenaConLinks;
};

function agregar_chat(msj, user, type, viejo) {
    if (user.success) {
        let mensaje = msj.message;
        let li = $("<li></li>").addClass(type);
        li.attr("id", "mensaje_" + msj.id);
        li.addClass("limessage");
        let img_message = $("<div></div>").addClass("img");

        img_message.css({
            "background": "url('" + user.img + "')",
            "background-size": "cover",
            "background-position": "center",
            "background-repeat": "no-repeat"
        });
        if (type === "replies") {
            img_message.css({
                "background": "url('" + perfil.img + "')",
                "background-size": "cover",
                "background-position": "center",
                "background-repeat": "no-repeat"
            });
        }
        let message = $("<p></p>");

        let id = null;
        if (msj.idGroup !== undefined && msj.idGroup !== null) {
            id = msj.idGroup;
        } else {
            id = type === "replies" ? msj.to_id360 : msj.id360;
        }
        let previewMesagge;

        if (msj.activo === "0") {

            message.empty();
            message.text("Mensaje eliminado");
            let iconMensajeEliminado = $("<i></i>").addClass("fas fa-comment-slash");
            if (type === "send") {
                iconMensajeEliminado.css({"margin-left": "10px"});
                message.append(iconMensajeEliminado);
            } else {
                iconMensajeEliminado.css({"margin-right": "10px"});
                message.prepend(iconMensajeEliminado);
            }
            message.css({
                "background-color": "transparent",
                "font-style": "italic",
                "font-size": "1.1rem",
                "color": "#434343"
            });
            previewMesagge = "Mensaje eliminado";

            li.append(img_message);
            li.append(message);

        } else {

            message.html(verificaLinks(mensaje));
            message.css({
                "word-break": "break-all"
            });

            if (msj.idGroup !== undefined && msj.idGroup !== null && type === "send") {
                let iNombreUsuario = $("<i></i>").addClass("nombreUsuarioGrupo");
                let nU = user.nombre;
                if (user.apellido_paterno !== undefined && user.apellido_paterno !== null) {
                    nU += user.apellido_paterno;
                }
                if (user.apellido_materno !== undefined && user.apellido_materno !== null) {
                    nU += user.apellido_materno;
                }
                iNombreUsuario.text(nU);
                iNombreUsuario.click(() => {
                    $("#profile_chat" + user.id360).click();
                });
                iNombreUsuario.mouseenter(() => {
                    iNombreUsuario.css({"text-decoration": "underline"});
                }).mouseleave(() => {
                    iNombreUsuario.css({"text-decoration": "none"});
                });
                message.prepend(iNombreUsuario);
            }

            let fecha = $("<span></span>").addClass("time");

            let fechaMoment = moment(msj.fecha).format("DD-MM-YY");
            let partesHoraMensaje = msj.hora.split(":");
            let horaMoment = moment();
            horaMoment.set("hour", partesHoraMensaje[0]);
            horaMoment.set("minute", partesHoraMensaje[1]);
            horaMoment.set("second", partesHoraMensaje[2]);

            fecha.text(fechaMoment + " " + horaMoment.format("hh:mm A"));
            let iconClock = $("<li></li>").addClass("far fa-clock");
            let spanEdit = $("<span></span>");
            let iconEdit = $("<li></li>").addClass("fas fa-edit");
            spanEdit.append(iconEdit);
            iconEdit.attr("id", "historial_ediciones_" + msj.id);

            if (type === "replies") {
                fecha.append(iconClock);
                if (msj.time_updated !== null && msj.time_updated !== undefined)
                    fecha.append(spanEdit);
                iconClock.addClass("ml-2");
                iconEdit.addClass("ml-2");
            } else {
                fecha.prepend(iconClock);
                if (msj.time_updated !== null && msj.time_updated !== undefined)
                    fecha.prepend(spanEdit);
                iconClock.addClass("mr-2");
                iconEdit.addClass("mr-2");
            }

            iconEdit.css({
                "cursor": "pointer"
            });

            message.append(fecha);

            li.append(img_message);
            li.append(message);

            spanEdit.click(() => {
                mensajeViejo(msj.oldMessage, mensaje);
            });

            let idConver = type === "replies" ? msj.to_id360 : msj.id360;
            previewMesagge = type === "replies" ? "Yo: " + mensaje : user.nombre + ": " + mensaje;

            if (msj.type !== "text") {
                let extension = msj.type;

                let partesPorDiagonal = mensaje.split("/");
                let nombreCorto = partesPorDiagonal[partesPorDiagonal.length - 1];

                let nombreCortoPorGuionBajo = nombreCorto.split("_");
                nombreCortoPorGuionBajo.shift();

                nombreCorto = nombreCortoPorGuionBajo.join('_');

                previewMesagge = type === "replies" ? "Yo: " + nombreCorto.replaceAll("%20", " ") : user.nombre + ": " + nombreCorto.replaceAll("%20", " ");

                let imagenPreview = $("<img>").css({"max-width": "125px", "max-height": "75px", "margin-bottom": "10px"}).attr("src", PathRecursos + "images/icono_default.png");

                let saltoLinea = $("<br>");
                let nombreAdjunto = $("<span></span>").css({"font-size": "1.1rem"});
                nombreAdjunto.text(nombreCorto.replaceAll("%20", " ") + " ");

                let buttonDownloadAttachment = $("<a></a>").addClass("btn btn-light").css({"margin-left": "10px"});
                buttonDownloadAttachment.attr("href", mensaje);
                buttonDownloadAttachment.attr("download", nombreCorto);
                buttonDownloadAttachment.attr("target", "_blank");
                buttonDownloadAttachment.html('<i class="fas fa-download"></i>');

                nombreAdjunto.append(buttonDownloadAttachment);

                switch (extension) {

                    case "jpg":
                    case "png":
                    case "jpeg":
                    case "gif":
                        imagenPreview.attr("src", mensaje);
                        buttonDownloadAttachment.attr("target", "_blanck");
                        break;

                    case "docx":
                    case "docm":
                    case "dotx":
                    case "dotm":
                    case "doc":
                        imagenPreview.attr("src", PathRecursos + "images/icono_word.png");
                        break;

                    case "xlsx":
                    case "xlsm":
                    case "xlsb":
                    case "xltx":
                    case "xltm":
                    case "xls":
                    case "xlt":
                        imagenPreview.attr("src", PathRecursos + "images/icono_excel.png");
                        break;

                    case "pptx":
                    case "pptm":
                    case "ppt":
                    case "xps":
                    case "potx":
                    case "ppsx":
                        imagenPreview.attr("src", PathRecursos + "images/icono_powerpoint.png");
                        break;

                    case "pdf":
                        imagenPreview.attr("src", PathRecursos + "images/icono_pdf.png");
                        break;

                }

                message.empty().append(imagenPreview);
                message.append(saltoLinea);
                if (!(extension === "jpg" || extension === "png" || extension === "jpeg" || extension === "gif")) {
                    if (extension === "pdf") {

                        imagenPreview.css({"cursor": "pointer"});

                        /* IFRAME */
                        let iframePreviewPDF = $("<iframe></iframe>");
                        iframePreviewPDF.css({
                            "height": "500px",
                            "width": "700px"
                        });
                        iframePreviewPDF.attr("frameborder", "0");
                        iframePreviewPDF.attr("src", mensaje);

                        imagenPreview.click(() => {
                            Swal.fire({
                                width: 800,
                                showCancelButton: false,
                                showConfirmButton: false,
                                html: iframePreviewPDF
                            });
                        });

                    }

                    message.append(nombreAdjunto);

                } else {
                    imagenPreview.css({"cursor": "pointer", "max-width": "250px", "max-height": "250px"});

                    let imagenPreviewCopy = $("<img>");
                    imagenPreviewCopy.attr("src", mensaje);
                    imagenPreviewCopy.css({
                        "max-width": "650px",
                        "max-height": "650px"
                    });

                    imagenPreview.click(() => {
                        Swal.fire({
                            width: 700,
                            showCancelButton: false,
                            showConfirmButton: false,
                            html: imagenPreviewCopy
                        });
                    });
                }
                message.append(fecha);
            }

            if (msj.destacado === "1") {
                let iconoDestacado = $("<span></span>").addClass("iconoDestacado");
                iconoDestacado.append('<i class="fas fa-star"></i>');
                message.append(iconoDestacado);
            }

            //ICONO MENU DE OPCION PARA EL MENSAJE

            let iconOpciones = $("<span></span>").addClass("iconOpciones");
            let iconDespliegaMenu = $('<i class="fas fa-chevron-down"></i>');
            iconOpciones.append(iconDespliegaMenu);
            message.append(iconOpciones);

            const eliminaMensaje = (tipo) => {
                //PEDIR CONFIRMACION DE ELIMINAR
                swalConfirmDialog("¿Eliminar mensaje?", "Eliminar", "Cancelar").then((response) => {
                    if (response) {
                        //PROCESO DE ELIMINACION

                        let dataMensaje = {
                            "idMensaje": msj.id
                        };

                        let services;

                        if (tipo === 0) {
                            services = "/API/empresas360/eliminaMensaje";
                            dataMensaje.id360 = sesion_cookie.idUsuario_Sys;
                            dataMensaje.to_id360 = user.id360;

                            if (msj.idGroup !== undefined && msj.idGroup !== null && msj.idGroup !== "") {
                                dataMensaje.esGrupo = true;
                            }

                        } else {
                            services = "/API/empresas360/eliminaMensajeParaMi";
                            dataMensaje.idUser = sesion_cookie.idUsuario_Sys;
                        }

                        RequestPOST(services, dataMensaje).then((response) => {
                            apagaValores();
                            console.log("Se elimino el mensaje");
                            console.log("Se debe enviar por socket");
                        });

                    }
                });
            };

            const responderMensaje = () => {
                let idParaResponder = msj.idGroup !== undefined && msj.idGroup !== null ? msj.idGroup : user.id360;
                let contenedorResponde = $("#filaMensajesOperaciones_" + idParaResponder);
                contenedorResponde.removeClass("d-none");
                contenedorResponde.find("span").text(mensaje);
                $("#accionMensajesOpciones_" + idParaResponder).text("Respondiendo");
                banderaRespondiendo = true;
                idMensajeRespondiendo = msj.id;
            };

            let myMenu = [{
                    icon: 'fas fa-trash-alt',
                    label: 'Eliminar mensaje para mi',
                    action: function (option, contextMenuIndex, optionIndex) {
                        eliminaMensaje(1);
                    },
                    submenu: null,
                    disabled: false
                }];

            if (type === "replies") {

                myMenu.push({
                    icon: 'fas fa-trash',
                    label: 'Eliminar mensaje para todos',
                    action: function (option, contextMenuIndex, optionIndex) {
                        eliminaMensaje(0);
                    },
                    submenu: null,
                    disabled: false
                });

                if (msj.type === "text") {

                    myMenu.push({
                        icon: 'fas fa-edit',
                        label: 'Editar mensaje',
                        action: function (option, contextMenuIndex, optionIndex) {

                            let idSeguir = null;
                            if (msj.idGroup !== undefined && msj.idGroup !== null && msj.idGroup !== "") {
                                idSeguir = msj.idGroup;
                                banderaEditandoGrupo = true;
                            } else {
                                idSeguir = user.id360;
                                banderaEditandoGrupo = false;
                            }

                            let contenedorReenvia = $("#filaMensajesOperaciones_" + idSeguir);
                            contenedorReenvia.removeClass("d-none");
                            $("#accionMensajesOpciones_" + idSeguir).text("Editando");
                            $("#message_input_" + idSeguir).val(mensaje);
                            $("#message_input_" + idSeguir).select();
                            contenedorReenvia.find("span").text(mensaje);
                            $("#accionMensajesOpciones_" + idSeguir).text("Editando");
                            banderaEditando = true;
                            idMensajeEditando = msj.id;

                        },
                        submenu: null,
                        disabled: false
                    });

                }

            }

            myMenu.push({
                icon: 'fas fa-share-square',
                label: 'Reenviar mensaje',
                action: function (option, contextMenuIndex, optionIndex) {
                    reenviaMensaje(mensaje, msj.type);
                },
                submenu: null,
                disabled: false
            });

            myMenu.push({
                icon: 'fas fa-reply',
                label: 'Responder mensaje',
                action: function (option, contextMenuIndex, optionIndex) {
                    responderMensaje();
                },
                submenu: null,
                disabled: false
            });

            if (msj.destacado === "0") {
                myMenu.push({
                    icon: 'fas fa-star',
                    label: 'Destacar mensaje',
                    action: function (option, contextMenuIndex, optionIndex) {

                        let dataDestacar = {
                            "idUser": sesion_cookie.idUsuario_Sys,
                            "idMensaje": msj.id
                        };

                        RequestPOST("/API/empresas360/destacar_mensaje", dataDestacar).then((response) => {

                            NotificacionToas.fire({
                                title: 'Mensaje destacado'
                            });

                            $("body").click();
                            console.log("Se debio destacar");
                            console.log("Se envio por socket");
                        });

                    },
                    submenu: null,
                    disabled: false
                });
            } else {
                myMenu.push({
                    icon: 'fas fa-times',
                    label: 'No destacar mensaje',
                    action: function (option, contextMenuIndex, optionIndex) {

                        let dataDestacar = {
                            "idUser": sesion_cookie.idUsuario_Sys,
                            "idMensaje": msj.id
                        };

                        RequestPOST("/API/empresas360/eliminar_destacado", dataDestacar).then((response) => {

                            NotificacionToas.fire({
                                title: 'Mensaje eliminado como destacado'
                            });

                            $("body").click();
                            console.log("Se debio destacar");
                            console.log("Se envio por socket");
                        });

                    },
                    submenu: null,
                    disabled: false
                });
            }

            iconOpciones.click((e) => {
                superCm.createMenu(myMenu, e);
            });

            li.dblclick(() => {
                responderMensaje();
            });

            message.mouseenter(() => {
                iconOpciones.css({"display": "block"});
            }).mouseleave(() => {
                iconOpciones.css({"display": "none"});
            });

            if (msj.idResponse !== null && msj.idResponse !== undefined) {
                let mensajeRespuesta = msj.mensajeRespuesta === undefined ? msj.mensajeRespondido.message : msj.mensajeRespuesta;
                let smallRespuesta = $("<small></small>").addClass("respuesta-mensaje");
                smallRespuesta.text(mensajeRespuesta);
                message.prepend(smallRespuesta);

                smallRespuesta.click(() => {

                    const remarcaMensaje = (idMensaje) => {
                        document.querySelector("#mensaje_" + idMensaje).scrollIntoView();
                        let resaltar = setInterval(() => {
                            $("#mensaje_" + idMensaje).toggleClass("respondida");
                        }, 250);

                        setTimeout(() => {
                            clearInterval(resaltar);
                            $("#mensaje_" + idMensaje).removeClass("respondida");
                        }, 2000);
                    };

                    if ($("#mensaje_" + msj.idResponse).length) {

                        remarcaMensaje(msj.idResponse);

                    } else {

                        const buscaMensajeRespuesta = () => {

                            let idSeguir = user.id360;
                            if (msj.idGroup !== undefined && msj.idGroup !== null && msj.idGroup !== "") {
                                idSeguir = msj.idGroup;
                            }

                            if ($("#contact_messaging" + idSeguir).find(".liMasMensajes").length) {
                                console.log("Voy a buscar mas mensajes " + idSeguir);
                                let esGrupo = msj.idGroup !== undefined && msj.idGroup !== null ? true : false;
                                cargaMasMensajes(idSeguir, esGrupo).then((response) => {
                                    if ($("#mensaje_" + msj.idResponse).length) {
                                        remarcaMensaje(msj.idResponse);
                                    } else if (response) {
                                        buscaMensajeRespuesta();
                                    } else {
                                        NotificacionToas.fire({
                                            title: 'No se ha encontrado el mensaje'
                                        });
                                    }

                                });
                            } else {
                                NotificacionToas.fire({
                                    title: 'No se ha encontrado el mensaje'
                                });
                            }
                        };

                        buscaMensajeRespuesta();

                    }

                });

                apagaValores();

            }

        }

        if (viejo) {
            $("#contact_messaging" + id).prepend(li);
        } else {
            $("#contact_messaging" + id).append(li);

            document.querySelector("#messages_" + id + " li.limessage:last-child").scrollIntoView();

            //$("#messages_"+id).animate({scrollTop: $(document).height()+1000000}, 0);
            $("#preview_" + id).text(previewMesagge);
            $("#message_contacts").prepend(document.getElementById("profile_chat" + id));
        }

    }
}
//traer el directorio 
RequestPOST("/API/ConsultarDirectorio", {
    "fecha": getFecha(),
    "hora": getHora(),
    "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
    "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
//    "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area,
    "tipo_area": "0"
}).then((response) => {
    let directorio = response.directorio;
    directorio_usuario = response.directorio;

    for (var i = 0; i < directorio.length; i++)
        if (directorio[i].id360 === sesion_cookie.id_usuario)
            directorio.splice(i, 1);


    new Vue({
        el: "#app",
        data() {
            return {
                value: [],
                options: directorio
            };
        },
        methods: {
            customLabel(option) {
                return option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno + " ";
            },
            onClosed(value) {
                //console.log(value);
            },

            onTag(value) {
                //console.log(value);
            },

            onRemove(value) {
                //console.log(value);
            },

            onInput(value) {
                console.log(value);
                array_llamar = value;
            }
        }
    });
    new Vue({
        el: "#buscarContactos",
        data() {
            return {
                value: [],
                options: directorio
            };
        },
        methods: {
            customLabel(option) {
                return option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno + " ";
            },
            onClosed(value) {
                //console.log(value);

            },

            onTag(value) {
                //console.log(value);
            },

            onRemove(value) {
                //console.log(value);
            },

            onInput(value) {
                console.log(value);
                if ($("#profile_chat" + value.id360).length) {
                    $("#profile_chat" + value.id360 + " .btn-enviarMensajeChat").click();
                } else {
                    contacto_chat(value);
                    $("#profile_chat" + value.id360 + " .btn-enviarMensajeChat").click();
                }
            }
        }
    });

    /*
     * Consultar solamente los usuarios con los que se tiene un chat
     */
    RequestPOST("/API/empresas360/usuarios_con_chat", {id360: sesion_cookie.idUsuario_Sys}).then((response) => {

        let cantidadDirectorio = directorio.length;

        let fueraDeDirectorio = [];
        let grupos = [];

        $.each(response, (index, contacto) => {

            let mensajesNoLeidos = contacto.mensajesNoLeidos !== null ? contacto.mensajesNoLeidos.split(",") : [];
            let esFavorito = contacto.esFavorito === "0" ? false : true;

            CantidadMensajesPorChat[contacto.id360chat] = {
                cantidad: parseInt(contacto.cantidadMensajes) - 20,
                cantidadMensajesNoLeidos: parseInt(contacto.cantidadMensajesNoLeidos),
                mensajesNoLeidos: mensajesNoLeidos,
                esFavorito: esFavorito
            };

            if (contacto.esGrupo === null) {
                let encontrado = false;
                for (let i = 0; i < cantidadDirectorio; i++)
                    if (directorio[i].id360 === contacto.id360chat) {
                        encontrado = true;
                        contacto_chat(directorio[i]);
                        break;
                    }

                if (!encontrado)
                    fueraDeDirectorio.push({"id360": contacto.id360chat});
            } else {
                grupos.push(contacto.id360chat);
            }

        });

        const cargaBackUp = () => {
            RequestPOST("/API/empresas360/backup_chat", {
                id360: sesion_cookie.id_usuario
            }).then((response) => {
                for (var i = 0; i < (response.length); i++) {
                    if (response[i].idGroup !== null) {
                        response[i].to_id360 = response[i].idGroup;
                    }
                    if (response[i].id360 === null) {
                        despliegaMensajeSistema(response[i].message, response[i].to_id360, response[i].date_created, response[i].time_created, false);
                    } else {
                        if (response[i].id360 === sesion_cookie.id_usuario) {
                            agregar_chat_enviado(response[i], false);
                        } else {
                            recibir_chat(response[i], false);
                        }
                    }
                }
                NotificacionesActivadas = true;
                console.log("Ya acabo el backup de mensajes");
                ocultaSpin();
            });
        };

        const verificaGrupos = () => {
            if (grupos.length > 0) {

                RequestPOST("/API/empresas360/informacion_grupos", {"grupos": grupos, "idUser": sesion_cookie.idUsuario_Sys}).then((response) => {

                    $.each(response, function (index, grupo) {
                        //directorio.push(empleado);
                        //directorio_usuario.push(empleado);

                        let participantesConGuion = grupo.participantes.split(",");
                        let participantes = [];
                        let csg = participantesConGuion.length;
                        for (let x = 0; x < csg; x++) {
                            let partesParticipantes = participantesConGuion[x].split("-");
                            participantes.push(partesParticipantes[0]);
                        }
                        let dataContac = {
                            "id360": grupo.id_grupo,
                            "nombre_grupo": grupo.nombre_grupo,
                            "img": grupo.icono_grupo,
                            "descripcion_grupo": grupo.descripcion_grupo,
                            "participantes": participantes.toString(),
                            "participantesRol": participantesConGuion
                        };

                        let paraDirectorio = {
                            "nombre": grupo.nombre_grupo,
                            "apellido_paterno": "",
                            "apellido_materno": "",
                            "img": grupo.icono_grupo,
                            "id360": grupo.id_grupo
                        };
                        directorio_usuario.push(paraDirectorio);

                        let estatusEnGrupo = grupo.estatusEnGrupo === "0" ? false : true;

                        contacto_chat(dataContac, true, estatusEnGrupo);
                    });

                    cargaBackUp();

                });

            } else
                cargaBackUp();
        };

        if (fueraDeDirectorio.length > 0) {
            console.log("Fuera de directorio");
            console.log(fueraDeDirectorio);
            RequestPOST("/API/empresas360/directorio/un_usuario", fueraDeDirectorio).then((response) => {
                $.each(response, function (index, empleado) {
                    if (empleado.success) {
                        directorio.push(empleado);
                        directorio_usuario.push(empleado);
                        contacto_chat(empleado);
                    }
                });
                verificaGrupos();
            });

        } else
            verificaGrupos();

    });


});

const cargaMasMensajes = (id360, esGrupo) => {

    return new Promise(function (resolve, reject) {
        let init, limit;

        init = (CantidadMensajesPorChat[id360].cantidad - 20) < 0 ? 0 : CantidadMensajesPorChat[id360].cantidad - 20;
        limit = (CantidadMensajesPorChat[id360].cantidad - 20) < 0 ? CantidadMensajesPorChat[id360].cantidad : 20;

        let dataMasMensajes = {
            "id360-1": id360,
            "id360-2": sesion_cookie.idUsuario_Sys,
            "init": init,
            "limit": limit
        };

        if (esGrupo)
            dataMasMensajes.grupo = true;

        RequestPOST("/API/empresas360/carga_mas_mensajes_chat", dataMasMensajes).then((response) => {

            $('#messages_' + id360).animate({

                scrollTop: 500

            }, 0, "swing", () => {

                CantidadMensajesPorChat[id360].cantidad -= 20;
                NotificacionesActivadas = false;
                if (response.length === 1) {
                    if (response[0].idGroup !== null) {
                        response[0].to_id360 = response[0].idGroup;
                    }
                    if (response[0].id360 === null) {
                        despliegaMensajeSistema(response[0].message, response[0].to_id360, response[0].date_created, response[0].time_created, true);
                    } else {
                        if (response[0].id360 === sesion_cookie.id_usuario) {
                            agregar_chat_enviado(response[0], true);
                        } else {
                            recibir_chat(response[0], true);
                        }
                    }
                } else {
                    for (var i = response.length - 1; i >= 0; i--) {
                        if (response[i].idGroup !== null) {
                            response[i].to_id360 = response[i].idGroup;
                        }
                        if (response[i].id360 === null) {
                            despliegaMensajeSistema(response[i].message, response[i].to_id360, response[i].date_created, response[i].time_created, true);
                        } else {
                            if (response[i].id360 === sesion_cookie.id_usuario) {
                                agregar_chat_enviado(response[i], true);
                            } else {
                                recibir_chat(response[i], true);
                            }
                        }
                    }
                }
                NotificacionesActivadas = true;

                let liCargaMensajesAnterior = $("#contact_messaging" + id360).find(".liMasMensajes");

                document.querySelector("#contact_messaging" + id360 + " .liMasMensajes").scrollIntoView();
                liCargaMensajesAnterior.remove();

                if (CantidadMensajesPorChat[id360].cantidad > 0) {
                    let liMasMensajes = $("<li></li>").addClass("liMasMensajes");
                    let spanMasMensajes = $("<span></span>").addClass("spanMasMensajes");
                    let iconManMensajes = $("<li></li>").addClass("fas fa-spinner iconMasMensajes");
                    spanMasMensajes.text("Más mensajes...");
                    spanMasMensajes.prepend(iconManMensajes);
                    spanMasMensajes.data("id360-1", id360);
                    spanMasMensajes.data("id360-2", sesion_cookie.idUsuario_Sys);
                    liMasMensajes.append(spanMasMensajes);
                    $("#contact_messaging" + id360).prepend(liMasMensajes);

                    /*
                     * EVENTO CLICK PARA CARGAR MáS MENSAJES
                     */

                    spanMasMensajes.click(() => {
                        console.log("Voy a buscar más mensajes de " + id360);
                        cargaMasMensajes(id360, esGrupo);
                    });

                    resolve(true);

                } else
                    resolve(false);

            });

        });
    });

};

function entraDrag(e, id) {
    let contenedorArrastra = $("#" + id);
    if (contenedorArrastra.length) {
        contenedorArrastra.removeClass("d-none");
    }
    console.log("Entra");
}

function saleDrag(e, id) {
    console.log("sale");
}

function terminaDrag(e, id) {
    let contenedorArrastra = $("#" + id);
    if (contenedorArrastra.length) {
        contenedorArrastra.addClass("d-none");
    }
}

function contacto_chat(user, group, statusGroup) {

    if (!$("#profile_chat" + user.id360).length && user.id360 !== undefined) {

        let li = $("<li></li>").addClass("contact");
        if (CantidadMensajesPorChat[user.id360] !== undefined && CantidadMensajesPorChat[user.id360].esFavorito) {
            li.addClass("contactoFavorito");
        } else {
            li.addClass("contactoNoFavorito");
        }
        li.attr("id", "profile_chat" + user.id360);
        let div = $("<div></div>").addClass("wrap");
        let span = $("<span></span>").addClass("contact-status");
        span.addClass("online");
        let img = $("<div></div>");
        img.addClass("img");
        img.css({
            "background": "url('" + user.img + "')",
            "background-size": "cover",
            "background-position": "center",
            "background-repeat": "no-repeat"
        });
        let meta = $("<div></div>").addClass("meta");
        let name = $("<p></p>").addClass("name");
        if (group)
            name.text(user.nombre_grupo);
        else
            name.text(user.nombre + " " + user.apellido_paterno + " " + user.apellido_materno);
        let preview = $("<p></p>").addClass("preview");
        preview.attr("id", "preview_" + user.id360);
        meta.append(name);
        meta.append(preview);

        let social_media = $("<div></div>").addClass("social-media");

        let div_search = $("<div></div>");
        div_search.css({"display": "contents"});
        let icon_search = $("<i class=\"fas fa-search\"></i>");
        icon_search.css({
            "background": "#fff",
            "padding": "17px",
            "font-size": "60px",
            "width": "50px",
            "cursor": "pointer",
            "color": "rgb(64, 71, 79)"
        });

        let div_favorito = $("<div></div>");
        div_favorito.attr("id", "iconoFavorito" + user.id360);
        div_favorito.css({"display": "contents"});
        let icon_favorito = $("<i></i>");
        icon_favorito.css({
            "background": "#fff",
            "padding": "10px",
            "font-size": "60px",
            "width": "50px",
            "cursor": "pointer",
            "color": "yellowgreen"
        });

        div_favorito.click(() => {

            let dataFavorito = {
                "id360": sesion_cookie.idUsuario_Sys,
                "id360Favorito": user.id360,
                "fecha": getFecha(),
                "hora": getHora()
            };

            dataFavorito.esGrupo = group ? 1 : 0;

            let services = CantidadMensajesPorChat[user.id360] !== undefined && CantidadMensajesPorChat[user.id360].esFavorito ? "/API/empresas360/eliminar_usuario_favorito" : "/API/empresas360/agregar_usuario_favorito";

            RequestPOST(services, dataFavorito).then((response) => {

                if (services === "/API/empresas360/eliminar_usuario_favorito") {
                    NotificacionToas.fire({
                        title: 'Contacto eliminado como favorito'
                    });
                } else {
                    NotificacionToas.fire({
                        title: 'Contacto favorito'
                    });
                }

                console.log(response);
                console.log("Se debio enviar por socket");
            });

        });

        if (CantidadMensajesPorChat[user.id360] !== undefined && CantidadMensajesPorChat[user.id360].esFavorito) {
            icon_favorito.addClass("fas fa-star");
        } else {
            icon_favorito.addClass("far fa-star");
        }

        let div_menu_chat = $("<div></div>");
        div_menu_chat.css({"display": "contents", "position": "relative"});
        let icon_menu_chat = $("<i class=\"fas fa-ellipsis-h\"></i>");
        icon_menu_chat.css({
            "background": "#40474f",
            "padding": "17px",
            "font-size": "60px",
            "width": "50px",
            "cursor": "pointer"
        });

        let menu_chat = $("<ul></ul>");
        menu_chat.addClass("menu_chat");

        let opcionIniciarLlamada = $("<li></li>").addClass("opcion_menu_chat");
        opcionIniciarLlamada.text("Iniciar llamada");
        let iconOpcionIniciarLlamada = $("<i class=\"fas fa-phone\"></i>");
        iconOpcionIniciarLlamada.css({"margin-right": "10px"});
        opcionIniciarLlamada.prepend(iconOpcionIniciarLlamada);
        menu_chat.append(opcionIniciarLlamada);

        let opcionVaciarChat = $("<li></li>").addClass("opcion_menu_chat");
        opcionVaciarChat.text("Vaciar chat");
        let iconVaciarChat = $("<i class=\"fas fa-trash\"></i>");
        iconVaciarChat.css({"margin-right": "10px"});
        opcionVaciarChat.prepend(iconVaciarChat);
        menu_chat.append(opcionVaciarChat);

        div_menu_chat.append(menu_chat);

        /*
         * CONTROLES PARA LLAMADA Y MENSAJES
         */
        let divControlesChat = $("<div></div>").addClass("controlesChat");

        let buttonEnviarMensaje = $("<button></button>");
        buttonEnviarMensaje.addClass("btn btn-enviarMensajeChat");
        buttonEnviarMensaje.html('<i class="fas fa-comment-dots"></i>');

        let buttonRealizarLlamadaChat = $("<button></button>");
        buttonRealizarLlamadaChat.addClass("btn btn-realizarLlamadaChat");
        buttonRealizarLlamadaChat.html('<i class="fas fa-phone"></i>');

        divControlesChat.append(buttonEnviarMensaje);
        divControlesChat.append(buttonRealizarLlamadaChat);

        /*
         * CONTENEDOR MENSAJES NO LEIDOS
         */
        let divMensajesNoLeidos = $("<div></div>").addClass("mensajesNoLeidos");
        divMensajesNoLeidos.attr("id", "mensajesNoLeidos_" + user.id360);
        let spanMensajesNoLeidos = $("<span></span>").addClass("badge cantidadMensajesNoLeidos");
        divMensajesNoLeidos.append(spanMensajesNoLeidos);
        if (CantidadMensajesPorChat[user.id360] !== undefined && CantidadMensajesPorChat[user.id360].cantidadMensajesNoLeidos > 0) {
            spanMensajesNoLeidos.text(CantidadMensajesPorChat[user.id360].cantidadMensajesNoLeidos);
        } else {
            divMensajesNoLeidos.addClass("d-none");
        }

        meta.append(divControlesChat);
        meta.append(divMensajesNoLeidos);

        div.append(span);
        div.append(img);
        div.append(meta);

        li.append(div);

        $("#message_contacts").prepend(li);

        let content = $("<div></div>").addClass("content");
        let divAux = $("<div></div>");
        divAux.css({
            "float": "left",
            "width": "100%",
            "height": "100%",
            "overflow-y": "scroll",
            "position": "relative"
        });
        content.attr("id", "contenedor_mensajes_" + user.id360);
        content.addClass("d-none");
        let contact_profile = $("<div></div>").addClass("contact-profile");
        let img_profile = $("<div></div>").addClass("img");
        img_profile.css({
            "background": "url('" + user.img + "')",
            "background-size": "cover",
            "background-position": "center",
            "background-repeat": "no-repeat"
        });
        let nombre = $("<p></p>");
        if (group)
            nombre.text(user.nombre_grupo);
        else
            nombre.text(user.nombre + " " + user.apellido_paterno + " " + user.apellido_materno);

        let messages = $("<div></div>").addClass("messages");
        messages.attr("id", "messages_" + user.id360);
        if (group) {
            messages.data("grupo", "true");
            messages.data("participantes", user.participantes);
        }
        messages.attr("ondragenter", "entraDrag(event,'contenedor-drag-drop_" + user.id360 + "')");
        messages.attr("onmouseout", "terminaDrag(event,'contenedor-drag-drop_" + user.id360 + "')");
        messages.attr("ondragend", "terminaDrag(event,'contenedor-drag-drop_" + user.id360 + "')");
        let ul = $("<ul></ul>").addClass("p-0");
        //    ul.id = "contact_messaging" + user.id360;
        ul.attr("id", "contact_messaging" + user.id360);

        /*
         * CARGA MAS MENSAJES
         */

        if (CantidadMensajesPorChat[user.id360] !== undefined && CantidadMensajesPorChat[user.id360].cantidad > 0) {
            let liMasMensajes = $("<li></li>").addClass("liMasMensajes");
            let spanMasMensajes = $("<span></span>").addClass("spanMasMensajes");
            let iconManMensajes = $("<li></li>").addClass("fas fa-spinner iconMasMensajes");
            spanMasMensajes.text("Más mensajes...");
            spanMasMensajes.prepend(iconManMensajes);
            spanMasMensajes.data("id360-1", user.id360);
            spanMasMensajes.data("id360-2", sesion_cookie.idUsuario_Sys);
            liMasMensajes.append(spanMasMensajes);
            ul.append(liMasMensajes);

            /*
             * EVENTO CLICK PARA CARGAR MáS MENSAJES
             */

            spanMasMensajes.click(() => {
                console.log(user.id360);
                cargaMasMensajes(user.id360, group);
            });

        }

        //    let div = $("<div></div>").addClass("wrap")
        let message_input = $("<div></div>").addClass("message-input");
        let wrap = $("<div></div>").addClass("wrap container-fluid");
        let input = $("<input>").addClass("wrap");
        input.attr("id", "message_input_" + user.id360);
        input.attr("type", "text");
        input.attr("placeholder", "Escribe un mensaje aqui....");
        input.attr("maxlength", "400");

        let divCargando = $("<div></div>").addClass("contenedor-cargando-chat d-none");
        let spinCargando = $("<div></div>").addClass("spin-cargando-chat");
        let spin = $("<img>").attr("src", PathRecursos + "images/spin.gif");

        spinCargando.append(spin);
        divCargando.append(spinCargando);
        message_input.append(divCargando);

        /*
         * 
         * @type jQuery
         * DESARROLLO PARA CHAT EMPRESARIAL, EN DONDE SE SOPORTEN MENSAJED DE TEXTO Y ARCHIVOS ADJUNTO DE CUALQUIER CLASE
         * 
         */

        /* BOTON ENVIAR MENSAJE */
        let button = $("<button></button>").addClass("submit btn btn-block");
        button.attr("id", "btn_enviar" + user.id360);
        let paper_plane = $("<i class=\"fa fa-paper-plane\" aria-hidden=\"true\"></i>").addClass("wrap");
        button.append(paper_plane);

        /* BOTON ADJUNTO */
        let buttonAttachment = $("<button></button>").addClass("btn btn-block");
        let paperclip = $(" <i class=\"fa fa-paperclip\" aria-hidden=\"true\"></i>").addClass("wrap");
        buttonAttachment.attr("type", "button");
        buttonAttachment.attr("id", "btn-adjunto-" + user.id360);
        buttonAttachment.append(paperclip);
        buttonAttachment.css({"background-color": "grey"});

        /* BOTON DE EMOJI */
        let buttonEmoji = $("<button></button>").addClass("btn btn-block btnEmoji");
        let iconEmoji = $(" <i class=\"far fa-smile-beam\" aria-hidden=\"true\"></i>").addClass("wrap");
        buttonEmoji.append(iconEmoji);
        buttonEmoji.attr("id", "btn-emoji-" + user.id360);
        buttonEmoji.attr("type", "button");
        buttonEmoji.css({"background-color": "teal"});

        /* CONTROLES CHAT */
        let containerChat = $("<div class=\"contenedor-chat-controles\"></div>");
        let rowChat = $("<div style=\"padding:0 !important;\" class=\"row\"></div>");

        let emojiPicker = $("<emoji-picker></emoji-picker>");
        emojiPicker.addClass("d-none emojipicker");
        emojiPicker.css({
            "width": "75%"
        });
        emojiPicker.attr("id", "emojipicket" + user.id360);
        emojiPicker.data("idcontacto", user.id360);
        rowChat.prepend(emojiPicker);
        buttonEmoji.click(() => {
            emojiPicker.toggleClass("d-none");
        });

        let colInput = $("<div style=\"padding:0 !important;\" class=\"col-9\"></div>");
        colInput.append(input);

        let colButtonEmoji = $("<div style=\"padding:0 !important;\" class=\"col-1\"></div>");
        colButtonEmoji.append(buttonEmoji);

        let colButtonAttachment = $("<div style=\"padding:0 !important;\" class=\"col-1\"></div>");
        colButtonAttachment.append(buttonAttachment);

        let colButtonSubmit = $("<div style=\"padding:0 !important;\" class=\"col-1\"></div>");
        colButtonSubmit.append(button);

        /*Input attachment */
        let inputAttachment = $("<input />");
        inputAttachment.attr("id", "inputAttachment" + user.id360);
        inputAttachment.attr("class", "d-none");
        inputAttachment.attr("type", "file");
        inputAttachment.attr("name", "attachment");

        /* Input para arrastrar y soltar */
        let inputArrastraSuelta = $("<input>").addClass("inputAttachmentArrastra");
        inputArrastraSuelta.attr("id", "inputAttachmentArrastra" + user.id360);
        inputArrastraSuelta.attr("type", "file");
        inputArrastraSuelta.attr("name", "attachment");
        let contenedorArrastraYSuelta = $("<div></div>").addClass("contenedor-drag-drop d-none");
        contenedorArrastraYSuelta.attr("id", "contenedor-drag-drop_" + user.id360);
        contenedorArrastraYSuelta.append(inputArrastraSuelta);

        /* Controles preview*/
        let rowPreview = $("<div></div>").addClass("row").attr("id", "rowPreview").css({"display": "none"});
        let columPreview = $("<div></div>").addClass("col-12");
        columPreview.css({
            "background-color": "white",
            "padding": "0"
        });
        let containerPreview = $("<div></div>").attr("id", "preview-attachment");
        columPreview.append(containerPreview);
        rowPreview.append(columPreview);

        let rowButtonAttachment = $("<div></div>").addClass("row").css({"display": "none"});

        let columnButtonCancel = $("<div></div>").addClass("col-6").css({"padding": "0"});
        let buttonCancelAttachment = $("<button>Cancelar</button>").attr("type", "buttton").addClass("btn btn-block").css({"background-color": "grey"});
        columnButtonCancel.append(buttonCancelAttachment);

        let columnButtonSendAttachment = $("<div></div>").addClass("col-6").css({"padding": "0"});
        let buttonSendAttachment = $("<button>Enviar</button>").attr("type", "button").addClass("btn btn-block").attr("id", "sendAttachment");
        columnButtonSendAttachment.append(buttonSendAttachment);

        rowButtonAttachment.append(columnButtonCancel);
        rowButtonAttachment.append(columnButtonSendAttachment);

        let rowNameFile = $("<div></div>").addClass("row").css({"display": "none"});
        let colName = $("<div></div>").addClass("col-12").css({"padding": "0"});
        let nameFile = $("<p></p>").attr("id", "nombreArchivoPreview");
        nameFile.css({
            "margin": "0",
            "background-color": "white",
            "color": "black",
            "font-size": "1.3rem",
            "padding": "0 0 20px 0"
        });
        colName.append(nameFile);
        rowNameFile.append(colName);

        let rowContenidoMensajeOperaciones = $("<div></div>").addClass("row filaMensajesOperaciones d-none");
        rowContenidoMensajeOperaciones.attr("id", "filaMensajesOperaciones_" + user.id360);
        let colContenidoMensajeOperaciones = $("<div></div>").addClass("col-12").css({"padding": "0"});
        let contenidoMensajeOperaciones = $("<p></p>").attr("id", "contenidoMensajeOperaciones_" + user.id360);

        contenidoMensajeOperaciones.css({
            "margin": "0",
            "background-color": "gray",
            "padding": "10px",
            "text-align": "left"
        });

        let spanAccion = $("<span></span>");
        spanAccion.attr("id", "accionMensajesOpciones_" + user.id360);
        spanAccion.css({
            "font-size": "1.3rem",
            "font-style": "italic"
        });

        let spanContenidoMensajeOperaciones = $("<span></span>");
        spanContenidoMensajeOperaciones.css({
            "padding-right": "5%",
            "display": "block",
            "margin-top": "5px"
        });
        let buttonCerrarContenidoMensajeOperaciones = $("<button></button>").addClass("btn");
        buttonCerrarContenidoMensajeOperaciones.text("x");
        buttonCerrarContenidoMensajeOperaciones.css({
            "position": "absolute",
            "top": "0",
            "right": "20px",
            "background-color": "transparent",
            "height": "100%",
            "padding": "10px"
        });
        buttonCerrarContenidoMensajeOperaciones.html('<i class="fas fa-times"></i>');
        buttonCerrarContenidoMensajeOperaciones.click(() => {
            rowContenidoMensajeOperaciones.addClass("d-none");
            contenidoMensajeOperaciones.find("span").text("");
            banderaEditando = false;
            banderaEditandoGrupo = false;
            banderaRespondiendo = false;
            idMensajeEditando = null;
            idMensajeRespondiendo = null;
        });

        contenidoMensajeOperaciones.append(spanAccion);
        contenidoMensajeOperaciones.append(spanContenidoMensajeOperaciones);
        contenidoMensajeOperaciones.append(buttonCerrarContenidoMensajeOperaciones);
        colContenidoMensajeOperaciones.append(contenidoMensajeOperaciones);
        rowContenidoMensajeOperaciones.append(colContenidoMensajeOperaciones);

        rowChat.append(colInput);
        rowChat.append(colButtonEmoji);
        rowChat.append(colButtonAttachment);
        rowChat.append(colButtonSubmit);

        if (group) {

            if (statusGroup !== undefined && statusGroup !== null && statusGroup === false) {
                input.attr("disabled", true);
                input.attr("placeholder", "No puedes enviar mensajes en este chat");
                input.css({
                    "text-align": "center",
                    "font-weight": "bold",
                    "text-transform": "uppercase"
                });
                button.attr("disabled", true);
            }

        }

        rowChat.append(inputAttachment);

        containerChat.append(rowPreview);
        containerChat.append(rowNameFile);
        containerChat.append(rowButtonAttachment);
        containerChat.append(rowContenidoMensajeOperaciones);
        containerChat.append(rowChat);

        wrap.append(containerChat);

        message_input.append(wrap);
        messages.append(ul);

        div_menu_chat.click(() => {
            menu_chat.toggleClass("desplegado");
        });

        div_search.append(icon_search);
        div_favorito.append(icon_favorito);
        div_menu_chat.append(icon_menu_chat);
        social_media.append(div_search);
        social_media.append(div_favorito);
        social_media.append(div_menu_chat);

        contact_profile.append(img_profile);
        contact_profile.append(nombre);
        contact_profile.append(social_media);
        divAux.append(contact_profile);
        divAux.append(messages);
        divAux.append(message_input);
        divAux.prepend(contenedorArrastraYSuelta);

        let divDescripcionContacto;
        let divBusccador;
        let divDocumentosCompartidos;

        /*
         * PANEL DE ARCHIVOS COMPARTIDOS CON EL CHAT
         */
        divDocumentosCompartidos = $("<div></div>").addClass("d-none pt-5");
        divDocumentosCompartidos.css({
            "width": "30%",
            "height": "100%",
            "background-color": "rgba(64,71,79,0.1)",
            "float": "left",
            "overflow-y": "scroll",
            "padding-bottom": "50px",
            "position": "relative"
        });

        let buttonCerrarArchivosCompartidos = $("<button></button>").addClass("btn");
        buttonCerrarArchivosCompartidos.append('<i class="fas fa-arrow-left"></i>');
        buttonCerrarArchivosCompartidos.css({
            "position": "absolute",
            "top": "0",
            "left": "0",
            "font-size": "2rem"
        });

        divDocumentosCompartidos.append(buttonCerrarArchivosCompartidos);

        /*
         * CONTENIDO DE LA DESCRIPCIÓN DEL CONTACTO.
         * PANEL DERECHO AL DARLE CLICK AL NOMBRE DEL USUARIOS
         */
        divBusccador = $("<div></div>").addClass("d-none pt-5");
        divBusccador.css({
            "width": "30%",
            "height": "100%",
            "background-color": "rgba(64,71,79,0.1)",
            "float": "left",
            "overflow-y": "scroll",
            "padding-bottom": "50px"
        });

        let buttonCerrarBuscador = $("<button></button>").addClass("btn");
        buttonCerrarBuscador.append('<i class="far fa-times-circle"></i>');
        buttonCerrarBuscador.css({
            "position": "absolute",
            "top": "0",
            "right": "0",
            "font-size": "2rem"
        });

        divBusccador.append(buttonCerrarBuscador);
        buttonCerrarBuscador.click(() => {
            divBusccador.addClass("d-none");
            divAux.animate({
                width: '100%'
            }, 500);
        });

        let formGroupBuscador = $("<div></div>").addClass("form-group");
        formGroupBuscador.css({
            "padding": "10px"
        });
        let inputBuscador = $("<input>").addClass("form-control");
        inputBuscador.attr("type", "search");
        inputBuscador.attr("placeholder", "Buscar mensaje...");
        inputBuscador.css({
            "border-radius": "10px"
        });
        formGroupBuscador.append(inputBuscador);
        divBusccador.append(formGroupBuscador);

        let mensajeInicioBuscador = $("<p></p>");
        mensajeInicioBuscador.css({
            "color": "black"
        });
        let nombreBienBus = user.nombre !== undefined && user.nombre !== null ? user.nombre : user.nombre_grupo;
        mensajeInicioBuscador.text("Buscar mensajes con " + nombreBienBus);
        divBusccador.append(mensajeInicioBuscador);

        let mensajeBuscando = $("<p></p>").addClass("d-none");
        mensajeBuscando.css({
            "color": "black"
        });
        mensajeBuscando.text("Buscando mensajes...");
        divBusccador.append(mensajeBuscando);

        let sinMensajesEncontrados = $("<p></p>").addClass("d-none");
        sinMensajesEncontrados.css({
            "color": "black"
        });
        sinMensajesEncontrados.text("No se encontraron mensajes");
        divBusccador.append(sinMensajesEncontrados);

        let valBusca;
        inputBuscador.keyup(() => {

            valBusca = inputBuscador.val();
            divBusccador.find("ul").remove();

            sinMensajesEncontrados.addClass("d-none");
            if (valBusca.length < 2) {
                mensajeInicioBuscador.removeClass("d-none");
                mensajeBuscando.addClass("d-none");
            } else {
                mensajeBuscando.removeClass("d-none");
                mensajeInicioBuscador.addClass("d-none");

                let dataBusqueda = {
                    "id360-1": user.id360,
                    "id360-2": sesion_cookie.idUsuario_Sys,
                    "busqueda": valBusca
                };

                if (group) {
                    dataBusqueda.esGrupo = true;
                }

                RequestPOST("/API/empresas360/buscar_mensajes", dataBusqueda).then((response) => {
                    mensajeBuscando.addClass("d-none");

                    if (response.length > 0) {

                        divBusccador.find("ul").remove();
                        let ulResultadosBusqueda = $("<ul></ul>");
                        ulResultadosBusqueda.css({
                            "padding-left": "0",
                            "list-style": "none"
                        });

                        $.each(response, (index, mensaje) => {

                            let liMensajeBusqueda = $("<li></li>");
                            let smallTexto = $("<small></small>");
                            smallTexto.css({
                                "display": "block",
                                "padding": "10px 0"
                            });
                            smallTexto.text(mensaje.message);
                            liMensajeBusqueda.html(smallTexto);

                            liMensajeBusqueda.css({
                                "text-align": "left",
                                "padding": "10px",
                                "font-weight": "400",
                                "white-space": "nowrap",
                                "overflow": "hidden",
                                "text-overflow": "ellipsis",
                                "color": "black",
                                "border-bottom": "1px solid lightslategray",
                                "cursor": "pointer"
                            });

                            let fechaMensajeBusqueda = moment(mensaje.date_created);
                            let smallFecha = $("<small></small>");
                            smallFecha.text(fechaMensajeBusqueda.format("DD/MMM/YY"));
                            smallFecha.css({
                                "display": "block"
                            });
                            liMensajeBusqueda.prepend(smallFecha);

                            liMensajeBusqueda.mouseenter(() => {
                                liMensajeBusqueda.css({"background-color": "rgba(0, 0, 0, 0.1)"});
                            }).mouseleave(() => {
                                liMensajeBusqueda.css({"background-color": "transparent"});
                            });

                            liMensajeBusqueda.click(() => {

                                console.log(mensaje.id);

                                const remarcaMensaje = (idMensaje) => {
                                    document.querySelector("#mensaje_" + idMensaje).scrollIntoView();
                                    let resaltar = setInterval(() => {
                                        $("#mensaje_" + idMensaje).toggleClass("respondida");
                                    }, 250);

                                    setTimeout(() => {
                                        clearInterval(resaltar);
                                        $("#mensaje_" + idMensaje).removeClass("respondida");
                                    }, 2000);
                                };

                                if ($("#mensaje_" + mensaje.id).length) {

                                    remarcaMensaje(mensaje.id);

                                } else {

                                    const buscaMensajeRespuesta = () => {
                                        if ($("#contact_messaging" + user.id360).find(".liMasMensajes").length) {
                                            console.log("Voy a buscar mas mensajes " + user.id360);
                                            let esGrupo = mensaje.idGroup !== undefined && mensaje.idGroup !== null ? true : false;
                                            cargaMasMensajes(user.id360, esGrupo).then((response) => {
                                                if ($("#mensaje_" + mensaje.id).length) {
                                                    remarcaMensaje(mensaje.id);
                                                } else if (response) {
                                                    buscaMensajeRespuesta();
                                                } else {
                                                    NotificacionToas.fire({
                                                        title: 'No se ha encontrado el mensaje'
                                                    });
                                                }

                                            });
                                        } else {
                                            NotificacionToas.fire({
                                                title: 'No se ha encontrado el mensaje'
                                            });
                                        }
                                    };

                                    buscaMensajeRespuesta();

                                }

                            });

                            ulResultadosBusqueda.append(liMensajeBusqueda);

                        });

                        divBusccador.append(ulResultadosBusqueda);

                    } else {
                        sinMensajesEncontrados.removeClass("d-none");
                    }

                });

            }
        });

        div_search.click(() => {

            inputBuscador.val("");
            divBusccador.find("ul").remove();

            divDescripcionContacto.addClass("d-none");
            divBusccador.addClass("d-none");
            if (divBusccador.hasClass("d-none")) {

                divAux.animate({
                    width: '70%'
                }, 500, function () {
                    divBusccador.removeClass("d-none");
                });

            } else {
                divBusccador.addClass("d-none");
                divAux.animate({
                    width: '100%'
                }, 500);
            }

        });

        /*
         * CONTENIDO DE LA DESCRIPCIÓN DEL CONTACTO.
         * PANEL DERECHO AL DARLE CLICK AL NOMBRE DEL USUARIOS
         */

        divDescripcionContacto = $("<div></div>").addClass("d-none pt-5");
        divDescripcionContacto.css({
            "width": "30%",
            "height": "100%",
            "background-color": "rgba(64,71,79,0.1)",
            "float": "left",
            "overflow-y": "scroll",
            "padding-bottom": "50px"
        });

        buttonCerrarArchivosCompartidos.click(() => {
            divDocumentosCompartidos.addClass("d-none");
            divDescripcionContacto.removeClass("d-none");
        });

        let buttonCerrarDescripcion = $("<button></button>").addClass("btn");
        buttonCerrarDescripcion.append('<i class="far fa-times-circle"></i>');
        buttonCerrarDescripcion.css({
            "position": "absolute",
            "top": "0",
            "right": "0",
            "font-size": "2rem"
        });
        divDescripcionContacto.append(buttonCerrarDescripcion);
        buttonCerrarDescripcion.click(() => {
            divDescripcionContacto.addClass("d-none");
            divAux.animate({
                width: '100%'
            }, 500);
        });

        let imgUserDescripcion = $("<img>");
        imgUserDescripcion.css({
            "width": "85%",
            "max-height": "250px",
            "border-radius": "50%",
            "margin-bottom": "30px",
            "cursor": "pointer"
        });
        imgUserDescripcion.attr("alt", "Foto de Perfil");
        imgUserDescripcion.attr("src", user.img);
        imgUserDescripcion.attr("id", "imagenPanelDescripcion_" + user.id360);

        /*Input attachment */
        let inputFotoPerfil = $("<input />").addClass("d-none");
        inputFotoPerfil.attr("id", "inputFotoPerfil_" + user.id360);
        inputFotoPerfil.attr("type", "file");
        inputFotoPerfil.attr("name", "fotoPerfil");
        divDescripcionContacto.append(inputFotoPerfil);

        inputFotoPerfil.change((e) => {
            guarda_adjunto_chat("inputFotoPerfil_" + user.id360, user.id360).then((response) => {

                console.log(response);
                let imagenCambio = response;
                inputFotoPerfil.val(null);

                let dataEditaFotoGrupo = {
                    "fecha": getFecha(),
                    "hora": getHora(),
                    "idGroup": user.id360,
                    "columna": "icono_grupo",
                    "valor": imagenCambio
                };

                RequestPOST("/API/empresas360/cambiar_parametro_grupo", dataEditaFotoGrupo).then((response) => {
                    if (response.success) {
                        console.log("Se cambio la foto exitosamente");
                        console.log("Se debio enviar por socket");
                        let mensajeCambio = sesion_cookie.nombre + " " + sesion_cookie.apellidos + " ha cambiado la foto del grupo";
                        mensajeSistema(mensajeCambio, user.id360, true);
                    }
                });

            });
        });

        imgUserDescripcion.click((e) => {

            let imagenPreview = $("<img>");
            imagenPreview.attr("src", $("#imagenPanelDescripcion_" + user.id360).attr("src"));
            imagenPreview.css({
                "max-width": "650px",
                "max-height": "650px"
            });

            let myMenu = [{
                    icon: 'fa fa-eye',
                    label: 'Ver foto',
                    action: function (option, contextMenuIndex, optionIndex) {
                        Swal.fire({
                            width: 700,
                            showCancelButton: false,
                            showConfirmButton: false,
                            html: imagenPreview
                        });
                    },
                    submenu: null,
                    disabled: false
                }];

            if (group) {
                myMenu.push({
                    icon: 'fa fa-edit',
                    label: 'Cambiar foto',
                    action: function (option, contextMenuIndex, optionIndex) {
                        inputFotoPerfil.click();
                    },
                    submenu: null,
                    disabled: false
                });
            }

            superCm.createMenu(myMenu, e);
        });

        let pNombreDescripcion = $("<p></p>");
        pNombreDescripcion.attr("id", "tituloGrupoDescripcion_" + user.id360);
        pNombreDescripcion.css({
            "color": "#40474f",
            "font-size": "1.3rem",
            "text-align": "left",
            "padding-left": "20px"
        });

        if (group) {
            pNombreDescripcion.text(" " + user.nombre_grupo);

            //opcion para editar
            let buttonEditaNombre = $("<button></button>").addClass("btn");
            let iconEditarNombre = $("<i></i>").addClass("fas fa-edit ml-2");
            buttonEditaNombre.css("cursor", "pointer");
            buttonEditaNombre.append(iconEditarNombre);
            pNombreDescripcion.append(buttonEditaNombre);

            buttonEditaNombre.click(() => {
                let contenedorNombreGrupo = $("<div></div>");

                let formNombreGrupo = $("<form></form>");
                formNombreGrupo.attr("id", "formCambiaTituloGrupo");
                formNombreGrupo.attr("autocomplete", "off");

                let formGroupNombreGrupo = $("<div></div>").addClass("form-group");
                let labelNombreGrupo = $("<label></label>");
                labelNombreGrupo.text("Título del grupo");
                labelNombreGrupo.attr("for", "inputNombreGrupo");
                let inputNombreGrupo = $("<input>").addClass("form-control");
                inputNombreGrupo.attr("id", "inputNombreGrupo");
                inputNombreGrupo.attr("type", "text");
                inputNombreGrupo.attr("required", "true");
                formGroupNombreGrupo.append(labelNombreGrupo);
                formGroupNombreGrupo.append(inputNombreGrupo);
                formNombreGrupo.append(formGroupNombreGrupo);

                let buttonSubmitCreaGrupo = $("<button></button>").addClass("btn btn-danger btn-block mt-4");
                buttonSubmitCreaGrupo.attr("type", "submit");
                buttonSubmitCreaGrupo.text("Cambiar titulo");
                formNombreGrupo.append(buttonSubmitCreaGrupo);

                contenedorNombreGrupo.append(formNombreGrupo);

                inputNombreGrupo.val(user.nombre_grupo);

                Swal.fire({
                    html: contenedorNombreGrupo,
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonText: 'Cancelar',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });

                $("#formCambiaTituloGrupo").submit((e) => {

                    e.preventDefault();
                    let nombreGrupo = $("#inputNombreGrupo").val().trim();

                    let dataEditaTituloGrupo = {
                        "fecha": getFecha(),
                        "hora": getHora(),
                        "idGroup": user.id360,
                        "columna": "nombre_grupo",
                        "valor": nombreGrupo
                    };

                    RequestPOST("/API/empresas360/cambiar_parametro_grupo", dataEditaTituloGrupo).then((response) => {
                        if (response.success) {
                            Swal.close();
                            let mensajeCambio = sesion_cookie.nombre + " " + sesion_cookie.apellidos + " ha cambiado el título del grupo";
                            mensajeSistema(mensajeCambio, user.id360, true);
                        }
                    });

                });

            });

        } else
            pNombreDescripcion.text(" " + user.nombre + " " + user.apellido_paterno + " " + user.apellido_materno);

        pNombreDescripcion.prepend('<i class="far fa-id-badge"></i>');

        divDescripcionContacto.append(imgUserDescripcion);
        divDescripcionContacto.append(pNombreDescripcion);

        if (user.telefono !== undefined && user.telefono !== null) {
            let pTelefonoDescripcion = $("<a>");
            pTelefonoDescripcion.css({
                "color": "#40474f",
                "font-size": "1.3rem",
                "text-align": "left",
                "padding-left": "20px",
                "display": "block",
                "margin-bottom": "1rem"
            });
            pTelefonoDescripcion.attr("href", "tel:" + user.telefono);
            pTelefonoDescripcion.text(" " + user.telefono);
            pTelefonoDescripcion.prepend('<i class="fas fa-phone"></i>');
            divDescripcionContacto.append(pTelefonoDescripcion);
        }

        if (user.correo !== undefined && user.correo !== null) {
            let pCorreoDescripcion = $("<a>");
            pCorreoDescripcion.css({
                "color": "#40474f",
                "font-size": "1.3rem",
                "text-align": "left",
                "padding-left": "20px",
                "display": "block",
                "margin-bottom": "1rem",
                "word-break": "break-all"
            });
            pCorreoDescripcion.attr("href", "mailto:" + user.correo);
            pCorreoDescripcion.text(" " + user.correo);
            pCorreoDescripcion.prepend('<i class="fas fa-envelope-open-text"></i>');
            divDescripcionContacto.append(pCorreoDescripcion);
        }

        nombre.click(() => {

            divBusccador.addClass("d-none");
            if (divDescripcionContacto.hasClass("d-none")) {

                divAux.animate({
                    width: '70%'
                }, 500, function () {
                    divDescripcionContacto.removeClass("d-none");
                });

            } else {
                divDescripcionContacto.addClass("d-none");
                divAux.animate({
                    width: '100%'
                }, 500);
            }

        });

        let agregaEnlaceArchivosCompartidos = () => {
            let enlaceArchivosCompartidas = $("<button></button>").addClass("btn btn-link btn-block");
            enlaceArchivosCompartidas.css({
                "text-align": "left",
                "padding-left": "20px"
            });
            enlaceArchivosCompartidas.html('<i class="fas fa-file-archive"></i>  Archivos compartidas');

            enlaceArchivosCompartidas.click(() => {

                divDescripcionContacto.addClass("d-none");
                divDocumentosCompartidos.removeClass("d-none");

                divDocumentosCompartidos.find(".gridArchivosCompartidos").remove();
                divDocumentosCompartidos.find("p").remove();

                let dataFotosCompartidas = {
                    "id360-1": user.id360,
                    "id360-2": sesion_cookie.idUsuario_Sys
                };

                if (group) {
                    dataFotosCompartidas.esGrupo = true;
                }

                RequestPOST("/API/empresas360/buscar_mensajes_archivos", dataFotosCompartidas).then((response) => {

                    if (response.length > 0) {

                        let contenedorArchivosEncontrados = $("<div></div>").addClass("container pt-3 gridArchivosCompartidos");

                        $.each(response, (index, mensaje) => {

                            let divArchivo = $("<div></div>").addClass("row");
                            divArchivo.css({
                                "padding": "0 10px",
                                "margin-bottom": "10px",
                                "cursor": "pointer"
                            });

                            let divImgTipo = $("<div></div>").addClass("col-3");
                            let imgTipo = $("<img>").attr("src", PathRecursos + "images/icono_default.png");
                            ;
                            imgTipo.css({
                                "height": "40px",
                                "width": "40px"
                            });

                            switch (mensaje.type) {

                                case "docx":
                                case "docm":
                                case "dotx":
                                case "dotm":
                                case "doc":
                                    imgTipo.attr("src", PathRecursos + "images/icono_word.png");
                                    break;

                                case "xlsx":
                                case "xlsm":
                                case "xlsb":
                                case "xltx":
                                case "xltm":
                                case "xls":
                                case "xlt":
                                    imgTipo.attr("src", PathRecursos + "images/icono_excel.png");
                                    break;

                                case "pptx":
                                case "pptm":
                                case "ppt":
                                case "xps":
                                case "potx":
                                case "ppsx":
                                    imgTipo.attr("src", PathRecursos + "images/icono_powerpoint.png");
                                    break;

                                case "pdf":
                                    imgTipo.attr("src", PathRecursos + "images/icono_pdf.png");
                                    tipo = 'docs/pdf';
                                    break;

                            }

                            divImgTipo.append(imgTipo);

                            let divNombreArchivo = $("<div></div>").addClass("col-6");
                            divNombreArchivo.css({
                                "display": "flex",
                                "justify-content": "center",
                                "align-items": "center"
                            });
                            let partesPorDiagonal = mensaje.message.split("/");
                            let nombreCorto = partesPorDiagonal[partesPorDiagonal.length - 1];

                            let nombreAdjunto = $("<p></p>");
                            nombreAdjunto.css({
                                "color": "black",
                                "word-break": "break-all"
                            });
                            nombreAdjunto.text(nombreCorto.replaceAll("%20", " ") + " ");
                            divNombreArchivo.append(nombreAdjunto);

                            let divBotonDescarga = $("<div></div>").addClass("col-1");
                            divBotonDescarga.css({
                                "display": "flex",
                                "justify-content": "center",
                                "align-items": "center"
                            });
                            let buttonDownloadAttachment = $("<a></a>").addClass("btn btn-light");
                            buttonDownloadAttachment.attr("href", mensaje.message);
                            buttonDownloadAttachment.attr("download", nombreCorto);
                            buttonDownloadAttachment.attr("target", "_blank");
                            buttonDownloadAttachment.html('<i class="fas fa-download"></i>');
                            divBotonDescarga.append(buttonDownloadAttachment);

                            divArchivo.append(divImgTipo);
                            divArchivo.append(divNombreArchivo);
                            divArchivo.append(divBotonDescarga);

                            let extension = mensaje.type;

                            if (extension === "pdf") {

                                let divBotonPreview = $("<div></div>").addClass("col-1");
                                divBotonPreview.css({
                                    "display": "flex",
                                    "justify-content": "center",
                                    "align-items": "center"
                                });

                                let buttonVerPreview = $("<button></button>").addClass("btn btn-light");
                                buttonVerPreview.attr("type", "button");
                                buttonVerPreview.append('<i class="far fa-eye"></i>');

                                /* IFRAME */
                                let iframePreviewPDF = $("<iframe></iframe>");
                                iframePreviewPDF.css({
                                    "height": "500px",
                                    "width": "700px"
                                });
                                iframePreviewPDF.attr("frameborder", "0");
                                iframePreviewPDF.attr("src", mensaje.message);

                                buttonVerPreview.click(() => {
                                    Swal.fire({
                                        width: 800,
                                        showCancelButton: false,
                                        showConfirmButton: false,
                                        html: iframePreviewPDF
                                    });
                                });

                                divBotonPreview.append(buttonVerPreview);
                                divArchivo.append(divBotonPreview);

                            } else {
                                divBotonDescarga.removeClass("col-1").addClass("col-2");
                            }

                            contenedorArchivosEncontrados.append(divArchivo);

                            divArchivo.mouseenter(() => {
                                divArchivo.css({"background-color": "rgba(0, 0, 0, 0.1)"});
                            }).mouseleave(() => {
                                divArchivo.css({"background-color": "transparent"});
                            });

                            divArchivo.click(() => {

                                const remarcaMensaje = (idMensaje) => {
                                    document.querySelector("#mensaje_" + idMensaje).scrollIntoView();
                                    let resaltar = setInterval(() => {
                                        $("#mensaje_" + idMensaje).toggleClass("respondida");
                                    }, 250);

                                    setTimeout(() => {
                                        clearInterval(resaltar);
                                        $("#mensaje_" + idMensaje).removeClass("respondida");
                                    }, 2000);
                                };

                                if ($("#mensaje_" + mensaje.id).length) {

                                    remarcaMensaje(mensaje.id);

                                } else {

                                    const buscaMensajeRespuesta = () => {
                                        if ($("#contact_messaging" + user.id360).find(".liMasMensajes").length) {
                                            console.log("Voy a buscar mas mensajes " + user.id360);
                                            let esGrupo = mensaje.idGroup !== undefined && mensaje.idGroup !== null ? true : false;
                                            cargaMasMensajes(user.id360, esGrupo).then((response) => {
                                                if ($("#mensaje_" + mensaje.id).length) {
                                                    remarcaMensaje(mensaje.id);
                                                } else if (response) {
                                                    buscaMensajeRespuesta();
                                                } else {
                                                    NotificacionToas.fire({
                                                        title: 'No se ha encontrado el mensaje'
                                                    });
                                                }

                                            });
                                        } else {
                                            NotificacionToas.fire({
                                                title: 'No se ha encontrado el mensaje'
                                            });
                                        }
                                    };

                                    buscaMensajeRespuesta();

                                }

                            });

                        });

                        divDocumentosCompartidos.append(contenedorArchivosEncontrados);

                    } else {
                        let mensajeSinFotos = $("<p></p>");
                        mensajeSinFotos.css({
                            "color": "black"
                        });
                        mensajeSinFotos.text("Sin archivos compartidos");
                        divDocumentosCompartidos.find("p").remove();
                        divDocumentosCompartidos.append(mensajeBuscando);
                    }

                });

            });

            divDescripcionContacto.append(enlaceArchivosCompartidas);
        };

        let agregaEnlaceVinculosCompartidos = () => {
            let enlaceVinculosCompartidos = $("<button></button>").addClass("btn btn-link btn-block");
            enlaceVinculosCompartidos.css({
                "text-align": "left",
                "padding-left": "20px"
            });
            enlaceVinculosCompartidos.html('<i class="fas fa-link"></i> Vinculos compartidas');

            enlaceVinculosCompartidos.click(() => {

                divDescripcionContacto.addClass("d-none");
                divDocumentosCompartidos.removeClass("d-none");

                divDocumentosCompartidos.find(".gridArchivosCompartidos").remove();

                let dataFotosCompartidas = {
                    "id360-1": user.id360,
                    "id360-2": sesion_cookie.idUsuario_Sys
                };

                if (group) {
                    dataFotosCompartidas.esGrupo = true;
                }

                RequestPOST("/API/empresas360/buscar_mensajes_vinculos", dataFotosCompartidas).then((response) => {

                    if (response.length > 0) {

                        divBusccador.find("ul").remove();
                        let ulResultadosBusqueda = $("<ul></ul>").addClass("gridArchivosCompartidos");
                        ulResultadosBusqueda.css({
                            "padding-left": "0",
                            "list-style": "none"
                        });

                        $.each(response, (index, mensaje) => {

                            let liMensajeBusqueda = $("<li></li>");

                            liMensajeBusqueda.css({
                                "text-align": "left",
                                "padding": "10px",
                                "font-weight": "400",
                                "white-space": "nowrap",
                                "overflow": "hidden",
                                "text-overflow": "ellipsis",
                                "color": "black",
                                "border-bottom": "1px solid lightslategray",
                                "cursor": "pointer"
                            });

                            let link = $("<a></a>");
                            link.text(mensaje.message);
                            link.prepend('<i class="fas fa-link mr-3"></i>');
                            link.attr("target", "_blank");
                            link.css({
                                "display": "block",
                                "padding": "10px 0"
                            });

                            liMensajeBusqueda.prepend(link);

                            let fechaMensajeBusqueda = moment(mensaje.date_created);
                            let smallFecha = $("<small></small>");
                            smallFecha.text(fechaMensajeBusqueda.format("DD/MMM/YY"));
                            smallFecha.css({
                                "display": "block"
                            });
                            liMensajeBusqueda.prepend(smallFecha);

                            liMensajeBusqueda.mouseenter(() => {
                                liMensajeBusqueda.css({"background-color": "rgba(0, 0, 0, 0.1)"});
                            }).mouseleave(() => {
                                liMensajeBusqueda.css({"background-color": "transparent"});
                            });

                            liMensajeBusqueda.click(() => {

                                const remarcaMensaje = (idMensaje) => {
                                    document.querySelector("#mensaje_" + idMensaje).scrollIntoView();
                                    let resaltar = setInterval(() => {
                                        $("#mensaje_" + idMensaje).toggleClass("respondida");
                                    }, 250);

                                    setTimeout(() => {
                                        clearInterval(resaltar);
                                        $("#mensaje_" + idMensaje).removeClass("respondida");
                                    }, 2000);
                                };

                                if ($("#mensaje_" + mensaje.id).length) {

                                    remarcaMensaje(mensaje.id);

                                } else {

                                    const buscaMensajeRespuesta = () => {
                                        if ($("#contact_messaging" + user.id360).find(".liMasMensajes").length) {
                                            console.log("Voy a buscar mas mensajes " + user.id360);
                                            let esGrupo = mensaje.idGroup !== undefined && mensaje.idGroup !== null ? true : false;
                                            cargaMasMensajes(user.id360, esGrupo).then((response) => {
                                                if ($("#mensaje_" + mensaje.id).length) {
                                                    remarcaMensaje(mensaje.id);
                                                } else if (response) {
                                                    buscaMensajeRespuesta();
                                                } else {
                                                    NotificacionToas.fire({
                                                        title: 'No se ha encontrado el mensaje'
                                                    });
                                                }

                                            });
                                        } else {
                                            NotificacionToas.fire({
                                                title: 'No se ha encontrado el mensaje'
                                            });
                                        }
                                    };

                                    buscaMensajeRespuesta();

                                }

                            });

                            ulResultadosBusqueda.append(liMensajeBusqueda);

                        });

                        divDocumentosCompartidos.append(ulResultadosBusqueda);

                    } else {
                        let mensajeSinFotos = $("<p></p>");
                        mensajeSinFotos.css({
                            "color": "black"
                        });
                        mensajeSinFotos.text("Sin hipervínculos compartidas");
                        divDocumentosCompartidos.find("p").remove();
                        divDocumentosCompartidos.append(mensajeBuscando);
                    }

                });

            });

            divDescripcionContacto.append(enlaceVinculosCompartidos);
        };

        let agregaEnlaceCompartidos = () => {
            let enlaceFotosCompartidas = $("<button></button>").addClass("btn btn-link btn-block");
            enlaceFotosCompartidas.css({
                "text-align": "left",
                "padding-left": "20px"
            });
            enlaceFotosCompartidas.html('<i class="fas fa-images"></i> Fotos compartidas');
            enlaceFotosCompartidas.click(() => {

                divDescripcionContacto.addClass("d-none");
                divDocumentosCompartidos.removeClass("d-none");

                divDocumentosCompartidos.find(".gridArchivosCompartidos").remove();
                divDocumentosCompartidos.find("p").remove();

                let dataFotosCompartidas = {
                    "id360-1": user.id360,
                    "id360-2": sesion_cookie.idUsuario_Sys
                };

                if (group) {
                    dataFotosCompartidas.esGrupo = true;
                }

                RequestPOST("/API/empresas360/buscar_mensajes_imagenes", dataFotosCompartidas).then((response) => {

                    if (response.length > 0) {

                        let divGrid = $("<div></div>").addClass("w-100 gridArchivosCompartidos");
                        divGrid.css({
                            "padding": "10px",
                            "display": "grid",
                            "grid-template-columns": "1fr 1fr 1fr",
                            "grid-gap": "10px"
                        });

                        $.each(response, (index, mensaje) => {

                            let divFoto = $("<div></div>").addClass("w-100");
                            let img = $("<img>").addClass("w-100");
                            img.attr("src", mensaje.message);
                            img.css({
                                "height": "100px",
                                "cursor": "pointer"
                            });
                            divFoto.append(img);

                            let imagenPreview = $("<img>");
                            imagenPreview.attr("src", mensaje.message);
                            imagenPreview.css({
                                "max-width": "650px",
                                "max-height": "650px"
                            });

                            img.click(() => {
                                Swal.fire({
                                    width: 700,
                                    showCancelButton: false,
                                    showConfirmButton: false,
                                    html: imagenPreview
                                });
                            });

                            divGrid.append(divFoto);

                        });

                        divDocumentosCompartidos.append(divGrid);

                    } else {
                        let mensajeSinFotos = $("<p></p>");
                        mensajeSinFotos.css({
                            "color": "black"
                        });
                        mensajeSinFotos.text("Sin fotografías compartidas");
                        divDocumentosCompartidos.find("p").remove();
                        divDocumentosCompartidos.append(mensajeBuscando);
                    }

                });

            });

            divDescripcionContacto.append(enlaceFotosCompartidas);
        };

        if (group) {

            let pDescripcionGrupo = $("<p></p>");
            pDescripcionGrupo.attr("id", "descripcionGrupoDescripcion_" + user.id360);
            pDescripcionGrupo.css({
                "color": "#40474f",
                "font-size": "1.3rem",
                "text-align": "left",
                "padding-left": "20px"
            });
            pDescripcionGrupo.text(" " + user.descripcion_grupo);
            pDescripcionGrupo.prepend('<i class="fas fa-info-circle"></i>');
            divDescripcionContacto.append(pDescripcionGrupo);

            agregaEnlaceCompartidos();
            agregaEnlaceArchivosCompartidos();
            agregaEnlaceVinculosCompartidos();

            //opcion para editar
            let buttonEditaDescripcion = $("<button></button>").addClass("btn");
            let iconEditarDescripcion = $("<i></i>").addClass("fas fa-edit ml-2");
            buttonEditaDescripcion.css("cursor", "pointer");
            buttonEditaDescripcion.append(iconEditarDescripcion);
            pDescripcionGrupo.append(buttonEditaDescripcion);

            buttonEditaDescripcion.click(() => {
                let contenedorDescripcionGrupo = $("<div></div>");

                let formDescripcionGrupo = $("<form></form>");
                formDescripcionGrupo.attr("id", "formCambiaDescripcionGrupo");
                formDescripcionGrupo.attr("autocomplete", "off");

                let formGroupDescripcionGrupo = $("<div></div>").addClass("form-group");
                let labelDescripcionGrupo = $("<label></label>");
                labelDescripcionGrupo.text("Descripción del grupo");
                labelDescripcionGrupo.attr("for", "inputDescripcionGrupo");
                let inputDescripcionGrupo = $("<input>").addClass("form-control");
                inputDescripcionGrupo.attr("id", "inputDescripcionGrupo");
                inputDescripcionGrupo.attr("type", "text");
                inputDescripcionGrupo.attr("required", "true");
                formGroupDescripcionGrupo.append(labelDescripcionGrupo);
                formGroupDescripcionGrupo.append(inputDescripcionGrupo);
                formDescripcionGrupo.append(formGroupDescripcionGrupo);

                let buttonSubmitCreaGrupo = $("<button></button>").addClass("btn btn-danger btn-block mt-4");
                buttonSubmitCreaGrupo.attr("type", "submit");
                buttonSubmitCreaGrupo.text("Cambiar descripción");
                formDescripcionGrupo.append(buttonSubmitCreaGrupo);

                contenedorDescripcionGrupo.append(formDescripcionGrupo);

                inputDescripcionGrupo.val(user.descripcion_grupo);

                console.log("Cargar modal para la descripcion");
                Swal.fire({
                    html: contenedorDescripcionGrupo,
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonText: 'Cancelar',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });

                $("#formCambiaDescripcionGrupo").submit((e) => {

                    e.preventDefault();
                    let descripcionGrupo = $("#inputDescripcionGrupo").val().trim();

                    let dataEditaTituloGrupo = {
                        "fecha": getFecha(),
                        "hora": getHora(),
                        "idGroup": user.id360,
                        "columna": "descripcion_grupo",
                        "valor": descripcionGrupo
                    };

                    RequestPOST("/API/empresas360/cambiar_parametro_grupo", dataEditaTituloGrupo).then((response) => {
                        if (response.success) {
                            Swal.close();
                            console.log("Se cambio la descripcion exitosamente");
                            console.log("Se debio enviar por socket");
                            let mensajeCambio = sesion_cookie.nombre + " " + sesion_cookie.apellidos + " ha cambiado la descripción del grupo";
                            mensajeSistema(mensajeCambio, user.id360, true);
                        }
                    });

                });

            });

            let pParticipantesLabel = $("<p></p>");
            pParticipantesLabel.css({
                "color": "#40474f",
                "font-size": "1.3rem",
                "margin-top": "30px",
                "text-align": "left",
                "padding-left": "20px"
            });
            pParticipantesLabel.text("Participantes");
            divDescripcionContacto.append(pParticipantesLabel);

            let ulParticipantes = $("<ul></ul>");
            ulParticipantes.attr("id", "listadoParticipantesGrupo_" + user.id360);
            ulParticipantes.css({
                "list-style": "none",
                "padding-left": "0"
            });

            let liAgregaParticipante = $("<li></li>");
            liAgregaParticipante.css({
                "text-align": "left",
                "color": "#32465a",
                "font-size": "1.4rem",
                "cursor": "pointer",
                "padding": "15px 0 15px 20px"
            });
            let buttonAgregaParticipante = $("<button></button>").addClass("btn");
            buttonAgregaParticipante.css({
                "background-color": "rgb(50, 70, 90)",
                "border-color": "rgb(50, 70, 90)",
                "border-radius": "50%",
                "width": "30px",
                "height": "30px",
                "color": "#fff"
            });
            buttonAgregaParticipante.append('<i class="fas fa-plus"></i>');

            let spanAgregaParticipante = $("<span></span>").addClass("ml-2");
            spanAgregaParticipante.text("Agregar Participante");

            liAgregaParticipante.append(buttonAgregaParticipante);
            liAgregaParticipante.append(spanAgregaParticipante);

            liAgregaParticipante.mouseenter(() => {
                liAgregaParticipante.css({"background-color": "rgba(0, 0, 0, 0.1)"});
            }).mouseleave(() => {
                liAgregaParticipante.css({"background-color": "transparent"});
            }).click(() => {
                muestraSpin();
                RequestPOST("/API/empresas360/consultar_participantes_grupos", {"idGroup": user.id360}).then((response) => {
                    ocultaSpin();
                    let pa = [];
                    $.each(response, (index, user) => {
                        pa.push(user.id_participantes);
                    });
                    agregarParticipanteGrupo(user.id360, pa);
                });
            });

            ulParticipantes.append(liAgregaParticipante);

            let participantesGrupos = user.participantesRol;
            $.each(participantesGrupos, (index, participante) => {

                let partesParticipantes = participante.split("-");
                let id360Participante = partesParticipantes[0];
                let rolParticipante = parseInt(partesParticipantes[1]);

                let userGrupo = null;
                if (id360Participante === sesion_cookie.idUsuario_Sys) {
                    userGrupo = {
                        img: perfil.img,
                        id360: sesion_cookie.idUsuario_Sys,
                        apellido_paterno: sesion_cookie.apellido_p,
                        apellido_materno: sesion_cookie.apellido_m,
                        nombre: sesion_cookie.nombre
                    };
                } else {
                    userGrupo = buscaEnDirectorioCompleto(id360Participante);
                }

                if (userGrupo !== undefined) {
                    let liParticipante = $("<li></li>");
                    liParticipante.attr("id", user.id360 + "_" + id360Participante);
                    liParticipante.css({
                        "text-align": "left",
                        "color": "#32465a",
                        "font-size": "1.4rem",
                        "cursor": "pointer",
                        "padding": "15px 0 15px 20px"
                    });
                    let imgParticipante = $("<img>");
                    imgParticipante.attr("src", userGrupo.img);
                    imgParticipante.css({
                        "width": "30px",
                        "height": "30px",
                        "border-radius": "50%"
                    });
                    let spanParticipante = $("<span></span>").addClass("ml-2");
                    spanParticipante.text(userGrupo.nombre + " " + userGrupo.apellido_paterno + " " + userGrupo.apellido_materno);

                    if (rolParticipante > 0) {
                        let iconAdmin = $("<i></i>").addClass("mr-2");
                        if (rolParticipante === 1) {
                            iconAdmin.addClass("fas fa-user-shield");
                        } else {
                            iconAdmin.addClass("fas fa-crown");
                        }
                        spanParticipante.prepend(iconAdmin);
                    }

                    liParticipante.append(imgParticipante);
                    liParticipante.append(spanParticipante);

                    ulParticipantes.append(liParticipante);

                    liParticipante.mouseenter(() => {
                        liParticipante.css({"background-color": "rgba(0, 0, 0, 0.1)"});
                    }).mouseleave(() => {
                        liParticipante.css({"background-color": "transparent"});
                    });

                    if (userGrupo.id360 !== sesion_cookie.idUsuario_Sys) {
                        liParticipante.click(() => {
                            $("#profile_chat" + userGrupo.id360).click();
                        });
                    }

                    if (userGrupo.id360 !== sesion_cookie.idUsuario_Sys && rolParticipante !== 2) {

                        liParticipante.on('contextmenu', function (e) {
                            e.preventDefault();

                            var myMenu = [{
                                    icon: 'fa fa-trash',
                                    label: 'Eliminar participante',
                                    action: function (option, contextMenuIndex, optionIndex) {
                                        eliminaParticipanteGrupo(id360Participante, user.id360);
                                    },
                                    submenu: null,
                                    disabled: false
                                }];

                            if (rolParticipante !== 2 && rolParticipante !== 1) {
                                let opcionHacerAdmin = {
                                    icon: 'fas fa-user-shield',
                                    label: 'Designar como administrador',
                                    action: function (option, contextMenuIndex, optionIndex) {
                                        hacerAdministrador(id360Participante, user.id360);
                                    },
                                    submenu: null,
                                    disabled: false
                                };
                                myMenu.push(opcionHacerAdmin);
                            }

                            if (rolParticipante === 1) {
                                let opcionHacerAdmin = {
                                    icon: 'fas fa-user-times',
                                    label: 'Descartar como administrador',
                                    action: function (option, contextMenuIndex, optionIndex) {
                                        quitarAdministrador(id360Participante, user.id360);
                                    },
                                    submenu: null,
                                    disabled: false
                                };
                                myMenu.push(opcionHacerAdmin);
                            }

                            superCm.createMenu(myMenu, e);
                        });
                    } else {
                        liParticipante.on('contextmenu', function (e) {
                            e.preventDefault();

                            var myMenu = [{
                                    label: '(vacío)',
                                    submenu: null,
                                    disabled: true
                                }];

                            superCm.createMenu(myMenu, e);
                        });
                    }

                }
            });

            divDescripcionContacto.append(ulParticipantes);

        } else {
            agregaEnlaceCompartidos();
            agregaEnlaceArchivosCompartidos();
            agregaEnlaceVinculosCompartidos();
        }

        content.append(divAux);
        content.append(divDescripcionContacto);
        content.append(divDocumentosCompartidos);
        content.append(divBusccador);

        $("#content_messaging").append(content);

        button.click(() => {
            send_chat_messages(input, ul, preview, user, messages);
        });

        buttonAttachment.click(() => {
            if (banderaEditando)
                swal.fire({text: "Solo se permiten editar mensajes de texto"});
            else
                inputAttachment.click();
        });

        inputAttachment.change((e) => {

            let reader = new FileReader();

            reader.readAsDataURL(e.target.files[0]);

            reader.onload = function () {

                let nombreAdjunto = inputAttachment.val();
                let partesNombreAdjunto = nombreAdjunto.split(".");
                let extension = partesNombreAdjunto[partesNombreAdjunto.length - 1];

                let partesPorDiagonal = nombreAdjunto.split("\\");
                let nombreCorto = partesPorDiagonal[partesPorDiagonal.length - 1];


                let imagenPreview = $("<img>").css({"max-height": "200px"}).attr("src", PathRecursos + "images/icono_default.png");
                rowNameFile.css({"display": "block"});
                nameFile.text(nombreCorto);
                let tipo = "others";

                switch (extension) {

                    case "jpg":
                    case "png":
                    case "jpeg":
                    case "gif":
                        imagenPreview.attr("src", reader.result);
                        imagenPreview.attr("target", "_blanck");
                        tipo = 'images';
                        break;

                    case "docx":
                    case "docm":
                    case "dotx":
                    case "dotm":
                    case "doc":
                        imagenPreview.attr("src", PathRecursos + "images/icono_word.png");
                        tipo = 'docs/word';
                        break;

                    case "xlsx":
                    case "xlsm":
                    case "xlsb":
                    case "xltx":
                    case "xltm":
                    case "xls":
                    case "xlt":
                        imagenPreview.attr("src", PathRecursos + "images/icono_excel.png");
                        tipo = 'docs/excel';
                        break;

                    case "pptx":
                    case "pptm":
                    case "ppt":
                    case "xps":
                    case "potx":
                    case "ppsx":
                        imagenPreview.attr("src", PathRecursos + "images/icono_powerpoint.png");
                        tipo = 'docs/powerpoint';
                        break;

                    case "pdf":
                        imagenPreview.attr("src", PathRecursos + "images/icono_pdf.png");
                        tipo = 'docs/pdf';
                        break;

                    case "txt":
                        tipo = 'docs/txt';
                        break;

                }

                inputAttachment.data("extension", extension);
                inputAttachment.data("nombreCorto", nombreCorto);
                inputAttachment.data("tipo", tipo);

                //let img = $("<img>").attr("src",reader.result).css({"max-height":"200px"});

                containerPreview.empty().append(imagenPreview);
                rowChat.hide("fast", () => {
                    rowPreview.show("fast");
                    rowButtonAttachment.show("fast");
                });

            };

        });

        buttonCancelAttachment.click(() => {
            cierraAttachment();
        });

        const cierraAttachment = () => {
            inputAttachment.val(null);
            inputArrastraSuelta.fileinput('clear');
            rowPreview.hide("fast");
            rowButtonAttachment.hide("fast");
            rowNameFile.hide("fast");
            rowChat.show("fast");
        };

        buttonSendAttachment.click(() => {
            //guarda_adjunto(inputAttachment.attr("id"));
            divCargando.removeClass("d-none");
            let idInput = "";
            if (inputAttachment.val() !== undefined && inputAttachment.val() !== null && inputAttachment.val() !== "") {
                idInput = inputAttachment.attr("id");
            } else {
                idInput = inputArrastraSuelta.attr("id");
            }
            console.log(idInput);
            guarda_adjunto_chat(idInput, user.id360).then((response) => {

                console.log(response);
                divCargando.addClass("d-none");
                cierraAttachment();
                console.log("Falta enviar");
                send_chat_messages(input, ul, preview, user, messages, response);

            });

        });

        const guarda_adjunto_chat = (id, to) => {
            return new Promise((resolve, reject) => {

                var BucketName = "lineamientos";
                var bucketRegion = "us-east-1";
                var IdentityPoolId = "us-east-1:a8460f87-8d3f-4452-935a-b95a4fcc83ed";

                AWS.config.update({
                    region: bucketRegion,
                    credentials: new AWS.CognitoIdentityCredentials({
                        IdentityPoolId: IdentityPoolId
                    })
                });

                var s3 = new AWS.S3({
                    apiVersion: "2006-03-01",
                    params: {Bucket: BucketName}
                });


                $("#guardando_documentacion").removeClass("d-none");
                var params = {
                    Bucket: BucketName,
                    Prefix: 'Logotipos'
                };
                s3.listObjects(params, function (err, data) {
                    if (err) {

                        swal.fire({
                            text: "Error de conexión con el servidor."
                        });
                    } else {

                        numFiles = data.Contents.length;

                        console.log(id);
                        var attachment = document.getElementById(id);

                        var files = attachment.files; // FileList object

                        var uploadFiles = files;
                        var upFile = files[0];
                        if (upFile) {

                            /*
                             * 
                             * @type RUTA PARA EL GUARDADO
                             */
                            let extension = $("#inputAttachment" + to).data("tipo");
                            let ruta = sesion_cookie.id_usuario + "_to_" + to + '/' + extension;

                            var bucket = new AWS.S3({params: {Bucket: BucketName + "/attachmentsChats/" + ruta}});
                            for (var i = 0; i < uploadFiles.length; i++) {
                                upFile = uploadFiles[i];
                                var params = {
                                    Body: upFile,
                                    Key: numFiles + "_" + upFile.name,
                                    ContentType: upFile.type
                                };
                                bucket.upload(params).on('httpUploadProgress', function (evt) {


                                }).send(function (err, data) {
                                    if (err) {

                                        swal.fire({
                                            text: "Error al subir la imagen al servidor."
                                        });
                                    }

                                    $("#guardando_documentacion").addClass("d-none");
                                    resolve(data.Location);

                                });
                            }
                        } else {
                            alert("Seleccione un archivo para subir al bucket");
                        }
                    }
                });

            });
        };

        input.on('keydown', function (e) {
            if (e.which == 13) {
                send_chat_messages(input, ul, preview, user, messages);
                return false;
            } else if (e.which == 27) {
                apagaValores();
                return false;
            }
        });

        buttonEnviarMensaje.click(() => {
            clickVerMensaje();
        });

        li.click(() => {
            clickVerMensaje();
        });

        const clickVerMensaje = () => {

            let idPrimerMensajeNoLeido = "";

            if (CantidadMensajesPorChat[user.id360] !== undefined && CantidadMensajesPorChat[user.id360].cantidadMensajesNoLeidos > 0) {

                idPrimerMensajeNoLeido = CantidadMensajesPorChat[user.id360].mensajesNoLeidos[CantidadMensajesPorChat[user.id360].mensajesNoLeidos.length - 1];

                divMensajesNoLeidos.addClass("d-none");
                CantidadMensajesPorChat[user.id360].cantidadMensajesNoLeidos = 0;
                let chats = {
                    chats: CantidadMensajesPorChat[user.id360].mensajesNoLeidos
                };
                CantidadMensajesPorChat[user.id360].mensajesNoLeidos = [];

                RequestPOST("/API/empresas360/marcar_chats_leidos", chats).then((response) => {
                });

            } else {
                idPrimerMensajeNoLeido = "";
            }

            $(".content").addClass("d-none");
            content.removeClass("d-none");

            //if(idPrimerMensajeNoLeido === ""){
            $(".messages").animate({scrollTop: $(document).height() + 100000}, "fast");
            //}else{
            /*if($("#mensaje_" + idPrimerMensajeNoLeido).length){
             document.querySelector("#mensaje_" + idPrimerMensajeNoLeido).scrollIntoView();
             document.querySelector("#mensaje_" + idPrimerMensajeNoLeido).scrollIntoView();
             }*/
            //}

            $("#message_input_" + user.id360).focus();
        };

        li.mouseenter(() => {
            divControlesChat.css({"display": "block"});
        }).mouseleave(() => {
            divControlesChat.css({"display": "none"});
        });

        buttonRealizarLlamadaChat.click(() => {
            clickIniciarLlamada();
        });

        opcionIniciarLlamada.click(() => {
            clickIniciarLlamada();
        });

        const clickIniciarLlamada = () => {

            let nombreLlamada;
            if (group)
                nombreLlamada = user.nombre_grupo;
            else
                nombreLlamada = user.nombre + " " + user.apellido_paterno + " " + user.apellido_materno;

            Swal.fire({
                text: "Iniciar una llamada con: " + nombreLlamada,
                showCancelButton: true,
                focusConfirm: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: '<i style="margin-right: 5px;" class="fas fa-phone-volume"></i>Continuar',
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    apagaValores();
                    let id360 = {
                        id360: sesion_cookie.id_usuario
                    };
                    let to_id360 = new Array();
                    to_id360.push({
                        id360: user.id360
                    });
                    id360.to_id360 = to_id360;
                    //console.log(id360);
                    //initCall();  
                    RequestPOST("/API/notificacion/llamada360", id360).then((msj) => {
                        dataLlamada = msj;
                        if (msj.credenciales.roomName) {
                            RequestPOST("/API/cuenta360/access_token", {
                                "token": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).token,
                                "id360": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys,
                                "id_sesion": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_sesion
                            }).then(function (response) {
                                if (response.success) {
                                    //access_token
                                    let nombre = sesion_cookie.nombre + " " + sesion_cookie.apellido_p + " " + sesion_cookie.apellido_m;
                                    window.open('https://meeting.claro360.com/room/' + msj.credenciales.roomName + "/usr360/" + sesion_cookie.id_usuario + "/" + sesion_cookie.id_sesion + "/" + sesion_cookie.tipo_usuario + "/" + sesion_cookie.tipo_servicio + "/" + sesion_cookie.tipo_area + "/" + response.access_token + "/" + normalize_text(nombre) + "/" + msj.registro_llamada.idLlamada, '_blank');

                                }

                            });

                        } else {
                            window.open('https://empresas.claro360.com/plataforma360/Llamada/' + msj.registro_llamada.idLlamada + '/' + msj.credenciales.apikey + '/' + msj.credenciales.idsesion + '/' + msj.credenciales.token + '', '_blank');
                        }
//                        Swal.fire({
//                            text: '¿Cómo quieres continuar la llamada? (Selecciona ventana externa.)',
//                            showCancelButton: true,
//                            confirmButtonText: `Ventana externa`,
//                            cancelButtonText: `Aquí mismo.`
//                        }).then((result) => {
//                            /* Read more about isConfirmed, isDenied below */
//                            console.log("Presionado " + result.isConfirmed);
//                            console.log(result);
//                            if (result.value) {
//                                console.log("Externa");
//                                window.open('https://empresas.claro360.com/plataforma360_dev/Llamada/' + msj.registro_llamada.idLlamada + '/' + msj.credenciales.apikey + '/' + msj.credenciales.idsesion + '/' + msj.credenciales.token + '', '_blank');
//                            } else {
//                                console.log("Aquí mismo");
//                                console.log(result);
//                                $("#menu_section_Comunicación").click();
//                                initCall();
//                            }
//                        });

                    });
                }
            });
        };

        opcionVaciarChat.click(() => {
            swalConfirmDialog("¿Vaciar chat?", "Vaciar", "Cancelar").then((response) => {
                apagaValores();
                if (response) {
                    let dataChat = {
                        "idUser": sesion_cookie.idUsuario_Sys,
                        "idContact": user.id360
                    };

                    RequestPOST("/API/empresas360/vaciarChat", dataChat).then((response) => {
                        if (response) {
                            ul.empty();
                            preview.text("");
                        }
                    });

                }
            });
        });

        inputArrastraSuelta.fileinput({
            theme: 'fa',
            language: 'es',
            maxFileCount: 1,
            showRemove: false,
            showUpload: false,
            showDownload: false
        }).on('fileselect', function (event, numFiles, label) {
            contenedorArrastraYSuelta.addClass("d-none");

            let reader = new FileReader();

            reader.readAsDataURL(event.target.files[0]);

            reader.onload = function () {

                let nombreAdjunto = inputArrastraSuelta.val();
                let partesNombreAdjunto = nombreAdjunto.split(".");
                let extension = partesNombreAdjunto[partesNombreAdjunto.length - 1];

                let partesPorDiagonal = nombreAdjunto.split("\\");
                let nombreCorto = partesPorDiagonal[partesPorDiagonal.length - 1];


                let imagenPreview = $("<img>").css({"max-height": "200px"}).attr("src", PathRecursos + "images/icono_default.png");
                rowNameFile.css({"display": "block"});
                nameFile.text(nombreCorto);
                let tipo = "others";

                switch (extension) {

                    case "jpg":
                    case "png":
                    case "jpeg":
                    case "gif":
                        imagenPreview.attr("src", reader.result);
                        imagenPreview.attr("target", "_blanck");
                        tipo = 'images';
                        break;

                    case "docx":
                    case "docm":
                    case "dotx":
                    case "dotm":
                    case "doc":
                        imagenPreview.attr("src", PathRecursos + "images/icono_word.png");
                        tipo = 'docs/word';
                        break;

                    case "xlsx":
                    case "xlsm":
                    case "xlsb":
                    case "xltx":
                    case "xltm":
                    case "xls":
                    case "xlt":
                        imagenPreview.attr("src", PathRecursos + "images/icono_excel.png");
                        tipo = 'docs/excel';
                        break;

                    case "pptx":
                    case "pptm":
                    case "ppt":
                    case "xps":
                    case "potx":
                    case "ppsx":
                        imagenPreview.attr("src", PathRecursos + "images/icono_powerpoint.png");
                        tipo = 'docs/powerpoint';
                        break;

                    case "pdf":
                        imagenPreview.attr("src", PathRecursos + "images/icono_pdf.png");
                        tipo = 'docs/pdf';
                        break;

                    case "txt":
                        tipo = 'docs/txt';
                        break;

                }

                inputArrastraSuelta.data("extension", extension);
                inputArrastraSuelta.data("nombreCorto", nombreCorto);
                inputArrastraSuelta.data("tipo", tipo);

                //let img = $("<img>").attr("src",reader.result).css({"max-height":"200px"});

                containerPreview.empty().append(imagenPreview);
                rowChat.hide("fast", () => {
                    rowPreview.show("fast");
                    rowButtonAttachment.show("fast");
                });

            };
        });

        divAux.find(".file-input, .file-preview, .file-drop-zone").css({
            "width": "100%",
            "height": "100%"
        });

        divAux.find(".file-drop-zone").css({
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });

        divAux.find(".input-group, .file-preview-thumbnails").addClass("d-none");

        $("#emojipicket" + user.id360).on("emoji-click", (event) => {
            let emojiPicker = $("#emojipicket" + user.id360);
            let idContacto = emojiPicker.data("idcontacto");
            let input = $("#message_input_" + idContacto);
            let textDefault = input.val();
            input.val(textDefault + event.detail.unicode);
        });

    }

}

function send_chat_messages(input, ul, preview, user, messages, rutaAdjunto) {

    let mensaje = input.val();
    $(".filaMensajesOperaciones").addClass("d-none");

    //Retornar si el mensaje está vació
    if ($.trim(mensaje) === '' && rutaAdjunto === "") {
        return false;
    }

    //Proceso en caso de que se está editando un mensaje
    if (banderaEditando) {

        let id = idMensajeEditando;

        let data = {
            "mensaje_editado": mensaje,
            "fecha_edita": getFecha(),
            "hora_edita": getHora(),
            "idMensaje": id,
            "to_id360": user.id360,
            "id360": sesion_cookie.idUsuario_Sys
        };

        if (banderaEditandoGrupo) {
            data.esGrupo = true;
        }

        RequestPOST("/API/empresas360/edita_mensaje", data).then((response) => {
            if (response.success) {
                console.log("Se envió la edición del mensaje");
                console.log("Debe llegar por socket");
                input.val("");
            }
        });

        return false;
    }

    //En caso de que haya una ruta, el mensaje será dicha ruta absoluta del adjunto
    if (rutaAdjunto !== undefined && rutaAdjunto !== null && rutaAdjunto !== "")
        mensaje = rutaAdjunto;

    //Validar si es un mensaje de sistema o es un mensaje enviado por el usuario    
    let quienEnvia = user.mensajeSistema ? null : sesion_cookie.id_usuario;

    //data del mensaje
    let json = {
        "to_id360": user.id360,
        "fecha": getFecha(),
        "hora": getHora(),
        "message": mensaje,
        "type": "text",
        "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
        "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
        "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area
    };

    //Si no es un mensaje de sistema, el id360 es el id del usuario
    if (quienEnvia !== null) {
        json.id360 = sesion_cookie.id_usuario;
    }

    //En caso de ser una respuesta se debe agregar la llave con el id del mensaje respondido
    if (banderaRespondiendo) {
        json.idResponse = idMensajeRespondiendo;
    }

    //Validar si el mensaje es para un grupo de chat
    let esGrupo = $("#messages_" + user.id360).data("grupo");
    if (esGrupo !== undefined && esGrupo !== null && esGrupo === "true") {
        //En caso de serlo se agrega el id del grupo y los participantes a los que se le debe enviar
        json.idGroup = user.id360;
        let participantes = $("#messages_" + user.id360).data("participantes").split(",");
        json.participantes = participantes;
    }

    //En caso de que el mensaje sea una ruta de adjunto, el tipo de texto será la extensión del mismo
    if (rutaAdjunto !== undefined && rutaAdjunto !== null && rutaAdjunto !== "") {
        let extension = '';
        let extensionNormal = $("#inputAttachment" + user.id360).data("extension");
        if (extensionNormal !== undefined && extensionNormal !== null && extensionNormal !== "") {
            extension = extensionNormal;
        } else {
            extension = $("#inputAttachmentArrastra" + user.id360).data("extension");
            $("#inputAttachmentArrastra" + user.id360).fileinput("clear");
        }
        json.type = extension;
    }

    //Envío del chat
    console.log(json);
    RequestPOST("/API/empresas360/chat", json).then((response) => {
        if (response.success) {
            console.log("Se ha enviado el mensaje exitosamente.");
            console.log("Se debe desplegar a través de socket");
            input.val("");
            $(".emojipicker").addClass("d-none");
            //agregar_chat_enviado(response, false);
        }
    });

}

/*
 div class="contact-profile">
 <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="">
 <p>Harvey Specter</p>
 <div class="social-media">
 i
 </div>
 </div>
 <div class="messages">
 <ul  class="p-0">
 <li class="sent">
 <img src="http://emilcarlsson.se/assets/mikeross.png" alt="">
 <p>How the hell am I supposed to get a jury to believe you when I am not even sure that I do?!</p>
 </li>
 <li class="replies">
 <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="">
 <p>When you're backed against the wall, break the god damn thing down.</p>
 </li>
 </ul>
 </div>
 <div class="message-input">
 <div class="wrap">
 <input type="text" placeholder="Write your message...">
 <i class="fa fa-paperclip attachment" aria-hidden="true"></i>
 <button class="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
 </div>
 </div>
 */

$("#iniciar_llamada").click(() => {
    console.log(array_llamar);
    let id360 = {
        id360: sesion_cookie.id_usuario
    };
    let to_id360 = new Array();
    for (var i = 0; i < array_llamar.length; i++) {
        to_id360.push({
            id360: array_llamar[i].id360
        });
    }
    id360.to_id360 = to_id360;
    console.log(id360);
    RequestPOST("/API/notificacion/llamada360", id360).then((mensaje) => {
        console.log(mensaje);
        window.open('https://empresas.claro360.com/plataforma360_dev/Llamada/' + mensaje.registro_llamada.idLlamada + '/' + mensaje.credenciales.apikey + '/' + mensaje.credenciales.idsesion + '/' + mensaje.credenciales.token + '', '_blank');

    });
});

$("#profile-img").click(function () {
    $("#status-options").toggleClass("active");
});



$("#status-options ul li").click(function () {
    $("#profile-img").removeClass();
    $("#status-online").removeClass("active");
    $("#status-away").removeClass("active");
    $("#status-busy").removeClass("active");
    $("#status-offline").removeClass("active");
    $(this).addClass("active");

    if ($("#status-online").hasClass("active")) {
        $("#profile-img").addClass("online");
    } else if ($("#status-away").hasClass("active")) {
        $("#profile-img").addClass("away");
    } else if ($("#status-busy").hasClass("active")) {
        $("#profile-img").addClass("busy");
    } else if ($("#status-offline").hasClass("active")) {
        $("#profile-img").addClass("offline");
    } else {
        $("#profile-img").removeClass();
    }
    ;

    $("#status-options").removeClass("active");
});

function newMessage() {
    message = $(".message-input input").val();
    if ($.trim(message) == '') {
        return false;
    }
    $('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
    $('.message-input input').val(null);
    $('.contact.active .preview').html('<span>You: </span>' + message);
}
;

$('.submit').click(function () {
    newMessage();
});

$(window).on('keydown', function (e) {
    if (e.which == 13) {
        newMessage();
        return false;
    }
});

$(".expand-button").click(function () {
    $("#profile").toggleClass("expanded");
    $("#contacts").toggleClass("expanded");
});

/*
 * 
 * DESARRLLO PARA LLAMADA
 * 
 * 
 */

const initCall = (msj) => {

    data = (msj === undefined || msj === null) ? dataLlamada : msj;
    //var sesion_cookie=JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA))

    var proyecto = DatosProyecto();

    var Directorio;
    var tel_a_agregar = new Array();

    $("#content_messaging").hide("fast", () => {

        $("#toggle div").click();

        RequestPOST("/API/ConsultarDirectorio", {
            "fecha": getFecha(),
            "hora": getHora(),
            "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
            "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
            //    "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area,
            "tipo_area": "0"
        }).then((response) => {
            dataG = response;
            initializeSession();
            Directorio = response.directorio;
            directorio();
            $("#content_call").show("fast");
        });

    });

    function initializeSession() {
        connectionCount = 0;
        var session = OT.initSession(data.credenciales.apikey, data.credenciales.idsesion);

        session.on({
            connectionCreated: function (event) {

                connectionCount++;

            },
            connectionDestroyed: function (event) {

                connectionCount--;
                if (connectionCount <= 1) {
                    session.disconnect();
                }


            },
            sessionConnected: function (event) {

            },
            sessionDisconnected: function (event) {
                //console.error('You were disconnected from the session.', event.reason);
                $("#content_call").hide("fast", () => {
                    $("#participantes").empty();
                    $("#history").empty();
                    $("#GRID").empty();
                    $("#menu_botones").remove();
                    $("#msgTxt").val("");

                    //session.unpublish(publisher);
                    //session.disconnect();
                    RegistrarDesconexionOp();
                    //menu.className = "row col-12 m-0 p-0 d-none";

                    $("#content_messaging").show("fast", () => {
                        swal.fire({text: 'Llamada finalizada'});
                        $("#toggle div").click();
                    });
                });
            },
            sessionReconnected: function (event) {

            },
            sessionReconnecting: function (event) {

            },
            streamCreated: function (event) {
                console.log("se detecta video:");
                console.log(event);
                agregarVideo(session, event.stream);
            },
            streamDestroyed: function (event) {

                mosaico("remover", sesion_cookie.idUsuario_Sys);

                console.log("Registrar desconexion?");
                console.log(event);
                //            RegistrarDesconexion(event.stream.connection.connectionId);
            },
            signal: function (event) {


                if (event.type === "signal:gps-signal") {

                    if (event.data !== undefined) {
                        var gps_data = JSON.parse(event.data);


                        var LatitudE = parseFloat(parseFloat(gps_data.lat).toFixed(7));
                        var LongitudE = parseFloat(parseFloat(gps_data.lng).toFixed(7));
                        var fechaE = gps_data.fecha;
                        var horaE = gps_data.hora;


                        var gpsjson = {
                            "idUsuarios_Movil": gps_data.idUsuario_Movil,
                            "lat": LatitudE,
                            "lng": LongitudE,
                            "fecha": fechaE,
                            "hora": horaE,
                            "ActualizaGPS": true,
                            "gpsOTS": true,
                            "motivo": "VLS"
                        };
                        EnviarMensajePorSocket(gpsjson);

                        ActivarIconMapDG(gps_data);
                        CardParticipante(gps_data);
                        RegistrarConexion(gps_data.idUsuario_Movil, event.from.connectionId);
                    }

                }
                if (event.type === "signal:msg-signal") {
                    //Sabiendo que el mensaje es de un subscriptor decodifica para saber como tratarlo 
                    if (event.from.connectionId === session.connection.connectionId) {

                        insertarMensajePropio(event.data);
                    } else {

                        insertarMensaje(event.data);
                    }

                }
                if (event.type === "signal:idoperador-signal") {
                    enviarMensaje(session, session.connection.connectionId);
                }
                if (event.type === "signal:user_connected") {
                    /////////Se identifico un nuevo usuario conectado 
                    var info_user = JSON.parse(event.data);
                    CardParticipante_user_connected(info_user);
                }
            }

        });

        // Connect to the session
        session.connect(data.credenciales.token, function callback(error) {
            // If the connection is successful, initialize a publisher and publish to the session
            if (!error) {
                // Text chat


                var form = document.getElementById("chat");
                var msgTxt = document.querySelector('#msgTxt');

                // Send a signal once the user enters data in the form
                form.addEventListener('submit', function submit(event) {
                    event.preventDefault();
                    console.log("Enviando mensaje");
                    enviarMensaje(session, sesion_cookie.nombre + " " + sesion_cookie.apellido_p + "", msgTxt.value);
                });
                // Initialize the publisher
                var publisherOptions = {
                    insertMode: 'replace',
                    width: '100%',
                    height: '100%',
                    name: sesion_cookie.nombre + " " + sesion_cookie.apellidos
                };
                var publisher = OT.initPublisher('publisher', publisherOptions, function initCallback(initErr) {

                    if (initErr) {
                        console.error('There was an error initializing the publisher: ', initErr.name, initErr.message);
                        notificarError(initErr.message);
                        return;
                    } else {
                        enviarMensaje(session, sesion_cookie.nombre + " " + sesion_cookie.apellido_p + "", MSJ);
                        enviarMensajeOT(session, "user_connected", {
                            id360: sesion_cookie.id_usuario
                        });

                        document.getElementById("msgTxt").disabled = false;
                    }
                });

                // If the connection is successful, publish the publisher to the session
                session.publish(publisher, function publishCallback(publishErr) {
                    if (publishErr) {
                        console.error('There was an error publishing: ', publishErr.name, publishErr.message);
                    } else {
                        //                    data.registro_llamada.time.h_conexion_operador = getHora();
                        //                    ArchiveSession().then(function (response) {
                        //                        RegistrarURL(response.ruta_video);
                        //                    });

                        /*******Activar el menu*******/

                        console.log("Publicador iniciado");
                        var menu = document.createElement("div");
                        menu.style = "background: #343a40; position: absolute; bottom: 0px; left: calc(50% - 100px); width: 300px;border-top-left-radius: 50px;border-top-right-radius: 50px; z-index: 103;";
                        menu.className = "row col-12 m-0 p-0";
                        menu.id = "menu_botones";
                        console.log(menu);
                        var div = document.createElement("div");
                        div.className = "col-12";
                        div.style = "text-align: center; font: bold 2rem Arial; color: white;cursor: pointer;";
                        var i = document.createElement("i");
                        i.className = "fas fa-chevron-up";
                        console.log(i);
                        var botones = document.createElement("div");
                        botones.className = "row m-0 p-2 col-12 d-none";
                        botones.style = "height: 60px;";

                        console.log(botones);

                        div.addEventListener("click", function () {
                            if (botones.className === "row m-0 p-2 col-12 d-none") {
                                botones.className = "row m-0 p-2 col-12";
                                div.style = "text-align: center; font: bold 2rem Arial; color: white;cursor: pointer;transform: rotate(180deg);";
                            } else {
                                botones.className = "row m-0 p-2 col-12 d-none";
                                div.style = "text-align: center; font: bold 2rem Arial; color: white;cursor: pointer;";
                            }
                        });


                        div.appendChild(i);
                        menu.appendChild(div);
                        menu.appendChild(botones);


                        var colgar = document.createElement("div");
                        colgar.className = "col-3";
                        colgar.id = "colgarPublisher";
                        colgar.style = "justify-content:center;align-items:center;display:flex;font:2rem Arial;color:red;cursor:pointer;border-right:solid 1px #6c757d;";
                        colgar.innerHTML = '<i class="fas fa-phone-slash"></i>';
                        colgar.addEventListener("click", function () {
                            window.close();
                            session.unpublish(publisher);
                            //session.disconnect();
                            RegistrarDesconexionOp();
                            menu.className = "row col-12 m-0 p-0 d-none";
                        });
                        console.log(colgar);
                        botones.appendChild(colgar);

                        //////////Solicitar Cambio de camara  ******
                        var activarVideo = document.createElement("div");
                        activarVideo.className = "col-3";
                        activarVideo.innerHTML = '<i class="fas fa-video"></i>';
                        activarVideo.style = "justify-content:center;align-items:center;display:flex;font:2rem Arial;cursor:pointer;border-right:solid 1px #6c757d;";
                        activarVideo.addEventListener("click", function () {
                            if (!publisher.stream.hasVideo) {
                                activarVideo.innerHTML = '<i class="fas fa-video"></i>';
                            } else {
                                activarVideo.innerHTML = '<i class="fas fa-video-slash"></i>';
                            }
                            publisher.publishVideo(!publisher.stream.hasVideo);
                        });
                        botones.appendChild(activarVideo);
                        console.log(activarVideo);


                        //////////Solicitar Bloqueo de microfono  ******
                        var activarAudio = document.createElement("div");
                        activarAudio.className = "col-3";
                        activarAudio.innerHTML = '<i class="fas fa-microphone"></i>';
                        activarAudio.style = "justify-content:center;align-items:center;display:flex;font:2rem Arial;cursor:pointer;border-right:solid 1px #6c757d;";
                        activarAudio.addEventListener("click", function () {
                            if (!publisher.stream.hasAudio) {
                                activarAudio.innerHTML = '<i class="fas fa-microphone"></i>';
                            } else {
                                activarAudio.innerHTML = '<i class="fas fa-microphone-slash"></i>';
                            }
                            publisher.publishAudio(!publisher.stream.hasAudio);
                        });
                        botones.appendChild(activarAudio);
                        console.log(activarAudio);

                        //////////Compartir Pantalla  ******
                        var share_screen = document.createElement("div");
                        share_screen.className = "col-3";
                        share_screen.style = "justify-content:center;align-items:center;display:flex;font:2rem Arial;cursor:pointer;"
                        share_screen.innerHTML = '<i class="fas fa-external-link-alt"></i>';
                        share_screen.addEventListener("click", function () {
                            OT.checkScreenSharingCapability(function (response) {
                                if (!response.supported || response.extensionRegistered === false) {
                                    // This browser does not support screen sharing.
                                    console.log("This browser does not support screen sharing.");
                                } else if (response.extensionInstalled === false) {
                                    // Prompt to install the extension.
                                    console.log("Prompt to install the extension.");
                                } else {
                                    // Screen sharing is available. Publish the screen.
//                                var pos = NuevaUbicacion();
                                    var pos = fullcontainer_screen();
                                    var publisher_screen = OT.initPublisher(pos,
                                            {videoSource: 'screen'},
                                            function (error) {
                                                if (error) {
                                                    // Look at error.message to see what went wrong.
                                                } else {
                                                    let stop_share = document.createElement("div");
                                                    stop_share.className = "col-3";
                                                    stop_share.id = "stop_sharePublisher";
                                                    stop_share.style = "justify-content:center;align-items:center;display:flex;font:2rem Arial;color:red;cursor:pointer;border-right:solid 1px #6c757d;";
                                                    stop_share.innerHTML = '<i class="far fa-times-circle"></i>';
                                                    stop_share.addEventListener("click", function () {
                                                        session.unpublish(publisher_screen);
                                                        share_screen.className = "col-3";
                                                        stop_share.className = "col-3 d-none";
                                                        $("#maximizarVideo").removeClass("active");
                                                        $("aside").removeAttr('style');
                                                        $("header").removeAttr('style');
                                                        $("footer").removeAttr('style');
                                                        $("section").removeAttr('style');
                                                        $("#hamburgerMenu").parent().removeAttr('style');
                                                        $("#side1").removeAttr('style');
                                                        $("#side2").removeAttr('style');
                                                        $("#publishers").removeAttr('style');
                                                        $("#GRID").removeAttr('style');
                                                        $("#loading").css({
                                                            "position": "absolute",
                                                            "height": "20%",
                                                            "width": "20%",
                                                            "left": "40%",
                                                            "top": "30%"
                                                        });
                                                        showToggle();
                                                    });
                                                    botones.appendChild(stop_share);
                                                    share_screen.className = "col-3 d-none";
                                                    $("#maximizarVideo").click();
                                                    session.publish(publisher_screen, function (error) {
                                                        if (error) {
                                                            // Look error.message to see what went wrong.
                                                            console.log(error.message);
                                                        }

                                                    });
                                                }
                                            }
                                    );
                                    publisher_screen.on('mediaStopped', function (event) {
                                        // The user clicked stop.
                                        console.log("The user clicked stop.");
                                    });

                                    publisher_screen.on('streamDestroyed', function (event) {
                                        if (event.reason === 'mediaStopped') {
                                            // User clicked stop sharing
                                            console.log("User clicked stop sharing");
                                        } else if (event.reason === 'forceUnpublished') {
                                            // A moderator forced the user to stop sharing.
                                            console.log("A moderator forced the user to stop sharing.");
                                        }
                                        mosaico("remover");
                                    });
                                }
                            });

                        });
                        botones.appendChild(share_screen);
                        console.log(menu);
                        console.log(document.getElementById("videos"));
                        document.getElementById("videos").appendChild(menu);

                        $("#base_modulo_Comunicación .OT_publisher .OT_mute").click(() => {
                            activarAudio.click();
                        });

                        $("#base_modulo_Comunicación .OT_publisher .OT_mute").css({
                            "left": "50%",
                            "outline": "none"
                        });

                        $("#base_modulo_Comunicación .OT_subscriber .OT_mute").css({
                            "left": "50%",
                            "outline": "none"
                        });

                        //                    var colgar = document.createElement("input");
                        //                    colgar.className = "colgarPublisher";
                        //                    colgar.id = "colgarPublisher";
                        //                    colgar.value = "";
                        //                    colgar.addEventListener("click", function () {
                        //
                        //                        session.unpublish(publisher);
                        //                        //session.disconnect();
                        //                        RegistrarDesconexionOp();
                        //                    });
                        //                    document.getElementById("publisher").appendChild(colgar);
                        //
                        //                    //////////Solicitar Cambio de camara  ******
                        //                    var activarVideo = document.createElement("input");
                        //                    activarVideo.className = "activarVideoPublisher";
                        //                    activarVideo.value = "";
                        //                    activarVideo.addEventListener("click", function () {
                        //
                        //                        publisher.publishVideo(!publisher.stream.hasVideo);
                        //                    });
                        //                    document.getElementById("publisher").appendChild(activarVideo);


                    }
                });
            } else {
                console.error('There was an error connecting to the session: ', error.name, error.message);
            }
        });

    }

    function RegistrarDesconexionUsr(id, hora_desconexion) {

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": '/' + DEPENDENCIA + "/API/LlamadaSaliente/RegistrarDesconexionUsr",
            contentType: "application/json",
            "method": "POST",
            "data": JSON.stringify({
                "idLlamada": data.registro_llamada.idLlamada,
                "idUsuario": id,
                "hora_desconexion": hora_desconexion
            }),
            success: function (response) {

            },
            error: function (err) {

            }
        };
        return Promise.resolve($.ajax(settings));

    }

    function RegistrarDesconexionOp() {

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": '/' + DEPENDENCIA + "/API/LlamadaSaliente/RegistrarDesconexionOp",
            contentType: "application/json",
            "method": "POST",
            "data": JSON.stringify({
                "idLlamada": data.registro_llamada.idLlamada,
                "idSys": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys,
                "hora_desconexion": getHora(),
                "chat": JSON.stringify(chat)
            }),
            success: function (response) {

            },
            error: function (err) {

            }
        };
        return Promise.resolve($.ajax(settings));

    }

    function RegistrarConexionUsr(id, hora_conexion) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": '/' + DEPENDENCIA + "/API/LlamadaSaliente/RegistrarConexionUsr",
            contentType: "application/json",
            "method": "POST",
            "data": JSON.stringify({
                "idLlamada": data.registro_llamada.idLlamada,
                "idUsuario": id,
                "hora_conexion": hora_conexion
            }),
            success: function (response) {

            },
            error: function (err) {

            }
        };
        return Promise.resolve($.ajax(settings));
    }

    function RegistrarNuevoParticipante(idUsuarios_Movil, firebase) {
        var idUsers = new Array();
        idUsers.push(idUsuarios_Movil);
        RegistroNotificaciones(idUsers, data.registro_llamada.idLlamada).then(function (RespuestaNotificados) {



            var SolicitarVideo = FireBaseSolicitudVideo(firebase, data.credenciales.apikey, data.credenciales.idsesion, data.credenciales.token, RespuestaNotificados[idUsuarios_Movil]);
            SolicitarVideo.then(function (data) {
                if (!data.failure) {

                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'center',
                        showConfirmButton: false,
                        timer: 2000
                    });

                    Toast.fire({
                        type: 'success',
                        title: "Notificacion enviada! <br> El elemento esta siendo notificado"
                    });
                } else {

                }
            });
        });
    }

    function RegistrarURL(ruta_video) {
        data.registro_llamada.ruta_video = ruta_video;

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": '/' + DEPENDENCIA + "/API/LlamadaSaliente/Ruta_video",
            contentType: "application/json",
            "method": "POST",
            "data": JSON.stringify({
                "idLlamada": data.registro_llamada.idLlamada,
                "idSys": data.registro_llamada.idOperador,
                "ruta_video": ruta_video,
                "hora_conexion": data.registro_llamada.time.h_conexion_operador,
                "hora_inicio": data.registro_llamada.time.h_atencion_inicio,
            }),
            success: function (response) {

            },
            error: function (err) {

            }
        };
        return Promise.resolve($.ajax(settings));

    }

    function notificarError(error) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'center',
            timer: 10000,
            backdrop: `rgba(189, 189, 189,0.5)`
        });
        Toast.fire({
            type: 'info',
            html: '<p style="color: white;font-size: 15px; width: 360px;  text-align: justify; margin: 10px;">\n\
                                Hubo un problema al intentar publicar.<br>Error: ' + error + '<br>\n\
                                <label style=\"color: bisque;font-size: 17px;margin: 0;\">\n\
                                </label><br> \n\
                                <button id="stop" class="btn btn-success" style="position: relative; left: 30%; width: 150px; margin:15px;">\n\
                                OK!!</button><br>\n\
                                <label style=\"    color: white;font-size: 18px; margin: 0;font-weight: bold;\">\n\
                                La pagina se cerrara en: <strong></strong> segundos</label></p>',
            onBeforeOpen: () => {
                const content = Swal.getContent();
                const $ = content.querySelector.bind(content);

                const stop = $('#stop');

                Swal.showLoading();
                stop.addEventListener('click', () => {
                    Swal.close();
                    window.close();
                });

                timerInterval = setInterval(() => {
                    Swal.getContent().querySelector('strong')
                            .textContent = (Swal.getTimerLeft() / 1000)
                            .toFixed(0);
                }, 100);
            },
            onClose: () => {
                clearInterval(timerInterval);
            }

        }).then(function () {
            window.close();
        });
    }

    function AgregarContacto(elemento) {


        var contenedor = document.createElement("div");
        contenedor.style = "height: auto; background: white; border-radius: 10px; display: inline-block; margin: 5px 10px; vertical-align: bottom; width: calc( 100% - 20px); cursor: pointer; ";
        contenedor.id = Incidente.folio;
        var row = document.createElement("div");
        row.className = "row col-12 m-0 p-0";
        var div1 = document.createElement("div");
        div1.className = "col-8";
        var tipoIncidente = document.createElement("p");
        tipoIncidente.style = "color: black; padding: 0; margin: 5px 10px 0px; font: 14px Arial; width: 100%;";
        tipoIncidente.innerHTML = Incidente.incidente.Incidente;
        var folio = document.createElement("p");
        folio.style = "color: black; padding: 0; margin: 0px 20px 5px; font: 10px Arial;";
        folio.innerHTML = Incidente.folio + " - " + Incidente.hora;
        var div2 = document.createElement("div");
        div2.className = "col-4 pr-0";
        var boton = document.createElement("input");
        boton.type = "button";
        boton.style = "height: 100%; border-top-right-radius: 10px; border-bottom-right-radius: 10px; border: none; background-color: #ffffff; color: white; background-image: linear-gradient(90deg, #ffffff00, #00a5b8);  width: 100%; display:none;";
        boton.value = "Seleccionar";
        div1.appendChild(tipoIncidente);
        div1.appendChild(folio);
        div2.appendChild(boton);
        row.appendChild(div1);
        row.appendChild(div2);
        contenedor.appendChild(row);
        document.getElementById("collapseZero").appendChild(contenedor);


        var myLatLng = new google.maps.LatLng(Incidente.lat, Incidente.lng);

        // define our custom marker image
        var image = new google.maps.MarkerImage(
                PathRecursos + 'Img/IconoMap/dot.png',
                null, // size
                null, // origin
                new google.maps.Point(8, 8), // anchor (move to center of marker)
                new google.maps.Size(16, 16) // scaled size (required for Retina display icon)
                );

        if (Incidente.incidente.Prioridad === "URGENTE") {
            image = new google.maps.MarkerImage(
                    PathRecursos + 'Img/IconoMap/red_dot.png',
                    null, // size
                    null, // origin
                    new google.maps.Point(8, 8), // anchor (move to center of marker)
                    new google.maps.Size(16, 16) // scaled size (required for Retina display icon)
                    );
        } else if (Incidente.incidente.Prioridad === "RAPIDA") {
            image = new google.maps.MarkerImage(
                    PathRecursos + 'Img/IconoMap/orange_dot.png',
                    null, // size
                    null, // origin
                    new google.maps.Point(8, 8), // anchor (move to center of marker)
                    new google.maps.Size(16, 16) // scaled size (required for Retina display icon)
                    );
        } else if (Incidente.incidente.Prioridad === "NORMAL") {
            image = new google.maps.MarkerImage(
                    PathRecursos + 'Img/IconoMap/blue_dot.png',
                    null, // size
                    null, // origin
                    new google.maps.Point(8, 8), // anchor (move to center of marker)
                    new google.maps.Size(16, 16) // scaled size (required for Retina display icon)
                    );
        }

        var rowInfoW = document.createElement("div");
        rowInfoW.className = "row col-12 m-0 p-0";
        var divInfoW = document.createElement("div");
        divInfoW.className = "col-12";
        var tipoIncidenteInfoW = document.createElement("p");
        tipoIncidenteInfoW.style = "color: black; padding: 0; font: 14px Arial; width: 100%; margin:0;";
        tipoIncidenteInfoW.innerHTML = Incidente.incidente.Incidente;
        var folioInfoW = document.createElement("p");
        folioInfoW.style = "color: black; padding: 0; margin: 0px 20px 5px; font: 10px Arial;";
        folioInfoW.innerHTML = Incidente.folio + " - " + Incidente.hora;

        divInfoW.appendChild(tipoIncidenteInfoW);
        divInfoW.appendChild(folioInfoW);
        rowInfoW.appendChild(divInfoW);



        // then create the new marker
        var marcador = new google.maps.Marker({
            flat: true,
            icon: image,
            map: map,
            optimized: false,
            position: myLatLng,
            title: Incidente.incidente.Prioridad,
            zIndex: 5,
            visible: true,
            css: "Baja"

        });
        marcador.addListener('click', function () {

            infowindow.close();
            infowindow.setContent(rowInfoW);
            infowindow.open(map, marcador);

        });
        div1.addEventListener("click", function () {
            map.setCenter(myLatLng);
            map.setZoom(16);

        });
        boton.addEventListener("click", function () {
            NuevoReporte = false;
            incidente_establecido = true;


            //document.getElementById("chained_relative-flexdatalist").value = Incidente.incidente.id + ", " + Incidente.incidente.Incidente;


            document.getElementById("nivelemergencia").value = Incidente.incidente.Prioridad;
            document.getElementById("folio").value = prefijoFolio + Incidente.folio;
            document.getElementById("FolioIncidentes").value = Incidente.folioIncidentes;

            incidente = Incidente.incidente;
            FolioIncidentes = Incidente.folioIncidentes;
            Folio = Incidente.folio;

            vue.value = [{"id": Incidente.incidente.id, "Incidente": Incidente.incidente.Incidente}];
            document.getElementById("aheadingZero").click();
            document.getElementById("collapseThree").className = "collapse show";

            var dependencias = document.getElementById("DependenciasID").value.split("|");
            for (var i = 0; i < dependencias.length; i++) {
                var depen = dependencias[i].toString().split(",");
                var id = depen[0];
                if (incidente.Dependencias.includes(depen[1])) {
                    document.getElementById(id).checked = 1;
                }
            }

            document.getElementById("aheadingOne").click();
            document.getElementById("collapseThree").className = "collapse show";
            document.getElementById("headingZero").style = "display:none;";
            document.getElementById("headingOne").style = "display:none;";
            $('#notificarDependencias').submit();

        });
        contenedor.addEventListener("mouseover", function () {
            boton.style.display = "block";
            contenedor.style.boxShadow = "-3px 3px 20px 0px black";
            contenedor.style.margin = "5px 15px";
        });
        contenedor.addEventListener("mouseout", function () {
            boton.style.display = "none";
            contenedor.style.boxShadow = "none";
            contenedor.style.margin = "5px 10px";
        });

    }

    function MarcadorElemento(Dependencia, elemento, icono) {
        var datos_elemento = consultaPerfil(Dependencia, elemento.idUsuarios_Movil);
        datos_elemento.then(function (perfil) {

            var nuevoMarcador;
            var icon = icono;



            nuevoMarcador = new google.maps.Marker({position: {lat: parseFloat(elemento.latitud), lng: parseFloat(elemento.longitud)},
                map: map,
                //animation: googlue.maps.Animation.BOUNCE,
                icon: icon
            }, );


            nuevoMarcador.addListener('click', function () {
                infowindow.close();


                infowindow.setContent(ContentInfoWindowLITE(elemento));
                infowindow.open(map, nuevoMarcador);
            });

            $("#marcadoresDependencias").submit(function () {
                nuevoMarcador.setMap(null);
            });
            $("#myRange").mouseup(function () {
                nuevoMarcador.setMap(null);
            });

        });
    }

    function enviarNotificacionGrupal() {


        var a = '["id","Incidente","Prioridad"]';

        var b = "'" + a + "'";
        var Prioridad = "";
        if (incidente.Prioridad !== undefined) {
            Prioridad = incidente.Prioridad;
        }

        var c = '<input type="text" placeholder ="Escribe el código o nombre del incidente" class ="flexdatalist form-control Swal2" data-relatives="#relative" data-url="/sos/resources/json/incidentes.json" data-search-in=' + b + ' data-visible-properties=' + b + ' data-group-by="id" data-selection-required="true" data-focus-first-result="true" data-min-length="1" data-value-property=' + b + ' data-text-property="{id}, {Incidente}, {Prioridad}" data-search-contain="false" id="swal-input2" value="' + incidente.Incidente + '" >';



        swal.fire({
            title: 'Notificar a todos',
            text: "Esta acción enviará una notificación a todos los elementos desplegados en el mapa \n¿Desea continuar?",
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, enviar a todos'
        }).then((result) => {
            if (result.value) {
                var lugar = document.getElementById("Lugar");
                var numPiso = "";
                if (lugar.value === "Edificio" || lugar.value === "Departamento" || lugar.value === "Casa") {
                    if (document.getElementById("DescripcionLugar").value !== "") {
                        numPiso = " ~ Piso: " + document.getElementById("UbicacionPiso").value;
                    }
                }
                Swal.fire({
                    title: 'Notificación',
                    html: //-------------------------TITULO
                            '<label class="sweetalrtTitle" >Esta información sera la que le llegue al elemento que se le envia la notificación</label>' +
                            //-------------------------FOLIO
                            '<label class="sweetalrt">Folio</label>' +
                            '<input id="swal-input1" type="text" class="readonly swal2-input" value="' + document.getElementById("folio").value + '" >' +
                            //-------------------------TIPO DE EMERGENCIA
                            '<label class="sweetalrt">Tipo de Emergencia</label>' +
                            //'<input id="swal-input2" type="text" class="readonly swal2-input" value="' + incidente.Incidente + '" readonly="true">' +
                            '<br>' +
                            c +
                            '<input id="swal-input3" type="hidden" class="swal2-input" value="' + incidente.id + '">' +
                            //-------------------------NIVEL DE ATENCION
                            '<label class="sweetalrt">Nivel de atención</label>' +
                            '<input id="swal-input4" type="text" class="readonly swal2-input" value="' + Prioridad + '" readonly="true">' +
                            //-------------------------DESCRIPCION DEL LUGAR 
                            '<label class="sweetalrt">Descripción del Lugar</label>' +
                            '<input id="swal-input5" class="swal2-input" value="' + document.getElementById("DescripcionLugar").value + numPiso + '">' +
                            //-------------------------REPORTE
                            '<label class="sweetalrt"">Reporte</label>' +
                            '<textarea id="swal-input6" class="swal2-inputTxtA" rows="5">' + document.getElementById("AreaReporte").value + '</textarea>',
                    focusConfirm: false,
                    preConfirm: () => {
                        return [
                            document.getElementById('swal-input1').value,
                            document.getElementById('swal-input2').value,
                            document.getElementById('swal-input3').value,
                            document.getElementById('swal-input4').value,
                            document.getElementById('swal-input5').value,
                            document.getElementById('swal-input6').value
                        ];
                    }
                }).then((result) => {

                    document.getElementById("folio").value = result.value[0];
                    document.getElementById("DescripcionLugar").value = result.value[4].split("~")[0];
                    document.getElementById("AreaReporte").value = result.value[5];

                    var proceder = true;
                    for (var i = 0; i < result.value.length; i++) {
                        console.log(result.value[i])
                        if (result.value[i] === "" || result.value[i] === null || result.value[i] === undefined) {
                            proceder = false;
                        }
                    }
                    if (proceder)
                    {


                        var data = document.getElementById("DependenciasID").value.split("|");
                        for (var i = 0; i < data.length; i++) {
                            var dependencia = data[i].split(",");

                            var idElementos = document.getElementById("elementos" + dependencia[0] + dependencia[3]).value.split(",");


                            for (var j = 0; j < idElementos.length; j++) {
                                if (idElementos[j] !== "") {

                                    FireBaseKey(idElementos[j], 3, API_KEY, SESSION_ID, TOKEN, dependencia[1]);
                                }
                            }

                        }
                        swal.fire(
                                'Notificaciones enviadas!',
                                'Los elementos estan siendo notificados.',
                                'success'
                                );
                    } else {

                        swal.fire(
                                'Informacion insuficiente en "Descripción de emergencia"',
                                'Favor de rellenar todos los campos: <br>\n\
                            <br>- Folio\n\
                            <br>- Tipo de emergencia\n\
                            <br>- Nivel de atención \n\
                            <br>- Descripcion del lugar\n\
                            <br>- Reporte <br><br>',
                                'error'
                                );
                    }


                });

                //Flexdata del catalogo nacional de incidencias
                $('.Swal2').flexdatalist({
                    searchContain: false,
                    textProperty: "{id}, {Incidente}, {Prioridad}",
                    valueProperty: ["id", "Incidente", "Prioridad"],
                    minLength: 1,
                    focusFirstResult: true,
                    selectionRequired: true,
                    groupBy: 'id',
                    visibleProperties: ["id", "Incidente", "Prioridad"],
                    searchIn: ["id", "Incidente", "Prioridad"],
                    url: PathRecursos + 'json/incidentes.json',
                    relatives: '#relative'
                });

                $('input.Swal2').on('change:flexdatalist', function (event, set, options) {

                    if (set.value !== "") {
                        incidente = JSON.parse(set.value);

                        document.getElementById("nivelemergencia").value = incidente.Prioridad;


                        //                    document.getElementById("divnotificarDependencias").style.display = "block";
                        //                    document.getElementById("ContainerMarcadoresDependencias").style.display = "block";
                        //                    document.getElementById("enviarNotificacion").style.display = "block";
                        document.getElementById("nivelAtencion").style.display = "block";
                        document.getElementById("swal-input4").value = incidente.Prioridad;
                        document.getElementById("chained_relative-flexdatalist").value = incidente.Incidente;

                    } else {
                        document.getElementById("nivelemergencia").value = "";
                        incidente = "";
                        //                    document.getElementById("divnotificarDependencias").style.display = "none";
                        //                    document.getElementById("enviarNotificacion").style.display = "none";
                        document.getElementById("nivelAtencion").style.display = "none";
                        //                    document.getElementById("ContainerMarcadoresDependencias").style.display = "none";
                        document.getElementById("swal-input4").value = "";
                        document.getElementById("chained_relative-flexdatalist").value = "";
                    }
                });
            }

        });



    }

    function enviarNotificacionIndividual(ElementoId, apikey, sesion, token, Dependencia) {


        var a = '["id","Incidente","Prioridad"]';

        var b = "'" + a + "'";
        var Prioridad = "";
        if (incidente.Prioridad !== undefined) {
            Prioridad = incidente.Prioridad;
        }

        var c = '<input type="text" placeholder ="Escribe el código o nombre del incidente" class ="flexdatalist form-control Swal2" data-relatives="#relative" data-url="/sos/resources/json/incidentes.json" data-search-in=' + b + ' data-visible-properties=' + b + ' data-group-by="id" data-selection-required="true" data-focus-first-result="true" data-min-length="1" data-value-property=' + b + ' data-text-property="{id}, {Incidente}, {Prioridad}" data-search-contain="false" id="swal-input2" value="' + incidente.Incidente + '" >';


        swal.fire({
            title: 'Notificar',
            text: "Esta acción enviará una notificación solo al elementos seleccionado en el mapa \n¿Desea continuar?",
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, enviar.'
        }).then((result) => {
            if (result.value) {
                var lugar = document.getElementById("Lugar");
                var numPiso = "";
                if (lugar.value === "Edificio" || lugar.value === "Departamento" || lugar.value === "Casa") {
                    if (document.getElementById("DescripcionLugar").value !== "") {
                        numPiso = " ~ Piso: " + document.getElementById("UbicacionPiso").value;
                    }
                }
                Swal.fire({
                    title: 'Notificación',
                    html: //-------------------------TITULO
                            '<label class="sweetalrtTitle" >Esta información sera la que le llegue al elemento que se le envia la notificación</label>' +
                            //-------------------------FOLIO
                            '<label class="sweetalrt">Folio</label>' +
                            '<input id="swal-input1" type="text" class="readonly swal2-input" value="' + document.getElementById("folio").value + '" >' +
                            //-------------------------TIPO DE EMERGENCIA
                            '<label class="sweetalrt">Tipo de Emergencia</label>' +
                            //'<input id="swal-input2" type="text" class="readonly swal2-input" value="' + incidente.Incidente + '" readonly="true">' +
                            '<br>' +
                            c +
                            '<input id="swal-input3" type="hidden" class="swal2-input" value="' + incidente.id + '">' +
                            //-------------------------NIVEL DE ATENCION
                            '<label class="sweetalrt">Nivel de atención</label>' +
                            '<input id="swal-input4" type="text" class="readonly swal2-input" value="' + Prioridad + '" readonly="true">' +
                            //-------------------------DESCRIPCION DEL LUGAR 
                            '<label class="sweetalrt">Descripción del Lugar</label>' +
                            '<input id="swal-input5" class="swal2-input" value="' + document.getElementById("DescripcionLugar").value + numPiso + '">' +
                            //-------------------------REPORTE
                            '<label class="sweetalrt"">Reporte</label>' +
                            '<textarea id="swal-input6" class="swal2-inputTxtA" rows="5">' + document.getElementById("AreaReporte").value + '</textarea>',
                    focusConfirm: false,
                    preConfirm: () => {
                        return [
                            document.getElementById('swal-input1').value,
                            document.getElementById('swal-input2').value,
                            document.getElementById('swal-input3').value,
                            document.getElementById('swal-input4').value,
                            document.getElementById('swal-input5').value,
                            document.getElementById('swal-input6').value
                        ];
                    }
                }).then((result) => {

                    document.getElementById("folio").value = result.value[0];
                    document.getElementById("DescripcionLugar").value = result.value[4].split("~")[0];
                    document.getElementById("AreaReporte").value = result.value[5];

                    var proceder = true;
                    for (var i = 0; i < result.value.length; i++) {

                        if (result.value[i] === "" || result.value[i] === null || result.value[i] === undefined) {
                            proceder = false;
                        }
                    }
                    if (proceder)
                    {

                        //
                        //                    var data = document.getElementById("DependenciasID").value.split("|");
                        //                    for (var i = 0; i < data.length; i++) {
                        //                        var dependencia = data[i].split(",");
                        //                       
                        //                        var idElementos = document.getElementById("elementos" + dependencia[0] + dependencia[3]).value.split(",");
                        //                      
                        //                       
                        //                        for (var j = 0; j < idElementos.length; j++) {
                        //                            if (idElementos[j] !== "") {
                        //                              
                        //                                FireBaseKey(idElementos[j], 3, API_KEY, SESSION_ID, TOKEN, dependencia[1]);
                        //                            }
                        //                        }
                        //
                        //                    }


                        FireBaseKey(ElementoId, 2, apikey, sesion, token, Dependencia);


                    } else {

                        swal.fire(
                                'Informacion insuficiente en "Descripción de emergencia"',
                                'Favor de rellenar todos los campos: <br>\n\
                            <br>- Folio\n\
                            <br>- Tipo de emergencia\n\
                            <br>- Nivel de atención \n\
                            <br>- Descripcion del lugar\n\
                            <br>- Reporte <br><br>',
                                'error'
                                );
                    }


                });

                //Flexdata del catalogo nacional de incidencias
                $('.Swal2').flexdatalist({
                    searchContain: false,
                    textProperty: "{id}, {Incidente}, {Prioridad}",
                    valueProperty: ["id", "Incidente", "Prioridad"],
                    minLength: 1,
                    focusFirstResult: true,
                    selectionRequired: true,
                    groupBy: 'id',
                    visibleProperties: ["id", "Incidente", "Prioridad"],
                    searchIn: ["id", "Incidente", "Prioridad"],
                    url: PathRecursos + 'json/incidentes.json',
                    relatives: '#relative'
                });

                $('input.Swal2').on('change:flexdatalist', function (event, set, options) {

                    if (set.value !== "") {
                        incidente = JSON.parse(set.value);

                        document.getElementById("nivelemergencia").value = incidente.Prioridad;


                        //                    document.getElementById("divnotificarDependencias").style.display = "block";
                        //                    document.getElementById("ContainerMarcadoresDependencias").style.display = "block";
                        //                    document.getElementById("enviarNotificacion").style.display = "block";
                        document.getElementById("nivelAtencion").style.display = "block";
                        document.getElementById("swal-input4").value = incidente.Prioridad;
                        document.getElementById("chained_relative-flexdatalist").value = incidente.Incidente;

                    } else {
                        document.getElementById("nivelemergencia").value = "";
                        incidente = "";
                        //                    document.getElementById("divnotificarDependencias").style.display = "none";
                        //                    document.getElementById("enviarNotificacion").style.display = "none";
                        document.getElementById("nivelAtencion").style.display = "none";
                        //                    document.getElementById("ContainerMarcadoresDependencias").style.display = "none";
                        document.getElementById("swal-input4").value = "";
                        document.getElementById("chained_relative-flexdatalist").value = "";
                    }
                });


            }

        });


    }

    function directorio() {

        $("#directorio").on("click", function () {
            Swal.fire({
                title: 'Directorio',
                html: //-------------------------TITULO
                        //-------------------------Body 
                        '<label class="sweetalrt" style="padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;">Agrega participantes a la llamada.</label>' +
                        '<div class="col-12" id="agregarTels">' +
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
                        '</div>',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: "Llamar",
                preConfirm: () => {
                    return [

                        //document.getElementById('swal-input5').value,
                        //document.getElementById('swal-input6').value
                    ];
                }
            }).then((result) => {
                if (result.value) {
                    if (tel_a_agregar.length)
                    {
                        let id360 = {
                            id360: sesion_cookie.id_usuario
                        };
                        let to_id360 = new Array();



                        for (var i = 0; i < tel_a_agregar.length; i++) {
                            //                        var encontrado = false;

                            //                        for (var j = 0; j < dataG.integrantes.length; j++) {
                            //                            if (tel_a_agregar[i].idUsuario === dataG.integrantes[j].idUsuarios_Movil) {


                            //                                encontrado = true;
                            //                                var elemento = dataG.integrantes[j]
                            var elemento = tel_a_agregar[i];
                            to_id360.push({
                                id360: elemento.id360
                            });
                            //                                if (!elemento.gps.estatus) {
                            //                                    RegistrarNuevoParticipante(dataG.integrantes[j].idUsuarios_Movil, dataG.integrantes[j].FireBaseKey);
                            //                                } else {
                            //                                    Swal.fire({
                            //                                        type: 'error',
                            //                                        title: "",
                            //                                        //text: 'El reporte se ha guardado correctamente',
                            //                                        html: "<p style=\"    font: bold 12px arial;    margin: 4px;    padding: 0;\">La notificacion no se envio!</p><p style=\"color: back;font: bold 14px Arial; padding: 0; margin: 0;\">El usuario se encuentra atendiendo otra llamada.</p>",
                            //                                        showConfirmButton: false,
                            //                                        timer: 2000
                            //                                    });
                            //                                }

                            //                        break;
                            //                            }
                            //                        }
                            //                        if (!encontrado) {
                            //                            console.warn(tel_a_agregar[i].idUsuario + " NO SE ENCONTRO EN DATAG...");
                            //                        }
                        }


                        id360.to_id360 = to_id360;
                        id360.credenciales = {
                            apikey: data.credenciales.apikey,
                            idsesion: data.credenciales.idsesion,
                            token: data.credenciales.token
                        };
                        id360.idLlamada = data.registro_llamada.idLlamada;
                        console.log(id360);
                        RequestPOST("/API/notificacion/llamada360/agregar_participante", id360).then((msj) => {
                            console.log(msj);
                            let Toast = Swal.mixin({
                                toast: true,
                                position: 'center',
                                showConfirmButton: false,
                                timer: 2000,
                                timerProgressBar: true,
                                didOpen: (toast) => {
                                    toast.addEventListener('mouseenter', Swal.stopTimer)
                                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                                }
                            })

                            Toast.fire({
                                icon: 'success',
                                title: 'Invitacion enviada correctamente.'
                            })
                            //window.open('https://empresas.claro360.com/plataforma360_dev/Llamada/agregar_participante' + msj.registro_llamada.idLlamada + '/' + msj.credenciales.apikey + '/' + msj.credenciales.idsesion + '/' + msj.credenciales.token + '', '_blank');  
                        });
                    }
                }

            });

            vuemodel();
        });
    }

    function vuemodel() {
        tel_a_agregar = new Array();
        var json = Directorio;
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
                    tel_a_agregar.push(op);
                },
                onClose() {
                    //console.info(this.value);
                },
                onRemove(op) {
                    var i = tel_a_agregar.indexOf(op);
                    tel_a_agregar.splice(i, 1);
                }

            }
        }).$mount('#agregarTels');
    }

    $("#btn-reporte").click(function () {

        var Folio = $("#folio").val();
        var Motivo = $("#motivo").val();
        var Reporte = $("#reporte").val();
        var procede = true;
        $("#folio").css("border", "none");
        $("#motivo").css("border", "none");
        $("#reporte").css("border", "none");

        if (Folio === "") {

            procede = false;
            $("#folio").css("border", "solid 1px red");
        }
        if (Motivo === "") {

            procede = false;
            $("#motivo").css("border", "solid 1px red");
        }
        if (Reporte === "") {

            procede = false;
            $("#reporte").css("border", "solid 1px red");
        }

        if (procede) {
            var json = {
                "folio": Folio,
                "motivo": Motivo,
                "reporte": Reporte,
                "idLlamada": data.registro_llamada.idLlamada,
                "hora": getHora(),
                "fecha": getFecha()
            };
            guardarReporteLlamadaSaliente(json).then(function (response) {
                if (response.id > 0) {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'center',
                        showConfirmButton: false,
                        timer: 3000
                    });

                    Toast.fire({
                        type: 'success',
                        title: 'Reporte guardado con exito.'
                    });
                } else {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'center',
                        showConfirmButton: false,
                        timer: 3000
                    });

                    Toast.fire({
                        type: 'error',
                        title: 'Hubo un error al intentar guardar el reporte.'
                    })
                }
            });

        } else {
            Swal.fire(
                    {
                        title: 'Información incompleta',
                        html: "<p style=\"color: white;font-size: 15px; padding: 0; margin: 5%; \">Asegurate de llenar todos los campos para poder guardar el reporte correctamente. </p>",
                        showConfirmButton: false,
                        showCancelButton: false
                    }
            );
        }
    });

    function guardarReporteLlamadaSaliente(json) {
        if (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).hasOwnProperty("tipo_usuario") && JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).hasOwnProperty("tipo_servicio")) {
            json.tipo_usuario = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
            json.tipo_servicio = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio;
        }
        return Promise.resolve($.ajax({
            type: 'POST',
            url: '/' + DEPENDENCIA + '/API/solicitudVideo/guardarReporteLlamadaSaliente',
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(json),
            success: function (response) {
                console.info(response);
            },
            error: function (err) {
                //alert("No hay ubicacion para el usuario:" + idUsuarios_Movil);
                console.error(err)
            }
        }));
    }

    function CardParticipante(gps_data) {

        if (!$("#card" + gps_data.idUsuario_Movil).length)
        {
            var elemento = buscarelemento(gps_data.idUsuario_Movil);
            if (!elemento.img) {
                BackupImage(elemento.idUsuarios_Movil).then(function (response) {
                    if (response.existe) {
                        for (var i = 0; i < dataG.integrantes.length; i++) {
                            if (dataG.integrantes[i].idUsuarios_Movil === elemento.idUsuarios_Movil) {
                                dataG.integrantes[i].img = response.img;
                                elemento.img = response.img;
                                AgregarCardParticipante(elemento);
                                break;
                            }
                        }
                    }
                });
            } else {
                AgregarCardParticipante(elemento);
            }


        }

    }

    function CardParticipante_user_connected(info_user) {

        if (!$("#card" + info_user.id360).length)
        {
            var elemento = buscarelemento_directorio(info_user.id360);
            if (elemento !== null) {
                AgregarCardParticipante360(elemento);

            } else {
                console.error("El usuario no se encontro en el directorio ");
                //Proximamente se tiene que validar el trael la informacion de un usuario que bno este en nuestro catalogo de usuarios 
            }



        }

    }

    function AgregarCardParticipante360(elemento) {

        var container = document.createElement("div");
        container.id = "card" + elemento.id360;
        container.className = "row col-12 m-0 p-0";
        var img = document.createElement("div");
        img.style = "padding:12.5%;background-image:url('" + elemento.img + "'); background-size: cover;  background-repeat: no-repeat;  background-position: center;";
        img.className = "col-3 m-0";
        var card = document.createElement("div");
        card.className = "card col-9 m-0 p-0";
        card.style = "cursor:pointer";
        var body = document.createElement("div");
        body.className = "card-body";

        var divBody = document.createElement("div");

        var title = document.createElement("h5");
        title.className = "card-title";
        title.innerHTML = elemento.nombre + " " + elemento.apellido_paterno + " " + elemento.apellido_materno;
        var text = document.createElement("p");
        text.className = "card-text";
        text.innerHTML = "<strong>Correo: </strong>" + elemento.correo + "<br><strong>Teléfono: </strong>" + elemento.telefono;

        container.appendChild(img);
        container.appendChild(card);
        card.appendChild(body);

        divBody.appendChild(title);
        divBody.appendChild(text);
        body.appendChild(divBody);

        document.getElementById("participantes").appendChild(container);

        //    card.addEventListener("click", function () {
        //
        //        map.setCenter(elemento.gps);
        //        map.setZoom(16);
        //
        //    });
    }

    function AgregarCardParticipante(elemento) {

        var container = document.createElement("div");
        container.id = "card" + elemento.idUsuarios_Movil;
        container.className = "row col-12 m-0 p-0";
        var img = document.createElement("div");
        img.style = "padding:12.5%;background-image:url('" + elemento.img.replace(/(\r\n|\n|\r)/gm, "") + "'); background-size: cover;  background-repeat: no-repeat;  background-position: center;";
        img.className = "col-3 m-0";
        var card = document.createElement("div");
        card.className = "card col-9 m-0 p-0";
        card.style = "cursor:pointer";
        var body = document.createElement("div");
        body.className = "card-body";
        var title = document.createElement("h5");
        title.className = "card-title";
        title.innerHTML = elemento.nombre + " " + elemento.apellido_paterno + " " + elemento.apellido_materno;
        var text = document.createElement("p");
        text.className = "card-text";
        text.innerHTML = "<strong>Elemento de: </strong>" + elemento.aliasServicio + "<br><strong>Teléfono: </strong>" + elemento.telefono;

        container.appendChild(img);
        container.appendChild(card);
        card.appendChild(body);
        body.appendChild(title);
        body.appendChild(text);

        document.getElementById("participantes").appendChild(container);

        card.addEventListener("click", function () {

            map.setCenter(elemento.gps);
            map.setZoom(16);

        });
    }

    function buscarelemento(idUsuario_Movil) {
        for (var i = 0; i < dataG.integrantes.length; i++) {
            if (dataG.integrantes[i].idUsuarios_Movil === idUsuario_Movil) {
                return dataG.integrantes[i];
                break;
            }
        }
    }

    function buscarelemento_directorio(id360) {
        for (var i = 0; i < Directorio.length; i++) {
            if (Directorio[i].id360 === id360) {
                return Directorio[i];
                break;
            }
        }
        return null;
    }

    habilitarMaximizarVideo();

};