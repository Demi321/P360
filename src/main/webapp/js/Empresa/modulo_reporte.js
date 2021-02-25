/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var file_evento = null;
var catalogo_lineamientos = null;

agregar_menu("Nuevo Reporte",'<i class="fas fa-file-export"></i>',"Trabajo");

$("#evidencia_evento").click(() => {
    document.getElementById("img_reporte_evento").click();
//        $("#img_reporte_evento").click();
});


RequestGET("/API/empresas360/catalogo_lineamientos/").then((response) => {
    console.log(response);
    catalogo_lineamientos = response;
    $.each(catalogo_lineamientos, function (i) {
        let option = document.createElement("option");
        option.value = catalogo_lineamientos[i].id;
        option.innerHTML = catalogo_lineamientos[i].categoria;
        $("#categoria").append(option);
    });
    $.each(catalogo_lineamientos, function (i) {
        let option = document.createElement("option");
        option.value = catalogo_lineamientos[i].id;
        option.innerHTML = catalogo_lineamientos[i].categoria;
        $("#categoria_seguridad").append(option);
    });
    $("#fecha_reporte").val(getFecha());
    $("#fecha_reporte_seguridad").val(getFecha());
});


var id_reporte_evento = null;
var id_reporte_seguridad = null;

$("#guardar_reporte_evento").click(function () {
    guardar_reporte_evento();
});
$("#img_reporte_evento").change(function (e) {
    fileReader_reporte_evento(e);
});


function fileReader_reporte_evento(oEvent) {
    console.log("En la funcion fileReader");
    var oFile = oEvent.target.files[0];
    var sFilename = oFile.name;

    var reader = new FileReader();
    var result = {};

    reader.onload = function (e) {
        var data = e.target.result;
//            console.log(data);
        $("#cont_img_evento").empty();
        $("#cont_img_evento").css({
            "background-image": "url(" + data + ")",
            "background-size": "contain",
            "background-position": "center",
            "background-repeat": "no-repeat"
        });
        file_evento = oFile;
    };
    reader.readAsDataURL(oFile);
}

function guardar_reporte_evento() {
    if ($("#reporte_reporte_evento").val() !== "" &&
            $("#fecha_reporte").val() !== "" &&
            $("#asunto_reporte").val() !== "" &&
            $("#categoria").val() !== "" &&
            $("#hora_reporte").val() !== "") {
        let json = {
            fecha: $("#fecha_reporte").val(),
            hora: $("#hora_reporte").val(),
            asunto: $("#asunto_reporte").val(),
            categoria: $("#categoria").val(), //Se usara la misma de lineamientos??
            reporte: $("#reporte_reporte_evento").val(),
            direccion: $("#d_autocompletar").val(),
            //validar marcador !=null y getPosition != undefined
//            lat: marcador.getPosition().lat(),
//            lng: marcador.getPosition().lng(),
            tipo_usuario: JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
            tipo_servicio: JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio,
            id360: JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).id_usuario
        };
        if (marcador !== null && marcador !== undefined) {
            if (marcador.getPosition() !== undefined) {
                json.lat = marcador.getPosition().lat();
                json.lng = marcador.getPosition().lng();
            }
        }
        //Subir foto a bucket
        if (file_evento !== null) {
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
                    var upFile = file_evento;
                    if (upFile) {
                        var bucket = new AWS.S3({params: {Bucket: BucketName + "/reporte_evento"}});
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
                                if (id_reporte_evento !== null) {
                                    json.id_reporte = id_reporte_evento;
                                    //actualizamos la evidenca del reporte
                                    RequestPOST("/API/empresas360/reporte_evento", json).then(function (response) {
                                        console.log(json);
                                        if (response.success) {
                                            id_reporte_evento = null;
                                            $("#cont_img_evento").empty();
                                            $("#cont_img_evento").attr("style", "");
                                            $("#cont_img_evento").append('<i style="font-size: 8rem;color: white;" class="fas fa-image"></i>');
                                            $("#img_reporte_evento").val("");
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
        RequestPOST("/API/empresas360/reporte_evento", json).then(function (response) {
            console.log(response);
            if (response.success) {
                id_reporte_evento = response.id_reporte;
                swal.fire({
                    text: response.mensaje
                });
                $("#hora_reporte").val("");
                $("#asunto_reporte").val("");
                $("#categoria").val("");
                $("#reporte_reporte_evento").val("");
                $("#d_autocompletar").val("");
                $("#cont_img_evento").empty();
                $("#cont_img_evento").attr("style", "");
                $("#cont_img_evento").append('<i style="font-size: 8rem;color: white;" class="fas fa-image"></i>');
                marcador.setMap(null);
                map.setZoom(5);
                map.setCenter({lat: 19.503329, lng: -99.185714});
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