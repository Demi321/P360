/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



/* global RequestPOST, DEPENDENCIA, Vue, perfil, sesion_cookie, Swal, directorio_completo, PathRecursos, Notification, data, dataG, connectionCount, OT, DEPENDENCIA_ALIAS, Incidente, infowindow, google, map, prefijoFolio, vue, swal, configuracionEmpleado, configuracionUsuario */
//jQuery.event.props.push('dataTransfer');

var NotificacionesActivadas = false;
var CantidadMensajesPorChat = {};
var iconGroupDefault = 'https://bucketmoviles121652-dev.s3.amazonaws.com/public/MobileCard/perfil.png';

var dataLlamada = {};
var usuariosReenviaMensaje = null;

/*
 * REPRODUCIR SONIDO AL LLEGAR NOTIFICACION
 */
var buttonNotificacionMensaje = $("<button></button>").addClass("d-none");
buttonNotificacionMensaje.text("Reproducir notificacion m");

var buttonNotificacionLlamada = $("<button></button>").addClass("d-none");
buttonNotificacionLlamada.text("Reproducir notificacion l");

$("body").append(buttonNotificacionMensaje);
$("body").append(buttonNotificacionLlamada);

var reproduccionSonidoNotificacion = document.getElementById('sonido1');

const reproduceNotificacion = (tipo) => {
    
    if( configuracionUsuario !== null && configuracionUsuario[tipo] !== undefined ){
        
        let tonoUsuario = configuracionUsuario[tipo];
        
        if(tonoUsuario !== "silenciado"){
            reproduccionSonidoNotificacion = document.getElementById(tonoUsuario);
        
            reproduccionSonidoNotificacion.muted = true;
            reproduccionSonidoNotificacion.muted = false;
            if(tipo === "tono_llamada"){
                reproduccionSonidoNotificacion.loop = true;
            }
            reproduccionSonidoNotificacion.play();
        }
        
    }else{
        reproduccionSonidoNotificacion = document.getElementById('sonido1');
        reproduccionSonidoNotificacion.muted = true;
        reproduccionSonidoNotificacion.muted = false;
        if(tipo === "tono_llamada"){
            reproduccionSonidoNotificacion.loop = true;
        }
        reproduccionSonidoNotificacion.play();
    }
    
};

buttonNotificacionMensaje.click(() => {
    
    reproduceNotificacion("tono_mensaje");
    
});

buttonNotificacionLlamada.click(() => {
    
    reproduceNotificacion("tono_llamada");
    
});

let buttonConfiguracion = $("#settings");

let arrayTonos = ['sonido1','sonido2', 'sonido3','sonido4','sonido5','sonido6','sonido7', 'sonido8', 'sonido9', 'sonido10'];

let contenedorConfig = $("<div></div>");

let formGroupTonoMensaje = $("<div></div>").addClass("form-group mb-4");
let labelTonoMensaje = $("<label></label>");
labelTonoMensaje.text("Tono para mensajes");
let selectTonoMensaje = $("<select></select>").addClass("form-control custom-select");
selectTonoMensaje.attr("id","seleccionarTonoMensaje");
selectTonoMensaje.attr("onchange", "escuchaSonido(this.value)");
formGroupTonoMensaje.append(labelTonoMensaje);
formGroupTonoMensaje.append(selectTonoMensaje);

let formGroupTonoLlamada = $("<div></div>").addClass("form-group");
let labelTonoLlamada = $("<label></label>");
labelTonoLlamada.text("Tono para llamadas");
let selectTonoLlamada = $("<select></select>").addClass("form-control custom-select");
selectTonoLlamada.attr("id","seleccionarTonoLLamada");
selectTonoLlamada.attr("onchange", "escuchaSonido(this.value)");
formGroupTonoLlamada.append(labelTonoLlamada);
formGroupTonoLlamada.append(selectTonoLlamada);

$.each(arrayTonos, (index, tono) => {
    let option = $("<option></option>");
    option.attr("value",tono);
    option.text("Tono " + (index+1));
    selectTonoMensaje.append(option);
});

$.each(arrayTonos, (index, tono) => {
    let option = $("<option></option>");
    option.attr("value",tono);
    option.text("Tono " + (index+1));
    selectTonoLlamada.append(option);
});

selectTonoMensaje.prepend("<option value='silenciado'>Silenciar</option>");
selectTonoLlamada.prepend("<option value='silenciado'>Silenciar</option>");

contenedorConfig.append(formGroupTonoMensaje);
contenedorConfig.append(formGroupTonoLlamada);

const escuchaSonido = (sonido) => {
    if(sonido !== "silenciado"){
        let sonidoPreview = document.getElementById(sonido);
        sonidoPreview.muted = true;
        sonidoPreview.muted = false;
        sonidoPreview.play();
    }
};

buttonConfiguracion.click(() => {
    
    Swal.fire({
        html: contenedorConfig,
        showCancelButton: true,
        confirmButtonText: 'Aplicar cambios!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) {

            let data = {
                "id360": sesion_cookie.idUsuario_Sys,
                "tono_mensaje": $("#seleccionarTonoMensaje").val(),
                "tono_llamada": $("#seleccionarTonoLLamada").val(),
                "fecha": getFecha(),
                "hora": getHora()
            };
            
            RequestPOST("/API/empresas360/cambiaConfiguracionUsuario", data).then((response) => {
                
                configuracionUsuario = {};
                configuracionUsuario.id360 = sesion_cookie.idUsuario_Sys;
                configuracionUsuario.tono_mensaje = $("#seleccionarTonoMensaje").val();
                configuracionUsuario.tono_llamada = $("#seleccionarTonoLLamada").val();
                
                swal.fire({text:'Se ha guardado tu configuracion exitosamente'});
                
            });
 
        }
    });
    
});

var participantesParaGrupo = null;
vuewModalParticipantesGrupo = () => {
  
    participantesParaGrupo = new Array();
    var json = Directorio;
    vue = new Vue({
        components: {
            Multiselect: window.VueMultiselect.default
        },
        data: {

            value: [
            ],
            options: json


        },
        methods: {
            customLabel(option) {
                return  option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno;
            },
            onSelect(op) {
                participantesParaGrupo.push(op.id360);
            },
            onClose() {
                //console.info(this.value);
            },
            onRemove(op) {
                var i = participantesParaGrupo.indexOf(op);
                participantesParaGrupo.splice(i, 1);
            }

        }
    }).$mount('#agregaParticipantesGrupo');
    
};

/*
 * FIN REPRODUCCION DE SONIDOS
 */

/*
 * BOTON CREACION DE GRUPOS
 */
let contenedorAgregarGrupo = $("<div></div>");

let formCreaGrupo = $("<form></form>");
formCreaGrupo.attr("id","formCreaGrupo");
formCreaGrupo.attr("autocomplete","off");

let formGroupNombreGrupo = $("<div></div>").addClass("form-group");
let labelNombreGrupo = $("<label></label>");
labelNombreGrupo.text("Título del grupo");
labelNombreGrupo.attr("for","inputNombreGrupo");
let inputNombreGrupo = $("<input>").addClass("form-control");
inputNombreGrupo.attr("id","inputNombreGrupo");
inputNombreGrupo.attr("type","text");
inputNombreGrupo.attr("required","true");
formGroupNombreGrupo.append(labelNombreGrupo);
formGroupNombreGrupo.append(inputNombreGrupo);
formCreaGrupo.append(formGroupNombreGrupo);

let formGroupDescripcionGrupo = $("<div></div>").addClass("form-group");
let labelDescripcionGrupo = $("<label></label>")
labelDescripcionGrupo.text("Descripción breve");
labelDescripcionGrupo.attr("for","inputDescripcionGrupo");
let inputDescripcionGrupo = $("<input>").addClass("form-control");
inputDescripcionGrupo.attr("id","inputDescripcionGrupo");
inputDescripcionGrupo.attr("type","text");
inputDescripcionGrupo.attr("required","true");
formGroupDescripcionGrupo.append(labelDescripcionGrupo);
formGroupDescripcionGrupo.append(inputDescripcionGrupo);
formCreaGrupo.append(formGroupDescripcionGrupo);

let formGroupParticipantesGrupo = $("<div></div>").addClass("form-group");
let labelParticipantesGrupo = $("<label></label>");
labelParticipantesGrupo.text("Participantes");
let selectParticipantesGrupo = '<div class="col-12" id="agregaParticipantesGrupo">' +
                                    '<multiselect ' +
                                    'placeholder=""' +
                                    'v-model="value" ' +
                                    ':options="options"' +
                                    'track-by="id360"' +
                                    ':multiple="true"' +
                                    ':taggable="false"' +
                                    ':close-on-select="false"' +
                                    ':custom-label="customLabel" ' +
                                    ':select-label="\'Seleccionar\'" ' +
                                    ':selected-Label="\'Seleccionado\'"' +
                                    ':deselect-Label="\'Remover\'"' +
                                    ':hide-selected="true"' +
                                    '@select="onSelect"' +
                                    '@Close="onClose"' +
                                    '@Remove="onRemove">' +
                                    '</multiselect>' +
                                    '<pre class="language-json" style="display:none"><code>{{ value  }}</code></pre>' +
                                '</div>';
formGroupParticipantesGrupo.append(labelParticipantesGrupo);
formGroupParticipantesGrupo.append(selectParticipantesGrupo);
formCreaGrupo.append(formGroupParticipantesGrupo);

let buttonSubmitCreaGrupo = $("<button></button>").addClass("btn btn-danger btn-block mt-4");
buttonSubmitCreaGrupo.attr("type","submit");
buttonSubmitCreaGrupo.text("Crear Grupo");
formCreaGrupo.append(buttonSubmitCreaGrupo);

contenedorAgregarGrupo.append(formCreaGrupo);

$("#addGroup").click(() => {
    
    Swal.fire({
        html: contenedorAgregarGrupo,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        allowEscapeKey : false
    });
    
    vuewModalParticipantesGrupo();
    
    $("#agregaParticipantesGrupo .multiselect__content-wrapper").css({"background-color":"#fff"});
    
    $("#formCreaGrupo").submit((e) => {
        
        e.preventDefault();
        let nombreGrupo = $("#inputNombreGrupo").val().trim();
        let descripcionGrupo = $("#inputDescripcionGrupo").val().trim();
        
        if( participantesParaGrupo.length ){
            
            let dataGrupo = {
                "idUser": sesion_cookie.idUsuario_Sys,
                "nombre_grupo": nombreGrupo,
                "icono_grupo": iconGroupDefault,
                "descripcion_grupo": descripcionGrupo,
                "fecha": getFecha(),
                "hora": getHora(),
                "participantes": participantesParaGrupo
            };
            console.log(dataGrupo);
            RequestPOST("/API/empresas360/crear_grupo", dataGrupo).then((response) => {
                
                let idGrupo = response.id_grupo;
                
                if(response.success){
                    Swal.close();
                    
                    let dataContac = {
                        "id360": idGrupo,
                        "nombre_grupo": nombreGrupo,
                        "img": iconGroupDefault,
                        "descripcion_grupo": descripcionGrupo
                    };

                    contacto_chat(dataContac, true);
                    $("#profile_chat"+idGrupo).click();
                    
                    swal.fire({text: "Invitación enviada a los participantes"});
                }
                
            });
            
        }else{
            
            
            
        }
        
    });
    
});
/*
 * FIN CREACION DE GRUPO
 */

let array_llamar = new Array();
agregar_menu("Comunicación",'<i class="fas fa-comments"></i>',"Trabajo");
Vue.component("multiselect", window.VueMultiselect.default);

/*$(document).on("click",function(e) {
 
 var menuMensajes = $(".menuOpcionesMensaje");
 
 if (!menuMensajes.is(e.target) && menuMensajes.has(e.target).length === 0) { 
 menuMensajes.css({"height":"0"});           
 }
 
 });*/

if (perfil !== "" && perfil !== null && perfil !== undefined) {
    $("#profile-nombre").text(perfil.nombre + " " + perfil.apellido_paterno + " " + perfil.apellido_materno);
    $("#profile-img").css({
        "background": "url('" + perfil.img + "')",
        "background-size": "cover",
        "background-position": "center",
        "background-repeat": "no-repeat"
    });
} else {
    RequestPOST("/API/cuenta360/empresas360/perfil/empleado", {
        "id360": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario
    }).then(function (response) {
        if (response.success) {
            perfil = response;
            $("#profile-nombre").text(perfil.nombre + " " + perfil.apellido_paterno + " " + perfil.apellido_materno);
            $("#profile-img").css({
                "background": "url('" + perfil.img + "')",
                "background-size": "cover",
                "background-position": "center",
                "background-repeat": "no-repeat"
            });
        }
    });
}
function agregar_chat_enviado(mensaje, viejo) {
    if (!$("#profile_chat" + mensaje.to_id360).length) {
        RequestPOST("/API/get/perfil360", {id360: mensaje.to_id360}).then((response) => {
            if (response.sucesss) {
                contacto_chat(response);
                directorio_completo.push(response);
                agregar_chat(mensaje, response, "replies", viejo);
            }
        });
    } else {
        let user = null;
        $.each(directorio_completo, (i) => {
            if (mensaje.to_id360 === directorio_completo[i].id360) {
                user = directorio_completo[i];
                return false;
            }
        });
        if (user !== null)
            agregar_chat(mensaje, user, "replies", viejo);
    }

}
function recibir_chat(mensaje, viejo, group) {
    if (!$("#profile_chat" + mensaje.id360).length) {
        if(group){
            RequestPOST("/API/empresas360/infoGrupo", {"id_grupo":mensaje.idGroup}).then((response) => {
                console.log(response);
            });
        }else{
            RequestPOST("/API/get/perfil360", mensaje).then((response) => {
                if (response.success) {
                    contacto_chat(response);
                    directorio_completo.push(response);
                    agregar_chat(mensaje, response, "send", viejo);
                }
            });
        }
    } else {
        if(group){
            
        }else{
            let user = null;
            $.each(directorio_completo, (i) => {
                if (mensaje.id360 === directorio_completo[i].id360) {
                    user = directorio_completo[i];
                    return false;
                }
            });
            if (user !== null) {
                if (NotificacionesActivadas) {

                    let body = '';
                    if (mensaje.type === "text") {
                        body = user.nombre + " " + user.apellido_paterno + " dice: " + mensaje.message;
                    } else {
                        body = user.nombre + " " + user.apellido_paterno + " ha enviado un adjunto";
                    }

                    /*let onClickNotification = () => {
                     $(".messages").animate({scrollTop: $(document).height()+100000}, "fast");
                     $("#message_input_"+user.id360).focus();

                     if($("#profile_chat" + value.id360).length){
                     $("#profile_chat" + value.id360).click();
                     }else{
                     contacto_chat(value);
                     $("#profile_chat" + value.id360).click();
                     }

                     };*/

                    notificacion_mensaje("Nuevo mensaje", body, () => {
                    });

                    buttonNotificacionMensaje.click();

                }

                agregar_chat(mensaje, user, "send", viejo);
            }
        }

    }

}

function notificacion_mensaje(title, body, onclick) {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    } else {

        var options = {
            body: body,
            icon: PathRecursos + "images/claro2min.png",
            silent: true
        };

        var notificacion = new Notification(title, options);

        notificacion.onshow = function () {
            //document.getElementById('').play();
        };

        notificacion.onclick = onclick;

        notificacion.silent = true;

    }

}

const swalConfirmDialog = (message, textConfirm, textCancel) => {
    return new Promise((resolve, reject) => {
        swal.fire({
            text: message,
            showCancelButton: true,
            confirmButtonText: textConfirm,
            cancelButtonText: textCancel
        }).then((result) => {
            if (result.dismiss)
                resolve(false);
            if (result.value)
                resolve(true);
        });
    });
};

vuewModalReenviaMensaje = () => {
  
    usuariosReenviaMensaje = new Array();
    var json = Directorio;
    vue = new Vue({
        components: {
            Multiselect: window.VueMultiselect.default
        },
        data: {

            value: [
            ],
            options: json


        },
        methods: {
            customLabel(option) {
                return  option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno;
            },
            onSelect(op) {
                usuariosReenviaMensaje.push(op.id360);
            },
            onClose() {
                //console.info(this.value);
            },
            onRemove(op) {
                var i = usuariosReenviaMensaje.indexOf(op);
                usuariosReenviaMensaje.splice(i, 1);
            }

        }
    }).$mount('#usuariosReenviaMensaje');
    
};

const reenviaMensaje = (mensaje) => {
    let contenedorReenviaMensaje = $("<div></div>");

    let formReenviaMensaje = $("<form></form>");
    formReenviaMensaje.attr("id","formReenviaMensaje");
    formReenviaMensaje.attr("autocomplete","off");

    let formGroupReenviaMensaje = $("<div></div>").addClass("form-group");
    let labelUsuariosReenvia = $("<label></label>");
    labelUsuariosReenvia.text("Reenviar a:");
    let selectUsuariosReenvia = '<div class="col-12" id="usuariosReenviaMensaje">' +
                                        '<multiselect ' +
                                        'placeholder=""' +
                                        'v-model="value" ' +
                                        ':options="options"' +
                                        'track-by="id360"' +
                                        ':multiple="true"' +
                                        ':taggable="false"' +
                                        ':close-on-select="false"' +
                                        ':custom-label="customLabel" ' +
                                        ':select-label="\'Seleccionar\'" ' +
                                        ':selected-Label="\'Seleccionado\'"' +
                                        ':deselect-Label="\'Remover\'"' +
                                        ':hide-selected="true"' +
                                        '@select="onSelect"' +
                                        '@Close="onClose"' +
                                        '@Remove="onRemove">' +
                                        '</multiselect>' +
                                        '<pre class="language-json" style="display:none"><code>{{ value  }}</code></pre>' +
                                    '</div>';
    formGroupReenviaMensaje.append(labelUsuariosReenvia);
    formGroupReenviaMensaje.append(selectUsuariosReenvia);
    formReenviaMensaje.append(formGroupParticipantesGrupo);

    let buttonSubmitReenviaMensaje = $("<button></button>").addClass("btn btn-danger btn-block mt-4");
    buttonSubmitReenviaMensaje.attr("type","submit");
    buttonSubmitReenviaMensaje.text("Reenviar mensaje");
    formReenviaMensaje.append(buttonSubmitReenviaMensaje);

    contenedorReenviaMensaje.append(formReenviaMensaje);

    Swal.fire({
        html: contenedorReenviaMensaje,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        allowEscapeKey : false
    });

    vuewModalReenviaMensaje();

    $("#usuariosReenviaMensaje .multiselect__content-wrapper").css({"background-color":"#fff"});

    $("#formReenviaMensaje").submit((e) => {

        e.preventDefault();

        if( usuariosReenviaMensaje.length ){

            let cantidadU = usuariosReenviaMensaje.length;
            for( let x = 0; x<cantidadU; x++ ){
                
                let input = $("<input>");
                input.val(mensaje);
                
                let ulJS = document.getElementById("contact_messaging"+usuariosReenviaMensaje[x]);
                let ul = $(ulJS);
                
                let previewJS = document.getElementById("profile_chat"+usuariosReenviaMensaje[x]);
                let preview = $(previewJS);
                
                let messagesJS = document.getElementById("messages_"+usuariosReenviaMensaje[x]);
                let messages = $(messagesJS);
                
                let user = {"id360":usuariosReenviaMensaje[x]};
                
                send_chat_messages(input, ul, preview, user, messages);
            }

        }

    });
};

function agregar_chat(msj, user, type, viejo) {
    if (user.success) {
        let mensaje = msj.message;
        let li = $("<li></li>").addClass(type);
        li.attr("id", "mensaje_" + msj.id);
        li.addClass("limessage");
        let img_message = $("<div></div>").addClass("img");

        img_message.css({
            "background": "url('" + user.img + "')",
            "background-size": "cover",
            "background-position": "center",
            "background-repeat": "no-repeat"
        });
        if (type === "replies") {
            img_message.css({
                "background": "url('" + perfil.img + "')",
                "background-size": "cover",
                "background-position": "center",
                "background-repeat": "no-repeat"
            });
        }
        let message = $("<p></p>");

        let id = type === "replies" ? msj.to_id360 : msj.id360;
        let previewMesagge;

        if (msj.activo === "0") {

            message.empty();
            message.text("Mensaje eliminado");
            let iconMensajeEliminado = $("<i></i>").addClass("fas fa-comment-slash");
            if (type === "send") {
                iconMensajeEliminado.css({"margin-left": "10px"});
                message.append(iconMensajeEliminado);
            } else {
                iconMensajeEliminado.css({"margin-right": "10px"});
                message.prepend(iconMensajeEliminado);
            }
            message.css({
                "background-color": "transparent",
                "font-style": "italic",
                "font-size": "1.1rem",
                "color": "#434343"
            });
            previewMesagge = "Mensaje eliminado";

            li.append(img_message);
            li.append(message);

        } else {

            if (mensaje.slice(0, 7) === "http://" || mensaje.slice(0, 8) === "https://" || mensaje.slice(0, 4) === "www.") {
                let linkMensaje = $("<a>");
                linkMensaje.text(mensaje);
                linkMensaje.attr("href", mensaje);
                linkMensaje.attr("tarjet", "_blank");
                linkMensaje.css({
                    "color": "currentColor"
                });
                message.html(linkMensaje);
                
                message.css({
                    "word-break": "break-all"
                });
                
            } else {
                message.text(mensaje);
            }

            let fecha = $("<span></span>").addClass("time");

            let fechaDate = new Date(msj.fecha);
            let fechaCorta = fechaDate.getDate() + "/" + (fechaDate.getMonth() + 1) + "/" + fechaDate.getFullYear();
            let hoy = new Date();

            fechaCorta = fechaDate.getTime() === hoy.getTime() ? "" : fechaCorta;

            fecha.text(fechaCorta + " " + msj.hora);
            let iconClock = $("<li></li>").addClass("far fa-clock");

            if (type === "replies") {
                fecha.append(iconClock);
                iconClock.addClass("ml-2");
            } else {
                fecha.prepend(iconClock);
                iconClock.addClass("mr-2");
            }

            message.append(fecha);

            li.append(img_message);
            li.append(message);

            let idConver = type === "replies" ? msj.to_id360 : msj.id360;
            previewMesagge = type === "replies" ? "Yo: " + mensaje : user.nombre + ": " + mensaje;

            if (msj.type !== "text") {
                let extension = msj.type;

                let partesPorDiagonal = mensaje.split("/");
                let nombreCorto = partesPorDiagonal[partesPorDiagonal.length - 1];

                let nombreCortoPorGuionBajo = nombreCorto.split("_");
                nombreCortoPorGuionBajo.shift();

                nombreCorto = nombreCortoPorGuionBajo.join('_');

                previewMesagge = type === "replies" ? "Yo: " + nombreCorto.replaceAll("%20", " ") : user.nombre + ": " + nombreCorto.replaceAll("%20", " ");

                let imagenPreview = $("<img>").css({"max-width": "125px", "max-height": "75px", "margin-bottom": "10px"}).attr("src", PathRecursos + "images/icono_default.png");

                let saltoLinea = $("<br>");
                let nombreAdjunto = $("<span></span>").css({"font-size": "1.1rem"});
                nombreAdjunto.text(nombreCorto.replaceAll("%20", " ") + " ");

                let buttonDownloadAttachment = $("<a></a>").addClass("btn btn-light").css({"margin-left": "10px"});
                buttonDownloadAttachment.attr("href", mensaje);
                buttonDownloadAttachment.attr("download", nombreCorto);
                buttonDownloadAttachment.attr("target", "_blank");
                buttonDownloadAttachment.html('<i class="fas fa-download"></i>');

                nombreAdjunto.append(buttonDownloadAttachment);

                switch (extension) {

                    case "jpg":
                    case "png":
                    case "jpeg":
                    case "gif":
                        imagenPreview.attr("src", mensaje);
                        buttonDownloadAttachment.attr("target", "_blanck");
                        break;

                    case "docx":
                    case "docm":
                    case "dotx":
                    case "dotm":
                    case "doc":
                        imagenPreview.attr("src", PathRecursos + "images/icono_word.png");
                        break;

                    case "xlsx":
                    case "xlsm":
                    case "xlsb":
                    case "xltx":
                    case "xltm":
                    case "xls":
                    case "xlt":
                        imagenPreview.attr("src", PathRecursos + "images/icono_excel.png");
                        break;

                    case "pptx":
                    case "pptm":
                    case "ppt":
                    case "xps":
                    case "potx":
                    case "ppsx":
                        imagenPreview.attr("src", PathRecursos + "images/icono_powerpoint.png");
                        break;

                    case "pdf":
                        imagenPreview.attr("src", PathRecursos + "images/icono_pdf.png");
                        break;

                }

                console.log(imagenPreview);
                message.empty().append(imagenPreview);
                message.append(saltoLinea);
                if (!(extension === "jpg" || extension === "png" || extension === "jpeg" || extension === "gif")) {
                    message.append(nombreAdjunto);
                } else {
                    imagenPreview.css({"cursor": "pointer", "max-width": "250px","max-height":"250px"});
                    
                    let imagenPreviewCopy = $("<img>");
                    imagenPreviewCopy.attr("src", mensaje);
                    imagenPreviewCopy.css({
                        "max-width": "650px",
                        "max-height":"650px"
                    });
                    
                    imagenPreview.click(() => {
                        Swal.fire({
                            width: 700,
                            showCancelButton: false,
                            showConfirmButton: false,
                            html: imagenPreviewCopy
                        });
                    });
                }
                message.append(fecha);
            }

            //ICONO MENU DE OPCION PARA EL MENSAJE
            if (type === "replies") {
                let iconOpciones = $("<span></span>").addClass("iconOpciones");
                let iconDespliegaMenu = $('<i class="fas fa-chevron-down"></i>');
                iconOpciones.append(iconDespliegaMenu);
                message.append(iconOpciones);

                const eliminaMensaje = (tipo) => {
                    //PEDIR CONFIRMACION DE ELIMINAR
                    swalConfirmDialog("¿Eliminar mensaje?", "Eliminar", "Cancelar").then((response) => {
                        if (response) {
                            //PROCESO DE ELIMINACION
                            
                            let dataMensaje = {
                                "idMensaje": msj.id
                            };
                            
                            let services;
                            
                            if(tipo === 0){
                                services = "/API/empresas360/eliminaMensaje";
                                dataMensaje.id360 = sesion_cookie.idUsuario_Sys;
                                dataMensaje.to_id360 = user.id360;
                            }else{
                                services = "/API/empresas360/eliminaMensajeParaMi";
                                dataMensaje.idUser = sesion_cookie.idUsuario_Sys;
                            }

                            RequestPOST(services, dataMensaje).then((response) => {
                                if (response.success) {
                                    menuOpcionesMensaje.removeClass("conAltura");
                                    if(tipo === 0){
                                        message.empty();
                                        message.text("Mensaje eliminado");
                                        let iconMensajeEliminado = $("<i></i>").addClass("fas fa-comment-slash");
                                        iconMensajeEliminado.css({"margin-right": "10px"});
                                        message.prepend(iconMensajeEliminado);
                                        message.css({
                                            "background-color": "transparent",
                                            "font-style": "italic",
                                            "font-size": "1.1rem"
                                        });
                                    }else{
                                        li.remove();
                                    }
                                    
                                }
                            });

                        }
                    });
                };

                //LISTADO DE OPCIONES POR MENSAJE
                let menuOpcionesMensaje = $("<ul></ul>").addClass("menuOpcionesMensaje");

                //OPCION DE ELIMINAR MENSAJE
                let opcionEliminaMensaje = $("<li></li>").addClass("opcionMensaje");
                opcionEliminaMensaje.text("Eliminar para todos");
                opcionEliminaMensaje.click(() => {
                    eliminaMensaje(0);
                });
                menuOpcionesMensaje.append(opcionEliminaMensaje);

                //OPCION PARA ELIMINAR MENSAJE SOLO PARA MI
                let opcionEliminaMensajeMi = $("<li></li>").addClass("opcionMensaje");
                opcionEliminaMensajeMi.text("Eliminar para mi");
                opcionEliminaMensajeMi.click(() => {
                    eliminaMensaje(1);
                });
                menuOpcionesMensaje.append(opcionEliminaMensajeMi);
                
                //OPCION PARA REENVIAR EL MENSAJE
                let opcionReenviaMensaje = $("<li></li>").addClass("optionMensaje");
                opcionReenviaMensaje.text("Reenviar mensaje");
                opcionReenviaMensaje.click(() => {
                    
                    reenviaMensaje(mensaje);
                    
                });
                menuOpcionesMensaje.append(opcionReenviaMensaje);

                //OPCION PARA EDITAR EL MENSAJE
                let opcionEditaMensaje = $("<li></li>").addClass("optionMensaje");
                opcionEditaMensaje.text("Editar mensaje");
                opcionEditaMensaje.click(() => {
                    console.log("Editando..");
                });
                menuOpcionesMensaje.append(opcionEditaMensaje);

                //OPCION PARA RESPONDER UN MENSAJE
                let opcionRespondeMensaje = $("<li></li>").addClass("opcionMensaje");
                opcionRespondeMensaje.text("Responder mensaje");
                opcionRespondeMensaje.click(() => {
                    console.log("Respondiendo...");
                });
                menuOpcionesMensaje.append(opcionRespondeMensaje);

                message.append(menuOpcionesMensaje);

                message.mouseenter(() => {
                    iconOpciones.css({"display": "block"});
                }).mouseleave(() => {
                    iconOpciones.css({"display": "none"});
                });

                iconOpciones.click(() => {
                    console.log("despliega menu");
                    menuOpcionesMensaje.toggleClass("conAltura");
                    //menuOpcionesMensaje.css({"height":"auto"});
                });
            }

        }



        if (viejo) {
            $("#contact_messaging" + id).prepend(li);
        } else {
            $("#contact_messaging" + id).append(li);

            document.querySelector("#messages_" + id + " li.limessage:last-child").scrollIntoView();

            //$("#messages_"+id).animate({scrollTop: $(document).height()+1000000}, 0);
            $("#preview_" + id).text(previewMesagge);
            $("#message_contacts").prepend(document.getElementById("profile_chat" + id));
        }

    }
}
//traer el directorio 
RequestPOST("/API/ConsultarDirectorio", {
    "fecha": getFecha(),
    "hora": getHora(),
    "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
    "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
//    "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area,
    "tipo_area": "0"
}).then((response) => {
    let directorio = response.directorio;

    for (var i = 0; i < directorio.length; i++)
        if (directorio[i].id360 === sesion_cookie.id_usuario)
            directorio.splice(i, 1);


    new Vue({
        el: "#app",
        data() {
            return {
                value: [],
                options: directorio
            };
        },
        methods: {
            customLabel(option) {
                return option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno + " ";
            },
            onClosed(value) {
                //console.log(value);
            },

            onTag(value) {
                //console.log(value);
            },

            onRemove(value) {
                //console.log(value);
            },

            onInput(value) {
                console.log(value);
                array_llamar = value;
            }
        }
    });
    new Vue({
        el: "#buscarContactos",
        data() {
            return {
                value: [],
                options: directorio
            };
        },
        methods: {
            customLabel(option) {
                return option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno + " ";
            },
            onClosed(value) {
                //console.log(value);

            },

            onTag(value) {
                //console.log(value);
            },

            onRemove(value) {
                //console.log(value);
            },

            onInput(value) {
                console.log(value);
                if ($("#profile_chat" + value.id360).length) {
                    $("#profile_chat" + value.id360 + " .btn-enviarMensajeChat").click();
                } else {
                    contacto_chat(value);
                    $("#profile_chat" + value.id360 + " .btn-enviarMensajeChat").click();
                }
            }
        }
    });

    /*
     * Consultar solamente los usuarios con los que se tiene un chat
     */
    RequestPOST("/API/empresas360/usuarios_con_chat", {id360: sesion_cookie.idUsuario_Sys}).then((response) => {

        let cantidadDirectorio = directorio.length;

        let fueraDeDirectorio = [];

        $.each(response, (index, contacto) => {

            CantidadMensajesPorChat[contacto.id360chat] = {
                cantidad: parseInt(contacto.cantidadMensajes) - 20
            };
            let encontrado = false;
            for (let i = 0; i < cantidadDirectorio; i++)
                if (directorio[i].id360 === contacto.id360chat) {
                    encontrado = true;
                    contacto_chat(directorio[i]);
                    break;
                }

            if (!encontrado)
                fueraDeDirectorio.push({"id360": contacto.id360chat});

        });

        const cargaBackUp = () => {
            RequestPOST("/API/empresas360/backup_chat", {
                id360: sesion_cookie.id_usuario
            }).then((response) => {
                for (var i = 0; i < response.length; i++) {
                    if (response[i].id360 === sesion_cookie.id_usuario) {
                        agregar_chat_enviado(response[i], false);
                    } else {
                        recibir_chat(response[i], false);
                    }
                    //$(".messages").animate({scrollTop: $(document).height()+100000}, "fast");
                }
                //$(".messages").animate({scrollTop: $(document).height()+100000}, "fast");
                NotificacionesActivadas = true;
            });
        };

        if (fueraDeDirectorio.length > 0) {
            RequestPOST("/API/empresas360/directorio/un_usuario", fueraDeDirectorio).then((response) => {
                $.each(response, function (index, empleado) {
                    if (empleado.success) {
                        directorio.push(empleado);
                        directorio_completo.push(empleado);
                        contacto_chat(empleado);
                    }
                });
                cargaBackUp();
            });

        } else
            cargaBackUp();

    });


});

const cargaMasMensajes = (id360) => {

    let init, limit;

    init = (CantidadMensajesPorChat[id360].cantidad - 20) < 0 ? 0 : CantidadMensajesPorChat[id360].cantidad - 20;
    limit = (CantidadMensajesPorChat[id360].cantidad - 20) < 0 ? CantidadMensajesPorChat[id360].cantidad : 20;

    let dataMasMensajes = {
        "id360-1": id360,
        "id360-2": sesion_cookie.idUsuario_Sys,
        "init": init,
        "limit": limit
    };

    RequestPOST("/API/empresas360/carga_mas_mensajes_chat", dataMasMensajes).then((response) => {

        $('#messages_' + id360).animate({

            scrollTop: 500

        }, 0, "swing", () => {

            CantidadMensajesPorChat[id360].cantidad -= 20;
            NotificacionesActivadas = false;
            if (response.length === 1) {
                if (response[0].id360 === sesion_cookie.id_usuario) {
                    agregar_chat_enviado(response[0], true);
                } else {

                    recibir_chat(response[0], true);
                }
            } else {
                for (var i = response.length - 1; i >= 0; i--) {
                    if (response[i].id360 === sesion_cookie.id_usuario) {
                        agregar_chat_enviado(response[i], true);
                    } else {
                        recibir_chat(response[i], true);
                    }
                }
            }
            NotificacionesActivadas = true;

            let liCargaMensajesAnterior = $("#contact_messaging" + id360).find(".liMasMensajes");

            document.querySelector("#contact_messaging" + id360 + " .liMasMensajes").scrollIntoView();
            liCargaMensajesAnterior.remove();

            if (CantidadMensajesPorChat[id360].cantidad > 0) {
                let liMasMensajes = $("<li></li>").addClass("liMasMensajes");
                let spanMasMensajes = $("<span></span>").addClass("spanMasMensajes");
                let iconManMensajes = $("<li></li>").addClass("fas fa-spinner iconMasMensajes");
                spanMasMensajes.text("Más mensajes...");
                spanMasMensajes.prepend(iconManMensajes);
                spanMasMensajes.data("id360-1", id360);
                spanMasMensajes.data("id360-2", sesion_cookie.idUsuario_Sys);
                liMasMensajes.append(spanMasMensajes);
                $("#contact_messaging" + id360).prepend(liMasMensajes);

                /*
                 * EVENTO CLICK PARA CARGAR MáS MENSAJES
                 */

                spanMasMensajes.click(() => {
                    cargaMasMensajes(id360);
                });

            }

        });

    });
};

function removeDragData(ev) {

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to remove the drag data
    ev.dataTransfer.items.clear();
  } else {
    // Use DataTransfer interface to remove the drag data
    ev.dataTransfer.clearData();
  }
  
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  console.log('Fichero(s) arrastrados');

  // Evitar el comportamiendo por defecto (Evitar que el fichero se abra/ejecute)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Usar la interfaz DataTransferItemList para acceder a el/los archivos)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // Si los elementos arrastrados no son ficheros, rechazarlos
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
        console.log("1");
        console.log(file);
      }
    }
  } else {
    // Usar la interfaz DataTransfer para acceder a el/los archivos
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log("2");
        console.log(file);
    }
  }

  // Pasar el evento a removeDragData para limpiar
  removeDragData(ev);
}

function contacto_chat(user, group) {

    if (!$("#profile_chat" + user.id360).length && user.id360 !== undefined) {

        let li = $("<li></li>").addClass("contact");
        li.attr("id", "profile_chat" + user.id360);
        let div = $("<div></div>").addClass("wrap");
        let span = $("<span></span>").addClass("contact-status");
        span.addClass("online");
        let img = $("<div></div>");
        img.addClass("img");
        img.css({
            "background": "url('" + user.img + "')",
            "background-size": "cover",
            "background-position": "center",
            "background-repeat": "no-repeat"
        });
        let meta = $("<div></div>").addClass("meta");
        let name = $("<p></p>").addClass("name");
        if(group)
            name.text(user.nombre_grupo);
        else
            name.text(user.nombre + " " + user.apellido_paterno + " " + user.apellido_materno);
        let preview = $("<p></p>").addClass("preview");
        preview.attr("id", "preview_" + user.id360);
        meta.append(name);
        meta.append(preview);

        let social_media = $("<div></div>").addClass("social-media");
        
        let div_search = $("<div></div>");
        div_search.css({"display":"contents"});
        let icon_search = $("<i class=\"fas fa-search\"></i>");
        icon_search.css({
            "background": "#fff",
            "padding": "17px",
            "font-size": "60px",
            "width": "50px",
            "cursor": "pointer",
            "color":"rgb(64, 71, 79)"
        });
        
        let div_menu_chat = $("<div></div>");
        div_menu_chat.css({"display":"contents","position":"relative"});
        let icon_menu_chat = $("<i class=\"fas fa-ellipsis-h\"></i>");
        icon_menu_chat.css({
            "background": "#40474f",
            "padding": "17px",
            "font-size": "60px",
            "width": "50px",
            "cursor": "pointer"
        });
        
        let menu_chat = $("<ul></ul>");
        menu_chat.addClass("menu_chat");
        
        let opcionIniciarLlamada = $("<li></li>").addClass("opcion_menu_chat");
        opcionIniciarLlamada.text("Iniciar llamada");
        let iconOpcionIniciarLlamada = $("<i class=\"fas fa-phone\"></i>");
        iconOpcionIniciarLlamada.css({"margin-right":"10px"});
        opcionIniciarLlamada.prepend(iconOpcionIniciarLlamada);
        menu_chat.append(opcionIniciarLlamada);
        
        let opcionVaciarChat = $("<li></li>").addClass("opcion_menu_chat");
        opcionVaciarChat.text("Vaciar chat");
        let iconVaciarChat = $("<i class=\"fas fa-trash\"></i>");
        iconVaciarChat.css({"margin-right":"10px"});
        opcionVaciarChat.prepend(iconVaciarChat);
        menu_chat.append(opcionVaciarChat);
        
        div_menu_chat.append(menu_chat);
        
        /*
         * CONTROLES PARA LLAMADA Y MENSAJES
         */
        let divControlesChat = $("<div></div>").addClass("controlesChat");

        let buttonEnviarMensaje = $("<button></button>");
        buttonEnviarMensaje.addClass("btn btn-enviarMensajeChat");
        buttonEnviarMensaje.html('<i class="fas fa-comment-dots"></i>');

        let buttonRealizarLlamadaChat = $("<button></button>");
        buttonRealizarLlamadaChat.addClass("btn btn-realizarLlamadaChat");
        buttonRealizarLlamadaChat.html('<i class="fas fa-phone"></i>');

        divControlesChat.append(buttonEnviarMensaje);
        divControlesChat.append(buttonRealizarLlamadaChat);

        meta.append(divControlesChat);

        div.append(span);
        div.append(img);
        div.append(meta);

        li.append(div);

        $("#message_contacts").prepend(li);

        let content = $("<div></div>").addClass("content");
        content.addClass("d-none");
        let contact_profile = $("<div></div>").addClass("contact-profile");
        let img_profile = $("<div></div>").addClass("img");
        img_profile.css({
            "background": "url('" + user.img + "')",
            "background-size": "cover",
            "background-position": "center",
            "background-repeat": "no-repeat"
        });
        let nombre = $("<p></p>");
        if(group)
            nombre.text(user.nombre_grupo);
        else
            nombre.text(user.nombre + " " + user.apellido_paterno + " " + user.apellido_materno);

        let messages = $("<div></div>").addClass("messages");
        messages.attr("id", "messages_" + user.id360);
        messages.attr("ondragover","allowDrop(event)");
        messages.attr("ondrop","drop(event)");
        let ul = $("<ul></ul>").addClass("p-0");
        //    ul.id = "contact_messaging" + user.id360;
        ul.attr("id", "contact_messaging" + user.id360);

        /*
         * CARGA MAS MENSAJES
         */

        if (CantidadMensajesPorChat[user.id360] !== undefined && CantidadMensajesPorChat[user.id360].cantidad > 0) {
            let liMasMensajes = $("<li></li>").addClass("liMasMensajes");
            let spanMasMensajes = $("<span></span>").addClass("spanMasMensajes");
            let iconManMensajes = $("<li></li>").addClass("fas fa-spinner iconMasMensajes");
            spanMasMensajes.text("Más mensajes...");
            spanMasMensajes.prepend(iconManMensajes);
            spanMasMensajes.data("id360-1", user.id360);
            spanMasMensajes.data("id360-2", sesion_cookie.idUsuario_Sys);
            liMasMensajes.append(spanMasMensajes);
            ul.append(liMasMensajes);

            /*
             * EVENTO CLICK PARA CARGAR MáS MENSAJES
             */

            spanMasMensajes.click(() => {
                cargaMasMensajes(user.id360);
            });

        }

        //    let div = $("<div></div>").addClass("wrap")
        let message_input = $("<div></div>").addClass("message-input");
        let wrap = $("<div></div>").addClass("wrap container-fluid");
        let input = $("<input>").addClass("wrap");
        input.attr("id", "message_input_" + user.id360);
        input.attr("type", "text");
        input.attr("placeholder", "Escribe un mensaje aqui....");
        input.attr("maxlength", "400");

        let divCargando = $("<div></div>").addClass("contenedor-cargando-chat d-none");
        let spinCargando = $("<div></div>").addClass("spin-cargando-chat");
        let spin = $("<img>").attr("src", PathRecursos + "images/spin.gif");

        spinCargando.append(spin);
        divCargando.append(spinCargando);
        message_input.append(divCargando);

        /*
         * 
         * @type jQuery
         * DESARROLLO PARA CHAT EMPRESARIAL, EN DONDE SE SOPORTEN MENSAJED DE TEXTO Y ARCHIVOS ADJUNTO DE CUALQUIER CLASE
         * 
         */

        /* BOTON ENVIAR MENSAJE */
        let button = $("<button></button>").addClass("submit btn btn-block");
        button.attr("id", "btn_enviar");
        let paper_plane = $("<i class=\"fa fa-paper-plane\" aria-hidden=\"true\"></i>").addClass("wrap");
        button.append(paper_plane);

        /* BOTON ADJUNTO */
        let buttonAttachment = $("<button></button>").addClass("btn btn-block");
        let paperclip = $(" <i class=\"fa fa-paperclip\" aria-hidden=\"true\"></i>").addClass("wrap");
        buttonAttachment.attr("type", "button");
        buttonAttachment.attr("id", "btn-adjunto");
        buttonAttachment.append(paperclip);
        buttonAttachment.css({"background-color": "grey"});

        /* CONTROLES CHAT */
        let containerChat = $("<div class=\"contenedor-chat-controles\"></div>");
        let rowChat = $("<div style=\"padding:0 !important;\" class=\"row\"></div>");

        let colInput = $("<div style=\"padding:0 !important;\" class=\"col-10\"></div>");
        colInput.append(input);

        let colButtonAttachment = $("<div style=\"padding:0 !important;\" class=\"col-1\"></div>");
        colButtonAttachment.append(buttonAttachment);

        let colButtonSubmit = $("<div style=\"padding:0 !important;\" class=\"col-1\"></div>");
        colButtonSubmit.append(button);

        /*Input attachment */
        let inputAttachment = $("<input />");
        inputAttachment.attr("id", "inputAttachment" + user.id360);
        inputAttachment.attr("class", "d-none");
        inputAttachment.attr("type", "file");
        inputAttachment.attr("name", "attachment");

        /* Controles preview*/
        let rowPreview = $("<div></div>").addClass("row").attr("id", "rowPreview").css({"display": "none"});
        let columPreview = $("<div></div>").addClass("col-12");
        columPreview.css({
            "background-color": "white",
            "padding": "0"
        });
        let containerPreview = $("<div></div>").attr("id", "preview-attachment");
        columPreview.append(containerPreview);
        rowPreview.append(columPreview);

        let rowButtonAttachment = $("<div></div>").addClass("row").css({"display": "none"});

        let columnButtonCancel = $("<div></div>").addClass("col-6").css({"padding": "0"});
        let buttonCancelAttachment = $("<button>Cancelar</button>").attr("type", "buttton").addClass("btn btn-block").css({"background-color": "grey"});
        columnButtonCancel.append(buttonCancelAttachment);

        let columnButtonSendAttachment = $("<div></div>").addClass("col-6").css({"padding": "0"});
        let buttonSendAttachment = $("<button>Enviar</button>").attr("type", "button").addClass("btn btn-block").attr("id", "sendAttachment");
        columnButtonSendAttachment.append(buttonSendAttachment);

        rowButtonAttachment.append(columnButtonCancel);
        rowButtonAttachment.append(columnButtonSendAttachment);

        let rowNameFile = $("<div></div>").addClass("row").css({"display": "none"});
        let colName = $("<div></div>").addClass("col-12").css({"padding": "0"});
        let nameFile = $("<p></p>").attr("id", "nombreArchivoPreview");
        nameFile.css({
            "margin": "0",
            "background-color": "white",
            "color": "black",
            "font-size": "1.3rem",
            "padding": "0 0 20px 0"
        });
        colName.append(nameFile);
        rowNameFile.append(colName);

        rowChat.append(colInput);
        rowChat.append(colButtonAttachment);
        rowChat.append(colButtonSubmit);

        rowChat.append(inputAttachment);

        containerChat.append(rowPreview);
        containerChat.append(rowNameFile);
        containerChat.append(rowButtonAttachment);
        containerChat.append(rowChat);

        wrap.append(containerChat);

        message_input.append(wrap);
        messages.append(ul);
        
        div_menu_chat.click(() => {
            menu_chat.toggleClass("desplegado");
        });

        div_search.append(icon_search);
        div_menu_chat.append(icon_menu_chat);
        social_media.append(div_search);
        social_media.append(div_menu_chat);

        contact_profile.append(img_profile);
        contact_profile.append(nombre);
        contact_profile.append(social_media);
        content.append(contact_profile);
        content.append(messages);
        content.append(message_input);


        $("#content_messaging").append(content);

        button.click(() => {
            send_chat_messages(input, ul, preview, user, messages);
        });

        buttonAttachment.click(() => {
            inputAttachment.click();
        });


        inputAttachment.change((e) => {

            let reader = new FileReader();

            reader.readAsDataURL(e.target.files[0]);

            reader.onload = function () {

                let nombreAdjunto = inputAttachment.val();
                let partesNombreAdjunto = nombreAdjunto.split(".");
                let extension = partesNombreAdjunto[partesNombreAdjunto.length - 1];

                let partesPorDiagonal = nombreAdjunto.split("\\");
                let nombreCorto = partesPorDiagonal[partesPorDiagonal.length - 1];


                let imagenPreview = $("<img>").css({"max-height": "200px"}).attr("src", PathRecursos + "images/icono_default.png");
                rowNameFile.css({"display": "block"});
                nameFile.text(nombreCorto);
                let tipo = "others";

                switch (extension) {

                    case "jpg":
                    case "png":
                    case "jpeg":
                    case "gif":
                        imagenPreview.attr("src", reader.result);
                        imagenPreview.attr("target", "_blanck");
                        tipo = 'images';
                        break;

                    case "docx":
                    case "docm":
                    case "dotx":
                    case "dotm":
                    case "doc":
                        imagenPreview.attr("src", PathRecursos + "images/icono_word.png");
                        tipo = 'docs/word';
                        break;

                    case "xlsx":
                    case "xlsm":
                    case "xlsb":
                    case "xltx":
                    case "xltm":
                    case "xls":
                    case "xlt":
                        imagenPreview.attr("src", PathRecursos + "images/icono_excel.png");
                        tipo = 'docs/excel';
                        break;

                    case "pptx":
                    case "pptm":
                    case "ppt":
                    case "xps":
                    case "potx":
                    case "ppsx":
                        imagenPreview.attr("src", PathRecursos + "images/icono_powerpoint.png");
                        tipo = 'docs/powerpoint';
                        break;

                    case "pdf":
                        imagenPreview.attr("src", PathRecursos + "images/icono_pdf.png");
                        tipo = 'docs/pdf';
                        break;

                    case "txt":
                        tipo = 'docs/txt';
                        break;

                }

                inputAttachment.data("extension", extension);
                inputAttachment.data("nombreCorto", nombreCorto);
                inputAttachment.data("tipo", tipo);

                //let img = $("<img>").attr("src",reader.result).css({"max-height":"200px"});

                containerPreview.empty().append(imagenPreview);
                rowChat.hide("fast", () => {
                    rowPreview.show("fast");
                    rowButtonAttachment.show("fast");
                });

            };

        });

        buttonCancelAttachment.click(() => {
            cierraAttachment();
        });

        const cierraAttachment = () => {
            inputAttachment.val(null);
            rowPreview.hide("fast");
            rowButtonAttachment.hide("fast");
            rowNameFile.hide("fast");
            rowChat.show("fast");
        };

        buttonSendAttachment.click(() => {
            //guarda_adjunto(inputAttachment.attr("id"));
            divCargando.removeClass("d-none");
            guarda_adjunto_chat(inputAttachment.attr("id"), user.id360).then((response) => {

                divCargando.addClass("d-none");
                cierraAttachment();
                send_chat_messages(input, ul, preview, user, messages, response);

            });

        });

        const guarda_adjunto_chat = (id, to) => {
            return new Promise((resolve, reject) => {

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


                $("#guardando_documentacion").removeClass("d-none");
                var params = {
                    Bucket: BucketName,
                    Prefix: 'Logotipos'
                };
                s3.listObjects(params, function (err, data) {
                    if (err) {

                        swal.fire({
                            text: "Error de conexión con el servidor."
                        });
                    } else {

                        numFiles = data.Contents.length;

                        var attachment = document.getElementById(id);

                        var files = attachment.files; // FileList object

                        var uploadFiles = files;
                        var upFile = files[0];
                        if (upFile) {

                            /*
                             * 
                             * @type RUTA PARA EL GUARDADO
                             */
                            let extension = $("#inputAttachment" + to).data("tipo");
                            let ruta = sesion_cookie.id_usuario + "_to_" + to + '/' + extension;

                            var bucket = new AWS.S3({params: {Bucket: BucketName + "/attachmentsChats/" + ruta}});
                            for (var i = 0; i < uploadFiles.length; i++) {
                                upFile = uploadFiles[i];
                                var params = {
                                    Body: upFile,
                                    Key: numFiles + "_" + upFile.name,
                                    ContentType: upFile.type
                                };
                                bucket.upload(params).on('httpUploadProgress', function (evt) {


                                }).send(function (err, data) {
                                    if (err) {

                                        swal.fire({
                                            text: "Error al subir la imagen al servidor."
                                        });
                                    }

                                    console.log(data.Location);
                                    $("#guardando_documentacion").addClass("d-none");
                                    resolve(data.Location);

                                });
                            }
                        } else {
                            alert("Seleccione un archivo para subir al bucket");
                        }
                    }
                });

            });
        };

        ul.on("drop", function (event) {
            event.preventDefault();
            event.stopPropagation();
            console.log(event);
        });

        input.on('keydown', function (e) {
            if (e.which == 13) {
                send_chat_messages(input, ul, preview, user, messages);
                return false;
            }
        });

        buttonEnviarMensaje.click(() => {
            clickVerMensaje();
        });

        li.click(() => {
            clickVerMensaje();
        });

        const clickVerMensaje = () => {
            $(".content").addClass("d-none");
            content.removeClass("d-none");
            $(".messages").animate({scrollTop: $(document).height() + 100000}, "fast");
            $("#message_input_" + user.id360).focus();
        };

        li.mouseenter(() => {
            divControlesChat.css({"display": "block"});
        }).mouseleave(() => {
            divControlesChat.css({"display": "none"});
        });

        buttonRealizarLlamadaChat.click(() => {
            clickIniciarLlamada();
        });

        opcionIniciarLlamada.click(() => {
            clickIniciarLlamada();
        });

        const clickIniciarLlamada = () => {
            
            let nombreLlamada;
            if(group)
                nombreLlamada = user.nombre_grupo;
            else
                nombreLlamada = user.nombre + " " + user.apellido_paterno + " " + user.apellido_materno;
            
            Swal.fire({
                text: "Iniciar una llamada con: " + nombreLlamada,
                showCancelButton: true,
                focusConfirm: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: '<i style="margin-right: 5px;" class="fas fa-phone-volume"></i>Continuar',
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    let id360 = {
                        id360: sesion_cookie.id_usuario
                    };
                    let to_id360 = new Array();
                    to_id360.push({
                        id360: user.id360
                    });
                    id360.to_id360 = to_id360;
                    //console.log(id360);
                    //initCall();  
                    RequestPOST("/API/notificacion/llamada360", id360).then((msj) => {
                        dataLlamada = msj;

                        Swal.fire({
                            text: '¿Cómo quieres continuar la llamada? (Selecciona ventana externa.)',
                            showCancelButton: true,
                            confirmButtonText: `Ventana externa`,
                            cancelButtonText: `Aquí mismo.`
                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            console.log("Presionado " + result.isConfirmed);
                            console.log(result);
                            if (result.value) {
                                console.log("Externa");
                                window.open('https://empresas.claro360.com/plataforma360/Llamada/' + msj.registro_llamada.idLlamada + '/' + msj.credenciales.apikey + '/' + msj.credenciales.idsesion + '/' + msj.credenciales.token + '', '_blank');
                            } else {
                                console.log("Aquí mismo");
                                console.log(result);
                                $("#menu_section_Comunicación").click();
                                initCall();
                            }
                        });

                    });
                }
            });
        };
        
        opcionVaciarChat.click(() => {
            swalConfirmDialog("¿Vaciar chat?","Vaciar","Cancelar").then((response) => {
                if(response){
                    let dataChat = {
                        "idUser": sesion_cookie.idUsuario_Sys,
                        "idContact": user.id360
                    };
                    
                    RequestPOST("/API/empresas360/vaciarChat", dataChat).then((response) => {
                        if(response){
                            ul.empty();
                            preview.text("");
                        }
                    });
                    
                }
            });
        });
    }

}

function send_chat_messages(input, ul, preview, user, messages, rutaAdjunto) {
    let mensaje = input.val();

    if (rutaAdjunto !== undefined && rutaAdjunto !== null && rutaAdjunto !== "")
        mensaje = rutaAdjunto;

    if ($.trim(mensaje) === '') {
        return false;
    } else {
        let json = {
            "id360": sesion_cookie.id_usuario,
            "to_id360": user.id360,
            "fecha": getFecha(),
            "hora": getHora(),
            "message": mensaje,
            "type": "text",
            "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
            "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
            "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area
        };

        if (rutaAdjunto !== undefined && rutaAdjunto !== null && rutaAdjunto !== "")
            json.type = $("#inputAttachment" + user.id360).data("extension");

        RequestPOST("/API/empresas360/chat", json).then((response) => {
            if (response.success) {
                let idMensaje = response.id;
//                let li = $("<li></li>").addClass("sent");
                let li = $("<li></li>").addClass("replies");
                li.attr("id", "mensaje_" + idMensaje);
                li.addClass("limessage");
                let img_message = $("<div></div>").addClass("img");
                img_message.css({
                    "background": "url('" + perfil.img + "')",
                    "background-size": "cover",
                    "background-position": "center",
                    "background-repeat": "no-repeat"
                });
                let message = $("<p></p>");

                if (rutaAdjunto !== undefined && rutaAdjunto !== null && rutaAdjunto !== "") {

                    let extension = $("#inputAttachment" + user.id360).data("extension");
                    let nombreCorto = $("#inputAttachment" + user.id360).data("nombreCorto");
                    let imagenPreview = $("<img>").css({"max-width": "125px", "max-height": "75px", "margin-bottom": "10px"}).attr("src", PathRecursos + "images/icono_default.png");

                    let saltoLinea = $("<br>");
                    let nombreAdjunto = $("<span></span>").css({"font-size": "1.1rem"});
                    nombreAdjunto.text(nombreCorto + " ");

                    let buttonDownloadAttachment = $("<a></a>").addClass("btn btn-light").css({"margin-left": "10px"});
                    buttonDownloadAttachment.attr("href", rutaAdjunto);
                    buttonDownloadAttachment.attr("download", nombreCorto);
                    buttonDownloadAttachment.html('<i class="fas fa-download"></i>');

                    nombreAdjunto.append(buttonDownloadAttachment);

                    mensaje = nombreCorto;

                    switch (extension) {

                        case "jpg":
                        case "png":
                        case "jpeg":
                        case "gif":
                            imagenPreview.attr("src", rutaAdjunto);
                            break;

                        case "docx":
                        case "docm":
                        case "dotx":
                        case "dotm":
                        case "doc":
                            imagenPreview.attr("src", PathRecursos + "images/icono_word.png");
                            break;

                        case "xlsx":
                        case "xlsm":
                        case "xlsb":
                        case "xltx":
                        case "xltm":
                        case "xls":
                        case "xlt":
                            imagenPreview.attr("src", PathRecursos + "images/icono_excel.png");
                            break;

                        case "pptx":
                        case "pptm":
                        case "ppt":
                        case "xps":
                        case "potx":
                        case "ppsx":
                            imagenPreview.attr("src", PathRecursos + "images/icono_powerpoint.png");
                            break;

                        case "pdf":
                            imagenPreview.attr("src", PathRecursos + "images/icono_pdf.png");
                            break;

                    }

                    message.empty().append(imagenPreview);
                    message.append(saltoLinea);
                    
                    
                    if (!(extension === "jpg" || extension === "png" || extension === "jpeg" || extension === "gif")) {
                        message.append(nombreAdjunto);
                    } else {
                        imagenPreview.css({"cursor": "pointer", "max-width": "250px","max-height":"250px"});
                        
                        let imagenPreviewCopy = $("<img>");
                        imagenPreviewCopy.attr("src", mensaje);
                        imagenPreviewCopy.css({
                            "max-width": "650px",
                            "max-height":"650px"
                        });
                        
                        imagenPreview.click(() => {
                            Swal.fire({
                                width: 700,
                                showCancelButton: false,
                                showConfirmButton: false,
                                html: imagenPreviewCopy
                            });
                        });
                    }

                } else {

                    if (mensaje.slice(0, 7) === "http://" || mensaje.slice(0, 8) === "https://" || mensaje.slice(0, 4) === "www.") {
                        let linkMensaje = $("<a>");
                        linkMensaje.text(mensaje);
                        linkMensaje.attr("href", mensaje);
                        linkMensaje.attr("tarjet", "_blanck");
                        message.html(linkMensaje);
                        
                        message.css({
                            "word-break": "break-all"
                        });
                        
                    } else {
                        message.text(mensaje);
                    }

                }

                let fecha = $("<span></span>").addClass("time");

                let fechaDate = new Date();
                let fechaCorta = fechaDate.getDate() + "/" + (fechaDate.getMonth() + 1) + "/" + fechaDate.getFullYear();

                let horaEnvio = fechaDate.getHours() + ":" + fechaDate.getMinutes() + ":" + fechaDate.getSeconds();

                fecha.text(fechaCorta + "-" + horaEnvio);
                let iconClock = $("<li></li>").addClass("far fa-clock ml-2");
                fecha.append(iconClock);
                message.append(fecha);

                let iconOpciones = $("<span></span>").addClass("iconOpciones");
                let iconDespliegaMenu = $('<i class="fas fa-chevron-down"></i>');
                iconOpciones.append(iconDespliegaMenu);
                message.append(iconOpciones);

                const eliminaMensaje = (tipo) => {
                    //PEDIR CONFIRMACION DE ELIMINAR
                    swalConfirmDialog("¿Eliminar mensaje?", "Eliminar", "Cancelar").then((response) => {
                        if (response) {
                            //PROCESO DE ELIMINACION
                            let dataMensaje = {
                                "idMensaje": idMensaje
                            };
                            
                            let services;
                            
                            if(tipo === 0){
                                services = "/API/empresas360/eliminaMensaje";
                                dataMensaje.id360 = sesion_cookie.idUsuario_Sys;
                                dataMensaje.to_id360 = user.id360;
                            }else{
                                services = "/API/empresas360/eliminaMensajeParaMi";
                                dataMensaje.idUser = sesion_cookie.idUsuario_Sys;
                            }

                            RequestPOST(services, dataMensaje).then((response) => {
                                if (response.success) {
                                    menuOpcionesMensaje.removeClass("conAltura");
                                    if(tipo === 0){
                                        message.empty();
                                        message.text("Mensaje eliminado");
                                        let iconMensajeEliminado = $("<i></i>").addClass("fas fa-comment-slash");
                                        iconMensajeEliminado.css({"margin-right": "10px"});
                                        message.prepend(iconMensajeEliminado);
                                        message.css({
                                            "background-color": "transparent",
                                            "font-style": "italic",
                                            "font-size": "1.1rem"
                                        });
                                    }else{
                                        li.remove();
                                    }
                                }
                            });

                        }
                    });
                };

                //LISTADO DE OPCIONES POR MENSAJE
                let menuOpcionesMensaje = $("<ul></ul>").addClass("menuOpcionesMensaje");

                //OPCION DE ELIMINAR MENSAJE
                let opcionEliminaMensaje = $("<li></li>").addClass("opcionMensaje");
                opcionEliminaMensaje.text("Eliminar para todos");
                opcionEliminaMensaje.click(() => {
                    eliminaMensaje(0);
                });
                menuOpcionesMensaje.append(opcionEliminaMensaje);

                //OPCION PARA ELIMINAR MENSAJE SOLO PARA MI
                let opcionEliminaMensajeMi = $("<li></li>").addClass("opcionMensaje");
                opcionEliminaMensajeMi.text("Eliminar para mi");
                opcionEliminaMensajeMi.click(() => {
                    eliminaMensaje(1);
                });
                menuOpcionesMensaje.append(opcionEliminaMensajeMi);

                //OPCION PARA EDITAR EL MENSAJE
                let opcionEditaMensaje = $("<li></li>").addClass("opcionMensaje");
                opcionEditaMensaje.text("Editar mensaje");
                opcionEditaMensaje.click(() => {
                    console.log("Editando..");
                });
                menuOpcionesMensaje.append(opcionEditaMensaje);

                //OPCION PARA RESPONDER UN MENSAJE
                let opcionRespondeMensaje = $("<li></li>").addClass("opcionMensaje");
                opcionRespondeMensaje.text("Responder mensaje");
                opcionRespondeMensaje.click(() => {
                    console.log("Respondiendo...");
                });
                menuOpcionesMensaje.append(opcionRespondeMensaje);

                message.append(menuOpcionesMensaje);

                message.mouseenter(() => {
                    iconOpciones.css({"display": "block"});
                }).mouseleave(() => {
                    iconOpciones.css({"display": "none"});
                });

                iconOpciones.click(() => {
                    console.log("despliega menu");
                    menuOpcionesMensaje.toggleClass("conAltura");
                    //menuOpcionesMensaje.css({"height":"auto"});
                });

                li.append(img_message);
                li.append(message);
                ul.append(li);
                input.val("");
                preview.text("Yo: " + mensaje);
                $("#message_contacts").prepend(document.getElementById("profile_chat" + user.id360));
                document.querySelector("#messages_" + user.id360 + " li.limessage:last-child").scrollIntoView();

            }
        });
    }

}

/*
 div class="contact-profile">
 <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="">
 <p>Harvey Specter</p>
 <div class="social-media">
 i
 </div>
 </div>
 <div class="messages">
 <ul  class="p-0">
 <li class="sent">
 <img src="http://emilcarlsson.se/assets/mikeross.png" alt="">
 <p>How the hell am I supposed to get a jury to believe you when I am not even sure that I do?!</p>
 </li>
 <li class="replies">
 <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="">
 <p>When you're backed against the wall, break the god damn thing down.</p>
 </li>
 </ul>
 </div>
 <div class="message-input">
 <div class="wrap">
 <input type="text" placeholder="Write your message...">
 <i class="fa fa-paperclip attachment" aria-hidden="true"></i>
 <button class="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
 </div>
 </div>
 */

$("#iniciar_llamada").click(() => {
    console.log(array_llamar);
    let id360 = {
        id360: sesion_cookie.id_usuario
    };
    let to_id360 = new Array();
    for (var i = 0; i < array_llamar.length; i++) {
        to_id360.push({
            id360: array_llamar[i].id360
        });
    }
    id360.to_id360 = to_id360;
    console.log(id360);
    RequestPOST("/API/notificacion/llamada360", id360).then((mensaje) => {
        console.log(mensaje);
        window.open('https://empresas.claro360.com/plataforma360/Llamada/' + mensaje.registro_llamada.idLlamada + '/' + mensaje.credenciales.apikey + '/' + mensaje.credenciales.idsesion + '/' + mensaje.credenciales.token + '', '_blank');

    });
});

$("#profile-img").click(function () {
    $("#status-options").toggleClass("active");
});



$("#status-options ul li").click(function () {
    $("#profile-img").removeClass();
    $("#status-online").removeClass("active");
    $("#status-away").removeClass("active");
    $("#status-busy").removeClass("active");
    $("#status-offline").removeClass("active");
    $(this).addClass("active");

    if ($("#status-online").hasClass("active")) {
        $("#profile-img").addClass("online");
    } else if ($("#status-away").hasClass("active")) {
        $("#profile-img").addClass("away");
    } else if ($("#status-busy").hasClass("active")) {
        $("#profile-img").addClass("busy");
    } else if ($("#status-offline").hasClass("active")) {
        $("#profile-img").addClass("offline");
    } else {
        $("#profile-img").removeClass();
    }
    ;

    $("#status-options").removeClass("active");
});

function newMessage() {
    message = $(".message-input input").val();
    if ($.trim(message) == '') {
        return false;
    }
    $('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
    $('.message-input input').val(null);
    $('.contact.active .preview').html('<span>You: </span>' + message);
}
;

$('.submit').click(function () {
    newMessage();
});

$(window).on('keydown', function (e) {
    if (e.which == 13) {
        newMessage();
        return false;
    }
});

$(".expand-button").click(function () {
    $("#profile").toggleClass("expanded");
    $("#contacts").toggleClass("expanded");
});

/*
 * 
 * DESARRLLO PARA LLAMADA
 * 
 * 
 */

const initCall = (msj) => {

    data = (msj === undefined || msj === null) ? dataLlamada : msj;
    //var sesion_cookie=JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA))

    var proyecto = DatosProyecto();

    var Directorio;
    var tel_a_agregar = new Array();

    $("#content_messaging").hide("fast", () => {

        $("#toggle div").click();

        RequestPOST("/API/ConsultarDirectorio", {
            "fecha": getFecha(),
            "hora": getHora(),
            "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
            "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
            //    "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area,
            "tipo_area": "0"
        }).then((response) => {
            dataG = response;
            initializeSession();
            Directorio = response.directorio;
            directorio();
            $("#content_call").show("fast");
        });

    });

    function initializeSession() {
        connectionCount = 0;
        var session = OT.initSession(data.credenciales.apikey, data.credenciales.idsesion);

        session.on({
            connectionCreated: function (event) {

                connectionCount++;

            },
            connectionDestroyed: function (event) {

                connectionCount--;
                if (connectionCount <= 1) {
                    session.disconnect();
                }


            },
            sessionConnected: function (event) {

            },
            sessionDisconnected: function (event) {
                //console.error('You were disconnected from the session.', event.reason);
                $("#content_call").hide("fast", () => {
                    $("#participantes").empty();
                    $("#history").empty();
                    $("#GRID").empty();
                    $("#menu_botones").remove();
                    $("#msgTxt").val("");

                    //session.unpublish(publisher);
                    //session.disconnect();
                    RegistrarDesconexionOp();
                    //menu.className = "row col-12 m-0 p-0 d-none";

                    $("#content_messaging").show("fast", () => {
                        swal.fire({text: 'Llamada finalizada'});
                        $("#toggle div").click();
                    });
                });
            },
            sessionReconnected: function (event) {

            },
            sessionReconnecting: function (event) {

            },
            streamCreated: function (event) {
                console.log("se detecta video:");
                console.log(event);
                agregarVideo(session, event.stream);
            },
            streamDestroyed: function (event) {

                mosaico("remover", sesion_cookie.idUsuario_Sys);

                console.log("Registrar desconexion?");
                console.log(event);
                //            RegistrarDesconexion(event.stream.connection.connectionId);
            },
            signal: function (event) {


                if (event.type === "signal:gps-signal") {

                    if (event.data !== undefined) {
                        var gps_data = JSON.parse(event.data);


                        var LatitudE = parseFloat(parseFloat(gps_data.lat).toFixed(7));
                        var LongitudE = parseFloat(parseFloat(gps_data.lng).toFixed(7));
                        var fechaE = gps_data.fecha;
                        var horaE = gps_data.hora;


                        var gpsjson = {
                            "idUsuarios_Movil": gps_data.idUsuario_Movil,
                            "lat": LatitudE,
                            "lng": LongitudE,
                            "fecha": fechaE,
                            "hora": horaE,
                            "ActualizaGPS": true,
                            "gpsOTS": true,
                            "motivo": "VLS"
                        };
                        EnviarMensajePorSocket(gpsjson);

                        ActivarIconMapDG(gps_data);
                        CardParticipante(gps_data);
                        RegistrarConexion(gps_data.idUsuario_Movil, event.from.connectionId);
                    }

                }
                if (event.type === "signal:msg-signal") {
                    //Sabiendo que el mensaje es de un subscriptor decodifica para saber como tratarlo 
                    if (event.from.connectionId === session.connection.connectionId) {

                        insertarMensajePropio(event.data);
                    } else {

                        insertarMensaje(event.data);
                    }

                }
                if (event.type === "signal:idoperador-signal") {
                    enviarMensaje(session, session.connection.connectionId);
                }
                if (event.type === "signal:user_connected") {
                    /////////Se identifico un nuevo usuario conectado 
                    var info_user = JSON.parse(event.data);
                    CardParticipante_user_connected(info_user);
                }
            }

        });

        // Connect to the session
        session.connect(data.credenciales.token, function callback(error) {
            // If the connection is successful, initialize a publisher and publish to the session
            if (!error) {
                // Text chat


                var form = document.getElementById("chat");
                var msgTxt = document.querySelector('#msgTxt');

                // Send a signal once the user enters data in the form
                form.addEventListener('submit', function submit(event) {
                    event.preventDefault();
                    console.log("Enviando mensaje");
                    enviarMensaje(session, sesion_cookie.nombre + " " + sesion_cookie.apellido_p + "", msgTxt.value);
                });
                // Initialize the publisher
                var publisherOptions = {
                    insertMode: 'replace',
                    width: '100%',
                    height: '100%',
                    name: sesion_cookie.nombre + " " + sesion_cookie.apellidos
                };
                var publisher = OT.initPublisher('publisher', publisherOptions, function initCallback(initErr) {

                    if (initErr) {
                        console.error('There was an error initializing the publisher: ', initErr.name, initErr.message);
                        notificarError(initErr.message);
                        return;
                    } else {
                        enviarMensaje(session, sesion_cookie.nombre + " " + sesion_cookie.apellido_p + "", MSJ);
                        enviarMensajeOT(session, "user_connected", {
                            id360: sesion_cookie.id_usuario
                        });

                        document.getElementById("msgTxt").disabled = false;
                    }
                });

                // If the connection is successful, publish the publisher to the session
                session.publish(publisher, function publishCallback(publishErr) {
                    if (publishErr) {
                        console.error('There was an error publishing: ', publishErr.name, publishErr.message);
                    } else {
                        //                    data.registro_llamada.time.h_conexion_operador = getHora();
                        //                    ArchiveSession().then(function (response) {
                        //                        RegistrarURL(response.ruta_video);
                        //                    });

                        /*******Activar el menu*******/

                        console.log("Publicador iniciado");
                        var menu = document.createElement("div");
                        menu.style = "background: #343a40; position: absolute; bottom: 0px; left: calc(50% - 100px); width: 300px;border-top-left-radius: 50px;border-top-right-radius: 50px; z-index: 103;";
                        menu.className = "row col-12 m-0 p-0";
                        menu.id = "menu_botones";
                        console.log(menu);
                        var div = document.createElement("div");
                        div.className = "col-12";
                        div.style = "text-align: center; font: bold 2rem Arial; color: white;cursor: pointer;";
                        var i = document.createElement("i");
                        i.className = "fas fa-chevron-up";
                        console.log(i);
                        var botones = document.createElement("div");
                        botones.className = "row m-0 p-2 col-12 d-none";
                        botones.style = "height: 60px;";

                        console.log(botones);

                        div.addEventListener("click", function () {
                            if (botones.className === "row m-0 p-2 col-12 d-none") {
                                botones.className = "row m-0 p-2 col-12";
                                div.style = "text-align: center; font: bold 2rem Arial; color: white;cursor: pointer;transform: rotate(180deg);";
                            } else {
                                botones.className = "row m-0 p-2 col-12 d-none";
                                div.style = "text-align: center; font: bold 2rem Arial; color: white;cursor: pointer;";
                            }
                        });


                        div.appendChild(i);
                        menu.appendChild(div);
                        menu.appendChild(botones);


                        var colgar = document.createElement("div");
                        colgar.className = "col-3";
                        colgar.id = "colgarPublisher";
                        colgar.style = "justify-content:center;align-items:center;display:flex;font:2rem Arial;color:red;cursor:pointer;border-right:solid 1px #6c757d;";
                        colgar.innerHTML = '<i class="fas fa-phone-slash"></i>';
                        colgar.addEventListener("click", function () {
                            window.close();
                            session.unpublish(publisher);
                            //session.disconnect();
                            RegistrarDesconexionOp();
                            menu.className = "row col-12 m-0 p-0 d-none";
                        });
                        console.log(colgar);
                        botones.appendChild(colgar);

                        //////////Solicitar Cambio de camara  ******
                        var activarVideo = document.createElement("div");
                        activarVideo.className = "col-3";
                        activarVideo.innerHTML = '<i class="fas fa-video"></i>';
                        activarVideo.style = "justify-content:center;align-items:center;display:flex;font:2rem Arial;cursor:pointer;border-right:solid 1px #6c757d;";
                        activarVideo.addEventListener("click", function () {
                            if (!publisher.stream.hasVideo) {
                                activarVideo.innerHTML = '<i class="fas fa-video"></i>';
                            } else {
                                activarVideo.innerHTML = '<i class="fas fa-video-slash"></i>';
                            }
                            publisher.publishVideo(!publisher.stream.hasVideo);
                        });
                        botones.appendChild(activarVideo);
                        console.log(activarVideo);


                        //////////Solicitar Bloqueo de microfono  ******
                        var activarAudio = document.createElement("div");
                        activarAudio.className = "col-3";
                        activarAudio.innerHTML = '<i class="fas fa-microphone"></i>';
                        activarAudio.style = "justify-content:center;align-items:center;display:flex;font:2rem Arial;cursor:pointer;border-right:solid 1px #6c757d;";
                        activarAudio.addEventListener("click", function () {
                            if (!publisher.stream.hasAudio) {
                                activarAudio.innerHTML = '<i class="fas fa-microphone"></i>';
                            } else {
                                activarAudio.innerHTML = '<i class="fas fa-microphone-slash"></i>';
                            }
                            publisher.publishAudio(!publisher.stream.hasAudio);
                        });
                        botones.appendChild(activarAudio);
                        console.log(activarAudio);

                        //////////Compartir Pantalla  ******
                        var share_screen = document.createElement("div");
                        share_screen.className = "col-3";
                        share_screen.style = "justify-content:center;align-items:center;display:flex;font:2rem Arial;cursor:pointer;"
                        share_screen.innerHTML = '<i class="fas fa-external-link-alt"></i>';
                        share_screen.addEventListener("click", function () {
                            OT.checkScreenSharingCapability(function (response) {
                                if (!response.supported || response.extensionRegistered === false) {
                                    // This browser does not support screen sharing.
                                    console.log("This browser does not support screen sharing.");
                                } else if (response.extensionInstalled === false) {
                                    // Prompt to install the extension.
                                    console.log("Prompt to install the extension.");
                                } else {
                                    // Screen sharing is available. Publish the screen.
//                                var pos = NuevaUbicacion();
                                    var pos = fullcontainer_screen();
                                    var publisher_screen = OT.initPublisher(pos,
                                            {videoSource: 'screen'},
                                            function (error) {
                                                if (error) {
                                                    // Look at error.message to see what went wrong.
                                                } else {
                                                    let stop_share = document.createElement("div");
                                                    stop_share.className = "col-3";
                                                    stop_share.id = "stop_sharePublisher";
                                                    stop_share.style = "justify-content:center;align-items:center;display:flex;font:2rem Arial;color:red;cursor:pointer;border-right:solid 1px #6c757d;";
                                                    stop_share.innerHTML = '<i class="far fa-times-circle"></i>';
                                                    stop_share.addEventListener("click", function () {
                                                        session.unpublish(publisher_screen);
                                                        share_screen.className = "col-3";
                                                        stop_share.className = "col-3 d-none";
                                                        $("#maximizarVideo").removeClass("active");
                                                        $("aside").removeAttr('style');
                                                        $("header").removeAttr('style');
                                                        $("footer").removeAttr('style');
                                                        $("section").removeAttr('style');
                                                        $("#hamburgerMenu").parent().removeAttr('style');
                                                        $("#side1").removeAttr('style');
                                                        $("#side2").removeAttr('style');
                                                        $("#publishers").removeAttr('style');
                                                        $("#GRID").removeAttr('style');
                                                        $("#loading").css({
                                                            "position": "absolute",
                                                            "height": "20%",
                                                            "width": "20%",
                                                            "left": "40%",
                                                            "top": "30%"
                                                        });
                                                        showToggle();
                                                    });
                                                    botones.appendChild(stop_share);
                                                    share_screen.className = "col-3 d-none";
                                                    $("#maximizarVideo").click();
                                                    session.publish(publisher_screen, function (error) {
                                                        if (error) {
                                                            // Look error.message to see what went wrong.
                                                            console.log(error.message);
                                                        }

                                                    });
                                                }
                                            }
                                    );
                                    publisher_screen.on('mediaStopped', function (event) {
                                        // The user clicked stop.
                                        console.log("The user clicked stop.");
                                    });

                                    publisher_screen.on('streamDestroyed', function (event) {
                                        if (event.reason === 'mediaStopped') {
                                            // User clicked stop sharing
                                            console.log("User clicked stop sharing");
                                        } else if (event.reason === 'forceUnpublished') {
                                            // A moderator forced the user to stop sharing.
                                            console.log("A moderator forced the user to stop sharing.");
                                        }
                                        mosaico("remover");
                                    });
                                }
                            });

                        });
                        botones.appendChild(share_screen);
                        console.log(menu);
                        console.log(document.getElementById("videos"));
                        document.getElementById("videos").appendChild(menu);

                        $("#base_modulo_Comunicación .OT_publisher .OT_mute").click(() => {
                            activarAudio.click();
                        });

                        $("#base_modulo_Comunicación .OT_publisher .OT_mute").css({
                            "left": "50%",
                            "outline": "none"
                        });

                        $("#base_modulo_Comunicación .OT_subscriber .OT_mute").css({
                            "left": "50%",
                            "outline": "none"
                        });

                        //                    var colgar = document.createElement("input");
                        //                    colgar.className = "colgarPublisher";
                        //                    colgar.id = "colgarPublisher";
                        //                    colgar.value = "";
                        //                    colgar.addEventListener("click", function () {
                        //
                        //                        session.unpublish(publisher);
                        //                        //session.disconnect();
                        //                        RegistrarDesconexionOp();
                        //                    });
                        //                    document.getElementById("publisher").appendChild(colgar);
                        //
                        //                    //////////Solicitar Cambio de camara  ******
                        //                    var activarVideo = document.createElement("input");
                        //                    activarVideo.className = "activarVideoPublisher";
                        //                    activarVideo.value = "";
                        //                    activarVideo.addEventListener("click", function () {
                        //
                        //                        publisher.publishVideo(!publisher.stream.hasVideo);
                        //                    });
                        //                    document.getElementById("publisher").appendChild(activarVideo);


                    }
                });
            } else {
                console.error('There was an error connecting to the session: ', error.name, error.message);
            }
        });

    }

    function RegistrarDesconexionUsr(id, hora_desconexion) {

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": '/' + DEPENDENCIA + "/API/LlamadaSaliente/RegistrarDesconexionUsr",
            contentType: "application/json",
            "method": "POST",
            "data": JSON.stringify({
                "idLlamada": data.registro_llamada.idLlamada,
                "idUsuario": id,
                "hora_desconexion": hora_desconexion
            }),
            success: function (response) {

            },
            error: function (err) {

            }
        };
        return Promise.resolve($.ajax(settings));

    }

    function RegistrarDesconexionOp() {

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": '/' + DEPENDENCIA + "/API/LlamadaSaliente/RegistrarDesconexionOp",
            contentType: "application/json",
            "method": "POST",
            "data": JSON.stringify({
                "idLlamada": data.registro_llamada.idLlamada,
                "idSys": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys,
                "hora_desconexion": getHora(),
                "chat": JSON.stringify(chat)
            }),
            success: function (response) {

            },
            error: function (err) {

            }
        };
        return Promise.resolve($.ajax(settings));

    }

    function RegistrarConexionUsr(id, hora_conexion) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": '/' + DEPENDENCIA + "/API/LlamadaSaliente/RegistrarConexionUsr",
            contentType: "application/json",
            "method": "POST",
            "data": JSON.stringify({
                "idLlamada": data.registro_llamada.idLlamada,
                "idUsuario": id,
                "hora_conexion": hora_conexion
            }),
            success: function (response) {

            },
            error: function (err) {

            }
        };
        return Promise.resolve($.ajax(settings));
    }

    function RegistrarNuevoParticipante(idUsuarios_Movil, firebase) {
        var idUsers = new Array();
        idUsers.push(idUsuarios_Movil);
        RegistroNotificaciones(idUsers, data.registro_llamada.idLlamada).then(function (RespuestaNotificados) {



            var SolicitarVideo = FireBaseSolicitudVideo(firebase, data.credenciales.apikey, data.credenciales.idsesion, data.credenciales.token, RespuestaNotificados[idUsuarios_Movil]);
            SolicitarVideo.then(function (data) {
                if (!data.failure) {

                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'center',
                        showConfirmButton: false,
                        timer: 2000
                    });

                    Toast.fire({
                        type: 'success',
                        title: "Notificacion enviada! <br> El elemento esta siendo notificado"
                    });
                } else {

                }
            });
        });
    }

    function RegistrarURL(ruta_video) {
        data.registro_llamada.ruta_video = ruta_video;

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": '/' + DEPENDENCIA + "/API/LlamadaSaliente/Ruta_video",
            contentType: "application/json",
            "method": "POST",
            "data": JSON.stringify({
                "idLlamada": data.registro_llamada.idLlamada,
                "idSys": data.registro_llamada.idOperador,
                "ruta_video": ruta_video,
                "hora_conexion": data.registro_llamada.time.h_conexion_operador,
                "hora_inicio": data.registro_llamada.time.h_atencion_inicio,
            }),
            success: function (response) {

            },
            error: function (err) {

            }
        };
        return Promise.resolve($.ajax(settings));

    }

    function notificarError(error) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'center',
            timer: 10000,
            backdrop: `rgba(189, 189, 189,0.5)`
        });
        Toast.fire({
            type: 'info',
            html: '<p style="color: white;font-size: 15px; width: 360px;  text-align: justify; margin: 10px;">\n\
                                Hubo un problema al intentar publicar.<br>Error: ' + error + '<br>\n\
                                <label style=\"color: bisque;font-size: 17px;margin: 0;\">\n\
                                </label><br> \n\
                                <button id="stop" class="btn btn-success" style="position: relative; left: 30%; width: 150px; margin:15px;">\n\
                                OK!!</button><br>\n\
                                <label style=\"    color: white;font-size: 18px; margin: 0;font-weight: bold;\">\n\
                                La pagina se cerrara en: <strong></strong> segundos</label></p>',
            onBeforeOpen: () => {
                const content = Swal.getContent();
                const $ = content.querySelector.bind(content);

                const stop = $('#stop');

                Swal.showLoading();
                stop.addEventListener('click', () => {
                    Swal.close();
                    window.close();
                });

                timerInterval = setInterval(() => {
                    Swal.getContent().querySelector('strong')
                            .textContent = (Swal.getTimerLeft() / 1000)
                            .toFixed(0);
                }, 100);
            },
            onClose: () => {
                clearInterval(timerInterval);
            }

        }).then(function () {
            window.close();
        });
    }

    function AgregarContacto(elemento) {


        var contenedor = document.createElement("div");
        contenedor.style = "height: auto; background: white; border-radius: 10px; display: inline-block; margin: 5px 10px; vertical-align: bottom; width: calc( 100% - 20px); cursor: pointer; ";
        contenedor.id = Incidente.folio;
        var row = document.createElement("div");
        row.className = "row col-12 m-0 p-0";
        var div1 = document.createElement("div");
        div1.className = "col-8";
        var tipoIncidente = document.createElement("p");
        tipoIncidente.style = "color: black; padding: 0; margin: 5px 10px 0px; font: 14px Arial; width: 100%;";
        tipoIncidente.innerHTML = Incidente.incidente.Incidente;
        var folio = document.createElement("p");
        folio.style = "color: black; padding: 0; margin: 0px 20px 5px; font: 10px Arial;";
        folio.innerHTML = Incidente.folio + " - " + Incidente.hora;
        var div2 = document.createElement("div");
        div2.className = "col-4 pr-0";
        var boton = document.createElement("input");
        boton.type = "button";
        boton.style = "height: 100%; border-top-right-radius: 10px; border-bottom-right-radius: 10px; border: none; background-color: #ffffff; color: white; background-image: linear-gradient(90deg, #ffffff00, #00a5b8);  width: 100%; display:none;";
        boton.value = "Seleccionar";
        div1.appendChild(tipoIncidente);
        div1.appendChild(folio);
        div2.appendChild(boton);
        row.appendChild(div1);
        row.appendChild(div2);
        contenedor.appendChild(row);
        document.getElementById("collapseZero").appendChild(contenedor);


        var myLatLng = new google.maps.LatLng(Incidente.lat, Incidente.lng);

        // define our custom marker image
        var image = new google.maps.MarkerImage(
                PathRecursos + 'Img/IconoMap/dot.png',
                null, // size
                null, // origin
                new google.maps.Point(8, 8), // anchor (move to center of marker)
                new google.maps.Size(16, 16) // scaled size (required for Retina display icon)
                );

        if (Incidente.incidente.Prioridad === "URGENTE") {
            image = new google.maps.MarkerImage(
                    PathRecursos + 'Img/IconoMap/red_dot.png',
                    null, // size
                    null, // origin
                    new google.maps.Point(8, 8), // anchor (move to center of marker)
                    new google.maps.Size(16, 16) // scaled size (required for Retina display icon)
                    );
        } else if (Incidente.incidente.Prioridad === "RAPIDA") {
            image = new google.maps.MarkerImage(
                    PathRecursos + 'Img/IconoMap/orange_dot.png',
                    null, // size
                    null, // origin
                    new google.maps.Point(8, 8), // anchor (move to center of marker)
                    new google.maps.Size(16, 16) // scaled size (required for Retina display icon)
                    );
        } else if (Incidente.incidente.Prioridad === "NORMAL") {
            image = new google.maps.MarkerImage(
                    PathRecursos + 'Img/IconoMap/blue_dot.png',
                    null, // size
                    null, // origin
                    new google.maps.Point(8, 8), // anchor (move to center of marker)
                    new google.maps.Size(16, 16) // scaled size (required for Retina display icon)
                    );
        }

        var rowInfoW = document.createElement("div");
        rowInfoW.className = "row col-12 m-0 p-0";
        var divInfoW = document.createElement("div");
        divInfoW.className = "col-12";
        var tipoIncidenteInfoW = document.createElement("p");
        tipoIncidenteInfoW.style = "color: black; padding: 0; font: 14px Arial; width: 100%; margin:0;";
        tipoIncidenteInfoW.innerHTML = Incidente.incidente.Incidente;
        var folioInfoW = document.createElement("p");
        folioInfoW.style = "color: black; padding: 0; margin: 0px 20px 5px; font: 10px Arial;";
        folioInfoW.innerHTML = Incidente.folio + " - " + Incidente.hora;

        divInfoW.appendChild(tipoIncidenteInfoW);
        divInfoW.appendChild(folioInfoW);
        rowInfoW.appendChild(divInfoW);



        // then create the new marker
        var marcador = new google.maps.Marker({
            flat: true,
            icon: image,
            map: map,
            optimized: false,
            position: myLatLng,
            title: Incidente.incidente.Prioridad,
            zIndex: 5,
            visible: true,
            css: "Baja"

        });
        marcador.addListener('click', function () {

            infowindow.close();
            infowindow.setContent(rowInfoW);
            infowindow.open(map, marcador);

        });
        div1.addEventListener("click", function () {
            map.setCenter(myLatLng);
            map.setZoom(16);

        });
        boton.addEventListener("click", function () {
            NuevoReporte = false;
            incidente_establecido = true;


            //document.getElementById("chained_relative-flexdatalist").value = Incidente.incidente.id + ", " + Incidente.incidente.Incidente;


            document.getElementById("nivelemergencia").value = Incidente.incidente.Prioridad;
            document.getElementById("folio").value = prefijoFolio + Incidente.folio;
            document.getElementById("FolioIncidentes").value = Incidente.folioIncidentes;

            incidente = Incidente.incidente;
            FolioIncidentes = Incidente.folioIncidentes;
            Folio = Incidente.folio;

            vue.value = [{"id": Incidente.incidente.id, "Incidente": Incidente.incidente.Incidente}];
            document.getElementById("aheadingZero").click();
            document.getElementById("collapseThree").className = "collapse show";

            var dependencias = document.getElementById("DependenciasID").value.split("|");
            for (var i = 0; i < dependencias.length; i++) {
                var depen = dependencias[i].toString().split(",");
                var id = depen[0];
                if (incidente.Dependencias.includes(depen[1])) {
                    document.getElementById(id).checked = 1;
                }
            }

            document.getElementById("aheadingOne").click();
            document.getElementById("collapseThree").className = "collapse show";
            document.getElementById("headingZero").style = "display:none;";
            document.getElementById("headingOne").style = "display:none;";
            $('#notificarDependencias').submit();

        });
        contenedor.addEventListener("mouseover", function () {
            boton.style.display = "block";
            contenedor.style.boxShadow = "-3px 3px 20px 0px black";
            contenedor.style.margin = "5px 15px";
        });
        contenedor.addEventListener("mouseout", function () {
            boton.style.display = "none";
            contenedor.style.boxShadow = "none";
            contenedor.style.margin = "5px 10px";
        });

    }

    function MarcadorElemento(Dependencia, elemento, icono) {
        var datos_elemento = consultaPerfil(Dependencia, elemento.idUsuarios_Movil);
        datos_elemento.then(function (perfil) {

            var nuevoMarcador;
            var icon = icono;



            nuevoMarcador = new google.maps.Marker({position: {lat: parseFloat(elemento.latitud), lng: parseFloat(elemento.longitud)},
                map: map,
                //animation: googlue.maps.Animation.BOUNCE,
                icon: icon
            }, );


            nuevoMarcador.addListener('click', function () {
                infowindow.close();


                infowindow.setContent(ContentInfoWindowLITE(elemento));
                infowindow.open(map, nuevoMarcador);
            });

            $("#marcadoresDependencias").submit(function () {
                nuevoMarcador.setMap(null);
            });
            $("#myRange").mouseup(function () {
                nuevoMarcador.setMap(null);
            });

        });
    }

    function enviarNotificacionGrupal() {


        var a = '["id","Incidente","Prioridad"]';

        var b = "'" + a + "'";
        var Prioridad = "";
        if (incidente.Prioridad !== undefined) {
            Prioridad = incidente.Prioridad;
        }

        var c = '<input type="text" placeholder ="Escribe el código o nombre del incidente" class ="flexdatalist form-control Swal2" data-relatives="#relative" data-url="/sos/resources/json/incidentes.json" data-search-in=' + b + ' data-visible-properties=' + b + ' data-group-by="id" data-selection-required="true" data-focus-first-result="true" data-min-length="1" data-value-property=' + b + ' data-text-property="{id}, {Incidente}, {Prioridad}" data-search-contain="false" id="swal-input2" value="' + incidente.Incidente + '" >';



        swal.fire({
            title: 'Notificar a todos',
            text: "Esta acción enviará una notificación a todos los elementos desplegados en el mapa \n¿Desea continuar?",
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, enviar a todos'
        }).then((result) => {
            if (result.value) {
                var lugar = document.getElementById("Lugar");
                var numPiso = "";
                if (lugar.value === "Edificio" || lugar.value === "Departamento" || lugar.value === "Casa") {
                    if (document.getElementById("DescripcionLugar").value !== "") {
                        numPiso = " ~ Piso: " + document.getElementById("UbicacionPiso").value;
                    }
                }
                Swal.fire({
                    title: 'Notificación',
                    html: //-------------------------TITULO
                            '<label class="sweetalrtTitle" >Esta información sera la que le llegue al elemento que se le envia la notificación</label>' +
                            //-------------------------FOLIO
                            '<label class="sweetalrt">Folio</label>' +
                            '<input id="swal-input1" type="text" class="readonly swal2-input" value="' + document.getElementById("folio").value + '" >' +
                            //-------------------------TIPO DE EMERGENCIA
                            '<label class="sweetalrt">Tipo de Emergencia</label>' +
                            //'<input id="swal-input2" type="text" class="readonly swal2-input" value="' + incidente.Incidente + '" readonly="true">' +
                            '<br>' +
                            c +
                            '<input id="swal-input3" type="hidden" class="swal2-input" value="' + incidente.id + '">' +
                            //-------------------------NIVEL DE ATENCION
                            '<label class="sweetalrt">Nivel de atención</label>' +
                            '<input id="swal-input4" type="text" class="readonly swal2-input" value="' + Prioridad + '" readonly="true">' +
                            //-------------------------DESCRIPCION DEL LUGAR 
                            '<label class="sweetalrt">Descripción del Lugar</label>' +
                            '<input id="swal-input5" class="swal2-input" value="' + document.getElementById("DescripcionLugar").value + numPiso + '">' +
                            //-------------------------REPORTE
                            '<label class="sweetalrt"">Reporte</label>' +
                            '<textarea id="swal-input6" class="swal2-inputTxtA" rows="5">' + document.getElementById("AreaReporte").value + '</textarea>',
                    focusConfirm: false,
                    preConfirm: () => {
                        return [
                            document.getElementById('swal-input1').value,
                            document.getElementById('swal-input2').value,
                            document.getElementById('swal-input3').value,
                            document.getElementById('swal-input4').value,
                            document.getElementById('swal-input5').value,
                            document.getElementById('swal-input6').value
                        ];
                    }
                }).then((result) => {

                    document.getElementById("folio").value = result.value[0];
                    document.getElementById("DescripcionLugar").value = result.value[4].split("~")[0];
                    document.getElementById("AreaReporte").value = result.value[5];

                    var proceder = true;
                    for (var i = 0; i < result.value.length; i++) {
                        console.log(result.value[i])
                        if (result.value[i] === "" || result.value[i] === null || result.value[i] === undefined) {
                            proceder = false;
                        }
                    }
                    if (proceder)
                    {


                        var data = document.getElementById("DependenciasID").value.split("|");
                        for (var i = 0; i < data.length; i++) {
                            var dependencia = data[i].split(",");

                            var idElementos = document.getElementById("elementos" + dependencia[0] + dependencia[3]).value.split(",");


                            for (var j = 0; j < idElementos.length; j++) {
                                if (idElementos[j] !== "") {

                                    FireBaseKey(idElementos[j], 3, API_KEY, SESSION_ID, TOKEN, dependencia[1]);
                                }
                            }

                        }
                        swal.fire(
                                'Notificaciones enviadas!',
                                'Los elementos estan siendo notificados.',
                                'success'
                                );
                    } else {

                        swal.fire(
                                'Informacion insuficiente en "Descripción de emergencia"',
                                'Favor de rellenar todos los campos: <br>\n\
                            <br>- Folio\n\
                            <br>- Tipo de emergencia\n\
                            <br>- Nivel de atención \n\
                            <br>- Descripcion del lugar\n\
                            <br>- Reporte <br><br>',
                                'error'
                                );
                    }


                });

                //Flexdata del catalogo nacional de incidencias
                $('.Swal2').flexdatalist({
                    searchContain: false,
                    textProperty: "{id}, {Incidente}, {Prioridad}",
                    valueProperty: ["id", "Incidente", "Prioridad"],
                    minLength: 1,
                    focusFirstResult: true,
                    selectionRequired: true,
                    groupBy: 'id',
                    visibleProperties: ["id", "Incidente", "Prioridad"],
                    searchIn: ["id", "Incidente", "Prioridad"],
                    url: PathRecursos + 'json/incidentes.json',
                    relatives: '#relative'
                });

                $('input.Swal2').on('change:flexdatalist', function (event, set, options) {

                    if (set.value !== "") {
                        incidente = JSON.parse(set.value);

                        document.getElementById("nivelemergencia").value = incidente.Prioridad;


                        //                    document.getElementById("divnotificarDependencias").style.display = "block";
                        //                    document.getElementById("ContainerMarcadoresDependencias").style.display = "block";
                        //                    document.getElementById("enviarNotificacion").style.display = "block";
                        document.getElementById("nivelAtencion").style.display = "block";
                        document.getElementById("swal-input4").value = incidente.Prioridad;
                        document.getElementById("chained_relative-flexdatalist").value = incidente.Incidente;

                    } else {
                        document.getElementById("nivelemergencia").value = "";
                        incidente = "";
                        //                    document.getElementById("divnotificarDependencias").style.display = "none";
                        //                    document.getElementById("enviarNotificacion").style.display = "none";
                        document.getElementById("nivelAtencion").style.display = "none";
                        //                    document.getElementById("ContainerMarcadoresDependencias").style.display = "none";
                        document.getElementById("swal-input4").value = "";
                        document.getElementById("chained_relative-flexdatalist").value = "";
                    }
                });
            }

        });



    }

    function enviarNotificacionIndividual(ElementoId, apikey, sesion, token, Dependencia) {


        var a = '["id","Incidente","Prioridad"]';

        var b = "'" + a + "'";
        var Prioridad = "";
        if (incidente.Prioridad !== undefined) {
            Prioridad = incidente.Prioridad;
        }

        var c = '<input type="text" placeholder ="Escribe el código o nombre del incidente" class ="flexdatalist form-control Swal2" data-relatives="#relative" data-url="/sos/resources/json/incidentes.json" data-search-in=' + b + ' data-visible-properties=' + b + ' data-group-by="id" data-selection-required="true" data-focus-first-result="true" data-min-length="1" data-value-property=' + b + ' data-text-property="{id}, {Incidente}, {Prioridad}" data-search-contain="false" id="swal-input2" value="' + incidente.Incidente + '" >';


        swal.fire({
            title: 'Notificar',
            text: "Esta acción enviará una notificación solo al elementos seleccionado en el mapa \n¿Desea continuar?",
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, enviar.'
        }).then((result) => {
            if (result.value) {
                var lugar = document.getElementById("Lugar");
                var numPiso = "";
                if (lugar.value === "Edificio" || lugar.value === "Departamento" || lugar.value === "Casa") {
                    if (document.getElementById("DescripcionLugar").value !== "") {
                        numPiso = " ~ Piso: " + document.getElementById("UbicacionPiso").value;
                    }
                }
                Swal.fire({
                    title: 'Notificación',
                    html: //-------------------------TITULO
                            '<label class="sweetalrtTitle" >Esta información sera la que le llegue al elemento que se le envia la notificación</label>' +
                            //-------------------------FOLIO
                            '<label class="sweetalrt">Folio</label>' +
                            '<input id="swal-input1" type="text" class="readonly swal2-input" value="' + document.getElementById("folio").value + '" >' +
                            //-------------------------TIPO DE EMERGENCIA
                            '<label class="sweetalrt">Tipo de Emergencia</label>' +
                            //'<input id="swal-input2" type="text" class="readonly swal2-input" value="' + incidente.Incidente + '" readonly="true">' +
                            '<br>' +
                            c +
                            '<input id="swal-input3" type="hidden" class="swal2-input" value="' + incidente.id + '">' +
                            //-------------------------NIVEL DE ATENCION
                            '<label class="sweetalrt">Nivel de atención</label>' +
                            '<input id="swal-input4" type="text" class="readonly swal2-input" value="' + Prioridad + '" readonly="true">' +
                            //-------------------------DESCRIPCION DEL LUGAR 
                            '<label class="sweetalrt">Descripción del Lugar</label>' +
                            '<input id="swal-input5" class="swal2-input" value="' + document.getElementById("DescripcionLugar").value + numPiso + '">' +
                            //-------------------------REPORTE
                            '<label class="sweetalrt"">Reporte</label>' +
                            '<textarea id="swal-input6" class="swal2-inputTxtA" rows="5">' + document.getElementById("AreaReporte").value + '</textarea>',
                    focusConfirm: false,
                    preConfirm: () => {
                        return [
                            document.getElementById('swal-input1').value,
                            document.getElementById('swal-input2').value,
                            document.getElementById('swal-input3').value,
                            document.getElementById('swal-input4').value,
                            document.getElementById('swal-input5').value,
                            document.getElementById('swal-input6').value
                        ];
                    }
                }).then((result) => {

                    document.getElementById("folio").value = result.value[0];
                    document.getElementById("DescripcionLugar").value = result.value[4].split("~")[0];
                    document.getElementById("AreaReporte").value = result.value[5];

                    var proceder = true;
                    for (var i = 0; i < result.value.length; i++) {

                        if (result.value[i] === "" || result.value[i] === null || result.value[i] === undefined) {
                            proceder = false;
                        }
                    }
                    if (proceder)
                    {

                        //
                        //                    var data = document.getElementById("DependenciasID").value.split("|");
                        //                    for (var i = 0; i < data.length; i++) {
                        //                        var dependencia = data[i].split(",");
                        //                       
                        //                        var idElementos = document.getElementById("elementos" + dependencia[0] + dependencia[3]).value.split(",");
                        //                      
                        //                       
                        //                        for (var j = 0; j < idElementos.length; j++) {
                        //                            if (idElementos[j] !== "") {
                        //                              
                        //                                FireBaseKey(idElementos[j], 3, API_KEY, SESSION_ID, TOKEN, dependencia[1]);
                        //                            }
                        //                        }
                        //
                        //                    }


                        FireBaseKey(ElementoId, 2, apikey, sesion, token, Dependencia);


                    } else {

                        swal.fire(
                                'Informacion insuficiente en "Descripción de emergencia"',
                                'Favor de rellenar todos los campos: <br>\n\
                            <br>- Folio\n\
                            <br>- Tipo de emergencia\n\
                            <br>- Nivel de atención \n\
                            <br>- Descripcion del lugar\n\
                            <br>- Reporte <br><br>',
                                'error'
                                );
                    }


                });

                //Flexdata del catalogo nacional de incidencias
                $('.Swal2').flexdatalist({
                    searchContain: false,
                    textProperty: "{id}, {Incidente}, {Prioridad}",
                    valueProperty: ["id", "Incidente", "Prioridad"],
                    minLength: 1,
                    focusFirstResult: true,
                    selectionRequired: true,
                    groupBy: 'id',
                    visibleProperties: ["id", "Incidente", "Prioridad"],
                    searchIn: ["id", "Incidente", "Prioridad"],
                    url: PathRecursos + 'json/incidentes.json',
                    relatives: '#relative'
                });

                $('input.Swal2').on('change:flexdatalist', function (event, set, options) {

                    if (set.value !== "") {
                        incidente = JSON.parse(set.value);

                        document.getElementById("nivelemergencia").value = incidente.Prioridad;


                        //                    document.getElementById("divnotificarDependencias").style.display = "block";
                        //                    document.getElementById("ContainerMarcadoresDependencias").style.display = "block";
                        //                    document.getElementById("enviarNotificacion").style.display = "block";
                        document.getElementById("nivelAtencion").style.display = "block";
                        document.getElementById("swal-input4").value = incidente.Prioridad;
                        document.getElementById("chained_relative-flexdatalist").value = incidente.Incidente;

                    } else {
                        document.getElementById("nivelemergencia").value = "";
                        incidente = "";
                        //                    document.getElementById("divnotificarDependencias").style.display = "none";
                        //                    document.getElementById("enviarNotificacion").style.display = "none";
                        document.getElementById("nivelAtencion").style.display = "none";
                        //                    document.getElementById("ContainerMarcadoresDependencias").style.display = "none";
                        document.getElementById("swal-input4").value = "";
                        document.getElementById("chained_relative-flexdatalist").value = "";
                    }
                });


            }

        });


    }

    function directorio() {

        $("#directorio").on("click", function () {
            Swal.fire({
                title: 'Directorio',
                html: //-------------------------TITULO
                        //-------------------------Body 
                        '<label class="sweetalrt" style="padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;">Agrega participantes a la llamada.</label>' +
                        '<div class="col-12" id="agregarTels">' +
                        '<multiselect ' +
                        'placeholder=""' +
                        'v-model="value" ' +
                        ':options="options"' +
                        'track-by="id360"' +
                        ':multiple="true"' +
                        ':taggable="false"' +
                        ':close-on-select="false"' +
                        ':custom-label="customLabel" ' +
                        ':select-label="\'Seleccionar\'" ' +
                        ':selected-Label="\'Seleccionado\'"' +
                        ':deselect-Label="\'Remover\'"' +
                        ':hide-selected="true"' +
                        '@select="onSelect"' +
                        '@Close="onClose"' +
                        '@Remove="onRemove">' +
                        '</multiselect>' +
                        '<pre class="language-json" style="display:none"><code>{{ value  }}</code></pre>' +
                        '</div>',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: "Llamar",
                preConfirm: () => {
                    return [

                        //document.getElementById('swal-input5').value,
                        //document.getElementById('swal-input6').value
                    ];
                }
            }).then((result) => {
                if (result.value) {
                    if (tel_a_agregar.length)
                    {
                        let id360 = {
                            id360: sesion_cookie.id_usuario
                        };
                        let to_id360 = new Array();



                        for (var i = 0; i < tel_a_agregar.length; i++) {
                            //                        var encontrado = false;

                            //                        for (var j = 0; j < dataG.integrantes.length; j++) {
                            //                            if (tel_a_agregar[i].idUsuario === dataG.integrantes[j].idUsuarios_Movil) {


                            //                                encontrado = true;
                            //                                var elemento = dataG.integrantes[j]
                            var elemento = tel_a_agregar[i];
                            to_id360.push({
                                id360: elemento.id360
                            });
                            //                                if (!elemento.gps.estatus) {
                            //                                    RegistrarNuevoParticipante(dataG.integrantes[j].idUsuarios_Movil, dataG.integrantes[j].FireBaseKey);
                            //                                } else {
                            //                                    Swal.fire({
                            //                                        type: 'error',
                            //                                        title: "",
                            //                                        //text: 'El reporte se ha guardado correctamente',
                            //                                        html: "<p style=\"    font: bold 12px arial;    margin: 4px;    padding: 0;\">La notificacion no se envio!</p><p style=\"color: back;font: bold 14px Arial; padding: 0; margin: 0;\">El usuario se encuentra atendiendo otra llamada.</p>",
                            //                                        showConfirmButton: false,
                            //                                        timer: 2000
                            //                                    });
                            //                                }

                            //                        break;
                            //                            }
                            //                        }
                            //                        if (!encontrado) {
                            //                            console.warn(tel_a_agregar[i].idUsuario + " NO SE ENCONTRO EN DATAG...");
                            //                        }
                        }


                        id360.to_id360 = to_id360;
                        id360.credenciales = {
                            apikey: data.credenciales.apikey,
                            idsesion: data.credenciales.idsesion,
                            token: data.credenciales.token
                        };
                        id360.idLlamada = data.registro_llamada.idLlamada;
                        console.log(id360);
                        RequestPOST("/API/notificacion/llamada360/agregar_participante", id360).then((msj) => {
                            console.log(msj);
                            let Toast = Swal.mixin({
                                toast: true,
                                position: 'center',
                                showConfirmButton: false,
                                timer: 2000,
                                timerProgressBar: true,
                                didOpen: (toast) => {
                                    toast.addEventListener('mouseenter', Swal.stopTimer)
                                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                                }
                            })

                            Toast.fire({
                                icon: 'success',
                                title: 'Invitacion enviada correctamente.'
                            })
                            //window.open('https://empresas.claro360.com/plataforma360/Llamada/agregar_participante' + msj.registro_llamada.idLlamada + '/' + msj.credenciales.apikey + '/' + msj.credenciales.idsesion + '/' + msj.credenciales.token + '', '_blank');  
                        });
                    }
                }

            });

            vuemodel();
        });
    }

    function vuemodel() {
        tel_a_agregar = new Array();
        var json = Directorio;
        vue = new Vue({
            components: {
                Multiselect: window.VueMultiselect.default
            },
            data: {

                value: [
                ],
                options: json


            },
            methods: {
                customLabel(option) {
                    return  option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno;
                },
                onSelect(op) {
                    tel_a_agregar.push(op);
                },
                onClose() {
                    //console.info(this.value);
                },
                onRemove(op) {
                    var i = tel_a_agregar.indexOf(op);
                    tel_a_agregar.splice(i, 1);
                }

            }
        }).$mount('#agregarTels');
    }

    $("#btn-reporte").click(function () {

        var Folio = $("#folio").val();
        var Motivo = $("#motivo").val();
        var Reporte = $("#reporte").val();
        var procede = true;
        $("#folio").css("border", "none");
        $("#motivo").css("border", "none");
        $("#reporte").css("border", "none");

        if (Folio === "") {

            procede = false;
            $("#folio").css("border", "solid 1px red");
        }
        if (Motivo === "") {

            procede = false;
            $("#motivo").css("border", "solid 1px red");
        }
        if (Reporte === "") {

            procede = false;
            $("#reporte").css("border", "solid 1px red");
        }

        if (procede) {
            var json = {
                "folio": Folio,
                "motivo": Motivo,
                "reporte": Reporte,
                "idLlamada": data.registro_llamada.idLlamada,
                "hora": getHora(),
                "fecha": getFecha()
            };
            guardarReporteLlamadaSaliente(json).then(function (response) {
                if (response.id > 0) {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'center',
                        showConfirmButton: false,
                        timer: 3000
                    });

                    Toast.fire({
                        type: 'success',
                        title: 'Reporte guardado con exito.'
                    });
                } else {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'center',
                        showConfirmButton: false,
                        timer: 3000
                    });

                    Toast.fire({
                        type: 'error',
                        title: 'Hubo un error al intentar guardar el reporte.'
                    })
                }
            });

        } else {
            Swal.fire(
                    {
                        title: 'Información incompleta',
                        html: "<p style=\"color: white;font-size: 15px; padding: 0; margin: 5%; \">Asegurate de llenar todos los campos para poder guardar el reporte correctamente. </p>",
                        showConfirmButton: false,
                        showCancelButton: false
                    }
            );
        }
    });

    function guardarReporteLlamadaSaliente(json) {
        if (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).hasOwnProperty("tipo_usuario") && JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).hasOwnProperty("tipo_servicio")) {
            json.tipo_usuario = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
            json.tipo_servicio = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio;
        }
        return Promise.resolve($.ajax({
            type: 'POST',
            url: '/' + DEPENDENCIA + '/API/solicitudVideo/guardarReporteLlamadaSaliente',
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(json),
            success: function (response) {
                console.info(response);
            },
            error: function (err) {
                //alert("No hay ubicacion para el usuario:" + idUsuarios_Movil);
                console.error(err)
            }
        }));
    }

    function CardParticipante(gps_data) {

        if (!$("#card" + gps_data.idUsuario_Movil).length)
        {
            var elemento = buscarelemento(gps_data.idUsuario_Movil);
            if (!elemento.img) {
                BackupImage(elemento.idUsuarios_Movil).then(function (response) {
                    if (response.existe) {
                        for (var i = 0; i < dataG.integrantes.length; i++) {
                            if (dataG.integrantes[i].idUsuarios_Movil === elemento.idUsuarios_Movil) {
                                dataG.integrantes[i].img = response.img;
                                elemento.img = response.img;
                                AgregarCardParticipante(elemento);
                                break;
                            }
                        }
                    }
                });
            } else {
                AgregarCardParticipante(elemento);
            }


        }

    }

    function CardParticipante_user_connected(info_user) {

        if (!$("#card" + info_user.id360).length)
        {
            var elemento = buscarelemento_directorio(info_user.id360);
            if (elemento !== null) {
                AgregarCardParticipante360(elemento);

            } else {
                console.error("El usuario no se encontro en el directorio ");
                //Proximamente se tiene que validar el trael la informacion de un usuario que bno este en nuestro catalogo de usuarios 
            }



        }

    }

    function AgregarCardParticipante360(elemento) {

        var container = document.createElement("div");
        container.id = "card" + elemento.id360;
        container.className = "row col-12 m-0 p-0";
        var img = document.createElement("div");
        img.style = "padding:12.5%;background-image:url('" + elemento.img + "'); background-size: cover;  background-repeat: no-repeat;  background-position: center;";
        img.className = "col-3 m-0";
        var card = document.createElement("div");
        card.className = "card col-9 m-0 p-0";
        card.style = "cursor:pointer";
        var body = document.createElement("div");
        body.className = "card-body";

        var divBody = document.createElement("div");

        var title = document.createElement("h5");
        title.className = "card-title";
        title.innerHTML = elemento.nombre + " " + elemento.apellido_paterno + " " + elemento.apellido_materno;
        var text = document.createElement("p");
        text.className = "card-text";
        text.innerHTML = "<strong>Correo: </strong>" + elemento.correo + "<br><strong>Teléfono: </strong>" + elemento.telefono;

        container.appendChild(img);
        container.appendChild(card);
        card.appendChild(body);

        divBody.appendChild(title);
        divBody.appendChild(text);
        body.appendChild(divBody);

        document.getElementById("participantes").appendChild(container);

        //    card.addEventListener("click", function () {
        //
        //        map.setCenter(elemento.gps);
        //        map.setZoom(16);
        //
        //    });
    }

    function AgregarCardParticipante(elemento) {

        var container = document.createElement("div");
        container.id = "card" + elemento.idUsuarios_Movil;
        container.className = "row col-12 m-0 p-0";
        var img = document.createElement("div");
        img.style = "padding:12.5%;background-image:url('" + elemento.img.replace(/(\r\n|\n|\r)/gm, "") + "'); background-size: cover;  background-repeat: no-repeat;  background-position: center;";
        img.className = "col-3 m-0";
        var card = document.createElement("div");
        card.className = "card col-9 m-0 p-0";
        card.style = "cursor:pointer";
        var body = document.createElement("div");
        body.className = "card-body";
        var title = document.createElement("h5");
        title.className = "card-title";
        title.innerHTML = elemento.nombre + " " + elemento.apellido_paterno + " " + elemento.apellido_materno;
        var text = document.createElement("p");
        text.className = "card-text";
        text.innerHTML = "<strong>Elemento de: </strong>" + elemento.aliasServicio + "<br><strong>Teléfono: </strong>" + elemento.telefono;

        container.appendChild(img);
        container.appendChild(card);
        card.appendChild(body);
        body.appendChild(title);
        body.appendChild(text);

        document.getElementById("participantes").appendChild(container);

        card.addEventListener("click", function () {

            map.setCenter(elemento.gps);
            map.setZoom(16);

        });
    }

    function buscarelemento(idUsuario_Movil) {
        for (var i = 0; i < dataG.integrantes.length; i++) {
            if (dataG.integrantes[i].idUsuarios_Movil === idUsuario_Movil) {
                return dataG.integrantes[i];
                break;
            }
        }
    }

    function buscarelemento_directorio(id360) {
        for (var i = 0; i < Directorio.length; i++) {
            if (Directorio[i].id360 === id360) {
                return Directorio[i];
                break;
            }
        }
        return null;
    }

    habilitarMaximizarVideo();

};