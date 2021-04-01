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

function editarGrupo (id){
   $('#base_modulo_Registrarcurso').load('registro_grupo_horario?indice='+id)   
}

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
