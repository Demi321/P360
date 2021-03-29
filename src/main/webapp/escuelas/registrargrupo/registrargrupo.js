/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* Accion para registrar y activar una empresa */

$("#form_RegistrarGrupo").submit((e) => {
    e.preventDefault();

    let json = buildJSON_Section("form_RegistrarGrupo");
   // json.logotipo = json.upFile_logo_nueva_empresa_logotipo;
    //json.id360 = sesion_cookie.id_usuario;
    console.log(json);
    RequestPOST("/API/registro/grupo", json).then((response) => {
        console.log(response);
        swal.fire({
            text: response.mensaje
        }).then(() => {
            //recargar por access token 
            if (response.success) {
                var id = response.id
                $('#base_modulo_Registrarcurso').load('registro_grupo_horario?indice='+id)
                /*let url = window.location.protocol + "//" + window.location.host + "/" + DEPENDENCIA + "/";
                acceso_externo(url);*/
            }
        });
    });
});

function habilitarhora (){
   if (!$('#dia_lunes1').is(':checked')){
        $("#hora_lunes").val('');
        $("#hora_lunes").prop('disabled', true);
   }
   else {
       $("#hora_lunes").prop('disabled', false);
   }   
   if (!$('#dia_martes1').is(':checked')){
        $("#hora_martes").val('');
        $("#hora_martes").prop('disabled', true);
   }
   else {
       $("#hora_martes").prop('disabled', false);
   }   
   if (!$('#dia_miercoles1').is(':checked')){
        $("#hora_miercoles").val('');
        $("#hora_miercoles").prop('disabled', true);
   }
   else {
       $("#hora_miercoles").prop('disabled', false);
   }   
   if (!$('#dia_jueves1').is(':checked')){
        $("#hora_jueves").val('');
        $("#hora_jueves").prop('disabled', true);
   }
   else {
       $("#hora_jueves").prop('disabled', false);
   }   
   if (!$('#dia_viernes1').is(':checked')){
        $("#hora_viernes").val('');
        $("#hora_viernes").prop('disabled', true);
   }
   else {
       $("#hora_viernes").prop('disabled', false);
   }   
}

/*function registrarGrupo(){
    var dias = [];
    if(!$('#dia_lunes1').is(':checked') && !$('#dia_martes1').is(':checked') && !$('#dia_miercoles1').is(':checked') &&
            !$('#dia_jueves1').is(':checked') && !$('#dia_viernes1').is(':checked')){
        swal.fire({
            text: "Por favor elija algún dia de la semana"
        })
    }
    if($('#materia_grupo').val() === '' || $('#profesor_grupo').val() === ''){
        swal.fire({
            text: "Por favor elija algún profesor y/o materia"
        })
    }else{
        var profesor = [$("#profesor_grupo").val()];
        var materia = [$("#materia_grupo").val()];  
    }
    if($('#dia_lunes1').is(':checked')){
        var lunes = ['1',$("#hora_lunes").val()];
        dias.push(lunes);
    }
    if($('#dia_martes1').is(':checked')){
        var martes = ['2',$("#hora_martes").val()];
        dias.push(martes);
        
    }
    if($('#dia_miercoles1').is(':checked')){
        var miercoles = ['3',$("#hora_miercoles").val()];
        dias.push(miercoles);
        
    }
    if($('#dia_jueves1').is(':checked')){
        var jueves = ['4',$("#hora_jueves").val()];
        dias.push(jueves);
        
    }
    if($('#dia_viernes1').is(':checked')){
        var viernes = ['5',$("#hora_viernes").val()];
        dias.push(viernes);
    }
    
     RequestPOST("/API/registro/grupo_horario").then((response) => {
        console.log(response);
        swal.fire({
            text: response.mensaje
        }).then(() => {
            //recargar por access token 
            if (response.success) {
                var id = response.id
                $('#base_modulo_Registrarcurso').load('registro_grupo_horario?indice='+id)
                /*let url = window.location.protocol + "//" + window.location.host + "/" + DEPENDENCIA + "/";
                acceso_externo(url);*/
            /*}
        });
    });
    console.log(dias);
    
}*/

$("#form_RegistrarGrupoHorario").submit((e) => {
    e.preventDefault();

    if(!$('#dia_lunes1').is(':checked') && !$('#dia_martes1').is(':checked') && !$('#dia_miercoles1').is(':checked') &&
            !$('#dia_jueves1').is(':checked') && !$('#dia_viernes1').is(':checked')){
        swal.fire({
            text: "Por favor elija algún dia de la semana"
        })
    }
    if($('#materia_grupo').val() === '' || $('#profesor_grupo').val() === ''){
        swal.fire({
            text: "Por favor elija algún profesor y/o materia"
        })
    }
    
    let json = buildJSON_Section("form_RegistrarGrupoHorario");
   // json.logotipo = json.upFile_logo_nueva_empresa_logotipo;
    //json.id360 = sesion_cookie.id_usuario;
    console.log(json);
    RequestPOST("/API/registro/grupo_horario", json).then((response) => {
        console.log(response);
        swal.fire({
            text: response.mensaje
        }).then(() => {
            //recargar por access token 
            if (response.success) {
                var id = response.id
                $('#base_modulo_Registrarcurso').load('registro_grupo')
                /*let url = window.location.protocol + "//" + window.location.host + "/" + DEPENDENCIA + "/";
                acceso_externo(url);*/
            }
        });
    });
});
