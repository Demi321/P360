/* 
 /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(function () {
    console.log("chars loaded");
    activar_listener_socket();

});
//google.charts.setOnLoadCallback(grafica_pacientes_diarios);
//google.charts.setOnLoadCallback(grafica_contrareferencias);
//google.charts.setOnLoadCallback(grafica_pacientes_ambulancia);
//google.charts.setOnLoadCallback(grafica_hospitaldeorigen);


function activar_listener_socket() {
    console.log("listener listo");
    WebSocketGeneral.onmessage = function (message) {

        var mensaje = JSON.parse(message.data);
        //console.log(mensaje);
        try {
            if (mensaje.inicializacionSG) {
                idSocketOperador = mensaje.idSocket;
                var ms = {
                    "backup_pacientes_diarios": true,
                    "backup_contrareferencias": true,
                    "backup_pacientes_ambulancia": true,
                    "backup_hospitaldeorigen": true,
                    "backup_estadisticas_graficas": true
                };
                EnviarMensajePorSocket(ms);
            }
            if (mensaje.pacientes_diarios) {
                console.log("pacientes_diarios");
                console.log(mensaje);
                let table = new Array();
                let row = new Array();
                row.push("Dia");
                row.push("Número de pacientes");
                table.push(row);
                for (var i = 0; i < mensaje.data.length; i++) {
                    row = new Array();
                    row.push(mensaje.data[i].fecha);
                    row.push(parseInt(mensaje.data[i].pacientes_ingresados));
                    table.push(row);
                }
                console.log(table);
                grafica_pacientes_diarios(table);
            }
            if (mensaje.contrarreferencia) {
                console.log("contrarreferencia");
                console.log(mensaje);
                let table = new Array();
                let row = new Array();
                row.push("Instituto Hospitalario");
                row.push("Numero de contrarreferencias");
                row.push({role: "style"});
                table.push(row);
                for (var i = 0; i < mensaje.data.length; i++) {
                    row = new Array();
                    row.push(mensaje.data[i].nombre_institucion);
                    row.push(parseInt(mensaje.data[i].pacientes_contrarreferencia));
                    row.push("#b87333");
                    table.push(row);
                }
                console.log(table);
                grafica_contrareferencias(table);
            }
            if (mensaje.pacientes_ambulancia) {
                console.log("pacientes_ambulancia");
                console.log(mensaje);
                let table = new Array();
                let row = new Array();
                row.push("Institución Hospita");
                row.push("Numero de traslados");
                row.push({role: "style"});
                table.push(row);
                for (var i = 0; i < mensaje.data.length; i++) {
                    row = new Array();
                    row.push(Object.keys(mensaje.data[i])[0]);
                    row.push(parseInt(mensaje.data[i][Object.keys(mensaje.data[i])[0]]));
                    row.push("#b87333");
                    table.push(row);
                }
                console.log(table);
                grafica_pacientes_ambulancia(table);
            }
            if (mensaje.hospitaldeorigen) {
                console.log("hospitaldeorigen");
                console.log(mensaje);
                let table = new Array();
                let row = new Array();
                row.push("Institución Hospitalaria");
                row.push("Numero de traslados");
                table.push(row);
                for (var i = 0; i < mensaje.data.length; i++) {
                    row = new Array();
                    row.push(mensaje.data[i].nombre_institucion);
                    row.push(parseInt(mensaje.data[i].pacientes_enviados));
                    table.push(row);
                }
                console.log(table);
                grafica_hospitaldeorigen(table);
            }
            if (mensaje.estadisticas_graficas) {
                console.log("estadisticas_graficas");
                console.log(mensaje);
                var idJson = Object.keys(mensaje.data);
                for (var i = 0; i < idJson.length; i++) {
                    console.log(idJson[i]);
                    if ($("#" + idJson[i]).length) {
                        $("#" + idJson[i]).html(mensaje.data[idJson[i]]);
                    }
                }
            }
        } catch (e) {
        }
    };
    //  En caso de requerir un backup
    if (WebSocketGeneral.readyState === 1) {
        var ms = {
            "backup_pacientes_diarios": true,
            "backup_contrareferencias": true,
            "backup_pacientes_ambulancia": true,
            "backup_hospitaldeorigen": true,
            "backup_estadisticas_graficas": true
        };
        EnviarMensajePorSocket(ms);
    }
}

var f2 = $("#fila2").height();
var f3 = $("#fila3").height();
function grafica_pacientes_diarios(table) {
    var data = google.visualization.arrayToDataTable(table);

    var options = {
        height: "100%",
        chartArea: {
            left: 80, width: '92%',
            'backgroundColor': {
                'fill': '#2a2f34',
                'opacity': 0.1
            },
        },
        title: '# Ingreso de Pacientes Diario',
        backgroundColor: {
            fill: '#2a2f34',
            fillOpacity: 0.8
        },
        timeline: {
            showRowLabels: true,
            groupByRowLabel: true
        },
        avoidOverlappingGridLines: true,
        legend: 'none',
        lineWidth: 4,
        vAxis: {
            gridlines: {
                count: 4
            },
            textStyle: {
                color: '#FFF'
            }
        },
        hAxis: {
            textStyle: {
                color: '#FFF'
            }
        },
        titleTextStyle: {
            color: '#FFF',
            fontSize: 14,
            bold: true
        }
    };

    var chart = new google.visualization.AreaChart(document.getElementById('grafica_pacientes_diarios'));
    chart.draw(data, options);
}
function grafica_contrareferencias(table) {
    var data = google.visualization.arrayToDataTable(table);
    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
        {calc: "stringify",
            sourceColumn: 1,
            type: "string",
            role: "annotation"},
        2]);

      var options = {
        height: f3,
        chartArea: {
            left: 80, width: '92%',
            'backgroundColor': {
                'fill': '#2a2f34',
                'opacity': 0.1
            }
        },
        title: '# Contrarreferencias por hospital de origen',
        backgroundColor: {
            fill: '#2a2f34',
            fillOpacity: 0.8
        },
        vAxis: {
            gridlines: {
                count: 4
            },
            textStyle: {
                color: '#FFF'
            }
        },
        hAxis: {
            textStyle: {
                color: '#FFF'
            }
        },
        titleTextStyle: {
            color: '#FFF',
            fontSize: 14,
            bold: true
        }
    };
    var chart = new google.visualization.ColumnChart(document.getElementById("grafica_contrareferencias"));
    chart.draw(view, options);
}
function grafica_pacientes_ambulancia(table) {
    var data = google.visualization.arrayToDataTable(table);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
        {calc: "stringify",
            sourceColumn: 1,
            type: "string",
            role: "annotation"},
        2]);

    var options = {
        height: f3,
        chartArea: {
            left: 80, width: '92%',
            'backgroundColor': {
                'fill': '#2a2f34',
                'opacity': 0.1
            }
        },
        title: '# Pacientes por Ambulancia',
        backgroundColor: {
            fill: '#2a2f34',
            fillOpacity: 0.8
        },
        vAxis: {
            gridlines: {
                count: 4
            },
            textStyle: {
                color: '#FFF'
            }
        },
        hAxis: {
            textStyle: {
                color: '#FFF'
            }
        },
        titleTextStyle: {
            color: '#FFF',
            fontSize: 14,
            bold: true
        }
    };

    var chart = new google.visualization.ColumnChart(document.getElementById("grafica_pacientes_ambulancia"));
    chart.draw(view, options);
}
function grafica_hospitaldeorigen(table) {
    var data = google.visualization.arrayToDataTable(table);

    var options = {
        //height: f3,
        //title: 'My Daily Activities',
        pieHole: 0.4,
        height: "100%",
        textStyle: {
            color: '#FFF'
        },
        chartArea: {
            left: 80, width: '92%',
            'backgroundColor': {
                'fill': '#2a2f34',
                'opacity': 0.1
            }
        },
        title: '# Pacientes por Hospital de origen',
        backgroundColor: {
            fill: '#2a2f34',
            fillOpacity: 0.8
        },
        vAxis: {
            gridlines: {
                count: 4
            },
            textStyle: {
                color: '#FFF'
            }
        },
        hAxis: {
            textStyle: {
                color: '#FFF'
            }
        },
        titleTextStyle: {
            color: '#FFF',
            fontSize: 14,
            bold: true
        },
        legend: {textStyle: {
                color: '#FFF'
            },
            pagingTextStyle: {
                color: '#FFF'
            },
            scrollArrows: {
                activeColor: '#e0e0e0',
                inactiveColor: '#616161'
            }
        }

    };

    var chart = new google.visualization.PieChart(document.getElementById('grafica_hospitaldeorigen'));
    chart.draw(data, options);
}

$("#menu_solicitudes").click(function(){
    document.getElementById("stats_solicitudes").scrollIntoView();
});
$("#menu_traslados").click(function(){
    document.getElementById("stats_traslados").scrollIntoView();
});