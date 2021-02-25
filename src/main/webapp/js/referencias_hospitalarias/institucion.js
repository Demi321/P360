/* global DEPENDENCIA, Promise, Swal, RequestGET, RequestPOST */

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
//            if (fecha_calendario === getFecha()) {
                console.log("solicitar junto con los que estan en proceso");
                //solicitar las que estan pendientes 

                var ms = {
                    "fecha_calendario": fecha_calendario,
                    "referencia_hospitalaria_solicitudes_pendientes": true,
                    "tipo_usuario": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
                    "tipo_servicio": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio
                };
                EnviarMensajePorSocket(ms);

//
//                //solicitar las que corresponden al dia de hoy
//
//                var ms = {
//                    "fecha_calendario": fecha_calendario,
//                    "referencia_hospitalaria_solicitudes_fecha": true,
//                    "tipo_usuario": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
//                    "tipo_servicio": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio
//                };
//                EnviarMensajePorSocket(ms);
//
//            } else {
//                console.log("solicitar los de una fecha en especifico");
//                var ms = {
//                    "fecha_calendario": fecha_calendario,
//                    "referencia_hospitalaria_solicitudes_fecha": true,
//                    "tipo_usuario": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
//                    "tipo_servicio": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio
//                };
//                EnviarMensajePorSocket(ms);
//            }

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
        console.log(mensaje);
        try {
            if (mensaje.inicializacionSG) {
                idSocketOperador = mensaje.idSocket;
                console.log("Solicitando backup");
                var ms = {
                    "fecha_calendario": fecha_calendario,
                    "referencia_hospitalaria_solicitudes_pendientes": true,
                    "tipo_usuario": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
                    "tipo_servicio": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio
                };
                EnviarMensajePorSocket(ms);
            }
            if (mensaje.solicitudes_referencia_hospitalaria) {
                //Agregar a la bandeja de solicitudes
//                if (mensaje.to_tipo_servicio === JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio && mensaje.to_tipo_usuario === JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario) {
//                    console.log("entrada");
//                    agregar_bandeja_entrada(mensaje)
//                }
                if (mensaje.hasOwnProperty("entrada")) {
                    console.log("entrada");
                    if (!$("#" + mensaje.id).length) {
                        agregar_bandeja_entrada(mensaje);
                    }
                }
                if (mensaje.tipo_servicio === JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio && mensaje.tipo_usuario === JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario) {
                    console.log("saliente");
                    if (!$("#" + mensaje.id).length) {
                        agregar_bandeja_salida(mensaje);
                    }

                } else {
                    console.log("entrada");
                    if (!$("#" + mensaje.id).length) {
                        agregar_bandeja_entrada(mensaje);
                    }
                }
                //agregar_bandeja(mensaje);
            }
            if (mensaje.referencia_hospitalaria_update) {
                //Se actualizar la tarjeta dependiendo del id
                console.log(mensaje);
                actualiza_bandeja(mensaje);
            }
        } catch (e) {
        }
    };
    //  En caso de requerir un backup
    if (WebSocketGeneral.readyState === 1) {
        var ms = {
            "fecha_calendario": fecha_calendario,
            "referencia_hospitalaria_solicitudes_pendientes": true,
            "tipo_usuario": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
            "tipo_servicio": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio
        };
        EnviarMensajePorSocket(ms);
    }
}

RequestGET("/API/referencias_hospitalarias/pacientes/"+JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario+"/"+JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio).then(function (directorio) {
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
                return  option.id.toString().padStart(4, "0") + " " + option.nombre + " " + option.apellidop_paciente + " " + option.apellidom_paciente + " " + option.fecha;
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
                        "rreferencia_hospitalaria_solicitudes_id": true,
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

function agregar_bandeja_salida(json) {
    console.log("Agregar en vista....");
    //console.log(json);

    var div1 = document.createElement("div");
    div1.className = "tarjeta row col-12 m-0 p-1 estado_referencia_" + json.estado + " " + json.id;
    div1.id = json.id;
    var div_tipo = document.createElement("div");
    div_tipo.className = "row col-1 m-0 p-1";
    div_tipo.style = "display:flex;justify-content:center;align-items:center;font-size:1.5rem;";
    div_tipo.innerHTML = '<i class="fas fa-arrow-alt-circle-up"></i>';
    var div_info = document.createElement("div");
    div_info.className = "row col-11 m-0 p-1";
    var div2 = document.createElement("div");
    div2.className = "col-6 m-0 px-1";
    div2.innerHTML = "Referencia: " + json.id.toString().padStart(8, "0");
    var estado_div = document.createElement("div");
    estado_div.className = "col-6 m-0 pl-1 text-right";
    estado_div.id = "estado" + json.id;
    estado_div.innerHTML = '<small>' + json.nombre_estado + '</small>';
    var div3 = document.createElement("div");
    div3.className = "row col-12 m-0 px-1";
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
    div_info.appendChild(div2);
    div_info.appendChild(estado_div);
    div_info.appendChild(div3);
    div1.appendChild(div_tipo);
    div1.appendChild(div_info);
    if (json.focus) {
        document.getElementById("sidebar2").appendChild(div1);
    } else {
        document.getElementById("sidebar2").prepend(div1);
    }
    div1.addEventListener("click", function () {
        $("#botones").empty();

        var card = $("#" + json.id);
        var barra = $(".barra");
        barra[0].className = "row col-12 barra BG" + json.estado;
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

        if (
                json.estado === "2" ||
                json.estado === "5" ||
                json.estado === "6" ||
                json.estado === "7" ||
                json.estado === "8"
                ) {

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
        var div = document.createElement("div");
        div.className = "w-100 h-100 row col-12 m-0 p-0 borderR B" + json.estado;
        div.id = "divEstado";
        var divT1 = document.createElement("div");
        divT1.className = "col-8 m-0 T" + json.estado;
        divT1.id = "referencia" + json.id;
        divT1.innerHTML = "Referencia de Paciente Enviada para Evaluación: " + json.nombre_estado;
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
            $("#estado" + json.id).text(relacion_cp[json.id].nombre_estado);
            $("#referencia" + json.id).text("");
            $("#referencia" + json.id).text("Referencia de Paciente Enviada para Evaluación: " + relacion_cp[json.id].nombre_estado);
            json.estado = relacion_cp[json.id].estado;
        }
    });
    if (json.focus) {
        document.getElementById(json.id).scrollIntoView();
        $("#" + json.id).click();
    }
}
function agregar_bandeja_entrada(json) {
//console.log("Agregar en vista....");
//console.log(json);
    var div1 = document.createElement("div");
    div1.className = "tarjeta row col-12 m-0 p-1 estado_referencia_" + json.estado.replace(/ /gm, "") + " " + json.id;
    div1.id = json.id;
    var div_tipo = document.createElement("div");
    div_tipo.className = "row col-1 m-0 p-1";
    div_tipo.style = "display:flex;justify-content:center;align-items:center;font-size:1.5rem;";
    div_tipo.innerHTML = '<i class="fas fa-arrow-alt-circle-down"></i>';
    var div_info = document.createElement("div");
    div_info.className = "row col-11 m-0 p-1";
    var div2 = document.createElement("div");
    div2.className = "col-6 m-0";
    div2.innerHTML = "Referencia: " + json.id.toString().padStart(8, "0");
    var estado_div = document.createElement("div");
    estado_div.className = "col-6 m-0 pl-1 text-right";
    estado_div.id = "estado" + json.id;
    estado_div.innerHTML = '<small>' + json.nombre_estado + '</small>';
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
    div_info.appendChild(div2);
    div_info.appendChild(estado_div);
    div_info.appendChild(div3);
    div1.appendChild(div_tipo);
    div1.appendChild(div_info);
    if (json.focus) {
        document.getElementById("sidebar2").appendChild(div1);
    } else {
        document.getElementById("sidebar2").prepend(div1);
    }

    div1.addEventListener("click", function () {
        $("#botones").empty();
        if (relacion_cp.hasOwnProperty(json.id)) {
            json.estado = relacion_cp[json.id].estado;
        }
        var card = $("#" + json.id);
        var barra = $(".barra");
        barra[0].className = "row col-12 barra BG" + json.estado;
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

        if (
                json.estado === "2" ||
                json.estado === "5" ||
                json.estado === "6" ||
                json.estado === "7" ||
                json.estado === "8"
                ) {

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
        if (json.codigo_alta) {
            if (json.codigo_alta !== "" && json.codigo_alta !== null) {
                if (!$("#cont_codigo_alta").length) {
                    let div = document.createElement("div");
                    div.className = "col-4";
                    div.id = 'cont_codigo_alta';
                    let input = document.createElement("input");
                    input.value = "Código Paciente: " + json.codigo_alta;
                    input.disabled = true;
                    input.id = "codigo_alta";
                    input.style = "padding: 8px; background: no-repeat; border: none; color: white; font: bold 1.2rem Arial; overflow: hidden; margin: 0; white-space: nowrap; width: 100%;";

                    div.appendChild(input);
                    $(".barra").append(div);
                } else {
                    $("#codigo_alta").val("Código Paciente: " + json.codigo_alta);
                }
            }
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
//            var doctor_responsable = {};
//            var tel_a_agregar = new Array();
            Swal.fire({
                title: 'Asignación',
                html: '<select id="institucion_traslado" class="mb-5" style="width: 90%;font: bold 1rem Arial;border: none;background: white;background: #40474f;color: white;border-bottom: solid 2px;padding: 5px 0px;">' +
                        '<option value="" disabled="true" selected="true">Seleccione una institucion de traslado</option>' +
                        '</select>' +
                        '<select id="personal_traslado" style="width: 90%;font: bold 1rem Arial;border: none;background: white;background: #40474f;color: white;border-bottom: solid 2px;padding: 5px 0px;">' +
                        '<option value="" disabled="true" selected="true">Seleccione al doctor reponsable</option>' +
                        '</select>' +
                        '<label class="sweetalrt" style="padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;">Cama Asignada.</label>' +
                        '<input type="text" id="camaSwal" style="width: 90%;padding: 5px;font: bold 1rem Arial;border-radius: 5px;border: none;text-align: center;">' +
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
                        document.getElementById('hora_recepcion').value,
                        $('#institucion_traslado').val(),
                        $('#personal_traslado').val()
                    ];
                }
            }).then((result) => {
                if (result.value) {
                    let info = {};
                    //agregamos la cama el json
                    console.log("#############");
                    console.log(result);
                    console.log(result.value);
                    if (result.value[3] !== null) {
                        json.id_solicitud = json.id_referencia_hospitalaria;
                        json.cama = result.value[0];
                        json.dia_recepcion = result.value[1] !== "" ? result.value[1] : "NULL";
                        json.hora_recepcion = result.value[2] !== "" ? result.value[2] : "NULL";
                        json.to_tipo_usuario_traslado = result.value[3].toString().split("-")[0];
                        json.to_tipo_servicio_traslado = result.value[3].toString().split("-")[1];
                        json.responsable_institucion = result.value[4] !== null ? result.value[4] : "0";
                        json.tipo_usuario = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario;
                        json.tipo_servicio = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio;
                        RequestPOST("/API/referencias_hospitalarias/aceptar_solicitud", json).then((response) => {
                            console.log(response);
                            json = response;
                            Swal.fire({
                                text: response.mensaje
                            }).then(() => {
                                if (response.success) {
                                    $("#btnaceptar").remove();
                                    $("#btnrechazar").remove();
                                }
                            });
                        });
                    } else {
                        Swal.fire({
                            text: "Debe seleccionar una institución que realice el traslado."
                        });
                    }
                }
            });
            RequestGET("/API/referencia_hospitalaria/directorio_traslado/" + JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio).then((response) => {

                console.log(response);
                for (let i = 0; i < response.length; i++) {

                    let json = response[i];
                    console.log(json);
                    //Listado de instituciones de traslado
                    let option = document.createElement("option");
                    option.value = json.tipo_usuario + "-" + json.tipo_servicio;
                    option.innerHTML = json.nombre;
                    $("#institucion_traslado").append(option);
                }
            });
            RequestGET("/API/referencias_hospitalarias/personal_traslado/" + JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario + "/" + JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio).then((personal) => {

                $.each(personal, (i) => {
                    let persona = personal[i];
                    let option_personal = document.createElement("option");
                    option_personal.value = persona.idUsuario;
                    option_personal.innerHTML = persona.Nombre;
                    $("#personal_traslado").append(option_personal);
                });
            });
        });
        rechazar.addEventListener("click", function () {
            let info = {
                id_solicitud: json.id_referencia_hospitalaria,
                tipo_usuario: JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
                tipo_servicio: JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio
            };
            json.id_solicitud = json.id_referencia_hospitalaria;
            json.tipo_usuario = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario;
            json.tipo_servicio = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio;

            RequestPOST("/API/referencias_hospitalarias/rechazar_solicitud", json).then((response) => {
                console.log(response);
                Swal.fire({
                    text: response.mensaje
                }).then(() => {
                    if (response.success) {
                        $("#btnaceptar").remove();
                        $("#btnrechazar").remove();
                    }
                });
            });
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


        if (json.estado === "2" &&
                json.to_tipo_usuario_traslado === JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario &&
                json.to_tipo_servicio_traslado === JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio) { //solicitud aceptada
            $("#botones").empty();
            var btnrecepcion = document.createElement("input");
            btnrecepcion.id = "btnrecepcion";
            btnrecepcion.type = "button";
            btnrecepcion.className = "btn btn-danger boton";
            btnrecepcion.value = "Aceptar Traslado";
            btnrecepcion.addEventListener("click", function () {
                var tel_a_agregar = new Array();
                let tipo_usuario = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario;
                let tipo_servicio = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio;
                Swal.fire({
                    title: 'Asignar Personal',
                    html: '<label class="sweetalrt" style="padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;">Asignar personal de ambulancia.</label>' +
                            '<select id="personal_ambulancia" style="width: 90%;font: bold 1rem Arial;border: none;background: white;">' +
                            '<option value="" disabled="true" selected="true">Seleccione al responsable de la ambulancia</option>' +
                            '</select>' +
                            '<label class="sweetalrt" style="padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;">Ambulancia Asignada</label>' +
                            '<input type="text" id="id_ambulancia" style="width: 90%;padding: 5px;font: bold 1rem Arial;border-radius: 5px;border: none;text-align: center;">',

                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonText: "Asignar",
                    preConfirm: () => {
                        return [
                            document.getElementById('id_ambulancia').value,
                            $("#personal_ambulancia").val()
                        ];
                    }
                }).then((result) => {
                    if (result.value) {

//                            if (tel_a_agregar.length > 0) {
                        let info = {
                            id_solicitud: json.id_referencia_hospitalaria,
                            tipo_usuario: JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
                            tipo_servicio: JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio,
                            responsable_traslado: $("#personal_ambulancia").val() !== null ? $("#personal_ambulancia").val() : "0",
                            ambulancia: result.value[0]
                        };
                        json.id_solicitud = json.id_referencia_hospitalaria;
                        json.tipo_usuario = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario;
                        json.tipo_servicio = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio;
                        json.responsable_traslado = $("#personal_ambulancia").val() !== null ? $("#personal_ambulancia").val() : "0";
                        json.ambulancia = result.value[0];
                        RequestPOST("/API/referencias_hospitalarias/aceptar_traslado", json).then((response) => {
                            Swal.fire({
                                text: response.mensaje
                            }).then(() => {
                                if (response.success) {
                                    $("#btnrecepcion").remove();
                                }
                            });
                        });
//                            } else {
//                                Swal.fire({
//                                    text: "Debe asignar personal a la ambulancia"
//                                });
//                            }
                    }
                });
                RequestGET("/API/referencias_hospitalarias/personal_traslado/" + tipo_usuario + "/" + tipo_servicio).then((personal_ambulancia) => {
                    console.log(personal_ambulancia);
                    $.each(personal_ambulancia, (i) => {
                        let personal = personal_ambulancia[i];
                        let option = document.createElement("option");
                        option.value = personal.idUsuario;
                        option.innerHTML = personal.Nombre;
                        $("#personal_ambulancia").append(option);
                    });
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
            $("#botones").append(btnrecepcion);
//            $("#botones").append(btnCancelada);
        } else if (json.estado === "5" &&
                json.to_tipo_usuario_traslado === JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario &&
                json.to_tipo_servicio_traslado === JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio) { //traslado aceptado
            $("#botones").empty();
            var btnrecepcion = document.createElement("input");
            btnrecepcion.id = "btnrecepcion";
            btnrecepcion.type = "button";
            btnrecepcion.className = "btn btn-danger boton";
            btnrecepcion.value = "Iniciar Traslado";
            btnrecepcion.addEventListener("click", function () {
                Swal.fire({
                    title: 'Iniciar Traslado',
                    html: "<br><p style='color:white;text-align:center;'>Esta a punto de inicar el traslado del paciente: \n\
                                <strong>" + json.nombre + " " + json.apellidop_paciente + " " + json.apellidom_paciente + "</strong></p>",
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonText: "Continuar"
                }).then((result) => {
                    if (result.value) {
                        json.id_solicitud = json.id_referencia_hospitalaria;
                        RequestPOST("/API/referencias_hospitalarias/iniciar_traslado", json).then((response) => {
                            console.log(response);
                            Swal.fire({
                                text: response.mensaje
                            }).then(() => {
                                if (response.success) {
                                    $("#btnrecepcion").remove();
                                }
                            });
                        });
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
                        $("#btnPersonal").remove();
                        $("#btnrecepcion").remove();
                    }
                });
            });
            $("#botones").append(btnrecepcion);
//            $("#botones").append(btnCancelada);
        } else if (json.estado === "6" &&
                json.tipo_usuario_institucion === JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario &&
                json.tipo_servicio_institucion === JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio) { //traslado en curso
            $("#botones").empty();
            var btnrecepcion = document.createElement("input");
            btnrecepcion.id = "btnrecepcion";
            btnrecepcion.type = "button";
            btnrecepcion.className = "btn btn-danger boton";
            btnrecepcion.value = "Notificar Ingreso Paciente";
            btnrecepcion.addEventListener("click", function () {
                Swal.fire({
                    title: 'Ingreso Paciente',
                    html: "<br><p style='color:white;text-align:center;'>Esta a punto de notificar el ingreso del paciente: \n\
                                <strong>" + json.nombre + " " + json.apellidop_paciente + " " + json.apellidom_paciente + "</strong></p>",
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonText: "Continuar"
                }).then((result) => {
                    if (result.value) {
                        json.id_solicitud = json.id_referencia_hospitalaria;
                        RequestPOST("/API/referencias_hospitalarias/ingresado", json).then((response) => {
                            console.log(response);
                            Swal.fire({
                                text: response.mensaje
                            }).then(() => {
                                if (response.success) {
                                    $("#btnrecepcion").remove();
                                }
                            });
                        });
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
                        $("#btnPersonal").remove();
                        $("#btnrecepcion").remove();
                    }
                });
            });
            $("#botones").append(btnrecepcion);
//            $("#botones").append(btnCancelada);
        } else if (json.estado === "7" &&
                json.tipo_usuario_institucion === JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario &&
                json.tipo_servicio_institucion === JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio) { //paciente ingresado
            $("#botones").empty();
            var btnrecepcion = document.createElement("input");
            btnrecepcion.id = "btnrecepcion";
            btnrecepcion.type = "button";
            btnrecepcion.className = "btn btn-danger boton";
            btnrecepcion.value = "Notificar Alta Paciente";
            btnrecepcion.addEventListener("click", function () {
                Swal.fire({
                    title: 'Alta Paciente',
                    html: "<br><p style='color:white;text-align:center;'>Esta a punto de notificar el alta del paciente: \n\
                                <strong>" + json.nombre + " " + json.apellidop_paciente + " " + json.apellidom_paciente + "</strong></p>",
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonText: "Continuar"
                }).then((result) => {
                    if (result.value) {
                        json.id_solicitud = json.id_referencia_hospitalaria;
                        RequestPOST("/API/referencias_hospitalarias/alta", json).then((response) => {
                            console.log(response);
                            Swal.fire({
                                text: response.mensaje
                            }).then(() => {
                                if (response.success) {
                                    $("#btnrecepcion").remove();
                                    json.codigo_alta = response.codigo_alta;
                                }
                            });
                        });
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
                        $("#btnPersonal").remove();
                        $("#btnrecepcion").remove();
                    }
                });
            });
            $("#botones").append(btnrecepcion);
//            $("#botones").append(btnCancelada);
        } else if (json.estado === "3" &&
                json.tipo_usuario_institucion === JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario &&
                json.tipo_servicio_institucion === JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio) { //solicitud rechazada
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
                        json.id_solicitud = json.id_referencia_hospitalaria;
                        RequestPOST("/API/referencias_hospitalarias/quitar_rechazo", json).then((response) => {
                            console.log(response);
                            Swal.fire({
                                text: response.mensaje
                            }).then(() => {
                                if (response.success) {
                                    $("#btnQuitarRechazo").remove();
                                }
                            });
                        });
                    }
                });
            });
            $("#botones").append(btnQuitarRechazo);
        } else if (json.estado === "1") {
            $("#botones").empty();
            $("#botones").append(rechazar);
            $("#botones").append(aceptar);
        } else {
            //cuando la solicitud fue cancelada
            $("#botones").empty();
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
            $("#estado" + json.id).text(relacion_cp[json.id].nombre_estado);
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
//    var tarjeta = document.getElementById(json.id);
//    tarjeta.className = "tarjeta row col-12 m-0 p-2 " + json.estado.toString().replace(/ /gm, "") + " " + json.id;
    $("#" + json.id)[0].className = "tarjeta row col-12 m-0 p-1 estado_referencia_" + json.estado + " " + json.id;
//    var card = $("#" + json.id);
    var barra = $(".barra");
//    var aux = barra[0].className;
//    if (aux.includes("AceptadaporUTC-19")) {
//        Swal.fire({
//            title: 'Paciente ACEPTADO: ' + json.nombre + " " + json.apellidop_paciente,
//            html: //-------------------------TITULO
//                    //-------------------------Body 
//                    '<label class="sweetalrt" style="color: #f7f7f7;font: bold 12px arial;margin-top: 25px;margin-bottom: 0;margin-left: auto;margin-right: auto;width: 90%;">\n\
//        Su paciente ha sido ACEPTADO porfavor comuníquese con las ambulancias al teléfono 57686697 una vez que su paciente este listo para el traslado.</label>',
//            focusConfirm: true,
//            showCancelButton: false
//        }).then(function () {
//            document.getElementById(json.id).scrollIntoView();
//            $("#" + json.id).click();
//        });
//    }
    if (json.estado !== "4") {
        barra[0].className = "row col-12 barra BG" + json.estado;
        var div = document.createElement("div");
        div.className = "w-100 h-100 row col-12 m-0 p-0 borderR B" + json.estado;
        div.id = "divEstado";
        var divT1 = document.createElement("div");
        divT1.className = "col-8 m-0 T" + json.estado;
        divT1.id = "referencia" + json.id;
        divT1.innerHTML = "Referencia de Paciente Enviada para Evaluación: " + json.nombre_estado;
        var divT2 = document.createElement("div");
        divT2.className = "col-4 m-0 Tnormal";
        div.appendChild(divT1);
        div.appendChild(divT2);
        $("#divEstado").remove();
//        $("#botones").append(div);
        $("#estado" + json.id).text("");
        $("#estado" + json.id).text(json.nombre_estado);
        $("#referencia" + json.id).text("");
        $("#referencia" + json.id).text("Referencia de Paciente Enviada para Evaluación: " + json.nombre_estado);
    }
    if (json.estado === "5" || json.estado === "6"
            || json.estado === "7" || json.estado === "8") {
        if (json.codigo_alta) {
            if (json.codigo_alta !== "" && json.codigo_alta !== null) {
                if (!$("#cont_codigo_alta").length) {
                    let div = document.createElement("div");
                    div.className = "col-4";
                    div.id = 'cont_codigo_alta';
                    let input = document.createElement("input");
                    input.value = "Código Paciente: " + json.codigo_alta;
                    input.disabled = true;
                    input.id = "codigo_alta";
                    input.style = "padding: 8px; background: no-repeat; border: none; color: white; font: bold 1.2rem Arial; overflow: hidden; margin: 0; white-space: nowrap; width: 100%;";

                    div.appendChild(input);
                    $(".barra").append(div);
                } else {
                    $("#codigo_alta").val("Código Paciente: " + json.codigo_alta);
                }
                
            }
        }
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
            "nombre_estado": json.nombre_estado,
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
            "estado": json.estado,
            "nombre_estado": json.nombre_estado
        };
        relacion_cp[json.id] = rel_cd;
    }
    //$("#" + json.id).click();
}
function calculoHora(cliente, json) {
    var date1 = new Date(cliente);
    var date2 = new Date(json);
    var res = (date1 - date2);
    //console.log(res);

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