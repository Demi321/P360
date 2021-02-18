/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global RequestPOST, directorio_completo, AWS, sesion_cookie, NotificacionToas */

const contenedorArchivos = $("#contenedorDespliegueDeArchivos");

const buscaArchivosEnviado = () => {
    
    let dataArchivos = {
        "id360": sesion_cookie.idUsuario_Sys
    };
    
    RequestPOST("/API/empresas360/consultar_archivos_empresas", dataArchivos).then((response) => {
        
        contenedorArchivos.empty();
        
        if(response.length>0){
            
            /* DESPLIEGUE DE ARCHIVOS ENCONTRADOS */
            $.each(response, (index, archivo) => {
                
                let contentItem = $("<div></div>").addClass("col-12 m-0 p-0");
                let item = $("<div></div>").addClass("row col-12 m-0 p-0 p-1 border-bottom d-flex justify-content-center align-items-center");

                let dataItem = $("<a></a>").addClass("row m-0 p-0 col-10 text-dark d-flex justify-content-center align-items-center collapsed");
                dataItem.attr("data-toggle", "collapse");
                dataItem.attr("href", "#itemArchivo" + archivo.id_archivo);
                
            });
            
        }else{
            
            /* SIN ARCHIVOS ENCONTRADOS */
            
        }
        
    });
    
};

var init_archivo = (json) => {
    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;
    let vuewModelDestinatariosArchivos;
    let destinatarios_archivos;
    
    const i = () => {
        $("#archivos_envio").fileinput({
            theme: 'fa',
            language: 'es',
            maxFileCount: 1,
            showRemove: true,
            showUpload: false,
            showDownload: false,
            initialPreviewFileType: 'image'
        });

        const buttonNuevoEnvio = $("#enviar_nuevo_archivo");
        const buttonCancelarEnvio = $("#btnCancelarEnvio");
        const buttonEnviarArchivo = $("#btnEnviarArchivo");
        const contenedorNuevoEnvio = $("#nuevo_envio_archivo");
        const formEnvioArchivo = $("#form-enviar-archivo");
        const listadoDeProyectos = $("#listado_proyectos");

        vuewModelDestinatariosArchivos = () => {

            destinatarios_archivos = new Array();
            var json = directorio_completo;
            vueArchivos = new Vue({
                components: {
                    Multiselect: window.VueMultiselect.default
                },
                data: {

                    value: [
                    ],
                    options: json


                },
                methods: {
                    customLabel(option) {
                        return  option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno;
                    },
                    onSelect(op) {
                        destinatarios_archivos.push(op.id360);
                    },
                    onClose() {
                        //console.info(this.value);
                    },
                    onRemove(op) {
                        var i = destinatarios_archivos.indexOf(op.id360);
                        destinatarios_archivos.splice(i, 1);
                    }

                }
            }).$mount('#destinatario_archivos');

            $("#destinatario_archivos").css({
                "padding":"0",
                "border-bottom":"1px solid lightgray"
            });

            $("#destinatario_archivos .multiselect__single").css({
                "padding":"0",
                "color": "#495057"
            });

        };
        vuewModelDestinatariosArchivos();

        buttonNuevoEnvio.click(() => {

            if( contenedorNuevoEnvio.css("display") === "none" ){
                formEnvioArchivo[0].reset();

                listadoDeProyectos.empty();
                let dataConsultaProyectos = {
                    "tipo_usuario": tipo_usuario
                };

                RequestPOST("/API/empresas360/consultar_proyectos", dataConsultaProyectos).then((response) => {
                    $.each(response, (index, proyecto) => {
                        let item = $("<option>");
                        item.attr("value", proyecto.nombre_proyecto);
                        listadoDeProyectos.append(item);
                    });
                });

                contenedorNuevoEnvio.slideDown("fast", () => {});
            }

        });

        buttonCancelarEnvio.click(() => {
            contenedorNuevoEnvio.slideUp("fast", () => {});
        });

        buttonEnviarArchivo.click(() => {

            let bucketName="proyecto-backend";
            let bucketRegion="us-east-1" ;
            let IdentityPoolId = "us-east-1:715df460-b915-49bc-81a9-501b8e9177b6";

            AWS.config.update({
                    region: bucketRegion,
                    credentials: new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: IdentityPoolId
                    })
            });

            let s3 = new AWS.S3({
                    apiVersion: "2006-03-01",
                params: {Bucket: bucketName}
            });

            let addFile = () => {	

                    var files = document.getElementById('archivos_envio').files;
                    if(!files.length){
                        return alert("Elige un archivo valido");
                    }
                    var file = files[0];
                    var file_name = file.name;
                    var file_storage_key=encodeURIComponent("Prueba") + "/";
                    var file_key= file_storage_key+file_name;
                    var upload = new AWS.S3.ManagedUpload({
                        partSize: 5 * 1024 * 1024, // 5 MB
                        params : {
                                Bucket: bucketName,
                                Key: file_key,
                                Body: file
                        }
                    });

                    var promise = upload.on('httpUploadProgress', function(evt) {

                    console.log("Cargando :: " + parseInt((evt.loaded * 100) / evt.total)+'%');

                }).promise();

                promise.then((data)=>{
                    console.log("data",data);

                    /*
                     * ENVIAR EL ARCHIVO A LA DB
                     */

                    let rutaArchivo = data.Location;
                    let partes = rutaArchivo.split(".");
                    let tipo = partes[ partes.length-1 ];
                    let dataArchivo = {
                        'titulo_archivo': $("#tituloArchivo").val(),
                        'descripcion_archivo': $("#descripcionArchivo").val(),
                        'ruta_archivo': data.Location,
                        'tipo_archivo': tipo,
                        'proyecto': $("#list_proj").val(),
                        'id360': sesion_cookie.idUsuario_Sys,
                        'destinatarios': destinatarios_archivos,
                        "tipo_usuario": tipo_usuario,
                        'tipo_servicio': tipo_servicio,
                        'tipo_area': tipo_area
                    };

                    RequestPOST("/API/empresas360/guardar_archivo_empresas", dataArchivo).then((response) => {
                        
                        if( response.success ){
                            formEnvioArchivo[0].reset();
                            
                            contenedorNuevoEnvio.slideUp("fast", () => {
                                NotificacionToas.fire({
                                    title: 'Archivo enviado'
                                });
                            });

                        }
                        
                    });

                },(error)=>{
                    console.log("error",error);
                });

            };

            addFile();

        });
    };
    
    let intervalArchivos = setInterval(function(){ 
    
        if( typeof directorio_completo !== 'undefined' ){
            i();
            clearInterval(intervalArchivos);
        }
    
    }, 1000);
    
    buscaArchivosEnviado();
    
};