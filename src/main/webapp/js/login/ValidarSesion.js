/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global DEPENDENCIA */
//var sesion_cookie;
if (window.location.host !== "localhost:8080") {
    if (location.protocol !== 'https:')
    {
        location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    }
}
window.onload = checkCookie();

function setCookie(cname, cvalue, exdays) {
    cvalue = window.btoa(cvalue);
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

    var user = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA));
    ////**console.log(user);
    if (user !== "") {
        var hostdir = window.location.protocol + "//" + window.location.host;
        var path = hostdir + "/" + DEPENDENCIA + "/" + user.modulo_principal;
        window.location.replace(path);
    } else {
        window.location.reload();
    }
    //window.location.reload();
}

function deleteCookie(cname) {
    var d = new Date();
    d.setTime(d.getTime() - (1 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + "value" + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return window.atob(c.substring(name.length, c.length));
        }
    }
    return "";
}

function checkCookie() {
    var user = getCookie("username_v3.1_" + DEPENDENCIA);
    //**console.log(user);
    if (user !== "") {
        user = JSON.parse(user);
        var hostdir = window.location.protocol + "//" + window.location.host;
        var path = hostdir + "/" + DEPENDENCIA + "/" + user.modulo_principal;
        //**console.log(path);
        window.location.replace(path);
    }
}
//var sesion_cookie = null;
var institucion_seleccionada = null;
$("#Log-in").submit(function (e) {
    e.preventDefault();

    $.ajax({
        type: 'POST',
        // url: '/' + DEPENDENCIA + '/login_local',
        url: '/' + DEPENDENCIA + '/login',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Usuario": document.getElementById("usuario").value,
            "Password": document.getElementById("contra").value
        }),
        success: function (response) {
            //**console.log(response);
            $("#logo360").addClass("d-none");
            //setCookie("username_v3.1_" + DEPENDENCIA, JSON.stringify(response), 1000);
            if (!response.success) {
//                Swal.fire({
//                    title: 'Error en la cuenta.',
//                    text: response.mensaje
//                });
                document.getElementById("span").style.display = "flex";
                document.getElementById("span").innerHTML = response.mensaje + "<br><br>";
            } else {
                if (response.plataforma360.length > 0) {
                    document.getElementById("span").style.display = "none";
                    sesion_cookie = response;
                    //Cuenta validada 

                    let plataforma360 = false;
                    let count_plataforma360 = 0;
                    let frst_id = null;
                    for (var i = 0; i < response.plataforma360.length; i++) {
                        let institucion = response.plataforma360[i];
                        //**console.log(institucion);
                        if (institucion.url === window.location.protocol + "//" + window.location.host + '/' + "plataforma360" + '/') {
                            plataforma360 = true;
                            count_plataforma360++;
                            if (/*count_plataforma360 === 1*/ i===0) {
                                frst_id = institucion.id;
                            }
                            listar_institucion(institucion);
                             $("#institucions_listado" + frst_id).click();
                        }
                    }
                    if (plataforma360) {
                        $("#seleccionar_institucion").removeClass("d-none");
                        //if (count_plataforma360 === 1) {
                            $("#institucions_listado" + frst_id).click();
                        //}

                        document.getElementById("boton_seleccionar_institucion").addEventListener("click", continuar_institucion_seleccionada);
                        //**console.log(count_plataforma360);
                        if (count_plataforma360 === 1) {
                            document.getElementById("boton_seleccionar_institucion").click();
                        }
                    } else {
                        //corresponde a escuela
                        if (window.location.host.toString().includes("escuela")) {
                            //agregar cookie simple
                            let keys = Object.keys(sesion_cookie);
                            let modulos_externos = new Array();
                            let url_modulos = new Array();
                            for (let i = 0; i < keys.length; i++) {
                                let a = typeof (sesion_cookie[keys[i]]);
                                if (a === "object" && (sesion_cookie[keys[i]] !== null && sesion_cookie[keys[i]] !== "null" && sesion_cookie[keys[i]] !== undefined)) {
                                    if (sesion_cookie[keys[i]].length) {
                                        for (var j = 0; j < sesion_cookie[keys[i]].length; j++) {
                                            if (sesion_cookie[keys[i]][j].plataforma === "1") {
                                                if (!url_modulos.includes(sesion_cookie[keys[i]][j].url)) {
                                                    url_modulos.push(sesion_cookie[keys[i]][j].url);
                                                    if (sesion_cookie[keys[i]][j].alias) {
                                                        let icono = sesion_cookie[keys[i]][j].icono;
                                                        if (icono === null) {
                                                            //poner icono por default
                                                            icono = "defaul.png";
                                                        } else {
                                                            icono = icono.split("/");
                                                            icono = icono[icono.length - 1];
                                                        }
                                                        let nuevo_modulo = [sesion_cookie[keys[i]][j].alias, sesion_cookie[keys[i]][j].url, icono, sesion_cookie[keys[i]][j].tipo];

                                                        modulos_externos.push(nuevo_modulo);
                                                    } else {
                                                        let icono = sesion_cookie[keys[i]][j].icono;
                                                        if (icono === null) {
                                                            //poner icono por default
                                                            icono = "defaul.png";
                                                        } else {
                                                            icono = icono.split("/");
                                                            icono = icono[icono.length - 1];
                                                        }
                                                        let nuevo_modulo = [keys[i], sesion_cookie[keys[i]][j].url, icono, sesion_cookie[keys[i]][j].tipo];
                                                        modulos_externos.push(nuevo_modulo);
                                                    }

                                                }
                                            }
                                        }
                                    }
                                    delete sesion_cookie[keys[i]];

                                }
                            }
                            sesion_cookie.modulos_externos = modulos_externos;
                            //**console.log(sesion_cookie);
                            sesion_cookie.modulo_principal = "agregar_perfil";
                            sesion_cookie.modulos = "";
                            setCookie("username_v3.1_" + DEPENDENCIA, JSON.stringify(sesion_cookie), 1000);

                        } else {
                            Swal.fire({
                                title: 'Cuenta sin acceso.',
                                text: 'Actualmente no tienes acceso a esta plataforma.'
                            });
                        }

                    }
//                    $("#institucions_listado" + response.plataforma360[0].id).click();
//                $("#boton_seleccionar_institucion").click(continuar_institucion_seleccionada());
//                    document.getElementById("boton_seleccionar_institucion").addEventListener("click", continuar_institucion_seleccionada);
                } else {
                    Swal.fire({
                        title: 'Cuenta sin acceso.',
                        text: 'Actualmente no tienes acceso a esta plataforma.'
                    });
                }


            }

        },
        error: function (err) {



            document.getElementById("span").style.display = "flex";
            document.getElementById("span").innerHTML = "Usuario y/o Contraseña incorrecta. <br><br>";
        }
    });

});


function agregar_perfil() {
    let div = document.createElement("div");
    div.className = "row col-12 institucion_listado";
//    div.id = "institucions_listado" + institucion.id;
    //div.style="border-radius: 15px; box-shadow: 2px 2px 12px -3px #525252; cursor: pointer; margin: 0; margin-bottom: 10px;";
    let logo = document.createElement("div");
    logo.className = "col";
//    logo.style = "border-radius:5px;padding: 40px;max-width: 40px;background-image:url(" + institucion.logotipo + ");background-size: contain;background-repeat: no-repeat; background-position: center;";
    logo.style = "border-radius:5px;padding: 25px;max-width: 40px;background-image:url(" + "https://empresas.claro360.com/p360/Img/Logos/Claro%20360.png" + ");background-size: contain;background-repeat: no-repeat; background-position: center;";
    let info = document.createElement("div");
    info.className = "col";
    //info.innerHTML = institucion.razon_social;
//    info.innerHTML = institucion.nombre_edificio;
    info.style = "color: white; font: bold 1rem Arial; display: flex;  align-items: center; padding-left: 3rem;";
    let content_data = document.createElement("div");
    content_data.className = "row m-0 p-0 col-12";
    let nombre = document.createElement("div");
    nombre.className = "col-12";
    nombre.innerHTML = "Agregar Nuevo Perfil";

    let direccion = document.createElement("div");
    direccion.className = "col-12";
//    direccion.innerHTML = institucion.estado + " - " + institucion.nombre_edificio;
//    direccion.innerHTML = institucion.direccion;
    direccion.style = "color: white; font: normal 0.8rem Arial; display: flex;  align-items: center;";

    content_data.appendChild(nombre);
    content_data.appendChild(direccion);

    info.appendChild(content_data);
    div.appendChild(logo);
    div.appendChild(info);
    $("#catalogo_instituciones").append(div);
    $("#catalogo_instituciones").append('<hr class="division mb-2 mt-2">');
    //<option value="">Opcion 1</option>
    div.addEventListener("click", function () {

        //**console.log("Agregar Nuevo Perfil");
        $(".vista_completa").addClass("d-none");
        $("#agregar_perfil").removeClass("d-none");

    });
}


function listar_institucion(institucion) {
    //**console.log(institucion);
    let div = document.createElement("div");
    div.className = "row col-12 institucion_listado";
    div.id = "institucions_listado" + institucion.id;
    //div.style="border-radius: 15px; box-shadow: 2px 2px 12px -3px #525252; cursor: pointer; margin: 0; margin-bottom: 10px;";
    let logo = document.createElement("div");
    logo.className = "col";
    logo.style = "border-radius:5px;padding: 40px;max-width: 40px;background-image:url(" + institucion.logotipo + ");background-size: contain;background-repeat: no-repeat; background-position: center;";
//    logo.style = "border-radius:5px;padding: 40px;max-width: 40px;background-image:url(" + "https://empresas.claro360.com/p360/Img/Logos/Claro%20360.png" + ");background-size: contain;background-repeat: no-repeat; background-position: center;";
    let info = document.createElement("div");
    info.className = "col";
    //info.innerHTML = institucion.razon_social;
//    info.innerHTML = institucion.nombre_edificio;
    info.style = "color: white; font: bold 1rem Arial; display: flex;  align-items: center; padding-left: 3rem;";
    let content_data = document.createElement("div");
    content_data.className = "row m-0 p-0 col-12";
    let nombre = document.createElement("div");
    nombre.className = "col-12";
    nombre.innerHTML = institucion.nombre_institucion;

    let direccion = document.createElement("div");
    direccion.className = "col-12";
//    direccion.innerHTML = institucion.estado + " - " + institucion.nombre_edificio;
    direccion.innerHTML = institucion.direccion;
    direccion.style = "color: white; font: normal 0.8rem Arial; display: flex;  align-items: center;";

    content_data.appendChild(nombre);
    content_data.appendChild(direccion);

    info.appendChild(content_data);
    div.appendChild(logo);
    div.appendChild(info);
    $("#catalogo_instituciones").append(div);
    $("#catalogo_instituciones").append('<hr class="division mb-2 mt-2">');
    //<option value="">Opcion 1</option>
    div.addEventListener("click", function () {
        $('[id^=institucions_listado]').removeClass("institucion_seleccionada");
        div.className = "row col-12 institucion_listado institucion_seleccionada";
        institucion_seleccionada = institucion;

        //**console.log(institucion);

        //al dar click avanzar
        continuar_institucion_seleccionada();

    });
    
    if (window.location.href.includes("access_token") && window.location.href.includes("/section/")) {
        //**console.log("Iniciando sesion con access_token y una seccion en especifico");
        let url_section = window.location.href.split("/");
        let length_url = url_section.length;
        let tipo_area = url_section[length_url-1];
        let tipo_servicio = url_section[length_url-2];
        let tipo_usuario = url_section[length_url-3];
        //**console.log("Pruebas fernando ------>");
        //**console.log(tipo_usuario);
        //**console.log(tipo_servicio);
        //**console.log(institucion.tipo_usuario);
        //**console.log(institucion.tipo_servicio);
        //**console.log("------------------------");
        if (tipo_usuario === institucion.tipo_usuario && tipo_servicio === institucion.tipo_servicio) {
            institucion_seleccionada = institucion;
            continuar_institucion_seleccionada();
        }
    }
}

function continuar_institucion_seleccionada() {
    //**console.log("continuar");
    sesion_cookie.nombre_institucion = institucion_seleccionada.nombre_institucion;
    sesion_cookie.modulos = institucion_seleccionada.modulos;
    sesion_cookie.telefono_institucion = institucion_seleccionada.telefono_institucion;
    sesion_cookie.modulo_principal = institucion_seleccionada.modulo_principal;
    sesion_cookie.tipo_usuario = institucion_seleccionada.tipo_usuario;
    sesion_cookie.tipo_servicio = institucion_seleccionada.tipo_servicio;
    sesion_cookie.tipo_area = institucion_seleccionada.tipo_area;
    sesion_cookie.segmento = institucion_seleccionada.tipo;

    sesion_cookie.idUsuario_Sys = institucion_seleccionada.id_usuario;
    sesion_cookie.nombre = sesion_cookie.claro360.nombre;
    sesion_cookie.apellidos = sesion_cookie.claro360.apellido_paterno + " " + sesion_cookie.claro360.apellido_materno;
    sesion_cookie.modulos = institucion_seleccionada.modulos;
    sesion_cookie.url = institucion_seleccionada.url;
    sesion_cookie.correo = sesion_cookie.claro360.correo;
    sesion_cookie.usuario = sesion_cookie.claro360.usuario;
    sesion_cookie.token = sesion_cookie.claro360.token;
    
    /*Cambios fernando*/
    sesion_cookie.gc = institucion_seleccionada.gc;
    if (sesion_cookie.gc.toString() === "1") {
        $("#logo360").addClass("d-none");
        sesion_cookie.logotipo_empresa = institucion_seleccionada.logotipo_empresa;
    }else{
        $("#logo360").removeClass("d-none");
    }
    /******************/
    let keys = Object.keys(sesion_cookie);
    let modulos_externos = new Array();
    let url_modulos = new Array();
    for (let i = 0; i < keys.length; i++) {
//            //**console.log(keys[i]);
//            //**console.log(typeof(sesion_cookie[keys[i]]).toString());
        let a = typeof (sesion_cookie[keys[i]]);
        if (a === "object" && (sesion_cookie[keys[i]] !== null && sesion_cookie[keys[i]] !== "null" && sesion_cookie[keys[i]] !== undefined)) {
            if (sesion_cookie[keys[i]].length) {
                for (var j = 0; j < sesion_cookie[keys[i]].length; j++) {
                    ////**console.log(sesion_cookie[keys[i]][j]+" ->"+keys[i]);
//                    //**console.log(keys[i]);
//                    //**console.log(sesion_cookie[keys[i]][j].url);
//                    if (keys[i].includes("plataforma360")) {
//                        let nuevo_modulo = [sesion_cookie[keys[i]][j].alias, sesion_cookie[keys[i]][j].url];
//                        modulos_externos.push(nuevo_modulo);
//                    } else {
//                        let nuevo_modulo = [keys[i], sesion_cookie[keys[i]][j].url];
//                        modulos_externos.push(nuevo_modulo);
//                    }
                    if (sesion_cookie[keys[i]][j].plataforma === "1") {
                        if (!url_modulos.includes(sesion_cookie[keys[i]][j].url)) {
                            url_modulos.push(sesion_cookie[keys[i]][j].url);
                            if (sesion_cookie[keys[i]][j].alias) {
                                let icono = sesion_cookie[keys[i]][j].icono;
                                if (icono === null) {
                                    //poner icono por default
                                    icono = "defaul.png";
                                } else {
                                    icono = icono.split("/");
                                    icono = icono[icono.length - 1];
                                }
                                let nuevo_modulo = [sesion_cookie[keys[i]][j].alias, sesion_cookie[keys[i]][j].url, icono, sesion_cookie[keys[i]][j].tipo];

                                modulos_externos.push(nuevo_modulo);
                            } else {
                                let icono = sesion_cookie[keys[i]][j].icono;
                                if (icono === null) {
                                    //poner icono por default
                                    icono = "defaul.png";
                                } else {
                                    icono = icono.split("/");
                                    icono = icono[icono.length - 1];
                                }
                                let nuevo_modulo = [keys[i], sesion_cookie[keys[i]][j].url, icono, sesion_cookie[keys[i]][j].tipo];
                                modulos_externos.push(nuevo_modulo);
                            }

                        }
                    }
                }
            }
            delete sesion_cookie[keys[i]];

        }
    }
    sesion_cookie.modulos_externos = modulos_externos;
    //**console.log(sesion_cookie);
    delete sesion_cookie.app360;
    delete sesion_cookie.claro360;
    delete sesion_cookie.condicion_medica;
    delete sesion_cookie.empleados;
    delete sesion_cookie.facturacion;
    delete sesion_cookie.incidentes;
    delete sesion_cookie.lineamientos;
    delete sesion_cookie.mapagis;
    delete sesion_cookie.plan_interno;
    delete sesion_cookie.plataforma360;
    delete sesion_cookie.telemedicina_medico;
    delete sesion_cookie.telemedicina_paciente;
    delete sesion_cookie.videovigilancia;
    setCookie("username_v3.1_" + DEPENDENCIA, JSON.stringify(sesion_cookie), 1000);

}


/*function checkCookie() {
 var user = getCookie("username_v3.1_" + DEPENDENCIA);
 
 if (user != "") {
 //**console.log("/////////");
 //**console.log(JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario);
 //**console.log(JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario === "21");
 //**console.log(JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).hospital);
 
 if (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).hospital) {
 
 if (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario === "20") {
 var hostdir = window.location.protocol + "//" + window.location.host;
 //                var path = hostdir + '/' + DEPENDENCIA + '/CCB';
 var path = hostdir + '/' + DEPENDENCIA + '/EstadisticosCCB';
 window.location.replace(path);
 } else {
 if (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).traslado_ccb === "1") {
 var hostdir = window.location.protocol + "//" + window.location.host;
 var path = hostdir + '/' + DEPENDENCIA + '/Institucion';
 window.location.replace(path);
 }else{
 var hostdir = window.location.protocol + "//" + window.location.host;
 var path = hostdir + '/' + DEPENDENCIA + '/Administrador';
 window.location.replace(path);
 }
 
 }
 
 } else if (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio === "46") {
 var hostdir = window.location.protocol + "//" + window.location.host;
 var path = hostdir + '/' + DEPENDENCIA + '/TestCovidCCB';
 window.location.replace(path);
 }else if (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario === "19") {
 var hostdir = window.location.protocol + "//" + window.location.host;
 var path = hostdir + '/' + DEPENDENCIA + '/CRUM';
 window.location.replace(path);
 }else if (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario === "21") {
 var hostdir = window.location.protocol + "//" + window.location.host;
 var path = hostdir + '/' + DEPENDENCIA + '/SUCRE';
 //**console.log(path);
 window.location.replace(path);
 } else if (JSON.parse(user).tipo === "Administrador"){
 //alert("Welcome again " + user);
 var hostdir = window.location.protocol + "//" + window.location.host;
 var path = hostdir + '/' + DEPENDENCIA + '/Administrador';
 window.location.replace(path);
 } else if (JSON.parse(user).tipo === "Operador")
 {
 //alert("Welcome again " + user);
 var hostdir = window.location.protocol + "//" + window.location.host;
 var path = hostdir + '/' + DEPENDENCIA + '/Operador';
 window.location.replace(path);
 } else if (JSON.parse(user).tipo === "Empresa")
 {
 //alert("Welcome again " + user);
 var hostdir = window.location.protocol + "//" + window.location.host;
 var path = hostdir + '/' + DEPENDENCIA + '/Empresa';
 window.location.replace(path);
 } else if (JSON.parse(user).tipo === "chief")
 {
 //alert("Welcome again " + user);
 var hostdir = window.location.protocol + "//" + window.location.host;
 var path = hostdir + '/' + DEPENDENCIA + '/MonitoreoLlamadas';
 window.location.replace(path);
 }
 }
 }
 
 $("#Log-in").submit(function (e) {
 e.preventDefault();
 
 $.ajax({
 type: 'POST',
 url: '/' + DEPENDENCIA + '/login',
 contentType: "application/json",
 dataType: "json",
 data: JSON.stringify({
 "Usuario": document.getElementById("usuario").value,
 "Password": document.getElementById("contra").value
 }),
 success: function (response) {
 setCookie("username_v3.1_" + DEPENDENCIA, JSON.stringify(response), 1000);
 
 },
 error: function (err) {
 
 
 
 document.getElementById("span").style.display = "flex";
 document.getElementById("span").innerHTML = "Usuario y/o Contraseña incorrecta. <br><br>";
 }
 });
 
 });*/



function getTime(zone, success) {
    var url = 'http://json-time.appspot.com/time.json?tz=' + zone,
            ud = 'json' + (+new Date());
    window[ud] = function (o) {
        success && success(new Date(o.datetime), o);
    };
    document.getElementsByTagName('head')[0].appendChild((function () {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = url + '&callback=' + ud;
        return s;
    })());
}
// Alert GMT:
//getTime('GMT', function(time){
//    alert(time);
//});

//// Get London time, and format it:
//getTime('Europe/London', function(time){
//    var formatted = time.getHours() + ':' 
//                  + time.getMinutes() + ':'
//                  + time.getSeconds();
//    alert( 'The time in London is ' + formatted );
//});

function RequestPOST(url, json) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(json),
        success: function (response) {
            //**console.log(url);
            //**console.log(response);
            //**console.log("/*********************************************/");
        },
        error: function (err) {
            console.error(err);
        }
    }));
}