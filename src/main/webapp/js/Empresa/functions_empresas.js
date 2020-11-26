/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global RequestPOST, swal, Swal, marcador3, DEPENDENCIA, marcador5, map5, google */

console.log("Bingoooooo");
var sesion_jornada_laboral = null;
var BucketName = "lineamientos";
var bucketRegion = "us-east-1";
var IdentityPoolId = "us-east-1:a8460f87-8d3f-4452-935a-b95a4fcc83ed";
var listado_sucursales = null;
var sesion_cookie = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA));
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

WebSocketGeneral.onmessage = function (message) {
    var mensaje = JSON.parse(message.data);
    console.log(mensaje);
    if (credenciales === null) {
        credenciales = mensaje;
    }
    try {

        if (mensaje.inicializacionSG) {
            idSocketOperador = mensaje.idSocket;
        }
        if (mensaje.llamada_multiplataforma) {
            notificacion_llamada(mensaje);
            prueba_notificacion(mensaje);
        }
        if (mensaje.video_empleado) {
            //Verificar si el modulo de videowall empleado existe 
            if ($("#base_modulo_VideoWallEmpleados").length) {
                console.log("Videowall");
                //agregarlo a la lista 
                actualizacion_listado_video_empleados(mensaje);
            }
        }
    } catch (e) {

    }

};

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
                        "id_socket": idSocketOperador

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
                                "reporte": $("#rep").val()
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
    select_sucursal.className = "form-control-plaintext input p-2 text-dark m-0 mb-1 col-sm-12 col-md-7";
    select_sucursal.style = "font: bold 1rem Arial; border: none; background: none; border-bottom: solid 2px #495057;";
    select_sucursal.required = true;
    select_sucursal.innerHTML = '<option disabled="" selected="" value="">Selecciona una sucursal</option>';
    select_sucursal.id = "PlantillaLaboral_listado_sucursales";

    let div_s = document.createElement("div");
    div_s.className = 'col-1';

    let select_area = document.createElement("select");
    select_area.className = "form-control-plaintext input p-2 text-dark m-0 mb-1 col-sm-12 col-md-4";
    select_area.style = "font: bold 1rem Arial; border: none; background: none; border-bottom: solid 2px #495057;";
    select_area.required = true;
    select_area.innerHTML = '<option disabled="" selected="" value="">Selecciona una área</option>';
    select_area.id = "PlantillaLaboral_listado_areas";
//    if(sesion_cookie.tipo_servicio==="0"){
//        select.appendChild('<option  value="0"></option>');
//    }
    form_registro.appendChild(select_sucursal);
    form_registro.appendChild(div_s);
    form_registro.appendChild(select_area);

    form_registro.appendChild(form_info_plantilla_laboral("Puesto", "PlantillaLaboral_puesto", "text"));
    form_registro.appendChild(form_info_plantilla_laboral("Número de empleado", "PlantillaLaboral_num_empleado", "text"));
    form_registro.appendChild(form_info_plantilla_laboral("Nombre", "PlantillaLaboral_nombre", "text"));

    let div = document.createElement("div");
    div.className = 'form-group row m-0 p-2 col-12';
    let label = document.createElement("label");
    label.for = "PlantillaLaboral_apellidopaterno";
    label.className = 'col-sm-2 col-form-label';
    label.innerHTML = "Apellidos:";
    div.appendChild(label);
    let div2 = document.createElement("div");
    div2.className = 'col-sm-5';
    let input = document.createElement("input");
    input.type = "text";
    input.className = 'form-control-plaintext input';
    input.id = "PlantillaLaboral_apellidopaterno";
    input.placeholder = "Apellido Paterno";
    div2.appendChild(input);

    let div3 = document.createElement("div");
    div3.className = 'col-sm-5';
    let input1 = document.createElement("input");
    input1.type = "text";
    input1.className = 'form-control-plaintext  input';
    input1.id = "PlantillaLaboral_apellidomaterno";
    input1.placeholder = "Apellido Materno";
    div3.appendChild(input1);

    div.appendChild(div2);
    div.appendChild(div3);

    form_registro.appendChild(div);

    form_registro.appendChild(form_info_plantilla_laboral("Correo Electrónico", "PlantillaLaboral_correo", "text"));

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
    div_btn2_doc.innerHTML = '<p>El documento debe ser un archivo con extensión csv ó xlsx y debe contener como minimo las columnas <strong>Número de sucursal, Área, Puesto, Nombre, Apellido Paterno, Apellido Materno, Correo</strong> puedes descargar una plantilla <a target="_blank" href="https://lineamientos.s3.amazonaws.com/plantilla.xlsx">aquí.</a></p>';
    let btn_doc = document.createElement('button');
    btn_doc.type = 'submit';
    btn_doc.className = ' d-none btn btn-danger mb-2';
    btn_doc.innerHTML = 'Subir Archivo';
    div_btn2_doc.appendChild(btn_doc);
//            div_btn_doc.appendChild(div_empty);
    div_btn_doc.appendChild(div_btn2_doc);
    form_doc.innerHTML += '<div class="col-12"><p style="    color: #343a40;    font: normal 0.9rem Arial;">* En este apartado encontraras el listado de las sucursales registradas junto con el <strong style="    font: inherit;    font-weight: bolder;">número de sucursal asignado por la plataforma</strong>, este número es importante para realizar el registro de tu plantilla laboral ya que es solicitado en el documento que subiras</p></div>';
    form_doc.appendChild(div_btn_doc);

    div_doc.appendChild(form_doc);

    div_contendor.appendChild(div_doc);

    $("#modulo_section_" + nombre.replace(/\s/g, "")).append(div_contendor);
    $("#modulo_section_" + nombre.replace(/\s/g, "")).append(div_empty);

    $("#form_registro_personal").submit(function (e) {
        e.preventDefault();
        //        let inputs = $("[id^=docente_]");
        if ($("#PlantillaLaboral_listado_sucursales").val() !== null
                && $("#PlantillaLaboral_listado_areas").val() !== null) {

            let json = buildJSON_Section("form_registro_personal");
            console.log(json);
            let keys = Object.keys(json);
            for (var i = 0; i < keys.length; i++) {
                let key = keys[i].split("PlantillaLaboral_");
                key = key[1];
                json[key] = json[keys[i]];
                delete json[keys[i]];
            }
            json.tipo_usuario = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
            json.tipo_servicio = json.listado_sucursales;
            delete json["listado_sucursales"];
            json.tipo_area = json.listado_areas;
            json.id360 = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario;
            json.numerodeempleado = json.num_empleado;

            delete json["listado_areas"];
            json.area = $("#PlantillaLaboral_listado_areas option:selected").text();
            let jsonObj = [[json]];
            RequestPOST("/API/registro_invitacion", jsonObj).then(function (response) {
                swal.fire({
                    text: response.mensaje
                }).then(function () {
                    if (response.success) {
                        document.location.reload();
                    }
                });

            });
        } else {
            Swal.fire({
                text: "Debe seleccionar una sucursal y un área para poder registrar su plantilla laboral."
            });
        }
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
            if (sesion_cookie.tipo_servicio === "0") {
                $("#PlantillaLaboral_listado_sucursales").append(option);
            } else {
                if (json.id === sesion_cookie.tipo_servicio) {
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
            $("#PlantillaLaboral_listado_areas").val("");
            $("#PlantillaLaboral_listado_areas").empty();
            let option = document.createElement("option");
            option.value = "";
            option.innerHTML = "Selecciona una área";
            option.disabled = "true";
            option.selected = "true";
            $("#PlantillaLaboral_listado_areas").append(option);
            //agregamos la opcion por default 
            RequestGET("/API/empresas360/listado_areas/" + sesion_cookie.tipo_usuario + "/" + e.target.value).then((rsp) => {
                console.log(rsp);

                for (var i = 0; i < rsp.length; i++) {
                    let json = rsp[i];
//                    agregar_area(rsp);
                    let option = document.createElement("option");
                    option.value = json.id;
                    option.innerHTML = json.area;
                    $("#PlantillaLaboral_listado_areas").append(option);
                }
            });
        });

        let div = document.createElement("div");
        div.className = 'row col-12 m-0';
        let div_2 = document.createElement("div");
        div_2.className = 'col-12 m-0';
        let label_id = document.createElement("label");
        label_id.innerHTML = 'Número de sucursal';
        label_id.className = 'col-3 m-0';
        label_id.style = 'font-weight: bold;border-right: solid 1px;border-bottom: 1px solid;text-align: center;';
        let label_nombre = document.createElement("label");
        label_nombre.innerHTML = 'Nombre de sucursal';
        label_nombre.className = 'col-9 m-0';
        label_nombre.style = 'font-weight: bold;border-bottom: 1px solid;text-align: center;';
        div_2.appendChild(label_id);
        div_2.appendChild(label_nombre);
        div.appendChild(div_2);
        $("#modulo_section_PlantillaLaboral div")[0].appendChild(div);
        $.each(response, (i) => {
            let div_3 = document.createElement("div");
            div_3.className = 'col-12 m-0';
            let label_1 = document.createElement("label");
            label_1.innerHTML = response[i].id;
            label_1.className = 'col-3 m-0 py-1';
            label_1.style = 'border-right: solid 1px;text-align: center;';
            let label_2 = document.createElement("label");
            label_2.innerHTML = response[i].nombre_edificio;
            label_2.className = 'col-9 m-0 py-1';
            label_2.style = 'text-align: left;padding-left: 20px;';
            div_3.appendChild(label_1);
            div_3.appendChild(label_2);
            div.appendChild(div_3);
            $("#modulo_section_PlantillaLaboral div")[0].appendChild(div);
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
                        json.tipo_servicio = json.numerodesucursal;
                        delete json["numerodesucursal"];
                        json.id360 = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario;
                        info_completa_hoja.push(json);
                    });
                    info_completa.push(info_completa_hoja);
                });
                console.log(info_completa);
                clearInterval(interval);
                mostrar_resultados_plantilla_laboral(info_completa);
//                        RequestPOST("/API/registro_invitacion",info_completa).then(function(response){
//                            console.log(response);
//                        });

            } else {
                Swal.fire({
                    title: 'Archivo incompleto',
                    text: "EL archivo debe contener la informacion mínima: Número de sucursal, Área, Puesto, Nombre, Apellido Paterno, Apellido Materno, Correo."
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
        "background": "white",
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
    num.className = "col";
    num.innerHTML = '<strong>Sucursal</strong>';

    let nombre = document.createElement("div");
    nombre.className = "col-2";
    nombre.innerHTML = '<strong>Nombre</strong>';

    let apellido_paterno = document.createElement("div");
    apellido_paterno.className = "col-2";
    apellido_paterno.innerHTML = '<strong>Apellido Paterno</strong>';

    let apellido_materno = document.createElement("div");
    apellido_materno.className = "col-2";
    apellido_materno.innerHTML = '<strong>Apellido Materno</strong>';

    let correo = document.createElement("div");
    correo.className = "col-2";
    correo.innerHTML = '<strong>Correo</strong>';
    let puesto = document.createElement("div");
    puesto.className = "col-1";
    puesto.innerHTML = '<strong>Puesto</strong>';
    let area = document.createElement("div");
    area.className = "col-1";
    area.innerHTML = '<strong>Área</strong>';
    let n_empleado = document.createElement("div");
    n_empleado.className = "col";
    n_empleado.innerHTML = '<strong>N° empleado</strong>';

    let hr = document.createElement("hr");
    hr.className = "col-12 border";

    espacio3.appendChild(registrar);
    head.appendChild(espacio1);
    head.appendChild(espacio2);
    head.appendChild(espacio3);

    div.appendChild(head);
    div.appendChild(num);
    div.appendChild(area);
    div.appendChild(puesto);
    div.appendChild(n_empleado);
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
            reg_num.className = "col";
            reg_num.innerHTML = reg.tipo_servicio;

            let reg_nombre = document.createElement("div");
            reg_nombre.className = "col-2";
            reg_nombre.innerHTML = reg.nombre;

            let reg_apellido_paterno = document.createElement("div");
            reg_apellido_paterno.className = "col-2";
            reg_apellido_paterno.innerHTML = reg.apellidopaterno;

            let reg_apellido_materno = document.createElement("div");
            reg_apellido_materno.className = "col-2";
            reg_apellido_materno.innerHTML = reg.apellidomaterno;

            let reg_correo = document.createElement("div");
            reg_correo.className = "col-2";
            reg_correo.innerHTML = reg.correo;
            let reg_puesto = document.createElement("div");
            reg_puesto.className = "col-1";
            reg_puesto.innerHTML = reg.puesto;
            let reg_area = document.createElement("div");
            reg_area.className = "col-1";
            reg_area.innerHTML = reg.area;
            let reg_n_empleado = document.createElement("div");
            reg_n_empleado.className = "col";
            reg_n_empleado.innerHTML = reg.numerodeempleado;

            let reg_hr = document.createElement("hr");
            reg_hr.className = "col-12 border-top";


            div.appendChild(reg_num);
            div.appendChild(reg_area);
            div.appendChild(reg_puesto);
            div.appendChild(reg_n_empleado);
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
                    || !keys_hoja.includes("numerodesucursal")
                    || !keys_hoja.includes("area")
                    || !keys_hoja.includes("puesto")
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



function agregar_area(json) {
    //areas_registradas
    let div = document.createElement("div");
    div.className = "p-0 py-2 col-12";
    let card = document.createElement("div");
    card.className = "card";
    let card_header = document.createElement("div");
    card_header.className = "card-header text-dark text-left";
    card_header.style = "background: none; font-size: 1.5rem;";
    card_header.innerHTML = '<i class="fas fa-minus-circle"></i>';
    card_header.innerHTML += json.nombre + " - " + json.area;
    let card_body = document.createElement("div");
    card_body.className = "card-body text-dark text-left px-4";
    card_body.style = "background: no-repeat; border: none; font-size: 1.4rem;";
    let card_body_div = document.createElement("div");
    card_body_div.style = "font-size: 1.4rem; align-items: center; display: flex; padding: 10px 5px;";
    card_body_div.innerHTML = 'Codigo de invitación: <strong style="font-size: 1.4rem; padding: 5px 20px;">ALG4-R482-SDF2-B254</strong><i class="fas fa-share-alt" style="font-size: 2rem;margin-left: 20px;color: #17a2b8;cursor: pointer;" tittle="Compartir Código"></i>';
    let p = document.createElement("p");
    p.className = "card-text";
    p.innerHTML = 'Comparte el codigo de invitación a los encargados del area: <strong>' + json.area + '</strong>';

    card_body.appendChild(card_body_div);
    card_body.appendChild(p);
    card.appendChild(card_header);
    card.appendChild(card_body);
    div.appendChild(card);
    $("#area_jornadas").append("<option value='"+json.id+"'>"+json.nombre + " - " + json.area+"</option>");
    $("#areas_registradas").append(div);



}