/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function detalleTarea(indice){
        $('#contenidoSection').load('detalle_tarea?indice='+indice)
    }
    

function guardarDocumento(url,id_evaluacion){
    let json = {};
    json.id_evaluacion = id_evaluacion;
    json.id_usuario = 12;
    json.url = url

    console.log("el jason: "+json);
   RequestPOST("/API/registro/entrega_tarea", json).then((response) => {
        console.log(response);
        swal.fire({
            text: response.mensaje
        }).then(() => {
            //recargar por access token 
            if (response.success) {
               // var id = response.id
                $('#contenidoSection').load('tarea_alumno')
                /*let url = window.location.protocol + "//" + window.location.host + "/" + DEPENDENCIA + "/";
                acceso_externo(url);*/
            }
        });
    });
}


const subirArchivosNormal = (id_evaluacion) => {
return new Promise((resolve, reject) => {

        var BucketName = "lineamientos";
        var bucketRegion = "us-east-1";
        var IdentityPoolId = "us-east-1:a8460f87-8d3f-4452-935a-b95a4fcc83ed";

        AWS.config.update({
            region: bucketRegion,
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: IdentityPoolId
            })
        });

        var s3 = new AWS.S3({
            apiVersion: "2006-03-01",
            params: { Bucket: BucketName }
        });


        var params = {
            Bucket: BucketName,
            Prefix: 'Logotipos'
        };
        s3.listObjects(params, function(err, data) {
            if (err) {

                swal.fire({
                    text: "Error de conexión con el servidor."
                });
            } else {

                numFiles = data.Contents.length;

                var attachment = document.getElementById("inputFile");

                var files = attachment.files; // FileList object

                var uploadFiles = files;
                var upFile = files[0];
                if (upFile) {

                    var bucket = new AWS.S3({params: {Bucket: BucketName+"/Tarea"+id_evaluacion}});
                    //var uploadFiles = $('#upFile');
                    console.log("uploadFiles");
                    console.log(uploadFiles);
                    for (var i = 0; i < uploadFiles.length; i++) {
                        console.log("upFile");
                        upFile = uploadFiles[i];
                        console.log(upFile);
                        var params = {
                            Body: upFile,
                            Key: upFile.name,
                            ContentType: upFile.type
                        };
                        bucket.upload(params).on('httpUploadProgress', function (evt) {
                            console.log(evt);
                        }).send(function (err, data) {
                            if (err) {
                                console.log("algo salio mal");
                                console.log(err, err.stack); // an error occurred
                            } else {
                                console.log("All is well");
                                console.log(data);           // successful response
                                guardarDocumento(data.Location,id_evaluacion); 
                            }
                            $('#upFile').val(null);
                            $("#showMessage").show();
                        });
                    }

                } else {
                    alert("Seleccione un archivo para subir al bucket");
                }
            }
        });

    });
}