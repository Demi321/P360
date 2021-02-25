/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


modalImagenes();
        habilitarMaximizarVideo();
        var dataAgenda = {};
        var $input;
        fechas_llamada().then(function (agenda) {
            dataAgenda.fechas = agenda;
//            console.log(dataAgenda);
            activar_calendario();
        });
        function activarCal(input) {
            input.pickadate("option", "disabled", false);
        }
        function desactivarCal(input) {
            input.pickadate("option", "disabled", true);
        }

        function activar_calendario() {


            var fecha_calendario = getFecha();
            document.getElementById("dateformated").value = fecha_calendario;
            var fechaArray = fecha_calendario.split("-");
            console.log("Hacer la primer consulta....");
            ///
            info_fechas_llamada(fecha_calendario).then(function (response) {
                dataAgenda[fecha_calendario] = response;
                //Agregar cards 
                $.each(dataAgenda[fecha_calendario], function (i) {
                    agregar_cards_agenda(dataAgenda[fecha_calendario][i], fecha_calendario);
                });
            });
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
                var dt = new Date(dataAgenda.fechas[i].fecha_llamada);
                dt.setDate(dt.getDate() + 1);
                datearr.push(dt);
            }
            picker.set('disable', datearr);
            picker.on({
                open: function () {
                    console.log("onOpen");
                },
                close: function () {
                    console.log("onClose");
                    console.log("hacer consultas bajo demanda...");
                    console.log(document.getElementsByName("prefix--suffix")[0].value);
                    fecha_calendario = document.getElementsByName("prefix--suffix")[0].value;
                    ///
                    $("#sidebar2").empty();
                    if (!dataAgenda.hasOwnProperty(fecha_calendario)) {
                        let buscando = document.createElement("div");
                        buscando.className = "buscarCalendario";
                        buscando.id = "buscarCalendario";
                        document.getElementsByClassName("picker__holder")[0].appendChild(buscando);
                        info_fechas_llamada(fecha_calendario).then(function (response) {
                            dataAgenda[fecha_calendario] = response;
                            //Agregar cards 
                            $.each(dataAgenda[fecha_calendario], function (i) {
                                agregar_cards_agenda(dataAgenda[fecha_calendario][i], fecha_calendario);
                            });
                        });
                    } else {
                        //Agregar cards 
                        $.each(dataAgenda[fecha_calendario], function (i) {
                            agregar_cards_agenda(dataAgenda[fecha_calendario][i], fecha_calendario);
                        });
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
        function agregar_cards_agenda(json, fecha) {
            console.log(json);
            var div1 = document.createElement("div");
            div1.className = "tarjeta row col-12 m-0 p-2 " + json.estatus_llamada.replace(/ /gm, "") + " " + json.folio;
            div1.id = json.folio;
            var div2 = document.createElement("div");
            div2.className = "col-6 m-0";
            //div2.innerHTML = "" + json.genero;
            div2.innerHTML = json.nombre + " " + json.apellidop_paciente + " " + json.apellidom_paciente;
            var estado_div = document.createElement("div");
            estado_div.className = "col-6 m-0 pl-1 text-right";
            estado_div.id = "estado" + json.folio;
            estado_div.innerHTML = json.estatus_llamada;
            var div3 = document.createElement("div");
            div3.className = "row col-12 m-0";
            var div4 = document.createElement("div");
            div4.className = "col-12 m-0 p-0 label_institucion";
            div4.innerHTML = json.nombre + " " + json.apellidop_paciente + " " + json.apellidom_paciente;
            var div5 = document.createElement("div");
            div5.className = "col-6 label_fecha";
            div5.innerHTML = json.telefono_paciente;
            var div6 = document.createElement("div");
            div6.className = "col-6 label_hora";
            div6.innerHTML = fecha;
            //div3.appendChild(div4);
            div3.appendChild(div5);
            div3.appendChild(div6);
            div1.appendChild(div2);
            div1.appendChild(estado_div);
            div1.appendChild(div3);
            $("#sidebar2").append(div1);

            div1.addEventListener("click", function () {
                $("#enviar_actualizacion_estado").removeClass("d-none");
                $("#idUsuario").val("");
                $("#numero_llamada").val("");
                $("#llamar_familiar").addClass("d-none");
                $("#id").val(json.folio);
                $("#nombre").val(json.nombre + " " + json.apellidop_paciente + " " + json.apellidom_paciente);
                $("#telefono_paciente").val(json.telefono_paciente);
                $("#fecha_nacimiento").val(json.fecha_nacimiento);
                $("#edad").val(json.edad);
                $("#genero").val(json.genero);
                $("#fecha_cambio").val(json.fecha_cambio + " " + json.hora_cambio);
                $("#comorbilidades").val(json.comorbilidades);
                $("#nombre_responsable").val(json.nombre_responsable + " " + json.apellidop_responsable + " " + json.apellidom_responsable);
                $("#telefono_responsable").val(json.telefono_contacto);
                $("#doctor_responsable").val(json.nombre_doctor_responsable);
                $("#fecha_hospitalizacion").val(json.fecha_ingreso);
                $("#fecha_inicio_sintomas").val(json.fecha_sintomas);
                $("#dias_sintomas").val(calcula_dias(json.fecha_sintomas));
                $("#dias_alta").val(calcula_dias(json.fecha_ingreso));
                if (json.vinculado) {
                    $("#llamar_familiar").removeClass("d-none");
                    $("#idUsuario").val(json.idUsuario);
                    $("#numero_llamada").val(json.numero_llamada);
                }

            });
        }
        $("#enviar_actualizacion_estado").on("submit", function (e) {
            e.preventDefault();
            console.log("enviar_actualizacion_estado");
            var estado = $("#estado_nuevo").val();
            var diagnostico = "El paciente " + $("#nombre").val() + " " + $("#falta_aire").val().toString().toLowerCase() + " ha presentado falta de aire. \n\
Su fiebre " + $("#persistido_fiebre").val().toString().toLowerCase() + " ha persistido por más de 72 horas. \n\
Su saturación de oxigeno es de " + $("#saturacion_oxigeno").val() + "%, \n\
" + $("#cansancio").val() + " ha presentado cansancio que lo limita a realizar sus actividades.\n\
" + $("#dolor_cabeza").val() + " ha tenido dolor de cabeza. \n\
" + $("#gastrointestinales").val() + " ha tenido sintomas gastrointestinales como diarrea o vomito.\n\
¿Ha tenido otra molestia? " + ($("#otra_molestia").val().replace(/'/gm, "")).replace(/"/gm, "") + "\n\
¿Esta tomando otro medicamento? " + ($("#otros_medicamentos").val().replace(/'/gm, "")).replace(/"/gm, "");
//            console.log(estado);
//            console.log(diagnostico);console.log("ActualizacionEstado");
            var json = {
                "folio": $("#id").val(),
                "estado": estado,
                "diagnostico": diagnostico,
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
                    $("#enviar_actualizacion_estado").addClass("d-none");
                } else {
                    Toast.fire({
                        type: 'error',
                        title: "Hubo un error al intentar guardar el reporte...."
                    });
                }
            });
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
                            res.folio = $("#id").val();
                            res.personal = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre;
                            res.idOperador_llamada = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).idUsuario_Sys;
                            res.numero_llamada = $("#numero_llamada").val();
                            
                            $("#modal_aviso").text("Conectando");
                            initializeSession(res);
                        });



                //tels_agregar
//                let vue1 = new Vue({
//                    components: {
//                        Multiselect: window.VueMultiselect.default
//                    },
//                    data: {
//                        value: [
//                        ],
//                        options: directorio
//                    },
//                    methods: {
//                        customLabel(option) {
//                            return  option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno + " " + option.idUsuario;
//                        },
//                        onSelect(op) {
//                            tel_a_agregar.push(op);
//                        },
//                        onClose() {
//                            ////console.info(this.value);
//                        },
//                        onRemove(op) {
//                            var i = tel_a_agregar.indexOf(op);
//                            tel_a_agregar.splice(i, 1);
//                        }
//                    }
//                }).$mount('#directorio_familiares');

            }
        });

        function fechas_llamada() {
            return Promise.resolve($.ajax({
                type: 'GET',
                url: '/' + DEPENDENCIA + '/API/altas/fechas_llamadas',
                contentType: "application/json;charset=UTF-8",
                success: function (response) {
                    ////console.info(response);|
                },
                error: function (err) {
                    console.error(err);
                }
            }));
        }
        function info_fechas_llamada(fecha) {
            return Promise.resolve($.ajax({
                type: 'GET',
                url: '/' + DEPENDENCIA + '/API/altas/fechas_llamadas/' + fecha,
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
        function calcula_dias(fecha) {
            var hoy = new Date();
            fecha = new Date(fecha);
            var fecha1 = moment(hoy);
            var fecha2 = moment(fecha);

            return fecha1.diff(fecha2, 'days');
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
        function actualizacion_monitoreoRemoto(json) {
            console.log(json);
            return Promise.resolve($.ajax({
                type: 'POST',
                url: '/' + DEPENDENCIA + '/API/actualizacion_monitoreoRemoto',
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
        function registrarDesconexionpacientesalta(id) {
            console.log(id);
            return Promise.resolve($.ajax({
                type: 'POST',
                url: '/' + DEPENDENCIA + '/API/registrarDesconexionpacientesalta',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({
                    "id":id
                }),
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
            let id_agenda=null
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
                    if (id_agenda!==null){
                        registrarDesconexionpacientesalta(id_agenda);
                    }
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
                    
                    //registrar que la llamada se realizo correctamente...... 
                    //si se agregaran mas videos se tendria que identificar el stream correspondiente al paciente 
                    //update al estado del registro vinculacion 
                    Credenciales.estatus_llamada = "Realizada";
                    actualizacion_monitoreoRemoto(Credenciales).then(function(response){
                        console.log(response);
                        id_agenda=response.id;
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
                url: '/' + DEPENDENCIA + '/API/vinculacionpaciente/notificar_llamada',
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
