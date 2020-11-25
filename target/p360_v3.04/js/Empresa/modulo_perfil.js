/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

agregar_menu("Mi Perfil");
mostrar_info_perfil();
var perfil = null;
RequestGET("/API/empresas360/info_empresa/" + sesion_cookie.tipo_usuario).then((response) => {
    console.log(response);
    if (response.razon_social) {
        $("#nombre_empresa").val(response.razon_social);
    }
});
RequestGET("/API/empresas360/info_sucursal/" + sesion_cookie.tipo_servicio).then((response) => {
    console.log(response);
    if (response.nombre) {
        $("#nombre_sucursal").val(response.nombre);
    }
});
RequestGET("/API/empresas360/info_area/" + sesion_cookie.tipo_area).then((response) => {
    console.log(response);
    if (response.area) {
        $("#nombre_area").val(response.area);
    }
});






function mostrar_info_perfil() {
    RequestPOST("/API/cuenta360/empresas360/perfil/empleado", {
        "id360": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario
    }).then(function (response) {
        if (response.success) {
            perfil = response;
            //rellenar info
            //img num_empleado puesto horario_entrada horario_salida
            if (response.img !== "" && response.img !== undefined && response.img !== "null" && response.img !== null) {
                $("#modulo_section_MiPerfil #img").css({
                    "background-image": "url(" + response.img + ")",
                    "background-size": "contain",
                    "background-position": "center",
                    "background-repeat": "no-repeat"
                });
            }
            if (response.num_empleado !== "" && response.num_empleado !== undefined && response.num_empleado !== "null" && response.num_empleado !== null) {
                $("#modulo_section_MiPerfil #num_empleado").val(response.num_empleado);
            }
            if (response.puesto !== "" && response.puesto !== undefined && response.puesto !== "null" && response.puesto !== null) {
                $("#modulo_section_MiPerfil #puesto").val(response.puesto);
            }
            if (response.horario_entrada !== "" && response.horario_entrada !== undefined && response.horario_entrada !== "null" && response.horario_entrada !== null) {
                $("#modulo_section_MiPerfil #horario_entrada").val(response.horario_entrada);
            }
            if (response.horario_salida !== "" && response.horario_salida !== undefined && response.horario_salida !== "null" && response.horario_salida !== null) {
                $("#modulo_section_MiPerfil #horario_salida").val(response.horario_salida);
            }
            if (response.nombre !== "" && response.nombre !== undefined && response.nombre !== "null" && response.nombre !== null) {
                $(".nombre_completo").text(response.nombre);
            }
            if (response.apellido_paterno !== "" && response.apellido_paterno !== undefined && response.apellido_paterno !== "null" && response.apellido_paterno !== null) {
                $(".nombre_completo").text($(".nombre_completo")[0].innerHTML + " " + response.apellido_paterno);
            }
            if (response.apellido_materno !== "" && response.apellido_materno !== undefined && response.apellido_materno !== "null" && response.apellido_materno !== null) {
                $(".nombre_completo").text($(".nombre_completo")[0].innerHTML + " " + response.apellido_materno);
            }
        }

    });
}
if ($("#menu_section_MiPerfil").length) {
    $("#menu_section_MiPerfil").click();
}