/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//INFORMACION EMPRESA
$(document).ready(async function () {
    let usuarioInfo = await JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA))

    let empresaUsuarioInfo = await RequestGET("/API/empresas360/info_empresa/" + usuarioInfo.tipo_usuario);
    $("#nombreEmpresa").text(empresaUsuarioInfo.razon_social)
    let sucursalesEmpresaUsuarioInfo = await RequestGET("/API/lineamientos/listado_sucursales/" + usuarioInfo.tipo_usuario)
    $("#totalSucursales").text("Sucursales: " + sucursalesEmpresaUsuarioInfo.length);
    //AJAX OBTENER EMPLEADOS DE UN EMPRESA
    let idsEmpleadosEmpresa = await $.ajax({
        type: 'POST',
        url: 'https://empresas.claro360.com/plataforma360/API/empresas360/jornadas_laborales/empresa/obtener_ids',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            id: usuarioInfo.tipo_usuario
        }),
        success: function (response) {
            //console.log("RES JSON1: ", response)
        },
        error: function (err) {
            console.log("Ocurrio un problema en la llamada idsEmpleadosEmpresa", err)
        }
    })

    let totalEmpleados = idsEmpleadosEmpresa.length
    $("#totalEmpleados").text("Total de empleados " + totalEmpleados)

    //AJAX OBTENER REPORTE DE JORNADAS LABORALES DE UNA EMPRESA POR RANGO DE FECHAS 
    let empleadosEnJorandaLaboral = undefined
    await RequestPOST("/API/empresas360/jornadas_laborales/empresa/obtener_ids/en_jornada", {id: JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario}).then((ids) => {
        empleadosEnJorandaLaboral = ids
    })
    contadorActivos = empleadosEnJorandaLaboral.length
    sinConexionWeb = totalEmpleados - contadorActivos

    //GRAFICA DE PASTEL EMPRESAS
    google.charts.load('current', {'packages': ['corechart']});
    google.charts.setOnLoadCallback(drawChartActivos);
    function drawChartActivos() {
        var data = google.visualization.arrayToDataTable([
            ['Tipo de Conexion', 'Conexiones'],
            ['Conexion Web', contadorActivos],
            ['Conexion App', 40],
            ['Sin Conexion', sinConexionWeb]
        ]);
        var options = {
            title: 'Conexiones',
            width: '100%',
            colors: ['#96C02A', '#278597', '#E74339'],
            backgroundColor: '#f5f5f5'
        };
        var chart = new google.visualization.PieChart(document.getElementById('piechartConexionEmpresa'));
        chart.draw(data, options);

    }
    //GRAFICA DE CARTAS EMPRESA
    //document.addEventListener("load", setColorBasal(2, 'Faltas'));
    //document.addEventListener("load", setColorBasal(6, 'Retardos'));
    //document.addEventListener("load", setColorBasal(8, 'Puntales'));
})
function setColorBasal(numero, clase) {
    numero = parseInt(numero);
    switch (clase) {
        case  'Faltas':
            for (var i = 1; i <= numero; i++) {
                document.getElementById("faltaEmpresa_" + i.toString()).className = "rectangleColor1";
            }
            break;
        case  'Retardos':
            for (var i = 1; i <= numero; i++) {
                document.getElementById("retardoEmpresa_" + i.toString()).className = "rectangleColor2";
            }
            break;
        case  'Puntales':
            for (var i = 1; i <= numero; i++) {
                document.getElementById("puntualEmpresa_" + i.toString()).className = "rectangleColor3";
            }
            break;
    }
}
//GENERAR REPORTE DE JORNADAS LABORALES
$(document).ready(() => {
    $("#reporteEmpleadoJornadasLaborales").hide()
    //$("#reporteJornadasLaborales").hide()
    //$("#reporteEmpleadoJornadasLaborales").show()
})
let tablaHistorialLaboralEmpleado
let id360Estatico
let jornadas_laborales_empleado
let puntuales = {}
let retardos = {}
let faltas = {}
const botonObtenerJornadasReporteEmpleado = async (id360Estatico, jornadas_laborales_empleado) => {
    if (tablaHistorialLaboralEmpleado !== null && tablaHistorialLaboralEmpleado !== undefined) {
        tablaHistorialLaboralEmpleado.destroy()
        tablaHistorialLaboralEmpleado = undefined
    }
    const tablaHistorialLaboralEmpleado2 = $("#tablaHistorialLaboralEmpleado")
    const conResultados = $("#empleadoConHistorialLaboral");
    const sinResultados = $("#empleadoSinHistorialLaboral");
    let jornadas_laborales_rango_empleado_tabla = []
    let rangoInicioEmpleado = $("#fecha_inicio_historial_laboral2").val()
    let rangoFinEmpleado = $("#fecha_fin_historial_laboral2").val()
    //SERVIDOR
    let jornadas_laborales_rango_empleado = await $.ajax({
        type: 'POST',
        url: 'https://empresas.claro360.com/plataforma360/API/empresas360/jornadas_laborales',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            id: id360Estatico,
            inicio: rangoInicioEmpleado,
            fin: rangoFinEmpleado
        }),
        success: function (response) {
            //console.log("RES JSON1: ", response)
        },
        error: function (err) {
            console.log("Ocurrio un problema en la llamada jornadas_laborales_rango_empleado", err)
        }
    })
    //LOCAL
    /*jornadas_laborales_rango_empleado = {
     "data": [
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-04",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": null,
     "time_created": "08:59:16",
     "id": "650",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46906804",
     "lng": null,
     "date_created": "2021-01-04",
     "id_socket": "8144d002-abc7-4dcc-ac3e-c497eb5f97ed",
     "contadorDesconexion": "0",
     "time_updated": "21:04:26",
     "idsesion": "2_MX40NjkwNjgwNH5-MTYwOTgxNTg1OTYwOH5Ycm45c3FLa1p5V1NxMGVWZW9YcTMyOHF-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwNjgwNCZzaWc9NGExM2UzYzkzNzE5NDJlMDU4MWEzODRhODUzYzdlOTlhOTExNmJkMDpzZXNzaW9uX2lkPTJfTVg0ME5qa3dOamd3Tkg1LU1UWXdPVGd4TlRnMU9UWXdPSDVZY200NWMzRkxhMXA1VjFOeE1HVldaVzlZY1RNeU9IRi1mZyZjcmVhdGVfdGltZT0xNjA5ODE1ODU5Jm5vbmNlPS03MDMyNTIyMTQmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxMjQwNzg1OQ==",
     "id_usuario": "9991336774",
     "time_finished": null,
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-05",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": null,
     "time_created": "09:03:03",
     "id": "709",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46906854",
     "lng": null,
     "date_created": "2021-01-05",
     "id_socket": "564f6f8a-a669-4eae-8c18-8607e252cc72",
     "contadorDesconexion": "0",
     "time_updated": "14:06:15",
     "idsesion": "1_MX40NjkwNjg1NH5-MTYwOTg3NTE2ODIwNX5CbldRNHN4M0JRZ1JVTHNyVEFDY2JXOHJ-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwNjg1NCZzaWc9NTgxZDJmZTJhMDk1NzFkYTJiZmVjN2YxZGNiYmU2NGQzZDEzZDBiOTpzZXNzaW9uX2lkPTFfTVg0ME5qa3dOamcxTkg1LU1UWXdPVGczTlRFMk9ESXdOWDVDYmxkUk5ITjRNMEpSWjFKVlRITnlWRUZEWTJKWE9ISi1mZyZjcmVhdGVfdGltZT0xNjA5ODc1MTY4Jm5vbmNlPS0xOTAwNTIxNzE4JnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE2MTI0NjcxNjg=",
     "id_usuario": "9991336774",
     "time_finished": null,
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-07",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " reporte",
     "tipo_area": "463",
     "web": null,
     "time_created": "09:00:37",
     "id": "786",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46906934",
     "lng": null,
     "date_created": "2021-01-07",
     "id_socket": "cf8cee40-6a93-4832-bca2-b86efcd6b790",
     "contadorDesconexion": "0",
     "time_updated": "18:14:44",
     "idsesion": "2_MX40NjkwNjkzNH5-MTYxMDA2MzMxNDE1MX41YzVjdjRWaXFoMldaay9GZDFHN3c5T1B-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwNjkzNCZzaWc9MTFjY2UyNjVmNzgzOGYyYzNjMTZkN2I3YjgxYzUxNzMwNjU3Mzk1ZTpzZXNzaW9uX2lkPTJfTVg0ME5qa3dOamt6Tkg1LU1UWXhNREEyTXpNeE5ERTFNWDQxWXpWamRqUldhWEZvTWxkYWF5OUdaREZITjNjNVQxQi1mZyZjcmVhdGVfdGltZT0xNjEwMDYzMzE0Jm5vbmNlPTY1NDU1MDU4JnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE2MTI2NTUzMTQ=",
     "id_usuario": "9991336774",
     "time_finished": null,
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-08",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": null,
     "time_created": "08:59:40",
     "id": "826",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46906954",
     "lng": null,
     "date_created": "2021-01-08",
     "id_socket": "9fc4ecd2-74a8-4adf-9326-ba0e9e417269",
     "contadorDesconexion": "0",
     "time_updated": "13:34:36",
     "idsesion": "2_MX40NjkwNjk1NH5-MTYxMDEzNDIxNDU5Mn5BVmdZRGpTaWF6UFE4S2xFbnRLK1RVeWR-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwNjk1NCZzaWc9ZTU3ZjUwNjY2NmRjOTc0OTNmY2M5ZjFiMTA0M2EwNjk4OTM4ZTFhNjpzZXNzaW9uX2lkPTJfTVg0ME5qa3dOamsxTkg1LU1UWXhNREV6TkRJeE5EVTVNbjVCVm1kWlJHcFRhV0Y2VUZFNFMyeEZiblJMSzFSVmVXUi1mZyZjcmVhdGVfdGltZT0xNjEwMTM0MjE0Jm5vbmNlPTc5MzM0NjU4MyZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNjEyNzI2MjE0",
     "id_usuario": "9991336774",
     "time_finished": null,
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-11",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": "[ , ]",
     "tipo_area": "463",
     "web": null,
     "time_created": "08:50:28",
     "id": "906",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46906984",
     "lng": null,
     "date_created": "2021-01-11",
     "id_socket": "d2ee8ed0-04e6-431a-b9e0-a9857d39b922",
     "contadorDesconexion": "12",
     "time_updated": "20:40:51",
     "idsesion": "1_MX40NjkwNjk4NH5-MTYxMDQxOTI0MzQ1OX5VVGtZK05zTW45MWcyMnNVYWgrL1pHNzl-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwNjk4NCZzaWc9YWJjMjc4MDA3YWQ2MDBkMjAxMDIyNDk5Yzg1Y2Q5MWU4YTk0MWQ2NDpzZXNzaW9uX2lkPTFfTVg0ME5qa3dOams0Tkg1LU1UWXhNRFF4T1RJME16UTFPWDVWVkd0WkswNXpUVzQ1TVdjeU1uTlZZV2dyTDFwSE56bC1mZyZjcmVhdGVfdGltZT0xNjEwNDE5MjQzJm5vbmNlPTIxMzA3NzY3ODgmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxMzAxMTI0Mw==",
     "id_usuario": "9991336774",
     "time_finished": null,
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-12",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": null,
     "time_created": "08:53:41",
     "id": "944",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46907014",
     "lng": null,
     "date_created": "2021-01-12",
     "id_socket": "4eb2dddd-e5c2-45ee-810b-3e1247873687",
     "contadorDesconexion": "4",
     "time_updated": "19:06:50",
     "idsesion": "1_MX40NjkwNzAxNH5-MTYxMDQ5OTk5NTM1NX5OWjN4VlBaZjg2NkpMbHRscFByRWdEN3J-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwNzAxNCZzaWc9MWY2YmZjNmE2YWFjMDhlMWRhNTczZjJmMjI5NmNkMWExMjAzMzVjNDpzZXNzaW9uX2lkPTFfTVg0ME5qa3dOekF4Tkg1LU1UWXhNRFE1T1RrNU5UTTFOWDVPV2pONFZsQmFaamcyTmtwTWJIUnNjRkJ5UldkRU4zSi1mZyZjcmVhdGVfdGltZT0xNjEwNDk5OTk1Jm5vbmNlPS0yMDg1MDg0NjczJnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE2MTMwOTE5OTU=",
     "id_usuario": "9991336774",
     "time_finished": "19:06:50",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-13",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": null,
     "time_created": "08:33:35",
     "id": "999",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46907024",
     "lng": null,
     "date_created": "2021-01-13",
     "id_socket": "bfb17049-412a-4764-a56a-32c1d3edc86f",
     "contadorDesconexion": "10",
     "time_updated": "14:33:16",
     "idsesion": "2_MX40NjkwNzAyNH5-MTYxMDU3MDM2NjA3N35FUjVrVzRHTFpUODJJZTNtZjlHVkR6NUV-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwNzAyNCZzaWc9MjMyNWU1MDEwOWRmYzFkOWQxMzU3OWQyOTE4Yzg2MDllYWE4ZWJjMDpzZXNzaW9uX2lkPTJfTVg0ME5qa3dOekF5Tkg1LU1UWXhNRFUzTURNMk5qQTNOMzVGVWpWclZ6UkhURnBVT0RKSlpUTnRaamxIVmtSNk5VVi1mZyZjcmVhdGVfdGltZT0xNjEwNTcwMzY2Jm5vbmNlPS02Nzc4NjUxODQmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxMzE2MjM2Ng==",
     "id_usuario": "9991336774",
     "time_finished": "14:33:16",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-14",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " reporte",
     "tipo_area": "463",
     "web": null,
     "time_created": "08:53:48",
     "id": "1012",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46907024",
     "lng": null,
     "date_created": "2021-01-14",
     "id_socket": "e9993cc8-4f6a-4e8d-8e3a-346d5158e6ba",
     "contadorDesconexion": "14",
     "time_updated": "11:14:36",
     "idsesion": "2_MX40NjkwNzAyNH5-MTYxMDY0MzcxNTI4MX5QZ3lYSFg2Nm5aREVlcnNjenNraGxaTmh-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwNzAyNCZzaWc9YjhiM2FjZjg5OWE4ZDhjMzkzYWRlNDc1ODQ2YzQzNDhhZjJlZWRkOTpzZXNzaW9uX2lkPTJfTVg0ME5qa3dOekF5Tkg1LU1UWXhNRFkwTXpjeE5USTRNWDVRWjNsWVNGZzJObTVhUkVWbGNuTmplbk5yYUd4YVRtaC1mZyZjcmVhdGVfdGltZT0xNjEwNjQzNzE1Jm5vbmNlPTE0OTE2MDEzNjAmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxMzIzNTcxNQ==",
     "id_usuario": "9991336774",
     "time_finished": "11:14:36",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-15",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": null,
     "time_created": "08:43:39",
     "id": "1092",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46907054",
     "lng": null,
     "date_created": "2021-01-15",
     "id_socket": "9ea9281b-2718-4935-9fd9-759c1963f58d",
     "contadorDesconexion": "2",
     "time_updated": "19:03:10",
     "idsesion": "2_MX40NjkwNzA1NH5-MTYxMDc1ODk4NjU5NX5JMk9TeWZFMEhkL29kb3F0TkJITzV1VWJ-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwNzA1NCZzaWc9ZDgzNzNlNDJmZWRhMGM3YmRhNTkwMzBiM2NmMGY2MmI4ZWRhMGUwNDpzZXNzaW9uX2lkPTJfTVg0ME5qa3dOekExTkg1LU1UWXhNRGMxT0RrNE5qVTVOWDVKTWs5VGVXWkZNRWhrTDI5a2IzRjBUa0pJVHpWMVZXSi1mZyZjcmVhdGVfdGltZT0xNjEwNzU4OTg2Jm5vbmNlPS0zODI5ODYyODMmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxMzM1MDk4Ng==",
     "id_usuario": "9991336774",
     "time_finished": null,
     "tipo_servicio": "3064",
     "activo": "1"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-18",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": null,
     "time_created": "08:48:39",
     "id": "1109",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46907154",
     "lng": null,
     "date_created": "2021-01-18",
     "id_socket": "f39d3636-8e74-4f00-acb3-c42194b1d88b",
     "contadorDesconexion": "5",
     "time_updated": "23:15:49",
     "idsesion": "1_MX40NjkwNzE1NH5-MTYxMTAzMzMzOTk0OX5YN240ajZOYUYyOE42b3pXdGlkSFJvQzZ-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwNzE1NCZzaWc9ZTM4N2RmNzg1ZWNiYzdlZGJkZmRiM2Q4MTE3MjMwY2JjMjEwYzExMDpzZXNzaW9uX2lkPTFfTVg0ME5qa3dOekUxTkg1LU1UWXhNVEF6TXpNek9UazBPWDVZTjI0MGFqWk9ZVVl5T0U0MmIzcFhkR2xrU0ZKdlF6Wi1mZyZjcmVhdGVfdGltZT0xNjExMDMzMzM5Jm5vbmNlPS0xMDIxOTM0NDk0JnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE2MTM2MjUzMzk=",
     "id_usuario": "9991336774",
     "time_finished": "23:15:49",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-19",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": null,
     "time_created": "09:01:08",
     "id": "1184",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46907184",
     "lng": null,
     "date_created": "2021-01-19",
     "id_socket": "2501a28b-ff45-4426-a4dc-e7428cbb2649",
     "contadorDesconexion": "12",
     "time_updated": "19:58:57",
     "idsesion": "1_MX40NjkwNzE4NH5-MTYxMTEwNjk1OTM2Nn5MakZNNkJUWmIvNys5ZERRaWRuZlhPQVd-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwNzE4NCZzaWc9ZTk2MTNjMjM5NWQ1NTdiMWVhY2ZiODI0OGJmY2UzOWNiNDVjMzhmYTpzZXNzaW9uX2lkPTFfTVg0ME5qa3dOekU0Tkg1LU1UWXhNVEV3TmprMU9UTTJObjVNYWtaTk5rSlVXbUl2TnlzNVpFUlJhV1J1WmxoUFFWZC1mZyZjcmVhdGVfdGltZT0xNjExMTA2OTU5Jm5vbmNlPS0xMDMxNTIzMTgxJnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE2MTM2OTg5NTk=",
     "id_usuario": "9991336774",
     "time_finished": "19:58:57",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-20",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " Reporte sobre actividades ealizadas",
     "tipo_area": "463",
     "web": null,
     "time_created": "08:56:13",
     "id": "1215",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46907224",
     "lng": null,
     "date_created": "2021-01-20",
     "id_socket": "b45179a1-963d-495b-94a4-739c7fbd93ad",
     "contadorDesconexion": "22",
     "time_updated": "20:41:29",
     "idsesion": "1_MX40NjkwNzIyNH5-MTYxMTE5Njg3OTI3OH5oSElLV2g1UkdJR1Y0MTF3Tnd4RHM3THp-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwNzIyNCZzaWc9ZDA0MDFmN2Y4YTg0YjdhMWYzZjExYTQxMjU3NGI4NmYyOWRmOGQ1MDpzZXNzaW9uX2lkPTFfTVg0ME5qa3dOekl5Tkg1LU1UWXhNVEU1TmpnM09USTNPSDVvU0VsTFYyZzFVa2RKUjFZME1URjNUbmQ0UkhNM1RIcC1mZyZjcmVhdGVfdGltZT0xNjExMTk2ODc5Jm5vbmNlPTcyMzc5MTA0OSZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNjEzNzg4ODc5",
     "id_usuario": "9991336774",
     "time_finished": "20:41:29",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-21",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": null,
     "time_created": "08:54:57",
     "id": "1269",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46907224",
     "lng": null,
     "date_created": "2021-01-21",
     "id_socket": "0e1fd5fd-d79b-4f06-a4a0-623fbf83966c",
     "contadorDesconexion": "2",
     "time_updated": "19:53:07",
     "idsesion": "1_MX40NjkwNzIyNH5-MTYxMTI0NDM2MDQ3Nn5xdllIN0IvaU50M09TdDVtTDJva09TZkx-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwNzIyNCZzaWc9MDIwNTEzMTc3NDY4M2U4NDIwYmZhNmQwYWIxN2U2NjVkMzNmMGE1ZDpzZXNzaW9uX2lkPTFfTVg0ME5qa3dOekl5Tkg1LU1UWXhNVEkwTkRNMk1EUTNObjV4ZGxsSU4wSXZhVTUwTTA5VGREVnRUREp2YTA5VFpreC1mZyZjcmVhdGVfdGltZT0xNjExMjQ0MzYwJm5vbmNlPS0xOTMyMTE0ODAyJnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE2MTM4MzYzNjA=",
     "id_usuario": "9991336774",
     "time_finished": "20:53:07",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-22",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": null,
     "time_created": "05:53:14",
     "id": "1305",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46907254",
     "lng": null,
     "date_created": "2021-01-22",
     "id_socket": "bb5b7b52-ccc8-4423-8538-8c42f1b79693",
     "contadorDesconexion": "11",
     "time_updated": "19:54:41",
     "idsesion": "1_MX40NjkwNzI1NH5-MTYxMTM2MTU5MDMyOH5jUUVvc2pXdFUzdnNhK1VyU3MxSVNqRll-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwNzI1NCZzaWc9ZWJiZWJjNDBmM2JiZjE1MDgwOWNhNGUzNTg5NGZiYjliMTJhMDY3MTpzZXNzaW9uX2lkPTFfTVg0ME5qa3dOekkxTkg1LU1UWXhNVE0yTVRVNU1ETXlPSDVqVVVWdmMycFhkRlV6ZG5OaEsxVnlVM014U1ZOcVJsbC1mZyZjcmVhdGVfdGltZT0xNjExMzYxNTkwJm5vbmNlPTExMTMwODc4ODMmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxMzk1MzU5MA==",
     "id_usuario": "9991336774",
     "time_finished": "18:54:41",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-25",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": null,
     "time_created": "09:00:58",
     "id": "1385",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46907264",
     "lng": null,
     "date_created": "2021-01-25",
     "id_socket": "4ca42354-1e93-469f-8cb7-da9b40e98a24",
     "contadorDesconexion": "9",
     "time_updated": "21:18:43",
     "idsesion": "1_MX40NjkwNzI2NH5-MTYxMTYyMTc5MDA3OX5wS3RVUkZHOFlWTzVxVldBUVhvdU9ITmV-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwNzI2NCZzaWc9Y2MwOTc3YmI0MGM0ZjYzNzZkNTMyMjNjZWQyZWRkZmYyODc3ZDIyYzpzZXNzaW9uX2lkPTFfTVg0ME5qa3dOekkyTkg1LU1UWXhNVFl5TVRjNU1EQTNPWDV3UzNSVlVrWkhPRmxXVHpWeFZsZEJVVmh2ZFU5SVRtVi1mZyZjcmVhdGVfdGltZT0xNjExNjIxNzkwJm5vbmNlPTE2MDgyMTA4NzUmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxNDIxMzc5MA==",
     "id_usuario": "9991336774",
     "time_finished": "19:18:43",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-26",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": null,
     "time_created": "08:54:26",
     "id": "1416",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46907284",
     "lng": null,
     "date_created": "2021-01-26",
     "id_socket": "65a9bb59-4cf3-43fc-9844-633b293c5dbf",
     "contadorDesconexion": "4",
     "time_updated": "22:01:00",
     "idsesion": "2_MX40NjkwNzI4NH5-MTYxMTcwNDYwOTU5OH5XZ3BKTzg3Smk2T1Q5elNiOUp5TUZuaTV-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwNzI4NCZzaWc9ZDYxMGNjZDExY2VjMWM5ZDg5MzRlYmU5NmQwZDI3YmNjMjgxM2UyZjpzZXNzaW9uX2lkPTJfTVg0ME5qa3dOekk0Tkg1LU1UWXhNVGN3TkRZd09UVTVPSDVYWjNCS1R6ZzNTbWsyVDFRNWVsTmlPVXA1VFVadWFUVi1mZyZjcmVhdGVfdGltZT0xNjExNzA0NjA5Jm5vbmNlPTE0NTk5NTU0OTYmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxNDI5NjYwOQ==",
     "id_usuario": "9991336774",
     "time_finished": "19:01:00",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-27",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": null,
     "time_created": "08:18:01",
     "id": "1510",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46908094",
     "lng": null,
     "date_created": "2021-01-27",
     "id_socket": "147b18cd-4d88-4abc-ac1a-b37cb939d068",
     "contadorDesconexion": "4",
     "time_updated": "23:24:07",
     "idsesion": "1_MX40NjkwODA5NH5-MTYxMTc3ODg4NDIwN351R05zTW1BTjUyb3huSWJLMVdBUFRnWSt-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwODA5NCZzaWc9NTExNWRkYmNlYzZkZGVmMDBmZGU5YTJhZTM0MWFjNDUzMDU3YWM5ZjpzZXNzaW9uX2lkPTFfTVg0ME5qa3dPREE1Tkg1LU1UWXhNVGMzT0RnNE5ESXdOMzUxUjA1elRXMUJUalV5YjNodVNXSkxNVmRCVUZSbldTdC1mZyZjcmVhdGVfdGltZT0xNjExNzc4ODg0Jm5vbmNlPS01MzA0MTE4OTYmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxNDM3MDg4NA==",
     "id_usuario": "9991336774",
     "time_finished": "14:24:07",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-28",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": null,
     "time_created": "03:14:56",
     "id": "1521",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46908094",
     "lng": null,
     "date_created": "2021-01-28",
     "id_socket": "895805aa-c187-4d14-930f-6a61bccabd3b",
     "contadorDesconexion": "1",
     "time_updated": "21:15:02",
     "idsesion": "1_MX40NjkwODA5NH5-MTYxMTgzNjA4NDYyM344ZWlNTWdvcHBCK1V2bWp0cmlvbWFyb3R-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwODA5NCZzaWc9Y2E2N2E5NTk5ZWNkODRmNTY1ODE0NjFkMGIxMTQ4YWY0YzNmNDM1NzpzZXNzaW9uX2lkPTFfTVg0ME5qa3dPREE1Tkg1LU1UWXhNVGd6TmpBNE5EWXlNMzQ0WldsTlRXZHZjSEJDSzFWMmJXcDBjbWx2YldGeWIzUi1mZyZjcmVhdGVfdGltZT0xNjExODM2MDg0Jm5vbmNlPTM1MDU3MTg4NyZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNjE0NDI4MDg0",
     "id_usuario": "9991336774",
     "time_finished": "06:15:02",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-29",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": null,
     "time_created": "04:52:10",
     "id": "1578",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46908134",
     "lng": null,
     "date_created": "2021-01-28",
     "id_socket": "eecf1f37-afa5-4ef6-9efd-2e500469410f",
     "contadorDesconexion": "8",
     "time_updated": "19:07:38",
     "idsesion": "1_MX40NjkwODEzNH5-MTYxMTk2ODg1Mzk1Nn5nMzBnUm55d2JudFhMNmx2MUJ0Q0lIeXF-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwODEzNCZzaWc9ZjNmNjQwMzc4ZGFlZjI3Y2I2YzVhNmUxYzYzNTAzNjg2OWZmMzBmNjpzZXNzaW9uX2lkPTFfTVg0ME5qa3dPREV6Tkg1LU1UWXhNVGsyT0RnMU16azFObjVuTXpCblVtNTVkMkp1ZEZoTU5teDJNVUowUTBsSWVYRi1mZyZjcmVhdGVfdGltZT0xNjExOTY4ODUzJm5vbmNlPS0xMTU3NTkwMzA3JnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE2MTQ1NjA4NTM=",
     "id_usuario": "9991336774",
     "time_finished": null,
     "tipo_servicio": "3064",
     "activo": "1"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-01-30",
     "idUsuario": "9991336774",
     "id360": "9991336774",
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": null,
     "tipo_area": "463",
     "web": "true",
     "time_created": "05:50:12",
     "id": "1620",
     "tipo_usuario": "124",
     "lat": "19.5592192",
     "apikey": "46908134",
     "lng": "-99.0347264",
     "date_created": "2021-01-30",
     "id_socket": "c8ca9c2f-ee35-4756-806d-221aa75df511",
     "contadorDesconexion": "6",
     "time_updated": "08:32:14",
     "idsesion": "2_MX40NjkwODEzNH5-MTYxMjAxNzEyNTc0NX52K0o0eXN2ZTBOQmRzQTdudTBIcG96YzR-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwODEzNCZzaWc9MDdmODRkYzg0ZjVkNTdiOGY2OTRjM2FjYzAyOGY1MTFjZTg0ZjliMjpzZXNzaW9uX2lkPTJfTVg0ME5qa3dPREV6Tkg1LU1UWXhNakF4TnpFeU5UYzBOWDUySzBvMGVYTjJaVEJPUW1SelFUZHVkVEJJY0c5Nll6Ui1mZyZjcmVhdGVfdGltZT0xNjEyMDE3MTI1Jm5vbmNlPS0xMzA0MDc3OTIxJnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE2MTQ2MDkxMjU=",
     "id_usuario": "9991336774",
     "time_finished": null,
     "tipo_servicio": "3064",
     "activo": "1"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-02-02",
     "idUsuario": "9991336774",
     "id360": "9991336774",
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": "true",
     "time_created": "08:29:43",
     "id": "1643",
     "tipo_usuario": "124",
     "lat": "19.4462672",
     "apikey": "46908144",
     "lng": "-99.1124246",
     "date_created": "2021-01-30",
     "id_socket": "9892e365-2522-4cac-8b57-27db4cb6edcd",
     "contadorDesconexion": "5",
     "time_updated": "16:32:07",
     "idsesion": "1_MX40NjkwODE0NH5-MTYxMjMwNTEyMjc4M34zdmFUN3dEQ1pHRmYxZmFEbllrQlZhOG5-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwODE0NCZzaWc9YmQzY2UyOTllY2U2ZDEyMzM3MTA3MjkxNTkyMDNhYjcwNmE2YmU4ZDpzZXNzaW9uX2lkPTFfTVg0ME5qa3dPREUwTkg1LU1UWXhNak13TlRFeU1qYzRNMzR6ZG1GVU4zZEVRMXBIUm1ZeFptRkVibGxyUWxaaE9HNS1mZyZjcmVhdGVfdGltZT0xNjEyMzA1MTIyJm5vbmNlPS0yMDc2MDQ5ODU0JnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE2MTQ4OTcxMjI=",
     "id_usuario": "9991336774",
     "time_finished": "16:32:07",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": null,
     "idUsuario": "9991336774",
     "id360": "9991336774",
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": null,
     "tipo_area": "463",
     "web": "true",
     "time_created": "08:27:44",
     "id": "1675",
     "tipo_usuario": "124",
     "lat": "19.4462672",
     "apikey": "46908144",
     "lng": "-99.1124246",
     "date_created": "2021-02-01",
     "id_socket": "8e546089-8126-4483-95a4-a8ad357307a7",
     "contadorDesconexion": "0",
     "time_updated": null,
     "idsesion": "1_MX40NjkwODE0NH5-MTYxMjMxMjA2MDkyOX4zTjJGSVlHWERVaGM3anFZYWxaN1BhYlJ-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwODE0NCZzaWc9NTRjZjM4ZDUwMWIyYjI5Yjg3ZDEwNzZhMWVkMmMxNzkyMzZkYjM3MDpzZXNzaW9uX2lkPTFfTVg0ME5qa3dPREUwTkg1LU1UWXhNak14TWpBMk1Ea3lPWDR6VGpKR1NWbEhXRVJWYUdNM2FuRlpZV3hhTjFCaFlsSi1mZyZjcmVhdGVfdGltZT0xNjEyMzEyMDYxJm5vbmNlPTAuOTQ4MjYxNzQyNTQxMjgzOCZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjEyMzk4NDYxJmNvbm5lY3Rpb25fZGF0YT0lN0IlMjJ1c2VyTmFtZSUyMiUzQSUyMkFub255bW91cyUyMFVzZXI5JTIyJTdEJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9",
     "id_usuario": "9991336774",
     "time_finished": null,
     "tipo_servicio": "3064",
     "activo": "1"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-02-02",
     "idUsuario": "9991336774",
     "id360": "9991336774",
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": null,
     "tipo_area": "463",
     "web": "true",
     "time_created": "08:56:01",
     "id": "1676",
     "tipo_usuario": "124",
     "lat": "19.4462672",
     "apikey": "46908144",
     "lng": "-99.1124246",
     "date_created": "2021-02-02",
     "id_socket": "2b5524e7-42d7-479a-b2f2-7006d0e49ea0",
     "contadorDesconexion": "2",
     "time_updated": "20:56:31",
     "idsesion": "2_MX40NjkwODE0NH5-MTYxMjMxMzc4OTg2MX4rUUw0VW42WlBNdXcyeHFEZEtkamJNbVl-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwODE0NCZzaWc9ZjFiNThjZDYwYjMyMWFmZjU5YjVjZmYyZTUwZmVlYTU3ZDExYjNhMzpzZXNzaW9uX2lkPTJfTVg0ME5qa3dPREUwTkg1LU1UWXhNak14TXpjNE9UZzJNWDRyVVV3MFZXNDJXbEJOZFhjeWVIRkVaRXRrYW1KTmJWbC1mZyZjcmVhdGVfdGltZT0xNjEyMzEzNzkwJm5vbmNlPTAuMDczNTc2OTEwNjM0OTQzMSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjEyNDAwMTkwJmNvbm5lY3Rpb25fZGF0YT0lN0IlMjJ1c2VyTmFtZSUyMiUzQSUyMkFub255bW91cyUyMFVzZXIxNSUyMiU3RCZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==",
     "id_usuario": "9991336774",
     "time_finished": "20:56:13",
     "tipo_servicio": "3064",
     "activo": "1"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-02-04",
     "idUsuario": "9991336774",
     "id360": "9991336774",
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " dzsadasd",
     "tipo_area": "463",
     "web": "true",
     "time_created": "08:06:02",
     "id": "1726",
     "tipo_usuario": "124",
     "lat": "19.4462672",
     "apikey": "46908164",
     "lng": "-99.1124246",
     "date_created": "2021-02-03",
     "id_socket": "0eb95304-a836-4e82-bb67-271a37ef9499",
     "contadorDesconexion": "8",
     "time_updated": "00:03:22",
     "idsesion": "2_MX40NjkwODE2NH5-MTYxMjQxNzQ5NDAyMn5BcDMySjZVOWdJY1VMWENDNjRSRWlqWmN-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwODE2NCZzaWc9ZTg2ZGMxZTFjMTIwNmIyYzM4YTlmNjYyZTYxZmEzZjY2YTA1YWI0NzpzZXNzaW9uX2lkPTJfTVg0ME5qa3dPREUyTkg1LU1UWXhNalF4TnpRNU5EQXlNbjVCY0RNeVNqWlZPV2RKWTFWTVdFTkROalJTUldscVdtTi1mZyZjcmVhdGVfdGltZT0xNjEyNDE3NDk0Jm5vbmNlPS02MTEzNTQ3OCZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNjE1MDA5NDk0",
     "id_usuario": "9991336774",
     "time_finished": "00:03:22",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-02-04",
     "idUsuario": "9991336774",
     "id360": "9991336774",
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": "reporte",
     "tipo_area": "463",
     "web": "true",
     "time_created": "00:54:10",
     "id": "1731",
     "tipo_usuario": "124",
     "lat": "19.4904064",
     "apikey": "46908204",
     "lng": "-99.0773248",
     "date_created": "2021-02-04",
     "id_socket": "cbb4c087-6eaa-4103-bb38-47cac0a538b5",
     "contadorDesconexion": "13",
     "time_updated": "20:16:49",
     "idsesion": "1_MX40NjkwODIwNH5-MTYxMjQ5MDQ3NDg2MH5TZjRpZjVKQkJHL2hiemVxSFdPaHFBUnR-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwODIwNCZzaWc9OWI1MGQyZDQ3NTNiNTJhYWEwMjI3OWMwZDMwYzBmZDI4MDE2ZDc4NDpzZXNzaW9uX2lkPTFfTVg0ME5qa3dPREl3Tkg1LU1UWXhNalE1TURRM05EZzJNSDVUWmpScFpqVktRa0pITDJoaWVtVnhTRmRQYUhGQlVuUi1mZyZjcmVhdGVfdGltZT0xNjEyNDkwNDc0Jm5vbmNlPS0yMDIxNjg5Njg3JnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE2MTUwODI0NzQ=",
     "id_usuario": "9991336774",
     "time_finished": "20:16:49",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-02-05",
     "idUsuario": "9991336774",
     "id360": "9991336774",
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": "true",
     "time_created": "08:15:03",
     "id": "1833",
     "tipo_usuario": "124",
     "lat": "19.4353955",
     "apikey": "46908214",
     "lng": "-99.1021375",
     "date_created": "2021-02-05",
     "id_socket": "bfb9794f-9d9e-40a4-8923-dcb40f2cc0be",
     "contadorDesconexion": "20",
     "time_updated": "20:46:20",
     "idsesion": "1_MX40NjkwODIxNH5-MTYxMjU3MjM3NzkzMn5tdi9PQ0tVZDlYL3NWSHgwcFFjSXY2N0V-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwODIxNCZzaWc9NDdiOGE0OWZkMjFlNWVlMjhmYTdkMjczYWM5MmQ5MGYzYWZkNTNkOTpzZXNzaW9uX2lkPTFfTVg0ME5qa3dPREl4Tkg1LU1UWXhNalUzTWpNM056a3pNbjV0ZGk5UFEwdFZaRGxZTDNOV1NIZ3djRkZqU1hZMk4wVi1mZyZjcmVhdGVfdGltZT0xNjEyNTcyMzc4Jm5vbmNlPTAuNjQwNDUxMzQxOTY3NjM0MSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjEyNjU4Nzc4JmNvbm5lY3Rpb25fZGF0YT0lN0IlMjJ1c2VyTmFtZSUyMiUzQSUyMkFub255bW91cyUyMFVzZXIxMiUyMiU3RCZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==",
     "id_usuario": "9991336774",
     "time_finished": "20:05:56",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-02-09",
     "idUsuario": "9991336774",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": "true",
     "time_created": "07:06:55",
     "id": "1882",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46908234",
     "lng": null,
     "date_created": "2021-02-08",
     "id_socket": "45d9b8b3-9664-48a9-9fb2-d3fade5dcaa4",
     "contadorDesconexion": "2",
     "time_updated": "20:42:59",
     "idsesion": "1_MX40NjkwODIzNH5-MTYxMjc5NjgwNzY5OH5oU25LaitLTDVxejRGZUZydHFQK3hMOU9-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwODIzNCZzaWc9YzY5ODA1ZTM3OGY2MjczNjQ5ZWU4NDYzODY5NWI1Y2RlNzJjYzk0NDpzZXNzaW9uX2lkPTFfTVg0ME5qa3dPREl6Tkg1LU1UWXhNamM1Tmpnd056WTVPSDVvVTI1TGFpdExURFZ4ZWpSR1pVWnlkSEZRSzNoTU9VOS1mZyZjcmVhdGVfdGltZT0xNjEyNzk2ODA3Jm5vbmNlPS0zNzQyODM1MyZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNjE1Mzg4ODA3",
     "id_usuario": "9991336774",
     "time_finished": "20:42:59",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-02-09",
     "idUsuario": "9991336774",
     "id360": "9991336774",
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": "true",
     "time_created": "08:42:55",
     "id": "1896",
     "tipo_usuario": "124",
     "lat": "19.4379776",
     "apikey": "46908234",
     "lng": "-99.0969856",
     "date_created": "2021-02-09",
     "id_socket": "22c2ec45-fc10-4e7b-bf32-c686b94f9753",
     "contadorDesconexion": "4",
     "time_updated": "20:52:37",
     "idsesion": "1_MX40NjkwODIzNH5-MTYxMjg4OTUyOTU4NX5GbkFOWU9yYTFiQlFzcU03a1QrUWZUaVR-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwODIzNCZzaWc9NWM0YjE4MjQ3MWM0NDZmYjdkMGQ3MzgzNjY5ZTQ0ZjViYjVkNTZiYTpzZXNzaW9uX2lkPTFfTVg0ME5qa3dPREl6Tkg1LU1UWXhNamc0T1RVeU9UVTROWDVHYmtGT1dVOXlZVEZpUWxGemNVMDNhMVFyVVdaVWFWUi1mZyZjcmVhdGVfdGltZT0xNjEyODg5NTMwJm5vbmNlPTAuNzgyMTU1OTQ2Mzc5MzgzJnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE2MTI5NzU5MzAmY29ubmVjdGlvbl9kYXRhPSU3QiUyMnVzZXJOYW1lJTIyJTNBJTIyQW5vbnltb3VzJTIwVXNlcjIxJTIyJTdEJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9",
     "id_usuario": "9991336774",
     "time_finished": "20:52:37",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-02-09",
     "idUsuario": "9991336774",
     "id360": "9991336774",
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " ",
     "tipo_area": "463",
     "web": "true",
     "time_created": "08:50:13",
     "id": "2035",
     "tipo_usuario": "124",
     "lat": "19.4379776",
     "apikey": "46908234",
     "lng": "-99.0969856",
     "date_created": "2021-02-10",
     "id_socket": "22c2ec45-fc10-4e7b-bf32-c686b94f9753",
     "contadorDesconexion": "4",
     "time_updated": "20:45:12",
     "idsesion": "1_MX40NjkwODIzNH5-MTYxMjg4OTUyOTU4NX5GbkFOWU9yYTFiQlFzcU03a1QrUWZUaVR-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwODIzNCZzaWc9NWM0YjE4MjQ3MWM0NDZmYjdkMGQ3MzgzNjY5ZTQ0ZjViYjVkNTZiYTpzZXNzaW9uX2lkPTFfTVg0ME5qa3dPREl6Tkg1LU1UWXhNamc0T1RVeU9UVTROWDVHYmtGT1dVOXlZVEZpUWxGemNVMDNhMVFyVVdaVWFWUi1mZyZjcmVhdGVfdGltZT0xNjEyODg5NTMwJm5vbmNlPTAuNzgyMTU1OTQ2Mzc5MzgzJnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE2MTI5NzU5MzAmY29ubmVjdGlvbl9kYXRhPSU3QiUyMnVzZXJOYW1lJTIyJTNBJTIyQW5vbnltb3VzJTIwVXNlcjIxJTIyJTdEJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9",
     "id_usuario": "9991336774",
     "time_finished": "20:45:12",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-02-11",
     "idUsuario": "9991336774",
     "id360": "9991336774",
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " Reporte de actividades laborales",
     "tipo_area": "463",
     "web": "true",
     "time_created": "09:02:55",
     "id": "2036",
     "tipo_usuario": "124",
     "lat": "19.4379776",
     "apikey": "46908324",
     "lng": "-99.0969856",
     "date_created": "2021-02-11",
     "id_socket": "be22a0db-a7d4-457c-9ddc-b7669016d5fb",
     "contadorDesconexion": "19",
     "time_updated": "20:31:11",
     "idsesion": "1_MX40NjkwODMyNH5-MTYxMzA4NjIxODEyN35uZjFJN2ZsSkRqd1V3WWp3RGhCT2w3Zyt-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwODMyNCZzaWc9YzdkNDQwMjdlNWEwN2MxYTcxOTQ1OWU0OWZlNjE3ZThmMmU1MGRjNTpzZXNzaW9uX2lkPTFfTVg0ME5qa3dPRE15Tkg1LU1UWXhNekE0TmpJeE9ERXlOMzV1WmpGSk4yWnNTa1JxZDFWM1dXcDNSR2hDVDJ3M1p5dC1mZyZjcmVhdGVfdGltZT0xNjEzMDg2MjE4Jm5vbmNlPTE0MDMzMjY0ODImcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxNTY3ODIxOA==",
     "id_usuario": "9991336774",
     "time_finished": "20:31:11",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": null,
     "idUsuario": "9991336774",
     "id360": "9991336774",
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": null,
     "tipo_area": "463",
     "web": "true",
     "time_created": "08:27:16",
     "id": "2045",
     "tipo_usuario": "124",
     "lat": "19.4379776",
     "apikey": "46908324",
     "lng": "-99.0969856",
     "date_created": "2021-02-12",
     "id_socket": "c351ad27-6038-4e8b-b3a1-91d0bbeaef51",
     "contadorDesconexion": "0",
     "time_updated": null,
     "idsesion": "2_MX40NjkwODMyNH5-MTYxMzE0MDAzMTg3MX41ZGxDaVNHa1M1UGUrR2c5am5lR3pVVUJ-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwODMyNCZzaWc9NTY3MmFkZDVlNGIwMjA1ZGNiZTAxZWZlNzE5ZGVjZGJlMjIwYWZjYjpzZXNzaW9uX2lkPTJfTVg0ME5qa3dPRE15Tkg1LU1UWXhNekUwTURBek1UZzNNWDQxWkd4RGFWTkhhMU0xVUdVclIyYzVhbTVsUjNwVlZVSi1mZyZjcmVhdGVfdGltZT0xNjEzMTQwMDMyJm5vbmNlPTAuNzYxNjMzODY2MjY4MzY5NSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjEzMjI2NDMyJmNvbm5lY3Rpb25fZGF0YT0lN0IlMjJ1c2VyTmFtZSUyMiUzQSUyMkFub255bW91cyUyMFVzZXIxNSUyMiU3RCZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==",
     "id_usuario": "9991336774",
     "time_finished": null,
     "tipo_servicio": "3064",
     "activo": "1"
     }
     ],
     "success": true,
     "failure": false,
     "mensaje": "ok"
     }*/
    if (jornadas_laborales_rango_empleado.data) {
        //tablaHistorialLaboralEmpleado = $("#tablaHistorialLaboralEmpleado")
        //const cuerpoTablaHistorialLaboralEmpleado = tablaHistorialLaboralEmpleado.find("tbody");        
        conResultados.addClass("d-none");
        sinResultados.addClass("d-none");
        //cuerpoTablaHistorialLaboralEmpleado.empty();

        conResultados.removeClass("d-none");
        sinResultados.addClass("d-none");

        //let horasLaboralesTotales = 0
        let puntualHistorialLaboral = 0
        let retardoHistorialLaboral = 0
        let totalSegundosDiferencia = 0
        let totalMinutosDiferencia = 0
        let totalHorasDiferencia = 0
        jornadas_laborales_rango_empleado.data.forEach(element => {
            let elemento = {
                dia: new Date(element.date_created + "T" + element.time_created).toLocaleDateString('es-MX', {weekday: 'long'}),
                fecha: new Date(element.date_created + "T" + element.time_created).toLocaleDateString('es-MX', {year: 'numeric', month: 'long', day: 'numeric'}),
                horaEntrada: element.time_created,
                horaSalida: element.time_finished,
                horasLaborales: null,
                contadorDesconexion: element.contadorDesconexion,
                observaciones: '<i class="text-success fas fa-star"></i>'
            }
            let horarioEntradaUser = moment(element.date_created + "T" + jornadas_laborales_empleado[0].horario_entrada)
            horarioEntradaUser.add(moment.duration("00:01:00"))
            let horarioSalidaUser = moment(element.date_created + "T" + jornadas_laborales_empleado[0].horario_salida)
            let horaEntradaUser = moment(element.date_created + "T" + element.time_created)
            let horasDiferencia = 0
            if (element.time_finished) {
                let horaFinalizada = moment(element.date_updated + "T" + element.time_finished)
                if (horaEntradaUser > horaFinalizada) {
                    horaFinalizada = moment(element.date_created + "T" + element.time_finished)
                }
                if (horaEntradaUser <= horaFinalizada) {
                    if (horaFinalizada.diff(horaEntradaUser, 'hours') > 5) {
                        horasDiferencia = horaFinalizada.diff(horaEntradaUser, 'hours') - 2
                        minutosDiferencia = moment(moment(horaFinalizada, "HH:mm:ss").diff(moment(horaEntradaUser, "HH:mm:ss"))).format("mm")
                        segundosDiferencia = moment(horaFinalizada.diff(horaEntradaUser)).format("ss")
                        totalHorasDiferencia += horasDiferencia
                        totalSegundosDiferencia += parseInt(segundosDiferencia)
                        if (totalSegundosDiferencia >= 60) {
                            totalMinutosDiferencia++
                            totalSegundosDiferencia -= 60
                        }
                        totalMinutosDiferencia += parseInt(minutosDiferencia)
                        if (totalMinutosDiferencia >= 60) {
                            totalHorasDiferencia++
                            totalMinutosDiferencia -= 60
                        }
                        elemento.horasLaborales = '<span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-light">' + horasDiferencia + ":" + minutosDiferencia + ":" + segundosDiferencia + '</span>'
                    } else {
                        horasDiferencia = horaFinalizada.diff(horaEntradaUser, 'hours')
                        minutosDiferencia = moment(moment(horaFinalizada, "HH:mm:ss").diff(moment(horaEntradaUser, "HH:mm:ss"))).format("mm")
                        segundosDiferencia = moment(horaFinalizada.diff(horaEntradaUser)).format("ss")
                        totalHorasDiferencia += horasDiferencia
                        totalSegundosDiferencia += parseInt(segundosDiferencia)
                        if (totalSegundosDiferencia >= 60) {
                            totalMinutosDiferencia++
                            totalSegundosDiferencia -= 60
                        }
                        totalMinutosDiferencia += parseInt(minutosDiferencia)
                        if (totalMinutosDiferencia >= 60) {
                            totalHorasDiferencia++
                            totalMinutosDiferencia -= 60
                        }
                        elemento.horasLaborales = '<span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-light">' + horasDiferencia + ":" + minutosDiferencia + ":" + segundosDiferencia + '</span>'
                    }
                }
                if (horaFinalizada < horarioSalidaUser) {
                    elemento.horaSalida = '<span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-warning">' + horaFinalizada.format('HH:mm:ss A') + '</span>'
                    //elemento.observaciones = '<i class="text-warning fas fa-star"></i>'
                } else {
                    elemento.horaSalida = '<span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-success">' + horaFinalizada.format('HH:mm:ss A') + '</span>'
                }
            }
            /*if (!isNaN(elemento.horasLaborales)) {
             horasLaboralesTotales += elemento.horasLaborales
             }*/
            if (horaEntradaUser >= horarioEntradaUser) {
                elemento.horaEntrada = '<span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-warning">' + horaEntradaUser.format('HH:mm:ss A') + '</span>'
                elemento.observaciones = '<i class="text-danger fas fa-clock"></i>'
                retardoHistorialLaboral++
            } else {
                elemento.horaEntrada = '<span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-success">' + horaEntradaUser.format('HH:mm:ss A') + '</span>'
                if (horasDiferencia > 8) {
                    elemento.observaciones = '<i class="text-success fas fa-star"></i> + ' + (horasDiferencia - 8)
                } else {
                    elemento.observaciones = '<i class="text-success fas fa-star"></i>'
                }

                puntualHistorialLaboral++
            }
            jornadas_laborales_rango_empleado_tabla.push(elemento)
        })
        $("#horasLaboralesTotales").text("Total: " + totalHorasDiferencia + " hrs " + totalMinutosDiferencia + " min " + totalSegundosDiferencia + " seg")
        $("#puntualHistorialLaboral").text(puntualHistorialLaboral)
        $("#retardoHistorialLaboral").text(retardoHistorialLaboral)

        tablaHistorialLaboralEmpleado = tablaHistorialLaboralEmpleado2.DataTable({
            dom: 'Bfrtip',
            order: [],
            paging: false,
            buttons: [
                'print'
            ],
            "data": jornadas_laborales_rango_empleado_tabla,
            "columns": [{"data": "dia"},
                {"data": "fecha"},
                {"data": "horaEntrada"},
                {"data": "horaSalida"},
                {"data": "horasLaborales"},
                {"data": "contadorDesconexion"},
                {"data": "observaciones"}
            ]
        });
    } else {
        conResultados.addClass("d-none");
        sinResultados.removeClass("d-none");
    }
}
//BOTON BUSCAR EMPLEADO  
$('#buscar_reportes_personales').click(async () => {
    await botonObtenerJornadasReporteEmpleado(id360Estatico, jornadas_laborales_empleado)
});
//BOTON REGRESAR A JORNADAS LABORALES  
$('#botonRegresarJornadasLaborales').click(async () => {
    //await botonRegresarJornadasLaborales()
    $("#reporteJornadasLaborales").show()
    $("#reporteEmpleadoJornadasLaborales").hide()

    $("#calendarioRendimientoMensual").datepicker("destroy")
});
const verReporteDetallado = async empleado => {
    $("#reporteJornadasLaborales").hide()
    $("#reporteEmpleadoJornadasLaborales").show()

    //VISTA REPORTE EMPLEADO
    id360Estatico = await empleado
    //SERVIDOR
    jornadas_laborales_empleado = await $.ajax({
        type: 'POST',
        url: 'https://empresas.claro360.com/plataforma360/API/empresas360/jornadas_laborales/empresa/obtener_empleados',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify([{
                id360: id360Estatico
            }]),
        success: function (response) {
            //console.log("RES JSON1: ", response)
        },
        error: function (err) {
            console.log("Ocurrio un problema en la llamada jornadas Laborales Empleado", err)
        }
    })
    //LOCAL
    /*jornadas_laborales_empleado = [
     {
     "horario": null,
     "hipertension": "0",
     "GMS_disponible": null,
     "plecas": "[{\"nombre\":\"empresa360\",\"posicion\":0,\"visibility\":true}, {\"nombre\":\"invitaciones\",\"posicion\":1,\"visibility\":true}, {\"nombre\":\"expertos360\",\"posicion\":2,\"visibility\":true}, {\"nombre\":\"carrusel\",\"posicion\":3,\"visibility\":true}, {\"nombre\":\"servicios_publicos\",\"posicion\":4,\"visibility\":true}, {\"nombre\":\"cartera\",\"posicion\":5,\"visibility\":true}, {\"nombre\":\"pagos_operaciones\",\"posicion\":6,\"visibility\":true}, {\"nombre\":\"emergencia_ciudadana\",\"posicion\":7,\"visibility\":true}]",
     "en_jornada": "0",
     "puesto": "Desarrollador de Software ",
     "correo": "jose.peralta@globalcorporation.cc",
     "genero": "Hombre",
     "donador_organos": "0",
     "time_created": "17:07:33",
     "id": "5024",
     "obesidad": "0",
     "telefono": "7331277015",
     "tipo_usuario": "124",
     "condicion_medica": "Buena",
     "embarazada": "0",
     "inmunopresion": "0",
     "area": "Desarrollo Back End",
     "peso": "65",
     "direccion": "null, null, , null, null",
     "soversion": "SO: 29 Device: Motorola moto g(8) power",
     "canje": "1",
     "horario_entrada": "09:00:00",
     "contacto_telefono": "7331152712",
     "rh": "O+",
     "success": true,
     "failure": false,
     "plataforma": "0",
     "usuario": "jose.peralta@globalcorporation.cc",
     "tipo_servicio": "3064",
     "enfermedad_corazon": "0",
     "activo": "1",
     "img": "https://bucketmoviles121652-dev.s3.amazonaws.com/public/jose.peralta%40globalcorporation.cc/Img/perfil.jpg?n=1",
     "firebasekey": "cOJ9Y8z2QBGX3ElTDenzu6:APA91bFNV7npV8K3R-lPZ-M4ftNsK9S9eH3_qepSRMcld2hCBxIqdgq_giSZaG5nFdQjI7UtGSzLLMSuyqY8JfXw-Dw0R0ZsYt5O6jbpLsqbej2b5xMKMoT19J37GcmOKi164rS_tatI",
     "date_updated": "2021-02-05",
     "botonesconfig": "[{\"nombre\":\"Gastos\",\"pleca\":\"cartera\",\"posicion\":1,\"visibility\":true}, {\"nombre\":\"Reporte Ciudadano\",\"pleca\":\"servicios_publicos\",\"posicion\":1,\"visibility\":true}, {\"nombre\":\"Pagar/Enviar Dinero\",\"pleca\":\"cartera\",\"posicion\":0,\"visibility\":true}, {\"nombre\":\"Entrada/Salida\",\"pleca\":\"empresa360\",\"posicion\":0,\"visibility\":true}, {\"nombre\":\"Servicios del Estado\",\"pleca\":\"servicios_publicos\",\"posicion\":2,\"visibility\":true}, {\"nombre\":\"Citas\",\"pleca\":\"expertos360\",\"posicion\":1,\"visibility\":true}, {\"nombre\":\"Destinatario\",\"pleca\":\"cartera\",\"posicion\":3,\"visibility\":true}, {\"nombre\":\"Comunicación\",\"pleca\":\"empresa360\",\"posicion\":2,\"visibility\":true}, {\"nombre\":\"Protocolo Seguridad Sanitaria\",\"pleca\":\"empresa360\",\"posicion\":4,\"visibility\":true}, {\"nombre\":\"Médicos\",\"pleca\":\"expertos360\",\"posicion\":0,\"visibility\":true}, {\"nombre\":\"Gastos\",\"pleca\":\"pagos_operaciones\",\"posicion\":2,\"visibility\":true}, {\"nombre\":\"Activar Invitación\",\"pleca\":\"invitaciones\",\"posicion\":0,\"visibility\":true}, {\"nombre\":\"Grabación de Cámaras\",\"pleca\":\"pagos_operaciones\",\"posicion\":4,\"visibility\":true}, {\"nombre\":\"Médicos\",\"pleca\":\"pagos_operaciones\",\"posicion\":5,\"visibility\":true}, {\"nombre\":\"Pagar\",\"pleca\":\"pagos_operaciones\",\"posicion\":0,\"visibility\":true}, {\"nombre\":\"Mis Proveedores\",\"pleca\":\"pagos_operaciones\",\"posicion\":1,\"visibility\":true}, {\"nombre\":\"Perfil Laboral\",\"pleca\":\"empresa360\",\"posicion\":3,\"visibility\":true}, {\"nombre\":\"Test de Salud\",\"pleca\":\"expertos360\",\"posicion\":2,\"visibility\":true}, {\"nombre\":\"911\",\"pleca\":\"servicios_publicos\",\"posicion\":0,\"visibility\":true}, {\"nombre\":\"Reportes\",\"pleca\":\"empresa360\",\"posicion\":1,\"visibility\":true}, {\"nombre\":\"Cámaras en vivo\",\"pleca\":\"pagos_operaciones\",\"posicion\":3,\"visibility\":true}, {\"nombre\":\"Tarjetas\",\"pleca\":\"cartera\",\"posicion\":2,\"visibility\":true}]",
     "enfermedad_renal": "0",
     "FireBaseKey": "cOJ9Y8z2QBGX3ElTDenzu6:APA91bFNV7npV8K3R-lPZ-M4ftNsK9S9eH3_qepSRMcld2hCBxIqdgq_giSZaG5nFdQjI7UtGSzLLMSuyqY8JfXw-Dw0R0ZsYt5O6jbpLsqbej2b5xMKMoT19J37GcmOKi164rS_tatI",
     "padecimientos_medicos": "0",
     "tabaquismo": "0",
     "id360": "9991337113",
     "num_empleado": "943",
     "fecha_nacimiento": "1997-07-10",
     "icon": "https://bucketmoviles121652-dev.s3.amazonaws.com/public/jose.peralta%40globalcorporation.cc/Img/icono.png",
     "estatura": "1.6",
     "horario_salida": "19:00:00",
     "nombre": "Jose Alfredo",
     "contacto_nombre": "David Fidencio Peralta García",
     "tipo_area": "463",
     "medicamento": "Ninguno",
     "so": "Android",
     "tipo_actividad": "Operativa",
     "date_created": "2021-01-07",
     "enfermedad_pulmonar": "0",
     "ninguna": "1",
     "cp": null,
     "time_updated": "19:02:16",
     "url": null,
     "alergias": "Ninguna",
     "segmento": null,
     "id_usuario": "9991337113",
     "apellido_paterno": "Peralta",
     "apellido_materno": "García",
     "cancer": "0",
     "mensaje": "Usuario encontrado., app360, perfil, modulo empleado",
     "diabetes": "0"
     }
     ]*/
    let datosVistaReporteDetallado
    if (jornadas_laborales_empleado[0]) {
        datosVistaReporteDetallado = {
            nombre: jornadas_laborales_empleado[0].nombre + " " + jornadas_laborales_empleado[0].apellido_paterno + " " + jornadas_laborales_empleado[0].apellido_materno,
            direccion: jornadas_laborales_empleado[0].direccion,
            area: jornadas_laborales_empleado[0].area,
            cargo: jornadas_laborales_empleado[0].puesto,
            reporteAislamiento: " - - - -",
            actividadesDesempeñar: " - - - -",
            num_empleado: jornadas_laborales_empleado[0].num_empleado,
            img: jornadas_laborales_empleado[0].img
        };
        $("#nombreEmpleado").text("Nombre: " + datosVistaReporteDetallado.nombre);
        $("#direccionEmpleado").text(datosVistaReporteDetallado.direccion);
        $("#areaEmpleado").text(datosVistaReporteDetallado.area);
        $("#cargoEmpleado").text(datosVistaReporteDetallado.cargo);
        $("#reporteAislamientoEmpleado").text(datosVistaReporteDetallado.reporteAislamiento);
        $("#actividadesDesempeñarEmpleado").text(datosVistaReporteDetallado.actividadesDesempeñar);
        $("#num_empleado").text(datosVistaReporteDetallado.num_empleado);
        $("#avatarEmpleado").attr("src", datosVistaReporteDetallado.img);

        $('#enviar_mensaje_empleado_en_jornada_reporte_empleado').click(() => {
            initComunicacionJornadasLaborales(id360Estatico, false);
        })
        $('#inicia_llamada_empleado_en_jornada_reporte_empleado').click(() => {
            initComunicacionJornadasLaborales(id360Estatico, true);
        })
    }

    //REPORTE EMPLEADO RENDIMIENTO SEMANAL
    let today = new Date()
    let optionsFormatFechaString = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    let fechaString = today.toLocaleDateString('es-ES', optionsFormatFechaString)

    let todayFecha = moment(today).format("YYYY-MM-DD")
    $("#fechaString").text(fechaString);

    let lunes = new Date(moment().add(-(today.getDay() - 1), 'days'))
    let lunes2 = moment().add(-(today.getDay() - 1), 'days')
    if (today.getDay() === 1) {
        lunes = new Date(moment(today))
    }
    let viernes = new Date(moment().add((today.getDay() - 1), 'days'))
    let viernes2 = moment().add((today.getDay() - 1), 'days')
    if (today.getDay() === 5) {
        viernes = new Date(moment(today))
        viernes2 = moment(today)
    } else if (today.getDay() === 0) {
        viernes = new Date(moment().add(5, 'days'))
        viernes2 = moment().add(5, 'days')
    } else if (today.getDay() === 1) {
        viernes = new Date(moment().add(4, 'days'))
        viernes2 = moment().add(4, 'days')
    } else if (today.getDay() === 2) {
        viernes = new Date(moment().add(3, 'days'))
        viernes2 = moment().add(3, 'days')
    } else if (today.getDay() === 3) {
        viernes = new Date(moment().add(2, 'days'))
        viernes2 = moment().add(2, 'days')
    } else if (today.getDay() === 4) {
        viernes = new Date(moment().add(1, 'days'))
        viernes2 = moment().add(1, 'days')
    }

    let primerDiaMes = new Date(moment().startOf('month'))
    let ultimoDiaMes = new Date(moment().endOf('month'))

    $("#diaLunes").text(lunes.getDate())
    $("#diaViernes").text(viernes.getDate())
    $("#stringMesRendimientoSemanal").text(today.toLocaleDateString('es-ES', {month: 'long'}))

    const inicioSemana = moment(lunes).format('YYYY-MM-DD')
    const finSemana = moment(viernes).format('YYYY-MM-DD')
    //SERVIDOR    
    let jornadas_laborales_rango_empleado = await $.ajax({
        type: 'POST',
        url: 'https://empresas.claro360.com/plataforma360/API/empresas360/jornadas_laborales',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            id: id360Estatico,
            inicio: inicioSemana,
            fin: finSemana
        }),
        success: function (response) {
            //console.log("RES JSON1: ", response)
        },
        error: function (err) {
            console.log("Ocurrio un problema en la llamada jornadasLaboralesSemanaEmpleado", err)
        }
    })
    //LOCAL
    /*jornadas_laborales_rango_empleado = {
     "data": [
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-02-08",
     "idUsuario": "9991337111",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " Hoy estuve trabajando en la videollamada del directorio, en la configuración de firebase para las notificaciones y en guardar el modulo de app360 al registrar la cuenta, ya que es necesario para que la respuesta del servicio de llamada sea correcto necesito guardar el modulo.",
     "tipo_area": "465",
     "web": "true",
     "time_created": "09:00:11",
     "id": "1866",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46908234",
     "lng": null,
     "date_created": "2021-02-08",
     "id_socket": "ce767b94-4ac4-40e2-9e47-572ab1de0657",
     "contadorDesconexion": "8",
     "time_updated": "19:02:08",
     "idsesion": "1_MX40NjkwODIzNH5-MTYxMjgyMTYwNjc3N35mdzBwSEczNmhDaFNOUWJ3bDB5NHhCdDF-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwODIzNCZzaWc9Mzg2OGVkYTZjYTRkNzUzMmI1YjViOGQ4YTI3MjQ2YzQ3YTMzYWIzMjpzZXNzaW9uX2lkPTFfTVg0ME5qa3dPREl6Tkg1LU1UWXhNamd5TVRZd05qYzNOMzVtZHpCd1NFY3pObWhEYUZOT1VXSjNiREI1TkhoQ2RERi1mZyZjcmVhdGVfdGltZT0xNjEyODIxNjA2Jm5vbmNlPTM0OTc2NDg3MiZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNjE1NDEzNjA2",
     "id_usuario": "9991337111",
     "time_finished": "19:02:08",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-02-09",
     "idUsuario": "9991337111",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " Hoy estuve trabajando en generar el modulo de app360 conectando los servicios para registrar el modulo así como también registrar el modulo perfil, que se genera a la hora de registrar una nueva cuenta, ya subí cambios y lo notifique a mi líder el dijo que haría las pruebas, la funcionalidad de llamada entre móviles esta terminada. ",
     "tipo_area": "465",
     "web": "true",
     "time_created": "09:00:45",
     "id": "1917",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46908234",
     "lng": null,
     "date_created": "2021-02-09",
     "id_socket": "b0904295-6e07-410e-ba00-8f3ef9d4abbc",
     "contadorDesconexion": "4",
     "time_updated": "19:00:22",
     "idsesion": "2_MX40NjkwODIzNH5-MTYxMjkwODA5NTIzM35GMk1hbkNlaHBFYzN4S3grblVrU0d1YzZ-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwODIzNCZzaWc9MTgyZGQ5NjJkNzY5OTJiMmU2ZjE4MTE1M2RlNGIyZGQ4MTcyZjBjNzpzZXNzaW9uX2lkPTJfTVg0ME5qa3dPREl6Tkg1LU1UWXhNamt3T0RBNU5USXpNMzVHTWsxaGJrTmxhSEJGWXpONFMzZ3JibFZyVTBkMVl6Wi1mZyZjcmVhdGVfdGltZT0xNjEyOTA4MDk1Jm5vbmNlPS0xMDUyODk1NTk2JnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE2MTU1MDAwOTU=",
     "id_usuario": "9991337111",
     "time_finished": "19:00:22",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-02-10",
     "idUsuario": "9991337111",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": " Hoy estuve trabajando en integrar las validaciones para cuando no se encuentra un modulo ya sea app360 o perfil, también consumí los servicios de registrar los módulos que sean falta los cuales son app360 y perfil en la vista de perfil para que llene los campos que hacen falta y así se  pueda registrar los modulos a la hora de hacer el login.",
     "tipo_area": "465",
     "web": "true",
     "time_created": "09:02:17",
     "id": "1974",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46908274",
     "lng": null,
     "date_created": "2021-02-10",
     "id_socket": "5eacf32d-80da-4330-9cd2-d03bcf23bdaf",
     "contadorDesconexion": "10",
     "time_updated": "19:04:29",
     "idsesion": "2_MX40NjkwODI3NH5-MTYxMzAwMjkwMTQ2M35NaXE1OHBuYlhyay9NYjZNVXVQODd3Mkt-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwODI3NCZzaWc9ZmJhMGMxYWY4MDVkOGVmYzRhZWMxNWQyZGQwMzQyN2E0Y2M2MWE5NzpzZXNzaW9uX2lkPTJfTVg0ME5qa3dPREkzTkg1LU1UWXhNekF3TWprd01UUTJNMzVOYVhFMU9IQnVZbGh5YXk5TllqWk5WWFZRT0RkM01rdC1mZyZjcmVhdGVfdGltZT0xNjEzMDAyOTAxJm5vbmNlPTE0MDQ5Mjg1NjQmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxNTU5NDkwMQ==",
     "id_usuario": "9991337111",
     "time_finished": "19:04:29",
     "tipo_servicio": "3064",
     "activo": "0"
     },
     {
     "Nombre": null,
     "aliasServicio": null,
     "date_updated": "2021-02-11",
     "idUsuario": "9991337111",
     "id360": null,
     "urlServicio": "https://empresas.claro360.com/plataforma360",
     "reporte": null,
     "tipo_area": "465",
     "web": "true",
     "time_created": "09:02:07",
     "id": "2020",
     "tipo_usuario": "124",
     "lat": null,
     "apikey": "46908274",
     "lng": null,
     "date_created": "2021-02-11",
     "id_socket": "0a715727-0dce-43ce-a259-7ab913006ecd",
     "contadorDesconexion": "1",
     "time_updated": "09:38:17",
     "idsesion": "1_MX40NjkwODI3NH5-MTYxMzA1Nzg4OTcwNX44aU5UdWFCZDdaaTdVWmIwZmVvRGdKcFN-fg",
     "token": "T1==cGFydG5lcl9pZD00NjkwODI3NCZzaWc9NDJkMDdhNDE3ZTg5ZjkyOGU4NGY2ODAzYjkwOTY1YTQyNDA3OWZkODpzZXNzaW9uX2lkPTFfTVg0ME5qa3dPREkzTkg1LU1UWXhNekExTnpnNE9UY3dOWDQ0YVU1VWRXRkNaRGRhYVRkVldtSXdabVZ2UkdkS2NGTi1mZyZjcmVhdGVfdGltZT0xNjEzMDU3ODg5Jm5vbmNlPTM3Mjg3NjYxNCZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNjE1NjQ5ODg5",
     "id_usuario": "9991337111",
     "time_finished": null,
     "tipo_servicio": "3064",
     "activo": "1"
     }
     ],
     "success": true,
     "failure": false,
     "mensaje": "ok"
     }*/
    var from = moment(lunes2, "YYYY-MM-DD").set({'hour': 00, 'minute': 00, 'second': 00, 'millisecond': 000}),
            to = moment(viernes2, "YYYY-MM-DD"),
            diasLaboralesSemana = 0,
            diasFestivos = [moment("2021-01-01T00:00:00"), moment("2021-02-01T00:00:00"), moment("2021-03-15T00:00:00"), moment("2021-04-01T00:00:00"), moment("2021-09-16T00:00:00"), moment("2021-11-15T00:00:00"), moment("2021-25-25T00:00:00")];
    let diaFeriadoEncontrado = false
    while (!from.isAfter(to)) {
        diaFeriadoEncontrado = false
        // Si no es sabado ni domingo
        diasFestivos.forEach(element => {
            if (moment(from).diff(element, 'days') === 0) {
                diaFeriadoEncontrado = true
            }
        })
        if (!diaFeriadoEncontrado) {
            if (from.format("YYYY-MM-DD") <= moment().format("YYYY-MM-DD")) {
                diasLaboralesSemana++;
            }
        }
        from.add(1, 'days');
    }
    const horasLaboralesSemana = diasLaboralesSemana * 8

    let diasLaboralesSemanaEmpleado = 0
    let horasSemanaEmpleado = 0
    let horaEntrada = undefined
    let retardos2 = 0
    let faltasSemana = 0
    //let colorIcono = "text-success far fa-smile fa-2x"
    if (jornadas_laborales_rango_empleado.data) {
        jornadas_laborales_rango_empleado.data.forEach(element => {
            tiempoCreado = moment(element.date_created + "T" + element.time_created)
            if (element.time_finished) {
                tiempoTerminado = moment(element.date_updated + "T" + element.time_finished)
                if (tiempoTerminado.diff(tiempoCreado, 'hours') > 5) {
                    horasSemanaEmpleado += tiempoTerminado.diff(tiempoCreado, 'hours') - 2
                } else {
                    horasSemanaEmpleado += tiempoTerminado.diff(tiempoCreado, 'hours')
                }
                //horasSemanaEmpleado += tiempoTerminado.diff(tiempoCreado, 'hours') - 2                
            } else {
                if (element.date_updated && element.time_updated) {
                    ultimaActualizacion = moment(element.date_updated + "T" + element.time_updated)
                    if (ultimaActualizacion.diff(tiempoCreado, 'hours') > 5) {
                        horasSemanaEmpleado += ultimaActualizacion.diff(tiempoCreado, 'hours') - 2
                    } else {
                        horasSemanaEmpleado += ultimaActualizacion.diff(tiempoCreado, 'hours')
                    }
                }
            }
            horaEntrada = moment(element.date_created + "T" + jornadas_laborales_empleado[0].horario_entrada)
            horaEntrada.add(moment.duration("00:01:00"))
            if (tiempoCreado >= horaEntrada) {
                retardos2++
                //colorIcono = "text-warning far fa-frown fa-2x"
            }
        })
        diasLaboralesSemanaEmpleado = jornadas_laborales_rango_empleado.data.length
    }
    faltasSemana = diasLaboralesSemana - diasLaboralesSemanaEmpleado
    let inactividadSemanal = horasLaboralesSemana - horasSemanaEmpleado
    if (inactividadSemanal < 0) {
        inactividadSemanal = 0
    }
    let porcentajeProductividadSemanal = 0
    porcentajeProductividadSemanal = ((horasSemanaEmpleado / horasLaboralesSemana) * 100)
    porcentajeProductividadSemanal = porcentajeProductividadSemanal > 100 ? 100 : porcentajeProductividadSemanal.toFixed()
    google.charts.load("current", {packages: ["corechart"]});
    google.charts.setOnLoadCallback(drawChart2);
    function drawChart2() {
        var data = google.visualization.arrayToDataTable([
            ['Task', 'Hours per Day'],
            ['Productividad', horasSemanaEmpleado],
            ['Inactividad', inactividadSemanal]
        ]);
        var options = {
            //title: 'Productividad',
            //width: '100%',
            pieHole: 0.8,
            colors: ['#93C12A', '#C6C6C4'],
            backgroundColor: '#f5f5f5',
            pieSliceText: 'none',
            pieSliceTextStyle: {
                color: 'black',
                //fontSize: 20
                bold: true
            },
            legend: 'none',
            chartArea: {
                //left: "0",
                height: "80%",
                //top: "0",
                width: "80%"
            }
        };
        var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
        chart.draw(data, options);
    }

    /*$(window).resize(function () {
     drawChart();
     });*/
    $("#jornadas_laborales_productividad_porcentaje").text(porcentajeProductividadSemanal);
    $("#diasLaboralesSemanaEmpleado").text(diasLaboralesSemanaEmpleado)
    $("#horasLaboralesSemanaEmpleado").text(horasSemanaEmpleado)
    $("#retardosSemanaEmpleado").text(retardos2)
    $("#faltasSemanaEmpleado").text(faltasSemana)
    const colorIconoWarning = "far fa-frown fa-lg"
    const colorIconoSuccess = "far fa-smile fa-lg"
    //$("#colorIconoRetardos").addClass(colorIcono)
    if (diasLaboralesSemanaEmpleado < diasLaboralesSemana) {
        $("#iconoDiasLaboralesEmpleado").removeClass()
        $("#iconoDiasLaboralesEmpleado").addClass(colorIconoWarning)
        $("#iconoDiasLaboralesEmpleado").css("color", "#F8B135")
    } else {
        $("#iconoDiasLaboralesEmpleado").removeClass()
        $("#iconoDiasLaboralesEmpleado").addClass(colorIconoSuccess)
        $("#iconoDiasLaboralesEmpleado").css("color", "#97BA38")
    }
    if (horasSemanaEmpleado < horasLaboralesSemana) {
        $("#iconoHorasLaboralesEmpleado").removeClass()
        $("#iconoHorasLaboralesEmpleado").addClass(colorIconoWarning)
        $("#iconoHorasLaboralesEmpleado").css("color", "#F8B135")
    } else {
        $("#iconoHorasLaboralesEmpleado").removeClass()
        $("#iconoHorasLaboralesEmpleado").addClass(colorIconoSuccess)
        $("#iconoHorasLaboralesEmpleado").css("color", "#97BA38")
    }
    if (faltasSemana > 0) {
        $("#iconoFaltasLaboralesEmpleado").removeClass()
        $("#iconoFaltasLaboralesEmpleado").addClass(colorIconoWarning)
        $("#iconoFaltasLaboralesEmpleado").css("color", "#F8B135")
    } else {
        $("#iconoFaltasLaboralesEmpleado").removeClass()
        $("#iconoFaltasLaboralesEmpleado").addClass(colorIconoSuccess)
        $("#iconoFaltasLaboralesEmpleado").css("color", "#97BA38")
    }
    if (retardos2 > 0) {
        $("#colorIconoRetardos").removeClass()
        $("#colorIconoRetardos").addClass(colorIconoWarning)
        $("#colorIconoRetardos").css("color", "#F8B135")
    } else {
        $("#colorIconoRetardos").removeClass()
        $("#colorIconoRetardos").addClass(colorIconoSuccess)
        $("#colorIconoRetardos").css("color", "#97BA38")
    }

    //RENDIMIENTO MENSUAL
    const rendimientoMensual = async (numeroMes) => {
        //SERVIDOR        
        const inicioMes = moment().set('month', numeroMes).startOf('month').format('YYYY-MM-DD');
        const finMes = moment().set('month', numeroMes).endOf('month').format('YYYY-MM-DD');
        //LOCAL
        //const inicioMes = moment("2021-01-01").format('YYYY-MM-DD');
        //const finMes = moment("2021-01-31").format('YYYY-MM-DD');
        let mesEnRevision = today
        mesEnRevision.setMonth(numeroMes)
        let mesString = mesEnRevision.toLocaleDateString('es-ES', {month: 'long'})
        const primerLetraMes = mesString.charAt(0).toUpperCase()
        const restoCadenaMes = mesString.substring(1, mesString.length)
        mesString = primerLetraMes.concat(restoCadenaMes)
        $("#stringMesRendimientoMensual").text(mesString)
        //SERVIDOR
        let jornadasLaboralesMesEmpleado = await $.ajax({
            type: 'POST',
            url: 'https://empresas.claro360.com/plataforma360/API/empresas360/jornadas_laborales',
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                id: id360Estatico,
                inicio: inicioMes,
                fin: finMes
            }),
            success: function (response) {
                //console.log("RES JSON1: ", response)
            },
            error: function (err) {
                console.log("Ocurrio un problema en la llamada jornadasLaboralesMesEmpleado", err)
            }
        })
        //LOCAL
        /*if (numeroMes === 0) {
         const peticionTest2 = () => {
         return new Promise(resolve => {
         setTimeout(() => {
         resolve({
         "data": [
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-01-07",
         "idUsuario": "9991337113",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": " Instalación de tecnologías a utilizar.",
         "tipo_area": "463",
         "web": null,
         "time_created": "18:00:17",
         "id": "807",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46906934",
         "lng": null,
         "date_created": "2021-01-07",
         "id_socket": "4c1208e0-57cb-4079-99cd-00688b1023f6",
         "contadorDesconexion": "0",
         "time_updated": "19:01:19",
         "idsesion": "1_MX40NjkwNjkzNH5-MTYxMDA2MzkzMTU1Nn5ZZGxNV0JKV3RlV05zL3VxSjB5bHBhc09-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwNjkzNCZzaWc9NjczNWNiOWViZmFjMDFhODllNGQ4NTA4ODA0NmI5NTA4NWZhZWUxMTpzZXNzaW9uX2lkPTFfTVg0ME5qa3dOamt6Tkg1LU1UWXhNREEyTXprek1UVTFObjVaWkd4TlYwSktWM1JsVjA1ekwzVnhTakI1YkhCaGMwOS1mZyZjcmVhdGVfdGltZT0xNjEwMDYzOTMxJm5vbmNlPTIwNjU4NzAyNDMmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxMjY1NTkzMQ==",
         "id_usuario": "9991337113",
         "time_finished": null,
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-01-08",
         "idUsuario": "9991337113",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": " Instalacion de las tecnologias a utilizar",
         "tipo_area": "463",
         "web": null,
         "time_created": "08:57:47",
         "id": "822",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46906954",
         "lng": null,
         "date_created": "2021-01-08",
         "id_socket": "3340f874-ae50-4309-9bf3-cf1ab080a47e",
         "contadorDesconexion": "0",
         "time_updated": "19:06:58",
         "idsesion": "2_MX40NjkwNjk1NH5-MTYxMDE0MzEwOTQyOH43TzIwcWt5S0R0S3BZUGYyOEN5by9tUTV-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwNjk1NCZzaWc9MDBlZGJmYzg2MjNjZjBkOGQxMGUzYjI1OTM5MWI0MWY2YzIxYTdkNDpzZXNzaW9uX2lkPTJfTVg0ME5qa3dOamsxTkg1LU1UWXhNREUwTXpFd09UUXlPSDQzVHpJd2NXdDVTMFIwUzNCWlVHWXlPRU41Ynk5dFVUVi1mZyZjcmVhdGVfdGltZT0xNjEwMTQzMTA5Jm5vbmNlPTE3Mjc1NDkzOTcmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxMjczNTEwOQ==",
         "id_usuario": "9991337113",
         "time_finished": null,
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-01-11",
         "idUsuario": "9991337113",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": "analisis y revision de codigo en proyecto plataforma360",
         "tipo_area": "463",
         "web": null,
         "time_created": "08:56:43",
         "id": "874",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46906984",
         "lng": null,
         "date_created": "2021-01-11",
         "id_socket": "dd2440b2-95e5-4122-8ac2-78edfd04ed65",
         "contadorDesconexion": "0",
         "time_updated": "19:32:37",
         "idsesion": "1_MX40NjkwNjk4NH5-MTYxMDQwNzQzMTcwMX5SVUM4MjZSeDRhUC8rb2pMOExtRTR6Q21-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwNjk4NCZzaWc9MDFiNGQ4OTA1MTI5MTY5NmFjZDE2YWU2MjAxMzk1NTk0OGUwYjQzNzpzZXNzaW9uX2lkPTFfTVg0ME5qa3dOams0Tkg1LU1UWXhNRFF3TnpRek1UY3dNWDVTVlVNNE1qWlNlRFJoVUM4cmIycE1PRXh0UlRSNlEyMS1mZyZjcmVhdGVfdGltZT0xNjEwNDA3NDMxJm5vbmNlPS00NDg2MzkwMjcmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxMjk5OTQzMQ==",
         "id_usuario": "9991337113",
         "time_finished": null,
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-01-12",
         "idUsuario": "9991337113",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": " asignacion de modulos en plataforma360",
         "tipo_area": "463",
         "web": null,
         "time_created": "08:52:02",
         "id": "917",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46907014",
         "lng": null,
         "date_created": "2021-01-12",
         "id_socket": "d50ff84a-6ac4-482e-a865-d1a5faa5747d",
         "contadorDesconexion": "2",
         "time_updated": "19:12:32",
         "idsesion": "1_MX40NjkwNzAxNH5-MTYxMDUwMDMxOTQ0N35UMmNQRWRSVFZFZzVxQmVEY0tqeXpPM01-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwNzAxNCZzaWc9Y2U2ZGRjYjYyMTM4Y2NjMWFhYmJlNmY1MTY2NzFlNDkzMmVhZTkwZTpzZXNzaW9uX2lkPTFfTVg0ME5qa3dOekF4Tkg1LU1UWXhNRFV3TURNeE9UUTBOMzVVTW1OUVJXUlNWRlpGWnpWeFFtVkVZMHRxZVhwUE0wMS1mZyZjcmVhdGVfdGltZT0xNjEwNTAwMzE5Jm5vbmNlPTQwNzYwMTI5MSZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNjEzMDkyMzE5",
         "id_usuario": "9991337113",
         "time_finished": "19:12:32",
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-01-13",
         "idUsuario": "9991337113",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": " ",
         "tipo_area": "463",
         "web": null,
         "time_created": "08:55:27",
         "id": "968",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46907024",
         "lng": null,
         "date_created": "2021-01-13",
         "id_socket": "72add929-1716-4b2a-8e01-2ec701b018e6",
         "contadorDesconexion": "12",
         "time_updated": "19:02:19",
         "idsesion": "1_MX40NjkwNzAyNH5-MTYxMDU3OTI3NjMwNH5BeHZZVlZOMHM1dGFBSjExbDhlSzZrczV-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwNzAyNCZzaWc9OTMzN2U3ZjM4N2Q5YTg0ZTQyNzZjYTQ5MTBiMTE5M2JmMGQ1YmNjMzpzZXNzaW9uX2lkPTFfTVg0ME5qa3dOekF5Tkg1LU1UWXhNRFUzT1RJM05qTXdOSDVCZUhaWlZsWk9NSE0xZEdGQlNqRXhiRGhsU3pacmN6Vi1mZyZjcmVhdGVfdGltZT0xNjEwNTc5Mjc2Jm5vbmNlPS0xNDM5ODc4NTU4JnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE2MTMxNzEyNzY=",
         "id_usuario": "9991337113",
         "time_finished": "19:02:19",
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-01-14",
         "idUsuario": "9991337113",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": " diseño de la plantilla modulos_jornada.jsp",
         "tipo_area": "463",
         "web": null,
         "time_created": "08:57:26",
         "id": "1017",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46907034",
         "lng": null,
         "date_created": "2021-01-14",
         "id_socket": "aaff50a1-7a0e-4d88-877b-cdb75e6a06c7",
         "contadorDesconexion": "8",
         "time_updated": "19:03:05",
         "idsesion": "2_MX40NjkwNzAzNH5-MTYxMDY2MTM3MjE0Mn5EUFdTTk4zNG1oNCtEd2lCTUNzRkh6aGl-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwNzAzNCZzaWc9OTU2OWE1MGYzOTE2ODU1NGEzYmI1Y2NjZDE2YmYxZmQ5NDY5Y2VlZDpzZXNzaW9uX2lkPTJfTVg0ME5qa3dOekF6Tkg1LU1UWXhNRFkyTVRNM01qRTBNbjVFVUZkVFRrNHpORzFvTkN0RWQybENUVU56UmtoNmFHbC1mZyZjcmVhdGVfdGltZT0xNjEwNjYxMzcyJm5vbmNlPTI2Njc3OTk5NCZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNjEzMjUzMzcy",
         "id_usuario": "9991337113",
         "time_finished": "19:03:05",
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-01-15",
         "idUsuario": "9991337113",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": " ",
         "tipo_area": "463",
         "web": null,
         "time_created": "08:58:11",
         "id": "1068",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46907054",
         "lng": null,
         "date_created": "2021-01-15",
         "id_socket": "db1d6090-4ce5-4c19-a9bc-446a0ce90dbe",
         "contadorDesconexion": "10",
         "time_updated": "19:12:09",
         "idsesion": "2_MX40NjkwNzA1NH5-MTYxMDc1OTUwNjc0Mn50bHVCNVUrZmlMa0ovVytIQmZNRWhSWjR-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwNzA1NCZzaWc9OGU2MmM5NGY1M2I0YjZiNDYwMTdmMzQxZTFhZjdmNDgxODA2Yjg1OTpzZXNzaW9uX2lkPTJfTVg0ME5qa3dOekExTkg1LU1UWXhNRGMxT1RVd05qYzBNbjUwYkhWQ05WVXJabWxNYTBvdlZ5dElRbVpOUldoU1dqUi1mZyZjcmVhdGVfdGltZT0xNjEwNzU5NTA2Jm5vbmNlPTE3NDM2NzYzNjEmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxMzM1MTUwNg==",
         "id_usuario": "9991337113",
         "time_finished": "19:12:09",
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-01-18",
         "idUsuario": "9991337113",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": " Agregue la plantilla jornadas laborales a nivel usuario",
         "tipo_area": "463",
         "web": null,
         "time_created": "08:58:00",
         "id": "1117",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46907154",
         "lng": null,
         "date_created": "2021-01-18",
         "id_socket": "dff99f5f-8281-4bdb-bdec-b415adfc080a",
         "contadorDesconexion": "12",
         "time_updated": "19:11:02",
         "idsesion": "1_MX40NjkwNzE1NH5-MTYxMTAxMjY5NTUxN35LMzdMMENYQUdleElxK2x6ekpCUEM2REJ-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwNzE1NCZzaWc9MmEzMGFlYzFhMGUwYjM1NWQ3YTA4ZGIxYzFmMjA2Y2I0ZWQ1OTJlZjpzZXNzaW9uX2lkPTFfTVg0ME5qa3dOekUxTkg1LU1UWXhNVEF4TWpZNU5UVXhOMzVMTXpkTU1FTllRVWRsZUVseEsyeDZla3BDVUVNMlJFSi1mZyZjcmVhdGVfdGltZT0xNjExMDEyNjk1Jm5vbmNlPTE1MTMzNjU4MzUmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxMzYwNDY5NQ==",
         "id_usuario": "9991337113",
         "time_finished": "19:11:02",
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-01-19",
         "idUsuario": "9991337113",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": " aguregue tablas dinamicas y grafica de cartas en jornadas laborales",
         "tipo_area": "463",
         "web": null,
         "time_created": "08:57:06",
         "id": "1173",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46907184",
         "lng": null,
         "date_created": "2021-01-19",
         "id_socket": "49a6c011-a94f-48fa-8e8a-fb98c8afd476",
         "contadorDesconexion": "9",
         "time_updated": "19:19:34",
         "idsesion": "1_MX40NjkwNzE4NH5-MTYxMTA5MzMzNzY2Mn5xNUJTd3BrbW5YVE5TSEdTZ3F2Y0p3UHd-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwNzE4NCZzaWc9YWVmYWVmMjUyNzdlYTQxODFjOTNjYjg3MGMwMTNmOGZhNDc2ZDA0NjpzZXNzaW9uX2lkPTFfTVg0ME5qa3dOekU0Tkg1LU1UWXhNVEE1TXpNek56WTJNbjV4TlVKVGQzQnJiVzVZVkU1VFNFZFRaM0YyWTBwM1VIZC1mZyZjcmVhdGVfdGltZT0xNjExMDkzMzM3Jm5vbmNlPS0yNzg0NjQ0NzImcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxMzY4NTMzNw==",
         "id_usuario": "9991337113",
         "time_finished": "19:19:34",
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-01-20",
         "idUsuario": "9991337113",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": " preparacion del proyecto para compilar de forma local, mejoras en tablas de jornada laboral",
         "tipo_area": "463",
         "web": null,
         "time_created": "08:57:30",
         "id": "1218",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46907224",
         "lng": null,
         "date_created": "2021-01-20",
         "id_socket": "1c325747-78f2-46a5-ba03-a2f913c62ea3",
         "contadorDesconexion": "10",
         "time_updated": "19:08:04",
         "idsesion": "2_MX40NjkwNzIyNH5-MTYxMTE4Njk4NzA0OH5aNlVZMFNNRC9hVkNWQTRmblcvOXVLUTl-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwNzIyNCZzaWc9YzIwODE0NDNjMDdiOWZlNTE2M2M0Y2YzODA5MWQ0N2UzM2M0M2YxYzpzZXNzaW9uX2lkPTJfTVg0ME5qa3dOekl5Tkg1LU1UWXhNVEU0TmprNE56QTBPSDVhTmxWWk1GTk5SQzloVmtOV1FUUm1ibGN2T1hWTFVUbC1mZyZjcmVhdGVfdGltZT0xNjExMTg2OTg3Jm5vbmNlPTEwNzI4OTE5OTYmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxMzc3ODk4Nw==",
         "id_usuario": "9991337113",
         "time_finished": "19:08:04",
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-01-21",
         "idUsuario": "9991337113",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": " preparacion para obtener datos almacenados en el servidor, optimizacion de codigo",
         "tipo_area": "463",
         "web": null,
         "time_created": "08:59:56",
         "id": "1280",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46907234",
         "lng": null,
         "date_created": "2021-01-21",
         "id_socket": "e6431178-4242-41a1-8e00-19bcb0bd763d",
         "contadorDesconexion": "9",
         "time_updated": "19:04:35",
         "idsesion": "2_MX40NjkwNzIzNH5-MTYxMTI2NjI4MDU2MH52N29nZmlCUVo2MGdKMlU5V0lqY2VIbm1-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwNzIzNCZzaWc9MDI4ZDhiMTVlZWI2OGJhOTNjYzZkZDFjZGI0YzFjNzg4ODUxMjVlNzpzZXNzaW9uX2lkPTJfTVg0ME5qa3dOekl6Tkg1LU1UWXhNVEkyTmpJNE1EVTJNSDUyTjI5blptbENVVm8yTUdkS01sVTVWMGxxWTJWSWJtMS1mZyZjcmVhdGVfdGltZT0xNjExMjY2MjgwJm5vbmNlPTE1NjM2MjQ3NTQmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxMzg1ODI4MA==",
         "id_usuario": "9991337113",
         "time_finished": "19:04:35",
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-01-22",
         "idUsuario": "9991337113",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": "revision de la base de datos y cambios en jornadas laborales",
         "tipo_area": "463",
         "web": null,
         "time_created": "08:58:33",
         "id": "1326",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46907254",
         "lng": null,
         "date_created": "2021-01-22",
         "id_socket": "7bdbe22b-95af-4be6-b752-c58adf6e63e3",
         "contadorDesconexion": "11",
         "time_updated": "19:18:06",
         "idsesion": "2_MX40NjkwNzI1NH5-MTYxMTM2NDYxODE0NX5kTWJzcnVXOVdEcHJpclI4Z2dmM3lYdUZ-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwNzI1NCZzaWc9YzcxMjFhMGQwNzVjY2UxYzdmMmJmNGFlMTFlOGVhYTc1ODFlNzYxMTpzZXNzaW9uX2lkPTJfTVg0ME5qa3dOekkxTkg1LU1UWXhNVE0yTkRZeE9ERTBOWDVrVFdKemNuVlhPVmRFY0hKcGNsSTRaMmRtTTNsWWRVWi1mZyZjcmVhdGVfdGltZT0xNjExMzY0NjE4Jm5vbmNlPS0xNzcyOTUxOTU2JnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE2MTM5NTY2MTg=",
         "id_usuario": "9991337113",
         "time_finished": "19:18:06",
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-01-25",
         "idUsuario": "9991337113",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": " ",
         "tipo_area": "463",
         "web": null,
         "time_created": "08:55:33",
         "id": "1368",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46907264",
         "lng": null,
         "date_created": "2021-01-25",
         "id_socket": "01ae4240-184b-4bb8-a66c-cad3042f1e56",
         "contadorDesconexion": "8",
         "time_updated": "19:05:34",
         "idsesion": "1_MX40NjkwNzI2NH5-MTYxMTYxMTc0NzAwNX5VaWZDalhqL05vQlVaZHdZRngzVHY3SWh-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwNzI2NCZzaWc9YTk2NjgwY2EyZThlZTliNjQ0MTNhZDRjNTI2YjFkYjQxYTI0YmNiMzpzZXNzaW9uX2lkPTFfTVg0ME5qa3dOekkyTkg1LU1UWXhNVFl4TVRjME56QXdOWDVWYVdaRGFsaHFMMDV2UWxWYVpIZFpSbmd6VkhZM1NXaC1mZyZjcmVhdGVfdGltZT0xNjExNjExNzQ3Jm5vbmNlPS0xNDg0OTgxNTI0JnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE2MTQyMDM3NDc=",
         "id_usuario": "9991337113",
         "time_finished": "19:05:34",
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-01-26",
         "idUsuario": "9991337113",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": " cambios en el diseño de jornadas laborales, agregue calendario de actividades",
         "tipo_area": "463",
         "web": null,
         "time_created": "08:58:10",
         "id": "1428",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46907284",
         "lng": null,
         "date_created": "2021-01-26",
         "id_socket": "6cbd9a44-3fd4-4dce-aff3-5193279fb4cc",
         "contadorDesconexion": "14",
         "time_updated": "19:06:32",
         "idsesion": "2_MX40NjkwNzI4NH5-MTYxMTcwMzU5ODY2MX5UU1RRQkdzNklkLzVwM2ljK1dYM3hFSWZ-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwNzI4NCZzaWc9OTMyZmQ4ZGYxYjA5MjdlNjgwNDY4ODJkOTUwOWZmM2E0OTk1YTQ3YTpzZXNzaW9uX2lkPTJfTVg0ME5qa3dOekk0Tkg1LU1UWXhNVGN3TXpVNU9EWTJNWDVVVTFSUlFrZHpOa2xrTHpWd00ybGpLMWRZTTNoRlNXWi1mZyZjcmVhdGVfdGltZT0xNjExNzAzNTk4Jm5vbmNlPS01NjIzODkwNjImcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxNDI5NTU5OA==",
         "id_usuario": "9991337113",
         "time_finished": "19:06:32",
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-01-27",
         "idUsuario": "9991337113",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": " mejore diseño de las gráficas en jornadas laborales, para que se vean mejor en dispositivos móviles. y adapte las fechas para que sean dinamicas.",
         "tipo_area": "463",
         "web": null,
         "time_created": "08:58:33",
         "id": "1479",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46908094",
         "lng": null,
         "date_created": "2021-01-27",
         "id_socket": "10765195-17b3-47b6-ab46-9c0c35831d2e",
         "contadorDesconexion": "9",
         "time_updated": "19:11:40",
         "idsesion": "1_MX40NjkwODA5NH5-MTYxMTc4NDU5NTc4OH5WZ1BuQ2ZmdURtZkJ2MDA5WUozOWszbmZ-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwODA5NCZzaWc9N2RiZGU3NGI4NDlhOGRmMmM1ZTliYzU2OWIzYzJjMTY5MDEyZjQ1MDpzZXNzaW9uX2lkPTFfTVg0ME5qa3dPREE1Tkg1LU1UWXhNVGM0TkRVNU5UYzRPSDVXWjFCdVEyWm1kVVJ0WmtKMk1EQTVXVW96T1dzemJtWi1mZyZjcmVhdGVfdGltZT0xNjExNzg0NTk1Jm5vbmNlPTIxMTM3NzYzOTYmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxNDM3NjU5NQ==",
         "id_usuario": "9991337113",
         "time_finished": "19:11:40",
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-01-28",
         "idUsuario": "9991337113",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": " cambie el diseño de las gráficas en jornadas laborales a nivel empleado, preparación de solicitudes de datos al servidor para mostrar el rendimiento del empleado.",
         "tipo_area": "463",
         "web": null,
         "time_created": "08:58:26",
         "id": "1536",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46908114",
         "lng": null,
         "date_created": "2021-01-28",
         "id_socket": "224ef67a-bbb3-45bc-abaf-03f712b2e565",
         "contadorDesconexion": "5",
         "time_updated": "19:03:22",
         "idsesion": "2_MX40NjkwODExNH5-MTYxMTg3MTA5OTg1M351d1kxRERXeEoxNFVnN3VONzJ4M0FGYk5-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwODExNCZzaWc9ZDVjMDJmMGZkYWM0MmUxZDcwMDhiMDAxM2E3NmU2ZWRiNTA1YjU1MjpzZXNzaW9uX2lkPTJfTVg0ME5qa3dPREV4Tkg1LU1UWXhNVGczTVRBNU9UZzFNMzUxZDFreFJFUlhlRW94TkZWbk4zVk9Oeko0TTBGR1lrNS1mZyZjcmVhdGVfdGltZT0xNjExODcxMDk5Jm5vbmNlPTI0Nzk4ODc1NSZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNjE0NDYzMDk5",
         "id_usuario": "9991337113",
         "time_finished": "19:03:22",
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-01-29",
         "idUsuario": "9991337113",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": "optimice el código, diseño, peticiones y gráficas de jornadas laborales.",
         "tipo_area": "463",
         "web": null,
         "time_created": "08:56:45",
         "id": "1583",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46908134",
         "lng": null,
         "date_created": "2021-01-29",
         "id_socket": "fa1c756b-691d-4416-84d4-bd9ec03a9875",
         "contadorDesconexion": "10",
         "time_updated": "19:06:07",
         "idsesion": "2_MX40NjkwODEzNH5-MTYxMTk2MTY3MDc2M35KRXptZTRaZ1pZOWc5ZnJ5SVdyRkllTTh-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwODEzNCZzaWc9YjI2MTM1NTIxYmMxMTdjN2U1MGIzNjM5OGYyMjRmNDE3MWM2ZWZmMTpzZXNzaW9uX2lkPTJfTVg0ME5qa3dPREV6Tkg1LU1UWXhNVGsyTVRZM01EYzJNMzVLUlhwdFpUUmFaMXBaT1djNVpuSjVTVmR5UmtsbFRUaC1mZyZjcmVhdGVfdGltZT0xNjExOTYxNjcwJm5vbmNlPS03OTYxODU4NSZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNjE0NTUzNjcw",
         "id_usuario": "9991337113",
         "time_finished": "19:06:07",
         "tipo_servicio": "3064",
         "activo": "0"
         }
         ],
         "success": true,
         "failure": false,
         "mensaje": "ok"
         })
         }, 1000)
         })
         }
         jornadasLaboralesMesEmpleado = await peticionTest2()
         } else {
         const peticionTest = () => {
         return new Promise(resolve => {
         setTimeout(() => {
         resolve({
         "data": [
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-02-02",
         "idUsuario": "9991336781",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": " Actualizar Datos Covid19 Mexico\nActualizar Datos Covid19 Colombia\nPreparacion de servicio de Directorios\nPreparacion de documentacion del servicio de Directorios\nBusqueda de informacion de datos para Gis Argentina\nOptimizaciones en el programa para agregar nuevo codigo para Gis Argentina\n",
         "tipo_area": "463",
         "web": "true",
         "time_created": "08:59:35",
         "id": "1642",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46908144",
         "lng": null,
         "date_created": "2021-02-02",
         "id_socket": "532bcf5b-7ffb-48e4-9b62-a00febe24612",
         "contadorDesconexion": "4",
         "time_updated": "19:35:54",
         "idsesion": "2_MX40NjkwODE0NH5-MTYxMjMxMzI1MTA4OX41YkRZUUR3elFUQkdzWmZXZGt1Rng3VXR-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwODE0NCZzaWc9OTYxNTVlYTljZjBmMzY0MjNmZmVkZjVlM2VjNTk4NTQwN2ViZjI1MTpzZXNzaW9uX2lkPTJfTVg0ME5qa3dPREUwTkg1LU1UWXhNak14TXpJMU1UQTRPWDQxWWtSWlVVUjNlbEZVUWtkeldtWlhaR3QxUm5nM1ZYUi1mZyZjcmVhdGVfdGltZT0xNjEyMzEzMjUxJm5vbmNlPS0xMzc2OTI3Nzg1JnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE2MTQ5MDUyNTE=",
         "id_usuario": "9991336781",
         "time_finished": "19:35:54",
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-02-03",
         "idUsuario": "9991336781",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": " Actualizar Datos Covid19 Mexico\nActualizar Datos Covid19 Peru\nJunta de Corte funcional en la plataforma\nPreparar Archivos para nueva forma de filtros en Directorios\nPreparar archivos Para directorios Hospitales y Centros Recreativos\nActualizar Servicios de Directorios\n",
         "tipo_area": "463",
         "web": "true",
         "time_created": "09:02:39",
         "id": "1716",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46908164",
         "lng": null,
         "date_created": "2021-02-03",
         "id_socket": "202aa1d7-7948-45a9-b64e-0ff9324d5d93",
         "contadorDesconexion": "4",
         "time_updated": "20:24:48",
         "idsesion": "1_MX40NjkwODE2NH5-MTYxMjQwMDM4MTQxM35JZGllVE1wckgyUE04a3NxSENKTXN0Wml-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwODE2NCZzaWc9NGI4ZDRlN2EyNmQ1OTQ3NTk2MGIwOGQ3ZTA1YWE4M2YzZGFlZTUzNjpzZXNzaW9uX2lkPTFfTVg0ME5qa3dPREUyTkg1LU1UWXhNalF3TURNNE1UUXhNMzVKWkdsbFZFMXdja2d5VUUwNGEzTnhTRU5LVFhOMFdtbC1mZyZjcmVhdGVfdGltZT0xNjEyNDAwMzgxJm5vbmNlPTE1MzM1NjQ4MzAmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxNDk5MjM4MQ==",
         "id_usuario": "9991336781",
         "time_finished": "20:24:48",
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-02-04",
         "idUsuario": "9991336781",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": " ",
         "tipo_area": "463",
         "web": "true",
         "time_created": "09:01:50",
         "id": "1769",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46908204",
         "lng": null,
         "date_created": "2021-02-04",
         "id_socket": "5d2b0b83-6739-428c-9cde-b772956e7329",
         "contadorDesconexion": "7",
         "time_updated": "20:27:57",
         "idsesion": "2_MX40NjkwODIwNH5-MTYxMjQ4OTA5MTIyM35pYnVjamZ6V3A5Rk95Zng0eXFNV2NRa0h-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwODIwNCZzaWc9Y2Y0NzU5ZTYyZTM2NjFkYTM2ZWMxZThhYTBjZDg0ZTRkOTgzZjU2ODpzZXNzaW9uX2lkPTJfTVg0ME5qa3dPREl3Tkg1LU1UWXhNalE0T1RBNU1USXlNMzVwWW5WamFtWjZWM0E1Ums5NVpuZzBlWEZOVjJOUmEwaC1mZyZjcmVhdGVfdGltZT0xNjEyNDg5MDkxJm5vbmNlPTE5NjUwNTUxMDEmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxNTA4MTA5MQ==",
         "id_usuario": "9991336781",
         "time_finished": "20:27:57",
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-02-05",
         "idUsuario": "9991336781",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": "  Actualizar Datos Covid19 Mexico\nTrabajar documentos para obtener datos covid19 Argentina\nAgregar Funcion de obtencion de infraestructuras cerca de Cajeros Aval\nFuncion de Extraer reporte pdf\nActualizar Datos ANTAD",
         "tipo_area": "463",
         "web": "true",
         "time_created": "09:01:13",
         "id": "1818",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46908214",
         "lng": null,
         "date_created": "2021-02-05",
         "id_socket": "1111d8f8-7ae8-4a0d-9b44-377969443e37",
         "contadorDesconexion": "10",
         "time_updated": "20:16:45",
         "idsesion": "2_MX40NjkwODIxNH5-MTYxMjU3Nzc5MTMyOH5XMFhXMHZIYlM5RmhpSG4zdHVQalVNM1p-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwODIxNCZzaWc9M2ZlY2Q0NTUzN2IzNWNkMDAzNjA5MDc3ZjUyNGQ3YzY5ZTdlOTExOTpzZXNzaW9uX2lkPTJfTVg0ME5qa3dPREl4Tkg1LU1UWXhNalUzTnpjNU1UTXlPSDVYTUZoWE1IWklZbE01Um1ocFNHNHpkSFZRYWxWTk0xcC1mZyZjcmVhdGVfdGltZT0xNjEyNTc3NzkxJm5vbmNlPTEyNTE3ODIxOCZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNjE1MTY5Nzkx",
         "id_usuario": "9991336781",
         "time_finished": "20:16:45",
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-02-08",
         "idUsuario": "9991336781",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": "  Actualizar Datos Covid Mexico\nActualizar Datos Covid Colombia\nPreparar Documentos de covid Municipio GisArgentina\nAgregar Capas de Infraestructura Gis Argentina\nCapas de Casos por Departamento y Provincia Gis Argentina",
         "tipo_area": "463",
         "web": "true",
         "time_created": "09:02:56",
         "id": "1876",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46908234",
         "lng": null,
         "date_created": "2021-02-08",
         "id_socket": "3ac33ef5-c5fc-4ff1-8658-dfcf9c66e8b7",
         "contadorDesconexion": "5",
         "time_updated": "20:23:53",
         "idsesion": "1_MX40NjkwODIzNH5-MTYxMjgzMjA2NDY3N35HZk5Wak9FSkprb3ZuWWpNZGE1UXc0RGl-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwODIzNCZzaWc9MzlhOTMxMTc3YjRhM2FkMjNlNWE5YzBiZWUyZTUxNTA4Nzg5ZTcyYzpzZXNzaW9uX2lkPTFfTVg0ME5qa3dPREl6Tkg1LU1UWXhNamd6TWpBMk5EWTNOMzVIWms1V2FrOUZTa3ByYjNadVdXcE5aR0UxVVhjMFJHbC1mZyZjcmVhdGVfdGltZT0xNjEyODMyMDY0Jm5vbmNlPS0xMTIwNjU2MDM5JnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE2MTU0MjQwNjQ=",
         "id_usuario": "9991336781",
         "time_finished": "20:23:53",
         "tipo_servicio": "3064",
         "activo": "0"
         },
         {
         "Nombre": null,
         "aliasServicio": null,
         "date_updated": "2021-02-09",
         "idUsuario": "9991336781",
         "id360": null,
         "urlServicio": "https://empresas.claro360.com/plataforma360",
         "reporte": null,
         "tipo_area": "463",
         "web": "true",
         "time_created": "09:01:02",
         "id": "1919",
         "tipo_usuario": "124",
         "lat": null,
         "apikey": "46908234",
         "lng": null,
         "date_created": "2021-02-09",
         "id_socket": "70b42b97-eea5-4600-909d-3c90f97d0c56",
         "contadorDesconexion": "2",
         "time_updated": "16:00:19",
         "idsesion": "1_MX40NjkwODIzNH5-MTYxMjkwODAwMjg1NH5ueUZPcS9XdzlTUG9lOUNBMDlBRE0wZTR-fg",
         "token": "T1==cGFydG5lcl9pZD00NjkwODIzNCZzaWc9ZjdlYWFjYTJlNDc0ZmI5YzM2ZDk2ZDQyODhlNzMyYTM2NTlkNWMxNDpzZXNzaW9uX2lkPTFfTVg0ME5qa3dPREl6Tkg1LU1UWXhNamt3T0RBd01qZzFOSDV1ZVVaUGNTOVhkemxUVUc5bE9VTkJNRGxCUkUwd1pUUi1mZyZjcmVhdGVfdGltZT0xNjEyOTA4MDAyJm5vbmNlPTE0NDU1OTk3OTMmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYxNTUwMDAwMg==",
         "id_usuario": "9991336781",
         "time_finished": null,
         "tipo_servicio": "3064",
         "activo": "1"
         }
         ],
         "success": true,
         "failure": false,
         "mensaje": "ok"
         })
         }, 1000)
         })
         }
         jornadasLaboralesMesEmpleado = await peticionTest()
         }*/
        let horaEntrada2 = undefined
        let tiempoCreado2 = undefined
        retardos = {}
        let retardos3 = []
        puntuales = {}
        let puntuales3 = []
        let puntualidad = 0
        let numeroRetardos = 1
        let horasMesEmpleado = 0

        if (jornadasLaboralesMesEmpleado.data) {
            jornadasLaboralesMesEmpleado.data.forEach(element => {
                tiempoCreado2 = moment(element.date_created + "T" + element.time_created)
                horaEntrada2 = moment(element.date_created + "T" + jornadas_laborales_empleado[0].horario_entrada)
                horaEntrada2.add(moment.duration("00:01:00"))
                if (element.time_finished) {
                    tiempoTerminado2 = moment(element.date_updated + "T" + element.time_finished)
                    horasMesEmpleado += tiempoTerminado2.diff(tiempoCreado2, 'hours') - 2
                }
                if (tiempoCreado2 >= horaEntrada2) {
                    retardos[new Date(element.date_created + "T00:00")] = new Date(element.date_created + "T00:00")
                    retardos3.push(element)
                } else {
                    puntuales[new Date(element.date_created + "T00:00")] = new Date(element.date_created + "T00:00")
                    puntuales3.push(element)
                }
            })
            puntualidad = puntuales3.length
            numeroRetardos = retardos3.length
        }

        google.charts.load("current", {packages: ["corechart"]});
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            var data = google.visualization.arrayToDataTable([
                ['Task', 'Hours per Day'],
                ['Puntualidad', puntualidad],
                ['Inpuntualidad', numeroRetardos]
            ]);
            var options = {
                //title: 'Puntualidad',
                //width: '100%',
                pieHole: 0.8,
                colors: ['#D54152', 'C6C6C4'],
                backgroundColor: '#f5f5f5',
                legend: 'none',
                pieSliceText: 'none',
                pieSliceTextStyle: {
                    color: 'black',
                    //fontSize: 20
                    bold: true
                },
                chartArea: {
                    left: 0,
                    height: "90%",
                    //top: "0%",
                    width: "100%"
                }
            }
            ;
            var chart = new google.visualization.PieChart(document.getElementById('donutchart3'));
            chart.draw(data, options);
        }


        //RESUMEN GENERAL
        //TOTAL DE DIAS RENDIMIENTO MENSUAL    
        var from = moment(inicioMes, "YYYY-MM-DD"),
                to = moment(finMes, "YYYY-MM-DD"),
                diasTotales = 0;
        faltas = {}
        let faltasArreglo = []
        let numeroFaltas = 1
        let faltaEncontrada = false
        while (!from.isAfter(to)) {
            // Si no es sabado ni domingo
            if (from.isoWeekday() !== 6 && from.isoWeekday() !== 7) {
                diasTotales++;
                diasFestivos.forEach(element => {
                    if (from.format('YYYY-MM-DD') === element.format("YYYY-MM-DD")) {
                        diasTotales--
                    }
                })
                if (jornadasLaboralesMesEmpleado.data) {
                    faltaEncontrada = false
                    for (let i = 0; i < jornadasLaboralesMesEmpleado.data.length; i++) {
                        if (from.format('YYYY-MM-DD') === jornadasLaboralesMesEmpleado.data[i].date_created) {
                            faltaEncontrada = false
                            break
                        } else {
                            //faltaEncontrada = true
                            for (let j = 0; j < diasFestivos.length; j++) {
                                if (from.format('YYYY-MM-DD') === diasFestivos[j].format("YYYY-MM-DD")) {
                                    faltaEncontrada = false
                                    break;
                                } else {
                                    //faltaEncontrada = true
                                    if (from.format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
                                        faltaEncontrada = true
                                    } else {
                                        faltaEncontrada = false
                                    }
                                }
                            }
                        }
                    }
                    numeroFaltas = faltasArreglo.length
                }
                if (faltaEncontrada) {
                    faltas[new Date(from.format('YYYY-MM-DD') + "T00:00")] = new Date(from.format('YYYY-MM-DD') + "T00:00")
                    faltasArreglo.push(from.format('YYYY-MM-DD'))
                    numeroFaltas = faltasArreglo.length
                }
            }
            from.add(1, 'days');
        }

        let horasTotalesLaboralesMesEmpleado = diasTotales * 8
        let inactividadMensual = horasTotalesLaboralesMesEmpleado - horasMesEmpleado
        if (inactividadMensual < 0) {
            inactividadMensual = 0
        }
        let porcentajeProductividadMensual = 0
        porcentajeProductividadMensual = ((horasMesEmpleado / horasTotalesLaboralesMesEmpleado) * 100)
        porcentajeProductividadMensual = porcentajeProductividadMensual > 100 ? 100 : porcentajeProductividadMensual.toFixed()

        google.charts.load("current", {packages: ["corechart"]});
        google.charts.setOnLoadCallback(drawChart3);
        function drawChart3() {
            var data = google.visualization.arrayToDataTable([
                ['Task', 'Hours per Day'],
                ['Productividad', horasMesEmpleado],
                ['Inactividad', inactividadMensual]
            ]);
            var options = {
                //title: 'Productividad',
                //width: '100%',                
                pieHole: 0.8,
                colors: ['#93C12A', '#C6C6C4'],
                backgroundColor: '#f5f5f5',
                legend: 'none',
                pieSliceText: 'none',
                pieSliceTextStyle: {
                    color: 'black',
                    //fontSize: 20
                    bold: true
                },
                chartArea: {
                    left: "0",
                    height: "90%",
                    //top: "0%",
                    width: "100%"
                }
            };
            var chart = new google.visualization.PieChart(document.getElementById('donutchart2'));
            chart.draw(data, options);
        }
        let diasLaboraloMesEmpleado = 0
        let porcentajePuntualidad = 0
        let porcentajeCumplimiento = 0
        if (jornadasLaboralesMesEmpleado.data) {
            diasLaboraloMesEmpleado = jornadasLaboralesMesEmpleado.data.length
            porcentajePuntualidad = ((puntualidad / diasLaboraloMesEmpleado) * 100)
            porcentajePuntualidad = porcentajePuntualidad > 100 ? 100 : porcentajePuntualidad.toFixed()
            porcentajeCumplimiento = ((diasLaboraloMesEmpleado / (diasLaboraloMesEmpleado + numeroFaltas)) * 100)
            porcentajeCumplimiento = porcentajeCumplimiento > 100 ? 100 : porcentajeCumplimiento.toFixed()
        }
        google.charts.load("current", {packages: ["corechart"]});
        google.charts.setOnLoadCallback(drawChart4);
        function drawChart4() {
            var data = google.visualization.arrayToDataTable([
                ['Task', 'Hours per Day'],
                ['Cumplimiento', diasLaboraloMesEmpleado],
                ['Incumplimiento', numeroFaltas]
            ]);
            var options = {
                //title: 'Cumplimiento',
                //width: '100%',
                pieHole: 0.8,
                colors: ['#683982', 'C6C6C4'],
                backgroundColor: '#f5f5f5',
                legend: 'none',
                pieSliceText: 'none',
                pieSliceTextStyle: {
                    color: 'black',
                    //fontSize: 20
                    bold: true
                },
                chartArea: {
                    left: 0,
                    height: "90%",
                    //top: "0%",
                    width: "100%"
                }
            };
            var chart = new google.visualization.PieChart(document.getElementById('donutchart4'));
            chart.draw(data, options);
        }
        $('#diasLaboralesMesEmpleado').text(diasLaboraloMesEmpleado)
        $('#diasTotalesLaboralesMesEmpleado').text(diasTotales)
        $('#horasLaboralesMesEmpleado').text(horasMesEmpleado)
        $('#horasTotalesLaboralesMesEmpleado').text(horasTotalesLaboralesMesEmpleado)
        $('#retardosLaboralesMesEmpleado').text(retardos3.length)
        $('#faltasLaboralesMesEmpleado').text(faltasArreglo.length)
        $("#jornadas_laborales_productividad_mensual_porcentaje").text(porcentajeProductividadMensual);
        $("#jornadas_laborales_puntualidad_porcentaje").text(porcentajePuntualidad);
        $("#jornadas_laborales_cumplimiento_porcentaje").text(porcentajeCumplimiento);

        //CALENDARIO
        $.datepicker.regional['es'] = {
            closeText: 'Cerrar',
            prevText: '< ',
            nextText: ' >',
            currentText: 'Hoy',
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
            dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
            weekHeader: 'Sm',
            dateFormat: 'dd/mm/yy',
            firstDay: 1,
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: ''
        };
        $.datepicker.setDefaults($.datepicker.regional['es']);

        let vacaciones = {};
        vacaciones[ new Date('01/29/2021')] = new Date('01/29/2021');
        vacaciones[ new Date('01/30/2021')] = new Date('01/30/2021');
        vacaciones[ new Date('01/31/2021')] = new Date('01/31/2021');

        $("#calendarioRendimientoMensual").datepicker("refresh")

        await $("#calendarioRendimientoMensual").datepicker({
            firstDay: 0,
            beforeShowDay: function (date) {
                var highlight = puntuales[date];
                var highlight2 = retardos[date];
                var highlight3 = faltas[date];
                var highlight4 = vacaciones[date];
                if (highlight) {
                    return [true, "puntuales", 'Tooltip text'];
                }
                if (highlight2) {
                    return [true, "retardos", 'Tooltip text'];
                }
                if (highlight3) {
                    return [true, "faltas", 'Tooltip text'];
                }
                if (highlight4) {
                    return [true, "vacaciones", 'Tooltip text'];
                } else {
                    return [true, '', ''];
                }
            },
            onChangeMonthYear: async function (year, month) {
                await rendimientoMensual(month - 1)
            }
        });
    }
    rendimientoMensual(moment().month())

    const conResultados = $("#empleadoConHistorialLaboral");
    const sinResultados = $("#empleadoSinHistorialLaboral");
    conResultados.addClass("d-none");
    sinResultados.addClass("d-none");
}
const init_reportejornadaslaborales = (json) => {
    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;
}
$(function () {
    $("#tabs_jornadas_laborales").tabs({
        //event: "mouseover"
    });
});

$("#tab_en_jornada").mouseover(() => {
    $("#tab_en_jornada").addClass("active");
    $("#tab_reporte_jornada").removeClass("active");
});

$("#tab_reporte_jornada").mouseover(() => {
    $("#tab_reporte_jornada").addClass("active");
    $("#tab_en_jornada").removeClass("active");
});
var empleados = [],
        empleadosEmpresa = [],
        tablaInicio;
const botonExcel = $("#botonDescargaReporteJornada2");
const inicioJornadas = $("#inicio-reporte-jornadas-laborales");

const initComunicacionJornadasLaborales = (id360, llamada) => {

    $("#sidebar a:eq(3)").click();
    $("#menu_section_Comunicación").click();
    if (!$("#profile_chat" + id360).length) {
        let dataUsr = {"id360": id360};
        RequestPOST("/API/get/perfil360", dataUsr).then((response) => {
            if (response.success) {
                contacto_chat(response);
                directorio_completo.push(response);
                $("#profile_chat" + id360).click();
                if (llamada)
                    $("#profile_chat" + id360 + " .btn-realizarLlamadaChat").click();
            }
        });
    } else {
        $("#profile_chat" + id360).click();
        if (llamada)
            $("#profile_chat" + id360 + " .btn-realizarLlamadaChat").click();
    }

};

const enviar_mensaje_empleado_en_jornada = (id360) => {
    initComunicacionJornadasLaborales(id360, false);
};

const inicia_llamada_empleado_en_jornada = (id360) => {
    initComunicacionJornadasLaborales(id360, true);
};

$("#btn-refrescar-jornadas").click(() => {
    inicioJornadasLaborales();
});

const inicioJornadasLaborales = () => {

    if (tablaInicio !== undefined && tablaInicio !== null) {
        tablaInicio.destroy();
    }

    let c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0, c6 = 0, c7 = 0, sumaTotal;

    const tablaEmpleadosEnJornada = $("#tabla-empleados-en-jornada");
    const cuerpoTableEmpleadosEnJornada = tablaEmpleadosEnJornada.find("tbody");
    const conResultados = $("#con-empleados-en-jornada");
    const sinResultados = $("#sin-empleados-en-jornada");

    conResultados.addClass("d-none");
    sinResultados.addClass("d-none");
    cuerpoTableEmpleadosEnJornada.empty();

    let data = new Object();
    data.id = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;

    RequestPOST("/API/empresas360/jornadas_laborales/empresa/obtener_ids/en_jornada", data).then((ids) => {
        empleadosEmpresa = ids;

        if (empleadosEmpresa.length) {

            conResultados.removeClass("d-none");
            sinResultados.addClass("d-none");

            let tbody = "";

            RequestPOST("/API/empresas360/jornadas_laborales/empresa/obtener_empleados", ids).then((response) => {

                empleados = response;

                $.each(empleadosEmpresa, (index, empleado) => {

                    let detalleEmpleado = infoEmpleado(empleado.id360);

                    let partesHoraEntro = detalleEmpleado.hora_entrada.split(":");
                    let horaEntro = moment();
                    horaEntro.set("hour", partesHoraEntro[0]);
                    horaEntro.set("minute", partesHoraEntro[1]);
                    horaEntro.set("second", partesHoraEntro[2]);

                    let partesHoraTenia = detalleEmpleado.horario_entrada.split(":");
                    let horaTenia = moment();
                    horaTenia.set("hour", partesHoraTenia[0]);
                    horaTenia.set("minute", partesHoraTenia[1]);
                    horaTenia.set("second", partesHoraTenia[2]);

                    let tipoEntrada = 'success';

                    let minutosDeDiferencia = horaTenia.diff(horaEntro, 'minutes');

                    c1++;
                    if (minutosDeDiferencia < -5) {
                        tipoEntrada = 'warning';
                        c2++;
                        c1--;
                    }
                    if (minutosDeDiferencia < -20) {
                        tipoEntrada = 'danger';
                        c3++;
                        c2--;
                    }

                    let tipoSalida = 'light';
                    let salio = '';
                    c7++;

                    if (detalleEmpleado.hora_salida !== undefined && detalleEmpleado.hora_salida !== null) {

                        tipoSalida = 'success';
                        c7--;
                        salio = detalleEmpleado.hora_salida;

                        let partesHoraSalio = detalleEmpleado.hora_salida.split(":");
                        let horaSalio = moment();
                        horaSalio.set("hour", partesHoraSalio[0]);
                        horaSalio.set("minute", partesHoraSalio[1]);
                        horaSalio.set("second", partesHoraSalio[2]);

                        let partesHoraTeniaSalir = detalleEmpleado.horario_salida.split(":");
                        let horaTeniaSalir = moment();
                        horaTeniaSalir.set("hour", partesHoraTeniaSalir[0]);
                        horaTeniaSalir.set("minute", partesHoraTeniaSalir[1]);
                        horaTeniaSalir.set("second", partesHoraTeniaSalir[2]);

                        let minutosDeDiferenciaSalida = horaTeniaSalir.diff(horaSalio, 'minutes');
                        console.log("minutos de diferencia de salida");
                        console.log(minutosDeDiferenciaSalida);

                        c4++;
                        if (minutosDeDiferenciaSalida > -5) {
                            tipoSalida = 'warning';
                            c5++;
                            c4--;
                        }
                        if (minutosDeDiferenciaSalida > -20) {
                            tipoSalida = 'danger';
                            c6++;
                            c5--;
                        }

                    }

                    let horaDesconexion = detalleEmpleado.hora_desconexion !== undefined && detalleEmpleado.hora_desconexion !== null ? detalleEmpleado.hora_desconexion : '';

                    tbody += '<tr class="text-center" id="fila_empleado_en_jornada_' + detalleEmpleado.id360 + '">';

                    tbody += '  <td>' + detalleEmpleado.nombre + ' ' + detalleEmpleado.apellido_paterno + ' ' + detalleEmpleado.apellido_materno + '</td>';
                    tbody += '  <td>' + detalleEmpleado.sucursal + '</td>';
                    tbody += '  <td>' + detalleEmpleado.area + '</td>';
                    tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-' + tipoEntrada + '">' + detalleEmpleado.horario_entrada + '</span></td>';
                    tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-' + tipoEntrada + '">' + detalleEmpleado.hora_entrada + '</span></td>';
                    tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-light">' + horaDesconexion + '</span></td>';
                    tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-' + tipoSalida + '">' + detalleEmpleado.horario_salida + '</span></td>';
                    tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-' + tipoSalida + '">' + salio + '</span></td>';
                    tbody += '  <td>' + detalleEmpleado.desconexiones + '</td>';
                    tbody += '  <td><button onclick="enviar_mensaje_empleado_en_jornada(' + detalleEmpleado.id360 + ')" class="btn btn-dark"><i class="fas fa-comment-dots"></i></button></td>';
                    tbody += '  <td><button onclick="inicia_llamada_empleado_en_jornada(' + detalleEmpleado.id360 + ')" class="btn btn-dark"><i class="fas fa-phone"></i></button></td>';

                    tbody += '</tr>';

                });

                cuerpoTableEmpleadosEnJornada.append(tbody);
                tablaInicio = tablaEmpleadosEnJornada.DataTable({
                    retrieve: true,
                    dom: 'Bfrtip',
                    buttons: [
                        'copy', 'csv', 'excel', 'pdf', 'print'
                    ],
                    paging: false
                });

                sumaTotal = c1 + c2 + c3;

                $("#contadorEnTiempo").text(c1 + " - " + ((c1 / sumaTotal) * 100).toFixed(2) + "%");
                $("#contadorRetardo").text(c2 + " - " + ((c2 / sumaTotal) * 100).toFixed(2) + "%");
                $("#contadorTarde").text(c3 + " - " + ((c3 / sumaTotal) * 100).toFixed(2) + "%");
                let contadorEnTiempo = Math.round((((c1 / sumaTotal) * 100).toFixed(2)) / 10)
                document.addEventListener("load", setColorBasal(contadorEnTiempo, 'Puntales'));
                $("#PorcentajePuntales").text(((c1 / sumaTotal) * 100).toFixed(2))
                let contadorRetardo = Math.round(((((c2 + c3) / sumaTotal) * 100).toFixed(2)) / 10)
                document.addEventListener("load", setColorBasal(contadorRetardo, 'Retardos'));
                $("#PorcentajaRetardos").text(((c1 / sumaTotal) * 100).toFixed(2))

                $("#contadorEnTiempoSalida").text(c4 + " - " + ((c4 / sumaTotal) * 100).toFixed(2) + "%");
                $("#contadorRetardoSalida").text(c5 + " - " + ((c5 / sumaTotal) * 100).toFixed(2) + "%");
                $("#contadorTardeSalida").text(c6 + " - " + ((c6 / sumaTotal) * 100).toFixed(2) + "%");

                $("#contadorAunEnJornada").text(c7 + " - " + ((c7 / sumaTotal) * 100).toFixed(2) + "%");

            });

        } else {
            conResultados.addClass("d-none");
            sinResultados.removeClass("d-none");
        }

    });

};

inicioJornadasLaborales();

const cargaEmpleados = () => {
    let data = new Object();
    data.id = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
    RequestPOST("/API/empresas360/jornadas_laborales/empresa/obtener_ids", data).then((ids) => {
        empleadosEmpresa = ids;
        RequestPOST("/API/empresas360/jornadas_laborales/empresa/obtener_empleados", ids).then((response) => {

            empleados = response;
            const selectEmpleados = $("#empleado_jornadas");
            selectEmpleados.empty().append('<option selected disabled value="">Seleccionar...</option>');

            let options = '';
            $.each(empleados, function (index, empleado) {
                options += '<option value="' + empleado.id360 + '" >' + empleado.nombre + ' ' + empleado.apellido_paterno + ' ' + empleado.apellido_materno + '</option>';
            });

            selectEmpleados.append(options);

        });

    });
};

$("#sucursal_jornadas, #area_jornadas, #empleado_jornadas").change(function () {
    botonExcel.addClass("d-none");
});

$("#fecha_inicio_reporte2").change(function () {
    const f2 = $("#fecha_fin_reporte2");
    if (f2.val() === "")
        f2.val($(this).val());
});

function formatDateDefault(date) {
    let dia = date.getDate().toString();
    if (dia.length === 1)
        dia = "0" + dia;
    let mes = (date.getMonth() + 1).toString();
    if (mes.length === 1)
        mes = "0" + mes;
    return dateParse = date.getFullYear() + "-" + mes + "-" + dia;
}

$("#tipo_busqueda").change(function () {
    let tipo = $(this).val();
    cargaEmpleados();
    botonExcel.addClass("d-none");

    const contenedorSelectSucursales = $("#contenedor-select-sucursales");
    const contenedorSelectAreas = $("#contenedor-select-areas");
    const contenedorSelectEmpleados = $("#contenedor-select-empleados");

    switch (tipo) {
        case "SUCURSAL":
            contenedorSelectSucursales.removeClass("d-none");
            contenedorSelectAreas.addClass("d-none");
            contenedorSelectEmpleados.addClass("d-none");
            break;
        case "AREA":
            contenedorSelectSucursales.addClass("d-none");
            contenedorSelectAreas.removeClass("d-none");
            contenedorSelectEmpleados.addClass("d-none");
            break;
        case "EMPLEADO":
            contenedorSelectSucursales.addClass("d-none");
            contenedorSelectAreas.addClass("d-none");
            contenedorSelectEmpleados.removeClass("d-none");
            break;
        case "TODOS":
            contenedorSelectSucursales.addClass("d-none");
            contenedorSelectAreas.addClass("d-none");
            contenedorSelectEmpleados.addClass("d-none");
            break;
    }

});

function convertDateFormat(string) {
    return string.split('-').reverse().join('/');
}

$("#form_historia_jornadas2").submit(function (e) {
    e.preventDefault();

    let fecha_inicio = $("#fecha_inicio_reporte2").val();

    if (validarFecha(convertDateFormat(fecha_inicio))) {

        let fecha_fin = $("#fecha_fin_reporte2").val();

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

const consulta_historial = (fecha_inicio, fecha_final) => {

    let tipoBusqueda = $("#tipo_busqueda").val();

    if (tipoBusqueda === null || tipoBusqueda === undefined || tipoBusqueda === "") {
        swal.fire({text: "Seleccione un tipo de búsqueda"});
    } else {

        $("#inicio_jornadas_laborales").addClass("d-none");

        const resultInfo = $("#tablas_resultados");
        resultInfo.empty();
        const excel = $("#resultados-exportar-excel");
        excel.empty();

        let data = new Object();
        data.inicio = fecha_inicio;
        data.fin = fecha_final;

        switch (tipoBusqueda) {
            case "AREA":

                let area = $("#area_jornadas").val();

                if (area === null || area === undefined || area === "") {
                    swal.fire({text: "Seleccione un área"});
                    botonExcel.addClass("d-none");
                } else {
                    data.id = area;
                    RequestPOST("/API/empresas360/jornadas_laborales/area", data).then((response) => {

                        if (response.success) {
                            let jornadaEmpleado = new Object();

                            $.each(response.data, function (index, jornada) {
                                if (jornadaEmpleado[jornada.idUsuario] === undefined) {
                                    jornadaEmpleado[jornada.idUsuario] = [];
                                    jornadaEmpleado[jornada.idUsuario].push(jornada);
                                } else {
                                    jornadaEmpleado[jornada.idUsuario].push(jornada);
                                }

                            });

                            const keys = Object.keys(jornadaEmpleado);
                            for (let x = 0; x < keys.length; x++) {
                                despliegaInformacionJornadas(fecha_inicio, fecha_final, jornadaEmpleado[keys[x]]);
                            }

                            listenerActividadesReporte();
                        } else {
                            swal.fire({text: "No hay empleados en esta área"});
                            botonExcel.addClass("d-none");
                        }

                    });
                }

                break;

            case "SUCURSAL":

                let sucursal = $("#sucursal_jornadas").val();

                if (sucursal === null || sucursal === undefined || sucursal === "") {
                    swal.fire({text: "Seleccione una sucursal"});
                    botonExcel.addClass("d-none");
                } else {
                    data.id = sucursal;
                    RequestPOST("/API/empresas360/jornadas_laborales/sucursal", data).then((response) => {

                        if (response.success) {
                            let jornadaEmpleado = new Object();

                            $.each(response.data, function (index, jornada) {
                                if (jornadaEmpleado[jornada.idUsuario] === undefined) {
                                    jornadaEmpleado[jornada.idUsuario] = [];
                                    jornadaEmpleado[jornada.idUsuario].push(jornada);
                                } else {
                                    jornadaEmpleado[jornada.idUsuario].push(jornada);
                                }

                            });

                            const keys = Object.keys(jornadaEmpleado);
                            for (let x = 0; x < keys.length; x++) {
                                despliegaInformacionJornadas(fecha_inicio, fecha_final, jornadaEmpleado[keys[x]]);
                            }

                            listenerActividadesReporte();
                        } else {
                            swal.fire({text: "No hay empleados en esta sucursal"});
                            botonExcel.addClass("d-none");
                        }

                    });
                }

                break;

            case "EMPLEADO":

                let empleado = $("#empleado_jornadas").val();

                if (empleado === null || empleado === undefined || empleado === "") {
                    swal.fire({text: "Seleccione un empleado"});
                    botonExcel.addClass("d-none");
                } else {
                    data.id = empleado;

                    RequestPOST("/API/empresas360/jornadas_laborales", data).then((response) => {
                        despliegaInformacionJornadas(fecha_inicio, fecha_final, response.data);
                        listenerActividadesReporte();
                    });

                }

                break;

            case "TODOS":

                data.id = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
                RequestPOST("/API/empresas360/jornadas_laborales/empresa", data).then((response) => {

                    if (response.success) {
                        let jornadaEmpleado = new Object();

                        $.each(response.data, function (index, jornada) {
                            if (jornadaEmpleado[jornada.idUsuario] === undefined) {
                                jornadaEmpleado[jornada.idUsuario] = [];
                                jornadaEmpleado[jornada.idUsuario].push(jornada);
                            } else {
                                jornadaEmpleado[jornada.idUsuario].push(jornada);
                            }

                        });

                        const keys = Object.keys(jornadaEmpleado);
                        for (let x = 0; x < keys.length; x++) {
                            despliegaInformacionJornadas(fecha_inicio, fecha_final, jornadaEmpleado[keys[x]]);
                        }

                        listenerActividadesReporte();
                    } else {
                        swal.fire({text: "No hay empleados en esta empresa"});
                        botonExcel.addClass("d-none");
                    }

                });

                break;
        }

    }
};

const despliegaInformacionJornadas = (fecha_inicio, fecha_final, jornadas) => {
    const nombresDiasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    const resultInfo = $("#tablas_resultados");

    let emple = infoEmpleado(jornadas[0].idUsuario);

    if (emple !== null && emple !== undefined) {
        let informacionEmpleado = '';

        informacionEmpleado += '<form class="mb-3">';

        informacionEmpleado += '    <div class="row justify-content-center p-4">';
        informacionEmpleado += '        <div class="col-2 p-0 text-center">';
        informacionEmpleado += '            <img class="card-img-left rounded-circle" width="70" height="70" src="' + emple.img + '" alt="Card image cap">';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-6">';
        informacionEmpleado += '            <h5 class="card-title p-0 m-0" style="font-size: 200%;color: #6F6F6D;">' + emple.nombre + ' ' + emple.apellido_paterno + ' ' + emple.apellido_materno + '</h5>';
        informacionEmpleado += '            <h5 class="h4 p-0" style="color: #6F6F6D;">' + emple.area + '</h5>';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-3">';
        informacionEmpleado += '            <div class="row justify-content-center">';
        informacionEmpleado += '                <div class="col-3 p-0">';
        informacionEmpleado += '                    <button type="button" onclick="inicia_llamada_empleado_en_jornada(' + emple.id360 + ')" class="btn rounded-circle rounded-lg" style="background: #53AC30"><i class="text-white fas fa-phone-square-alt fa-2x"></i></button>';
        informacionEmpleado += '                    <p class="card-text" style="font-size:80%;color: #6F6F6D">Llamada</p>';
        informacionEmpleado += '                </div>';
        informacionEmpleado += '                <div class="col-3 p-0">';
        informacionEmpleado += '                    <button type="button" onclick="enviar_mensaje_empleado_en_jornada(' + emple.id360 + ')" class="btn rounded-circle rounded-lg" style="background: #E13E1F"><i class="text-white far fa-comment-dots fa-2x"></i></button>';
        informacionEmpleado += '                    <p class="card-text" style="font-size:80%;color: #6F6F6D">Chat</p>';
        informacionEmpleado += '                </div>';
        informacionEmpleado += '                <div class="col-3 p-0">';
        informacionEmpleado += '                    <button type="button" onclick="inicia_llamada_empleado_en_jornada(' + emple.id360 + ')" class="btn rounded-circle rounded-lg" style="background: #2C95A9"><i class="text-white fas fa-video fa-2x"></i></button>';
        informacionEmpleado += '                    <p class="card-text" style="font-size:80%;color: #6F6F6D">Videollamada</p>';
        informacionEmpleado += '                </div>';
        informacionEmpleado += '            </div>';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '    </div>';
        informacionEmpleado += '    <div class="row class="mb-2">';
        informacionEmpleado += '        <div class="col-md-1 form-group"></div>';
        informacionEmpleado += '        <div class="col-md-3 form-group">';
        informacionEmpleado += '            <label class="mb-0" style="color: #6F6F6D; font-weight: bold;">Empleado</label>';
        informacionEmpleado += '            <input style="color: #6F6F6D;" class="form-control-plaintext p-0"  type="text" disabled value="' + emple.nombre + ' ' + emple.apellido_paterno + ' ' + emple.apellido_materno + '" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-2 form-group">';
        informacionEmpleado += '            <label class="mb-0" style="color: #6F6F6D; font-weight: bold;">Empresa</label>';
        informacionEmpleado += '            <input style="color: #6F6F6D;" class="form-control-plaintext p-0" type="text" disabled value="' + emple.empresa + '" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-2 form-group">';
        informacionEmpleado += '            <label class="mb-0" style="color: #6F6F6D; font-weight: bold;">Sucursal</label>';
        informacionEmpleado += '            <input style="color: #6F6F6D;" class="form-control-plaintext p-0"  type="text" disabled value="' + emple.sucursal + '" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-3 form-group">';
        informacionEmpleado += '            <label class="mb-0" style="color: #6F6F6D; font-weight: bold;">Área</label>';
        informacionEmpleado += '            <input style="color: #6F6F6D;" class="form-control-plaintext p-0"  type="text" disabled value="' + emple.area + '" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-1 form-group"></div>';
        informacionEmpleado += '    </div>';
        informacionEmpleado += '    <div class="row">';
        informacionEmpleado += '        <div class="col-md-1 form-group"></div>';
        informacionEmpleado += '        <div class="col-md-3 form-group">';
        informacionEmpleado += '            <label class="mb-0" style="color: #6F6F6D; font-weight: bold;">Puesto</label>';
        informacionEmpleado += '            <input style="color: #6F6F6D;" class="form-control-plaintext p-0"  type="text" disabled value="' + emple.puesto + '" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-2 form-group">';
        informacionEmpleado += '            <label class="mb-0" style="color: #6F6F6D; font-weight: bold;">Núm. Empleado</label>';
        informacionEmpleado += '            <input style="color: #6F6F6D;" class="form-control-plaintext p-0"  type="text" disabled value="' + emple.num_empleado + '" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-2 form-group">';
        informacionEmpleado += '            <label class="mb-0" style="color: #6F6F6D; font-weight: bold;">Jornada</label>';
        informacionEmpleado += '            <input style="color: #6F6F6D;" class="form-control-plaintext p-0"  type="text" disabled value="' + emple.horario_entrada + ' - ' + emple.horario_salida + '" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-3 form-group">';
        informacionEmpleado += '            <button type="button" onclick="verReporteDetallado(' + emple.id360 + ')" class="btn rounded-pill" style="background: #E13E1F;color:white">Ver reporte detallado</button>';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-1 form-group"></div>';
        informacionEmpleado += '    </div>';
        informacionEmpleado += '    <div class="row">';
        informacionEmpleado += '        <div class="col-md-1 form-group"></div>';
        informacionEmpleado += '        <div class="col-md-3 form-group">';
        informacionEmpleado += '            <label class="mb-0" style="color: #6F6F6D; font-weight: bold;">Días en tiempo</label>';
        informacionEmpleado += '            <input id="contadorDiasEnTiempo_' + emple.id360 + '" style="color: #6F6F6D;" class="form-control-plaintext p-0"  type="text" disabled value="" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-2 form-group">';
        informacionEmpleado += '            <label class="mb-0" style="color: #6F6F6D; font-weight: bold;">Días con retardo</label>';
        informacionEmpleado += '            <input id="contadorDiasEnRetardo_' + emple.id360 + '" style="color: #6F6F6D;" class="form-control-plaintext p-0"  type="text" disabled value="" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-2 form-group">';
        informacionEmpleado += '            <label class="mb-0" style="color: #6F6F6D; font-weight: bold;">Días tarde</label>';
        informacionEmpleado += '            <input id="contadorDiasTarde_' + emple.id360 + '" style="color: #6F6F6D;" class="form-control-plaintext p-0"  type="text" disabled value="" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-3 form-group">';
        informacionEmpleado += '            <label class="mb-0" style="color: #6F6F6D; font-weight: bold;">Días sin jornada</label>';
        informacionEmpleado += '            <input id="contadorDiasSinJornada_' + emple.id360 + '" style="color: #6F6F6D;" class="form-control-plaintext p-0"  type="text" disabled value="" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-1 form-group"></div>';
        informacionEmpleado += '    </div>';
        informacionEmpleado += '</form>';

        let tabla = '<table class="table table-hover mb-3">';
        tabla += '      <thead class="thead-dark"">';
        tabla += '          <tr>';
        tabla += '              <th>Día</th>';
        tabla += '              <th>Fecha</th>';
        tabla += '              <th>Hora entrada</th>';
        tabla += '              <th>Hora entrada jornada</th>';
        tabla += '              <th>Hora última desconexión</th>';
        tabla += '              <th>Hora salida</th>';
        tabla += '              <th>Hora salida jornada</th>';
        tabla += '              <th>Cantidad de Desconexiones</th>';
        tabla += '          </tr>';
        tabla += '      </thead>';

        const excel = $("#resultados-exportar-excel");
        let tablaExcel = '<table data-nombre-empleado="' + emple.nombre + ' ' + emple.apellido_paterno + ' ' + emple.apellido_materno + '" id="' + emple.nombre + ' ' + emple.apellido_paterno + ' ' + emple.apellido_materno + '" class="hojaExcelJornada">';
        tablaExcel += cabeceraReporteExcel(emple);


        let tbody = '<tbody>';
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

        let c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0, c6 = 0, c7 = 0, c8 = 0, sumaTotal;

        while (f1.getTime() <= f2.getTime()) {

            let fechaRecorre = formatDateDefault(f1);
            let banderaAgregado = false;

            if (jornadas !== null && jornadas !== undefined) {
                let cantidadJornadas = jornadas.length;
                for (let x = 0; x < cantidadJornadas; x++)
                    if (jornadas[x].date_created === fechaRecorre) {

                        let jornada = jornadas[x];
                        let ff = new Date(jornada.date_created);

                        let ultimaDesconexion = jornada.time_updated !== undefined && jornada.time_updated !== null ? jornada.time_updated : '';
                        let salida = jornada.time_finished !== undefined && jornada.time_finished !== null ? jornada.time_finished : '';

                        let partesHoraEntro = jornada.time_created.split(":");
                        let horaEntro = moment();
                        horaEntro.set("hour", partesHoraEntro[0]);
                        horaEntro.set("minute", partesHoraEntro[1]);
                        horaEntro.set("second", partesHoraEntro[2]);

                        let partesHoraTenia = emple.horario_entrada.split(":");
                        let horaTenia = moment();
                        horaTenia.set("hour", partesHoraTenia[0]);
                        horaTenia.set("minute", partesHoraTenia[1]);
                        horaTenia.set("second", partesHoraTenia[2]);

                        let tipoEntrada = 'success';

                        let minutosDeDiferencia = horaTenia.diff(horaEntro, 'minutes');

                        c1++;
                        if (minutosDeDiferencia < -5) {
                            tipoEntrada = 'warning';
                            c2++;
                            c1--;
                        }
                        if (minutosDeDiferencia < -20) {
                            tipoEntrada = 'danger';
                            c3++;
                            c2--;
                        }

                        let tipoSalida = 'light';
                        c7++;

                        if (jornada.time_finished !== undefined && jornada.time_finished !== null) {

                            tipoSalida = 'success';
                            c7--;

                            let partesHoraSalio = jornada.time_finished.split(":");
                            let horaSalio = moment();
                            horaSalio.set("hour", partesHoraSalio[0]);
                            horaSalio.set("minute", partesHoraSalio[1]);
                            horaSalio.set("second", partesHoraSalio[2]);

                            let partesHoraTeniaSalir = emple.horario_salida.split(":");
                            let horaTeniaSalir = moment();
                            horaTeniaSalir.set("hour", partesHoraTeniaSalir[0]);
                            horaTeniaSalir.set("minute", partesHoraTeniaSalir[1]);
                            horaTeniaSalir.set("second", partesHoraTeniaSalir[2]);

                            let minutosDeDiferenciaSalida = horaTeniaSalir.diff(horaSalio, 'minutes');
                            console.log("minutos de diferencia de salida");
                            console.log(minutosDeDiferenciaSalida);

                            c4++;
                            if (minutosDeDiferenciaSalida > -5) {
                                tipoSalida = 'warning';
                                c5++;
                                c4--;
                            }
                            if (minutosDeDiferenciaSalida > -20) {
                                tipoSalida = 'danger';
                                c6++;
                                c5--;
                            }

                        }

                        let fechaCreacion = moment(jornada.date_created);
                        tbody += '<tr class="control" style="cursor: pointer;">';
                        tbody += '  <td>' + nombresDiasSemana[ff.getDay() + 1] + '</td>';
                        tbody += '  <td>' + fechaCreacion.format("DD-MMM-YYYY") + '</td>';
                        tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-' + tipoEntrada + '">' + emple.horario_entrada + '</span></td>';
                        tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-' + tipoEntrada + '">' + jornada.time_created + '</span></td>';
                        tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-light">' + ultimaDesconexion + '</span></td>';
                        tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-' + tipoSalida + '">' + emple.horario_salida + '</span></td>';
                        tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-' + tipoSalida + '">' + salida + '</span></td>';
                        tbody += '  <td>' + jornada.contadorDesconexion + '</td>';
                        tbody += '</tr>';

                        tbodyExcel += '<tr>';
                        tbodyExcel += '  <td>' + nombresDiasSemana[ff.getDay() + 1] + '</td>';
                        tbodyExcel += '  <td>' + fechaCreacion.format("DD-MMM-YYYY") + '</td>';
                        tbodyExcel += '  <td>' + emple.horario_entrada + '</td>';
                        tbodyExcel += '  <td>' + jornada.time_created + '</td>';
                        tbodyExcel += '  <td>' + ultimaDesconexion + '</td>';
                        tbodyExcel += '  <td>' + emple.horario_salida + '</td>';
                        tbodyExcel += '  <td>' + salida + '</td>';
                        tbodyExcel += '  <td>' + jornada.contadorDesconexion + '</td>';
                        tbodyExcel += '  <td>' + jornada.reporte + '</td>';
                        tbodyExcel += '</tr>';

                        tbody += '<tr class="oculta" style="display: none;">';
                        tbody += '  <td style="background-color: lightgray; padding: 15px !important;" class="text-center p-2" colspan="8">' + jornada.reporte + '</td>';
                        tbody += '</tr>';

                        banderaAgregado = true;
                        break;

                    }
            }

            if (!banderaAgregado) {

                let fechaMoment = moment(fechaRecorre);

                tbody += '<tr>';
                tbody += '  <td>' + nombresDiasSemana[f1.getDay()] + '</td>';
                tbody += '  <td>' + fechaMoment.format("DD-MMM-YYYY") + '</td>';
                tbody += '  <td>' + emple.horario_entrada + '</td>';
                tbody += '  <td>-- : -- : --</td>';
                tbody += '  <td>-- : -- : --</td>';
                tbody += '  <td>' + emple.horario_salida + '</td>';
                tbody += '  <td>-- : -- : --</td>';
                tbody += '  <td>-- : -- : --</td>';
                tbody += '</tr>';

                tbodyExcel += '<tr>';
                tbodyExcel += '  <td>' + nombresDiasSemana[f1.getDay()] + '</td>';
                tbodyExcel += '  <td>' + fechaMoment.format("DD-MMM-YYYY") + '</td>';
                tbodyExcel += '  <td>' + emple.horario_entrada + '</td>';
                tbodyExcel += '  <td>-- : -- : --</td>';
                tbodyExcel += '  <td>-- : -- : --</td>';
                tbodyExcel += '  <td>' + emple.horario_salida + '</td>';
                tbodyExcel += '  <td>-- : -- : --</td>';
                tbodyExcel += '  <td>-- : -- : --</td>';
                tbodyExcel += '  <td>N/A</td>';
                tbodyExcel += '</tr>';

                c8++;

            }

            f1.setDate(f1.getDate() + 1);
        }

        tbody += '</tbody>';
        tabla += tbody;
        tabla += '</table>';

        let card = '';
        card += '<div class="card">';
        card += '    <div style="background-color: white !important; text-align: left; border: none;" class="card-header" id="heading' + emple.id360 + '">';
        card += '        <h2 style="font-size: 1.13rem; text-transform: uppercase; cursor-pointer; padding: 10px; color: #343a40;" class="mb-0" data-toggle="collapse" data-target="#collapse' + emple.id360 + '" aria-expanded="true" aria-controls="collapse' + emple.id360 + '>';
        card += '           <button class="btn btn-link" type="button"><i class="fas fa-chevron-down mr-3"></i>' + emple.nombre + ' ' + emple.apellido_paterno + ' ' + emple.apellido_materno + ' / ' + emple.sucursal + ' / ' + emple.area + '</button>';
        card += '       </h2>';
        card += '   </div>';
        card += '   <div id="collapse' + emple.id360 + '" class="collapse" aria-labelledby="heading' + emple.id360 + '" data-parent="#tablas_resultados">';
        card += '       <div style="background-color: white !important;border-radius: 25px;border-width: 2px;" class="card-body">';
        card += '           ' + informacionEmpleado;
        card += '           ' + tabla;
        card += '       </div>';
        card += '   </div>';
        card += '</div>';

        resultInfo.append(card);

        tablaExcel += tbodyExcel;
        tablaExcel += '</table>';
        excel.append(tablaExcel);

        sumaTotal = c1 + c2 + c3 + c8;

        $("#contadorDiasEnTiempo_" + emple.id360).val(c1 + " - " + ((c1 / sumaTotal) * 100).toFixed(2) + "%");
        $("#contadorDiasEnRetardo_" + emple.id360).val(c2 + " - " + ((c2 / sumaTotal) * 100).toFixed(2) + "%");
        $("#contadorDiasTarde_" + emple.id360).val(c3 + " - " + ((c3 / sumaTotal) * 100).toFixed(2) + "%");
        $("#contadorDiasSinJornada_" + emple.id360).val(c8 + " - " + ((c8 / sumaTotal) * 100).toFixed(2) + "%");
        $("#diasEnTiempoExcel_" + emple.id360).text(c1 + " - " + ((c1 / sumaTotal) * 100).toFixed(2) + "%");
        $("#diasConRetardoExcel_" + emple.id360).text(c2 + " - " + ((c2 / sumaTotal) * 100).toFixed(2) + "%");
        $("#diasTardeExcel_" + emple.id360).text(c3 + " - " + ((c3 / sumaTotal) * 100).toFixed(2) + "%");
        $("#diasSinJornadaExcel_" + emple.id360).text(c8 + " - " + ((c8 / sumaTotal) * 100).toFixed(2) + "%");
    }

    $("#botonDescargaReporteJornada2").removeClass("d-none");

    $("#resultado-busqueda-jornadas2").removeClass("d-none");
};

const listenerActividadesReporte = () => {
    $("tr.control").click(function () {
        let nextTr = $(this).next();
        if (nextTr.hasClass("oculta")) {
            $("tr.visible").each(function (index, tr) {
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
};

$("#botonDescargaReporteJornada").click(function () {

    var wb = XLSX.utils.book_new();
    let ws;
    let nombre_hoja;

    $(".hojaExcelJornada").each(function () {

        nombre_hoja = $(this).data("nombre-empleado");
        wb.SheetNames.push(nombre_hoja);

        ws = XLSX.utils.table_to_book(document.getElementById($(this).attr("id")));

        wb.Sheets[nombre_hoja] = ws.Sheets["Sheet1"];

    });

    return XLSX.writeFile(wb, 'Jornadas Laborales.xlsx');
});

const cabeceraReporteExcel = (empleado) => {
    let cabecera = '';
    cabecera += '<tr><td colspan="9"><h1 style="text-align: center;">Reporte de jornadas laborales</h1></td></tr><tr></tr>';
    cabecera += '<tr><td colspan="2">Fecha de exportación</td><td>' + moment().format("DD-MMM-YYYY") + '</td></tr>';
    cabecera += '<tr><td colspan="2">Periodo del reporte</td><td>' + moment($("#fecha_inicio_reporte2").val()).format("DD-MMM-YYYY") + '</td><td>' + moment($("#fecha_fin_reporte2").val()).format("DD-MMM-YYYY") + '</td></tr><tr></tr>';
    cabecera += '<tr><td colspan="2">Empleado:</td><td colspan="3">' + empleado.nombre + ' ' + empleado.apellido_paterno + ' ' + empleado.apellido_materno + '</td></tr>';
    cabecera += '<tr><td colspan="2">Empresa</td><td colspan="3">' + empleado.empresa + '</td></tr>';
    cabecera += '<tr><td colspan="2">Sucursal</td><td colspan="3">' + empleado.sucursal + '</td></tr>';
    cabecera += '<tr><td colspan="2">Área</td><td colspan="3">' + empleado.area + '</td></tr>';
    cabecera += '<tr><td colspan="2">Puesto</td><td colspan="3">' + empleado.puesto + '</td></tr>';
    cabecera += '<tr><td colspan="2">Número de empleado</td><td>' + empleado.num_empleado + '</td></tr>';
    cabecera += '<tr><td colspan="2">Jornada</td><td colspan="2">Entrada: <span>' + empleado.horario_entrada + '</span></td><td colspan="2">Salida: <span>' + empleado.horario_salida + '</span></td></tr>';
    cabecera += '<tr> <td>Días en tiempo</td> <td id="diasEnTiempoExcel_' + empleado.id360 + '"></td> <td>Días con retardo</td> <td id="diasConRetardoExcel_' + empleado.id360 + '"></td> <td>Días tarde</td> <td id="diasTardeExcel_' + empleado.id360 + '"></td> <td>Días sin jornada</td> <td id="diasSinJornadaExcel_' + empleado.id360 + '"></td> </tr>';
    cabecera += '<tr></tr><tr></tr>';
    cabecera += '<tr><th>Día</th><th>Fecha</th><th>Hora Entrada</th><th>Hora entrada jornada</th><th>Hora última desconexión</th><th>Hora Salida</th><th>Hora salida jornada</th><th>Cantidad de Desconexiones</th><th>Actividad</th></tr>';
    return cabecera;
};

const infoEmpleado = (id_empleado) => {
    let empleado, generales;
    const cantidadEmpleados = empleados.length;
    const cantidadEmpleadosEmpresa = empleadosEmpresa.length;
    for (let x = 0; x < cantidadEmpleados; x++) {
        if (empleados[x].id360 === id_empleado) {
            empleado = empleados[x];
            for (let x = 0; x < cantidadEmpleadosEmpresa; x++) {
                if (empleadosEmpresa[x].id360 === id_empleado) {
                    generales = empleadosEmpresa[x];
                    empleado.area = generales.area;
                    empleado.sucursal = generales.sucursal;
                    empleado.empresa = generales.empresa;
                    if (generales.time_created !== undefined && generales.time_created !== null) {
                        empleado.hora_entrada = generales.time_created;
                    }
                    if (generales.time_finished !== undefined && generales.time_finished !== null) {
                        empleado.hora_salida = generales.time_finished;
                    }
                    if (generales.time_updated !== undefined && generales.time_updated !== null) {
                        empleado.hora_desconexion = generales.time_updated;
                    }
                    if (generales.desconexiones !== undefined && generales.desconexiones !== null) {
                        empleado.desconexiones = generales.desconexiones;
                    }
                    break;
                }
            }
            break;
        }
    }
    return empleado;
};