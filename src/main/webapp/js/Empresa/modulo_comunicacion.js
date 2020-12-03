/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



/* global RequestPOST, DEPENDENCIA, Vue, perfil, sesion_cookie, Swal, directorio_completo, PathRecursos */

let array_llamar = new Array();
agregar_menu("Comunicación");
Vue.component("multiselect", window.VueMultiselect.default);

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
function agregar_chat_enviado(mensaje) {
    console.log("mensaje empresarial para: " + mensaje.to_id360);
    /*
     * 
     * revisar que tengamos el chat del usuario que nos escribe
     */
    
    if (!$("#profile_chat" + mensaje.to_id360).length) {
        console.log("EXISTEE MANDO");
        RequestPOST("/API/get/perfil360", {id360:mensaje.to_id360}).then((response) => {
            console.log("WAAAAAAAAAAAAAAAA");
            console.log(response);
            contacto_chat(response);
            agregar_chat(mensaje, response,"replies");
        });
    } else {
        console.log("NO EXISTEE MANDO");
        let user = null;
        $.each(directorio_completo, (i) => {
            if (mensaje.id360 === directorio_completo[i].id360) {
                console.log("ENCONTRADO WEEEEEEEEEEEEEE");
                user = directorio_completo[i];
                return false;
            }
        });
        agregar_chat(mensaje,user,"replies");
    }

}
function recibir_chat(mensaje) {
    console.log("mensaje empresarial para: " + mensaje.to_id360);
    /*
     * 
     * revisar que tengamos el chat del usuario que nos escribe
     */

    if (!$("#profile_chat" + mensaje.id360).length) {
        console.log("EXISTE");
        RequestPOST("/API/get/perfil360", mensaje).then((response) => {
            console.log("EPAEPAEPA");
            console.log(response);
            contacto_chat(response);
            agregar_chat(mensaje, response,"send");
        });
    } else {
        console.log("NO EXISTE");
        let user = null;
        $.each(directorio_completo, (i) => {
            if (mensaje.id360 === directorio_completo[i].id360) {
                console.log("ENCONTRADO");
                user = directorio_completo[i];
                return false;
            }
        });
        agregar_chat(mensaje,user,"send");
    }

}
function agregar_chat(msj,user,type) {
    console.log("****************************************");
    console.log("****************************************");
    console.log("Agregando chat");
    console.log("****************************************");
    console.log("****************************************");
    console.log(msj);
    console.log(user);
    let mensaje = msj.message;
    let li = $("<li></li>").addClass(type);
    let img_message = $("<div></div>").addClass("img");
    img_message.css({
        "background": "url('" + user.img + "')",
        "background-size": "cover",
        "background-position": "center",
        "background-repeat": "no-repeat"
    });
    let message = $("<p></p>");
    message.text(mensaje);
    li.append(img_message);
    li.append(message);
    
    let id = type === "replies" ? msj.to_id360 : msj.id360;
    let idConver = type === "replies" ? msj.to_id360 : msj.id360;
    let previewMesagge = type === "replies" ? "Yo: " + mensaje : user.nombre + ": " + mensaje;
    
    if(msj.type !== "text"){
        let extension = msj.type;
        
        let partesPorDiagonal = mensaje.split("/");
        let nombreCorto = partesPorDiagonal[partesPorDiagonal.length-1];
        
        let nombreCortoPorGuionBajo = nombreCorto.split("_");
        nombreCortoPorGuionBajo.shift();

        nombreCorto = nombreCortoPorGuionBajo.join('_');
        
        previewMesagge = type === "replies" ? "Yo: " + nombreCorto.replaceAll("%20", " ") : user.nombre + ": " + nombreCorto.replaceAll("%20", " ");
        
        let imagenPreview = $("<img>").css({"max-width":"125px","max-height":"75px","margin-bottom":"10px"}).attr("src",PathRecursos + "images/icono_default.png");

        let saltoLinea = $("<br>");
        let nombreAdjunto = $("<span></span>").css({"font-size":"1.1rem"});
        nombreAdjunto.text(nombreCorto.replaceAll("%20"," ") + " ");

        let buttonDownloadAttachment = $("<a></a>").addClass("btn btn-light").css({"margin-left":"10px"});
        buttonDownloadAttachment.attr("href",mensaje);
        buttonDownloadAttachment.attr("download",nombreCorto);
        buttonDownloadAttachment.html('<i class="fas fa-download"></i>');

        nombreAdjunto.append(buttonDownloadAttachment);

        switch(extension){

            case "jpg":
            case "png":
            case "jpeg":
            case "gif":
                    imagenPreview.attr("src",mensaje);
                    imagenPreview.attr("target","_blanck");
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
        message.append(nombreAdjunto);
    }
    
    $("#contact_messaging" + id).append(li);
    $("#preview_"+id).text(previewMesagge);
    $("#messages_"+id).animate({scrollTop: $(document).height()+1000000}, "fast");
    console.log(document.getElementById("profile_chat"+user.id360));
    $("#message_contacts").prepend( document.getElementById("profile_chat"+id) );
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
    console.log(response);
    let directorio = response.directorio;
    
    for (var i = 0; i < directorio.length; i++)
         if(directorio[i].id360 === sesion_cookie.id_usuario)
            directorio.splice(i,1);
    
    
    new Vue({
        el: "#app",
        data() {
            return {
                value: [],
                options: directorio
            }
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
            }
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
                if($("#profile_chat" + value.id360).length){
                    $("#profile_chat" + value.id360).click();
                }else{
                    contacto_chat(value);
                    $("#profile_chat" + value.id360).click();
                }
            }
        }
    });
    
    /*
     * Consultar solamente los usuarios con los que se tiene un chat
     */
    RequestPOST("/API/empresas360/usuarios_con_chat",{ id360: sesion_cookie.idUsuario_Sys }).then((response) => {
        
        console.log("*************************************************************");
        console.log("*************************************************************");
        console.log(response);
        console.log("*************************************************************");
        console.log("*************************************************************");
        
        let cantidadDirectorio = directorio.length;
        $.each(response, (index, contacto) => {
            console.log("CONTACTO CON CHAT" + contacto);
            for (let i = 0; i < cantidadDirectorio; i++) 
                if( directorio[i].id360 ===  contacto.id360 ){
                    console.log("ENCONTRADO");
                    contacto_chat(directorio[i]);
                    break;
                }
            
        });
        
        RequestPOST("/API/empresas360/backup_chat",{
            id360:sesion_cookie.id_usuario
        }).then((response)=>{
            console.log(response);
            for (var i = 0; i < response.length; i++) {
                if (response[i].id360 === sesion_cookie.id_usuario) {
                    agregar_chat_enviado(response[i]);
                } else {
                    recibir_chat(response[i]);
                }
                $(".messages").animate({scrollTop: $(document).height()+100000}, "fast");
            }
            $(".messages").animate({scrollTop: $(document).height()+100000}, "fast");
        });
        
    });
    
  
});

function contacto_chat(user) {
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
    name.text(user.nombre + " " + user.apellido_paterno + " " + user.apellido_materno);
    let preview = $("<p></p>").addClass("preview");
    preview.attr("id","preview_"+user.id360);
    meta.append(name);
    meta.append(preview);

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
    nombre.text(user.nombre + " " + user.apellido_paterno + " " + user.apellido_materno);
    let social_media = $("<div></div>").addClass("social-media");
    let div_llamar = $("<div></div>");
    let llamar = $("<i class=\"fas fa-phone-alt\"></i>");
    llamar.attr("id", "llamar_" + user.id360);
    llamar.css({
        "background": "#40474f",
        "padding": "17px",
        "font-size": "60px",
        "width": "50px",
        "cursor": "pointer"
    });
    let messages = $("<div></div>").addClass("messages");
    messages.attr("id","messages_"+user.id360);
    let ul = $("<ul></ul>").addClass("p-0");
//    ul.id = "contact_messaging" + user.id360;
    ul.attr("id",  "contact_messaging" + user.id360);
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
    let spin = $("<img>").attr("src",PathRecursos + "images/spin.gif");
    
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
    buttonAttachment.attr("type","button");
    buttonAttachment.attr("id","btn-adjunto");
    buttonAttachment.append(paperclip);
    buttonAttachment.css({"background-color":"grey"});
    
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
    inputAttachment.attr("id","inputAttachment"+ user.id360);
    inputAttachment.attr("class","d-none");
    inputAttachment.attr("type","file");
    inputAttachment.attr("name","attachment");
    
    /* Controles preview*/
    let rowPreview = $("<div></div>").addClass("row").attr("id","rowPreview").css({"display":"none"});
    let columPreview = $("<div></div>").addClass("col-12");
    columPreview.css({
        "background-color":"white",
        "padding":"0"
    });
    let containerPreview = $("<div></div>").attr("id","preview-attachment");
    columPreview.append(containerPreview);
    rowPreview.append(columPreview);
    
    let rowButtonAttachment = $("<div></div>").addClass("row").css({"display":"none"});
    
    let columnButtonCancel = $("<div></div>").addClass("col-6").css({"padding":"0"});
    let buttonCancelAttachment = $("<button>Cancelar</button>").attr("type","buttton").addClass("btn btn-block").css({"background-color":"grey"});
    columnButtonCancel.append(buttonCancelAttachment);
    
    let columnButtonSendAttachment = $("<div></div>").addClass("col-6").css({"padding":"0"});
    let buttonSendAttachment = $("<button>Enviar</button>").attr("type","button").addClass("btn btn-block").attr("id","sendAttachment");
    columnButtonSendAttachment.append(buttonSendAttachment);
    
    rowButtonAttachment.append(columnButtonCancel);
    rowButtonAttachment.append(columnButtonSendAttachment);
    
    let rowNameFile = $("<div></div>").addClass("row").css({"display":"none"});;
    let colName = $("<div></div>").addClass("col-12").css({"padding":"0"});
    let nameFile = $("<p></p>").attr("id","nombreArchivoPreview");
    nameFile.css({
        "margin":"0",
        "background-color":"white",
        "color":"black",
        "font-size":"1.3rem",
        "padding":"0 0 20px 0"
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

    div_llamar.append(llamar);
    social_media.append(div_llamar);
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

        reader.onload = function(){
            
            let nombreAdjunto = inputAttachment.val();
            let partesNombreAdjunto = nombreAdjunto.split(".");
            let extension = partesNombreAdjunto[partesNombreAdjunto.length-1];
            
            let partesPorDiagonal = nombreAdjunto.split("\\");
            let nombreCorto = partesPorDiagonal[partesPorDiagonal.length-1];
            
            
            let imagenPreview = $("<img>").css({"max-height":"200px"}).attr("src",PathRecursos + "images/icono_default.png");
            rowNameFile.css({"display":"block"});
            nameFile.text(nombreCorto);
            let tipo = "others";
            
            switch(extension){
                
                case "jpg":
                case "png":
                case "jpeg":
                case "gif":
                        imagenPreview.attr("src",reader.result);
                        imagenPreview.attr("target","_blanck");
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
            
            inputAttachment.data("extension",extension);
            inputAttachment.data("nombreCorto",nombreCorto);
            inputAttachment.data("tipo",tipo);
          
            //let img = $("<img>").attr("src",reader.result).css({"max-height":"200px"});

            containerPreview.empty().append(imagenPreview);
            rowChat.hide("fast",() => {
              rowPreview.show("fast");
              rowButtonAttachment.show("fast");
            });
          
        };
        
    });

    buttonCancelAttachment.click(() => {
        cierraAttachment();
    });
    
    const cierraAttachment = () => {
        rowPreview.hide("fast");
        rowButtonAttachment.hide("fast");
        rowNameFile.hide("fast");
        rowChat.show("fast");
    };
    
    buttonSendAttachment.click(() => {
        console.log("Enviando documentos");
        //guarda_adjunto(inputAttachment.attr("id"));
        divCargando.removeClass("d-none");
        guarda_adjunto_chat(inputAttachment.attr("id"),user.id360).then((response) => {

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
                        let extension = $("#inputAttachment"+ to).data("tipo");
                        let ruta = sesion_cookie.id_usuario + "_to_" + to + '/' + extension;
                        
                        var bucket = new AWS.S3({params: {Bucket: BucketName + "/attachmentsChats/"+ruta}});
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

    input.on('keydown', function (e) {
        if (e.which == 13) {
            send_chat_messages(input, ul, preview, user, messages);
            return false;
        }
    });

    li.click(() => {
        console.log(user);
        $(".content").addClass("d-none");
        content.removeClass("d-none");
    });

    div_llamar.click(() => {
        Swal.fire({
            text: "Iniciar una llamada con: " + user.nombre + " " + user.apellido_paterno + " " + user.apellido_materno,
            showCancelButton: true,
            focusConfirm: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: '<i class="fas fa-phone-volume"></i>Continuar',
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
                console.log(id360);
                RequestPOST("/API/notificacion/llamada360", id360).then((msj) => {
                    console.log(msj);
                    window.open('https://empresas360.ml/plataforma360/Llamada/' + msj.registro_llamada.idLlamada + '/' + msj.credenciales.apikey + '/' + msj.credenciales.idsesion + '/' + msj.credenciales.token + '', '_blank');

                });
            }
        });
    });
}

function send_chat_messages(input, ul, preview, user, messages, rutaAdjunto) {
    let mensaje = input.val();
    
    if(rutaAdjunto !== undefined && rutaAdjunto !== null && rutaAdjunto !== "")
        mensaje = rutaAdjunto;
    
    if ($.trim(mensaje) == '') {
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
        
        if(rutaAdjunto !== undefined && rutaAdjunto !== null && rutaAdjunto !== "")
            json.type = $("#inputAttachment"+ user.id360).data("extension");
        
        console.log(json);
        RequestPOST("/API/empresas360/chat", json).then((response) => {
            if (response.success) {
//                let li = $("<li></li>").addClass("sent");
                let li = $("<li></li>").addClass("replies");
                let img_message = $("<div></div>").addClass("img");
                img_message.css({
                    "background": "url('" + perfil.img + "')",
                    "background-size": "cover",
                    "background-position": "center",
                    "background-repeat": "no-repeat"
                });
                let message = $("<p></p>");
                
                if(rutaAdjunto !== undefined && rutaAdjunto !== null && rutaAdjunto !== ""){
                 
                    let extension = $("#inputAttachment"+ user.id360).data("extension");
                    let nombreCorto = $("#inputAttachment"+ user.id360).data("nombreCorto");
                    let imagenPreview = $("<img>").css({"max-width":"125px","max-height":"75px","margin-bottom":"10px"}).attr("src",PathRecursos + "images/icono_default.png");
                    
                    let saltoLinea = $("<br>");
                    let nombreAdjunto = $("<span></span>").css({"font-size":"1.1rem"});
                    nombreAdjunto.text(nombreCorto + " ");
                    
                    let buttonDownloadAttachment = $("<a></a>").addClass("btn btn-light").css({"margin-left":"10px"});
                    buttonDownloadAttachment.attr("href",rutaAdjunto);
                    buttonDownloadAttachment.attr("download",nombreCorto);
                    buttonDownloadAttachment.html('<i class="fas fa-download"></i>');
                    
                    nombreAdjunto.append(buttonDownloadAttachment);
                    
                    mensaje = nombreCorto;
                    
                    switch(extension){
                
                        case "jpg":
                        case "png":
                        case "jpeg":
                        case "gif":
                                imagenPreview.attr("src",rutaAdjunto);
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
                    message.append(nombreAdjunto);
                    
                }else
                    message.text(mensaje);
                
                li.append(img_message);
                li.append(message);
                ul.append(li);
                input.val("");
                preview.text("Yo: " + mensaje);
                $("#message_contacts").prepend( document.getElementById("profile_chat"+user.id360) );
                messages.animate({scrollTop: $(document).height()+100000}, "fast");

            }
        });
    }

}
function contact_messaging(user) {


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
        window.open('https://empresas360.ml/plataforma360/Llamada/' + mensaje.registro_llamada.idLlamada + '/' + mensaje.credenciales.apikey + '/' + mensaje.credenciales.idsesion + '/' + mensaje.credenciales.token + '', '_blank');

    });
});


$(".messages").animate({scrollTop: $(document).height()}, "fast");

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
    $(".messages").animate({scrollTop: $(document).height()}, "fast");
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