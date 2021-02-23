/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global RequestPOST, directorio_usuario, AWS, sesion_cookie, NotificacionToas, moment, Swal, lottieLoader_blockpage, superCm, swal, Notification, PathRecursos, pdfjsLib, perfil */

var vueArchivos, tablaArchivos, detailRows = [], usuariosReenviaArchivo = [], tipoVistaArchivos = 0;
var banderaD = false, banderaR = false;
const selectOrigen = $("#origenArchivo");
const destinatarioArchivo = $("#destinatarioArchivo");
const remitenteArchivo = $("#remitenteArchivo");
const archivosEncontrados = $("#contentArchivos");
const archivosNoEncontrados = $("#sinArchivos");
const buttonBorrarArchivos = $("#eliminarArchivos");
const refrescarArchivos = $("#refrescarArchivos");
var recibirArchivoSocket;

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

const initVistaArchivos = () => {
    
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
                                '<td>Remitente:</td>'+
                                '<td>'+d[12]+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td style="width: 15%;">Compartido con:</td>'+
                                '<td style="width: 30%;">'+msjDestinatarios+'</td>'+
                                '<td rowspan="5" style="width: 55%; text-align: center;">';

        let extension = d[3];

        if(extension === "pdf"){

            let canvas = '<div id="my_pdf_viewer'+d[9]+'">' +
                            '<div style="max-width: 100%; height: 450px; overflow: auto; background: #333;text-align: center; border: solid 3px;" id="canvas_container'+d[9]+'">' +
                                '<canvas id="pdf_renderer'+d[9]+'"></canvas>' +
                                '<div id="navigation_controls'+d[9]+'">' +
                                    '<button id="go_previous'+d[9]+'">Previous</button>' +
                                    '<input id="current_page'+d[9]+'" value="1" type="number" />' +
                                    '<button id="go_next'+d[9]+'">Next</button>' +
                                '</div>' +
                                '<div id="zoom_controls'+d[9]+'">' +
                                    '<button id="zoom_in'+d[9]+'">+</button>' +
                                    '<button id="zoom_out'+d[9]+'">-</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>';

            //detalle +=              '<embed type="application/pdf" style="width: 100%; height: 300px;" frameborder="0" src="'+d[10]+'" >';
            //detalle +=              '<object data="'+d[10]+'" type="application/pdf"><p>The PDF couldn\'t be displayed</p</object>';
            detalle +=              canvas;
        }else if( extension === "gif"|| extension === "GIF" || extension === "jpg" || extension === "JPG" || extension === "jpeg" || extension === "JPEG" || extension === "png" || extension === "PNG"){
            detalle +=              '<img style="max-width: 100%; max-height: 300px" src="'+d[10]+'" />';
        }

        detalle +=              '</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>Proyecto:</td>'+
                                '<td>'+d[4]+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>Título:</td>'+
                                '<td>'+d[2]+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>Descripción:</td>'+
                                '<td>'+d[11]+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>Extensión:</td>'+
                                '<td>'+extension+'</td>'+
                            '</tr>'+
                        '</table>';

        return detalle;
    }

    const buscaArchivosEnviado = (tituloDefault) => {

        console.log("Filtrar: " + tituloDefault);
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

                    let iconSeleccionar = '<i class="fas fa-hand-point-right"></i>';
                    let buttonCompartir = '<button class="btn btn-app"><i class="fas fa-share"></i></button>';
                    let buttonDescargar = '<a href="'+archivo.ruta_archivo+'" download="'+archivo.titulo_archivo+'" target="_blank" class="btn btn-app"><i class="fas fa-cloud-download-alt"></i></a>';

                    arrayArchivos.push([
                        iconSeleccionar,
                        "",
                        archivo.titulo_archivo,
                        archivo.tipo_archivo,
                        archivo.nombre_proyecto,
                        archivo.fecha_envio,
                        archivo.hora_envio,
                        buttonCompartir,
                        buttonDescargar,
                        archivo.id_archivo,
                        archivo.ruta_archivo,
                        archivo.descripcion_archivo,
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
                        { "title": "Tipo" },
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
                        this.api().columns([2,3,4,5]).every(function() {
                            var column = this;

                            var containerSelect = $("<div></div>");
                            containerSelect.css({
                                "width":"100%",
                                "margin":"5px 0"
                            });
                            var select = $('<select style="width: 80%; margin-left: 10%; height: 15px; margin-top: 10px; margin-bottom: 10px;" class="custom-select select2"><option value="">Todos</option></select>')
                                .appendTo(containerSelect)
                                .on('change', function() {
                                    var val = $.fn.dataTable.util.escapeRegex(
                                        $(this).val()
                                    );

                                    column
                                        .search(val ? '^' + val + '$' : '', true, false)
                                        .draw();


                                });

                            containerSelect.appendTo($(column.header()));

                            containerSelect.click(function(e) {
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

                $("#tablaArchivos .select2").select2();

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

                            let rutaArchivo = data[10];
                            let partes = rutaArchivo.split(".");
                            let tipo = partes[ partes.length-1 ];
                            tipo = tipo.toLowerCase() ;
                            let dataArchivo = {
                                'titulo_archivo': data[2],
                                'descripcion_archivo': data[11],
                                'ruta_archivo': rutaArchivo,
                                'tipo_archivo': tipo,
                                'proyecto': data[4],
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

                        if(row.data()[3] === "pdf"){
                            let myState = {
                                pdf: null,
                                currentPage: 1,
                                zoom: 1
                            };

                            let render = () => {
                                try{
                                    myState.pdf.getPage(myState.currentPage).then((page) => {

                                        let canvas = document.getElementById("pdf_renderer"+ row.data()[9]);
                                        let ctx = canvas.getContext('2d');

                                        let viewport = page.getViewport(myState.zoom);
                                        canvas.width = viewport.width;
                                        canvas.height = viewport.height;
                                        page.render({
                                            canvasContext: ctx,
                                            viewport: viewport
                                        });

                                    });
                                }catch(e){
                                    console.log(e);
                                }

                            };

                            pdfjsLib.getDocument(row.data()[10]).then((pdf) => {

                                myState.pdf = pdf;
                                render();

                                document.getElementById('go_previous'+ row.data()[9])
                                    .addEventListener('click', (e) => {
                                        try{
                                            if (myState.pdf === null || myState.currentPage === 1) return;
                                            myState.currentPage -= 1;
                                            document.getElementById("current_page"+ row.data()[9])
                                                .value = myState.currentPage;
                                            render();
                                        }catch(e){
                                            console.log(e);
                                        }
                                    });

                                document.getElementById('go_next'+ row.data()[9])
                                    .addEventListener('click', (e) => {
                                        try{
                                            if (myState.pdf === null ||
                                                myState.currentPage > myState.pdf
                                                ._pdfInfo.numPages)
                                                return;

                                            myState.currentPage += 1;
                                            document.getElementById("current_page"+ row.data()[9])
                                                .value = myState.currentPage;
                                            render();
                                        }catch(e){
                                            console.log(e);
                                        }
                                    });

                                document.getElementById('current_page'+ row.data()[9])
                                    .addEventListener('keypress', (e) => {
                                        try{
                                            if (myState.pdf === null) return;

                                            // Get key code
                                            var code = (e.keyCode ? e.keyCode : e.which);

                                            // If key code matches that of the Enter key
                                            if (code === 13) {
                                                var desiredPage =
                                                    document.getElementById('current_page'+ row.data()[9])
                                                    .valueAsNumber;

                                                if (desiredPage >= 1 &&
                                                    desiredPage <= myState.pdf
                                                    ._pdfInfo.numPages) {
                                                    myState.currentPage = desiredPage;
                                                    document.getElementById("current_page"+ row.data()[9])
                                                        .value = desiredPage;
                                                    render();
                                                }
                                            }
                                        }catch(e){
                                            console.log(e);
                                        }
                                    });

                                document.getElementById('zoom_in'+ row.data()[9])
                                    .addEventListener('click', (e) => {
                                        if (myState.pdf === null) return;
                                        myState.zoom += 0.5;
                                        render();
                                    });

                                document.getElementById('zoom_out'+ row.data()[9])
                                    .addEventListener('click', (e) => {
                                        if (myState.pdf === null || myState.zoom === 0.5) return;
                                        myState.zoom -= 0.5;
                                        render();
                                    });

                            });
                        }

                    }
                } );

                if(tablaArchivos !== undefined && tituloDefault !== undefined && tituloDefault !== null && tituloDefault !== ""){
                    $("#contentArchivos input").val( tituloDefault );
                    tablaArchivos.columns(2).search( tituloDefault ).draw();
                }

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

                        RequestPOST("/API/empresas360/eliminar_archivos_seleccionados", {"agrupadores": agrupadores, "id360": sesion_cookie.idUsuario_Sys}).then((response) => {
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
    
    buscaArchivosEnviado();
    
    const selectDestinatario = $("#selectDestinatarioArchivos");
    const selectRemitente = $("#selectRemitenteArchivos");
    
    
    let optionTodosR = $("<option value='0'>Todos</option>");
    let optionTodosD = $("<option value='0'>Todos</option>");
    destinatarioArchivo.append(optionTodosR);
    remitenteArchivo.append(optionTodosD);
    
    $.each(directorio_usuario, (index, usuario) => {
        let optionR = $("<option></option>");
        optionR.text( usuario.nombre + " " + usuario.apellido_paterno + " " + usuario.apellido_materno );
        optionR.attr("value",usuario.id360);
        
        let optionD = $("<option></option>");
        optionD.text( usuario.nombre + " " + usuario.apellido_paterno + " " + usuario.apellido_materno );
        optionD.attr("value",usuario.id360);
        
        destinatarioArchivo.append(optionD);
        remitenteArchivo.append(optionR);
        
    });
    
    remitenteArchivo.select2();
    destinatarioArchivo.select2();
    
    $(".filtrosArchivos .select2").css({
        "width":"100%"
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
    
    $("#padreArchivosVistaArchivos").css("display","block");
    
};

const initVistaCorreo = () => {
    
    const listadoProyectos = $(".listadoDeProyectos .radio-proyectos");
    
    let dataProyectosMios = {
        "tipo_usuario": sesion_cookie.tipo_usuario,
        "id360": sesion_cookie.idUsuario_Sys
    };
    
    RequestPOST("/API/empresas360/consultar_proyectos_mios", dataProyectosMios).then((response) => {
        
        listadoProyectos.empty();
        
        const agregaDivProyecto = (value, id, text, cantidad, selected) => {
            let div = $("<div></div>").addClass("form-group");
            let input = $("<input>");
            input.attr("value",value);
            input.attr("type","radio");
            input.attr("name","proyectoSeleccionado");
            input.attr("id",id);
            let label = $("<label></label>");
            label.attr("for",id);
            label.text(text);
            
            let cantidadArchivosProyecto = $("<span></span>").addClass("badge bg-secondary");
            label.append(cantidadArchivosProyecto);
            
            div.append(input);
            div.append(label);
            
            listadoProyectos.append(div);
            
            if(selected){
                input.attr("checked",true);
            }
            
        };
        
        agregaDivProyecto("0","todosLosProyectos", "Todos los proyectos", '0', true);
        let suma = 0;
        
        $.each(response, (index, proyecto) => {
            
            suma += proyecto.cantidadArchivos;
            agregaDivProyecto(proyecto.id_proyecto, "proyectoArchivos_" + proyecto.id_proyecto, proyecto.nombre_proyecto, proyecto.cantidadArchivos, false);
            
        });
        
        const contenedorArchivos = $("#archivosVistaCorreo .listadoArchivosVistaCorreo");
        const contenedorDetalleArchivo = $("#archivosVistaCorreo .detalleArchivo");
        
        const cargaArchivosPorProyecto = (proyecto) => {
            
            let dataSolicitaArchivos = {
                "id360": sesion_cookie.idUsuario_Sys
            } ;
            
            if(proyecto !== "0") {
                
                dataSolicitaArchivos.proyecto = proyecto;
                
            };
            
            const agregaItemArchivo = (data) => {
                
                let div = $("<div></div>").addClass("itemArchivo");
                
                let divData = $("<div></div>").addClass("dataItemArchivo");
                let remitente = $("<h5></h5>").addClass("remitenteArchivo");
                
                let nombreRemitente = "";
                let imgRemitente = "";
                let correoRemitente = "";
                if(data.id360 === perfil.id360){
                    nombreRemitente = perfil.nombre + " " + perfil.apellido_paterno + " " + perfil.apellido_materno;
                    imgRemitente = perfil.img;
                    correoRemitente = perfil.correo;
                }else{
                    
                    let userRe = buscaEnDirectorioCompletoArchivos(data.id360);
                    nombreRemitente = userRe.nombre + " " + userRe.apellido_paterno + " " + userRe.apellido_materno;
                    imgRemitente = userRe.img;
                    correoRemitente = userRe.correo;
                    
                }
                
                remitente.text( nombreRemitente );
                divData.append(remitente);
                let asunto = $("<p></p>").addClass("asunto");
                asunto.text(data.titulo_archivo);
                divData.append(asunto);
                
                let divControles = $("<div></div>").addClass("controlesItemArchivo");
                let buttonEliminar = $("<button></button>").addClass("btn btn-sm btn-ligth");
                buttonEliminar.html('<i class="fas fa-trash"></i>');
                divControles.append(buttonEliminar);
                let buttonReenviar = $("<button></button>").addClass("btn btn-sm btn-ligth");
                buttonReenviar.html('<i class="fas fa-share-alt"></i>');
                divControles.append(buttonReenviar);
                
                let divFecha = $("<div></div>").addClass("fechaArchivo");
                let fechaMoment = moment(data.date_created + " " + data.time_created);
                let fechaArchivo = fechaMoment.format("DD-MMM-YY hh:mm A");
                divFecha.text( fechaArchivo );
                
                div.append(divControles);
                div.append(divData);
                div.append(divFecha);
                
                contenedorArchivos.append(div);
                
                div.mouseenter(() => {
                    divControles.css({"display": "block"});
                }).mouseleave(() => {
                    divControles.css({"display": "none"});
                });
                
                div.click(() => {
                    
                    contenedorDetalleArchivo.html('<h5 class="text-center">Detalle de mensaje</h5>');
                    
                    let divDetalle = $("<div></div>");
                    divDetalle.css({
                        "padding":"20px"
                    });
                    
                    /* TITULO CON BOTONES */
                    let divTituloDetalle = $("<div></div>");
                    divTituloDetalle.css({
                        "position":"relative"
                    });
                    let asuntoDetalle = $("<h5></h5>");
                    asuntoDetalle.css({
                        "font-size":"2rem"
                    });
                    asuntoDetalle.text(data.titulo_archivo);
                    divTituloDetalle.append(asuntoDetalle);
                    let divBotoneraDetalle = $("<div></div>");
                    divBotoneraDetalle.css({
                        "position":"absolute",
                        "top": "5px",
                        "right":"5px"
                    });
                    
                    let buttonReenviarC = buttonReenviar;
                    buttonReenviarC.removeClass("btn-sm");
                    
                    let buttonEliminarC = buttonEliminar;
                    buttonEliminarC.removeClass("btn-sm");
                    
                    divBotoneraDetalle.append(buttonReenviarC);
                    divBotoneraDetalle.append(buttonEliminarC);
                    divTituloDetalle.append(divBotoneraDetalle);
                    
                    divDetalle.append(divTituloDetalle);
                    
                    /* INFORMACION REMITENTE */
                    let divInfo = $("<div></div>");
                    divInfo.css({
                        "display":"grid",
                        "grid-template-columns": "50px 1fr 150px",
                        "align-items":"center"
                    });
                    let divFoto = $("<div></div>");
                    let foto = $("<img>").addClass("w-100");
                    foto.attr("src",imgRemitente);
                    foto.css({
                        "max-height":"100%",
                        "border-radius":"50%"
                    });
                    divFoto.append(foto);
                    divInfo.append(divFoto);
                    let divNombre = $("<div></div>").addClass("pl-3");
                    let nDetalle = nombreRemitente;
                    if(correoRemitente !== ""){
                        nDetalle = nDetalle + "<<a href='mailto:'"+correoRemitente+">"+correoRemitente+"</a>>";
                    }
                    divNombre.html(nDetalle);
                    divInfo.append(divNombre);
                    let divFechaD = $("<div></div>");
                    divFechaD.text(fechaArchivo);
                    divInfo.append(divFechaD);
                    
                    /* DESTINATARIOS */
                    let divDestinatarios = $("<div></div>").addClass("w-100 mt-3");
                    
                    let arrayDestinatarios = data.destinatarios.split(",");
                    
                    $.each(arrayDestinatarios, (index, destinatario) => {

                        let user = buscaEnDirectorioCompletoArchivos(destinatario);

                        if(user !== undefined){

                            let pDestinatario = $("<p></p>");
                            pDestinatario.css({
                                "margin-bottom":"0.3rem",
                                "color":"darkcyan"
                            });
                            let nDestinatario = user.nombre + " " + user.apellido_paterno + " " + user.apellido_materno + "< <a style='color:gray' href='mailto:'"+user.correo+">"+user.correo+"</a> >";
                            pDestinatario.html(nDestinatario);
                            divDestinatarios.append(pDestinatario);

                        }

                    });
                    
                    let divCuerpoArchivo = $("<div></div>").addClass("w-100 mt-3");
                    divCuerpoArchivo.html(data.descripcion_archivo);
                    
                    contenedorDetalleArchivo.append(divDetalle);
                    contenedorDetalleArchivo.append(divInfo);
                    contenedorDetalleArchivo.append(divDestinatarios);
                    contenedorDetalleArchivo.append(divCuerpoArchivo);
                    
                });
                
            };
            
            RequestPOST( "/API/empresas360/consultar_archivos_empresas_filtros", dataSolicitaArchivos ).then((response) => {
                
                contenedorArchivos.empty();
                contenedorDetalleArchivo.html('<h5 class="text-center">Seleccione un archivo</h5>');
                
                if(response.length > 0){
                    $.each(response, (index, archivo) => {
                        agregaItemArchivo(archivo);
                    });
                }else{
                    contenedorArchivos.append("<p class='sinResultados'>sin resultados</p>");
                }
                
            });
            
        };
        
        cargaArchivosPorProyecto('0');

        const proyectosDOM = $("input[name=proyectoSeleccionado]");
        proyectosDOM.off();
        proyectosDOM.change(function(){
            
            console.log("Cambio de proyecto");
            cargaArchivosPorProyecto($("input[name=proyectoSeleccionado]:checked").val());
            
        });
        
        $("#padreArchivosVistaCorreo").css("display","block");
        
    });
    
};

var init_archivo = (json) => {
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;
    let vuewModelDestinatariosArchivos;
    let destinatarios_archivos = [];
    
    lottieLoader_blockpage.style = "width: 200px;height: 200px;";
    document.getElementById("loaderArchivos").appendChild(lottieLoader_blockpage);
    
    $("#archivos_envio").fileinput({
        theme: 'fa',
        language: 'es',
        maxFileCount: 4,
        validateInitialCount: true,
        overwriteInitial: false
    });
    
    $('#descripcionArchivo').summernote();
    $(".note-editing-area").css("height","200px");

    const buttonNuevoEnvio = $("#enviar_nuevo_archivo");
    const buttonCancelarEnvio = $("#btnCancelarEnvio");
    const buttonEnviarArchivo = $("#btnEnviarArchivo");
    const contenedorNuevoEnvio = $("#nuevo_envio_archivo");
    
    const contenedorVistaArchivos = $("#padreArchivosVistaArchivos");
    const contenedorVistaCorreo = $("#padreArchivosVistaCorreo");
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

            if(tipoVistaArchivos === 0){
                contenedorVistaCorreo.slideUp("fast", () => {
                    contenedorNuevoEnvio.slideDown("fast", () => {});
                });
            }else{
                contenedorVistaArchivos.slideUp("fast", () => {
                    contenedorNuevoEnvio.slideDown("fast", () => {});
                });
            }
            
            
        }

    });

    buttonCancelarEnvio.click(() => {
        contenedorNuevoEnvio.slideUp("fast", () => {
            if(tipoVistaArchivos === 0){
                contenedorVistaCorreo.slideDown("fast", () => {});
            }else{
                contenedorVistaArchivos.slideDown("fast", () => {});
            }
        });
    });
    
    const validaCamposArchivos = () => {
        
        if(destinatarios_archivos.length === 0){
            document.getElementById("labelDestinatariosArchivos").scrollIntoView();
            NotificacionToasArchivos.fire({
                title: 'Selecciona al menos un destinatario'
            });
            return false;
        }
        
        if( $("#list_proj").val() === "" ){
            document.getElementById("labelProyectoArchivos").scrollIntoView();
            NotificacionToasArchivos.fire({
                title: 'Selecciona/Ingresa a que proyecto pertenece'
            });
            $("#list_proj").focus();
            return false;
        }
        
        if( $("#tituloArchivo").val() === "" ){
            document.getElementById("labelTituloArchivos").scrollIntoView();
            NotificacionToasArchivos.fire({
                title: 'Ingresa el titulo de tu archivo'
            });
            $("#tituloArchivo").focus();
            return false;
        }
        
        if( $("#descripcionArchivo").summernote('code') === "" ){
            document.getElementById("labelDescripcionArchivos").scrollIntoView();
            NotificacionToasArchivos.fire({
                title: 'Ingresa la descripción del archivo'
            });
            $("#descripcionArchivo").focus();
            return false;
        }
        
        if( $("#archivos_envio").fileinput('getFilesCount') === 0 ){
            document.getElementById("archivos_envio").scrollIntoView();
            NotificacionToasArchivos.fire({
                title: 'Ingresa un archivo para enviar'
            });
            return false;
        }
        
        return true;
        
    };

    buttonEnviarArchivo.click(() => {
        
        if(validaCamposArchivos()){
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
            let arregloBanderas = [];
            let cadenaArchivos = '';

            let addFile = () => {	

                var files = document.getElementById('archivos_envio').files;
                if(!files.length){
                    return alert("Elige un archivo valido");
                }
                
                console.log(files);
                
                arregloBanderas = [];
                cadenaArchivos = '';
                
                let cantidadFiles = files.length;
                for( let x = 0; x<cantidadFiles; x++ ){
                    
                    arregloBanderas[x] = false;
                    let file = files[x];
                    let file_name = file.name;
                    let file_storage_key=encodeURIComponent("Prueba") + "/";
                    let file_key= file_storage_key+file_name;
                    let upload = new AWS.S3.ManagedUpload({
                        partSize: 5 * 1024 * 1024, // 5 MB
                        params : {
                                Bucket: bucketName,
                                Key: file_key,
                                Body: file
                        }
                    });

                    let promise = upload.on('httpUploadProgress', function(evt) {

                        console.log("Cargando :: " + parseInt((evt.loaded * 100) / evt.total)+'%');

                    }).promise();

                    promise.then((data)=>{

                        arregloBanderas[x] = true;
                        cadenaArchivos += data.Location + ",";

                    },(error)=>{
                        console.log("error",error);
                    });
                    
                }
                
                const registraArchivosDB = () => {
                    cadenaArchivos = cadenaArchivos.slice(0,-1);
                    let dataArchivo = {
                        'titulo_archivo': $("#tituloArchivo").val(),
                        'descripcion_archivo': $("#descripcionArchivo").summernote('code'),
                        'ruta_archivo': cadenaArchivos,
                        'proyecto': $("#list_proj").val(),
                        'id360': sesion_cookie.idUsuario_Sys,
                        'destinatarios': destinatarios_archivos,
                        "tipo_usuario": tipo_usuario,
                        'tipo_servicio': tipo_servicio,
                        'tipo_area': tipo_area
                    };

                    RequestPOST("/API/empresas360/guardar_archivo_empresas", dataArchivo).then((response) => {

                        ocultaLoaderArchivo();

                        if( response.success ){
                            formEnvioArchivo[0].reset();
                            $("#descripcionArchivo").summernote('code','');
                            //Limpiar el input del vue
                            vueArchivos.value=null;
                            contenedorNuevoEnvio.slideUp("fast", () => {
                                if(tipoVistaArchivos === 0){
                                    contenedorVistaCorreo.slideDown("fast", () => {
                                        NotificacionToasArchivos.fire({
                                            title: 'Archivo enviado'
                                        });
                                    });
                                }else{
                                    contenedorVistaArchivos.slideDown("fast", () => {
                                        NotificacionToasArchivos.fire({
                                            title: 'Archivo enviado'
                                        });
                                    });
                                }
                            });

                        }

                    });
                };
                
                var esperaCarga = setInterval(function(){
                    let yaAcabo = true;
                    let cantidadArchivos = arregloBanderas.length;
                    for(let x = 0; x<cantidadArchivos; x++){
                        if(!arregloBanderas[x]){
                            yaAcabo = false;
                            break;
                        }
                    }
                    
                    if(yaAcabo){
                        
                        registraArchivosDB();
                        
                        clearInterval(esperaCarga);
                    }
                    
                }, 500);

            };

            addFile();
        }

    });
    
    /* LLAMADA A LA VISTA DESEADA */ 
    initVistaCorreo();
    
    recibirArchivoSocket = (mensaje) => {
    
        console.log("Recibir archivo por socket");
        let remitente = buscaEnDirectorioCompletoArchivos(mensaje.id360).nombre;

        if (Notification.permission !== "granted") {
            console.log("weeeeee");
            Notification.requestPermission();
        } else {

            console.log("Wiiiiii");
            let options = {
                body: remitente + " te ha enviado " + mensaje.titulo_archivo + "." + mensaje.tipo_archivo,
                icon: PathRecursos + "images/claro2min.png",
                silent: true
            };

            console.log(options);
            let notificacion = new Notification("Nuevo archivo recibido", options);
            setTimeout(notificacion.close.bind(notificacion), 15000);

            notificacion.onshow = function () {
                //document.getElementById('').play();
            };

            notificacion.onclick = () => {
                $("#menu_section_Archivo").click();

                selectOrigen.val("2");
                selectOrigen.trigger("change");
                buscaArchivosEnviado(mensaje.titulo_archivo);
            };

            notificacion.silent = true;
            console.log("Termina socket");

        }


    };
    
};