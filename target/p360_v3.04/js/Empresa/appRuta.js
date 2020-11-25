

try {
    var data = JSON.parse(document.getElementById("data").value);

    llenarperfil(data);
} catch (exception) {

}

var dataG = {
    "integrantes": new Array()
};
dataG.integrantes.push(data.Usuarios_Movil);
var Marcador = null;
var RutaCamino = null;
var RutaCamino1 = null;
var m = new Array();
var infowindow;
var image = PathRecursos + 'Img/IconoMap/131.png';
var idUsuario_Movil = document.getElementById("idUsuario_Movil").value;

/* global map, Promise, DEPENDENCIA, hostdir, google, m */
var fechaActual = getFecha();
document.getElementById("dateformated").value = fechaActual;
document.getElementById("button__api-open-close").value = "La ruta mostrada corresponde al día de hoy";
var fechaArray = fechaActual.split("-");

DatosProyecto();


var input = $('#button__api-open-close').pickadate({
    format: 'La ruta !mostra!da correspon!de al !día: dddd, dd !de mmmm !de yyyy',
    formatSubmit: 'yyyy-mm-dd',
    hiddenPrefix: 'prefix-',
    hiddenSuffix: '-suffix',
    max: new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2]),
    today: false,
    clear: false,
    close: false

});
var picker = input.pickadate('picker');

picker.set('enable', false);
var datearr = new Array();
for (var i = 0; i < data.Usuarios_Movil.FechasRutas.length; i++) {
    var dt = new Date(data.Usuarios_Movil.FechasRutas[i].Fecha);



    dt.setDate(dt.getDate() + 1);


    datearr.push(dt);
}
picker.set('disable', datearr);
picker.on({
    open: function () {

//        if ($("#loading").length) {
//            document.getElementById("loading").parentNode.removeChild(document.getElementById("loading"));
//        }
    },
    close: function () {


    },
    render: function () {


        loadingRoute();
        setTimeout(function () {
            if (Marcador !== null)
                Marcador.setMap(null);
            if (RutaCamino !== null)
                RutaCamino.setMap(null);
            if (RutaCamino1 !== null)
                RutaCamino1.setMap(null);
            LimpiarPuntos();
            var fecha = document.getElementById("dateformated").value;
            var idUsuario_Movil = document.getElementById("idUsuario_Movil").value;

            if (fecha !== "") {



                var consultar = false;
                if (!data.Usuarios_Movil.gps) {

                    data.Usuarios_Movil.gps = {};
                    consultar = true;
                }
                if (!data.Usuarios_Movil.gps.rutas) {

                    consultar = true
                    data.Usuarios_Movil.gps.rutas = {};
                } else {

                    if (!data.Usuarios_Movil.gps.rutas[fecha]) {

                        consultar = true;
                    }
                }
                if (consultar) {

                    consultarRutaDate(idUsuario_Movil, fecha).then(function (ruta) {

                        if (ruta !== null) {


                            var keyFecha;
                            for (keyFecha in ruta) {
                            }
                            try {
                                if (ruta[keyFecha].Ruta !== null && ruta[keyFecha].Ruta !== "") {
                                    ruta[keyFecha].Ruta = ruta[keyFecha].Ruta.replaceAll(/\]\[/g, ',');
                                    ruta[keyFecha].Ruta = ruta[keyFecha].Ruta.replaceAll(/ /g, '');
                                    console.log(ruta);
                                    var routes = "";
                                    var coordenadas = ruta[keyFecha].Ruta.replaceAll(/'/g, '"').substring(1, ruta[keyFecha].Ruta.length - 1).split("],[");
                                    coordenadas[0] = coordenadas[0].substring(1);
                                    coordenadas[coordenadas.length - 1] = coordenadas[coordenadas.length - 1].substring(0, coordenadas.length - 1);
                                    for (var i = 0; i < coordenadas.length; i++) {
                                        coordenadas[i] = coordenadas[i].split(",");
                                    }
                                    console.log(coordenadas);
//                                    var coordenadas = JSON.parse("[" + ruta[keyFecha].Ruta.replaceAll(/'/g, '"').substring(0, ruta[keyFecha].Ruta.length - 1) + "]");

                                    data.Usuarios_Movil.gps.rutas[keyFecha] = {};
                                    data.Usuarios_Movil.gps.rutas[keyFecha].Ruta = new Array();
                                    for (var i = 0; i < coordenadas.length; i++) {

                                        data.Usuarios_Movil.gps.rutas[keyFecha].Ruta.push({
                                            "lat": parseFloat(coordenadas[i][0]),
                                            "lng": parseFloat(coordenadas[i][1]),
                                            "hora": coordenadas[i][2],
                                            "velocidad": coordenadas[i][3],
                                            "acuary": coordenadas[i][4],
                                            "altitud": coordenadas[i][5]
                                        });  //   += '{"lat":' + coordenadas[i][0] + ',"lng":' + coordenadas[i][1] + ',"hora":"' + coordenadas[i][2] + '","velocidad":' + coordenadas[i][3] + ',"acuary":' + coordenadas[i][4] + ',"altitud":' + coordenadas[i][5] + '},';
                                    }
                                    data.Usuarios_Movil.gps.latitud = coordenadas[coordenadas.length - 1][0];
                                    data.Usuarios_Movil.gps.longitud = coordenadas[coordenadas.length - 1][1];
                                    data.Usuarios_Movil.gps.hora = coordenadas[coordenadas.length - 1][2];


                                    SetMarkerFecha(fecha);

                                } else {

                                    data.Usuarios_Movil.gps.rutas[keyFecha] = {};
                                    data.Usuarios_Movil.gps.rutas[keyFecha].Ruta = new Array();


                                    data.Usuarios_Movil.gps.rutas[keyFecha].Ruta.push({
                                        "lat": parseFloat(ruta[keyFecha].Latitud),
                                        "lng": parseFloat(ruta[keyFecha].Longitud),
                                        "hora": ruta[keyFecha].Hora,
                                        "velocidad": 0,
                                        "acuary": 0,
                                        "altitud": 0
                                    });  //   += '{"lat":' + coordenadas[i][0] + ',"lng":' + coordenadas[i][1] + ',"hora":"' + coordenadas[i][2] + '","velocidad":' + coordenadas[i][3] + ',"acuary":' + coordenadas[i][4] + ',"altitud":' + coordenadas[i][5] + '},';

                                    data.Usuarios_Movil.gps.latitud = ruta[keyFecha].Latitud;
                                    data.Usuarios_Movil.gps.longitud = ruta[keyFecha].Longitud;
                                    data.Usuarios_Movil.gps.hora = ruta[keyFecha].Hora;


                                    SetMarkerFecha(fecha);


                                    const Toast = Swal.mixin({
                                        toast: true,
                                        position: 'bottom',
                                        timer: 3000,
                                        backdrop: `rgba(189, 189, 189,0.5)`
                                    });
                                    Toast.fire({
                                        type: 'info',
                                        html: '<p style="color: white;font-size: 15px;">No hay ruta generada por este usuario</p>'
                                    });


                                }
                                if ($("#loading").length) {
                                    document.getElementById("loading").parentNode.removeChild(document.getElementById("loading"));
                                }

                            } catch (err) {
                                if ($("#loading").length) {
                                    document.getElementById("loading").parentNode.removeChild(document.getElementById("loading"));
                                }
                                const Toast = Swal.mixin({
                                    toast: true,
                                    position: 'bottom',
                                    timer: 3000,
                                    backdrop: `rgba(189, 189, 189,0.5)`
                                });
                                Toast.fire({
                                    type: 'info',
                                    html: '<p style="color: white;font-size: 15px;">No hay ruta generada por este usuario</p>'
                                });
                                window.console.warn(err + "\nError de formato...\nNo podra visualizar de forma correcta la ruta del elemento: ");

                            }


                            //elemento.gps.rutas[keyFecha] = ruta[keyFecha];




                            //generarRuta(elemento.gps.rutas[keyFecha], elemento.idUsuarios_Movil);
                        }


                    });
                } else {
                    //generarRuta(elemento.gps.rutas[getFecha()], elemento.idUsuarios_Movil);

                    data.Usuarios_Movil.gps.latitud = data.Usuarios_Movil.gps.rutas[fecha].Ruta[data.Usuarios_Movil.gps.rutas[fecha].Ruta.length - 1].lat;
                    data.Usuarios_Movil.gps.longitud = data.Usuarios_Movil.gps.rutas[fecha].Ruta[data.Usuarios_Movil.gps.rutas[fecha].Ruta.length - 1].lng;
                    data.Usuarios_Movil.gps.hora = data.Usuarios_Movil.gps.rutas[fecha].Ruta[data.Usuarios_Movil.gps.rutas[fecha].Ruta.length - 1].hora;

                    SetMarkerFecha(fecha);
                }



            }
        }, 100);
    },
    start: function () {

    },
    stop: function () {

    },
    set: function () {

        document.getElementById("dateformated").value = document.getElementsByName("prefix--suffix")[0].value;
    }
});

function SetMarkerFecha(fecha) {

    document.getElementById("span").innerHTML = "";

    if (!isNaN(data.Usuarios_Movil.gps.latitud) && !isNaN(data.Usuarios_Movil.gps.longitud)) {
        map.setCenter({lat: parseFloat(data.Usuarios_Movil.gps.latitud), lng: parseFloat(data.Usuarios_Movil.gps.longitud)});
        map.setZoom(14);
    }


    document.getElementById("fecha").innerHTML = document.getElementById("button__api-open-close").value;


    if (data.Usuarios_Movil.icon !== "" && data.Usuarios_Movil.icon !== null) {

        var icono = {
            url: data.Usuarios_Movil.icon, // url
            scaledSize: new google.maps.Size(40, 40), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(20, 40) // anchor
        };
    } else {
        var icono = image;
    }

    Marcador = new google.maps.Marker({position: {lat: parseFloat(data.Usuarios_Movil.gps.latitud), lng: parseFloat(data.Usuarios_Movil.gps.longitud)},
        map: map,
        //animation: googlue.maps.Animation.BOUNCE,
        icon: icono
    }, );


    Marcador.addListener('click', function () {
        if (map.getZoom() < 15) {
            map.setZoom(15);
            map.setCenter(Marcador.getPosition());
        }

        map.setCenter(Marcador.getPosition());
        //infowindow.close();

        infowindow.setContent(ContentInfoWindowHistoricoRuta(data, fecha));
        infowindow.open(map, Marcador);
    });

    SetPoints(data.Usuarios_Movil.gps.rutas[fecha].Ruta);
    if ($("#loading").length) {
        document.getElementById("loading").parentNode.removeChild(document.getElementById("loading"));
    }


}


function MarcadorElementoHistorico(elemento) {




    Marcador.addListener('click', function () {
        if (map.getZoom() < 15) {
            map.setZoom(15);
            map.setCenter(Marcador.getPosition());
        }

        map.setCenter(Marcador.getPosition());
        //infowindow.close();
        infowindow.setContent(" <div style=\" width: 170px; float: left;\">\n\
                                    <p>\n\
                                            Ultima actualizacion: <br><label style=\"font-weight: 200; margin-top:5px;\">" + elemento.fecha + " - " + elemento.hora + "</label><br>" + "Nombre: <br><label style=\"font-weight: 200; margin-top:5px;\">" + nombre + " " + apellidos + "</label><br>\n\
                                                                        <br> <input type=\"button\" class=\"btn btn - default\" id=\"FirebaseB\" value=\"Llamar\" onclick=\"ConfirmarLlamada(" + elemento.idUsuarios_Movil + ",'" + nombre + " " + apellidos + "') \"<>\n\
                                        <input type=\"button\" class=\"btn btn - default\" id=\"RutaH\" class=\"hide\" value=\"Cerrar Ruta\">\n\
                                        <input type=\"hidden\" id=\"RutaH2\" class=\"hide\"value=\"Cerrar Ruta 2\">\n\
                                    <\p>\n\
                               </div>");
        infowindow.open(map, Marcador);
        //SetPoints(JSON.parse("[" + elemento.ruta.replace(/~/g, '"').substring(0, elemento.ruta.length - 1) + "]"), elemento.idUsuarios_Movil);




        setTimeout(function () {
            document.getElementById("RutaH").addEventListener('click', function () {
                if (document.getElementById("RutaH").className === "show") {
                    if (elemento.ruta !== undefined && elemento.ruta !== null && elemento.ruta.length) {
                        var RUTA = elemento.ruta.replace(/~/g, '"');

                        SetPoints(JSON.parse("[" + RUTA.substring(0, RUTA.length - 1) + "]"), elemento.idUsuarios_Movil);
                        document.getElementById("RutaH").className = "hide";
                        document.getElementById("RutaH").value = "Cerrar Ruta";
                    } else {

                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'bottom',
                            timer: 2000
                                    //backdrop: `rgba(189, 189, 189,0.5)`
                        });
                        Toast.fire({
                            type: 'info',
                            html: '<p style="color: white;font-size: 15px;">Por el momento no hay ruta disponible para este usuario</p>'
                        });
                    }
                } else {
                    RutaCamino.setMap(null);
                    RutaCamino1.setMap(null);
                    LimpiarPuntos();
                    document.getElementById("RutaH").className = "show";
                    document.getElementById("RutaH").value = "Ver Ruta";
                }
            });
            document.getElementById("RutaH2").addEventListener('click', function () {
                if (document.getElementById("RutaH2").className === "show") {
                    if (elemento.ruta !== undefined && elemento.ruta !== null && elemento.ruta.length) {
                        var RUTA = elemento.ruta.replace(/~/g, '"');
                        RUTA = RUTA.replace(/null/g, '');

                        SetLine(JSON.parse("[" + RUTA.substring(0, RUTA.length - 1) + "]"), elemento.idUsuarios_Movil);
                        document.getElementById("RutaH2").className = "hide";
                        document.getElementById("RutaH2").value = "Cerrar Ruta 2";
                    } else {
                        LimpiarPuntos();
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'bottom',
                            timer: 3000
                                    //backdrop: `rgba(189, 189, 189,0.5)`
                        });
                        Toast.fire({
                            type: 'info',
                            html: '<p style="color: white;font-size: 15px;">Por el momento no hay ruta disponible para este usuario</p>'
                        });
                    }
                } else {
                    RutaCamino.setMap(null);
                    RutaCamino1.setMap(null);
                    var i = 0;
                    while (m[i] !== null && m[i] !== undefined) {

                        m[i].setMap(null);
                        i++;
                    }
                    document.getElementById("RutaH2").className = "show";
                    document.getElementById("RutaH2").value = "Ver Ruta 2";
                }
            });
        }, 100);
    });
    try {
        var coordenadas = JSON.parse("[" + elemento.ruta.replace(/'/g, '"').substring(0, elemento.ruta.length - 1) + "]");
        elemento.ruta = "";
        for (var i = 0; i < coordenadas.length; i++) {
            elemento.ruta += '{"lat":' + coordenadas[i][0] + ',"lng":' + coordenadas[i][1] + ',"hora":"' + coordenadas[i][2] + '","velocidad":' + coordenadas[i][3] + ',"acuary":' + coordenadas[i][4] + ',"altitud":' + coordenadas[i][5] + '},';
        }

//        for (var i = 1; i < coordenadas.length; i++) {
//            var horaAnterior = coordenadas[i - 1][2].split(":");
//            var horaActual = coordenadas[i][2].split(":");
//            if (horaAnterior[0] > horaActual[0]) {
//                //alert("h "+horaAnterior + "   vs   " + horaActual);
//
//            } else if (horaAnterior[0] === horaActual[0]) {
//                if (horaAnterior[1] > horaActual[1]) {
//                    //alert("m "+ horaAnterior + "   vs   " + horaActual);
//                } else if (horaAnterior[1] === horaActual[1]) {
//                    if (horaAnterior[2] > horaActual[2]) {
//                        //alert("s "+horaAnterior + "   vs   " + horaActual);
//                    }
//                }
//            }
//        }

        if (elemento.ruta !== undefined && elemento.ruta !== null && elemento.ruta.length) {
            var RUTA = elemento.ruta.replace(/~/g, '"');

            SetPoints(JSON.parse("[" + RUTA.substring(0, RUTA.length - 1) + "]"), elemento.idUsuarios_Movil);
        } else {

            const Toast = Swal.mixin({
                toast: true,
                position: 'bottom',
                timer: 2000
                        //backdrop: `rgba(189, 189, 189,0.5)`
            });
            Toast.fire({
                type: 'info',
                html: '<p style="color: white;font-size: 15px;">Por el momento no hay ruta disponible para este usuario</p>'
            });
            if ($("#loading").length) {
                document.getElementById("loading").parentNode.removeChild(document.getElementById("loading"));
            }
        }
    } catch (err) {
        alert(err + "\nError de formato...\nNo podra visualizar de forma correcta la ruta del elemento: " + elemento.idUsuarios_Movil);
    }



}



function loadingRoute() {
    if ($("#loading").length) {
        document.getElementById("loading").parentNode.removeChild(document.getElementById("loading"));
    }
    var loadingPage = PathRecursos + 'gif/Magnify2.gif';
    var loading = document.createElement("div");
    loading.id = "loading";
    loading.style = "background-color:rgba(245, 255, 255, 0.7); position: absolute; width: 100%; height: 100%;";
    var loadingGif = document.createElement("img");
    loadingGif.src = loadingPage;
    loadingGif.style = "position: absolute; width: 10%; top:35%; left:44%";
    loading.appendChild(loadingGif);
    document.getElementById("map").appendChild(loading);
}

function DatosProyecto() {
    return Promise.resolve($.ajax({
        type: 'GET',
        url: '/' + DEPENDENCIA + '/DatosProyecto',
        contentType: "application/json",
        dataType: "json",
        success: function (p) {


            document.getElementById("FireBaseAuthorization").value = p["FireBaseAuthorization"];
        },
        error: function (err) {
            //alert("No hay ubicacion para el usuario:" + idUsuarios_Movil);

        }
    }));

}
function llenarperfil(data) {


    if (data.Usuarios_Movil.Img) {
        document.getElementById("ImgPerfil").style.display = "none";
        document.getElementById("ImgPerfil").parentNode.style = "background-repeat: no-repeat;    background-position:center;    background-size: cover;    -moz-background-size: cover;    -webkit-background-size: cover;    -o-background-size: cover;";
        document.getElementById("ImgPerfil").parentNode.style.backgroundImage = "url('" + data.Usuarios_Movil.Img.replace(/(\r\n|\n|\r)/gm, "") + "')";
    } else {
        document.getElementById("ImgPerfil").style.display = "none";
        document.getElementById("ImgPerfil").parentNode.style = "background-repeat: no-repeat;    background-position:center;    background-size: cover;    -moz-background-size: cover;    -webkit-background-size: cover;    -o-background-size: cover;";
        document.getElementById("ImgPerfil").parentNode.style.backgroundImage = "url('" + data.Usuarios_Movil.img.replace(/(\r\n|\n|\r)/gm, "") + "')";
    }
    document.getElementById("NombrePerfil").value = data.Usuarios_Movil.nombre + " " + data.Usuarios_Movil.apellido_paterno + " " + data.Usuarios_Movil.apellido_materno;
    //document.getElementById("Apellidos").value = data.Usuarios_Movil.apellido_paterno + " " + data.Usuarios_Movil.apellido_materno;
    document.getElementById("Fecha_nacimiento").value = data.Usuarios_Movil.fecha_nacimiento;
    document.getElementById("CorreoPerfil").value = data.Usuarios_Movil.correo;
    document.getElementById("id").value = data.Usuarios_Movil.telefono;
    document.getElementById("TelPerfil").value = data.Usuarios_Movil.telefono;
    document.getElementById("GenPerfil").value = data.Usuarios_Movil.genero;
    document.getElementById("RhPerfil").value = data.Usuarios_Movil.rh;
    document.getElementById("AlergiasPerfil").value = data.Usuarios_Movil.alergias;
    document.getElementById("CondicionMedica").value = data.Usuarios_Movil.condicion_medica;
    document.getElementById("DireccionPerfil").value = data.Usuarios_Movil.direccion;
    //document.getElementById("CPPerfil").value = data.Usuarios_Movil.cp;
    document.getElementById("ContactoNombre").value = data.Usuarios_Movil.contacto_nombre;
    document.getElementById("ContactoNumero").value = data.Usuarios_Movil.contacto_telefono;
    document.getElementById("iconUsr").value = data.Usuarios_Movil.icon;
}

function consultarRutaDate(idUsuario, fecha) {

    var json = {
        "idUsuario": idUsuario,
        "fecha": fecha
    };
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": '/' + DEPENDENCIA + "/rutaDate",
        contentType: "application/json",
        "method": "POST",
        "data": JSON.stringify(json),
        success: function (response) {

        },
        error: function (err) {

            const Toast = Swal.mixin({
                toast: true,
                position: 'bottom',
                timer: 3000,
                backdrop: `rgba(189, 189, 189,0.5)`
            });
            Toast.fire({
                type: 'info',
                html: '<p style="color: white;font-size: 15px;">Por el momento no hay ruta disponible para este usuario</p>'
            });
            if ($("#loading").length) {
                document.getElementById("loading").parentNode.removeChild(document.getElementById("loading"));
            }
        }
    };
    return Promise.resolve($.ajax(settings));

}

document.getElementsByClassName("picker")[0].className += " row col-12 p-0 m-0";