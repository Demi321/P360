/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
let vue_categorias_reporte_evidencias = (directorio) => {
    console.log(directorio);

    new Vue({
        el: "#reporte_seguridad_catalogo",
        components: {
            Multiselect: window.VueMultiselect.default
        },
        data() {
            return {
                value: [],
                options: directorio
            };
        },
        methods: {
            customLabel(option) {
                return option.id + " - " + option.categoria;
            },
            onClosed(value) {
                //console.log(value);

            },

            onTag(value) {
                //console.log(value);
            },

            onRemove(value) {
                //console.log(value);
            },

            onInput(value) {
                console.log(value);
                $("#reporte_seguridad_categoria").val(value.idRIncidente);
            },
            onOpen(value) {
                console.log(value);
                console.log(this.value);
                this.value = null;
                $("#reporte_seguridad_categoria").val(null);
            }
        }
    });
};
function fileReader_reporte_seguridad(oEvent) {
    console.log("En la funcion fileReader");
    var oFile = oEvent.target.files[0];
    var sFilename = oFile.name;

    var reader = new FileReader();
    var result = {};

    reader.onload = function (e) {
        var data = e.target.result;
//            console.log(data);
        $("#upload_img_reporte_seguridad").empty();
        $("#upload_img_reporte_seguridad").css({
            "background-image": "url(" + data + ")",
            "background-size": "contain",
            "background-position": "center",
            "background-repeat": "no-repeat"
        });
        file_reporte_seguridad = oFile;
    };
    reader.readAsDataURL(oFile);
}
let mapa_seguridad_sanitaria = () => {
    if ($("#map_seguridad_sanitaria").length) {
        console.log("inicializando mapa: map_seguridad_sanitaria");
        map_seguridad_sanitaria = new google.maps.Map(document.getElementById('map_seguridad_sanitaria'), {zoom: 5, center: {lat: 19.503329, lng: -99.185714} /*,mapTypeId:'satellite'*/, });
        map_seguridad_sanitaria.setTilt(45);
        geocoder_seguridad_sanitaria = new google.maps.Geocoder;
        infowindow_seguridad_sanitaria = new google.maps.InfoWindow({maxWidth: 300});

        marcador_seguridad_sanitaria = new google.maps.Marker({
            map: map_seguridad_sanitaria,
            draggable: true,
            position: {lat: 19.503329, lng: -99.185714}
        });

        if (location_user !== null) {
            map_seguridad_sanitaria.setCenter(new google.maps.LatLng(location_user.latitude, location_user.longitude));
            map_seguridad_sanitaria.setZoom(15);
            marcador_seguridad_sanitaria.setVisible(false);
            marcador_seguridad_sanitaria.setPosition(new google.maps.LatLng(location_user.latitude, location_user.longitude));
            marcador_seguridad_sanitaria.setVisible(true);
        }

        if ($("#reporte_seguridad_descripcion_lugar").length) {
            let input = document.getElementById("reporte_seguridad_descripcion_lugar");
            let autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo("bounds", map_seguridad_sanitaria);
            // Set the data fields to return when the user selects a place.
            autocomplete.setFields(["address_components", "geometry", "icon", "name"]);
            infowindow_seguridad_sanitaria = new google.maps.InfoWindow();
            var infowindowContent = document.createElement("div");
            infowindowContent.id = "infowindow-content";
            let img_wic = document.createElement("img");
            img_wic.width = "16";
            img_wic.height = "16";
            img_wic.id = "place-icon";
            let p_name = document.createElement("span");
            p_name.id = "place-name";
            p_name.className = "tittle";
            let p_addr = document.createElement("span");
            p_addr.id = "place-address";
            infowindowContent.appendChild(img_wic);
            infowindowContent.appendChild(p_name);
            infowindowContent.appendChild(document.createElement("br"));
            infowindowContent.appendChild(p_addr);
            //        infowindow.setContent(infowindowContent);
            autocomplete.addListener("place_changed", () => {
                if ($("#pais").length) {
                    $("#pais").val("");
                }
                if ($("#estado").length) {
                    $("#estado").val("");
                }
                if ($("#ciudad_municipio").length) {
                    $("#ciudad_municipio").val("");
                }
                if ($("#colonia").length) {
                    $("#colonia").val("");
                }
                if ($("#calle").length) {
                    $("#calle").val("");
                }
                if ($("#cp").length) {
                    $("#cp").val("");
                }
                if (marcador_seguridad_sanitaria !== null) {
                    marcador_seguridad_sanitaria.setMap(null);
                }
                marcador_seguridad_sanitaria = new google.maps.Marker({
                    map_seguridad_sanitaria,
                    anchorPoint: new google.maps.Point(0, -29),
                    draggable: true
                });
                infowindow_seguridad_sanitaria.close();
                marcador_seguridad_sanitaria.setVisible(false);
                const place = autocomplete.getPlace();
                if (!place.geometry) {
                    // User entered the name of a Place that was not suggested and
                    // pressed the Enter key, or the Place Details request failed.
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }

                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    map_seguridad_sanitaria.fitBounds(place.geometry.viewport);
                } else {
                    map_seguridad_sanitaria.setCenter(place.geometry.location);
                    map_seguridad_sanitaria.setZoom(17); // Why 17? Because it looks good.
                }
                marcador_seguridad_sanitaria.setPosition(place.geometry.location);
                marcador_seguridad_sanitaria.setVisible(true);
                marcador_seguridad_sanitaria.setMap(map_seguridad_sanitaria)
                let address = "";
                if (place.address_components) {
                    address = [
                        (place.address_components[0] &&
                                place.address_components[0].short_name) ||
                                "",
                        (place.address_components[1] &&
                                place.address_components[1].short_name) ||
                                "",
                        (place.address_components[2] &&
                                place.address_components[2].short_name) ||
                                ""
                    ].join(" ");
                }
                for (var i = 0; i < place.address_components.length; i++) {
                    let types = place.address_components[i].types;
                    for (var j = 0; j < types.length; j++) {
                        let type = types[j];
                        if (type === "country") {
                            console.log("Pais: " + place.address_components[i].long_name);
                            if ($("#pais").length) {
                                $("#pais").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "administrative_area_level_1") {
                            console.log("Estado: " + place.address_components[i].long_name);
                            if ($("#reporte_seguridad_sanitaria_estado").length) {
                                $("#reporte_seguridad_sanitaria_estado").text(place.address_components[i].long_name);
                            }
                        }
                        if (type === "locality") {
                            console.log("Ciudad o Municipio: " + place.address_components[i].long_name);
                            if ($("#reporte_seguridad_sanitaria_municipio").length) {
                                $("#reporte_seguridad_sanitaria_municipio").text(" " + place.address_components[i].long_name + ", ");
                            }
                            if ($("#reporte_seguridad_sanitaria_municipio").length) {
                                $("#reporte_seguridad_sanitaria_municipio").text(" " + place.address_components[i].long_name + ", ");
                            }
                        }
                        if (type === "sublocality_level_1") {
                            console.log("colonia: " + place.address_components[i].long_name);
                            if ($("#colonia").length) {
                                $("#colonia").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "route") {
                            console.log("Calle: " + place.address_components[i].long_name);
                            if ($("#calle").length) {
                                $("#calle").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "postal_code") {
                            console.log("CP: " + place.address_components[i].long_name);
                            if ($("#cp").length) {
                                $("#cp").val(place.address_components[i].long_name);
                            }
                        }
                    }
                }
                console.log(address);
                console.log(place);
                console.log(infowindowContent);
                //            infowindowContent.children["place-icon"].src = place.icon;
                //            infowindowContent.children["place-name"].textContent = place.name;
                //            infowindowContent.children["place-address"].textContent = address;
                //            infowindow.open(map, marcador);
            });
        }
    } else {
        console.log("No se pudo inicializar el mapa: map_seguridad_sanitaria");
    }

};

const init_reporte_seguridad_sanitaria = (id_usuario, tipo_usuario, tipo_servicio, tipo_area) => {

if (location_user !== null) {
    if (location_user.municipio !== null) {
        $("#reporte_seguridad_sanitaria_municipio").text(" " + location_user.municipio);
        $("#reporte_seguridad_sanitaria_municipio").text(" " + location_user.colonia);
    }
    if (location_user.estado !== null) {
        $("#reporte_seguridad_sanitaria_estado").text(" - " + location_user.estado_long);
    }
}
var map_seguridad_sanitaria;
var geocoder_seguridad_sanitaria;
var infowindow_seguridad_sanitaria;
var marcador_seguridad_sanitaria;
var file_reporte_seguridad = null;

mapa_seguridad_sanitaria();




RequestGET("/API/GET/reporte_evidencias/categorias").then((response) => {
    console.log(response);
    vue_categorias_reporte_evidencias(response);
});

$('#upload_img_reporte_seguridad').click(() => {
    $("#reporte_evento_seguridad_customFileLang").click();
});
$("#reporte_evento_seguridad_customFileLang").change(function (e) {
    fileReader_reporte_seguridad(e);
});




$("#reporte_seguridad_fecha").val(getFecha());


$("#reporte_seguridad_form").submit((e) => {
    e.preventDefault();
    var div = document.createElement("div");
    div.style = "position:absolute;width:100%;height:100%;background:#49505740;top:0;left:0;overflow:hidden;padding: 25%;padding-top: 50%;z-index: 1000;";
    var reporte_seguridad_lottieLoader = document.createElement("div");
    reporte_seguridad_lottieLoader.id = "reporte_seguridad_lottieLoader";
    var contenedor = document.getElementById("reporte_seguridad_form");
    div.appendChild(reporte_seguridad_lottieLoader);
    contenedor.appendChild(div);

    var reporte_seguridad_Loader_lottieAnimation = bodymovin.loadAnimation({
        container: reporte_seguridad_lottieLoader, // ID del div
        path: "https://empresas.claro360.com/p360_v4_dev_moises/json/loading_lottie.json", // Ruta fichero .json de la animación
        renderer: 'svg', // Requerido
        loop: true, // Opcional
        autoplay: true, // Opcional
        name: "loading lottie" // Opcional
    });

//    $("#reporte_seguridad_lottieLoader").parent().remove();

    let json = buildJSON_Section("reporte_seguridad_form");
    let keys = Object.keys(json);
    $.each(keys, (i) => {
        let new_key = keys[i].toString().split("reporte_seguridad_")[1];
        json[new_key] = json[keys[i]];
        delete json[keys[i]];
    });
    json.id360 = id_usuario;
    json.tipo_usuario = tipo_usuario;
    json.tipo_servicio = tipo_servicio;
    json.institucion = tipo_servicio;
    if (marcador_seguridad_sanitaria !== null && marcador_seguridad_sanitaria !== undefined) {
        json.lat = marcador_seguridad_sanitaria.getPosition().lat();
        json.lng = marcador_seguridad_sanitaria.getPosition().lng();
    }
    console.log(json);

    if (file_reporte_seguridad !== null) {
        var params = {
            Bucket: BucketName
        };
        s3.listObjects(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                swal.fire({
                    text: "Hubo un error al cargar la imagen"
                });
                $("#reporte_seguridad_lottieLoader").parent().remove();
            } else {
                console.log(data);   // successful response
                //numFiles = data.Contents.length;
                var upFile = file_reporte_seguridad;
                if (upFile) {
                    var bucket = new AWS.S3({params: {Bucket: BucketName + "/reporte_evento/" + id_usuario}});
//                        upFile = uploadFiles[i];
                    var params = {
                        Body: upFile,
                        Key: upFile.name,
                        ContentType: upFile.type
                    };
                    bucket.upload(params).on('httpUploadProgress', function (evt) {
                        //console.log(evt);
                    }).send(function (err, data) {
                        if (err) {
                            console.log(err, err.stack); // an error occurred
                        } else {
                            console.log(data);           // successful response
                            json.evidencia = data.Location;
                            RequestPOST("/API/empresas360/reporte_seguridad", json).then(function (response) {
                                console.log(json);

                                if (response.success) {
                                    $("#reporte_seguridad_form").trigger("reset");
                                    $("#upload_img_reporte_seguridad").empty();
                                    $("#upload_img_reporte_seguridad").removeAttr("style");
                                    $("#upload_img_reporte_seguridad").css({
                                        "height": "130px",
                                        "cursor": "pointer"
                                    });
                                    $("#upload_img_reporte_seguridad").append('<i class="fas fa-camera w-100 h-100 text-white p-4"></i>');
                                    $("#reporte_event_incidente_customFileLang").val("");
                                    $("#reporte_seguridad_fecha").val(getFecha());
                                    file_reporte_seguridad = null;
                                }
                                swal.fire({
                                    text: response.mensaje
                                });
                                $("#reporte_seguridad_lottieLoader").parent().remove();
                            });
                        }
                    });
                }
            }
        });
    } else {
        json.evidencia = "";
        RequestPOST("/API/empresas360/reporte_seguridad", json).then(function (response) {
            console.log(json);

            if (response.success) {
                $("#reporte_seguridad_form").trigger("reset");
                $("#upload_img_reporte_seguridad").empty();
                $("#upload_img_reporte_seguridad").removeAttr("style");
                $("#upload_img_reporte_seguridad").css({
                    "height": "130px",
                    "cursor": "pointer"
                });
                $("#upload_img_reporte_seguridad").append('<i class="fas fa-camera w-100 h-100 text-white p-4"></i>');
                $("#reporte_event_incidente_customFileLang").val("");
                $("#reporte_seguridad_fecha").val(getFecha());
                file_reporte_seguridad = null;
            }
            swal.fire({
                text: response.mensaje
            });
            $("#reporte_seguridad_lottieLoader").parent().remove();
        });
    }

    /*RequestPOST("/API/empresas360/reporte_seguridad",json).then((response)=>{
     console.log(response);
     });*/
});
}