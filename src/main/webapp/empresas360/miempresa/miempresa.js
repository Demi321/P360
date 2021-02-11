/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global empresa_usuario, sesion_cookie, RequestPOST, swal */

const init_miempresa = (id_usuario, tipo_usuario, tipo_servicio, tipo_area) => {
    if (empresa_usuario !== null && empresa_usuario !== undefined && empresa_usuario !== "") {
        $("#upFile_MiEmpresa_logotipo").val(empresa_usuario.logotipo);
        $("#upFile_MiEmpresa_logotipo_preview").empty();
        $("#upFile_MiEmpresa_logotipo_preview").css({
            "background-image": "url(" + empresa_usuario.logotipo + ")",
            "background-size": "contain",
            "background-position": "center",
            "background-repeat": "no-repeat",
            "width": "100%",
            "height": "100%"
        });
        $("#MiEmpresa_empresa").val(empresa_usuario.empresa);
        $("#MiEmpresa_razon_social").val(empresa_usuario.razon_social);
        $("#MiEmpresa_rfc").val(empresa_usuario.rfc);
        $("#MiEmpresa_registro_patronal").val(empresa_usuario.registro_patronal);
        $("#MiEmpresa_correo").val(empresa_usuario.correo);
        $("#MiEmpresa_telefono").val(empresa_usuario.telefono);

        //llenar informacio de registrar Sucursal 
        $("#upFile_RegistrarSucursal_logotipo").val(empresa_usuario.logotipo);
        $("#upFile_RegistrarSucursal_logotipo_preview").css({
            "background-image": "url(" + empresa_usuario.logotipo + ")",
            "background-size": "contain",
            "background-position": "center",
            "background-repeat": "no-repeat",
            "width": "100%",
            "height": "100%"
        });
        //RegistrarSucursal_
        $("#RegistrarSucursal_razon_social").val(empresa_usuario.razon_social);
        $("#RegistrarSucursal_rfc").val(empresa_usuario.rfc);
        $("#RegistrarSucursal_registro_patronal").val(empresa_usuario.registro_patronal);
        $("#RegistrarSucursal_correo").val(sesion_cookie.correo);
        $("#RegistrarSucursal_telefono").val(empresa_usuario.telefono);
        $("#RegistrarSucursal_nombre").val(sesion_cookie.nombre);
        $("#RegistrarSucursal_apellido_p").val(sesion_cookie.apellido_p);
        $("#RegistrarSucursal_apellido_m").val(sesion_cookie.apellido_m);


        //llenar informacio de Empresa en apartado mis Sucursales 
        $("#MisSucursales_logotipo").val(empresa_usuario.logotipo);
        $("#MisSucursales_logotipo_preview").empty();
        $("#MisSucursales_logotipo_preview").css({
            "background-image": "url(" + empresa_usuario.logotipo + ")",
            "background-size": "contain",
            "background-position": "center",
            "background-repeat": "no-repeat",
            "width": "100%",
            "height": "100%"
        });
        //RegistrarSucursal_
        $("#MisSucursales_empresa").val(empresa_usuario.empresa);
        $("#MisSucursales_Empresa_razon_social").val(empresa_usuario.razon_social);
        $("#MisSucursales_Empresa_rfc").val(empresa_usuario.rfc);
        $("#MisSucursales_Empresa_registro_patronal").val(empresa_usuario.registro_patronal);
        $("#MisSucursales_Empresa_correo").val(sesion_cookie.correo);
        $("#MisSucursales_Empresa_telefono").val(empresa_usuario.telefono);
//                $("#MisSucursales_nombre").val(sesion_cookie.nombre);
//                $("#MisSucursales_apellido_p").val(sesion_cookie.apellido_p);
//                $("#MisSucursales_apellido_m").val(sesion_cookie.apellido_m);

        /* Cambios fernando */

        $("#MisPlantillasLaborales_nombre_empresa").text(empresa_usuario.empresa);

        /********************/
    }
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
        acceso_externo('https://geodatos.claro360.com/');
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
}

