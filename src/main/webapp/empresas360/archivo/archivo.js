/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global RequestPOST, directorio_usuario, AWS, sesion_cookie, NotificacionToas, moment, Swal, lottieLoader_blockpage, superCm, swal */

var vueArchivos, tablaArchivos, detailRows = [], usuariosReenviaArchivo = [];
var banderaD = false, banderaR = false;
const selectOrigen = $("#origenArchivo");
const destinatarioArchivo = $("#destinatarioArchivo");
const remitenteArchivo = $("#remitenteArchivo");
const archivosEncontrados = $("#contentArchivos");
const archivosNoEncontrados = $("#sinArchivos");
const buttonBorrarArchivos = $("#eliminarArchivos");
const refrescarArchivos = $("#refrescarArchivos");

const loaderArchivos = $("#loaderArchivos");

const confirmArchivos = (message, textConfirm, textCancel) => {
    return new Promise((resolve, reject) => {
        swal.fire({
            text: message,
            showCancelButton: true,
            confirmButtonText: textConfirm,
            cancelButtonText: textCancel
        }).then((result) => {
            if (result.dismiss)
                resolve(false);
            if (result.value)
                resolve(true);
        });
    });
};
    
const muestraLoaderArchivo = () => {
    loaderArchivos.removeClass("d-none");
};

const ocultaLoaderArchivo = () => {
    loaderArchivos.addClass("d-none");
};

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

vuewModalReenviaArchivo = () => {
  
    usuariosReenviaArchivo = new Array();
    var json = directorio_usuario;
    vue = new Vue({
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
                usuariosReenviaArchivo.push(op.id360);
            },
            onClose() {
                //console.info(this.value);
            },
            onRemove(op) {
                var i = usuariosReenviaArchivo.indexOf(op.id360);
                console.log(i);
                usuariosReenviaArchivo.splice(i, 1);
            }

        }
    }).$mount('#usuariosReenviaArchivo');
    
};

function detalleArchivo ( d ) {
    
    console.log(d);
    let destinatarios = d[13];
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
    
    let detalle =   '<table cellpadding="5" class="tablaDetalle" cellspacing="0" border="0" style="padding-left:50px; width: 100%;">'+
                        '<tr>'+
                            '<td style="width: 15%;">Compartido con:</td>'+
                            '<td style="width: 30%;">'+msjDestinatarios+'</td>'+
                            '<td rowspan="5" style="width: 55%;">';

    let extension = d[11];
    
    if(extension === "pdf"){
        detalle +=              '<embed type="application/pdf" style="width: 100%; height: 300px;" frameborder="0" src="'+d[9]+'" >';
    }else if( extension === "gif" || extension === "jpg" || extension === "jpeg" || extension === "png" ){
        detalle +=              '<img style="max-width: 100%; max-height: 300px" src="'+d[9]+'" />';
    }
        
    detalle +=              '</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td>Proyecto:</td>'+
                            '<td>'+d[3]+'</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td>Título:</td>'+
                            '<td>'+d[2]+'</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td>Descripción:</td>'+
                            '<td>'+d[10]+'</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td>Extensión:</td>'+
                            '<td>'+extension+'</td>'+
                        '</tr>'+
                    '</table>';
    
    console.log(detalle);
            
    return detalle;
}

const buscaArchivosEnviado = () => {
    
    muestraLoaderArchivo();
    
    let services = "/API/empresas360/consultar_archivos_empresas";
    let dataArchivos = {
        "id360": sesion_cookie.idUsuario_Sys
    };
    
    if(selectOrigen.val() !== "0"){
        
        if(selectOrigen.val() === "1"){
            
            if( destinatarioArchivo.val() === "0" ){
                services = "/API/empresas360/consultar_archivos_empresas_enviados_por_mi";
            }else{
                services = "/API/empresas360/consultar_archivos_empresas_enviados_por_mi_a";
                dataArchivos.to_id360 = destinatarioArchivo.val();
            }
        
        }else{
            
            if( remitenteArchivo.val() === "0" ){
                services = "/API/empresas360/consultar_archivos_empresas_enviados_a_mi";
            }else{
                services = "/API/empresas360/consultar_archivos_empresas_enviados_a_mi_de";
                dataArchivos.to_id360 = remitenteArchivo.val();
            }
            
        }
        
    }
    
    console.log(dataArchivos);
    RequestPOST(services, dataArchivos).then((response) => {
                
        if(response.length>0){
            
            if(tablaArchivos !== undefined){
                tablaArchivos.clear();
                tablaArchivos.destroy();
            }
            
            /* DESPLIEGUE DE ARCHIVOS ENCONTRADOS */
            let archivos = response;
            let arrayArchivos = [];
            $.each(archivos, (index, archivo) => {
                
                let iconSeleccionar = '<i class="fas fa-hand-pointer"></i>';
                let buttonCompartir = '<button class="btn btn-app"><i class="fas fa-share"></i></button>';
                let buttonDescargar = '<a href="'+archivo.ruta_archivo+'" download="'+archivo.titulo_archivo+'" target="_blank" class="btn btn-app"><i class="fas fa-cloud-download-alt"></i></a>';
                
                arrayArchivos.push([
                    iconSeleccionar,
                    "",
                    archivo.titulo_archivo,
                    archivo.nombre_proyecto,
                    archivo.fecha_envio,
                    archivo.hora_envio,
                    buttonCompartir,
                    buttonDescargar,
                    archivo.id_archivo,
                    archivo.ruta_archivo,
                    archivo.descripcion_archivo,
                    archivo.tipo_archivo,
                    archivo.id360,
                    archivo.destinatarios,
                    archivo.agrupador
                ]);
                
            });
            
            console.log(arrayArchivos);
            tablaArchivos = $('#tablaArchivos').DataTable( {
                "data": arrayArchivos,
                "columns": [
                    {
                        "class": "seleccionar-archivo",
                        "orderable":      false,
                        "title":          "Selec."
                    },
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
                        "class": "compartirArchivo",
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

                        var select = $('<select style="width: 80%; margin-left: 10%; height: 15px; margin-top: 10px; margin-bottom: 10px;" class="custom-select"><option value=""></option></select>')
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
            
            /* SELECCIONAR FILA */
            $('.archivo tbody').on( 'click', 'tr td.seleccionar-archivo', function () {
                $(this).parent().toggleClass('selected');
            } );

            /* COMPARTIR ARCHIVO */
            $('.archivo tbody').on( 'click', 'tr td.compartirArchivo button', function () {
                var tr = $(this).closest('tr');
                var row = tablaArchivos.row( tr );
                let data = row.data();
                
                let contenedorReenviaArchivo = $("<div></div>");

                let formReenviaArchivo = $("<form></form>");
                formReenviaArchivo.attr("id","formReenviaArchivo");
                formReenviaArchivo.attr("autocomplete","off");

                let formGroupReenviaArchivo = $("<div></div>").addClass("form-group");
                let labelUsuariosReenvia = $("<label></label>");
                labelUsuariosReenvia.text("Reenviar a:");
                let selectUsuariosReenvia = '<div class="col-12" id="usuariosReenviaArchivo">' +
                                                    '<multiselect ' +
                                                    'placeholder=""' +
                                                    'v-model="value" ' +
                                                    ':options="options"' +
                                                    'track-by="id360"' +
                                                    ':multiple="true"' +
                                                    ':taggable="false"' +
                                                    ':close-on-select="false"' +
                                                    ':custom-label="customLabel" ' +
                                                    ':select-label="\'Seleccionar\'" ' +
                                                    ':selected-Label="\'Seleccionado\'"' +
                                                    ':deselect-Label="\'Remover\'"' +
                                                    ':hide-selected="true"' +
                                                    '@select="onSelect"' +
                                                    '@Close="onClose"' +
                                                    '@Remove="onRemove">' +
                                                    '</multiselect>' +
                                                    '<pre class="language-json" style="display:none"><code>{{ value  }}</code></pre>' +
                                                '</div>';
                formGroupReenviaArchivo.append(labelUsuariosReenvia);
                formGroupReenviaArchivo.append(selectUsuariosReenvia);
                formReenviaArchivo.append(formGroupReenviaArchivo);

                let buttonSubmitReenviaMensaje = $("<button></button>").addClass("btn btn-danger btn-block mt-4");
                buttonSubmitReenviaMensaje.attr("type","submit");
                buttonSubmitReenviaMensaje.text("Reenviar mensaje");
                formReenviaArchivo.append(buttonSubmitReenviaMensaje);

                contenedorReenviaArchivo.append(formReenviaArchivo);

                Swal.fire({
                    html: contenedorReenviaArchivo,
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonText: 'Cancelar',
                    allowOutsideClick: false,
                    allowEscapeKey : false
                }).then((result) => {
                });

                vuewModalReenviaArchivo();

                $("#usuariosReenviaArchivo .multiselect__content-wrapper").css({"background-color":"#fff"});

                $("#formReenviaArchivo").submit((e) => {

                    e.preventDefault();
                    if( usuariosReenviaArchivo.length ){

                        Swal.close();
                        muestraLoaderArchivo();

                        let rutaArchivo = data[9];
                        let partes = rutaArchivo.split(".");
                        let tipo = partes[ partes.length-1 ];
                        let dataArchivo = {
                            'titulo_archivo': data[2],
                            'descripcion_archivo': data[10],
                            'ruta_archivo': rutaArchivo,
                            'tipo_archivo': tipo,
                            'proyecto': data[3],
                            'id360': sesion_cookie.idUsuario_Sys,
                            'destinatarios': usuariosReenviaArchivo,
                            "tipo_usuario": sesion_cookie.tipo_usuario,
                            'tipo_servicio': sesion_cookie.tipo_servicio,
                            'tipo_area': sesion_cookie.tipo_area
                        };

                        RequestPOST("/API/empresas360/guardar_archivo_empresas", dataArchivo).then((response) => {
                            console.log(response);
                            
                            ocultaLoaderArchivo();
                            
                            if(response.success){
                                usuariosReenviaArchivo = [];
                                buscaArchivosEnviado();
                            }
                            
                        });

                    }

                });
                
            });
            
            /* MOSTRAR DETALLE */
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
            
            archivosEncontrados.removeClass("d-none");
            archivosNoEncontrados.addClass("d-none");
            
        }else{
            
            /* SIN ARCHIVOS ENCONTRADOS */
            archivosEncontrados.addClass("d-none");
            archivosNoEncontrados.removeClass("d-none");
            
        }
        
        ocultaLoaderArchivo();
        
    });
    
};

buttonBorrarArchivos.click((e) => {
    
    let myMenu = [{
        icon: 'fas fa-trash-alt',
        label: 'Eliminar todos los archivos',
        action: function(option, contextMenuIndex, optionIndex) {
            
                confirmArchivos("¿Borrar todos los archivos?", "Borrar","Mantener").then(response => {
                    
                    if(response){
                        
                        RequestPOST("/API/empresas360/eliminar_todos_los_archivos", {"id360": sesion_cookie.idUsuario_Sys}).then((response) => {
                            if(response.success){
                                buscaArchivosEnviado();
                            }
                        });
                        
                    }
                    
                });
            
        },
        submenu: null,
        disabled: false 
    },{
        icon: 'fas fa-trash-alt',
        label: 'Eliminar archivos seleccionados',
        action: function(option, contextMenuIndex, optionIndex) {
            
            let cantidadFilasSeleccionadas = parseInt(tablaArchivos.rows('.selected').data().length);
            
            if(cantidadFilasSeleccionadas === 0){
                swal.fire({"text": "Aún no selecciona ningún archivo. Da click sobre cualquiera de ellos para seleccionarlo"});
                return false;
            }
            
            let agrupadores = [];
            $.each(tablaArchivos.rows('.selected').data(), (index, archivo) => {
                
                let agrupador = archivo[14];
                agrupadores.push(agrupador);
                
            });
            
            console.log(agrupadores);
            confirmArchivos("¿Eliminar los " + cantidadFilasSeleccionadas + " archivos seleccionados?", "Eliminar", "Mantener archivos").then((response) => {
                        
                if(response){

                    RequestPOST("/API/empresas360/eliminar_archivos_seleccionados", {"agrupadores": agrupadores, "id360": sesion_cookie}).then((response) => {
                        if(response.success){
                            buscaArchivosEnviado();
                        }
                    });

                }

            });
            
        },
        submenu: null,
        disabled: false 
    }];

    superCm.createMenu(myMenu, e);
    
});

refrescarArchivos.click(() => {
    buscaArchivosEnviado();
});

var init_archivo = (json) => {
    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;
    let vuewModelDestinatariosArchivos;
    let destinatarios_archivos;
    
    lottieLoader_blockpage.style = "width: 200px;height: 200px;";
    document.getElementById("loaderArchivos").appendChild(lottieLoader_blockpage);
    
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
    
    const selectDestinatario = $("#selectDestinatarioArchivos");
    const selectRemitente = $("#selectRemitenteArchivos");
    
    
    let optionTodosR = $("<option value='0'>Todos</option>");
    let optionTodosD = $("<option value='0'>Todos</option>");
    destinatarioArchivo.append(optionTodosR);
    remitenteArchivo.append(optionTodosD);
    
    $.each(directorio_usuario, (index, usuario) => {
        let optionR = $("<option></optioah ya xn>");
        optionR.text( usuario.nombre + " " + usuario.apellido_paterno + " " + usuario.apellido_materno );
        optionR.attr("value",usuario.id360);
        
        let optionD = $("<option></optioah ya xn>");
        optionD.text( usuario.nombre + " " + usuario.apellido_paterno + " " + usuario.apellido_materno );
        optionD.attr("value",usuario.id360);
        
        destinatarioArchivo.append(optionD);
        remitenteArchivo.append(optionR);
        
    });
    
    selectOrigen.change(() => {
        
        let opcionOrigen = parseInt(selectOrigen.val());
        
        banderaD = false;
        banderaR = false;
        
        destinatarioArchivo.val("0");
        destinatarioArchivo.trigger("change");
        remitenteArchivo.val("0");
        remitenteArchivo.trigger("change");
        
        switch(opcionOrigen){
            case 0:
                    selectDestinatario.addClass("d-none");
                    selectRemitente.addClass("d-none");
                break;
            case 1:
                    selectDestinatario.removeClass("d-none");
                    selectRemitente.addClass("d-none");
                break;
            case 2:
                    selectDestinatario.addClass("d-none");
                    selectRemitente.removeClass("d-none");
                break;
        }
        
        buscaArchivosEnviado();
        
        banderaD = true;
        banderaR = true;
        
    });
    
    destinatarioArchivo.change(() => {
        if(banderaD){
            buscaArchivosEnviado();
        }
    });
    
    remitenteArchivo.change(() => {
        if(banderaR){
            buscaArchivosEnviado();
        }
    });

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

        muestraLoaderArchivo();

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
                    
                    ocultaLoaderArchivo();

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