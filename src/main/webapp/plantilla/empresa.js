/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



/* global NotificacionToas, WebSocketGeneral, CantidadMensajesPorChat, buttonNotificacionLlamada, buttonNotificacionCorreo */

//
//Obtenet la posicion del usuario 
var location_user = null;
getLocation();

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.warn("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
//    console.log(position);
    location_user = position.coords;
    var coords = {lat: location_user.latitude, lng: location_user.longitude};
    var geo_coder = new google.maps.Geocoder;
    geo_coder.geocode({'location': coords}, function (results, status) {

        if (status === 'OK')
        {
//            console.log(results);
            location_user.estado = null;
            location_user.estado_long = null;
            location_user.colonia = null;
            location_user.municipio = null;
            location_user.delegacion = null;

            for (var i = 0; i < results.length; i++)
            {

                for (var j = 0; j < results[i].address_components.length; j++) {

                    if (location_user.estado !== null)
                        break;
                    for (var z = 0; z < results[i].address_components[j].types.length; z++) {


                        if (results[i].address_components[j].types[z] === "administrative_area_level_1") {

                            location_user.estado = results[i].address_components[j].short_name.toUpperCase().slice(0, 3);
                            location_user.estado_long = results[i].address_components[j].long_name;

                            //alert("Estado: "+estado);
                        }
                        if (results[i].address_components[j].types[z] === "sublocality_level_1") {

                            location_user.colonia = results[i].address_components[j].short_name;

                            //alert("Colonia: "+colonia);
                        }
                        if (results[i].address_components[j].types[z] === "locality") {

                            location_user.municipio = results[i].address_components[j].short_name;

                            //alert("Municipio: "+municipio);
                        }
                        if (results[i].address_components[j].types[z] === "administrative_area_level_3") {

                            location_user.delegacion = results[i].address_components[j].long_name;

                            //alert("Municipio: "+municipio);
                        }
                        if (location_user.estado !== null && location_user.delegacion !== null && location_user.colonia !== null && location_user.municipio !== null) {
                            break;
                        }
                    }
                }
            }
            if (location_user.municipio !== null) {
                $("#home_empleado_municipio").text(" " + location_user.municipio);
                $("#home_empleado_municipio").text(" " + location_user.colonia);
            }
            if (location_user.estado !== null) {
                $("#home_empleado_estado").text(" - " + location_user.estado_long);
            }

            if (location_user.municipio !== null) {
                $("#reporte_seguridad_sanitaria_municipio").text(" " + location_user.municipio);
                $("#reporte_seguridad_sanitaria_municipio").text(" " + location_user.colonia);
            }
            if (location_user.estado !== null) {
                $("#reporte_seguridad_sanitaria_estado").text(" - " + location_user.estado_long);
            }

            if (location_user.municipio !== null) {
                $("#reporte_evento_incidente_municipio").text(" " + location_user.municipio);
                $("#reporte_evento_incidente_municipio").text(" " + location_user.colonia);
            }
            if (location_user.estado !== null) {
                $("#reporte_evento_incidente_estado").text(" - " + location_user.estado_long);
            }
            if (location_user.municipio !== null) {
                $("#entrada_salida_municipio").text(" " + location_user.municipio);
                $("#entrada_salida_municipio").text(" " + location_user.colonia);
            }
            if (location_user.estado !== null) {
                $("#entrada_salida_estado").text(" - " + location_user.estado_long);
            }
            try {
                FunClima(location_user.estado_long);
            } catch (e) {
                console.warn(e);
            }


        }
    });

//    console.log(location_user);
}


WebSocketGeneral.onmessage = function (message) {
    var mensaje = JSON.parse(message.data);
    console.log(mensaje);
    if (credenciales === null) {
        credenciales = mensaje;
    }
    try {

        if(mensaje.nueva_respuesta_de_archivo){
            agregarRespuestaDeCorreo(mensaje);
            buttonNotificacionCorreo.click();
        }

        if (mensaje.archivo_recibido) {
            recibirArchivoSocket(mensaje);
        }

        if (mensaje.eliminado_grupo) {
            eliminadoParticipanteGrupoChat(mensaje);
        }

        if (mensaje.mensaje_destacado) {
            nuevoMensajeDestacado(mensaje);
        }

        if (mensaje.eliminado_mensaje_destacado) {
            eliminarMensajeDestacado(mensaje);
        }

        if (mensaje.nuevo_usuario_favorito) {
            nuevoUsuarioFavorito(mensaje);
        }

        if (mensaje.elimina_usuario_favorito) {
            eliminaUsuarioFavorito(mensaje);
        }

        if (mensaje.cambio_parametro_grupo) {
            cambioParametroGrupoChat(mensaje);
        }

        if (mensaje.grupo_chat_empresarial) {
            nuevoGrupoChatEmpresarial(mensaje);
        }

        if (mensaje.chat_empresarial) {
            nuevoMensajeChatEmpresarial(mensaje);
        }

        if (mensaje.agregado_grupo_chat_empresarial) {
            nuevoParticipanteGrupoChat(mensaje);
        }

        if (mensaje.edicion_mensaje_chat_empresarial) {
            edicionMensajeChatEmpresarial(mensaje);
        }

        if (mensaje.eliminacion_mensaje_chat_empresarial) {
            eliminacionMensajeChatEmpresarial(mensaje);
        }

        if (mensaje.eliminacion_mensaje_chat_empresarial_solo_mio) {
            eliminacionMensajeChatEmpresarialMio(mensaje);
        }

        if (mensaje.inicializacionSG) {
            idSocketOperador = mensaje.idSocket;
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

        if (mensaje.sesionelemento) {
            initializeSessionElemento(mensaje);
        }

        if (mensaje.ActualizaGPS) {
            for (var k = 0; k < dataG.integrantes.length; k++) {
                if (dataG.integrantes[k].idUsuarios_Movil === mensaje.idUsuarios_Movil) {
                    dataG.integrantes[k].gps.ult.lat = mensaje.lat;
                    dataG.integrantes[k].gps.ult.lng = mensaje.lng;
                    dataG.integrantes[k].gps.hora = mensaje.hora;
                    dataG.integrantes[k].gps.fecha = mensaje.fecha;
                    if (mensaje.gpsOTS) {

                        dataG.integrantes[k].gps.estatus = "ocupado";
                        if (document.getElementById("LlamarFirebase:" + mensaje.idUsuarios_Movil) !== null) {
                            document.getElementById("LlamarFirebase:" + mensaje.idUsuarios_Movil).className = "botonllamada btn btn-outline-secondary btn-sm";
                            document.getElementById("LlamarFirebase:" + mensaje.idUsuarios_Movil).value = "En llamada";
                            document.getElementById("LlamarFirebase:" + mensaje.idUsuarios_Movil).disabled = true;
                            document.getElementById("infowindowfecha" + mensaje.idUsuarios_Movil).innerHTML = mensaje.fecha;
                            document.getElementById("infowindowhora" + mensaje.idUsuarios_Movil).innerHTML = mensaje.hora;
                            console.log(mensaje);
                            console.log(document.getElementById("infowindowhora" + mensaje.idUsuarios_Movil));

                        }
                    } else {

                        if (dataG.integrantes[k].gps.estatus) {



                            delete dataG.integrantes[k].gps.estatus;


                            if (document.getElementById("LlamarFirebase:" + mensaje.idUsuarios_Movil) !== null) {
                                document.getElementById("LlamarFirebase:" + mensaje.idUsuarios_Movil).className = "botonllamada btn btn-outline-success btn-sm";
                                document.getElementById("LlamarFirebase:" + mensaje.idUsuarios_Movil).value = "Llamar";
                                document.getElementById("LlamarFirebase:" + mensaje.idUsuarios_Movil).disabled = false;

                            }

                        }
                    }

                    moveMarker(mensaje.idUsuarios_Movil);
                    break;
                }

            }
        }
    } catch (e) {
        console.warn(e);
    }

};


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
//
//            Swal.fire({
//                text: '¿Cómo quieres continuar la llamada? (Selecciona ventana externa.)',
//                showCancelButton: true,
//                confirmButtonText: `Ventana externa`,
//                cancelButtonText: `Aquí mismo.`
//            }).then((result) => {
//                /* Read more about isConfirmed, isDenied below */
//                console.log("Presionado " + result.isConfirmed);
//                console.log(result);
//                if (result.value) {
//                    console.log("Externa");
            //revisar si credenciales trae roomname 
            if (mensaje.credenciales.roomName) {
                RequestPOST("/API/cuenta360/access_token", {
                    "token": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).token,
                    "id360": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).idUsuario_Sys,
                    "id_sesion": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).id_sesion
                }).then(function (response) {
                    if (response.success) {
                        //access_token
                        let nombre = sesion_cookie.nombre + " " + sesion_cookie.apellido_p + " " + sesion_cookie.apellido_m;
                        window.open('https://meeting.claro360.com/room/' + mensaje.credenciales.roomName + "/usr360/" + sesion_cookie.id_usuario + "/" + sesion_cookie.id_sesion + "/" + sesion_cookie.tipo_usuario + "/" + sesion_cookie.tipo_servicio + "/" + sesion_cookie.tipo_area + "/" + response.access_token + "/" + normalize_text(nombre) + "/" + mensaje.registro_llamada.idLlamada, '_blank');

                    }

                });

            } else {
                window.open('https://empresas.claro360.com/plataforma360/Llamada/' + mensaje.registro_llamada.idLlamada + '/' + mensaje.credenciales.apikey + '/' + mensaje.credenciales.idsesion + '/' + mensaje.credenciales.token + '', '_blank');
            }
//                } else {
//                    console.log("Aquí mismo");
//                    console.log(result);
//                    $("#menu_section_Comunicación").click();
//                    initCall(mensaje);
//                }
//            });

        }
    });
    $(".swal2-actions").addClass("m-0");
    $(".swal2-cancel").addClass("mt-0");
    $(".swal2-confirm").addClass("mt-0");


}

function prueba_notificacion(mensaje) {
    console.log("prueba_notificacion");
    if (Notification) {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
        var title = "Llamada entrante:";
        var extra = {
            icon: mensaje.emisor.img,
            body: mensaje.emisor.nombre + " " + mensaje.emisor.apellido_paterno + " " + mensaje.emisor.apellido_materno,
            timeout: 5000, // Timeout before notification closes automatically.
            vibrate: [100, 100, 100] // An array of vibration pulses for mobile devices.
        };
        var notificar = new Notification(title, extra);
        notificar.onclick = function () {
            console.log('notification.Click');

            reproduccionSonidoNotificacion.loop = false;
            reproduccionSonidoNotificacion.pause();
            if (mensaje.credenciales.roomName) {
                RequestPOST("/API/cuenta360/access_token", {
                    "token": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).token,
                    "id360": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).idUsuario_Sys,
                    "id_sesion": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).id_sesion
                }).then(function (response) {
                    if (response.success) {
                        //access_token
                        let nombre = sesion_cookie.nombre + " " + sesion_cookie.apellido_p + " " + sesion_cookie.apellido_m;
                        window.open('https://meeting.claro360.com/room/' + mensaje.credenciales.roomName + "/usr360/" + sesion_cookie.id_usuario + "/" + sesion_cookie.id_sesion + "/" + sesion_cookie.tipo_usuario + "/" + sesion_cookie.tipo_servicio + "/" + sesion_cookie.tipo_area + "/" + response.access_token + "/" + normalize_text(nombre) + "/" + mensaje.registro_llamada.idLlamada, '_blank');

                    }

                });

            } else {
                window.open('https://empresas.claro360.com/plataforma360/Llamada/' + mensaje.registro_llamada.idLlamada + '/' + mensaje.credenciales.apikey + '/' + mensaje.credenciales.idsesion + '/' + mensaje.credenciales.token + '', '_blank');
            }

//            Swal.fire({
//                text: '¿Cómo quieres continuar la llamada? (Selecciona ventana externa.)',
//                showCancelButton: true,
//                confirmButtonText: `Ventana externa`,
//                cancelButtonText: `Aquí mismo.`
//            }).then((result) => {
//                /* Read more about isConfirmed, isDenied below */
//                console.log("Presionado " + result.isConfirmed);
//                console.log(result);
//                if (result.value) {
//                    console.log("Externa");
//                    window.open('https://empresas.claro360.com/plataforma360_dev_moises/Llamada/' + mensaje.registro_llamada.idLlamada + '/' + mensaje.credenciales.apikey + '/' + mensaje.credenciales.idsesion + '/' + mensaje.credenciales.token + '', '_blank');  
//                } else{
//                    console.log("Aquí mismo");
//                    Swal.close();
//                    $("#menu_section_Comunicación").click();
//                    initCall(mensaje); 
//                }
//            });

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

