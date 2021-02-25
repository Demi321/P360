/* global DEPENDENCIA, Promise, Swal */

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
    $("#sidebar .AceptadaporSUCRE").removeClass("d-none");
});
$("#ingresados").click(function () {
    $("#sidebar .tarjeta").addClass("d-none");
    $("#sidebar .IngresadoenUTC-19").removeClass("d-none");
});

$(document).ready(function () {
    $("#titulo").text(JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre_institucion);
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
                    "backup_institucion": true,
                    "tipo_usuario": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
                    "tipo_servicio": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio
                };
                EnviarMensajePorSocket(ms);
            } else {
                console.log("solicitar los de una fecha en especifico");
                var ms = {
                    "fecha_calendario": fecha_calendario,
                    "backup_institucion_fecha": true,
                    "tipo_usuario": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
                    "tipo_servicio": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio
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
                console.log("Solicitando backup");
                var ms = {
                    "backup_institucion": true,
                    "fecha_calendario": fecha_calendario,
                    "tipo_usuario": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
                    "tipo_servicio": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio
                };
                EnviarMensajePorSocket(ms);
            }
            if (mensaje.bandeja_entrada) {
                //Agregar a la bandeja de solicitudes
                agregar_bandeja(mensaje);
            }
            if (mensaje.cambio_estado_solicitud) {
                //Se actualizar la tarjeta dependiendo del id
                actualiza_bandeja(mensaje);
            }
        } catch (e) {
        }
    };
    //  En caso de requerir un backup
    if (WebSocketGeneral.readyState === 1) {
        var ms = {
            "backup_institucion": true,
            "fecha_calendario": fecha_calendario,
            "tipo_usuario": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
            "tipo_servicio": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio
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
                        "backup_institucion_id": true,
                        "tipo_usuario": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
                        "tipo_servicio": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio
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
    console.log("Agregar en vista....");
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
            $("#codigo").val("Contraseña Faliares: " + json.codigo);
        }
        $("#fecha").val("Fecha: " + json.fecha);
        var div = document.createElement("div");
        div.className = "w-100 h-100 row col-12 m-0 p-0 borderR B" + card[0].className.substring(27, card[0].className.length - 2);
        div.id = "divEstado";
        var divT1 = document.createElement("div");
        divT1.className = "col-8 m-0 T" + card[0].className.substring(27, card[0].className.length - 2);
        divT1.id = "referencia" + json.id;
        divT1.innerHTML = "Referencia de Paciente Enviada para Evaluación: " + json.estado;
        var divT2 = document.createElement("div");
        divT2.className = "col-4 m-0 Tnormal";
        div.appendChild(divT1);
        div.appendChild(divT2);
        $("#divEstado").remove();
        $("#botones").append(div);
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
            $("#referencia" + json.id).text("");
            $("#referencia" + json.id).text("Referencia de Paciente Enviada para Evaluación: " + relacion_cp[json.id].estado);
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
    //console.log(json);
    var tarjeta = document.getElementById(json.id);
    tarjeta.className = "tarjeta row col-12 m-0 p-2 " + json.estado.toString().replace(/ /gm, "") + " " + json.id;
    var card = $("#" + json.id);
    var barra = $(".barra");
    var aux = barra[0].className;
    if (aux.includes("AceptadaporUTC-19")) {
        Swal.fire({
            title: 'Paciente ACEPTADO: ' + json.nombre + " " + json.apellidop_paciente,
            html: //-------------------------TITULO
                    //-------------------------Body 
                    '<label class="sweetalrt" style="color: #f7f7f7;font: bold 12px arial;margin-top: 25px;margin-bottom: 0;margin-left: auto;margin-right: auto;width: 90%;">\n\
        Su paciente ha sido ACEPTADO porfavor comuníquese con las ambulancias al teléfono 57686697 una vez que su paciente este listo para el traslado.</label>',
            focusConfirm: true,
            showCancelButton: false
        }).then(function () {
            document.getElementById(json.id).scrollIntoView();
            $("#" + json.id).click();
        });
    }
    if (aux.includes("Enviada") || aux.includes("RechazadaUTC-19") || aux.includes("AceptadaporUTC-19")
            || aux.includes("AceptadaporCRUM") || aux.includes("AceptadaporSUCRE") || aux.includes("RechazadaporCRUM")
            || aux.includes("RechazadaporSUCRE") || aux.includes("IngresadoenUTC-19")
            || aux.includes("NoingresoenUTC-19") || aux.includes("Entraslado") || aux.includes("DadodeAltaporUTC-19")
            || aux.includes("Contrarreferencia")) {
        barra[0].className = "row col-12 barra BG" + card[0].className.substring(27, card[0].className.length - 2);
        var div = document.createElement("div");
        div.className = "w-100 h-100 row col-12 m-0 p-0 borderR B" + card[0].className.substring(27, card[0].className.length - 2);
        div.id = "divEstado";
        var divT1 = document.createElement("div");
        divT1.className = "col-8 m-0 T" + card[0].className.substring(27, card[0].className.length - 2);
        divT1.id = "referencia" + json.id;
        divT1.innerHTML = "Referencia de Paciente Enviada para Evaluación: " + json.estado;
        var divT2 = document.createElement("div");
        divT2.className = "col-4 m-0 Tnormal";
        div.appendChild(divT1);
        div.appendChild(divT2);
        $("#divEstado").remove();
        $("#botones").append(div);
        $("#estado" + json.id).text("");
        $("#estado" + json.id).text(json.estado);
        $("#referencia" + json.id).text("");
        $("#referencia" + json.id).text("Referencia de Paciente Enviada para Evaluación: " + json.estado);
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
}
function calculoHora(cliente, json) {
    var date1 = new Date(cliente);
    var date2 = new Date(json);
    var res = (date1 - date2);
    //console.log(res);

}
function inicio_traslado(json) {
    json.tipo_usuario = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario;
    json.tipo_servicio = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio;
    json.nombre_institucion = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).nombre_institucion;
    json.proyecto = window.location.origin + "/" + DEPENDENCIA;
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/inicio_traslado',
        contentType: "application/json",
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