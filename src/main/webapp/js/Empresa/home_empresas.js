



//modulos si el tipo de usuario es nulo 


if ($("#base_modulo_RegistraryActivarEmpresa #correo").length) {
    $("#base_modulo_RegistraryActivarEmpresa #correo").val(sesion_cookie.correo);
}
if (sesion_cookie.tipo_usuario !== null) {
    //usuario maestro 
    if (sesion_cookie.tipo_usuario === "0" && sesion_cookie.tipo_servicio === "0") {
        /*********/
//        agregar_menu("Registrar y Activar Empresa");
//        load_file_img("upFile_logo_nueva_empresa");
//        $("#upFile_logo_nueva_empresa_logotipo_preview").click(() => {
//            $("#upFile_logo_nueva_empresa").click();
//        });
//        /**********/
//        agregar_menu("Registrar Sucursal");
//        $("#sucursales").change(function (e) {
//            fileReader_registro_sucursales(e);
//        });
//        agregar_menu("Mi Empresa");
//        agregar_menu("Mis Sucursales");
//        agregar_menu("Mi Perfil");
//        mostrar_info_perfil();
//        agregar_menu("Plantilla Laboral");
//        registro_plantilla_laboral("Plantilla Laboral");
//        agregar_menu("Áreas de Trabajo");
//        agregar_menu("Ajustes de Privacidad");
//        agregar_menu("Conmutador");
//        agregar_menu("Nuevo Reporte");
////guardar_reporte_evento();
//        agregar_menu("Reporte Seguridad Sanitaria");
////guardar_reporte_seguridad();
//        agregar_menu("Entrada y Salida");
//        habilitarMaximizarVideo();

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
//

//mi empresa
            
            
            

            

            

            //habilitarMaximizarVideo();
//            $("#menu_section_MiEmpresa").click();
        } else {
            // usuario normal 
            /**********/
//            agregar_menu("Registrar Mi Sucursal");
            agregar_menu("Mi Perfil");
            mostrar_info_perfil();
//            agregar_menu("Conmutador");
            agregar_menu("Nuevo Reporte");
//guardar_reporte_evento();
            agregar_menu("Reporte Seguridad Sanitaria");
//guardar_reporte_seguridad();
            agregar_menu("Entrada y Salida");
            //habilitarMaximizarVideo();
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

//function registro_plantilla_laboral(nombre) {
//    let div_contendor = document.createElement("div");
//    div_contendor.className = 'row col-12 m-0 p-2 pt-3';
//    let h3_title = document.createElement("h3");
//    h3_title.innerHTML = 'Registrar nuevo personal';
//    div_contendor.appendChild(h3_title);
//
//    let div_form = document.createElement("div");
//    div_form.className = 'col-12 p-0';
//    let form_registro = document.createElement("form");
//    form_registro.id = 'form_registro_personal';
//
//    form_registro.appendChild(form_info("Nombre", "docente_nombre", "text"));
//
//    let div = document.createElement("div");
//    div.className = 'form-group row m-0 p-2';
//    let label = document.createElement("label");
//    label.for = "docente_apellido_paterno";
//    label.className = 'col-sm-2 col-form-label';
//    label.innerHTML = "Apellidos:";
//    div.appendChild(label);
//    let div2 = document.createElement("div");
//    div2.className = 'col-sm-5';
//    let input = document.createElement("input");
//    input.type = "text";
//    input.className = 'form-control-plaintext input';
//    input.id = "docente_apellido_paterno";
//    input.placeholder = "Apellido Paterno";
//    div2.appendChild(input);
//
//    let div3 = document.createElement("div");
//    div3.className = 'col-sm-5';
//    let input1 = document.createElement("input");
//    input1.type = "text";
//    input1.className = 'form-control-plaintext  input';
//    input1.id = "docente_apellido_materno";
//    input1.placeholder = "Apellido Materno";
//    div3.appendChild(input1);
//
//    div.appendChild(div2);
//    div.appendChild(div3);
//
//    form_registro.appendChild(div);
//
//    form_registro.appendChild(form_info("Fecha Nacimiento", "docente_fecha_nacimiento", "date"));
//    form_registro.appendChild(form_info("Teléfono", "docente_telefono", "number"));
//    form_registro.appendChild(form_info("Correo Electrónico", "docente_correo", "text"));
//    form_registro.appendChild(form_info("Cedula Profesional", "docente_cedula", "text"));
//    form_registro.appendChild(form_info("CURP", "docente_curp", "text"));
//    form_registro.appendChild(form_info("RFC", "docente_rfc", "text"));
//
//    let div_btn = document.createElement("div");
//    div_btn.className = 'form-group row m-0 p-2';
//    let div_btn2 = document.createElement("div");
//    div_btn2.className = 'col-sm-12';
//    let btn = document.createElement('button');
//    btn.type = 'submit';
//    btn.className = 'btn btn-danger mb-2';
//    btn.innerHTML = 'Registrar';
//    div_btn2.appendChild(btn);
//    div_btn.appendChild(div_btn2);
//
//    form_registro.appendChild(div_btn);
//    div_form.appendChild(form_registro);
//    let hr = document.createElement("hr");
//    div_form.appendChild(hr);
//
//    div_contendor.appendChild(div_form);
//
//    let div_doc = document.createElement("div");
//    div_doc.className = 'col-12 p-0';
//    let h3_doc = document.createElement("h3");
//    h3_doc.innerHTML = 'Subir documento (Excel) de plantilla laboral';
//    h3_doc.className = "text-left";
//    div_doc.appendChild(h3_doc);
//    let form_doc = document.createElement("form");
//    form_doc.id = 'form_registro_personal_file';
//    form_doc.appendChild(form_info("Seleccionar Archivo", "file_plantilla_laboral", "file"));
//
//    let div_btn_doc = document.createElement("div");
//    div_btn_doc.className = 'form-group row m-0 p-2';
//    let div_btn2_doc = document.createElement("div");
//    div_btn2_doc.className = 'col-sm-12';
//    let btn_doc = document.createElement('button');
//    btn_doc.type = 'submit';
//    btn_doc.className = 'btn btn-danger mb-2';
//    btn_doc.innerHTML = 'Subir Archivo';
//    div_btn2_doc.appendChild(btn_doc);
//    div_btn_doc.appendChild(div_btn2_doc);
//
//    form_doc.appendChild(div_btn_doc);
//
//    div_doc.appendChild(form_doc);
//
//    div_contendor.appendChild(div_doc);
//
//    $("#modulo_section_" + nombre.replace(/\s/g, "")).append(div_contendor);
//
//    $("#form_registro_personal").submit(function (e) {
//        e.preventDefault();
////        let inputs = $("[id^=docente_]");
//        let json = buildJSON_Section("form_registro_personal");
//        console.log(json);
//        let keys = Object.keys(json);
//        for (var i = 0; i < keys.length; i++) {
//            let key = keys[i].split("docente_");
//            key = key[1];
//            json[key] = json[keys[i]];
//            delete json[keys[i]];
//        }
//        json.tipo_usuario = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
//        json.tipo_servicio = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio;
//        RequestPOST("/API/escuela360/registro_personal", json).then(function (response) {
//            console.log(response);
//            Swal.fire({
//                title: 'Aviso',
//                text: response.mensaje
//            });
//        });
//    });
//
//
//
//}
//$("#file_plantilla_laboral").change(function (e) {
//    fileReader(e);
//});

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

$("#iniciar_jornada_laboral").click(() => {

    GenerarCredenciales().then(function (response) {
        console.log(response);
        Credenciales = response;
        initializeSessionSubscriber(response);
    });
});

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

$(() => {
    $(".menu_sidebar")[0].click();
});

$("body").on("change",$("#file_plantilla_laboral"),function (e) {
    console.log("Funciona cargando archivo plantilla laboral");
    fileReader_plantilla_laboral(e);
});