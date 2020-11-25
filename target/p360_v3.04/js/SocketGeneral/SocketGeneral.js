/* global PATHWEBSOCKET, DEPENDENCIA, dataG */

//var PATHWEBSOCKET = "ws://localhost:8080/";
var idSocketOperador = null;
var WebSocketGeneral = new WebSocket(PATHWEBSOCKET);



WebSocketGeneral.onopen = function () {
    EnviarMensajePorSocket();
};

var credenciales = null;

WebSocketGeneral.onmessage = function (message) {

    var mensaje = JSON.parse(message.data);
    console.log(mensaje);
    if (credenciales === null) {
        credenciales = mensaje;

    }

    try {

        if (mensaje.inicializacionSG) {
            idSocketOperador = mensaje.idSocket;
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
        if (mensaje.registrar_incidente) {
           
           var LatitudIncidente = mensaje.lat;
            var LongitudIncidente = mensaje.lng;
            var rad = Math.PI / 180;
            var d = (6372795.477598) * Math.acos(Math.sin(LatitudIncidente * rad) * Math.sin(Latitud * rad) + Math.cos(LatitudIncidente * rad) * Math.cos(Latitud * rad) * Math.cos((LongitudIncidente * rad) - (Longitud * rad)));
            if (d < 500) {
                insertarIncidenteCercano(mensaje);
            }
        }
        if (mensaje.incidentesCercanos) {
            console.log("incidentesCercanos");
           
            if ($("#loadingIncidentes").length) {
                document.getElementById("loadingIncidentes").parentNode.removeChild(document.getElementById("loadingIncidentes"));
            }
            var respuesta = mensaje.incidentesCercanos;
             console.log(respuesta.length);
            if (respuesta.length === 0) {

                SinIncidentes();
            }
            for (var i = 0; i < respuesta.length; i++) {
                console.log(respuesta[i]);
                insertarIncidenteCercano(respuesta[i]);
            }
        }





    } catch (e) {

    }

};

WebSocketGeneral.onerror = function (e) {
    console.error(e);
    //location.reload();
};
WebSocketGeneral.onclose = function (e) {

    console.error("Se cerro el socket de soporte");
};

function solicitarBackupLlamadas() {
    var json = {
        "BackupLlamadas": true,
        "idSocket": idSocketOperador,
        "BackupCardLlamada":true
    };
    EnviarMensajePorSocket(json);
}

function EnviarMensajePorSocket(json) {
    if (json === undefined) {
        json = {};
    }
    var k = Object.keys(json);
    for (var i = 0; i < k.length; i++) {
        if (json[k[i]] === null) {
            console.warn("Llave: " + k[i] + " con valor nulo");
        }
    }
    if(JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area===undefined){
        
    }

    json.idUsuario = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys;
    json.id360 = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys;
    json.tipo_usuario = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
    json.tipo_servicio = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio;
    json.tipo_area = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area;
    json.fecha_envio = getFecha();
    json.hora_envio = getHora();
    json.idSocket = idSocketOperador;

    //console.log(json);
    WebSocketGeneral.send(JSON.stringify(json));
}


function solicitarBackupReporteElemento() {
    var json = {
        "Back": true,
        "idSocket": idSocketOperador,
        "Backup":"Backup"
    };
    EnviarMensajePorSocket(json);
}