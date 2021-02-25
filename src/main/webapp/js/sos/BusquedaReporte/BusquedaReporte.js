/* global Promise, DEPENDENCIA, PathRecursos, elementosMapDinamicos, google, geocoder, DEPENDENCIA_BASE, dataG_FULL */


creaModal("Video");
creaModal("VideoGeneral");

var dataG;
var inte = new Array();
var infowindowS;
var totalRep = 0;
dataG_FULL().then(function (response) {
    dataG = response;
    console.log(dataG);
});




document.getElementById("FolioExterno").addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
        $("#BusquedaFolioExterno").click();
    }
});

$("#BusquedaFolioExterno").on("click", function () {
    if ($("#accordionReporte .card").length) {
        $("#accordionReporte .card").remove();
    }
    var FolioExterno = $("#FolioExterno").val();
    if (FolioExterno !== "") {
        document.getElementById("BusquedaFolioExterno").innerHTML = "Buscando";
        $("#BusquedaFolioExterno").prop("disabled", true);
        $("#FolioExterno").prop("disabled", true);

        agregaGif();

        BusquedaFolioExterno(FolioExterno).then(function (reportes) {
            totalRep = 0;
            console.log("reportes ---->");
            console.log(reportes);
            var repEncontrados = document.getElementById("RepEncontrados");
            repEncontrados.textContent = "Reportes encontrados";
            setTimeout(function () {
                document.getElementById("BusquedaFolioExterno").innerHTML = "Buscar";
                $("#BusquedaFolioExterno").prop("disabled", false);
                $("#FolioExterno").prop("disabled", false);
                $("#FolioExterno").val("");
                $("#loading").remove();
                if (reportes !== null) {

                    //repEncontrados.textContent = repEncontrados.textContent + ": " + reportes.length;
                    //console.log(reportes);
                    $.each(reportes, function (i) {
                        if (reportes[i].tipo_ticket === "reporteIO") {
                            insertaReportes(reportes[i]);
                        } else if (reportes[i].tipo_ticket === "llamada") {
                            insertaReportesLlamada(reportes[i]);
                        } else if (reportes[i].tipo_ticket === "llamadaS") {
                            insertaReportesLlamadaS(reportes[i]);
//                            console.log("REPORTE DE LLAMADA SALIENTE ------>");
//                            console.log(reportes[i]);
                        }

                    });
//                    console.log(totalRep);
//                    console.log(reportes.length);
                    repEncontrados.textContent = repEncontrados.textContent + ": " + (reportes.length - totalRep);
                } else {
                    repEncontrados.textContent = repEncontrados.textContent + ": 0";
                    Swal.fire({
                        type: 'error',
                        title: "",
                        html: '<h4>No se encontraron reportes con el folio: <br>' + FolioExterno + '</h4>',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    changeSwal2();
                }
            }, 1000);
        });
    } else {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
        });

        Toast.fire({
            type: '',
            html: '<p style="font:14px Arial; color:white;">Insertar un folio externo valido</p>'
        });
        document.getElementsByClassName("swal2-container")[0].style = "position: relative;     justify-content: center;";
        document.getElementById("ContainerBusquedaFolioExterno").appendChild(document.getElementsByClassName("swal2-container")[0]);
    }

});

function insertaReportes(reporte) {
    //console.log(reporte);
    var divCard = document.createElement("div");
    divCard.className = "card bg-dark";
    divCard.style = "";

    if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].hasOwnProperty("Reporte")) {
        if (Object.keys(reporte.ReporteDependencias[reporte.origen.split("/")[3]].Reporte).length === 0) {
            divCard.className = "ocultaCard";
            totalRep = totalRep + 1;
        }
    }

    var divCardHeader = document.createElement("div");
    divCardHeader.className = "card-header position-relative";
    divCardHeader.id = "cardheader" + reporte.id;
    divCardHeader.setAttribute("data-toggle", "collapse");
    divCardHeader.setAttribute("href", "#collapse" + reporte.id);

    var div = document.createElement("div");
    div.style = "width: 8px; background:#6c747d; height:100%; position:absolute; top:0; left:0;";

    divCardHeader.appendChild(div);

    var div1 = document.createElement("div");
    div1.className = "row col-12";
    var div11 = document.createElement("div");
    div11.className = "col-6";
    var h411 = document.createElement("h4");
    var div12 = document.createElement("div");
    div12.className = "col-6";
    var h612 = document.createElement("h6");

    var div2 = document.createElement("div");
    div2.className = "row col-12";
    var div21 = document.createElement("div");
    div21.className = "col-6";
    var h521 = document.createElement("h5");
    var div22 = document.createElement("div");
    div22.className = "col-6";
    var h622 = document.createElement("h6");
    h411.innerHTML = "Reporte de Incidente Operativo";
    if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].hasOwnProperty("Reporte")) {
        //if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].Reporte !== undefined && reporte.ReporteDependencias[reporte.origen.split("/")[3]].Reporte !== null) {
        if (Object.keys(reporte.ReporteDependencias[reporte.origen.split("/")[3]].Reporte).length !== 0) {
            h612.innerHTML = "Teléfono: " + reporte.ReporteDependencias[reporte.origen.split("/")[3]].Reporte.idUsuario_Movil;
            var nombre = reporte.ReporteDependencias[reporte.origen.split("/")[3]].Usuario_Movil.nombre;
            var apellidoP = reporte.ReporteDependencias[reporte.origen.split("/")[3]].Usuario_Movil.apellido_paterno;
            var apellidoM = reporte.ReporteDependencias[reporte.origen.split("/")[3]].Usuario_Movil.apellido_materno;
            h521.innerHTML = nombre + " " + apellidoP + " " + apellidoM;
            var fecha = reporte.ReporteDependencias[reporte.origen.split("/")[3]].Reporte.fecha_recepcion;
            var hora = reporte.ReporteDependencias[reporte.origen.split("/")[3]].Reporte.hora_recepcion;
            h622.innerHTML = fecha + " " + hora;
        }
    }

    div11.appendChild(h411);
    div12.appendChild(h612);
    div1.appendChild(div11);
    div1.appendChild(div12);

    div21.appendChild(h521);
    div22.appendChild(h622);
    div2.appendChild(div21);
    div2.appendChild(div22);

    divCardHeader.appendChild(div1);
    divCardHeader.appendChild(div2);
    divCard.appendChild(divCardHeader);

    var divCollapsed = document.createElement("div");
    divCollapsed.id = "collapse" + reporte.id;
    divCollapsed.className = "collapse";
    divCollapsed.setAttribute("data-parent", "#accordionReporte");

    var divCardBody = document.createElement("div");
    divCardBody.className = "card-body";
    divCardBody.id = "cardbody" + reporte.id;

    var contenedorCB = document.createElement("div");
    contenedorCB.className = "row col-12 m-0 pr-0";
    contenedorCB.style = "border: 1px solid #949494; width: 100%; height: fit-content;";
    contenedorCB.id = "contenedorCB" + reporte.id;

    var contenedorInfo = document.createElement("div");
    contenedorInfo.className = "col-9 p-0";
    contenedorInfo.id = "contenedorInfo" + reporte.id;

    var contenedorMapa = document.createElement("div");
    contenedorMapa.className = "col-3 m-0 p-3";
    contenedorMapa.style = "max-height: 30rem; min-height: 15rem;";
    contenedorMapa.id = "contenedorMapa" + reporte.id;

    var mapa = document.createElement("div");
    mapa.className = "embed-responsive-item";
    mapa.id = "map" + reporte.id;
    mapa.style = "height: 100%;";

    contenedorCB.appendChild(contenedorInfo);
    contenedorMapa.appendChild(mapa);
    contenedorCB.appendChild(contenedorMapa);
    divCardBody.appendChild(contenedorCB);
    divCollapsed.appendChild(divCardBody);
    divCard.appendChild(divCollapsed);

    document.getElementById("accordionReporte").appendChild(divCard);
    infoReporteIO(reporte);
    divCardHeader.addEventListener("click", function () {
        if (divCollapsed.className === "collapse") {
            //divCardHeader.scrollIntoView(true);
            var marker = elementosMapDinamicos[reporte.id].marker;
            var map = elementosMapDinamicos[reporte.id].map;
            if (!elementosMapDinamicos[reporte.id].hasOwnProperty("infowindow")) {
                var infowindow = new google.maps.InfoWindow({maxWidth: 300});
                //console.log("Geolocalizando ....");
                geocodeLatLngDinamico(marker, geocoder, infowindow, map);
            } else {
                //console.log("el marcador ya esta geolocalizado");
            }

        }
    });
}

function insertaReportesLlamada(reporte) {
    //console.log(reporte);

    var divCard = document.createElement("div");
    divCard.className = "card bg-dark";
    divCard.style = "";
    if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].hasOwnProperty("registro_llamada")) {
        if (Object.keys(reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada).length === 0) {
            divCard.className = "ocultaCard";
            totalRep = totalRep + 1;
        }
    }
    var divCardHeader = document.createElement("div");
    divCardHeader.className = "card-header position-relative";
    divCardHeader.id = "cardheader" + reporte.id;
    divCardHeader.setAttribute("data-toggle", "collapse");
    divCardHeader.setAttribute("href", "#collapse" + reporte.id);

    var div = document.createElement("div");
    div.style = "width: 8px; background:#0f96a8; height:100%; position:absolute; top:0; left:0;";

    divCardHeader.appendChild(div);

    var div1 = document.createElement("div");
    div1.className = "row col-12";
    var div11 = document.createElement("div");
    div11.className = "col-6";
    var h411 = document.createElement("h4");
    var div12 = document.createElement("div");
    div12.className = "col-6";
    var h612 = document.createElement("h6");

    var div2 = document.createElement("div");
    div2.className = "row col-12";
    var div21 = document.createElement("div");
    div21.className = "col-6";
    var h521 = document.createElement("h5");
    var div22 = document.createElement("div");
    div22.className = "col-6";
    var h622 = document.createElement("h6");

    if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].hasOwnProperty("registro_llamada")) {
        //if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada !== null && reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada !== undefined) {
        if (Object.keys(reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada).length !== 0) {
            h411.innerHTML = reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada.Modo_Llamada;
            h612.innerHTML = "Teléfono: " + reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada.Usuarios_Movil_idUsuarios_Movil;
            var fecha = reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada.fecha;
            var hora = reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada.hora;
            h622.innerHTML = fecha + " " + hora;
        }

    }

    var nombre = reporte.ReporteDependencias[reporte.origen.split("/")[3]].nombre;
    var apellidoP = reporte.ReporteDependencias[reporte.origen.split("/")[3]].apellido_paterno;
    var apellidoM = reporte.ReporteDependencias[reporte.origen.split("/")[3]].apellido_materno;
    if (nombre !== null && nombre !== undefined) {
        h521.innerHTML = nombre + " " + apellidoP + " " + apellidoM;
    } else {
        if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].hasOwnProperty("registro_llamada")) {
            //if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada !== null && reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada !== undefined) {
            if (Object.keys(reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada).length !== 0) {
                var integrante = BuscarIntegranteDataG(reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada.Usuarios_Movil_idUsuarios_Movil);
                if (integrante !== null) {
                    h521.innerHTML = integrante.nombre + " " + integrante.apellido_paterno + " " + integrante.apellido_materno;
                } else {
                    ConsultaIntegrante(reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada.Usuarios_Movil_idUsuarios_Movil).then(function (response) {
                        if (response.hasOwnProperty("idUsuarios_Movil")) {
                            h521.innerHTML = response.nombre + " " + response.apellido_paterno + " " + response.apellido_materno;
                        }
                    });
                }
            }

        }
    }




    div11.appendChild(h411);
    div12.appendChild(h612);
    div1.appendChild(div11);
    div1.appendChild(div12);

    div21.appendChild(h521);
    div22.appendChild(h622);
    div2.appendChild(div21);
    div2.appendChild(div22);

    divCardHeader.appendChild(div1);
    divCardHeader.appendChild(div2);
    divCard.appendChild(divCardHeader);

    var divCollapsed = document.createElement("div");
    divCollapsed.id = "collapse" + reporte.id;
    divCollapsed.className = "collapse";
    divCollapsed.setAttribute("data-parent", "#accordionReporte");

    var divCardBody = document.createElement("div");
    divCardBody.className = "card-body";
    divCardBody.id = "cardbody" + reporte.id;

    var contenedorCB = document.createElement("div");
    contenedorCB.className = "row col-12 m-0 pr-0";
    contenedorCB.style = "border: 1px solid #949494; width: 100%; height: fit-content;";
    contenedorCB.id = "contenedorCB" + reporte.id;

    var contenedorVideo = document.createElement("div");
    contenedorVideo.className = "col-sm-12 col-md-4 mt-3 p-0";
    contenedorVideo.id = "contenedorVideo" + reporte.id;

    var contenedorRepLlamada = document.createElement("div");
    contenedorRepLlamada.className = "col-sm-8 col-md-5  p-0 mt-3";
    contenedorRepLlamada.id = "contenedorRepLlamada" + reporte.id;


    var contenedorMapa = document.createElement("div");
    contenedorMapa.className = "col-sm-4 col-md-3 m-0 p-3";
    contenedorMapa.style = "max-height: 30rem;  min-height: 15rem;";
    contenedorMapa.id = "contenedorMapa" + reporte.id;

    var mapa = document.createElement("div");
    mapa.className = "embed-responsive-item";
    mapa.id = "map" + reporte.id;
    mapa.style = "height: 100%;";

    contenedorCB.appendChild(contenedorVideo);
    contenedorCB.appendChild(contenedorRepLlamada);
    contenedorMapa.appendChild(mapa);
    contenedorCB.appendChild(contenedorMapa);
    divCardBody.appendChild(contenedorCB);
    divCollapsed.appendChild(divCardBody);
    divCard.appendChild(divCollapsed);

    document.getElementById("accordionReporte").appendChild(divCard);

    infoReporteLlamada(reporte);

    divCardHeader.addEventListener("click", function () {
        if (divCollapsed.className === "collapse") {
            //divCardHeader.scrollIntoView(true);
            var marker = elementosMapDinamicos[reporte.id].marker;
            var map = elementosMapDinamicos[reporte.id].map;
            if (!elementosMapDinamicos[reporte.id].hasOwnProperty("infowindow")) {
                var infowindow = new google.maps.InfoWindow({maxWidth: 300});
                //console.log("Geolocalizando ....");
                geocodeLatLngDinamico(marker, geocoder, infowindow, map);
            } else {
                //console.log("el marcador ya esta geolocalizado");
            }

        }
    });
}
function insertaReportesLlamadaS(reporte) {
    //console.log(reporte);
    var divCard = document.createElement("div");
    divCard.className = "card bg-dark";
    divCard.style = "";

    var divCardHeader = document.createElement("div");
    divCardHeader.className = "card-header position-relative";
    divCardHeader.id = "cardheader" + reporte.id;
    divCardHeader.setAttribute("data-toggle", "collapse");
    divCardHeader.setAttribute("href", "#collapse" + reporte.id);

    var div = document.createElement("div");
    div.style = "width: 8px; background:#ff8200; height:100%; position:absolute; top:0; left:0;";

    divCardHeader.appendChild(div);

    var div1 = document.createElement("div");
    div1.className = "row col-12";
    var div11 = document.createElement("div");
    div11.className = "col-6";
    var h411 = document.createElement("h4");
    var div12 = document.createElement("div");
    div12.className = "col-6";
    var h612 = document.createElement("h6");

    var div2 = document.createElement("div");
    div2.className = "row col-12";
    var div21 = document.createElement("div");
    div21.className = "col-6";
    var h521 = document.createElement("h5");
    var div22 = document.createElement("div");
    div22.className = "col-6";
    var h622 = document.createElement("h6");


    h411.innerHTML = reporte.ReporteDependencias[reporte.origen.split("/")[3]].Modo_Llamada.nombre;
    //h612.innerHTML = "Teléfono: " + reporte.ReporteDependencias[DEPENDENCIA].registro_llamada.Usuarios_Movil_idUsuarios_Movil;
    var nombre = reporte.ReporteDependencias[reporte.origen.split("/")[3]].Usuario_Sys.nombre;
    var apellidos = reporte.ReporteDependencias[reporte.origen.split("/")[3]].Usuario_Sys.apellidos;
    h521.innerHTML = nombre + " " + apellidos;
    var fecha = reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente.fecha_notificacion;
    var hora = reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente.hora_notificacion;
    h622.innerHTML = fecha + " " + hora;


    div11.appendChild(h411);
    div12.appendChild(h612);
    div1.appendChild(div11);
    div1.appendChild(div12);

    div21.appendChild(h521);
    div22.appendChild(h622);
    div2.appendChild(div21);
    div2.appendChild(div22);

    divCardHeader.appendChild(div1);
    divCardHeader.appendChild(div2);
    divCard.appendChild(divCardHeader);

    var divCollapsed = document.createElement("div");
    divCollapsed.id = "collapse" + reporte.id;
    divCollapsed.className = "collapse";
    divCollapsed.setAttribute("data-parent", "#accordionReporte");

    var divCardBody = document.createElement("div");
    divCardBody.className = "card-body";
    divCardBody.id = "cardbody" + reporte.id;

    var contenedorCB = document.createElement("div");
    contenedorCB.className = "row col-12 m-0 pr-0";
    contenedorCB.style = "border: 1px solid #949494; width: 100%; height: fit-content;";
    contenedorCB.id = "contenedorCB" + reporte.id;

    var contenedorVideo = document.createElement("div");
    contenedorVideo.className = "col-sm-12 col-md-4 m-0 p-0 mt-3";
    contenedorVideo.id = "contenedorVideo" + reporte.id;

    var contenedorRepLlamada = document.createElement("div");
    contenedorRepLlamada.className = "col-sm-8 col-md-5  p-0 mt-3";
    contenedorRepLlamada.id = "contenedorRepLlamada" + reporte.id;


    var contenedorMapa = document.createElement("div");
    contenedorMapa.className = "col-sm-4 col-md-3 m-0 p-3";
    contenedorMapa.style = "max-height: 30rem; min-height: 15rem;";
    contenedorMapa.id = "contenedorMapa" + reporte.id;

    var mapa = document.createElement("div");
    mapa.className = "embed-responsive-item";
    mapa.id = "map" + reporte.id;
    mapa.style = "height: 100%;";

    contenedorCB.appendChild(contenedorVideo);
    contenedorCB.appendChild(contenedorRepLlamada);
    contenedorMapa.appendChild(mapa);
    contenedorCB.appendChild(contenedorMapa);
    divCardBody.appendChild(contenedorCB);
    divCollapsed.appendChild(divCardBody);
    divCard.appendChild(divCollapsed);

    document.getElementById("accordionReporte").appendChild(divCard);

    infoReporteLlamadaS(reporte);

    divCardHeader.addEventListener("click", function () {
        if (divCollapsed.className === "collapse") {
            //divCardHeader.scrollIntoView(true);
            var notificados = elementosMapDinamicos[reporte.id].notificados;
            var map = elementosMapDinamicos[reporte.id].map;
            infowindowS = new google.maps.InfoWindow({});
            $.each(notificados, function (i) {
                var id = notificados[i].id;
                //console.log(elementosMapDinamicos[reporte.id].hasOwnProperty("marker" + id));
                //if (elementosMapDinamicos[reporte.id].hasOwnProperty("marker" + id)) {
                if (!elementosMapDinamicos[reporte.id]["marker" + id].map) {
                    elementosMapDinamicos[reporte.id]["marker" + id].setMap(map);
                }
                setInfoWindow(elementosMapDinamicos[reporte.id]["marker" + id], notificados[i].idUsuarios_Movil, map);
                //}
            });
            ZoomAndCenterLlamadaS(elementosMapDinamicos[reporte.id].notificados, map);

        } else {
            infowindowS.close();
        }
    });
}

function agregaGif() {
    var loadingPage = PathRecursos + 'gif/Magnify.gif';
    var loading = document.createElement("div");
    loading.id = "loading";
    loading.style = "background-color:rgba(245, 255, 255, 0.7); position: absolute; width: 100%; height: 100%;";
    var loadingGif = document.createElement("img");
    loadingGif.src = loadingPage;
    loadingGif.style = "position: absolute; width: 10%; top:35%; left:44%";
    loading.appendChild(loadingGif);
    document.getElementById("ContenidoLlamadas").appendChild(loading);
}

function BusquedaFolioExterno(FolioExterno) {
    var json = {};
//    if (JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).hasOwnProperty("tipo_usuario") && JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).hasOwnProperty("tipo_servicio")) {
//        json = {
//            "folioexterno": FolioExterno,
//            "url": window.location.host,
//            "tipo_usuario": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
//            "tipo_servicio": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio
//        };
//    } else {
        json = {
            "folioexterno": FolioExterno,
            "url": window.location.host
        };
//    }
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/BusquedaFolioExterno',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(json),
        success: function (response) {
        },
        error: function (err) {
            var repEncontrados = document.getElementById("RepEncontrados");
            repEncontrados = "Reportes encontrados:";
            repEncontrados.textContent = repEncontrados.textContent + ": 0";
            Swal.fire({
                type: 'error',
                title: "",
                html: '<h4>No se encontraron reportes con el folio: <br>' + FolioExterno + '</h4>',
                showConfirmButton: false,
                timer: 3000
            });
            changeSwal2();
            document.getElementById("BusquedaFolioExterno").innerHTML = "Buscar";
            $("#BusquedaFolioExterno").prop("disabled", false);
            $("#FolioExterno").prop("disabled", false);
            $("#FolioExterno").val("");
            $("#loading").remove();
        }
    }));
}


function BusquedaPorFecha(Fecha) {
    //document.getElementById("collapseResultados").className="collapse show";
    var json = {};
    if (JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).hasOwnProperty("tipo_usuario") && JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).hasOwnProperty("tipo_servicio")) {
        json = {
            "fecha": Fecha,
            "idUser": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).idUsuario_Sys,
            "fecha_de_busqueda": getFecha(),
            "hora_de_busqueda": getHora(),
            "usuario": false,
            "atendidas": false,
            "perdidas": false,
            "sigiloso": false,
            "video": false,
            "voz": false,
            "chat": false,
            "tipo_usuario": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
            "tipo_servicio": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio
        };
    } else {
        json = {
            "fecha": Fecha,
            "idUser": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).idUsuario_Sys,
            "fecha_de_busqueda": getFecha(),
            "hora_de_busqueda": getHora(),
            "usuario": false,
            "atendidas": false,
            "perdidas": false,
            "sigiloso": false,
            "video": false,
            "voz": false,
            "chat": false
        };
    }
    for (var i = 1; i <= 7; i++) {
        if (document.getElementById("i" + i).checked) {
            switch (i) {
                case 1:
                    json.usuario = true;
                    break;
                case 2:
                    json.atendidas = true;
                    break;
                case 3:
                    json.perdidas = true;
                    break;
                case 4:
                    json.sigiloso = true;
                    break;
                case 5:
                    json.video = true;
                    break;
                case 6:
                    json.voz = true;
                    break;
                case 7:
                    json.chat = true;
                    break;
                default:
                    break;
            }
        }
    }

//    if (isNaN(modo)) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/BusquedaPorFecha',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(json),
        success: function (response) {
        },
        error: function (err) {
            console.error("BusquedaPorFecha");
            var repEncontrados = document.getElementById("RepEncontrados");
            repEncontrados.textContent = repEncontrados.textContent + ": 0";
            Swal.fire({
                type: 'error',
                title: "",
                html: '<h4>No se encontraron reportes de la fecha: <br>' + Fecha + '</h4>',
                showConfirmButton: false,
                timer: 3000
            });
            changeSwal2();
        }
    }));

}

var fechaActual = getFecha();
document.getElementById("dateformated").value = fechaActual;
var fechaArray = fechaActual.split("-");
var fechaelegida = "";

var $input = $('#button__api-open-close').pickadate({
    format: 'Resulta!dos !del !día: dddd, dd !de mmmm !de yyyy',
    formatSubmit: 'yyyy-mm-dd',
    hiddenPrefix: 'prefix-',
    hiddenSuffix: '-suffix',
    min: new Date(2019, 4, 5),
    max: new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2]),
    today: false,
    clear: false,
    close: false,
    onOpen: function () {
//        console.log("onOpen");
    },
    onClose: function () {
//        console.log("onClose");
        if ($("#loading").length) {
//            console.log("eliminando loading");
            $("#loading").remove();
        }
        if ($("#accordionReporte .card").length) {
            $("#accordionReporte .card").remove();
        }
        if (fechaelegida !== document.getElementsByName("prefix--suffix")[0].value && document.getElementsByName("prefix--suffix")[0].value !== "") {
            fechaelegida = document.getElementsByName("prefix--suffix")[0].value;
            document.getElementById("dateformated").value = document.getElementsByName("prefix--suffix")[0].value;
            agregaGif();
            BusquedaPorFecha(fechaelegida).then(function (reportes) {
//                console.log("reportes ---->");
                var rep2 = reportes;
//                console.log(rep2);
                var repEncontrados = document.getElementById("RepEncontrados");
                repEncontrados.textContent = "Reportes encontrados";
                setTimeout(function () {
                    document.getElementById("BusquedaFolioExterno").innerHTML = "Buscar";
                    $("#BusquedaFolioExterno").prop("disabled", false);
                    $("#FolioExterno").prop("disabled", false);
                    $("#FolioExterno").val("");
                    $("#loading").remove();
                    if (reportes !== null && reportes.length > 0) {

                        repEncontrados.textContent = repEncontrados.textContent + ": " + reportes.length;
                        //console.log(reportes);
                        $.each(reportes, function (i) {
                            if (reportes[i].tipo_ticket === "reporteIO") {
                                insertaReportes(reportes[i]);
                            } else if (reportes[i].tipo_ticket === "llamada") {
                                insertaReportesLlamada(reportes[i]);
                            } else if (reportes[i].tipo_ticket === "llamadaS") {
                                insertaReportesLlamadaS(reportes[i]);
                            }

                        });
                    } else {
                        repEncontrados.textContent = repEncontrados.textContent + ": 0";
                        Swal.fire({
                            type: 'error',
                            title: "",
                            html: '<h4>No se encontraron reportes de la fecha: <br>' + fechaelegida + '</h4>',
                            showConfirmButton: false,
                            timer: 3000
                        });
                        changeSwal2();
                    }
                }, 1000);
            });
        }
    },
    onRender: function () {
//        console.log("onRender");
    },
    onStart: function () {
//        console.log("onStart");
    },
    onStop: function () {
//        console.log("onStop");
    },
    onSet: function () {
//        console.log("onSet");
    }
});

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


function infoReporteIO(reporte) {


    var divQue = document.createElement("div");
    divQue.className = "row col-12 mt-3 mb-3 p-0";
    var labelQue = document.createElement("label");
    labelQue.className = "col-1 pr-0";
    labelQue.innerHTML = "¿Qué?";
    var textareaQue = document.createElement("textarea");
    textareaQue.className = "col-10 textareaBR";
    textareaQue.setAttribute("rows", "4");
    textareaQue.setAttribute("cols", "50");
    textareaQue.setAttribute("disabled", "true");
    //textareaQue.style = "background: transparent; color: white; border-top: none; border-left: none; border-right: none; margin-top: 0px; margin-bottom: 0px;";


    var divQuien = document.createElement("div");
    divQuien.className = "row col-12 mt-3 mb-3 p-0";
    var labelQuien = document.createElement("label");
    labelQuien.className = "col-1 pr-0";
    labelQuien.innerHTML = "¿Quien?";
    var textareaQuien = document.createElement("textarea");
    textareaQuien.className = "col-10 textareaBR";
    textareaQuien.setAttribute("rows", "4");
    textareaQuien.setAttribute("cols", "50");
    textareaQuien.setAttribute("disabled", "true");
    //textareaQuien.style = "background: transparent; color: white; border-top: none; border-left: none; border-right: none; margin-top: 0px; margin-bottom: 0px;";


    var divCuando = document.createElement("div");
    divCuando.className = "row col-12 mt-3 mb-3 p-0";
    var labelCuando = document.createElement("label");
    labelCuando.className = "col-1 pr-0";
    labelCuando.innerHTML = "¿Cuando?";
    var textareaCuando = document.createElement("textarea");
    textareaCuando.className = "col-10 textareaBR";
    textareaCuando.setAttribute("rows", "4");
    textareaCuando.setAttribute("cols", "50");
    textareaCuando.setAttribute("disabled", "true");
    //textareaCuando.style = "background: transparent; color: white; border-top: none; border-left: none; border-right: none; margin-top: 0px; margin-bottom: 0px;";


    var divDonde = document.createElement("div");
    divDonde.className = "row col-12 mt-3 mb-3 p-0";
    var labelDonde = document.createElement("label");
    labelDonde.className = "col-1 pr-0";
    labelDonde.innerHTML = "¿Donde?";
    var textareaDonde = document.createElement("textarea");
    textareaDonde.className = "col-10 textareaBR";
    textareaDonde.setAttribute("rows", "4");
    textareaDonde.setAttribute("cols", "50");
    textareaDonde.setAttribute("disabled", "true");
    //textareaDonde.style = "background: transparent; color: white; border-top: none; border-left: none; border-right: none; margin-top: 0px; margin-bottom: 0px;";

    var divInformacionAdicional = document.createElement("div");
    divInformacionAdicional.className = "row col-12 mt-3 mb-3 p-0";
    var labelInformacionAdicional = document.createElement("label");
    labelInformacionAdicional.className = "col-1 pr-0";
    labelInformacionAdicional.innerHTML = "Información Adicional";
    var textareaInformacionAdicional = document.createElement("textarea");
    textareaInformacionAdicional.className = "col-10 textareaBR";
    textareaInformacionAdicional.setAttribute("rows", "4");
    textareaInformacionAdicional.setAttribute("cols", "50");
    textareaInformacionAdicional.setAttribute("disabled", "true");
    //textareaInformacionAdicional.style = "background: transparent; color: white; border-top: none; border-left: none; border-right: none; margin-top: 0px; margin-bottom: 0px;";



    if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].hasOwnProperty("Reporte")) {
        //if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].Reporte !== undefined && reporte.ReporteDependencias[reporte.origen.split("/")[3]].Reporte !== null) {
        if (Object.keys(reporte.ReporteDependencias[reporte.origen.split("/")[3]].Reporte).length !== 0) {
            textareaQue.innerHTML = reporte.ReporteDependencias[reporte.origen.split("/")[3]].Reporte.que;
            textareaQuien.innerHTML = reporte.ReporteDependencias[reporte.origen.split("/")[3]].Reporte.quien;
            textareaCuando.innerHTML = reporte.ReporteDependencias[reporte.origen.split("/")[3]].Reporte.cuando;
            textareaDonde.innerHTML = reporte.ReporteDependencias[reporte.origen.split("/")[3]].Reporte.donde;
            textareaInformacionAdicional.innerHTML = reporte.ReporteDependencias[reporte.origen.split("/")[3]].Reporte.informacionadicional;
            initMapDinamico(reporte.ReporteDependencias[reporte.origen.split("/")[3]].Reporte.idUsuario_Movil, reporte.id, reporte.ReporteDependencias[reporte.origen.split("/")[3]].Reporte.latincidente, reporte.ReporteDependencias[reporte.origen.split("/")[3]].Reporte.lngincidente);
        }
    }

    divQue.appendChild(labelQue);
    divQue.appendChild(textareaQue);

    divQuien.appendChild(labelQuien);
    divQuien.appendChild(textareaQuien);

    divCuando.appendChild(labelCuando);
    divCuando.appendChild(textareaCuando);

    divDonde.appendChild(labelDonde);
    divDonde.appendChild(textareaDonde);

    divInformacionAdicional.appendChild(labelInformacionAdicional);
    divInformacionAdicional.appendChild(textareaInformacionAdicional);

    document.getElementById("contenedorInfo" + reporte.id).appendChild(divQue);
    document.getElementById("contenedorInfo" + reporte.id).appendChild(divQuien);
    document.getElementById("contenedorInfo" + reporte.id).appendChild(divCuando);
    document.getElementById("contenedorInfo" + reporte.id).appendChild(divDonde);
    document.getElementById("contenedorInfo" + reporte.id).appendChild(divInformacionAdicional);

    creaSeparador(reporte.id);
    razonamientoDependencias(reporte);

}

function infoReporteLlamada(reporte) {
//    console.log("infoReporteLlamada");
//    console.log(reporte);
    var video = document.createElement("video");
    video.src = reporte.ruta_video.url;
    video.id = "videoG" + reporte.id;
    video.className = "col-12";
    video.setAttribute("controls", "true");
    document.getElementById("contenedorVideo" + reporte.id).appendChild(video);

//    console.log("despues del video");

    muestra_videoG(reporte.id);

    var divC = document.createElement("div");
    divC.className = "col-12 h-100 text-left";

    var pEF = document.createElement("p");
    var strongEF = document.createElement("strong");
    strongEF.innerHTML = "Estado de la llamada: ";
    pEF.appendChild(strongEF);
    var pEF2 = document.createElement("p");
    var MF = "";
    if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].hasOwnProperty("registro_llamada")) {
        //if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada !== undefined && reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada !== null) {
        if (Object.keys(reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada).length)
            if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada.hasOwnProperty("Modo_Llamada_Finalizada")) {
                if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada.Modo_Llamada_Finalizada !== undefined && reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada.Modo_Llamada_Finalizada !== null) {
                    MF = reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada.Modo_Llamada_Finalizada;
                }
            }
    }

    pEF2.style = "display: -webkit-inline-box;";
    pEF2.innerHTML = MF;

    var pTE = document.createElement("p");
    var strongTE = document.createElement("strong");
    strongTE.innerHTML = "Tipo de emergencia: ";
    pTE.appendChild(strongTE);
    var pTE2 = document.createElement("p");
    var TE = reporte.ReporteDependencias[reporte.origen.split("/")[3]].reporte_llamada.temergencia;
    pTE2.style = "display: -webkit-inline-box;";
    if (!MF.includes("no atendida")) {
        if (TE !== undefined && TE !== null) {
            pTE2.innerHTML = TE;
        } else {
            pTE2.innerHTML = "No se establecio una emergencia";
        }

    } else {
        pTE2.innerHTML = "La llamada no fue atendida";
    }

    var pPrio = document.createElement("p");
    var strongPrio = document.createElement("strong");
    strongPrio.innerHTML = "Prioridad: ";
    pPrio.appendChild(strongPrio);
    var pPrio2 = document.createElement("p");
    var Prio = reporte.ReporteDependencias[reporte.origen.split("/")[3]].reporte_llamada.prioridad;
    pPrio2.style = "display: -webkit-inline-box;";
    if (!MF.includes("no atendida")) {
        if (Prio !== undefined && Prio !== null) {
            pPrio2.innerHTML = Prio;
        } else {
            pPrio2.innerHTML = "Sin prioridad";
        }

    } else {
        pPrio2.innerHTML = "La llamada no fue atendida";
    }


    var pDL = document.createElement("p");
    pDL.style = "font: bold 13px Arial;";
    pDL.innerHTML = "Descripción del lugar:";
    var pDL2 = document.createElement("p");
    var DL = reporte.ReporteDependencias[reporte.origen.split("/")[3]].reporte_llamada.descripcionLugar;
    if (!MF.includes("no atendida")) {
        if (DL !== null && DL !== "" && DL !== undefined) {
            pDL2.innerHTML = DL;
        } else {
            pDL2.innerHTML = "No se guardo una descripción del evento.";
        }

    } else {
        pDL2.innerHTML = "La llamada no fue atendida";
    }

    var pR = document.createElement("p");
    pR.style = "font: bold 13px Arial;";
    pR.innerHTML = "Reporte:";
    var pR2 = document.createElement("p");
    var Rep = reporte.ReporteDependencias[reporte.origen.split("/")[3]].reporte_llamada.reporte;
    if (!MF.includes("no atendida")) {
        if (Rep !== null && Rep !== "" && Rep !== undefined) {
            pR2.innerHTML = Rep;
        } else {
            pR2.innerHTML = "No se guardo un reporte del evento.";
        }
    } else {
        pR2.innerHTML = "La llamada no fue atendida";
    }

    pEF.appendChild(pEF2);
    divC.appendChild(pEF);
    pTE.appendChild(pTE2);
    divC.appendChild(pTE);
    pPrio.appendChild(pPrio2);
    divC.appendChild(pPrio);
    divC.appendChild(pDL);
    divC.appendChild(pDL2);
    divC.appendChild(pR);
    divC.appendChild(pR2);

    if (DEPENDENCIA_BASE) {
        var pFE = document.createElement("p");
        pFE.style = "font: bold 13px Arial;";
        pFE.innerHTML = "Folio Externo:";
        var pFE2 = document.createElement("p");
        var FolioExterno = reporte.ReporteDependencias[reporte.origen.split("/")[3]].reporte_llamada.folioexterno;
        if (!MF.includes("no atendida")) {
            if (FolioExterno !== null && Rep !== "" && FolioExterno !== undefined) {
                pFE2.innerHTML = FolioExterno;
            } else {
                pFE2.innerHTML = "No se guardo un folio externo del evento.";
            }
        } else {
            pFE2.innerHTML = "La llamada no fue atendida";
        }
        pFE.appendChild(pFE2);
        divC.appendChild(pFE);
    } else {
        var pRaz = document.createElement("p");
        pRaz.style = "font: bold 13px Arial;";
        pRaz.innerHTML = "Razonamiento:";
        var pRaz2 = document.createElement("p");
        var Razonamiento = reporte.ReporteDependencias[reporte.origen.split("/")[3]].reporte_llamada.razonamiento;
        if (!MF.includes("no atendida")) {
            if (Razonamiento !== null && Razonamiento !== "" && Razonamiento !== undefined) {
                pRaz2.innerHTML = Razonamiento;
            } else {
                pRaz2.innerHTML = "No se guardo un razonamiento del evento.";
            }
        } else {
            pRaz2.innerHTML = "La llamada no fue atendida";
        }
        pRaz.appendChild(pRaz2);
        divC.appendChild(pRaz);
    }



    document.getElementById("contenedorRepLlamada" + reporte.id).appendChild(divC);
    creaSeparador(reporte.id);
    if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].hasOwnProperty("registro_llamada")) {
        if (Object.keys(reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada).length !== 0) {
            if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada.Usuarios_Movil_idUsuarios_Movil !== null && reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada.Usuarios_Movil_idUsuarios_Movil !== undefined) {
                initMapDinamico(reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada.Usuarios_Movil_idUsuarios_Movil, reporte.id, reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada.latitud, reporte.ReporteDependencias[reporte.origen.split("/")[3]].registro_llamada.longitud);
            }
        }
    }

    Dependencias(reporte);
}

function infoReporteLlamadaS(reporte) {
//    console.log(reporte);
    var video = document.createElement("video");
    video.src = reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente.ruta_video;
    video.id = "videoG" + reporte.id;
    video.className = "col-12";
    video.setAttribute("controls", "true");
    document.getElementById("contenedorVideo" + reporte.id).appendChild(video);

    muestra_videoG(reporte.id);

    var divC = document.createElement("div");
    divC.className = "col-12 h-100 text-justify";

    var reportes = reporte.ReporteDependencias[reporte.origen.split("/")[3]].Reportes;
    $.each(reportes, function (i) {
        var pFE = document.createElement("p");
        var strongFE = document.createElement("strong");
        strongFE.innerHTML = "Folio Externo: ";
        pFE.appendChild(strongFE);
        var pFE2 = document.createElement("p");
        var FE = reportes[i].folioexterno;
        pFE2.style = "display: -webkit-inline-box;";
        pFE2.innerHTML = FE;

        var pTE = document.createElement("p");
        var strongTE = document.createElement("strong");
        strongTE.innerHTML = "Tipo de emergencia: ";
        pTE.appendChild(strongTE);
        var pTE2 = document.createElement("p");
        var TE = reportes[i].temergencia;
        pTE2.style = "display: -webkit-inline-box;";
        if (TE !== null & TE !== undefined) {
            pTE2.innerHTML = TE;
        } else {
            pTE2.innerHTML = "No se establecio una emergencia";
        }


        var pR = document.createElement("p");
        pR.style = "font: bold 13px Arial;";
        pR.innerHTML = "Reporte:";
        var pR2 = document.createElement("p");
        var Rep = reportes[i].reporte;
        if (Rep !== null && Rep !== "" && Rep !== undefined) {
            pR2.innerHTML = Rep;
        } else {
            pR2.innerHTML = "No se guardo un reporte del evento.";
        }

        pFE.appendChild(pFE2);
        divC.appendChild(pFE);
        pTE.appendChild(pTE2);
        divC.appendChild(pTE);
        divC.appendChild(pR);
        divC.appendChild(pR2);

    });

    var pNot = document.createElement("p");
    pNot.innerHTML = "Notificación: " + reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente.fecha_notificacion + " " + reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente.hora_notificacion;
    var pCon = document.createElement("p");
    if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].hasOwnProperty("LlamadaSaliente")) {
        if (Object.keys(reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente).length !== 0) {
            if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente.hora_conexion !== null && reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente.hora_conexion !== "" && reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente.hora_conexion !== undefined) {
                pCon.innerHTML = "Conexión: " + reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente.hora_conexion;
            } else {
                pCon.innerHTML = "Conexión: No se pudo establecer una conexión entre el operador y los usuarios.";
            }
        } else {
            pCon.innerHTML = "Conexión: No se pudo establecer una conexión entre el operador y los usuarios.";
        }
    }
    var pRecepcion = document.createElement("p");
    if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].hasOwnProperty("LlamadaSaliente")) {
        if (Object.keys(reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente).length !== 0) {
            if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente.hora_recepcion !== null && reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente.hora_recepcion !== "" && reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente.hora_recepcion !== undefined) {
                pRecepcion.innerHTML = "Recepción: " + reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente.hora_recepcion;
            } else {
                pRecepcion.innerHTML = "Recepción: El operador no recibió respuesta de los usuarios.";
            }
        } else {
            pRecepcion.innerHTML = "Recepción: El operador no recibió respuesta de los usuarios.";
        }
    }

    var pDeconexion = document.createElement("p");
    if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].hasOwnProperty("LlamadaSaliente")) {
        if (Object.keys(reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente).length !== 0) {
            if (reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente.hora_desconexion !== null && reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente.hora_desconexion !== "" && reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente.hora_desconexion !== undefined) {
                pDeconexion.innerHTML = "Desconexión: " + reporte.ReporteDependencias[reporte.origen.split("/")[3]].LlamadaSaliente.hora_desconexion;
            } else {
                pDeconexion.innerHTML = "Desconexión: El operador no se desconecto de manera correcta.";
            }
        } else {
            pDeconexion.innerHTML = "Desconexión: El operador no se desconecto de manera correcta.";
        }
    }


    divC.appendChild(pNot);
    divC.appendChild(pCon);
    divC.appendChild(pRecepcion);
    divC.appendChild(pDeconexion);

    document.getElementById("contenedorRepLlamada" + reporte.id).appendChild(divC);
    creaSeparador(reporte.id);

    initMapLlamadasS(reporte.id);
    var notificados = reporte.ReporteDependencias[reporte.origen.split("/")[3]].Notificados;
    $.each(notificados, function (i) {
        var lat;
        var lng;
        if (notificados[i].lat_conexion !== null && notificados[i].lat_conexion !== "" && notificados[i].lng_conexion !== null && notificados[i].lng_conexion !== "") {
            if (notificados[i].lat_desconexion !== null && notificados[i].lat_desconexion !== "" && notificados[i].lng_desconexion !== null && notificados[i].lng_desconexion !== "") {
                lat = parseFloat(notificados[i].lat_desconexion);
                lng = parseFloat(notificados[i].lng_desconexion);
            } else {
                lat = parseFloat(notificados[i].lat_conexion);
                lng = parseFloat(notificados[i].lng_conexion);
            }
            var ubicacion = {lat: lat, lng: lng};
            var integrante = BuscarIntegranteDataG(notificados[i].idUsuarios_Movil);
            var icon;
            if (integrante === null) {
                ConsultaIntegrante(notificados[i].idUsuarios_Movil).then(function (response) {
                    if (response.hasOwnProperty("idUsuarios_Movil")) {
                        integrante = response;
                    }
                });
            }
            notificados[i].lat = lat;
            notificados[i].lng = lng;
            inte.push(notificados[i]);


            var marker = new google.maps.Marker({
                position: ubicacion,
                id: notificados[i].id,
                icon: icon
            });
            elementosMapDinamicos[reporte.id]["marker" + notificados[i].id] = marker;
        }

    });
    elementosMapDinamicos[reporte.id].notificados = inte;
    inte = new Array();
    Notificados(reporte);
}


function creaSeparador(id) {
    var div = document.createElement("div");
    div.className = "row col-12 m-0";

    var hr = document.createElement("hr");
    hr.className = "col-12 p-0 w-100";
    hr.style = "border: 0.8px solid #949494;";

    div.appendChild(hr);
    document.getElementById("contenedorCB" + id).appendChild(div);
}

function razonamientoDependencias(reporte) {

//    console.log("///////////////////////////////////");
//    console.log(DEPENDENCIA);
//    console.log(reporte);
    var repOrigen = reporte.ReporteDependencias[reporte.origen.split("/")[3]];
    repOrigen.dependencias = reporte.dependencias;
    repOrigen.dependencia = reporte.origen.split("/")[3];
    repOrigen.alias = reporte.alias;
    repOrigen.id = reporte.id;

//    console.log(repOrigen);


    //delete reporte.ReporteDependencias[reporte.origen.split("/")[3]];
    var keys = Object.keys(reporte.ReporteDependencias);
    keys = keys.sort();
    insertaRazonamiento(repOrigen);
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] !== DEPENDENCIA) {
            reporte.ReporteDependencias[keys[i]].id = reporte.id;
            reporte.ReporteDependencias[keys[i]].dependencia = keys[i];
            insertaRazonamiento(reporte.ReporteDependencias[keys[i]]);
        }

    }
}

function Dependencias(reporte) {
//    console.log("///////////////////////////////////");
//    console.log(DEPENDENCIA);
//    console.log(reporte);
    var repOrigen = reporte.ReporteDependencias[reporte.origen.split("/")[3]];
    repOrigen.dependencias = reporte.dependencias;
    repOrigen.dependencia = reporte.origen.split("/")[3];
    repOrigen.alias = reporte.alias;
    repOrigen.id = reporte.id;

//    console.log(repOrigen);


    //delete reporte.ReporteDependencias[reporte.origen.split("/")[3]];
    var keys = Object.keys(reporte.ReporteDependencias);
    keys = keys.sort();
    insertaInfoDepLlamada(repOrigen);

    for (var i = 0; i < keys.length; i++) {
//        console.log(keys[i]);
        if (keys[i] !== DEPENDENCIA) {
            reporte.ReporteDependencias[keys[i]].id = reporte.id;
            reporte.ReporteDependencias[keys[i]].dependencia = keys[i];
            insertaInfoDepLlamada(reporte.ReporteDependencias[keys[i]]);
        }
    }
}

function Notificados(reporte) {
    var notificados = reporte.ReporteDependencias[reporte.origen.split("/")[3]].Notificados;
    $.each(notificados, function (i) {

        var integrante = BuscarIntegranteDataG(notificados[i].idUsuarios_Movil);
        var divContenedor = document.createElement("div");
        var divIzq = document.createElement("div");
        var h3 = document.createElement("h3");
        var p = document.createElement("p");
        var divCentro = document.createElement("div");
        var pT = document.createElement("p");
        var strongT = document.createElement("strong");
        var pT2 = document.createElement("p");
        //var tel = integrante.idUsuarios_Movil;
        if (integrante !== null) {

            divContenedor.className = "row col-12 m-0";


            divIzq.className = "col-12 col-sm-12 col-md-4 m-0";


            h3.innerHTML = integrante.aliasServicio;


            p.innerHTML = integrante.nombre + " " + integrante.apellido_paterno + " " + integrante.apellido_materno;

            divIzq.appendChild(h3);
            divIzq.appendChild(p);


            divCentro.className = "col-8 m-0";


            strongT.innerHTML = "Telefono: ";
            pT.appendChild(strongT);
            var tel = integrante.idUsuarios_Movil;
            pT2.style = "display: -webkit-inline-box;";
            pT2.innerHTML = tel;
        } else {
            if (notificados[i].hasOwnProperty("idUsuarios_Movil")) {
                ConsultaIntegrante(notificados[i].idUsuarios_Movil).then(function (int) {
                    if (int.hasOwnProperty("idUsuarios_Movil")) {
//            var divContenedor = document.createElement("div");
                        divContenedor.className = "row col-12 m-0";

//            var divIzq = document.createElement("div");
                        divIzq.className = "col-12 col-sm-12 col-md-4 m-0";

//            var h3 = document.createElement("h3");
                        h3.innerHTML = int.aliasServicio;

//            var p = document.createElement("p");
                        p.innerHTML = int.nombre + " " + int.apellido_paterno + " " + int.apellido_materno;

                        divIzq.appendChild(h3);
                        divIzq.appendChild(p);

//            var divCentro = document.createElement("div");
                        divCentro.className = "col-8 m-0";

//            var pT = document.createElement("p");
//            var strongT = document.createElement("strong");
                        strongT.innerHTML = "Telefono: ";
                        pT.appendChild(strongT);
//            var pT2 = document.createElement("p");
                        var tel = int.idUsuarios_Movil;
                        pT2.style = "display: -webkit-inline-box;";
                        pT2.innerHTML = tel;
                    } else {
                        //            var divContenedor = document.createElement("div");
                        divContenedor.className = "row col-12 m-0";

//            var divIzq = document.createElement("div");
                        divIzq.className = "col-12 col-sm-12 col-md-4 m-0";

//            var h3 = document.createElement("h3");
                        h3.innerHTML = "";

//            var p = document.createElement("p");
                        p.innerHTML = "";

                        divIzq.appendChild(h3);
                        divIzq.appendChild(p);

//            var divCentro = document.createElement("div");
                        divCentro.className = "col-8 m-0";

//            var pT = document.createElement("p");
//            var strongT = document.createElement("strong");
                        strongT.innerHTML = "Telefono: ";
                        pT.appendChild(strongT);
//            var pT2 = document.createElement("p");
                        pT2.style = "display: -webkit-inline-box;";
                        pT2.innerHTML = "";
                    }
                });
            }




        }



        pT.appendChild(pT2);
        divCentro.appendChild(pT);

        var pFecha = document.createElement("p");
        var fecha = notificados[i].fecha;
        if (fecha !== null && fecha !== "" && fecha !== undefined) {
            fecha.innerHTML = "Fecha: " + pFecha;
        }

        var pEnvio = document.createElement("p");
        var envio = notificados[i].hora_envio;
        if (envio !== null && envio !== "" && envio !== undefined) {
            pEnvio.innerHTML = "Envio: " + envio;
        } else {
            pEnvio.innerHTML = "Envio: No se pudo enviar la notificación.";
        }

        var pRecepcion = document.createElement("p");
        var recepcion = notificados[i].hora_recepcion;
        if (recepcion !== null && recepcion !== "" && recepcion !== undefined) {
            pRecepcion.innerHTML = "Recepción: " + recepcion;
        } else {
            pRecepcion.innerHTML = "Recepción: El usuario no recibio la notificación.";
        }

        var pConexion = document.createElement("p");
        var conexion = notificados[i].hora_conexion;
        if (conexion !== null && conexion !== "" && conexion !== undefined) {
            pConexion.innerHTML = "Conexión: " + conexion;
        } else {
            pConexion.innerHTML = "Conexión: El usuario no pudo establecer conexión.";
        }

        var pDeconexion = document.createElement("p");
        var desconexion = notificados[i].hora_desconexion;
        if (desconexion !== null && desconexion !== "" && desconexion !== undefined) {
            pDeconexion.innerHTML = "Desconexión: " + desconexion;
        } else {
            pDeconexion.innerHTML = "Desconexión: El usuario no se desconecto de manera correcta.";
        }

        divCentro.appendChild(pFecha);
        divCentro.appendChild(pEnvio);
        divCentro.appendChild(pRecepcion);
        divCentro.appendChild(pConexion);
        divCentro.appendChild(pDeconexion);


        divContenedor.appendChild(divIzq);
        divContenedor.appendChild(divCentro);

        document.getElementById("contenedorCB" + reporte.id).appendChild(divContenedor);

        creaSeparador(reporte.id);
    });
}

function insertaRazonamiento(reporte) {
    var divContenedor = document.createElement("div");
    divContenedor.className = "row col-12 m-0";

    var divIzq = document.createElement("div");
    divIzq.className = "col-12 col-sm-12 col-md-4 m-0";

    var h3 = document.createElement("h3");
    h3.innerHTML = reporte.alias;
    var p = document.createElement("p");
    if (reporte.hasOwnProperty("Usuario_Sys")) {
        if (Object.keys(reporte.Usuario_Sys).length !== 0) {
            if (reporte.Usuario_Sys.nombre !== null && reporte.Usuario_Sys.nombre !== undefined) {
                p.innerHTML = "Atendio: " + reporte.Usuario_Sys.nombre;
            }
            if (reporte.Usuario_Sys.apellidos !== null && reporte.Usuario_Sys.apellidos !== undefined) {
                p.innerHTML += " " + reporte.Usuario_Sys.apellidos;
            }
        } else {
            p.innerHTML = "El reporte aún no ha sido atendido por un operador.";
        }

    } else {
        p.innerHTML = "El reporte aún no ha sido atendido por un operador.";
    }

    divIzq.appendChild(h3);
    divIzq.appendChild(p);

    var divCentro = document.createElement("div");
    divCentro.className = "col-12 col-sm-12 col-md-4 m-0";

    var divContenedorRaz = document.createElement("div");
    divContenedorRaz.className = "row col-12 m-0 p-0";

    var label = document.createElement("label");
    label.className = "mr-3";
    label.innerHTML = "Razonamiento: ";
    var p = document.createElement("p");
    p.className = "text-justify";
    if (reporte.Reporte.hasOwnProperty("razonamiento")) {
        if (reporte.Reporte.razonamiento !== null && reporte.Reporte.razonamiento !== undefined) {
            p.innerHTML = reporte.Reporte.razonamiento;
        }
    }

    var pC = document.createElement("p");
    if (reporte.Reporte.hasOwnProperty("dependencias")) {
        if (reporte.Reporte.dependencias !== null && reporte.Reporte.dependencias !== undefined) {
            var dependencias = reporte.Reporte.dependencias.split(",");
            for (var i = 0; i < dependencias.length; i++) {
                var dep = dependencias[i].split("|");
                if (dep[0].includes(reporte.dependencia)) {
                    if (i === dependencias.length - 1) {
                        pC.innerHTML += dep[1].split("/")[3];
                    } else {
                        pC.innerHTML += dep[1].split("/")[3] + " , ";
                    }
                }
            }
            if (pC.innerHTML === "") {
                pC.innerHTML = "Dependencias Notificadas: La dependencia no notifico a alguien mas.";
            } else {
                pC.innerHTML = "Dependencias Notificadas: " + pC.innerHTML;
            }
        } else {
            pC.innerHTML = "Dependencias Notificadas: La dependencia no notifico a alguien mas.";
        }
    } else {
        pC.innerHTML = "Dependencias Notificadas: La dependencia no notifico a alguien mas.";
    }

    divContenedorRaz.appendChild(label);
    divContenedorRaz.appendChild(p);
    divCentro.appendChild(divContenedorRaz);
    divCentro.appendChild(pC);

    var divDer = document.createElement("div");
    divDer.className = "col-12 col-sm-12 col-md-4 m-0";

    var p = document.createElement("p");
    if (reporte.Reporte.hasOwnProperty("fecha_recepcion")) {
        if (reporte.Reporte.fecha_recepcion !== null && reporte.Reporte.fecha_recepcion !== undefined) {
            p.innerHTML = "Recepción: " + reporte.Reporte.fecha_recepcion;
        }
    }
    if (reporte.Reporte.hasOwnProperty("hora_recepcion")) {
        if (reporte.Reporte.hora_recepcion !== null && reporte.Reporte.hora_recepcion !== undefined) {
            p.innerHTML += " " + reporte.Reporte.hora_recepcion;
        }
    }

    var pD = document.createElement("p");
    if (reporte.Reporte.hasOwnProperty("fecha_revision")) {
        if (reporte.Reporte.fecha_revision !== null && reporte.Reporte.fecha_revision !== undefined) {
            pD.innerHTML = "Revisión: " + reporte.Reporte.fecha_revision + " " + reporte.Reporte.hora_revision;
        } else {
            pD.innerHTML = "Revisión: El reporte aún no ha sido resuelto por un operador.";
        }
    } else {
        pD.innerHTML = "Revisión: El reporte aún no ha sido resuelto por un operador.";
    }

    var pD2 = document.createElement("p");
    if (reporte.Reporte.hasOwnProperty("fecha_envio")) {
        if (reporte.Reporte.fecha_envio !== null && reporte.Reporte.fecha_envio !== undefined) {
            pD2.innerHTML = "Envio: " + reporte.Reporte.fecha_envio + " " + reporte.Reporte.hora_envio;
        } else {
            pD2.innerHTML = "Envio: El reporte no fue notificado a alguien mas.";
        }
    } else {
        pD2.innerHTML = "Envio: El reporte no fue notificado a alguien mas.";
    }

    divDer.appendChild(p);
    divDer.appendChild(pD);
    divDer.appendChild(pD2);

    divContenedor.appendChild(divIzq);
    divContenedor.appendChild(divCentro);
    divContenedor.appendChild(divDer);

    document.getElementById("contenedorCB" + reporte.id).appendChild(divContenedor);

    creaSeparador(reporte.id);
}

function insertaInfoDepLlamada(reporte) {
//    console.log(reporte);
    var divContenedor = document.createElement("div");
    divContenedor.className = "row col-12 m-0";

    var divIzq = document.createElement("div");
    divIzq.className = "col-12 col-sm-12 col-md-4 m-0";

    var h3 = document.createElement("h3");
    h3.innerHTML = reporte.alias;
    var p = document.createElement("p");
    if (reporte.registro_llamada.hasOwnProperty("usuario_sys")) {
        if (reporte.registro_llamada.usuario_sys !== null && reporte.registro_llamada.usuario_sys !== null) {
            p.innerHTML = "Atendio: " + reporte.registro_llamada.usuario_sys.nombre + " " + reporte.registro_llamada.usuario_sys.apellidos;
        } else {
            p.innerHTML = "El reporte aún no ha sido atendido por un operador.";
        }
    } else {
        p.innerHTML = "El reporte aún no ha sido atendido por un operador.";
    }

    divIzq.appendChild(h3);
    divIzq.appendChild(p);

    var divCentro = document.createElement("div");
    divCentro.className = "col-12 col-sm-12 col-md-4 m-0";

    var bitacora;
    if (reporte.registro_llamada.hasOwnProperty("bitacora")) {
        if (reporte.registro_llamada.bitacora !== null && reporte.registro_llamada.bitacora !== undefined) {
            bitacora = JSON.parse(reporte.registro_llamada.bitacora);
        } else {
            bitacora = {
                "h_recepcion": null,
                "h_atencion_inicio": null,
                "h_conexion_operador": null,
                "h_conexion_usuario": null,
                "h_desconexion_operador": null,
                "h_desconexion_usuario": null
            };
        }
    } else {
        bitacora = {
            "h_recepcion": null,
            "h_atencion_inicio": null,
            "h_conexion_operador": null,
            "h_conexion_usuario": null,
            "h_desconexion_operador": null,
            "h_desconexion_usuario": null
        };
    }
    //console.log(bitacora);

    var pRecepcion = document.createElement("p");
    if (bitacora.h_recepcion !== null && bitacora.h_recepcion !== "") {
        pRecepcion.innerHTML = "Recepción: " + bitacora.h_recepcion;
    } else {
        pRecepcion.innerHTML = "Recepción: ";
    }

    var pAtencion = document.createElement("p");
    if (bitacora.h_atencion_inicio !== null && bitacora.h_atencion_inicio !== "") {
        pAtencion.innerHTML = "Atención: " + bitacora.h_atencion_inicio;
    } else {
        pAtencion.innerHTML = "Atención: La llamada no fue atendida";
    }
    var pConOperador = document.createElement("p");
    if (bitacora.h_conexion_operador !== null && bitacora.h_conexion_operador !== "") {
        pConOperador.innerHTML = "Conexión operador: " + bitacora.h_conexion_operador;
    } else {
        pConOperador.innerHTML = "Conexión operador: El operador no pudo establecer conexión.";
    }
    var pConUsr = document.createElement("p");
    if (bitacora.h_conexion_usuario !== null && bitacora.h_conexion_usuario !== "") {
        pConUsr.innerHTML = "Conexión usuario: " + bitacora.h_conexion_usuario;
    } else {
        pConUsr.innerHTML = "Conexión usuario: El usuario no pudo establecer conexión.";
    }
    var pDesOperador = document.createElement("p");
    if (bitacora.h_desconexion_operador !== null && bitacora.h_desconexion_operador !== "") {
        pDesOperador.innerHTML = "Desconexión operador: " + bitacora.h_desconexion_operador;
    } else {
        pDesOperador.innerHTML = "Desconexión operador: El operador no se desconecto de manera correcta.";
    }
    var pDesUsr = document.createElement("p");
    if (bitacora.h_desconexion_usuario !== null && bitacora.h_desconexion_usuario !== "") {
        pDesUsr.innerHTML = "Desconexión usuario: " + bitacora.h_desconexion_usuario;
    } else {
        pDesUsr.innerHTML = "Desconexión usuario: El usuario no se desconecto de manera correcta.";
    }

    divCentro.appendChild(pRecepcion);
    divCentro.appendChild(pAtencion);
    divCentro.appendChild(pConOperador);
    divCentro.appendChild(pConUsr);
    divCentro.appendChild(pDesOperador);
    divCentro.appendChild(pDesUsr);

    var divDer = document.createElement("div");
    divDer.className = "col-12 col-sm-12 col-md-4 m-0";

    var pRep = document.createElement("p");
    pRep.innerHTML = "Reportes Generados:";

    var divReps = document.createElement("div");
    divReps.id = "divReps" + reporte.id;
    divReps.className = "row col-12";

    divDer.appendChild(pRep);
    divDer.appendChild(divReps);

    var Reportes = reporte.reportes_generados;
    $.each(Reportes, function (i) {
        var btn = document.createElement("button");
        btn.className = "col-2 mr-3 p-0";
        btn.style = "position: relative; z-index: 100; background-image: url(" + PathRecursos + 'Img/pdf.svg' + "); background-repeat: no-repeat; background-position: center; border: none; cursor: pointer; width: 40px; height: 40px; background-color: transparent;";
        inserta_botonPDF(btn, Reportes[i], reporte.id);
        divReps.appendChild(btn);
    });


    var divVideosRelacionados = document.createElement("div");
    divVideosRelacionados.id = "divVideosRelacionados" + reporte.id + reporte.dependencia;
    divVideosRelacionados.className = "row col-12";
    divVideosRelacionados.style = "height: 15rem;overflow-x: scroll;overflow-y: hidden;";





    divContenedor.appendChild(divIzq);
    divContenedor.appendChild(divCentro);
    divContenedor.appendChild(divDer);


    document.getElementById("contenedorCB" + reporte.id).appendChild(divContenedor);

    if (reporte.hasOwnProperty("videos_relacionados")) {
        document.getElementById("contenedorCB" + reporte.id).appendChild(divVideosRelacionados);
        agregaVideosRelacionado(reporte.videos_relacionados, reporte.id, reporte.dependencia);
        $.each(reporte.videos_relacionados, function (i) {
            if (reporte.videos_relacionados[i].ruta_video !== null && reporte.videos_relacionados[i].ruta_video !== "null") {
                muestra_video(reporte.videos_relacionados[i]);
            }
        });
    }

    creaSeparador(reporte.id);



}

function inserta_botonPDF(btn, jsonURL, id) {
    btn.onclick = function () {
        document.getElementById("FrameReporte").src = jsonURL.url;
        modal.style.display = "block";
        document.getElementById("FrameReporte").style.display = "block";
        document.getElementById("modal-content").style = "background-color: #fefefe; margin: auto; padding: 20px; border: 1px solid #888; width: 80%; height: 80%;";

    };
}

function agregaVideosRelacionado(videosrelacionados, id, dependencia) {
    $.each(videosrelacionados, function (i) {
        if (videosrelacionados[i].ruta_video !== null && videosrelacionados[i].ruta_video !== "null") {
            var div = document.createElement("div");
            div.id = "elemento" + videosrelacionados[i].telefono;
            div.style = "width: 15rem; height:100%;margin-right:0.7rem";
            var divinput = document.createElement("div");
            divinput.style = "cursor:pointer;";

            var input = document.createElement("input");
            input.type = "button";
            input.style = "width: 100%;";
            input.className = "btn btn-secondary";
            input.value = videosrelacionados[i].nombre + " " + videosrelacionados[i].apellido_paterno + " | " + videosrelacionados[i].telefono;

            var video = document.createElement("video");
            video.src = videosrelacionados[i].ruta_video;
            video.style = "width: 100%;height: auto; border:0;";
            video.controls = true;
            video.id = "video" + videosrelacionados[i].telefono;
            div.appendChild(video);
            divinput.appendChild(input);
            div.appendChild(divinput);
            document.getElementById("divVideosRelacionados" + id + dependencia).appendChild(div);
        } else {
            var div = document.createElement("div");
            div.id = "elemento" + videosrelacionados[i].telefono;
            var divinput = document.createElement("div");
            divinput.className = "label label-default";
            divinput.style = "margin-right: 0.7rem;";

            var span1 = document.createElement("span");
            var label = document.createElement("label");
            label.style = "width: 50%;padding: 4px 0 4px 4px;margin: 0;";
            label.className = "label label-default";
            label.innerHTML = videosrelacionados[i].nombre + " " + videosrelacionados[i].apellido_paterno;
            span1.appendChild(label);

            var span2 = document.createElement("span");
            var label2 = document.createElement("label");
            label2.style = "padding: 4px 0 4px 4px;margin: 0;";
            label2.className = "label label-default";
            label2.id = "label" + videosrelacionados[i].telefono;
            label2.innerHTML = videosrelacionados[i].telefono;
            span2.appendChild(label2);

            var divp = document.createElement("div");
            divp.style = "height: 11.3rem;margin-right: 0.7rem;margin-bottom: .4rem; overflow: scroll;";

            var p = document.createElement("p");
            p.style = "width: 15rem;margin-right:0.7rem;margin-bottom: 0;text-align: center;";
            p.innerHTML = "<b>Motivo por el que no se atendio la llamda:</b> <br>" + videosrelacionados[i].razonamiento;
            divp.appendChild(p);

            div.appendChild(divp);
            divinput.appendChild(span1);
            divinput.appendChild(span2);
            div.appendChild(divinput);
            //body.appendChild(video);
            document.getElementById("divVideosRelacionados" + id + dependencia).appendChild(div);
        }

    });
}

var modalV = document.getElementById('modal-Video');
var spanV = document.getElementById("CloseFrame-Video");

function muestra_video(elemento) {
    $("#elemento" + elemento.telefono).click(function () {
        modalV.style.display = "flex";
        modalV.style = "display:flex; background: #000000b3;";
        document.getElementById("modalcontent-Video").style = "background-color: black; margin: auto; padding: 1rempx; border: 1px solid rgb(64, 69, 79);; width: 50%; height: auto;";
        document.getElementById("CloseFrame-Video").style = "width: 7%;color: white;opacity: unset;text-align: end;padding-right: 0.5rem;cursor: pointer;margin-left: auto;font-size: 2.5rem;";
        var video = document.getElementById("video" + elemento.telefono);
        document.getElementById("modalcontent-Video").appendChild(video);
        SpanV(video, elemento.telefono);
        Wonclick(video, elemento.telefono);
    });
}

function SpanV(video, id) {
    spanV.onclick = function () {
        var contenedorElemento = document.getElementById("elemento" + id);
        var fc = contenedorElemento.firstElementChild;
        contenedorElemento.insertBefore(video, fc);
        modalV.style.display = "none";
    };
}

function Wonclick(video, id) {
    window.onclick = function (event) {
        if (event.target === modalV) {
            var contenedorElemento = document.getElementById("elemento" + id);
            var fc = contenedorElemento.firstElementChild;
            contenedorElemento.insertBefore(video, fc);
            modalV.style.display = "none";
        }
    };
}

// Get the modal
var modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
//var span = document.getElementsByClassName("close")[0];
var span = document.getElementById("CloseFrame");



// When the user clicks 20102, Almacenamiento de sustancias peligrosas, Altaon <span> (x), close the modal
span.addEventListener("click", function () {
    modal.style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};



var modalVG = document.getElementById('modal-VideoGeneral');
var spanVG = document.getElementById("CloseFrame-VideoGeneral");

function muestra_videoG(id) {
    $("#contenedorVideo" + id).click(function () {
        modalVG.style.display = "flex";
        modalVG.style = "display:flex; background: #000000b3;";
        document.getElementById("modalcontent-VideoGeneral").style = "background-color: black; margin: auto; padding: 1rempx; border: 1px solid rgb(64, 69, 79);; width: 50%; height: auto;";
        document.getElementById("CloseFrame-VideoGeneral").style = "width: 7%;color: white;opacity: unset;text-align: end;padding-right: 0.5rem;cursor: pointer;margin-left: auto;font-size: 2.5rem;";
        var video = document.getElementById("videoG" + id);
        document.getElementById("modalcontent-VideoGeneral").appendChild(video);
        SpanVG(video, id);
        WonclickG(video, id);
    });
}

function SpanVG(video, id) {
    spanVG.onclick = function () {
        var contenedorElemento = document.getElementById("contenedorVideo" + id);
        var fc = contenedorElemento.firstElementChild;
        contenedorElemento.insertBefore(video, fc);
        modalVG.style.display = "none";
    };
}

function WonclickG(video, id) {
    window.onclick = function (event) {
        if (event.target === modalVG) {
            var contenedorElemento = document.getElementById("contenedorVideo" + id);
            var fc = contenedorElemento.firstElementChild;
            contenedorElemento.insertBefore(video, fc);
            modalVG.style.display = "none";
        }
    };
}


function ZoomAndCenterLlamadaS(integrantes, map) {

    //console.log(integrantes);

    var R = 6372795.477598;
    var rad = Math.PI / 180;
    var lat = 0;
    var lng = 0;
    var d = -1;
    var k = 0;
    for (var i = 0; i < integrantes.length; i++) {
        lat += integrantes[i].lat;
        lng += integrantes[i].lng;
        k++;

    }
    if (k > 0) {
        lat = lat / k;
        lng = lng / k;
    }
    for (var i = 0; i < integrantes.length; i++) {
        if (integrantes[i].lat !== "") {
            var FloatLat = parseFloat(integrantes[i].lat);
            var FloatLng = parseFloat(integrantes[i].lng);
            var d_aux;
            var operacion = Math.sin(FloatLat * rad) * Math.sin(lat * rad) + Math.cos(FloatLat * rad) * Math.cos(lat * rad) * Math.cos((FloatLng * rad) - (lng * rad));
            if (operacion > 1) {
                operacion = 1;
                d_aux = R * Math.acos(operacion);
            } else if (operacion < -1) {
                operacion = -1;
                d_aux = R * Math.acos(operacion);
            } else {
                d_aux = R * Math.acos(operacion);
            }
            if (d_aux > d) {
                d = d_aux;
            }
        }
    }
    map.setCenter({"lat": lat, "lng": lng});
    var zoom = d;

    if (zoom > 200000) {
        map.setZoom(6);
    } else if (zoom > 150000) {
        map.setZoom(7);
    } else if (zoom > 120000) {
        map.setZoom(8);
    } else if (zoom > 100000) {
        map.setZoom(9);
    } else if (zoom > 60000) {
        map.setZoom(10);
    } else if (zoom > 25000) {
        map.setZoom(11);
    } else if (zoom > 10000) {
        map.setZoom(12);
    } else if (zoom > 4000) {
        map.setZoom(13);
    } else if (zoom > 2000) {
        map.setZoom(14);
    } else if (zoom > 1000) {
        map.setZoom(15);
    } else if (zoom > 500) {
        map.setZoom(16);
    } else if (zoom >= 0) {
        map.setZoom(17);
    } else if (zoom < 0) {
        map.setZoom(3);
    }
}

function setInfoWindow(marker, id, map) {
    var integrante = BuscarIntegranteDataG(id);
    if (integrante !== null) {
        var content = ContentInfoWindowLITE(integrante);

        marker.addListener('click', function () {
            infowindowS.close;
            infowindowS.setOptions({maxWidth: 300});
            infowindowS.setContent(content);
            infowindowS.open(map, marker);
        });
    } else {
        ConsultaIntegrante(id).then(function (response) {
            if (response.hasOwnProperty("idUsuarios_Movil")) {
                var content = ContentInfoWindowLITE(response);

                marker.addListener('click', function () {
                    infowindowS.close;
                    infowindowS.setOptions({maxWidth: 300});
                    infowindowS.setContent(content);
                    infowindowS.open(map, marker);
                });

            }
        });
    }


}

function ConsultaIntegrante(idUsuario) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/ConsultaIntegrante',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "idUsuario": idUsuario
        }),
        success: function (response) {
        },
        error: function (err) {

        }
    }));
}