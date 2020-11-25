/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var file_seguridad = null;
agregar_menu("Reporte Seguridad Sanitaria");

$("#img_reporte_seguridad").change(function (e) {
    fileReader_reporte_seguridad(e);
});


$("#guardar_reporte_seguridad").click(function () {
    guardar_reporte_seguridad();
});

$("#evidencia_seguridad_sanitaria").click(() => {
    document.getElementById("img_reporte_seguridad").click();
//        $("#img_reporte_seguridad").click();
});

function fileReader_reporte_seguridad(oEvent) {
    console.log("En la funcion fileReader");
    var oFile = oEvent.target.files[0];
    var sFilename = oFile.name;

    var reader = new FileReader();
    var result = {};

    reader.onload = function (e) {
        var data = e.target.result;
//            console.log(data);
        $("#cont_img_seguridad").empty();
        $("#cont_img_seguridad").css({
            "background-image": "url(" + data + ")",
            "background-size": "contain",
            "background-position": "center",
            "background-repeat": "no-repeat"
        });
        file_seguridad = oFile;
    };
    reader.readAsDataURL(oFile);

}

function guardar_reporte_seguridad() {
    if ($("#fecha_reporte_seguridad").val() !== "" &&
            $("#hora_reporte_seguridad").val() !== "" &&
            $("#asunto_reporte_seguridad").val() !== "" &&
            $("#categoria_seguridad").val() !== "" &&
            $("#reporte_reporte_seguridad").val() !== "") {
        let json = {
            fecha: $("#fecha_reporte_seguridad").val(),
            hora: $("#hora_reporte_seguridad").val(),
            asunto: $("#asunto_reporte_seguridad").val(),
            categoria: $("#categoria_seguridad").val(),
            descripcion: $("#reporte_reporte_seguridad").val(),
            institucion: JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
            tipo_usuario: JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
            tipo_servicio: JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
            id360: JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario
        };
        if (marcador2 !== null) {
            if (marcador2.getPosition() !== undefined) {
                json.lat = marcador2.getPosition().lat();
                json.lng = marcador2.getPosition().lng();
            }
        }
        //Subir foto a bucket
        if (file_seguridad !== null) {
            var params = {
                Bucket: BucketName,
                Prefix: sesion.id_institucion
            };
            s3.listObjects(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                } else {
                    console.log(data);   // successful response
                    //numFiles = data.Contents.length;
                    var upFile = file_seguridad;
                    if (upFile) {
                        var bucket = new AWS.S3({params: {Bucket: BucketName + "/reporte_seguridad"}});
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
                                //Actualizamos el registro
                                if (id_reporte_seguridad !== null) {
                                    json.id_reporte = id_reporte_seguridad;
                                    //actualizamos la evidenca del reporte
                                    RequestPOST("/API/empresas360/reporte_seguridad", json).then(function (response) {
                                        console.log(json);
                                        if (response.success) {
                                            id_reporte_seguridad = null;
                                            $("#cont_img_seguridad").empty();
                                            $("#cont_img_seguridad").attr("style", "");
                                            $("#cont_img_seguridad").append('<i style="font-size: 8rem;color: white;" class="fas fa-image"></i>');
                                            $("#img_reporte_seguridad").val("");
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
        RequestPOST("/API/empresas360/reporte_seguridad", json).then(function (response) {
            console.log(response);
            if (response.success) {
                id_reporte_seguridad = response.id_reporte;
                swal.fire({
                    text: response.mensaje
                });
                $("#hora_reporte_seguridad").val("");
                $("#asunto_reporte_seguridad").val("");
                $("#categoria_seguridad").val("");
                $("#reporte_reporte_seguridad").val("");
                $("#d_autocompletar2").val("");
                $("#cont_img_seguridad").empty();
                $("#cont_img_seguridad").attr("style", "");
                $("#cont_img_seguridad").append('<i style="font-size: 8rem;color: white;" class="fas fa-image"></i>');
                marcador2.setMap(null);
                map2.setZoom(5);
                map2.setCenter({lat: 19.503329, lng: -99.185714});
            } else {
                swal.fire({
                    text: response.mensaje
                });
            }
        });
    } else {
        swal.fire({
            text: "Por favor llene la información para poder registrar el reporte."
        });
    }

}

