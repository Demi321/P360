

/* global RequestPOST, swal, Swal, marcador3, DEPENDENCIA, marcador5, map5, google, RequestGET, XLSX, GenerarCredenciales, Credenciales, reproduccionSonidoNotificacion, buttonNotificacionLlamada, moment, swalConfirmDialog, NotificacionToas */
//alert("Hola")
console.log("Empleado");
var directorio_completo = null;
RequestPOST("/API/ConsultarDirectorio", {
    "fecha": getFecha(),
    "hora": getHora(),
    "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
    "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
//    "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area,
    "tipo_area": "0"
}).then((response) => {
    directorio_completo = response.directorio;
});

var configuracionUsuario = null;
RequestPOST("/API/empresas360/configuracionUsuario", {id360:JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario}).then((response) => {
    if(response.length>0){
        configuracionUsuario = response[0];
    }
});

WebSocketGeneral.onmessage = function (message) {

    var mensaje = JSON.parse(message.data);
    console.log(mensaje);
    if (credenciales === null) {
        credenciales = mensaje;
    }

    try {
        
        if(mensaje.grupo_chat_empresarial){
            let participantesParaGrupo = mensaje.participantes;
            participantesParaGrupo.push( mensaje.idUser );
            let dataContac = {
                "id360": mensaje.id_grupo,
                "nombre_grupo": mensaje.nombre_grupo,
                "img": mensaje.icono_grupo,
                "descripcion_grupo": mensaje.descripcion_grupo,
                "participantes": participantesParaGrupo.toString()
            };
            contacto_chat(dataContac, true);
            $("#profile_chat"+mensaje.id_grupo).click();
            
            NotificacionToas.fire({
                title: 'Bienvenido al grupo ' + mensaje.nombre_grupo
            });
        }

        if (mensaje.inicializacionSG) {
            idSocketOperador = mensaje.idSocket;
        }
        
        if(mensaje.edicion_mensaje_chat_empresarial){
            
            const li = $("#mensaje_" + mensaje.idMensaje);
            let pMensaje = $("#mensaje_" + mensaje.idMensaje).find("p");
            pMensaje.empty();
            pMensaje.text(mensaje.mensaje_editado);

            let fechaDespliega = moment().format("DD-MMM-YY hh:mm A");

            let fecha = $("<span></span>").addClass("time");
            fecha.text(fechaDespliega);
            let iconClock = $("<li></li>").addClass("far fa-clock");
            let spanEdit = $("<span></span>");
            let iconEdit = $("<li></li>").addClass("fas fa-edit");
            spanEdit.append(iconEdit);
            iconEdit.attr("id","historial_ediciones_" + mensaje.idMensaje);

            fecha.prepend(iconClock);
            fecha.prepend(spanEdit);
            iconClock.addClass("mr-2");
            iconEdit.addClass("mr-2");

            iconEdit.css({
                "cursor":"pointer"
            });

            pMensaje.append(fecha);

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

                        if(tipo === 0){
                            services = "/API/empresas360/eliminaMensaje";
                            dataMensaje.id360 = sesion_cookie.idUsuario_Sys;
                            dataMensaje.to_id360 = mensaje.nuevo.id360;
                        }else{
                            services = "/API/empresas360/eliminaMensajeParaMi";
                            dataMensaje.idUser = sesion_cookie.idUsuario_Sys;
                        }

                        RequestPOST(services, dataMensaje).then((response) => {
                            apagaValores();
                            if (response.success) {
                                menuOpcionesMensaje.removeClass("conAltura");
                                if(tipo === 0){
                                    pMensaje.empty();
                                    pMensaje.text("Mensaje eliminado");
                                    let iconMensajeEliminado = $("<i></i>").addClass("fas fa-comment-slash");
                                    iconMensajeEliminado.css({"margin-right": "10px"});
                                    pMensaje.prepend(iconMensajeEliminado);
                                    pMensaje.css({
                                        "background-color": "transparent",
                                        "font-style": "italic",
                                        "font-size": "1.1rem"
                                    });
                                }else{
                                    li.remove();
                                }

                            }
                        });

                    }
                });
            };

            //LISTADO DE OPCIONES POR MENSAJE
            let menuOpcionesMensaje = $("<ul></ul>").addClass("menuOpcionesMensaje").attr("id","menuOpcionesMensaje_" + user.id360);

            //OPCION DE ELIMINAR MENSAJE
            let opcionEliminaMensaje = $("<li></li>").addClass("opcionMensaje");
            opcionEliminaMensaje.text("Eliminar para todos");
            opcionEliminaMensaje.click(() => {
                eliminaMensaje(0);
            });
            menuOpcionesMensaje.append(opcionEliminaMensaje);

            //OPCION PARA ELIMINAR MENSAJE SOLO PARA MI
            let opcionEliminaMensajeMi = $("<li></li>").addClass("opcionMensaje");
            opcionEliminaMensajeMi.text("Eliminar para mi");
            opcionEliminaMensajeMi.click(() => {
                eliminaMensaje(1);
            });
            menuOpcionesMensaje.append(opcionEliminaMensajeMi);

            //OPCION PARA REENVIAR EL MENSAJE
            let opcionReenviaMensaje = $("<li></li>").addClass("opcionMensaje");
            opcionReenviaMensaje.text("Reenviar mensaje");
            opcionReenviaMensaje.click(() => {

                menuOpcionesMensaje.removeClass("conAltura");
                reenviaMensaje(mensaje.mensaje_editado, mensaje.nuevo.type);

            });
            menuOpcionesMensaje.append(opcionReenviaMensaje);

            //OPCION PARA EDITAR EL MENSAJE
            let opcionEditaMensaje = $("<li></li>").addClass("opcionMensaje");
            opcionEditaMensaje.text("Editar mensaje");
            opcionEditaMensaje.click(() => {

                let contenedorReenvia = $("#filaMensajesOperaciones_" + mensaje.nuevo.id360);
                $("#message_input_" + mensaje.nuevo.id360).val(mensaje.mensaje_editado);
                $("#message_input_" + mensaje.nuevo.id360).select();
                contenedorReenvia.removeClass("d-none");
                contenedorReenvia.find("span").text(mensaje.mensaje_editado);
                $("#accionMensajesOpciones_" + mensaje.nuevo.id360).text("Editando");
                banderaEditando = true;
                idMensajeEditando = mensaje.idMensaje;
                menuOpcionesMensaje.removeClass("conAltura");

            });
            menuOpcionesMensaje.append(opcionEditaMensaje);

            //OPCION PARA RESPONDER UN MENSAJE
            let opcionRespondeMensaje = $("<li></li>").addClass("opcionMensaje");
            opcionRespondeMensaje.text("Responder mensaje");
            opcionRespondeMensaje.click(() => {

                let contenedorResponde = $("#filaMensajesOperaciones_" + mensaje.nuevo.id360);
                contenedorResponde.removeClass("d-none");
                contenedorResponde.find("span").text(mensaje.mensaje_editado);
                $("#accionMensajesOpciones_" + mensaje.nuevo.id360).text("Respondiendo");
                banderaRespondiendo = true;
                idMensajeRespondiendo = mensaje.idMensaje;
                menuOpcionesMensaje.removeClass("conAltura");

            });
            menuOpcionesMensaje.append(opcionRespondeMensaje);

            li.dblclick(() => {
                opcionRespondeMensaje.click();
            });

            pMensaje.append(menuOpcionesMensaje);

            pMensaje.mouseenter(() => {
                iconOpciones.css({"display": "block"});
            }).mouseleave(() => {
                iconOpciones.css({"display": "none"});
            });

            iconOpciones.click(() => {

                menuOpcionesMensaje.toggleClass("conAltura");

            });

            spanEdit.click(() => {
                mensajeViejo(mensaje.nuevo.oldMessage, mensaje.mensaje_editado);
            });

            apagaValores();
            
        }
        
        if(mensaje.eliminacion_mensaje_chat_empresarial){
            
            let liMensaje = $("#mensaje_"+mensaje.idMensaje);
            let pMensaje = liMensaje.find('p');
            pMensaje.empty();
            pMensaje.text("Mensaje eliminado");
            let iconMensajeEliminado = $("<i></i>").addClass("fas fa-comment-slash");
            iconMensajeEliminado.css({"margin-left":"10px"});
            pMensaje.append(iconMensajeEliminado);
            pMensaje.css({
                "background-color":"transparent",
                "font-style":"italic",
                "font-size":"1.1rem",
                "color":"#434343"
            });
            
        }
        if (mensaje.llamada_multiplataforma) {
            buttonNotificacionLlamada.click();
            notificacion_llamada(mensaje);
            prueba_notificacion(mensaje);
        }
        if (mensaje.video_empleado) {
            //Verificar si el modulo de videowall empleado existe 
            if ($("#base_modulo_VideoWallEmpleados").length) {
                console.log("Videowall");
                //agregarlo a la lista 
                actualizacion_listado_video_empleados(mensaje);
            }
        }
        /*Cambios fernando*/
        if (mensaje.chat_empresarial) {
            let group = mensaje.idGroup !== undefined && mensaje.idGroup !== null ? true: false;
            recibir_chat(mensaje, false, group);
        }
        /********************************/
    } catch (e) {

    }

};
RequestPOST("/API/ConsultarDirectorio", {
    "fecha": getFecha(),
    "hora": getHora(),
    "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
    "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
    "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area
}).then((directorio) => {
    console.log(directorio);
});
var sesion_jornada_laboral = null;
var BucketName = "lineamientos";
var bucketRegion = "us-east-1";
var IdentityPoolId = "us-east-1:a8460f87-8d3f-4452-935a-b95a4fcc83ed";

var sesion_cookie = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA));
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
//modulos si el tipo de usuario es nulo 


$("#menu_section_MiPerfil").click();

// agregar_menu("Conmutador");
//guardar_reporte_evento();
//guardar_reporte_seguridad();

//habilitarMaximizarVideo();


//function agregar_menu(nombre) {
//    let div = document.createElement("div");
//    div.className = "menu_sidebar d-flex";
//    div.innerHTML = nombre;
//    div.id = "menu_section_" + nombre.replace(/\s/g, "");
//    $("#sidebar").append(div);
//
//    let div2 = document.createElement("div");
//    div2.className = "modulo_section d-none";
//    div2.id = "modulo_section_" + nombre.replace(/\s/g, "");//quitale los espacios si llegara a tener 
////            div2.innerHTML = nombre;
//
//    $("#contenidoSection").append(div2);
//
//    div.addEventListener("click", function () {
//        let modulos = $(".modulo_section");
//        modulos.addClass("d-none");
//        let menus = $(".menu_sidebar");
//        menus.removeClass("menu_selected");
//        $("#modulo_section_" + nombre.replace(/\s/g, "")).removeClass("d-none");
//        $("#menu_section_" + nombre.replace(/\s/g, "")).addClass("menu_selected");
//    });
//
//    if ($("#base_modulo_" + nombre.replace(/\s/g, "")).length) {
//        $("#base_modulo_" + nombre.replace(/\s/g, "")).removeClass("d-none");
////                div2.appendChild($("#base_modulo_"+ nombre.replace(/\s/g, "")));
//        div2.appendChild(document.getElementById("base_modulo_" + nombre.replace(/\s/g, "")));
//    }
//}




function formato_fecha(fecha) {
    let hoy = new Date(fecha);
    let dd = hoy.getDate();
    let mm = hoy.getMonth() + 1; //January is 0!
    let yyyy = hoy.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    let fecha_final = yyyy + '-' + mm + '-' + dd;
    return fecha_final;
}


function initMaps() {
    initMap();
    initMap2();
    initMap3();
    initMap4();
    initMap5();
}



function notificacion_llamada(mensaje) {
    swal.fire({
//        title: 'Sweet!',
//        text: 'Modal with a custom image.',
//        imageUrl: mensaje.emisor.img,
//        imageWidth: 400,
//        imageHeight: 200,
//        imageAlt: 'Custom image',
        html: content_notification_call(mensaje.emisor),
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Atender llamada!',
        cancelButtonText: 'No, atender!',
        allowOutsideClick: false,
        reverseButtons: true
    }).then((result) => {
        console.log(result);
        reproduccionSonidoNotificacion.loop = false;
        reproduccionSonidoNotificacion.pause();
        if (result.value) {
            console.log(mensaje);
            
            Swal.fire({
                text: '¿Cómo quieres continuar la llamada? (Selecciona ventana externa.)',
                showCancelButton: true,
                confirmButtonText: `Ventana externa`,
                cancelButtonText: `Aquí mismo.`
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                console.log("Presionado " + result.isConfirmed);
                console.log(result);
                if (result.value) {
                    console.log("Externa");
                    window.open('https://empresas.claro360.com/plataforma360_dev_moises/Llamada/' + mensaje.registro_llamada.idLlamada + '/' + mensaje.credenciales.apikey + '/' + mensaje.credenciales.idsesion + '/' + mensaje.credenciales.token + '', '_blank');  
                } else{
                  console.log("Aquí mismo");
                  console.log(result);
                  $("#menu_section_Comunicación").click();
                  initCall(mensaje); 
                }
            });
            
        }
    });
    $(".swal2-actions").addClass("m-0");
    $(".swal2-cancel").addClass("mt-0");
    $(".swal2-confirm").addClass("mt-0");


}
;

function prueba_notificacion(mensaje) {
    console.log("prueba_notificacion");
    if (Notification) {
        if (Notification.permission !== "granted") {
            Notification.requestPermission()
        }
        var title = "Llamada entrante:"
        var extra = {
            icon: mensaje.emisor.img,
            body: mensaje.emisor.nombre + " " + mensaje.emisor.apellido_paterno + " " + mensaje.emisor.apellido_materno,
            timeout: 8000, // Timeout before notification closes automatically.
            vibrate: [100, 100, 100] // An array of vibration pulses for mobile devices.
        };
        console.log(title);
        var notificar = new Notification(title, extra);
        notificar.onclick = function () {
            console.log('notification.Click');
              
            reproduccionSonidoNotificacion.loop = false;
            reproduccionSonidoNotificacion.pause();  
              
            Swal.fire({
                text: '¿Cómo quieres continuar la llamada? (Selecciona ventana externa.)',
                showCancelButton: true,
                confirmButtonText: `Ventana externa`,
                cancelButtonText: `Aquí mismo.`
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                console.log("Presionado " + result.isConfirmed);
                console.log(result);
                if (result.value) {
                    console.log("Externa");
                    window.open('https://empresas.claro360.com/plataforma360_dev_moises/Llamada/' + mensaje.registro_llamada.idLlamada + '/' + mensaje.credenciales.apikey + '/' + mensaje.credenciales.idsesion + '/' + mensaje.credenciales.token + '', '_blank');  
                } else{
                    console.log("Aquí mismo");
                    Swal.close();
                    $("#menu_section_Comunicación").click();
                    initCall(mensaje); 
                }
            });
            

        };
        notificar.onerror = function () {
            console.log('notification.Error');
        };
        notificar.onshow = function () {
            console.log('notification.Show');
        };
        notificar.onclose = function () {
            console.log('notification.Close');
        };
    }
    return true;
}

function content_notification_call(emisor) {

    var img = emisor.img;


    if (emisor.telefono === null || emisor.telefono === "null") {
        emisor.telefono = "-";
    }


    let html = '<div class="row col-12 m-0 p-0 w-100">' +
            '<div class="col-4 m-0 p-0" style=" height: calc(130px - 1rem);">' +
            '<div class="infowindow-img" style="background-image: url(' + img + ');"></div>' +
            '</div>' +
            '<div class="col-8 m-0 p-0 pl-2" >' +
            '<div class="col-12 m-0 p-0">' +
            '<h2 class="title text-light text-center border-bottom py-2">' + emisor.nombre + " " + emisor.apellido_paterno + " " + emisor.apellido_materno + '</h2>' +
            '</div>' +
            '<h2 class="title text-white m-0 px-2 py-1">' + emisor.correo + '</h2>' +
            '<h2 class="subtitle text-white m-0 px-2 py-1">Teléfono: ' + emisor.telefono + '</h2>' +
            '<div class="row col-12 m-0 px-2 py-1">' +
            '<label class="col-6 p-0 m-0 subtitle text-white">Fecha:<label class="text text-white" >' + getFecha() + '</label></label>' +
            '<label class="col-6 p-0 m-0 subtitle text-white">Hora:<label class="text text-white">' + getHora() + '</label></label>' +
            '</div>' +
            '</div>' +
            '</div>';

    return html;
}

