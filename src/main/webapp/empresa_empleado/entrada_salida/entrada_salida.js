/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
let entrada_salida_clock = () => {
    let date = new Date();
    let hrs = date.getHours();
    let mins = date.getMinutes();
    let secs = date.getSeconds();
    let period = "AM";
    if (hrs === 0) {
        hrs = 12;
    } else if (hrs > 12) {
        hrs = hrs - 12;
        period = "PM";
    } else if (hrs === 12) {
        period = "PM";
    }
    hrs = hrs < 10 ? "0" + hrs : hrs;
    mins = mins < 10 ? "0" + mins : mins;
    secs = secs < 10 ? "0" + secs : secs;

    let time = `${hrs}:${mins}:${secs}:${period}`;
    document.getElementById("entrada_salida_clock").innerText = time;
    setTimeout(entrada_salida_clock, 1000);
};
let interval_tiempo_jornada_clock = null;
let tiempo_jornada_clock = (b) => {
    if (interval_tiempo_jornada_clock !== null) {
        clearInterval(interval_tiempo_jornada_clock);
    }
    let horas = "0";
    let minutos = "0";
    let segundos = "0";
    let hrs = parseInt(horas);
    let mins = parseInt(minutos);
    let secs = parseInt(segundos);

    if (secs >= 60) {
        mins++;
        secs = 0;
    }
    if (mins >= 60) {
        hrs++;
        mins = 0;
    }
    horas = hrs < 10 ? "0" + hrs : hrs;
    minutos = mins < 10 ? "0" + mins : mins;
    segundos = secs < 10 ? "0" + secs : secs;
    let time = `${horas}:${minutos}:${segundos}`;
    document.getElementById("tiempo_jornada_clock").innerText = time;

    if (b) {
        interval_tiempo_jornada_clock = setInterval(() => {
            secs++;
            if (secs >= 60) {
                mins++;
                secs = 0;
            }
            if (mins >= 60) {
                hrs++;
                mins = 0;
            }
            horas = hrs < 10 ? "0" + hrs : hrs;
            minutos = mins < 10 ? "0" + mins : mins;
            segundos = secs < 10 ? "0" + secs : secs;
            let time = `${horas}:${minutos}:${segundos}`;
            document.getElementById("tiempo_jornada_clock").innerText = time;
        }, 1000);
    }
};
let estatus_jornada_laboral = (estatus_jornada) => {
    console.log("estatus_jornada_laboral:" + estatus_jornada);
    //botones
    $(".iniciar_jornada").addClass("d-none");
    $(".pausar_jornada").addClass("d-none");
    $(".reanudar_jornada").addClass("d-none");
    $(".finalizar_jornada").addClass("d-none");

    //caminante
    $(".state_walking_1").addClass("d-none");
    $(".state_walking_2").addClass("d-none");
    $(".state_walking_3").addClass("d-none");
    $(".state_walking_4").addClass("d-none");

    //barras
    $(".progress-bar1").removeClass("w-100");
    $(".progress-bar2").removeClass("w-100");
    $(".progress-bar3").removeClass("w-100");


    if (estatus_jornada === "iniciada") {
        $(".pausar_jornada").removeClass("d-none");
        $(".state_walking_2").removeClass("d-none");
        $(".progress-bar1").addClass("w-100");
        $(".pausar_jornada").attr("disabled", false);
        $("#home_empleado_estatus_descanso").addClass("d-none");
        $("#home_empleado_estatus_activo").removeClass("d-none");
    } else if (estatus_jornada === "pausada") {
        $(".reanudar_jornada").removeClass("d-none");
        $(".state_walking_3").removeClass("d-none");
        $(".progress-bar1").addClass("w-100");
        $(".progress-bar2").addClass("w-100");
        $("reanudar_jornada").attr("disabled", false);
        $("#home_empleado_estatus_descanso").removeClass("d-none");
        $("#home_empleado_estatus_activo").addClass("d-none");
    } else if (estatus_jornada === "reanudada") {
        $(".finalizar_jornada").removeClass("d-none");
        $(".state_walking_4").removeClass("d-none");
        $(".progress-bar1").addClass("w-100");
        $(".progress-bar2").addClass("w-100");
        $(".progress-bar3").addClass("w-100");
        $(".finalizar_jornada").attr("disabled", false);
        $("#home_empleado_estatus_descanso").addClass("d-none");
        $("#home_empleado_estatus_activo").removeClass("d-none");
    } else if (estatus_jornada === "finalizada") {
        $(".iniciar_jornada").removeClass("d-none");
        $(".state_walking_1").removeClass("d-none");
        $(".iniciar_jornada").attr("disabled", false);
        $("#home_empleado_estatus_descanso").removeClass("d-none");
        $("#home_empleado_estatus_activo").addClass("d-none");
    }
};

const initJornadaLaboral = (aumenta) => {
    $("#mensaje-cargando-proceso").removeClass("d-none");
    GenerarCredenciales().then(function (response) {
        console.log(response);
        Credenciales = response;
        initializeSessionEmpleado(response, aumenta);
    });
};

function initializeSessionEmpleado(data, aumenta) {
    console.log("initializeSessionEmpleado");

    if (sesion_jornada_laboral !== null) {
        sesion_jornada_laboral.disconnect();
        sesion_jornada_laboral = null
    }
    sesion_jornada_laboral = OT.initSession(data.apikey, data.idsesion);

    sesion_jornada_laboral.on({
        connectionCreated: function (event) {
            console.log("connectionCreated:");
            console.log(event);
        },
        connectionDestroyed: function (event) {
            console.log("connectionDestroyed:");
            console.log(event);
        },
        sessionConnected: function (event) {
            console.log("sessionConnected:");
            console.log(event);
        },
        sessionDisconnected: function (event) {
            console.log("sessionDisconnected:");
            console.log(event);

        },
        sessionReconnected: function (event) {
            console.log("sessionReconnected:");
            console.log(event);
        },
        sessionReconnecting: function (event) {
            console.log("sessionReconnecting:");
            console.log(event);
        },
        streamCreated: function (event) {
            console.log("streamCreated:");
            console.log(event);

        },
        streamDestroyed: function (event) {
            console.log("streamDestroyed:");
            console.log(event);
        },
        signal: function (event) {

            console.log("signal");
            console.log(event);

        }

    });

    // Connect to the session
    sesion_jornada_laboral.connect(data.token, function callback(error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (!error) {
            //Iniciar publicador de pantalla 
            console.log("initializeSessionEmpleado connect");
            let share_screen = document.createElement("div");
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
                        if (!$("#conectado_jornada_laboral").length) {
                            //preparar espacio para nuevo video 
                            document.getElementById("video_drag").innerHTML += '<div id="conectado_jornada_laboral" style="min-height: 150px; min-width: 150px; width: 100%; height: 100%; overflow: hidden;"></div>';
                        }
                        var pos = "conectado_jornada_laboral";
                        var publisher_screen = OT.initPublisher(pos,
                                {videoSource: 'screen',
                                    insertMode: 'append',
                                    width: '100%'},
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
                                            sesion_jornada_laboral.unpublish(publisher_screen);
                                            share_screen.className = "col-4";
                                            stop_share.className = "col-4 d-none";
                                        });
                                        document.getElementById("video_drag_footer").appendChild(stop_share);
                                        share_screen.className = "col-4 d-none";
                                        //$("#maximizarVideo").click();
                                        sesion_jornada_laboral.publish(publisher_screen, function (error) {
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
                            //mosaico("remover");
                        });
                    }
                });
            });
            // Initialize the publisher de video
            var publisherOptions = {
                insertMode: 'append',
                width: '100%',
                name: $(".nombre_completo")[0].innerHTML,
                publishVideo: true,
                publishAudio: false
            };
            if (!$("#conectado_jornada_laboral").length) {
                //preparar espacio para nuevo video 
                document.getElementById("video_drag").innerHTML += '<div id="conectado_jornada_laboral" style="min-height: 150px; min-width: 150px; width: 100%; height: 100%; overflow: hidden;"></div>';
            }
            var pos = "conectado_jornada_laboral";
            var publisher = OT.initPublisher(pos, publisherOptions, function initCallback(initErr) {

                if (initErr) {
                    console.error('There was an error initializing the publisher: ', initErr.name, initErr.message);
                    //notificarError(initErr.message);
                    return;
                } else {
                    console.log("initializeSessionEmpleado initPublisher");
                    $("#video_drag").removeClass("d-none");
                    $("#iniciar_jornada_laboral").addClass("d-none");
                    $("#rep").css({"min-height": "150px"});
                    $("#rep").removeAttr("disabled");
                    $("#mensaje-cargando-proceso").addClass("d-none");
//                    $("#guardarreporte").removeClass("d-none");
                    // Make the DIV element draggable:
                    dragElement(document.getElementById("video_drag"));
                    console.log("Registrar conexion");
                    //console.log(empleado);
                    /*$("#nom").val(empleado.nombre + " " + empleado.apellidos);
                     $("#num").val(empleado.idUsuario_Sys);*/
                    let aumentaInt = aumenta ? 1 : 0;
                    let j = {
                        "id360": sesion_cookie.id_usuario,
                        "tipo_usuario": sesion_cookie.tipo_usuario,
                        "tipo_servicio": sesion_cookie.tipo_servicio,
                        "tipo_area": sesion_cookie.tipo_area,
                        "apikey": data.apikey,
                        "idsesion": data.idsesion,
                        "token": data.token,
                        "id_socket": idSocketOperador,
                        "web": true

                    };
                    if (location_user !== null) {
                        j.lat = location_user.latitude.toFixed(7);
                        j.lng = location_user.longitude.toFixed(7);
                    }


                    RequestPOST("/API/empresas360/registro/inicio_jornada_laboral", j).then(function (response) {
                        tiempo_jornada_clock(true);

                        $("#entrada_salida_lottieLoader").parent().remove();
                        if (response.success) {

                            if (jornada_usuario.estatus_jornada === "iniciada") {
                                estatus_jornada_laboral("iniciada");
                            } else if (jornada_usuario.estatus_jornada === "pausada") {
                                estatus_jornada_laboral("reanudada");
                            } else if (jornada_usuario.estatus_jornada === "reanudada") {
                                estatus_jornada_laboral("reanudada");
                            } else if (jornada_usuario.estatus_jornada === "finalizada") {
                                estatus_jornada_laboral("iniciada");
                            }

                            //servicio para enviar estatus de conexion cada t
                            registro_jornada_laboral = setInterval(() => {
                                RequestPOST("/API/empresas360/registro/inicio_jornada_laboral", j);
                            }, 1800000);//cada 30 mins

                            //revisar que el modulo de reporte este cargado 
                            if ($(".reporte_actividades").length) {
                                jornada_usuario.success = true;
                                jornada_usuario.failure = false;
                                jornada_usuario.id_jornada = response.id;
                                jornada_usuario.hora_inicio_jornada = response.time_created;
                                horario_entrada_reporte_trabajo();
                            }

                        }
                        swal.fire({
                            title: "Mensaje",
                            text: response.mensaje
                        });
                    });
                }
            });
            // If the connection is successful, publish the publisher to the session
            sesion_jornada_laboral.publish(publisher, function publishCallback(publishErr) {
                if (publishErr) {

                    //
                    console.error('There was an error publishing: ', publishErr.name, publishErr.message);
                    swal.fire({
                        text: "Revisa que tengas conectada una camara web con microfono y que no este siendo ocupada por otra aplicacion."
                    });
                    //Quitar animacion de lottie
                    $("#entrada_salida_lottieLoader").parent().remove();

                } else {

                    console.log("initializeSessionEmpleado publish");
                    //////////Solicitar Cambio de camara  ******
//                    var activarVideo = document.createElement("input");
//                    activarVideo.className = "activarVideoPublisher";
//                    activarVideo.value = "";
//                    activarVideo.addEventListener("click", function () {
//
//                        publisher.publishVideo(!publisher.stream.hasVideo);
//                    });
//                    document.getElementById(pos).appendChild(activarVideo);

                    let activarVideo = document.createElement("div");
                    activarVideo.className = "col-4";
                    activarVideo.id = "stop_sharePublisher";
                    activarVideo.style = "justify-content:center;align-items:center;display:flex;font:2rem Arial;color:red;cursor:pointer;border-right:solid 1px #6c757d;";
                    activarVideo.innerHTML = '<i class="fas fa-video-slash"></i>';
                    activarVideo.addEventListener("click", function () {
                        if (publisher.stream.hasVideo) {

                            activarVideo.innerHTML = '<i class="fas fa-video"></i>';
                            let data = {
                                "id_usuario": sesion_cookie.id_usuario,
                                "fecha": getFecha(),
                                "hora": getHora()
                            };
                            RequestPOST("/API/empresas360/registro/horario_laboral_aumenta_desconexion", data).then((response) => {
                                console.log(response);
                            });
                        } else {
                            activarVideo.innerHTML = '<i class="fas fa-video-slash"></i>';
                        }
                        publisher.publishVideo(!publisher.stream.hasVideo);
                    });
                    ////
                    let push_to_talk = document.createElement("div");
                    push_to_talk.className = "col-4";
                    push_to_talk.id = "push_to_talk";
                    push_to_talk.style = "justify-content:center;align-items:center;display:flex;font:2rem Arial;cursor:pointer;";
                    push_to_talk.innerHTML = '<i class="fas fa-microphone-slash"></i>';
                    var pressTimer = 0;
                    let interval_press_timer;
                    document.getElementById("video_drag_footer").appendChild(activarVideo);
                    document.getElementById("video_drag_footer").appendChild(share_screen);
                    document.getElementById("video_drag_footer").appendChild(push_to_talk);
                    let tooltip = document.querySelector('#tooltip');
                    let popperInstance = null;
                    $("#push_to_talk").mouseup(function () {
                        //detener audio
                        publisher.publishAudio(false);
                        //detener animacion
                        push_to_talk.innerHTML = '<i class="fas fa-microphone-slash"></i>';
                        push_to_talk.style = "justify-content:center;align-items:center;display:flex;font:2rem Arial;cursor:pointer;";
                        console.log(pressTimer);
                        if (pressTimer < 2) {
                            //alerta con popper
                            if (popperInstance !== null) {
                                popperInstance.destroy();
                            }
                            popperInstance = null;
                            tooltip.setAttribute('data-show', '');
                            popperInstance = Popper.createPopper(push_to_talk, tooltip, {
                                placement: 'auto',
                                modifiers: [
                                    {
                                        allowedAutoPlacements: ['top', 'bottom', 'right'],
                                        name: 'flip',
                                        options: {
                                            offset: [0, 8],
                                        },
                                    },
                                ],
                            });
                            setTimeout(() => {
                                if (popperInstance !== null) {
                                    popperInstance.destroy();
                                }
                                popperInstance = null;
                            }, 3000);
                        }


                        clearInterval(interval_press_timer);
                        pressTimer = 0;
                        return true;
                    });
                    $("#push_to_talk").mousedown(function () {
                        // iniciar audio
                        console.log("microphone...");
                        publisher.publishAudio(true);
                        //iniciar animacion
                        push_to_talk.innerHTML = '<i class="fas fa-microphone"></i>';
                        push_to_talk.style = "justify-content:center;align-items:center;display:flex;font:2rem Arial;cursor:pointer;background: #0097a9;border-radius: 5px;padding: 5px;width: 30px;height: 30px;";
                        //count press_timer
                        interval_press_timer = setInterval(() => {
                            pressTimer += 0.5;
                        }, 500);
                        return true;
                    });
                    //Espacio para contestar audio 


                }
            });
        } else {
            console.error('There was an error connecting to the session: ', error.name, error.message);
        }
    });
    console.log("fin***");
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "_header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "_header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        if ((elmnt.offsetTop - pos2) < 0) {
            elmnt.style.top = "0px";
        } else if ((elmnt.offsetTop - pos2) > $("body").height()) {
            elmnt.style.top = ($("body").height() - $("#video_drag").height()) + "px";
        }
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        if ((elmnt.offsetLeft - pos1) < 0) {
            elmnt.style.left = "0px";
        } else if ((elmnt.offsetLeft - pos1) > $("body").width()) {
            elmnt.style.left = ($("body").width() - $("#video_drag").width()) + "px";
        }
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function convertDateFormat(string) {
    return string.split('-').reverse().join('/');
}

function formatDateDefault(date) {
    let dia = date.getDate().toString();
    if (dia.length === 1)
        dia = "0" + dia;
    return dateParse = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + dia;
}

const consulta_historial_entrada_salida = (fecha_inicio, fecha_final) => {

    const nombresDiasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    let data = new Object();
    data.inicio = fecha_inicio;
    data.fin = fecha_final;
    data.id = sesion_cookie.id_usuario;

    RequestPOST("/API/empresas360/jornadas_laborales", data).then((response) => {


        $("#sin-resultados-jornadas").addClass("d-none");
        $("#con-resultados-jornadas").removeClass("d-none");

        const cuerpoTabla = $("#cuerpo-tabla-jornadas");
        const cuerpoTablaExcel = $("#resultados-exportar-excel");
        cuerpoTabla.empty();
        cuerpoTablaExcel.empty();
        cuerpoTablaExcel.append(cabeceraReporteExcel_entrada_salida());

        let jornadas = response.data;
        let cantidadJornadas = jornadas.length;


        let tbody = '';
        let tbodyExcel = '';

        let f1 = new Date(fecha_inicio);
        f1.setDate(f1.getDate() + 1);

        let f2;
        if (fecha_final === "")
            f2 = f1;
        else {
            f2 = new Date(fecha_final);
            f2.setDate(f2.getDate() + 1);
        }

        while (f1.getTime() <= f2.getTime()) {

            let fechaRecorre = formatDateDefault(f1);
            let banderaAgregado = false;

            for (let x = 0; x < cantidadJornadas; x++)
                if (jornadas[x].date_created === fechaRecorre) {

                    let jornada = jornadas[x];
                    let ff = new Date(jornada.date_created);
                    console.log(ff.getDay());

                    tbody += '<tr class="control" style="cursor: pointer;">';
                    tbody += '  <td>' + nombresDiasSemana[ff.getDay() + 1] + '</td>';
                    tbody += '  <td>' + jornada.date_created + '</td>';
                    tbody += '  <td>' + jornada.time_created + '</td>';
                    tbody += '  <td>' + jornada.time_updated + '</td>';
                    tbody += '</tr>';

                    tbodyExcel += '<tr>';
                    tbodyExcel += '  <td>' + nombresDiasSemana[ff.getDay() + 1] + '</td>';
                    tbodyExcel += '  <td>' + jornada.date_created + '</td>';
                    tbodyExcel += '  <td>' + jornada.time_created + '</td>';
                    tbodyExcel += '  <td>' + jornada.time_updated + '</td>';
                    tbodyExcel += '  <td>' + jornada.reporte + '</td>';
                    tbodyExcel += '</tr>';

                    tbody += '<tr class="oculta" style="display: none;">';
                    tbody += '  <td style="background-color: lightgray; padding: 15px !important;" class="text-center p-2" colspan="4">' + jornada.reporte + '</td>';
                    tbody += '</tr>';

                    banderaAgregado = true;
                    break;

                }

            if (!banderaAgregado) {
                tbody += '<tr>';
                tbody += '  <td>' + nombresDiasSemana[f1.getDay()] + '</td>';
                tbody += '  <td>' + fechaRecorre + '</td>';
                tbody += '  <td>-- : -- : --</td>';
                tbody += '  <td>-- : -- : --</td>';
                tbody += '</tr>';

                tbodyExcel += '<tr>';
                tbodyExcel += '  <td>' + nombresDiasSemana[f1.getDay()] + '</td>';
                tbodyExcel += '  <td>' + fechaRecorre + '</td>';
                tbodyExcel += '  <td>-- : -- : --</td>';
                tbodyExcel += '  <td>-- : -- : --</td>';
                tbodyExcel += '  <td>-- : -- : --</td>';
                tbodyExcel += '</tr>';
            }

            f1.setDate(f1.getDate() + 1);
        }

        cuerpoTabla.append(tbody);
        cuerpoTablaExcel.append(tbodyExcel);
        $("#botonDescargaReporteJornada").removeClass("d-none");

        $("#cuerpo-tabla-jornadas tr.control").click(function () {
            let nextTr = $(this).next();
            if (nextTr.hasClass("oculta")) {
                $("#cuerpo-tabla-jornadas tr.visible").each(function (index, tr) {
                    $(tr).addClass("oculta").removeClass("visible");
                    $(tr).hide("fast");
                });
                nextTr.addClass("visible").removeClass("oculta");
                nextTr.show("fast");
            } else {
                nextTr.addClass("oculta").removeClass("visible");
                nextTr.hide("fast");
            }
        });

        $("#resultado-busqueda-jornadas").removeClass("d-none");

    });

};
const cabeceraReporteExcel_entrada_salida = () => {
    let cabecera = '';
    cabecera += '<tr><td colspan="5"><h1 style="text-align: center;">Reporte de jornadas laborales</h1></td></tr><tr></tr>';
    cabecera += '<tr><td>Fecha de exportación</td><td id="fecha_exportacion_excel"></td></tr>';
    cabecera += '<tr><td>Periodo del reporte</td><td id="fecha_inicio_excel"></td><td id="fecha_fin_excel"></td></tr><tr></tr>';
    cabecera += '<tr><td>Empleado:</td><td colspan="3" id="nombre_empleado_excel"></td></tr>';
    cabecera += '<tr><td>Empresa</td><td colspan="3" id="nombre_empresa_excel"></td></tr>';
    cabecera += '<tr><td>Sucursal</td><td colspan="3" id="nombre_sucursal_excel"></td></tr>';
    cabecera += '<tr><td>Área</td><td colspan="3" id="nombre_area_excel"></td></tr>';
    cabecera += '<tr><td>Puesto</td><td colspan="3" id="nombre_puesto_excel"></td></tr>';
    cabecera += '<tr><td>Número de empleado</td><td id="numero_empleado_excel"></td></tr>';
    cabecera += '<tr><td>Jornada</td><td>Entrada: <span id="hora_entrada_excel"></span></td><td>Salida: <span id="hora_salida_excel"></span></td></tr>';
    cabecera += '<tr><th>Día</th><th>Fecha</th><th>Hora Entrada</th><th>Hora Salida</th></tr><tr></tr><tr></tr>';
    return cabecera;
};

var sesion_jornada_laboral = null;
const init_entrada_salida = (json) => {
    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;
    let registro_jornada_laboral = null; // Intervalo de envio de registro de jornada laboral finalizar al pausar o finalizar la jornada
    if (location_user !== null) {
        if (location_user.municipio !== null) {
            $("#entrada_salida_municipio").text(" " + location_user.municipio);
            $("#entrada_salida_municipio").text(" " + location_user.colonia);
        }
        if (location_user.estado !== null) {
            $("#entrada_salida_estado").text(" - " + location_user.estado_long);
        }
    }


    entrada_salida_clock();

    //tiempo_jornada_clock(false);
    clearInterval(interval_tiempo_jornada_clock);

//entrada_salida_nombre_empleado


    if (perfil_usuario.nombre !== "" && perfil_usuario.nombre !== undefined && perfil_usuario.nombre !== "null" && perfil_usuario.nombre !== null) {
        $(".entrada_salida_nombre_empleado").text(perfil_usuario.nombre);
        $(".nombre_completo").text(perfil_usuario.nombre);
    }
    if (perfil_usuario.apellido_paterno !== "" && perfil_usuario.apellido_paterno !== undefined && perfil_usuario.apellido_paterno !== "null" && perfil_usuario.apellido_paterno !== null) {
        $(".entrada_salida_nombre_empleado").text($(".nombre_completo")[0].innerHTML + " " + perfil_usuario.apellido_paterno);
        $(".nombre_completo").text($(".nombre_completo")[0].innerHTML + " " + perfil_usuario.apellido_paterno);
    }
    if (perfil_usuario.apellido_materno !== "" && perfil_usuario.apellido_materno !== undefined && perfil_usuario.apellido_materno !== "null" && perfil_usuario.apellido_materno !== null) {
        $(".entrada_salida_nombre_empleado").text($(".nombre_completo")[0].innerHTML + " " + perfil_usuario.apellido_materno);
        $(".nombre_completo").text($(".nombre_completo")[0].innerHTML + " " + perfil_usuario.apellido_materno);
    }

    $("#entrada_salida_empleado_img").css({
        "background-image": "url(" + perfil_usuario.img + ")",
        "background-size": "contain",
        "background-position": "center",
        "background-repeat": "no-repeat"
    });

    $("#entrada_salida_puesto").val(perfil_usuario.puesto);
    $("#entrada_salida_numero_empleado").val(perfil_usuario.num_empleado);


    let mi_sucursal_entrada_salida = null;
    for (var i = 0; i < sucursales_usuario.length; i++) {
        if (tipo_servicio === sucursales_usuario[i].id) {
            mi_sucursal_entrada_salida = sucursales_usuario[i];
            break;
        }
    }
    if (mi_sucursal_entrada_salida !== null) {
        $("#entrada_salida_logo").css({
            "background-image": "url(" + mi_sucursal_entrada_salida.logotipo + ")",
            "background-size": "contain",
            "background-position": "center",
            "background-repeat": "no-repeat",
            "width": "100%",
            "height": "100%"
        });
    }



    if (jornada_usuario.estatus_jornada === "finalizada") {
        estatus_jornada_laboral("finalizada");
    } else {
        estatus_jornada_laboral("pausada");
    }

//accion para iniciar jornad laboral
    $("#entrada_salida_iniciar_jornada").click(() => {
        $(".iniciar_jornada").attr("disabled", true);
        $(".pausar_jornada").attr("disabled", true);
        $("reanudar_jornada").attr("disabled", true);
        $(".finalizar_jornada").attr("disabled", true);
        if (registro_jornada_laboral != null) {
            clearInterval(registro_jornada_laboral);
            registro_jornada_laboral = null;
        }

        var div = document.createElement("div");
        div.style = "position:absolute;width:100%;height:100%;background:#49505740;top:0;left:0;overflow:hidden;padding: 25%;";
        var entrada_salida_lottieLoader = document.createElement("div");
        entrada_salida_lottieLoader.id = "entrada_salida_lottieLoader";
        var contenedor = document.getElementsByClassName("entrada_salida")[0].parentElement;
        div.appendChild(entrada_salida_lottieLoader);
        contenedor.appendChild(div);

        var entrada_salida_lottieAnimation = bodymovin.loadAnimation({
            container: entrada_salida_lottieLoader, // ID del div
            path: "https://empresas.claro360.com/p360_v4_dev_moises/json/loading_lottie.json", // Ruta fichero .json de la animación
            renderer: 'svg', // Requerido
            loop: true, // Opcional
            autoplay: true, // Opcional
            name: "loading lottie" // Opcional
        });

        initJornadaLaboral(false);

    });

//accion para pausar jornad laboral
    $("#entrada_salida_pausar_jornada").click(() => {
        $(".iniciar_jornada").attr("disabled", true);
        $(".pausar_jornada").attr("disabled", true);
        $("reanudar_jornada").attr("disabled", true);
        $(".finalizar_jornada").attr("disabled", true);
        if (registro_jornada_laboral != null) {
            clearInterval(registro_jornada_laboral);
            registro_jornada_laboral = null;
        }
        //Servicio para registrar el inicio del descanso
        let j = {
            "id360": id_usuario,
            "tipo_usuario": tipo_usuario,
            "tipo_servicio": tipo_servicio,
            "tipo_area": tipo_area,
            "web": true
        };
        RequestPOST("/API/empresas360/registro/horario_laboral_pausa", j).then((response) => {
            swal.fire({
                title: "Mensaje",
                text: response.mensaje
            });
            if (response.success) {
                //cambiar estado de estatus_jornada
                jornada_usuario.estatus_jornada = "pausada";
                //detener video
                if (sesion_jornada_laboral !== null) {
                    sesion_jornada_laboral.disconnect();
                    sesion_jornada_laboral = null;
                }

                //ocultar ventana de video 
                $("#video_drag").addClass("d-none");
                $("#conectado_jornada_laboral").empty();
                $("#video_drag_footer").empty();
                //cambiar el estado de la barra de progreso
                estatus_jornada_laboral("pausada");
                if (interval_tiempo_jornada_clock !== null) {
                    clearInterval(interval_tiempo_jornada_clock);
                }
            } else {
                //reactivar barra de progreso
                estatus_jornada_laboral("finalizada");
            }
        });

    });
//accion para reanudar jornad laboral
    $("#entrada_salida_reanudar_jornada").click(() => {
        $(".iniciar_jornada").attr("disabled", true);
        $(".pausar_jornada").attr("disabled", true);
        $("reanudar_jornada").attr("disabled", true);
        $(".finalizar_jornada").attr("disabled", true);
        if (registro_jornada_laboral != null) {
            clearInterval(registro_jornada_laboral);
            registro_jornada_laboral = null;
        }

        //Servicio para registrar el final del descanso
        let j = {
            "id360": id_usuario,
            "tipo_usuario": tipo_usuario,
            "tipo_servicio": tipo_servicio,
            "tipo_area": tipo_area,
            "web": true
        };
        RequestPOST("/API/empresas360/registro/horario_laboral_reinicio", j).then((response) => {

            if (response.success) {
                //cambiar estado de estatus_jornada
                jornada_usuario.estatus_jornada = "reanudada";
                //detener video
                if (sesion_jornada_laboral !== null) {
                    sesion_jornada_laboral.disconnect();
                    sesion_jornada_laboral = null;
                }
                //tiempo_jornada_clock(false);
                //clearInterval(interval_tiempo_jornada_clock);
                //ocultar ventana de video 
                $("#video_drag").addClass("d-none");
                $("#conectado_jornada_laboral").empty();
                $("#video_drag_footer").empty();
                //cambiar el estado de la barra de progreso
                estatus_jornada_laboral("pausada");

                var div = document.createElement("div");
                div.style = "position:absolute;width:100%;height:100%;background:#49505740;top:0;left:0;overflow:hidden;padding: 25%;";
                var entrada_salida_lottieLoader = document.createElement("div");
                entrada_salida_lottieLoader.id = "entrada_salida_lottieLoader";
                var contenedor = document.getElementsByClassName("entrada_salida")[0].parentElement;
                div.appendChild(entrada_salida_lottieLoader);
                contenedor.appendChild(div);

                var entrada_salida_lottieAnimation = bodymovin.loadAnimation({
                    container: entrada_salida_lottieLoader, // ID del div
                    path: "https://empresas.claro360.com/p360_v4_dev_moises/json/loading_lottie.json", // Ruta fichero .json de la animación
                    renderer: 'svg', // Requerido
                    loop: true, // Opcional
                    autoplay: true, // Opcional
                    name: "loading lottie" // Opcional
                });

                initJornadaLaboral(false);

            } else {
                //reactivar barra de progreso
                swal.fire({
                    title: "Mensaje",
                    text: response.mensaje
                });
                estatus_jornada_laboral("iniciada");
            }
        });



    });
//accion para finalizar jornad laboral
    $("#entrada_salida_finalizar_jornada").click(() => {


        $(".iniciar_jornada").attr("disabled", true);
        $(".pausar_jornada").attr("disabled", true);
        $("reanudar_jornada").attr("disabled", true);
        $(".finalizar_jornada").attr("disabled", true);
        if (registro_jornada_laboral != null) {
            clearInterval(registro_jornada_laboral);
            registro_jornada_laboral = null;
        }
        //Servicio para registrar el final del descanso
        let j = {
            "id360": id_usuario,
            "tipo_usuario": tipo_usuario,
            "tipo_servicio": tipo_servicio,
            "tipo_area": tipo_area,
            "web": true
        };
        RequestPOST("/API/empresas360/registro/horario_laboral_finalizar", j).then((response) => {
            swal.fire({
                title: "Mensaje",
                text: response.mensaje
            });
            if (response.success) {
                //cambiar estado de estatus_jornada
                jornada_usuario.estatus_jornada = "finalizada";
                //detener video
                if (sesion_jornada_laboral !== null) {
                    sesion_jornada_laboral.disconnect();
                    sesion_jornada_laboral = null;
                }
                //tiempo_jornada_clock(false);
                if (interval_tiempo_jornada_clock !== null) {
                    clearInterval(interval_tiempo_jornada_clock);
                }
                //ocultar ventana de video 
                $("#video_drag").addClass("d-none");
                $("#conectado_jornada_laboral").empty();
                $("#video_drag_footer").empty();
                //cambiar el estado de la barra de progreso
                estatus_jornada_laboral("finalizada");
            } else {
                //reactivar barra de progreso
                estatus_jornada_laboral("reanudada");
            }
        });

    });








    /* MóDULO DE REPORTING PARA LOS EMPLEADOS */
    let ocultoFin = false;

    $("#fecha_inicio_reporte").change(function () {
        const f2 = $("#fecha_fin_reporte");
        if (f2.val() === "")
            f2.val($(this).val());
    });

    $("#form_historia_jornadas").submit(function (e) {
        e.preventDefault();

        let fecha_inicio = $("#fecha_inicio_reporte").val();

        if (validarFecha(convertDateFormat(fecha_inicio))) {

            let fecha_fin = $("#fecha_fin_reporte").val();

            if (fecha_fin === "")
                consulta_historial_entrada_salida(fecha_inicio, "");
            else {
                if (validarFecha(convertDateFormat(fecha_fin))) {

                    let f1 = new Date(fecha_inicio);
                    let f2 = new Date(fecha_fin);

                    if (f2.getTime() >= f1.getTime())
                        consulta_historial_entrada_salida(fecha_inicio, fecha_fin);
                    else
                        swal.fire({text: "La fecha final debe ser mayor que la fecha inicial"});

                } else
                    swal.fire({text: "Ingresa una fecha final válida"});
            }

        } else
            swal.fire({text: "Ingresa una fecha inicial válida"});

    });




    $("#botonDescargaReporteJornada").click(function () {

        const dataUser = sesion_cookie;

        $("#fecha_exportacion_excel").text(formatDateDefault(new Date()));
        $("#fecha_inicio_excel").text($("#fecha_inicio_reporte").val());
        $("#fecha_fin_excel").text($("#fecha_fin_reporte").val());
        $("#nombre_empleado_excel").text(dataUser.nombre + " " + dataUser.apellidos);
        $("#nombre_empresa_excel").text($("#nombre_empresa").val());
        $("#nombre_sucursal_excel").text($("#nombre_sucursal").val());
        $("#nombre_area_excel").text($("#nombre_area").val());
        $("#nombre_puesto_excel").text($("#puesto").val());
        $("#numero_empleado_excel").text($("#num_empleado").val());
        $("#hora_entrada_excel").text($("#horario_entrada").val());
        $("#hora_salida_excel").text($("#horario_salida").val());

        const table = document.querySelector('#resultados-exportar-excel');
        const workbook = XLSX.utils.table_to_book(table, {
            sheet: 'Jornadas Laborales'
        });
        return XLSX.writeFile(workbook, 'Jornadas Laborales.xlsx');
    });


//if (perfil_usuario.en_jornada === "1") {
//    initJornadaLaboral(true);
//} else {
    if (tipo_servicio !== "0") {
        swal.fire({
            text: "Recuerda iniciar tu jornada laboral",
            showCancelButton: true,
            confirmButtonText: "Iniciar ahora",
            cancelButtonText: "Iniciar mas tarde"
        }).then((result) => {
            if (result.value) {
//                initJornadaLaboral(false);
                $("#entrada_salida_iniciar_jornada").click();
            } else {
                if (jornada_usuario.estatus_jornada === "iniciada") {
                    estatus_jornada_laboral("finalizada");
                } else if (jornada_usuario.estatus_jornada === "pausada") {
                    estatus_jornada_laboral("pausada");
                } else if (jornada_usuario.estatus_jornada === "reanudada") {
                    estatus_jornada_laboral("pausada");
                } else if (jornada_usuario.estatus_jornada === "finalizada") {
                    estatus_jornada_laboral("finalizada");
                }
            }
        });
    }
    var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
    var diasSemana = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");
    var f = new Date();
    document.getElementById("entrada_salida_today").innerHTML = diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();

//}
}