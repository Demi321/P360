/* global OT, API_KEY, TOKEN, SESSION_ID, SAMPLE_SERVER_BASE_URL, rectangle, Promise, markers, DEPENDENCIA, PREFIJO_ELEMENTO, CP, map, google, websocket, hostdir, ALIAS, MSJ, DEPENDENCIA_ALIAS, DEPENDENCIA_ICON, infowindow, recordRTC, INCIDENTES, direccion, USR, REPORTE_INCIDENTES, Websocket_Folios, estado, URL_Incidentes, ArrayIncidentesCercanos, DEPENDENCIA_BASE, vue, rango */

try {
    var data = JSON.parse(document.getElementById("data").value);


    data.Dependencias = {};


    data.RegistroLlamada.time.h_atencion_inicio = getFecha() + " " + getHora();
    llenarperfil(data);
    document.getElementById("toggle").innerHTML = data.Modo.nombre;
} catch (exception) {

}
var escalargps = true;
dataG_FULL().then(function (response) {
    for (var i = 0; i < response.integrantes.length; i++) {
        if (response.integrantes[i].gps) {
            if (response.integrantes[i].gps.lng !== "" && response.integrantes[i].gps.lat !== "") {

                response.integrantes[i].gps.lng = parseFloat(response.integrantes[i].gps.lng);
                response.integrantes[i].gps.lat = parseFloat(response.integrantes[i].gps.lat);
            }
        }else{
            //PARCHE
            console.log("Eliminando");
            console.log(response.integrantes[i]);
            response.integrantes.splice(i,1);
            //delete response.integrantes[i];
            i--;
        }

    }
    dataG = response;
    /*for (var i = 0; i < dataG.integrantes.length; i++) {
     if (!moment(dataG.integrantes[i].gps.fecha + " " + dataG.integrantes[i].gps.hora) > moment(new Date((new Date()).getTime() - 1000 * 60 * 30))) {
     dataG.integrantes[i].gps.fecha = "";
     dataG.integrantes[i].gps.hora = "";
     dataG.integrantes[i].gps.lat = "";
     dataG.integrantes[i].gps.lng = "";
     dataG.integrantes[i].gps.ult.lat = "";
     dataG.integrantes[i].gps.ult.lng = "";
     }
     }*/

    try {

        if (BuscarIntegranteDataG(data.RegistroLlamada.idUsuarios_Movil) === null) {
            escalargps = false;
        }
        initializeSessionSOS(data);
        if ($("#DependenciasID").length) {
            document.getElementById("DependenciasID").value = "0," + DEPENDENCIA + "," + DEPENDENCIA + "," + DEPENDENCIA_ALIAS + "," + DEPENDENCIA_ICON + "|" + document.getElementById("DependenciasID").value;
        } else {
            var inputDep = document.createElement("input");
            inputDep.type = "hidden";
            inputDep.id = "DependenciasID";
            inputDep.value = "0," + DEPENDENCIA + "," + DEPENDENCIA + "," + DEPENDENCIA_ALIAS + "," + DEPENDENCIA_ICON;
            document.getElementById("notificarDependencias").appendChild(inputDep);
        }


    } catch (exception) {

    }
});
NuevoIncidente();
vueModelIncidentes();

var proyecto = DatosProyecto();
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");

var ReporteGuardado = false;
var llamadafinalizada = false;

var gps = false;
var NuevoReporte = true;

var ruta = new Array();
var rutaObject = new Array();

var chat = new Array();
var incidente = {};

var FolioIncidentes = "";
var Folio = "";
var prefijoFolio = "";
var incidente_establecido = false;
var chatRecibido = false;

var marcadoresElementos = new Array();
var guardarfolioexterno = false;
var hora_reporte = "";
var sesiones = new Array();

loadingpage();

try {


    if (data.Datos) {
        setTimeout(function () {

            document.getElementById("container_folioexterno").style.display = "none";
            document.getElementById("DescripcionLugar").value = data.Datos.DescripcionLugar;
            document.getElementById("AreaReporte").value = data.Datos.AreaReporte;
            document.getElementById("EstablecerIncidente").style.display = "none";



            NuevoReporte = false;
            incidente = data.Datos.Incidente;
            FolioIncidentes = data.Datos.FolioIncidentes;
            incidente_establecido = true;
            Folio = data.Datos.Folio;
            Latitud = data.Datos.lat;
            Longitud = data.Datos.lng;
            Altitud = 0;
            prefijoFolio = data.Datos.Pre;
            gps = true;


            document.getElementById("headingZero").style = "display:none;";
            document.getElementById("collapseZero").style = "display:none;";
            document.getElementById("headingOne").style = "display:none;";
            document.getElementById("collapseOne").style = "display:none;";




            if (document.getElementById("DependenciasID") !== null && document.getElementById("DependenciasID") !== undefined && document.getElementById("DependenciasID") !== "null" && document.getElementById("DependenciasID") !== "") {
                var dependencias = document.getElementById("DependenciasID").value.split("|");
                for (var i = 1; i < dependencias.length; i++) {
                    var depen = dependencias[i].toString().split(",");
                    var id = depen[0];
                    if (incidente.Dependencias.includes(depen[1])) {
                        document.getElementById(id).checked = false;
                        document.getElementById(id).disabled = true;
                    }
                }
            }

            vue.value = [{"id": data.Datos.Incidente.id, "Incidente": data.Datos.Incidente.Incidente}];

            document.getElementById("nivelemergencia").value = data.Datos.Incidente.Prioridad;
            document.getElementById("folio").value = data.Datos.Pre + data.Datos.Folio;
            document.getElementById("FolioIncidentes").value = data.Datos.FolioIncidentes;

            document.getElementById("collapseZero").className = "collapse";
            document.getElementById("collapseThree").className = "collapse show";

            Latitud = parseFloat(parseFloat(data.Datos.lat).toFixed(7));
            Longitud = parseFloat(parseFloat(data.Datos.lng).toFixed(7));
            Altitud = 0;
            var lat_ant = Latitud;
            var lng_ant = Longitud;
            for (var i = 0; i < markers.length; i++) {
                if (markers[i].id === data.RegistroLlamada.idUsuarios_Movil) {

                    lat_ant = markers[i].getPosition().lat();
                    lng_ant = markers[i].getPosition().lng();
                    break;
                }
            }
            JsonSolicitarListaIncidentes();
            if (!DEPENDENCIA_BASE) {
                mostrarElementos();
                addSlider();
                $("#ragecontainer").css("display", "unset");
                $("#enviarNotificacion").css("display", "unset");
                $("#enviarNotificacion").click(function () {

                    enviarNotificacionCircle();
                });
                //JsonSolicitarListaIncidentes();
            }

            var elemento = {
                "FireBaseKey": null,
                "apellido_materno": data.Usuarios_Movil.apellido_materno,
                "apellido_paterno": data.Usuarios_Movil.apellido_paterno,
                "icon": data.Usuarios_Movil.icon,
                "idUsuarios_Movil": data.Usuarios_Movil.idUsuarios_Movil,
                "img": data.Usuarios_Movil.img,
                "telefono": data.Usuarios_Movil.telefono,
                "nombre": data.Usuarios_Movil.nombre,
                "origen": data.origen,
                "gps": {
                    "moving": false,
                    "actualizada": true,
                    "estadoNotificacion": "",
                    "fecha": data.RegistroLlamada.fecha,
                    "hora": data.RegistroLlamada.hora,
                    "lat": lat_ant,
                    "lng": lng_ant,
                    "ult": {
                        "idUsuario_Movil": data.RegistroLlamada.idUsuarios_Movil,
                        "lat": Latitud,
                        "lng": Longitud
                    }
                }
            };

            var delta = 500;
            var destinoLat = elemento.gps.ult.lat;
            var destinoLng = elemento.gps.ult.lng;

            if (elemento.gps.lat !== destinoLat || elemento.gps.lng !== destinoLng) {

                elemento.gps.deltaLat = parseFloat(((destinoLat - elemento.gps.lat) / delta).toFixed(10));
                elemento.gps.deltaLng = parseFloat(((destinoLng - elemento.gps.lng) / delta).toFixed(10));
            }

            data.elemento = elemento;
            HideMarker(data.Usuarios_Movil.idUsuarios_Movil);
            UpdateMarkerSOS(elemento);
            RegistroLlamadaAtendida(data);
            addCircle();
            gps = true;
            map.setZoom(14);
            map.setCenter(elemento.gps);

            RegistroLlamadaAtendida(data);


        }, 500);

    } else {
        //document.getElementById("ContainerMarcadoresDependencias").style.display = "none";
        //document.getElementById("ContainerMarcadoresDependencias").style.display = "block";
        document.getElementById("container_razonamiento").style.display = "none";
        guardarfolioexterno = true;

    }

} catch (exception) {

    //document.getElementById("ContainerMarcadoresDependencias").style.display = "none";
    document.getElementById("container_razonamiento").style.display = "none";
    guardarfolioexterno = true;
}










$("#reporte").submit(function (e) {
    document.getElementById("DescripcionLugar").value = document.getElementById("DescripcionLugar").value.replace(/'/gi, "\"");
    document.getElementById("AreaReporte").value = document.getElementById("AreaReporte").value.replace(/'/gi, "\"");
    e.preventDefault();

    var idLlamada = data.RegistroLlamada.idLlamada;

    if (Folio) {
        if (idLlamada) {

            var DescripcionLugar = document.getElementById("DescripcionLugar").value;
            var temergencia = incidente.Incidente.toString();
            var prioridad = incidente.Prioridad.toString();
            var reporte = document.getElementById("AreaReporte").value;

            if (guardarfolioexterno) {
                var folioE = document.getElementById("folioExterno").value;
                var razonamiento = "";
                if (folioE !== "") {
                    GuardarReporte(idLlamada, DescripcionLugar, temergencia, prioridad, reporte, folioE, razonamiento);
                } else {
                    const Toast = Swal.fire({
                        title: "Llenar la informacion necesaria",
                        html: "<p style=\"color: white;font-size: 15px; padding: 0; margin: 0; margin-top: 40px;margin-bottom: 40px;\">Para poder guardar el reporte es necesario llenar el campo \"Folio Externo\".</p>",
                        position: 'center',
                        showConfirmButton: false,
                        timer: 2000
                    });
                }

            } else
            {
                var folioE = "";
                var razonamiento = document.getElementById("razonamiento").value;
                if (razonamiento !== "") {
                    GuardarReporte(idLlamada, DescripcionLugar, temergencia, prioridad, reporte, folioE, razonamiento);
                } else {

                    const Toast = Swal.fire({
                        title: "Llenar la informacion necesaria",
                        html: "<p style=\"color: white;font-size: 15px; padding: 0; margin: 0; margin-top: 40px;margin-bottom: 40px;\">Para poder guardar el reporte es necesario llenar el campo \"Razonamiento\".</p>",
                        position: 'center',
                        showConfirmButton: false,
                        timer: 2000
                    });

                }
            }

        }
    } else
    {
        const Toast = Swal.fire({
            title: "Llenar la informacion necesaria",
            html: "<p style=\"color: white;font-size: 15px; padding: 0; margin: 0; margin-top: 40px;margin-bottom: 40px;\">No se ha definido un folio</p>",
            position: 'center',
            showConfirmButton: false,
            timer: 2000
        });
    }


});

function InsertarMenuMarcadoresDependencia() {

    if ($("#DependenciasID").length) {
        document.getElementById("DependenciasID").value = "0," + DEPENDENCIA + "," + DEPENDENCIA + "," + DEPENDENCIA_ALIAS + "," + DEPENDENCIA_ICON + "|" + document.getElementById("DependenciasID").value;
    } else {
        var inputDep = document.createElement("input");
        inputDep.type = "hidden";
        inputDep.id = "DependenciasID";
        inputDep.value = "0," + DEPENDENCIA + "," + DEPENDENCIA + "," + DEPENDENCIA_ALIAS + "," + DEPENDENCIA_ICON;
        document.getElementById("notificarDependencias").appendChild(inputDep);
        document.getElementById("divmenudependencia").style = " visibility: hidden;";
    }
    var dato = document.getElementById("DependenciasID").value.split("|");
    for (var i = 0; i < /*dato.length*/1; i++) {
        var dependencia = dato[i].split(",");
        agregarDep(dependencia);
    }
    document.getElementById("SelectAll").checked = false;


    function agregarDep(dependencia) {


        var div = document.createElement("div");
        div.className = "custom-control custom-switch mt-1";
        var input = document.createElement("input");
        input.type = "checkbox";
        input.className = "custom-control-input";
        input.id = dependencia[0] + dependencia[3];
        var elem = document.createElement("input");
        elem.type = "hidden";
        elem.id = "elementos" + dependencia[0] + dependencia[3];
        var label = document.createElement("label");
        label.htmlFor = dependencia[0] + dependencia[3];
        label.className = "custom-control-label";
        label.innerHTML = dependencia[3];
        div.appendChild(input);
        div.appendChild(label);
        div.appendChild(elem);
        document.getElementById("MarcadoresDependenciasCheckbox").appendChild(div);

        input.onchange = function () {
            if ($(this).is(':checked')) {


                if (Latitud !== undefined && Longitud !== undefined) {
                    var fecha = getFecha();
                    if (dependencia[4] !== undefined && dependencia[4] !== null && dependencia[4] !== "null" && dependencia[4] !== "") {
                        if (dependencia[4] === "data:image/png;base64") {
                            dependencia[4] += "," + dependencia[5];
                        }

                        var icon = dependencia[4];
                    } else {
                        var icon = PathRecursos + 'Img/IconoMap/MarkerBallPink.png';

                    }
//                    conso
                    ElementosCercanos(dependencia, icon, Latitud, Longitud, rango / 1000, fecha);
                }

            } else {
                for (var k = 0; k < data.Dependencias[dependencia[1]].elementos.length; k++) {

                    var idMarcador = dependencia[1] + data.Dependencias[dependencia[1]].elementos[k].idUsuario_Movil;
                    for (var i = 0; i < markers.length; i++)
                    {

                        if (!(markers[i].id.includes(data.Usuarios_Movil.idUsuarios_Movil))) {

                            if (markers[i].id === idMarcador) {

                                markers[i].setMap(null);
                            }
                        }
                    }
                }

                data.Dependencias[dependencia[1]] = {};
                document.getElementById("elementos" + dependencia[0] + dependencia[3]).value = "";
            }
        };
    }
}



function initializeSessionElemento(dataNE) {
    //consultarPerfil(origen);


    var API_KEY = dataNE.apikey;
    var SESSION_ID = dataNE.idsession;
    var TOKEN = dataNE.token;
    var idStream = dataNE.connectionid;
    var idUser = dataNE.idUsuario;
    var idNot = dataNE.id;

    var LatitudE;
    var LongitudE;
    var AltitudE;
    var fechaE;
    var horaE;
    var gpsE = false;
    var rutaE = new Array();
    var rutaEObject = new Array();


    var session = OT.initSession(API_KEY, SESSION_ID);

    session.on({
        connectionCreated: function (event) {

        },
        connectionDestroyed: function (event) {
            var gpsjson = {
                "idUsuarios_Movil": idUser,
                "lat": LatitudE,
                "lng": LongitudE,
                "fecha": fechaE,
                "hora": horaE,
                "ActualizaGPS": true
            };
            if (escalargps) {
                EnviarMensajePorSocket(gpsjson);
            }

            $.ajax({
                type: 'POST',
                url: 'ActualizaHoraElemento',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({
                    "idNotificacion": idNot
                }),
                success: function (response) {
                },
                error: function (err) {
                    alert("error");
                }
            });
            SetMarkerIconIntegrante(idUser);
        },
        sessionConnected: function (event) {

        },
        sessionDisconnected: function (event) {
            console.error('You were disconnected from the session.', event.reason);

        },
        sessionReconnected: function (event) {

        },
        sessionReconnecting: function (event) {

        },
        streamCreated: function (event) {


            if (event.stream.connection.connectionId === idStream) {
                data.RegistroLlamada.time["h_conexion_" + idUser] = getFecha() + " " + getHora();
                agregarVideo(session, event.stream);
            } else {
                ///Agregar del lado de los publicadores....
                agregarStreamOperador(session, event.stream);
            }

        },
        streamDestroyed: function (event) {

            mosaico("remover");


        },
        signal: function (event) {


            if (event.type === "signal:gps-signal") {

                if (event.data !== undefined) {


                    var gps_data = JSON.parse(event.data);

                    LatitudE = parseFloat(parseFloat(gps_data.lat).toFixed(7));
                    LongitudE = parseFloat(parseFloat(gps_data.lng).toFixed(7));
                    AltitudE = parseFloat(parseFloat(gps_data.alt).toFixed(7));
                    fechaE = gps_data.fecha;
                    horaE = gps_data.hora;

                    rutaE.push("{lat: " + Latitud + ", lng:" + Longitud + "}");


                    var gpsjson = {
                        "idUsuarios_Movil": idUser,
                        "lat": LatitudE,
                        "lng": LongitudE,
                        "fecha": fechaE,
                        "hora": horaE,
                        "ActualizaGPS": true,
                        "gpsOTS": true
                    };
                    var elemento = BuscarIntegranteDataG(idUser);
                    if (elemento !== null) {

                        var jsonMovil = {
                            "idUsuario": idUser,
                            "lat": LatitudE,
                            "lng": LongitudE,
                            "apellido_materno": elemento.apellido_materno,
                            "apellido_paterno": elemento.apellido_paterno,
                            "icon": elemento.icon,
                            "img": elemento.img,
                            "telefono": elemento.telefono,
                            "nombre": elemento.nombre,
                            "origen": "false",
                            "aliasServicio": elemento.aliasServicio,
                            "connectionid": dataNE.id,
                            "sesion": dataNE.idsession,
                            "apikey": dataNE.apikey,
                            "token": dataNE.token,
                            "fecha": fechaE,
                            "hora": horaE,
                            "firebase": elemento.FireBaseKey,
                            "urlServicio": elemento.urlServicio
                        };

                        for (var i = 0; i < sesiones.length; i++) {
                            try {
                                enviarMensajeOT(sesiones[i], "gps_compartido", jsonMovil);
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }


                    if (escalargps) {
                        EnviarMensajePorSocket(gpsjson);
                    }
                    if (document.getElementById("LlamarFirebase:" + idUser) !== null) {
                        document.getElementById("LlamarFirebase:" + idUser).className = "botonllamada btn btn-outline-secondary btn-sm";
                        document.getElementById("LlamarFirebase:" + idUser).value = "En llamada";
                        document.getElementById("LlamarFirebase:" + idUser).disabled = true;
                    }



                    if (!gpsE) {
                        for (var k = 0; k < dataG.integrantes.length; k++) {
                            if (dataG.integrantes[k].idUsuarios_Movil === idUser) {
                                gpsE = true;
                                BackupIcon(idUser).then(function (response) {
//                                    if (response.icon) {
//                                        dataG.integrantes[k].icon = response.icon;
//                                    }
                                    if (dataG.integrantes[k].icon !== "" && dataG.integrantes[k].icon !== "undefined" && dataG.integrantes[k].icon !== undefined && dataG.integrantes[k].icon !== null && dataG.integrantes[k].icon !== "NULL") {

                                        icon = {
                                            url: dataG.integrantes[k].icon, // url
                                            scaledSize: new google.maps.Size(49, 50), // scaled size
                                            origin: new google.maps.Point(0, 0), // origin
                                            anchor: new google.maps.Point(25, 50) // anchor
                                        };
                                        for (var i = 0; i < markers.length; i++) {
                                            if (markers[i].id === idUser) {

                                                markers[i].setIcon(icon);
                                                break;
                                            }
                                        }



                                    } else {
                                        elemento.icon = PathRecursos + 'Img/IconoMap/Marcador.png';
                                        icon = {
                                            url: PathRecursos + 'Img/IconoMap/Marcador.png', // url
                                            scaledSize: new google.maps.Size(49, 50), // scaled size
                                            origin: new google.maps.Point(0, 0), // origin
                                            anchor: new google.maps.Point(25, 50) // anchor
                                        };

                                        for (var i = 0; i < markers.length; i++) {
                                            if (markers[i].id === idUser) {

                                                markers[i].setIcon(icon);
                                                break;
                                            }
                                        }


                                    }

                                });
                                break;
                            }
                        }


                    }


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

            if (event.type === "signal:cam-signal") {

                if (event.data === "true" && !$("#SwithCam" + idUser).length) {

                }
                if (event.data === "false" && $("#SwithCam" + idUser).length) {
                    document.getElementById("SwithCam" + idUser).parentNode.removeChild(document.getElementById("SwithCam" + idUser));
                }
            }


        }

    });

    // Connect to the session
    session.connect(TOKEN, function callback(error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (!error) {
//            var form = document.getElementById("chat");
//            var msgTxt = document.querySelector('#msgTxt');
//            form.addEventListener('submit', function submit(event) {
//                event.preventDefault();
//                enviarMensaje(session, msgTxt.value);
//
//            });
            // Initialize the publisher
            var publisherOptions = {
                insertMode: 'replace',
                width: '100%',
                height: '100%',
                publishVideo: false
            };
            var pos = NuevaUbicacionPublicador();
            document.getElementById(pos).style.display = "none";
            var publisher = OT.initPublisher(pos, publisherOptions, function initCallback(initErr) {

                if (initErr) {
                    console.error('There was an error initializing the publisher: ' + idUser);
                    console.error('There was an error initializing the publisher: ', initErr.name, initErr.message);
                    return;
                }
            });

            // If the connection is successful, publish the publisher to the session
            session.publish(publisher, function publishCallback(publishErr) {
                if (publishErr) {
                    console.error('There was an error publishing: ', publishErr.name, publishErr.message);
                } else {
                    var colgar = document.getElementById("colgarPublisherSOS");
                    colgar.addEventListener("click", function () {


//                        for (var i = 0; i < dataG.integrantes.length; i++) {
//                            if (dataG.integrantes[i].idUsuarios_Movil === idUser) {
                        var gpsjson = {
                            "idUsuarios_Movil": idUser,
                            "lat": LatitudE,
                            "lng": LongitudE,
                            "fecha": fechaE,
                            "hora": horaE,
                            "ActualizaGPS": true
                        };
                        if (escalargps) {
                            EnviarMensajePorSocket(gpsjson);
                        }
////                                enviarMensaje(session, dataG.integrantes[i].nombre+" "+ dataG.integrantes[i].apellido_paterno+" "+ dataG.integrantes[i].apellido_materno + ": Ha dejado la llamada.");
//                                break;
//                            }
//
//                        }

                        data.RegistroLlamada.time["h_desconexion_" + idUser] = getFecha() + " " + getHora();

                        session.unpublish(publisher);
                        //session.disconnect();
                    });
                }
            });

        } else {
            console.error('There was an error connecting to the session: ', error.name, error.message);
        }
    });

    sesiones.push(session);
}


function initializeSessionSOS() {

    var audio = {
        "audio": false
    };
    //setCookie("operador/"+DEPENDENCIA, JSON.stringify(audio), 1);


    var session = OT.initSession(data.Credenciales.apikey, data.Credenciales.sesion);

    session.on({
        connectionCreated: function (event) {

            connectionCount++;

        },
        connectionDestroyed: function (event) {

            connectionCount--;


            if (event.connection.connectionId === data.RegistroLlamada.connectionid) {
                enviarMensaje(session, data.Usuarios_Movil.nombre, "Ha dejado la llamada");
                data.RegistroLlamada.time.h_desconexion_usuario = getFecha() + " " + getHora();

                $.ajax({
                    type: 'POST',
                    url: '/' + DEPENDENCIA + '/Registro_ruta',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({
                        "idRegistro_Llamadas": data.RegistroLlamada.idLlamada,
                        "ruta_generada": ruta.toString()
                    }),
                    success: function (response) {
                    },
                    error: function (err) {
                        alert("error");
                    }
                });

                var gpsjson = {
                    "idUsuarios_Movil": data.RegistroLlamada.idUsuarios_Movil,
                    "lat": Latitud,
                    "lng": Longitud,
                    "fecha": getFecha(),
                    "hora": getHora(),
                    "ActualizaGPS": true
                };

                if (escalargps) {
                    EnviarMensajePorSocket(gpsjson);
                }
            }

        },
        sessionConnected: function (event) {

        },
        sessionDisconnected: function (event) {
            console.error('You were disconnected from the session.', event.reason);
            session.disconnect();

        },
        sessionReconnected: function (event) {

        },
        sessionReconnecting: function (event) {

        },
        streamCreated: function (event) {


            if (event.stream.connection.connectionId === data.RegistroLlamada.connectionid) {
                data.RegistroLlamada.time.h_conexion_usuario = getFecha() + " " + getHora();
                agregarVideo(session, event.stream);
            } else {
                ///Agregar del lado de los publicadores....
                agregarStreamOperador(session, event.stream);
            }

        },
        streamDestroyed: function (event) {

            if (event.stream.connection.connectionId === data.RegistroLlamada.connectionid) {
                mosaico("remover");
            }

        },
        signal: function (event) {


            if (event.type === "signal:gps-signal") {

                if (event.data !== undefined) {
                    var gps_data = JSON.parse(event.data);
                    Latitud = parseFloat(parseFloat(gps_data.lat).toFixed(7));
                    Longitud = parseFloat(parseFloat(gps_data.lng).toFixed(7));
                    Altitud = parseFloat(parseFloat(gps_data.alt).toFixed(7));

                    if (escalargps) {
                        var gpsjson = {
                            "idUsuarios_Movil": data.RegistroLlamada.idUsuarios_Movil,
                            "lat": Latitud,
                            "lng": Longitud,
                            "fecha": getFecha(),
                            "hora": getHora(),
                            "ActualizaGPS": true,
                            "gpsOTS": true
                        };
                        EnviarMensajePorSocket(gpsjson);
                    }

                    var lat_ant = Latitud;
                    var lng_ant = Longitud;
                    for (var i = 0; i < markers.length; i++) {
                        if (markers[i].id === data.RegistroLlamada.idUsuarios_Movil) {

                            lat_ant = markers[i].getPosition().lat();
                            lng_ant = markers[i].getPosition().lng();
                            break;
                        }
                    }

                    ruta.push("{lat: " + Latitud + ", lng:" + Longitud + "}");
                    //rutaObject.push({lat: Latitud, lng: Longitud});

                    if (!gps) {
                        //listarCamarasUrbanas(Latitud, Longitud, 100000);
                        JsonSolicitarListaIncidentes();
                        if (!DEPENDENCIA_BASE) {
                            //mostrarElementos();
                            addSlider();
                            $("#ragecontainer").css("display", "unset");
                            $("#enviarNotificacion").css("display", "unset");
                            $("#enviarNotificacion").click(function () {

                                enviarNotificacionCircle();
                            });
                            //JsonSolicitarListaIncidentes();
                        }

                        var elemento = {
                            "FireBaseKey": null,
                            "apellido_materno": data.Usuarios_Movil.apellido_materno,
                            "apellido_paterno": data.Usuarios_Movil.apellido_paterno,
                            "icon": data.Usuarios_Movil.icon,
                            "idUsuarios_Movil": data.Usuarios_Movil.idUsuarios_Movil,
                            "img": data.Usuarios_Movil.img,
                            "telefono": data.Usuarios_Movil.telefono,
                            "nombre": data.Usuarios_Movil.nombre,
                            "origen": data.origen,
                            "gps": {
                                "moving": false,
                                "actualizada": true,
                                "estadoNotificacion": "",
                                "fecha": data.RegistroLlamada.fecha,
                                "hora": data.RegistroLlamada.hora,
                                "lat": Latitud,
                                "lng": Longitud,
                                "ult": {
                                    "idUsuario_Movil": data.RegistroLlamada.idUsuarios_Movil,
                                    "lat": Latitud,
                                    "lng": Longitud
                                }
                            }
                        };

                        var delta = 500;
                        var destinoLat = elemento.gps.ult.lat;
                        var destinoLng = elemento.gps.ult.lng;

                        if (elemento.gps.lat !== destinoLat || elemento.gps.lng !== destinoLng) {

                            elemento.gps.deltaLat = parseFloat(((destinoLat - elemento.gps.lat) / delta).toFixed(10));
                            elemento.gps.deltaLng = parseFloat(((destinoLng - elemento.gps.lng) / delta).toFixed(10));
                        }

                        data.elemento = elemento;
                        //HideMarker(data.Usuarios_Movil.idUsuarios_Movil);
                        //UpdateMarkerSOS(elemento);
                        SetMarkerSOS(elemento);
                        RegistroLlamadaAtendida(data);
                        addCircle();
                        gps = true;




                        map.setZoom(14);
                        map.setCenter(elemento.gps);
                    } else {

                        var elemento = {
                            "FireBaseKey": null,
                            "apellido_materno": data.Usuarios_Movil.apellido_materno,
                            "apellido_paterno": data.Usuarios_Movil.apellido_paterno,
                            "icon": data.Usuarios_Movil.icon,
                            "idUsuarios_Movil": data.Usuarios_Movil.idUsuarios_Movil,
                            "img": data.Usuarios_Movil.img,
                            "telefono": data.Usuarios_Movil.telefono,
                            "nombre": data.Usuarios_Movil.nombre,
                            "origen": data.origen,
                            "gps": {
                                "moving": false,
                                "actualizada": true,
                                "estadoNotificacion": "",
                                "fecha": data.RegistroLlamada.fecha,
                                "hora": data.RegistroLlamada.hora,
                                "lat": lat_ant,
                                "lng": lng_ant,
                                "ult": {
                                    "idUsuario_Movil": data.RegistroLlamada.idUsuarios_Movil,
                                    "lat": Latitud,
                                    "lng": Longitud
                                }
                            }
                        };
                        var delta = 500;
                        var destinoLat = elemento.gps.ult.lat;
                        var destinoLng = elemento.gps.ult.lng;

                        if (elemento.gps.lat !== destinoLat || elemento.gps.lng !== destinoLng) {

                            elemento.gps.deltaLat = parseFloat(((destinoLat - elemento.gps.lat) / delta).toFixed(10));
                            elemento.gps.deltaLng = parseFloat(((destinoLng - elemento.gps.lng) / delta).toFixed(10));
                        }

                        data.elemento = elemento;
                        // SetLine(rutaObject);

                        UpdateMarkerSOS(elemento);
                    }

                }

                ///////Notificacion pos signal posicion de elementos involucrados 

                var elemento = BuscarIntegranteDataG(data.RegistroLlamada.idUsuarios_Movil);
                if (elemento !== null) {

                    var jsonMovil = {
                        "idUsuario": data.RegistroLlamada.idUsuarios_Movil,
                        "lat": Latitud,
                        "lng": Longitud,
                        "apellido_materno": elemento.apellido_materno,
                        "apellido_paterno": elemento.apellido_paterno,
                        "icon": elemento.icon,
                        "img": elemento.img,
                        "telefono": elemento.telefono,
                        "nombre": elemento.nombre,
                        "origen": "true",
                        "aliasServicio": elemento.aliasServicio,
                        "connectionid": data.RegistroLlamada.connectionid,
                        "sesion": data.Credenciales.sesion,
                        "apikey": data.Credenciales.apikey,
                        "token": data.Credenciales.token,
                        "fecha": getFecha(),
                        "hora": getHora(),
                        "firebase": elemento.FireBaseKey,
                        "urlServicio": elemento.urlServicio
                    };
                    for (var i = 0; i < sesiones.length; i++) {
                        try {
                            enviarMensajeOT(sesiones[i], "gps_compartido", jsonMovil);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }

            }
            if (event.type === "signal:msg-signal") {
                //Sabiendo que el mensaje es de un subscriptor decodifica para saber como tratarlo 
                if (event.from.connectionId === session.connection.connectionId) {

                    insertarMensajePropio(event.data);
                } else if (event.from.connectionId === data.RegistroLlamada.connectionid) {

                    var msj = JSON.parse(event.data);
                    if (!msj.username) {
                        msj.username = data.Usuarios_Movil.nombre;
                    }
                    insertarMensaje(JSON.stringify(msj));
                } else {

                    insertarMensaje(event.data);
                }

            }


            if (event.type === "signal:imagen-signal") {
                //Sabiendo que el mensaje es de un subscriptor decodifica para saber como tratarlo 
                var msj = JSON.parse(event.data);
                console.log(msj);
                insertarImagen(JSON.stringify(msj));
            }



            if (event.type === "signal:recuperaMensajes") {
                if (event.from.connectionId !== session.connection.connectionId) {

                    if (event.data.recuperamensajes && chatRecibido) {
                        session.signal({
                            type: 'recuperaMensajes',
                            data: chat
                        }, function signalCallback(error) {
                            if (error) {
                                console.error('Error sending signal:', error.name, error.message);
                            }
                        });
                    }

                    if (!chatRecibido) {
                        var msgHistory = document.querySelector('#history');

                        for (var i = 0; i < event.data.length; i++) {



                            var msj = JSON.parse(event.data[i]);

                            chat.push(msj);

                            if (msj.tipo === "texto") {
                                insertarMensaje(event.data[i]);
                            } else {

                                var theirs = document.createElement("div");
                                theirs.style = "padding: 5px; color: white; font: 15px Arial; text-align: right; height: fit-content;";
                                theirs.className = "col-6";
                                var empty = document.createElement("div");
                                empty.style = "max-height:10px;";
                                empty.className = "col-6";


                                var mensaje = document.createElement("div");
                                mensaje.id = "chat-imagen" + msj.id;

                                mensaje.style = "background: #00a5b8; float: right; border-radius: 10px; padding: 5px; color: white; font: 15px Arial; text-align: right; width: max-content; max-width: 145%;";

                                theirs.appendChild(mensaje);
                                msgHistory.appendChild(empty);
                                msgHistory.appendChild(theirs);
                                var empty2 = empty.cloneNode(true);
                                var theirs2 = theirs.cloneNode(true);
                                msgHistory2.appendChild(empty2);
                                msgHistory2.appendChild(theirs2);
                                theirs.scrollIntoView();

                                buscarImg(msj.id).then(function (response) {
                                    nuevaImgFrame(response);




                                    var info = document.createElement("div");
                                    info.style = "font:10px Arial;";

                                    var img = document.createElement("img");
                                    img.style = "max-width: 100%;";
                                    img.alt = "";
                                    img.src = "data:image/png;base64," + response.src;

                                    var m = document.getElementById("chat-imagen" + response.id);

                                    m.appendChild(img);
                                    info.innerHTML = response.fecha + " - " + response.hora;
                                    m.appendChild(info);

                                    img.addEventListener("click", function () {

                                        document.getElementById("myModal").style.display = "block";
                                        document.getElementById("FrameReporte").style.display = "none";
                                        document.getElementById("demoCarrusel").style.display = "block";
                                        document.getElementById("modal-content").style = "background-color: #fefefe; margin: auto; padding: 10px; border: 1px solid #888; width: 30%; height: auto;";
                                        var x = document.getElementsByClassName("carousel-item active");
                                        for (var i = 0; i < x.length; i++) {
                                            x[i].className = "carousel-item";
                                        }
                                        document.getElementById("ImgFrame" + response.id).parentNode.className = "carousel-item active";
                                    });

                                });
                            }



                        }

                        enviarMensaje(session, ALIAS, MSJ);
                        document.getElementById("msgTxt").disabled = false;
                        chatRecibido = true;
                    }


                }
            }

        }

    });

    // Connect to the session
    session.connect(data.Credenciales.token, function callback(error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (!error) {
            // Text chat


            var form = document.getElementById("chat");
            var msgTxt = document.querySelector('#msgTxt');

            // Send a signal once the user enters data in the form
            form.addEventListener('submit', function submit(event) {
                event.preventDefault();
                enviarMensaje(session, ALIAS, msgTxt.value);

            });
            // Initialize the publisher
            var publisherOptions = {
                insertMode: 'replace',
                width: '100%',
                height: '100%',
                name: "Operador " + DEPENDENCIA_ALIAS,
                publishVideo: false
            };
            var pos = NuevaUbicacionPublicador();
            var publisher = OT.initPublisher(pos, publisherOptions, function initCallback(initErr) {

                if (initErr) {
                    console.error('There was an error initializing the publisher: ', initErr.name, initErr.message);
                    //notificarError(initErr.message);
                    return;
                } else {
                    var json = {};
                    json.EliminarLlamada = true;
                    json.idLlamada = data.RegistroLlamada.idLlamada;
                    EnviarMensajePorSocket(json);
                    session.signal({
                        type: 'Operador' + DEPENDENCIA,
                        data: "Llamada Atendida por operador " + JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).idUsuario_Sys
                    }, function (error) {
                        if (error) {
                            console.error('Error sending signal:', error.name, error.message);
                        }
                    });
                    session.signal({
                        type: 'recuperaMensajes',
                        data: JSON.stringify({"recuperamensajes": true})
                    }, function signalCallback(error) {
                        if (error) {
                            console.error('Error sending signal:', error.name, error.message);
                        }
                    });
                }
            });

            // If the connection is successful, publish the publisher to the session
            session.publish(publisher, function publishCallback(publishErr) {
                if (publishErr) {
                    console.error('There was an error publishing: ', publishErr.name, publishErr.message);
                } else {
                    data.RegistroLlamada.time.h_conexion_operador = getFecha() + " " + getHora();


                    setTimeout(function () {
                        if (!chatRecibido) {
                            chatRecibido = true;
                            enviarMensaje(session, ALIAS, MSJ);
                            document.getElementById("msgTxt").disabled = false;
                        }
                    }, 2000);


                    var colgar = document.createElement("input");
                    colgar.className = "colgarPublisher";
                    colgar.id = "colgarPublisherSOS";
                    colgar.value = "";
                    colgar.addEventListener("click", function () {

                        enviarMensaje(session, ALIAS, "Ha dejado la llamada.");
                        if (!data.RegistroLlamada.time.h_desconexion_usuario) {
                            data.RegistroLlamada.time.h_desconexion_usuario = getFecha() + " " + getHora();
                        }
                        data.RegistroLlamada.time.h_desconexion_operador = getFecha() + " " + getHora();
                        RegistroLlamadaFinalizada(/*ReasonmmDestroyed*/).then(function () {
                            if (colonia === " ") {
                                colonia = null;
                            }
                            if (estado === " ") {
                                estado = null;
                            }
                            if (municipio === " ") {
                                municipio = null;
                            }
                            if (CP === 0) {
                                CP = null;
                            }
                            session.unpublish(publisher);

                            enviarMensaje(session, ALIAS, "Dejo de visualizar el video del usuario " + data.Usuarios_Movil.nombre + ".");
                            //data.RegistroLlamada.time.h_desconexion_usuario = getFecha() + " " + getHora();

                            $.ajax({
                                type: 'POST',
                                url: '/' + DEPENDENCIA + '/Registro_ruta',
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                data: JSON.stringify({
                                    "idRegistro_Llamadas": data.RegistroLlamada.idLlamada,
                                    "ruta_generada": ruta.toString()
                                }),
                                success: function (response) {
                                    session.disconnect();
                                },
                                error: function (err) {
                                    alert("error");
                                }
                            });

                            var gpsjson = {
                                "idUsuarios_Movil": data.RegistroLlamada.idUsuarios_Movil,
                                "lat": Latitud,
                                "lng": Longitud,
                                "fecha": getFecha(),
                                "hora": getHora(),
                                "ActualizaGPS": true
                            };

                            if (escalargps) {
                                EnviarMensajePorSocket(gpsjson);
                            }
                            //
                        });

                        var cerrar = document.createElement("input");
                        cerrar.type = "button";
                        cerrar.value = "Cerrar";
                        cerrar.style = "z-index: 100;";
                        cerrar.className = "cerrar btn btn-secondary";
                        document.getElementById("GRID").appendChild(cerrar);
                        cerrar.addEventListener("click", function () {
                            data.RegistroLlamada.time.h_finalizado = getFecha() + " " + getHora();

                            if (!ReporteGuardado) {
//                        swal(
//                                'Aún no has guardado tu reporte correctamente ',
//                                'Antes de dar por finalizada la llamada: <br>\n\
//                    <br>- Verifica que se haya establecido un incidente\n\
//                    <br>- Detalla el reporte y guardalo',
//                                'error'
//                                );
                                var Aviso = "Antes de dar por finalizada la llamada: <br>\n\
                    <br>- Verifica que se haya establecido un incidente\n\
                    <br>- Detalla el reporte y guardalo";

                                swal.fire({
                                    type: 'error',
                                    title: "",
                                    //text: 'El reporte se ha guardado correctamente',
                                    html: "<p style=\"font: bold 15px arial;margin: 4px;padding:0;\">Aún no has guardado tu reporte correctamente</p><p style=\"color: back;font-size: 12px; padding: 0; margin: 0;\">" + Aviso + "</p>",
                                    showConfirmButton: true,
                                    //timer: 2000
                                });
                                var swalheader = document.getElementsByClassName("swal2-header");
                                if (swalheader.length) {
                                    swalheader[0].style.background = "#40464f";
                                }
                                var swalcontent = document.getElementsByClassName("swal2-content");
                                if (swalcontent.length) {
                                    swalcontent[0].style = "border-bottom-left-radius: 10px;    background: white;    border-bottom-right-radius: 10px;    padding: 20px;";
                                }
                                var swaltitle = document.getElementsByClassName("swal2-title");
                                if (swaltitle.length) {
                                    swaltitle[0].style = "max-width:20%;";
                                }
                                var swal2circularleft = document.getElementsByClassName("swal2-success-circular-line-left");
                                if (swal2circularleft.length) {
                                    swal2circularleft[0].style.background = "#40464f";
                                }
                                var swal2circularright = document.getElementsByClassName("swal2-success-circular-line-right");
                                if (swal2circularright.length) {
                                    swal2circularright[0].style.background = "#40464f";
                                }
                                var swal2circularfix = document.getElementsByClassName("swal2-success-fix");
                                if (swal2circularfix.length) {
                                    swal2circularfix[0].style.background = "#40464f";
                                }
                                var swal2confirm = document.getElementsByClassName("swal2-confirm swal2-styled");
                                if (swal2confirm.length) {
                                    swal2confirm[0].style = "border-left-color: rgb(220, 53, 69);    border-right-color: rgb(220, 53, 69);";
                                }

                                var swal2error = document.getElementsByClassName("swal2-icon swal2-error swal2-animate-error-icon");
                                if (swal2error.length) {
                                    swal2error[0].style = "display:flex; margin:0; margin-top:2%;";
                                }

                                var swal2actions = document.getElementsByClassName("swal2-actions");

                                swalcontent[0].appendChild(swal2actions[0]);


                            } else {

                                top.close();
                                window.close();
                            }

                        });

                    });
                    document.getElementById(pos).appendChild(colgar);

                    //////////Solicitar Cambio de camara  ******
                    var activarVideo = document.createElement("input");
                    activarVideo.className = "activarVideoPublisher";
                    activarVideo.value = "";
                    activarVideo.addEventListener("click", function () {

                        publisher.publishVideo(!publisher.stream.hasVideo);
                    });
                    document.getElementById(pos).appendChild(activarVideo);


                }
            });
        } else {
            console.error('There was an error connecting to the session: ', error.name, error.message);
        }
    });



    $("#notificarDependencias").submit(function (e) {
        e.preventDefault();
        if (/*Folio*/1) {
            if (incidente_establecido) {



                //document.getElementById("chained_relative-flexdatalist").disabled = true;

                var Aviso = "";
                var dependencias = document.getElementById("DependenciasID").value.split("|");



                var url = new Array();
                Aviso = "Las siguientes dependencias han sido notificadas: <br>\n";
                var notificados = "";
                for (var i = 1; i < dependencias.length; i++) {
                    var dependencia = dependencias[i].split(",");
//                    console.log(dependencia[0]);
//                    console.log("vs");
//                    console.log(document.getElementById(dependencia[0]).id);
//                    console.log(document.getElementById(dependencia[0]).checked);
                    if (document.getElementById(dependencia[0]).checked)
                    {
                        document.getElementById(dependencia[0]).checked = false;
                        document.getElementById(dependencia[0]).disabled = true;
                        document.getElementById(dependencia[0]).title = "Dependencia notificada";
                        document.getElementById("span" + dependencia[0]).className = "dependenciaBloqueada";

                        Aviso += "- " + dependencia[3] + "<br>";
                        url.push(dependencia[2]);

                        notificados += hostdir + '/' + DEPENDENCIA + "/" + JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario + "/" + JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio + "|" + dependencia[2] + ",";
                    }

                }
                console.log(url);
                //InsertarLlamada(dependencia[1]);
                NotDependencias(url);
//                NotDependenciasEspecificas(usuarios);



                notificados = notificados.substring(0, notificados.length - 1);



                DependenciasNotificadas(notificados, data.RegistroLlamada.idLlamada);

//                const Toast = Swal.fire({
//                    title: "Notificación Automática",
//                    html: "<p style=\"color: white;font-size: 15px; padding: 0; margin: 0; margin-top: 40px;margin-bottom: 40px;\">" + Aviso + "</p>",
//                    position: 'center',
//                    showConfirmButton: false,
//                    timer: 2000
//                });

                Swal.fire({
                    type: 'success',
                    title: "",
                    //text: 'El reporte se ha guardado correctamente',
                    html: "<p style=\"    font: bold 12px arial;    margin: 4px;    padding: 0;\">Notificaciones Automaticas</p><p style=\"color: back;font: bold 14px Arial; padding: 0; margin: 0;\">" + Aviso + "</p>",
                    showConfirmButton: false,
                    timer: 2000
                });
                fixAnimation();


//                    });


            } else {

                const Toast = Swal.fire({
                    title: "Error",
                    html: "<p style=\"color: white;font-size: 15px; padding: 0; margin: 0; margin-top: 40px;margin-bottom: 40px;\">Primero debe establecer un incidente</p>",
                    position: 'center',
                    showConfirmButton: false,
                    timer: 1500
                });
            }



        } else {
            const Toast = Swal.fire({
                title: "Error",
                html: "<p style=\"color: white;font-size: 15px; padding: 0; margin: 0; margin-top: 40px;margin-bottom: 40px;\">Es necesario insertar un folio</p>",
                position: 'center',
                showConfirmButton: false,
                timer: 1500
            });
        }


    });


    sesiones.push(session);

}
function fixAnimation() {
    var swalheader = document.getElementsByClassName("swal2-header");
    if (swalheader.length) {
        swalheader[0].style.background = "#40464f";
    }
    var swalcontent = document.getElementsByClassName("swal2-content");
    if (swalcontent.length) {
        swalcontent[0].style = "border-bottom-left-radius: 10px;    background: white;    border-bottom-right-radius: 10px;    padding: 20px;";
    }
    var swaltitle = document.getElementsByClassName("swal2-title");
    if (swaltitle.length) {
        swaltitle[0].style = "max-width:20%;";
    }
    var swal2circularleft = document.getElementsByClassName("swal2-success-circular-line-left");
    if (swal2circularleft.length) {
        swal2circularleft[0].style.background = "#40464f";
    }
    var swal2circularright = document.getElementsByClassName("swal2-success-circular-line-right");
    if (swal2circularright.length) {
        swal2circularright[0].style.background = "#40464f";
    }
    var swal2circularfix = document.getElementsByClassName("swal2-success-fix");
    if (swal2circularfix.length) {
        swal2circularfix[0].style.background = "#40464f";
    }
}
function CambiarCamara() {

    session.signal({
        type: 'cam-signal',
        data: "126"
    }, function signalCallback(error) {
        if (error) {
            console.error('Error sending signal:', error.name, error.message);
        } else {
            msgTxt.value = '';
        }
    });
}







function DependenciasNotificadas(notificados, idLlamada) {

    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/DependenciasNotificadas',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "id": idLlamada,
            "info": notificados
        }),
        success: function (response) {


        },
        error: function (err) {

        }
    }));

}

function llenarperfil(data) {


    if (data.Usuarios_Movil.Img) {
        if (
                data.Usuarios_Movil.Img !== null &&
                data.Usuarios_Movil.Img !== "null" &&
                data.Usuarios_Movil.Img !== "" &&
                data.Usuarios_Movil.Img !== undefined &&
                data.Usuarios_Movil.Img !== "undefined"
                ) {
            document.getElementById("ImgPerfil").style.display = "none";
            document.getElementById("ImgPerfil").parentNode.style = "background-repeat: no-repeat;    background-position:center;    background-size: cover;    -moz-background-size: cover;    -webkit-background-size: cover;    -o-background-size: cover;";
            document.getElementById("ImgPerfil").parentNode.style.backgroundImage = "url('" + data.Usuarios_Movil.Img.replace(/(\r\n|\n|\r)/gm, "") + "')";
        }

    } else {
        if (
                data.Usuarios_Movil.img !== null &&
                data.Usuarios_Movil.img !== "null" &&
                data.Usuarios_Movil.img !== "" &&
                data.Usuarios_Movil.img !== undefined &&
                data.Usuarios_Movil.img !== "undefined"
                ) {
            //document.getElementById("ImgPerfil").setAttribute("src", "Data:image/png;base64," + data.Usuarios_Movil.img);
            document.getElementById("ImgPerfil").style.display = "none";
            document.getElementById("ImgPerfil").parentNode.style = "background-repeat: no-repeat;    background-position:center;    background-size: cover;    -moz-background-size: cover;    -webkit-background-size: cover;    -o-background-size: cover;";
            document.getElementById("ImgPerfil").parentNode.style.backgroundImage = "url('" + data.Usuarios_Movil.img.replace(/(\r\n|\n|\r)/gm, "") + "')";
        }
    }
    //document.getElementById("ImgPerfil").style.backgroundImage = "url(Data:image/png;base64," + response.Img.replace(/\n/g, '') + ")";
    document.getElementById("NombrePerfil").value = data.Usuarios_Movil.nombre + " " + data.Usuarios_Movil.apellido_paterno + " " + data.Usuarios_Movil.apellido_materno;
    //document.getElementById("Apellidos").value = data.Usuarios_Movil.apellido_paterno + " " + data.Usuarios_Movil.apellido_materno;
    document.getElementById("Fecha_nacimiento").value = data.Usuarios_Movil.fecha_nacimiento;
    document.getElementById("CorreoPerfil").value = data.Usuarios_Movil.correo;
    document.getElementById("TelPerfil").value = data.Usuarios_Movil.telefono;
    document.getElementById("GenPerfil").value = data.Usuarios_Movil.genero;
    document.getElementById("RhPerfil").value = data.Usuarios_Movil.rh;
    document.getElementById("AlergiasPerfil").value = data.Usuarios_Movil.alergias;
    document.getElementById("CondicionMedica").value = data.Usuarios_Movil.condicion_medica;
    document.getElementById("DireccionPerfil").value = data.Usuarios_Movil.direccion;
    //document.getElementById("CPPerfil").value = data.Usuarios_Movil.cp;
    document.getElementById("ContactoNombre").value = data.Usuarios_Movil.contacto_nombre;
    document.getElementById("ContactoNumero").value = data.Usuarios_Movil.contacto_telefono;
    document.getElementById("iconUsr").value = data.Usuarios_Movil.icon;


}

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

function SolicitarFolioIncidetes(codigo, prefijo_estado) {


    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/SerieIncidentes', //URL Servidor
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
//            "incidente": {
            "codigo": codigo,
            "prefijo_edo": removeAccents(prefijo_estado).toString().toLowerCase()
//            }
        }
        ),
        success: function (response) {
            console.log(response);
        },
        error: function (err) {
            console.log(err);
        }
    }));

}

function UpdateIncidentes(prefijo_estado) {

    var f = data.RegistroLlamada.fecha;
    var HRecepcion = data.RegistroLlamada.time.h_recepcion;
    var HTransmision = data.RegistroLlamada.time.h_atencion_inicio;
    var HCaptura = data.RegistroLlamada.time.h_captura_reporte;


    var dR = new Date(/*f + " " + */HRecepcion);
    var dT = new Date(/*f + " " + */HTransmision);
    var dC = new Date(/*f + " " + */HCaptura);

    if (NuevoReporte) {
        var jsn = {
            "incidente": {
                "serie": FolioIncidentes,
                "descripcion": document.getElementById("AreaReporte").value,
                "lugaresafectados": null,
                "ubicacionespecifica": {
                    "lat": Latitud,
                    "long": Longitud
                },
                "fecharegistro": getFecha(),
                "horaregistro": getHora(),
                "fechaocurrencia": data.RegistroLlamada.fecha,
                "horaocurrencia": data.RegistroLlamada.hora,
                "medidascontrol": "",
                "personasafectadas": 0,
                "personasevacuadas": 0,
                "personasdesaparecidas": 0,
                "personaslesionadas": 0,
                "personasfallecidas": 0,
                "danoscolaterales": "",
                "infraestructuraafectada": "",
                "afectacionvial": "",
                "respuestainstitucional": null,
                "clave": incidente.id,
                "prefijoestado": removeAccents(prefijo_estado).toString().toLowerCase()/*estado*/,
                "radioNivelImpacto": 3,
                "tiposeguimiento": 1,
                "status": true,
                "id_usuario": "8",
                "dependencias": {
                    "descripcion_llamada": {
                        "municipio": municipio,
                        "fecha": f + " " + data.RegistroLlamada.hora,
                        "folio": Folio,
                        "numero_telefono": data.Usuarios_Movil.telefono,
                        "origen": "App " + data.Modo.nombre,
                        "prioridad": incidente.Prioridad,
                        "motivo": incidente.Incidente,
                        "operador": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).idUsuario_Sys + " " + JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre + " " + JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).apellidos
                    },
                    "datos_llamada": {
                        "folio": Folio,
                        "recepcion": HRecepcion,
                        "origen": "App " + data.Modo.nombre,
                        "prioridad": incidente.Prioridad,
                        "motivo": incidente.Incidente,
                        "lugar": direccion,
                        "ciudad": (colonia !== null && colonia !== "" && colonia !== " ") ? colonia : "",
                        "colonia": colonia,
                        "descripcion": $("#DescripcionLugar".value),
                        "denunciante": data.Usuarios_Movil.nombre + " " + data.Usuarios_Movil.apellido_paterno + " " + data.Usuarios_Movil.apellido_materno,
                        "telefono": data.Usuarios_Movil.telefono,
                        "direccion": data.Usuarios_Movil.direccion,
                        "tiempo_ocurre": "",
                        "hora_ocurre": f + " " + data.RegistroLlamada.hora
                    },
                    "tiempo_llamada": {
                        "recibida_por": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).idUsuario_Sys + " " + JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre + " " + JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).apellidos,
                        "h_recepcion": HRecepcion,
                        "h_transmision": HTransmision,
                        "t_transmision": RestarDate(dR, dT),
                        "h_captura": HCaptura,
                        "t_captura": RestarDate(dT, dC)
                    },
                    "tiempo_atencion": null
                }
            }
        };

        return Promise.resolve($.ajax({
            type: 'POST',
            url: '/' + DEPENDENCIA + '/update',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(jsn),
            success: function (response) {
                console.log(response);
            },
            error: function (err) {
                console.log(err);
            }
        }));
    } else {

        var jsn = {
            "incidente": {
                "serie": FolioIncidentes,
                "reporte_dependencias":
                        {
                            "nombre_dependencia": DEPENDENCIA_ALIAS,
                            "nombre_encargado": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).idUsuario_Sys,
                            "num_atencion": "1",
                            "f_trasmision": f + " " + HTransmision,
                            "h_lectura": HCaptura,
                            "f_razonamiento": "FALTA",
                            "razonamiento": "FALTA",
                            "razon_noatencion": "FALTA",
                            "obs_noatencion": "FALTA",
                            "motivo_robo": incidente.Incidente,
                            "folio_parte_informativo": "FALTA... 00250001000009816314",
                            "zp": "FALTA ZP4105",
                            "cuadrante": "FALTA 41",
                            "sector": "FALTA 4",
                            "observacion": document.getElementById("AreaReporte").value
                        }
            }
        };


        return Promise.resolve($.ajax({
            type: 'POST',
            url: "reportedependencias",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(jsn),
            success: function (response) {


            },
            error: function (err) {

            }
        }));

        //////////////////////////////////////////////////////////////////////-------------------------------------------------------------


    }
}
function SolicitarFolio(codigo) {


    if (codigo > 70000) {


        return Promise.resolve($.ajax({
            type: 'POST',
            url: 'FolioImprocedente',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                "origen": DEPENDENCIA,
                "fecha": getFecha(),
                "hora": getHora(),
                "operador": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).idUsuario_Sys
            }
            ),
            success: function (response) {


            },
            error: function (err) {

            }
        }));
    } else {


        return Promise.resolve($.ajax({
            type: 'POST',
            url: 'Folio',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                "origen": DEPENDENCIA,
                "fecha": getFecha(),
                "hora": getHora(),
                "operador": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).idUsuario_Sys
            }
            ),
            success: function (response) {


            },
            error: function (err) {

            }
        }));
    }


}






//function LimpiarCredencialesUsr(idUsuario) {
//    return Promise.resolve($.ajax({
//        type: 'POST',
//        url: '/' + DEPENDENCIA + '/Credenciales',
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        data: JSON.stringify({
//            "idUsuarios_Movil": idUsuario,
//            "ID": "-1"
//        }),
//        success: function (response) {
//            
//        },
//        error: function (err) {
//          
//            
//        }
//    }));
//}

function GuardarReporte(idLlamada, descipcionLugar, temergencia, prioridad, reporte, folioE, razonamiento) {

    if (hora_reporte === "") {
        hora_reporte = getHora();
    }
    //var hora = getHora();
    data.RegistroLlamada.time.h_captura_reporte = getFecha() + " " + getHora();
//   
    var json = {};
    if (JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).hasOwnProperty("tipo_usuario") && JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).hasOwnProperty("tipo_servicio")) {
        json = {

            "idLlamada": idLlamada,
            "tipoLugar": "",
            "numPiso": "",
            "descripcionLugar": descipcionLugar,
            "temergencia": temergencia,
            "prioridad": prioridad,
            "reporte": reporte,
            "folioexterno": folioE,
            "razonamiento": razonamiento,
            "hora": hora_reporte,
            "fecha": getFecha(),
            "bitacora": data.RegistroLlamada.time,
            "tipo_usuario": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
            "tipo_servicio": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio
        };
    } else {
        json = {

            "idLlamada": idLlamada,
            "tipoLugar": "",
            "numPiso": "",
            "descripcionLugar": descipcionLugar,
            "temergencia": temergencia,
            "prioridad": prioridad,
            "reporte": reporte,
            "folioexterno": folioE,
            "razonamiento": razonamiento,
            "hora": hora_reporte,
            "fecha": getFecha(),
            "bitacora": data.RegistroLlamada.time
        };
    }
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/GuardarReporte',
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        data: JSON.stringify(json),
        success: function (respuesta) {

            document.getElementById("collapseThree").className = "collapse";
            if (respuesta.success) {
                ReporteGuardado = true;
                Swal.fire({
                    type: 'success',
                    title: "",
                    text: 'El reporte se ha guardado correctamente',
                    showConfirmButton: false,
                    timer: 2000
                });
                var swalheader = document.getElementsByClassName("swal2-header");
                if (swalheader.length) {
                    swalheader[0].style.background = "#40464f";
                }
                var swalcontent = document.getElementsByClassName("swal2-content");
                if (swalcontent.length) {
                    swalcontent[0].style = "border-bottom-left-radius: 10px;    background: white;    border-bottom-right-radius: 10px;    padding: 20px;";
                }
                var swaltitle = document.getElementsByClassName("swal2-title");
                if (swaltitle.length) {
                    swaltitle[0].style = "max-width:20%;";
                }
                var swal2circularleft = document.getElementsByClassName("swal2-success-circular-line-left");
                if (swal2circularleft.length) {
                    swal2circularleft[0].style.background = "#40464f";
                }
                var swal2circularright = document.getElementsByClassName("swal2-success-circular-line-right");
                if (swal2circularright.length) {
                    swal2circularright[0].style.background = "#40464f";
                }
                var swal2circularfix = document.getElementsByClassName("swal2-success-fix");
                if (swal2circularfix.length) {
                    swal2circularfix[0].style.background = "#40464f";
                }




                if (llamadafinalizada) {

                    //////////////////MODAL
                    document.getElementById("FrameReporte").src = "Reporte/" + idLlamada + "/" + data.origen + "/" + hora_reporte;
                    // Get the modal
                    var modal = document.getElementById('myModal');

                    // Get the button that opens the modal
                    var btn = document.getElementById("myBtn");
                    btn.style = "position: absolute; z-index: 100; top: 88%; left: 83%; background-image: url(" + PathRecursos + 'Img/pdf.svg' + "); background-repeat: no-repeat; background-position: center; border: none; cursor: pointer; width: 15%; height: 10%; background-color: transparent;";

                    // Get the <span> element that closes the modal
                    var span = document.getElementsByClassName("close")[0];

                    // When the user clicks the button, open the modal 
                    btn.onclick = function () {
                        modal.style.display = "block";
                        document.getElementById("FrameReporte").style.display = "block";
                        document.getElementById("demoCarrusel").style.display = "none";
                        document.getElementById("modal-content").style = "background-color: #fefefe; margin: auto; padding: 20px; border: 1px solid #888; width: 80%; height: 80%;";
                    };


                    // When the user clicks 20102, Almacenamiento de sustancias peligrosas, Altaon <span> (x), close the modal
                    span.onclick = function () {
                        modal.style.display = "none";
                    };

                    // When the user clicks anywhere outside of the modal, close it
                    window.onclick = function (event) {
                        if (event.target === modal) {
                            modal.style.display = "none";
                        }
                    };

                    //btn.click();

                } else {
                }
//                var JsonIncidente = {
//
//                    "incidente": incidente,
//                    "lat": Latitud,
//                    "lng": Longitud,
//                    "folioIncidentes": FolioIncidentes,
//                    "folio": Folio,
//                    "buscar": false,
//                    "fecha": getFecha(),
//                    "hora": getHora()
//
//                };
//                Websocket_Folios.send(JSON.stringify(JsonIncidente));
                if (estado !== null) {
                    UpdateIncidentes(estado);
                } else {
                    UpdateIncidentes("sin");
                }


            } else {
//                swal({
//                    type: 'error',
//                    title: "Error",
//                    text: 'Algo paso y el reporte no pudo ser guardado correctamente',
//                    showConfirmButton: true
//                });

                const Toast = Swal.fire({
                    title: "Error",
                    html: "<p style=\"color: white;font-size: 15px; padding: 0; margin: 0; margin-top: 40px;margin-bottom: 40px;\"> Algo paso y el reporte no pudo ser guardado correctamente</p>",
                    position: 'center',
                    showConfirmButton: false,
                    timer: 2000
                });

                ReporteGuardado = false;
            }
            ;
        },
        error: function (err) {


        }

    }));
}

/*function GuardarLugar(/*tipoLugar, /*numPiso, descipcionLugar, sup, inf, izq, der, altura) {
 return Promise.resolve($.ajax({
 type: 'POST',
 url: '/' + DEPENDENCIA + '/GuardarLugar',
 contentType: "application/json; charset=utf-8",
 dataType: "json",
 data: JSON.stringify({
 "cp": CP,
 //"tipoLugar": tipoLugar,
 //"numPiso": numPiso,
 "descripcionLugar": descipcionLugar,
 "superior": sup,
 "inferior": inf,
 "derecha": der,
 "izquierda": izq,
 "altura": altura
 }),
 success: function (response) {
 
 
 },
 error: function (err) {
 
 
 }
 }));
 }
 */



function RegistroLlamadaAtendida(d) {


    prefijoFolio = data.Modo.clave + estado + "CM";

    //LimpiarBackupServer(reg);
    var hoy = new Date();
    var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    var idUsuario = data.RegistroLlamada.idUsuarios_Movil;
    var idLlamada = data.RegistroLlamada.idLlamada;

    $.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/RegistrarllamadaAtendida',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "idRegistro_Llamadas": idLlamada,
            "hora": hora,
            "latitud": Latitud,
            "longitud": Longitud,
            "altitud": Altitud,
            "idModo_Llamada_Finalizada": '5',
            "ruta_generada": ruta.toString(),
            "idUsuarios_Movil": idUsuario,
            "idUsuario_Sys": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).idUsuario_Sys,
            "prefijoFolio": prefijoFolio
        }),
        success: function (response) {


        },
        error: function (err) {

        }
    });
}

function RegistroLlamadaFinalizada() {
    var hoy = new Date();
    var hora = getHora();
    var idLlamada = data.RegistroLlamada.idLlamada;
    if (hora_reporte === "") {
        hora_reporte = getHora();
    }
    if (colonia === null) {
        colonia = " ";
    }
    if (estado === null) {
        estado = " ";
    }
    if (municipio === null) {
        municipio = " ";
    }
    if (CP === null) {
        CP = 0;
    }
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/RegistrarllamadaFinalizada',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "idRegistro_Llamadas": idLlamada,
            "hora": hora,
            "chat": JSON.stringify(chat),
            "direccion": direccion.toString(),
            "Folio": Folio.toString(),
            "folioIncidentes": FolioIncidentes.toString(),
            "prefijoFolio": prefijoFolio,
            "colonia": colonia,
            "estado": estado,
            "municipio": municipio,
            "codigopostal": CP,
            "bitacora": data.RegistroLlamada.time
        }),
        success: function (response) {

            llamadafinalizada = true;
            if (ReporteGuardado) {
                //////////////////MODAL
                document.getElementById("FrameReporte").src = "Reporte/" + idLlamada + "/" + data.origen + "/" + hora_reporte;
                // Get the modal
                var modal = document.getElementById('myModal');

                // Get the button that opens the modal
                var btn = document.getElementById("myBtn");
                btn.style = "position: absolute; z-index: 100; top: 88%; left: 83%; background-image: url(" + PathRecursos + 'Img/pdf.svg' + "); background-repeat: no-repeat; background-position: center; border: none; cursor: pointer; width: 15%; height: 10%; background-color: transparent;";

                // Get the <span> element that closes the modal
                var span = document.getElementsByClassName("close")[0];

                // When the user clicks the button, open the modal 
                btn.onclick = function () {
                    modal.style.display = "block";
                    document.getElementById("FrameReporte").style.display = "block";
                    document.getElementById("demoCarrusel").style.display = "none";
                    document.getElementById("modal-content").style = "background-color: #fefefe; margin: auto; padding: 20px; border: 1px solid #888; width: 80%; height: 80%;";
                };


                // When the user clicks 20102, Almacenamiento de sustancias peligrosas, Altaon <span> (x), close the modal
                span.onclick = function () {
                    modal.style.display = "none";
                };

                // When the user clicks anywhere outside of the modal, close it
                window.onclick = function (event) {
                    if (event.target === modal) {
                        modal.style.display = "none";
                    }
                };

                //btn.click();

            }
        },
        error: function (err) {


        }
    }));

}

function NotDependencias(url) {


    var jsn = {"lat": Latitud, "lng": Longitud, "Folio": Folio, "FolioIncidentes": FolioIncidentes, "Incidente": incidente, "Pre": prefijoFolio,
        "folioExterno": document.getElementById("folioExterno").value,
        "DescripcionLugar": document.getElementById("DescripcionLugar").value,
        "AreaReporte": document.getElementById("AreaReporte").value,
        "origen": DEPENDENCIA};

    data.Datos = jsn;

    $.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/NotDependencias',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "data": JSON.stringify(data),
            "url": url
        }),
        success: function (response) {


        },
        error: function (err) {


        }
    });

}
function NotDependenciasEspecificas(usuarios) {


    var jsn = {
        "lat": Latitud, "lng": Longitud, "Folio": Folio, "FolioIncidentes": FolioIncidentes, "Incidente": incidente, "Pre": prefijoFolio,
        "folioExterno": document.getElementById("folioExterno").value,
        "DescripcionLugar": document.getElementById("DescripcionLugar").value,
        "AreaReporte": document.getElementById("AreaReporte").value,
        "origen": DEPENDENCIA
    };

    data.Datos = jsn;

    $.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/NotDependenciasEspecificas',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "data": JSON.stringify(data),
            "usuarios": usuarios
        }),
        success: function (response) {
        },
        error: function (err) {
        }
    });

}


function InsertarLlamada(url) {








    var jsn = {/*"chat": chat.toString, */"lat": Latitud, "lng": Longitud, "Folio": Folio, "FolioIncidentes": FolioIncidentes, "Incidente": incidente, "Pre": prefijoFolio,
        "folioExterno": document.getElementById("folioExterno").value,
        "DescripcionLugar": document.getElementById("DescripcionLugar").value,
        "AreaReporte": document.getElementById("AreaReporte").value,
        "origen": DEPENDENCIA};

    data.Datos = jsn;

    data = "";
    $.ajax({
        type: 'POST',
        url: 'insertarllamada',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({data

        }),
        success: function (response) {


        },
        error: function (err) {


        }
    });

}
function getFecha() {
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1; //January is 0!

    var yyyy = hoy.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var fecha = yyyy + '-' + mm + '-' + dd;
    return fecha;
}
function getHora() {
    var hoy = new Date();
    var hora = hoy.getHours();
    var min = hoy.getMinutes();
    var seg = hoy.getSeconds();
    //Anteponiendo un 0 a la hora si son menos de 10 
    hora = hora < 10 ? '0' + hora : hora;
    //Anteponiendo un 0 a los minutos si son menos de 10 
    min = min < 10 ? '0' + min : min;
    //Anteponiendo un 0 a los segundos si son menos de 10 
    seg = seg < 10 ? '0' + seg : seg;


    var h = hora + ':' + min + ':' + seg;
    return h;
}

function consultaPerfil(Dependencia, id) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + Dependencia + '/DatosPerfil',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "idUsuarios_Movil": id
        }),
        success: function (response) {

        },
        error: function (err) {

        }
    }));
}

function DatosProyecto() {
    return Promise.resolve($.ajax({
        type: 'GET',
        url: '/' + DEPENDENCIA + '/DatosProyecto',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (p) {


            document.getElementById("FireBaseAuthorization").value = p["FireBaseAuthorization"];
        },
        error: function (err) {
            //alert("No hay ubicacion para el usuario:" + idUsuarios_Movil);

        }
    }));

}

function Esperar(elemento) {
    setTimeout(function () {
        elemento.moving = false;
        UpdateMarker(elemento);
    }, 100);

}


function ElementosCercanos(Dependencia, icon, latitud, longitud, rango, fecha) {

    $.ajax({
        type: 'POST',
        url: '/' + Dependencia[1] + '/BuscarElementosCercanos',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "latitud": latitud,
            "longitud": longitud,
            "rango": rango,
            "fecha": fecha
        }),
        success: function (d) {
            for (var i in d) {



                d[i].icon = icon;
                data.Dependencias[i] = d[i];

            }
            var update = false;
            for (var i = 0; i < data.Dependencias[Dependencia[1]].elementos.length; i++) {
                var elemento = data.Dependencias[Dependencia[1]].elementos[i];
                var idMarcador = elemento.origen + elemento.idUsuario_Movil;


                for (var j = 0; j < markers.length; j++) {
                    if (idMarcador === markers[j].id) {

                        elemento.posicion.ult = {
                            "lat": elemento.posicion.lat,
                            "lng": elemento.posicion.lng
                        }
                        elemento.posicion.lat = markers[j].getPosition().lat();
                        elemento.posicion.lng = markers[j].getPosition().lng();
                        //elemento.moving = true;

                        Esperar(elemento);


                        update = true;
                        break;
                    }
                }
                if (!update) {
//                   

                    SetMarker(elemento, icon);
                    elemento.posicion.ult = {
                        "lat": elemento.posicion.lat,
                        "lng": elemento.posicion.lng
                    }
                    elemento.moving = false;
                    UpdateMarker(elemento);
                }
            }

        },
        error: function (err) {

        }
    });

}


function MarcadorElemento(Dependencia, elemento, icono) {

//    var infow = new google.maps.InfoWindow({maxWidth: 300});
    var datos_elemento = consultaPerfil(Dependencia[1], elemento.idUsuarios_Movil);
//    var r = "[" + elemento.ruta.substring(0, elemento.ruta.length - 1) + "]";
    datos_elemento.then(function (perfil) {


        var agregado = false;
        for (var i = 0; i < marcadoresElementos.length; i++)
        {
            if (marcadoresElementos[i].id === parseInt(elemento.idUsuarios_Movil) && marcadoresElementos[i].dependencia === Dependencia[1]) {

                marcadoresElementos[i].setMap(null);
                var latlng = new google.maps.LatLng(elemento.latitud, elemento.longitud);
                marcadoresElementos[i].setPosition(latlng);
                marcadoresElementos[i].setMap(map);
                agregado = true;
                break;
            }
        }
        if (!agregado) {

            var marcador;
            marcador = new google.maps.Marker({position: {lat: parseFloat(elemento.latitud), lng: parseFloat(elemento.longitud)},
                //animation: googlue.maps.Animation.BOUNCE,
                icon: icono
            }, );

            marcador.set("id", parseInt(elemento.idUsuarios_Movil));
            marcador.set("dependencia", Dependencia[1]);

            marcador.addListener('click', function () {
                infowindow.close();

                infowindow.setContent(" <style>.div{border:solid 1px red;}</style><div style=\" width: 70px; float: left;\">\n\
                    <img src=\"" + /*perfil.Img*/ perfil.img + "\"  class=\"img-fotografia\" style=\"width: 65px; border-radius:10px; margin-right:10px; max-height: 100px;\" alt=\"Imagen de perfil de usuario\"/>   \n\
                    </div>\n\
                    <div style=\" width: 150px; float: left;\">\n\
                    <p>\n\
                    Ultima actualizacion: <br>" + elemento.hora + "<br>" + "Nombre: " + perfil.nombre + " " + perfil.apellido_paterno + "<br>" + perfil.telefono + "<br>Estado de notificacion:   <br> <button onclick=\"enviarNotificacionIndividual('" + elemento.idUsuarios_Movil + "','" + Dependencia[1] + "')\">Llamar</button> \
                    <\p>\n\
                    </div>");
                infowindow.open(map, marcador);
            });

            $("#marcadoresDependencias").submit(function () {
                marcador.setMap(null);
            });
            $("#myRange").mouseup(function () {
                marcador.setMap(null);
            });


            marcadoresElementos[marcadoresElementos.length] = marcador;
            for (var i = marcadoresElementos.length - 1; i >= 0; i--)
            {
                if (marcadoresElementos[i].id === parseInt(elemento.idUsuarios_Movil) && marcadoresElementos[i].dependencia === Dependencia[1]) {

                    marcadoresElementos[i].setMap(map);
                    break;
                }
            }
        }

    });
}



function loadingpage() {
    var loadingPage = PathRecursos + 'Img/calluser.png';
    var loading = document.createElement("div");
    loading.id = "loading";
    loading.style = "position: absolute;width: 20%;height: 20%;top: 30%;left: 40%;";
    var loadingGif = document.createElement("img");
    loadingGif.src = loadingPage;
    loadingGif.style = "position: absolute; width: 100%; top:10%;";
    loading.appendChild(loadingGif);
    document.getElementById("GRID").appendChild(loading);

    // Get the modal
    var modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
//var span = document.getElementsByClassName("close")[0];
    var span = document.getElementById("CloseFrame");



// When the user clicks 20102, Almacenamiento de sustancias peligrosas, Altaon <span> (x), close the modal
    span.addEventListener("click", function () {
        modal.style.display = "none";
    });

// When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}






function SetFolio() {
    Folio = document.getElementById("folio").value;

}

function BuscarLugarAntecedente() {

    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/BuscarLugarAntecedente',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({

            "longitud": Longitud,
            "latitud": Latitud,
            "altitud": Altitud
        }),
        success: function (response) {

            if (response !== null) {
                //document.getElementById("registrarLugar").checked = false;



                //document.getElementById("Lugar").value = response.tipoLugar;
                //document.getElementById("Lugar").disabled = true;
//                if (response.tipoLugar === "Edificio" || response.tipoLugar === "Departamento") {
//                    //document.getElementById("UbicacionPiso").type = "number";
//                    document.getElementById("UbicacionPiso").value = response.numPiso;
//                    document.getElementById("UbicacionPiso").disabled = true;
//                }
                document.getElementById("DescripcionLugar").value = response.descripcionLugar;
                document.getElementById("DescripcionLugar").disabled = true;
                var R = 6372795.477598;
                var rad = Math.PI / 180;
                var LatA = rad * response.superior;
                var LonA = rad * response.derecha;
                var LatB = rad * response.inferior;
                var LonB = rad * response.izquierda;
                var d = R * Math.acos(Math.sin(LatA) * Math.sin(LatB) + Math.cos(LatA) * Math.cos(LatB) * Math.cos(LonA - LonB));

//                Circle = new google.maps.Circle({
//                    strokeWeight: 0,
//                    fillColor: '#B0D1D3',
//                    fillOpacity: 0.5,
//                    map: map,
//                    center: {lat: Latitud, lng: Longitud},
//                    radius: parseInt(d / 2)
//                });
            } else {

            }

        },
        error: function (err) {

        }
    }));
}











function enviarNotificacionGrupal() {


    Swal.fire({
        title: 'Notificar',
        html: "<p style=\"color: white;font-size: 15px; padding: 15px;; margin: 0; margin-top: 40px;\">Esta acción enviará una notificación a todos los elementos desplegados en el mapa \n¿Desea continuar?</p>",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, enviar a todos'
    }).then((result) => {
        if (result.value) {
            if (incidente_establecido) {
                if (FolioIncidentes) {
                    Swal.fire({
                        title: 'Notificación',
                        html: //-------------------------TITULO
                                '<div class="row col-12 m-0 pt-4">' +
                                '<label class="sweetalrtTitle" >Esta información sera la que le llegue al elemento que se le envia la notificación</label>' +
                                //-------------------------DESCRIPCION DEL LUGAR 
                                '<label class="sweetalrt">Descripción del Lugar</label>' +
                                '<input id="swal-input5" class="swal2-input swalInput" value="' + document.getElementById("DescripcionLugar").value + '">' +
                                //-------------------------REPORTE
                                '<label class="sweetalrt"">Reporte</label>' +
                                '<textarea id="swal-input6" class="swal2-inputTxtA" rows="5">' + document.getElementById("AreaReporte").value + '</textarea>' +
                                '</div>',
                        focusConfirm: false,
                        preConfirm: () => {
                            return [

                                document.getElementById('swal-input5').value,
                                document.getElementById('swal-input6').value
                            ];
                        }
                    }).then((result) => {

                        document.getElementById("DescripcionLugar").value = result.value[0].split("~")[0];
                        document.getElementById("AreaReporte").value = result.value[1];

                        var proceder = true;
                        for (var i = 0; i < result.value.length; i++) {

                            if (result.value[i] === "" || result.value[i] === null || result.value[i] === undefined) {
                                proceder = false;
                            }
                        }
                        if (proceder)
                        {
                            var dato = document.getElementById("DependenciasID").value.split("|");
                            for (var i = 0; i < dato.length; i++) {
                                var dependencia = dato[i].split(",");

                                //var idElementos = document.getElementById("elementos" + dependencia[0] + dependencia[3]).value.split(",");



                                if (data.Dependencias.hasOwnProperty(dependencia[1])) {
                                    for (var j = 0; j < data.Dependencias[dependencia[1]].elementos.length; j++) {


                                        FireBaseKey(data.Dependencias[dependencia[1]].elementos[j].idUsuario_Movil, 3, "", "", "", dependencia[1], data.RegistroLlamada.idLlamada);
                                    }
                                }
                                /* for (var j = 0; j < idElementos.length; j++) {
                                 if (idElementos[j] !== "") {
                                 
                                 FireBaseKey(idElementos[j], 3, "", "", "", dependencia[1]);
                                 }
                                 }*/

                            }


                            Swal.fire(
                                    'Notificaciones enviadas!',
                                    'Los elementos estan siendo notificados.',
                                    'success'
                                    );

                        } else {

                            Swal.fire(
                                    'Informacion insuficiente en "Descripción de emergencia"',
                                    'Favor de rellenar todos los campos: <br>\n\
                                        <br>- Descripcion del lugar\n\
                                        <br>- Reporte <br><br>',
                                    'error'
                                    );
                        }


                    });

                } else {

                    let timerInterval;
                    Swal.fire({
                        title: 'Un momento porfavor!',
                        html: 'Se está solicitando un folio a la plataforma Incidentes <strong></strong> segundos.',
                        timer: 5000,
                        onBeforeOpen: () => {
                            Swal.showLoading();
                            timerInterval = setInterval(() => {
                                Swal.getContent().querySelector('strong')
                                        .textContent = parseInt((5100 - Swal.getTimerLeft()) / 1000);
                            }, 100);
                        },
                        onClose: () => {
                            clearInterval(timerInterval);
                            clearInterval(esperandofolio);
                        }
                    }).then((result) => {
                        if (
                                // Read more about handling dismissals
                                result.dismiss === Swal.DismissReason.timer
                                ) {

                            Swal.fire({
                                title: 'Plataforma Incidentes no responde',
                                text: "Algo paso y no se logro generar un folio con la plataforma incidentes!<br> ¿Enviar notificacion de todos modos?",
                                type: 'info',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Si, enviar!'
                            }).then((result) => {
                                if (result.value) {




                                    Swal.fire({
                                        title: 'Notificación',
                                        html: //-------------------------TITULO
                                                '<div class="row col-12 m-0 pt-4">' +
                                                '<label class="sweetalrtTitle" >Esta información sera la que le llegue al elemento que se le envia la notificación</label>' +
                                                //-------------------------DESCRIPCION DEL LUGAR 
                                                '<label class="sweetalrt">Descripción del Lugar</label>' +
                                                '<input id="swal-input5" class="swal2-input swalInput" value="' + document.getElementById("DescripcionLugar").value + '">' +
                                                //-------------------------REPORTE
                                                '<label class="sweetalrt"">Reporte</label>' +
                                                '<textarea id="swal-input6" class="swal2-inputTxtA" rows="5">' + document.getElementById("AreaReporte").value + '</textarea>' +
                                                '</div>',
                                        focusConfirm: false,
                                        preConfirm: () => {
                                            return [

                                                document.getElementById('swal-input5').value,
                                                document.getElementById('swal-input6').value
                                            ];
                                        }
                                    }).then((result) => {

                                        document.getElementById("DescripcionLugar").value = result.value[0].split("~")[0];
                                        document.getElementById("AreaReporte").value = result.value[1];

                                        var proceder = true;
                                        for (var i = 0; i < result.value.length; i++) {

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

                                                        FireBaseKey(idElementos[j], 3, "", "", "", dependencia[1], data.RegistroLlamada.idLlamada);
                                                    }
                                                }

                                            }
                                            Swal.fire(
                                                    'Notificaciones enviadas!',
                                                    'Los elementos estan siendo notificados.',
                                                    'success'
                                                    );


                                        } else {

                                            Swal.fire(
                                                    'Informacion insuficiente en "Descripción de emergencia"',
                                                    'Favor de rellenar todos los campos: <br>\n\
                                                        <br>- Descripcion del lugar\n\
                                                        <br>- Reporte <br><br>',
                                                    'error'
                                                    );
                                        }


                                    });





                                }
                            })
                        }
                    });

                    var esperandofolio = setInterval(function () {
                        if (FolioIncidentes) {

                            Swal.close();
                            clearInterval(timerInterval);
                            clearInterval(esperandofolio);

                            Swal.fire({
                                title: 'Notificación',
                                html: //-------------------------TITULO
                                        '<div class="row col-12 m-0 pt-4">' +
                                        '<label class="sweetalrtTitle" >Esta información sera la que le llegue al elemento que se le envia la notificación</label>' +
                                        //-------------------------DESCRIPCION DEL LUGAR 
                                        '<label class="sweetalrt">Descripción del Lugar</label>' +
                                        '<input id="swal-input5" class="swal2-input swalInput" value="' + document.getElementById("DescripcionLugar").value + '">' +
                                        //-------------------------REPORTE
                                        '<label class="sweetalrt"">Reporte</label>' +
                                        '<textarea id="swal-input6" class="swal2-inputTxtA" rows="5">' + document.getElementById("AreaReporte").value + '</textarea>' +
                                        '</div>',
                                focusConfirm: false,
                                preConfirm: () => {
                                    return [

                                        document.getElementById('swal-input5').value,
                                        document.getElementById('swal-input6').value
                                    ];
                                }
                            }).then((result) => {

                                document.getElementById("DescripcionLugar").value = result.value[0].split("~")[0];
                                document.getElementById("AreaReporte").value = result.value[1];

                                var proceder = true;
                                for (var i = 0; i < result.value.length; i++) {

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

                                                FireBaseKey(idElementos[j], 3, "", "", "", dependencia[1], data.RegistroLlamada.idLlamada);
                                            }
                                        }

                                    }
                                    Swal.fire(
                                            'Notificaciones enviadas!',
                                            'Los elementos estan siendo notificados.',
                                            'success'
                                            );


                                } else {

                                    Swal.fire(
                                            'Informacion insuficiente en "Descripción de emergencia"',
                                            'Favor de rellenar todos los campos: <br>\n\
                                                <br>- Descripcion del lugar\n\
                                                <br>- Reporte <br><br>',
                                            'error'
                                            );
                                }


                            });




                        } else {

                        }

                    }, 500);



                }







            } else
            {

//                swal(
//                        'Para notificar a un elemento es necesario:\n\
//                         <br>"Establecer un incidente", puedes:\n\
//                        <br>- Seleccionar un incidente cercano \n\
//                        <br>- ó \n\
//                        <br>- Establecer un nuevo incidente <br><br>',
//                        'error'
//                        );

                Swal.fire({
                    title: 'Notificación',
                    html: //-------------------------TITULO
                            '<label class="sweetalrtTitle" style="text-align: center;">Para notificar a un elemento es necesario primero <br>"Establecer un incidente".</label>' +
                            '<p style="margin: 0;color: #fe8201;font: bold 12px Arial;" >- Selecciona un incidente cercano \n\
                    <br> ó \n\
                    <br>- Establece un nuevo incidente</p>',
                    focusConfirm: false
                });

            }
        }

    });


}








$("#EstablecerIncidente").on("click", function (e) {
    e.preventDefault();



    var modo = data.RegistroLlamada.modo;

    //var folioExterno = document.getElementById("folioExterno").value;
    var DescripcionLugar = document.getElementById("DescripcionLugar").value;
    var AreaReporte = document.getElementById("AreaReporte").value;


    if (incidente /*&& folioExterno !== ""*/ && DescripcionLugar !== "" && AreaReporte !== "") {
        incidente_establecido = true;

        //document.getElementById("chained_relative-flexdatalist").disabled = "true";
        //document.getElementById("chained_relative-flexdatalist").className = "readonly ClearInput";


        document.getElementById("aheadingOne").click();
        document.getElementById("collapseThree").className = "collapse show";
        document.getElementById("headingZero").style = "display:none;";
        document.getElementById("headingOne").style = "display:none;";

        var existe = false;
        var pos;
        for (var i = 0; i < ArrayIncidentesCercanos.length; i++) {

            if (ArrayIncidentesCercanos[i].incidente.id === incidente.id) {
                existe = true;
                pos = i;
                break;
            }
        }
        if (!existe) {



            SolicitarFolioIncidetes(incidente.id, estado).then(function (responseIncidentes) {
//            var responseIncidentes = {
//                "serie": 20300000812,
//                "status": "200"
//            }

                if (responseIncidentes) {

                    FolioIncidentes = responseIncidentes.serie;
                    document.getElementById("FolioIncidentes").value = FolioIncidentes;

                    SolicitarFolio(incidente.id).then(function (response) {

                        if (response) {

                            Folio = response.folio;
                            prefijoFolio = data.Modo.clave + estado + "CM";
                            document.getElementById("folio").value = prefijoFolio + Folio;


                            //if(incidente){
                            var dependencias = document.getElementById("DependenciasID").value.split("|");
                            for (var i = 0; i < dependencias.length; i++) {
                                var depen = dependencias[i].toString().split(",");
                                var id = depen[0];
                                if (incidente.Dependencias.includes(depen[1])) {
                                    document.getElementById(id).checked = 1;
                                }
                            }
                            $('#notificarDependencias').submit();

                            document.getElementById("EstablecerIncidente").style.display = "none";

                            var JsonIncidente = {

                                "incidente": incidente,
                                "lat": Latitud,
                                "lng": Longitud,
                                "folioIncidentes": FolioIncidentes,
                                "folio": Folio,
                                "buscar": false,
                                "fecha": getFecha(),
                                "hora": getHora(),
                                "folioExterno": document.getElementById("folioExterno").value,
                                "DescripcionLugar": document.getElementById("DescripcionLugar").value,
                                "AreaReporte": document.getElementById("AreaReporte").value,
                                "responseIncidentes": responseIncidentes,
                                "registroFolio": response,
                                "dependencia": hostdir + '/' + DEPENDENCIA,
                                "idOperador": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).idUsuario_Sys,
                                "operador": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre,
                                "registrar_incidente": true,
                                "idSocket": idSocketOperador

                            };

                            EnviarMensajePorSocket(JsonIncidente);
//                        UpdateIncidentes().then(function (response) {
//                           
//                        });
                            //}
                        }
                    });
                }
            });
        } else {


            FolioIncidentes = ArrayIncidentesCercanos[pos].folioIncidentes;
            document.getElementById("FolioIncidentes").value = FolioIncidentes;
            Folio = ArrayIncidentesCercanos[pos].folio;
            prefijoFolio = data.Modo.clave + estado + "CM";
            document.getElementById("folio").value = prefijoFolio + Folio;

            var dependencias = document.getElementById("DependenciasID").value.split("|");

            for (var i = 1; i < dependencias.length; i++) {

                var depen = dependencias[i].toString().split(",");
                var id = depen[0];

                if (incidente.Dependencias.includes(depen[1])) {
                    document.getElementById(id).checked = 1;
                }
            }
//           
            $('#notificarDependencias').submit();
            document.getElementById("EstablecerIncidente").style.display = "none";

        }


    } else {
        var Aviso = "Es necesario llenar la informacion correspondiente para poder notificar a las dependencias";
        const Toast = Swal.fire({
            title: "Notificación Automática",
            html: "<p style=\"color: white;font-size: 15px; padding: 0; margin: 0; margin-top: 40px;margin-bottom: 40px;\">" + Aviso + "</p>",
            position: 'center',
            showConfirmButton: false,
            timer: 2000
        });
    }


});


$("#EstablecerFolio").on("click", function () {
    if (incidente) {
        SetFolio();
        if (Folio) {



            document.getElementById("collapseTwo").className = "collapse";
            document.getElementById("collapseThree").className = "collapse show";

        } else {
            alert("Es necesario establecer folio para Generar un reporte");
        }
    } else {
        alert("Es necesario establecer un incidente");
    }

});

function JsonSolicitarListaIncidentes() {
    var JsonSolicitarListaIncidentes = {
        "lat": Latitud,
        "lng": Longitud,
        "buscar_incidente": true
    };
    console.log("Buscando Lista de incidentes");
    //console.log(JsonSolicitarListaIncidentes);
    EnviarMensajePorSocket(JsonSolicitarListaIncidentes);
    //OpenSocketFolios(JSON.stringify(JsonSolicitarListaIncidentes));
}

$("#timer").on("click", );

function RestarDate(date1, date2) {

    //La diferencia se da en milisegundos así que debes dividir entre 1000
    var time = ((date2 - date1) / 1000);
    // resultado 5;

    var hours = Math.floor(time / 3600);
    var minutes = Math.floor((time % 3600) / 60);
    var seconds = time % 60;
    //Anteponiendo un 0 a los minutos si son menos de 10 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    //Anteponiendo un 0 a los segundos si son menos de 10 o String(minutes).padStart(2, '0')
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var result = hours + ":" + minutes + ":" + seconds;

    return (result);
}

function imgChat(imgB64) {

    var nuevaImagen = imgB64;
    nuevaImagen.tipo = "imagen";


    nuevaImgFrame(imgB64);

    var info = document.createElement("div");
    info.style = "font:10px Arial;";

    var img = document.createElement("img");
    img.style = "max-width: 100%;";
    img.alt = "";
    img.src = "data:image/png;base64," + imgB64.src;


    var mensaje = document.getElementById("chat-imagen" + imgB64.id);



    mensaje.appendChild(img);




    // nuevaImagen.w = img.width;
    //nuevaImagen.h = img.height;
    info.innerHTML = imgB64.fecha + " - " + imgB64.hora;
    mensaje.appendChild(info);
    nuevaImagen.src = "";
    chat.push(nuevaImagen);


    //document.getElementById("chat-imagen" + imgB64.id).appendChild(img);

    /*if (event.from.connectionId === session.connection.connectionId) {*/
    //mensaje.innerHTML = event.data;
    //mensaje.style = "background: #f58220;  border-radius: 10px; padding: 5px; color: white; font: 15px Arial; text-align: right; width: max-content; max-width: 145%;";
//    theirs.appendChild(mensaje);
//    msgHistory.appendChild(empty);
//    msgHistory.appendChild(theirs);
//    theirs.scrollIntoView();
    /*} else {
     //mensaje.innerHTML = event.data;
     mensaje.style = "background: #00a5b8; float: right; border-radius: 10px; padding: 5px; color: white; font: 15px Arial; text-align: right; width: max-content; max-width: 145%;";
     theirs.appendChild(mensaje);
     msgHistory.appendChild(empty);
     msgHistory.appendChild(theirs);
     theirs.scrollIntoView();
     }*/



    img.addEventListener("click", function () {

        document.getElementById("myModal").style.display = "block";
        document.getElementById("FrameReporte").style.display = "none";
        document.getElementById("demoCarrusel").style.display = "block";
        document.getElementById("modal-content").style = "background-color: #fefefe; margin: auto; padding: 10px; border: 1px solid #888; width: 30%; height: auto;";
        var x = document.getElementsByClassName("carousel-item active");
        for (var i = 0; i < x.length; i++) {
            x[i].className = "carousel-item";
        }
        document.getElementById("ImgFrame" + imgB64.id).parentNode.className = "carousel-item active";
    });
}

var imgCount = 0;
function nuevaImgFrame(imgB64) {

    var carouselindicators = document.getElementById("carousel-indicators");
    var li = document.createElement("li");
    li.setAttribute("data-taget", "#demoCarrusel");
    li.setAttribute("data-slide-to", imgCount);
    imgCount++;
    li.id = imgB64.idUsuario;
    //carouselindicators.appendChild(li);


    var carrusel = document.getElementById("carousel-inner");
    var div = document.createElement("div");
    div.className = "carousel-item";
    var img = document.createElement("img");
    img.src = "data:image/png;base64," + imgB64.src;
    img.style = "max-width: 100%; width: 100%;";
    img.id = "ImgFrame" + imgB64.id;

    var divCaption = document.createElement("div");
    divCaption.className = "carousel-caption";
    var p = document.createElement('p');
    p.style = "font:12px Arial;";
    p.innerHTML = imgB64.fecha + " - " + imgB64.hora;
    divCaption.appendChild(p);
    div.appendChild(img);
    div.appendChild(divCaption);
    carrusel.appendChild(div);


}







function closeTab() {

    deleteCookie("operador/" + DEPENDENCIA);
    if (!ReporteGuardado)
    {
        return "Write something clever here...";
    }
}


var small = false;

window.onresize = function (event) {


    var posicion1 = document.getElementById("posicion1");
    var posicion2 = document.getElementById("posicion2");
    if (screen.orientation.type === "portrait-primary" && screen.width < 767 && !small) {
        small = true;



        posicion2.appendChild(posicion1.firstElementChild);
        //posicion2.appendChild(posicion1.firstElementChild);


//       var waitinbar = document.getElementById("waitingbar");
//       var waitinbar2 = document.getElementById("waitingbar2");
//       waitinbar2.appendChild(waitinbar);
    }
    if ((screen.orientation.type !== "portrait-primary" || screen.width > 767) && small) {

        small = false;

        posicion1.appendChild(posicion2.firstElementChild);
        //posicion1.appendChild(posicion2.firstElementChild);


//       var waitinbar = document.getElementById("waitingbar");
//       var waitinbar1 = document.getElementById("waitingbar1");
//       waitinbar1.appendChild(waitinbar);

    }
};
window.onload = function (event) {
    var posicion1 = document.getElementById("posicion1");
    var posicion2 = document.getElementById("posicion2");
    if (screen.orientation.type === "portrait-primary" && screen.width < 767 && !small) {
        small = true;





        //posicion2.appendChild(posicion1.firstChild);


        //posicion2.appendChild(posicion1.firstChild);
        posicion2.appendChild(posicion1.firstElementChild);
        //posicion2.appendChild(posicion1.firstElementChild);
//       var waitinbar = document.getElementById("waitingbar");
//       var waitinbar2 = document.getElementById("waitingbar2");
//       waitinbar2.appendChild(waitinbar);
    }
};



function buscarImg(id) {

//    if (isNaN(modo)) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/CosultaImg',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "id": id
        }),
        success: function (response) {


        },
        error: function (err) {

        }
    }));

}

function listarCamarasUrbanas(lat, lng, rango) {
    var settings = {
        "url": "/" + DEPENDENCIA + "/CamarasUrbanas/API/" + lat + "/" + lng + "/" + rango,
        "method": "GET",
        "headers": {
            "Content-Type": "application/json"
        }
    };
    console.log(settings);
    $.ajax(settings).done(function (camaras) {
        console.log("CAMARAS URBANAS*****");
        if (camaras !== '{"error": "no cams found"},201') {
            console.log(JSON.parse(camaras));
            camaras = JSON.parse(camaras);
            for (var i = 0; i < camaras.length && i < 15; i++) {
                var camara = camaras[i];
                camara.lng = camara.long;
                insertarCamaraUrbana(camara);
            }
        }

    });
}

function insertarCamaraUrbana(camara) {

    console.log(camara);



    var myLatLng = new google.maps.LatLng(camara.lat, camara.lng);

    // define our custom marker image
    var image = new google.maps.MarkerImage(
            "https://domoticaytecnologia.es/wp-content/uploads/2016/11/cctv-camaras.png",
            null, // size
            null, // origin
            new google.maps.Point(8, 8), // anchor (move to center of marker)
            new google.maps.Size(16, 16) // scaled size (required for Retina display icon)
            );



    var rowInfoW = document.createElement("div");
    rowInfoW.className = "row col-12 m-0 p-0";
    var divInfoW = document.createElement("div");
    divInfoW.className = "col-12";
    var tipoIncidenteInfoW = document.createElement("p");
    tipoIncidenteInfoW.style = "color: black; padding: 0; font: 14px Arial; width: 100%; margin:0;";
    tipoIncidenteInfoW.innerHTML = camara.direccion;
    var folioInfoW = document.createElement("p");
    folioInfoW.style = "color: black; padding: 0; margin: 0px 20px 5px; font: 10px Arial;";
    folioInfoW.innerHTML = camara.nserie + " - activa:" + camara.online;

    divInfoW.appendChild(tipoIncidenteInfoW);
    divInfoW.appendChild(folioInfoW);
    rowInfoW.appendChild(divInfoW);



    // then create the new marker
    var marcador = new google.maps.Marker({
        icon: image,
        map: map,
        position: myLatLng,

    });
    marcador.addListener('click', function () {

        infowindow.close();
        infowindow.setContent(rowInfoW);
        infowindow.open(map, marcador);

    });


}

habilitarMaximizarVideo();

modalImagenes();



