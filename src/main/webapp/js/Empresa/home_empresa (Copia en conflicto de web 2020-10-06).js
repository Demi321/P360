

/* global RequestPOST, swal, Swal, marcador3, DEPENDENCIA, marcador5, map5, google */

console.log("Bingoooooo");
var sesion_jornada_laboral = null;
var BucketName = "lineamientos";
var bucketRegion = "us-east-1";
var IdentityPoolId = "us-east-1:a8460f87-8d3f-4452-935a-b95a4fcc83ed";
AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
    })
});

var s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: {Bucket: BucketName}
});
var sesion_cookie = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA));
//modulos si el tipo de usuario es nulo 

if (sesion_cookie.tipo_usuario === null) {
    /*********/
    agregar_menu("Registrar y Activar Empresa");
    load_file_img("upFile_logo_nueva_empresa");
    $("#upFile_logo_nueva_empresa_logotipo_preview").click(() => {
        $("#upFile_logo_nueva_empresa").click();
    });
    /**********/
    agregar_menu("Registrar Mi Sucursal");

    $("#menu_section_RegistraryActivarEmpresa").click();
}

if (sesion_cookie.tipo_usuario !== null) {
    //usuario maestro 
    if (sesion_cookie.tipo_usuario === "0" && sesion_cookie.tipo_servicio === "0") {
        /*********/
        agregar_menu("Registrar y Activar Empresa");
        load_file_img("upFile_logo_nueva_empresa");
        $("#upFile_logo_nueva_empresa_logotipo_preview").click(() => {
            $("#upFile_logo_nueva_empresa").click();
        });
        /**********/
        agregar_menu("Registrar Sucursal");
        $("#sucursales").change(function (e) {
            fileReader_registro_sucursales(e);
        });
        agregar_menu("Mi Empresa");
        agregar_menu("Mis Sucursales");
        agregar_menu("Mi Perfil");
        mostrar_info_perfil();
        agregar_menu("Plantilla Laboral");
        registro_plantilla_laboral("Plantilla Laboral");
        agregar_menu("Áreas de Trabajo");
        agregar_menu("Ajustes de Privacidad");
        agregar_menu("Conmutador");
        agregar_menu("Nuevo Reporte");
//guardar_reporte_evento();
        agregar_menu("Reporte Seguridad Sanitaria");
//guardar_reporte_seguridad();
        agregar_menu("Registro Check");
        habilitarMaximizarVideo();

    } else {
        if (sesion_cookie.tipo_servicio === "0") {
            /*********/
//            agregar_menu("Registrar y Activar Empresa");
//            load_file_img("upFile_logo_nueva_empresa");
//            $("#upFile_logo_nueva_empresa_logotipo_preview").click(() => {
//                $("#upFile_logo_nueva_empresa").click();
//            });
            /**********/
//            agregar_menu("Registrar Mi Sucursal");
//            agregar_menu("Mi Perfil");
            agregar_menu("Mi Empresa");
            RequestGET("/API/lineamientos/info_empresa/" + sesion_cookie.tipo_usuario).then((response) => {
                console.log(response);
                $("#MiEmpresa_logotipo_preview").empty();
                $("#MiEmpresa_logotipo_preview").css({
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


                //llenar informacio de mis Sucursales 
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
                $("#MisSucursales_razon_social").val(response.razon_social);
                $("#MisSucursales_rfc").val(response.rfc);
                $("#MisSucursales_registro_patronal").val(response.registro_patronal);
                $("#MisSucursales_correo").val(sesion_cookie.correo);
                $("#MisSucursales_telefono").val(response.telefono);
//                $("#MisSucursales_nombre").val(sesion_cookie.nombre);
//                $("#MisSucursales_apellido_p").val(sesion_cookie.apellido_p);
//                $("#MisSucursales_apellido_m").val(sesion_cookie.apellido_m);
            });
            agregar_menu("Registrar Sucursal");
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

                            console.log(json);
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

            /*******************************/
            agregar_menu("Mis Sucursales");
            //Servicio para obtener el listado de sucursales 
            RequestGET("/API/lineamientos/listado_sucursales/" + sesion_cookie.tipo_usuario).then((response) => {

                for (var i = 0; i < response.length; i++) {
//                    agregar_listado_sucursal(response[i]);
                    let json = response[i];
                    console.log(json);
                    //MisSucursales_listado
                    let option = document.createElement("option");
                    option.value = json.id;
                    option.innerHTML = json.nombre_edificio;
                    if(sesion_cookie.tipo_servicio==="0"){
                         $("#MisSucursales_listado").append(option);
                    }else{
                        if(json.id===sesion_cookie.tipo_servicio){
                            $("#MisSucursales_listado").append(option);
                        }
                    }
                   
                }
                //Agregar listener 
                $("#MisSucursales_listado").change((e) => {
                    console.log(e.target.value);
                    //cambiar los valores deacuerdo al value seleccionado 
                    if (marcador5!==null) {
                        marcador5.setMap(null);
                        map5.setZoom(5);
                        map5.setCenter({lat: 19.503329, lng: -99.185714});//zoom: 5, center: {lat: 19.503329, lng: -99.185714}
                    }
                    marcador5 = null;
                    $("#calle5").val("");
                    $("#colonia5").val("");
                    $("#cp5").val("");
                    $("#estado5").val("");
                    $("#municipio5").val("");
                    $("#pais5").val("");
                    for (var i = 0; i < response.length; i++) {
                        json = response[i];
                        if (json.id === e.target.value) {

                            //rellenar informacion
                            $("#d_autocompletar5").val(json.direccion);
                            $("#MisSucursales_apellido_m").val(json.apellido_m);
                            $("#MisSucursales_apellido_p").val(json.apellido_p);
                            $("#MisSucursales_correo_contacto").val(json.correo);
                            $("#RegistrarSucursal_extension").val(json.extension);
                            $("#MisSucursales_n_exterior").val(json.n_exterior);
                            $("#MisSucursales_n_interior").val(json.n_interior);
                            $("#MisSucursales_nombre").val(json.nombre);
                            $("#MisSucursales_nombre_edificio").val(json.nombre_edificio);
                            $("#MisSucursales_n_trabajadores").val(json.numero_trabajadores);
                            if (json.patron_primario === "1" || json.patron_primario === "true") {
                                $("#MisSucursales_radio_patron_primario").prop("checked", true);
                                $("#MisSucursales_patron_primario").val("true");
                            }
                            if (json.proveedor === "1" || json.proveedor === "true") {
                                $("#MisSucursales_radio_proveedor").prop("checked", true);
                                $("#MisSucursales_proveedor").val("true");
                            }


                            $("#MisSucursales_razon_social").val(json.razon_social);
                            $("#MisSucursales_registro_patronal").val(json.registro_patronal);
                            $("#MisSucursales_rfc").val(json.rfc);
                            $("#MisSucursales_telefono_contacto").val(json.telefono);
//                            $("#calle5").val(json.aaa);
//                            $("#colonia5").val(json.aaa);
//                            $("#cp5").val(json.aaa);
//                            $("#estado5").val(json.aaa);
//                            $("#municipio5").val(json.aaa);
//                            $("#pais5").val(json.aaa);
                            if (json.sector !== null && json.sector !== "null") {
                                $("#MisSucursales_tipo_sector").val(json.sector);
                            }
                            $("#MisSucursales_logotipo").val(json.logotipo);
                            $("#MisSucursales_logotipo_preview").empty();
                            $("#MisSucursales_logotipo_preview").css({
                                "background-image": "url(" + json.logotipo + ")",
                                "background-size": "contain",
                                "background-position": "center",
                                "background-repeat": "no-repeat"
                            });

                            if (json.lat !== "" && json.lat !== "null" && json.lat !== null && json.lng !== "" && json.lng !== "null" && json.lng !== null) {
                                marcador5 = new google.maps.Marker({
                                    map5,
                                    anchorPoint: new google.maps.Point(0, -29),
                                    draggable: true
                                });
                                map5.setCenter({lat:parseFloat(json.lat),lng:parseFloat(json.lng)});
                                marcador5.setPosition({lat:parseFloat(json.lat),lng:parseFloat(json.lng)});
                                marcador5.setVisible(true);
                                marcador5.setMap(map5);
                                map5.setZoom(17);
                            }
                            break;
                        }
                    }
                });
            });


            // Modulo para actualizar la informacion 

            $("#MisSucursales_form_actualizar").submit((e) => {
                e.preventDefault();

                //revisar que se halla seleccionado una sucursal 
                if ($("#MisSucursales_listado").val() !== "") {
                    //validar que este seleccionado si es patron primario o provedor

                    if (!($('#MisSucursales_radio_proveedor').is(':checked') || $('#MisSucursales_radio_patron_primario').is(':checked'))) {
                        Swal.fire({
                            title: 'Revisa tu información...',
                            text: 'Selecciona si eres Patrón primario o Proveedor'
                        });
                    } else {
                        if (marcador5 === null) {
                            Swal.fire({
                                title: 'No se ha introducido una dirección valida.',
                                text: 'Ingresa una direccion y corrobora su ubicacion en el mapa.'
                            });
                        } else {
                            if (marcador5.getPosition() === undefined) {
                                Swal.fire({
                                    title: 'No se ha introducido una dirección valida.',
                                    text: 'Ingresa una direccion y corrobora su ubicacion en el mapa.'
                                });
                            }

                            if (false) {
                                //usuario no disponible
                                Swal.fire({
                                    title: 'Correo registrado',
                                    text: "El correo proporcionado ya tiene una cuenta creada."
                                });
                            } else {
                                let json = buildJSON_Section("MisSucursales_form_actualizar");
                                if (marcador5 !== null) {
                                    if (marcador5.getPosition() !== undefined) {
                                        json.lat = marcador5.getPosition().lat();
                                        json.lng = marcador5.getPosition().lng();
                                    }
                                }
                                json.direccion = json.d_autocompletar5;
                                json.id_empresa = sesion_cookie.tipo_usuario;
                                json.tipo_servicio = sesion_cookie.MisSucursales_tipo_servicio;
                                json.id360 = sesion_cookie.id_usuario;
                                json.apellido_m = json.MisSucursales_apellido_m;
                                json.apellido_p = json.MisSucursales_apellido_p;
                                json.correo = json.MisSucursales_correo_contacto;
                                json.extension = json.RegistrarSucursal_extension;
                                json.n_exterior = json.MisSucursales_n_exterior;
                                json.n_interior = json.MisSucursales_n_interior;
                                json.nombre = json.MisSucursales_nombre;
                                json.nombre_edificio = json.MisSucursales_nombre_edificio;
                                json.numero_trabajadores = json.MisSucursales_n_trabajadores;
                                json.patron_primario = json.MisSucursales_patron_primario;
                                json.proveedor = json.MisSucursales_proveedor;
                                json.razon_social = json.MisSucursales_razon_social;
                                json.registro_patronal = json.MisSucursales_registro_patronal;
                                json.rfc = json.MisSucursales_rfc;
                                json.telefono = json.MisSucursales_telefono_contacto;
                                json.calle = json.calle5;
                                json.colonia = json.colonia5;
                                json.cp = json.cp5;
                                json.estado = json.estado5;
                                json.municipio = json.municipio5;
                                json.pais = json.pais5;
                                json.tipo_sector = json.MisSucursales_tipo_sector;
                                json.logotipo = json.MisSucursales_logotipo;

                                console.log(json);

                                //SERVICIO PARA REALIZAR UPDATE
//                RequestPOST("/API/Registro/Institucion/nuevo_modulo", json).then(function (response) {
//                    console.log(response);
//                    Swal.fire({
//                        text: response.mensaje
//                    }).then(function () {
//
//                    });
//                });
                            }
                        }
                    }
                } else {
                    swal.fire({
                        text: "Necesitas seleccionar una sucursal del listado para actualizar su información."
                    });
                }




            });


            mostrar_info_perfil();
            agregar_menu("Plantilla Laboral");
            registro_plantilla_laboral("Plantilla Laboral");
            agregar_menu("Áreas de Trabajo");
            agregar_menu("Ajustes de Privacidad");
            agregar_menu("Conmutador");
            agregar_menu("Nuevo Reporte");
//guardar_reporte_evento();
            agregar_menu("Reporte Seguridad Sanitaria");
//guardar_reporte_seguridad();
            agregar_menu("Registro Check");
            habilitarMaximizarVideo();
            $("#menu_section_MiEmpresa").click();
        } else {
            // usuario normal 
            /**********/
            agregar_menu("Registrar Mi Sucursal");
            agregar_menu("Mi Perfil");
            mostrar_info_perfil();
//            agregar_menu("Conmutador");
            agregar_menu("Nuevo Reporte");
//guardar_reporte_evento();
            agregar_menu("Reporte Seguridad Sanitaria");
//guardar_reporte_seguridad();
            agregar_menu("Registro Check");
            habilitarMaximizarVideo();
        }

    }
}








//si es usuario nuevo 


//validacion 
//agregar_menu("Registrar Sucursal");
//agregar_menu("Mi Empresa");
//agregar_menu("Mis Sucursales");
//agregar_menu("Mi Perfil");
//mostrar_info_perfil();
//agregar_menu("Plantilla Laboral");
//registro_plantilla_laboral("Plantilla Laboral");
//agregar_menu("Áreas de Trabajo");
//agregar_menu("Ajustes de Privacidad");
//agregar_menu("Conmutador");
//agregar_menu("Nuevo Reporte");
////guardar_reporte_evento();
//agregar_menu("Reporte Seguridad Sanitaria");
////guardar_reporte_seguridad();
//agregar_menu("Registro Check");
//habilitarMaximizarVideo();

$("#evidencia_evento").click(() => {
    document.getElementById("img_reporte_evento").click();
//        $("#img_reporte_evento").click();
});
$("#evidencia_seguridad_sanitaria").click(() => {
    document.getElementById("img_reporte_seguridad").click();
//        $("#img_reporte_seguridad").click();
});

RequestGET("/API/empresas360/info_empresa/" + JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario).then((response) => {
    console.log(response);
    if (response.tipo_usuario) {
        $("#nombre_empresa").val(response.tipo_usuario);
    }
});
var catalogo_lineamientos = null;
RequestGET("/API/empresas360/info_sucursal/" + JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio).then((response) => {
    console.log(response);
    if (response.success) {
        $("#nombre_sucursal").val(response.nombre);
    }
});
RequestGET("/API/empresas360/catalogo_lineamientos/").then((response) => {
    console.log(response);
    catalogo_lineamientos = response;
    $.each(catalogo_lineamientos, function (i) {
        let option = document.createElement("option");
        option.value = catalogo_lineamientos[i].id;
        option.innerHTML = catalogo_lineamientos[i].categoria;
        $("#categoria").append(option);
    });
    $.each(catalogo_lineamientos, function (i) {
        let option = document.createElement("option");
        option.value = catalogo_lineamientos[i].id;
        option.innerHTML = catalogo_lineamientos[i].categoria;
        $("#categoria_seguridad").append(option);
    });
    $("#fecha_reporte").val(getFecha());
    $("#fecha_reporte_seguridad").val(getFecha());
});
var file_evento = null;
var file_seguridad = null;
function fileReader_reporte_evento(oEvent) {
    console.log("En la funcion fileReader");
    var oFile = oEvent.target.files[0];
    var sFilename = oFile.name;

    var reader = new FileReader();
    var result = {};

    reader.onload = function (e) {
        var data = e.target.result;
//            console.log(data);
        $("#cont_img_evento").empty();
        $("#cont_img_evento").css({
            "background-image": "url(" + data + ")",
            "background-size": "contain",
            "background-position": "center",
            "background-repeat": "no-repeat"
        });
        file_evento = oFile;
    };
    reader.readAsDataURL(oFile);

}
$("#img_reporte_evento").change(function (e) {
    fileReader_reporte_evento(e);
});
function fileReader_reporte_seguridad(oEvent) {
    console.log("En la funcion fileReader");
    var oFile = oEvent.target.files[0];
    var sFilename = oFile.name;

    var reader = new FileReader();
    var result = {};

    reader.onload = function (e) {
        var data = e.target.result;
//            console.log(data);
        $("#cont_img_seguridad").empty();
        $("#cont_img_seguridad").css({
            "background-image": "url(" + data + ")",
            "background-size": "contain",
            "background-position": "center",
            "background-repeat": "no-repeat"
        });
        file_seguridad = oFile;
    };
    reader.readAsDataURL(oFile);

}
$("#img_reporte_seguridad").change(function (e) {
    fileReader_reporte_seguridad(e);
});
var perfil = null;
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
var id_reporte_evento = null;
var id_reporte_seguridad = null;

$("#guardar_reporte_evento").click(function () {
    guardar_reporte_evento();
});
function guardar_reporte_evento() {
    if ($("#reporte_reporte_evento").val() !== "" &&
            $("#fecha_reporte").val() !== "" &&
            $("#asunto_reporte").val() !== "" &&
            $("#categoria").val() !== "" &&
            $("#hora_reporte").val() !== "") {
        let json = {
            fecha: $("#fecha_reporte").val(),
            hora: $("#hora_reporte").val(),
            asunto: $("#asunto_reporte").val(),
            categoria: $("#categoria").val(), //Se usara la misma de lineamientos??
            reporte: $("#reporte_reporte_evento").val(),
            direccion: $("#d_autocompletar").val(),
            //validar marcador !=null y getPosition != undefined
//            lat: marcador.getPosition().lat(),
//            lng: marcador.getPosition().lng(),
            tipo_usuario: JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
            tipo_servicio: JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
            id360: JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario
        };
        if (marcador !== null && marcador !== undefined) {
            if (marcador.getPosition() !== undefined) {
                json.lat = marcador.getPosition().lat();
                json.lng = marcador.getPosition().lng();
            }
        }
        //Subir foto a bucket
        if (file_evento !== null) {
            var params = {
                Bucket: BucketName,
                Prefix: sesion.id_institucion
            };
            s3.listObjects(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                } else {
                    console.log(data);   // successful response
                    //numFiles = data.Contents.length;
                    var upFile = file_evento;
                    if (upFile) {
                        var bucket = new AWS.S3({params: {Bucket: BucketName + "/reporte_evento"}});
//                        upFile = uploadFiles[i];
                        var params = {
                            Body: upFile,
                            Key: upFile.name,
                            ContentType: upFile.type
                        };
                        bucket.upload(params).on('httpUploadProgress', function (evt) {
                            //console.log(evt);
                        }).send(function (err, data) {
                            if (err) {
                                console.log(err, err.stack); // an error occurred
                            } else {
                                console.log(data);           // successful response
                                json.evidencia = data.Location;
                                if (id_reporte_evento !== null) {
                                    json.id_reporte = id_reporte_evento;
                                    //actualizamos la evidenca del reporte
                                    RequestPOST("/API/empresas360/reporte_evento", json).then(function (response) {
                                        console.log(json);
                                        if (response.success) {
                                            id_reporte_evento = null;
                                            $("#cont_img_evento").empty();
                                            $("#cont_img_evento").attr("style", "");
                                            $("#cont_img_evento").append('<i style="font-size: 8rem;color: white;" class="fas fa-image"></i>');
                                            $("#img_reporte_evento").val("");
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
        RequestPOST("/API/empresas360/reporte_evento", json).then(function (response) {
            console.log(response);
            if (response.success) {
                id_reporte_evento = response.id_reporte;
                swal.fire({
                    text: response.mensaje
                });
                $("#hora_reporte").val("");
                $("#asunto_reporte").val("");
                $("#categoria").val("");
                $("#reporte_reporte_evento").val("");
                $("#d_autocompletar").val("");
                $("#cont_img_evento").empty();
                $("#cont_img_evento").attr("style", "");
                $("#cont_img_evento").append('<i style="font-size: 8rem;color: white;" class="fas fa-image"></i>');
                marcador.setMap(null);
                map.setZoom(5);
                map.setCenter({lat: 19.503329, lng: -99.185714});
            } else {
                swal.fire({
                    text: response.mensaje
                });
            }
        });
    } else {
        swal.fire({
            text: "Por favor llene la información para poder registrar el reporte."
        });
    }

}

$("#guardar_reporte_seguridad").click(function () {
    guardar_reporte_seguridad();
});
function guardar_reporte_seguridad() {
    if ($("#fecha_reporte_seguridad").val() !== "" &&
            $("#hora_reporte_seguridad").val() !== "" &&
            $("#asunto_reporte_seguridad").val() !== "" &&
            $("#categoria_seguridad").val() !== "" &&
            $("#reporte_reporte_seguridad").val() !== "") {
        let json = {
            fecha: $("#fecha_reporte_seguridad").val(),
            hora: $("#hora_reporte_seguridad").val(),
            asunto: $("#asunto_reporte_seguridad").val(),
            categoria: $("#categoria_seguridad").val(),
            descripcion: $("#reporte_reporte_seguridad").val(),
            institucion: JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
            tipo_usuario: JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
            tipo_servicio: JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
            id360: JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario
        };
        if (marcador2 !== null) {
            if (marcador2.getPosition() !== undefined) {
                json.lat = marcador2.getPosition().lat();
                json.lng = marcador2.getPosition().lng();
            }
        }
        //Subir foto a bucket
        if (file_seguridad !== null) {
            var params = {
                Bucket: BucketName,
                Prefix: sesion.id_institucion
            };
            s3.listObjects(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                } else {
                    console.log(data);   // successful response
                    //numFiles = data.Contents.length;
                    var upFile = file_seguridad;
                    if (upFile) {
                        var bucket = new AWS.S3({params: {Bucket: BucketName + "/reporte_seguridad"}});
//                        upFile = uploadFiles[i];
                        var params = {
                            Body: upFile,
                            Key: upFile.name,
                            ContentType: upFile.type
                        };
                        bucket.upload(params).on('httpUploadProgress', function (evt) {
                            //console.log(evt);
                        }).send(function (err, data) {
                            if (err) {
                                console.log(err, err.stack); // an error occurred
                            } else {
                                console.log(data);           // successful response
                                json.evidencia = data.Location;
                                //Actualizamos el registro
                                if (id_reporte_seguridad !== null) {
                                    json.id_reporte = id_reporte_seguridad;
                                    //actualizamos la evidenca del reporte
                                    RequestPOST("/API/empresas360/reporte_seguridad", json).then(function (response) {
                                        console.log(json);
                                        if (response.success) {
                                            id_reporte_seguridad = null;
                                            $("#cont_img_seguridad").empty();
                                            $("#cont_img_seguridad").attr("style", "");
                                            $("#cont_img_seguridad").append('<i style="font-size: 8rem;color: white;" class="fas fa-image"></i>');
                                            $("#img_reporte_seguridad").val("");
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
        RequestPOST("/API/empresas360/reporte_seguridad", json).then(function (response) {
            console.log(response);
            if (response.success) {
                id_reporte_seguridad = response.id_reporte;
                swal.fire({
                    text: response.mensaje
                });
                $("#hora_reporte_seguridad").val("");
                $("#asunto_reporte_seguridad").val("");
                $("#categoria_seguridad").val("");
                $("#reporte_reporte_seguridad").val("");
                $("#d_autocompletar2").val("");
                $("#cont_img_seguridad").empty();
                $("#cont_img_seguridad").attr("style", "");
                $("#cont_img_seguridad").append('<i style="font-size: 8rem;color: white;" class="fas fa-image"></i>');
                marcador2.setMap(null);
                map2.setZoom(5);
                map2.setCenter({lat: 19.503329, lng: -99.185714});
            } else {
                swal.fire({
                    text: response.mensaje
                });
            }
        });
    } else {
        swal.fire({
            text: "Por favor llene la información para poder registrar el reporte."
        });
    }

}


var perfiles_personal = null;
consulta_listado_profesores();
function consulta_listado_profesores() {
    RequestGET("/API/GET/listado_personal/" + JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario + "/" + JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio).then(function (response) {
        perfiles_personal = response;
        listado_docente("Perfil");
        colocar_grupos();
        listado_profesores();
    });
}


var profesores_grupo = new Array();
function listado_profesores() {
    let vue = new Vue({
        components: {
            Multiselect: window.VueMultiselect.default
        },
        data: {
            value: [],
            options: perfiles_personal
        },
        methods: {
            customLabel(option) {
                return  option.id360.toString().padStart(4, "0") + " " + option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno;
            },
            onChange(value) {
                console.log("change");
                console.log(value);
                profesores_grupo = new Array();
                for (var i = 0; i < value.length; i++) {
                    let json = {
                        "id360": value[i].id360,
                        "nombre": value[i].nombre + " " + value[i].apellido_paterno + " " + value[i].apellido_materno
                    };
                    profesores_grupo.push(json);
                }
//                    profesores_grupo = value;
            },
            onSelect(op) {

                console.log(op);

            },
            onTouch() {
                console.log("Open");

            }
        }
    }).$mount('#listado_profesores');
}

$("#form_crear_grupo").submit(function (e) {
    e.preventDefault();
    if ($("#nombre_grupo").val() !== "") {
        //crear el grupo
        let json = {
            id_institucion_academica: JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
            nombre: $("#nombre_grupo").val(),
            profesores_asignados: profesores_grupo
        };
        console.log(json);
        RequestPOST("/API/escuela360/registro_grupo", json).then(function (response) {
            Swal.fire({
                title: 'Aviso',
                text: response.mensaje
            }).then(function () {
                if (response.success) {
                    tarjeta_grupo(response);
                }
            });
        });
    } else {
        Swal.fire({
            title: 'Alto',
            text: "Debe de asignar un nombre para poder crear un grupo."
        });
    }

});

function tarjeta_grupo(info) {
    console.log(info);
    let div_card = document.createElement("div");
    div_card.className = 'col-sm-12 col-md-6 col-xl-4 p-0 mb-3 card';
    let h5_header = document.createElement("h5");
    h5_header.className = 'card-header';
    h5_header.innerHTML = info.nombre;
    let div_body = document.createElement("div");
    div_body.className = 'card-body';
    let h6 = document.createElement("h6");
    h6.innerHTML = 'Código: ' + info.id_grupo + '-' + info.token;
    let h5_title = document.createElement("h5");
    h5_title.className = 'card-title';
    h5_title.innerHTML = 'Profesores Asignados:';
    let ul = document.createElement("ul");
    let profesores = info.profesores;
    for (var i = 0; i < profesores.length; i++) {
        let li = document.createElement("li");
        li.innerHTML = 'Profesor(a): ' + profesores[i].nombre;
        ul.appendChild(li);
    }
    div_body.appendChild(h6);
    div_body.appendChild(h5_title);
    div_body.appendChild(ul);
    div_card.appendChild(h5_header);
    div_card.appendChild(div_body);
    //Hacer el append a grupos_escuela

    $("#grupos_escuela").append(div_card);
}


let info_institucion = {};
var info_grupo = false;
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

function colocar_grupos() {
    RequestGET("/API/GET/listado_grupos/" + JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio).then(function (response) {
        console.log(response);
        let grupos = response;
        $.each(grupos, function (i) {
            let profesores = grupos[i].profesores;
            $.each(profesores, function (j) {
                let id360 = profesores[j].id360;
                $.each(perfiles_personal, function (k) {
                    if (perfiles_personal[k].id360 === id360) {
                        let json = {
                            id360: id360,
                            id_grupo: grupos[i].id,
                            id_usuario: id360,
                            nombre: perfiles_personal[k].nombre + " " + perfiles_personal[k].apellido_paterno + " " + perfiles_personal[k].apellido_materno
                        };
                        profesores[j] = json;
                        return true;
                    }
                });
            });
            grupos[i].profesores = profesores;
            grupos[i].id_grupo = grupos[i].id;
            tarjeta_grupo(grupos[i]);
        });
    });
}

var marker = null;
var datosInstitucion = {};
function datos_institucion(nombre) {
    let json = {
        id: JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio
    };
    RequestPOST("/API/escuela/servicio/info_escuela", json).then(function (response) {
        console.log(response);
        if (response.success) {
            datosInstitucion = response;

            perfil_docente("Perfil");

            $("#" + nombre.replace(/\s/g, "") + "_codigo").text(JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio + "-" + response.token);
            $("#" + nombre.replace(/\s/g, "") + "_nombre").text(response.nombre);
            $("#" + nombre.replace(/\s/g, "") + "_direccion").text(response.direccion);
            $("#" + nombre.replace(/\s/g, "") + "_nombre_director").text(response.nombre_director + " " + response.apellido_paterno_director + " " + response.apellido_materno_director);
            $("#" + nombre.replace(/\s/g, "") + "_telefono").text(response.telefono);
            $("#" + nombre.replace(/\s/g, "") + "_correo").text(response.correo);
            $("#" + nombre.replace(/\s/g, "") + "_zona").text(response.zona);
            $("#" + nombre.replace(/\s/g, "") + "_clave").text(response.clave);
            $("#" + nombre.replace(/\s/g, "") + "_cct").text(response.cct);
            $("#" + nombre.replace(/\s/g, "") + "_turno").text(response.turno);

            if (marker !== null) {
                marker.setMap(null);
            }
            map.setZoom(10);
            //validar coordenadas map
            let lat = parseFloat(response.lat);
            let lng = parseFloat(response.lng);
            if (!isNaN(lat) && !isNaN(lng)) {
                if (marker !== null) {
                    marker.setMap(null);

                }
                var latlng = {lat: lat, lng: lng};
                marker = new google.maps.Marker({
                    position: latlng,
                    map: map,
                    draggable: false,
                    animation: google.maps.Animation.DROP
                });
                console.log(latlng);
                map.setCenter(latlng);
                map.setZoom(18);
            }
        }
    });
}

function perfil_docente(nombre) {

    let session = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA));

    let div_contenedor = document.createElement("div");
    div_contenedor.className = "row col-12 m-0 p-0";
    let div1 = document.createElement("div");
    div1.className = 'col-12 p-0';
    let div2 = document.createElement('div');
    div2.className = 'row col-12 m-0 p-0';
    let div_img_perfil = document.createElement("div");
    div_img_perfil.className = 'col-sm-12 col-md-12 col-lg-3 p-0 d-flex align-items-center justify-content-center';
    let div_img_perfil2 = document.createElement('div');
    div_img_perfil2.className = 'img_perfil';
    let div_info_perfil = document.createElement('div');
    div_info_perfil.className = 'col-sm-12 col-md-10 col-lg-7 p-0 pt-3';
    let h2_Bienvenida = document.createElement("h2");
    h2_Bienvenida.innerHTML = 'Bienvenida';
    let h2_nombre = document.createElement('h2');
    h2_nombre.innerHTML = 'Profesor(a) ' + session.nombre + " " + session.apellido_p + " " + session.apellido_m;
    let br = document.createElement("br");
    let h4_escuela = document.createElement("h4");
    h4_escuela.className = 'p-0';
    let strong_escuela = document.createElement("strong");
    strong_escuela.innerHTML = "Escuela: ";
    h4_escuela.appendChild(strong_escuela);
    h4_escuela.innerHTML += datosInstitucion.success ? datosInstitucion.nombre : "";
    let h4_tel = document.createElement("h4");
    h4_tel.className = 'p-0';
    let strong_tel = document.createElement("strong");
    strong_tel.innerHTML = "Télefono: ";
    h4_tel.appendChild(strong_tel);
    h4_tel.innerHTML += datosInstitucion.success ? datosInstitucion.telefono : "";
    let h4_mail = document.createElement('h4');
    h4_mail.className = 'p-0';
    let strong_mail = document.createElement("strong");
    strong_mail.innerHTML = 'Correo electrónico: ';
    h4_mail.appendChild(strong_mail);
    h4_mail.innerHTML += datosInstitucion.success ? datosInstitucion.correo : "";
    let div_editar = document.createElement("div");
    div_editar.className = 'col-sm-12 col-md-2 p-0';
    let boton_edit = document.createElement("button");
    boton_edit.type = 'button';
    boton_edit.className = 'btn btn-secondary';
    boton_edit.id = "editar_perfil";
    let i_edit = document.createElement("i");
    i_edit.className = 'fas fa-pencil-alt';
    i_edit.style = 'margin: 0 10px';
    boton_edit.appendChild(i_edit);
    boton_edit.innerHTML = "Editar";

    div_img_perfil.appendChild(div_img_perfil2);
    div_info_perfil.appendChild(h2_Bienvenida);
    div_info_perfil.appendChild(h2_nombre);
    div_info_perfil.appendChild(br);
    div_info_perfil.appendChild(br);
    div_info_perfil.appendChild(h4_escuela);
    div_info_perfil.appendChild(h4_tel);
    div_info_perfil.appendChild(h4_mail);
    div_editar.appendChild(boton_edit);

    div2.appendChild(div_img_perfil);
    div2.appendChild(div_info_perfil);
    div2.appendChild(div_editar);

    div1.appendChild(div2);

    div_contenedor.appendChild(div1);

    $("#modulo_section_" + nombre.replace(/\s/g, "")).append(div_contenedor);
}

function listado_docente(nombre) {
    //obtener servicio de listado 
    let div_contenedor = document.createElement("div");
    div_contenedor.className = 'col-12 p-0';
    let h3_titulo = document.createElement("h3");
    h3_titulo.className = 'm-3';
    h3_titulo.innerHTML = 'Plantilla Docente';
    let div1 = document.createElement("div");
    div1.className = 'row col-12 m-0 p-0';
    for (var i = 0; i < perfiles_personal.length; i++) {
        div1.appendChild(agregar_personal_perfil(perfiles_personal[i]));
    }
    div_contenedor.appendChild(h3_titulo);
    div_contenedor.appendChild(div1);
    $("#modulo_section_" + nombre.replace(/\s/g, "")).append(div_contenedor);
}

function agregar_personal_perfil(json) {
    let div2 = document.createElement("div");
    div2.className = "row col-12 m-0 p-0 mt-3 mb-3";
    let div_img = document.createElement("div");
    div_img.className = 'col-sm-12 col-md-4 col-lg-3 p-0 d-flex align-items-center justify-content-center';
    let div_img2 = document.createElement("div");
    div_img2.className = "img_perfil";
    if (json.hasOwnProperty("img")) {
        //Poner imagen del perfil
        div_img2.style = "width: 80px; height: 80px; background-image: url('" + json.img + "');";
    } else {
        //Poner imagen por default
        //<i class="fas fa-user-circle" style="font-size: 7rem;"></i>
        let icon = document.createElement("i");
        icon.className = 'fas fa-user-circle w-100 h-100';
//            icon.style = 'font-size: 7rem;';
        div_img2.className = 'd-flex justify-content-center align-items-center';
        div_img2.style = "width: 80px; height: 80px;";
        div_img2.appendChild(icon);
    }

    div_img.appendChild(div_img2);
    div2.appendChild(div_img);
    /*Iteracion*/
    let div_info_perfil = document.createElement("div");
    div_info_perfil.className = 'col-sm-12 col-md-8 col-lg-9 p-0 pt-3 mb-2';

    let h5_nombre = document.createElement("h5");
    h5_nombre.className = 'p-0';
    let strong_nombre = document.createElement("strong");
    strong_nombre.innerHTML = 'Profesor: ';
    h5_nombre.appendChild(strong_nombre);
    h5_nombre.innerHTML += json.nombre + " " + json.apellido_paterno + " " + json.apellido_materno;

    let h5_telefono = document.createElement("h5");
    h5_telefono.className = 'p-0';
    let strong_telefono = document.createElement("strong");
    strong_telefono.innerHTML = 'Télefono: ';
    h5_telefono.appendChild(strong_telefono);
    h5_telefono.innerHTML += json.telefono !== null ? json.telefono : "";

    let h5_mail = document.createElement("h5");
    h5_mail.className = 'p-0';
    let strong_mail = document.createElement("strong");
    strong_mail.innerHTML = 'Correo electrónico: ';
    h5_mail.appendChild(strong_mail);
    h5_mail.innerHTML += json.correo !== null ? json.correo : "";

    let h5_grupo = document.createElement("h5");
    h5_grupo.className = 'p-0';
    let strong_grupo = document.createElement("strong");
    strong_grupo.innerHTML = 'Grupos: ';
    h5_grupo.appendChild(strong_grupo);
    $.each(json.grupos, function (i) {
        h5_grupo.innerHTML += " " + json.grupos[i];
    });


    div_info_perfil.appendChild(h5_nombre);
    div_info_perfil.appendChild(h5_telefono);
    div_info_perfil.appendChild(h5_mail);
    div_info_perfil.appendChild(h5_grupo);
    div2.appendChild(div_info_perfil);
    /**/
    return div2;
}

function registro_plantilla_laboral(nombre) {
    let div_contendor = document.createElement("div");
    div_contendor.className = 'row col-12 m-0 p-2 pt-3';
    let h3_title = document.createElement("h3");
    h3_title.innerHTML = 'Registrar nuevo personal';
    div_contendor.appendChild(h3_title);

    let div_form = document.createElement("div");
    div_form.className = 'col-12 p-0';
    let form_registro = document.createElement("form");
    form_registro.id = 'form_registro_personal';

    form_registro.appendChild(form_info("Nombre", "docente_nombre", "text"));

    let div = document.createElement("div");
    div.className = 'form-group row m-0 p-2';
    let label = document.createElement("label");
    label.for = "docente_apellido_paterno";
    label.className = 'col-sm-2 col-form-label';
    label.innerHTML = "Apellidos:";
    div.appendChild(label);
    let div2 = document.createElement("div");
    div2.className = 'col-sm-5';
    let input = document.createElement("input");
    input.type = "text";
    input.className = 'form-control-plaintext input';
    input.id = "docente_apellido_paterno";
    input.placeholder = "Apellido Paterno";
    div2.appendChild(input);

    let div3 = document.createElement("div");
    div3.className = 'col-sm-5';
    let input1 = document.createElement("input");
    input1.type = "text";
    input1.className = 'form-control-plaintext  input';
    input1.id = "docente_apellido_materno";
    input1.placeholder = "Apellido Materno";
    div3.appendChild(input1);

    div.appendChild(div2);
    div.appendChild(div3);

    form_registro.appendChild(div);

    form_registro.appendChild(form_info("Fecha Nacimiento", "docente_fecha_nacimiento", "date"));
    form_registro.appendChild(form_info("Teléfono", "docente_telefono", "number"));
    form_registro.appendChild(form_info("Correo Electrónico", "docente_correo", "text"));
    form_registro.appendChild(form_info("Cedula Profesional", "docente_cedula", "text"));
    form_registro.appendChild(form_info("CURP", "docente_curp", "text"));
    form_registro.appendChild(form_info("RFC", "docente_rfc", "text"));

    let div_btn = document.createElement("div");
    div_btn.className = 'form-group row m-0 p-2';
    let div_btn2 = document.createElement("div");
    div_btn2.className = 'col-sm-12';
    let btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'btn btn-danger mb-2';
    btn.innerHTML = 'Registrar';
    div_btn2.appendChild(btn);
    div_btn.appendChild(div_btn2);

    form_registro.appendChild(div_btn);
    div_form.appendChild(form_registro);
    let hr = document.createElement("hr");
    div_form.appendChild(hr);

    div_contendor.appendChild(div_form);

    let div_doc = document.createElement("div");
    div_doc.className = 'col-12 p-0';
    let h3_doc = document.createElement("h3");
    h3_doc.innerHTML = 'Subir documento (Excel) de plantilla laboral';
    h3_doc.className = "text-left";
    div_doc.appendChild(h3_doc);
    let form_doc = document.createElement("form");
    form_doc.id = 'form_registro_personal_file';
    form_doc.appendChild(form_info("Seleccionar Archivo", "file_plantilla_laboral", "file"));

    let div_btn_doc = document.createElement("div");
    div_btn_doc.className = 'form-group row m-0 p-2';
    let div_btn2_doc = document.createElement("div");
    div_btn2_doc.className = 'col-sm-12';
    let btn_doc = document.createElement('button');
    btn_doc.type = 'submit';
    btn_doc.className = 'btn btn-danger mb-2';
    btn_doc.innerHTML = 'Subir Archivo';
    div_btn2_doc.appendChild(btn_doc);
    div_btn_doc.appendChild(div_btn2_doc);

    form_doc.appendChild(div_btn_doc);

    div_doc.appendChild(form_doc);

    div_contendor.appendChild(div_doc);

    $("#modulo_section_" + nombre.replace(/\s/g, "")).append(div_contendor);

    $("#form_registro_personal").submit(function (e) {
        e.preventDefault();
//        let inputs = $("[id^=docente_]");
        let json = buildJSON_Section("form_registro_personal");
        console.log(json);
        let keys = Object.keys(json);
        for (var i = 0; i < keys.length; i++) {
            let key = keys[i].split("docente_");
            key = key[1];
            json[key] = json[keys[i]];
            delete json[keys[i]];
        }
        json.tipo_usuario = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
        json.tipo_servicio = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio;
        RequestPOST("/API/escuela360/registro_personal", json).then(function (response) {
            console.log(response);
            Swal.fire({
                title: 'Aviso',
                text: response.mensaje
            });
        });
    });



}
$("#file_plantilla_laboral").change(function (e) {
    fileReader(e);
});
function fileReader(oEvent) {
    console.log("En la funcion fileReader");
    var oFile = oEvent.target.files[0];
    var sFilename = oFile.name;

    var reader = new FileReader();
    var result = {};
    if (sFilename.toString().includes(".csv") || sFilename.toString().includes(".xlsx")) {
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
            if (validar_info(result)) {
                let keys_archivo = Object.keys(result);
                let info_completa = new Array();
                $.each(keys_archivo, function (i) {
                    let info_hoja = result[keys_archivo[i]];
                    let info_completa_hoja = new Array();
                    $.each(info_hoja, function (j) {
                        let alias = Object.keys(info_hoja[j]);
                        let keys_hoja = transforma_arreglo(Object.keys(info_hoja[j]));
                        let json = {};
                        $.each(alias, function (k) {
                            if (info_hoja[j][alias[k]].toString().includes("(hora ")) {
                                let fecha = formato_fecha(info_hoja[j][alias[k]].toString());
                                json[keys_hoja[k]] = fecha;
                            } else {
                                json[keys_hoja[k]] = info_hoja[j][alias[k]];
                            }
                        });
                        json.alias = alias;
                        json.tipo_usuario = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
                        json.tipo_servicio = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio;
                        json.id360 = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario;
                        info_completa_hoja.push(json);
                    });
                    info_completa.push(info_completa_hoja);
                });
                RequestPOST("/API/escuela360/registro_personal_array", info_completa).then(function (response) {
                    console.log(response);
                });



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

function formato_fecha(fecha) {
    let hoy = new Date(fecha);
    let dd = hoy.getDate();
    let mm = hoy.getMonth() + 1; //January is 0!
    let yyyy = hoy.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    let fecha_final = yyyy + '-' + mm + '-' + dd;
    return fecha_final;
}

function validar_info(info_archivo) {
    let procede = true;
    let keys_archivo = Object.keys(info_archivo);
    $.each(keys_archivo, function (i) {
        let info_hoja = info_archivo[keys_archivo[i]];
        console.log(info_hoja);
        $.each(info_hoja, function (j) {
//                let alias = Object.keys(info_hoja[j]);
            let keys_hoja = transforma_arreglo(Object.keys(info_hoja[j]));
            if (!keys_hoja.includes("nombre")
                    || !keys_hoja.includes("apellidopaterno")
                    || !keys_hoja.includes("apellidomaterno")
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
function transforma_arreglo(arreglo) {
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

function form_info(valor, id, tipo) {
    let div = document.createElement("div");
    div.className = 'form-group row m-0 p-2';
    let label = document.createElement("label");
    label.for = id;
    label.className = 'col-sm-2 col-form-label';
    label.innerHTML = valor + ":";
    div.appendChild(label);
    let div2 = document.createElement("div");
    div2.className = 'col-sm-10';
    let input = document.createElement("input");
    input.type = tipo;
    input.className = 'form-control-plaintext input';
    input.id = id;
    input.placeholder = valor;
    div2.appendChild(input);
    div.appendChild(div2);
    return div;
}

if ($("#direccion_institucion").length) {
    //initMap2();

    $("#buscar_direccion").on("click", function () {
        var geocoder = new google.maps.Geocoder();
        console.log($("#direccion_institucion").val());
        var address = $("#direccion_institucion").val();
        if (address !== "") {
            geocoder.geocode({'address': address}, geocodeResult);
        }
    });
}
//    var mapa;
//    function initMap2() {
//        mapa = new google.maps.Map(document.getElementById('map2'), {zoom: 5, center: {lat: 19.503329, lng: -99.185714}/*,mapTypeId:'satellite'*/, styles: [{featureType: 'administrative', elementType: 'geometry', stylers: [{visibility: "off"}, {"weight": 1}]}, {featureType: 'administrative', elementType: 'geometry.fill', stylers: [{visibility: "on"}]}, {featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{visibility: "off"}]}, {featureType: 'administrative', elementType: 'labels', stylers: [{color: '#000000'}, {visibility: "off"}]}, {featureType: 'administrative.country', elementType: 'geometry', stylers: [{color: '#a6a6a6'}, {visibility: "on"}, {"weight": 1.5}]}, {featureType: 'administrative.country', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.country', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.land_parcel', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.land_parcel', elementType: 'labels', stylers: [{visibility: "on"}]}, {featureType: 'administrative.land_parcel', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.locality', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.locality', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.locality', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.neighborhood', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.neighborhood', elementType: 'labels', stylers: [{color: '#696969'}, {visibility: "simplified"}]}, {featureType: 'administrative.neighborhood', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.province', elementType: 'geometry', stylers: [{visibility: "on"}, {"weight": 1.5}]}, {featureType: 'administrative.province', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.province', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: "landscape", stylers: [{color: '#D5D8DC'}]}, {featureType: 'landscape', elementType: 'geometry', stylers: [{color: '#D5D8DC'}]}, {featureType: 'landscape', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'landscape', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{color: '#526081'}, {visibility: "off"}]}, {featureType: 'landscape.natural.landcover', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.landcover', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'road', elementType: 'geometry', stylers: [{visibility: "simplified"}]}, {featureType: 'road', elementType: 'labels', stylers: [{visibility: "simplified"}]}, {featureType: 'road', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'water', elementType: 'geometry', stylers: [{color: '#F2F4F4'}, {visibility: "on"}]}, {featureType: 'water', elementType: 'labels', stylers: [{visibility: "off"}]}]});
//        mapa.setTilt(45);
//    }

function geocodeResult(results, status) {
    if (status == 'OK') {
        $("#lat").val(results[0].geometry.location.lat());
        $("#lng").val(results[0].geometry.location.lng());
        marker = new google.maps.Marker({
            position: {lat: parseFloat($("#lat").val()), lng: parseFloat($("#lng").val())},
            map: mapa,
            draggable: true,
            animation: google.maps.Animation.DROP
        });
        var latlng = {lat: parseFloat($("#lat").val()), lng: parseFloat($("#lng").val())};
        console.log(latlng);
        mapa.setCenter(latlng);
        mapa.setZoom(18);
        marker.addListener('dragend', function () {
            var lat = marker.getPosition().lat();
            var lng = marker.getPosition().lng();
            $("#lat").val(lat);
            $("#lng").val(lng);
        });
    } else {
        alert("Geocoding no tuvo éxito debido a: " + status);
    }
}
function initMaps() {
    initMap();
    initMap2();
    initMap3();
    initMap4();
    initMap5();
}

function initializeSessionSubscriber(data) {

    if (sesion_jornada_laboral !== null) {
        sesion_jornada_laboral.disconnect();
    }
    sesion_jornada_laboral = OT.initSession(data.apikey, data.idsesion);

    sesion_jornada_laboral.on({
        connectionCreated: function (event) {
            console.log("connectionCreated:");
            console.log(event);
        },
        connectionDestroyed: function (event) {
            console.log("connectionDestroyed:");
            console.log(event);
        },
        sessionConnected: function (event) {
            console.log("sessionConnected:");
            console.log(event);
        },
        sessionDisconnected: function (event) {
            console.log("sessionDisconnected:");
            console.log(event);

        },
        sessionReconnected: function (event) {
            console.log("sessionReconnected:");
            console.log(event);
        },
        sessionReconnecting: function (event) {
            console.log("sessionReconnecting:");
            console.log(event);
        },
        streamCreated: function (event) {
            console.log("streamCreated:");
            console.log(event);

        },
        streamDestroyed: function (event) {
            console.log("streamDestroyed:");
            console.log(event);
        },
        signal: function (event) {

            console.log("signal");
            console.log(event);

        }

    });

    // Connect to the session
    sesion_jornada_laboral.connect(data.token, function callback(error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (!error) {

            // Initialize the publisher
            var publisherOptions = {
                insertMode: 'replace',
                width: '100%',
                height: '100%',
                name: $(".nombre_completo")[0].innerHTML,
                publishVideo: true,
                publishAudio: false
            };
            if (!$("#conectado_jornada_laboral").length) {
                //preparar espacio para nuevo video 
                document.getElementById("video_drag").innerHTML += '<div id="conectado_jornada_laboral" style="min-height: 150px; min-width: 150px; width: 100%; height: 100%; overflow: hidden;"></div>';
            }
            var pos = "conectado_jornada_laboral";
            var publisher = OT.initPublisher(pos, publisherOptions, function initCallback(initErr) {

                if (initErr) {
                    console.error('There was an error initializing the publisher: ', initErr.name, initErr.message);
                    //notificarError(initErr.message);
                    return;
                } else {
                    $("#video_drag").removeClass("d-none");
                    $("#iniciar_jornada_laboral").addClass("d-none");
                    $("#guardarreporte").removeClass("d-none");
                    // Make the DIV element draggable:
                    dragElement(document.getElementById("video_drag"));
                    console.log("Registrar conexion");
                    //console.log(empleado);
                    /*$("#nom").val(empleado.nombre + " " + empleado.apellidos);
                     $("#num").val(empleado.idUsuario_Sys);*/
                    RequestPOST("/API/empresas360/registro/horario_laboral", {
                        "id_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario,
                        "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
                        "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
                        "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area,
                        "apikey": Credenciales.apikey,
                        "idsesion": Credenciales.idsesion,
                        "token": Credenciales.token,
                        "id_socket": idSocketOperador,
                        "fecha": getFecha(),
                        "hora": getHora()

                    }).then(function (response) {
                        $("#ing").val(response.date_created + " " + response.time_created);
                        if (response.reporte !== null) {
                            $("#rep").val(response.reporte);
                        }




                        $("#guardarreporte").click(function () {
                            console.log("guardarreporte");

                            RequestPOST("/API/empresas360/registro/horario_laboral", {
                                "id_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario,
                                "id": response.id,
                                "reporte": $("#rep").val(),
                                "fecha": getFecha(),
                                "hora": getHora()
                            }).then(function (response) {
                                $("#ing").val(response.date_created + " " + response.time_created + " - " + response.date_updated + " " + response.time_updated);
                                swal.fire({
                                    text: "Tu jornada laboral comenzo a la hora: " + response.time_created + " y esta finalizando a la hora: " + response.time_updated,
                                    timer: 5000
                                }).then(function () {
                                    if (sesion_jornada_laboral !== null) {
                                        sesion_jornada_laboral.disconnect();
                                    }
                                    $("#iniciar_jornada_laboral").removeClass("d-none");
                                    $("#guardarreporte").addClass("d-none");
                                    //ocultar ventana de video 
                                    $("#video_drag").addClass("d-none");
                                });
                            });
                        });

                    });


                }
            });

            // If the connection is successful, publish the publisher to the session
            sesion_jornada_laboral.publish(publisher, function publishCallback(publishErr) {
                if (publishErr) {
                    console.error('There was an error publishing: ', publishErr.name, publishErr.message);
                    swal.fire({
                        text: "Revisa que tengas conectada una camara web con microfono y que no este siendo ocupada por otra aplicacion."
                    });
                } else {


                    //////////Solicitar Cambio de camara  ******
                    var activarVideo = document.createElement("input");
                    activarVideo.className = "activarVideoPublisher";
                    activarVideo.value = "";
                    activarVideo.addEventListener("click", function () {

                        publisher.publishVideo(!publisher.stream.hasVideo);
                    });
                    document.getElementById(pos).appendChild(activarVideo);


                }
            });
        } else {
            console.error('There was an error connecting to the session: ', error.name, error.message);
        }
    });

}

// Make the DIV element draggable:
//    dragElement(document.getElementById("video_drag"));

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "_header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "_header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
$("#iniciar_jornada_laboral").click(() => {

    GenerarCredenciales().then(function (response) {
        console.log(response);
        Credenciales = response;
        initializeSessionSubscriber(response);
    });
});



function registro_plantilla_laboral(nombre) {
    let div_contendor = document.createElement("div");
    div_contendor.className = 'row col-12 m-0 p-2 pt-3';
    let h3_title = document.createElement("h3");
    h3_title.innerHTML = 'Registrar nuevo personal';
    div_contendor.appendChild(h3_title);

    let div_form = document.createElement("div");
    div_form.className = 'col-12 p-0';
    let form_registro = document.createElement("form");
    form_registro.id = 'form_registro_personal';
    form_registro.className = 'row m-0 p-0 col-12=';

    let select_sucursal = document.createElement("select");
    select_sucursal.className="form-control-plaintext input p-2 text-dark m-0 mb-1 col-sm-12 col-md-7";
    select_sucursal.style="font: bold 1rem Arial; border: none; background: none; border-bottom: solid 2px #495057;";
    select_sucursal.required=true;
    select_sucursal.innerHTML='<option disabled="" selected="" value="">Selecciona una sucursal</option>';
    select_sucursal.id="PlantillaLaboral_listado_sucursales";
    
    let div_s = document.createElement("div");
    div_s.className = 'col-1';
    
    let select_area = document.createElement("select");
    select_area.className="form-control-plaintext input p-2 text-dark m-0 mb-1 col-sm-12 col-md-4";
    select_area.style="font: bold 1rem Arial; border: none; background: none; border-bottom: solid 2px #495057;";
    select_area.required=true;
    select_area.innerHTML='<option disabled="" selected="" value="">Selecciona una área</option>';
    select_area.id="PlantillaLaboral_listado_areas";
//    if(sesion_cookie.tipo_servicio==="0"){
//        select.appendChild('<option  value="0"></option>');
//    }
    form_registro.appendChild(select_sucursal);
    form_registro.appendChild(div_s);
    form_registro.appendChild(select_area);
    
    form_registro.appendChild(form_info_plantilla_laboral("Número de empleado", "num_empleado", "text"));
    form_registro.appendChild(form_info_plantilla_laboral("Nombre", "docente_nombre", "text"));

    let div = document.createElement("div");
    div.className = 'form-group row m-0 p-2';
    let label = document.createElement("label");
    label.for = "docente_apellidopaterno";
    label.className = 'col-sm-2 col-form-label';
    label.innerHTML = "Apellidos:";
    div.appendChild(label);
    let div2 = document.createElement("div");
    div2.className = 'col-sm-5';
    let input = document.createElement("input");
    input.type = "text";
    input.className = 'form-control-plaintext input';
    input.id = "docente_apellidopaterno";
    input.placeholder = "Apellido Paterno";
    div2.appendChild(input);

    let div3 = document.createElement("div");
    div3.className = 'col-sm-5';
    let input1 = document.createElement("input");
    input1.type = "text";
    input1.className = 'form-control-plaintext  input';
    input1.id = "docente_apellidomaterno";
    input1.placeholder = "Apellido Materno";
    div3.appendChild(input1);

    div.appendChild(div2);
    div.appendChild(div3);

    form_registro.appendChild(div);

    form_registro.appendChild(form_info_plantilla_laboral("Correo Electrónico", "docente_correo", "text"));

    let div_btn = document.createElement("div");
    div_btn.className = 'form-group row m-0 p-2';
    let div_btn2 = document.createElement("div");
    div_btn2.className = 'col-sm-12';
    let btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'btn btn-danger mb-2';
    btn.innerHTML = 'Registrar';
    div_btn2.appendChild(btn);
    div_btn.appendChild(div_btn2);

    form_registro.appendChild(div_btn);
    div_form.appendChild(form_registro);
    let hr = document.createElement("hr");
    div_form.appendChild(hr);

    div_contendor.appendChild(div_form);

    let div_doc = document.createElement("div");
    div_doc.className = 'col-12 p-0';
    let h3_doc = document.createElement("h3");
    h3_doc.innerHTML = 'Subir documento (Excel) de plantilla laboral';
    div_doc.appendChild(h3_doc);
    let form_doc = document.createElement("form");
    form_doc.id = 'form_registro_personal_file';
    form_doc.appendChild(form_info_plantilla_laboral("Seleccionar Archivo", "file_plantilla_laboral", "file"));

    let div_btn_doc = document.createElement("div");
    div_btn_doc.className = 'form-group row m-0 p-2';
    let div_empty = document.createElement("div");
    div_empty.className = 'col-sm-12';
    div_empty.id = "registros_file";
    let div_btn2_doc = document.createElement("div");
    div_btn2_doc.className = 'col-sm-12';
    div_btn2_doc.innerHTML = '<p>El documento debe ser un archivo con extensión csv ó xlsx y debe contener como minimo las columnas <strong>Nombre, Apellido Paterno, Apellido Materno y Correo</strong> puedes descargar una plantilla <a target="_blank" href="https://lineamientos.s3.amazonaws.com/plantilla.xlsx">aquí.</a></p>';
    let btn_doc = document.createElement('button');
    btn_doc.type = 'submit';
    btn_doc.className = ' d-none btn btn-danger mb-2';
    btn_doc.innerHTML = 'Subir Archivo';
    div_btn2_doc.appendChild(btn_doc);
//            div_btn_doc.appendChild(div_empty);
    div_btn_doc.appendChild(div_btn2_doc);

    form_doc.appendChild(div_btn_doc);

    div_doc.appendChild(form_doc);

    div_contendor.appendChild(div_doc);

    $("#modulo_section_" + nombre.replace(/\s/g, "")).append(div_contendor);
    $("#modulo_section_" + nombre.replace(/\s/g, "")).append(div_empty);

    $("#form_registro_personal").submit(function (e) {
        e.preventDefault();
        //        let inputs = $("[id^=docente_]");
        let json = buildJSON_Section("form_registro_personal");
        console.log(json);
        let keys = Object.keys(json);
        for (var i = 0; i < keys.length; i++) {
            let key = keys[i].split("docente_");
            key = key[1];
            json[key] = json[keys[i]];
            delete json[keys[i]];
        }
        json.tipo_usuario = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
        json.tipo_servicio = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio;
        let jsonObj = [[json]];
        RequestPOST("/API/registro_invitacion", jsonObj).then(function (response) {
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


RequestGET("/API/lineamientos/listado_sucursales/" + sesion_cookie.tipo_usuario).then((response) => {

                for (var i = 0; i < response.length; i++) {
//                    agregar_listado_sucursal(response[i]);
                    let json = response[i];
                    console.log(json);
                    //MisSucursales_listado
                    let option = document.createElement("option");
                    option.value = json.id;
                    option.innerHTML = json.nombre_edificio;
                    if(sesion_cookie.tipo_servicio==="0"){
                         $("#PlantillaLaboral_listado_sucursales").append(option);
                    }else{
                        if(json.id===sesion_cookie.tipo_servicio){
                            $("#PlantillaLaboral_listado_sucursales").append(option);
                        }
                    }
                   
                }
                //Agregar listener 
                $("#PlantillaLaboral_listado_sucursales").change((e) => {
                    console.log(e.target.value);
                    //cambiar los valores del area  deacuerdo al value seleccionado 
                    //Solicitar areas
                    //agregar tipo servicio
                });
            });
    //$("#menu_section_" + nombre.replace(/\s/g, "")).click();

}
$("#file_plantilla_laboral").change(function (e) {
    fileReader_plantilla_laboral(e);
});
//        var json_file={};
function fileReader_plantilla_laboral(oEvent) {
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

        $("#registros_file").append(h1);

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
            if (validar_info_plantilla_laboral(result)) {
                let keys_archivo = Object.keys(result);
                let info_completa = new Array();
                $.each(keys_archivo, function (i) {
                    let info_hoja = result[keys_archivo[i]];
                    let info_completa_hoja = new Array();
                    $.each(info_hoja, function (j) {
                        let alias = Object.keys(info_hoja[j]);
                        let keys_hoja = transforma_arreglo_plantilla_laboral(Object.keys(info_hoja[j]));
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
                        json.tipo_usuario = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
                        json.tipo_servicio = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio;
                        json.id360 = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario;
                        info_completa_hoja.push(json);
                    });
                    info_completa.push(info_completa_hoja);
                });
                console.log(info_completa);
                clearInterval(interval);
                mostrar_resultados(info_completa);
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
function mostrar_resultados_plantilla_laboral(json) {

    $("#registros_file").empty();
    $("#registros_file").css({
        "position": "absolute",
        "top": "0",
        "left": "0",
        "background": "#343a40",
        "height": "100%",
        "width": "100%",
        "z-index": "100"
    });
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
    num.className = "col-1";
    num.innerHTML = '<strong>#</strong>';

    let nombre = document.createElement("div");
    nombre.className = "col-3";
    nombre.innerHTML = '<strong>Nombre</strong>';

    let apellido_paterno = document.createElement("div");
    apellido_paterno.className = "col-2";
    apellido_paterno.innerHTML = '<strong>Apellido Paterno</strong>';

    let apellido_materno = document.createElement("div");
    apellido_materno.className = "col-2";
    apellido_materno.innerHTML = '<strong>Apellido Materno</strong>';

    let correo = document.createElement("div");
    correo.className = "col-4";
    correo.innerHTML = '<strong>Correo</strong>';

    let hr = document.createElement("hr");
    hr.className = "col-12 border";

    espacio3.appendChild(registrar);
    head.appendChild(espacio1);
    head.appendChild(espacio2);
    head.appendChild(espacio3);

    div.appendChild(head);
    div.appendChild(num);
    div.appendChild(nombre);
    div.appendChild(apellido_paterno);
    div.appendChild(apellido_materno);
    div.appendChild(correo);
    div.appendChild(hr);

    $("#registros_file").append(div);

    espacio1.addEventListener("click", function () {
        $("#registros_file").empty();
        $("#registros_file").removeAttr("style");
    });
    registrar.addEventListener("click", function () {
        RequestPOST("/API/registro_invitacion", json).then(function (response) {
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
            reg_num.className = "col-1";
            reg_num.innerHTML = cont;

            let reg_nombre = document.createElement("div");
            reg_nombre.className = "col-3";
            reg_nombre.innerHTML = reg.nombre;

            let reg_apellido_paterno = document.createElement("div");
            reg_apellido_paterno.className = "col-2";
            reg_apellido_paterno.innerHTML = reg.apellidopaterno;

            let reg_apellido_materno = document.createElement("div");
            reg_apellido_materno.className = "col-2";
            reg_apellido_materno.innerHTML = reg.apellidomaterno;

            let reg_correo = document.createElement("div");
            reg_correo.className = "col-4";
            reg_correo.innerHTML = reg.correo;

            let reg_hr = document.createElement("hr");
            reg_hr.className = "col-12 border-top";

            div.appendChild(reg_num);
            div.appendChild(reg_nombre);
            div.appendChild(reg_apellido_paterno);
            div.appendChild(reg_apellido_materno);
            div.appendChild(reg_correo);
            div.appendChild(reg_hr);
//                    }
        }
    }

}
function validar_info_plantilla_laboral(info_archivo) {
    let procede = true;
    let keys_archivo = Object.keys(info_archivo);
    $.each(keys_archivo, function (i) {
        let info_hoja = info_archivo[keys_archivo[i]];
        console.log(info_hoja);
        $.each(info_hoja, function (j) {
            //                let alias = Object.keys(info_hoja[j]);
            let keys_hoja = transforma_arreglo_plantilla_laboral(Object.keys(info_hoja[j]));
            if (!keys_hoja.includes("nombre")
                    || !keys_hoja.includes("apellidopaterno")
                    || !keys_hoja.includes("apellidomaterno")
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
function transforma_arreglo_plantilla_laboral(arreglo) {
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
function form_info_plantilla_laboral(valor, id, tipo) {
    let div = document.createElement("div");
    div.className = 'form-group row m-0 p-2 col-12';
    let label = document.createElement("label");
    label.for = id;
    label.className = 'col-sm-2 col-form-label';
    label.innerHTML = valor + ":";
    div.appendChild(label);
    let div2 = document.createElement("div");
    div2.className = 'col-sm-10';
    let input = document.createElement("input");
    input.type = tipo;
    input.className = 'form-control-plaintext input';
    input.id = id;
    input.placeholder = valor;
    div2.appendChild(input);
    div.appendChild(div2);
    return div;
}


/************************************************
 ************************************************ 
 *************************************************
 * CONFIGURACIÓN DE PRIVACIDAD Y SEGURIDAD DEL CENTRO DE TRABAJO
 *************************************************
 *************************************************
 ************************************************/

var esAdministrador = false;
var edicionPermitida = false;
var matricula = new Object();

const verificaEdicionPermitida = () => {
    return new Promise((resolve, reject) => {
        if (esAdministrador)
            resolve(true);
        else {
            RequestGET("/API/empresas360/obtenData/edicion_individual/" + JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario).then(function (response) {

                if (response.edicion_individual.toString() === "1")
                    resolve(true);
                else
                    return resolve(false);

            });
        }
    });
};

/*Matriz de parametros modificables */
const parametros = {
    "vinculacion": {
        "mensajeActivado": "Bloqueada", "mensajeDesactivado": "Desbloqueada", "iconActivado": "<i class='fas fa-lock'></i>", "iconDesactivado": "<i class='fas fa-lock-open'></i>", "textConfirmApaga": "¿Seguro que deseas desactivar la vinculación?", "textConfirmEnciende": "¿Seguro que deseas activar la vinculación?"
    },
    "visibilidad_app": {
        "mensajeActivado": "Visible", "mensajeDesactivado": "No Visible", "iconActivado": "<i class='fas fa-eye'></i>", "iconDesactivado": "<i class='fas fa-eye-slash'></i>", "textConfirmApaga": "¿Seguro que deseas desactivar la visibilidad?", "textConfirmEnciende": "¿Seguro que deseas activar la visibilidad?"
    },
    "lista_blanca": {
        "mensajeActivado": "Activada", "mensajeDesactivado": "Desactivada", "iconActivado": "<i class='fas fa-clipboard-list'></i>", "iconDesactivado": "<i class='fas fa-user-friends'></i>", "textConfirmApaga": "¿Seguro que deseas desactivar la lista blanca?", "textConfirmEnciende": "¿Seguro que deseas activar la lista blanca?"
    },
    "token_vinculacion": {
        "mensajeActivado": "Con Token", "mensajeDesactivado": "Sin Token", "iconActivado": "<i class='fas fa-key'></i>", "iconDesactivado": "<i class='fas fa-door-open'></i>", "textConfirmApaga": "¿Seguro que deseas desactivar el token?", "textConfirmEnciende": "¿Seguro que deseas activar el token?"
    },
    "edicion_individual": {
        "mensajeActivado": "Activada", "mensajeDesactivado": "Desactivado"
    }
};

/*
 * Función para cambiar el DOM
 * Al componente se le agrega el ícono y texto
 * Además, usamos el componente data para almacenar el valor de la bd y no estar haciendo peticiones concurrentes al servidor
 */
const actualizaParametroView = (element, text, icon, value) => {
    $("#" + element).html(icon).data("current", value);
    $("#estatus_" + element).text(text);
};

/*
 * Función para confirmar operación
 */
const confirmarOperacion = (text) => {
    return new Promise((resolve, reject) => {
        swal.fire({
            text: text,
            showCancelButton: true,
            confirmButtonText: "Continuar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.dismiss)
                resolve(false);
            if (result.value)
                resolve(true);
        });
    });
};

/*
 * Función para consumir la api modificando un valor en específico
 */
const actualizaParametroModel = (dato, value, textConfirm) => {
    return new Promise((resolve, reject) => {
        verificaEdicionPermitida().then(respuesta => {
            if (respuesta) {
                confirmarOperacion(textConfirm).then(respuesta => {
                    if (respuesta) {
                        let json = new Object();
                        json[dato] = value;
                        json.id = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
                        resolve(RequestPOST("/API/empresas360/modifica/" + dato, json).then(function (response) {
                            return response.success;
                        }));
                    } else
                        resolve(false);
                });
            } else {
                Swal.fire({text: 'No tienes permisos para editar la información!'});
                resolve(false);
            }
        });
    });
};

/*
 * Función para generar token aleatorio
 */
const genera_token = (length) => {
    let token = '';
    let permitidos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*{}.¡?=#$%&';
    let cantidadPermitidos = permitidos.length;
    for (let i = 0; i < length; i++)
        token += permitidos.charAt(Math.floor(Math.random() * cantidadPermitidos));
    return token;
};

$(document).ready(function () {

    /*
     * Establecer globalmente si es usuario es un administrador de sucursal
     */

    esAdministrador = (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario.toString() === "0") ? true : false;

    /*
     * Carga inicial de la información actual de la bd
     */
    RequestGET("/API/empresas360/obtenData/" + JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario).then(function (response) {

        if (response.success) {

            response.vinculacion === "0" ?
                    actualizaParametroView("vinculacion", parametros.vinculacion.mensajeDesactivado, parametros.vinculacion.iconDesactivado, response.vinculacion) :
                    actualizaParametroView("vinculacion", parametros.vinculacion.mensajeActivado, parametros.vinculacion.iconActivado, response.vinculacion);

            response.visibilidad_app === "0" ?
                    actualizaParametroView("visibilidad_app", parametros.visibilidad_app.mensajeDesactivado, parametros.visibilidad_app.iconDesactivado, response.visibilidad_app) :
                    actualizaParametroView("visibilidad_app", parametros.visibilidad_app.mensajeActivado, parametros.visibilidad_app.iconActivado, response.visibilidad_app);

            response.lista_blanca === "0" ?
                    actualizaParametroView("lista_blanca", parametros.lista_blanca.mensajeDesactivado, parametros.lista_blanca.iconDesactivado, response.lista_blanca) :
                    actualizaParametroView("lista_blanca", parametros.lista_blanca.mensajeActivado, parametros.lista_blanca.iconActivado, response.lista_blanca);

            if (response.token_vinculacion === undefined || response.token_vinculacion === null || response.token_vinculacion === "" || response.token_vinculacion === "null") {
                $("#info_token").removeClass("d-none");
                actualizaParametroView("token_vinculacion", parametros.token_vinculacion.mensajeDesactivado, parametros.token_vinculacion.iconDesactivado, null);
            } else
                actualizaParametroView("token_vinculacion", parametros.token_vinculacion.mensajeActivado, parametros.token_vinculacion.iconActivado, response.token_vinculacion);

            if (esAdministrador)
                $("#componente_edicion_individual").removeClass("d-none");

        }

    });

    /*
     * Click sobre cualquier de los parámetros modificables (se agregó la clase 'parametros_modificables'  
     * para no trabajar un método click por cada componente
     */
    $(".parametro_modificable").click(function () {
        const element = $(this).attr("id");
        let current = $(this).data("current");
        /*
         * Modificar token
         */
        if (element === "token_vinculacion") {
            $("#valor_nuevo_token").val("");
            if (current === undefined || current === null || current === "" || current === "null")
                $("#info_token").removeClass("d-none");
            else {
                actualizaParametroModel("token_vinculacion", null, parametros.token_vinculacion.textConfirmApaga).then(respuesta => {
                    if (respuesta) {
                        $("#info_token").removeClass("d-none");
                        actualizaParametroView("token_vinculacion", parametros.token_vinculacion.mensajeDesactivado, parametros.token_vinculacion.iconDesactivado, null);
                    }
                });
            }
            /*
             * Modificar visibilidad, vinculacion y lista blanca
             */
        } else {
            current = current.toString();
            var change = (current === "0") ? (1) : (0);
            const param = Object.values(parametros);
            const n = Object.keys(parametros).indexOf(element);
            const textConfirm = (change === "0") ? param[n].textConfirmApaga : param[n].textConfirmEnciende;
            actualizaParametroModel(element, change, textConfirm).then(respuesta => {
                if (respuesta) {
                    const text = (current === "0") ? (param[n].mensajeActivado) : (param[n].mensajeDesactivado);
                    const icon = (current === "0") ? (param[n].iconActivado) : (param[n].iconDesactivado);
                    actualizaParametroView(element, text, icon, change);
                }
            });
        }
    });

    /*
     * Boton generar token aleatorio
     */
    $("#generar_token_aleatorio").click(function () {
        $("#valor_nuevo_token").val(genera_token(8));
    });

    /*
     * Boton establecer token
     */
    $("#establecer_nuevo_token").click(function () {
        let input = $("#valor_nuevo_token");
        let token = input.val();
        if (token === "")
            alert("Ingresa un token");
        else {
            actualizaParametroModel("token_vinculacion", token, parametros.token_vinculacion.textConfirmEnciende).then(respuesta => {
                if (respuesta) {
                    actualizaParametroView("token_vinculacion", parametros.token_vinculacion.mensajeActivado, parametros.token_vinculacion.iconActivado, token);
                    $("#info_token").addClass("d-none");
                    input.val("");
                }
            });
        }
    });

    /*
     * Función para filtrar en la tabla de sucursales
     */
    const buscaSucursal = () => {
        var tableReg = document.getElementById('tablaPlantillaSucursales');
        var searchText = document.getElementById('buscaSucursal').value.toLowerCase();
        for (var i = 1; i < tableReg.rows.length; i++) {
            var cellsOfRow = tableReg.rows[i].getElementsByTagName('td');
            var found = false;
            for (var j = 0; j < cellsOfRow.length && !found; j++) {
                var compareWith = cellsOfRow[j].innerHTML.toLowerCase();
                if (searchText.length === 0 || (compareWith.indexOf(searchText) > -1)) {
                    found = true;
                }
            }
            if (found) {
                tableReg.rows[i].style.display = '';
            } else {
                tableReg.rows[i].style.display = 'none';
            }
        }
    };

    /*
     * Boton para editar la configuración edición individual de la plantilla laboral (módulo para administradores)
     */
    $("#edicion_individual").click(function () {
        let id = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
        RequestGET("/API/empresas360/obtenMatricula/" + id).then(function (response) {
            if (response.data.length === 0) {
                swal.fire({
                    text: "Aún no hay sucursales en tu plantilla laboral"
                });
            } else {

                let data = response.data;
                let cantidadData = data.length;

                let tablaPlantilla = "<input placeholder='Buscar sucursal' id='buscaSucursal' type='text' /><br><br>" +
                        "<div id='contenedorTablaSucursales'><table id='tablaPlantillaSucursales'>" +
                        "<tr>" +
                        "<th>Sucursal</th>" +
                        "<th>Permitida</th>" +
                        "<th>Bloqueada</th>" +
                        "</tr>";
                for (let x = 0; x < cantidadData; x++) {
                    let sucursal = data[x];
                    let selectedPermitido = (sucursal.edicion_individual === "1") ? "checked" : "";
                    let selectedBloqueada = (sucursal.edicion_individual === "0") ? "checked" : "";
                    tablaPlantilla += "<tr>" +
                            "<td>" + sucursal.nombre + "</td>" +
                            "<td><input " + selectedPermitido + " type='radio' value='1' name='" + sucursal.id + "'/></td>" +
                            "<td><input " + selectedBloqueada + " type='radio' value='0' name='" + sucursal.id + "'/></td>" +
                            "<tr>";
                }
                tablaPlantilla += "</table></div>";

                Swal.fire({
                    title: 'Permitir o desactivar edición individual',
                    html: tablaPlantilla,
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonText: 'Guardar configuración',
                    cancelButtonText: 'Cancelar',
                    onRender: () => {
                        document.getElementById("buscaSucursal").addEventListener("keyup", buscaSucursal);
                    }
                }).then((result) => {
                    if (result.value) {
                        let json = new Object();
                        json.data = new Object();
                        let inputs = $("#tablaPlantillaSucursales input[type=radio]");
                        let cantidadInputs = inputs.length;
                        inputs.each(function (index) {
                            let name = $(this).attr("name");
                            json.data[name] = $("input[name=" + name + "]:checked").val();
                        });
                        json.id_empresa = 5;
                        confirmarOperacion("La edición individual permite que las sucursales modifiquen su privacidad").then(response => {
                            if (response) {
                                RequestPOST("/API/empresas360/modifica/edicion_individual", json).then(function (response) {
                                    if (response.success)
                                        Swal.fire({text: "Configuración realizada"});
                                    else
                                        Swal.fire({text: "Error en el servidor, intente más tarde"});
                                });
                            }
                        });
                    }
                });

            }

        });
    });

});
/**************************/

/* Accion para registrar y activar una empresa */

$("#form_registro_nueva_empresa").submit((e) => {
    e.preventDefault()

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

$("#ver_gis").click(() => {
    acceso_externo('https://geodatos.claro360.com/');
});
$("#ver_lineamientos").click(() => {
    acceso_externo('https://seguridadsanitaria.claro360.com/lineamientos/');
});
$("#ver_registrarsucursal").click(() => {
    document.getElementById('menu_section_RegistrarSucursal').click();
});
$("#ver_plantillalaboral").click(() => {
    document.getElementById('menu_section_PlantillaLaboral').click();
});

function agregar_listado_sucursal(json) {
    console.log(json);
    //MisSucursales_listado
    let option = document.createElement("option");
    option.value = json.id;
    option.innerHTML = json.nombre_edificio;
}