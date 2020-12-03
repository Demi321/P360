/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global DEPENDENCIA */
if (window.location.host !== "localhost:8080") {
    if (location.protocol !== 'https:')
    {
        location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    }
}
window.onload = checkCookie();
//var sesion_cookie;
function setCookie(cname, cvalue, exdays) {
    cvalue = window.btoa(cvalue);
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 5));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function deleteCookie(cname) {
    var d = new Date();
    d.setTime(d.getTime() - (1 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + "value" + ";" + expires + ";path=/";
    //deleteAllCookies();
    window.location.reload();
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return window.atob(c.substring(name.length, c.length));
        }
    }
    //window.location.reload();
    return "";
}

function checkCookie() {
    var user = getCookie("username_v3.1_" + DEPENDENCIA);
    sesion_cookie=user;
    
    if (user === "") {
        //XD
        if (window.location.href.includes("/Reporte/")) {

            var form = document.createElement("form");
            form.id = "Login";
            form.action = "https://plataforma911.ml/CONTROLADOR/API/Reporte/Login";
            form.method = "POST";

            var input = document.createElement("input");
            input.value = window.location.href.toString();
            input.name = "url";
            input.id = "url";

            var boton = document.createElement("button");
            boton.type = "submit";
            boton.value = "BOTON REPORTE";
            boton.innerHTML = "BOTON REPORTE";

            var div = document.createElement("div");
            div.style = "";


            form.appendChild(input);
            form.appendChild(boton);
            div.appendChild(form);
            var pdf = document.getElementById("pdf");
            pdf.appendChild(div);

//            $("#Login").submit(function(e){
//                e.preventDefault();
//              
//            });




        } else {
            

            if (window.location.toString().split(DEPENDENCIA)[1] !== "/Login")
            {
                var hostdir = window.location.protocol + "//" + window.location.host;
                var path = hostdir + "/" + DEPENDENCIA + "/Login";
                window.location.replace(path);
            }
        }



    } else {
        sesion_cookie=JSON.parse(user);//ya 
        if (!JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).hasOwnProperty("modulos")) {
            deleteCookie("username_v3.1_" + DEPENDENCIA);
        }
        var user = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA));
        console.log(user);
        if (user !== "") {
            console.log("Sesion detectada por cookie");
            /**Cambis de nueva plantilla**/
            //Quitar style
            $("#menu_navegacion").removeAttr("style");
            //Quitar d-none
            $("#menu_cerrar_sesion").removeClass("d-none");
//            $("#menu_info_perfil").removeClass("d-none");
//            $("#menu_servicios").removeClass("d-none");
            //Agregar d-none
            $("#link_registro").addClass("d-none");


            /****************/



            //Cambiar el header
            $("#submenu").removeClass("d-none");
            $("#menuModalIcon").removeClass("d-none");
            $("header .header3").removeClass("unlogged");
            $("#registro").addClass("d-none");
            $("#ingreso").addClass("d-none");
            $("#user").text(user.nombre);

            let u = user;

            if (user.img) {
                if ($("#img_perfil_user").length) {
                    $("#img_perfil_user").empty();
                    $("#img_perfil_user").css({
                        "background-image": "url('" + u.img + "')",
                        "background-size": "contain",
                        "background-position": "center",
                        "background-repeat": "no-repeat"
                    });
                }
            }


            if ($("#nombre_modal").length) {
                $("#nombre_modal").text(u.nombre + " " + u.apellido_p + " " + u.apellido_m);
            }
            if ($("#correo_modal").length) {
                $("#correo_modal").text(u.correo);
            }
            if ($("#direccion_modal").length) {
                $("#direccion_modal").text(u.direccion);
            }
        }

        if ($("#user").length)
            document.getElementById("user").innerHTML = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).nombre;
        if ($("#NameAdministrador").length)
            document.getElementById("NameAdministrador").value = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).nombre;
        if ($("#IdAdministrador").length)
            document.getElementById("IdAdministrador").value = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys;

        var pr = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).puede_registrar;
//console.info(pr);

        if (pr === null || pr === "false") {
            //$("#menuRegistro").style.display="none";
            //$("#menuRegistro").css("display:none;");

            if ($("#menuRegistro").length) {
                document.getElementById("menuRegistro").style.display = "none";
                $("#menuRegistro").remove();
            } else {
                //console.error("Falta menuRegistro");
            }
        }

//        var usuar = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).usuario
//        if (!(usuar === "supervision-sedena" || usuar === "supervision-gn" || usuar === "Global")) {
//            document.getElementById("padronregistroLI").style.display = "none";
//            $("#padronregistroLI").remove();
//            $("#usuariosActivosLI").remove();
//            $("#adminusers").remove();
//        }

        if ($("#config").length) {
            var config = JSON.parse($("#config").val());
            //console.log(config);
        }
//        var conf_personalizada = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).configuracion;
//        console.log("*******************************");
//        console.log("configuracion");
//        console.log(config);
//        console.log("personalizada");
//        console.log(conf_personalizada);
//        console.log("*******************************");

    }
}
if ($("#closeSession").length) {
    document.getElementById("closeSession").addEventListener("click", function () {
        deleteCookie("username_v3.1_" + DEPENDENCIA);
    });
}
if ($("#menu_cerrar_sesion").length) {
    document.getElementById("menu_cerrar_sesion").addEventListener("click", function () {
        deleteCookie("username_v3.1_" + DEPENDENCIA);
    });
}

//agregar_enlace_estatico("Incidentes", "https://incidentes.ml/", "Incidentes");
//agregar_enlace_estatico("Plan Interno", "https://planinterno360.ml/", "PlanInterno");
//agregar_enlace_estatico("Seguridad Sanitaria", "https://seguridadsanitaria360.ml/lineamientos/", "SeguridadSanitaria");
//agregar_enlace_estatico("Escuela 360", "https://escuela360.ml/plataforma360/", "VisualizacionDatos");
//agregar_enlace_estatico("Mi Empresa 360", "https://empresas.claro360.com/plataforma360/", "Empresa360");
//agregar_enlace_estatico("Plataforma 360", "https://sos911.ml/plataforma360/", "Empresa360");
//agregar_enlace_estatico("Visualización de Datos", "https://gis360.ml/", "VisualizacionDatos");
//agregar_enlace_estatico("Hogar Conectado", "https://pruebasvideovigilancia.ml/", "Videovigilancia");
//agregar_enlace_estatico("Videoanalítico", "http://sanborns.ml/", "VisualizacionDatos");
//agregar_enlace_estatico_perfil("Mi Perfil 360", "https://claro360.com/plataforma360/perfil/");
function agregar_enlace_estatico(nombre, url, icono) {

    if (!window.location.href.includes(url)) {
        let li = document.createElement("li");
//    let input = document.createElement("input");
//    input.type="hidden";
        let a = document.createElement("a");
        a.href = "#";
        a.innerHTML = nombre;
        let div = document.createElement("div");
        div.style = "background-image:url('" + PathRecursos + "Img/iconoheader/" + icono + ".png');background-position:center;background-size:contain;background-repeat:no-repeat;border:none;width: 35px;height: 35px;";

        li.appendChild(a);
        a.appendChild(div);
        $("#collapseServicios").append(li);
        a.addEventListener("click", function () {
            acceso_externo(url);
        });
    }
}
function agregar_enlace_estatico_perfil(nombre, url) {

    let a = document.createElement("a");
    a.className = "boton-perfil"
    a.href = "#";
    a.innerHTML = nombre;

    $("#btn_perfil360").append(a);
    a.addEventListener("click", function () {
        acceso_externo(url);
    });


}



function checkCookieOperador() {
    var operador = getCookie("operador/" + DEPENDENCIA);

    var existe = true;
    if (operador === "") {
        existe = false;
    }
    return existe;
}



if (DEPENDENCIA_BASE) {
    //$("#menuEmpresa").style.display="none";
    //$("#menuEmpresa").css("display:none;");
    if ($("#menuEmpresa").length) {
        document.getElementById("menuEmpresa").style.display = "none";
        $("#menuEmpresa").remove();
    } else {
        //console.error("Falta menuEmpresa");
    }

    if ($("#menuRElemento").length) {
        document.getElementById("menuRElemento").style.display = "none";
        $("#menuRElemento").remove();
    } else {
        //console.error("Falta menuRElemento");
    }
}


//window.addEventListener("orientationchange", function() {
//	// Announce the new orientation number
//	
//}, false);




window.onresize = function (event) {

};
$("#modulo16").click(function () {
    console.log("usuariosregistrados");
    usuariosregistrados();
});

function usuariosregistrados() {
    if ($("#usuariosregistrados").length)
    {
        $("#usuariosregistrados").remove();
    }
    var div = document.createElement("div");
    div.id = "usuariosregistrados";

    var form = document.createElement("form");
    form.method = "POST";
    form.action = "/" + DEPENDENCIA + "/API/reporte/usuariosregistrados";
    form.target = "_blank";
    form.id = "FormUsuariosregistrados";

    var id = document.createElement("input");
    id.type = "hidden";
    id.value = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys; //idUsr;
    id.name = "id";

    var submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "Atender";
    submit.style = "background-color: #585858 ;  border: 1px solid #2E2E2E; border-radius:4px; color: gray;   text-align: center;  text-decoration: none;   font-size: 16px;  margin-left:1%; ";
    form.appendChild(id);
    form.appendChild(submit);
    div.appendChild(form);

    document.getElementById("modulo16").appendChild(div);

    form.submit();
    $("#usuariosregistrados").remove();
}



$("#modulo17").click(function () {
    console.log("usuariosActivos");
    UsuariosActivosPDF();
});

function UsuariosActivosPDF() {

    if ($("#usuariosactivos").length)
    {
        $("#usuariosactivos").remove();
    }
    var div = document.createElement("div");
    div.id = "usuariosactivos";

    var form = document.createElement("form");
    form.method = "POST";
    form.action = "/" + DEPENDENCIA + "/API/reporte/usuariosactivos";
    form.target = "_blank";
    form.id = "FormusuariosActivos";

    var id = document.createElement("input");
    id.type = "hidden";
    id.value = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys; //idUsr;
    id.name = "id";

    var submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "Atender";
    submit.style = "background-color: #585858 ;  border: 1px solid #2E2E2E; border-radius:4px; color: gray;   text-align: center;  text-decoration: none;   font-size: 16px;  margin-left:1%; ";
    form.appendChild(id);
    form.appendChild(submit);
    div.appendChild(form);

    document.getElementById("modulo17").appendChild(div);

    form.submit();
    $("#usuariosregistrados").remove();
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

        var d = new Date();
        d.setTime(d.getTime() - (1 * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = name + "=" + "value" + ";" + expires + ";path=/";

        // document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}