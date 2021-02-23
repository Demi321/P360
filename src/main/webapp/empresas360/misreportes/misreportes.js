/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const init_misreportes = async (json) => {
    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;

    //el id del json de entrada corresponde al id_menu
    //consultar si el tutorial de la vista ya fue consultada 
    RequestPOST("/API/empresas360/consulta_vistatutorial", {
        "id360": perfil_usuario.id360,
        "id_menu": json.id
    }).then((response) => {
        console.log("Estatus de la vista tutorial de mis reportes");
        console.log(response);
    });


//GENERAR REPORTE DE JORNADAS LABORALES
    /*$(document).ready(() => {
     $("#reporteEmpleadoJornadasLaborales").hide()
     //$("#reporteJornadasLaborales").hide()
     //$("#reporteEmpleadoJornadasLaborales").show()
     })*/
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
        const tablaHistorialLaboralEmpleado2 = $("#tablaHistorialLaboralEmpleadoMisReportes")
        const conResultados = $("#empleadoConHistorialLaboralMisReportes");
        const sinResultados = $("#empleadoSinHistorialLaboralMisReportes");
        let jornadas_laborales_rango_empleado_tabla = []
        let rangoInicioEmpleado = $("#fecha_inicio_historial_laboral2MisReportes").val()
        let rangoFinEmpleado = $("#fecha_fin_historial_laboral2MisReportes").val()
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
            $("#horasLaboralesTotalesMisReportes").text("Total: " + totalHorasDiferencia + " hrs " + totalMinutosDiferencia + " min " + totalSegundosDiferencia + " seg")
            $("#puntualHistorialLaboralMisReportes").text(puntualHistorialLaboral)
            $("#retardoHistorialLaboralMisReportes").text(retardoHistorialLaboral)

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
    $('#buscar_reportes_personalesMisReportes').click(async () => {
        await botonObtenerJornadasReporteEmpleado(id360Estatico, jornadas_laborales_empleado)
    });

    const verReporteDetallado = async empleado => {

        //VISTA REPORTE EMPLEADO
        id360Estatico = await empleado
        //SERVIDOR
        /*jornadas_laborales_empleado = await $.ajax({
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
         })*/
        jornadas_laborales_empleado = [perfil_usuario]

        let datosVistaReporteDetallado
        if (jornadas_laborales_empleado[0]) {
            datosVistaReporteDetallado = {
                nombre: jornadas_laborales_empleado[0].nombre + " " + jornadas_laborales_empleado[0].apellido_paterno + " " + jornadas_laborales_empleado[0].apellido_materno,
                direccion: jornadas_laborales_empleado[0].direccion,
                area: jornadas_laborales_empleado[0].area,
                cargo: jornadas_laborales_empleado[0].puesto,
                reporteAislamiento: " - - - -",
                actividadesDesempeñar: " - - - - ",
                num_empleado: jornadas_laborales_empleado[0].num_empleado,
                img: jornadas_laborales_empleado[0].img
            };
            if (location_user !== null) {
                if (location_user.municipio !== null && location_user.estado !== null) {
                    datosVistaReporteDetallado.direccion = location_user.colonia + " " + location_user.municipio + " " + location_user.estado_long
                }
            } else {
                datosVistaReporteDetallado.direccion = " - - - - "
            }
            $("#nombreEmpleadoMisReportes").text("Nombre: " + datosVistaReporteDetallado.nombre);
            $("#direccionEmpleadoMisReportes").text(datosVistaReporteDetallado.direccion);
            $("#areaEmpleadoMisReportes").text(datosVistaReporteDetallado.area);
            $("#cargoEmpleadoMisReportes").text(datosVistaReporteDetallado.cargo);
            $("#reporteAislamientoEmpleadoMisReportes").text(datosVistaReporteDetallado.reporteAislamiento);
            $("#actividadesDesempeñarEmpleadoMisReportes").text(datosVistaReporteDetallado.actividadesDesempeñar);
            $("#num_empleadoMisReportes").text(datosVistaReporteDetallado.num_empleado);
            $("#avatarEmpleadoMisReportes").attr("src", datosVistaReporteDetallado.img);
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

        $("#diaLunesMisReportes").text(lunes.getDate())
        $("#diaViernesMisReportes").text(viernes.getDate())
        $("#stringMesRendimientoSemanalMisReportes").text(today.toLocaleDateString('es-ES', {month: 'long'}))

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
        google.charts.load("current", {'packages': ["corechart"]});
        await google.charts.setOnLoadCallback(drawChart2MisReportes);
        function drawChart2MisReportes() {
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
            var chart = new google.visualization.PieChart(document.getElementById('donutchartMisReportes'));
            chart.draw(data, options);
        }

        /*$(window).resize(function () {
         drawChart();
         });*/
        $("#jornadas_laborales_productividad_porcentajeMisReportes").text(porcentajeProductividadSemanal);
        $("#diasLaboralesSemanaEmpleadoMisReportes").text(diasLaboralesSemanaEmpleado)
        $("#horasLaboralesSemanaEmpleadoMisReportes").text(horasSemanaEmpleado)
        $("#retardosSemanaEmpleadoMisReportes").text(retardos2)
        $("#faltasSemanaEmpleadoMisReportes").text(faltasSemana)
        const colorIconoWarning = "far fa-frown fa-lg"
        const colorIconoSuccess = "far fa-smile fa-lg"
        //$("#colorIconoRetardos").addClass(colorIcono)
        if (diasLaboralesSemanaEmpleado < diasLaboralesSemana) {
            $("#iconoDiasLaboralesEmpleadoMisReportes").removeClass()
            $("#iconoDiasLaboralesEmpleadoMisReportes").addClass(colorIconoWarning)
            $("#iconoDiasLaboralesEmpleadoMisReportes").css("color", "#F8B135")
        } else {
            $("#iconoDiasLaboralesEmpleadoMisReportes").removeClass()
            $("#iconoDiasLaboralesEmpleadoMisReportes").addClass(colorIconoSuccess)
            $("#iconoDiasLaboralesEmpleadoMisReportes").css("color", "#97BA38")
        }
        if (horasSemanaEmpleado < horasLaboralesSemana) {
            $("#iconoHorasLaboralesEmpleadoMisReportes").removeClass()
            $("#iconoHorasLaboralesEmpleadoMisReportes").addClass(colorIconoWarning)
            $("#iconoHorasLaboralesEmpleadoMisReportes").css("color", "#F8B135")
        } else {
            $("#iconoHorasLaboralesEmpleadoMisReportes").removeClass()
            $("#iconoHorasLaboralesEmpleadoMisReportes").addClass(colorIconoSuccess)
            $("#iconoHorasLaboralesEmpleadoMisReportes").css("color", "#97BA38")
        }
        if (faltasSemana > 0) {
            $("#iconoFaltasLaboralesEmpleadoMisReportes").removeClass()
            $("#iconoFaltasLaboralesEmpleadoMisReportes").addClass(colorIconoWarning)
            $("#iconoFaltasLaboralesEmpleadoMisReportes").css("color", "#F8B135")
        } else {
            $("#iconoFaltasLaboralesEmpleadoMisReportes").removeClass()
            $("#iconoFaltasLaboralesEmpleadoMisReportes").addClass(colorIconoSuccess)
            $("#iconoFaltasLaboralesEmpleadoMisReportes").css("color", "#97BA38")
        }
        if (retardos2 > 0) {
            $("#colorIconoRetardosMisReportes").removeClass()
            $("#colorIconoRetardosMisReportes").addClass(colorIconoWarning)
            $("#colorIconoRetardosMisReportes").css("color", "#F8B135")
        } else {
            $("#colorIconoRetardosMisReportes").removeClass()
            $("#colorIconoRetardosMisReportes").addClass(colorIconoSuccess)
            $("#colorIconoRetardosMisReportes").css("color", "#97BA38")
        }

        //RENDIMIENTO MENSUAL
        const rendimientoMensual = async (numeroMes) => {
            //SERVIDOR        
            const inicioMes = moment().set('month', numeroMes).startOf('month').format('YYYY-MM-DD');
            const finMes = moment().set('month', numeroMes).endOf('month').format('YYYY-MM-DD');

            let mesEnRevision = today
            mesEnRevision.setMonth(numeroMes)
            let mesString = mesEnRevision.toLocaleDateString('es-ES', {month: 'long'})
            const primerLetraMes = mesString.charAt(0).toUpperCase()
            const restoCadenaMes = mesString.substring(1, mesString.length)
            mesString = primerLetraMes.concat(restoCadenaMes)
            $("#stringMesRendimientoMensualMisReportes").text(mesString)
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
            google.charts.setOnLoadCallback(drawChartMisReportesPuntualidad);
            function drawChartMisReportesPuntualidad() {
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
                var chart = new google.visualization.PieChart(document.getElementById('donutchart3MisReportes'));
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
            google.charts.setOnLoadCallback(drawChart3MisReportes);
            function drawChart3MisReportes() {
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
                var chart = new google.visualization.PieChart(document.getElementById('donutchart2MisReportes'));
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
            google.charts.load("current", {'packages': ["corechart"]});
            google.charts.setOnLoadCallback(drawChart4MisReportes);
            function drawChart4MisReportes() {
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
                var chart = new google.visualization.PieChart(document.getElementById('donutchart4MisReportes'));
                chart.draw(data, options);
            }
            $('#diasLaboralesMesEmpleadoMisReportes').text(diasLaboraloMesEmpleado)
            $('#diasTotalesLaboralesMesEmpleadoMisReportes').text(diasTotales)
            $('#horasLaboralesMesEmpleadoMisReportes').text(horasMesEmpleado)
            $('#horasTotalesLaboralesMesEmpleadoMisReportes').text(horasTotalesLaboralesMesEmpleado)
            $('#retardosLaboralesMesEmpleadoMisReportes').text(retardos3.length)
            $('#faltasLaboralesMesEmpleadoMisReportes').text(faltasArreglo.length)
            $("#jornadas_laborales_productividad_mensual_porcentajeMisReportes").text(porcentajeProductividadMensual);
            $("#jornadas_laborales_puntualidad_porcentajeMisReportes").text(porcentajePuntualidad);
            $("#jornadas_laborales_cumplimiento_porcentajeMisReportes").text(porcentajeCumplimiento);

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

            $("#calendarioRendimientoMensualMisReportes").datepicker("refresh")

            await $("#calendarioRendimientoMensualMisReportes").datepicker({
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
        await rendimientoMensual(moment().month())

        const conResultados = $("#empleadoConHistorialLaboralMisReportes");
        const sinResultados = $("#empleadoSinHistorialLaboralMisReportes");
        conResultados.addClass("d-none");
        sinResultados.addClass("d-none");
    }

    $("body").on("click", "#menu_section_MisReportes", () => {
        /*if(cargarGraficaRendimiento){
         google.charts.setOnLoadCallback(pintaGraficaRendimiento);
         cargarGraficaRendimiento = false;
         }*/
        console.log("click en misReportes")
        verReporteDetallado(perfil_usuario.id360)
    });
};