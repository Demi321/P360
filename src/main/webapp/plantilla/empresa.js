/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



/* global NotificacionToas, WebSocketGeneral, CantidadMensajesPorChat, buttonNotificacionLlamada */

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
        
        if(mensaje.eliminado_grupo){
            eliminadoParticipanteGrupoChat(mensaje);
        }
        
        if(mensaje.mensaje_destacado){
            nuevoMensajeDestacado(mensaje);
        }
        
        if(mensaje.eliminado_mensaje_destacado){
            eliminarMensajeDestacado(mensaje);
        }
        
        if(mensaje.nuevo_usuario_favorito){
            nuevoUsuarioFavorito(mensaje);
        }
        
        if(mensaje.elimina_usuario_favorito){
            eliminaUsuarioFavorito(mensaje);
        }
        
        if(mensaje.cambio_parametro_grupo){
            cambioParametroGrupoChat(mensaje);
        }
        
        if(mensaje.grupo_chat_empresarial){
            nuevoGrupoChatEmpresarial(mensaje);
        }
        
        if(mensaje.chat_empresarial){
            nuevoMensajeChatEmpresarial(mensaje);
        }
        
        if(mensaje.agregado_grupo_chat_empresarial){ 
            nuevoParticipanteGrupoChat(mensaje);
        }
        
        if(mensaje.edicion_mensaje_chat_empresarial){
            edicionMensajeChatEmpresarial(mensaje);
        }
        
        if(mensaje.eliminacion_mensaje_chat_empresarial){
            eliminacionMensajeChatEmpresarial(mensaje);
        }
        
        if(mensaje.eliminacion_mensaje_chat_empresarial_solo_mio){
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
