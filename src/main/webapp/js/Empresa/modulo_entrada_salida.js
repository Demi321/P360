/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


agregar_menu("Entrada y Salida");

$("#iniciar_jornada_laboral").click(() => {
    $("#mensaje-cargando-proceso").removeClass("d-none");
    GenerarCredenciales().then(function (response) {
        console.log(response);
        Credenciales = response;
        initializeSessionEmpleado(response);
    });
});

function initializeSessionEmpleado(data) {
    console.log("initializeSessionEmpleado");

    if (sesion_jornada_laboral !== null) {
        sesion_jornada_laboral.disconnect();
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

                    $("#guardarreporte").removeClass("d-none");
                    // Make the DIV element draggable:
                    dragElement(document.getElementById("video_drag"));
                    console.log("Registrar conexion");
                    //console.log(empleado);
                    /*$("#nom").val(empleado.nombre + " " + empleado.apellidos);
                     $("#num").val(empleado.idUsuario_Sys);*/
                    RequestPOST("/API/empresas360/registro/horario_laboral", {
                        "id_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario,
                        "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
                        "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
                        "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area,
                        "apikey": Credenciales.apikey,
                        "idsesion": Credenciales.idsesion,
                        "token": Credenciales.token,
                        "id_socket": idSocketOperador,
                        "activo": "1",
                        "web": true

                    }).then(function (response) {
                        $("#ing").val(response.date_created + " " + response.time_created);
                        if (response.reporte !== null) {
                            $("#rep").val(response.reporte);
                        }




                        $("#guardarreporte").click(function () {
                            console.log("guardarreporte");
                            $("#mensaje-cargando-proceso").removeClass("d-none");
                            RequestPOST("/API/empresas360/registro/horario_laboral", {
                                "id_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario,
                                "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
                                "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
                                "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area,
                                "id": response.id,
                                "reporte": $("#rep").val(),
                                "activo": "0",
                                "web": true
                            }).then(function (response) {
                                $("#ing").val(response.date_created + " " + response.time_created + " - " + response.date_updated + " " + response.time_updated);
                                swal.fire({
                                    text: "Tu jornada laboral comenzo a la hora: " + response.time_created + " y esta finalizando a la hora: " + response.time_updated,
                                    timer: 5000
                                }).then(function () {
                                    if (sesion_jornada_laboral !== null) {
                                        sesion_jornada_laboral.disconnect();
                                    }
                                    $("#iniciar_jornada_laboral").removeClass("d-none");
                                    $("#guardarreporte").addClass("d-none");
                                    //ocultar ventana de video 
                                    $("#video_drag").addClass("d-none");

                                    $("#rep").css({"min-height": "0px"});
                                    $("#rep").attr("disabled", "true");
                                    $("#mensaje-cargando-proceso").addClass("d-none");
                                    $("#conectado_jornada_laboral").empty();
                                    $("#video_drag_footer").empty();

                                });
                            });

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
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

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
            consulta_historial(fecha_inicio, "");
        else {
            if (validarFecha(convertDateFormat(fecha_fin))) {

                let f1 = new Date(fecha_inicio);
                let f2 = new Date(fecha_fin);

                if (f2.getTime() >= f1.getTime())
                    consulta_historial(fecha_inicio, fecha_fin);
                else
                    swal.fire({text: "La fecha final debe ser mayor que la fecha inicial"});

            } else
                swal.fire({text: "Ingresa una fecha final válida"});
        }

    } else
        swal.fire({text: "Ingresa una fecha inicial válida"});

});



function convertDateFormat(string) {
    return string.split('-').reverse().join('/');
}

function formatDateDefault(date) {
    let dia = date.getDate().toString();
    if (dia.length === 1)
        dia = "0" + dia;
    return dateParse = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + dia;
}

const consulta_historial = (fecha_inicio, fecha_final) => {

    const nombresDiasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    let data = new Object();
    data.inicio = fecha_inicio;
    data.fin = fecha_final;
    data.id = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario;

    RequestPOST("/API/empresas360/jornadas_laborales", data).then((response) => {


        $("#sin-resultados-jornadas").addClass("d-none");
        $("#con-resultados-jornadas").removeClass("d-none");

        const cuerpoTabla = $("#cuerpo-tabla-jornadas");
        const cuerpoTablaExcel = $("#resultados-exportar-excel");
        cuerpoTabla.empty();
        cuerpoTablaExcel.empty();
        cuerpoTablaExcel.append(cabeceraReporteExcel());

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

$("#botonDescargaReporteJornada").click(function () {

    const dataUser = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA));

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

const cabeceraReporteExcel = () => {
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

if (perfil === null) {
    RequestPOST("/API/cuenta360/empresas360/perfil/empleado", {
        "id360": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario
    }).then(function (response) {
        if (response.success) {
            perfil = response;
            if (perfil.en_jornada === "1") {
                $("#iniciar_jornada_laboral").click();
            }
        }
    });
} else if (perfil.en_jornada === "1") {
    $("#iniciar_jornada_laboral").click();
}