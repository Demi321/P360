/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*******************************/
agregar_menu("Mis Sucursales");
//Servicio para obtener el listado de sucursales 
RequestGET("/API/lineamientos/listado_sucursales/" + sesion_cookie.tipo_usuario).then((response) => {
    //Este listado de sucursales es para la vista de MisSucursales
    for (var i = 0; i < response.length; i++) {
//                    agregar_listado_sucursal(response[i]);
        let json = response[i];
        //console.log(json);
        //MisSucursales_listado
        let option = document.createElement("option");
        option.value = json.id;
        option.innerHTML = json.nombre_edificio;
        if (sesion_cookie.tipo_servicio === "0") {
            $("#MisSucursales_listado, #sucursal_jornadas").append(option);
        } else {
            if (json.id === sesion_cookie.tipo_servicio) {
                $("#MisSucursales_listado, #sucursal_jornadas").append(option);
            }
        }

    }
    //Agregar listener al select de la vista MisSucursales
    $("#MisSucursales_listado").change((e) => {
        console.log(e.target.value);
        $("#MisSucursales_tipo_servicio").val(e.target.value);
        //cambiar los valores deacuerdo al value seleccionado 
        if (marcador5 !== null) {
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
            let json = response[i];
            if (json.id === e.target.value) {

                //rellenar informacion
                $("#d_autocompletar5").val(json.direccion);
                $("#MisSucursales_apellido_m").val(json.apellido_m);
                $("#MisSucursales_apellido_p").val(json.apellido_p);
                $("#MisSucursales_correo_contacto").val(json.correo);
                $("#MisSucursales_extension_contacto").val(json.extension);
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
                $("#MisSucursales_tipo_sector").val(json.tipo_sector)
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
                    map5.setCenter({lat: parseFloat(json.lat), lng: parseFloat(json.lng)});
                    marcador5.setPosition({lat: parseFloat(json.lat), lng: parseFloat(json.lng)});
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
    if ($("#MisSucursales_listado").val() !== null) {
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
                    let json = buildJSON_Section("MisSucursales_form_actualizar")
                    if (marcador5 !== null) {
                        if (marcador5.getPosition() !== undefined) {
                            json.lat = marcador5.getPosition().lat();
                            json.lng = marcador5.getPosition().lng();
                        }
                    }
                    json.id_empresa = sesion_cookie.tipo_usuario;
                    json.tipo_sector = json.MisSucursales_tipo_sector;
                    json.registro_patronal = json.MisSucursales_registro_patronal;
                    json.razon_social = json.MisSucursales_razon_social;
                    json.rfc = json.MisSucursales_rfc;
                    json.sector = json.MisSucursales_tipo_sector;
                    json.patron_primario = json.MisSucursales_patron_primario;
                    json.proveedor = json.MisSucursales_proveedor;
                    json.direccion = json.d_autocompletar5;
                    json.cp = json.cp5;
                    json.municipio = json.municipio5;
                    json.estado = json.estado5;
                    json.numero_trabajadores = json.MisSucursales_n_trabajadores;
                    json.pais = json.pais5;
                    json.nombre_edificio = json.MisSucursales_nombre_edificio;
                    json.logotipo = json.MisSucursales_logotipo;
                    json.apellido_m = json.MisSucursales_apellido_m;
                    json.apellido_p = json.MisSucursales_apellido_p;
                    json.nombre = json.MisSucursales_nombre;
                    json.telefono = json.MisSucursales_telefono_contacto;
                    json.extension = json.MisSucursales_extension_contacto;
                    json.correo = json.MisSucursales_correo_contacto;
                    json.n_exterior = json.MisSucursales_n_exterior;
                    json.n_interior = json.MisSucursales_n_interior;

                    json.tipo_servicio = $("#MisSucursales_tipo_servicio").val();
                    json.id360 = sesion_cookie.id_usuario;
                    json.calle = json.calle5;
                    json.colonia = json.colonia5;
                    json.id_institucion = $("#MisSucursales_tipo_servicio").val();

                    //console.log(json);

                    //SERVICIO PARA REALIZAR UPDATE
                    RequestPOST("/API/empresas360/actualizacion_sucursal", json).then(function (response) {
                        console.log(response);
                        Swal.fire({
                            text: response.mensaje
                        }).then(function () {
                            if (response.success) {
                                window.location.reload();
                            }
                        });
                    });
                }
            }
        }
    } else {
        swal.fire({
            text: "Necesitas seleccionar una sucursal del listado para actualizar su información."
        });
    }




});
$("#baja_sucursal").click(() => {
    if ($("#MisSucursales_listado").val() !== null) {
        let json = {
            id_institucion: $("#MisSucursales_tipo_servicio").val()
        };
        RequestPOST("/API/empresas360/baja_sucursal", json).then((response) => {
            swal.fire({
                text: response.mensaje
            }).then(function () {
                if (response.success) {
                    window.location.reload();
                }
            });
        });
    } else {
        swal.fire({
            text: "Necesitas seleccionar una sucursal del listado para darla de baja."
        });
    }
});