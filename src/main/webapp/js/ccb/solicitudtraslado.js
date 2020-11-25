/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



/* global DEPENDENCIA, Promise */

var json1 = {
    "fecha": getFecha(),
    "hora": getHora(),
    "institucion_refiere": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).nombre_institucion,
    //"institucion_refiere": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).nombre,
    "medico_refiere": "Dr. Ruben Arguero",
    "telefono_contacto": "5548592615",
    "correo_contacto": "ruben.arg@unam.com.mx",
    "nombre_paciente": "Rodrigo",
    "apellidop_paciente": "Juarez",
    "apellidom_paciente": "Castro",
    "fecha_nacimiento": "1992-11-08",
    "genero": "F",
    "nacionalidad": "Méxicano",
    "fecha_ingreso": "2020-04-20",
    "fecha_sintomas": "2020-04-21",
    "prueba_covid": "positiva",
    "comorbilidades": "diabetes",
    "imc": "1",
    "traqueostomia": "2",
    "terapia_renal": "3",
    "incapacidad_alimentacion": "4",
    "cirrosis_hepatica": "5",
    "embarazo": "6",
    "postoperado": "7",
    "exantematicas_nosocomial": "8",
    "requerimiento_transfusion": "9",
    "infecciones": "10",
    "paro_cardiovascular": "11",
    "enfermedad_psiquiatrica": "12",
    "dimero": "13",
    "ferritina": "14",
    "troponinas": "15",
    "paciente_menor_edad": "16"

};

var json2 = {
    "fecha": getFecha(),
    "hora": getHora(),
    "institucion_refiere": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).nombre_institucion,
//        "institucion_refiere": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).nombre,
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
        "neutrofilos_ul": "5",
        "linfocitos_ul": "2",
        "monocitos_ul": "1",
        "eosinofilos_ul": "4",
        "basofilos_ul": "7 "
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
    },
    "observaciones": "",
    "estudios_imagen": "",
    "correo_contacto_institucion": "",
    "curp": "",
    "area_cama": ""
};



$("#siguienteDEMO").on("click", function () {
    //rechazo_automatico(json1);
    var idJson = Object.keys(json1);
    for (var i = 0; i < idJson.length; i++) {
        console.log(idJson[i]);
        if ($("#" + idJson[i]).length) {
            console.log("Esta");
            $("#" + idJson[i]).val(json1[idJson[i]]);
        } else {
            console.log("No esta ****");
        }
    }
});
$("#enviarDEMO").on("click", function () {
    json2.bandera_estado = true;
    console.log(json2);
    var idJson = Object.keys(json2);
    for (var i = 0; i < idJson.length; i++) {
        console.log(idJson[i]);
        if ($("#" + idJson[i]).length) {
            console.log("Esta");
            $("#" + idJson[i]).val(json2[idJson[i]]);
        } else {
            console.log("No esta ****");
        }
    }
    solicitud_traslado(json2);
});


$("#form1").submit(function (e) {
    e.preventDefault();
    console.log("form1");
    valForm1();
});
$("#form2").submit(function (e) {
    e.preventDefault();
    console.log("form2");
    $("#modal_mensaje").empty();
    document.getElementById("modal_m").style.display = "block";
    var div = document.createElement("div");
    div.className = "row col-12 m-0";
    div.id = "contenedorModalMensaje";
    console.log("Agregando div a modal mensaje");
    console.log(div);
    $("#modal_mensaje").append(div);

    var p1 = document.createElement("div");
    p1.id = "penviando";
    p1.className = "col-12";
    p1.style = "font: bold 1.2rem Arial;align-items: center;justify-content: center; color: #40474f; text-align: center; padding: 3px;";
    $("#contenedorModalMensaje").append(p1);
    p1.innerHTML = ("Enviando Solicitud ");
    let puntos = 0
    var intervalo_puntos = setInterval(function () {
        if (puntos < 5) {
            $("#penviando").text($("#penviando").text() + " .");
            puntos++;
        } else {
            $("#penviando").text("Enviando Solicitud ");
            puntos = 0;
        }
    }, 500);
    valForm2(intervalo_puntos);
});

$("#fecha").val(getFecha());
$("#hora").val(getHora());
$("#institucion_refiere").val(JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).nombre_institucion);
//    $("#institucion_refiere").val(JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).nombre);
$("#telefono_contacto_refiere").val(JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).telefono_institucion);
var hoy = new Date();
//console.log(hoy);
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});
var vcurp = '^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$';


function valForm1() {
    var procede = true;
    var completo = true;
    var cormobilidad = [];
    ////console.log(cormobilidad);
    var dtsJson = {};
    ////console.log(dtsJson);
    $("input[type=checkbox]:checked").each(function () {
        cormobilidad.push(($(this).attr("name")));
    });
    //console.log(cormobilidad);
    document.getElementById('cormobilidades').value = cormobilidad;
    var fecha = document.getElementById("fecha").value;
    //console.log("fecha ::::::::: " + fecha);
    var hora = document.getElementById("hora").value;
    //console.log("hora ::::::::: " + hora);
    var institucion_refiere = document.getElementById("institucion_refiere").value;
    //console.log("institucion_refiere ::::::::: " + institucion_refiere);
    var medico_refiere = document.getElementById("medico_refiere").value;
    //console.log("medico_refiere ::::::::: " + medico_refiere);
    var telefono_contacto = document.getElementById("telefono_contacto_refiere").value;
    //console.log("telefono_contacto ::::::::: " + telefono_contacto);
    var correo_contacto = document.getElementById("correo_contacto_refiere").value;
    //console.log("correo_contacto ::::::::: " + correo_contacto);
    var nombre_paciente = document.getElementById("nombre_paciente").value + ' ' + document.getElementById("apellidop_paciente").value + ' ' + document.getElementById("apellidom_paciente").value;
    //console.log("nombre_paciente ::::::::: " + nombre_paciente);
    var fecha_nacimiento = document.getElementById("fecha_nacimiento").value;
    //console.log("fecha_nacimiento ::::::::: " + fecha_nacimiento);
    var genero = document.getElementById("genero").value;
    //console.log("genero ::::::::: " + genero);
    var fecha_ingreso = document.getElementById("fecha_ingreso").value;
    //console.log("fecha_ingreso ::::::::: " + fecha_ingreso);
    var fecha_sintomas = document.getElementById("fecha_sintomas").value;
    //console.log("fecha_sintomas ::::::::: " + fecha_sintomas);
    var prueba_covid = document.getElementById("prueba_covid").value;
    //console.log("prueba_covid ::::::::: " + prueba_covid);
    var comorbilidades = document.getElementById("cormobilidades").value;
    //console.log("comorbilidades ::::::::: " + comorbilidades);
    var imc = document.getElementById("imc").value;
    //console.log("imc ::::::::: " + imc);
    var traqueostomia = document.getElementById("traqueostomia").value;
    //console.log("traqueostomia ::::::::: " + traqueostomia);
    var terapia_renal = document.getElementById("terapia_renal").value;
    //console.log("terapia_renal ::::::::: " + terapia_renal);
    var incapacidad_alimentacion = document.getElementById("incapacidad_alimentacion").value;
    //console.log("incapacidad_alimentacion ::::::::: " + incapacidad_alimentacion);
    var cirrosis_hepatica = document.getElementById("cirrosis_hepatica").value;
    //console.log("cirrosis_hepatica ::::::::: " + cirrosis_hepatica);
    var embarazo = document.getElementById("embarazo").value;
    //console.log("embarazo ::::::::: " + embarazo);
    var postoperado = document.getElementById("postoperado").value;
    //console.log("postoperado ::::::::: " + postoperado);
    var exantematicas_nosocomial = document.getElementById("exantematicas_nosocomial").value;
    //console.log("exantematicas_nosocomial ::::::::: " + exantematicas_nosocomial);
    var requerimiento_transfusion = document.getElementById("requerimiento_transfusion").value;
    //console.log("requerimiento_transfusion ::::::::: " + requerimiento_transfusion);
    var infecciones = document.getElementById("infecciones").value;
    //console.log("infecciones ::::::::: " + infecciones);
    var paro_cardiovascular = document.getElementById("paro_cardiovascular").value;
    //console.log("paro_cardiovascular ::::::::: " + paro_cardiovascular);
    var enfermedad_psiquiatrica = document.getElementById("enfermedad_psiquiatrica").value;
    //console.log("enfermedad_psiquiatrica ::::::::: " + enfermedad_psiquiatrica);
    var dimero = document.getElementById("dimero").value;
    //console.log("dimero ::::::::: " + dimero);
    var ferritina = document.getElementById("ferritina").value;
    //console.log("ferritina ::::::::: " + ferritina);
    var troponinas = document.getElementById("troponinas").value;
    //console.log("troponinas ::::::::: " + troponinas);
    var paciente_menor_edad = calcularEdad(fecha_nacimiento);
    //console.log("paciente_menor_edad ::::::::: " + paciente_menor_edad);

    var curp = document.getElementById("curp").value;
    var nacionalidad = document.getElementById("nacionalidad").value;
    //var pais_nacimiento = document.getElementById("pais_nacimiento").value;
    //var estado_nacimiento = document.getElementById("estado_nacimiento").value;
    var ventilacion_mecanica = document.getElementById("ventilacion_mecanica").value;
    var peso = document.getElementById("peso").value;
    var infecciones_brotes = document.getElementById("infecciones_brotes").value;
    var procedimiento_quirurgico_urgencias = document.getElementById("procedimiento_quirurgico_urgencias").value;
    var infecciones_microorganismos = document.getElementById("infecciones_microorganismos").value;
    var otras_infecciones = document.getElementById("otras_infecciones").value;
    var paciente_vasopresores = document.getElementById("paciente_vasopresores").value;
//    var turno2 = $("#turno2").val() !== undefined ? document.getElementById("turno2").value : "";
//    var prioridad2 = $("#prioridad2").val() !== undefined ? document.getElementById("prioridad2").value : "";
//    var nombre_cargo_solicita = $("#nombre_cargo_solicita").val() !== undefined ? document.getElementById("nombre_cargo_solicita").value : "";
//    var hora_ingreso = $("#hora_ingreso").val() !== undefined ? document.getElementById("hora_ingreso").value : "";

    dtsJson.fecha = fecha;
    dtsJson.hora = hora;
    dtsJson.institucion_refiere = institucion_refiere;
    dtsJson.medico_refiere = medico_refiere;
    dtsJson.telefono_contacto = telefono_contacto;
    dtsJson.correo_contacto = correo_contacto;
    dtsJson.nombre_paciente = nombre_paciente;
    dtsJson.fecha_nacimiento = fecha_nacimiento;
    dtsJson.genero = genero;
    dtsJson.fecha_ingreso = fecha_formato(fecha_ingreso);
    dtsJson.fecha_sintomas = fecha_formato(fecha_sintomas);
    dtsJson.prueba_covid = prueba_covid;
    dtsJson.comorbilidades = comorbilidades;
    dtsJson.imc = imc;
    dtsJson.traqueostomia = traqueostomia;
    dtsJson.terapia_renal = terapia_renal;
    dtsJson.incapacidad_alimentacion = incapacidad_alimentacion;
    dtsJson.cirrosis_hepatica = cirrosis_hepatica;
    dtsJson.embarazo = embarazo;
    dtsJson.postoperado = postoperado;
    dtsJson.exantematicas_nosocomial = exantematicas_nosocomial;
    dtsJson.requerimiento_transfusion = requerimiento_transfusion;
    dtsJson.infecciones = infecciones;
    dtsJson.paro_cardiovascular = paro_cardiovascular;
    dtsJson.enfermedad_psiquiatrica = enfermedad_psiquiatrica;
    dtsJson.dimero = dimero;
    dtsJson.ferritina = ferritina;
    dtsJson.troponinas = troponinas;
    dtsJson.paciente_menor_edad = paciente_menor_edad;
    dtsJson.curp = curp;
    dtsJson.nacionalidad = nacionalidad;
    //dtsJson.pais_nacimiento = pais_nacimiento;
    //dtsJson.estado_nacimiento = estado_nacimiento;
    dtsJson.peso = peso;
    dtsJson.ventilacion_mecanica = ventilacion_mecanica;
    dtsJson.procedimiento_quirurgico_urgencias = procedimiento_quirurgico_urgencias;
    dtsJson.infecciones_brotes = infecciones_brotes;
    dtsJson.infecciones_microorganismos = infecciones_brotes;
    dtsJson.otras_infecciones = infecciones_brotes;
    dtsJson.paciente_vasopresores = infecciones_brotes;
//    dtsJson.turno2 = turno2;
//    dtsJson.prioridad2 = prioridad2;
//    dtsJson.nombre_cargo_solicita = nombre_cargo_solicita;
//    dtsJson.hora_ingreso = hora_ingreso;
    console.log(dtsJson);

    if (curp.match(vcurp)) {
    } else {
        //completo = false;
        console.log("fallo");
    }
    if (imc === '') {
        completo = false;
        console.log("fallo");
    }
    if (peso === '') {
        completo = false;
        console.log("fallo");
    }
    if (procedimiento_quirurgico_urgencias === '') {
        completo = false;
        console.log("fallo");
    }
    if (infecciones_brotes === '') {
        completo = false;
        console.log("fallo");
    }
    if (infecciones_microorganismos === '') {
        completo = false;
        console.log("fallo");
    }
    if (otras_infecciones === '') {
        completo = false;
        console.log("fallo");
    }
    if (paciente_vasopresores === '') {
        completo = false;
        console.log("fallo");
    }
    if (traqueostomia === '') {
        completo = false;
        console.log("fallo");
    }
    if (ventilacion_mecanica === '') {
        completo = false;
        console.log("fallo");
    }

    if (terapia_renal === '') {
        completo = false;
        console.log("fallo");
    }
    if (incapacidad_alimentacion === '') {
        completo = false;
        console.log("fallo");
    }
    if (cirrosis_hepatica === '') {
        completo = false;
        console.log("fallo");
    }
    if (embarazo === '') {
        completo = false;
        console.log("fallo");
    }
    if (postoperado === '') {
        completo = false;
        console.log("fallo");
    }
    if (exantematicas_nosocomial === '') {
        completo = false;
        console.log("fallo");
    }
    if (requerimiento_transfusion === '') {
        completo = false;
        console.log("fallo");
    }
    if (infecciones === '') {
        completo = false;
        console.log("fallo");
    }
    if (paro_cardiovascular === '') {
        completo = false;
        console.log("fallo");
    }
//    if (turno2 === '') {
//        completo = false;
//        console.log("fallo");
//    }
//    if (prioridad2 === '') {
//        completo = false;
//        console.log("fallo");
//    }
//    if (nombre_cargo_solicita2 === '') {
//        completo = false;
//        console.log("fallo");
//    }
//    if (hora_ingreso2 === '') {
//        completo = false;
//        console.log("fallo");
//    }


    if (peso === 'Si') {

        procede = false;
    }
    if (procedimiento_quirurgico_urgencias === 'Si') {

        procede = false;
    }
    if (ventilacion_mecanica === 'Si') {

        procede = false;
    }
    if (infecciones_brotes === 'Si') {

        procede = false;
    }
    if (infecciones_microorganismos === 'Si') {

        procede = false;
    }
    if (otras_infecciones === 'Si') {

        procede = false;
    }
    if (paciente_vasopresores === 'Si') {

        procede = false;
    }
    if (imc === 'Si') {

        procede = false;
    }
    if (traqueostomia === 'Si') {

        procede = false;
    }
    if (terapia_renal === 'Si') {

        procede = false;
    }
    if (incapacidad_alimentacion === 'Si') {

        procede = false;
    }
    if (cirrosis_hepatica === 'Si') {

        procede = false;
    }
    if (embarazo === 'Si') {

        procede = false;
    }
    if (postoperado === 'Si') {

        procede = false;
    }
    if (exantematicas_nosocomial === 'Si') {

        procede = false;
    }
    if (requerimiento_transfusion === 'Si') {

        procede = false;
    }
    if (infecciones === 'Si') {

        procede = false;
    }
    if (paro_cardiovascular === 'Si') {

        procede = false;
    }
    if (comorbilidades !== '') {
        //
        //return false;
        if (procede) {
            //procede = calcularDias();
        }

    }
    console.log(procede);
    if (completo) {
        if (procede) {
            document.getElementById('Formulario2').style.display = 'block';
            document.getElementById('Formulario1').style.display = 'none';
            document.getElementById("Formulario2").scrollIntoView();
            $("#nombre").val($("#nombre_paciente").val());
            $("#apellidop_paciente2").val($("#apellidop_paciente").val());
            $("#apellidom_paciente2").val($("#apellidom_paciente").val());
            $("#fecha_nacimiento2").val($("#fecha_nacimiento").val());
            $("#genero2").val($("#genero").val());
            $("#pais2").val($("#pais").val());
            $("#estado_nacimiento2").val($("#estado_nacimiento").val());
            $("#comorbilidades2").val($("#cormobilidades").val());
            $("#nombre_institucion").val($("#institucion_refiere").val());
            $("#telefono_institucion").val($("#telefono_contacto_refiere").val());
            $("#correo_institucion").val($("#correo_contacto_refiere").val());
            $("#prueba_covid").val($("#prueb_covid").val());
            $("#fecha_sintomas2").val($("#fecha_sintomas").val());
            $("#fecha_ingreso2").val($("#fecha_ingreso").val());
            $("#nacionalidad2").val($("#nacionalidad").val());
            $("#turno").val($("#turno2").val() !== undefined ? $("#turno2").val() : "");
            $("#prioridad").val($("#prioridad2").val() !== undefined ? $("#prioridad2").val() : "");
            $("#nombre_cargo_solicita").val($("#nombre_cargo_solicita2").val() !== undefined ? $("#nombre_cargo_solicita2").val() : "");
            $("#hora_ingreso").val($("#hora_ingreso2").val() !== undefined ? $("#hora_ingreso2").val() : "");

        } else {

            rechazo_automatico(dtsJson);


            var div = document.createElement("div");
            div.className = "row col-12 m-0";
            var p1 = document.createElement("div");
            p1.innerHTML = "La capacidad de la Unidad Temporal COVID-19 está dirigida para atender pacientes convalecientes que no requieran de atención especializada, tal como, el caso de su paciente.";
            p1.className = "col-12";
            p1.style = "font: bold 1.2rem Arial;align-items: center;justify-content: center; color: #40474f; text-align: center; padding: 3px;";
            var p2 = document.createElement("div");
            p2.innerHTML = "Con base en los datos que usted nos ha compartido, el paciente obtendrá mayor beneficio si permanece en la unidad hospitalaria, de lo contrario pondríamos en riesgo su seguridad y calidad de atención.";
            p2.className = "col-12";
            p2.style = "font: bold 1.2rem Arial;align-items: center;justify-content: center; color: #40474f; text-align: center; padding: 3px;";
            var p5 = document.createElement("div");
            // p5.innerHTML="(Cerrar esta ventana)";
            p5.className = "col-12";
            p5.style = "font: bold 1.2rem Arial;align-items: center;justify-content: center; color: #40474f; text-align: center; padding: 3px;";
            div.appendChild(p1);
            div.appendChild(p2);
            div.appendChild(p5);
            $("#modal_mensaje").append(div);

            document.getElementById("modal_m").style.display = "block";
//                Swal.fire({
//                    title: '<strong>Alerta.</strong>',
//                    icon: 'info',
//                    html:
//                            '<div style="margin: 20px;margin-bottom: 0;color: white;">\n\
//                        La capacidad de la Unidad Temporal COVID-19 está dirigida para atender pacientes convalecientes que no requieran de atención especializada, tal como, el caso de su paciente. \n\
//                        <br>Con base en los datos que usted nos ha compartido, el paciente obtendrá mayor beneficio si permanece en la unidad hospitalaria, de lo contrario pondríamos en riesgo su seguridad y calidad de atención.\n\
//                        </div>',
//                    showCloseButton: false,
//                    showCancelButton: false,
//                    focusConfirm: false,
//                    confirmButtonText:
//                            'Aceptar'
//                }).then(function () {
//                    console.log("Cerrar pantalla.");
//                });
        }
    } else {
        Swal.fire({
            title: '<strong>Alerta.</strong>',
            icon: 'info',
            html:
                    '<div style="margin: 15px;margin-bottom: 0;color: white;">\n\
                            Verificar datos de registro <b></b>, Algun dato no ha sido ingresado, favor de verificar.\n\
                            </div>',
            showCloseButton: false,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText:
                    'Aceptar'
        });
    }

    //return true y submit de form;
}
//            
var edad;
function valForm2(intervalo_puntos) {
    var jsonForm2 = {
        "fecha": fecha_formato($("#fecha").val()),
        "hora": $("#hora").val(),
        "institucion_refiere": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).nombre_institucion,
//            "institucion_refiere": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).nombre,
        "telefono_contacto_institucion": ($("#telefono_institucion").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "nombre": ($("#nombre").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "apellidop_paciente": ($("#apellidop_paciente").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "apellidom_paciente": ($("#apellidom_paciente").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "genero": ($("#genero").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "edad": edad,
        "fecha_nacimiento": fecha_formato($("#fecha_nacimiento").val()),
        "medico_refiere": ($("#medico_refiere").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "nombre_responsable": ($("#nombre_responsable").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "apellidop_responsable": ($("#apellidop_responsable").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "apellidom_responsable": ($("#apellidom_responsable").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "vinculo": ($("#vinculo").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "telefono_contacto": ($("#telefono_responsable").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "correo_contacto": ($("#correo_contacto_responsable").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "comorbilidades": ($("#comorbilidades2").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "medicamentos": ($("#medicamentos").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "padecimiento": $("#padecimiento").val(),
        "fecha_sintomas": fecha_formato($("#fecha_sintomas").val()),
        "fecha_ingreso": fecha_formato($("#fecha_ingreso").val()),
        "prueba_covid": ($("#prueba_covid").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "tratamiento": ($("#tratamiento").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "evaluacion": ($("#estado_actual").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "estado_actual": ($("#estado_actual").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "signos_vitales": $("#signos_vitales").val(),
        "motivo_envio": ($("#motivo_envio").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "biometria_hematica": {
            "eritrocitos": ($("#eritrocitos").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "hemoglobina": ($("#hemoglobina").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "hematocrito": ($("#hematocrito").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "hemoglobina_corp": ($("#hemoglobina_corp").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "concentracion_hemoglobina": ($("#concentracion_hemoglobina").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "distribucion_erotrocitos": ($("#distribucion_erotrocitos").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "plaquetas": ($("#plaquetas").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "leucocitos": ($("#leucocitos").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "neutrofilos": ($("#neutrofilos").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "linfocitos": ($("#linfocitos").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "monocitos": ($("#monocitos").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "eosinofilos": ($("#eosinofilos").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "basofilos": ($("#basofilos").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "neutrofilos_ul": ($("#neutrofilos_ul").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "linfocitos_ul": ($("#linfocitos_ul").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "monocitos_ul": ($("#monocitos_ul").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "eosinofilos_ul": ($("#eosinofilos_ul").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "basofilos_ul": ($("#basofilos_ul").val().replace(/'/gm, "")).replace(/"/gm, "")
        },
        "quimica_sanguinea": {
            "glucosa": ($("#glucosa").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "urea": ($("#urea").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "creatinina": ($("#creatinina").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "acido_urico": ($("#acido_urico").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "colesterol": ($("#colesterol").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "trigliceridos": ($("#trigliceridos").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "ferritina": ($("#ferritina_num").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "dimero_d": ($("#dimero_d").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "troponina_i": ($("#troponina_i").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "ck_mb": ($("#ck_mb").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "ck": ($("#ck").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "dhl": ($("#dhl").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "bnp": ($("#bnp").val().replace(/'/gm, "")).replace(/"/gm, "")
        },
        "electrolitos_sericos": {
            "sodio": ($("#sodio").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "potasio": ($("#potasio").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "cloro": ($("#cloro").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "calcio": ($("#calcio").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "magnesio": ($("#magnesio").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "fosforo": ($("#fosforo").val().replace(/'/gm, "")).replace(/"/gm, "")
        },
        "funcion_hepatica": {
            "bilirrubina_total": ($("#bilirrubina_total").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "bilirrubina_directa": ($("#bilirrubina_directa").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "bilirrubina_indirecta": ($("#bilirrubina_indirecta").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "tgo": ($("#tgo").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "tgp": ($("#tgp").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "fosfatasa_alcalina": ($("#fosfatasa_alcalina").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "albumina": ($("#albumina").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "globulinas": ($("#globulinas").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "relacion_ag": ($("#relacion_ag").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "proteinas_totales": ($("#proteinas_totales").val().replace(/'/gm, "")).replace(/"/gm, "")
        },
        "tiempos_coagulacion": {
            "tp": ($("#tp").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "tpt": ($("#tpt").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "tt": ($("#tt").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "inr": ($("#inr").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "tiempo_sangrado": ($("#tiempo_sangrado").val().replace(/'/gm, "")).replace(/"/gm, "")
        },
        "gasometria_arterial": {
            "ph": ($("#ph").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "pao2": ($("#pao2").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "pco2": ($("#pco2").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "sato2": ($("#sato2").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "eb": ($("#eb").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "hco3": ($("#hco3").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "lactato": ($("#lactato").val().replace(/'/gm, "")).replace(/"/gm, ""),
            "fio2": ($("#fio2").val().replace(/'/gm, "")).replace(/"/gm, "")
        },
        "observaciones": ($("#observaciones").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "estudios_imagen": ($("#estudios_imagen").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "correo_contacto_institucion": ($("#correo_institucion").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "curp": ($("#curp").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "area_cama": ($("#area_cama").val().replace(/'/gm, "")).replace(/"/gm, ""),
        "turno": $("#turno").val() !== undefined ? ($("#turno").val().replace(/'/gm, "")).replace(/"/gm, "") : "",
        "prioridad": $("#prioridad").val() !== undefined ? ($("#prioridad").val().replace(/'/gm, "")).replace(/"/gm, "") : "",
        "nombre_cargo_solicita": $("#nombre_cargo_solicita").val() !== undefined ? ($("#nombre_cargo_solicita").val().replace(/'/gm, "")).replace(/"/gm, "") : "",
        "hora_ingreso": $("#hora_ingreso").val() !== undefined ? ($("#hora_ingreso").val().replace(/'/gm, "")).replace(/"/gm, "") : ""
    };

    console.log(jsonForm2);
//    if (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio !== "67") {

    solicitud_traslado(jsonForm2).then(function (response) {
        clearInterval(intervalo_puntos);
        console.log(response.procede);
        if (response.procede) {
            $("#penviando").text("");
            $("#penviando").text("En un plazo no mayor a 24 horas recibirá una respuesta a su petición por parte del equipo de la Unidad Temporal COVID-19.");
            var p2 = document.createElement("div");
            p2.innerHTML = "Agradecemos de antemano su tiempo y cooperación para agilizar este proceso.";
            p2.className = "col-12";
            p2.style = "font: bold 1.2rem Arial;align-items: center;justify-content: center; color: #40474f; text-align: center; padding: 3px;";
            var p3 = document.createElement("div");
            p3.className = "col-12";
            p3.innerHTML = "Atentamente";
            p3.style = "font: bold 1.2rem Arial;align-items: center;justify-content: center; color: #40474f; text-align: center; padding: 3px;";
            var p4 = document.createElement("div");
            p4.innerHTML = "Servicio de Referencia de la Unidad Temporal COVID-19.";
            p4.className = "col-12";
            p4.style = "font: bold 1.2rem Arial;align-items: center;justify-content: center; color: #40474f; text-align: center; padding: 3px;";
            var p5 = document.createElement("div");
            // p5.innerHTML="(Cerrar esta ventana)";
            p5.className = "col-12";
            p5.style = "font: bold 1.2rem Arial;align-items: center;justify-content: center; color: #40474f; text-align: center; padding: 3px;";
            $("#contenedorModalMensaje").append(p2);
            $("#contenedorModalMensaje").append(p3);
            $("#contenedorModalMensaje").append(p4);
            $("#contenedorModalMensaje").append(p5);
        } else {
            $("#penviando").text("");

            $("#penviando").text(response.mensaje);
            var cerrar = document.createElement("input");
            cerrar.value = "Cerrar";
            cerrar.className = "btn btn-danger mx-auto mt-3";
            cerrar.type = "button";
            $("#contenedorModalMensaje").append(cerrar);
            cerrar.addEventListener("click", function () {
                document.getElementById("modal_m").style.display = "none";
            });
        }
    });
//    } 
//    else {
//        console.log("En el else creando un nuevo div");
//        var div = document.createElement("div");
//        div.className = "row col-12 m-0";
//        var p1 = document.createElement("div");
//        p1.innerHTML = "Módulo deshabilitado para esta cuenta ";
//        p1.className = "col-12";
//        p1.style = "font: bold 1.5rem Arial;align-items: center;justify-content: center; color: #dc3545; text-align: center; padding: 3px;";
//        var p2 = document.createElement("div");
//        p2.innerHTML = "Agradecemos de antemano su tiempo y cooperación para agilizar este proceso.";
//        p2.className = "col-12";
//        p2.style = "font: bold 1.2rem Arial;align-items: center;justify-content: center; color: #40474f; text-align: center; padding: 3px;";
//        var p3 = document.createElement("div");
//        p3.className = "col-12";
//        p3.innerHTML = "Atentamente";
//        p3.style = "font: bold 1.2rem Arial;align-items: center;justify-content: center; color: #40474f; text-align: center; padding: 3px;";
//        var p4 = document.createElement("div");
//        p4.innerHTML = "Servicio de Referencia de la Unidad Temporal COVID-19.";
//        p4.className = "col-12";
//        p4.style = "font: bold 1.2rem Arial;align-items: center;justify-content: center; color: #40474f; text-align: center; padding: 3px;";
//        var p5 = document.createElement("div");
//        // p5.innerHTML="(Cerrar esta ventana)";
//        p5.className = "col-12";
//        p5.style = "font: bold 1.2rem Arial;align-items: center;justify-content: center; color: #40474f; text-align: center; padding: 3px;";
//        div.appendChild(p1);
//        div.appendChild(p2);
//        div.appendChild(p3);
//        div.appendChild(p4);
//        div.appendChild(p5);
//        $("#modal_mensaje").append(div);
//        document.getElementById("modal_m").style.display = "block";
//    }

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
    var m = hoy.getMonth() - cumpleanos.getMonth();
    console.log(m);
    if (m < 0 || (m == 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
        console.log(edad);
        if (edad > 18) {
            // aqui haces lo que quieras con la validacion de si es mayor a 18
            //alert("El usuario es mayor a 18 años");
            paciente_menor_edad = "No";
        } else {
            //alert("Menor de edad");
            paciente_menor_edad = "Si";
        }
    }
}
function agregar() {}
function calcularDias() {
//            alert("FUNCION");
    var fechaIng = document.getElementById("fecha_ingreso").value;
    console.log(fechaIng);
    var fIngreso = new Date(fechaIng).getTime();
    console.log(fIngreso);
    var fHoy = hoy.getTime();
    var diff = fHoy - fIngreso;
    var Dias = diff / (1000 * 60 * 60 * 24);
    console.log(Dias);
    if (Dias > 10) {
        return true;
        document.getElementById('Formulario2').style.display = 'block';
        document.getElementById('Formulario1').style.display = 'none';
    } else {
        return false;
        console.log("No cumple los dias internado");
    }
}


function rechazo_automatico(json) {
    json.tipo_usuario = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
    json.tipo_servicio = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio;
    json.nombre_institucion = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).nombre_institucion;
    json.proyecto = window.location.origin + "/" + DEPENDENCIA;
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/rechazo_automatico',
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        "data": JSON.stringify(json),
        success: function (response) {
            console.log(response);
        },
        error: function (err) {
            //alert("No hay ubicacion para el usuario:" + idUsuarios_Movil);
            p360 = false;
            console.error(err);
        }
    }));
}
function solicitud_traslado(json) {
    json.tipo_usuario = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
    json.tipo_servicio = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio;
    json.nombre_institucion = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).nombre_institucion;
    json.proyecto = window.location.origin + "/" + DEPENDENCIA;
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/solicitud_traslado',
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        "data": JSON.stringify(json),
        success: function (response) {
//            console.log(response);
        },
        error: function (err) {
            console.error(err);
        }
    }));
}
