/* global OT, API_KEY, TOKEN, SESSION_ID, SAMPLE_SERVER_BASE_URL, rectangle, Promise, markers, DEPENDENCIA, PREFIJO_ELEMENTO, CP, map, google, websocket, hostdir, ALIAS, MSJ, DEPENDENCIA_ALIAS, DEPENDENCIA_ICON, infowindow, recordRTC, INCIDENTES, direccion, USR, BackupImage */


data = JSON.parse(document.getElementById("data").value);
//var sesion_cookie=JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA))

var proyecto = DatosProyecto();

var Directorio;
var tel_a_agregar = new Array();
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
});

//RequestPOST("/API/empresas360/GruposPersonalizados", {
//    "idUsuarioSys": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys,
//    "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
//    "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
//    "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area
//}).then((response) => {
//    dataG = response;
//    initializeSession();
//});



function initializeSession() {
    var session = OT.initSession(data.credenciales.apikey, data.credenciales.sesion);

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
            console.error('You were disconnected from the session.', event.reason);

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

            mosaico("remover");

            console.log("Registrar desconexion?");
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
                enviarMensaje(session, sesion_cookie.nombre + " " + sesion_cookie.apellido_p + "", msgTxt.value);

            });
            // Initialize the publisher
            var publisherOptions = {
                insertMode: 'replace',
                width: '100%',
                height: '100%',
                name: DEPENDENCIA_ALIAS,
            };
            var publisher = OT.initPublisher('publisher', publisherOptions, function initCallback(initErr) {

                if (initErr) {
                    console.error('There was an error initializing the publisher: ', initErr.name, initErr.message);
                    notificarError(initErr.message);
                    return;
                } else {
                    enviarMensaje(session, sesion_cookie.nombre + " " + sesion_cookie.apellido_p + "", MSJ);
                    enviarMensajeOT(session,"user_connected", {
                        id360:sesion_cookie.id_usuario
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
                    menu.style = "background: #343a40; position: absolute; bottom: 0px; left: calc(50% - 100px); width: 300px;border-top-left-radius: 50px;border-top-right-radius: 50px;";
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


                    let colgar = document.createElement("div");
                    colgar.className = "col-4";
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
                    activarVideo.className = "col-4";
                    activarVideo.innerHTML = '<i class="fas fa-video-slash"></i>';
                    activarVideo.style = "justify-content:center;align-items:center;display:flex;font:2rem Arial;cursor:pointer;border-right:solid 1px #6c757d;";
                    activarVideo.addEventListener("click", function () {
                        if (publisher.stream.hasVideo) {
                            activarVideo.innerHTML = '<i class="fas fa-video"></i>';
                        } else {
                            activarVideo.innerHTML = '<i class="fas fa-video-slash"></i>';
                        }
                        publisher.publishVideo(!publisher.stream.hasVideo);
                    });
                    botones.appendChild(activarVideo);
                    console.log(activarVideo);

                    //////////Compartir Pantalla  ******
                    var share_screen = document.createElement("div");
                    share_screen.className = "col-4";
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
                                                stop_share.className = "col-4";
                                                stop_share.id = "stop_sharePublisher";
                                                stop_share.style = "justify-content:center;align-items:center;display:flex;font:2rem Arial;color:red;cursor:pointer;border-right:solid 1px #6c757d;";
                                                stop_share.innerHTML = '<i class="far fa-times-circle"></i>';
                                                stop_share.addEventListener("click", function () {
                                                    session.unpublish(publisher_screen);
                                                    share_screen.className = "col-4";
                                                    stop_share.className = "col-4 d-none";
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
                                                share_screen.className = "col-4 d-none";
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



        var SolicitarVideo = FireBaseSolicitudVideo(firebase, data.credenciales.apikey, data.credenciales.sesion, data.credenciales.token, RespuestaNotificados[idUsuarios_Movil]);
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
                    id360.credenciales={
                        apikey:data.credenciales.apikey,
                        idsesion:data.credenciales.sesion,
                        token:data.credenciales.token
                    };
                    id360.idLlamada=data.registro_llamada.idLlamada;
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
                        //window.open('https://empresas.claro360.com/plataforma360/Llamada/agregar_participante' + msj.registro_llamada.idLlamada + '/' + msj.credenciales.apikey + '/' + msj.credenciales.idsesion + '/' + msj.credenciales.token + '', '_blank');  
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
        if(elemento!==null){
            AgregarCardParticipante360(elemento);
            
        }else{
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
    var title = document.createElement("h5");
    title.className = "card-title";
    title.innerHTML = elemento.nombre + " " + elemento.apellido_paterno + " " + elemento.apellido_materno;
    var text = document.createElement("p");
    text.className = "card-text";
    text.innerHTML = "<strong>Correo: </strong>" + elemento.correo + "<br><strong>Teléfono: </strong>" + elemento.telefono;

    container.appendChild(img);
    container.appendChild(card);
    card.appendChild(body);
    body.appendChild(title);
    body.appendChild(text);

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