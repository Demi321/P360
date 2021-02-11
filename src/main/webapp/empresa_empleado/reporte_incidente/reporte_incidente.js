let mapa_reporte_evento_incidente = () => {
    if ($("#map_reporte_evento_incidente").length) {
        console.log("inicializando mapa: map_reporte_evento_incidente");
        map_reporte_evento_incidente = new google.maps.Map(document.getElementById('map_reporte_evento_incidente'), {zoom: 5, center: {lat: 19.503329, lng: -99.185714} /*,mapTypeId:'satellite'*/, });
        map_reporte_evento_incidente.setTilt(45);
        geocoder_reporte_evento_incidente = new google.maps.Geocoder;
        infowindow_reporte_evento_incidente = new google.maps.InfoWindow({maxWidth: 300});

        marcador_reporte_evento_incidente = new google.maps.Marker({
            map: map_reporte_evento_incidente,
            draggable: true,
            position: {lat: 19.503329, lng: -99.185714}
        });

        if (location_user !== null) {
            map_reporte_evento_incidente.setCenter(new google.maps.LatLng(location_user.latitude, location_user.longitude));
            map_reporte_evento_incidente.setZoom(15);
            marcador_reporte_evento_incidente.setVisible(false);
            marcador_reporte_evento_incidente.setPosition(new google.maps.LatLng(location_user.latitude, location_user.longitude));
            marcador_reporte_evento_incidente.setVisible(true);
        }

        if ($("#reporte_evento_incidente_direccion").length) {
            let input = document.getElementById("reporte_evento_incidente_direccion");
            let autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo("bounds", map_reporte_evento_incidente);
            // Set the data fields to return when the user selects a place.
            autocomplete.setFields(["address_components", "geometry", "icon", "name"]);
            infowindow_reporte_evento_incidente = new google.maps.InfoWindow();
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
                if (marcador_reporte_evento_incidente !== null) {
                    marcador_reporte_evento_incidente.setMap(null);
                }
                marcador_reporte_evento_incidente = new google.maps.Marker({
                    map_reporte_evento_incidente,
                    anchorPoint: new google.maps.Point(0, -29),
                    draggable: true
                });
                infowindow_reporte_evento_incidente.close();
                marcador_reporte_evento_incidente.setVisible(false);
                const place = autocomplete.getPlace();
                if (!place.geometry) {
                    // User entered the name of a Place that was not suggested and
                    // pressed the Enter key, or the Place Details request failed.
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }

                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    map_reporte_evento_incidente.fitBounds(place.geometry.viewport);
                } else {
                    map_reporte_evento_incidente.setCenter(place.geometry.location);
                    map_reporte_evento_incidente.setZoom(17); // Why 17? Because it looks good.
                }
                marcador_reporte_evento_incidente.setPosition(place.geometry.location);
                marcador_reporte_evento_incidente.setVisible(true);
                marcador_reporte_evento_incidente.setMap(map_reporte_evento_incidente)
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
                            if ($("#reporte_evento_incidente_estado").length) {
                                $("#reporte_evento_incidente_estado").text(place.address_components[i].long_name);
                            }
                        }
                        if (type === "locality") {
                            console.log("Ciudad o Municipio: " + place.address_components[i].long_name);
                            if ($("#reporte_evento_incidente_municipio").length) {
                                $("#reporte_evento_incidente_municipio").text(" " + place.address_components[i].long_name + ", ");
                            }
                            if ($("#reporte_evento_incidente_municipio").length) {
                                $("#reporte_evento_incidente_municipio").text(" " + place.address_components[i].long_name + ", ");
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
        console.log("No se pudo inicializar el mapa: map_reporte_evento_incidente");
    }

};
let vue_catalogo_incidentes = (directorio) => {
    console.log(directorio);

    new Vue({
        el: "#directorio_catalogo_incidentes",
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
                return option.idRIncidente + " - " + option.DescripcionIncidente + " - " + option.tipoUrgencia + "";
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
                $("#reporte_evento_incidente_categoria").val(value.idRIncidente);
            },
            onOpen(value) {
                console.log(value);
                console.log(this.value);
                this.value = null;
                $("#reporte_evento_incidente_categoria").val(null);
            }
        }
    });
};
function fileReader_reporte_incidente(oEvent) {
    console.log("En la funcion fileReader");
    var oFile = oEvent.target.files[0];
    var sFilename = oFile.name;

    var reader = new FileReader();
    var result = {};

    reader.onload = function (e) {
        var data = e.target.result;
//            console.log(data);
        $("#upload_img_reporte_incidente").empty();
        $("#upload_img_reporte_incidente").css({
            "background-image": "url(" + data + ")",
            "background-size": "contain",
            "background-position": "center",
            "background-repeat": "no-repeat"
        });
        file_reporte_incidente = oFile;
    };
    reader.readAsDataURL(oFile);
}
const init_reporte_incidentes = (id_usuario, tipo_usuario, tipo_servicio, tipo_area) => {

    if (location_user !== null) {
        if (location_user.municipio !== null) {
            $("#reporte_evento_incidente_municipio").text(" " + location_user.municipio);
            $("#reporte_evento_incidente_municipio").text(" " + location_user.colonia);
        }
        if (location_user.estado !== null) {
            $("#reporte_evento_incidente_estado").text(" - " + location_user.estado_long);
        }
    }
    var map_reporte_evento_incidente;
    var geocoder_reporte_evento_incidente;
    var infowindow_reporte_evento_incidente;
    var marcador_reporte_evento_incidente;
    var file_reporte_incidente = null;

    mapa_reporte_evento_incidente();



    $("#reporte_evento_incidente_fecha").val(getFecha());

    RequestGET("/API/catalogo_cni").then((response) => {
        console.log(response);
        vue_catalogo_incidentes(response);
    });

    $('#upload_img_reporte_incidente').click(() => {
        $("#reporte_event_incidente_customFileLang").click();
    });
    $("#reporte_event_incidente_customFileLang").change(function (e) {
        fileReader_reporte_incidente(e);
    });




    $("#reporte_evento_incidente_form").submit((e) => {
        e.preventDefault();
        var div = document.createElement("div");
        div.style = "position:absolute;width:100%;height:100%;background:#49505740;top:0;left:0;overflow:hidden;padding: 25%;padding-top: 50%;z-index: 1000;";
        var reporte_evento_incidente_lottieLoader = document.createElement("div");
        reporte_evento_incidente_lottieLoader.id = "reporte_evento_incidente_lottieLoader";
        var contenedor = document.getElementById("reporte_evento_incidente_form");
        div.appendChild(reporte_evento_incidente_lottieLoader);
        contenedor.appendChild(div);

        var reporte_evento_incidente_Loader_lottieAnimation = bodymovin.loadAnimation({
            container: reporte_evento_incidente_lottieLoader, // ID del div
            path: "https://empresas.claro360.com/p360_v4_dev_moises/json/loading_lottie.json", // Ruta fichero .json de la animación
            renderer: 'svg', // Requerido
            loop: true, // Opcional
            autoplay: true, // Opcional
            name: "loading lottie" // Opcional
        });

//    $("#reporte_evento_incidente_lottieLoader").parent().remove();


        let json = buildJSON_Section("reporte_evento_incidente_form");
        let keys = Object.keys(json);
        $.each(keys, (i) => {
            let new_key = keys[i].toString().split("reporte_evento_incidente_")[1];
            json[new_key] = json[keys[i]];
            delete json[keys[i]];
        });
        json.id360 = id_usuario;
        json.tipo_usuario = tipo_usuario;
        json.tipo_servicio = tipo_servicio;
        json.tipo_area = tipo_area;
        if (marcador_reporte_evento_incidente !== null && marcador_reporte_evento_incidente !== undefined) {
            json.lat = marcador_reporte_evento_incidente.getPosition().lat();
            json.lng = marcador_reporte_evento_incidente.getPosition().lng();
        }
        console.log(json);
        //Guardamos la imagen en el bucket de amazon
        if (file_reporte_incidente !== null) {
            var params = {
                Bucket: BucketName
            };
            s3.listObjects(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                    swal.fire({
                        text: "Hubo un error al cargar la imagen"
                    });
                    $("#reporte_evento_incidente_lottieLoader").parent().remove();
                } else {
                    console.log(data);   // successful response
                    //numFiles = data.Contents.length;
                    var upFile = file_reporte_incidente;
                    if (upFile) {
                        var bucket = new AWS.S3({params: {Bucket: BucketName + "/reporte_evento/" + id360}});
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
                                RequestPOST("/API/empresas360/reporte_evento", json).then(function (response) {
                                    console.log(json);
                                    if (response.success) {
                                        $("#reporte_evento_incidente_form").trigger("reset");
                                        $("#upload_img_reporte_incidente").empty();
                                        $("#upload_img_reporte_incidente").removeAttr("style");
                                        $("#upload_img_reporte_incidente").css({
                                            "height": "130px",
                                            "cursor": "pointer"
                                        });
                                        $("#upload_img_reporte_incidente").append('<i class="fas fa-camera w-100 h-100 text-white p-4"></i>');
                                        $("#reporte_event_incidente_customFileLang").val("");
                                        $("#reporte_evento_incidente_fecha").val(getFecha());
                                        file_reporte_incidente = null;
                                    }
                                    swal.fire({
                                        text: response.mensaje
                                    });
                                    $("#reporte_evento_incidente_lottieLoader").parent().remove();
                                });
                            }
                        });
                    }
                }
            });
        } else {
            json.evidencia = "";
            RequestPOST("/API/empresas360/reporte_evento", json).then(function (response) {
                console.log(json);
                if (response.success) {
                    $("#reporte_evento_incidente_form").trigger("reset");
                    $("#upload_img_reporte_incidente").empty();
                    $("#upload_img_reporte_incidente").removeAttr("style");
                    $("#upload_img_reporte_incidente").css({
                        "height": "130px",
                        "cursor": "pointer"
                    });
                    $("#upload_img_reporte_incidente").append('<i class="fas fa-camera w-100 h-100 text-white p-4"></i>');
                    $("#reporte_event_incidente_customFileLang").val("");
                    $("#reporte_evento_incidente_fecha").val(getFecha());
                    file_reporte_incidente = null;
                }
                swal.fire({
                    text: response.mensaje
                });
                $("#reporte_evento_incidente_lottieLoader").parent().remove();
            });
        }


//    RequestPOST("/API/empresas360/reporte_evento", json).then((response) => {
//        console.log(response);
//    });
    });
}