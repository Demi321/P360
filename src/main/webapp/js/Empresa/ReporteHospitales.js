/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global Toast, DEPENDENCIA, Promise, Swal, parseFloat */

function getUltimoReporte() {
    var json = {
        "tipo_servicio": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio
    };
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/ultimoreportehospital',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(json),
        success: function (response) {
            llenarValores(response);
        },
        error: function (err) {
            console.log(err);
        }
    }));
}

function llenarValores(reporte) {
    $("#id_Operador").val(reporte.id_Operador);
    $("#fecha").val(reporte.fecha);
    $("#hora").val(reporte.hora);
    $("#pacientes_totales").val(reporte.pacientes_totales);
    $("#pacientes_graves").val(reporte.pacientes_graves);
    $("#pacientes_nograves").val(reporte.pacientes_nograves);
    $("#recuperados").val(reporte.recuperados);
    $("#fallecidos").val(reporte.fallecidos);
    $("#camas_totales").val(reporte.camas_totales);
    $("#camas_ocupadas").val(reporte.camas_ocupadas);
    $("#camas_covid_totales").val(reporte.camas_covid_totales);
    $("#camas_covid_ocupadas").val(reporte.camas_covid_ocupadas);
    $("#camas_ti_totales").val(reporte.camas_ti_totales);
    $("#camas_ti_ocupadas").val(reporte.camas_ti_ocupadas);
    $("#camas_urgencias_totales").val(reporte.camas_urgencias_totales);
    $("#camas_urgencias_ocupadas").val(reporte.camas_urgencias_ocupadas);
    $("#uti").val(reporte.uti);
    $("#cuartos_aislamiento").val(reporte.cuartos_aislamiento);
    $("#positivos_nograves").val(reporte.positivos_nograves);
    $("#positivos_graves").val(reporte.positivos_graves);
    $("#campamentos").val(reporte.campamentos);
    $("#capacidad_campamentos").val(reporte.capacidad_campamentos);
    $("#casas_campana").val(reporte.casas_campana);
    $("#capacidad_casas_campana").val(reporte.capacidad_casas_campana);
    $("#toldo").val(reporte.toldo);
    $("#capacidad_toldo").val(reporte.capacidad_toldo);
    $("#catre").val(reporte.catre);
    $("#cocina_moviles").val(reporte.cocina_moviles);
    $("#ambulancia_ti").val(reporte.ambulancia_ti);
    $("#capacidad_ambulancia_ti").val(reporte.capacidad_ambulancia_ti);
    $("#ambulancia_traslado").val(reporte.ambulancia_traslado);
    $("#capacidad_ambulancia_traslado").val(reporte.capacidad_ambulancia_traslado);
    $("#vehiculo_carga").val(reporte.vehiculo_carga);
    $("#capacidad_vehiculo_carga").val(reporte.capacidad_vehiculo_carga);
    $("#tractocamion").val(reporte.tractocamion);
    $("#capacidad_tractocamion").val(reporte.capacidad_tractocamion);
    $("#plataforma").val(reporte.plataforma);
    $("#capacidad_plataforma").val(reporte.capacidad_plataforma);
    $("#cama_baja").val(reporte.cama_baja);
    $("#capacidad_cama_baja").val(reporte.capacidad_cama_baja);
    $("#caja_seca").val(reporte.caja_seca);
    $("#capacidad_caja_seca").val(reporte.capacidad_caja_seca);
    $("#carro_mudanza").val(reporte.carro_mudanza);
    $("#capacidad_carro_mudanza").val(reporte.capacidad_carro_mudanza);
    $("#pullman").val(reporte.pullman);
    $("#capacidad_pullman").val(reporte.capacidad_pullman);
    $("#aeronave_alafija").val(reporte.aeronave_alafija);
    $("#capacidad_personas_aeronave_alafija").val(reporte.capacidad_personas_aeronave_alafija);
    $("#capacidad_aeronave_alafija").val(reporte.capacidad_aeronave_alafija);
    $("#aeronave_alarotativa").val(reporte.aeronave_alarotativa);
    $("#capacidad_personas_aeronave_alarotativa").val(reporte.capacidad_personas_aeronave_alarotativa);
    $("#capacidad_aeronave_alarotativa").val(reporte.capacidad_aeronave_alarotativa);
    $("#ventiladores_mecanicos").val(reporte.ventiladores_mecanicos);
    $("#monitores").val(reporte.monitores);
    $("#rx_portatiles").val(reporte.rx_portatiles);
    $("#pulsioximetros").val(reporte.pulsioximetros);
    $("#carro_rojo").val(reporte.carro_rojo);
    $("#ultrasonidos_moviles").val(reporte.ultrasonidos_moviles);
    $("#pruebas_covid_disponibles").val(reporte.pruebas_covid_disponibles);
    $("#pruebas_covid_realizadas").val(reporte.pruebas_covid_realizadas);
    $("#pruebas_covid_positivas").val(reporte.pruebas_covid_positivas);
    $("#pruebas_covid_negativas").val(reporte.pruebas_covid_negativas);
    $("#cubrebocas").val(reporte.cubrebocas);
    $("#caretas").val(reporte.caretas);
    $("#guantes").val(reporte.guantes);
    $("#trajes_desechables").val(reporte.trajes_desechables);
    $("#trajes_aislamiento").val(reporte.trajes_aislamiento);
    $("#personal_total").val(reporte.personal_total);
    $("#medicos_ti").val(reporte.medicos_ti);
    $("#medicos_urg").val(reporte.medicos_urg);
    $("#medicina_interna").val(reporte.medicina_interna);
    $("#neumologia").val(reporte.neumologia);
    $("#infectologia").val(reporte.infectologia);
    $("#anesteciologia").val(reporte.anesteciologia);
    $("#medico_cirujano").val(reporte.medico_cirujano);
    $("#cirujano_dentista").val(reporte.cirujano_dentista);
    $("#enfermeros").val(reporte.enfermeros);
    $("#enfermeros_ti").val(reporte.enfermeros_ti);
    $("#enfermeros_inhaloterapia").val(reporte.enfermeros_inhaloterapia);
    $("#personal_operativo_apoyo").val(reporte.personal_operativo_apoyo);
    $("#oficiales_sanidad").val(reporte.oficiales_sanidad);
    $("#tropas_sanidad").val(reporte.tropas_sanidad);


    $("#pacientes_totales").change();
    $("#pacientes_graves").change();
    $("#pacientes_nograves").change();
    $("#recuperados").change();
    $("#fallecidos").change();
    $("#camas_totales").change();
    $("#camas_ocupadas").change();
    $("#camas_covid_totales").change();
    $("#camas_covid_ocupadas").change();
    $("#camas_ti_totales").change();
    $("#camas_ti_ocupadas").change();
    $("#camas_urgencias_totales").change();
    $("#camas_urgencias_ocupadas").change();
    $("#pruebas_covid_disponibles").change();
    $("#pruebas_covid_realizadas").change();
    $("#pruebas_covid_positivas").change();
    $("#pruebas_covid_negativas").change();

}
function guardarReporteHospital() {
    var json = {
        "id_Operador": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).idUsuario_Sys,
        "tipo_servicio": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio,
        "fecha": getFecha(),
        "hora": getHora(),
        "pacientes_totales": $("#pacientes_totales").val(),
        "pacientes_graves": $("#pacientes_graves").val(),
        "pacientes_nograves": $("#pacientes_nograves").val(),
        "recuperados": $("#recuperados").val(),
        "fallecidos": $("#fallecidos").val(),
        "camas_totales": $("#camas_totales").val(),
        "camas_ocupadas": $("#camas_ocupadas").val(),
        "camas_covid_totales": $("#camas_covid_totales").val(),
        "camas_covid_ocupadas": $("#camas_covid_ocupadas").val(),
        "camas_ti_totales": $("#camas_ti_totales").val(),
        "camas_ti_ocupadas": $("#camas_ti_ocupadas").val(),
        "camas_urgencias_totales": $("#camas_urgencias_totales").val(),
        "camas_urgencias_ocupadas": $("#camas_urgencias_ocupadas").val(),
        "uti": $("#uti").val(),
        "cuartos_aislamiento": $("#cuartos_aislamiento").val(),
        "positivos_nograves": $("#positivos_nograves").val(),
        "positivos_graves": $("#positivos_graves").val(),
        "campamentos": $("#campamentos").val(),
        "capacidad_campamentos": $("#capacidad_campamentos").val(),
        "casas_campana": $("#casas_campana").val(),
        "capacidad_casas_campana": $("#capacidad_casas_campana").val(),
        "toldo": $("#toldo").val(),
        "capacidad_toldo": $("#capacidad_toldo").val(),
        "catre": $("#catre").val(),
        "cocina_moviles": $("#cocina_moviles").val(),
        "ambulancia_ti": $("#ambulancia_ti").val(),
        "capacidad_ambulancia_ti": $("#capacidad_ambulancia_ti").val(),
        "ambulancia_traslado": $("#ambulancia_traslado").val(),
        "capacidad_ambulancia_traslado": $("#capacidad_ambulancia_traslado").val(),
        "vehiculo_carga": $("#vehiculo_carga").val(),
        "capacidad_vehiculo_carga": $("#capacidad_vehiculo_carga").val(),
        "tractocamion": $("#tractocamion").val(),
        "capacidad_tractocamion": $("#capacidad_tractocamion").val(),
        "plataforma": $("#plataforma").val(),
        "capacidad_plataforma": $("#capacidad_plataforma").val(),
        "cama_baja": $("#cama_baja").val(),
        "capacidad_cama_baja": $("#capacidad_cama_baja").val(),
        "caja_seca": $("#caja_seca").val(),
        "capacidad_caja_seca": $("#capacidad_caja_seca").val(),
        "carro_mudanza": $("#carro_mudanza").val(),
        "capacidad_carro_mudanza": $("#capacidad_carro_mudanza").val(),
        "pullman": $("#pullman").val(),
        "capacidad_pullman": $("#capacidad_pullman").val(),
        "aeronave_alafija": $("#aeronave_alafija").val(),
        "capacidad_personas_aeronave_alafija": $("#capacidad_personas_aeronave_alafija").val(),
        "capacidad_aeronave_alafija": $("#capacidad_aeronave_alafija").val(),
        "aeronave_alarotativa": $("#aeronave_alarotativa").val(),
        "capacidad_personas_aeronave_alarotativa": $("#capacidad_personas_aeronave_alarotativa").val(),
        "capacidad_aeronave_alarotativa": $("#capacidad_aeronave_alarotativa").val(),
        "ventiladores_mecanicos": $("#ventiladores_mecanicos").val(),
        "monitores": $("#monitores").val(),
        "rx_portatiles": $("#rx_portatiles").val(),
        "pulsioximetros": $("#pulsioximetros").val(),
        "carro_rojo": $("#carro_rojo").val(),
        "ultrasonidos_moviles": $("#ultrasonidos_moviles").val(),
        "pruebas_covid_disponibles": $("#pruebas_covid_disponibles").val(),
        "pruebas_covid_realizadas": $("#pruebas_covid_realizadas").val(),
        "pruebas_covid_positivas": $("#pruebas_covid_positivas").val(),
        "pruebas_covid_negativas": $("#pruebas_covid_negativas").val(),
        "cubrebocas": $("#cubrebocas").val(),
        "caretas": $("#caretas").val(),
        "guantes": $("#guantes").val(),
        "trajes_desechables": $("#trajes_desechables").val(),
        "trajes_aislamiento": $("#trajes_aislamiento").val(),
        "personal_total": $("#personal_total").val(),
        "medicos_ti": $("#medicos_ti").val(),
        "medicos_urg": $("#medicos_urg").val(),
        "medicina_interna": $("#medicina_interna").val(),
        "neumologia": $("#neumologia").val(),
        "infectologia": $("#infectologia").val(),
        "anesteciologia": $("#anesteciologia").val(),
        "medico_cirujano": $("#medico_cirujano").val(),
        "cirujano_dentista": $("#cirujano_dentista").val(),
        "enfermeros": $("#enfermeros").val(),
        "enfermeros_ti": $("#enfermeros_ti").val(),
        "enfermeros_inhaloterapia": $("#enfermeros_inhaloterapia").val(),
        "personal_operativo_apoyo": $("#personal_operativo_apoyo").val(),
        "oficiales_sanidad": $("#oficiales_sanidad").val(),
        "tropas_sanidad": $("#tropas_sanidad").val()
    };
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/reportehospital',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(json),
        success: function (response) {
            console.log(response);
            const Toast = Swal.mixin({
                toast: true,
                showConfirmButton: false,
                timer: 2000,
                position: 'center',
                timerProgressBar: true
            });
            if (response.success) {
                Toast.fire({
                    type: 'success',
                    title: 'Reporte guardado correctamente.'
                }).then(function () {

                });
            } else {
                Toast.fire({
                    type: 'error',
                    title: 'Algo paso y el reporte no se registro. Intentar mas tarde.'
                }).then(function () {

                });
            }

        },
        error: function (err) {
            console.log(err);
        }
    }));

}

var inputs = $("input");
$.each(inputs, function (i) {
    if (inputs[i].id.includes("porcentaje")) {
        inputs[i].value = "0%";
    }
});



$("#reporteHospitalario").submit(function (e) {
    e.preventDefault();
    console.log("baia baia");
    guardarReporteHospital();
});

///socket on message para actualizar registro 

$("#pacientes_totales").on("change", function () {
    $("#pacientes_totales_porcentaje").val("100%");
    $("#pacientes_graves").attr("max", parseInt($("#pacientes_totales").val()));
    $("#pacientes_nograves").attr("max", parseInt($("#pacientes_totales").val()));
    $("#recuperados").attr("max", parseInt($("#pacientes_totales").val()));
    $("#fallecidos").attr("max", parseInt($("#pacientes_totales").val()));

    $("#pacientes_graves").change();
    $("#pacientes_nograves").change();
    $("#recuperados").change();
    $("#fallecidos").change();


});
$("#pacientes_graves").on("change", function () {
    var graves = parseInt($("#pacientes_graves").val());
    var nograves = parseInt($("#pacientes_nograves").val());
    var recuperados = parseInt($("#recuperados").val());
    var fallecidos = parseInt($("#fallecidos").val());
    var total = parseInt($("#pacientes_totales").val());

    if ((graves + nograves + recuperados + fallecidos) > total) {
        $("#pacientes_graves").val(0);
        $("#pacientes_graves").attr("max", 0);
    } else {
        $("#pacientes_graves").attr("max", (total - (nograves + recuperados + fallecidos)));
        $("#pacientes_nograves").attr("max", (total - (graves + recuperados + fallecidos)));
        $("#recuperados").attr("max", (total - (graves + nograves + fallecidos)));
        $("#fallecidos").attr("max", (total - (graves + nograves + recuperados)));
    }

    if (parseInt($("#pacientes_totales").val()) !== 0) {
        $("#pacientes_graves_porcentaje").val((parseInt($("#pacientes_graves").val()) * 100) / parseInt($("#pacientes_totales").val()));
        $("#pacientes_graves_porcentaje").val(parseFloat($("#pacientes_graves_porcentaje").val()).toFixed(2) + "%");
    }
});
$("#pacientes_nograves").on("change", function () {
    var graves = parseInt($("#pacientes_graves").val());
    var nograves = parseInt($("#pacientes_nograves").val());
    var recuperados = parseInt($("#recuperados").val());
    var fallecidos = parseInt($("#fallecidos").val());
    var total = parseInt($("#pacientes_totales").val());

    if ((graves + nograves + recuperados + fallecidos) > total) {
        $("#pacientes_nograves").val(0);
        $("#pacientes_nograves").attr("max", 0);
    } else {
        $("#pacientes_graves").attr("max", (total - (nograves + recuperados + fallecidos)));
        $("#pacientes_nograves").attr("max", (total - (graves + recuperados + fallecidos)));
        $("#recuperados").attr("max", (total - (graves + nograves + fallecidos)));
        $("#fallecidos").attr("max", (total - (graves + nograves + recuperados)));
    }

    if (parseInt($("#pacientes_totales").val()) !== 0) {
        $("#pacientes_nograves_porcentaje").val((parseInt($("#pacientes_nograves").val()) * 100) / parseInt($("#pacientes_totales").val()) + "%");
        $("#pacientes_nograves_porcentaje").val(parseFloat($("#pacientes_nograves_porcentaje").val()).toFixed(2) + "%");
    }
});
$("#recuperados").on("change", function () {
    var graves = parseInt($("#pacientes_graves").val());
    var nograves = parseInt($("#pacientes_nograves").val());
    var recuperados = parseInt($("#recuperados").val());
    var fallecidos = parseInt($("#fallecidos").val());
    var total = parseInt($("#pacientes_totales").val());

    if ((graves + nograves + recuperados + fallecidos) > total) {
        $("#recuperados").val(0);
        $("#recuperados").attr("max", 0);
    } else {
        $("#pacientes_graves").attr("max", (total - (nograves + recuperados + fallecidos)));
        $("#pacientes_nograves").attr("max", (total - (graves + recuperados + fallecidos)));
        $("#recuperados").attr("max", (total - (graves + nograves + fallecidos)));
        $("#fallecidos").attr("max", (total - (graves + nograves + recuperados)));
    }

    if (parseInt($("#pacientes_totales").val()) !== 0) {
        $("#recuperados_porcentaje").val((parseInt($("#recuperados").val()) * 100) / parseInt($("#pacientes_totales").val()) + "%");
        $("#recuperados_porcentaje").val(parseFloat($("#recuperados_porcentaje").val()).toFixed(2) + "%");
    }
});
$("#fallecidos").on("change", function () {
    var graves = parseInt($("#pacientes_graves").val());
    var nograves = parseInt($("#pacientes_nograves").val());
    var recuperados = parseInt($("#recuperados").val());
    var fallecidos = parseInt($("#fallecidos").val());
    var total = parseInt($("#pacientes_totales").val());

    if ((graves + nograves + recuperados + fallecidos) > total) {
        $("#fallecidos").val(0);
        $("#fallecidos").attr("max", 0);
    } else {
        $("#pacientes_graves").attr("max", (total - (nograves + recuperados + fallecidos)));
        $("#pacientes_nograves").attr("max", (total - (graves + recuperados + fallecidos)));
        $("#recuperados").attr("max", (total - (graves + nograves + fallecidos)));
        $("#fallecidos").attr("max", (total - (graves + nograves + recuperados)));
    }

    if (parseInt($("#pacientes_totales").val()) !== 0) {
        $("#fallecidos_porcentaje").val((parseInt($("#fallecidos").val()) * 100) / parseInt($("#pacientes_totales").val()) + "%");
        $("#fallecidos_porcentaje").val(parseFloat($("#fallecidos_porcentaje").val()).toFixed(2) + "%");
    } else {
        $("#fallecidos_porcentaje").val("0.00%");
    }
});


$("#camas_totales").on("change", function () {
    $("#camas_ocupadas").attr("max", parseInt($("#camas_totales").val()));
    $("#camas_ocupadas").change();
});
$("#camas_ocupadas").on("change", function () {
    if (parseInt($("#camas_totales").val()) !== 0) {
        $("#camas_ocupadas_porcentaje").val((parseInt($("#camas_ocupadas").val()) * 100) / parseInt($("#camas_totales").val()));
        $("#camas_ocupadas_porcentaje").val(parseFloat($("#camas_ocupadas_porcentaje").val()).toFixed(2) + "%");
    }
});
$("#camas_covid_totales").on("change", function () {
    $("#camas_covid_ocupadas").attr("max", parseInt($("#camas_covid_totales").val()));
    $("#camas_covid_ocupadas").change();
});
$("#camas_covid_ocupadas").on("change", function () {
    if (parseInt($("#camas_covid_totales").val()) !== 0) {
        $("#camas_covid_ocupadas_porcentaje").val((parseInt($("#camas_covid_ocupadas").val()) * 100) / parseInt($("#camas_covid_totales").val()) + "%");
        $("#camas_covid_ocupadas_porcentaje").val(parseFloat($("#camas_covid_ocupadas_porcentaje").val()).toFixed(2) + "%");
    }
});
$("#camas_ti_totales").on("change", function () {
    $("#camas_ti_ocupadas").attr("max", parseInt($("#camas_ti_totales").val()));
    $("#camas_ti_ocupadas").change();
});
$("#camas_ti_ocupadas").on("change", function () {
    if (parseInt($("#camas_ti_totales").val()) !== 0) {
        $("#camas_ti_ocupadas_porcentaje").val((parseInt($("#camas_ti_ocupadas").val()) * 100) / parseInt($("#camas_ti_totales").val()) + "%");
        $("#camas_ti_ocupadas_porcentaje").val(parseFloat($("#camas_ti_ocupadas_porcentaje").val()).toFixed(2) + "%");
    }
});
$("#camas_urgencias_totales").on("change", function () {
    $("#camas_urgencias_ocupadas").attr("max", parseInt($("#camas_urgencias_totales").val()));
    $("#camas_urgencias_ocupadas").change();
});
$("#camas_urgencias_ocupadas").on("change", function () {
    if (parseInt($("#camas_urgencias_totales").val()) !== 0) {
        $("#camas_urgencias_ocupadas_porcentaje").val((parseInt($("#camas_urgencias_ocupadas").val()) * 100) / parseInt($("#camas_urgencias_totales").val()) + "%");
        $("#camas_urgencias_ocupadas_porcentaje").val(parseFloat($("#camas_urgencias_ocupadas_porcentaje").val()).toFixed(2) + "%");
    }
});

$("#pruebas_covid_disponibles").on("change", function () {
    if (parseInt($("#pruebas_covid_disponibles").val()) !== 0) {
        $("#pruebas_covid_disponibles_porcentaje").val("100.00%");
    }
});
$("#pruebas_covid_realizadas").on("change", function () {
    $("#pruebas_covid_realizadas").removeAttr("max");
    $("#pruebas_covid_realizadas_porcentaje").val("100.00%");

    $("#pruebas_covid_positivas").attr("max", parseInt($("#pruebas_covid_realizadas").val()));
    $("#pruebas_covid_negativas").attr("max", parseInt($("#pruebas_covid_realizadas").val()));

    $("#pruebas_covid_positivas").change();
    $("#pruebas_covid_negativas").change();


});
$("#pruebas_covid_positivas").on("change", function () {
    var pruebas_covid_positivas = parseInt($("#pruebas_covid_positivas").val());
    var pruebas_covid_negativas = parseInt($("#pruebas_covid_negativas").val());
    var total = parseInt($("#pruebas_covid_realizadas").val());

    if ((pruebas_covid_positivas + pruebas_covid_negativas) > total) {
        $("#pruebas_covid_positivas").val(0);
        $("#pruebas_covid_positivas").attr("max", 0);
    } else {
        $("#pruebas_covid_positivas").attr("max", (total - (pruebas_covid_negativas)));
        $("#pruebas_covid_negativas").attr("max", (total - (pruebas_covid_positivas)));
    }

    if (parseInt($("#pruebas_covid_realizadas").val()) !== 0) {
        $("#pruebas_covid_positivas_porcentaje").val((parseInt($("#pruebas_covid_positivas").val()) * 100) / parseInt($("#pruebas_covid_realizadas").val()) + "%");
        $("#pruebas_covid_positivas_porcentaje").val(parseFloat($("#pruebas_covid_positivas_porcentaje").val()).toFixed(2) + "%");
    }
});
$("#pruebas_covid_negativas").on("change", function () {
    var pruebas_covid_positivas = parseInt($("#pruebas_covid_positivas").val());
    var pruebas_covid_negativas = parseInt($("#pruebas_covid_negativas").val());
    var total = parseInt($("#pruebas_covid_realizadas").val());

    if ((pruebas_covid_positivas + pruebas_covid_negativas) > total) {
        $("#pruebas_covid_negativas").val(0);
        $("#pruebas_covid_negativas").attr("max", 0);
    } else {
        $("#pruebas_covid_positivas").attr("max", (total - (pruebas_covid_negativas)));
        $("#pruebas_covid_negativas").attr("max", (total - (pruebas_covid_positivas)));
    }

    if (parseInt($("#pruebas_covid_realizadas").val()) !== 0) {
        $("#pruebas_covid_negativas_porcentaje").val((parseInt($("#pruebas_covid_negativas").val()) * 100) / parseInt($("#pruebas_covid_realizadas").val()) + "%");
        $("#pruebas_covid_negativas_porcentaje").val(parseFloat($("#pruebas_covid_negativas_porcentaje").val()).toFixed(2) + "%");
    }
});







getUltimoReporte();