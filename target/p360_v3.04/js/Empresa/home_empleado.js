

/* global RequestPOST, swal, Swal, marcador3, DEPENDENCIA, marcador5, map5, google, RequestGET, XLSX, GenerarCredenciales, Credenciales */

console.log("Empleado");
var directorio_completo = null;
RequestPOST("/API/ConsultarDirectorio", {
    "fecha": getFecha(),
    "hora": getHora(),
    "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
    "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
//    "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area,
    "tipo_area": "0"
}).then((response) => {
    directorio_completo = response.directorio;
});
WebSocketGeneral.onmessage = function (message) {

    var mensaje = JSON.parse(message.data);
    console.log(mensaje);
    if (credenciales === null) {
        credenciales = mensaje;
    }

    try {
        
        if(mensaje.chat_empresarial){
            recibir_chat(mensaje);
        }

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
        /*Cambios fernando*/
        if (mensaje.chat_empresarial) {
            recibir_chat(mensaje);
        }
        /********************************/
    } catch (e) {

    }

};
RequestPOST("/API/ConsultarDirectorio", {
    "fecha": getFecha(),
    "hora": getHora(),
    "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
    "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
    "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area
}).then((directorio) => {
    console.log(directorio);
});
var sesion_jornada_laboral = null;
var BucketName = "lineamientos";
var bucketRegion = "us-east-1";
var IdentityPoolId = "us-east-1:a8460f87-8d3f-4452-935a-b95a4fcc83ed";

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
//modulos si el tipo de usuario es nulo 


$("#menu_section_MiPerfil").click();

// agregar_menu("Conmutador");
//guardar_reporte_evento();
//guardar_reporte_seguridad();

//habilitarMaximizarVideo();


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


function initMaps() {
    initMap();
    initMap2();
    initMap3();
    initMap4();
    initMap5();
}



function notificacion_llamada(mensaje) {
    swal.fire({
//        title: 'Sweet!',
//        text: 'Modal with a custom image.',
//        imageUrl: mensaje.emisor.img,
//        imageWidth: 400,
//        imageHeight: 200,
//        imageAlt: 'Custom image',
        html: content_notification_call(mensaje.emisor),
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Atender llamada!',
        cancelButtonText: 'No, atender!',
        allowOutsideClick: false,
        reverseButtons: true
    }).then((result) => {
        console.log(result);
        if (result.value) {
            console.log(mensaje);
            //Abrir la ventana de llamada 
            window.open('https://empresas.claro360.com/plataforma360/Llamada/' + mensaje.registro_llamada.idLlamada + '/' + mensaje.credenciales.apikey + '/' + mensaje.credenciales.idsesion + '/' + mensaje.credenciales.token + '', '_blank');
        }
    });
    $(".swal2-actions").addClass("m-0");
    $(".swal2-cancel").addClass("mt-0");
    $(".swal2-confirm").addClass("mt-0");


}
;

function prueba_notificacion(mensaje) {
    console.log("prueba_notificacion");
    if (Notification) {
        if (Notification.permission !== "granted") {
            Notification.requestPermission()
        }
        var title = "Llamada entrante:"
        var extra = {
            icon: mensaje.emisor.img,
            body: mensaje.emisor.nombre + " " + mensaje.emisor.apellido_paterno + " " + mensaje.emisor.apellido_materno,
            timeout: 8000, // Timeout before notification closes automatically.
            vibrate: [100, 100, 100] // An array of vibration pulses for mobile devices.
        };
        console.log(title);
        var notificar = new Notification(title, extra);
        notificar.onclick = function () {
            console.log('notification.Click');
            window.open('https://empresas.claro360.com/plataforma360/Llamada/' + mensaje.registro_llamada.idLlamada + '/' + mensaje.credenciales.apikey + '/' + mensaje.credenciales.idsesion + '/' + mensaje.credenciales.token + '', '_blank');

        };
        notificar.onerror = function () {
            console.log('notification.Error');
        };
        notificar.onshow = function () {
            console.log('notification.Show');
        };
        notificar.onclose = function () {
            console.log('notification.Close');
        };
    }
    return true;
}

function content_notification_call(emisor) {

    var img = emisor.img;


    if (emisor.telefono === null || emisor.telefono === "null") {
        emisor.telefono = "-";
    }


    let html = '<div class="row col-12 m-0 p-0 w-100">' +
            '<div class="col-4 m-0 p-0" style=" height: calc(130px - 1rem);">' +
            '<div class="infowindow-img" style="background-image: url(' + img + ');"></div>' +
            '</div>' +
            '<div class="col-8 m-0 p-0 pl-2" >' +
            '<div class="col-12 m-0 p-0">' +
            '<h2 class="title text-light text-center border-bottom py-2">' + emisor.nombre + " " + emisor.apellido_paterno + " " + emisor.apellido_materno + '</h2>' +
            '</div>' +
            '<h2 class="title text-white m-0 px-2 py-1">' + emisor.correo + '</h2>' +
            '<h2 class="subtitle text-white m-0 px-2 py-1">Teléfono: ' + emisor.telefono + '</h2>' +
            '<div class="row col-12 m-0 px-2 py-1">' +
            '<label class="col-6 p-0 m-0 subtitle text-white">Fecha:<label class="text text-white" >' + getFecha() + '</label></label>' +
            '<label class="col-6 p-0 m-0 subtitle text-white">Hora:<label class="text text-white">' + getHora() + '</label></label>' +
            '</div>' +
            '</div>' +
            '</div>';

    return html;
}

