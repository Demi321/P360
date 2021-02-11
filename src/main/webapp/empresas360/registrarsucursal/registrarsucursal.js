/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const init_registrarsucursal = (id_usuario, tipo_usuario, tipo_servicio, tipo_area) => {
    
}

 load_file_img("upFile_MiEmpresa");
$("#upFile_MiEmpresa_logotipo_preview").click(() => {
    $("#upFile_MiEmpresa").click();
});
load_file_img("upFile_RegistrarSucursal");
$("#upFile_RegistrarSucursal_logotipo_preview").click(() => {
    $("#upFile_RegistrarSucursal").click();
});
$("#chose_file_RegistrarSucursal").click(() => {
    $("#upFile_RegistrarSucursal").click();
});
$("#sucursales").change(function(e) {
    fileReader_registro_sucursales(e);
});
/* Registrar una sola sucursal */
initMap3();

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
            "height": "100px"
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

$("#form_RegistrarSucursal").submit((e) => {
    e.preventDefault();


    if (!($('#RegistrarSucursal_radio_patron_primario').is(':checked') || $('#RegistrarSucursal_radio_proveedor').is(':checked'))) {
        //No se ha seleccionado pron primario o proveedos
        Swal.fire({
            title: 'Revisa tu información...',
            text: 'Selecciona si eres Patrón primario o Proveedor'
        });
        document.getElementById("patron_primario").scrollIntoView();
    } else {
        if (marcador3 === null) {
            Swal.fire({
                title: 'No se ha validado la direccion ingresada',
                text: 'Necesitas validar la dirección para corroborar la ubicación.'
            });
        } else {
            if (marcador3.getPosition() === undefined) {
                Swal.fire({
                    title: 'No se ha validado la direccion ingresada',
                    text: 'Necesitas validar la dirección para corroborar la ubicación.'
                });
            }

            if (false) {
                //usuario no disponible
                Swal.fire({
                    title: 'Correo registrado',
                    text: "El correo proporcionado ya tiene una cuenta creada."
                });
            } else {
                let json = buildJSON_Section("form_RegistrarSucursal");
                if (marcador3 !== null) {
                    if (marcador3.getPosition() !== undefined) {
                        json.lat = marcador3.getPosition().lat();
                        json.lng = marcador3.getPosition().lng();
                    }
                }
                json.direccion = json.d_autocompletar3;
                json.id_empresa = sesion_cookie.tipo_usuario;
                json.tipo_servicio = sesion_cookie.tipo_servicio;
                json.id360 = sesion_cookie.id_usuario;
                json.apellido_m = json.RegistrarSucursal_apellido_m;
                json.apellido_p = json.RegistrarSucursal_apellido_p;
                json.correo = json.RegistrarSucursal_correo;
                json.extension = json.RegistrarSucursal_extension;
                json.n_exterior = json.RegistrarSucursal_n_exterior;
                json.n_interior = json.RegistrarSucursal_n_interior;
                json.nombre = json.RegistrarSucursal_nombre;
                json.nombre_edificio = json.RegistrarSucursal_nombre_edificio;
                json.numero_trabajadores = json.RegistrarSucursal_numero_trabajadores;
                json.patron_primario = json.RegistrarSucursal_patron_primario;
                json.proveedor = json.RegistrarSucursal_proveedor;
                json.razon_social = json.RegistrarSucursal_razon_social;
                json.registro_patronal = json.RegistrarSucursal_registro_patronal;
                json.rfc = json.RegistrarSucursal_rfc;
                json.telefono = json.RegistrarSucursal_telefono;
                json.calle = json.calle3;
                json.colonia = json.colonia3;
                json.cp = json.cp3;
                json.estado = json.estado3;
                json.municipio = json.municipio3;
                json.pais = json.pais3;
                json.tipo_sector = json.RegistrarSucursal_tipo_sector;
                json.logotipo = json.upFile_RegistrarSucursal_logotipo;

                //console.log(json);
                RequestPOST("/API/Registro/Institucion/nuevo_modulo", json).then(function(response) {
                    console.log(response);
                    Swal.fire({
                        text: response.mensaje
                    }).then(function() {
                        window.location.reload();
                    });
                });
            }
        }
    }
});