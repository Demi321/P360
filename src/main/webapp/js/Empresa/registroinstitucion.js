/* global Swal, google, mapa, Promise, DEPENDENCIA */

var servicios;
var mapa;
var marker;

//        var tipo_usuario = getCookie("username_v3.1_" + DEPENDENCIA) === "" ? "0" : JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
//        var tipo_servicio = getCookie("username_v3.1_" + DEPENDENCIA) === "" ? "0" : JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio;
var tipo_usuario = 0;
var tipo_servicio = 0;

traeServicios(tipo_usuario, tipo_servicio).then(function (response) {
    servicios = response;
    initMap();
    var geocoder = new google.maps.Geocoder();
    var select = document.createElement("select");
    select.id = "tipoUser";
    select.className = "browser-default custom-select inputForm";
//            select.style = "";
    var op = document.createElement("option");
    op.innerHTML = "Selecciona un tipo de usuario";
    op.setAttribute("value", "0");
    op.setAttribute("selected", "true");
    select.appendChild(op);
    var tiposUsers = servicios.tipos_usuarios;
    $.each(tiposUsers, function (i) {
        var option = document.createElement("option");
        option.innerHTML = tiposUsers[i].tipo_usuario;
        option.setAttribute("value", tiposUsers[i].id);
        select.appendChild(option);
    });
    document.getElementById("typeUser").appendChild(select);
    $("#buscarDir").on("click", function () {
        var address = $("#direccion").val();
        if (address !== "") {
            geocoder.geocode({'address': address}, geocodeResult);
        }
    });

//    $("#tipoUser").change(function () {
//        if ($("#tipoUser").val() === "3"
//                || $("#tipoUser").val() === "4"
//                || $("#tipoUser").val() === "7"
//                || $("#tipoUser").val() === "12"
//                || $("#tipoUser").val() === "13"
//                || $("#tipoUser").val() === "14"
//                || $("#tipoUser").val() === "15"
//                || $("#tipoUser").val() === "16"
//                || $("#tipoUser").val() === "17"
//                || $("#tipoUser").val() === "18") {
//            $("#Niveles").removeClass("d-none");
//        } else {
//            $("#Niveles").addClass("d-none");
//        }
//    });

    $("#checkMedica").change(function () {
        if ($("#checkMedica").prop("checked")) {
            $("#Niveles").removeClass("d-none");
        } else {
            $("#Niveles").addClass("d-none");
        }
    });

    $("#agregarInstitucion").on("click", function (e) {
        e.preventDefault();
        if ($("#tipoUser").val() !== "0" && $("#nombre").val() !== "" && $("#direccion").val() !== "") {
            if ($("#checkMedica").prop("checked")) {
                console.log($("#nivel").val());
                if ($("#nivel").val() !== "0") {
                    var json = {
                        "idTipoUsuario": $("#tipoUser").val(),
                        "nombre": $("#nombre").val(),
                        "nivel": $("#nivel").val() === "0" ? "NULL" : $("#nivel").val(),
                        "direccion": $("#direccion").val(),
                        "lat": $("#lat").val(),
                        "lng": $("#lng").val(),
                        "telefono": $("#telefono").val()
                    };
                    agregaServicio(json).then(function (response) {
                        if (response.procede) {
                            Swal.fire({
                                title: 'Exito',
                                html: response.mensaje,
                                showCancelButton: false,
                                showConfirmButton: true,
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'Continuar'
                            }).then((result) => {
                                parent.location.reload();
                            });
                            changeSwal();
                        } else {
                            Swal.fire({
                                title: 'Error',
                                html: response.mensaje,
                                showCancelButton: false,
                                showConfirmButton: true,
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'Continuar'
                            });
                            changeSwal();
                        }
                    });
                } else {
                    Swal.fire({
                        title: 'Alto',
                        html: "<p class=\"text-center\">Si estas registrando una institución de tipo hospitalario <br>Debes de seleccionar un nivel de atencion.</p>",
                        showCancelButton: false,
                        showConfirmButton: true,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Continuar'
                    });
                    changeSwal();
                }
            } else {
                var json = {
                    "idTipoUsuario": $("#tipoUser").val(),
                    "nombre": $("#nombre").val(),
                    "nivel": $("#nivel").val() === "0" ? "NULL" : $("#nivel").val(),
                    "direccion": $("#direccion").val(),
                    "lat": $("#lat").val(),
                    "lng": $("#lng").val(),
                    "telefono": $("#telefono").val()
                };
                agregaServicio(json).then(function (response) {
                    if (response.procede) {
                        Swal.fire({
                            title: 'Exito',
                            html: response.mensaje,
                            showCancelButton: false,
                            showConfirmButton: true,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Continuar'
                        }).then((result) => {
                            parent.location.reload();
                        });
                        changeSwal();
                    } else {
                        Swal.fire({
                            title: 'Error',
                            html: response.mensaje,
                            showCancelButton: false,
                            showConfirmButton: true,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Continuar'
                        });
                        changeSwal();
                    }
                });
            }
        } else {
            Swal.fire({
                title: 'Alto',
                html: "Por favor llene todos los campos para poder realizar el registro.",
                showCancelButton: false,
                showConfirmButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Continuar'
            });
            changeSwal();
        }
    });
});
function initMap() {
    mapa = new google.maps.Map(document.getElementById('map'), {zoom: 5, center: {lat: 19.503329, lng: -99.185714}/*,mapTypeId:'satellite'*/, styles: [{featureType: 'administrative', elementType: 'geometry', stylers: [{visibility: "off"}, {"weight": 1}]}, {featureType: 'administrative', elementType: 'geometry.fill', stylers: [{visibility: "on"}]}, {featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{visibility: "off"}]}, {featureType: 'administrative', elementType: 'labels', stylers: [{color: '#000000'}, {visibility: "off"}]}, {featureType: 'administrative.country', elementType: 'geometry', stylers: [{color: '#a6a6a6'}, {visibility: "on"}, {"weight": 1.5}]}, {featureType: 'administrative.country', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.country', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.land_parcel', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.land_parcel', elementType: 'labels', stylers: [{visibility: "on"}]}, {featureType: 'administrative.land_parcel', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.locality', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.locality', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.locality', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.neighborhood', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.neighborhood', elementType: 'labels', stylers: [{color: '#696969'}, {visibility: "simplified"}]}, {featureType: 'administrative.neighborhood', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.province', elementType: 'geometry', stylers: [{visibility: "on"}, {"weight": 1.5}]}, {featureType: 'administrative.province', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.province', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: "landscape", stylers: [{color: '#D5D8DC'}]}, {featureType: 'landscape', elementType: 'geometry', stylers: [{color: '#D5D8DC'}]}, {featureType: 'landscape', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'landscape', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{color: '#526081'}, {visibility: "off"}]}, {featureType: 'landscape.natural.landcover', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.landcover', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'road', elementType: 'geometry', stylers: [{visibility: "simplified"}]}, {featureType: 'road', elementType: 'labels', stylers: [{visibility: "simplified"}]}, {featureType: 'road', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'water', elementType: 'geometry', stylers: [{color: '#F2F4F4'}, {visibility: "on"}]}, {featureType: 'water', elementType: 'labels', stylers: [{visibility: "off"}]}]});
    mapa.setTilt(45);
}

function geocodeResult(results, status) {
    if (status == 'OK') {
        $("#lat").val(results[0].geometry.location.lat());
        $("#lng").val(results[0].geometry.location.lng());
        marker = new google.maps.Marker({
            position: {lat: parseFloat($("#lat").val()), lng: parseFloat($("#lng").val())},
            map: mapa,
            draggable: true,
            animation: google.maps.Animation.DROP
        });
        var latlng = {lat: parseFloat($("#lat").val()), lng: parseFloat($("#lng").val())};
        console.log(latlng);
        mapa.setCenter(latlng);
        mapa.setZoom(18);
        marker.addListener('dragend', function () {
            var lat = marker.getPosition().lat();
            var lng = marker.getPosition().lng();
            $("#lat").val(lat);
            $("#lng").val(lng);
        });
    } else {
        alert("Geocoding no tuvo éxito debido a: " + status);
    }
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

function traeServicios(tipo_usuario, tipo_servicio) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/traeServicios',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "tipo_usuario": tipo_usuario,
            "tipo_servicio": tipo_servicio
        }),
        success: function (response) {
            console.log(response);
        },
        error: function (err) {
            console.log(err);
        }
    }));
}

function agregaServicio(json) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/agregaServicio',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(json),
        success: function (response) {
            console.log(response);
        },
        error: function (err) {
            console.log(err);
        }
    }));
}

