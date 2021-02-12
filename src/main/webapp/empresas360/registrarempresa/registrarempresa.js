/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const init_registrarempresa = (id_usuario, tipo_usuario, tipo_servicio, tipo_area) => {
    
}

  load_file_img("upFile_logo_nueva_empresa");
    $("#upFile_logo_nueva_empresa_logotipo_preview").click(() => {
        $("#upFile_logo_nueva_empresa").click();
    });
    /**********/
//    agregar_menu("Registrar Mi Sucursal");

    $("#menu_section_RegistraryActivarEmpresa").click();
    
    
   

/* Accion para registrar y activar una empresa */

$("#form_registro_nueva_empresa").submit((e) => {
    e.preventDefault();

    let json = buildJSON_Section("form_registro_nueva_empresa");
    json.logotipo = json.upFile_logo_nueva_empresa_logotipo;
    json.id360 = sesion_cookie.id_usuario;
    console.log(json);
    RequestPOST("/API/registro/empresa", json).then((response) => {
        console.log(response);
        swal.fire({
            text: response.mensaje
        }).then(() => {
            //recargar por access token 
            if (response.success) {
                let url = window.location.protocol + "//" + window.location.host + "/" + DEPENDENCIA + "/";
                acceso_externo(url);
            }
        });
    });
});

/***********************************************/

$(".correo_registrarempresa").val(perfil_usuario.correo);