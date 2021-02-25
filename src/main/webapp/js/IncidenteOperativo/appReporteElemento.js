/* global Promise, REWebSocket, reportes, DEPENDENCIA, Backup, arregloReportes, ReportesEnRevision, WebSocketGeneral, hostdir */


$('div.menudependencia *').prop("disabled", true);
//$("#notificarDependencias button").attr("type", "submit");

//var Reportes = TraeReportes();

var reportesSimilares = "";
var Backup = false;
var dataReportes = new Array();

if ($("#DependenciasID").length) {
    document.getElementById("DependenciasID").value = "0," + DEPENDENCIA + "," + DEPENDENCIA + "," + DEPENDENCIA_ALIAS + "," + DEPENDENCIA_ICON + "|" + document.getElementById("DependenciasID").value;
} else {
    var inputDep = document.createElement("input");
    inputDep.type = "hidden";
    inputDep.id = "DependenciasID";
    inputDep.value = "0," + DEPENDENCIA + "," + DEPENDENCIA + "," + DEPENDENCIA_ALIAS + "," + DEPENDENCIA_ICON;
    document.getElementById("notificarDependencias").appendChild(inputDep);
    document.getElementById("divmenudependencia").style = " visibility: hidden;";
}

function insertarReportesElementos(Reporte) {
    dataReportes.push(Reporte);
    var HRecepcion = getHora();
    var FRecepcion = getFecha();
    var contenedor = document.createElement("div");
    contenedor.style = "background: white;color: black;margin-bottom: 1rem;padding-bottom: .2rem;box-shadow: -4px 3px 5px 0px black;border-radius: 3px;cursor: pointer;";
    contenedor.id = "contenedor" + Reporte.id;
    var divrep = document.createElement("div");
    divrep.id = "rep" + Reporte.id;
    divrep.style = "text-align: center;font: 12px Arial;";
    divrep.innerHTML = "Reporte # " + Reporte.id + "<br>" + Reporte.nombre + " " + Reporte.apellido_paterno + " " + Reporte.apellido_materno;
    var divfh = document.createElement("div");
    divfh.id = "fh" + Reporte.id;
    divfh.style = "text-align: end;font: 10px Arial;padding-right: 5px;";
    divfh.innerHTML = Reporte.cuando;
    contenedor.appendChild(divrep);
    contenedor.appendChild(divfh);
    $('#grupos').append(contenedor);
    if ($('#que').val() !== "") {
        $('div #grupos *').prop("disabled", true);
    }
    agregaDatos(Reporte, HRecepcion, FRecepcion);
}

function agregaDatos(Reporte, HRecepcion, FRecepcion) {
    $('#contenedor' + Reporte.id).click(function () {
        $('div.card-body *').attr("disabled", true);
        $('div.menudependencia *').prop("disabled", false);
        var FTransmision = getFecha();
        var HTransmision = getHora();
        var fh = Reporte.cuando.toString().split(" ");
        var fecha = fh[0];
        var hora = fh[1];
        $("#rep" + Reporte.id).remove();
        var rep = {
            "quitar_reporte": true,
            "id": "contenedor" + Reporte.id
        };
        EnviarMensajePorSocket(rep);
        $("#idRE").val(Reporte.id);
        $("#idUsuario").val(Reporte.idUsuario);
        $("#idRE").val(Reporte.id);
        $("#que").val(Reporte.que);
        $("#quien").val(Reporte.quien);
        $("#cuando").val(Reporte.cuando);
        $("#donde").val(Reporte.donde);
        $("#latlngE").val(Reporte.latusuario + "," + Reporte.lngusuario);
        $("#latlngI").val(Reporte.latincidente + "," + Reporte.lngincidente);
        $("#informacionadicional").val(Reporte.informacionadicional);
        $("#razonamiento").removeAttr("disabled");
        $("#folioexterno").removeAttr("disabled");
        $("#boton").removeAttr("disabled");
        initMap();
        limpia(Reporte.id);
    });
}

function limpia(id) {
    document.getElementById("boton").addEventListener("click",function(){
        if ($("#razonamiento").val() !== "" && $("#folioexterno").val() !== "") {
            actualizaReporteElemento(id).then(function (response) {
                if (response.status === 200) {
                    $.each(dataReportes, function (i) {
                        if (dataReportes[i].id === id) {
                            dataReportes.splice(i, 1);
                            return false;
                        }
                    });
                    $('div.menudependencia *').prop("disabled", true);
                    $('div.card-body *').removeAttr("disabled");
                    $("#idRE").val("");
                    $("#idUsuario").val("");
                    $("#que").val("");
                    $("#quien").val("");
                    $("#cuando").val("");
                    $("#donde").val("");
                    $("#latlngE").val("");
                    $("#latlngI").val("");
                    $("#informacionadicional").val("");
                    $("#razonamiento").val("");
                    $("#folioexterno").val("");
                    $("#idRE").prop("disabled", true);
                    $("#que").prop("disabled", true);
                    $("#quien").prop("disabled", true);
                    $("#cuando").prop("disabled", true);
                    $("#donde").prop("disabled", true);
                    $("#latlngE").prop("disabled", true);
                    $("#latlngI").prop("disabled", true);
                    $("#informacionadicional").prop("disabled", true);
                    $("#razonamiento").prop("disabled", true);
                    $("#folioexterno").prop("disabled", true);
                    $("#boton").prop("disabled", true);
                    initMap();
                    var elimina = {
                        "Elimina": true,
                        "id": id
                    };
                    EnviarMensajePorSocket(elimina);
                    Swal.fire({
                        type: 'success',
                        title: "",
                        text: 'El reporte se ha guardado correctamente',
                        showConfirmButton: false,
                        timer: 2000
                    });
                    changeSwal2();
                }
            });
        } else {
            Swal.fire({
                title: 'Alto',
                text: "Debe escribir un razonamiento y un folio externo para guardar el reporte.",
                showCancelButton: false,
                showConfirmButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Continuar'
            });
            changeSwal();
        }
    });
//    $("#boton").click(function () {
//        
//    });
}

function changeSwal() {
    if ($("#swal2-content").length) {
        document.getElementById("swal2-content").style = "display: block; color: white; padding-top: 20px;";
    }
    if ($(".swal2-confirm").length) {
        var swal2confirm = document.getElementsByClassName("swal2-confirm")[0];
        swal2confirm.style = "background-color: #dc3545;";
    }
}
function changeSwal2() {
    var swalheader = document.getElementsByClassName("swal2-header");
    if (swalheader.length) {
        swalheader[0].style.background = "#40464f";
    }
    var swalcontent = document.getElementsByClassName("swal2-content");
    if (swalcontent.length) {
        swalcontent[0].style = "border-bottom-left-radius: 10px;    background: white;    border-bottom-right-radius: 10px;    padding: 20px;";
    }
    var swaltitle = document.getElementsByClassName("swal2-title");
    if (swaltitle.length) {
        swaltitle[0].style = "max-width:20%;";
    }
    var swal2circularleft = document.getElementsByClassName("swal2-success-circular-line-left");
    if (swal2circularleft.length) {
        swal2circularleft[0].style.background = "#40464f";
    }
    var swal2circularright = document.getElementsByClassName("swal2-success-circular-line-right");
    if (swal2circularright.length) {
        swal2circularright[0].style.background = "#40464f";
    }
    var swal2circularfix = document.getElementsByClassName("swal2-success-fix");
    if (swal2circularfix.length) {
        swal2circularfix[0].style.background = "#40464f";
    }
}

function actualizaReporteElemento(id) {
    var json = {};
    $.each(dataReportes, function (i) {
        if (dataReportes[i].id === id) {
            json = dataReportes[i];
            json.idUsuario = json.idUsuario_Movil;
            delete json.idUsuario_Movil;
            json.razonamiento = document.getElementById("razonamiento").value;
            json.idUsuario_Sys = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).idUsuario_Sys;
            json.fecha_revision = getFecha();
            json.hora_revision = getHora();
            return false;
        }
    });


    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/actualizaReporteElemento',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "id": id,
            "reporte": JSON.stringify(json),
            "folioexterno": document.getElementById("folioexterno").value
        }),
        success: function (response) {
        },
        error: function (err) {
        }
    }));
}

function IncidentesSimilares(id, latI, lngI, fecha, hora) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/IncidentesSimilares',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "id": id,
            "lat": latI,
            "lng": lngI,
            "fecha": fecha,
            "hora": hora
        }),
        success: function (response) {



        },
        error: function (err) {


        }
    }));
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


$("#notificarDependencias").submit(function (e) {
    e.preventDefault();
    var Aviso = "";
    var dependencias = document.getElementById("DependenciasID").value.split("|");
    var url = new Array();
    Aviso = "Las siguientes dependencias han sido notificadas: <br>\n";
    var notificados = "";
    for (var i = 1; i < dependencias.length; i++) {
        var dependencia = dependencias[i].split(",");
        if (document.getElementById(dependencia[0]).checked)
        {
            document.getElementById(dependencia[0]).checked = false;
            document.getElementById(dependencia[0]).disabled = true;
            document.getElementById(dependencia[0]).title = "Dependencia notificada";
            document.getElementById("span" + dependencia[0]).className = "dependenciaBloqueada";
            Aviso += "- " + dependencia[3] + "<br>";
            url.push(dependencia[2]);
            notificados += hostdir + '/' + DEPENDENCIA + "|" + dependencia[2] + ",";
        }
    }



    var id = document.getElementById("idRE").value;
    var json = {};
    $.each(dataReportes, function (i) {
        if (dataReportes[i].id === id) {
            json = dataReportes[i];
            if (json.idUsuario_Movil) {
                json.idUsuario = json.idUsuario_Movil;
            }
            json.fecha_envio = getFecha();
            json.hora_envio = getHora();
            delete json.idUsuario_Movil;
            return false;
        }
    });
    console.log("json a enviar a NotDependneciasRE---->");
    console.log(json);
    NotDependneciasRE(json, url);
    notificados = notificados.substring(0, notificados.length - 1);
    DependenciasNotificadas(notificados, json.id).then(function (response){
        
        
        
    });
    Swal.fire({
        type: 'success',
        title: "",
        html: "<p style=\"    font: bold 12px arial;    margin: 4px;    padding: 0;\">Notificaciones Automaticas</p><p style=\"color: back;font: bold 14px Arial; padding: 0; margin: 0;\">" + Aviso + "</p>",
        showConfirmButton: false,
        timer: 2000
    });
    fixAnimation();
});

function fixAnimation() {
    var swalheader = document.getElementsByClassName("swal2-header");
    if (swalheader.length) {
        swalheader[0].style.background = "#40464f";
    }
    var swalcontent = document.getElementsByClassName("swal2-content");
    if (swalcontent.length) {
        swalcontent[0].style = "border-bottom-left-radius: 10px;    background: white;    border-bottom-right-radius: 10px;    padding: 20px;";
    }
    var swaltitle = document.getElementsByClassName("swal2-title");
    if (swaltitle.length) {
        swaltitle[0].style = "max-width:20%;";
    }
    var swal2circularleft = document.getElementsByClassName("swal2-success-circular-line-left");
    if (swal2circularleft.length) {
        swal2circularleft[0].style.background = "#40464f";
    }
    var swal2circularright = document.getElementsByClassName("swal2-success-circular-line-right");
    if (swal2circularright.length) {
        swal2circularright[0].style.background = "#40464f";
    }
    var swal2circularfix = document.getElementsByClassName("swal2-success-fix");
    if (swal2circularfix.length) {
        swal2circularfix[0].style.background = "#40464f";
    }
}


function NotDependneciasRE(json, url) {
    $.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/NotDependneciasRE',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "data": JSON.stringify(json),
            "url": url
        }),
        success: function (response) {
        },
        error: function (err) {
        }
    });

}


function DependenciasNotificadas(notificados, idLlamada) {

    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/DependenciasNotificadas',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "id": idLlamada,
            "info": notificados
        }),
        success: function (response) {


        },
        error: function (err) {

        }
    }));

}




WebSocketGeneral.onmessage = function (message) {
    var mensaje = JSON.parse(message.data);
    console.log("mensaje del reporte d eincidente operativo");
    console.log(mensaje);
    try {
        if (mensaje.inicializacionSG) {
            idSocketOperador = mensaje.idSocket;
        }

        if (!Backup) {
            var json = {
                "Back": true,
                "idSocket": idSocketOperador,
                "Backup": "Backup"
            };
            EnviarMensajePorSocket(json);
            Backup = true;
        }

        if (mensaje.reporteelemento) {
            if (mensaje.Nuevo === true) {
                NotificarReporte();
            }
            insertarReportesElementos(mensaje);
        }
        if (mensaje.quitar_reporte) {
            var id = mensaje.id;
            if ($("#" + id).length) {
                $("#" + id).remove();
            }
        }
    } catch (e) {
        console.error(e);
    }
};

function playAudio() {
    var audioElement = document.createElement('audio');
    audioElement.id = "audioRE";
    // indicamos el archivo de audio a cargar
    audioElement.setAttribute('src', '/' + DEPENDENCIA + '/resources/Audio/Notificacion/notReporte.ogg');
    if (!checkCookieOperador()) {
        // Si deseamos que una vez cargado empieze a sonar...
        audioElement.setAttribute('autoplay', 'autoplay');
    }
    document.getElementById("test").appendChild(audioElement);

    setTimeout(function () {
        var audio = document.getElementById("audioRE");
        audio.parentNode.removeChild(audio);
    }, 1000);
}

function NotificarReporte() {
    $(document).ready(function () {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        });
        Toast.fire({
            type: 'info',
            title: 'Reporte Nuevo.'
        });

        $("div.swal2-container").attr("style", "margin-top: 3.5rem;margin-right: 1rem;");
        document.getElementById("swal2-content").style = "font:bold 12px Arial";
    });

    playAudio();
}