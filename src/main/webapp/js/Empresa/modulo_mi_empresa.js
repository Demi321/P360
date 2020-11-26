/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


agregar_menu("Mi Empresa");
RequestGET("/API/lineamientos/info_empresa/" + sesion_cookie.tipo_usuario).then((response) => {
    console.log(response);
    $("#upFile_MiEmpresa_logotipo").val(response.logotipo);
    $("#upFile_MiEmpresa_logotipo_preview").empty();
    $("#upFile_MiEmpresa_logotipo_preview").css({
        "background-image": "url(" + response.logotipo + ")",
        "background-size": "contain",
        "background-position": "center",
        "background-repeat": "no-repeat"
    });
    $("#MiEmpresa_empresa").val(response.empresa);
    $("#MiEmpresa_razon_social").val(response.razon_social);
    $("#MiEmpresa_rfc").val(response.rfc);
    $("#MiEmpresa_registro_patronal").val(response.registro_patronal);
    $("#MiEmpresa_correo").val(response.correo);
    $("#MiEmpresa_telefono").val(response.telefono);

    //llenar informacio de registrar Sucursal 
    $("#upFile_RegistrarSucursal_logotipo").val(response.logotipo);
    $("#upFile_RegistrarSucursal_logotipo_preview").css({
        "background-image": "url(" + response.logotipo + ")",
        "background-size": "contain",
        "background-position": "center",
        "background-repeat": "no-repeat"
    });
    //RegistrarSucursal_
    $("#RegistrarSucursal_razon_social").val(response.razon_social);
    $("#RegistrarSucursal_rfc").val(response.rfc);
    $("#RegistrarSucursal_registro_patronal").val(response.registro_patronal);
    $("#RegistrarSucursal_correo").val(sesion_cookie.correo);
    $("#RegistrarSucursal_telefono").val(response.telefono);
    $("#RegistrarSucursal_nombre").val(sesion_cookie.nombre);
    $("#RegistrarSucursal_apellido_p").val(sesion_cookie.apellido_p);
    $("#RegistrarSucursal_apellido_m").val(sesion_cookie.apellido_m);


    //llenar informacio de Empresa en apartado mis Sucursales 
    $("#MisSucursales_logotipo").val(response.logotipo);
    $("#MisSucursales_logotipo_preview").empty();
    $("#MisSucursales_logotipo_preview").css({
        "background-image": "url(" + response.logotipo + ")",
        "background-size": "contain",
        "background-position": "center",
        "background-repeat": "no-repeat"
    });
    //RegistrarSucursal_
    $("#MisSucursales_empresa").val(response.empresa);
    $("#MisSucursales_Empresa_razon_social").val(response.razon_social);
    $("#MisSucursales_Empresa_rfc").val(response.rfc);
    $("#MisSucursales_Empresa_registro_patronal").val(response.registro_patronal);
    $("#MisSucursales_Empresa_correo").val(sesion_cookie.correo);
    $("#MisSucursales_Empresa_telefono").val(response.telefono);
//                $("#MisSucursales_nombre").val(sesion_cookie.nombre);
//                $("#MisSucursales_apellido_p").val(sesion_cookie.apellido_p);
//                $("#MisSucursales_apellido_m").val(sesion_cookie.apellido_m);

    /* Cambios fernando */

    $("#MisPlantillasLaborales_nombre_empresa").text(response.empresa);

    /********************/
});
            
            
            
$("#MiEmpresa_form_registro_de_empresa").submit((e) => {
    e.preventDefault();
    let json = buildJSON_Section("MiEmpresa_form_registro_de_empresa");
    json.empresa = json.MiEmpresa_empresa;
    json.razon_social = json.MiEmpresa_razon_social;
    json.rfc = json.MiEmpresa_rfc;
    json.registro_patronal = json.MiEmpresa_registro_patronal;
    json.correo = json.MiEmpresa_correo;
    json.telefono = json.MiEmpresa_telefono;
    json.logotipo = json.upFile_MiEmpresa_logotipo;
    json.id360 = sesion_cookie.id_usuario;
    json.tipo_usuario = sesion_cookie.tipo_usuario;
    RequestPOST("/API/empresas360/update/empresa", json).then((response) => {
        swal.fire({
            text: response.mensaje
        }).then(() => {
            if (response.success) {
                console.log("success");
            }
        });
    });
    console.log(json);
});


$("#ver_gis").click(() => {
    acceso_externo('https://gis360.ml/');
});
$("#ver_lineamientos").click(() => {
    acceso_externo('https://seguridadsanitaria360.ml/lineamientos/');
});
$("#ver_registrarsucursal").click(() => {
    document.getElementById('menu_section_RegistrarSucursal').click();
});
$("#ver_plantillalaboral").click(() => {
    document.getElementById('menu_section_PlantillaLaboral').click();
});
