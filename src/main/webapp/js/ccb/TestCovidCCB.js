/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global WebSocketGeneral, Promise, DEPENDENCIA, GenerarCredenciales, google, Swal */

var msj0 = "Gracias por registrar tu estado de salud seguimos al pendiente de ti #AquíNadieSeInfecta.\n\
Recuerda continuar con tus medidas de precaución en todo momento: \n\
    ◦ Lávate las manos con frecuencia. \n\
    ◦ Mantén sana distancia. \n\
    ◦ Evita tocarte la cara (ojos, nariz y boca).";
var msj1 = "Gracias por registrar tu estado de salud seguimos al pendiente de ti.\n\
Por la presencia de tus síntomas no puedes atender pacientes. \n\
Comunícate con Epidemiología Hospitalaria para recibir una consulta por videollamada";
var msj2 = "Gracias por registrar tu estado de salud seguimos al pendiente de ti.\n\
Por la presencia de tus síntomas no puedes atender pacientes.        \n\
Por tener factores de riesgo para complicarte, necesitas acudir a un Centro COVID para tu atención y valorar si requieres hospitalización.  \n\
Comunícate con Epidemiología Hospitalaria para darle seguimiento a tu caso";

modalImagenes();
habilitarMaximizarVideo();
var dataAgenda = {};
var $input;
fechas_testCovid().then(function (agenda) {
    dataAgenda.fechas = agenda;
    console.log(dataAgenda);
    activar_calendario();
});
//function activarCal(input) {
//    input.pickadate("option", "disabled", false);
//}
//function desactivarCal(input) {
//    input.pickadate("option", "disabled", true);
//}

function activar_listener_socket(fecha_calendario) {
    WebSocketGeneral.onmessage = function (message) {
        console.log("######");
        var mensaje = JSON.parse(message.data);
        try {
            if (mensaje.inicializacionSG) {
                idSocketOperador = mensaje.idSocket;
                var ms = {
                    "fecha_calendario": fecha_calendario,
                    "backup_utc19covid": true
                };
                EnviarMensajePorSocket(ms);
            }
            if (mensaje.utc19covid) {
                //Agregar a la bandeja
                agregar_cards(mensaje);
            }
        } catch (e) {
        }
    };
    //  En caso de requerir un backup
    if (WebSocketGeneral.readyState === 1) {
        var ms = {
            "fecha_calendario": fecha_calendario,
            "backup_utc19covid": true
        };
        EnviarMensajePorSocket(ms);
    }
}

function activar_calendario() {
    var fecha_calendario = getFecha();
    document.getElementById("dateformated").value = fecha_calendario;
    var fechaArray = fecha_calendario.split("-");
    console.log("Hacer la primer consulta....");

    activar_listener_socket(fecha_calendario);
//    info_fechas_testCovid(fecha_calendario).then(function (response) {
//        dataAgenda[fecha_calendario] = response;
//        //Agregar cards 
//        $.each(dataAgenda[fecha_calendario], function (i) {
//            agregar_cards(dataAgenda[fecha_calendario][i]);
//        });
//    });
    $input = $('#button__api-open-close').pickadate({
        format: 'Resulta!dos !del !día: dddd, dd !de mmmm !de yyyy',
        formatSubmit: 'yyyy-mm-dd',
        hiddenPrefix: 'prefix-',
        hiddenSuffix: '-suffix',
        min: new Date(2019, 4, 5),
        //max: new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2]),
        today: false,
        clear: false,
        close: false});
    var picker = $input.pickadate('picker');

    picker.set('enable', false);
    var datearr = new Array();
    for (var i = 0; i < dataAgenda.fechas.length; i++) {
        var dt = new Date(dataAgenda.fechas[i].fecha);
        dt.setDate(dt.getDate() + 1);
        datearr.push(dt);
    }
    console.log(datearr);
    picker.set('disable', datearr);
    picker.on({
        open: function () {
            console.log("onOpen");
        },
        close: function () {
            console.log("onClose");
            console.log("hacer consultas bajo demanda...");
            limpiar_info();
            console.log(document.getElementsByName("prefix--suffix")[0].value);
            fecha_calendario = document.getElementsByName("prefix--suffix")[0].value;
            $("#sidebar2").empty();
            if (fecha_calendario === getFecha()) {
                console.log("solicitar junto con los que estan pendientes");
                if (dataAgenda.hasOwnProperty(fecha_calendario)) {
                    $.each(dataAgenda[fecha_calendario], function (i) {
                        agregar_cards(dataAgenda[fecha_calendario][i]);
                    });
                } else {
                    var ms = {
                        "fecha_calendario": fecha_calendario,
                        "backup_utc19covid": true
                    };
                    EnviarMensajePorSocket(ms);
                }
            } else {
                //Verificar si la fecha a buscar ya esta en dataAgenda
                if (dataAgenda.hasOwnProperty(fecha_calendario)) {
                    $.each(dataAgenda[fecha_calendario], function (i) {
                        agregar_cards(dataAgenda[fecha_calendario][i]);
                    });
                } else {
                    console.log("solicitar los de una fecha en especifico");
                    var ms = {
                        "fecha_calendario": fecha_calendario,
                        "backup_utc19covid_fecha": true
                    };
                    EnviarMensajePorSocket(ms);
                }

            }
        },
        render: function () {
            console.log("onRender");
        },
        start: function () {
            console.log("onStart");
        },
        stop: function () {
            console.log("onStop");
        },
        set: function () {
            console.log("onSet");
        }
    });
}
function agregar_cards(json) {
    console.log(json);
    var div1 = document.createElement("div");
    if (json.hasOwnProperty("fecha_nuevaLlamada")) {
        div1.className = "tarjeta_llamada row col-12 m-0 p-2 ";
    } else {
        div1.className = "tarjeta row col-12 m-0 p-2 ";
    }

    div1.id = json.id;
    var div2 = document.createElement("div");
    div2.className = "col-6 m-0";
    if (json.hasOwnProperty("fecha_nuevaLlamada")) {
        div2.innerHTML = json.Perfil.nombre;
    } else {
        div2.innerHTML = json.Perfil.nombre + " " + json.Perfil.apellido_paterno + " " + json.Perfil.apellido_materno;
    }
    var div3 = document.createElement("div");
    div3.className = "row col-12 m-0";
    var div5 = document.createElement("div");
    div5.className = "col-6 label_fecha";
    div5.innerHTML = json.idUsuario;
    var div6 = document.createElement("div");
    div6.className = "col-6 label_hora";
    div6.innerHTML = json.fecha;
    div3.appendChild(div5);
    div3.appendChild(div6);
    div1.appendChild(div2);
    div1.appendChild(div3);
    $("#sidebar2").append(div1);
    if (json.estado_llamada !== null && json.estado_llamada !== "null" && json.estado_llamada !== undefined) {
        $("#" + json.id).css({
            "background": "#8a8a8a"
        });
    }

    div1.addEventListener("click", function () {
//        drawChart(json.fechas_test);
//        console.log("click en: "+json.id);
        limpiar_info();
        if (json.hasOwnProperty("fecha_nuevaLlamada")) {
            $(".hTest").addClass("d-none");
            $(".contTest").addClass("d-none");
            if (json.estado_llamada !== null && json.estado_llamada !== "null" && json.estado_llamada !== undefined) {
//                $("#guardarDiagnostico").addClass("d-none");
//                $("#llamar_familiar").addClass("d-none");
                $("#guardarDiagnostico").removeClass("d-none");
                $("#llamar_familiar").removeClass("d-none");
            } else {
                $("#guardarDiagnostico").removeClass("d-none");
                $("#llamar_familiar").removeClass("d-none");
            }
            if (json.diagnostico !== null && json.diagnostico !== "null" && json.diagnostico !== undefined) {
//                $("#guardarDiagnostico").addClass("d-none");
                $(".textareaDiag").val(json.diagnostico);
            }
        } else {
//            $("#guardarDiagnostico").addClass("d-none");
//            $("#llamar_familiar").removeClass("d-none");
            $(".hTest").removeClass("d-none");
            $(".contTest").removeClass("d-none");
            if (json.estado_llamada !== null && json.estado_llamada !== "null" && json.estado_llamada !== undefined) {
//                $("#guardarDiagnostico").addClass("d-none");
//                $("#llamar_familiar").addClass("d-none");
                $("#guardarDiagnostico").removeClass("d-none");
                $("#llamar_familiar").removeClass("d-none");
            } else {
                $("#guardarDiagnostico").removeClass("d-none");
                $("#llamar_familiar").removeClass("d-none");
            }
            if (json.diagnostico !== null && json.diagnostico !== "null" && json.diagnostico !== undefined) {
//                $("#guardarDiagnostico").addClass("d-none");
                $(".textareaDiag").val(json.diagnostico);
            }
        }

        $("#id").val("");
        $("#id").val(json.id);

        $(".ImgTestCovid")[0].style = "";
        $(".ImgTestCovid").css({
            "background-image": "url('" + json.Perfil.img + "')"
        });
        $("#nombre").val(json.Perfil.nombre + " " + json.Perfil.apellido_paterno + " " + json.Perfil.apellido_materno);
        $("#idUsuario").val(json.idUsuario);
        $("#fecha_nacimiento").val(json.Perfil.fecha_nacimiento);
        $("#edad").val(json.hasOwnProperty("edad") ? json.edad : calcularEdad());
        if (json.hasOwnProperty("fecha_nuevaLlamada")) {
            $("#genero").val(json.Perfil.genero);
        } else {
            $("#genero").val(json.genero);
        }
        $("#fecha_hora_test").val(json.fecha + " " + json.hora);

        $("#rfiebre").text(json.fiebre === "0" ? "No" : "Si");
        $("#rtos").text(json.tos === "0" ? "No" : "Si");
        $("#rdolor_cabeza").text(json.dolor_cabeza === "0" ? "No" : "Si");
        $("#rdolor_pecho").text(json.dolor_pecho === "0" ? "No" : "Si");
        $("#rdolor_garganta").text(json.dolor_garganta === "0" ? "No" : "Si");
        $("#rdificultad_respirar").text(json.dificultad_respirar === "0" ? "No" : "Si");
        $("#rdolor_general").text(json.dolor_general === "0" ? "No" : "Si");
        $("#rescalofrios").text(json.escalofrios === "0" ? "No" : "Si");

        if (json.gravedad !== "0") {
            $("#rcondiciones_medicas").text(json.condiciones_medicas === "0" ? "No" : "Si");
            $("#rembarazo").text(json.embarazo === "0" ? "No" : "Si");
            $("#rdolor_respirar").text(json.dolor_respirar === "0" ? "No" : "Si");
            $("#rfalta_aire").text(json.falta_aire === "0" ? "No" : "Si");
            $("#rcoloracion_azul").text(json.coloracion_azul === "0" ? "No" : "Si");
        } else {
            $("#rcondiciones_medicas").text("No");
            $("#rembarazo").text("No");
            $("#rdolor_respirar").text("No");
            $("#rfalta_aire").text("No");
            $("#rcoloracion_azul").text("No");
        }

        if (json.exposicion !== "0") {
            $("#rconvivido_sin_equipo").text(json.convivido_sin_equipo === "0" ? "No" : "Si");
            $("#rcontaminado_retiro").text(json.contaminado_retiro === "0" ? "No" : "Si");
        } else {
            $("#rconvivido_sin_equipo").text("No");
            $("#rcontaminado_retiro").text("No");
        }
        $("#ingresar").val(json.Perfil.acceso_ccb);
        $("#fecha_nuevaLlamada").attr("min", getFecha());
//        if (json.mensaje !== null) {
//            $("#rmensaje").removeClass("d-none");
//            /*
//             “0”=para mesnaje 2
//             “1”=para mensaje 1
//             “2”=para mensaje 0*/
//            if (json.mensaje === "0") {
//                $("#rmensaje").text("Recomendación dada: " + msj2);
//            } else if (json.mensaje === "1") {
//                $("#rmensaje").text("Recomendación dada: " + msj1);
//            } else {
//                $("#rmensaje").text("Recomendación dada: " + msj0);
//            }
//        }
        $("#labelIngresar").text($("#nombre").val() + ", ¿Podra ingresar a la UTC-19?");

    });
}
$("#guardarDiagnostico").on("click", function () {
    console.log("diagnostico");
    if ($(".textareaDiag").val() !== "") {
        if ($("#ingresar").val() !== "-1") {
            var json = {
                "idUsuario": $("#idUsuario").val(),
                "diagnostico": $(".textareaDiag").val(),
                "id": $("#id").val(),
                "acceso_ccb": $("#ingresar").val(),
                "fecha_nuevaLlamada": $("#fecha_nuevaLlamada").val() !== "" ? fecha_formato($("#fecha_nuevaLlamada").val()) : "NULL",
                "nombre": $("#nombre").val(),

                "rol_usuario": 1
            };
            /*
             * Rol de usuario para agendar llamada
             * 1 para el personal del ccb
             * 2 para un paciente normal
             */
            diagnostico_personal_ccb(json).then(function (response) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 3000
                });
                if (response.procede) {
                    Toast.fire({
                        type: 'success',
                        title: "Información guardada correctamente."
                    });
                    $("#guardarDiagnostico").addClass("d-none");
                } else {
                    Toast.fire({
                        type: 'error',
                        title: "Error al intentar guardar la información. Intentelo nuevamente."
                    });
                }
            });
        } else {
            Swal.fire({
                title: 'Alto',
                html: "<br><p style='color:white;'>Es enecesario que indique si el paciente podra ingresar a la UTC-19</p>",
                focusConfirm: false,
                showCancelButton: false,
                confirmButtonText: "Continuar"
            });
        }
    } else {
        Swal.fire({
            title: 'Alto',
            html: "<br><p style='color:white;'>Primero debes escribir un diganóstico.</p>",
            focusConfirm: false,
            showCancelButton: false,
            confirmButtonText: "Continuar"
        });
    }
});

$("#llamar_familiar").click(function () {

    if (session !== null) {
        session.disconnect();
        session = null;
    }

    console.log("llamar_familiar");
    if ($("#id").val() !== "" && $("#idUsuario").val() !== "") {
        $("#modal_llamada").removeClass("d-none");
        $("#modal_aviso").text("Solicitando videollamada");
        GenerarCredenciales().then(
                function (res) {
                    console.log(res);
                    var arrayUsr = new Array();
                    arrayUsr.push($("#idUsuario").val());
                    res.idUsuarios = arrayUsr;
                    res.idUsuario = $("#idUsuario").val();
                    res.idCard = $("#id").val();
                    res.idOperador_llamada = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).idUsuario_Sys;
                    res.personal = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre;
                    $("#modal_aviso").text("Conectando");
                    initializeSession(res);
                });
    }
});

function fechas_testCovid() {
    return Promise.resolve($.ajax({
        type: 'GET',
        url: '/' + DEPENDENCIA + '/API/test/fechas_testCovid',
        contentType: "application/json;charset=UTF-8",
        success: function (response) {
            //console.info(response);
        },
        error: function (err) {
            console.error(err);
        }
    }));
}
function info_fechas_testCovid(fecha) {
    return Promise.resolve($.ajax({
        type: 'GET',
        url: '/' + DEPENDENCIA + '/API/test/fechas_testCovid/' + fecha,
        contentType: "application/json;charset=UTF-8",
        success: function (response) {
            ////console.info(response);|
            if ($("#buscarCalendario").length) {
                $("#buscarCalendario").remove();
            }
        },
        error: function (err) {
            if ($("#buscarCalendario").length) {
                $("#buscarCalendario").remove();
            }
            console.error(err);
        }
    }));
}
function diagnostico_personal_ccb(json) {
    console.log(json);
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/diagnostico_personal_ccb',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(json),
        success: function (response) {
            //console.log(response);
        },
        error: function (err) {
            console.error(err);

        }
    }));
}
function actualizacion_estadoLlamada_personalCCB(json) {
    console.log(json);
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/actualizacion_estadoLlamada_personalCCB',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(json),
        success: function (response) {
            console.log(response);
        },
        error: function (err) {
            console.error(err);
        }
    }));
}
function limpiar_info() {
    $("#nombre").val("");
    $("#idUsuario").val("");
    $("#fecha_nacimiento").val("");
    $("#edad").val("");
    $("#genero").val("");
    $("#fecha_hora_test").val("");
    $(".divRespuesta label").text("");
    $(".textareaDiag").val("");
    $("#ingresar").val("-1");
    $("#labelIngresar").val("¿Podra ingresar a la UTC-19?");
    $("#fecha_nuevaLlamada").val("");
    $("#guardarDiagnostico").addClass("d-none");
    $("#llamar_familiar").addClass("d-none");
    $(".ImgTestCovid")[0].style = "";
    $(".hTest").removeClass("d-none");
    $(".contTest").removeClass("d-none");
}
var session = null;
var id_agenda = null;
function initializeSession(Credenciales) {
    id_agenda = null;
    if (session !== null) {
        session.disconnect();
    }
    var conectados = 0;
    //setCookie("operador/"+DEPENDENCIA, JSON.stringify(audio), 1);


    session = OT.initSession(Credenciales.apikey, Credenciales.idsesion);

    session.on({
        connectionCreated: function (event) {
            conectados++;
            console.log(conectados);
        },
        connectionDestroyed: function (event) {

            conectados--;
            console.log(conectados);

        },
        sessionConnected: function (event) {

        },
        sessionDisconnected: function (event) {
            //registrar desconexion si se conecto el usuario ....
//            if (id_agenda !== null) {
//                registrarDesconexionpacientesalta(id_agenda);
//            }
            console.error('You were disconnected from the session.', event.reason);
            $("#llamar_familiar").addClass("d-none");
            //session.disconnect();
        },
        sessionReconnected: function (event) {
            console.log(event);
        },
        sessionReconnecting: function (event) {
            console.log(event);
        },
        streamCreated: function (event) {
            agregarVideo(session, event.stream);

            //registrar que la llamada se realizo correctamente...... 
            //si se agregaran mas videos se tendria que identificar el stream correspondiente al paciente 
            //update al estado del registro vinculacion 
            actualizacion_estadoLlamada_personalCCB(Credenciales).then(function (response) {
                console.log(response);
                //id_agenda = response.id;
                $("#guardarDiagnostico").removeClass("d-none");
                $("#" + Credenciales.idCard).css({
                    "background": "#8a8a8a"
                });
            });
        },
        streamDestroyed: function (event) {
            mosaico("remover");
        },
        signal: function (event) {

            if (event.type === "signal:msg-signal") {
                //Sabiendo que el mensaje es de un subscriptor decodifica para saber como tratarlo 
                if (event.from.connectionId === session.connection.connectionId) {

                    insertarMensajePropio(event.data);
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


        }

    });

    // Connect to the session
    session.connect(Credenciales.token, function callback(error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (!error) {
            // Text chat


            var form = document.getElementById("chat");
            var msgTxt = document.querySelector('#msgTxt');

            // Send a signal once the user enters data in the form
            form.addEventListener('submit', function submit(event) {
                event.preventDefault();
                enviarMensaje(session, JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre, msgTxt.value);

            });
            // Initialize the publisher
            var publisherOptions = {
                insertMode: 'replace',
                width: '100%',
                height: '100%',
                name: "" + JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre,
                publishVideo: false
            };
            var pos = NuevaUbicacionPublicador();
            var publisher = OT.initPublisher(pos, publisherOptions, function initCallback(initErr) {

                if (initErr) {
                    console.error('There was an error initializing the publisher: ', initErr.name, initErr.message);
                    //notificarError(initErr.message);
                    return;
                } else {

                }
            });

            // If the connection is successful, publish the publisher to the session
            session.publish(publisher, function publishCallback(publishErr) {
                if (publishErr) {
                    console.error('There was an error publishing: ', publishErr.name, publishErr.message);
                } else {

                    document.getElementById("side1Chat").style = "position: absolute;width: 100%;height: 100%; z-index: 1; margin: 0; top: 0px;";
                    $(".side1Chat").removeClass("d-none");
                    $("#informacion").addClass("d-none");
                    $("#modal_aviso").text("Notificando a Paciente");
                    $("#btnSwitchChat").removeClass("d-none");
                    $("#btnSwitchChat").val("Estado del paciente");
                    $("#btnSwitchChat").on("click", function () {
                        var divInformacion = document.getElementById("informacion");
                        if (divInformacion.className.includes("d-none")) {
                            $(".side1Chat").addClass("d-none");
                            $("#informacion").removeClass("d-none");
                            $("#btnSwitchChat").val("Chat");
                            $("#btnSwitchChat").removeClass("SwitchEstado");
                            $("#btnSwitchChat").addClass("SwitchChat");
                        } else {
                            $(".side1Chat").removeClass("d-none");
                            $("#informacion").addClass("d-none");
                            $("#btnSwitchChat").val("Estado del paciente");
                            $("#btnSwitchChat").addClass("SwitchEstado");
                            $("#btnSwitchChat").removeClass("SwitchChat");
                        }
                    });

                    var colgar = document.createElement("input");
                    colgar.className = "colgarPublisher";
                    colgar.id = "colgarPublisherSOS";
                    colgar.value = "";
                    colgar.addEventListener("click", function () {

                        //enviarMensaje(session, JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre, "Ha dejado la llamada.");

                        session.unpublish(publisher);
                        $(".side1Chat").addClass("d-none");
                        $("#informacion").removeClass("d-none");
                        $("#btnSwitchChat").addClass("d-none");
                        $("#btnSwitchChat").val("");
                        document.getElementById("side1Chat").style = "";
                        document.getElementById("history").innerHTML = "";
                        document.getElementById("msgTxt").value = "";



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


                    /// notificar familiares
                    notificar_llamada(Credenciales).then(function (res) {
                        for (var i = 0; i < Credenciales.idUsuarios.length; i++) {
                            console.log(res[Credenciales.idUsuarios[i]]);
                            let p = document.createElement("p");

                            if (res[Credenciales.idUsuarios[i]].success === 1) {
                                p.innerHTML = Credenciales.idUsuarios[i] + " Notificado.";
                            } else {
                                p.innerHTML = Credenciales.idUsuarios[i] + " No disponible.";
                            }
                            $("#modal_aviso").html(p);
                        }
                        console.log(res);
                        setTimeout(function () {
                            $("#modal_aviso").text("");
                            $("#modal_llamada").addClass("d-none");
                        }, 2000);

                    });
                }
            });
        } else {
            console.error('There was an error connecting to the session: ', error.name, error.message);
        }
    });

}

function notificar_llamada(json) {
    console.log(json);
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/notificar_llamada_ccb',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(json),
        success: function (response) {
            console.log(response);
        },
        error: function (err) {
            console.error(err);

        }
    }));
}

//google.charts.load('current', {packages: ['calendar']});
//google.charts.setOnLoadCallback( function() { drawChart(new Array()); });

function drawChart(fechas_test) {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({type: 'date', id: 'Date'});
    dataTable.addColumn({type: 'number', id: 'Won/Loss'});
    if (fechas_test.length > 0) {
        dataTable.addRows(arreglo_fechas(fechas_test));
    } else {
        dataTable.addRows([]);
    }

    /*  [new Date(2013, 3, 13), 37032],
     [new Date(2013, 3, 14), 38024],
     [new Date(2013, 3, 15), 38024],
     [new Date(2013, 3, 16), 38108],
     [new Date(2013, 3, 17), 38229],
     // Many rows omitted for brevity.
     [new Date(2013, 9, 4), 38177],
     [new Date(2013, 9, 5), 38705],
     [new Date(2013, 9, 12), 38210],
     [new Date(2013, 9, 13), 38029],
     [new Date(2013, 9, 19), 38823],
     [new Date(2013, 9, 23), 38345],
     [new Date(2013, 9, 24), 38436],
     [new Date(2013, 9, 30), 38447]
     */

    var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

    var options = {
        title: "Frecuencia de Test COVID",
        height: 200
    };

    chart.draw(dataTable, options);
}

$("#details").click(function () {
    console.log(document.getElementById("details").open);
    var details = document.getElementById("details");
    if (!details.open) {
        $(".sideSection").css({
            "height": "calc(100% - 225px)"
        });
    } else {
        $(".sideSection").css({
            "height": ""
        });
    }
});

function arreglo_fechas(fechas) {
    var arreglo = new Array();
    $.each(fechas, function (i) {
        var fecha = fechas[i].toString().split("-");
        var año = parseInt(fecha[0]);
        var mes = parseInt(fecha[1]);
        var dia = parseInt(fecha[2]);
        var arreglo_interno = [new Date(año, mes, dia), 38000 + i];
        arreglo.push(arreglo_interno);
    });
    console.log("Este es el arreglo que se le pasara al chartCalendar");
    console.log(arreglo);
    return arreglo;
}

var hoy = new Date();
console.log(hoy);
function calcularEdad() {
    //alert("funcion");
    var fechaNac = document.getElementById("fecha_nacimiento").value;
    console.log(fechaNac);
    var cumpleanos = new Date(fechaNac);
    console.log(cumpleanos);
    edad = hoy.getFullYear() - cumpleanos.getFullYear();
    console.log(edad);
    return edad;
}