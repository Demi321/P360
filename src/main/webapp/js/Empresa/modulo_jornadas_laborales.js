/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global RequestPOST, DEPENDENCIA, directorio_completo */

agregar_menu("Reporte Jornadas Laborales",'<i class="fas fa-clipboard-list"></i>','Recursos Humanos');

var empleados = [],
    empleadosEmpresa = [],
    tablaInicio;
const botonExcel = $("#botonDescargaReporteJornada");
const inicioJornadas = $("#inicio-reporte-jornadas-laborales");
const botonEmpleadosEnJornada = $("#verEmpleadosEnJornada");

botonEmpleadosEnJornada.click(() => {
    $("#form_historia_jornadas")[0].reset();
    $("#contenedor-select-sucursales").addClass("d-none");
    $("#contenedor-select-areas").addClass("d-none");
    $("#contenedor-select-empleados").addClass("d-none");
    $("#botonDescargaReporteJornada").addClass("d-none");
    inicioJornadasLaborales();
});

const initComunicacionJornadasLaborales = (id360, llamada) => {
  
    $("#sidebar a:eq(3)").click();
    $("#menu_section_Comunicación").click();
    if (!$("#profile_chat" + id360).length) {
        let dataUsr = {"id360":id360};
        RequestPOST("/API/get/perfil360", dataUsr).then((response) => {
            if (response.success) {
                contacto_chat(response);
                directorio_completo.push(response);
                $("#profile_chat"+id360).click();
                if(llamada) $("#profile_chat"+id360 + " .btn-realizarLlamadaChat").click();
            }
        });
    }else{
        $("#profile_chat"+id360).click();
        if(llamada) $("#profile_chat"+id360 + " .btn-realizarLlamadaChat").click();
    }
    
};

const enviar_mensaje_empleado_en_jornada = (id360) => {
    initComunicacionJornadasLaborales(id360, false);
};

const inicia_llamada_empleado_en_jornada = (id360) => {
    initComunicacionJornadasLaborales(id360, true);
};

$("#btn-refrescar-jornadas").click(() => {
    inicioJornadasLaborales();
});

const inicioJornadasLaborales = () => {
    
    if(tablaInicio !== undefined && tablaInicio !== null){
        tablaInicio.destroy();
    }
    
    let c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0, c6 = 0, c7 = 0, sumaTotal = 0;
    
    inicioJornadas.removeClass("d-none");
    botonEmpleadosEnJornada.addClass("d-none");
    $("#resultado-busqueda-jornadas").addClass("d-none");
    
    const tablaEmpleadosEnJornada = $("#tabla-empleados-en-jornada");
    const cuerpoTableEmpleadosEnJornada = tablaEmpleadosEnJornada.find("tbody");
    const conResultados = $("#con-empleados-en-jornada");
    const sinResultados = $("#sin-empleados-en-jornada");
    
    conResultados.addClass("d-none");
    sinResultados.addClass("d-none");
    cuerpoTableEmpleadosEnJornada.empty();
  
    let data = new Object();
    data.id = JSON.parse(getCookie("username_v3.1_"+DEPENDENCIA)).tipo_usuario;
    
    RequestPOST("/API/empresas360/jornadas_laborales/empresa/obtener_ids/en_jornada",data).then( (ids) => {
        empleadosEmpresa = ids;
        
        if( empleadosEmpresa.length ){
            
            conResultados.removeClass("d-none");
            sinResultados.addClass("d-none");
            
            let tbody = "";
            
            RequestPOST("/API/empresas360/jornadas_laborales/empresa/obtener_empleados", ids).then( (response) => {
                
                empleados = response;
                
                $.each(empleadosEmpresa, (index, empleado) => {
                  
                    let detalleEmpleado = infoEmpleado(empleado.id360);
                    
                    let partesHoraEntro = detalleEmpleado.hora_entrada.split(":");
                    let horaEntro = moment();
                    horaEntro.set("hour",partesHoraEntro[0]);
                    horaEntro.set("minute", partesHoraEntro[1]);
                    horaEntro.set("second", partesHoraEntro[2]);
                    
                    let partesHoraTenia = detalleEmpleado.horario_entrada.split(":");
                    let horaTenia = moment();
                    horaTenia.set("hour",partesHoraTenia[0]);
                    horaTenia.set("minute", partesHoraTenia[1]);
                    horaTenia.set("second", partesHoraTenia[2]);
                    
                    let tipoEntrada = 'success';

                    let minutosDeDiferencia = horaTenia.diff( horaEntro , 'minutes' );
                    
                    c1++;
                    if( minutosDeDiferencia < -5 ){
                        tipoEntrada = 'warning';
                        c2++;
                        c1--;
                    }
                    if( minutosDeDiferencia < -20 ){
                        tipoEntrada = 'danger';
                        c3++;
                        c2--;
                    }
                    
                    let tipoSalida = 'light';
                    let salio = '';
                    c7++;
                    
                    if( detalleEmpleado.hora_salida !== undefined && detalleEmpleado.hora_salida !== null ){
                        
                        tipoSalida = 'success';
                        c7--;
                        salio = detalleEmpleado.hora_salida;
                        
                        let partesHoraSalio = detalleEmpleado.hora_salida.split(":");
                        let horaSalio = moment();
                        horaSalio.set("hour",partesHoraSalio[0]);
                        horaSalio.set("minute", partesHoraSalio[1]);
                        horaSalio.set("second", partesHoraSalio[2]);

                        let partesHoraTeniaSalir = detalleEmpleado.horario_salida.split(":");
                        let horaTeniaSalir = moment();
                        horaTeniaSalir.set("hour",partesHoraTeniaSalir[0]);
                        horaTeniaSalir.set("minute", partesHoraTeniaSalir[1]);
                        horaTeniaSalir.set("second", partesHoraTeniaSalir[2]);
                        
                        let minutosDeDiferenciaSalida = horaTeniaSalir.diff( horaSalio , 'minutes' );
                        console.log("minutos de diferencia de salida");
                        console.log(minutosDeDiferenciaSalida);
                        
                        c4++;
                        if( minutosDeDiferenciaSalida > -5 ){
                            tipoSalida = 'warning';
                            c5++;
                            c4--;
                        }
                        if( minutosDeDiferenciaSalida > -20 ){
                            tipoSalida = 'danger';
                            c6++;
                            c5--;
                        }
                        
                    }
                    
                    let horaDesconexion = detalleEmpleado.hora_desconexion !== undefined && detalleEmpleado.hora_desconexion !== null ? detalleEmpleado.hora_desconexion : '';
                  
                    tbody += '<tr class="text-center" id="fila_empleado_en_jornada_'+detalleEmpleado.id360+'">';

                    tbody += '  <td>'+detalleEmpleado.nombre+' '+detalleEmpleado.apellido_paterno+' '+detalleEmpleado.apellido_materno+'</td>';
                    tbody += '  <td>'+detalleEmpleado.sucursal+'</td>';
                    tbody += '  <td>'+detalleEmpleado.area+'</td>';
                    tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-'+tipoEntrada+'">'+detalleEmpleado.horario_entrada+'</span></td>';
                    tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-'+tipoEntrada+'">'+detalleEmpleado.hora_entrada+'</span></td>';
                    tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-light">'+horaDesconexion+'</span></td>';
                    tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-'+tipoSalida+'">'+detalleEmpleado.horario_salida+'</span></td>';
                    tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-'+tipoSalida+'">'+salio+'</span></td>';
                    tbody += '  <td>'+detalleEmpleado.desconexiones+'</td>';
                    tbody += '  <td><button onclick="enviar_mensaje_empleado_en_jornada('+detalleEmpleado.id360+')" class="btn btn-dark"><i class="fas fa-comment-dots"></i></button></td>';
                    tbody += '  <td><button onclick="inicia_llamada_empleado_en_jornada('+detalleEmpleado.id360+')" class="btn btn-dark"><i class="fas fa-phone"></i></button></td>';

                    tbody += '</tr>';
                    
                    sumaTotal++;
                    
                });
                
                cuerpoTableEmpleadosEnJornada.append(tbody);
                tablaInicio = tablaEmpleadosEnJornada.DataTable({
                    retrieve: true,
                    dom: 'Bfrtip',
                    buttons: [
                        'copy', 'csv', 'excel', 'pdf', 'print'
                    ],
                    paging: false
                });
                
                $("#contadorEnTiempo").text(c1);
                $("#contadorRetardo").text(c2);
                $("#contadorTarde").text(c3);
                
                $("#contadorEnTiempoSalida").text(c4);
                $("#contadorRetardoSalida").text(c5);
                $("#contadorTardeSalida").text(c6);
                
                $("#contadorAunEnJornada").text(c7);
                
            });
            
        }else{
            conResultados.addClass("d-none");
            sinResultados.removeClass("d-none");
        }
        
    });
    
};

inicioJornadasLaborales();

const cargaEmpleados = () => {
    let data = new Object();
    data.id = JSON.parse(getCookie("username_v3.1_"+DEPENDENCIA)).tipo_usuario;
    RequestPOST("/API/empresas360/jornadas_laborales/empresa/obtener_ids",data).then( (ids) => {
        empleadosEmpresa = ids;
        RequestPOST("/API/empresas360/jornadas_laborales/empresa/obtener_empleados", ids).then( (response) => {

            empleados = response;
            const selectEmpleados = $("#empleado_jornadas");
            selectEmpleados.empty().append('<option selected disabled value="">Seleccionar...</option>');

            let options = '';
            $.each(empleados, function(index, empleado){
                options += '<option value="'+empleado.id360+'" >'+empleado.nombre + ' ' + empleado.apellido_paterno + ' ' + empleado.apellido_materno +'</option>';
            });

            selectEmpleados.append(options);

        });

    });
};

$("#sucursal_jornadas, #area_jornadas, #empleado_jornadas").change(function(){
    botonExcel.addClass("d-none");
});

$("#fecha_inicio_reporte").change(function(){
    const f2 = $("#fecha_fin_reporte");
    if(f2.val() === "")
        f2.val( $(this).val());
});

function formatDateDefault(date){
    let dia = date.getDate().toString();
    if(dia.length === 1)
        dia = "0" + dia;
    return dateParse = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + dia;
}

$("#tipo_busqueda").change(function(){
    let tipo = $(this).val();
    cargaEmpleados();
    botonExcel.addClass("d-none");

    const contenedorSelectSucursales = $("#contenedor-select-sucursales");
    const contenedorSelectAreas = $("#contenedor-select-areas");
    const contenedorSelectEmpleados = $("#contenedor-select-empleados");

    switch(tipo){
        case "SUCURSAL":
            contenedorSelectSucursales.removeClass("d-none");
            contenedorSelectAreas.addClass("d-none");
            contenedorSelectEmpleados.addClass("d-none");
            break;
        case "AREA":
            contenedorSelectSucursales.addClass("d-none");
            contenedorSelectAreas.removeClass("d-none");
            contenedorSelectEmpleados.addClass("d-none");
            break;
        case "EMPLEADO":
            contenedorSelectSucursales.addClass("d-none");
            contenedorSelectAreas.addClass("d-none");
            contenedorSelectEmpleados.removeClass("d-none");
            break;
        case "TODOS":
            contenedorSelectSucursales.addClass("d-none");
            contenedorSelectAreas.addClass("d-none");
            contenedorSelectEmpleados.addClass("d-none");
            break;
    }

});

function convertDateFormat(string) {
    return string.split('-').reverse().join('/');
}

$("#form_historia_jornadas").submit(function(e){
    e.preventDefault();

    let fecha_inicio = $("#fecha_inicio_reporte").val();

    if(validarFecha( convertDateFormat(fecha_inicio) )){

        let fecha_fin = $("#fecha_fin_reporte").val();

        if( fecha_fin === "" )
            consulta_historial(fecha_inicio, "");
        else{
            if(validarFecha( convertDateFormat(fecha_fin) )){

                let f1 = new Date( fecha_inicio );
                let f2 = new Date( fecha_fin );

                if(f2.getTime() >= f1.getTime())
                    consulta_historial(fecha_inicio, fecha_fin);
                else
                    swal.fire({text:"La fecha final debe ser mayor que la fecha inicial"});

            }else
                swal.fire({text:"Ingresa una fecha final válida"});
        }

    }else
        swal.fire({text:"Ingresa una fecha inicial válida"});
});

const consulta_historial = (fecha_inicio, fecha_final) => {

    let tipoBusqueda = $("#tipo_busqueda").val();

    if(tipoBusqueda === null || tipoBusqueda === undefined || tipoBusqueda === ""){
        swal.fire({text:"Seleccione un tipo de búsqueda"});
    }else{
        
        inicioJornadas.addClass("d-none");
        botonEmpleadosEnJornada.removeClass("d-none");

        const resultInfo = $("#tablas_resultados");
        resultInfo.empty();
        const excel = $("#resultados-exportar-excel");
        excel.empty();

        let data = new Object();
        data.inicio = fecha_inicio;
        data.fin = fecha_final;

        switch(tipoBusqueda){
            case "AREA":

                let area = $("#area_jornadas").val();

                if(area === null || area === undefined || area === ""){
                    swal.fire({text:"Seleccione un área"});
                    botonExcel.addClass("d-none");
                }else{
                    data.id = area;
                    RequestPOST("/API/empresas360/jornadas_laborales/area",data).then((response) => {

                        if( response.success ){
                            let jornadaEmpleado = new Object();

                            $.each(response.data, function(index, jornada){
                                if( jornadaEmpleado[jornada.idUsuario] === undefined ){
                                    jornadaEmpleado[jornada.idUsuario] = [];
                                    jornadaEmpleado[jornada.idUsuario].push( jornada );
                                }else{
                                    jornadaEmpleado[jornada.idUsuario].push( jornada );
                                }

                            });

                            const keys = Object.keys(jornadaEmpleado);
                            for(let x = 0; x<keys.length; x++){
                                despliegaInformacionJornadas(fecha_inicio, fecha_final, jornadaEmpleado[keys[x]]);
                            }

                            listenerActividadesReporte();
                        }else{
                            swal.fire({text:"No hay empleados en esta área"});
                            botonExcel.addClass("d-none");
                        }

                    });
                }

                break;

            case "SUCURSAL":

                let sucursal = $("#sucursal_jornadas").val();

                if(sucursal === null || sucursal === undefined || sucursal === ""){
                    swal.fire({text:"Seleccione una sucursal"});
                    botonExcel.addClass("d-none");
                }else{
                    data.id = sucursal;
                    RequestPOST("/API/empresas360/jornadas_laborales/sucursal",data).then((response) => {

                        if( response.success ){
                            let jornadaEmpleado = new Object();

                            $.each(response.data, function(index, jornada){
                                if( jornadaEmpleado[jornada.idUsuario] === undefined ){
                                    jornadaEmpleado[jornada.idUsuario] = [];
                                    jornadaEmpleado[jornada.idUsuario].push( jornada );
                                }else{
                                    jornadaEmpleado[jornada.idUsuario].push( jornada );
                                }

                            });

                            const keys = Object.keys(jornadaEmpleado);
                            for(let x = 0; x<keys.length; x++){
                                despliegaInformacionJornadas(fecha_inicio, fecha_final, jornadaEmpleado[keys[x]]);
                            }

                            listenerActividadesReporte();
                        }else{
                            swal.fire({text:"No hay empleados en esta sucursal"});
                            botonExcel.addClass("d-none");
                        }

                    });
                }

                break;

            case "EMPLEADO":

                let empleado = $("#empleado_jornadas").val();

                if(empleado === null || empleado === undefined || empleado === ""){
                    swal.fire({text:"Seleccione un empleado"});
                    botonExcel.addClass("d-none");
                }else{
                    data.id = empleado;

                    RequestPOST("/API/empresas360/jornadas_laborales",data).then((response) => {
                        despliegaInformacionJornadas(fecha_inicio, fecha_final, response.data);
                        listenerActividadesReporte();
                    });

                }

                break;

            case "TODOS":

                data.id = JSON.parse(getCookie("username_v3.1_"+DEPENDENCIA)).tipo_usuario;
                RequestPOST("/API/empresas360/jornadas_laborales/empresa",data).then((response) => {

                    if( response.success ){
                        let jornadaEmpleado = new Object();

                        $.each(response.data, function(index, jornada){
                            if( jornadaEmpleado[jornada.idUsuario] === undefined ){
                                jornadaEmpleado[jornada.idUsuario] = [];
                                jornadaEmpleado[jornada.idUsuario].push( jornada );
                            }else{
                                jornadaEmpleado[jornada.idUsuario].push( jornada );
                            }

                        });

                        const keys = Object.keys(jornadaEmpleado);
                        for(let x = 0; x<keys.length; x++){
                            despliegaInformacionJornadas(fecha_inicio, fecha_final, jornadaEmpleado[keys[x]]);
                        }

                        listenerActividadesReporte();
                    }else{
                        swal.fire({text:"No hay empleados en esta empresa"});
                        botonExcel.addClass("d-none");
                    }

                });

                break;
        }

    }
};

const despliegaInformacionJornadas = (fecha_inicio, fecha_final, jornadas) => {
    const nombresDiasSemana = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

    const resultInfo = $("#tablas_resultados");

    let emple = infoEmpleado( jornadas[0].idUsuario );
    
    if(emple !== null && emple !== undefined){
        console.log("INFORMACION DEL EMPLEADO ");
        console.log(emple);
        let informacionEmpleado = '';

        informacionEmpleado += '<form class="mb-3">';
        informacionEmpleado += '    <div class="row class="mb-2">';
        informacionEmpleado += '        <div class="col-md-3 form-group">';
        informacionEmpleado += '            <label style="color: black; font-style: italic;">Empleado</label>';
        informacionEmpleado += '            <input style="font-weight: bold;" class="form-control-plaintext"  type="text" disabled value="'+emple.nombre+' '+emple.apellido_paterno+' '+ emple.apellido_materno +'" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-3 form-group">';
        informacionEmpleado += '            <label style="color: black; font-style: italic;">Empresa</label>';
        informacionEmpleado += '            <input style="font-weight: bold;" class="form-control-plaintext" type="text" disabled value="'+emple.empresa +'" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-3 form-group">';
        informacionEmpleado += '            <label style="color: black; font-style: italic;">Sucursal</label>';
        informacionEmpleado += '            <input style="font-weight: bold;" class="form-control-plaintext"  type="text" disabled value="'+emple.sucursal +'" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-3 form-group">';
        informacionEmpleado += '            <label style="color: black; font-style: italic;">Área</label>';
        informacionEmpleado += '            <input style="font-weight: bold;" class="form-control-plaintext"  type="text" disabled value="'+emple.area +'" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '    </div>';
        informacionEmpleado += '    <div class="row">';
        informacionEmpleado += '        <div class="col-md-3 form-group">';
        informacionEmpleado += '            <label style="color: black; font-style: italic;">Puesto</label>';
        informacionEmpleado += '            <input style="font-weight: bold;" class="form-control-plaintext"  type="text" disabled value="'+emple.puesto +'" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-3 form-group">';
        informacionEmpleado += '            <label style="color: black; font-style: italic;">Núm. Empleado</label>';
        informacionEmpleado += '            <input style="font-weight: bold;" class="form-control-plaintext"  type="text" disabled value="'+emple.num_empleado +'" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-3 form-group">';
        informacionEmpleado += '            <label style="color: black; font-style: italic;">Jornada</label>';
        informacionEmpleado += '            <input style="font-weight: bold;" class="form-control-plaintext"  type="text" disabled value="'+emple.horario_entrada+' - '+emple.horario_salida+'" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '    </div>';
        informacionEmpleado += '    <div class="row">';
        informacionEmpleado += '        <div class="col-md-3 form-group">';
        informacionEmpleado += '            <label style="color: black; font-style: italic;">Días en tiempo</label>';
        informacionEmpleado += '            <input id="contadorDiasEnTiempo_'+emple.id360+'" style="font-weight: bold;" class="form-control-plaintext"  type="text" disabled value="" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-3 form-group">';
        informacionEmpleado += '            <label style="color: black; font-style: italic;">Días con retardo</label>';
        informacionEmpleado += '            <input id="contadorDiasEnRetardo_'+emple.id360+'" style="font-weight: bold;" class="form-control-plaintext"  type="text" disabled value="" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-3 form-group">';
        informacionEmpleado += '            <label style="color: black; font-style: italic;">Días tarde</label>';
        informacionEmpleado += '            <input id="contadorDiasTarde_'+emple.id360+'" style="font-weight: bold;" class="form-control-plaintext"  type="text" disabled value="" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '        <div class="col-md-3 form-group">';
        informacionEmpleado += '            <label style="color: black; font-style: italic;">Días sin jornada</label>';
        informacionEmpleado += '            <input id="contadorDiasSinJornada_'+emple.id360+'" style="font-weight: bold;" class="form-control-plaintext"  type="text" disabled value="" />';
        informacionEmpleado += '        </div>';
        informacionEmpleado += '    </div>';
        informacionEmpleado += '</form>';

        let tabla = '<table class="table table-hover mb-3">';
        tabla += '      <thead class="thead-dark"">';
        tabla += '          <tr>';
        tabla += '              <th>Día</th>';
        tabla += '              <th>Fecha</th>';
        tabla += '              <th>Hora entrada</th>';
        tabla += '              <th>Hora entrada jornada</th>';
        tabla += '              <th>Hora última desconexión</th>';
        tabla += '              <th>Hora salida</th>';
        tabla += '              <th>Hora salida jornada</th>';
        tabla += '              <th>Cantidad de Desconexiones</th>';
        tabla += '          </tr>';
        tabla += '      </thead>';

        const excel = $("#resultados-exportar-excel");
        let tablaExcel = '<table data-nombre-empleado="'+emple.nombre+' '+emple.apellido_paterno+' '+ emple.apellido_materno+'" id="'+emple.nombre+' '+emple.apellido_paterno+' '+ emple.apellido_materno+'" class="hojaExcelJornada">';
        tablaExcel += cabeceraReporteExcel(emple);


        let tbody = '<tbody>';
        let tbodyExcel = '';

        let f1 = new Date( fecha_inicio );
        f1.setDate( f1.getDate()+1 );

        let f2;
        if(fecha_final === "")
            f2 = f1;
        else{
            f2 = new Date( fecha_final );
            f2.setDate( f2.getDate() + 1 );
        }
        
        let c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0, c6 = 0, c7 = 0, c8 = 0;

        while( f1.getTime() <= f2.getTime() ){

            let fechaRecorre = formatDateDefault(f1);
            let banderaAgregado = false;

            if(jornadas !== null && jornadas !== undefined){
                let cantidadJornadas = jornadas.length;
                for(let x = 0; x < cantidadJornadas; x++)

                   if( jornadas[x].date_created === fechaRecorre ){

                        let jornada = jornadas[x];
                        let ff = new Date( jornada.date_created );
                        
                        let ultimaDesconexion = jornada.time_updated !== undefined && jornada.time_updated !== null ? jornada.time_updated : '';
                        let salida = jornada.time_finished !== undefined && jornada.time_finished !== null ? jornada.time_finished : '';
                        
                        let partesHoraEntro = jornada.time_created.split(":");
                        let horaEntro = moment();
                        horaEntro.set("hour",partesHoraEntro[0]);
                        horaEntro.set("minute", partesHoraEntro[1]);
                        horaEntro.set("second", partesHoraEntro[2]);

                        let partesHoraTenia = emple.horario_entrada.split(":");
                        let horaTenia = moment();
                        horaTenia.set("hour",partesHoraTenia[0]);
                        horaTenia.set("minute", partesHoraTenia[1]);
                        horaTenia.set("second", partesHoraTenia[2]);
                        
                        let tipoEntrada = 'success';

                        let minutosDeDiferencia = horaTenia.diff( horaEntro , 'minutes' );

                        c1++;
                        if( minutosDeDiferencia < -5 ){
                            tipoEntrada = 'warning';
                            c2++;
                            c1--;
                        }
                        if( minutosDeDiferencia < -20 ){
                            tipoEntrada = 'danger';
                            c3++;
                            c2--;
                        }
                        
                        let tipoSalida = 'light';
                        c7++;

                        if( jornada.time_finished !== undefined && jornada.time_finished !== null ){

                            tipoSalida = 'success';
                            c7--;

                            let partesHoraSalio = jornada.time_finished.split(":");
                            let horaSalio = moment();
                            horaSalio.set("hour",partesHoraSalio[0]);
                            horaSalio.set("minute", partesHoraSalio[1]);
                            horaSalio.set("second", partesHoraSalio[2]);

                            let partesHoraTeniaSalir = emple.horario_salida.split(":");
                            let horaTeniaSalir = moment();
                            horaTeniaSalir.set("hour",partesHoraTeniaSalir[0]);
                            horaTeniaSalir.set("minute", partesHoraTeniaSalir[1]);
                            horaTeniaSalir.set("second", partesHoraTeniaSalir[2]);

                            let minutosDeDiferenciaSalida = horaTeniaSalir.diff( horaSalio , 'minutes' );
                            console.log("minutos de diferencia de salida");
                            console.log(minutosDeDiferenciaSalida);

                            c4++;
                            if( minutosDeDiferenciaSalida > -5 ){
                                tipoSalida = 'warning';
                                c5++;
                                c4--;
                            }
                            if( minutosDeDiferenciaSalida > -20 ){
                                tipoSalida = 'danger';
                                c6++;
                                c5--;
                            }

                        }

                        let fechaCreacion = moment(jornada.date_created);
                        tbody += '<tr class="control" style="cursor: pointer;">';
                        tbody += '  <td>'+ nombresDiasSemana[ff.getDay()+1] +'</td>';
                        tbody += '  <td>'+ fechaCreacion.format("DD-MMM-YYYY") +'</td>';
                        tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-'+tipoEntrada+'">'+emple.horario_entrada+'</span></td>';
                        tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-'+tipoEntrada+'">'+jornada.time_created+'</span></td>';
                        tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-light">'+ultimaDesconexion+'</span></td>';
                        tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-'+tipoSalida+'">'+emple.horario_salida+'</span></td>';
                        tbody += '  <td><span style="padding: 5px 10px; font-size: 1.1rem;" class="badge badge-pill badge-'+tipoSalida+'">'+salida+'</span></td>';
                        tbody += '  <td>'+ jornada.contadorDesconexion +'</td>';
                        tbody += '</tr>';

                        tbodyExcel += '<tr>';
                        tbodyExcel += '  <td>'+ nombresDiasSemana[ff.getDay()+1] +'</td>';
                        tbodyExcel += '  <td>'+ fechaCreacion.format("DD-MMM-YYYY") +'</td>';
                        tbodyExcel += '  <td>'+ emple.horario_entrada +'</td>';
                        tbodyExcel += '  <td>'+ jornada.time_created +'</td>';
                        tbodyExcel += '  <td>'+ ultimaDesconexion +'</td>';
                        tbodyExcel += '  <td>'+ emple.horario_salida +'</td>';
                        tbodyExcel += '  <td>'+ salida +'</td>';
                        tbodyExcel += '  <td>'+ jornada.contadorDesconexion +'</td>';
                        tbodyExcel += '  <td>'+ jornada.reporte +'</td>';
                        tbodyExcel += '</tr>';

                        tbody += '<tr class="oculta" style="display: none;">';
                        tbody += '  <td style="background-color: lightgray; padding: 15px !important;" class="text-center p-2" colspan="8">'+jornada.reporte+'</td>';
                        tbody += '</tr>';

                        banderaAgregado = true;
                        break;

                   }
            }

            if(!banderaAgregado){
                
                let fechaMoment = moment(fechaRecorre);
                
                tbody += '<tr>';
                tbody += '  <td>'+ nombresDiasSemana[f1.getDay()] +'</td>';
                tbody += '  <td>'+ fechaMoment.format("DD-MMM-YYYY") +'</td>';
                tbody += '  <td>-- : -- : --</td>';
                tbody += '  <td>-- : -- : --</td>';
                tbody += '  <td>-- : -- : --</td>';
                tbody += '  <td>-- : -- : --</td>';
                tbody += '  <td>-- : -- : --</td>';
                tbody += '  <td>-- : -- : --</td>';
                tbody += '</tr>';

                tbodyExcel += '<tr>';
                tbodyExcel += '  <td>'+ nombresDiasSemana[f1.getDay()] +'</td>';
                tbodyExcel += '  <td>'+ fechaMoment.format("DD-MMM-YYYY") +'</td>';
                tbodyExcel += '  <td>-- : -- : --</td>';
                tbodyExcel += '  <td>-- : -- : --</td>';
                tbodyExcel += '  <td>-- : -- : --</td>';
                tbodyExcel += '  <td>-- : -- : --</td>';
                tbodyExcel += '  <td>-- : -- : --</td>';
                tbodyExcel += '  <td>-- : -- : --</td>';
                tbodyExcel += '  <td>N/A</td>';
                tbodyExcel += '</tr>';
                
                c8++;
                
            }

            f1.setDate( f1.getDate() + 1 );
        }

        tbody += '</tbody>';
        tabla += tbody;
        tabla += '</table>';

        let card = '';
        card += '<div class="card">';
        card += '    <div style="background-color: white !important; text-align: left; border: none;" class="card-header" id="heading'+emple.id360+'">';
        card += '        <h2 style="font-size: 1.13rem; text-transform: uppercase; cursor-pointer; padding: 10px; color: #343a40;" class="mb-0" data-toggle="collapse" data-target="#collapse'+emple.id360+'" aria-expanded="true" aria-controls="collapse'+emple.id360+'>';
        card += '           <button class="btn btn-link" type="button"><i class="fas fa-chevron-down mr-3"></i>'+emple.nombre+' '+emple.apellido_paterno+' '+ emple.apellido_materno + ' / '+emple.sucursal+' / '+emple.area+'</button>';
        card += '       </h2>';
        card += '   </div>';
        card += '   <div id="collapse'+emple.id360+'" class="collapse" aria-labelledby="heading'+emple.id360+'" data-parent="#tablas_resultados">';
        card += '       <div style="background-color: white !important; border: none !important;" class="card-body">';
        card += '           '+informacionEmpleado;
        card += '           '+tabla;
        card += '       </div>';
        card += '   </div>';
        card += '</div>';

        resultInfo.append(card);

        tablaExcel += tbodyExcel;
        tablaExcel += '</table>';
        excel.append(tablaExcel);
        
        $("#contadorDiasEnTiempo_"+emple.id360).val(c1);
        $("#contadorDiasEnRetardo_"+emple.id360).val(c2);
        $("#contadorDiasTarde_"+emple.id360).val(c3);
        $("#contadorDiasSinJornada_"+emple.id360).val(c8);
        
        $("#diasEnTiempoExcel_"+emple.id360).text(c1);
        $("#diasConRetardoExcel_"+emple.id360).text(c2);
        $("#diasTardeExcel_"+emple.id360).text(c3);
        $("#diasSinJornadaExcel_"+emple.id360).text(c8);
        
    }

    $("#botonDescargaReporteJornada").removeClass("d-none");

    $("#resultado-busqueda-jornadas").removeClass("d-none");
};

const listenerActividadesReporte = () => {
    $("tr.control").click(function() {
        let nextTr = $(this).next();
        if (nextTr.hasClass("oculta")) {
            $("tr.visible").each(function(index, tr) {
                $(tr).addClass("oculta").removeClass("visible");
                $(tr).hide("fast");
            });
            nextTr.addClass("visible").removeClass("oculta");
            nextTr.show("fast");
        } else {
            nextTr.addClass("oculta").removeClass("visible");
            nextTr.hide("fast");
        }
    });
};

$("#botonDescargaReporteJornada").click(function(){

    var wb = XLSX.utils.book_new();
    let ws;
    let nombre_hoja;

    $(".hojaExcelJornada").each(function(){

        nombre_hoja = $(this).data("nombre-empleado");
        wb.SheetNames.push( nombre_hoja );

        ws = XLSX.utils.table_to_book( document.getElementById( $(this).attr("id")) );

        wb.Sheets[nombre_hoja] = ws.Sheets["Sheet1"];

    });

    return XLSX.writeFile(wb, 'Jornadas Laborales.xlsx');
});

const cabeceraReporteExcel = (empleado) => {
    let cabecera = '';
    cabecera += '<tr><td colspan="9"><h1 style="text-align: center;">Reporte de jornadas laborales</h1></td></tr><tr></tr>';
    cabecera += '<tr><td colspan="2">Fecha de exportación</td><td>'+moment().format("DD-MMM-YYYY")+'</td></tr>';
    cabecera += '<tr><td colspan="2">Periodo del reporte</td><td>'+ moment( $("#fecha_inicio_reporte").val() ).format("DD-MMM-YYYY") +'</td><td>'+moment($("#fecha_fin_reporte").val()).format("DD-MMM-YYYY")+'</td></tr><tr></tr>';
    cabecera += '<tr><td colspan="2">Empleado:</td><td colspan="3">'+empleado.nombre+' '+empleado.apellido_paterno+' '+ empleado.apellido_materno+'</td></tr>';
    cabecera += '<tr><td colspan="2">Empresa</td><td colspan="3">'+empleado.empresa+'</td></tr>';
    cabecera += '<tr><td colspan="2">Sucursal</td><td colspan="3">'+empleado.sucursal+'</td></tr>';
    cabecera += '<tr><td colspan="2">Área</td><td colspan="3">'+empleado.area+'</td></tr>';
    cabecera += '<tr><td colspan="2">Puesto</td><td colspan="3">'+empleado.puesto+'</td></tr>';
    cabecera += '<tr><td colspan="2">Número de empleado</td><td>'+empleado.num_empleado+'</td></tr>';
    cabecera += '<tr><td colspan="2">Jornada</td><td colspan="2">Entrada: <span>'+empleado.horario_entrada+'</span></td><td colspan="2">Salida: <span>'+empleado.horario_salida+'</span></td></tr>';
    cabecera += '<tr> <td>Días en tiempo</td> <td id="diasEnTiempoExcel_'+empleado.id360+'"></td> <td>Días con retardo</td> <td id="diasConRetardoExcel_'+empleado.id360+'"></td> <td>Días tarde</td> <td id="diasTardeExcel_'+empleado.id360+'"></td> <td>Días sin jornada</td> <td id="diasSinJornadaExcel_'+empleado.id360+'"></td> </tr>';
    cabecera += '<tr></tr><tr></tr>';
    cabecera += '<tr><th>Día</th><th>Fecha</th><th>Hora Entrada</th><th>Hora entrada jornada</th><th>Hora última desconexión</th><th>Hora Salida</th><th>Hora salida jornada</th><th>Cantidad de Desconexiones</th><th>Actividad</th></tr>';
    return cabecera;
};

const infoEmpleado = (id_empleado) => {
    let empleado, generales;
    const cantidadEmpleados = empleados.length;
    const cantidadEmpleadosEmpresa = empleadosEmpresa.length;
    for( let x = 0; x<cantidadEmpleados; x++ ){
        if( empleados[x].id360 === id_empleado ){
            empleado = empleados[x];
            for( let x = 0; x<cantidadEmpleadosEmpresa; x++ ){
                if( empleadosEmpresa[x].id360 === id_empleado ){
                    generales = empleadosEmpresa[x];
                    empleado.area = generales.area;
                    empleado.sucursal = generales.sucursal;
                    empleado.empresa = generales.empresa;
                    if(generales.time_created !== undefined && generales.time_created !== null){
                        empleado.hora_entrada = generales.time_created;
                    }
                    if(generales.time_finished !== undefined && generales.time_finished !== null){
                        empleado.hora_salida = generales.time_finished;
                    }
                    if(generales.time_updated !== undefined && generales.time_updated !== null){
                        empleado.hora_desconexion = generales.time_updated;
                    }
                    if(generales.desconexiones !== undefined && generales.desconexiones !== null){
                        empleado.desconexiones = generales.desconexiones;
                    }
                    break;
                }
            }
            break;
        }
    }
    return empleado;
};