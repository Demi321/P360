/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global sesion_cookie, RequestPOST */
let horario_entrada_reporte_trabajo = () => {
    if (jornada_usuario.success) {
        let hrs = parseInt(jornada_usuario.hora_inicio_jornada.split(":")[0]);
        let mins = parseInt(jornada_usuario.hora_inicio_jornada.split(":")[1]);
        let secs = parseInt(jornada_usuario.hora_inicio_jornada.split(":")[2]);

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
        $("#reporte_actividades_hora_entrada").val(time);
        $("#reporte_actividades_form input[type=submit]")[0].disabled = false;
    }


};
const init_reporte_actividades = (json) => {
    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;
    var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
    var diasSemana = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");
    var f = new Date();
    document.getElementById("today_reporte_actividades").innerHTML = diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();

    let clock_reporte_actividades = () => {
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
        document.getElementById("clock_reporte_actividades").innerText = time;
        $("#reporte_actividades_hora_salida").val(time);
        setTimeout(clock_reporte_actividades, 1000);
    };
    clock_reporte_actividades();
    if (jornada_usuario.success) {
        $("#reporte_actividades_reporte").val(jornada_usuario.reporte);
    } else {
        $("#reporte_actividades_form input[type=submit]")[0].disabled = true;
    }

    horario_entrada_reporte_trabajo();

    $("#reporte_actividades_form").submit((e) => {
        e.preventDefault();
        let json = {};
        json.id360 = id_usuario;
        json.id_jornada = jornada_usuario.id_jornada;
        json.reporte = $("#reporte_actividades_reporte").val();
        console.log(json);
        RequestPOST("/API/empresas360/reporte_actividades", json).then((response) => {
            console.log(response);
            swal.fire({
                text: response.mensaje
            });
        });
    });
}