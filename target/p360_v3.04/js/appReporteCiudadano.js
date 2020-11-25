/* global Promise, RWebSocket, ALIAS, DEPENDENCIA, ids2, reportes, google, map, geocoder, vue, TOKEN, URL_Incidentes, CP, estado, colonia, municipio */
var prefijo = "sin";
var Reportes = TraeReportes();
var incidente;
var marker;
var j;
var reportesSimilares = "";

Reportes.then(function (arregloReportes) {
  
   
    $.each(arregloReportes, function (i) {
        insertarReportesCiudadanos(arregloReportes[i]);
    });
}).then(function () {
    if (reportes) {
      
        $.each(reportes, function (i) {
          
          
            $('#rep' + reportes[i].id).css("display", "none");
        });
    }
});

if ($('#idRep').val() === "") {
    $('#incidentes').css("visibility", "hidden");
}

function calculaTiempo(horaInicial, horaFinal) {
    var hiH = parseInt(horaInicial.substring(0, 2));
    var hiM = parseInt(horaInicial.substring(3, 5));
    var hiS = parseInt(horaInicial.substring(6, horaInicial.length));
    var hfH = parseInt(horaFinal.substring(0, 2));
    var hfM = parseInt(horaFinal.substring(3, 5));
    var hfS = parseInt(horaFinal.substring(6, horaFinal.length));
    var H = Math.abs(hfH - hiH);
    var M = Math.abs(hfM - hiM);
    var S = Math.abs(hfS - hiS);
    if (H < 10) {
        H = "0" + H;
    }
    if (M < 10) {
        M = "0" + M;
    }
    if (S < 10) {
        S = "0" + S;
    }

    return H + ":" + M + ":" + S;
}

function getFecha() {
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1; //January is 0!

    var yyyy = hoy.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var fecha = yyyy + '-' + mm + '-' + dd;
    return fecha;
}

function getHora() {
    var hoy = new Date();
    var hora = hoy.getHours();
    var min = hoy.getMinutes();
    var seg = hoy.getSeconds();
    hora = hora < 10 ? '0' + hora : hora;
    min = min < 10 ? '0' + min : min;
    seg = seg < 10 ? '0' + seg : seg;
    var h = hora + ":" + min + ":" + seg;
    return h;
}
//Funcion para agregar de manera dinamica los reportes de los ciudadanos
function insertarReportesCiudadanos(Reportes) {

    var HRecepcion = getHora();
    var FRecepcion = getFecha();
    
    if ($('#idRep').val() !== "") {
        $('div.card-body *').prop("disabled", true);
    }
    agregaDatos(Reportes, HRecepcion, FRecepcion);
}

function agregaDatos(Reportes, HR, FR) {

    $('#rep' + Reportes.idReporte).click(function () {
        
        
        $('#incidentes').css("visibility", "visible");
        var FTransmision = getFecha();
        var HTransmision = getHora();
        var repSimilares = ReportesSimilares(Reportes.idReporte, Reportes.lat, Reportes.lng, Reportes.fecha);
        repSimilares.then(function (similares) {
            if (!similares.fail) {
                if (JSON.stringify(similares) !== "{}") {
                    reportesSimilares = similares;
                    var text = '<label id="sim" style="color: #ffffff">Emergencias similares ocurridas alrededor</label>';
                    $('#encabezado').append(text);
                    $.each(similares, function (i) {
                        var val = JSON.stringify(similares[i]);
                        $('#similares').append('<input type="hidden" id="h' + similares[i].idReporte + '">');
                        $('#h' + similares[i].idReporte).val(val);
                        var div = '<div class="form-group col-md-4">';
                        var divf = '</div>';
                        $('#similares').append(div + '<button type="button" id="' + similares[i].idReporte + '" class="btn btn-dark form-control" style="width: 100%; height: 100%">' + similares[i].Incidente + '</button>' + divf);
                    });
                    $.each(similares, function (i) {
                        $('#' + similares[i].idReporte).click(function () {
                            var json = JSON.parse($('#h' + similares[i].idReporte).val());
                            vue.value = [{"id": json.id, "Incidente": json.Incidente}];
                            $('#nivelemergencia').val(json.Prioridad);
                            $('#reporteO').val(json.reporteoperador);
                            $('#serie').val(json.serie);
                            incidente = json;
                            agregarMarcador(json.lat, json.lng);
                        });

                        if (parseInt(Reportes.id) === parseInt(similares[i].id) && Reportes.Incidente.toLowerCase() === similares[i].Incidente.toLowerCase()) {
                            $('#serie').val(similares[i].serie);
                            agregarMarcador(similares[i].lat, similares[i].lng);
                        }


                    });

                    if (Reportes.id !== "" && Reportes.id !== null && Reportes.id !== undefined) {
                        var b = true;
                        incidente = {"id": Reportes.id, "Incidente": Reportes.Incidente, "Prioridad": Reportes.Prioridad};
                        
                        
                        vue.value = [{"id": Reportes.id, "Incidente": Reportes.Incidente}];
                        $('#nivelemergencia').val(Reportes.Prioridad);
                        $.each(reportesSimilares, function (i) {
//                          
//                          
//                            console.log(":::::: ¿Entrare en el if? ::::::");
//                          
                            if (parseInt(incidente.id) === parseInt(reportesSimilares[i].id) && incidente.Incidente.toLowerCase() === reportesSimilares[i].Incidente.toLowerCase()) {

                                agregarMarcador(reportesSimilares[i].lat, reportesSimilares[i].lng);
                                
                                //document.getElementById("serie").value = reportesSimilares[i].serie;
                                $('#serie').val(reportesSimilares[i].serie);
                                $('#reporteO').val(reportesSimilares[i].reporteoperador);
                                b = false;
                            }
                        });
                        if ($('#serie').val() === "" || b) {
                            var serie = traeSerie(incidente.id);
                            serie.then(function (respuesta) {
                                document.getElementById("serie").value = respuesta.serie;
                            });
                        }
                    }


                } else {
                    if (Reportes.id !== "" && Reportes.id !== null && Reportes.id !== undefined) {
                        var b = true;
                        incidente = {"id": Reportes.id, "Incidente": Reportes.Incidente, "Prioridad": Reportes.Prioridad};
                        
                        
                        vue.value = [{"id": Reportes.id, "Incidente": Reportes.Incidente}];
                        $('#nivelemergencia').val(Reportes.Prioridad);
                        $.each(reportesSimilares, function (i) {
//                          
//                          
//                            console.log(":::::: ¿Entrare en el if? ::::::");
//                          
                            if (parseInt(incidente.id) === parseInt(reportesSimilares[i].id) && incidente.Incidente.toLowerCase() === reportesSimilares[i].Incidente.toLowerCase()) {

                                agregarMarcador(reportesSimilares[i].lat, reportesSimilares[i].lng);
                                
                                //document.getElementById("serie").value = reportesSimilares[i].serie;
                                $('#serie').val(reportesSimilares[i].serie);
                                $('#reporteO').val(reportesSimilares[i].reporteoperador);
                                b = false;
                            }
                        });
                        if ($('#serie').val() === "" || b) {
                            var serie = traeSerie(incidente.id);
                            serie.then(function (respuesta) {
                                document.getElementById("serie").value = respuesta.serie;
                            });
                        }
                    }
                }
            }
            
            
        });
//      
//       

        RWebSocket.send(Reportes.idReporte);
        
        $('div.card-body *').prop("disabled", true);
       


        $('#idRep').val(Reportes.idReporte);
        $('#fecha').val(Reportes.fecha);
        $('#hora').val(Reportes.hora);
        $('#lat').val(Reportes.lat);
        $('#lng').val(Reportes.lng);
        $('#latOp').val(Reportes.lat);
        $('#lngOp').val(Reportes.lng);
        
        
        initMap();
        $('#idMovil').val(Reportes.idUsuario_Movil);
        if ($('#idMovil').val() === "") {
            $('#idMovil').val("Usuario Anonimo");
        }
        $('#reporte').val(Reportes.reporte);
//      
//       
        if (Reportes.img === undefined || Reportes.img.toString() === "{}") {
        } else {
          
           
            if (Reportes.img.length !== undefined) {
                if (Reportes.img.includes(",")) {
                    var idImg = Reportes.img.split(",");
//                   
                    for (j = 0; j < idImg.length; j++) {
                        var imagen = buscarImg(parseInt(idImg[j]));
                        imagen.then(function (r) {
                            var ima = '<img style="width: 256px; height: 256px" id ="img' + j + '" src="data:image/png;base64,' + r.src + '" title="fecha:' + r.fecha + '\n hora:' + r.hora + '">';
                            //var p = '<p style="color:#ffffff"> fecha:' + Reportes.img[i].fecha + '<br> hora:' + Reportes.img[i].hora + '</p><br>';
                            $('#contenedor').append(ima);
                        });
                    }
                } else {
                  
                  
                    var imagen = buscarImg(parseInt(Reportes.img));
                    imagen.then(function (r) {
                        var ima = '<img style="width: 256px; height: 256px" id ="img' + j + '" src="data:image/png;base64,' + r.src + '" title="fecha:' + r.fecha + '\n hora:' + r.hora + '">';
                        //var p = '<p style="color:#ffffff"> fecha:' + Reportes.img[i].fecha + '<br> hora:' + Reportes.img[i].hora + '</p><br>';
                        $('#contenedor').append(ima);
                    });
                }
            } else if (Reportes.img[0]) {
                $.each(Reportes.img, function (i) {
                  
                  
                    var ima = '<img style="width: 256px; height: 256px" id ="img"' + j + '" src="' + Reportes.img[i].src + '" title="fecha:' + Reportes.img[i].fecha + '\n hora:' + Reportes.img[i].hora + '">';
                    //var p = '<p style="color:#ffffff"> fecha:' + Reportes.img[i].fecha + '<br> hora:' + Reportes.img[i].hora + '</p><br>';
                    $('#contenedor').append(ima);
                });
            }
        }
        $('#chained_relative-flexdatalist').removeAttr("disabled");
        $('#reporteO').removeAttr("disabled");
        $('#FechaRegistro').val(FTransmision);
        $('#HoraRegistro').val(HTransmision);
        $('#lafectados').removeAttr("disabled");
        $('#desc').removeAttr("disabled");
        $('#medidasControl').removeAttr("disabled");
        $('#pAfectadas').removeAttr("disabled");
        $('#pEvacuadas').removeAttr("disabled");
        $('#pDesaparecidas').removeAttr("disabled");
        $('#pLesionadas').removeAttr("disabled");
        $('#pFallecidas').removeAttr("disabled");
        $('#dColaterales').removeAttr("disabled");
        $('#infraestructuraAfectada').removeAttr("disabled");
        $('#afectacionVial').removeAttr("disabled");
        $('#rInstitucional').removeAttr("disabled");
        $('#radioNivelImpacto').removeAttr("disabled");
        $('#tipoSeguimiento').removeAttr("disabled");
        elimina(Reportes.idReporte, HR, FR, HTransmision, FTransmision);
    });
}

function elimina(rep, HR, FR, HT, FT) {
    $("#boton").click(function (event) {
        if (validaForm()) {
            var HCaptura = getHora();
            var FCaptura = getFecha();
            var status = actualizaRegistro(HR, FR, HT, FT, HCaptura, FCaptura);
            status.then(function (respuesta) {
                if (respuesta.status === "200") {
                    var resp = actualizarReporte();
                    resp.then(function (estado) {
                        if (estado.success === "1") {
                            $('#incidentes').css("visibility", "hidden");
                            $('#rep' + rep).remove();
                            RWebSocket.send("rep" + rep);
                            $('div.card-body *').prop("disabled", false);
                            $('#idRep').val("");
                            $('#fecha').val("");
                            $('#hora').val("");
                            $('#lat').val("");
                            $('#lng').val("");
                            $('#latOp').val("");
                            $('#lngOp').val("");
                            initMap();
                            $('#idMovil').val("");
                            $('#reporte').val("");
                            $('#contenedor').empty();
                            $('#sim').remove();
                            $('#similares').empty();
                            vue.value = null;
                            //$('#chained_relative-flexdatalist').attr("disabled", true);
                            //$('#chained_relative-flexdatalist').val("");
                            $('#nivelemergencia').val("");
                            $('#reporteO').attr("disabled", true);
                            $('#reporteO').val("");
                            $('#lafectados').attr("disabled", true);
                            $('#lafectados').val("");
                            $('#desc').attr("disabled", true);
                            $('#desc').val("");
                            $('#medidasControl').attr("disabled", true);
                            $('#medidasControl').val("");
                            $('#pAfectadas').attr("disabled", true);
                            $('#pAfectadas').val("0");
                            $('#pEvacuadas').attr("disabled", true);
                            $('#pEvacuadas').val("0");
                            $('#pDesaparecidas').attr("disabled", true);
                            $('#pDesaparecidas').val("0");
                            $('#pLesionadas').attr("disabled", true);
                            $('#pLesionadas').val("0");
                            $('#pFallecidas').attr("disabled", true);
                            $('#pFallecidas').val("0");
                            $('#dColaterales').attr("disabled", true);
                            $('#dColaterales').val("");
                            $('#infraestructuraAfectada').attr("disabled", true);
                            $('#infraestructuraAfectada').val("");
                            $('#afectacionVial').attr("disabled", true);
                            $('#afectacionVial').val("");
                            $('#rInstitucional').attr("disabled", true);
                            $('#rInstitucional').val("");
                            $('#radioNivelImpacto').attr("disabled", true);
                            $('#radioNivelImpacto').attr("value", "1");
                            $('#tipoSeguimiento').attr("disabled", true);
                            $('#tipoSeguimiento').attr("value", "1");
                            $('#serie').val("");
                        }
                    });
                }
            });
        }
    });
}

function buscarImg(id) {
      
//    if (isNaN(modo)) {
        return Promise.resolve($.ajax({
            type: 'POST',
            url: '/' + DEPENDENCIA + '/CosultaImg',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                "id": id
            }),
            success: function (response) {
               

            },
            error: function (err) {
              
            }
        }));

    }

function TraeReportes() {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/Reportes',
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
          
            
        },
        error: function (err) {
          
            
        }
    }));
}

function validaForm() {
    if (vue.value !== null && $('#reporteO').val() !== "") {
        return true;
    } else {
        return false;
    }
}

function traeSerie(id) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: "SerieIncidentes",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "incidente": {
                "codigo": id,
                "prefijo_estado": prefijo
            }
        }),
        success: function (response) {
          
            
        },
        error: function (err) {
          
            
        }
    }));
}

function actualizaRegistro(HR, FR, HT, FT, HC, FC) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: "update",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "incidente": {
                "serie": $('#serie').val(),
                "descripcion": $('#desc').val(),
                //"lugaresafectados": $('#lafectados').val(),
                "lugaresafectados": null,
                "ubicacionespecifica": {
                    "lat": $('#lat').val(),
                    "long": $('#lng').val()
                },
                "otro": "",
                "fecharegistro": $('#FechaRegistro').val(),
                "horaregistro": $('#HoraRegistro').val(),
                "fechaocurrencia": $('#fecha').val(),
                "horaocurrencia": $('#hora').val(),
                "medidascontrol": $('#medidasControl').val(),
                "personasafectadas": $('#pAfectadas').val(),
                "personasevacuadas": $('#pEvacuadas').val(),
                "personasdesaparecidas": $('#pDesaparecidas').val(),
                "personaslesionadas": $('#pLesionadas').val(),
                "personasfallecidas": $('#pFallecidas').val(),
                "danoscolaterales": $('#dColaterales').val(),
                "infraestructuraafectada": $('#infraestructuraAfectada').val(),
                "afectacionvial": $('#afectacionVial').val(),
                //"respuestainstitucional": $('#rInstitucional').val(),
                "respuestainstitucional": null,
                "clave": incidente.id,
                "prefijoestado": prefijo,
                "radioNivelImpacto": $('#radioNivelImpacto').val(),
                "tiposeguimiento": $('#tipoSeguimiento').val(),
                "status": true,
                "id_usuario": 9,
                "dependencias": {
                    "descripcion_llamada": {
                        "municipio": "Sinaloa",
                        "fecha": $('#fecha').val() + " " + $('#hora').val(), //duda de si son la fecha y hora de la ocullencia
                        "folio": "9816314",
                        "numero_telefono": $("#idMovil").val(),
                        "origen": "TODAS",
                        "prioridad": incidente.Prioridad,
                        "motivo": incidente.Incidente,
                        "operador": $('#user').text()
                    },
                    "datos_llamada": {
                        "folio": "9816314",
                        "recepcion": FR + " " + HR,
                        "origen": "TELEFONO",
                        "prioridad": incidente.Prioridad,
                        "motivo": incidente.Incidente,
                        "lugar": $("#direccion").val(),
                        "ciudad": "Culiacan",
                        "colonia": "Aguaruto",
                        "descripcion": $("#desc").val(),
                        "denunciante": $("#idMovil").val(),
                        "telefono": $("#idMovil").val(),
                        "direccion": $("#direccion").val(),
                        "tiempo_ocurre": "00:00:00",
                        "hora_ocurre": $('#fecha').val() + " " + $('#hora').val()
                    },
                    "tiempo_llamada": {
                        "recibida_por": $('#user').text(),
                        "h_recepcion": FR + " " + HR, //Provisionales
                        "h_transmision": FT + " " + HT,
                        "t_transmision": calculaTiempo(HR, HT),
                        "h_captura": FC + " " + HC,
                        "t_captura": calculaTiempo(HT, HC)
                    },
                    "tiempo_atencion": null/*{
                     "f_despacho": "14-09-2018 22:04:45",
                     "t_despacho": "00:00:18",
                     "t_reaccion": "00:01:29",
                     "h_llegada": "14-09-2018 22:04:49",
                     "t_llegada": "00:00:04",
                     "t_respuesta": "00:01:33",
                     "h_solucion": "14-09-2018 22:04:55",
                     "t_solucion": "00:00:05",
                     "t_atencion": "00:01:39"
                     }*/
                }
            }
        }),
        success: function (response) {
          
            
        },
        error: function (err) {
          
            
        }
    }));
}

function actualizarReporte() {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/ActualizaEstadoReporte',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "idReporte": $("#idRep").val(),
            "reporteOperador": $("#reporteO").val(),
            "lat": $("#latOp").val(),
            "lng": $("#lngOp").val(),
            "id": incidente.id,
            "Incidente": incidente.Incidente,
            "Prioridad": incidente.Prioridad,
            "serie": $('#serie').val()
        }),
        success: function (response) {
           
            if (response.fail) {
                console.error("ALGO PASO");
            } else {
              
            }
        },
        error: function (err) {
          
            
        }
    }));
}

function ReportesSimilares(idReporte, lat, lng, fecha) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/ReportesSimilares',
        //url: 'http://172.17.0.73/api/incidente/serie',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "id": idReporte,
            "lat": lat,
            "lng": lng,
            "fecha": fecha
        }),
        success: function (response) {
          
            

        },
        error: function (err) {
          
            
        }
    }));
}

function agregarMarcador(lat, lng) {
    initMap();
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    var icono = PathRecursos+'mg/IconoMap/dot.png';
    var img = {
        url: icono, // url
        scaledSize: new google.maps.Size(15, 15), // scaled size
        origin: new google.maps.Point(0, 0) // origin
    };
    var infowindow = new google.maps.InfoWindow({maxWidth: 300});
    var latlng = {lat: lat, lng: lng};
    geocoder.geocode({'location': latlng}, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                marker = new google.maps.Marker({
                    position: latlng,
                    draggable: false,
                    icon: img
                });
                marker.setMap(map);
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.setContent("Incidente: " + incidente.Incidente + "<br>" + results[0].formatted_address);
                    infowindow.open(map, marker);
                });
            }
        }
    });
}

var emergencias = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "resources/json/incidentes.json",
        'dataType': "json",
        'success': function (data) {
            json = data;
            //            var a;
            //            var b="";
            //            
            //            $.each(json, function(i){
            //               a =  JSON.stringify(json[i]);
            //               b=b+a+"*";
            //               
            //            });
            //            b=b.substring(0,b.length-1);
            //            json = b.split("*");
            //            
        }
    });
    return json;
})();

var vue = new Vue({
    el: '#incidentes',
    components: {
        multiselect: VueMultiselect.Multiselect
    },
    data() {
        return {
            value: [],
            options: emergencias
        };
    },
    methods: {
        customLabel(option) {
            return option.id + " " + option.Incidente;
        },
        onChange(value) {
            if (value === null) {
                incidente = null;
                $('#serie').val("");
                $('#nivelemergencia').val("");
                $('#reporteO').val("");
                initMap();
            } else {
                //$('#serie').val("");
                //$('#nivelemergencia').val("");
                document.getElementById("nivelemergencia").value = value.Prioridad;
                //                var serie = traeSerie(incidente.id);
                //                serie.then(function (respuesta) {
                //                    document.getElementById("serie").value = respuesta.serie;
                //                });
            }
        },
        onSelect(op) {
            var b = true;
            
            
            
            incidente = null;
            incidente = {Incidente: op.Incidente, id: op.id, Prioridad: op.Prioridad, Dependencias: op.Dependencias};
           
            document.getElementById("nivelemergencia").value = incidente.Prioridad;
            
            
            $.each(reportesSimilares, function (i) {
                if (op.id === parseInt(reportesSimilares[i].id) && op.Incidente.toLowerCase() === reportesSimilares[i].Incidente.toLowerCase()) {
                  
                    agregarMarcador(reportesSimilares[i].lat, reportesSimilares[i].lng);
                  
                    //document.getElementById("serie").value = reportesSimilares[i].serie;
                    $('#serie').val(reportesSimilares[i].serie);
                    $('#reporteO').val(reportesSimilares[i].reporteoperador);
                    b = false;
                }
            });
            if ($('#serie').val() === "" || b) {
                var serie = traeSerie(incidente.id);
                serie.then(function (respuesta) {
                    document.getElementById("serie").value = respuesta.serie;
                });
            }

        },
        onTouch() {
        }
    }
});


