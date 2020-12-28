/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*********/
    agregar_menu("Registrar y Activar Empresa","");
    load_file_img("upFile_logo_nueva_empresa");
    $("#upFile_logo_nueva_empresa_logotipo_preview").click(() => {
        $("#upFile_logo_nueva_empresa").click();
    });
    /**********/
//    agregar_menu("Registrar Mi Sucursal");

    $("#menu_section_RegistraryActivarEmpresa").click();
    
    
    function agregar_menu(nombre) {
    let div = document.createElement("div");
    div.className = "menu_sidebar d-flex";
    div.innerHTML = nombre;
    div.id = "menu_section_" + nombre.replace(/\s/g, "");
    $("#sidebar").append(div);

    let div2 = document.createElement("div");
    div2.className = "modulo_section d-none";
    div2.id = "modulo_section_" + nombre.replace(/\s/g, "");//quitale los espacios si llegara a tener 
//            div2.innerHTML = nombre;

    $("#contenidoSection").append(div2);

    div.addEventListener("click", function () {
        let modulos = $(".modulo_section");
        modulos.addClass("d-none");
        let menus = $(".menu_sidebar");
        menus.removeClass("menu_selected");
        $("#modulo_section_" + nombre.replace(/\s/g, "")).removeClass("d-none");
        $("#menu_section_" + nombre.replace(/\s/g, "")).addClass("menu_selected");
    });

    if ($("#base_modulo_" + nombre.replace(/\s/g, "")).length) {
        $("#base_modulo_" + nombre.replace(/\s/g, "")).removeClass("d-none");
//                div2.appendChild($("#base_modulo_"+ nombre.replace(/\s/g, "")));
        div2.appendChild(document.getElementById("base_modulo_" + nombre.replace(/\s/g, "")));
    }
}

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