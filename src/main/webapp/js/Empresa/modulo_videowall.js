/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var lista_video_empleados = {};
agregar_menu("Video Wall Empleados",'<i class="fas fa-grip-horizontal"></i>',"Recursos Humanos");
let videowall_started = false;
let videowall_conectados = 0;
let videowall_listado;
const tooltip = document.querySelector('#base_modulo_VideoWallEmpleados .tooltip');
let popperInstance = null;

$("div[id^='menu_section_']").click((e) => {

    if (e.target.id === "menu_section_VideoWallEmpleados") {
        videowall_started = true;
    } else {
        videowall_started = false;
    }
    //*console.log(e.target.id);
});

// obtener Backup de los videos de empleados 
RequestPOST("/API/empresas360/modulo_videowall/stats", {
    "idUsuarioSys": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys,
    "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
    "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
    "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area
}).then((stats) => {
    //*console.log(stats);
    videowall_listado = stats;
    $("#base_modulo_VideoWallEmpleados .total_empleados").text(videowall_listado.total);
    $("#base_modulo_VideoWallEmpleados .empleados_laborando").text(videowall_listado.activos);
    $("#base_modulo_VideoWallEmpleados .empleados_descansando").text(videowall_listado.inactivos);
    $("#base_modulo_VideoWallEmpleados .empleados_conectados").text(
            videowall_conectados + "/" + $("#base_modulo_VideoWallEmpleados .empleados_laborando").text());

    for (var i = 0; i < videowall_listado.empleados.length; i++) {
        if (videowall_listado.empleados[i].is_active) {
            addUserBox(videowall_listado.empleados[i]);
        }
    }
    RequestPOST("/API/empresas360/video_empleados", {
        "idUsuarioSys": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys,
        "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
        "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
        "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area
    }).then((response) => {
        $("#base_modulo_VideoWallEmpleados .user_datails p svg").click(() => {
            $("#base_modulo_VideoWallEmpleados .user_datails").addClass("d-none");
            $("#base_modulo_VideoWallEmpleados #user_details_img").removeAttr('style');
            $("#base_modulo_VideoWallEmpleados #user_details_name").text(" - ");
            $("#base_modulo_VideoWallEmpleados #user_details_area").text(" - ");
            $("#base_modulo_VideoWallEmpleados #user_details_puesto").text(" - ");
            $("#base_modulo_VideoWallEmpleados #user_details_horario").text(" - ");
            $("#base_modulo_VideoWallEmpleados #user_details_entrada").text(" - ");
            $("#base_modulo_VideoWallEmpleados #user_details_pentrada").text(" - ");
            $("#base_modulo_VideoWallEmpleados #user_details_psalida").text(" - ");
            $("#base_modulo_VideoWallEmpleados #user_details_desempeno").text(" - ");
            $("#base_modulo_VideoWallEmpleados #user_details_retardos").text(" - ");

        });
        //*console.log(response);
        for (var i = 0; i < response.length; i++) {
            actualizacion_listado_video_empleados(response[i]);
        }


    });

});
//generar un listado de usuarios  
function addUserBox(empleado) {
    if (!$("#user_box_" + empleado.id360).length) {
        let container_user = $("<div></div>").addClass("user_box");
        container_user.attr("id", "user_box_" + empleado.id360);
        let details = $("<div></div>").addClass("details");
        details.css({
            "background-image": "url(" + empleado.img + ")",
            "background-size": "cover",
            "background-position": "center",
            "background-repeat": "no-repeat"
        });
        let details_title = $("<div>" + empleado.nombre + " " + empleado.apellido_paterno + " " + empleado.apellido_materno + "</div>").addClass("details_title");
        container_user.append(details);
        container_user.append(details_title);
        $("#base_modulo_VideoWallEmpleados .empleados_list").append(container_user);
        container_user.click(() => {
            $(".video_big").removeClass("video_big");
            $("#base_modulo_VideoWallEmpleados .user_datails").removeClass("d-none");
            //$(".avada_kedavra").removeClass("avada_kedavra");
            //container_user.addClass("avada_kedavra");
//            container_user[0].scrollIntoView({
//                behavior: "smooth",
//                block: "start"
//            });
            $("#base_modulo_VideoWallEmpleados .user_datails").css({
                "top": 60 + container_user.position().top + "px"
            });

            //*console.log("Buscar stats");
            user_details(empleado);
        });
    }

}

function user_details(empleado) {
    //*console.log(empleado);

    $("#base_modulo_VideoWallEmpleados #user_details_img").css({
        "background-image": "url(" + empleado.img + ")",
        "background-size": "cover",
        "background-position": "center",
        "background-repeat": "no-repeat"
    });
    $("#base_modulo_VideoWallEmpleados #user_details_name").text(empleado.nombre + " " + empleado.apellido_paterno + " " + empleado.apellido_materno);
    $("#base_modulo_VideoWallEmpleados #user_details_area").text(empleado.area);
    $("#base_modulo_VideoWallEmpleados #user_details_puesto").text(empleado.puesto);
    $("#base_modulo_VideoWallEmpleados #user_details_horario").text(empleado.horario_entrada + " - " + empleado.horario_salida);

    //Request ---->
    RequestPOST("/API/empresas360/estadisticos_horario_empleados", {
        id360: empleado.id360
    }).then((response) => {
        //*console.log(response);
        if (response.success) {
            $("#base_modulo_VideoWallEmpleados #user_details_entrada").text(response.horario_entrada);
            $("#base_modulo_VideoWallEmpleados #user_details_pentrada").text(response.promedio_entrada);
            $("#base_modulo_VideoWallEmpleados #user_details_psalida").text(response.promedio_salida);
            $("#base_modulo_VideoWallEmpleados #user_details_desempeno").text(response.promedio_asistencia);
            $("#base_modulo_VideoWallEmpleados #user_details_retardos").text(response.despues_hora_inicio);
        }
    });



}

//funciones por socket para actualizar conexion en listado 
function actualizacion_listado_video_empleados(mensaje) {
    //*console.log("actualizacion_listado_video_empleados");
    //*console.log(mensaje);

    if (lista_video_empleados[mensaje.id_usuario]) {
        //cerrar sesion....
        if (lista_video_empleados[mensaje.id_usuario].sesion) {
            if (lista_video_empleados[mensaje.id_usuario].sesion !== null) {
                //*console.log("desconectando");
                lista_video_empleados[mensaje.id_usuario].sesion.disconnect();

            }
        }

    }
    video_empleado(mensaje);
}
//funcion para crear una nueva sesion 
function video_empleado(mensaje) {
    //*console.log("video_empleado");


    //Revisar si nos encontramos en la vista de videowall para iniciar 
    //iniciar la sesion de opentok 
    lista_video_empleados[mensaje.id_usuario] = {
        "data": mensaje,
        "sesion": initializeSession_vw(mensaje)
    };

}

function initializeSession_vw(data) {
    for (var i = 0; i < videowall_listado.empleados.length; i++) {
        if (videowall_listado.empleados[i].id360 === data.id_usuario) {
            addUserBox(videowall_listado.empleados[i]);
            break;
        }
    }
    //*console.log("INICIANDO SESION *********-------------------");
    videowall_conectados++;
    $("#base_modulo_VideoWallEmpleados .empleados_conectados").text(
            videowall_conectados + "/" + $("#base_modulo_VideoWallEmpleados .empleados_laborando").text());
    var StreamCount = 0;
    let session = OT.initSession(data.apikey, data.idsesion);
    var subscriber;

    //*console.log("initializeSession_vw");
    session.on({
        connectionCreated: function (event) {
            //*console.log("connectionCreated:");
            //*console.log(event);

        },
        connectionDestroyed: function (event) {
            //*console.log("connectionDestroyed:");
            //*console.log(event);

        },
        sessionConnected: function (event) {
            //*console.log("sessionConnected:");
            //*console.log(event);
        },
        sessionDisconnected: function (event) {
            //*console.log("sessionDisconnected:");
            //*console.log(event);
            videowall_conectados--;
            $("#base_modulo_VideoWallEmpleados .empleados_conectados").text(
                    videowall_conectados + "/" + $("#base_modulo_VideoWallEmpleados .empleados_laborando").text());
            //mosaico_target("remover", "videos_empleados");

        },
        sessionReconnected: function (event) {
            //*console.log("sessionReconnected:");
            //*console.log(event);
        },
        sessionReconnecting: function (event) {
            //*console.log("sessionReconnecting:");
            //*console.log(event);
        },
        streamCreated: function (event) {
            //*console.log("streamCreated:");
            //*console.log(event);
            //subscriber = agregarVideo_target(session, event.stream, "videos_empleados");
            StreamCount++;
            var subscriberOptions = {
                insertMode: 'replace',
                fitMode: "contain"
            };

            let pos = "vw_video" + event.stream.id;
            if (!$("#videos_empleados #vw_" + data.id_usuario).length) {
                let container_user = $("<div></div>").addClass("");
                container_user.attr("id", "vw_" + data.id_usuario);
                $("#videos_empleados").append(container_user);
            }
            if (!$("#videos_empleados #vw_" + data.id_usuario + "#vw_video" + event.stream.id).length) {
                let container_video = $("<div></div>").addClass("col-12 col-sm-6 col-md-3 col-lg-2");
                container_video.attr("id", "vw_video" + event.stream.id);
                if (event.stream.videoType === "camera") {
                    container_video.insertBefore($("#videos_empleados #vw_" + data.id_usuario));
                } else {
                    container_video.insertAfter($("#videos_empleados #vw_" + data.id_usuario));
                }
                container_video.click(() => {
                    $(".avada_kedavra").removeClass("avada_kedavra");
                    $("#base_modulo_VideoWallEmpleados .user_datails p svg").click();
                    container_video.toggleClass("video_big");
                    //*console.log("Buscar en panel:");
                    //*console.log($("#user_box_" + data.id_usuario));

                    $("#user_box_" + data.id_usuario).addClass("avada_kedavra");

                    $("#user_box_" + data.id_usuario)[0].scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                    setTimeout(() => {
                        $("#" + pos).addClass("avada_kedavra");
                    }, 200);
                });

            }
            $("#user_box_" + data.id_usuario).click(() => {
                //*console.log($("#" + pos));

                $(".avada_kedavra").removeClass("avada_kedavra");
                $("#user_box_" + data.id_usuario).addClass("avada_kedavra");
                $("#" + pos).addClass("avada_kedavra");
                $("#" + pos)[0].scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });

            let subscribed = false;
            let subscriber;
            //*console.log(videowall_started);
            if (videowall_started) {
                //*console.log("subscribiendo video");
                subscriber = session.subscribe(event.stream, pos, subscriberOptions, function callback(error) {
                    if (error)
                    {
                        console.error('There was an error publishing: ', error.name, error.message);
                    } else {
                        subscribed = true;
                    }
                });
            }


            $("div[id^='menu_section_']").click((e) => {

                if (e.target.id === "menu_section_VideoWallEmpleados") {
                    //revisar que no nos encontremo ya en la vista
                    if (!subscribed) {
                        //*console.log("subscribiendo video");
                        subscriber = session.subscribe(event.stream, pos, subscriberOptions, function callback(error) {
                            if (error)
                            {
                                console.error('There was an error publishing: ', error.name, error.message);
                            } else {
                                subscribed = true;
                            }
                        });
                    } else {
                        //*console.log("Habilitando video");
                        subscriber.subscribeToVideo(true);
                    }
                } else {
                    //session.unsubscribe(subscriber);
                    if (subscribed) {
                        //*console.log("deteniendo video");
                        subscriber.subscribeToVideo(false);
                        //session.unsubscribe(subscriber);
                        //subscribed = false;
                    }
                }

            });





        },
        streamDestroyed: function (event) {
            //*console.log("streamDestroyed:");
            //*console.log(event);
            StreamCount--;
            if (StreamCount === 0) {
                //*console.log("CERRANDO SESSION ************************");
                session.disconnect();
//                mosaico_target("remover","videos_empleados");
            }
            /*Cambios fernando*/
            mosaico_target("remover", "videos_empleados");
        },
        signal: function (event) {

            //*console.log("signal");
            //*console.log(event);

        }

    });

    // Connect to the session
    session.connect(data.token, function callback(error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (!error) {
//
//                              // Initialize the publisher
//                              var publisherOptions = {
//                                    insertMode: 'replace',
//                                    width: '100%',
//                                    height: '100%',
//                                    name: empleado.nombre,
//                                    publishVideo: true
//                              };
//                              var pos = "subscriber";
//                              var publisher = OT.initPublisher(pos, publisherOptions, function initCallback(initErr) {
//
//                                    if (initErr) {
//                                          console.error('There was an error initializing the publisher: ', initErr.name, initErr.message);
//                                          //notificarError(initErr.message);
//                                          return;
//                                    } else {
//                                          //*console.log("Registrar conexion");
//                                          //*console.log(empleado);
//                                          $("#nom").val(empleado.nombre + " " + empleado.apellidos);
//                                          $("#num").val(empleado.idUsuario_Sys);
//                                          RegistroInicio().then(function (response) {
//                                                empleado.fecha_ingreso = response.fecha_ingreso;
//                                                empleado.hora_ingreso = response.hora_ingreso;
//                                                empleado.id_registro = response.id;
//                                                //*console.log(empleado);
//                                                $("#ing").val(empleado.fecha_ingreso + " " + empleado.hora_ingreso);
//
//                                                //enviar credenciales 
//                                                Credenciales.empleado = empleado;
//
//                                                EnviarMensajePorSocket(Credenciales);
//
//                                                $("#guardarreporte").click(function () {
//                                                      //*console.log("guardarreporte");
//                                                      //*console.log(empleado.id_registro);
//                                                      RegistroReporte().then(function (response) {
//                                                            //*console.log(response);
//                                                            Toast.fire({
//                                                                  title: response.mensaje,
//                                                                  timer: 3000
//                                                            });
//                                                      });
//                                                });
//                                                $("#cerrarsesion").click(function () {
//                                                      //*console.log("cerrarsesion");
//
//                                                      Registrofin().then(function (response) {
//                                                            //*console.log(response);
//                                                            Toast.fire({
//                                                                  title: "Tu jornada laboral comenzo a la hora: " + empleado.hora_ingreso + " y esta finalizando a la hora: " + response.hora,
//                                                                  timer: 5000
//                                                            }).then(function () {
//                                                                  $("#closeSession").click();
//                                                            });
//
//                                                      });
//
//                                                });
//                                          });
//
//
//                                    }
//                              });
//
//                              // If the connection is successful, publish the publisher to the session
//                              session.publish(publisher, function publishCallback(publishErr) {
//                                    if (publishErr) {
//                                          console.error('There was an error publishing: ', publishErr.name, publishErr.message);
//                                    } else {
//
//
//                                          //////////Solicitar Cambio de camara  ******
//                                          var activarVideo = document.createElement("input");
//                                          activarVideo.className = "activarVideoPublisher";
//                                          activarVideo.value = "";
//                                          activarVideo.addEventListener("click", function () {
//
//                                                publisher.publishVideo(!publisher.stream.hasVideo);
//                                          });
//                                          document.getElementById(pos).appendChild(activarVideo);
//
//
//                                    }
//                              });
//                        
        } else {
            console.error('There was an error connecting to the session: ', error.name, error.message);
        }
    });



    return session;
}
//detectar cuando la vista se comienza a ver - change de la clase 

//detectar cuando la vista se deja de ver - change de la clase 

//funcion para realizar las conexiones de el listado de usuarios

//funcion para desconectar los videos por inactividad de visivilidad 





