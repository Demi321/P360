/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const init_registrarsucursal = (json) => {
    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;
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
$("#sucursales").change(function (e) {
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
                RequestPOST("/API/Registro/Institucion/nuevo_modulo", json).then(function (response) {
                    console.log(response);
                    Swal.fire({
                        text: response.mensaje
                    }).then(function () {
                        window.location.reload();
                    });
                });
            }
        }
    }
});

function fileReader_registro_sucursales(oEvent) {
    console.log("En la funcion fileReader");
    json_file = {};

    var oFile = oEvent.target.files[0];
    var sFilename = oFile.name;

    var reader = new FileReader();
    var result = {};
    if (sFilename.toString().includes(".csv") || sFilename.toString().includes(".xlsx")) {
        let h1 = document.createElement("h1");
        h1.innerHTML = "Procesando Archivo";
        let dots = 0;
        let interval = setInterval(function () {
            if (dots === 10) {
                dots = 0;
                h1.innerHTML = "Procesando Archivo";
            }
            h1.innerHTML += ".";
            dots++;

        }, 500);

        $("#registros_file_RegistrarSucursal").append(h1);
        reader.onload = function (e) {
            var data = e.target.result;
            console.log(data);
            data = new Uint8Array(data);
            var workbook = XLSX.read(data, {type: 'array', cellDates: true});
            //            console.log(workbook);
            var result = {};
            workbook.SheetNames.forEach(function (sheetName) {
                var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {raw: true});
                if (roa.length)
                    result[sheetName] = roa;
            });
            // see the result, caution: it works after reader event is done.
            console.log(result);
            if (validar_info_registro_sucursales(result)) {
                let keys_archivo = Object.keys(result);
                let info_completa = new Array();
                $.each(keys_archivo, function (i) {
                    let info_hoja = result[keys_archivo[i]];
                    let info_completa_hoja = new Array();
                    $.each(info_hoja, function (j) {
                        let alias = Object.keys(info_hoja[j]);
                        let keys_hoja = transforma_arreglo_registro_sucursales(Object.keys(info_hoja[j]));
                        let json = {};
                        $.each(alias, function (k) {
                            if (info_hoja[j][alias[k]].toString().includes("(hora ")) {
                                var hoy = new Date(info_hoja[j][alias[k]].toString());
                                var dd = hoy.getDate();
                                var mm = hoy.getMonth() + 1; //January is 0!
                                var yyyy = hoy.getFullYear();
                                if (dd < 10) {
                                    dd = '0' + dd;
                                }
                                if (mm < 10) {
                                    mm = '0' + mm;
                                }
                                var fecha = yyyy + '-' + mm + '-' + dd;
                                json[keys_hoja[k]] = fecha;
                            } else {
                                json[keys_hoja[k]] = info_hoja[j][alias[k]];
                            }
                        });
                        json.alias = alias;
//                                json.tipo_usuario = getCookie("username_v3.1_" + DEPENDENCIA).tipo_usuario;
                        json.id_empresa = sesion_cookie.tipo_usuario;
                        json.tipo_servicio = sesion_cookie.tipo_servicio;
                        json.id360 = sesion_cookie.id_usuario;

                        json.registro_patronal = json.registropatronal;
                        json.razon_social = json.razonsocial;
                        json.nombre_edificio = json.nombresucursal;
                        json.numero_trabajadores = json.numerotrabajadores;
                        json.nombre = json.nombrepersonaldecontacto;
                        json.apellido_p = json.apellidopaternopersonaldecontacto;
                        json.apellido_m = json.apellidomaternopersonaldecontacto;
                        json.telefono = json.telefonopersonaldecontacto;
                        json.logotipo = $("#upFile_RegistrarSucursal_logotipo").val();


                        info_completa_hoja.push(json);
                    });
                    info_completa.push(info_completa_hoja);
                });
                console.log(info_completa);
                clearInterval(interval);
                mostrar_resultados_registro_sucursales(info_completa);
//                        RequestPOST("/API/registro_invitacion",info_completa).then(function(response){
//                            console.log(response);
//                        });

            } else {
                Swal.fire({
                    title: 'Archivo incompleto',
                    text: "EL archivo debe contener la informacion mínima: Nombre, Apellido paterno, Apellido materno y Correo."
                });
            }
        };
        reader.readAsArrayBuffer(oFile);
    } else {
        Swal.fire({
            title: 'Extención Inválida',
            text: "El archivo debe de ser un csv ó xlsx."
        });
    }
}
function mostrar_resultados_registro_sucursales(json) {
    $("#registros_file_RegistrarSucursal").empty();
    $("#registros_file_RegistrarSucursal").css({
        "position": "absolute",
        "top": "0",
        "left": "0",
        "background": "#f5f5f5",
        "height": "100%",
        "width": "100%",
        "z-index": "100",
        "overflow": "scroll"
    });
    $("#cont_subir_documento_RegistrarSucursal").addClass("h-100");
    console.log(json);
    let div = document.createElement("div");
    div.className = "row col-12 m-0 p-2";
    div.style = "max-height: 100%; overflow: scroll;";

    let head = document.createElement("div");
    head.className = "row m-0 p-0 col-12 mb-4 mt-3";
    div.style = "font-size: 1.5rem;";

    let espacio1 = document.createElement("div");
    espacio1.className = "col-1";
    espacio1.style = "font-size: 1.5rem;";

    espacio1.innerHTML = '<i style="cursor:pointer;" class="fas fa-arrow-left"></i>';

    let espacio2 = document.createElement("div");
    espacio2.className = "col";

    let espacio3 = document.createElement("div");
    espacio3.className = "col-4";

    let registrar = document.createElement("input");
    registrar.type = "button";
    registrar.value = "Registrar";
    registrar.className = "btn btn-danger";

    let num = document.createElement("div");
    num.className = "col p-2";
    num.innerHTML = '<strong>#</strong>';
    num.style = "max-width:10px";

    let sucursal = document.createElement("div");
    sucursal.className = "col-2  p-2";
    sucursal.innerHTML = '<strong>Sucursal</strong>';

    let reg_patronal = document.createElement("div");
    reg_patronal.className = "col p-2";
    reg_patronal.innerHTML = '<strong>Registro Patronal</strong>';

    let razon_social = document.createElement("div");
    razon_social.className = "col-2 p-2";
    razon_social.innerHTML = '<strong>Razon Social</strong>';

    let rfc = document.createElement("div");
    rfc.className = "col p-2";
    rfc.innerHTML = '<strong>RFC</strong>';

//            let n_trabajadores = document.createElement("div");
//            n_trabajadores.className = "col-3";
//            n_trabajadores.innerHTML = '<strong>Numero Trabajadores</strong>';

    let telefono = document.createElement("div");
    telefono.className = "col p-2";
    telefono.innerHTML = '<strong>Teléfono de Contacto</strong>';

//            let extension = document.createElement("div");
//            extension.className = "col-3";
//            extension.innerHTML = '<strong>Extension</strong>';

    let nombre = document.createElement("div");
    nombre.className = "col-2 p-2";
    nombre.innerHTML = '<strong>Nombre de Contacto</strong>';

//            let apellido_paterno = document.createElement("div");
//            apellido_paterno.className = "col-2";
//            apellido_paterno.innerHTML = '<strong>Apellido Paterno</strong>';
//
//            let apellido_materno = document.createElement("div");
//            apellido_materno.className = "col-2";
//            apellido_materno.innerHTML = '<strong>Apellido Materno</strong>';

    let correo = document.createElement("div");
    correo.className = "col-2 p-2";
    correo.innerHTML = '<strong>Correo</strong>';

    let hr = document.createElement("div");
    hr.className = "col-12 border my-2";

    espacio3.appendChild(registrar);
    head.appendChild(espacio1);
    head.appendChild(espacio2);
    head.appendChild(espacio3);

    div.appendChild(head);
    div.appendChild(num);
    div.appendChild(sucursal);
    div.appendChild(razon_social);
    div.appendChild(reg_patronal);
    div.appendChild(rfc);
    div.appendChild(nombre);
//            div.appendChild(apellido_paterno);
//            div.appendChild(apellido_materno);
    div.appendChild(telefono);
    div.appendChild(correo);
    div.appendChild(hr);

    $("#registros_file_RegistrarSucursal").append(div);

    espacio1.addEventListener("click", function () {
        $("#registros_file_RegistrarSucursal").empty();
        $("#registros_file_RegistrarSucursal").removeAttr("style");
        $("#cont_subir_documento_RegistrarSucursal").removeClass("h-100");
        $("#sucursales").val("");
    });
    registrar.addEventListener("click", function () {
        //colocar loader
        console.log("colocar lottie de carga de pagina");
        var lottieLoader_reg_sucursal = document.createElement("div");
        lottieLoader_reg_sucursal.style = "width: 100px;height: 100px;";
        lottieLoader_reg_sucursal.id = "lottie_reg_sucursal";
        document.getElementById("registros_file_RegistrarSucursal").appendChild(lottieLoader_reg_sucursal);

        var lottieAnimation_reg_sucursal = bodymovin.loadAnimation({
            container: lottieLoader_reg_sucursal, // ID del div
            path: "https://empresas.claro360.com/p360_v4/json/Rayas rojo.json", // Ruta fichero .json de la animación
            renderer: 'svg', // Requerido
            loop: true, // Opcional
            autoplay: true, // Opcional
//                name: "Hello World" // Opcional
        });
        console.log("termino colocar lottie de carga de pagina");

        console.log(json);
        RequestPOST("/API/lineamientos/Registro/sucursales/nuevo_modulo", json).then(function (response) {
            swal.fire({
                text: response.mensaje
            }).then(function () {
                if (response.success) {
                    document.location.reload();
//                            $("#registros_file").empty();
//                            $("#registros_file").removeAttr("style");
                }
            });
        });

    });

//            let correos = new Array();
    let cont = 0;
    for (var k = 0; k < json.length; k++) {
        let arr = json[k];

        for (var i = 0; i < arr.length; i++) {
            let reg = arr[i];
//                    if (!correos.includes(reg.correo)) {
//                        correos.push(reg.correo);
            cont++;
            let reg_num = document.createElement("div");
            reg_num.className = "col p-2";
            reg_num.innerHTML = cont;
            reg_num.style = "max-width:10px";

            let reg_sucursal = document.createElement("div");
            reg_sucursal.className = "col-2 p-2";
            reg_sucursal.innerHTML = reg.nombre_edificio;

            let reg_reg_patronal = document.createElement("div");
            reg_reg_patronal.className = "col p-2";
            reg_reg_patronal.innerHTML = reg.registro_patronal;

            let reg_razon_social = document.createElement("div");
            reg_razon_social.className = "col-2 p-2";
            reg_razon_social.innerHTML = reg.razon_social;

            let reg_rfc = document.createElement("div");
            reg_rfc.className = "col p-2";
            reg_rfc.innerHTML = reg.rfc;

//            let n_trabajadores = document.createElement("div");
//            n_trabajadores.className = "col-3";
//            n_trabajadores.innerHTML = '<strong>Numero Trabajadores</strong>';

            let reg_telefono = document.createElement("div");
            reg_telefono.className = "col p-2";
            reg_telefono.innerHTML = reg.telefono + ' ext: ' + reg.extension;

            let reg_nombre = document.createElement("div");
            reg_nombre.className = "col-2 p-2";
            reg_nombre.innerHTML = reg.nombre + " " + reg.apellido_p + " " + reg.apellido_m;


            let reg_correo = document.createElement("div");
            reg_correo.className = "col-2 p-2";
            reg_correo.innerHTML = reg.correo;

            let reg_hr = document.createElement("div");
            reg_hr.className = "col-12 border-top my-2";

            div.appendChild(reg_num);
            div.appendChild(reg_sucursal);
            div.appendChild(reg_razon_social);
            div.appendChild(reg_reg_patronal);
            div.appendChild(reg_rfc);
            div.appendChild(reg_nombre);
            div.appendChild(reg_telefono);
            div.appendChild(reg_correo);
            div.appendChild(reg_hr);

//                    }
        }
    }

}
function validar_info_registro_sucursales(info_archivo) {
    let procede = true;
    let keys_archivo = Object.keys(info_archivo);
    $.each(keys_archivo, function (i) {
        let info_hoja = info_archivo[keys_archivo[i]];
        console.log(info_hoja);
        $.each(info_hoja, function (j) {
            //                let alias = Object.keys(info_hoja[j]);
            let keys_hoja = transforma_arreglo_registro_sucursales(Object.keys(info_hoja[j]));
            //Registro Patronal, Razón Social, RFC, Nombre Sucursal, Numero Trabajadores, 
            //Nombre Personal de Contacto, Apellido Paterno Personal de Contacto, Apellido Materno Personal de Contacto, 
            //Teléfono Personal de Contacto, Extensión y Correo
            if (!keys_hoja.includes("registropatronal")
                    || !keys_hoja.includes("razonsocial")
                    || !keys_hoja.includes("rfc")
                    || !keys_hoja.includes("nombresucursal")
                    || !keys_hoja.includes("numerotrabajadores")
                    || !keys_hoja.includes("nombrepersonaldecontacto")
                    || !keys_hoja.includes("apellidopaternopersonaldecontacto")
                    || !keys_hoja.includes("apellidomaternopersonaldecontacto")
                    || !keys_hoja.includes("telefonopersonaldecontacto")
                    || !keys_hoja.includes("extension")
                    || !keys_hoja.includes("correo")) {
                procede = false;
                return false;
            }
        });
        if (!procede) {
            return false;
        }
    });

    return procede;
}
function transforma_arreglo_registro_sucursales(arreglo) {
    let arreglo_mod = new Array();
    $.each(arreglo, function (i) {
        let val = arreglo[i];

        //Comvertimos el valor a minuscula
        val = val.toString().toLowerCase();
        if (val.toString().includes("correo") || val.toString().includes("mail")) {
            val = "correo";
        }
        //cambiamos las letras con acento por letras sin acento
        val = val.normalize('NFD')
                .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2")
                .normalize();
        //Quitamos los caracteres epeciales
        val = val.replace(/[^\w\s]/gi, '');
        //Quitamos los espcacios
        val = val.replace(/ /gi, '');
        arreglo_mod.push(val);
    });
    return arreglo_mod;
}