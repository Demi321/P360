/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



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
        
        if(mensaje.cambio_parametro_grupo){
            switch(mensaje.columna){
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
        }
        
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
        if(mensaje.chat_empresarial){
            if(mensaje.chat_empresarial_mio){
                agregar_chat_enviado(mensaje, false);
            }else{
                if((mensaje.idGroup !== undefined && mensaje.idGroup !== null) && mensaje.id360 === sesion_cookie.idUsuario_Sys ){
                    agregar_chat_enviado(mensaje, false);
                }
                if( mensaje.id360 === undefined || mensaje.id360 === null ){
                    despliegaMensajeSistema( mensaje.message, mensaje.to_id360, mensaje.date_created, mensaje.time_created);
                }else{
                    let group = mensaje.idGroup !== undefined && mensaje.idGroup !== null ? true: false;
                    recibir_chat(mensaje, false, group, true);
                }
            }
        }
        
        if(mensaje.edicion_mensaje_chat_empresarial){
            
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
            iconEdit.attr("id","historial_ediciones_" + mensaje.idMensaje);

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

                        if(tipo === 0){
                            services = "/API/empresas360/eliminaMensaje";
                            dataMensaje.id360 = sesion_cookie.idUsuario_Sys;
                            dataMensaje.to_id360 = mensaje.to_id360;
                        }else{
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
                action: function(option, contextMenuIndex, optionIndex) {
                    eliminaMensaje(1);
                },
                submenu: null,
                disabled: false 
            }];
               
            console.log("Eliminar para todos");
            myMenu.push({
                icon: 'fas fa-trash',
                label: 'Eliminar mensaje para todos',
                action: function(option, contextMenuIndex, optionIndex) {
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
                    action: function(option, contextMenuIndex, optionIndex) {
console.log("Vamos a editar");
                        let contenedorReenvia = $("#filaMensajesOperaciones_" + mensaje.to_id360);
                        contenedorReenvia.removeClass("d-none");
                        $("#accionMensajesOpciones_" + mensaje.to_id360).text("Editando");
                        $("#message_input_" + mensaje.to_id360).val(mensaje.mensaje_editado);
                        $("#message_input_" + mensaje.to_id360).select();
                        contenedorReenvia.find("span").text(mensaje.mensaje_editado);
                        $("#accionMensajesOpciones_" + mensaje.to_id360).text("Editando");
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
                action: function(option, contextMenuIndex, optionIndex) {
                    reenviaMensaje(mensaje.mensaje_editado, mensaje.nuevo.type);
                },
                submenu: null,
                disabled: false 
            });
            
            console.log("Responder");
            myMenu.push({
                icon: 'fas fa-reply',
                label: 'Responder mensaje',
                action: function(option, contextMenuIndex, optionIndex) {
                    responderMensaje();
                },
                submenu: null,
                disabled: false 
            });

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
            
            if(mensaje.nuevo.idResponse !== null && mensaje.nuevo.idResponse !== undefined){
                let mensajeRespuesta = mensaje.nuevo.mensajeRespuesta === undefined ? mensaje.mensajeRespondido.message : mensaje.nuevo.mensajeRespuesta;
                let smallRespuesta = $("<small></small>").addClass("respuesta-mensaje");
                smallRespuesta.text(mensajeRespuesta);
                message.prepend(smallRespuesta);

                smallRespuesta.click(() => {
                    
                    const remarcaMensaje = (idMensaje) => {
                        document.querySelector("#mensaje_" + idMensaje).scrollIntoView();
                        let resaltar = setInterval(() => {
                            $("#mensaje_"+ idMensaje).toggleClass("respondida");
                        }, 250);

                        setTimeout(() => {
                            clearInterval(resaltar);
                            $("#mensaje_"+ idMensaje).removeClass("respondida");
                        }, 2000);
                    };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                    if( $("#mensaje_" + mensaje.nuevo.idResponse).length ){
                        
                        remarcaMensaje(mensaje.nuevo.idResponse);
                        
                    }else{
                        
                        const buscaMensajeRespuesta = () => {
                            if( $("#contact_messaging" + mensaje.to_id360).find(".liMasMensajes").length ){
                                cargaMasMensajes(mensaje.to_id360).then((response) => {
                                    if( $("#mensaje_" + mensaje.nuevo.idResponse).length ){
                                        remarcaMensaje(mensaje.nuevo.idResponse);
                                    }else if(response){
                                        buscaMensajeRespuesta();
                                    }else{
                                        NotificacionToas.fire({
                                            title: 'No se ha encontrado el mensaje'
                                        });
                                    }
                                    
                                });
                            }else{
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
            
        }
        
        if(mensaje.eliminacion_mensaje_chat_empresarial){
            
            let liMensaje = $("#mensaje_"+mensaje.idMensaje);
            let pMensaje = liMensaje.find('p');
            pMensaje.empty();
            pMensaje.text("Mensaje eliminado");
            let iconMensajeEliminado = $("<i></i>").addClass("fas fa-comment-slash");
            iconMensajeEliminado.css({"margin-left":"10px"});
            if(mensaje.eliminacion_mensaje_chat_empresarial_mio){
                pMensaje.prepend(iconMensajeEliminado);
            }else{
                pMensaje.append(iconMensajeEliminado);
            }
            pMensaje.css({
                "background-color":"transparent",
                "font-style":"italic",
                "font-size":"1.1rem",
                "color":"#434343"
            });
            
        }
        
        if(mensaje.eliminacion_mensaje_chat_empresarial_solo_mio){
            let liMensaje = $("#mensaje_"+mensaje.idMensaje);
            liMensaje.remove();
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

    }

};
