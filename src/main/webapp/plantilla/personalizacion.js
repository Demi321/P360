/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global DEPENDENCIA, config, PathRecursos */

if ($("#T1Header").length) {
    document.getElementById("T1Header").innerHTML = config.t1;
}
//if ($("#T2Header").length) {
//    document.getElementById("T2Header").innerHTML = config.t2;
//}
if ($("#NombreDependencia").length) {
    document.getElementById("NombreDependencia").innerHTML = config.t3;
}


if ($("#logo1").length) {

    if (config.logo1 === null) {
        $("#logo1").remove();
    } else {
        document.getElementById("logo1").src = config.logo1;
    }
}
if ($("#logo2").length) {

    if (config.logo2 === null) {
        $("#logo2").remove();
    } else {
        document.getElementById("logo2").src = config.logo2;
    }
}
if ($("#logoIMG").length) {

    if (config.logo_principal === null) {
        $("#logoIMG").remove();
    } else {
//        document.getElementById("logoIMG").src = config.logo_principal;
        $("#logoIMG").css({
            "text-align": "right",
            "background-image": "url(" + config.logo_principal + ")",
            "height": "100%",
            "width": "100%",
            "background-size": "contain",
            "background-position": "center",
            "background-repeat": "no-repeat",
            "display": "block"
        });

    }
}

//Img Modal (Menu)
if ($("#imgModal").length) {

    if (config.logo_modal === null) {
        $("#imgModal").remove();
        $("#textologin .modalText").remove();
        $("#title_textologin").remove();
    } else {
        document.getElementById("imgModal").src = config.logo_modal;
    }
}
//Img footer
if ($("#logofooter").length) {

    if (config.logo_footer === null) {
        $("#logofooter").remove();
        //$(".textfoter").remove();
    } else {
        document.getElementById("logofooter").style.backgroundImage = "url('" + config.logo_footer + "')";
    }
}


try {

//    if (!JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).hospital) {
//        //remover menu de reporte hospital
//        $("#menuReporteHospital").remove();
//
//        if (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).usuario !== "SuperAdmin") {
//            $("#menuReporteHospital").remove();
////            $("#menuCRUM").remove();
////            $("#menuSUCRE").remove();
////            $("#menuCCB").remove();
////            $("#menuSolicitudTraslado").remove();
////            $("#menuInstitucion").remove();
////            $("#menuvinculacion_familiar").remove();
//        }
//    } else {
//
//        if (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario === "20") {
//            //$("#menuReporteHospital").remove();
//            $("#menuCRUM").remove();
//            $("#menuSUCRE").remove();
//            //$("#menuCCB").remove();
//            $("#menuSolicitudTraslado").remove();
//            $("#menuInstitucion").remove();
//            //$("#menuvinculacion_familiar").remove();
//        } else {
//            //$("#menuReporteHospital").remove();
//            $("#menuCRUM").remove();
//            $("#menuSUCRE").remove();
//            $("#menuCCB").remove();
//            $("#menuvinculacion_familiar").remove();
//            $("#menuvinculacion_pacientes").remove();
//            //$("#menuSolicitudTraslado").remove();
//            //$("#menuInstitucion").remove();
//            if (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).traslado_ccb !== "1") {
//                $("#menuSolicitudTraslado").remove();
//                $("#menuInstitucion").remove();
//            }
//        }
//
//    }
//    if (!JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).covid) {
//        //remover menu de reporte hospital
//        if (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).usuario !== "SuperAdmin") {
//            $("#menutestcovid").remove();
//        }
//    }
//
//    if (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario === "19") {
//        //remover menu de reporte hospital
//
//
//        $("#menuReporteHospital").remove();
//        //$("#menuCRUM").remove();
//        $("#menuSUCRE").remove();
//        $("#menuCCB").remove();
//        $("#menuSolicitudTraslado").remove();
//        $("#menuInstitucion").remove();
//        $("#menuvinculacion_familiar").remove();
//        $("#menuvinculacion_pacientes").remove();
//    }
//    if (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario === "21") {
//        //remover menu de reporte hospital
//
//
//        $("#menuReporteHospital").remove();
//        $("#menuCRUM").remove();
//        //$("#menuSUCRE").remove();
//        $("#menuCCB").remove();
//        $("#menuSolicitudTraslado").remove();
//        $("#menuInstitucion").remove();
//        $("#menuvinculacion_familiar").remove();
//        $("#menuvinculacion_pacientes").remove();
//    }



//    if(!JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).hospital){
//        //remover menu de reporte hospital
//        if (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).usuario !== "SuperAdmin") {
//            $("#menuRegistroPaciente").remove();
//        }
//    }

    if ($("#T2Header").length) {
        $("#T2Header").text(JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).nombre_institucion);
    }
    $("header").addClass(JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).segmento);

    var modulos = $('[id^=modulo]'); 
    let modulos_cargados = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).modulos.split(",");
    for (i = 0; i < modulos_cargados.length; i++) {
        modulos_cargados[i] = parseInt(modulos_cargados[i]);
    }
    for (let i = 0; i < modulos.length; i++) {
        let modulo = modulos[i];
        var modulo_id = parseInt(modulo.id.replace("modulo", ""));
        let del = true;
        for (let j = 0; j < modulos_cargados.length; j++) {
            if (modulos_cargados[j] === modulo_id) {
                //del = false;
                break;
            }
        }
        if (del) {
            $("#" + modulo.id).remove();
        }
    }

} catch (e) {
    console.log(e);
}


try {
    //modulo para agregar plataformas externas 
    /*
     *<li>
     
     <a href="#">
     <div></div>
     <label for="">Enlace</label>
     </a>
     </li>
     */

    let modulos_externos = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).modulos_externos;
    for (var i = 0; i < modulos_externos.length; i++) {
        let modulo_externo = modulos_externos[i];
        agregar_enlace(modulo_externo[0], modulo_externo[1], modulo_externo[2]);
        agregar_enlace_servicios(modulo_externo[0], modulo_externo[1], modulo_externo[2]);
        agregar_enlace_servicios_grid(modulo_externo[0], modulo_externo[1], modulo_externo[2]);
    }

} catch (e) {
    console.log(e);
}
function agregar_enlace(nombre, url, icono) {
    if (!window.location.href.includes(url)) {
        let div_cont = $("<div></div>").addClass("p-2");
        div_cont.css({
            "display": "inline-block"
        });
        let div = document.createElement("div");
        div.style = "background-image:url('" + PathRecursos + "Img/iconoheader/" + icono + ".png');background-position:center;background-size:contain;background-repeat:no-repeat;border:none;width: 35px;height: 35px;filter: invert(1);cursor: pointer;";
        div_cont.append(div);
        div_cont.append(nombre);
        $("#collapseServicios").append(div_cont);
        div.click(()=>{
            acceso_externo(url);
        });
//        let li = document.createElement("li");
////    let input = document.createElement("input");
////    input.type="hidden";
//        let a = document.createElement("a");
//        a.href = "#";
//        a.innerHTML = nombre;
//        let div = document.createElement("div");
//        div.style = "background-image:url('" + PathRecursos + "Img/iconoheader/" + icono + "');background-position:center;background-size:contain;background-repeat:no-repeat;border:none;width: 35px;height: 35px;";
//
//
//        li.appendChild(a);
//        a.appendChild(div);
//        $("#collapseServicios").append(li);
//        a.addEventListener("click", function () {
//            acceso_externo(url);
//        });

    } else {
        if ($("#cambiar_cuenta").length) {
            $("#cambiar_cuenta").click(() => {
                acceso_externo(url);
            });
        }

    }
}
function agregar_enlace_servicios(nombre, url, icono) {

    if (!window.location.href.includes(url)) {
        let li = document.createElement("li");
//    let input = document.createElement("input");
//    input.type="hidden";
        let a = document.createElement("a");
        a.href = "#";
//    a.className="row col-12 m-0 p-1";
//    a.innerHTML = nombre;

        let div = document.createElement("div");
        div.style = "background-image:url('" + PathRecursos + "Img/iconoheader/" + icono + "');background-position:center;background-size:contain;background-repeat:no-repeat;border:none;";
        div.className = "text-center";

        let div_nombre = document.createElement("label");
//    div_nombre.className="col-10 p-0 border-0 text-left";
        div_nombre.innerHTML = nombre;

        li.appendChild(a);
        a.appendChild(div);
        a.appendChild(div_nombre);
        $("#servicios").append(li);
        a.addEventListener("click", function () {
            acceso_externo(url);
        });

    } 
}

function agregar_enlace_servicios_grid(nombre, url, icono) {

    if (!window.location.href.includes(url)) {
        let div = $("<div></div>").addClass("col-4 p-2");
        let div_icon = $("<div></div>").addClass("service");
        let div_label = $("<div></div>").addClass("service_label");
        div_label.text(nombre);
        div_icon.css({
            "background-image":"url('" + PathRecursos + "Img/iconoheader/" + icono + "')",
            "background-position":"center",
            "background-size":"contain",
            "background-repeat":"no-repeat",
            "border":"none"
        });
        div.append(div_icon);
        div.append(div_label);
        

       
        $("#servicios_grid").append(div);
        div.click(()=>{
            acceso_externo(url);
        });

    } 
}