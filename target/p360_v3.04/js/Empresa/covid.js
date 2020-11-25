/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var bajoN = true;
var medioN = true;
var altoN = true;
var p360 = false;


$("#CBbajo").change(function (e) {
    console.log(e.target.checked);
    bajoN = e.target.checked;
    if (bajoN) {
        $(".Nbajo").removeClass("hide");
    } else {
        $(".Nbajo").addClass("hide");
    }
});
$("#CBmedio").change(function (e) {
    console.log(e.target.checked);
    medioN = e.target.checked;
    if (medioN) {
        $(".Nmedio").removeClass("hide");
    } else {
        $(".Nmedio").addClass("hide");
    }
});
$("#CBalto").change(function (e) {
    console.log(e.target.checked);
    altoN = e.target.checked;
    if (altoN) {
        $(".Nalto").removeClass("hide");
    } else {
        $(".Nalto").addClass("hide");
    }
});

DatosProyecto();
WebSocketGeneral.onmessage = function (message) {
    var mensaje = JSON.parse(message.data);
    console.log(mensaje);
    if (mensaje.inicializacionSG) {
        idSocketOperador = mensaje.idSocket;
        //Solicitando Backup de mensajes
        var json = {
            "BackupCOVID": true,
            "idSocket": idSocketOperador
        };
        EnviarMensajePorSocket(json);
    }
    if (mensaje.covid) {
        console.log(mensaje);
        agregarNotCovid(mensaje);
        playAudio();
    }
    if (mensaje.notificacionescovid) {
        console.log(mensaje);
        //limpiar vista y quitar notificacion
        if ($("#serie").val() === mensaje.serie) {
            limpiarInfoCovid();

        }
        if ($("#covid" + mensaje.serie).length) {
            $("#covid" + mensaje.serie).remove();
        }
    }
};

function agregarNotCovid(json) {
    console.log("Agregando card covid");
    console.log(json);
    var div = document.createElement("div");
    div.id = "covid" + json.serie;
    div.className = "row col-12 m-0 p-0  contenedorNot hide N" + json.nivel.toString().toLowerCase();
    if (json.nivel === "Bajo" && bajoN) {
        div.className = "row col-12 m-0 p-0  contenedorNot  N" + json.nivel.toString().toLowerCase();
    }
    if (json.nivel === "Medio" && medioN) {
        div.className = "row col-12 m-0 p-0  contenedorNot  N" + json.nivel.toString().toLowerCase();
    }
    if (json.nivel === "Alto" && altoN) {
        div.className = "row col-12 m-0 p-0  contenedorNot  N" + json.nivel.toString().toLowerCase();
    }
    //div.style = "    height: 50px; background: white;border-bottom: solid 2px gray; color:black;font:normal 1em Arial";

    var div2 = document.createElement("div");
    div2.className = "col-10 p-0 pt-2 pl-4";
    var div3 = document.createElement("div");
    div3.className = "col-2 h-100 p-2";
    div3.innerHTML = "<i class=\"fas fa-chevron-right\" style=\"vertical-align: middle; height: 100%; float: right;\"></i>";
    div3.style = "cursor: pointer;";
    var div4 = document.createElement("div");
    div4.className = "col-12 p-0 h-50";
    div4.innerHTML = json.perfil.nombre + " " + json.perfil.apellido_paterno + " " + json.perfil.apellido_materno;
    div4.style = "font: bold 1em Arial;";
    var div5 = document.createElement("div");
    div5.className = "col-12 p-0 h-50";
    div5.innerHTML = "Nivel: " + json.nivel + "   " + json.fecha + " " + json.hora;
    div5.style = "font: normal 0.9em Arial;";
    div2.appendChild(div4);
    div2.appendChild(div5);
    div.appendChild(div2);
    div.appendChild(div3);
    document.getElementById("sidebar").appendChild(div);
    div3.addEventListener("click", function () {
        llenarInfoCovid(json);
    });

}
limpiarInfoCovid();

function limpiarInfoCovid() {

    $("#serie").val("");
    $("#firebasek").val("");
    $("#nombre").val("Seleccionar una notificación");
    $("#f_nac").val("Fecha de nacimiento: ");
    $("#edad").val("Edad: ");
    $("#direccion").val("Dirección: ");
    $("#cp").val("CP: ");
    $("#correo").val("Correo: ");
    $("#telefono").val("Telefono: ");
    $("#nombrece").val("");
    $("#telefonoce").val("");
    $("#p1").text("");
    $("#p2").text("");
    $("#p3").text("");
    $("#p4").text("");
    $("#p5").text("");
    $("#p6").text("");
    $("#p7").text("");
    $("#p8").text("");
    $("#p9").text("");
    $("#p10").text("");
    $("#p11").text("");
    $("#p12").text("");
    $("#p13").text("");
    $("#p14").text("");
    $("#p15").text("");
    $("#p16").text("");
    $("#p17").text("");
    $("#div11").addClass("d-none");
    $("#div13").addClass("d-none");
    $("#div14").addClass("d-none");
    $("#div15").addClass("d-none");
    $("#div16").addClass("d-none");
    $("#div17").addClass("d-none");
    $("#LabelFolioExterno").text("");
    $("#LabelHoraFecha").text("");
    $("#LabelTipoLlamada").text("");
    $("#riesgo").text("");
    $(".separadorsec").css("background", "black");
    $("#reporte").val(" ");

    document.getElementById("foto").style.backgroundImage = "none";
    for (var j = 0; j < markers.length; j++) {
        markers[j].setMap(null);
    }
}
function llenarInfoCovid(json) {
    if (p360) {
        p360 = false;
    }

    if (json.hasOwnProperty("p360")) {
        p360 = true;
    }

    //console.log(json);

    $("#serie").val(json.serie);
    $("#firebasek").val(json.perfil.FireBaseKey);
    $("#riesgo").text(json.nivel);
    if (json.nivel === "Bajo") {
        $(".separadorsec").css("display", "block !important");
        $(".separadorsec").css("background", "");
        $(".separadorsec").removeClass("Nmedio");
        $(".separadorsec").removeClass("Nalto");
        $(".separadorsec").addClass("Nbajo");
    } else if (json.nivel === "Medio") {
        $(".separadorsec").css("display", "block !important");
        $(".separadorsec").css("background", "");
        $(".separadorsec").removeClass("Nbajo");
        $(".separadorsec").removeClass("Nalto");
        $(".separadorsec").addClass("Nmedio");
    } else {
        $(".separadorsec").css("display", "block !important");
        $(".separadorsec").css("background", "");
        $(".separadorsec").removeClass("Nbajo");
        $(".separadorsec").removeClass("Nmedio");
        $(".separadorsec").addClass("Nalto");
    }


    $("#nombre").val(json.perfil.nombre + " " + json.perfil.apellido_paterno + " " + json.perfil.apellido_materno);
    $("#f_nac").val("Fecha de nacimiento: " + json.perfil.fecha_nacimiento);
    $("#edad").val("Edad: " + json.perfil.edad);
    $("#direccion").val("Dirección: " + json.perfil.direccion);
    $("#cp").val("CP: " + json.perfil.cp);
    $("#correo").val("Correo: " + json.perfil.correo);
    $("#telefono").val("Telefono: " + json.perfil.telefono);
    $("#nombrece").val(json.perfil.contacto_nombre);
    $("#telefonoce").val(json.perfil.contacto_telefono);

    $("#LabelFolioExterno").text(json.serie);
    $("#LabelHoraFecha").text(json.hora + " " + json.fecha);
    $("#LabelTipoLlamada").text(json.origen);

    $("#p1").text(json.convivir_enfermo === "1" ? "Si" : "No");
    $("#p2").text(json.fiebre === "1" ? "Si" : "No");
    $("#p3").text(json.dolor_cabeza === "1" ? "Si" : "No");
    $("#p4").text(json.tos === "1" ? "Si" : "No");
    $("#p5").text(json.dolor_pecho === "1" ? "Si" : "No");
    $("#p6").text(json.dolor_garganta === "1" ? "Si" : "No");
    $("#p7").text(json.dificultad_respirar === "1" ? "Si" : "No");
    $("#p8").text(json.escurrimiento_nasal === "1" ? "Si" : "No");
    $("#p9").text(json.dolor_cuerpo === "1" ? "Si" : "No");
    $("#p10").text(json.conjuntivitis === "1" ? "Si" : "No");

    if (json.nivel === "Medio" || json.nivel === "Alto") {
        $("#div11").removeClass("d-none");
        $("#p11").text(json.dias_sintomas === "1" ? "Si" : "No");
        $("#div15").removeClass("d-none");
        $("#p15").text(json.dolor_respirar === "1" ? "Si" : "No");
        $("#div16").removeClass("d-none");
        $("#p16").text(json.falta_aire === "1" ? "Si" : "No");
        $("#div17").removeClass("d-none");
        $("#p17").text(json.coloracion_azul === "1" ? "Si" : "No");
    }
    
    $("#p12").text(json.condiciones_medicas === "1" ? "Si" : "No");
    
    if (json.genero.toString().toLowerCase() === "mujer" || json.genero.toString().toLowerCase() === "femenino") {
        $("#div13").removeClass("d-none");
        $("#p13").text(json.embarazada === "1" ? "Si" : "No");
        $("#div14").removeClass("d-none");
        $("#p14").text(json.meses_embarazo === "1" ? "Si" : "No");
    }

    $("#reporte").text(" ");
    document.getElementById("foto").style.backgroundImage = "url('" + json.perfil.img + "')";
    SetMarkerCovid(json);
}


function SetMarkerCovid(elemento) {
    for (var j = 0; j < markers.length; j++) {
        markers[j].setMap(null);
    }
    elemento.lat = parseFloat(elemento.lat);
    elemento.lng = parseFloat(elemento.lng);
    var marker = new google.maps.Marker({position: {
            "lat": elemento.lat,
            "lng": elemento.lng
        },
        map: map
    });
    map.setZoom(16);
    map.setCenter({
        "lat": elemento.lat,
        "lng": elemento.lng
    });
    var icon;
    icon = {
        url: elemento.perfil.icon, // url
        scaledSize: new google.maps.Size(49, 50), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(25, 50) // anchor
    };
    marker.setIcon(icon);

    marker.set("id", elemento.idUsuario);

    marker.addListener('click', function () {
        infowindow.close;
        infowindow.setOptions({maxWidth: 300});
        infowindow.setContent(ContentInfoWindowCOVID(elemento));

        infowindow.open(map, marker);
    });

    markers.push(marker);
}

function ContentInfoWindowCOVID(elemento) {

    var img;

    img = elemento.perfil.img;

    return "<div class=\"contnr row col-12 m-0 p-0  pr-3 pb-3\"> \n\
            <div class=\"col-4 m-0 p-0\" style=\"width: 100%;height: calc(130px - 5rem);\"> \n\
            <div class=\"infowindow-img\" id=\"infowindowImg" + elemento.idUsuario + "\" style=\"background-image:url('" + img + "')\"></div> \n\
            </div> \n\
            <div class=\"col-8 m-0 p-0 pl-2\" style=\" width: 100%;height: calc(130px - 5rem);\">\n\
            <div class=\"col-12 m-0 p-0 infWinServ\">\n\
            <h2 class=\"title infWinServText\">Nivel: " + elemento.nivel + "</h2></div>\n\
             <h2 class=\"title\">" + elemento.perfil.nombre + " " + elemento.perfil.apellido_paterno + " " + elemento.perfil.apellido_materno + "</h2> \n\
            <h2 class=\"subtitle\">Teléfono: " + elemento.perfil.telefono + "</h2> \n\
            <label class=\"subtitle\">Fecha: <label class=\"text\" id=\"infowindowfecha" + elemento.idUsuario + "\">" + elemento.fecha + "</label></label>\n\
            <label class=\"subtitle\">Hora: <label class=\"text\" id=\"infowindowhora" + elemento.idUsuario + "\">" + elemento.hora + "</label></label>\n\
            <br> <input  type=\"hidden\"  id=\"LlamarFirebase:" + elemento.idUsuario + "\" value=\"Llamar\" onclick=\"ConfirmarLlamada(" + elemento.idUsuario + ",'" + elemento.nombre + " " + elemento.apellido_paterno + " " + elemento.apellido_materno + "')\">\n\
            <input type=\"hidden\" class=\"show botonRuta btn btn-outline-info btn-sm\" id=\"Ruta\" value=\"Ver Ruta\">\n\
            <input type=\"hidden\" id=\"Ruta2\" class=\"show\"value=\"Ver Ruta 2\">\n\
            \n\</div> \n\
            </div>";
}



function FireBaseCOVID(FireBaseKey, titulo, mensaje) {

    console.log("FireBaseCOVID");
    console.log("p360 " + p360);

    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/sendNotificacion',
        contentType: "application/json",
        dataType: "json",
        "data": JSON.stringify({
            "firebase": FireBaseKey,
            "tittle": titulo,
            "message": mensaje,
            "p360": p360
        }),
        success: function (response) {
            p360 = false;
            //console.info(response);
            if (response.failure) {
                console.log("algo salio mal al enviar la notificacion por firebase");
            }
        },
        error: function (err) {
            //alert("No hay ubicacion para el usuario:" + idUsuarios_Movil);
            p360 = false;
            console.error(err);
        }
    }));


//    return Promise.resolve($.ajax({
//        type: 'POST',
//        url: 'https://fcm.googleapis.com/fcm/send',
//        contentType: "application/json",
//        dataType: "json",
//        data: JSON.stringify(
//                {
//                    "to": FireBaseKey,
//                    "content_available": true,
//                    "notification": {
//                        "body": mensaje,
//                        "title": titulo
//                    },
//                    "android": {
//                        "priority": "high",
//                        "sound": "default"
//                    }
//                }
//
//        ),
//        headers: {
//            'Authorization': document.getElementById("FireBaseAuthorization").value
//        },
//        success: function (response) {
//
//            if (response.failure) {
//                console.log("algo salio mal al enviar la notificacion por firebase");
//            }
//        },
//        error: function (err) {
//            console.log(err);
//        }
//    }));
}
$("#Guardar").click(function () {
    json = {
        "serie": $("#serie").val(),
        "fecha": getFecha(),
        "hora": getHora(),
        "reporte": $("#reporte").val()
    }
    console.log(json);
    if (json.serie !== "" && json.reporte !== "") {
        json.notificacionescovid = true;
        let firebase = $("#firebasek").val();
        let titulo = "Test COVID-19 atendido";
        let mensaje = $("#reporte").val();

        FireBaseCOVID(firebase, titulo, mensaje);
        EnviarMensajePorSocket(json);

    }

});