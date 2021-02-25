/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



/* global DEPENDENCIA, Swal */

modalImagenes();
habilitarMaximizarVideo();
$("#ActualizacionEstado").submit(function (e) {
    e.preventDefault();
    console.log("ActualizacionEstado");
    var json = {
        "folio": $("#id").val(),
        "estado": $("#estado_nuevo").val(),
        "diagnostico": $("#diagnostico_nuevo").val(),
        //"personal": $("#nombre_doctor").val()
        "personal": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre
    };
    actualizacion_estadoCCB(json).then(function (response) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 3000
        });


        if (response.success) {
            Toast.fire({
                type: 'success',
                title: "Reporte guardado correctamente."
            });
            $("#diagnostico_nuevo").attr("disabled", true);
            $("#estado_nuevo").attr("disabled", true);
            $("#enviar_actualizacion_estado").attr("disabled", true);

        } else {
            Toast.fire({
                type: 'error',
                title: "Hubo un error al intentar guardar el reporte...."
            });
        }
    });
});
$("#llamar_familiar").click(function () {
    console.log("llamar_familiar");
    if ($("#id").val() !== "") {
        var tel_a_agregar = new Array();
        directorio_paciente($("#id").val()).then(function (directorio) {
            console.log(directorio);
            if (directorio.length > 0) {
                Swal.fire({
                    title: 'Solicitar llamada',
                    html: '<label class="sweetalrt" style="padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;">Seleccionar familiares para establecer una llamada.</label>' +
                            '<div class="col-12" id="directorio_familiares">' +
                            '<multiselect ' +
                            'placeholder=""' +
                            'v-model="value" ' +
                            ':options="options"' +
                            'track-by="idUsuario"' +
                            ':multiple="true"' +
                            ':taggable="true"' +
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
                    confirmButtonText: "Llamar"
                }).then((result) => {
                    if (result.value) {
                        //console.log(tel_a_agregar);

                        console.log(tel_a_agregar);
                        let familiares = new Array();
                        $.each(tel_a_agregar, function (i) {
                            familiares.push(tel_a_agregar[i].idUsuario);
                        });
                        console.log(familiares);
                        $("#modal_llamada").removeClass("d-none");
                        $("#modal_aviso").text("Solicitando videollamada");
                        GenerarCredenciales().then(
                                function (res) {
                                    console.log(res);
                                    res.idUsuarios = familiares;
                                    res.folio = $("#id").val();
                                    res.personal = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre;
                                    $("#modal_aviso").text("Conectando");
                                    initializeSession(res);
                                });

                    }
                });

                //tels_agregar
                let vue1 = new Vue({
                    components: {
                        Multiselect: window.VueMultiselect.default
                    },
                    data: {
                        value: [
                        ],
                        options: directorio
                    },
                    methods: {
                        customLabel(option) {
                            return  option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno + " " + option.idUsuario;
                        },
                        onSelect(op) {
                            tel_a_agregar.push(op);
                        },
                        onClose() {
                            ////console.info(this.value);
                        },
                        onRemove(op) {
                            var i = tel_a_agregar.indexOf(op);
                            tel_a_agregar.splice(i, 1);
                        }
                    }
                }).$mount('#directorio_familiares');
            } else {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 3000
                });

                Toast.fire({
                    type: 'error',
                    title: "No se hay dispositivos vinculados."
                });

            }
        });
    }

});

directorio_pacientesCCB_ingresados().then(function (directorio) {
    console.log(directorio);

    var paciente;
    vue = new Vue({
        components: {
            Multiselect: window.VueMultiselect.default
        },
        data: {
            value: [],
            options: directorio
        },
        methods: {
            label_function(option) {
                return  option.id.toString().padStart(4, "0") + " " + option.nombre + " " + option.apellidop_paciente + " " + option.apellidom_paciente + " Estado: " + option.estado;
            },
            onChange(value) {

            },
            onSelect(op) {
                paciente = null;
                paciente = op;
                console.log(op);
                //document.getElementById(op.id).scrollIntoView();
                //$("#" + op.id).click();
                solicitarInfoPacienteCCB(op.id).then(function (response) {
                    console.log(response);
                    var idJson = Object.keys(response);
                    for (var i = 0; i < idJson.length; i++) {
                        //console.log(idJson[i]);
                        if ($("#" + idJson[i]).length) {
                            //console.log(idJson[i]);
                            $("#" + idJson[i]).attr("disabled", true);
                            $("#" + idJson[i]).val(response[idJson[i]]);

                        }
                    }
                    $("#diagnostico_nuevo").attr("disabled", false);
                    $("#estado_nuevo").attr("disabled", false);
                    $("#enviar_actualizacion_estado").attr("disabled", false);
                });
            },
            onTouch() {
                console.log("Open");
                vue._data.value = null;
                $("input[type=text]").val("");
                $("select").val("");
                $("textarea").val("");
            }
        }
    }).$mount('#directorio_pacientesCCB');

});

function directorio_pacientesCCB_ingresados() {

    return Promise.resolve($.ajax({
        type: 'GET',
        url: '/plataforma360/API/directorio/pacientesCCB/ingresados',
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            console.log(response);
        },
        error: function (err) {
            console.error(err);
        }
    }));
}

function directorio_paciente(folio) {

    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/vinculacionfamiliar/directorio',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "folio": folio
        }),
        success: function (response) {
            console.log(response);
        },
        error: function (err) {
            console.error(err);

        }
    }));
}
function solicitarInfoPacienteCCB(folio) {

    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/vinculacionfamiliar/infoSolicitud',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "fecha": getFecha(),
            "hora": getHora(),
            "folio": folio
        }),
        success: function (response) {
            console.log(response);
        },
        error: function (err) {
            console.error(err);

        }
    }));
}
function actualizacion_estadoCCB(json) {
    console.log(json);
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/vinculacionfamiliar/actualizacion_estado',
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
var session = null;
function initializeSession(Credenciales) {

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
            console.error('You were disconnected from the session.', event.reason);
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

                    $("#modal_aviso").text("Notificando Familiares");

                    var colgar = document.createElement("input");
                    colgar.className = "colgarPublisher";
                    colgar.id = "colgarPublisherSOS";
                    colgar.value = "";
                    colgar.addEventListener("click", function () {

                        //enviarMensaje(session, JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre, "Ha dejado la llamada.");

                        session.unpublish(publisher);
                        $(".side1Chat").addClass("d-none");
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
        url: '/' + DEPENDENCIA + '/API/vinculacionfamiliar/notificar_llamada',
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