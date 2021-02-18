/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global RequestPOST, directorio_usuario, AWS, sesion_cookie, NotificacionToas, moment, Swal */

var vueArchivos, tablaArchivos, detailRows = [];

const NotificacionToasArchivos = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});


const buscaEnDirectorioCompletoArchivos = (id360) => {
    let user;
    $.each(directorio_usuario, (i) => {
        if (id360 === directorio_usuario[i].id360) {
            user = directorio_usuario[i];
            return false;
        }
    });
    return user;
};

function detalleArchivo ( d ) {
    
    console.log(d);
    let destinatarios = d[12];
    let arrayDestinatarios = destinatarios.split(",");
    let msjDestinatarios = "";
    
    let cantidadDestinatarios = arrayDestinatarios.length;
    $.each(arrayDestinatarios, (index, destinatario) => {
                        
        let user = buscaEnDirectorioCompletoArchivos(destinatario);

        if(user !== undefined){

            let nombre = buscaEnDirectorioCompletoArchivos(destinatario).nombre;
            if(index === 0){
                msjDestinatarios += nombre;
            }else if(index === (cantidadDestinatarios-2) ){
                msjDestinatarios += ", " + nombre;
            }else{
                msjDestinatarios += " y con " + nombre;
            }

        }

    });
    
    return '<table cellpadding="5" class="tablaDetalle" cellspacing="0" border="0" style="padding-left:50px;">'+
                '<tr>'+
                    '<td>Compartido con:</td>'+
                    //'<td>'+d.name+'</td>'+
                    '<td>'+msjDestinatarios+'</td>' +
                '</tr>'+
                '<tr>'+
                    '<td>Proyecto:</td>'+
                    '<td>'+d[2]+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Título:</td>'+
                    '<td>'+d[1]+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Descripción:</td>'+
                    '<td>'+d[9]+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Extensión:</td>'+
                    '<td>'+d[10]+'</td>'+
                '</tr>'+
            '</table>';
}

const buscaArchivosEnviado = () => {
    
    let dataArchivos = {
        "id360": sesion_cookie.idUsuario_Sys
    };
    
    RequestPOST("/API/empresas360/consultar_archivos_empresas", dataArchivos).then((response) => {
                
        if(response.length>0){
            
            if(tablaArchivos !== undefined){
                tablaArchivos.clear();
                tablaArchivos.destroy();
            }
            
            /* DESPLIEGUE DE ARCHIVOS ENCONTRADOS */
            let archivos = response;
            let arrayArchivos = [];
            $.each(archivos, (index, archivo) => {
                
                let buttonCompartir = '<button class="btn btn-app"><i class="fas fa-share"></i></button>';
                let buttonDescargar = '<button class="btn btn-app"><i class="fas fa-cloud-download-alt"></i></button>';
                
                arrayArchivos.push([
                    "",
                    archivo.titulo_archivo,
                    archivo.nombre_proyecto,
                    archivo.date_created,
                    archivo.time_created,
                    buttonCompartir,
                    buttonDescargar,
                    archivo.id_archivo,
                    archivo.ruta_archivo,
                    archivo.descripcion_archivo,
                    archivo.tipo_archivo,
                    archivo.id360,
                    archivo.destinatarios
                ]);
                
            });
            
            console.log(arrayArchivos);
            tablaArchivos = $('#tablaArchivos').DataTable( {
                "data": arrayArchivos,
                "columns": [
                    {
                        "class":          "details-control",
                        "orderable":      false,
                        "title":          "Detalle",
                        "defaultContent": ""
                    },
                    { "title": "Título" },
                    { "title": "Proyecto" },
                    { "title": "Fecha de envío" },
                    { "title": "Hora de envío" },
                    {
                        "title": "Compartir",
                        "orderable": false
                    },
                    {
                        "title": "Descargar",
                        "orderable": false
                    }
                ],
                "order": [[1, 'asc']],
                initComplete: function() {
                    this.api().columns([1,2,3]).every(function() {
                        var column = this;

                        var select = $('<select style="width: 80%; margin-left: 10%; height: 15px; margin-top: 10px;" class="custom-select"><option value=""></option></select>')
                            .appendTo($(column.header()))
                            .on('change', function() {
                                var val = $.fn.dataTable.util.escapeRegex(
                                    $(this).val()
                                );

                                column
                                    .search(val ? '^' + val + '$' : '', true, false)
                                    .draw();


                            });

                        $(select).click(function(e) {
                            e.stopPropagation();
                        });

                        column.data().unique().sort().each(function(d, j) {
                            select.append('<option value="' + d + '">' + d + '</option>');
                        });

                    });
                    
                },
                "aoColumnDefs": [
                    { "bSearchable": true, "aTargets": [ 1 ] }
                ]
            } );
            
            $('#tablaArchivos').css({
                "width":"100%"
            });
            
            $('.archivo tbody').off();
            $('.archivo tbody').on( 'click', 'tr td.details-control', function () {
                var tr = $(this).closest('tr');
                var row = tablaArchivos.row( tr );
                var idx = $.inArray( tr.attr('id'), detailRows );

                console.log(row);
                if ( row.child.isShown() ) {
                    tr.removeClass( 'details' );
                    row.child.hide();
                    detailRows.splice( idx, 1 );
                }
                else {
                    tr.addClass( 'details' );
                    row.child( detalleArchivo(row.data()) ).show();

                    if ( idx === -1 ) {
                        detailRows.push( tr.attr('id') );
                    }
                    
                    $(".tablaDetalle").parent().css({
                        "padding":"10px",
                        "background-color": "lightgray",
                        "border-radius":"20px"
                    });
                }
            } );
            
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
    const contenedorDespliegueArchivos = $("#contenedorDespliegueDeArchivos");
    const formEnvioArchivo = $("#form-enviar-archivo");
    const listadoDeProyectos = $("#listado_proyectos");

    vuewModelDestinatariosArchivos = () => {

        destinatarios_archivos = new Array();
        var json = directorio_usuario;
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

        console.log("Nuevo envio");
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

            contenedorDespliegueArchivos.slideUp("fast", () => {
                contenedorNuevoEnvio.slideDown("fast", () => {});
            });
            
        }

    });

    buttonCancelarEnvio.click(() => {
        console.log("Cancelar envio");
        contenedorNuevoEnvio.slideUp("fast", () => {
            contenedorDespliegueArchivos.slideDown("fast", () => {});
        });
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

                    buscaArchivosEnviado();

                    if( response.success ){
                        formEnvioArchivo[0].reset();
                        //Limpiar el input del vue
                        vueArchivos.value=null;
                        contenedorNuevoEnvio.slideUp("fast", () => {
                            contenedorDespliegueArchivos.slideDown("fast", () => {
                                NotificacionToasArchivos.fire({
                                    title: 'Archivo enviado'
                                });
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
    
    buscaArchivosEnviado();
    
};