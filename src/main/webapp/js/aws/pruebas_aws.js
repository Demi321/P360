/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global AWS */

//var BucketName = "mimedico360";
//var bucketRegion = "us-east-1";
//var IdentityPoolId = "us-east-1:6036cf00-0e3e-4770-9332-0d427bff627e";
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
    params: {Bucket: BucketName}
});
console.log("$$$$$$$$$");
console.log(s3);

var params = {
    Bucket: BucketName
};
s3.listObjects(params, function (err, data) {
    if (err) {
        console.log("ocurrio un error");
        console.log(err, err.stack); // an error occurred
    } else {
        console.log("all is well");
        console.log(data);   // successful response
    }
});




function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate.toLocaleDateString(), '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
    
    $("#upload").submit(function (e) {
    e.preventDefault();
    var uploadFiles = files;
    var upFile = files[0];
    if (upFile) {
        var bucket = new AWS.S3({params: {Bucket: BucketName+"/pruebas2"}});
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
                }
                $('#upFile').val(null);
                $("#showMessage").show();
            });
        }
    } else {
        alert("Seleccione un archivo para subir al bucket");
    }
});
}

document.getElementById('upFile').addEventListener('change', handleFileSelect, false);


//var albumBucketName = "mimedico360";
// 
//var myCredentials = new AWS.CognitoIdentityCredentials({
//    IdentityPoolId:'us-east-1_fP57VvohT'
//});
//var myConfig = new AWS.Config({
//  credentials: myCredentials, region: 'us-east-1'
//});
//
//console.log(myCredentials);
//console.log(myConfig);
//
//var params = {};
//var s3 = new AWS.S3({
//  apiVersion: "2006-03-01",
//  params: { Bucket: "mimedico360" }
//});
//s3.listBuckets(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });


