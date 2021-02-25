/* global Swal, DEPENDENCIA, Promise, directorio_pacientesCCB, WebSocketGeneral */

$("#todas").click(function () {
    $("#sidebar .tarjeta").removeClass("d-none");
});
$("#aceptadas").click(function () {
    $("#sidebar .tarjeta").addClass("d-none");
    $("#sidebar .AceptadaporUTC-19").removeClass("d-none");
});
$("#pendientes").click(function () {
    $("#sidebar .tarjeta").addClass("d-none");
    $("#sidebar .Enviada").removeClass("d-none");
});
$("#proceso").click(function () {
    $("#sidebar .tarjeta").addClass("d-none");
    $("#sidebar div[class*='Aceptada']").removeClass("d-none");
});
$("#ruta").click(function () {
    $("#sidebar .tarjeta").addClass("d-none");
    $("#sidebar .AceptadaporCRUM").removeClass("d-none");
});
$("#ingresados").click(function () {
    $("#sidebar .tarjeta").addClass("d-none");
    $("#sidebar .IngresadoenUTC-19").removeClass("d-none");
});


//activar_listener_socket();
activar_calendario();

var relacion_cp = {};

function activar_calendario() {


    var fecha_calendario = getFecha();
    document.getElementById("dateformated").value = fecha_calendario;
    var fechaArray = fecha_calendario.split("-");
    console.log("Hacer la primer consulta....");
    activar_listener_socket(fecha_calendario);
    var $input = $('#button__api-open-close').pickadate({
        format: 'Resulta!dos !del !día: dddd, dd !de mmmm !de yyyy',
        formatSubmit: 'yyyy-mm-dd',
        hiddenPrefix: 'prefix-',
        hiddenSuffix: '-suffix',
        min: new Date(2019, 4, 5),
        max: new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2]),
        today: false,
        clear: false,
        close: false,
        onOpen: function () {
            console.log("onOpen");
        },
        onClose: function () {
            console.log("onClose");
            console.log("hacer consultas bajo demanda...");
            console.log(document.getElementsByName("prefix--suffix")[0].value);
            fecha_calendario = document.getElementsByName("prefix--suffix")[0].value;
            $("#sidebar2").empty();
            if (fecha_calendario === getFecha()) {
                console.log("solicitar junto con los que estan en proceso");
                var ms = {
                    "fecha_calendario": fecha_calendario,
                    "backup_ccb": true
                };
                EnviarMensajePorSocket(ms);
            } else {
                console.log("solicitar los de una fecha en especifico");
                var ms = {
                    "fecha_calendario": fecha_calendario,
                    "backup_ccb_fecha": true
                };
                EnviarMensajePorSocket(ms);
            }

        },
        onRender: function () {
            console.log("onRender");
        },
        onStart: function () {
            console.log("onStart");
        },
        onStop: function () {
            console.log("onStop");
        },
        onSet: function () {
            console.log("onSet");
        }
    });

}
function activar_listener_socket(fecha_calendario) {
    WebSocketGeneral.onmessage = function (message) {
        var mensaje = JSON.parse(message.data);
        try {
            if (mensaje.inicializacionSG) {
                idSocketOperador = mensaje.idSocket;
                var ms = {
                    "fecha_calendario": fecha_calendario,
                    "backup_ccb": true
                };
                EnviarMensajePorSocket(ms);
            }
            if (mensaje.bandeja_entrada) {
                //Agregar a la bandeja de solicitudes
                agregar_bandeja(mensaje);
                if (!mensaje.backup_solicitudes) {
                    var total_solicitudes = parseInt($("#total_solicitudes").text()) + 1;
                    $("#total_solicitudes").text(total_solicitudes);

                    var total_solicitudes_pendientes = parseInt($("#total_solicitudes_pendientes").text()) + 1;
                    $("#total_solicitudes_pendientes").text(total_solicitudes_pendientes);
                }
            }
            if (mensaje.cambio_estado_solicitud) {
                //Se actualizar la tarjeta dependiendo del id
                actualiza_bandeja(mensaje);
                /*
                 - Enviada
                 - Rechazada UTC-19
                 - Aceptada por UTC-19
                 - Aceptada por CRUM
                 - Rechazada por CRUM
                 - Ingresado en UTC-19
                 - No ingresó en UTC-19
                 */
                if (mensaje.estado === "Rechazo Automatico") {
                    var total_solicitudes_rechazado = parseInt($("#total_solicitudes_rechazado").text()) + 1;
                    $("#total_solicitudes_rechazado").text(total_solicitudes_rechazado);
                }
                if (mensaje.estado === "Aceptada por UTC-19") {///falta
                    var total_solicitudes_proceso = parseInt($("#total_solicitudes_proceso").text()) + 1;
                    $("#total_solicitudes_proceso").text(total_solicitudes_proceso);
                }
                if (mensaje.estado === "Aceptada por CRUM") {///falta
                    var total_solicitudes_proceso = parseInt($("#total_solicitudes_proceso").text()) - 1;
                    $("#total_solicitudes_proceso").text(total_solicitudes_proceso);
                    var total_solicitudes_ruta = parseInt($("#total_solicitudes_ruta").text()) + 1;
                    $("#total_solicitudes_ruta").text(total_solicitudes_ruta);
                }
                if (mensaje.estado === "Rechazada UTC-19") {
                    var total_solicitudes_pendientes = parseInt($("#total_solicitudes_pendientes").text()) - 1;
                    $("#total_solicitudes_pendientes").text(total_solicitudes_pendientes);
                    var total_solicitudes_rechazado = parseInt($("#total_solicitudes_rechazado").text()) + 1;
                    $("#total_solicitudes_rechazado").text(total_solicitudes_rechazado);
                }
                if (mensaje.estado === "Rechazada por CRUM") {
                    var total_solicitudes_proceso = parseInt($("#total_solicitudes_proceso").text()) - 1;
                    $("#total_solicitudes_proceso").text(total_solicitudes_proceso);
                    var total_solicitudes_rechazado = parseInt($("#total_solicitudes_rechazado").text()) + 1;
                    $("#total_solicitudes_rechazado").text(total_solicitudes_rechazado);
                }
                if (mensaje.estado === "Ingresado en UTC-19") {
                    if (parseInt($("#total_solicitudes_ruta").text()) > 0) {
                        var total_solicitudes_ruta = parseInt($("#total_solicitudes_ruta").text()) - 1;
                        $("#total_solicitudes_ruta").text(total_solicitudes_ruta);
                    }
                }
            }
            if (mensaje.solicitud_traslado_rechazo) {
                //aumenta contador rechazados
                var total_solicitudes_rechazado = parseInt($("#total_solicitudes_rechazado").text()) + 1;
                $("#total_solicitudes_rechazado").text(total_solicitudes_rechazado);
            }
            if (mensaje.estadisticas) {
                //aumenta contador rechazados
                var idJson = Object.keys(mensaje);
                for (var i = 0; i < idJson.length; i++) {
                    if ($("#" + idJson[i]).length) {
                        $("#" + idJson[i]).text(mensaje[idJson[i]]);
                    }
                }
            }
        } catch (e) {
        }
    };
    //  En caso de requerir un backup
    if (WebSocketGeneral.readyState === 1) {
        var ms = {
            "fecha_calendario": fecha_calendario,
            "backup_ccb": true
        };
        EnviarMensajePorSocket(ms);
    }
}

directorio_pacientesCCB().then(function (directorio) {
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
                return  option.id.toString().padStart(4, "0") + " " + option.nombre + " " + option.apellidop_paciente + " " + option.apellidom_paciente + " Estado: " + option.estado + " " + option.fecha;
            },
            onChange(value) {

            },
            onSelect(op) {
                paciente = null;
                paciente = op;
                console.log(op);
                if ($("#" + op.id).length) {
                    document.getElementById(op.id).scrollIntoView();
                    $("#" + op.id).click();
                } else {
                    console.log("solicitar los de una fecha en especifico");
                    var ms = {
                        "folio": op.id,
                        "backup_ccb_id": true
                    };
                    EnviarMensajePorSocket(ms);

                }


            },
            onTouch() {
                console.log("Open");
                vue._data.value = null;
            }
        }
    }).$mount('#directorio_pacientesCCB');
});

var json = {
    "fecha": getFecha(),
    "hora": getHora(),
    "institucion_refiere": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre_institucion,
    "telefono_contacto_institucion": "55797461328",
    "nombre": "Rodrigo Juarez Castro",
    "apellidop_paciente": "Juarez",
    "apellidom_paciente": "Castro",
    "genero": "Masculino",
    "edad": "24",
    "fecha_nacimiento": "1992-05-05",
    "medico_refiere": "Dr. Ruben Arguero",
    "telefono_contacto": "5548592615",
    "correo_contacto": "ruben.arg@unam.com.mx",
    "comorbilidades": "Diabetes",
    "medicamentos": "insulina",
    "padecimiento": "hipertension",
    "fecha_sintomas": "2020-04-19",
    "fecha_ingreso": "2020-04-21",
    "prueba_covid": "positiva",
    "tratamiento": "El que medico indique",
    "evaluacion": "Paciente en situacion estable, con mejoria",
    "estado_actual": "Convaleciente",
    "signos_vitales": "120/80",
    "motivo_envio": "Recuperacion del paciente",
    "biometria_hematica": {
        "eritrocitos": "4",
        "hemoglobina": "5",
        "hematocrito": "3",
        "hemoglobina_corp": "2",
        "concentracion_hemoglobina": "7",
        "distribucion_erotrocitos": "4",
        "plaquetas": "5",
        "leucocitos": "8",
        "neutrofilos": "5",
        "linfocitos": "2",
        "monocitos": "1",
        "eosinofilos": "4",
        "basofilos": "7 ",
        "neutrofilos_ul": "",
        "linfocitos_ul": "",
        "monocitos_ul": "",
        "eosinofilos_ul": "",
        "basofilos_ul": ""
    },
    "quimica_sanguinea": {
        "glucosa": "9",
        "urea": "7",
        "creatinina": "8",
        "acido_urico": "9",
        "colesterol": "6",
        "trigliceridos": "3",
        "ferritina": "3",
        "dimero_d": "2",
        "troponina_i": "1",
        "ck_mb": "4",
        "ck": "6",
        "dhl": "5",
        "bnp": "8"
    },
    "electrolitos_sericos": {
        "sodio": "8",
        "potasio": "5",
        "cloro": "2",
        "calcio": "0",
        "magnesio": "3",
        "fosforo": "4"
    },
    "funcion_hepatica": {
        "bilirrubina_total": "5",
        "bilirrubina_directa": "0",
        "bilirrubina_indirecta": "0",
        "tgo": "9",
        "tgp": "4",
        "fosfatasa_alcalina": "5",
        "albumina": "8",
        "globulinas": "8",
        "relacion_ag": "8",
        "proteinas_totales": "6"
    },
    "tiempos_coagulacion": {
        "tp": "5",
        "tpt": "7",
        "tt": "4",
        "inr": "8",
        "tiempo_sangrado": "3"
    },
    "gasometria_arterial": {
        "ph": "5",
        "pao2": "7",
        "pco2": "5",
        "sato2": "3",
        "eb": "0",
        "hco3": "9",
        "lactato": "6",
        "fio2": "1"
    }
};

var idJson = Object.keys(json);
for (var i = 0; i < idJson.length; i++) {
    if ($("#" + idJson[i]).length) {
        $("#" + idJson[i]).attr("disabled", true);
    }
}
idJson = Object.keys(json.biometria_hematica);
for (var i = 0; i < idJson.length; i++) {
    if ($("#" + idJson[i]).length) {
        $("#" + idJson[i]).attr("disabled", true);
    }
}
idJson = Object.keys(json.quimica_sanguinea);
for (var i = 0; i < idJson.length; i++) {
    if ($("#" + idJson[i]).length) {
        $("#" + idJson[i]).attr("disabled", true);
    }
}
idJson = Object.keys(json.electrolitos_sericos);
for (var i = 0; i < idJson.length; i++) {
    if ($("#" + idJson[i]).length) {
        $("#" + idJson[i]).attr("disabled", true);
    }
}
idJson = Object.keys(json.funcion_hepatica);
for (var i = 0; i < idJson.length; i++) {
    if ($("#" + idJson[i]).length) {
        $("#" + idJson[i]).attr("disabled", true);
    }
}
idJson = Object.keys(json.tiempos_coagulacion);
for (var i = 0; i < idJson.length; i++) {
    if ($("#" + idJson[i]).length) {
        $("#" + idJson[i]).attr("disabled", true);
    }
}
idJson = Object.keys(json.gasometria_arterial);
for (var i = 0; i < idJson.length; i++) {
    if ($("#" + idJson[i]).length) {
        $("#" + idJson[i]).attr("disabled", true);
    }
}

function agregar_bandeja(json) {
    //console.log("Agregar en vista....");
    //console.log(json);
    var div1 = document.createElement("div");
    div1.className = "tarjeta row col-12 m-0 p-2 " + json.estado.replace(/ /gm, "") + " " + json.id;
    div1.id = json.id;
    var div2 = document.createElement("div");
    div2.className = "col-6 m-0";
    div2.innerHTML = "Referencia: " + json.id.toString().padStart(8, "0");
    var estado_div = document.createElement("div");
    estado_div.className = "col-6 m-0 pl-1 text-right";
    estado_div.id = "estado" + json.id;
    estado_div.innerHTML = json.estado;
    var div3 = document.createElement("div");
    div3.className = "row col-12 m-0";
    var div4 = document.createElement("div");
    div4.className = "col-12 m-0 p-0 label_institucion";
    div4.innerHTML = json.institucion_refiere;
    var div5 = document.createElement("div");
    div5.className = "col-6 label_fecha";
    div5.innerHTML = json.fecha;
    var div6 = document.createElement("div");
    div6.className = "col-6 label_hora";
    div6.innerHTML = json.hora;
    div3.appendChild(div4);
    div3.appendChild(div5);
    div3.appendChild(div6);
    div1.appendChild(div2);
    div1.appendChild(estado_div);
    div1.appendChild(div3);
    if (json.focus) {
        document.getElementById("sidebar2").appendChild(div1);
    } else {
        document.getElementById("sidebar2").prepend(div1);
    }

    div1.addEventListener("click", function () {
        $("#botones").empty();
        var card = $("#" + json.id);
        var barra = $(".barra");
        barra[0].className = "row col-12 barra BG" + card[0].className.substring(27, card[0].className.length - 2);
        if (!json.hasOwnProperty("ambulancia")) {
            json.ambulancia = null;
        }
        if (!json.hasOwnProperty("responsable_ambulancia_asignado")) {
            json.responsable_ambulancia_asignado = null;
        }
        if (!json.hasOwnProperty("ambulanciaSUCRE")) {
            json.ambulanciaSUCRE = null;
        }
        if (!json.hasOwnProperty("responsable_ambulancia_asignadoSUCRE")) {
            json.responsable_ambulancia_asignadoSUCRE = null;
        }
        if (card[0].className.includes("Aceptada") || card[0].className.includes("Entraslado")
                || card[0].className.includes("Ingresado") || card[0].className.includes("NoIngreso")
                || card[0].className.includes("Dadode") || card[0].className.includes("Contrarreferencia")) {
            $("#infoUTC").removeClass("d-none");
            $("#datos2").removeClass("d-none");
            $("#cama").text("");
            $("#doc_responsable").text("");
            $("#cama").text("Cama apartada: " + json.cama);
            $("#doc_responsable").text("Doctor Responsable: " + json.nombre_doctor_responsable);
            if (json.hasOwnProperty("ambulancia")
                    && json.ambulancia !== "null"
                    && json.ambulancia !== null
                    && json.ambulancia !== "") {
                $("#datos1").removeClass("d-none");
                $("#infoCRUM").removeClass("d-none");
                $("#unidad").text("");
                $("#unidad").text("Ambulancia asignada: " + json.ambulancia);
                if (json.hasOwnProperty("responsable_ambulancia_asignado")
                        && json.responsable_ambulancia_asignado !== "null"
                        && json.responsable_ambulancia_asignado !== null
                        && json.responsable_ambulancia_asignado !== "") {
                    $("#operador").text("");
                    $("#operador").text("Responsable de la Ambulancia: " + json.responsable_ambulancia_asignado);
                }
            } else {
                $("#infoCRUM").addClass("d-none");
                $("#datos1").addClass("d-none");
                $("#unidad").text("");
                $("#operador").text("");
            }
            if (json.hasOwnProperty("ambulanciaSUCRE")
                    && json.ambulanciaSUCRE !== "null"
                    && json.ambulanciaSUCRE !== null
                    && json.ambulanciaSUCRE !== "") {
                $("#datos0").removeClass("d-none");
                $("#infoSUCRE").removeClass("d-none");
                $("#unidadS").text("");
                $("#unidadS").text("Ambulancia asignada: " + json.ambulanciaSUCRE);
                if (json.hasOwnProperty("responsable_ambulancia_asignadoSUCRE")
                        && json.responsable_ambulancia_asignadoSUCRE !== "null"
                        && json.responsable_ambulancia_asignadoSUCRE !== null
                        && json.responsable_ambulancia_asignadoSUCRE !== "") {
                    $("#operadorS").text("");
                    $("#operadorS").text("Responsable de la Ambulancia: " + json.responsable_ambulancia_asignadoSUCRE);
                }
            } else {
                $("#infoSUCRE").addClass("d-none");
                $("#datos0").addClass("d-none");
                $("#unidadS").text("");
                $("#operadorS").text("");
            }
        } else {
            $("#infoUTC").addClass("d-none");
            $("#datos2").addClass("d-none");
            $("#cama").text("");
            $("#doc_responsable").text("");
            $("#infoCRUM").addClass("d-none");
            $("#datos1").addClass("d-none");
            $("#unidad").text("");
            $("#operador").text("");
            $("#infoSUCRE").addClass("d-none");
            $("#datos0").addClass("d-none");
            $("#unidadS").text("");
            $("#operadorS").text("");
        }
        var idJson = Object.keys(json);
        for (var i = 0; i < idJson.length; i++) {
            if ($("#" + idJson[i]).length) {
                $("#" + idJson[i]).attr("disabled", true);

                $("#" + idJson[i]).val(json[idJson[i]]);
                if (idJson[i] === "codigo_alta" && json[idJson[i]] !== null) {
                    $("#codigo_alta").val("Contraseña Paciente: " + json[idJson[i]]);
                }

            }
        }
        if (json.hasOwnProperty("biometria_hematica")) {
            idJson = Object.keys(json.biometria_hematica);
            for (var i = 0; i < idJson.length; i++) {
                if ($("#" + idJson[i]).length) {
                    $("#" + idJson[i]).attr("disabled", true);
                    $("#" + idJson[i]).val(json.biometria_hematica[idJson[i]]);
                }
            }
        }
        if (json.hasOwnProperty("quimica_sanguinea")) {
            idJson = Object.keys(json.quimica_sanguinea);
            for (var i = 0; i < idJson.length; i++) {
                if ($("#" + idJson[i]).length) {
                    $("#" + idJson[i]).attr("disabled", true);
                    $("#" + idJson[i]).val(json.quimica_sanguinea[idJson[i]]);

                }
            }
        }
        if (json.hasOwnProperty("electrolitos_sericos")) {
            idJson = Object.keys(json.electrolitos_sericos);
            for (var i = 0; i < idJson.length; i++) {
                if ($("#" + idJson[i]).length) {
                    $("#" + idJson[i]).attr("disabled", true);
                    $("#" + idJson[i]).val(json.electrolitos_sericos[idJson[i]]);
                }
            }
        }
        if (json.hasOwnProperty("funcion_hepatica")) {
            idJson = Object.keys(json.funcion_hepatica);
            for (var i = 0; i < idJson.length; i++) {
                if ($("#" + idJson[i]).length) {
                    $("#" + idJson[i]).attr("disabled", true);
                    $("#" + idJson[i]).val(json.funcion_hepatica[idJson[i]]);
                }
            }
        }
        if (json.hasOwnProperty("tiempos_coagulacion")) {
            idJson = Object.keys(json.tiempos_coagulacion);
            for (var i = 0; i < idJson.length; i++) {
                if ($("#" + idJson[i]).length) {
                    $("#" + idJson[i]).attr("disabled", true);
                    $("#" + idJson[i]).val(json.tiempos_coagulacion[idJson[i]]);
                }
            }
        }
        if (json.hasOwnProperty("gasometria_arterial")) {
            idJson = Object.keys(json.gasometria_arterial);
            for (var i = 0; i < idJson.length; i++) {
                if ($("#" + idJson[i]).length) {
                    $("#" + idJson[i]).attr("disabled", true);
                    $("#" + idJson[i]).val(json.gasometria_arterial[idJson[i]]);
                }
            }
        }
        ///////Calculo de esdad
        var hoy = new Date();
        var cumpleanos = new Date(json.fecha_nacimiento);
        var edad = hoy.getFullYear() - cumpleanos.getFullYear();
        var m = hoy.getMonth() - cumpleanos.getMonth();
        if (m < 0 || (m == 0 && hoy.getDate() < cumpleanos.getDate())) {
            edad--;
            $("#edad").val(edad);
        }
        //Nombre del paciente
        $("#nombre").val(json.nombre + " " + json.apellidop_paciente + " " + json.apellidom_paciente);
        //Nombre del familiar
        $("#nombre_responsable").val(json.nombre_responsable + " " + json.apellidop_responsable + " " + json.apellidom_responsable);
        //Folio
        $("#id").val("Referencia: " + json.id.toString().padStart(8, "0"));
        if ($("#codigo").length) {
            $("#codigo").val("Contraseña Familiares: " + json.codigo);
        }
        $("#fecha").val("Fecha: " + json.fecha);
        var aceptar = document.createElement("input");
        aceptar.type = "button";
        aceptar.id = "btnaceptar";
        aceptar.className = "btn btn-danger boton";
        aceptar.value = "Aceptar";
        var rechazar = document.createElement("input");
        rechazar.type = "button";
        rechazar.className = "btn btn-danger boton";
        rechazar.id = "btnrechazar";
        rechazar.value = "No Aceptar";
        $("#btnaceptar").remove();
        $("#btnrechazar").remove();
        aceptar.addEventListener("click", function () {
            json.bandera_estado = true;
            json.fecha_cambio = getFecha();
            json.hora_cambio = getHora();
            var doctor_responsable = {};
            var tel_a_agregar = new Array();
            ConsultarDirectorioCCB().then(function (directorio) {
                Swal.fire({
                    title: 'Asignación',
                    html: '<label class="sweetalrt" style="padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;">Cama Asignada.</label>' +
                            '<input type="text" id="camaSwal" style="width: 90%;padding: 5px;font: bold 1rem Arial;border-radius: 5px;border: none;text-align: center;">' +
                            '<label class="sweetalrt" style="padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;">Doctor Responsable.</label>' +
                            '<div class="col-12" id="doct_responsable">' +
                            '<multiselect ' +
                            'placeholder=""' +
                            'v-model="value" ' +
                            ':options="options"' +
                            'track-by="Nombre"' +
                            ':multiple="false"' +
                            ':taggable="true"' +
                            ':close-on-select="true"' +
                            ':custom-label="customLabel_doc_responsable" ' +
                            ':select-label="\'Seleccionar\'" ' +
                            ':selected-Label="\'Seleccionado\'"' +
                            ':deselect-Label="\'Remover\'"' +
                            ':hide-selected="true"' +
                            '@select="onSelect_doc_responsable"' +
                            '@Close="onClose_doc_responsable"' +
                            '@Remove="onRemove_doc_responsable">' +
                            '</multiselect>' +
                            '<pre class="language-json" style="display:none"><code>{{ value  }}</code></pre>' +
                            '</div>' +
                            '<label class="sweetalrt" style="padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;">Posible Fecha de Recepcion de Paciente</label>' +
                            '<input type="date" id="fecha_recepcion" style="width: 90%;padding: 5px;font: bold 1rem Arial;border-radius: 5px;border: none;text-align: center;">' +
                            '<label class="sweetalrt" style="padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;">Posible Hora de Recepcion de Paciente</label>' +
                            '<input type="time" id="hora_recepcion" style="width: 90%;padding: 5px;font: bold 1rem Arial;border-radius: 5px;border: none;text-align: center;">',
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonText: "Enviar",
                    preConfirm: () => {
                        return [
                            document.getElementById('camaSwal').value,
                            document.getElementById('fecha_recepcion').value,
                            document.getElementById('hora_recepcion').value
                        ];
                    }
                }).then((result) => {
                    if (result.value) {
                        var personal_ccb = new Array();
                        json.personal_ccb = personal_ccb;
                        // agregamos al doctor responsable al json
                        if (doctor_responsable.hasOwnProperty("idUsuario")) {
                            json.doctor_responsable = doctor_responsable.idUsuario;
                        } else {
                            json.doctor_responsable = "";
                        }
                        if (doctor_responsable.hasOwnProperty("Nombre")) {
                            json.nombre_doctor_responsable = doctor_responsable.Nombre;
                        } else {
                            json.nombre_doctor_responsable = "";
                        }
                        //agregamos la cama el json
                        console.log("#############");
                        console.log(result);
                        console.log(result.value);
                        json.cama = result.value[0];
                        //Agregamos la fecha y hora de recepcion
                        json.fecha_recepcion = result.value[1] !== "" ? result.value[1] : "NULL";
                        json.hora_recepcion = result.value[2] !== "" ? result.value[2] : "NULL";
                        cambio_estado_ccb(json);
                        $("#btnaceptar").remove();
                        $("#btnrechazar").remove();
                    }
                });
                // doctor_responsable
                let vue3 = new Vue({
                    components: {
                        Multiselect: window.VueMultiselect.default
                    },
                    data: {
                        value: [
                        ],
                        options: directorio
                    },
                    methods: {
                        customLabel_doc_responsable(option) {
                            return  option.Nombre + " " + option.idUsuario;
                        },
                        onSelect_doc_responsable(op) {
                            doctor_responsable = (op);
                        },
                        onClose_doc_responsable() {
                            ////console.info(this.value);
                        },
                        onRemove_doc_responsable(op) {
                            doctor_responsable = "";
                        }
                    }
                }).$mount('#doct_responsable');
            });
        });
        rechazar.addEventListener("click", function () {
            json.bandera_estado = false;
            json.fecha_cambio = getFecha();
            json.hora_cambio = getHora();
            cambio_estado_ccb(json);
            $("#btnaceptar").remove();
            $("#btnrechazar").remove();
        });
        // revisar la clase para validar inclucion de botones
        var card = $("#" + json.id);
        /*
         - Enviada
         - RechazadaUTC-19
         - AceptadaporUTC-19
         - AceptadaporCRUM
         - RechazadaporCRUM
         - IngresadoenUTC-19
         - NoingresoenUTC-19
         */

        if (JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).ccb === "1") {
            if (card[0].className.includes("AceptadaporUTC-19")) {
                $("#botones").empty();
                var btnrecepcion = document.createElement("input");
                btnrecepcion.id = "btnrecepcion";
                btnrecepcion.type = "button";
                btnrecepcion.className = "btn btn-danger boton";
                btnrecepcion.value = "Notificar Ingreso";

                btnrecepcion.addEventListener("click", function () {
                    if ($("#btnPersonal").length) {
                        Swal.fire({
                            title: 'Alto',
                            html: "<br><p style='color:white;'>Primero debe asignar personal medico.</p>",
                            focusConfirm: false,
                            showCancelButton: false,
                            confirmButtonText: "Continuar"
                        });
                    } else {
                        Swal.fire({
                            title: 'Notificar Ingreso',
                            html: "<br><p style='color:white;text-align:center;'>Esta apunto de notificarle a " + json.institucion_refiere + " que el paciente \n\
                                    " + json.nombre + " " + json.apellidop_paciente + " " + json.apellidom_paciente + " fue ingresado en la UTC-19</p>\n\
                                    <label class='sweetalrt' style='padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;'>¿Cambiar cama Asignada?</label>\n\
                                    <input class='' type='text' value='" + $("#cama").val() + "' id='camaSwal' style='width: 90%;padding: 5px;font: bold 1rem Arial;border-radius: 5px;border: none;text-align: center;'>\n\
                                    <br><br> <p style='color:white;text-align:center;'>¿Esta informacion es correcta?</p>",
                            focusConfirm: false,
                            showCancelButton: true,
                            confirmButtonText: "Notificar",
                            preConfirm: () => {
                                return [
                                    document.getElementById('camaSwal').value
                                ];
                            }
                        }).then((result) => {
                            if (result.value) {
                                //Se notifica el cambio de estado
                                if (!json.hasOwnProperty("personal_ccb")) {
                                    json.personal_ccb = new Array();
                                }
                                if (!json.hasOwnProperty("doctor_responsable")) {
                                    json.doctor_responsable = "";
                                }
                                console.log(result.value);
                                json.fecha_cambio = getFecha();
                                json.hora_cambio = getHora();
                                json.cama = result.value[0];
                                recepcion_paciente(json);
                                $("#btnrecepcion").remove();
                            }
                        });
                    }
                });
                //Boton para agregar a el personal
                var btnPersonal = document.createElement("input");
                btnPersonal.id = "btnPersonal";
                btnPersonal.className = "btn btn-danger boton";
                btnPersonal.type = "button";
                btnPersonal.value = "Asignar Personal";
                btnPersonal.addEventListener("click", function () {
                    var tel_a_agregar = new Array();
                    ConsultarDirectorioCCB().then(function (directorio) {
                        Swal.fire({
                            title: 'Asignar Personal',
                            html: '<label class="sweetalrt" style="padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;">Asignar personal medico.</label>' +
                                    '<div class="col-12" id="agregarPersonal">' +
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
                            confirmButtonText: "Asignar"
                        }).then((result) => {
                            if (result.value) {
                                //recorremos tel_a_agregar para obtener el personal_ccb
                                var personal_ccb = new Array();
                                $.each(tel_a_agregar, function (i) {
                                    personal_ccb.push(tel_a_agregar[i].idUsuario);
                                });
                                json.personal_ccb = personal_ccb;
                                //Se notifica sobre personal asignado
                                notifica_involucrados(json);
                                $("#btnPersonal").remove();
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
                                    return  option.Nombre + " " + option.idUsuario;
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
                        }).$mount('#agregarPersonal');
                    });
                });

                //boton para cancelar la solicitud
                var btnCancelada = document.createElement("input");
                btnCancelada.id = "btnCancelada";
                btnCancelada.className = "btn btn-danger boton";
                btnCancelada.type = "button";
                btnCancelada.value = "Cancelar Solicitud";
                btnCancelada.addEventListener("click", function () {
                    Swal.fire({
                        title: 'Cancelar Solicitud',
                        html: "<br><p style='color:white;text-align:center;'>Esta a punto de cancelar la solicitud</p>\n\
                               <br><p style='color:white;text-align:center;'>¿Esta seguro?</p>",
                        focusConfirm: false,
                        showCancelButton: true,
                        confirmButtonText: "Continuar"
                    }).then((result) => {
                        if (result.value) {
                            json.fecha_cambio = getFecha();
                            json.hora_cambio = getHora();
                            cancelar_solicitud(json);
                            $("#btnCancelada").remove();
                            $("#btnPersonal").remove();
                            $("#btnrecepcion").remove();
                        }
                    });
                });

                $("#botones").append(btnPersonal);
                $("#botones").append(btnrecepcion);
                $("#botones").append(btnCancelada);
            } else if (card[0].className.includes("Entraslado")) {
                $("#botones").empty();
                var btnrecepcion = document.createElement("input");
                btnrecepcion.id = "btnrecepcion";
                btnrecepcion.type = "button";
                btnrecepcion.className = "btn btn-danger boton";
                btnrecepcion.value = "Notificar Recepción";
                btnrecepcion.addEventListener("click", function () {
                    if ($("#btnPersonal").length) {
                        Swal.fire({
                            title: 'Alto',
                            html: "<br><p style='color:white;'>Primero debe asignar personal medico.</p>",
                            focusConfirm: false,
                            showCancelButton: false,
                            confirmButtonText: "Continuar"
                        });
                    } else {
                        Swal.fire({
                            title: 'Notificar Ingreso',
                            html: "<br><p style='color:white;text-align:center;'>Esta apunto de notificarle a " + json.institucion_refiere + " que el paciente \n\
                                    " + json.nombre + " " + json.apellidop_paciente + " " + json.apellidom_paciente + " fue ingresado en la UTC-19</p>\n\
                                    <label class='sweetalrt' style='padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;'>¿Cambiar cama Asignada?</label>\n\
                                    <input class='' type='text' value='" + $("#cama").val() + "' id='camaSwal' style='width: 90%;padding: 5px;font: bold 1rem Arial;border-radius: 5px;border: none;text-align: center;'>\n\
                                    <br><br> <p style='color:white;text-align:center;'>¿Esta informacion es correcta?</p>",
                            focusConfirm: false,
                            showCancelButton: true,
                            confirmButtonText: "Notificar",
                            preConfirm: () => {
                                return [
                                    document.getElementById('camaSwal').value
                                ];
                            }
                        }).then((result) => {
                            if (result.value) {
                                //Se notifica el cambio de estado
                                if (!json.hasOwnProperty("personal_ccb")) {
                                    json.personal_ccb = new Array();
                                }
                                if (!json.hasOwnProperty("doctor_responsable")) {
                                    json.doctor_responsable = "";
                                }
                                json.fecha_cambio = getFecha();
                                json.hora_cambio = getHora();
                                json.cama = result.value[0];
                                recepcion_paciente(json);
                                $("#btnrecepcion").remove();
                            }
                        });
                    }
                });
                //Boton para agregar a el personal
                var btnPersonal = document.createElement("input");
                btnPersonal.id = "btnPersonal";
                btnPersonal.className = "btn btn-danger boton";
                btnPersonal.type = "button";
                btnPersonal.value = "Asignar Personal";
                btnPersonal.addEventListener("click", function () {
                    var tel_a_agregar = new Array();
                    ConsultarDirectorioCCB().then(function (directorio) {
                        Swal.fire({
                            title: 'Asignar Personal',
                            html: '<label class="sweetalrt" style="padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;">Asignar personal medico.</label>' +
                                    '<div class="col-12" id="agregarPersonal">' +
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
                            confirmButtonText: "Asignar"
                        }).then((result) => {
                            if (result.value) {
                                //recorremos tel_a_agregar para obtener el personal_ccb
                                var personal_ccb = new Array();
                                $.each(tel_a_agregar, function (i) {
                                    personal_ccb.push(tel_a_agregar[i].idUsuario);
                                });
                                json.personal_ccb = personal_ccb;
                                //Se notifica sobre personal asignado
                                notifica_involucrados(json);
                                $("#btnPersonal").remove();
                            }
                        });

                        //tels_agregar
                        let vue2 = new Vue({
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
                                    return  option.Nombre + " " + option.idUsuario;
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
                        }).$mount('#agregarPersonal');
                    });
                });

                //boton para cancelar la solicitud
                var btnCancelada = document.createElement("input");
                btnCancelada.id = "btnCancelada";
                btnCancelada.className = "btn btn-danger boton";
                btnCancelada.type = "button";
                btnCancelada.value = "Cancelar Solicitud";
                btnCancelada.addEventListener("click", function () {
                    Swal.fire({
                        title: 'Cancelar Solicitud',
                        html: "<br><p style='color:white;text-align:center;'>Esta a punto de cancelar la solicitud</p>\n\
                               <br><p style='color:white;text-align:center;'>¿Esta seguro?</p>",
                        focusConfirm: false,
                        showCancelButton: true,
                        confirmButtonText: "Continuar"
                    }).then((result) => {
                        if (result.value) {
                            json.fecha_cambio = getFecha();
                            json.hora_cambio = getHora();
                            cancelar_solicitud(json);
                            $("#btnCancelada").remove();
                            $("#btnPersonal").remove();
                            $("#btnrecepcion").remove();
                        }
                    });
                });

                $("#botones").append(btnPersonal);
                $("#botones").append(btnrecepcion);
                $("#botones").append(btnCancelada);
            } else if (card[0].className.includes("AceptadaporCRUM") || card[0].className.includes("AceptadaporSUCRE")) {
                $("#botones").empty();
                //Boton para agregar a el personal
                var btnPersonal = document.createElement("input");
                btnPersonal.id = "btnPersonal";
                btnPersonal.className = "btn btn-danger boton";
                btnPersonal.type = "button";
                btnPersonal.value = "Asignar Personal";
                btnPersonal.addEventListener("click", function () {
                    var tel_a_agregar = new Array();
                    ConsultarDirectorioCCB().then(function (directorio) {
                        Swal.fire({
                            title: 'Asignar Personal',
                            html: '<label class="sweetalrt" style="padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;">Asignar personal medico.</label>' +
                                    '<div class="col-12" id="agregarPersonal">' +
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
                            confirmButtonText: "Asignar"
                        }).then((result) => {
                            if (result.value) {
                                //recorremos tel_a_agregar para obtener el personal_ccb
                                var personal_ccb = new Array();
                                $.each(tel_a_agregar, function (i) {
                                    personal_ccb.push(tel_a_agregar[i].idUsuario);
                                });
                                json.personal_ccb = personal_ccb;
                                //Se notifica sobre personal asignado
                                notifica_involucrados(json);
                                $("#btnPersonal").remove();
                            }
                        });
                        //tels_agregar
                        let vue3 = new Vue({
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
                                    return  option.Nombre + " " + option.idUsuario;
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
                        }).$mount('#agregarPersonal');
                    });
                });
                var btnrecepcion = document.createElement("input");
                btnrecepcion.id = "btnrecepcion";
                btnrecepcion.type = "button";
                btnrecepcion.className = "btn btn-danger boton";
                btnrecepcion.value = "Notificar Ingreso";
                btnrecepcion.addEventListener("click", function () {
                    if ($("#btnPersonal").length) {
                        Swal.fire({
                            title: 'Alto',
                            html: "<br><p style='color:white;'>Primero debe asignar personal medico.</p>",
                            focusConfirm: false,
                            showCancelButton: false,
                            confirmButtonText: "Continuar"
                        });
                    } else {
                        Swal.fire({
                            title: 'Notificar Ingreso',
                            html: "<br><p style='color:white;text-align:center;'>Esta apunto de notificarle a " + json.institucion_refiere + " que el paciente \n\
                                    " + json.nombre + " " + json.apellidop_paciente + " " + json.apellidom_paciente + " fue ingresado en la UTC-19</p>\n\
                                    <label class='sweetalrt' style='padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;'>¿Cambiar cama Asignada?</label>\n\
                                    <input class='' type='text' value='" + $("#cama").val() + "' id='camaSwal' style='width: 90%;padding: 5px;font: bold 1rem Arial;border-radius: 5px;border: none;text-align: center;'>\n\
                                    <br><br> <p style='color:white;text-align:center;'>¿Esta informacion es correcta?</p>",
                            focusConfirm: false,
                            showCancelButton: true,
                            confirmButtonText: "Notificar",
                            preConfirm: () => {
                                return [
                                    document.getElementById('camaSwal').value
                                ];
                            }
                        }).then((result) => {
                            if (result.value) {
                                //Se notifica el cambio de estado
                                if (!json.hasOwnProperty("personal_ccb")) {
                                    json.personal_ccb = new Array();
                                }
                                if (!json.hasOwnProperty("doctor_responsable")) {
                                    json.doctor_responsable = "";
                                }
                                json.fecha_cambio = getFecha();
                                json.hora_cambio = getHora();
                                json.cama = result.value[0];
                                recepcion_paciente(json);
                                $("#btnrecepcion").remove();
                            }
                        });
                    }
                });

                //boton para cancelar la solicitud
                var btnCancelada = document.createElement("input");
                btnCancelada.id = "btnCancelada";
                btnCancelada.className = "btn btn-danger boton";
                btnCancelada.type = "button";
                btnCancelada.value = "Cancelar Solicitud";
                btnCancelada.addEventListener("click", function () {
                    Swal.fire({
                        title: 'Cancelar Solicitud',
                        html: "<br><p style='color:white;text-align:center;'>Esta a punto de cancelar la solicitud</p>\n\
                               <br><p style='color:white;text-align:center;'>¿Esta seguro?</p>",
                        focusConfirm: false,
                        showCancelButton: true,
                        confirmButtonText: "Continuar"
                    }).then((result) => {
                        if (result.value) {
                            json.fecha_cambio = getFecha();
                            json.hora_cambio = getHora();
                            cancelar_solicitud(json);
                            $("#btnCancelada").remove();
                            $("#btnPersonal").remove();
                            $("#btnrecepcion").remove();
                        }
                    });
                });

                $("#botones").append(btnPersonal);
                $("#botones").append(btnrecepcion);
                $("#botones").append(btnCancelada);
            } else if (card[0].className.includes("Ingresado")) {
                $("#botones").empty();
                var btnAlta = document.createElement("input");
                btnAlta.className = "btn btn-danger boton";
                btnAlta.id = "btnAlta";
                btnAlta.value = "Notificar Alta Paciente";
                btnAlta.type = "button";
                btnAlta.addEventListener("click", function () {
                    Swal.fire({
                        title: 'Notificar Alta Paciente',
                        html: "<br><p style='color:white;text-align:center;'>Esta apunto de notificar el alta de " + json.nombre + " " + json.apellidop_paciente + " " + json.apellidom_paciente + "</p>\n\
\n\                              <label class='sweetalrt' style='padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;'>¿Ingrese un número telefonico del paciente?</label>\n\
                                  <input class='' type='text'  id='telefono_paciente' style='width: 90%;padding: 5px;font: bold 1rem Arial;border-radius: 5px;border: none;text-align: center;' required='true'>\n\
                                <br> <p style='color:white;text-align:center;'>¿Esta información es correcta?</p>",
                        focusConfirm: false,
                        showCancelButton: true,
                        confirmButtonText: "Notificar Alta",
                        preConfirm: () => {
                            return [
                                $("#telefono_paciente").val()//agregar a base de datos solicitudes telefono_paciente ademas de codigo_alta
                            ];
                        }
                    }).then((result) => {
                        if (result.value) {
                            if (result.value[0] !== "") {
                                //Se notifica el cambio de estado
                                json.telefono_paciente = result.value[0];
                                notificar_alta(json).then(function (response) {
                                    $("#codigo_alta").val("Contraseña Paciente: " + response.codigo_alta);
                                    Swal.fire({
                                        title: 'Exito',
                                        html: "<br><p style='color:white;'>La contraseña para la vinculacion del paciente es: " + response.codigo_alta + ".</p>",
                                        focusConfirm: false,
                                        showCancelButton: false,
                                        confirmButtonText: "Continuar"
                                    });
                                });// va devolver un codigo_alta generateString().substring(0, 8));
                                $("#btnAlta").remove();
                                $("#btnRegresarHospital").remove();
                            } else {
                                Swal.fire({
                                    title: 'Alto',
                                    html: "<br><p style='color:white;'>Es necesario ingresar un telefono movil del paciente para poder notificar su alta.</p>",
                                    focusConfirm: false,
                                    showCancelButton: false,
                                    confirmButtonText: "Continuar"
                                });
                            }
//                            //Se notifica el cambio de estado
//                            json.telefono_paciente = result.value[0];
//                            notificar_alta(json).then(function (response) {
//                                $("codigo_alta").val("Codigo de alta: " + response.codigo_alta);
//                            });// va devolver un codigo_alta generateString().substring(0, 8));
//                            $("#btnAlta").remove();
//                            $("#btnRegresarHospital").remove();
                        }
                    });
                });
                var btnRegresarHospital = document.createElement("input");
                btnRegresarHospital.id = "btnRegresarHospital";
                btnRegresarHospital.className = "btn btn-danger boton";
                btnRegresarHospital.type = "button";
                btnRegresarHospital.value = "Contrarreferencia";
                btnRegresarHospital.addEventListener("click", function () {
                    Swal.fire({
                        title: 'Contrarreferencia',
                        html: "<br><p style='color:white;text-align:center;'>Esta apunto de notificar al " + json.institucion_refiere + "\
                                    que " + json.nombre + " " + json.apellidop_paciente + " " + json.apellidom_paciente + " será enviado a una institución médica.</p>\n\
                                    <br> <p style='color:white;text-align:center;'>¿Esta información es correcta?</p>",
                        focusConfirm: false,
                        showCancelButton: true,
                        confirmButtonText: "Notificar"
                    }).then((result) => {
                        if (result.value) {
                            //Se notifica el cambio de estado
                            notificar_regreso(json);
                            $("#btnAlta").remove();
                            $("#btnRegresarHospital").remove();
                        }
                    });
                });

                //boton para cancelar la solicitud
                var btnCancelada = document.createElement("input");
                btnCancelada.id = "btnCancelada";
                btnCancelada.className = "btn btn-danger boton";
                btnCancelada.type = "button";
                btnCancelada.value = "Cancelar Solicitud";
                btnCancelada.addEventListener("click", function () {
                    Swal.fire({
                        title: 'Cancelar Solicitud',
                        html: "<br><p style='color:white;text-align:center;'>Esta a punto de cancelar la solicitud</p>\n\
                               <br><p style='color:white;text-align:center;'>¿Esta seguro?</p>",
                        focusConfirm: false,
                        showCancelButton: true,
                        confirmButtonText: "Continuar"
                    }).then((result) => {
                        if (result.value) {
                            json.fecha_cambio = getFecha();
                            json.hora_cambio = getHora();
                            cancelar_solicitud(json);
                            $("#btnCancelada").remove();
                            $("#btnAlta").remove();
                            $("#btnRegresarHospital").remove();
                        }
                    });
                });

                $("#botones").append(btnAlta);
                $("#botones").append(btnRegresarHospital);
                $("#botones").append(btnCancelada);
            } else if (card[0].className.includes("Rechazada")) {
                var btnQuitarRechazo = document.createElement("input");
                btnQuitarRechazo.id = "btnQuitarRechazo";
                btnQuitarRechazo.className = "btn btn-danger boton";
                btnQuitarRechazo.type = "button";
                btnQuitarRechazo.value = "Quitar Rechazo";
                btnQuitarRechazo.addEventListener("click", function () {
                    Swal.fire({
                        title: 'Quitar Rechazo',
                        html: "<br><p style='color:white;text-align:center;'>Esta a punto de quitar el rechazo de esta solicitud</p>\n\
                               <br><p style='color:white;text-align:center;'>¿Esta seguro?</p>",
                        focusConfirm: false,
                        showCancelButton: true,
                        confirmButtonText: "Continuar"
                    }).then((result) => {
                        if (result.value) {
                            json.fecha_cambio = getFecha();
                            json.hora_cambio = getHora();
                            quitar_rechazo(json);
                            $("#btnQuitarRechazo").remove();
                        }
                    });
                });
                $("#botones").append(btnQuitarRechazo);
            } else if (!(card[0].className.includes("Rechazada")
                    || card[0].className.includes("Cancelada")
                    || card[0].className.includes("Noingreso")
                    || card[0].className.includes("AceptadaporCRUM")
                    || card[0].className.includes("AceptadaporSUCRE")
                    || card[0].className.includes("Dadode")
                    || card[0].className.includes("Contrarreferencia")
                    || card[0].className.includes("Ingresado"))) {
                $("#botones").empty();
                $("#botones").append(rechazar);
                $("#botones").append(aceptar);
            }
        }
        if (relacion_cp.hasOwnProperty(json.id)) {
            if (relacion_cp[json.id].hasOwnProperty("cama")) {
                $("#infoUTC").removeClass("d-none");
                $("#datos2").removeClass("d-none");
                $("#cama").text("");
                $("#cama").text("Cama apartada: " + relacion_cp[json.id].cama);
                json.cama = relacion_cp[json.id].cama;
                if (relacion_cp[json.id].hasOwnProperty("nombre_doctor_responsable")) {
                    $("#doc_responsable").text("");
                    $("#doc_responsable").text("Doctor Responsable: " + relacion_cp[json.id].nombre_doctor_responsable);
                    json.nombre_doctor_responsable = relacion_cp[json.id].nombre_doctor_responsable;
                }
            }
            if (relacion_cp[json.id].hasOwnProperty("ambulancia")
                    && relacion_cp[json.id].ambulancia !== "null"
                    && relacion_cp[json.id].ambulancia !== null
                    && relacion_cp[json.id].ambulancia !== undefined) {
                $("#datos1").removeClass("d-none");
                $("#infoCRUM").removeClass("d-none");
                $("#unidad").text("");
                $("#unidad").text("Ambulancia asignada: " + relacion_cp[json.id].ambulancia);
                json.ambulancia = relacion_cp[json.id].ambulancia;
                if (relacion_cp[json.id].hasOwnProperty("responsable_ambulancia_asignado")
                        && relacion_cp[json.id].responsable_ambulancia_asignado !== "null"
                        && relacion_cp[json.id].responsable_ambulancia_asignado !== null
                        && relacion_cp[json.id].responsable_ambulancia_asignado !== undefined) {
                    $("#operador").text("");
                    $("#operador").text("Responsable de la Ambulancia: " + relacion_cp[json.id].responsable_ambulancia_asignado);
                    json.responsable_ambulancia_asignado = relacion_cp[json.id].responsable_ambulancia_asignado;
                }
            }
            if (relacion_cp[json.id].hasOwnProperty("ambulanciaSUCRE")
                    && relacion_cp[json.id].ambulanciaSUCRE !== "null"
                    && relacion_cp[json.id].ambulanciaSUCRE !== null
                    && relacion_cp[json.id].ambulanciaSUCRE !== undefined) {
                $("#datos0").removeClass("d-none");
                $("#infoSUCRE").removeClass("d-none");
                $("#unidadS").text("");
                $("#unidadS").text("Ambulancia asignada: " + relacion_cp[json.id].ambulanciaSUCRE);
                json.ambulanciaSUCRE = relacion_cp[json.id].ambulanciaSUCRE;
                if (relacion_cp[json.id].hasOwnProperty("responsable_ambulancia_asignadoSUCRE")
                        && relacion_cp[json.id].responsable_ambulancia_asignadoSUCRE !== "null"
                        && relacion_cp[json.id].responsable_ambulancia_asignadoSUCRE !== null
                        && relacion_cp[json.id].responsable_ambulancia_asignadoSUCRE !== undefined) {
                    $("#operadorS").text("");
                    $("#operadorS").text("Responsable de la Ambulancia: " + relacion_cp[json.id].responsable_ambulancia_asignadoSUCRE);
                    json.responsable_ambulancia_asignadoSUCRE = relacion_cp[json.id].responsable_ambulancia_asignadoSUCRE;
                }
            }
            $("#estado" + json.id).text("");
            $("#estado" + json.id).text(relacion_cp[json.id].estado);
            json.estado = relacion_cp[json.id].estado;
        }
    });

    if (json.focus) {
        document.getElementById(json.id).scrollIntoView();
        $("#" + json.id).click();
    }
}

function actualiza_bandeja(json) {
    console.log("Se actualiza la terjeta....");
    console.log(json);
    var tarjeta = document.getElementById(json.id);
    tarjeta.className = "tarjeta row col-12 m-0 p-2 " + json.estado.toString().replace(/ /gm, "") + " " + json.id;
    var card = $("#" + json.id);
    if (card[0].className.includes("Aceptada") || card[0].className.includes("Entraslado")
            || card[0].className.includes("Ingresado") || card[0].className.includes("NoIngreso")
            || card[0].className.includes("Dadode") || card[0].className.includes("Contrarreferencia")) {
        $("#infoUTC").removeClass("d-none");
        $("#datos2").removeClass("d-none");
        $("#cama").text("");
        $("#doc_responsable").text("");
        $("#cama").text("Cama apartada: " + json.cama);
        $("#doc_responsable").text("Doctor Responsable: " + json.nombre_doctor_responsable);
        var rel_cd = {
            "cama": json.cama,
            "nombre_doctor_responsable": json.nombre_doctor_responsable,
            "ambulancia": json.ambulancia,
            "responsable_ambulancia_asignado": json.responsable_ambulancia_asignado,
            "estado": json.estado
        };
        if (json.hasOwnProperty("ambulancia")
                && json.ambulancia !== "null"
                && json.ambulancia !== null) {
            $("#datos1").removeClass("d-none");
            $("#infoCRUM").removeClass("d-none");
            $("#unidad").text("");
            $("#unidad").text("Ambulancia asignada: " + json.ambulancia);
            rel_cd.ambulancia = json.ambulancia;
            if (json.hasOwnProperty("responsable_ambulancia_asignado")
                    && json.responsable_ambulancia_asignado !== "null"
                    && json.responsable_ambulancia_asignado !== null) {
                $("#operador").text("");
                $("#operador").text("Responsable de la Ambulancia: " + json.responsable_ambulancia_asignado);
                rel_cd.responsable_ambulancia_asignado = json.responsable_ambulancia_asignado;
            }
        }
        if (json.hasOwnProperty("ambulanciaSUCRE")
                && json.ambulanciaSUCRE !== "null"
                && json.ambulanciaSUCRE !== null) {
            $("#datos0").removeClass("d-none");
            $("#infoSUCRE").removeClass("d-none");
            $("#unidadS").text("");
            $("#unidadS").text("Ambulancia asignada: " + json.ambulanciaSUCRE);
            rel_cd.ambulanciaSUCRE = json.ambulanciaSUCRE;
            if (json.hasOwnProperty("responsable_ambulancia_asignadoSUCRE")
                    && json.responsable_ambulancia_asignadoSUCRE !== "null"
                    && json.responsable_ambulancia_asignadoSUCRE !== null) {
                $("#operadorS").text("");
                $("#operadorS").text("Responsable de la Ambulancia: " + json.responsable_ambulancia_asignadoSUCRE);
                rel_cd.responsable_ambulancia_asignadoSUCRE = json.responsable_ambulancia_asignadoSUCRE;
            }
        }

        relacion_cp[json.id] = rel_cd;
    } else {
        $("#infoUTC").addClass("d-none");
        $("#datos2").addClass("d-none");
        $("#cama").text("");
        $("#doc_responsable").text("");
        $("#infoCRUM").addClass("d-none");
        $("#datos1").addClass("d-none");
        $("#unidad").text("");
        $("#operador").text("");
        $("#infoSUCRE").addClass("d-none");
        $("#datos0").addClass("d-none");
        $("#unidadS").text("");
        $("#operadorS").text("");
        var rel_cd = {
            "estado": json.estado
        };
        relacion_cp[json.id] = rel_cd;
    }
    $("#" + json.id).click();
}

function cambio_estado_ccb(json) {
    json.tipo_usuario = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario;
    json.tipo_servicio = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio;
    json.nombre_institucion = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre_institucion;
    json.proyecto = window.location.origin + "/" + DEPENDENCIA;
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/cambio_estado_ccb',
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        "data": JSON.stringify(json),
        success: function (response) {
            //console.log(response);
        },
        error: function (err) {
            console.error(err);
        }
    }));
}

function ConsultarDirectorioCCB() {
    return Promise.resolve($.ajax({
        type: 'GET',
        url: '/' + DEPENDENCIA + '/API/directorioCCB',
        contentType: "application/json;charset=UTF-8",
        success: function (response) {
            ////console.info(response);|
        },
        error: function (err) {
            console.error(err);
        }
    }));

}

function quitar_rechazo(json) {
    json.tipo_usuario = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario;
    json.tipo_servicio = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio;
    json.nombre_institucion = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre_institucion;
    json.proyecto = window.location.origin + "/" + DEPENDENCIA;
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/quitar_rechazo',
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        "data": JSON.stringify(json),
        success: function (response) {
            //console.log(response);
        },
        error: function (err) {
            console.error(err);
        }
    }));
}
function cancelar_solicitud(json) {
    json.tipo_usuario = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario;
    json.tipo_servicio = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio;
    json.nombre_institucion = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre_institucion;
    json.proyecto = window.location.origin + "/" + DEPENDENCIA;
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/cancelar_solicitud',
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        "data": JSON.stringify(json),
        success: function (response) {
            //console.log(response);
        },
        error: function (err) {
            console.error(err);
        }
    }));
}

function recepcion_paciente(json) {
    json.tipo_usuario = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario;
    json.tipo_servicio = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio;
    json.nombre_institucion = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre_institucion;
    json.proyecto = window.location.origin + "/" + DEPENDENCIA;
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/recepcion_paciente',
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        "data": JSON.stringify(json),
        success: function (response) {
            //console.log(response);
        },
        error: function (err) {
            console.error(err);
        }
    }));
}

function notifica_involucrados(json) {
    json.tipo_usuario = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario;
    json.tipo_servicio = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio;
    json.nombre_institucion = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre_institucion;
    json.proyecto = window.location.origin + "/" + DEPENDENCIA;
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/notifica_involucrados',
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        "data": JSON.stringify(json),
        success: function (response) {
            //console.log(response);
        },
        error: function (err) {
            console.error(err);
        }
    }));
}

function notificar_alta(json) {
    json.tipo_usuario = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario;
    json.tipo_servicio = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio;
    json.nombre_institucion = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre_institucion;
    json.proyecto = window.location.origin + "/" + DEPENDENCIA;
    json.fecha_cambio = getFecha();
    json.hora_cambio = getHora();
    json.idOperador = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).idUsuario_Sys;
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/notificar_alta',
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        "data": JSON.stringify(json),
        success: function (response) {
            //console.log(response);
        },
        error: function (err) {
            console.error(err);
        }
    }));
}
function notificar_regreso(json) {
    json.tipo_usuario = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario;
    json.tipo_servicio = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio;
    json.nombre_institucion = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre_institucion;
    json.proyecto = window.location.origin + "/" + DEPENDENCIA;
    json.fecha_cambio = getFecha();
    json.hora_cambio = getHora();
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/notificar_regreso',
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        "data": JSON.stringify(json),
        success: function (response) {
            //console.log(response);
        },
        error: function (err) {
            console.error(err);
        }
    }));
}
