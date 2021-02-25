var info_empresa=null;
var info_sucursal=null;
var info_sucursales=null;
var catalogo_lineamientos = null;
var perfil=null;
var directorio_completo = null;



//informacion de empresa 

RequestGET("/API/empresas360/info_empresa/" + sesion_cookie.tipo_usuario).then((response) => {
    console.log(response);
    info_empresa=response
//    if (response.tipo_usuario) {
//        $("#nombre_empresa").val(response.tipo_usuario);
//    }
});

RequestGET("/API/empresas360/info_sucursal/" + sesion_cookie.tipo_servicio).then((response) => {
    console.log(response);
    info_sucursal=response;
//    if (response.success) {
//        $("#nombre_sucursal").val(response.nombre);
//    }
});
RequestGET("/API/empresas360/info_sucursales/" + sesion_cookie.tipo_usuario).then((response) => {
    console.log(response);
    info_sucursales=response;
//    if (response.success) {
//        $("#nombre_sucursal").val(response.nombre);
//    }
});
//informacion de sucursales 
//informacion de perfil

RequestPOST("/API/cuenta360/empresas360/perfil/empleado", {
        "id360": sesion_cookie.id_usuario
    }).then(function (response) {
        if (response.success) {
            perfil = response;
        }

    });
//configuracion del usuario sonidos de chat y llamada 
var configuracionUsuario = null;
RequestPOST("/API/empresas360/configuracionUsuario", {id360:sesion_cookie.id_usuario}).then((response) => {
    if(response.length>0){
        configuracionUsuario = response[0];
    }
});

//directorio 
RequestPOST("/API/ConsultarDirectorio", {
    "fecha": getFecha(),
    "hora": getHora(),
    "tipo_usuario": sesion_cookie.tipo_usuario,
    "tipo_servicio": sesion_cookie.tipo_servicio,
//    "tipo_area": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_area,
    "tipo_area": "0"
}).then((response) => {
    directorio_completo = response.directorio;
});

//Servicio de carga de archivos 
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



//modulos si el tipo de usuario es nulo 
if ($("#base_modulo_RegistraryActivarEmpresa #correo").length) {
    $("#base_modulo_RegistraryActivarEmpresa #correo").val(sesion_cookie.correo);
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
//agregar_menu("Entrada y Salida");
//habilitarMaximizarVideo();

$("#evidencia_evento").click(() => {
    document.getElementById("img_reporte_evento").click();
//        $("#img_reporte_evento").click();
});
$("#evidencia_seguridad_sanitaria").click(() => {
    document.getElementById("img_reporte_seguridad").click();
//        $("#img_reporte_seguridad").click();
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
            tipo_usuario: JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
            tipo_servicio: JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio,
            id360: JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).id_usuario
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
            institucion: JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio,
            tipo_usuario: JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
            tipo_servicio: JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio,
            id360: JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).id_usuario
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


//RequestGET("/API/empresas360/listado_areas/" + sesion_cookie.tipo_usuario + "/" + sesion_cookie.tipo_servicio).then((response) => {
//    $.each(response, (i) => {
//        let option = document.createElement("option");
//        option.value = response[i].id;
//        option.innerHTML = response[i].area;
//        $("#PlantillaLaboral_listado_all_areas").append(option);
//    });
//    $("#PlantillaLaboral_listado_all_areas").change((e) => {
//        console.log(e.target.value);
//        $("#id_tipo_area").val(e.target.value);
//    });
//});


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
            RequestGET("/API/empresas360/obtenData/edicion_individual/" + JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario).then(function (response) {

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
                        json.id = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario;
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

    esAdministrador = (JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario.toString() === "0") ? true : false;

    /*
     * Carga inicial de la información actual de la bd
     */
    RequestGET("/API/empresas360/obtenData/" + JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario).then(function (response) {

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
        let id = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario;
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

$(() => {
    $(".menu_sidebar")[0].click();
});

$("body").on("change",$("#file_plantilla_laboral"),function (e) {
    
    if("file_plantilla_laboral"===e.target.id){
        console.log("Funciona cargando archivo plantilla laboral");
    fileReader_plantilla_laboral(e);
    }
    
});
