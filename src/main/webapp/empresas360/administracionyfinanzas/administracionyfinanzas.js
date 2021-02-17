/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var init_administracionyfinanzas = (json) => {

    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;
    $(window).on("load", function () {
        //el id servira vara hacer referencia a la vista donde se colocara el contenido de la vista * todo se generara de forma dinamica
        $(".administracionyfinanzas_" + id).append(id + id_usuario + tipo_usuario + tipo_servicio + tipo_area);
        let listado = new Array();
        let tipos_usuario = tipo_usuario.toString().split(",");
        let tipos_servicio = tipo_servicio.toString().split(",");
        let tipos_area = tipo_area.toString().split(",");
        //todos los tipos deben tener el mismo tamaño ya que cada posicion es una configuracion  diferente 
        for (var i = 0; i < tipos_usuario.length; i++) {
            //Estas son las n configuraciones con las que se esta mandando a crear esta vista
            let usuario = tipos_usuario[i];
            let servicio = tipos_servicio[i];
            let area = tipos_area[i];
            //Nota al ser una vista a nivel corporativo, empresa o sucursa, el area siempre tendria que ser 0

            //revisar la jerarquia que se esta solicitando -- Nota se esta confiando en la validacion del backend para validar que viene una misma jerarquia 
            //Consultar la informacion de la configuracion 
            if (servicio.toString() === "0") {
                //buscamos la informacion en empresa_usuario por ahora un usuario solo puede poseer una empresa por lo que se hara un break por ahora
                listado.push(empresa_usuario);
                break;
            } else if (area.toString() === "0") {
                //buscamos la informacion en sucursales_usuario
                for (var j = 0; j < sucursales_usuario.length; j++) {
                    if (sucursales_usuario[j].id.toString() === servicio.toString()) {
                        listado.push(sucursales_usuario[j]);
                    }
                }
            }

        }
        //una vez generado el listado se inicializara un vue multiselect 
        let institucion = null;
        let vue_listado_institucion = (listado) => {
            console.log(listado);
            institucion = listado[0];
            new Vue({
                el: ".administracionyfinanzas_" + id + " .listado_institucion",
                components: {
                    Multiselect: window.VueMultiselect.default
                },
                data() {
                    return {
                        value: [],
                        options: listado
                    };
                },
                methods: {
                    customLabel(option) {
                        if (option.nombre_edificio) {
                            //es una sucursal
                            return option.nombre_edificio + " - " + option.razon_social;
                        }
                        if (option.empresa) {
                            //es una empresa
                            return option.empresa.toString().toUpperCase() + " - " + option.razon_social;
                        }
                        return option.id + " " + option.razon_social;
                    },
                    onClosed(value) {
                        //console.log(value);
                        console.log(institucion);
//                        vue_listado_institucion(listado);
//                        piechart1(institucion, id,true);
//                        piechart2(institucion, id,true);
//                        piechart3(institucion, id,true);
//                        line_chart_sintomas(institucion, id,true);
//                        chart_barras(institucion, id,true);
//                        chart_aislamiento1(institucion, id,true);
//                        chart_aislamiento2(institucion, id,true);
//                        chart_aislamiento3(institucion, id,true);
//                        chart_aislamiento4(institucion, id,true);
//                        chart_aislamiento5(institucion, id,true);

                    },

                    onTag(value) {
                        //console.log(value);
                    },

                    onRemove(value) {
                        //console.log(value);
                    },

                    onInput(value) {
//                    //llenar los dashboard con la informacion correspondiente
                        console.log(value);
                        institucion = value;
                    },
                    onOpen(value) {
                        this.value = null;
                    }
                }
            });
        };
        vue_listado_institucion(listado);
        piechart1(institucion, id, false);
        piechart2(institucion, id, false);
        piechart3(institucion, id, false);
        line_chart_sintomas(institucion, id, false);
        chart_barras(institucion, id, false);
        chart_aislamiento1(institucion, id, false);
        chart_aislamiento2(institucion, id, false);
        chart_aislamiento3(institucion, id, false);
        chart_aislamiento4(institucion, id, false);
        chart_aislamiento5(institucion, id, false);

        // Listener para renderizar las graficas cuando se vuelven visibles (No esta operando!!!)
        if ($(".modulo_menu_" + id).length) {
            console.log("Existe");
            console.log($(".modulo_menu_" + id));
            $(".modulo_menu_" + id).click(() => {
                console.log(json);
                piechart1(institucion, id, false);
                piechart2(institucion, id, false);
                piechart3(institucion, id, false);
                line_chart_sintomas(institucion, id, false);
                chart_barras(institucion, id, false);
                chart_aislamiento1(institucion, id, false);
                chart_aislamiento2(institucion, id, false);
                chart_aislamiento3(institucion, id, false);
                chart_aislamiento4(institucion, id, false);
                chart_aislamiento5(institucion, id, false);
            });
        }
        // Listener para renderizar las graficas cuando se vuelven visibles 
        var observer_estadistica_global = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === "class") {
                    var attributeValue = $(mutation.target).prop(mutation.attributeName);
                    console.log("Class attribute changed to:", attributeValue);
                    if (!attributeValue.includes("d-none")) {
                        console.log(json);
                        piechart1(institucion, id, false);
                        piechart2(institucion, id, false);
                        piechart3(institucion, id, false);
                        line_chart_sintomas(institucion, id, false);
                        chart_barras(institucion, id, false);
                        chart_aislamiento1(institucion, id, false);
                        chart_aislamiento2(institucion, id, false);
                        chart_aislamiento3(institucion, id, false);
                        chart_aislamiento4(institucion, id, false);
                        chart_aislamiento5(institucion, id, false);
                    }
                }
            });
        });

        observer_estadistica_global.observe($("#modulo_section_" + id)[0], {
            attributes: true
        });

        // Listener para renderizar las graficas cuando se ven afectadas por el toggle del aside
        $("#toggle div").click(() => {
            //validamos que las graficas estan visibles
            if (!$("#modulo_section_" + id).hasClass("d-none")) {
                //Esperamos a que termine la animacion del recorrido del sidebar
                setTimeout(() => {
                    console.log(json);
                    piechart1(institucion, id, false);
                    piechart2(institucion, id, false);
                    piechart3(institucion, id, false);
                    line_chart_sintomas(institucion, id, false);
                    chart_barras(institucion, id, false);
                    chart_aislamiento1(institucion, id, false);
                    chart_aislamiento2(institucion, id, false);
                    chart_aislamiento3(institucion, id, false);
                    chart_aislamiento4(institucion, id, false);
                    chart_aislamiento5(institucion, id, false);
                }, 500);

            }
        });

    });

};


google.charts.load('current', {'packages': ['corechart']});
//google.charts.setOnLoadCallback(piechart1);

function piechart1(institucion, id, f) {
    console.log(institucion);
    console.log(id);

    var data = google.visualization.arrayToDataTable([
        ['Datos', 'Rating'],
        ['Dato1', 9],
        ['Dato2', 79],
        ['Dato3', 71],
        ['Dato4', 68],
        ['Dato5', 56],
        ['Dato6', 45]
    ]);

    var options = {
        pieSliceBorderColor: "none",
        title: 'Grafica de datos 1',
        backgroundColor: "#e5e5e6",
        legendTextStyle: {color: '#495057'},
        titleTextStyle: {color: '#495057'},
        hAxis: {
            color: '#495057',
        },
        vAxis: {
            color: '#495057',
            titleTextStyle: {color: '#495057'}
        }
    };

    var chart = new google.visualization.PieChart($(".administracionyfinanzas_" + id + " #piechart1")[0]);
    chart.draw(data, options);
    if (!f) {
        $(window).resize(function () {
            piechart1(institucion, id, true);
        });
    }

}
function piechart2(institucion, id, f) {
    console.log(institucion);
    console.log(id);

    var data = google.visualization.arrayToDataTable([
        ['Datos', 'Rating'],
        ['Dato1', 9],
        ['Dato2', 79],
        ['Dato3', 71],
        ['Dato4', 68],
        ['Dato5', 56],
        ['Dato6', 45]
    ]);

    var options = {
        pieSliceBorderColor: "none",
        title: 'Grafica de datos 1',
        backgroundColor: "#e5e5e6",
        legendTextStyle: {color: '#495057'},
        titleTextStyle: {color: '#495057'},
        hAxis: {
            color: '#495057',
        },
        vAxis: {
            color: '#495057',
            titleTextStyle: {color: '#495057'}
        }
    };

    var chart = new google.visualization.PieChart($(".administracionyfinanzas_" + id + " #piechart2")[0]);
    chart.draw(data, options);
    if (!f) {
        $(window).resize(function () {
            piechart2(institucion, id, true);
        });
    }
}
function piechart3(institucion, id, f) {
    console.log(institucion);
    console.log(id);

    var data = google.visualization.arrayToDataTable([
        ['Datos', 'Rating'],
        ['Dato1', 9],
        ['Dato2', 79],
        ['Dato3', 71],
        ['Dato4', 68],
        ['Dato5', 56],
        ['Dato6', 45]
    ]);

    var options = {
        pieSliceBorderColor: "none",
        title: 'Grafica de datos 1',
        backgroundColor: "#e5e5e6",
        legendTextStyle: {color: '#495057'},
        titleTextStyle: {color: '#495057'},
        hAxis: {
            color: '#495057',
        },
        vAxis: {
            color: '#495057',
            titleTextStyle: {color: '#495057'}
        }
    };

    var chart = new google.visualization.PieChart($(".administracionyfinanzas_" + id + " #piechart3")[0]);
    chart.draw(data, options);

    if (!f) {
        $(window).resize(function () {
            piechart3(institucion, id, true);
        });
    }


}
//google.load("visualization", "1", {packages: ["corechart"]});
//google.setOnLoadCallback(drawChart1);
function drawChart1(institucion, id, f) {
    console.log(institucion);
    console.log(id);
    var data = google.visualization.arrayToDataTable([
        ['Year', 'Sales', 'Expenses'],
        ['2004', 1000, 400],
        ['2005', 1170, 460],
        ['2006', 660, 1120],
        ['2007', 1030, 540]
    ]);

    var options = {
        pieSliceBorderColor: "none",
        title: 'Grafica de datos 2',
        backgroundColor: "#e5e5e6",
        legendTextStyle: {color: '#495057'},
        titleTextStyle: {color: '#495057'},
        hAxis: {
            title: 'Year',
            titleTextStyle: {color: '#495057'},
            color: '#495057',
        },
        vAxis: {
            color: '#495057',
            titleTextStyle: {color: '#495057'}
        }
    };

    var chart = new google.visualization.ColumnChart($(".administracionyfinanzas_" + id + " #chart_div1")[0]);
    chart.draw(data, options);
    if (!f) {
        $(window).resize(function () {
            drawChart1(institucion, id, true);
        });
    }


}
//google.load("visualization", "1", {packages: ["corechart"]});
//google.setOnLoadCallback(drawChart2);
function drawChart2(institucion, id, f) {
    console.log(institucion);
    console.log(id);
    var data = google.visualization.arrayToDataTable([
        ['Year', 'Sales', 'Expenses'],
        ['2013', 1000, 400],
        ['2014', 1170, 460],
        ['2015', 660, 1120],
        ['2016', 1030, 540]
    ]);

    var options = {
        pieSliceBorderColor: "none",
        title: 'Grafica de datos 3',
        backgroundColor: "#e5e5e6",
        legendTextStyle: {color: '#495057'},
        titleTextStyle: {color: '#495057'},
        hAxis: {
            title: 'Year',
            titleTextStyle: {color: '#495057'},
            color: '#495057',
        },
        vAxis: {
            minValue: 0,
            color: '#495057',
            titleTextStyle: {color: '#495057'}
        }
    };

    var chart = new google.visualization.AreaChart($(".administracionyfinanzas_" + id + " #chart_div2")[0]);
    chart.draw(data, options);

    if (!f) {
        $(window).resize(function () {
            drawChart2(institucion, id, true);
        });
    }


}

google.charts.load('current', {'packages': ['line']});
//google.charts.setOnLoadCallback(line_chart_sintomas);
function line_chart_sintomas(institucion, id, f) {
    console.log(institucion);
    console.log(id);

    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Day');
    data.addColumn('number', 'Dificultad para respirar');
    data.addColumn('number', 'Fiebre');
    data.addColumn('number', 'Dolor de cabeza');
    data.addColumn('number', 'Tos');

    data.addRows([
        [1, 1, 2, 3, 4],
        [2, 2, 1, 2, 4],
        [3, 3, 4, 1, 3],
        [4, 4, 3, 3, 2],
        [5, 1, 2, 4, 1],
        [6, 2, 1, 3, 4],
        [7, 3, 4, 2, 3],
        [8, 4, 3, 3, 2],
        [9, 1, 2, 4, 1]
    ]);

    var options = {
        chart: {
            title: 'Reporte de Síntomas Pacientes',
            subtitle: 'Total de empleados en el área: 10'
        },
        chartArea: {
            "backgroundColor": "#e5e5e6"
        },
        backgroundColor: "#e5e5e6",
        legendTextStyle: {color: '#495057',
            bold: true},
        titleTextStyle: {color: '#495057'},
        hAxis: {
            title: ' ',
            titleTextStyle: {color: '#495057'},
            color: '#495057',
            gridlines: {
                color: '#6c6868',
                count: 1,
            },
            minValue: 0,
            maxValue: 5
        },
        vAxis: {
            minValue: 0,
            color: '#495057',
            titleTextStyle: {color: '#495057'},
            gridlines: {
                color: '#6c6868',
                count: 1
            }
        },
        height: 350

    };

    var chart = new google.charts.Line($(".administracionyfinanzas_" + id + " #line_chart_sintomas")[0]);

    chart.draw(data, google.charts.Line.convertOptions(options));
    if (!f) {
        $(window).resize(function () {
            line_chart_sintomas(institucion, id, true);
        });
    }

}
google.charts.load('current', {'packages': ['bar']});
//google.charts.setOnLoadCallback(chart_barras);
function chart_barras(institucion, id, f) {
    console.log(institucion);
    console.log(id);
    var data = new google.visualization.arrayToDataTable([
        ['Opening Move', 'Percentage'],
        ["King's pawn (e4)", 44],
        ["Queen's pawn (d4)", 31],
        ["Knight to King 3 (Nf3)", 12],
        ["Queen's bishop pawn (c4)", 10],
        ['Other', 3]
    ]);

    var options = {
        pieSliceBorderColor: "none",
        legend: {position: 'none'},
        bars: 'horizontal', // Required for Material Bar Charts.

        chartArea: {
            "backgroundColor": "#e5e5e6",
            "fill": "#e5e5e6"
        },
        backgroundColor: "#e5e5e6",
        legendTextStyle: {color: '#495057'},
        titleTextStyle: {color: '#495057'},
        hAxis: {
            title: ' ',
            titleTextStyle: {color: '#495057'},
            color: '#495057'
        },
        vAxis: {
            minValue: 0,
            color: '#495057',
            titleTextStyle: {color: '#495057'}
        }
    };

//    var chart = new google.charts.Bar($('chart_barras'));
//    chart.draw(data, options);
    if (!f) {
        $(window).resize(function () {
            chart_barras(institucion, id, true);
        });
    }

}
//google.load("visualization", "1", {packages: ["corechart"]});
//google.setOnLoadCallback(chart_aislamiento1);
function chart_aislamiento1(institucion, id, f) {
    console.log(institucion);
    console.log(id);
    var data = google.visualization.arrayToDataTable([
        ['Content', 'Size'],
        ['Photos', 25],
        ['Free Space', 75]
    ]);

    var options = {

        chartArea: {
            "backgroundColor": "#e5e5e6",
            "fill": "#e5e5e6",
            width: '100%',
            height: '100%'
        },
        backgroundColor: "#e5e5e6",
        pieHole: 0.55,
        pieSliceBorderColor: "none",
        colors: ['#772B54', '#eaeaea'],
        legend: {
            position: "none"
        },
        pieSliceText: "none",
        tooltip: {
            trigger: "none"
        }
    };

    var chart = new google.visualization
            .PieChart($(".administracionyfinanzas_" + id + " #chart_aislamiento1")[0]);

    chart.draw(data, options);
    if (!f) {
        $(window).resize(function () {
            chart_aislamiento1(institucion, id, true);
        });
    }

}
function chart_aislamiento2(institucion, id, f) {
    console.log(institucion);
    console.log(id);
    var data = google.visualization.arrayToDataTable([
        ['Content', 'Size'],
        ['Photos', 30],
        ['Free Space', 70]
    ]);

    var options = {

        chartArea: {
            "backgroundColor": "#e5e5e6",
            "fill": "#e5e5e6",
            width: '100%',
            height: '100%'
        },
        backgroundColor: "#e5e5e6",
        pieHole: 0.55,
        pieSliceBorderColor: "none",
        colors: ['#ffc107', '#eaeaea'],
        legend: {
            position: "none"
        },
        pieSliceText: "none",
        tooltip: {
            trigger: "none"
        }
    };

    var chart = new google.visualization
            .PieChart($(".administracionyfinanzas_" + id + " #chart_aislamiento2")[0]);

    chart.draw(data, options);
    if (!f) {
        $(window).resize(function () {
            chart_aislamiento2(institucion, id, true);
        });
    }

}
function chart_aislamiento3(institucion, id, f) {
    console.log(institucion);
    console.log(id);
    var data = google.visualization.arrayToDataTable([
        ['Content', 'Size'],
        ['Photos', 50],
        ['Free Space', 50]
    ]);

    var options = {

        chartArea: {
            "backgroundColor": "#e5e5e6",
            "fill": "#e5e5e6",
            width: '100%',
            height: '100%'
        },
        backgroundColor: "#e5e5e6",
        pieHole: 0.55,
        pieSliceBorderColor: "none",
        colors: ['#95C819', '#eaeaea'],
        legend: {
            position: "none"
        },
        pieSliceText: "none",
        tooltip: {
            trigger: "none"
        }
    };

    var chart = new google.visualization
            .PieChart($(".administracionyfinanzas_" + id + " #chart_aislamiento3")[0]);

    chart.draw(data, options);
    if (!f) {
        $(window).resize(function () {
            chart_aislamiento3(institucion, id, true);
        });
    }

}
function chart_aislamiento4(institucion, id, f) {
    console.log(institucion);
    console.log(id);
    var data = google.visualization.arrayToDataTable([
        ['Content', 'Size'],
        ['Photos', 20],
        ['Videos', 80]
    ]);

    var options = {

        chartArea: {
            "backgroundColor": "#e5e5e6",
            "fill": "#e5e5e6",
            width: '100%',
            height: '100%'
        },
        backgroundColor: "#e5e5e6",
        pieHole: 0.55,
        pieSliceBorderColor: "none",
        colors: ['#17a2b8', '#eaeaea'],
        legend: {
            position: "none"
        },
        pieSliceText: "none",
        tooltip: {
            trigger: "none"
        }
    };

    var chart = new google.visualization
            .PieChart($(".administracionyfinanzas_" + id + " #chart_aislamiento4")[0]);

    chart.draw(data, options);
    if (!f) {
        $(window).resize(function () {
            chart_aislamiento4(institucion, id, true);
        });
    }

}
function chart_aislamiento5(institucion, id, f) {
    console.log(institucion);
    console.log(id);
    var data = google.visualization.arrayToDataTable([
        ['Content', 'Size'],
        ['Photos', 12],
        ['Free Space', 88]
    ]);

    var options = {

        chartArea: {
            "backgroundColor": "#e5e5e6",
            "fill": "#e5e5e6",
            width: '100%',
            height: '100%'
        },
        backgroundColor: "#e5e5e6",
        pieHole: 0.55,
        pieSliceBorderColor: "none",
        colors: ['#FF6A02', '#eaeaea'],
        legend: {
            position: "none"
        },
        pieSliceText: "none",
        tooltip: {
            trigger: "none"
        }
    };

    var chart = new google.visualization
            .PieChart($(".administracionyfinanzas_" + id + " #chart_aislamiento5")[0]);

    chart.draw(data, options);
    if (!f) {
        $(window).resize(function () {
            chart_aislamiento5(institucion, id, true);
        });
    }

}


//$(window).resize(function () {
//    piechart1(institucion,id);
//    piechart2(institucion,id);
//    piechart3(institucion,id);
//    line_chart_sintomas(institucion,id);
//    chart_barras(institucion,id);
//    chart_aislamiento1(institucion,id);
//    chart_aislamiento2(institucion,id);
//    chart_aislamiento3(institucion,id);
//    chart_aislamiento4(institucion,id);
//    chart_aislamiento5(institucion,id);
//});
