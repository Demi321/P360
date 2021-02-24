/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const init_registrarempresa = (json) => {
    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;
}

  load_file_img("upFile_logo_nueva_empresa");
  
    $("#subir_img").click(() => {
        $("#upFile_logo_nueva_empresa").click();
    });
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