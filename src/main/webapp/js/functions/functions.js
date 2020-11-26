/* global CardV, cards, Llamadas */


//var  block = document.createElement("div");
//block.id="block";
//block.className="Paneblock";
//$("body").append(block);

$(document).ready(function () {
    console.log("ready!");
    if ($("#block").length) {
        document.getElementById("block").style = "display: none;";
//    block.style="width: 0; height: 0; opacity: 0.5;";
    }
});

////////////////////////Administrador***************

function InsertarCardVacia(CardV) {
    console.log("Inseertando Card vacia");
    console.log(CardV);
    var tarjeta = document.createElement("div");
    tarjeta.className = "col tarjeta";
    tarjeta.id = "card" + CardV;
    var body = document.createElement("div");
    body.className = "bodyTarjeta";
    var contenido = document.createElement("div");
    contenido.className = "contenidoTarjeta";
    var previewVideo = document.createElement("div");
    previewVideo.className = "previewVideo";
    var titulo = document.createElement("div");
    titulo.className = "tituloTarjeta";
    var video = document.createElement("div");
    video.className = "videoTarjeta";
    var formulario = document.createElement("div");
    formulario.className = "formularioTarjeta";
    var form = document.createElement("form");
    form.method = "POST";
    form.action = "/" + DEPENDENCIA + "/envioID";
    form.target = "_blank";
    //form.id = "FormContestar" + idLlamada;
    form.id = "FormContestar" + CardV;
    form.style = "width:90%; height: 100%;";
    form.acceptCharset = "ISO-8859-1";
    var divlabel = document.createElement("div");
    divlabel.className = "h-25 p-0 position-relative";
    var label = document.createElement("label");
    label.innerHTML = "ID de Usuario:";
    label.className = "labelTarjeta";
    label.style = "display:none;";
    var inputs = document.createElement("div");
    inputs.className = "h-25 p-0";
    var id = document.createElement("input");
    //id.id = "nombre" + idLlamada;
    id.id = "nombre" + CardV;
    id.className = "telefonoTarjeta";
    id.value = CardV;
    id.name = "id";
    id.type = "hidden";
    var numtel = document.createElement("input");
    //id.id = "nombre" + idLlamada;
    numtel.className = "telefonoTarjeta";
    numtel.disabled = true;
    numtel.style = "height: 80%;";
    var Data = document.createElement("input");
    Data.type = "hidden";
    //Data.id = "data";
    //Data.value = JSON.stringify(data);
    Data.name = "data";

    var divsub = document.createElement("div");
    divsub.className = "h-50 p-1 centerflex";
    var submit = document.createElement("input");
    submit.type = "submit";
    //submit.value = "Atender";
    submit.value = "En Espera";
    submit.className = "submitTarjeta";
    submit.disabled = "true";
    submit.style = "background: white; color: #1a202d; cursor: default;";
    //submit.id = "submit" + idLlamada;
    submit.id = "submit" + CardV;

    divlabel.appendChild(label);
    inputs.appendChild(numtel);
    inputs.appendChild(id);
    inputs.appendChild(Data);
    divsub.appendChild(submit);
    form.appendChild(divlabel);
    form.appendChild(inputs);
    form.appendChild(divsub);


    tarjeta.appendChild(body);
    previewVideo.appendChild(titulo);
    previewVideo.appendChild(video);
    contenido.appendChild(previewVideo);

    /*form.appendChild(label);
     form.appendChild(id);
     form.appendChild(Data);
     form.appendChild(submit);*/
    formulario.appendChild(form);

    body.appendChild(contenido);
    body.appendChild(formulario);
    document.getElementById("rejillamada").appendChild(tarjeta);
}
function HistorialLlamadas(data) {
    var idLlamada = data.RegistroLlamada.idLlamada;
    var idUsuario = data.RegistroLlamada.idUsuarios_Movil;
    var modo = data.Modo.nombre;
    var fecha = data.RegistroLlamada.fecha;
    var hora = data.RegistroLlamada.hora;
    var nombre = data.Usuarios_Movil.nombre + " " + data.Usuarios_Movil.apellido_paterno + " " + data.Usuarios_Movil.apellido_materno;
    //

    var contenedor = document.createElement("div");
    contenedor.style = "height: auto; background: #53ac7e; display: inline-block; margin-bottom:3px; width:100%; padding-top: 5px; padding-bottom: 10px;";
    contenedor.id = "H" + idLlamada;
    contenedor.name = "H" + idLlamada;
    var row = document.createElement("div");
    row.className = "row col-12 m-0 p-0";
    var div1 = document.createElement("div");
    div1.className = "col-12";
    div1.style = "padding-right: 5%; padding-left: 10%;";
    var llamada = document.createElement("p");
    llamada.style = "color:white; padding: 0; margin: 5px 0px 0px; font: 12px Arial; width: 100%; font-weight:bold;";
    llamada.innerHTML = nombre;
    llamada.id = "HPL" + idLlamada;
    var span = document.createElement("span");
    span.style = "color:white; padding:0; font:bold 12px Arial; width:fit-content; display:block; position:absolute; top:8px; right:10%;";
    span.innerHTML = idUsuario;
    llamada.appendChild(span);
    var date = document.createElement("p");
    date.style = "color: #dddddd; padding: 0; margin: 2px 20px 5px; font: 10px Arial;";
    date.innerHTML = fecha + " - " + hora;
    date.id = "HPD" + idLlamada;
    var pmodo = document.createElement("p");
    pmodo.style = "color: #dddddd; padding: 0; margin: 0; font: 10px Arial;";
    pmodo.innerHTML = modo;
    pmodo.id = "HPM" + idLlamada;
    var div2 = document.createElement("div");
    div2.className = "row col-12 m-0 p-0";
    var div2_a = document.createElement("div");
    div2_a.className = "col-6 m-0 p-0";
    var div2_b = document.createElement("div");
    div2_b.className = "col-6 m-0 p-0";
    div2_b.appendChild(date);
    div2_a.appendChild(pmodo)
    div2.appendChild(div2_a);
    div2.appendChild(div2_b);



    div1.appendChild(llamada);
    //div1.appendChild(date);
    div1.appendChild(div2);
    //div2.appendChild(boton);
    row.appendChild(div1);
    //row.appendChild(div2);
    contenedor.appendChild(row);
    document.getElementById("HistoricoLlamadas").insertBefore(contenedor, document.getElementById("HistoricoLlamadas").firstChild);
    //document.getElementById("collapseZero").appendChild(contenedor);


    contenedor.addEventListener("click", function () {
        //-
    });
}
function InsertarCard(data/*idUsr, modoLlamada, IDapikey, IDsesion, IDtoken, IDLlamada, ImgSrc, IdStreamUsuario, Origen, IdModoLlamada*/) {
    var idUsr = data.RegistroLlamada.idUsuarios_Movil;
    var idLlamada = data.RegistroLlamada.idLlamada;

    if ($(".terminarsesion" + idUsr).length) {
        $(".terminarsesion" + idUsr).click();
    }
    if (!$('#card' + idLlamada).length) {
        var estiloCard;
        var estiloParrafo;
        var estiloBotonContestar;

        if (data.llamadaSOSAltaPrioridad) {
            estiloCard = "padding: 6%; background-color:#8e0b09;border-radius: 0px; box-shadow: #191919 -2px 3px 20px 0px;";
            estiloParrafo = "text-align: center; margin:0; color: white; font: 15px arial bolder;background: #8e0b09;padding-bottom: 5px;";
            estiloBotonContestar = "background-color: #ffffff; border: none; border-radius: 25px; color: #8e0b09; text-align: center; text-decoration: none;  font: bold 13px Arial;  margin-left: 15%;  cursor: pointer; margin-top: 15px; margin-bottom: 10px; width: 70%; height: 24px;";
        } else {
            estiloCard = "padding: 6%; background-color:rgb(101, 101, 101);border-radius: 0px; box-shadow: #191919 -2px 3px 20px 0px;";
            estiloParrafo = "text-align: center; margin:0; color: white; font: 15px arial bolder;background: #646464;padding-bottom: 5px;";
            estiloBotonContestar = "background-color: #da291c; border: none; border-radius: 25px; color: white; text-align: center; text-decoration: none;  font: 12px Arial;  margin-left: 15%;  cursor: pointer; margin-top: 15px; margin-bottom: 10px; width: 70%; height: 24px;";
        }


        var modoLlamada = data.Modo.nombre;
//    var IdModoLlamada = data.RegistroLlamada.modo;
//    var IDapikey = data.Credenciales.apikey;
//    var IDsesion = data.Credenciales.sesion;
//    var IDtoken = data.Credenciales.token;
        if (data.Usuarios_Movil.hasOwnProperty("img")) {
//            var ImgSrc = data.Usuarios_Movil.img.replace(/(\r\n|\n|\r)/gm, "");
        } else if (data.Usuarios_Movil.hasOwnProperty("Img")) {
//            var ImgSrc = data.Usuarios_Movil.Img.replace(/(\r\n|\n|\r)/gm, "");
        }

//    var IdStreamUsuario = data.idconnection;
//    var Origen = data.origen;




        EliminarCardV(CardV - 1);


        var terminarsesion = document.createElement("button");
        terminarsesion.id = "terminarsesion" + idLlamada;
        terminarsesion.className = "terminarsesion" + idUsr;
        terminarsesion.style = "display:none;";

        var tarjeta = document.createElement("div");
        tarjeta.className = "col tarjeta";
        tarjeta.id = "card" + idLlamada;
        var body = document.createElement("div");
        body.className = "bodyTarjeta";
        var contenido = document.createElement("div");
        contenido.className = "contenidoTarjeta";
        var previewVideo = document.createElement("div");
        previewVideo.className = "previewVideo";
        previewVideo.id = "LogoContainer" + idLlamada;
        var titulo = document.createElement("div");
        titulo.className = "tituloTarjeta";
        titulo.style = "background: black;";
        var parrafo = document.createElement("p");
        parrafo.innerHTML = modoLlamada;
        parrafo.style = "margin: auto;font: bold 1em Arial;";
        titulo.appendChild(parrafo);
        var video = document.createElement("div");
        video.className = "videoTarjeta";
        video.id = idLlamada;
        var formulario = document.createElement("div");
        formulario.className = "formularioTarjeta";
        var form = document.createElement("form");
        form.method = "POST";
        form.action = "/" + DEPENDENCIA + "/envioID";
        form.target = "_blank";
        form.id = "FormContestar" + idLlamada;
        //form.id = "FormContestar" + CardV;
        form.style = "width:90%; height: 100%;";
        form.acceptCharset = "ISO-8859-1";
        var divlabel = document.createElement("div");
        divlabel.className = "h-25 p-0 position-relative";
        var label = document.createElement("label");
        label.innerHTML = "ID de Usuario:";
        label.className = "labelTarjeta";
        var inputs = document.createElement("div");
        inputs.className = "h-25 p-0";
        var id = document.createElement("input");
        id.id = "nombre" + idLlamada;
        id.className = "telefonoTarjeta";
        id.value = idLlamada;
        id.name = "id";
        id.type = "hidden";
        var numtel = document.createElement("input");
        numtel.className = "telefonoTarjeta";
        numtel.disabled = true;
        numtel.style = "height: 80%;";
        numtel.value = idLlamada;
        var Data = document.createElement("input");
        Data.type = "hidden";
        Data.id = "data" + idLlamada;
        Data.value = JSON.stringify(data);
        Data.name = "data";
        var tipo_usuario = document.createElement("input");
        tipo_usuario.type = "hidden";
        tipo_usuario.id = "tipo_usuario" + idLlamada;
        tipo_usuario.value = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
        tipo_usuario.name = "tipo_usuario";
        var tipo_servicio = document.createElement("input");
        tipo_servicio.type = "hidden";
        tipo_servicio.id = "tipo_servicio" + idLlamada;
        tipo_servicio.value = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio;
        tipo_servicio.name = "tipo_servicio";

        var divsub = document.createElement("div");
        divsub.className = "h-50 p-1 centerflex";
        var submit = document.createElement("input");
        submit.type = "submit";
        submit.value = "Atender";
        //submit.value = "En Espera";
        submit.className = "submitTarjeta";
        //submit.disabled = "true";
        //submit.style = "background: white; color: #1a202d; cursor: default;";
        submit.id = "submit" + idLlamada;
        //submit.id = "submit" + CardV;

        divlabel.appendChild(label);
        inputs.appendChild(numtel);
        inputs.appendChild(id);
        inputs.appendChild(Data);
        inputs.appendChild(tipo_usuario);
        inputs.appendChild(tipo_servicio);
        divsub.appendChild(submit);
        form.appendChild(divlabel);
        form.appendChild(inputs);
        form.appendChild(divsub);


        tarjeta.appendChild(body);
        previewVideo.appendChild(titulo);
        previewVideo.appendChild(video);
        contenido.appendChild(previewVideo);

        formulario.appendChild(form);
        formulario.appendChild(terminarsesion);

        body.appendChild(contenido);
        body.appendChild(formulario);



        var audioElement = document.createElement('audio');
        // indicamos el archivo de audio a cargar

        audioElement.setAttribute('src', '/' + DEPENDENCIA + '/resources/Audio/Llamada/Sparkle.ogg');
        //-
        /*audioElement.setAttribute('src', 'https://plataforma911.ml/Recursos/Audio/Llamada/Sparkle.ogg');*/
        if (!checkCookieOperador()) {
            // Si deseamos que una vez cargado empieze a sonar...
            audioElement.setAttribute('autoplay', 'autoplay');
        }
        //div.appendChild(logo);


        document.getElementById("rejillamada").insertBefore(tarjeta, document.getElementById("card"));

        if (!$("#H" + idLlamada).length) {
//           
            HistorialLlamadas(data);
        }



        console.log(form);
        submit.addEventListener("click", function (e) {
            console.log("ContestandoS");
            console.log(data);
            // e.preventDefault();


            var json = {
                "eliminarcard": true,
                "monitoreo": false,
                "idUsuario_Movil": idUsr,
                "idLlamada": idLlamada
            };
            EnviarMensajePorSocket(json);
        });

    }


}
function EliminarCardV(id) {
    var del = document.getElementById("card" + id);
    del.parentNode.removeChild(del);
    CardV--;
}
function ColocarImg(id, img) {
    //-

    if ($('#card' + id).length) {
        //
        if (!$('#' + id).length) {
            //
            //var div =document.getElementById(id);

            var div = document.createElement("div");
            div.id = id;
            div.style = "height: 90%; background-repeat: no-repeat; background-position: center;background-size: cover; -moz-background-size: cover;-webkit-background-size: cover; -o-background-size: cover";
            //var logo = document.createElement('img');
            if (img !== null && img !== "" && img !== undefined) {
                div.style.backgroundImage = "url('" + img.replace(/(\r\n|\n|\r)/gm, "") + "')";

            }

            //logo.style = "    width: 96%; margin-top: 30%; border-radius: 20px; box-shadow: -1px 4px 8px 0px black; margin-left: 2%;";
            //div.appendChild(logo);
            var span = document.createElement("span");
            span.className = "mx-auto";
            span.innerHTML = "El usuario ha dejado la llamada";
            span.style = "font: bold 13px Arial;color: white;position: absolute;width: 100 %;left:0;bottom: 5% ;text-shadow: 0 0 3px black;width: 100%;";
            document.getElementById("LogoContainer" + id).appendChild(div);
            document.getElementById("LogoContainer" + id).appendChild(span);
            //$("#"+id).css("background-image", "url('data:image/png;base64," + img.replace(/(\r\n|\n|\r)/gm, "") + "')");
        }
    }
}
function EliminarCard(id) {
    //-


    if ($("#card" + id).length) {
        //
        var del = document.getElementById("card" + id);
        del.parentNode.removeChild(del);
//        var indice = mostrados.indexOf(id);
//       //-
        cards--;
        console.log("Eliminando Card: " + id);
        console.log("InsertarCardVacia: " + CardV);
        InsertarCardVacia(CardV);
        CardV++;


        if (Llamadas.length > 0) {
            tarjeta(Llamadas[0]);
            Llamadas.shift();
            //-
        }
    }
}

//////////////////////sos************************
function DatosProyecto() {
    return Promise.resolve($.ajax({
        type: 'GET',
        url: '/' + DEPENDENCIA + '/DatosProyecto',
        contentType: "application/json",
        dataType: "json",
        success: function (p) {
            //
            //-
            document.getElementById("FireBaseAuthorization").value = p["FireBaseAuthorization"];
        },
        error: function (err) {
            //alert("No hay ubicacion para el usuario:" + idUsuarios_Movil);
            //
        }
    }));

}
function getFecha() {
    var hoy = new Date();


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
    return fecha;
}
function fecha_formato(d) {
    var hoy = new Date(d.replace(/-/g, '\/'));


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
    return fecha;
}

function getHora() {
    var hoy = new Date();
    var hora = hoy.getHours();
    var min = hoy.getMinutes();
    var seg = hoy.getSeconds();
    //Anteponiendo un 0 a la hora si son menos de 10 
    hora = hora < 10 ? '0' + hora : hora;
    //Anteponiendo un 0 a los minutos si son menos de 10 
    min = min < 10 ? '0' + min : min;
    //Anteponiendo un 0 a los segundos si son menos de 10 
    seg = seg < 10 ? '0' + seg : seg;


    var h = hora + ':' + min + ':' + seg;
    return h;
}
function vueModelIncidentes() {

    var json = (function () {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': catalogo,
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();

    //-
// register globally

    vue = new Vue({
        components: {
            Multiselect: window.VueMultiselect.default
        },
        data: {
            value: [],
            options: json
        },
        methods: {
            customLabel(option) {
                return  option.Incidente;
            },
            onChange(value) {

            },
            onSelect(op) {
                //-
                //-
                //-
                //-
                incidente = null;
                incidente = {Incidente: op.Incidente, id: op.id, Prioridad: op.Prioridad, Dependencias: op.Dependencias};
                document.getElementById("nivelemergencia").value = incidente.Prioridad;
                //-
            },
            onTouch() {
                //-
                //-
            }
        }
    }).$mount('#cniapp');
}
function dataG_LITE() {

    var json = {
        "idUsuarioSys": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys
    };
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": '/' + DEPENDENCIA + "/API/ConsultarBackupDirectorioLITE",
        contentType: "application/json",
        "method": "GET",
        /*"data": JSON.stringify(json),*/
        success: function (response) {
            //-
            //dataG = response;
        },
        error: function (err) {
            //-
        }
    };
    return Promise.resolve($.ajax(settings));

}
function dataG_FULL() {

    var json = {
        "idUsuarioSys": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys
    };
    var tipo_usuario = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
    var tipo_servicio = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio;
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": '/' + DEPENDENCIA + "/API/ConsultarBackupDirectorio/" + tipo_usuario + "/" + tipo_servicio,
        contentType: "application/json",
        "method": "GET",
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
/////////////////////////empresa*****************
function agregarVideo(session, stream) {
    var subscriberOptions = {
        insertMode: 'replace',
        fitMode: "contain"
    };

    var pos = NuevaUbicacion();
    session.subscribe(stream, pos, subscriberOptions, function callback(error) {
        if (error)
        {
            console.error('There was an error publishing: ', error.name, error.message);
        } else {
            //////////Evento para volver a subscribir el video en grande *******
            var event = document.createElement("div");
            event.className = "videoEvent";
            event.id = "Event" + pos;
            event.addEventListener("click", function ()
            {
                //
                var fullpos = fullcontainer();
                session.subscribe(stream, fullpos, subscriberOptions, function callback(error) {
                    if (error) {
                    }
                });
            });
            document.getElementById(pos).appendChild(event);
            //////////Colgar la llamada   ******
            var usrDesconectado = false;
            var colgar = document.createElement("input");
            colgar.className = "colgar";
            colgar.value = "";
            colgar.style.display = "none";
            colgar.addEventListener("click", function () {
                //
                //session.forceUnpublish(stream, function (error) {console.error(error);  });
                console.log(stream.connection);
                console.log(session.connection);
                console.log(session);
                session.forceDisconnect(session.connection, function (error) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Connection forced to disconnect: " + connection.id);
                    }
                });
                session.forceDisconnect(stream.connection.connectionId, function (error) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Connection forced to disconnect: " + connection.id);
                    }
                });
                usrDesconectado = true;
            });
            document.getElementById(pos).appendChild(colgar);
            //////////Colgar la llamada   por evento de publicador******
            if ($("#colgarPublisher").length) {
                $("#colgarPublisher").click(function () {
                    session.forceUnpublish(stream, function (error) {});
                    session.forceDisconnect(stream.connection);
                });
            }


            //


            //////////Solicitar Cambio de camara  ******
            var cambiarCam = document.createElement("input");
            cambiarCam.className = "cambiarCam";
            cambiarCam.value = "";
            cambiarCam.addEventListener("click", function () {
                //
                session.signal({
                    to: stream.connection,
                    type: 'cam-signal',
                    data: "126"
                }, function signalCallback(error) {
                    if (error) {
                        console.error('Error sending signal:', error.name, error.message);
                    } else {
                        msgTxt.value = '';
                    }
                });
            });
            document.getElementById(pos).appendChild(cambiarCam);



        }
    });

}
function agregarVideo_target(session, stream, target) {
    var subscriberOptions = {
        insertMode: 'replace',
        fitMode: "contain"
    };

    var pos = NuevaUbicacion_target(target);
    var subscriber =session.subscribe(stream, pos, subscriberOptions, function callback(error) {
        if (error)
        {
            console.error('There was an error publishing: ', error.name, error.message);
        } else {
            //////////Evento para volver a subscribir el video en grande *******
            var event = document.createElement("div");
            event.className = "videoEvent";
            event.id = "Event" + pos;
            event.addEventListener("click", function ()
            {
                //
                var fullpos = fullcontainer();
                session.subscribe(stream, fullpos, subscriberOptions, function callback(error) {
                    if (error) {
                    }
                });
            });
            document.getElementById(pos).appendChild(event);
            //////////Colgar la llamada   ******
            var usrDesconectado = false;
            var colgar = document.createElement("input");
            colgar.className = "colgar";
            colgar.value = "";
            colgar.style.display = "none";
            colgar.addEventListener("click", function () {
                //
                //session.forceUnpublish(stream, function (error) {console.error(error);  });
                console.log(stream.connection);
                console.log(session.connection);
                console.log(session);
                session.forceDisconnect(session.connection, function (error) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Connection forced to disconnect: " + connection.id);
                    }
                });
                session.forceDisconnect(stream.connection.connectionId, function (error) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Connection forced to disconnect: " + connection.id);
                    }
                });
                usrDesconectado = true;
            });
            document.getElementById(pos).appendChild(colgar);
            //////////Colgar la llamada   por evento de publicador******
            if ($("#colgarPublisher").length) {
                $("#colgarPublisher").click(function () {
                    session.forceUnpublish(stream, function (error) {});
                    session.forceDisconnect(stream.connection);
                });
            }


            //


            //////////Solicitar Cambio de camara  ******
            var cambiarCam = document.createElement("input");
            cambiarCam.className = "cambiarCam";
            cambiarCam.value = "";
            cambiarCam.addEventListener("click", function () {
                //
                session.signal({
                    to: stream.connection,
                    type: 'cam-signal',
                    data: "126"
                }, function signalCallback(error) {
                    if (error) {
                        console.error('Error sending signal:', error.name, error.message);
                    } else {
                        msgTxt.value = '';
                    }
                });
            });
//                  document.getElementById(pos).appendChild(cambiarCam);



        }
    });
    
    return subscriber;

}
function agregarVideoCard(session, stream, llamada) {

    InsertarCard(llamada);
    var subscriberOptions = {
        insertMode: 'replace',
        width: '100%',
        height: '90%',
        fitMode: "contain",
        subscribeToAudio: false
    };

    session.subscribe(stream, llamada.RegistroLlamada.idLlamada, subscriberOptions, function callback(error) {
        if (error)
        {
            console.error('There was an error publishing: ', error.name, error.message);
            EliminarCard(llamada.RegistroLlamada.idLlamada);
            session.forceUnpublish(stream, function (error) {
                if (error) {
                    //-
                } else {
                    //
                }
            });
            session.forceDisconnect(stream.connection);
            session.disconnect();
        } else {

            //////////Colgar la llamada   ******
            var colgar = document.createElement("input");
            colgar.className = "colgar";
            colgar.value = "";
            colgar.style = "display:none;";
            colgar.addEventListener("click", function () {
                session.forceUnpublish(stream, function (error) {
                    if (error) {
                        //-
                    } else {
                        //
                    }
                });
                session.forceDisconnect(stream.connection);
                usrDesconectado = true;
            });
            document.getElementById(llamada.RegistroLlamada.idLlamada).appendChild(colgar);

            //////////Solicitar Cambio de camara  ******
            var cambiarCam = document.createElement("input");
            cambiarCam.className = "cambiarCam";
            cambiarCam.value = "";
            cambiarCam.style = "display:none;";
            cambiarCam.addEventListener("click", function () {
                session.signal({
                    to: stream.connection,
                    type: 'cam-signal',
                    data: "126"
                }, function signalCallback(error) {
                    if (error) {
                        console.error('Error sending signal:', error.name, error.message);
                    }
                });
            });
            document.getElementById(llamada.RegistroLlamada.idLlamada).appendChild(cambiarCam);
        }
    });



}
function agregarStreamOperador(session, stream) {
    var subscriberOptions = {
        insertMode: 'replace',
        width: '100%',
        height: '100%'
    };

    var pos = NuevaUbicacionPublicador();
    session.subscribe(stream, pos, subscriberOptions, function callback(error) {
        if (error)
        {
            console.error('There was an error publishing: ', error.name, error.message);
        }
    });

}
function RegistrarDesconexion(connectionId) {


    var fueRegistrado = false
    var participantes = Object.keys(data.RegistroLlamada.participantes);

    for (var i = 0; i < participantes.length; i++) {
        if (data.RegistroLlamada.participantes[participantes[i]].connectionId === connectionId) {


            var hora_desconexion = getHora();
            //RegistrarDesconexionUsr(participantes[i], hora_desconexion);
            delete data.RegistroLlamada.participantes[participantes[i]].registroConexion;
            data.RegistroLlamada.participantes[participantes[i]].registroDesconexion = hora_desconexion;

            $("#card" + participantes[i]).remove();
            RemoverMarcador(participantes[i]);
            fueRegistrado = true;


            console.log(participantes[i]);
            var elemento = BuscarIntegranteDataG(participantes[i]);

            var gpsjson = {
                "idUsuarios_Movil": participantes[i],
                "lat": elemento.gps.lat,
                "lng": elemento.gps.lng,
                "fecha": elemento.gps.fecha,
                "hora": elemento.gps.hora,
                "ActualizaGPS": true,
                "motivo": "VLS"
            };
            EnviarMensajePorSocket(gpsjson);
            break;
        }
    }
    if (!fueRegistrado) {
        console.warn("usuario: no fue notificado.");
    }

}
function RegistrarConexion(idUsuario_Movil, connectionId) {
    //-
    var fueNotificado = false
    var participantes = Object.keys(data.RegistroLlamada.participantes);
    //-
    for (var i = 0; i < participantes.length; i++) {
        if (participantes[i] === idUsuario_Movil) {
            fueNotificado = true;
            //
            if (!data.RegistroLlamada.participantes[participantes[i]].registroConexion) {
                var hora_conexion = getHora();
                //
                //RegistrarConexionUsr(participantes[i], hora_conexion);
                data.RegistroLlamada.participantes[participantes[i]].registroConexion = hora_conexion;
                data.RegistroLlamada.participantes[participantes[i]].connectionId = connectionId;
            }
            break;
        }
    }
    if (!fueNotificado) {
        console.warn("usuario: " + idUsuario_Movil + " no fue notificado. Creando registro ---->");
        data.RegistroLlamada.participantes[idUsuario_Movil] = {};
        data.RegistroLlamada.participantes[idUsuario_Movil].registroConexion = hora_conexion;
        data.RegistroLlamada.participantes[idUsuario_Movil].connectionId = connectionId;
    }
    //-
}
function ActivarIconMapDG(gps_data) {
    var existe = false;
    for (var k = 0; k < markers.length; k++) {
        if (markers[k].id === gps_data.idUsuario_Movil) {
            if (markers[k].map !== null) {
                existe = true;
            }
            break;
        }
    }
    if (!existe) {
        for (var i = 0; i < dataG.integrantes.length; i++) {
            if (dataG.integrantes[i].idUsuarios_Movil === gps_data.idUsuario_Movil) {

                //
                dataG.integrantes[i].gps.moving = true;
                dataG.integrantes[i].gps.ult = gps_data;
                UpdateMarker(dataG.integrantes[i]);

                break;
            }
        }
    }

}
function enviarMensaje(session, from, mensaje) {
    var msj = {
        "value": from + ": " + mensaje,
        "fecha": getFecha(),
        "hora": getHora(),
        "idUsuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys,
        "username": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).nombre,
        "tipo": "texto"
    };
    session.signal({
        type: 'msg-signal',
        data: JSON.stringify(msj)
    }, function (error) {
        if (error) {
            console.error('Error sending signal:', error.name, error.message);
        } else {
            var msgTxt = document.querySelector('#msgTxt');
            msgTxt.value = "";
        }
    });
}
function enviarMensajeOT(session, type, json) {
//    var msj = {
//        "value": from+": "+mensaje,
//        "fecha": getFecha(),
//        "hora": getHora(),
//        "idUsuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys,
//        "username": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).nombre,
//        "tipo": "texto"
//    };
//    
//------------------
//    
//idUsuario
//lat
//lng
//nombre
//ap_p
//ap_m
//aliasD
//idUsuario
//idconnection
//session
//apikey
//token
//

    json.fecha = getFecha();
    json.hora = getHora();

    session.signal({
        type: type,
        data: JSON.stringify(json)
    }, function (error) {
        if (error) {
            console.error('Error sending signal:', error.name, error.message);
        }
    });
}
function insertarMensajePropio(json) {
    var msgHistory = document.querySelector('#history');

    var msj = JSON.parse(json);
    msj.tipo = "texto";
    chat.push(msj);
    var mine = document.createElement("div");
    mine.style = "padding: 5px; color: white; font: 15px Arial; text-align: left; height: fit-content;";
    mine.className = "col-6";
    var theirs = document.createElement("div");
    theirs.style = "padding: 5px; color: white; font: 15px Arial; text-align: right; height: fit-content;";
    theirs.className = "col-6";
    var empty = document.createElement("div");
    empty.style = "max-height:10px;";
    empty.className = "col-6";

    var info = document.createElement("div");
    info.style = "font:10px Arial;";


    var mensaje = document.createElement("div");

    mensaje.innerHTML = msj.value;
    mensaje.style = "background: #f58220;  border-radius: 10px; padding: 5px; color: white; font: 15px Arial; text-align: right; width: max-content; max-width: 145%;";
    info.innerHTML = msj.fecha + " - " + msj.hora
    mensaje.appendChild(info);
    mine.appendChild(mensaje);
    msgHistory.appendChild(mine);
    msgHistory.appendChild(empty);

    mine.scrollIntoView();

}
function insertarMensaje(json) {
    console.log(json);
    var msgHistory = document.querySelector('#history');


    var msj = JSON.parse(json);
    msj.tipo = "texto";
    chat.push(msj);
    var mine = document.createElement("div");
    mine.style = "padding: 5px; color: white; font: 15px Arial; text-align: left; height: fit-content;";
    mine.className = "col-6";
    var theirs = document.createElement("div");
    theirs.style = "padding: 5px; color: white; font: 15px Arial; text-align: right; height: fit-content;";
    theirs.className = "col-6";
    var empty = document.createElement("div");
    empty.style = "max-height:10px;";
    empty.className = "col-6";

    var info = document.createElement("div");
    info.style = "font:10px Arial;";

    var mensaje = document.createElement("div");

    mensaje.innerHTML = msj.value;
    mensaje.style = "background: #00a5b8; float: right; border-radius: 10px; padding: 5px; color: white; font: 15px Arial; text-align: right; width: max-content; max-width: 145%;";
    info.innerHTML = msj.fecha + " - " + msj.hora
    mensaje.appendChild(info);
    theirs.appendChild(mensaje);
    msgHistory.appendChild(empty);
    msgHistory.appendChild(theirs);

    theirs.scrollIntoView();
}
function insertarImagen(json) {
    console.log(json);
    var msgHistory = document.querySelector('#history');


    var msj = JSON.parse(json);
    chat.push(msj);
    var mine = document.createElement("div");
    mine.style = "padding: 5px; color: white; font: 15px Arial; text-align: left; height: fit-content;";
    mine.className = "col-6";
    var theirs = document.createElement("div");
    theirs.style = "padding: 5px; color: white; font: 15px Arial; text-align: right; height: fit-content;";
    theirs.className = "col-6";
    var empty = document.createElement("div");
    empty.style = "max-height:10px;";
    empty.className = "col-6";

    var info = document.createElement("div");
    info.style = "font:10px Arial;margin: 6px;";

    var mensaje = document.createElement("div");
    var img = document.createElement("div");
    img.style = "background-color: #00a5b8;;background-image: url('" + msj.value + "');background-size: cover;background-position: center; width: 100%;padding: 50%;background-repeat: no-repeat;border-radius: 5px;";
    mensaje.appendChild(img);
    //mensaje.innerHTML = msj.value;
    mensaje.style = "background: #00a5b8; float: right; border-radius: 10px; padding: 5px; color: white; font: 15px Arial; text-align: right; width: max-content; max-width: 145%;    width: 80%;";
    info.innerHTML = msj.fecha + " - " + msj.hora
    mensaje.appendChild(info);
    theirs.appendChild(mensaje);
    msgHistory.appendChild(empty);
    msgHistory.appendChild(theirs);

    theirs.scrollIntoView();
    var id = msj.value.split("/");
    id = id[id.length - 1];
    id = id.split(".")[0]
    console.log(id);
    msj.idFile = id;

    Agregar_ModalImagenes(msj);
    img.addEventListener("click", function () {
        console.log(msj);
        $("#modalImagenes").removeAttr("style");
        $(".carousel-inner div").removeClass("active");
        $("#" + msj.idFile).addClass("active");
    });
}
function mosaico(metodo) {
    if (metodo === "agregar") {
        var clase = "bloque";

        var x = $("#GRID *");
        if (count > 6) {
            clase = "bloque5-1";
            $.each(x, function (i) {
                var z = x[i];
                if (z.classList.contains("bloque")) {
                    z.className = clase + " bloque OT_root OT_subscriber OT_fit-mode-contain";
                }

            });
        } else {
            if (count > 4) {
                clase = "bloque4-1";
                $.each(x, function (i) {
                    var z = x[i];
                    if (z.classList.contains("bloque")) {
                        z.className = clase + " bloque OT_root OT_subscriber OT_fit-mode-contain";
                    }
                });
            } else {
                if (count > 2) {
                    clase = "bloque3-1";
                    $.each(x, function (i) {
                        var z = x[i];
                        if (z.classList.contains("bloque")) {
                            z.className = clase + " bloque OT_root OT_subscriber OT_fit-mode-contain";
                        }
                    });
                } else {
                    if (count > 1) {
                        clase = "bloque2-1";
                        $.each(x, function (i) {
                            var z = x[i];
                            if (z.classList.contains("bloque")) {
                                z.className = clase + " bloque OT_root OT_subscriber OT_fit-mode-contain";
                            }
                        });
                    }
                }
            }

        }
        return clase;
    } else if (metodo === "remover") {
        count--;

        var x = $("#GRID *");
        if (count > 7) {
            clase = "bloque5-1";
            $.each(x, function (i) {
                var z = x[i];
                if (z.classList.contains("bloque")) {
                    z.className = clase + " bloque OT_root OT_subscriber OT_fit-mode-contain";
                }

            });
        } else {
            if (count > 5) {
                clase = "bloque4-1";
                $.each(x, function (i) {
                    var z = x[i];
                    if (z.classList.contains("bloque")) {
                        z.className = clase + " bloque OT_root OT_subscriber OT_fit-mode-contain";
                    }
                });
            } else {
                if (count > 3) {
                    clase = "bloque3-1";
                    $.each(x, function (i) {
                        var z = x[i];
                        if (z.classList.contains("bloque")) {
                            z.className = clase + " bloque OT_root OT_subscriber OT_fit-mode-contain";
                        }
                    });
                } else {
                    if (count > 2) {
                        clase = "bloque2-1";
                        $.each(x, function (i) {
                            var z = x[i];
                            if (z.classList.contains("bloque")) {
                                z.className = clase + " bloque OT_root OT_subscriber OT_fit-mode-contain";
                            }
                        });
                    } else {
                        clase = "bloque";
                        $.each(x, function (i) {
                            var z = x[i];
                            if (z.classList.contains("bloque")) {
                                z.className = clase + " bloque OT_root OT_subscriber OT_fit-mode-contain";
                            }
                        });
                    }
                }
            }

        }

        return true;
    }

}
function mosaico_target(metodo, target) {
    if (metodo === "agregar") {
        var clase = "bloque";

        var x = $("#" + target + " *");
        if (count > 6) {
            clase = "bloque5-1";
            $.each(x, function (i) {
                var z = x[i];
                if (z.classList.contains("bloque")) {
                    z.className = clase + " bloque OT_root OT_subscriber OT_fit-mode-contain";
                }

            });
        } else {
            if (count > 4) {
                clase = "bloque4-1";
                $.each(x, function (i) {
                    var z = x[i];
                    if (z.classList.contains("bloque")) {
                        z.className = clase + " bloque OT_root OT_subscriber OT_fit-mode-contain";
                    }
                });
            } else {
                if (count > 2) {
                    clase = "bloque3-1";
                    $.each(x, function (i) {
                        var z = x[i];
                        if (z.classList.contains("bloque")) {
                            z.className = clase + " bloque OT_root OT_subscriber OT_fit-mode-contain";
                        }
                    });
                } else {
                    if (count > 1) {
                        clase = "bloque2-1";
                        $.each(x, function (i) {
                            var z = x[i];
                            if (z.classList.contains("bloque")) {
                                z.className = clase + " bloque OT_root OT_subscriber OT_fit-mode-contain";
                            }
                        });
                    }
                }
            }

        }
        return clase;
    } else if (metodo === "remover") {
        count--;

        var x = $("#" + target + " *");
        if (count > 7) {
            clase = "bloque5-1";
            $.each(x, function (i) {
                var z = x[i];
                if (z.classList.contains("bloque")) {
                    z.className = clase + " bloque OT_root OT_subscriber OT_fit-mode-contain";
                }

            });
        } else {
            if (count > 5) {
                clase = "bloque4-1";
                $.each(x, function (i) {
                    var z = x[i];
                    if (z.classList.contains("bloque")) {
                        z.className = clase + " bloque OT_root OT_subscriber OT_fit-mode-contain";
                    }
                });
            } else {
                if (count > 3) {
                    clase = "bloque3-1";
                    $.each(x, function (i) {
                        var z = x[i];
                        if (z.classList.contains("bloque")) {
                            z.className = clase + " bloque OT_root OT_subscriber OT_fit-mode-contain";
                        }
                    });
                } else {
                    if (count > 2) {
                        clase = "bloque2-1";
                        $.each(x, function (i) {
                            var z = x[i];
                            if (z.classList.contains("bloque")) {
                                z.className = clase + " bloque OT_root OT_subscriber OT_fit-mode-contain";
                            }
                        });
                    } else {
                        clase = "bloque";
                        $.each(x, function (i) {
                            var z = x[i];
                            if (z.classList.contains("bloque")) {
                                z.className = clase + " bloque OT_root OT_subscriber OT_fit-mode-contain";
                            }
                        });
                    }
                }
            }

        }

        return true;
    }

}
function NuevaUbicacion() {

    var clase = mosaico("agregar");
    var div = document.createElement("div");
    div.className = clase + " bloque";
    var idDiv = 1;
    while ($("#StreamOTk" + idDiv).length) {
        idDiv++;
    }
    div.id = "StreamOTk" + idDiv;
    document.getElementById("GRID").appendChild(div);
    div.scrollIntoView();
    count++;
    return "StreamOTk" + idDiv;
}
function NuevaUbicacion_target(target) {

    var clase = mosaico_target("agregar", target);
    var div = document.createElement("div");
    div.className = clase + " bloque";
    var idDiv = 1;
    while ($("#" + target + "StreamOTk" + idDiv).length) {
        idDiv++;
    }
    div.id = target + "StreamOTk" + idDiv;
    document.getElementById(target).appendChild(div);
    div.scrollIntoView();
    count++;
    return target + "StreamOTk" + idDiv;
}
function NuevaUbicacionPublicador() {

    var clase = "col-2 m-0 p-0";
    var div = document.createElement("div");
    div.className = clase;
    var idDiv = 1;
    while ($("#StreamOTkPublisher" + idDiv).length) {
        idDiv++;
    }
    div.id = "StreamOTkPublisher" + idDiv;
    document.getElementById("publishers").appendChild(div);
    countPublishers++;
    return "StreamOTkPublisher" + idDiv;
}
function fullcontainer() {
    var fc = $("#bloquefull");
    $.each(fc, function (i) {
        fc[i].remove();
    })
    var full = document.createElement("div");
    full.className = "bloquefull";
    full.id = "bloquefull";
    document.getElementById("GRID").appendChild(full);
    full.scrollIntoView();
    full.addEventListener("click", function () {
        $("#bloquefull").remove();
    });
    return "bloquefull";
}
function ContentInfoWindowLITE(elemento) {
    var claseBtnLlamar;
    var disabledBtnLlamar;
    var valueBtnLlamar;

    if (elemento.gps.estatus) {
        claseBtnLlamar = "botonllamada btn btn-outline-secondary btn-sm";
        disabledBtnLlamar = "disabled='true'";
        valueBtnLlamar = "En llamada";
    } else {
        claseBtnLlamar = "botonllamada btn btn-outline-success btn-sm";
        disabledBtnLlamar = "";
        valueBtnLlamar = "Llamar";
    }
    var img;
    if (elemento.img) {
        img = elemento.img.replace(/(\r\n|\n|\r)/gm, "");
    } else {
        img = PathRecursos + "Img/perfil.png";
    }
    return "<div class=\"contnr row col-12 m-0 p-0  pr-3 pb-3\"> \n\
            <div class=\"col-4 m-0 p-0\" style=\"width: 100%;height: calc(130px - 5rem);\"> \n\
            <div class=\"infowindow-img\" id=\"infowindowImg" + elemento.idUsuarios_Movil + "\" style=\"background-image:url('" + img + "')\"></div> \n\
            </div> \n\
            <div class=\"col-8 m-0 p-0 pl-2\" style=\" width: 100%;height: calc(130px - 5rem);\">\n\
            <div class=\"col-12 m-0 p-0 infWinServ\">\n\
            <h2 class=\"title infWinServText\">" + elemento.aliasServicio + "</h2></div>\n\
             <h2 class=\"title\">" + elemento.nombre + " " + elemento.apellido_paterno + " " + elemento.apellido_materno + "</h2> \n\
            <h2 class=\"subtitle\">Teléfono: " + elemento.telefono + "</h2> \n\
            <label class=\"subtitle\">Fecha: <label class=\"text\" id=\"infowindowfecha" + elemento.idUsuarios_Movil + "\">" + elemento.gps.fecha + "</label></label>\n\
            <label class=\"subtitle\">Hora: <label class=\"text\" id=\"infowindowhora" + elemento.idUsuarios_Movil + "\">" + elemento.gps.hora + "</label></label>\n\
            <br> <input " + disabledBtnLlamar + " type=\"hidden\" class=\"" + claseBtnLlamar + "\" id=\"LlamarFirebase:" + elemento.idUsuarios_Movil + "\" value=\"" + valueBtnLlamar + "\" onclick=\"ConfirmarLlamada(" + elemento.idUsuarios_Movil + ",'" + elemento.nombre + " " + elemento.apellido_paterno + " " + elemento.apellido_materno + "')\">\n\
            <input type=\"hidden\" class=\"show botonRuta btn btn-outline-info btn-sm\" id=\"Ruta\" value=\"Ver Ruta\">\n\
            <input type=\"hidden\" id=\"Ruta2\" class=\"show\"value=\"Ver Ruta 2\">\n\
            \n\</div> \n\
            </div>";
}
function ContentInfoWindowIntegrante(elemento) {
    var claseBtnLlamar;
    var disabledBtnLlamar;
    var valueBtnLlamar;

    if (elemento.gps.estatus) {
        claseBtnLlamar = "botonllamada btn btn-outline-secondary btn-sm";
        disabledBtnLlamar = "disabled='true'";
        valueBtnLlamar = "En llamada";
    } else {
        claseBtnLlamar = "botonllamada btn btn-outline-success btn-sm";
        disabledBtnLlamar = "";
        valueBtnLlamar = "Llamar";
    }
    var img;
    if (elemento.img) {
        img = elemento.img.replace(/(\r\n|\n|\r)/gm, "");
    } else {
        img = PathRecursos + "Img/perfil.png";
    }
    return "<div class=\"contnr row col-12 m-0 p-0  pr-3 pb-3\"> \n\
<div class=\"col-4 m-0 p-0\" style=\"width: 100%;height: calc(105px - 1rem);\"> \n\
<div class=\"infowindow-img\" id=\"infowindowImg" + elemento.idUsuarios_Movil + "\" style=\"background-image:url('" + img + "')\"></div> \n\
</div> \n\
<div class=\"col-8 m-0 p-0 pl-2\" style=\" width: 100%;height: calc(105px - 1rem);\">\n\
<div class=\"col-12 m-0 p-0 infWinServ\">\n\
<h2 class=\"title infWinServText\">" + elemento.aliasServicio + "</h2></div>\n\
 <h2 class=\"title\">" + elemento.nombre + " " + elemento.apellido_paterno + " " + elemento.apellido_materno + "</h2> \n\
<h2 class=\"subtitle\">Teléfono: " + elemento.telefono + "</h2> \n\
<label class=\"subtitle\">Fecha: <label class=\"text\" id=\"infowindowfecha" + elemento.idUsuarios_Movil + "\">" + elemento.gps.fecha + "</label></label>\n\
<label class=\"subtitle\">Hora: <label class=\"text\" id=\"infowindowhora" + elemento.idUsuarios_Movil + "\">" + elemento.gps.hora + "</label></label>\n\
<br> <input " + disabledBtnLlamar + " type=\"button\" class=\"" + claseBtnLlamar + "\" id=\"LlamarFirebase:" + elemento.idUsuarios_Movil + "\" value=\"" + valueBtnLlamar + "\" onclick=\"enviarNotificacionIndividual('" + elemento.idUsuarios_Movil + "','" + DEPENDENCIA + "')\">\n\
\n\
</div> \n\
</div>";
}

function ContentInfoWindowIntegranteEmpresas360(elemento) {
    var claseBtnLlamar;
    var disabledBtnLlamar;
    var valueBtnLlamar;

    if (elemento.gps.estatus) {
        claseBtnLlamar = "botonllamada btn btn-outline-secondary btn-sm";
        disabledBtnLlamar = "disabled='true'";
        valueBtnLlamar = "En llamada";
    } else {
        claseBtnLlamar = "botonllamada btn btn-outline-success btn-sm";
        disabledBtnLlamar = "";
        valueBtnLlamar = "Llamar";
    }
    var img;
    if (elemento.img) {
        img = elemento.img.replace(/(\r\n|\n|\r)/gm, "");
    } else {
        img = PathRecursos + "Img/perfil.png";
    }
    if (elemento.telefono === null || elemento.telefono === "null") {
        elemento.telefono = "-";
    }

    return "<div class=\"contnr row col-12 m-0 p-0  pr-3 pb-3\"> \n\
            <div class=\"col-4 m-0 p-0\" style=\"width: 100%;height: calc(130px - 1rem);\"> \n\
            <div class=\"infowindow-img\" id=\"infowindowImg" + elemento.idUsuarios_Movil + "\" style=\"background-image:url('" + img + "')\"></div> \n\
            </div> \n\
            <div class=\"col-8 m-0 p-0 pl-2\" style=\" width: 100%;height: calc(130px - 1rem);\">\n\
            <div class=\"col-12 m-0 p-0 infWinServ\">\n\
            <h2 class=\"title infWinServText\">" + elemento.aliasServicio + "</h2></div>\n\
             <h2 class=\"title\">" + elemento.nombre + " " + elemento.apellido_paterno + " " + elemento.apellido_materno + "</h2> \n\
            <h2 class=\"subtitle\">Teléfono: " + elemento.telefono + "</h2> \n\
            <label class=\"subtitle\">Fecha: <label class=\"text\" id=\"infowindowfecha" + elemento.idUsuarios_Movil + "\">" + elemento.gps.fecha + "</label></label>\n\
            <label class=\"subtitle\">Hora: <label class=\"text\" id=\"infowindowhora" + elemento.idUsuarios_Movil + "\">" + elemento.gps.hora + "</label></label>\n\
            <br> <input " + disabledBtnLlamar + " type=\"button\" class=\"" + claseBtnLlamar + "\" id=\"LlamarFirebase:" + elemento.idUsuarios_Movil + "\" value=\"" + valueBtnLlamar + "\" onclick=\"ConfirmarLlamada(" + elemento.idUsuarios_Movil + ",'" + elemento.nombre + " " + elemento.apellido_paterno + " " + elemento.apellido_materno + "')\">\n\
            <input type=\"button\" class=\"show botonRuta btn btn-outline-info btn-sm\" id=\"Ruta\" value=\"Ruta\">\n\
            <input type=\"button\" class=\"show botonMensaje btn btn-outline-info btn-sm\" id=\"Mensaje\" value=\"Mensaje\" onclick=\"mensajeIndividual(" + elemento.idUsuarios_Movil + ")\">\n\
            <input type=\"hidden\" id=\"Ruta2\" class=\"show\"value=\"Ver Ruta 2\">\n\
            \n\</div> \n\
            </div>";
}
function ContentInfoWindowIntegranteMonitoreoUnidades(elemento) {
    var claseBtnLlamar;
    var disabledBtnLlamar;
    var valueBtnLlamar;

    if (elemento.gps.estatus) {
        claseBtnLlamar = "botonllamada btn btn-outline-secondary btn-sm";
        disabledBtnLlamar = "disabled='true'";
        valueBtnLlamar = "En llamada";
    } else {
        claseBtnLlamar = "botonllamada btn btn-outline-success btn-sm";
        disabledBtnLlamar = "";
        valueBtnLlamar = "Llamar";
    }
    var img;
    if (elemento.img) {
        img = elemento.img.replace(/(\r\n|\n|\r)/gm, "");
    } else {
        img = PathRecursos + "Img/perfil.png";
    }

    return "<div class=\"contnr row col-12 m-0 p-0  pr-3 pb-3\"> \n\
            <div class=\"col-4 m-0 p-0\" style=\"width: 100%;height: calc(130px - 1rem);\"> \n\
            <div class=\"infowindow-img\" id=\"infowindowImg" + elemento.idUsuarios_Movil + "\" style=\"background-image:url('" + img + "')\"></div> \n\
            </div> \n\
            <div class=\"col-8 m-0 p-0 pl-2\" style=\" width: 100%;height: calc(130px - 1rem);\">\n\
            <div class=\"col-12 m-0 p-0 infWinServ\">\n\
            <h2 class=\"title infWinServText\">" + elemento.aliasServicio + "</h2></div>\n\
             <h2 class=\"title\">" + elemento.nombre + " " + elemento.apellido_paterno + " " + elemento.apellido_materno + "</h2> \n\
            <h2 class=\"subtitle\">Teléfono: " + elemento.telefono + "</h2> \n\
            <label class=\"subtitle\">Fecha: <label class=\"text\" id=\"infowindowfecha" + elemento.idUsuarios_Movil + "\">" + elemento.gps.fecha + "</label></label>\n\
            <label class=\"subtitle\">Hora: <label class=\"text\" id=\"infowindowhora" + elemento.idUsuarios_Movil + "\">" + elemento.gps.hora + "</label></label>\n\
            <br> <input " + disabledBtnLlamar + " type=\"button\" class=\"" + claseBtnLlamar + "\" id=\"LlamarFirebase:" + elemento.idUsuarios_Movil + "\" value=\"" + valueBtnLlamar + "\" onclick=\"ConfirmarLlamada(" + elemento.idUsuarios_Movil + ",'" + elemento.nombre + " " + elemento.apellido_paterno + " " + elemento.apellido_materno + "')\">\n\
            <input type=\"button\" class=\"show botonRuta btn btn-outline-info btn-sm\" id=\"Ruta\" value=\"Ruta\">\n\
            <input type=\"button\" class=\"show botonMensaje btn btn-outline-info btn-sm\" id=\"Mensaje\" value=\"Mensaje\" onclick=\"mensajeIndividual(" + elemento.idUsuarios_Movil + ")\">\n\
            <input type=\"hidden\" id=\"Ruta2\" class=\"show\"value=\"Ver Ruta 2\">\n\
            \n\</div> \n\
            </div>";
}

function ContentInfoWindowLlamar(json) {
    var claseBtnLlamar;
    var disabledBtnLlamar;
    var valueBtnLlamar;
    var elemento = BuscarIntegranteDataG(json.idUsuarios_Movil);
    if (elemento.gps.estatus) {
        claseBtnLlamar = "botonllamada btn btn-outline-secondary btn-sm";
        disabledBtnLlamar = "disabled='true'";
        valueBtnLlamar = "En llamada";
    } else {
        claseBtnLlamar = "botonllamada btn btn-outline-success btn-sm";
        disabledBtnLlamar = "";
        valueBtnLlamar = "Llamar";
    }
    /*json
     * img
     * nombre
     * apell_p
     * apell_m
     * gps.fecha
     * gps.hora
     * */
    return " <style>\n\
.infowindow-img{\n\
padding: 50%;\n\
    background-repeat: no-repeat;\n\
    background-position: center center;\n\
    background-size: cover;\n\
    border-radius: 5px;\n\
    background-image:url('" + json.img.replace(/(\r\n|\n|\r)/gm, "") + "');\n\
}\n\
.contnr{\n\
width:300px;\n\
}\n\
.title{\n\
    font: bold 13px Arial;\n\
    text-align: left;\n\
    margin: 2px;\n\
    margin-bottom: 8px;\n\
    text-overflow: ellipsis;\n\
    overflow: hidden;\n\
    white-space: nowrap;\n\
}\n\
\n\.subtitle{\n\
    font:bold 12px Arial;\n\
    text-align: left;\n\
    margin: 2px;\n\
    margin-bottom: 3px;\n\
    text-overflow: ellipsis;\n\
    overflow: hidden;\n\
    white-space: nowrap;\n\
    color:#40474f\n\
}\n\
\n\.text{\n\
    font: 12px Arial;\n\
    text-align: left;\n\
    margin: 2px;\n\
    margin-bottom: 3px;\n\
    text-overflow: ellipsis;\n\
    overflow: hidden;\n\
    white-space: nowrap;\n\
}\n\
.botonllamada{\n\
    width: 100%;\n\
    display: block;\n\
    position: absolute;\n\
    bottom: 0;\n\
}\n\
</style>\n\
<div class=\"contnr row col-12 m-0 p-0  pr-3 pb-3\">\n\
                                    <div class=\"col-5 m-0 p-0\"><div class=\"infowindow-img\" style=\"\"></div></div>\n\
                                    <div class=\"col-7 m-0 p-0 pl-2\">\n\
                                    <h2 class=\"title\">" + json.nombre + " " + json.apellido_paterno + " " + json.apellido_materno + "</h2>\n\
                                    <h2 class=\"subtitle\">Ultima Posición:</h2>\n\
                                    <label class=\"subtitle\">Fecha: </label>\n\
                                    <label class=\"text\" id=\"infowindowfecha" + json.idUsuarios_Movil + "\">" + json.gps.fecha + "</label>\n\
                                    <br>\n\
                                    <label class=\"subtitle\">Hora: </label>\n\
                                    <label class=\"text\" id=\"infowindowhora" + json.idUsuarios_Movil + "\">" + json.gps.hora + "</label>\n\
                                    <br> <input " + disabledBtnLlamar + " type=\"button\" class=\"" + claseBtnLlamar + "\" id=\"LlamarFirebase:" + json.idUsuarios_Movil + "\" value=\"" + valueBtnLlamar + "\" onclick=\"ConfirmarLlamada(" + json.idUsuarios_Movil + ",'" + json.nombre + " " + json.apellido_paterno + "')\">\n\
                                    </div>\n\
                               </div>";
}
function ContentInfoWindowHistoricoRuta(data, fecha) {


    var claseBtnLlamar;
    var disabledBtnLlamar;
    var valueBtnLlamar;

    if (data.Usuarios_Movil.gps.estatus) {
        claseBtnLlamar = "botonllamada btn btn-outline-secondary btn-sm";
        disabledBtnLlamar = "disabled='true'";
        valueBtnLlamar = "En llamada";
    } else {
        claseBtnLlamar = "botonllamada btn btn-outline-success btn-sm";
        disabledBtnLlamar = "";
        valueBtnLlamar = "Llamar";
    }
    var img;
    if (data.Usuarios_Movil.img) {
        img = data.Usuarios_Movil.img.replace(/(\r\n|\n|\r)/gm, "");
    } else {
        img = PathRecursos + "Img/perfil.png";
    }
    return "<div class=\"contnr row col-12 m-0 p-0  pr-3 pb-3\"> \n\
            <div class=\"col-4 m-0 p-0\" style=\"width: 100%;height: calc(130px - 1rem);\"> \n\
            <div class=\"infowindow-img\" id=\"infowindowImg" + data.Usuarios_Movil.idUsuarios_Movil + "\" style=\"background-image:url('" + img + "')\"></div> \n\
            </div> \n\
            <div class=\"col-8 m-0 p-0 pl-2\" style=\" width: 100%;height: calc(130px - 1rem);\">\n\
            <div class=\"col-12 m-0 p-0 infWinServ\">\n\
            <h2 class=\"title infWinServText\">" + data.Usuarios_Movil.aliasServicio + "</h2></div>\n\
             <h2 class=\"title\">" + data.Usuarios_Movil.nombre + " " + data.Usuarios_Movil.apellido_paterno + " " + data.Usuarios_Movil.apellido_materno + "</h2> \n\
            <h2 class=\"subtitle\">Teléfono: " + data.Usuarios_Movil.telefono + "</h2> \n\
            <h2 class=\"subtitle\">Ultima Posición</h2> \n\
            <label class=\"subtitle\">Fecha: <label class=\"text\" id=\"infowindowfecha" + data.Usuarios_Movil.idUsuarios_Movil + "\">" + fecha + "</label></label>\n\
            <label class=\"subtitle\">Hora: <label class=\"text\" id=\"infowindowhora" + data.Usuarios_Movil.idUsuarios_Movil + "\">" + data.Usuarios_Movil.gps.hora + "</label></label>\n\
            <br> <input " + disabledBtnLlamar + " type=\"hidden\" class=\"" + claseBtnLlamar + "\" id=\"LlamarFirebase:" + data.Usuarios_Movil.idUsuarios_Movil + "\" value=\"" + valueBtnLlamar + "\" onclick=\"ConfirmarLlamada(" + data.Usuarios_Movil.idUsuarios_Movil + ",'" + data.Usuarios_Movil.nombre + " " + data.Usuarios_Movil.apellido_paterno + " " + data.Usuarios_Movil.apellido_materno + "')\">\n\
            \n\</div> \n\
            </div>";
}
function RegistroNotificaciones(idUsers, idLlamada) {
    var json = {};
    if (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).hasOwnProperty("tipo_usuario") && JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).hasOwnProperty("tipo_servicio")) {
        json = {
            "idUsuarios_Movil": idUsers,
            "idLlamada": idLlamada,
            "fecha": getFecha(),
            "hora": getHora(),
            "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
            "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio
        };
    } else {
        json = {
            "idUsuarios_Movil": idUsers,
            "idLlamada": idLlamada,
            "fecha": getFecha(),
            "hora": getHora()
        };
    }
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/LlamadaSaliente/RegistrarNotificaciones',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(json),
        success: function (response) {



        },
        error: function (err) {

        }
    }));

}
function BuscarIntegranteDataG(id) {
    for (var i = 0; i < dataG.integrantes.length; i++) {

        if (dataG.integrantes[i].idUsuarios_Movil === id) {
            return dataG.integrantes[i];
            break;
        }
    }
    return null;
}
function InsertaCheck(idGrupo, integrantes) {

    var div = document.createElement("div");
    div.className = "custom-control custom-switch";
    div.style = "padding-left: 3rem;";

    var input = document.createElement("input");
    input.type = "checkbox";
    input.className = "custom-control-input";
    input.id = "input" + idGrupo;

    var label = document.createElement("label");
    label.setAttribute("for", "input" + idGrupo);
    label.className = "custom-control-label";

    div.appendChild(input);
    div.appendChild(label);

    document.getElementById("checkDiv" + idGrupo).appendChild(div);

    $("#input" + idGrupo).click(function () {
        var inputs = $("#accordion .custom-control-input");
        if (idGrupo.includes("Grupos")) {
            HabilitaChecks(idGrupo);
        } else {
            if (document.getElementById("input" + idGrupo).checked) {
                var IntegrantesFinales = mapeaIntegrantes(inputs, idGrupo);
                for (var i = 0; i < integrantes.length; i++) {
                    if (!IntegrantesFinales.includes(integrantes[i])) {
                        IntegrantesFinales.push(integrantes[i]);
                    }
                }
                var Integrantes = infoIntegrantes(IntegrantesFinales);


                colocarMarcadores(Integrantes);
                //}
            } else {
                for (var j = 0; j < markers.length; j++) {
                    markers[j].setMap(null);
                }
                var IntegrantesFinales = mapeaIntegrantes(inputs, idGrupo);
                var Integrantes = infoIntegrantes(IntegrantesFinales);
                if (Integrantes.length) {
                    colocarMarcadores(Integrantes);
                } else {
                    map.setZoom(5);
                }
            }
        }

    });
}
function mapeaIntegrantes(inputs, idGrupo) {
    var IntegrantesFinales = new Array();
    var personalizados = dataG.GruposPersonalizados;
    var automaticos = dataG.GruposAutomaticos;
    $.each(inputs, function (z) {
        var id = inputs[z].id;
        id = id.replace("input", "");
        if (idGrupo !== id) {
            if (inputs[z].checked) {
                for (var i = 0; i < personalizados.length; i++) {
                    if (personalizados[i].idgruposUsuarioSys === id) {
                        for (var j = 0; j < personalizados[i].integrantes.length; j++) {
                            if (!IntegrantesFinales.includes(personalizados[i].integrantes[j])) {
                                IntegrantesFinales.push(personalizados[i].integrantes[j]);
                            }
                        }
                        break;
                    }
                }
                for (var i = 0; i < automaticos.length; i++) {
                    if (automaticos[i].idgruposUsuarioSys === id) {
                        for (var j = 0; j < automaticos[i].integrantes.length; j++) {
                            if (!IntegrantesFinales.includes(automaticos[i].integrantes[j])) {
                                IntegrantesFinales.push(automaticos[i].integrantes[j]);
                            }
                        }
                        break;
                    }
                }
            }
        } else {
            if (!inputs[z].checked) {
                for (var i = 0; i < personalizados.length; i++) {
                    if (personalizados[i].idgruposUsuarioSys === id) {
                        var perso = document.getElementById("inputGruposPersonalizados");
                        if (perso.checked) {
                            perso.checked = false;
                        }
                        break;
                    }
                }
                for (var i = 0; i < automaticos.length; i++) {
                    if (automaticos[i].idgruposUsuarioSys === id) {
                        var auto = document.getElementById("inputGruposAutomáticos");
                        if (auto.checked) {
                            auto.checked = false;
                        }
                        break;
                    }
                }
            }
        }
    });
    return IntegrantesFinales;
}
function infoIntegrantes(IntegrantesFinales) {
    var Integrantes = new Array();
    for (var j = 0; j < IntegrantesFinales.length; j++) {
        for (var i = 0; i < dataG.integrantes.length; i++) {
            if (IntegrantesFinales[j] === dataG.integrantes[i].idUsuarios_Movil) {
                if (dataG.integrantes[i].gps.hasOwnProperty("fecha")) {
                    if (dataG.integrantes[i].gps.fecha !== "" && dataG.integrantes[i].gps.fecha === getFecha()) {
                        Integrantes.push(dataG.integrantes[i]);
                    }
                }
                break;
            }
        }
    }
    return Integrantes;
}
function HabilitaChecks(nombre) {
    var inputs = $("#accordion .custom-control-input");
    var automaticos = dataG.GruposAutomaticos;
    var personalizados = dataG.GruposPersonalizados;
    var input = document.getElementById("input" + nombre);
    if (nombre === "GruposAutomáticos") {
        if (input.checked) {
            $.each(inputs, function (z) {
                var id = inputs[z].id;
                id = id.replace("input", "");
                if (nombre !== id) {
                    for (var i = 0; i < automaticos.length; i++) {
                        if (automaticos[i].idgruposUsuarioSys === id) {
                            if (!inputs[z].checked) {
                                inputs[z].click();
                            }
                            break;
                        }
                    }
                }

            });
        } else {
            for (var j = 0; j < markers.length; j++) {
                markers[j].setMap(null);
            }
            $.each(inputs, function (z) {
                var id = inputs[z].id;
                id = id.replace("input", "");
                for (var i = 0; i < automaticos.length; i++) {
                    if (automaticos[i].idgruposUsuarioSys === id) {
                        if (inputs[z].checked) {
                            inputs[z].click();
                        }
                        break;
                    }
                }
            });
        }
    } else if (nombre === "GruposPersonalizados") {
        if (input.checked) {
            $.each(inputs, function (z) {
                var id = inputs[z].id;
                id = id.replace("input", "");
                for (var i = 0; i < personalizados.length; i++) {
                    if (personalizados[i].idgruposUsuarioSys === id) {
                        if (!inputs[z].checked) {
                            inputs[z].click();
                        }
                        break;
                    }
                }
            });
        } else {
            for (var j = 0; j < markers.length; j++) {
                markers[j].setMap(null);
            }
            $.each(inputs, function (z) {
                var id = inputs[z].id;
                id = id.replace("input", "");
                for (var i = 0; i < personalizados.length; i++) {
                    if (personalizados[i].idgruposUsuarioSys === id) {
                        if (inputs[z].checked) {
                            inputs[z].click();
                        }
                        break;
                    }
                }
            });
        }
    }
}
function ArchiveSession() {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": '/' + DEPENDENCIA + "/restOpentok/ArchiveSession",
        contentType: "application/json",
        "method": "POST",
        "data": JSON.stringify(data.Credenciales),
        success: function (response) {

        },
        error: function (err) {

        }
    };
    return Promise.resolve($.ajax(settings));

}
//////////////////////MAPA**************************************************************

function initMap() {
    if ($("#map").length) {
        console.log("inicializando mapa");
        map = new google.maps.Map(document.getElementById('map'), { zoom: 5, center: { lat: 19.503329, lng: -99.185714 } /*,mapTypeId:'satellite'*/ , styles: [{ featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: "off" }, { "weight": 1 }] }, { featureType: 'administrative', elementType: 'geometry.fill', stylers: [{ visibility: "on" }] }, { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ visibility: "off" }] }, { featureType: 'administrative', elementType: 'labels', stylers: [{ color: '#000000' }, { visibility: "off" }] }, { featureType: 'administrative.country', elementType: 'geometry', stylers: [{ color: '#a6a6a6' }, { visibility: "on" }, { "weight": 1.5 }] }, { featureType: 'administrative.country', elementType: 'labels', stylers: [{ visibility: "off" }] }, { featureType: 'administrative.country', elementType: 'labels.icon', stylers: [{ visibility: "off" }] }, { featureType: 'administrative.land_parcel', elementType: 'geometry', stylers: [{ visibility: "on" }] }, { featureType: 'administrative.land_parcel', elementType: 'labels', stylers: [{ visibility: "on" }] }, { featureType: 'administrative.land_parcel', elementType: 'labels.icon', stylers: [{ visibility: "off" }] }, { featureType: 'administrative.locality', elementType: 'geometry', stylers: [{ visibility: "on" }] }, { featureType: 'administrative.locality', elementType: 'labels', stylers: [{ visibility: "off" }] }, { featureType: 'administrative.locality', elementType: 'labels.icon', stylers: [{ visibility: "off" }] }, { featureType: 'administrative.neighborhood', elementType: 'geometry', stylers: [{ visibility: "on" }] }, { featureType: 'administrative.neighborhood', elementType: 'labels', stylers: [{ color: '#696969' }, { visibility: "simplified" }] }, { featureType: 'administrative.neighborhood', elementType: 'labels.icon', stylers: [{ visibility: "off" }] }, { featureType: 'administrative.province', elementType: 'geometry', stylers: [{ visibility: "on" }, { "weight": 1.5 }] }, { featureType: 'administrative.province', elementType: 'labels', stylers: [{ visibility: "off" }] }, { featureType: 'administrative.province', elementType: 'labels.icon', stylers: [{ visibility: "off" }] }, { featureType: "landscape", stylers: [{ color: '#D5D8DC' }] }, { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#D5D8DC' }] }, { featureType: 'landscape', elementType: 'labels', stylers: [{ visibility: "off" }] }, { featureType: 'landscape', elementType: 'labels.icon', stylers: [{ visibility: "off" }] }, { featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{ color: '#526081' }, { visibility: "off" }] }, { featureType: 'landscape.natural.landcover', elementType: 'geometry', stylers: [{ visibility: "off" }] }, { featureType: 'landscape.natural.landcover', elementType: 'labels.icon', stylers: [{ visibility: "off" }] }, { featureType: 'landscape.natural.terrain', elementType: 'geometry', stylers: [{ visibility: "off" }] }, { featureType: 'landscape.natural.terrain', elementType: 'labels', stylers: [{ visibility: "off" }] }, { featureType: 'landscape.natural.terrain', elementType: 'labels.icon', stylers: [{ visibility: "off" }] }, { featureType: 'poi', elementType: 'geometry', stylers: [{ visibility: "off" }] }, { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: "off" }] }, { featureType: 'poi', elementType: 'labels.icon', stylers: [{ visibility: "off" }] }, { featureType: 'road', elementType: 'geometry', stylers: [{ visibility: "simplified" }] }, { featureType: 'road', elementType: 'labels', stylers: [{ visibility: "simplified" }] }, { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: "off" }] }, { featureType: 'transit', elementType: 'geometry', stylers: [{ visibility: "off" }] }, { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: "off" }] }, { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: "off" }] }, { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#F2F4F4' }, { visibility: "on" }] }, { featureType: 'water', elementType: 'labels', stylers: [{ visibility: "off" }] }] });
        map.setTilt(45);
        geocoder = new google.maps.Geocoder;
        infowindow = new google.maps.InfoWindow({ maxWidth: 300 });
        RutaCamino = new google.maps.Polyline({ path: [], geodesic: true, strokeColor: '#18478d', strokeOpacity: 0.5, strokeWeight: 4 });
        RutaCamino0 = new google.maps.Polyline({ path: [], geodesic: true, strokeColor: '#18478d', strokeOpacity: 0.5, strokeWeight: 4 });
        RutaCamino1 = new google.maps.Polyline({ path: [], geodesic: true, strokeColor: '#1c447f', strokeOpacity: 0.5, strokeWeight: 4 });
        RutaCamino2 = new google.maps.Polyline({ path: [], geodesic: true, strokeColor: '#1f4071', strokeOpacity: 0.5, strokeWeight: 4 });
        RutaCamino3 = new google.maps.Polyline({ path: [], geodesic: true, strokeColor: '#223e65', strokeOpacity: 0.5, strokeWeight: 4 });
        RutaCamino4 = new google.maps.Polyline({ path: [], geodesic: true, strokeColor: '#263a57', strokeOpacity: 0.5, strokeWeight: 4 });
        RutaCamino5 = new google.maps.Polyline({ path: [], geodesic: true, strokeColor: '#283851', strokeOpacity: 0.5, strokeWeight: 4 });
        RutaCamino6 = new google.maps.Polyline({ path: [], geodesic: true, strokeColor: '#2a3648', strokeOpacity: 0.5, strokeWeight: 4 });
        RutaCamino7 = new google.maps.Polyline({ path: [], geodesic: true, strokeColor: '#2c3441', strokeOpacity: 0.5, strokeWeight: 4 });
        RutaCamino8 = new google.maps.Polyline({ path: [], geodesic: true, strokeColor: '#2f3236', strokeOpacity: 0.5, strokeWeight: 4 });
        RutaCamino9 = new google.maps.Polyline({ path: [], geodesic: true, strokeColor: '#303132', strokeOpacity: 0.5, strokeWeight: 4 });


        Circle = new google.maps.Circle({
            strokeColor: '#B0D1D3',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#B0D1D3',
            fillOpacity: 0.25,
            map: null,
            radius: 0
        });
        marcador = new google.maps.Marker({ map: map });
        console.log("Mapa inicializado: map");
        if ($("#d_autocompletar").length) {
            let input = document.getElementById("d_autocompletar");
            let autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo("bounds", map);
            // Set the data fields to return when the user selects a place.
            autocomplete.setFields(["address_components", "geometry", "icon", "name"]);
            infowindow = new google.maps.InfoWindow();
            var infowindowContent = document.createElement("div");
            infowindowContent.id = "infowindow-content";
            let img_wic = document.createElement("img");
            img_wic.width = "16";
            img_wic.height = "16";
            img_wic.id = "place-icon";
            let p_name = document.createElement("span");
            p_name.id = "place-name";
            p_name.className = "tittle";
            let p_addr = document.createElement("span");
            p_addr.id = "place-address";
            infowindowContent.appendChild(img_wic);
            infowindowContent.appendChild(p_name);
            infowindowContent.appendChild(document.createElement("br"));
            infowindowContent.appendChild(p_addr);
            //        infowindow.setContent(infowindowContent);
            autocomplete.addListener("place_changed", () => {


                if ($("#pais").length) {
                    $("#pais").val("");
                }
                if ($("#estado").length) {
                    $("#estado").val("");
                }
                if ($("#ciudad_municipio").length) {
                    $("#ciudad_municipio").val("");
                }
                if ($("#colonia").length) {
                    $("#colonia").val("");
                }
                if ($("#calle").length) {
                    $("#calle").val("");
                }
                if ($("#cp").length) {
                    $("#cp").val("");
                }
                if (marcador !== null) {
                    marcador.setMap(null);
                }
                marcador = new google.maps.Marker({
                    map,
                    anchorPoint: new google.maps.Point(0, -29),
                    draggable: true
                });
                infowindow.close();
                marcador.setVisible(false);
                const place = autocomplete.getPlace();
                if (!place.geometry) {
                    // User entered the name of a Place that was not suggested and
                    // pressed the Enter key, or the Place Details request failed.
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }

                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(17); // Why 17? Because it looks good.
                }
                marcador.setPosition(place.geometry.location);
                marcador.setVisible(true);
                let address = "";
                if (place.address_components) {
                    address = [
                        (place.address_components[0] &&
                            place.address_components[0].short_name) ||
                        "",
                        (place.address_components[1] &&
                            place.address_components[1].short_name) ||
                        "",
                        (place.address_components[2] &&
                            place.address_components[2].short_name) ||
                        ""
                    ].join(" ");
                }
                for (var i = 0; i < place.address_components.length; i++) {
                    let types = place.address_components[i].types;
                    for (var j = 0; j < types.length; j++) {
                        let type = types[j];
                        if (type === "country") {
                            console.log("Pais: " + place.address_components[i].long_name);
                            if ($("#pais").length) {
                                $("#pais").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "administrative_area_level_1") {
                            console.log("Estado: " + place.address_components[i].long_name);
                            if ($("#estado").length) {
                                $("#estado").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "locality") {
                            console.log("Ciudad o Municipio: " + place.address_components[i].long_name);
                            if ($("#ciudad_municipio").length) {
                                $("#ciudad_municipio").val(place.address_components[i].long_name);
                            }
                            if ($("#municipio").length) {
                                $("#municipio").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "sublocality_level_1") {
                            console.log("colonia: " + place.address_components[i].long_name);
                            if ($("#colonia").length) {
                                $("#colonia").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "route") {
                            console.log("Calle: " + place.address_components[i].long_name);
                            if ($("#calle").length) {
                                $("#calle").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "postal_code") {
                            console.log("CP: " + place.address_components[i].long_name);
                            if ($("#cp").length) {
                                $("#cp").val(place.address_components[i].long_name);
                            }
                        }
                    }
                }
                console.log(address);
                console.log(place);
                console.log(infowindowContent);
                //            infowindowContent.children["place-icon"].src = place.icon;
                //            infowindowContent.children["place-name"].textContent = place.name;
                //            infowindowContent.children["place-address"].textContent = address;
                //            infowindow.open(map, marcador);
            });
        }
    } else {
        console.log("No se pudo inicializar el mapa 1");
    }

}

function initMap2() {
    if ($("#map2").length) {
        console.log("inicializando mapa");
        map2 = new google.maps.Map(document.getElementById('map2'), {zoom: 5, center: {lat: 19.503329, lng: -99.185714}/*,mapTypeId:'satellite'*/, styles: [{featureType: 'administrative', elementType: 'geometry', stylers: [{visibility: "off"}, {"weight": 1}]}, {featureType: 'administrative', elementType: 'geometry.fill', stylers: [{visibility: "on"}]}, {featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{visibility: "off"}]}, {featureType: 'administrative', elementType: 'labels', stylers: [{color: '#000000'}, {visibility: "off"}]}, {featureType: 'administrative.country', elementType: 'geometry', stylers: [{color: '#a6a6a6'}, {visibility: "on"}, {"weight": 1.5}]}, {featureType: 'administrative.country', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.country', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.land_parcel', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.land_parcel', elementType: 'labels', stylers: [{visibility: "on"}]}, {featureType: 'administrative.land_parcel', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.locality', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.locality', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.locality', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.neighborhood', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.neighborhood', elementType: 'labels', stylers: [{color: '#696969'}, {visibility: "simplified"}]}, {featureType: 'administrative.neighborhood', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.province', elementType: 'geometry', stylers: [{visibility: "on"}, {"weight": 1.5}]}, {featureType: 'administrative.province', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.province', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: "landscape", stylers: [{color: '#D5D8DC'}]}, {featureType: 'landscape', elementType: 'geometry', stylers: [{color: '#D5D8DC'}]}, {featureType: 'landscape', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'landscape', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{color: '#526081'}, {visibility: "off"}]}, {featureType: 'landscape.natural.landcover', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.landcover', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'road', elementType: 'geometry', stylers: [{visibility: "simplified"}]}, {featureType: 'road', elementType: 'labels', stylers: [{visibility: "simplified"}]}, {featureType: 'road', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'water', elementType: 'geometry', stylers: [{color: '#F2F4F4'}, {visibility: "on"}]}, {featureType: 'water', elementType: 'labels', stylers: [{visibility: "off"}]}]});
        map2.setTilt(45);
        geocoder2 = new google.maps.Geocoder;
        infowindow2 = new google.maps.InfoWindow({maxWidth: 300});



        marcador2 = new google.maps.Marker({map: map2});
        console.log("Mapa inicializado: map");
        if ($("#d_autocompletar2").length) {
            let input = document.getElementById("d_autocompletar2");
            let autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo("bounds", map2);
            // Set the data fields to return when the user selects a place.
            autocomplete.setFields(["address_components", "geometry", "icon", "name"]);
            infowindow2 = new google.maps.InfoWindow();
            var infowindowContent = document.createElement("div");
            infowindowContent.id = "infowindow-content";
            let img_wic = document.createElement("img");
            img_wic.width = "16";
            img_wic.height = "16";
            img_wic.id = "place-icon";
            let p_name = document.createElement("span");
            p_name.id = "place-name";
            p_name.className = "tittle";
            let p_addr = document.createElement("span");
            p_addr.id = "place-address";
            infowindowContent.appendChild(img_wic);
            infowindowContent.appendChild(p_name);
            infowindowContent.appendChild(document.createElement("br"));
            infowindowContent.appendChild(p_addr);
//        infowindow.setContent(infowindowContent);
            autocomplete.addListener("place_changed", () => {


                if ($("#pais2").length) {
                    $("#pais2").val("");
                }
                if ($("#estado2").length) {
                    $("#estado2").val("");
                }
                if ($("#ciudad_municipio2").length) {
                    $("#ciudad_municipio2").val("");
                }
                if ($("#colonia2").length) {
                    $("#colonia2").val("");
                }
                if ($("#calle2").length) {
                    $("#calle2").val("");
                }
                if ($("#cp2").length) {
                    $("#cp2").val("");
                }
                if (marcador2 !== null) {
                    marcador2.setMap(null);
                }
                marcador2 = new google.maps.Marker({
                    map2,
                    anchorPoint: new google.maps.Point(0, -29),
                    draggable: true
                });
                infowindow2.close();
                marcador2.setVisible(false);
                const place = autocomplete.getPlace();
                if (!place.geometry) {
                    // User entered the name of a Place that was not suggested and
                    // pressed the Enter key, or the Place Details request failed.
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }

                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    map2.fitBounds(place.geometry.viewport);
                } else {
                    map2.setCenter(place.geometry.location);
                    map2.setZoom(17); // Why 17? Because it looks good.
                }
                marcador2.setPosition(place.geometry.location);
                marcador2.setVisible(true);
                marcador2.setMap(map2);
                let address = "";
                if (place.address_components) {
                    address = [
                        (place.address_components[0] &&
                                place.address_components[0].short_name) ||
                                "",
                        (place.address_components[1] &&
                                place.address_components[1].short_name) ||
                                "",
                        (place.address_components[2] &&
                                place.address_components[2].short_name) ||
                                ""
                    ].join(" ");
                }
                for (var i = 0; i < place.address_components.length; i++) {
                    let types = place.address_components[i].types;
                    for (var j = 0; j < types.length; j++) {
                        let type = types[j];
                        if (type === "country") {
                            console.log("Pais: " + place.address_components[i].long_name);
                            if ($("#pais2").length) {
                                $("#pais2").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "administrative_area_level_1") {
                            console.log("Estado: " + place.address_components[i].long_name);
                            if ($("#estado2").length) {
                                $("#estado2").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "locality") {
                            console.log("Ciudad o Municipio: " + place.address_components[i].long_name);
                            if ($("#ciudad_municipio2").length) {
                                $("#ciudad_municipio2").val(place.address_components[i].long_name);
                            }
                            if ($("#municipio2").length) {
                                $("#municipio2").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "sublocality_level_1") {
                            console.log("colonia: " + place.address_components[i].long_name);
                            if ($("#colonia2").length) {
                                $("#colonia2").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "route") {
                            console.log("Calle: " + place.address_components[i].long_name);
                            if ($("#calle2").length) {
                                $("#calle2").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "postal_code") {
                            console.log("CP: " + place.address_components[i].long_name);
                            if ($("#cp2").length) {
                                $("#cp2").val(place.address_components[i].long_name);
                            }
                        }
                    }
                }
                console.log(address);
                console.log(place);
                console.log(infowindowContent);
//            infowindowContent.children["place-icon"].src = place.icon;
//            infowindowContent.children["place-name"].textContent = place.name;
//            infowindowContent.children["place-address"].textContent = address;
//            infowindow.open(map, marcador);
            });
        }
    }
}
function initMap3() {
    if ($("#map3").length) {
        console.log("inicializando mapa");
        map3 = new google.maps.Map(document.getElementById('map3'), {zoom: 5, center: {lat: 19.503329, lng: -99.185714}/*,mapTypeId:'satellite'*/, styles: [{featureType: 'administrative', elementType: 'geometry', stylers: [{visibility: "off"}, {"weight": 1}]}, {featureType: 'administrative', elementType: 'geometry.fill', stylers: [{visibility: "on"}]}, {featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{visibility: "off"}]}, {featureType: 'administrative', elementType: 'labels', stylers: [{color: '#000000'}, {visibility: "off"}]}, {featureType: 'administrative.country', elementType: 'geometry', stylers: [{color: '#a6a6a6'}, {visibility: "on"}, {"weight": 1.5}]}, {featureType: 'administrative.country', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.country', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.land_parcel', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.land_parcel', elementType: 'labels', stylers: [{visibility: "on"}]}, {featureType: 'administrative.land_parcel', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.locality', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.locality', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.locality', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.neighborhood', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.neighborhood', elementType: 'labels', stylers: [{color: '#696969'}, {visibility: "simplified"}]}, {featureType: 'administrative.neighborhood', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.province', elementType: 'geometry', stylers: [{visibility: "on"}, {"weight": 1.5}]}, {featureType: 'administrative.province', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.province', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: "landscape", stylers: [{color: '#D5D8DC'}]}, {featureType: 'landscape', elementType: 'geometry', stylers: [{color: '#D5D8DC'}]}, {featureType: 'landscape', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'landscape', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{color: '#526081'}, {visibility: "off"}]}, {featureType: 'landscape.natural.landcover', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.landcover', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'road', elementType: 'geometry', stylers: [{visibility: "simplified"}]}, {featureType: 'road', elementType: 'labels', stylers: [{visibility: "simplified"}]}, {featureType: 'road', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'water', elementType: 'geometry', stylers: [{color: '#F2F4F4'}, {visibility: "on"}]}, {featureType: 'water', elementType: 'labels', stylers: [{visibility: "off"}]}]});
        map3.setTilt(45);
        geocoder3 = new google.maps.Geocoder;
        infowindow3 = new google.maps.InfoWindow({maxWidth: 300});



        marcador3 = new google.maps.Marker({map: map3});
        console.log("Mapa inicializado: map");
        if ($("#d_autocompletar3").length) {
            let input = document.getElementById("d_autocompletar3");
            let autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo("bounds", map3);
            // Set the data fields to return when the user selects a place.
            autocomplete.setFields(["address_components", "geometry", "icon", "name"]);
            infowindow3 = new google.maps.InfoWindow();
            var infowindowContent = document.createElement("div");
            infowindowContent.id = "infowindow-content";
            let img_wic = document.createElement("img");
            img_wic.width = "16";
            img_wic.height = "16";
            img_wic.id = "place-icon";
            let p_name = document.createElement("span");
            p_name.id = "place-name";
            p_name.className = "tittle";
            let p_addr = document.createElement("span");
            p_addr.id = "place-address";
            infowindowContent.appendChild(img_wic);
            infowindowContent.appendChild(p_name);
            infowindowContent.appendChild(document.createElement("br"));
            infowindowContent.appendChild(p_addr);
//        infowindow.setContent(infowindowContent);
            autocomplete.addListener("place_changed", () => {


                if ($("#pais3").length) {
                    $("#pais3").val("");
                }
                if ($("#estado3").length) {
                    $("#estado3").val("");
                }
                if ($("#ciudad_municipio3").length) {
                    $("#ciudad_municipio3").val("");
                }
                if ($("#colonia3").length) {
                    $("#colonia3").val("");
                }
                if ($("#calle3").length) {
                    $("#calle3").val("");
                }
                if ($("#cp3").length) {
                    $("#cp3").val("");
                }
                if (marcador3 !== null) {
                    marcador3.setMap(null);
                }
                marcador3 = new google.maps.Marker({
                    map3,
                    anchorPoint: new google.maps.Point(0, -29),
                    draggable: true
                });
                infowindow3.close();
                marcador3.setVisible(false);
                const place = autocomplete.getPlace();
                if (!place.geometry) {
                    // User entered the name of a Place that was not suggested and
                    // pressed the Enter key, or the Place Details request failed.
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }

                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    map3.fitBounds(place.geometry.viewport);
                } else {
                    map3.setCenter(place.geometry.location);
                    map3.setZoom(17); // Why 17? Because it looks good.
                }
                marcador3.setPosition(place.geometry.location);
                marcador3.setVisible(true);
                marcador3.setMap(map3);
                let address = "";
                if (place.address_components) {
                    address = [
                        (place.address_components[0] &&
                                place.address_components[0].short_name) ||
                                "",
                        (place.address_components[1] &&
                                place.address_components[1].short_name) ||
                                "",
                        (place.address_components[2] &&
                                place.address_components[2].short_name) ||
                                ""
                    ].join(" ");
                }
                for (var i = 0; i < place.address_components.length; i++) {
                    let types = place.address_components[i].types;
                    for (var j = 0; j < types.length; j++) {
                        let type = types[j];
                        if (type === "country") {
                            console.log("Pais: " + place.address_components[i].long_name);
                            if ($("#pais3").length) {
                                $("#pais3").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "administrative_area_level_1") {
                            console.log("Estado: " + place.address_components[i].long_name);
                            if ($("#estado3").length) {
                                $("#estado3").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "locality") {
                            console.log("Ciudad o Municipio: " + place.address_components[i].long_name);
                            if ($("#ciudad_municipio3").length) {
                                $("#ciudad_municipio3").val(place.address_components[i].long_name);
                            }
                            if ($("#municipio3").length) {
                                $("#municipio3").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "sublocality_level_1") {
                            console.log("colonia: " + place.address_components[i].long_name);
                            if ($("#colonia3").length) {
                                $("#colonia3").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "route") {
                            console.log("Calle: " + place.address_components[i].long_name);
                            if ($("#calle3").length) {
                                $("#calle3").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "postal_code") {
                            console.log("CP: " + place.address_components[i].long_name);
                            if ($("#cp3").length) {
                                $("#cp3").val(place.address_components[i].long_name);
                            }
                        }
                    }
                }
                console.log(address);
                console.log(place);
                console.log(infowindowContent);
//            infowindowContent.children["place-icon"].src = place.icon;
//            infowindowContent.children["place-name"].textContent = place.name;
//            infowindowContent.children["place-address"].textContent = address;
//            infowindow.open(map, marcador);
            });
        }
    }
}
function initMap4() {
    if ($("#map4").length) {
        console.log("inicializando mapa");
        map4 = new google.maps.Map(document.getElementById('map4'), {zoom: 5, center: {lat: 19.503329, lng: -99.185714}/*,mapTypeId:'satellite'*/, styles: [{featureType: 'administrative', elementType: 'geometry', stylers: [{visibility: "off"}, {"weight": 1}]}, {featureType: 'administrative', elementType: 'geometry.fill', stylers: [{visibility: "on"}]}, {featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{visibility: "off"}]}, {featureType: 'administrative', elementType: 'labels', stylers: [{color: '#000000'}, {visibility: "off"}]}, {featureType: 'administrative.country', elementType: 'geometry', stylers: [{color: '#a6a6a6'}, {visibility: "on"}, {"weight": 1.5}]}, {featureType: 'administrative.country', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.country', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.land_parcel', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.land_parcel', elementType: 'labels', stylers: [{visibility: "on"}]}, {featureType: 'administrative.land_parcel', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.locality', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.locality', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.locality', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.neighborhood', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.neighborhood', elementType: 'labels', stylers: [{color: '#696969'}, {visibility: "simplified"}]}, {featureType: 'administrative.neighborhood', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.province', elementType: 'geometry', stylers: [{visibility: "on"}, {"weight": 1.5}]}, {featureType: 'administrative.province', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.province', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: "landscape", stylers: [{color: '#D5D8DC'}]}, {featureType: 'landscape', elementType: 'geometry', stylers: [{color: '#D5D8DC'}]}, {featureType: 'landscape', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'landscape', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{color: '#526081'}, {visibility: "off"}]}, {featureType: 'landscape.natural.landcover', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.landcover', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'road', elementType: 'geometry', stylers: [{visibility: "simplified"}]}, {featureType: 'road', elementType: 'labels', stylers: [{visibility: "simplified"}]}, {featureType: 'road', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'water', elementType: 'geometry', stylers: [{color: '#F2F4F4'}, {visibility: "on"}]}, {featureType: 'water', elementType: 'labels', stylers: [{visibility: "off"}]}]});
        map4.setTilt(45);
        geocoder4 = new google.maps.Geocoder;
        infowindow4 = new google.maps.InfoWindow({maxWidth: 300});



        marcador4 = new google.maps.Marker({map: map4});
        console.log("Mapa inicializado: map");
        if ($("#d_autocompletar4").length) {
            let input = document.getElementById("d_autocompletar4");
            let autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo("bounds", map4);
            // Set the data fields to return when the user selects a place.
            autocomplete.setFields(["address_components", "geometry", "icon", "name"]);
            infowindow4 = new google.maps.InfoWindow();
            var infowindowContent = document.createElement("div");
            infowindowContent.id = "infowindow-content";
            let img_wic = document.createElement("img");
            img_wic.width = "16";
            img_wic.height = "16";
            img_wic.id = "place-icon";
            let p_name = document.createElement("span");
            p_name.id = "place-name";
            p_name.className = "tittle";
            let p_addr = document.createElement("span");
            p_addr.id = "place-address";
            infowindowContent.appendChild(img_wic);
            infowindowContent.appendChild(p_name);
            infowindowContent.appendChild(document.createElement("br"));
            infowindowContent.appendChild(p_addr);
//        infowindow.setContent(infowindowContent);
            autocomplete.addListener("place_changed", () => {


                if ($("#pais4").length) {
                    $("#pais4").val("");
                }
                if ($("#estado4").length) {
                    $("#estado4").val("");
                }
                if ($("#ciudad_municipio4").length) {
                    $("#ciudad_municipio4").val("");
                }
                if ($("#colonia4").length) {
                    $("#colonia4").val("");
                }
                if ($("#calle4").length) {
                    $("#calle4").val("");
                }
                if ($("#cp4").length) {
                    $("#cp4").val("");
                }
                if (marcador4 !== null) {
                    marcador4.setMap(null);
                }
                marcador4 = new google.maps.Marker({
                    map4,
                    anchorPoint: new google.maps.Point(0, -29),
                    draggable: true
                });
                infowindow4.close();
                marcador4.setVisible(false);
                const place = autocomplete.getPlace();
                if (!place.geometry) {
                    // User entered the name of a Place that was not suggested and
                    // pressed the Enter key, or the Place Details request failed.
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }

                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    map4.fitBounds(place.geometry.viewport);
                } else {
                    map4.setCenter(place.geometry.location);
                    map4.setZoom(17); // Why 17? Because it looks good.
                }
                marcador4.setPosition(place.geometry.location);
                marcador4.setVisible(true);
                marcador4.setMap(map4);
                let address = "";
                if (place.address_components) {
                    address = [
                        (place.address_components[0] &&
                                place.address_components[0].short_name) ||
                                "",
                        (place.address_components[1] &&
                                place.address_components[1].short_name) ||
                                "",
                        (place.address_components[2] &&
                                place.address_components[2].short_name) ||
                                ""
                    ].join(" ");
                }
                for (var i = 0; i < place.address_components.length; i++) {
                    let types = place.address_components[i].types;
                    for (var j = 0; j < types.length; j++) {
                        let type = types[j];
                        if (type === "country") {
                            console.log("Pais: " + place.address_components[i].long_name);
                            if ($("#pais4").length) {
                                $("#pais4").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "administrative_area_level_1") {
                            console.log("Estado: " + place.address_components[i].long_name);
                            if ($("#estado4").length) {
                                $("#estado4").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "locality") {
                            console.log("Ciudad o Municipio: " + place.address_components[i].long_name);
                            if ($("#ciudad_municipio4").length) {
                                $("#ciudad_municipio4").val(place.address_components[i].long_name);
                            }
                            if ($("#municipio4").length) {
                                $("#municipio4").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "sublocality_level_1") {
                            console.log("colonia: " + place.address_components[i].long_name);
                            if ($("#colonia4").length) {
                                $("#colonia4").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "route") {
                            console.log("Calle: " + place.address_components[i].long_name);
                            if ($("#calle4").length) {
                                $("#calle4").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "postal_code") {
                            console.log("CP: " + place.address_components[i].long_name);
                            if ($("#cp4").length) {
                                $("#cp4").val(place.address_components[i].long_name);
                            }
                        }
                    }
                }
                console.log(address);
                console.log(place);
                console.log(infowindowContent);
//            infowindowContent.children["place-icon"].src = place.icon;
//            infowindowContent.children["place-name"].textContent = place.name;
//            infowindowContent.children["place-address"].textContent = address;
//            infowindow.open(map, marcador);
            });
        }
    }

}
function initMap5() {
    if ($("#map5").length) {
        console.log("inicializando mapa");
        map5 = new google.maps.Map(document.getElementById('map5'), {zoom: 5, center: {lat: 19.503329, lng: -99.185714}/*,mapTypeId:'satellite'*/, styles: [{featureType: 'administrative', elementType: 'geometry', stylers: [{visibility: "off"}, {"weight": 1}]}, {featureType: 'administrative', elementType: 'geometry.fill', stylers: [{visibility: "on"}]}, {featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{visibility: "off"}]}, {featureType: 'administrative', elementType: 'labels', stylers: [{color: '#000000'}, {visibility: "off"}]}, {featureType: 'administrative.country', elementType: 'geometry', stylers: [{color: '#a6a6a6'}, {visibility: "on"}, {"weight": 1.5}]}, {featureType: 'administrative.country', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.country', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.land_parcel', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.land_parcel', elementType: 'labels', stylers: [{visibility: "on"}]}, {featureType: 'administrative.land_parcel', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.locality', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.locality', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.locality', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.neighborhood', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.neighborhood', elementType: 'labels', stylers: [{color: '#696969'}, {visibility: "simplified"}]}, {featureType: 'administrative.neighborhood', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.province', elementType: 'geometry', stylers: [{visibility: "on"}, {"weight": 1.5}]}, {featureType: 'administrative.province', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.province', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: "landscape", stylers: [{color: '#D5D8DC'}]}, {featureType: 'landscape', elementType: 'geometry', stylers: [{color: '#D5D8DC'}]}, {featureType: 'landscape', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'landscape', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{color: '#526081'}, {visibility: "off"}]}, {featureType: 'landscape.natural.landcover', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.landcover', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'road', elementType: 'geometry', stylers: [{visibility: "simplified"}]}, {featureType: 'road', elementType: 'labels', stylers: [{visibility: "simplified"}]}, {featureType: 'road', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'water', elementType: 'geometry', stylers: [{color: '#F2F4F4'}, {visibility: "on"}]}, {featureType: 'water', elementType: 'labels', stylers: [{visibility: "off"}]}]});
        map5.setTilt(45);
        geocoder5 = new google.maps.Geocoder;
        infowindow5 = new google.maps.InfoWindow({maxWidth: 300});



        marcador5 = new google.maps.Marker({map: map5});
        console.log("Mapa inicializado: map");
        if ($("#d_autocompletar5").length) {
            let input = document.getElementById("d_autocompletar5");
            let autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo("bounds", map5);
            // Set the data fields to return when the user selects a place.
            autocomplete.setFields(["address_components", "geometry", "icon", "name"]);
            infowindow5 = new google.maps.InfoWindow();
            var infowindowContent = document.createElement("div");
            infowindowContent.id = "infowindow-content";
            let img_wic = document.createElement("img");
            img_wic.width = "16";
            img_wic.height = "16";
            img_wic.id = "place-icon";
            let p_name = document.createElement("span");
            p_name.id = "place-name";
            p_name.className = "tittle";
            let p_addr = document.createElement("span");
            p_addr.id = "place-address";
            infowindowContent.appendChild(img_wic);
            infowindowContent.appendChild(p_name);
            infowindowContent.appendChild(document.createElement("br"));
            infowindowContent.appendChild(p_addr);
//        infowindow.setContent(infowindowContent);
            autocomplete.addListener("place_changed", () => {


                if ($("#pais5").length) {
                    $("#pais5").val("");
                }
                if ($("#estado5").length) {
                    $("#estado5").val("");
                }
                if ($("#ciudad_municipio5").length) {
                    $("#ciudad_municipio5").val("");
                }
                if ($("#colonia5").length) {
                    $("#colonia5").val("");
                }
                if ($("#calle5").length) {
                    $("#calle5").val("");
                }
                if ($("#cp5").length) {
                    $("#cp5").val("");
                }
                if (marcador5 !== null) {
                    marcador5.setMap(null);
                }
                marcador5 = new google.maps.Marker({
                    map5,
                    anchorPoint: new google.maps.Point(0, -29),
                    draggable: true
                });
                infowindow5.close();
                marcador5.setVisible(false);
                const place = autocomplete.getPlace();
                if (!place.geometry) {
                    // User entered the name of a Place that was not suggested and
                    // pressed the Enter key, or the Place Details request failed.
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }

                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    map5.fitBounds(place.geometry.viewport);
                } else {
                    map5.setCenter(place.geometry.location);
                    map5.setZoom(17); // Why 17? Because it looks good.
                }
                marcador5.setPosition(place.geometry.location);
                marcador5.setVisible(true);
                marcador5.setMap(map5);
                let address = "";
                if (place.address_components) {
                    address = [
                        (place.address_components[0] &&
                                place.address_components[0].short_name) ||
                                "",
                        (place.address_components[1] &&
                                place.address_components[1].short_name) ||
                                "",
                        (place.address_components[2] &&
                                place.address_components[2].short_name) ||
                                ""
                    ].join(" ");
                }
                for (var i = 0; i < place.address_components.length; i++) {
                    let types = place.address_components[i].types;
                    for (var j = 0; j < types.length; j++) {
                        let type = types[j];
                        if (type === "country") {
                            console.log("Pais: " + place.address_components[i].long_name);
                            if ($("#pais5").length) {
                                $("#pais5").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "administrative_area_level_1") {
                            console.log("Estado: " + place.address_components[i].long_name);
                            if ($("#estado5").length) {
                                $("#estado5").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "locality") {
                            console.log("Ciudad o Municipio: " + place.address_components[i].long_name);
                            if ($("#ciudad_municipio5").length) {
                                $("#ciudad_municipio5").val(place.address_components[i].long_name);
                            }
                            if ($("#municipio5").length) {
                                $("#municipio5").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "sublocality_level_1") {
                            console.log("colonia: " + place.address_components[i].long_name);
                            if ($("#colonia5").length) {
                                $("#colonia5").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "route") {
                            console.log("Calle: " + place.address_components[i].long_name);
                            if ($("#calle5").length) {
                                $("#calle5").val(place.address_components[i].long_name);
                            }
                        }
                        if (type === "postal_code") {
                            console.log("CP: " + place.address_components[i].long_name);
                            if ($("#cp5").length) {
                                $("#cp5").val(place.address_components[i].long_name);
                            }
                        }
                    }
                }
                console.log(address);
                console.log(place);
                console.log(infowindowContent);
//            infowindowContent.children["place-icon"].src = place.icon;
//            infowindowContent.children["place-name"].textContent = place.name;
//            infowindowContent.children["place-address"].textContent = address;
//            infowindow.open(map, marcador);
            });
        }
    }

}
function addSlider() {
    rango = 500;
    var slider = new Slider("#range", {
        reversed: true
    });
    slider.on("slide", function (sliderValue) {
        rango = sliderValue;
        addCircle();
        //-
    });
}
function addCircle() {

    if (Circle !== null) {
        Circle.setMap(map);
    }
    Circle.setRadius(rango);
    Circle.setCenter(new google.maps.LatLng(Latitud, Longitud));

}
function moveCircle(lat, lng) {
    Circle.setCenter(new google.maps.LatLng(lat, lng));
}
function geocodeLatLng(marker) {

    var latlng = {lat: Latitud, lng: Longitud};
    geocoder.geocode({'location': latlng}, function (results, status) {

        if (status === 'OK')
        {

            if (results[0])
            {

                for (var i = 0; i < results.length; i++)
                {
                    if (CP !== null)
                        break;
                    for (var j = 0; j < results[i].address_components.length; j++)
                    {
                        if (CP !== null)
                            break;
                        for (var z = 0; z < results[i].address_components[j].types.length; z++)
                        {
                            if (results[i].address_components[j].types[z] === "postal_code")
                            {

                                CP = results[i].address_components[j].short_name;
                                //alert("codigo postal: "+CP);
                            }
                        }

                    }
                }

                for (var i = 0; i < results.length; i++)
                {
                    if (estado !== null)
                        break;
                    for (var j = 0; j < results[i].address_components.length; j++) {

                        if (estado !== null)
                            break;
                        for (var z = 0; z < results[i].address_components[j].types.length; z++) {


                            if (results[i].address_components[j].types[z] === "administrative_area_level_1") {

                                estado = results[i].address_components[j].short_name.toUpperCase().slice(0, 3);
                                estadoLong = results[i].address_components[j].long_name;

                                //alert("Estado: "+estado);
                            }
                            if (results[i].address_components[j].types[z] === "sublocality_level_1") {

                                colonia = results[i].address_components[j].short_name;

                                //alert("Colonia: "+colonia);
                            }
                            if (results[i].address_components[j].types[z] === "locality") {

                                municipio = results[i].address_components[j].short_name;

                                //alert("Municipio: "+municipio);
                            }
                            if (estado !== null && colonia !== null && municipio !== null) {
                                break;
                            }
                        }

                    }
                }
                //
                GeoCodeResult = results[0].formatted_address;
                direccion = GeoCodeResult;
                infowindow.setContent("<div style=\"margin: 3px;font: 13px Arial;\">" + GeoCodeResult + "</div>");
                infowindow.open(map, marker);

            } else {
                //
            }
        } else {
            //
        }
    });
}
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
function clearMarkers() {
    // Removes the markers from the map, but keeps them in the array.
    setMapOnAll(null);
}
function showMarkers() {
    // Shows any markers currently in the array.
    setMapOnAll(map);
}
function deleteMarkers() {
    // Deletes all markers in the array by removing references to them.
    clearMarkers();
    markers = [];
}
function SetMarker(elemento) {
    elemento.gps.lat = parseFloat(elemento.gps.lat);
    elemento.gps.lng = parseFloat(elemento.gps.lng);
    var marker = new google.maps.Marker({position: elemento.gps,
        map: map
    });
    var icon;
    if (!elemento.icon) {

        BackupIcon(elemento.idUsuarios_Movil).then(function (response) {
            if (response.icon) {
                elemento.icon = response.icon;
            }
            if (elemento.icon !== "" && elemento.icon !== "undefined" && elemento.icon !== undefined && elemento.icon !== null && elemento.icon !== "NULL") {
                icon = {
                    url: elemento.icon, // url
                    scaledSize: new google.maps.Size(49, 50), // scaled size
                    origin: new google.maps.Point(0, 0), // origin
                    anchor: new google.maps.Point(25, 50) // anchor
                };

                marker.setIcon(icon);



            } else {
                elemento.icon = PathRecursos + 'Img/IconoMap/Marcador.png';
                icon = {
                    url: PathRecursos + 'Img/IconoMap/Marcador.png', // url
                    scaledSize: new google.maps.Size(49, 50), // scaled size
                    origin: new google.maps.Point(0, 0), // origin
                    anchor: new google.maps.Point(25, 50) // anchor
                };

                marker.setIcon(icon);


            }

        });

    } else {

        icon = {

            url: elemento.icon, // url
            scaledSize: new google.maps.Size(49, 50), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(25, 50) // anchor
        };
        marker.setIcon(icon);
    }
    marker.set("id", elemento.idUsuarios_Movil);
    if (!elemento.img) {
        BackupImage(elemento.idUsuarios_Movil).then(function (response) {
            if (response.existe) {
                for (var i = 0; i < dataG.integrantes.length; i++) {

                    if (dataG.integrantes[i].idUsuarios_Movil === elemento.idUsuarios_Movil) {
                        dataG.integrantes[i].img = response.img;
                        elemento.img = response.img;
                        marker.addListener('click', function () {
                            infowindow.close;
                            infowindow.setOptions({maxWidth: 300});
                            infowindow.setContent(ContentInfoWindowLITE(elemento));
                            infowindow.open(map, marker);
                        });
                        break;
                    }
                }
            }
        });
    } else {
        marker.addListener('click', function () {
            infowindow.close;
            infowindow.setOptions({maxWidth: 300});
            infowindow.setContent(ContentInfoWindowLITE(elemento));

            infowindow.open(map, marker);
        });
    }
    markers.push(marker);
}
function SetMarkerSOS(elemento) {

    var has_marker = false;
    for (var i = 0; i < markers.length; i++) {
        if (elemento.idUsuarios_Movil === markers[i].id) {
            markers[i].setMap(null);
            markers[i].id = "vacio";
            //markers[i].set("id","");
            has_marker = true;

            break;
        }
    }
    //-
    if (!has_marker) {
        console.warn("No se encontro el marcador con id: " + elemento.idUsuarios_Movil);
    }

    var marker = new google.maps.Marker({position: elemento.gps,
        map: map
    });
    var icon;

    //if (elemento.icon.includes("Data:image/png;base64,")) {
    icon = {

        url: elemento.icon, // url
        scaledSize: new google.maps.Size(49, 50), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(25, 50) // anchor
    };
//    } else {
//        icon = {
//            url: hostdir + '/' + DEPENDENCIA + '/resources/Img/IconoMap/Marcador.png', // url
//            scaledSize: new google.maps.Size(49, 50), // scaled size
//            origin: new google.maps.Point(0, 0), // origin
//            anchor: new google.maps.Point(25, 50) // anchor
//        };
//    }
    marker.setIcon(icon);

    marker.set("id", elemento.idUsuarios_Movil);


    marker.addListener('click', function () {
        infowindow.close;
        infowindow.setOptions({maxWidth: 300});
        geocodeLatLng(marker);
    });

    geocodeLatLng(marker);



    markers.push(marker);
}
function SetMarkerIntegrante(elemento) {
    //-
    //-
    var marker = new google.maps.Marker({position: elemento.gps,
        map: map
    });
    var icon;
    icon = {
        url: PathRecursos + 'Img/Icons/icon.png', // url
        scaledSize: new google.maps.Size(25, 25), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(13, 25) // anchor
    };

    marker.setIcon(icon);

    marker.set("id", elemento.idUsuarios_Movil);

    marker.addListener('click', function () {

        if (!elemento.img) {
            BackupImage(elemento.idUsuarios_Movil).then(function (response) {
                if (response.existe) {
                    for (var i = 0; i < dataG.integrantes.length; i++) {

                        if (dataG.integrantes[i].idUsuarios_Movil === elemento.idUsuarios_Movil) {
                            dataG.integrantes[i].img = response.img;
                            elemento.img = response.img;
                            if ($("#infowindowImg" + elemento.idUsuarios_Movil).length) {
                                document.getElementById("infowindowImg" + elemento.idUsuarios_Movil).style = "background-repeat: no-repeat;    background-position:center;    background-size: cover;    -moz-background-size: cover;    -webkit-background-size: cover;    -o-background-size: cover;";
                                document.getElementById("infowindowImg" + elemento.idUsuarios_Movil).style.backgroundImage = "url('" + elemento.img.replace(/(\r\n|\n|\r)/gm, "") + "')";
                            }
                            break;
                        }
                    }
                }
            });
        }
        infowindow.close;
        infowindow.setOptions({maxWidth: 350});
        infowindow.setContent(ContentInfoWindowIntegrante(elemento));
        infowindow.open(map, marker);
    });

    markers.push(marker);
}
function SetMarkerIconIntegrante(id) {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].id === id) {
            var icon;
            icon = {
                url: PathRecursos + 'Img/Icons/icon.png', // url
                scaledSize: new google.maps.Size(25, 25), // scaled size
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(13, 25) // anchor
            };

            markers[i].setIcon(icon);
            break;
        }
    }
}
function moveMarker(id) {
    var procede = true;
    try {
        if (data.RegistroLlamada.idUsuarios_Movil === id) {
            procede = false;
        }
    } catch (e) {
    }
    if (procede) {


        var marcador;
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].id === id) {
                marcador = markers[i];
                break;
            }
        }

        if (marcador !== undefined) {

            for (var k = 0; k < dataG.integrantes.length; k++) {
                if (dataG.integrantes[k].idUsuarios_Movil === id) {

                    var delta = 1000;
                    var destinoLat = parseFloat(dataG.integrantes[k].gps.ult.lat);
                    var destinoLng = parseFloat(dataG.integrantes[k].gps.ult.lng);
                    dataG.integrantes[k].moving = false;
                    if (parseFloat(dataG.integrantes[k].gps.lat) !== destinoLat || parseFloat(dataG.integrantes[k].gps.lng) !== destinoLng) {
                        dataG.integrantes[k].moving = true;
                        dataG.integrantes[k].gps.deltaLat = (destinoLat - parseFloat(dataG.integrantes[k].gps.lat)) / delta;
                        dataG.integrantes[k].gps.deltaLng = (destinoLng - parseFloat(dataG.integrantes[k].gps.lng)) / delta;

                    }
                    var m = setInterval(function () {
                        if (dataG.integrantes[k].moving) {
                            var deltaLat = dataG.integrantes[k].gps.deltaLat;
                            var deltaLng = dataG.integrantes[k].gps.deltaLng;
                            dataG.integrantes[k].gps.lat = parseFloat(dataG.integrantes[k].gps.lat) + parseFloat(deltaLat);
                            dataG.integrantes[k].gps.lng = parseFloat(dataG.integrantes[k].gps.lng) + parseFloat(deltaLng);
                            var latlng = new google.maps.LatLng(parseFloat(dataG.integrantes[k].gps.lat), parseFloat(dataG.integrantes[k].gps.lng));
                            marcador.setPosition(latlng);
                            if (Math.abs(destinoLat - parseFloat(dataG.integrantes[k].gps.lat)) < 0.00001 && Math.abs(destinoLng - parseFloat(dataG.integrantes[k].gps.lng)) < 0.00001) {
                                dataG.integrantes[k].moving = false;
                                clearInterval(m);
                                return;
                            }
                        } else {
                            clearInterval(m);
                            return;
                        }
                    }, 10);
                    break;
                }
            }
        }
    }
}
function moveMarkerSOS(elemento) {
    //-
    //-
    var marcador;
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].id === elemento.idUsuarios_Movil) {
            marcador = markers[i];
            break;
        }
    }
    if (marcador !== undefined) {
        var deltalocalLat;
        var deltalocalLng;

        var delta = 500;
        var destinoLat = elemento.gps.ult.lat;
        var destinoLng = elemento.gps.ult.lng;
        elemento.moving = false;
        if (elemento.gps.lat !== destinoLat || elemento.gps.lng !== destinoLng) {
            elemento.moving = true;
            elemento.gps.deltaLat = parseFloat(((destinoLat - elemento.gps.lat) / delta).toFixed(10));
            elemento.gps.deltaLng = parseFloat(((destinoLng - elemento.gps.lng) / delta).toFixed(10));
            deltalocalLat = parseFloat(((destinoLat - elemento.gps.lat) / delta).toFixed(10));
            deltalocalLng = parseFloat(((destinoLng - elemento.gps.lng) / delta).toFixed(10));
        }
        var m = setInterval(function () {
            //-
            if (elemento.moving) {
                if (deltalocalLat === data.elemento.gps.deltaLat && deltalocalLng === data.elemento.gps.deltaLng) {
                    var deltaLat = elemento.gps.deltaLat;
                    var deltaLng = elemento.gps.deltaLng;
                    elemento.gps.lat += deltaLat;
                    elemento.gps.lng += deltaLng;
                    var latlng = new google.maps.LatLng(elemento.gps.lat, elemento.gps.lng);
                    rutaObject.push({lat: elemento.gps.lat, lng: elemento.gps.lng});
                    SetLine(rutaObject);
                    marcador.setPosition(latlng);
                    moveCircle(elemento.gps.lat, elemento.gps.lng);

                    if (Math.abs(destinoLat - elemento.gps.lat) < 0.00001 && Math.abs(destinoLng - elemento.gps.lng) < 0.00001) {
                        elemento.moving = false;
                        clearInterval(m);
                        return;
                    }
                } else {
                    elemento.moving = false;
                    clearInterval(m);
                    return;
                }

            } else {
                clearInterval(m);
                return;
            }
        }, 10);


    }
}
function mostrarElementos() {
    //
    for (var i = 0; i < dataG.integrantes.length; i++) {

        if (dataG.integrantes[i].gps.lat !== "" && dataG.integrantes[i].gps.lng !== "" && dataG.integrantes[i].idUsuarios_Movil !== data.Usuarios_Movil.idUsuarios_Movi && dataG.integrantes[i].urlServicio === hostdir + "/" + DEPENDENCIA) {
            SetMarkerIntegrante(dataG.integrantes[i]);
        }

    }
}
function UpdateMarker(elemento) {
    //-
    //-
    var has_marker = false;
    for (var i = 0; i < markers.length; i++) {
        if (elemento.idUsuarios_Movil === markers[i].id) {
            markers[i].setMap(map);
            has_marker = true;
            moveMarker(elemento.idUsuarios_Movil);
            break;
        }
    }
    //-
    if (!has_marker) {
        elemento.gps.lat = elemento.gps.ult.lat;
        elemento.gps.lng = elemento.gps.ult.lng;
        SetMarker(elemento);
    }
}
function UpdateMarkerSOS(elemento) {


    var has_marker = false;
    for (var i = 0; i < markers.length; i++) {
        if (elemento.idUsuarios_Movil === markers[i].id) {
            markers[i].setMap(map);
            has_marker = true;
            moveMarkerSOS(elemento);
            break;
        }
    }
    //-
    if (!has_marker) {
        elemento.gps.lat = elemento.gps.ult.lat;
        elemento.gps.lng = elemento.gps.ult.lng;
        SetMarkerSOS(elemento);
    }
}
function RemoverMarcador(id) {
    var has_marker = false;
    for (var i = 0; i < markers.length; i++) {
        if (id === markers[i].id) {
            markers[i].setMap(null);
            has_marker = true;
            break;
        }
    }
    //-
    if (!has_marker) {
        console.warn("No se encontro el marcador con id: " + id);
    }
}
function HideMarker(id) {

    var has_marker = false;
    for (var i = 0; i < markers.length; i++) {
        if (id === markers[i].id) {
            markers[i].setMap(null);
            markers[i].id = "vacio";
            //markers[i].set("id","");
            has_marker = true;

            break;
        }
    }
    //-
    if (!has_marker) {
        console.warn("No se encontro el marcador con id: " + id);
    }
}
function BackupIcon(id) {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": '/' + DEPENDENCIA + "/API/backup/ConsultaIcono",
        contentType: "application/json",
        "method": "POST",
        "data": JSON.stringify({
            "idUsuarios_Movil": id
        }),
        success: function (response) {
            //-
        },
        error: function (err) {
            //-
        }
    };
    return Promise.resolve($.ajax(settings));

}
function BackupImage(id) {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": '/' + DEPENDENCIA + "/API/backup/ConsultaImg",
        contentType: "application/json",
        "method": "POST",
        "data": JSON.stringify({
            "idUsuarios_Movil": id
        }),
        success: function (response) {
            //-
        },
        error: function (err) {
            //-
        }
    };
    return Promise.resolve($.ajax(settings));

}
function DisableMarker(id) {
    for (var i = 0; i < markers.length; i++) {
        if (id === markers[i].id) {
            var icon = {
                url: PathRecursos + 'Img/IconoMap/pointer-gray.png', // url
                scaledSize: new google.maps.Size(30, 40), // scaled size
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(15, 40) // anchor
            };
            markers[i].setIcon(icon);
            document.getElementById("contacto" + id).style.display = "block";

            break;

        }
        //moveMarker(markers[i], elemento);

    }

}
function SetRectangle() {
    bordes = {
        north: Latitud + 0.000020,
        south: Latitud - 0.000020,
        east: Longitud + 0.000025,
        west: Longitud - 0.000025
    };
    rectangle = new google.maps.Rectangle({
        bounds: bordes,
        editable: true,
        draggable: true,
        geodesic: false
    });
    map.setZoom(14);
    rectangle.setMap(map);
}
function ConfirmarLlamada(idUsuario_Movil, NombreUsuario) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'center'

    });
    Toast.fire({
        html: "<h1 style=\"color: #D7D7D7;\">Solicitar Llamada</h1><p style=\"color: white;font-size: 15px;\">Está a punto de solicitar una llamada a: <br><label style=\"color: bisque;font-size: 15px;margin: 0;\">" + NombreUsuario + "</label><br>Si desea continuar presione en llamar <br><label style=\"color: bisque;font-size: 15px;margin: 0;\"></label></p>",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Llamar!'
    }).then((result) => {
        if (result.value) {
            const Toast = Swal.mixin({
                toast: true,
                position: 'center',
                showConfirmButton: false,
                timer: 1000
            });

            Toast.fire({
                type: 'success',
                title: 'Solicitando llamada'
            }).then(function () {
                //FireBaseKey(idUsuario_Movil + "/" + DEPENDENCIA, 1, "", "", "");
                FireBaseKey(idUsuario_Movil, 1, "", "", "", DEPENDENCIA);

            });


        }
    });
}
function enviarNotificacionCircle() {
    //-
    //-
    //-
    //-

    var rad = Math.PI / 180;
    var arrayIds = new Array();
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].id !== "vacio" && markers[i].id !== data.RegistroLlamada.idUsuarios_Movil) {
            var latM = markers[i].getPosition().lat();
            var lngM = markers[i].getPosition().lng();
            //-
            //-
            var d_aux = Math.sin(Latitud * rad) * Math.sin(latM * rad) + Math.cos(Latitud * rad) * Math.cos(latM * rad) * Math.cos((Longitud * rad) - (lngM * rad));
            //-
            var d = (6372795.477598) * Math.acos(d_aux);
            //-
            if (d < rango) {

                for (var k = 0; k < dataG.integrantes.length; k++) {
                    if (dataG.integrantes[k].idUsuarios_Movil === markers[i].id) {
                        if (!dataG.integrantes[k].gps.estatus) {
                            arrayIds.push(markers[i].id);
                            markers[i].setAnimation(google.maps.Animation.BOUNCE);
                        }
                        break;
                    }

                }



            }

            Swal.fire({
                title: 'Notificación grupal',
                html: "<label class=\"sweetAlTextLabel \">\n\
                Esta acción enviará una notificación a todos los elementos en el mapa que se encuentren dentro del rango establecido y aun no hayan atendido la llamada.\n\
                <br><br>\n\
                ¿Desea continuar?\n\
                </label>",
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Notificar.',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.value) {
                    //-
                    //-
                    if (incidente_establecido) {
                        if (FolioIncidentes) {
                            Swal.fire({
                                title: 'Notificación',
                                html: //-------------------------TITULO
                                        '<div class="row col-12 m-0 pt-4">' +
                                        '<label class="sweetalrtTitle" >Esta información sera la que le llegue al elemento que se le envia la notificación</label>' +
                                        //-------------------------DESCRIPCION DEL LUGAR 
                                        '<label class="sweetalrt">Descripción del Lugar</label>' +
                                        '<input id="swal-input5" class="swal2-input swalInput" value="' + document.getElementById("DescripcionLugar").value + '">' +
                                        //-------------------------REPORTE
                                        '<label class="sweetalrt"">Reporte</label>' +
                                        '<textarea id="swal-input6" class="swal2-inputTxtA" rows="5">' + document.getElementById("AreaReporte").value + '</textarea>' +
                                        '</div>',
                                focusConfirm: false,
                                preConfirm: () => {
                                    return [

                                        document.getElementById('swal-input5').value,
                                        document.getElementById('swal-input6').value
                                    ];
                                }
                            }).then((result) => {
                                //-
                                document.getElementById("DescripcionLugar").value = result.value[0].split("~")[0];
                                document.getElementById("AreaReporte").value = result.value[1];

                                var proceder = true;
                                for (var i = 0; i < result.value.length; i++) {
                                    //
                                    if (result.value[i] === "" || result.value[i] === null || result.value[i] === undefined) {
                                        proceder = false;
                                    }
                                }
                                if (proceder)
                                {
                                    //
                                    for (var i = 0; i < arrayIds.length; i++) {
                                        FireBaseKey(arrayIds[i], 3, "", "", "", DEPENDENCIA, data.RegistroLlamada.idLlamada);
                                    }

                                } else {
                                    //
                                    Swal.fire(
                                            'Informacion insuficiente en "Descripción de emergencia"',
                                            'Favor de rellenar todos los campos: <br>\n\
                                        <br>- Descripcion del lugar\n\
                                        <br>- Reporte <br><br>',
                                            'error'
                                            );
                                }


                            });

                        } else {

                            let timerInterval;
                            Swal.fire({
                                title: 'Un momento porfavor!',
                                html: 'Se está solicitando un folio a la plataforma Incidentes <strong></strong> segundos.',
                                timer: 5000,
                                onBeforeOpen: () => {
                                    Swal.showLoading();
                                    timerInterval = setInterval(() => {
                                        Swal.getContent().querySelector('strong')
                                                .textContent = parseInt((5100 - Swal.getTimerLeft()) / 1000);
                                    }, 100);
                                },
                                onClose: () => {
                                    clearInterval(timerInterval);
                                    clearInterval(esperandofolio);
                                }
                            }).then((result) => {
                                if (
                                        // Read more about handling dismissals
                                        result.dismiss === Swal.DismissReason.timer
                                        ) {
                                    //
                                    Swal.fire({
                                        title: 'Plataforma Incidentes no responde',
                                        text: "Algo paso y no se logro generar un folio con la plataforma incidentes!<br> ¿Enviar notificacion de todos modos?",
                                        type: 'info',
                                        showCancelButton: true,
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: '#d33',
                                        confirmButtonText: 'Si, enviar!'
                                    }).then((result) => {
                                        if (result.value) {




                                            Swal.fire({
                                                title: 'Notificación',
                                                html: //-------------------------TITULO
                                                        '<div class="row col-12 m-0 pt-4">' +
                                                        '<label class="sweetalrtTitle" >Esta información sera la que le llegue al elemento que se le envia la notificación</label>' +
                                                        //-------------------------DESCRIPCION DEL LUGAR 
                                                        '<label class="sweetalrt">Descripción del Lugar</label>' +
                                                        '<input id="swal-input5" class="swal2-input swalInput" value="' + document.getElementById("DescripcionLugar").value + '">' +
                                                        //-------------------------REPORTE
                                                        '<label class="sweetalrt"">Reporte</label>' +
                                                        '<textarea id="swal-input6" class="swal2-inputTxtA" rows="5">' + document.getElementById("AreaReporte").value + '</textarea>' +
                                                        '</div>',
                                                focusConfirm: false,
                                                preConfirm: () => {
                                                    return [

                                                        document.getElementById('swal-input5').value,
                                                        document.getElementById('swal-input6').value
                                                    ];
                                                }
                                            }).then((result) => {
                                                //-
                                                document.getElementById("DescripcionLugar").value = result.value[0].split("~")[0];
                                                document.getElementById("AreaReporte").value = result.value[1];

                                                var proceder = true;
                                                for (var i = 0; i < result.value.length; i++) {
                                                    //
                                                    if (result.value[i] === "" || result.value[i] === null || result.value[i] === undefined) {
                                                        proceder = false;
                                                    }
                                                }
                                                if (proceder)
                                                {
                                                    //

                                                    FireBaseKey(ElementoId, 2, "", "", "", Dependencia, data.RegistroLlamada.idLlamada);


                                                } else {
                                                    //
                                                    Swal.fire(
                                                            'Informacion insuficiente en "Descripción de emergencia"',
                                                            'Favor de rellenar todos los campos: <br>\n\
                                                        <br>- Descripcion del lugar\n\
                                                        <br>- Reporte <br><br>',
                                                            'error'
                                                            );
                                                }


                                            });





                                        }
                                    })
                                }
                            });

                            var esperandofolio = setInterval(function () {
                                if (FolioIncidentes) {

                                    Swal.close();
                                    clearInterval(timerInterval);
                                    clearInterval(esperandofolio);

                                    Swal.fire({
                                        title: 'Notificación',
                                        html: //-------------------------TITULO
                                                '<div class="row col-12 m-0 pt-4">' +
                                                '<label class="sweetalrtTitle" >Esta información sera la que le llegue al elemento que se le envia la notificación</label>' +
                                                //-------------------------DESCRIPCION DEL LUGAR 
                                                '<label class="sweetalrt">Descripción del Lugar</label>' +
                                                '<input id="swal-input5" class="swal2-input swalInput" value="' + document.getElementById("DescripcionLugar").value + '">' +
                                                //-------------------------REPORTE
                                                '<label class="sweetalrt"">Reporte</label>' +
                                                '<textarea id="swal-input6" class="swal2-inputTxtA" rows="5">' + document.getElementById("AreaReporte").value + '</textarea>' +
                                                '</div>',
                                        focusConfirm: false,
                                        preConfirm: () => {
                                            return [

                                                document.getElementById('swal-input5').value,
                                                document.getElementById('swal-input6').value
                                            ];
                                        }
                                    }).then((result) => {
                                        //-
                                        document.getElementById("DescripcionLugar").value = result.value[0].split("~")[0];
                                        document.getElementById("AreaReporte").value = result.value[1];

                                        var proceder = true;
                                        for (var i = 0; i < result.value.length; i++) {
                                            //
                                            if (result.value[i] === "" || result.value[i] === null || result.value[i] === undefined) {
                                                proceder = false;
                                            }
                                        }
                                        if (proceder)
                                        {
                                            //

                                            FireBaseKey(ElementoId, 2, "", "", "", Dependencia, data.RegistroLlamada.idLlamada);


                                        } else {
                                            //
                                            Swal.fire(
                                                    'Informacion insuficiente en "Descripción de emergencia"',
                                                    'Favor de rellenar todos los campos: <br>\n\
                                                <br>- Descripcion del lugar\n\
                                                <br>- Reporte <br><br>',
                                                    'error'
                                                    );
                                        }


                                    });




                                } else {
                                    //
                                }

                            }, 500);



                        }


                    } else
                    {
                        //

                        Swal.fire({
                            title: 'Notificación',
                            html: //-------------------------TITULO
                                    '<label class="sweetalrtTitle" style="text-align: center;">Para notificar a un elemento es necesario primero <br>"Establecer un incidente".</label>' +
                                    '<p style="margin: 0;color: #fe8201;font: bold 12px Arial;" >- Selecciona un incidente cercano \n\
                    <br> ó \n\
                    <br>- Establece un nuevo incidente</p>',
                            focusConfirm: false
                        });

                    }



                }
                clearAnimationMarkers();

            });
        }

    }
}
function enviarNotificacionIndividual(ElementoId, Dependencia) {
    Swal.fire({
        title: 'Notificación individual',
        html: "<label class=\"sweetAlTextLabel \">\n\
                Esta acción enviará una notificación solo al elemento seleccionado en el mapa.\n\
                <br><br>\n\
                ¿Desea continuar?\n\
                </label>",
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, enviar.',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) {
            if (incidente_establecido) {
                if (FolioIncidentes) {
                    Swal.fire({
                        title: 'Notificación',
                        html: //-------------------------TITULO
                                '<div class="row col-12 m-0 pt-4">' +
                                '<label class="sweetalrtTitle" >Esta información sera la que le llegue al elemento que se le envia la notificación</label>' +
                                //-------------------------DESCRIPCION DEL LUGAR 
                                '<label class="sweetalrt">Descripción del Lugar</label>' +
                                '<input id="swal-input5" class="swal2-input swalInput" value="' + document.getElementById("DescripcionLugar").value + '">' +
                                //-------------------------REPORTE
                                '<label class="sweetalrt"">Reporte</label>' +
                                '<textarea id="swal-input6" class="swal2-inputTxtA" rows="5">' + document.getElementById("AreaReporte").value + '</textarea>' +
                                '</div>',
                        focusConfirm: false,
                        preConfirm: () => {
                            return [

                                document.getElementById('swal-input5').value,
                                document.getElementById('swal-input6').value
                            ];
                        }
                    }).then((result) => {
                        //-
                        document.getElementById("DescripcionLugar").value = result.value[0].split("~")[0];
                        document.getElementById("AreaReporte").value = result.value[1];

                        var proceder = true;
                        for (var i = 0; i < result.value.length; i++) {
                            //
                            if (result.value[i] === "" || result.value[i] === null || result.value[i] === undefined) {
                                proceder = false;
                            }
                        }
                        if (proceder)
                        {
                            //

                            FireBaseKey(ElementoId, 2, "", "", "", Dependencia, data.RegistroLlamada.idLlamada);


                        } else {
                            //
                            Swal.fire(
                                    'Informacion insuficiente en "Descripción de emergencia"',
                                    'Favor de rellenar todos los campos: <br>\n\
                                        <br>- Descripcion del lugar\n\
                                        <br>- Reporte <br><br>',
                                    'error'
                                    );
                        }


                    });

                } else {

                    let timerInterval;
                    Swal.fire({
                        title: 'Un momento porfavor!',
                        html: 'Se está solicitando un folio a la plataforma Incidentes <strong></strong> segundos.',
                        timer: 5000,
                        onBeforeOpen: () => {
                            Swal.showLoading();
                            timerInterval = setInterval(() => {
                                Swal.getContent().querySelector('strong')
                                        .textContent = parseInt((5100 - Swal.getTimerLeft()) / 1000);
                            }, 100);
                        },
                        onClose: () => {
                            clearInterval(timerInterval);
                            clearInterval(esperandofolio);
                        }
                    }).then((result) => {
                        if (
                                // Read more about handling dismissals
                                result.dismiss === Swal.DismissReason.timer
                                ) {
                            //
                            Swal.fire({
                                title: 'Plataforma Incidentes no responde',
                                text: "Algo paso y no se logro generar un folio con la plataforma incidentes!<br> ¿Enviar notificacion de todos modos?",
                                type: 'info',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Si, enviar!'
                            }).then((result) => {
                                if (result.value) {




                                    Swal.fire({
                                        title: 'Notificación',
                                        html: //-------------------------TITULO
                                                '<div class="row col-12 m-0 pt-4">' +
                                                '<label class="sweetalrtTitle" >Esta información sera la que le llegue al elemento que se le envia la notificación</label>' +
                                                //-------------------------DESCRIPCION DEL LUGAR 
                                                '<label class="sweetalrt">Descripción del Lugar</label>' +
                                                '<input id="swal-input5" class="swal2-input swalInput" value="' + document.getElementById("DescripcionLugar").value + '">' +
                                                //-------------------------REPORTE
                                                '<label class="sweetalrt"">Reporte</label>' +
                                                '<textarea id="swal-input6" class="swal2-inputTxtA" rows="5">' + document.getElementById("AreaReporte").value + '</textarea>' +
                                                '</div>',
                                        focusConfirm: false,
                                        preConfirm: () => {
                                            return [

                                                document.getElementById('swal-input5').value,
                                                document.getElementById('swal-input6').value
                                            ];
                                        }
                                    }).then((result) => {
                                        //-
                                        document.getElementById("DescripcionLugar").value = result.value[0].split("~")[0];
                                        document.getElementById("AreaReporte").value = result.value[1];

                                        var proceder = true;
                                        for (var i = 0; i < result.value.length; i++) {
                                            //
                                            if (result.value[i] === "" || result.value[i] === null || result.value[i] === undefined) {
                                                proceder = false;
                                            }
                                        }
                                        if (proceder)
                                        {
                                            //

                                            FireBaseKey(ElementoId, 2, "", "", "", Dependencia, data.RegistroLlamada.idLlamada);


                                        } else {
                                            //
                                            Swal.fire(
                                                    'Informacion insuficiente en "Descripción de emergencia"',
                                                    'Favor de rellenar todos los campos: <br>\n\
                                                        <br>- Descripcion del lugar\n\
                                                        <br>- Reporte <br><br>',
                                                    'error'
                                                    );
                                        }


                                    });





                                }
                            })
                        }
                    });

                    var esperandofolio = setInterval(function () {
                        if (FolioIncidentes) {

                            Swal.close();
                            clearInterval(timerInterval);
                            clearInterval(esperandofolio);

                            Swal.fire({
                                title: 'Notificación',
                                html: //-------------------------TITULO
                                        '<div class="row col-12 m-0 pt-4">' +
                                        '<label class="sweetalrtTitle" >Esta información sera la que le llegue al elemento que se le envia la notificación</label>' +
                                        //-------------------------DESCRIPCION DEL LUGAR 
                                        '<label class="sweetalrt">Descripción del Lugar</label>' +
                                        '<input id="swal-input5" class="swal2-input swalInput" value="' + document.getElementById("DescripcionLugar").value + '">' +
                                        //-------------------------REPORTE
                                        '<label class="sweetalrt"">Reporte</label>' +
                                        '<textarea id="swal-input6" class="swal2-inputTxtA" rows="5">' + document.getElementById("AreaReporte").value + '</textarea>' +
                                        '</div>',
                                focusConfirm: false,
                                preConfirm: () => {
                                    return [

                                        document.getElementById('swal-input5').value,
                                        document.getElementById('swal-input6').value
                                    ];
                                }
                            }).then((result) => {
                                //-
                                document.getElementById("DescripcionLugar").value = result.value[0].split("~")[0];
                                document.getElementById("AreaReporte").value = result.value[1];

                                var proceder = true;
                                for (var i = 0; i < result.value.length; i++) {
                                    //
                                    if (result.value[i] === "" || result.value[i] === null || result.value[i] === undefined) {
                                        proceder = false;
                                    }
                                }
                                if (proceder)
                                {
                                    //

                                    FireBaseKey(ElementoId, 2, "", "", "", Dependencia, data.RegistroLlamada.idLlamada);


                                } else {
                                    //
                                    Swal.fire(
                                            'Informacion insuficiente en "Descripción de emergencia"',
                                            'Favor de rellenar todos los campos: <br>\n\
                                                <br>- Descripcion del lugar\n\
                                                <br>- Reporte <br><br>',
                                            'error'
                                            );
                                }


                            });




                        } else {
                            //
                        }

                    }, 500);



                }


            } else
            {
                //

                Swal.fire({
                    title: 'Notificación',
                    html: //-------------------------TITULO
                            '<label class="sweetalrtTitle" style="text-align: center;">Para notificar a un elemento es necesario primero <br>"Establecer un incidente".</label>' +
                            '<p style="margin: 0;color: #fe8201;font: bold 12px Arial;" >- Selecciona un incidente cercano \n\
                    <br> ó \n\
                    <br>- Establece un nuevo incidente</p>',
                    focusConfirm: false
                });

            }
        }

    });
}
function clearAnimationMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setAnimation(null);
    }
}
function colocarMarcadores(integrantes) {


    if (!integrantes.length)
    {
        document.getElementById("span").innerHTML = "Añade un integrante para mostrarlo en el mapa";
    } else {
        ZoomAndCenterLocal(integrantes);


        for (var i = 0; i < integrantes.length; i++) {
            //
            //
            if (integrantes[i].gps) {

                MarcadorElementoLocal(integrantes[i]);
            }
        }
    }

}
function ZoomAndCenterLocal(integrantes) {



    var R = 6372795.477598;
    var rad = Math.PI / 180;
    var lat = 0;
    var lng = 0;
    var d = -1;
    var k = 0;
    for (var i = 0; i < integrantes.length; i++) {
        if (integrantes[i].gps) {
            var StringLat = integrantes[i].gps.lat;
            var StringLng = integrantes[i].gps.lng;
            if (StringLat !== "") {
                lat += parseFloat(StringLat);
                lng += parseFloat(StringLng);
                k++;
            }
        }

    }
    if (k > 0) {
        lat = lat / k;
        lng = lng / k;
    }
    for (var i = 0; i < integrantes.length; i++) {
        if (integrantes[i].gps.lat !== "") {
            var FloatLat = parseFloat(integrantes[i].gps.lat);
            var FloatLng = parseFloat(integrantes[i].gps.lng);
            var d_aux;
            var operacion = Math.sin(FloatLat * rad) * Math.sin(lat * rad) + Math.cos(FloatLat * rad) * Math.cos(lat * rad) * Math.cos((FloatLng * rad) - (lng * rad));
            if (operacion > 1) {
                operacion = 1;
                d_aux = R * Math.acos(operacion);
            } else if (operacion < -1) {
                operacion = -1;
                d_aux = R * Math.acos(operacion);
            } else {
                d_aux = R * Math.acos(operacion);
            }
            if (d_aux > d) {
                d = d_aux;
            }
        }
    }
    map.setCenter({"lat": lat, "lng": lng});
    var zoom = d;

    if (zoom > 200000) {
        map.setZoom(6);
    } else if (zoom > 150000) {
        map.setZoom(7);
    } else if (zoom > 120000) {
        map.setZoom(8);
    } else if (zoom > 100000) {
        map.setZoom(9);
    } else if (zoom > 60000) {
        map.setZoom(10);
    } else if (zoom > 25000) {
        map.setZoom(11);
    } else if (zoom > 10000) {
        map.setZoom(12);
    } else if (zoom > 4000) {
        map.setZoom(13);
    } else if (zoom > 2000) {
        map.setZoom(14);
    } else if (zoom > 1000) {
        map.setZoom(15);
    } else if (zoom > 500) {
        map.setZoom(16);
    } else if (zoom >= 0) {
        map.setZoom(17);
    } else if (zoom < 0) {
        map.setZoom(3);
    }

}
function CoordenadasElemento(idregistro_rutas) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/CoordenadasElemento',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "id": idregistro_rutas
        }),
        success: function (response) {
            //
        },
        error: function (err) {
            //alert("No hay ubicacion para el usuario:" + idUsuarios_Movil);
            //
        }
    }));
}
function MarcadorElementoLocal(elemento) {

    var existe = false;
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].id === elemento.id360) {
            markers[i].setMap(map);
            existe = true;
            break;
        }
    }
    if (!existe) {


        if (elemento.icon !== undefined && elemento.icon !== null && elemento.icon !== "") {
            var icon = {
                //url: "Data:image/png;base64," + elemento.icon, // url
                url: elemento.icon, // url
                scaledSize: new google.maps.Size(50, 50), // scaled size
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(25, 50) // anchor
            };
        } else {
            //var icon = image;
            var icon = {
                url: image, // url
                scaledSize: new google.maps.Size(30, 40), // scaled size
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(15, 40) // anchor
            };
        }

        if (elemento.img === "") {
            elemento.img = PathRecursos + 'Img/perfil.png';
        } else {
            //elemento.img = "Data:image/png;base64," + elemento.img;
            elemento.img = elemento.img;
        }

        var Lat = parseFloat(elemento.gps.lat);
        var Lng = parseFloat(elemento.gps.lng);



        var posicion = {lat: Lat, lng: Lng};

        var marker = new google.maps.Marker({
            position: posicion,
            map: map,
            //animation: googlue.maps.Animation.BOUNCE,
            icon: icon
        });
        //marker.setMap(map);

        marker.id = elemento.id360;
        markers.push(marker);
        marker.addListener('click', function () {
            RutaCamino0.setMap(null);
            RutaCamino1.setMap(null);
            LimpiarPuntos();
            infowindow.close();
            infowindow.setContent(ContentInfoWindowIntegranteEmpresas360(elemento));
            infowindow.open(map, marker);

            setTimeout(function () {
                document.getElementById("Ruta").addEventListener('click', function () {

                    //elemento.gps.rutas={"2019-08-27":[[],[]]};
                    var consultar = false;
                    if (!elemento.gps.rutas) {

                        consultar = true
                        elemento.gps.rutas = {};
                    } else {

                        if (!elemento.gps.rutas[getFecha()]) {

                            consultar = true;
                        }
                    }
                    if (consultar) {

                        consultarRutaNow(elemento.id360).then(function (ruta) {

                            if (ruta !== null) {


                                var keyFecha;
                                for (keyFecha in ruta) {

                                }

                                try {
                                    var routes = "";
                                    var coordenadas = JSON.parse("[" + ruta[keyFecha].Ruta.replace(/'/g, '"').substring(0, ruta[keyFecha].Ruta.length - 1) + "]");

                                    elemento.gps.rutas[keyFecha] = {};
                                    elemento.gps.rutas[keyFecha].Ruta = new Array();
                                    for (var i = 0; i < coordenadas.length; i++) {

                                        elemento.gps.rutas[keyFecha].Ruta.push({
                                            "lat": coordenadas[i][0],
                                            "lng": coordenadas[i][1],
                                            "hora": coordenadas[i][2],
                                            "velocidad": coordenadas[i][3],
                                            "acuary": coordenadas[i][4],
                                            "altitud": coordenadas[i][5]
                                        });  //   += '{"lat":' + coordenadas[i][0] + ',"lng":' + coordenadas[i][1] + ',"hora":"' + coordenadas[i][2] + '","velocidad":' + coordenadas[i][3] + ',"acuary":' + coordenadas[i][4] + ',"altitud":' + coordenadas[i][5] + '},';
                                    }

                                } catch (err) {
                                    window.console.warn(err + "\nError de formato...\nNo podra visualizar de forma correcta la ruta del elemento: " + elemento.idUsuarios_Movil);
                                }


                                //elemento.gps.rutas[keyFecha] = ruta[keyFecha];


                                for (var k = 0; k < dataG.integrantes.length; k++) {


                                    if (dataG.integrantes[k].id360 === elemento.id360) {

                                        if (!dataG.integrantes[k].gps.rutas) {
                                            dataG.integrantes[k].gps.rutas = {};
                                        }
                                        dataG.integrantes[k].gps.rutas[keyFecha] = elemento.gps.rutas[keyFecha];

                                        break;
                                    }

                                }

                                generarRuta(elemento.gps.rutas[keyFecha], elemento.id360);
                            } else {
                                const Toast = Swal.mixin({
                                    toast: true,
                                    position: 'bottom',
                                    timer: 3000,
                                    backdrop: `rgba(189, 189, 189,0.5)`
                                });
                                Toast.fire({
                                    type: 'info',
                                    html: '<p style="color: white;font-size: 15px;">Por el momento no hay ruta disponible para este usuario</p>'
                                });
                            }


                        });
                    } else {
                        generarRuta(elemento.gps.rutas[getFecha()], elemento.id360);

                    }



                });



            }, 100);

        });


    }
}
function generarRuta(ruta, idUsuario) {

    if (document.getElementById("Ruta").className === "show botonRuta btn btn-outline-info btn-sm") {

        if (ruta.Ruta !== undefined && ruta.Ruta !== null) {


            SetPoints(ruta.Ruta, idUsuario);
            document.getElementById("Ruta").className = "hide botonRuta btn btn-outline-info btn-sm";
            document.getElementById("Ruta").value = "Cerrar Ruta";
        } else {
            LimpiarPuntos();

            const Toast = Swal.mixin({
                toast: true,
                position: 'bottom',
                timer: 2000
            });
            Toast.fire({
                type: 'info',
                html: '<p style="color: white;font-size: 15px;">Por el momento no hay ruta disponible para este usuario</p>'
            });
        }
    } else {
        RutaCamino0.setMap(null);
        RutaCamino1.setMap(null);
        LimpiarPuntos();
        document.getElementById("Ruta").className = "show botonRuta btn btn-outline-info btn-sm";
        document.getElementById("Ruta").value = "Ver Ruta";
    }
}
function SetLine(ruta) {

    RutaCamino0.setMap(null);
    RutaCamino1.setMap(null);

    var rutaUlt = [];
    var rutaPrim = [];
    // Filtrando el primero y el último punto
    for (i = 0; i < ruta.length - 5; i++) {
        rutaUlt.push(ruta[i]);
    }
    for (i = ruta.length - 5; i < ruta.length; i++) {

        rutaPrim.push(ruta[i]);
    }
// Nuevo estilo para el camino intermedio
    RutaCamino0 = new google.maps.Polyline({
        path: rutaUlt,
        geodesic: true,
        strokeColor: 'gray',
        strokeOpacity: 0.7,
        strokeWeight: 4
    });
    RutaCamino1 = new google.maps.Polyline({
        path: rutaPrim,
        geodesic: true,
        strokeColor: 'skyblue',
        strokeOpacity: 0.7,
        strokeWeight: 4
    });
    // Creando la ruta en el mapa
    RutaCamino0.setMap(map);
    RutaCamino1.setMap(map);
//    document.addEventListener('click', function (e) {
//        
//        if (e.target.tagName === "DIV") {
//            RutaCamino.setMap(null);
//            RutaCamino1.setMap(null);
//        }
//    });


}
function SetPoints2(ruta) {
    var R = new google.maps.Polyline({
        path: null,
        geodesic: true,
        strokeColor: 'blue',
        strokeOpacity: 1,
        strokeWeight: 4
    });

    var M = new google.maps.Marker({position: null,
        map: map
    });

    RutaCamino0.setMap(null);
    RutaCamino1.setMap(null);
    LimpiarPuntos();
    var rad = Math.PI / 180;
    var rutaUlt = [];
    var rutaPrim = [];
    var k = 0;
    // Filtrando el primero y el último punto

    var RutaArreglada = [{"lat": ruta[0].lat, "lng": ruta[0].lng, "stand": "0 segundos", "horaI": ruta[0].hora, "horaF": ruta[0].hora, "velocidad": ruta[0].velocidad, "acuary": ruta[0].acuary}];



    //defino el centro de un radio para eliminar lineas inconsistentes
    var centerArea = [ruta[0].lat, ruta[0].lng];

    for (i = 1; i < ruta.length; i++) {
        var d = (6372795.477598) * Math.acos(Math.sin(ruta[i].lat * rad) * Math.sin(centerArea[0] * rad) + Math.cos(ruta[i].lat * rad) * Math.cos(centerArea[0] * rad) * Math.cos((ruta[i].lng * rad) - (centerArea[1] * rad)));
        if (isNaN(d)) {
            alert("NaN");
            d = 0;
        }
//        //Calculo el tiempo de estancia creando 2 variables de tipo date con la hora de el punto anterior con el actual
//        var hora2 = ruta[i - 1].hora.split(":");
//        var hora1 = ruta[i].hora.split(":");
//        var t1 = new Date();
//        var t2 = new Date();
//        t1.setHours(hora1[0], hora1[1], hora1[2]);
//        t2.setHours(hora2[0], hora2[1], hora2[2]);
//        //Aquí hago la resta
//        t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());
////            
////            
////            

        if (d < 40 && ruta[i].acuary > 10) {
//if (d < 50&& ruta[i].acuary < 20) {
            //Calculo el tiempo de estancia creando 2 variables de tipo date con la hora de el punto anterior con el actual
            var hora2 = RutaArreglada[k].horaI.split(":");
            var hora1 = ruta[i].hora.split(":");
            var t1 = new Date();
            var t2 = new Date();
            t1.setHours(hora1[0], hora1[1], hora1[2]);
            t2.setHours(hora2[0], hora2[1], hora2[2]);
            //Aquí hago la resta
            t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());
            //Imprimo el resultado
            RutaArreglada[k].stand = "" + (t1.getHours() ? t1.getHours() + (t1.getHours() > 1 ? " horas, " : " hora, ") : "") + (t1.getMinutes() ? "" + t1.getMinutes() + (t1.getMinutes() > 1 ? " minutos" : " minuto") : "") + (t1.getSeconds() ? (t1.getHours() || t1.getMinutes() ? " y " : "") + t1.getSeconds() + (t1.getSeconds() > 1 ? " segundos" : " segundo") : "");
            RutaArreglada[k].horaF = ruta[i].hora;
            RutaArreglada[k].velocidad = (RutaArreglada[0].velocidad + ruta[i].velocidad) / 2;



            //actualizo el punto central del radio
            centerArea[0] = (centerArea[0] + ruta[i].lat) / 2;
            centerArea[1] = (centerArea[1] + ruta[i].lng) / 2;

            //calculo la distacia que tiene el punto grardado y el actual respecto del nuevo centro
            var dPuntoActual = (6372795.477598) * Math.acos(Math.sin(ruta[i].lat * rad) * Math.sin(centerArea[0] * rad) + Math.cos(ruta[i].lat * rad) * Math.cos(centerArea[0] * rad) * Math.cos((ruta[i].lng * rad) - (centerArea[1] * rad)));
            var dPuntoReferencia = (6372795.477598) * Math.acos(Math.sin(RutaArreglada[k].lat * rad) * Math.sin(centerArea[0] * rad) + Math.cos(RutaArreglada[k].lat * rad) * Math.cos(centerArea[0] * rad) * Math.cos((RutaArreglada[k].lng * rad) - (centerArea[1] * rad)));

            //if (ruta[i].acuary < RutaArreglada[k].acuary) {
            // RutaArreglada[k].lat = ruta[i].lat;
            // RutaArreglada[k].lng = ruta[i].lng;
            //  RutaArreglada[k].acuary = ruta[i].acuary;
            //}
            //actualizo el punto mas cercano al centro del radio 
            if (dPuntoActual < dPuntoReferencia) {

                RutaArreglada[k].lat = ruta[i].lat;
                RutaArreglada[k].lng = ruta[i].lng;
            }






        } else if (d > 30 && ruta[i].acuary < 10) {

            k++;
            RutaArreglada.push({"lat": ruta[i].lat, "lng": ruta[i].lng, "stand": "0 segundos", "horaI": ruta[i].hora, "horaF": ruta[i].hora, "velocidad": ruta[i].velocidad, "acuary": ruta[i].acuary});





        } else {
            ruta[i].lat = ruta[i - 1].lat;
            ruta[i].lng = ruta[i - 1].lng;

            var hora2 = RutaArreglada[k].horaI.split(":");
            var hora1 = ruta[i].hora.split(":");
            var t1 = new Date();
            var t2 = new Date();
            t1.setHours(hora1[0], hora1[1], hora1[2]);
            t2.setHours(hora2[0], hora2[1], hora2[2]);
            //Aquí hago la resta
            t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());
            //Imprimo el resultado
            RutaArreglada[k].stand = "" + (t1.getHours() ? t1.getHours() + (t1.getHours() > 1 ? " horas, " : " hora, ") : "") + (t1.getMinutes() ? "" + t1.getMinutes() + (t1.getMinutes() > 1 ? " minutos" : " minuto") : "") + (t1.getSeconds() ? (t1.getHours() || t1.getMinutes() ? " y " : "") + t1.getSeconds() + (t1.getSeconds() > 1 ? " segundos" : " segundo") : "");
            RutaArreglada[k].horaF = ruta[i].hora;
            RutaArreglada[k].velocidad = (RutaArreglada[0].velocidad + ruta[i].velocidad) / 2;

        }

//        
//        //console.log(d + "  \t  " + ruta[i].acuary);
        rutaUlt.push(ruta[i]);
    }
//    
//    

    for (i = ruta.length - 25; i < ruta.length; i++) {

        rutaPrim.push(ruta[i]);
        rutaUlt.pop();
    }


// Nuevo estilo para el camino intermedio
    RutaCamino0 = new google.maps.Polyline({
        path: RutaArreglada,
        geodesic: true,
        strokeColor: 'red',
        strokeOpacity: 1,
        strokeWeight: 3
    });
    RutaCamino1 = new google.maps.Polyline({
        path: rutaPrim,
        geodesic: true,
        strokeColor: 'skyblue',
        strokeOpacity: 1,
        strokeWeight: 3
    });
    // Creando la ruta en el mapa
    RutaCamino0.setMap(map);
    RutaCamino1.setMap(map);
    for (var x = 0; x < RutaArreglada.length; x++) {
        mrc(x, RutaArreglada[x]);
    }
}
function SetPoints(ruta) {

    RutaCamino0.setMap(null);
    RutaCamino1.setMap(null);
    LimpiarPuntos();
    var rad = Math.PI / 180;
    var rutaUlt = [];
    var rutaPrim = [];
    var k = 0;
    // Filtrando el primero y el último punto
    var centerPoint = [{"lat": ruta[0].lat, "lng": ruta[0].lng, "stand": "0 segundos", "horaI": ruta[0].hora, "horaF": ruta[0].hora, "velocidad": ruta[0].velocidad, "acuary": ruta[0].acuary}];
    for (i = 1; i < ruta.length; i++) {
        var d = (6372795.477598) * Math.acos(Math.sin(ruta[i].lat * rad) * Math.sin(ruta[i - 1].lat * rad) + Math.cos(ruta[i].lat * rad) * Math.cos(ruta[i - 1].lat * rad) * Math.cos((ruta[i].lng * rad) - (ruta[i - 1].lng * rad)));
        if (isNaN(d)) {
            d = 0;
        }
        if (ruta[i].hora !== undefined && ruta[i - 1].hora !== undefined) {
            var hora2 = ruta[i - 1].hora.split(":");
            var hora1 = ruta[i].hora.split(":");
            var t1 = new Date();
            var t2 = new Date();
            t1.setHours(hora1[0], hora1[1], hora1[2]);
            t2.setHours(hora2[0], hora2[1], hora2[2]);
//Aquí hago la resta
            t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());
        }

//            
//            

//        
//        


        if (d < 20) {
//if (d < 50&& ruta[i].acuary < 20) {
            if (centerPoint[k].horaI !== undefined && ruta[i].hora !== undefined) {
                var hora2 = centerPoint[k].horaI.split(":");
                var hora1 = ruta[i].hora.split(":");
                var t1 = new Date();
                var t2 = new Date();
                t1.setHours(hora1[0], hora1[1], hora1[2]);
                t2.setHours(hora2[0], hora2[1], hora2[2]);
//Aquí hago la resta
                t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());
//Imprimo el resultado
                centerPoint[k].stand = "" + (t1.getHours() ? t1.getHours() + (t1.getHours() > 1 ? " horas, " : " hora, ") : "") + (t1.getMinutes() ? "" + t1.getMinutes() + (t1.getMinutes() > 1 ? " minutos" : " minuto") : "") + (t1.getSeconds() ? (t1.getHours() || t1.getMinutes() ? " y " : "") + t1.getSeconds() + (t1.getSeconds() > 1 ? " segundos" : " segundo") : "");
                centerPoint[k].horaF = ruta[i].hora;
            }

            centerPoint[k].velocidad = (centerPoint[0].velocidad + ruta[i].velocidad) / 2;


            if (ruta[i].acuary < centerPoint[k].acuary) {
                centerPoint[k].lat = ruta[i].lat;
                centerPoint[k].lng = ruta[i].lng;
                centerPoint[k].acuary = ruta[i].acuary;
            }


        } else if (d > 50 && ruta[i].acuary > 40) {
            ruta[i].lat = ruta[i - 1].lat;
            ruta[i].lng = ruta[i - 1].lng;
        } else {
            k++;
            centerPoint.push({"lat": ruta[i].lat, "lng": ruta[i].lng, "stand": "0 segundos", "horaI": ruta[i].hora, "horaF": ruta[i].hora, "velocidad": ruta[i].velocidad, "acuary": ruta[i].acuary});
        }

//        
//        //console.log(d + "  \t  " + ruta[i].acuary);
        rutaUlt.push(ruta[i]);
    }
//    
//    

    for (i = ruta.length - 25; i < ruta.length; i++) {

        rutaPrim.push(ruta[i]);
        rutaUlt.pop();
    }


// Nuevo estilo para el camino intermedio
    RutaCamino0 = new google.maps.Polyline({
        path: rutaUlt,
        geodesic: true,
        strokeColor: 'gray',
        strokeOpacity: 1,
        strokeWeight: 3
    });
    RutaCamino1 = new google.maps.Polyline({
        path: rutaPrim,
        geodesic: true,
        strokeColor: 'skyblue',
        strokeOpacity: 1,
        strokeWeight: 3
    });
    // Creando la ruta en el mapa
    RutaCamino0.setMap(map);
    RutaCamino1.setMap(map);
    for (var x = 0; x < centerPoint.length; x++) {
        mrc(x, centerPoint[x]);
    }
    if ($("#loading").length) {
        document.getElementById("loading").parentNode.removeChild(document.getElementById("loading"));
    }
}
function mrc(indice, centerPoint) {
    if (m[indice] !== null && m[indice] !== undefined) {
        m[indice].setMap(null);
    }
    var dot = {
        url: PathRecursos + 'Img/IconoMap/dot.png', // url
        scaledSize: new google.maps.Size(12, 12), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(6, 6) // anchor
    };
    m[indice] = new google.maps.Marker({position: centerPoint,
        map: map,
        //animation: google.maps.Animation.BOUNCE,
        icon: dot

    },
            );
    m[indice].addListener('mouseover', function () {
        infowindow.close();
        infowindow.setContent("<div style=\" width: 150px; float: left; color: #40474f;\">\n\
                                    <p>\n\
                                           Hora inicial: " + centerPoint.horaI + "<br>" + "Hora final: " + centerPoint.horaF + "<br>" + "Tiempo de estancia (Aprox):  " + centerPoint.stand + " <br> " + "Velocidad promedio (Aprox):  " + parseInt(centerPoint.velocidad * 3.6) + "km/h <br> \
                                    <\p>\n\
                               </div>");
        infowindow.open(map, m[indice]);
    });
}
function LimpiarPuntos() {
    var i = 0;
    while (m[i] !== null && m[i] !== undefined) {
        m[i].setMap(null);
        i++;
    }
}
function consultarRutaNow(idUsuario) {

    var json = {
        "idUsuario": idUsuario
    };
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": '/' + DEPENDENCIA + "/rutaNow",
        contentType: "application/json",
        "method": "POST",
        "data": JSON.stringify(json),
        success: function (response) {

        },
        error: function (err) {

        }
    };
    return Promise.resolve($.ajax(settings));

}
////////////////////////////////////Busqueda de reporte *********************
function creaModal(nombre) {
    var mod = document.createElement("div");
    mod.id = "modal-" + nombre;
    mod.className = "modal";
    var modContent = document.createElement("div");
    modContent.id = "modalcontent-" + nombre;
    modContent.className = "modal-content";
    var spanClose = document.createElement("span");
    spanClose.id = "CloseFrame-" + nombre;
    spanClose.className = "close";
    spanClose.style = "width: 30px;";
    spanClose.innerHTML = "&times";

    modContent.appendChild(spanClose);
    mod.appendChild(modContent);
    document.body.appendChild(mod);

}
///////////////////////////////////Firebase **************************
function FireBaseKey(Elemento, TipoDeSolicitud, apikey, idsesion, token, Dependencia, idLlamada) {
    var idUsuarios_Movil = Elemento;
    var usr = {"idUsuarios_Movil": Elemento};
    var existe = false
    for (var k = 0; k < dataG.integrantes.length; k++) {
        if (parseInt(dataG.integrantes[k].idUsuarios_Movil) === parseInt(Elemento)) {
            usr.FireBaseKey = dataG.integrantes[k].FireBaseKey;
            if (dataG.integrantes[k].gps.estatus) {
                usr.estatus = dataG.integrantes[k].gps.estatus;
            }
            existe = true;
            break;
        }
    }
    if (usr["FireBaseKey"] !== null && usr["FireBaseKey"] !== "null" && usr["FireBaseKey"] !== "" && usr["FireBaseKey"] !== undefined) {
        switch (TipoDeSolicitud) {
            case 0:

                break;

            case 1:

                GenerarTicket("llamadaS").then(function (response) {
                    var IDLlamada = response.ticket;
                    genCredenciales = GenerarCredenciales();
                    genCredenciales.then(function (credenciales) {
                        var idUsers = new Array();
                        idUsers.push(idUsuarios_Movil.toString());
                        RegistroNotificaciones(idUsers, IDLlamada).then(function (RespuestaNotificados) {
                            var SolicitarVideo = FireBaseSolicitudVideo(usr["FireBaseKey"], credenciales.apikey, credenciales.idsesion, credenciales.token, RespuestaNotificados[idUsuarios_Movil]);
                            SolicitarVideo.then(function (data) {
                                if (!data.failure) {
                                    var div = document.createElement("div");
                                    div.id = "div" + idUsuarios_Movil;
                                    //div.style="visibility: hidden";

                                    var form = document.createElement("form");
                                    form.method = "POST";
                                    form.action = "/" + DEPENDENCIA + "/OperadorEmpresa";
                                    form.target = "_blank";
                                    form.id = "LlamadaSaliente" + usr["idUsuarios_Movil"];

                                    var id = document.createElement("input");
                                    id.type = "hidden";
                                    id.id = "nombre" + usr["idUsuarios_Movil"];
                                    id.style = "width: 39%;   margin-left: 1% ;  border: 1px solid #ccc;  border-radius: 4px;  box-sizing: border-box;";
                                    id.value = usr["idUsuarios_Movil"]; //idUsr;
                                    id.name = "id";

                                    var apikey = document.createElement("input");
                                    apikey.type = "hidden";
                                    apikey.id = credenciales.apikey;
                                    apikey.value = credenciales.apikey;
                                    apikey.name = "apikey";

                                    var sesion = document.createElement("input");
                                    sesion.type = "hidden";
                                    sesion.id = credenciales.idsesion;
                                    sesion.value = credenciales.idsesion;
                                    sesion.name = "session";

                                    var token = document.createElement("input");
                                    token.type = "hidden";
                                    token.id = credenciales.token;
                                    token.value = credenciales.token;
                                    token.name = "token";

                                    var idLlamada = document.createElement("input");
                                    idLlamada.type = "hidden";
                                    idLlamada.id = IDLlamada;
                                    idLlamada.value = IDLlamada;
                                    idLlamada.name = "idLlamada";
                                    var modo = document.createElement("input");
                                    modo.type = "hidden";
                                    modo.id = "modo";
                                    modo.value = "201";
                                    modo.name = "modo";

                                    var fecha = document.createElement("input");
                                    fecha.type = "hidden";
                                    fecha.id = "fecha";
                                    fecha.value = getFecha();
                                    fecha.name = "fecha";

                                    var hora = document.createElement("input");
                                    hora.type = "hidden";
                                    hora.id = "hora";
                                    hora.value = getHora();
                                    hora.name = "hora";

                                    var idSys = document.createElement("input");
                                    idSys.type = "hidden";
                                    idSys.id = "idSys";
                                    idSys.value = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys;
                                    idSys.name = "idSys";

                                    var origen = document.createElement("input");
                                    origen.type = "hidden";
                                    origen.id = "origen";
                                    origen.value = DEPENDENCIA;
                                    origen.name = "origen";

                                    var integrantes = document.createElement("input");
                                    integrantes.type = "hidden";
                                    integrantes.id = "integrantes";
                                    integrantes.value = idUsuarios_Movil;
                                    integrantes.name = "integrantes";

                                    var tipo_usuario = document.createElement("input");
                                    tipo_usuario.type = "hidden";
                                    tipo_usuario.id = "tipo_usuario";
                                    tipo_usuario.value = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
                                    tipo_usuario.name = "tipo_usuario";

                                    var tipo_servicio = document.createElement("input");
                                    tipo_servicio.type = "hidden";
                                    tipo_servicio.id = "tipo_servicio";
                                    tipo_servicio.value = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio;
                                    tipo_servicio.name = "tipo_servicio";


                                    var submit = document.createElement("input");
                                    submit.type = "submit";
                                    submit.value = "Atender";
                                    submit.style = "background-color: #585858 ;  border: 1px solid #2E2E2E; border-radius:4px; color: gray;   text-align: center;  text-decoration: none;   font-size: 16px;  margin-left:1%; ";
                                    form.appendChild(id);
                                    form.appendChild(apikey);
                                    form.appendChild(sesion);
                                    form.appendChild(token);
                                    form.appendChild(idLlamada);
                                    form.appendChild(modo);
                                    form.appendChild(origen);
                                    form.appendChild(fecha);
                                    form.appendChild(hora);
                                    form.appendChild(idSys);
                                    form.appendChild(integrantes);
                                    form.appendChild(tipo_usuario);
                                    form.appendChild(tipo_servicio);
                                    form.appendChild(submit);
                                    div.appendChild(form);

                                    document.body.appendChild(div);

                                    form.submit();
                                    document.getElementById("div" + idUsuarios_Movil).parentNode.removeChild(document.getElementById("div" + idUsuarios_Movil));

                                }
                            });
                        });


                    });
                });

                break;
            case 2:
                GenerarCredenciales().then(function (credenciales) {
                    var nuevaApikey = credenciales.apikey;
                    var nuevaSesion = credenciales.idsesion;
                    var nuevoToken = credenciales.token;

                    /************ Inicio de codigo para el mapeo de las notificaciones de los elementos **************/
                    var fecha = getFecha();
                    var hora = getHora();
                    var idNotificacion = InsertaNotificacion(idLlamada, usr["idUsuarios_Movil"], fecha, hora);
                    idNotificacion.then(function (response) {
                        if (response.failure) {

                        } else {
                            var idNot = response.idNotificacion;
                            var SolicitarVideo = FireBaseNotificacionEmergencia(usr["FireBaseKey"], nuevaApikey, nuevaSesion, nuevoToken, idLlamada, idNot);
                            SolicitarVideo.then(function (data) {
                                if (data.failure) {
                                    //InsertarCredencialesUsr(idUsuarios_Movil, "-1");
                                    Swal.fire(
                                            'Upsss...!',
                                            'Algo salio mal y no pudo enviarse la notificación. <br>- Firebase responde:Failure:1',
                                            'error'
                                            );

                                    $.ajax({
                                        type: 'POST',
                                        url: 'ActualizaEstadoNot',
                                        contentType: "application/json; charset=utf-8",
                                        dataType: "json",
                                        data: JSON.stringify({
                                            "idNotificacion": idNot
                                        }),
                                        success: function (response) {
                                        },
                                        error: function (err) {
                                            alert("error");
                                        }
                                    });
                                } else {
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
                                }
                            });
                        }
                    });


                    /******************************************** Fin ************************************************/

                });
                break;
            case 3:
                if (!usr.estatus) {

                    GenerarCredenciales().then(function (credenciales) {
                        var nuevaApikey = credenciales.apikey;
                        var nuevaSesion = credenciales.idsesion;
                        var nuevoToken = credenciales.token;

                        /************ Inicio de codigo para el mapeo de las notificaciones de los elementos **************/
                        var fecha = getFecha();
                        var hora = getHora();
                        var idNotificacion = InsertaNotificacion(idLlamada, usr["idUsuarios_Movil"], fecha, hora);
                        idNotificacion.then(function (response) {
                            if (response.failure) {

                            } else {
                                var idNot = response.idNotificacion;
                                var SolicitarVideo = FireBaseNotificacionEmergencia(usr["FireBaseKey"], nuevaApikey, nuevaSesion, nuevoToken, idLlamada, idNot);
                                SolicitarVideo.then(function (data) {
                                    if (data.failure) {
                                        //InsertarCredencialesUsr(idUsuarios_Movil, "-1");


//                                Swal.fire(
//                                        'Upsss...!',
//                                        'Algo salio mal y no pudo enviarse la notificación',
//                                        'error'
//                                        );
                                        $.ajax({
                                            type: 'POST',
                                            url: 'ActualizaEstadoNot',
                                            contentType: "application/json; charset=utf-8",
                                            dataType: "json",
                                            data: JSON.stringify({
                                                "idNotificacion": idNot
                                            }),
                                            success: function (response) {
                                            },
                                            error: function (err) {
                                                alert("error");
                                            }
                                        });
                                    } else {



//                                swal(
//                                        'Notificacion enviada!',
//                                        'El elemento estan siendo notificado.',
//                                        'success'
//                                        );
                                    }
                                });
                            }
                        });
                        /******************************************** Fin ************************************************/

                    });
                }

                break;
        }
    } else {
        if (TipoDeSolicitud === 2) {
            Swal.fire(
                    'Upsss...!',
                    'Algo salio mal y no pudo enviarse la notificación. <br>- Firebase-Key: No encontrada',
                    'error'
                    );
        }
        if (($("#span").length)) {

            const Toast = Swal.mixin({
                toast: true,
                position: 'center',
                showConfirmButton: false,
                timer: 3000
            });
            Toast.fire({
                html: "<h1 style=\"color: #D7D7D7;\">Hubo un error inesperado...</h1><p style=\"color: white;font-size: 15px;\"><br>Intentalo mas tarde<br><label style=\"color: bisque;font-size: 15px;margin: 0;\"></label></p>",
                type: 'error'
            });
        }


    }

}
function FireBaseSolicitudVideo(FireBaseKey, apikey, idsesion, token, idNotificacion) {

    var hoy = new Date();
    var fecha = hoy.getDate() + '-' + hoy.getMonth() + '-' + hoy.getFullYear();
    var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();

    return Promise.resolve($.ajax({
        type: 'POST',
        url: 'https://fcm.googleapis.com/fcm/send',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(
                {
                    "to": FireBaseKey,
                    "content_available": true,
                    "data": {
                        "title": "Centro de mando solicita video",
                        "text": ALIAS,
                        "type": "3",
                        "sound": "default",
                        "fecha": getFecha(),
                        "hora": getHora(),
                        "apikey": apikey,
                        "idsesion": idsesion,
                        "token": token,
                        "idNotificacion": idNotificacion
                    },
                    "android": {
                        "priority": "high",
                        "sound": "default"
                    }
                }

        ),
        headers: {
            'Authorization': document.getElementById("FireBaseAuthorization").value
        },
        success: function (response) {
            console.log(response);

            if (response.failure) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 3000
                });
                Toast.fire({
                    //title:"Hubo un error inesperado, intentalo mas tarde....",
                    html: "<h1 style=\"color: #D7D7D7;\">Hubo un error inesperado...</h1><h2 style=\"color: white;font-size: 15px;\"><br>Intentalo mas tarde<br><label style=\"color: bisque;font-size: 15px;margin: 0;\"></label></h2>",
                    type: 'error'
                });

                if (idNotificacion !== undefined) {
                    RegistrarEnvioFallido(idNotificacion);
                }
            }
        },
        error: function (err) {

            console.error(err);

        }
    }));
}
function FireBaseChat(FireBaseKey, mensaje) {


    return Promise.resolve($.ajax({
        type: 'POST',
        url: 'https://fcm.googleapis.com/fcm/send',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(
                {
                    "to": FireBaseKey,
                    "content_available": true,
                    "notification": {
                        "body": mensaje,
                        "title": ALIAS + " ha enviado un mensaje."
                    },
                    "android": {
                        "priority": "high",
                        "sound": "default"
                    }
                }

        ),
        headers: {
            'Authorization': document.getElementById("FireBaseAuthorization").value
        },
        success: function (response) {


            if (response.failure) {
                console.log("algo salio mal al enviar la notificacion por firebase");
//                const Toast = Swal.mixin({
//                    toast: true,
//                    position: 'center',
//                    background: '#FFF url(' + hostdir + '/' + DEPENDENCIA + '/resources/Img/formBackground.png)',
//                    showConfirmButton: false,
//                    timer: 3000
//                });
//                Toast.fire({
//                    //title:"Hubo un error inesperado, intentalo mas tarde....",
//                    html: "<h1 style=\"color: #D7D7D7;\">Hubo un error inesperado...</h1><h2 style=\"color: white;font-size: 15px;\"><br>Intentalo mas tarde<br><label style=\"color: bisque;font-size: 15px;margin: 0;\"></label></h2>",
//                    type: 'error'
//                });

//                if (idNotificacion !== undefined) {
//                    RegistrarEnvioFallido(idNotificacion);
//                }
            }
        },
        error: function (err) {



        }
    }));
}
function RegistrarEnvioFallido(idNotificacion) {

    var json = {
        "idNotificacion": idNotificacion
    };
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/solicitudVideo/RegistrarEnvioFallido',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(json),
        success: function (response) {
            console.info(response);
        },
        error: function (err) {
            //alert("No hay ubicacion para el usuario:" + idUsuarios_Movil);
            console.error(err);
        }
    }));
}
function RegistrarEnvioCancelado(idNotificacion) {

    var json = {
        "idNotificacion": idNotificacion
    };
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/solicitudVideo/RegistrarEnvioCancelado',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(json),
        success: function (response) {
            console.info(response);
        },
        error: function (err) {
            //alert("No hay ubicacion para el usuario:" + idUsuarios_Movil);
            console.error(err);
        }
    }));
}
function FireBaseNotificacionEmergencia(FireBaseKey, apikey, idsesion, token, idLlamada, idNotificacion) {
    var hoy = new Date();
    var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    var fecha = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate() + " " + hora;

    var temergencia = incidente.Incidente;
    var turgencia = incidente.Prioridad;
    var descripcionLugar = document.getElementById("DescripcionLugar").value;
    var reporte = document.getElementById("AreaReporte").value;

//       
//       
//       
//       
//       
//       
//
//       

    var json = {

        "type": "5",
        "sound": "default",
        "fecha": getFecha(),
        "hora": getHora(),
        "tipoEmergencia": temergencia,
        "tipoUrgencia": turgencia,
        "latitud": Latitud,
        "longitud": Longitud,
        "descripcionLugar": descripcionLugar,
        "reporte": reporte,
        "date": hoy,
        "apikey": apikey,
        "idsesion": idsesion,
        "token": token,
        "direccion": direccion,
        "idSocket": idSocketOperador,
        "folioincidentes": FolioIncidentes,
        "origen": DEPENDENCIA,
        "idLlamada": idLlamada,
        "idNotificacion": idNotificacion


    };

    console.log(FireBaseKey)
    return Promise.resolve($.ajax({
        type: 'POST',
        url: 'https://fcm.googleapis.com/fcm/send',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(
                {
                    "to": FireBaseKey,
                    "content_available": true,
                    "data": json,
                    "android": {
                        "priority": "high",
                        "sound": "default"
                    }
                }

        ),
        headers: {
            'Authorization': document.getElementById("FireBaseAuthorization").value
        },
        success: function (response) {
//              
//               
        },
        error: function (err) {


        }
    }));


}
function GenerarCredenciales() {

    return Promise.resolve($.ajax({
        type: 'GET',
        //type: 'POST',
        url: 'GeneraCredenciales',
        contentType: "application/json",
        dataType: "json",
        success: function (response) {


        },
        error: function (err) {


            const Toast = Swal.mixin({
                toast: true,
                position: 'center',
                showConfirmButton: false,
                timer: 3000
            });
            Toast.fire({
                html: "<h1 style=\"color: #D7D7D7;\">Hubo un error inesperado...</h1><p style=\"color: white;font-size: 15px;\"><br>Intentalo mas tarde<br><label style=\"color: bisque;font-size: 15px;margin: 0;\"></label></p>",
                type: 'error'
            });
        }
    }));
}
function directorio_pacientesCCB() {

    return Promise.resolve($.ajax({
        type: 'GET',
        url: '/plataforma360/API/directorio/pacientesCCB',
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            console.log(response);
        },
        error: function (err) {
            console.error(err);
        }
    }));
}



function GenerarTicket(tipo) {

    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/Ticket',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "fecha": getFecha(),
            "hora": getHora(),
            "tipo": tipo
        }),
        success: function (response) {

        },
        error: function (err) {


            const Toast = Swal.mixin({
                toast: true,
                position: 'center',
                background: '#FFF url(' + hostdir + '/' + DEPENDENCIA + '/resources/Img/formBackground.png)',
                showConfirmButton: false,
                timer: 3000
            });
            Toast.fire({
                html: "<h1 style=\"color: #D7D7D7;\">Hubo un error inesperado...<br>No se pudo generar el id de la llamada</h1><p style=\"color: white;font-size: 15px;\"><br>Intentalo mas tarde<br><label style=\"color: bisque;font-size: 15px;margin: 0;\"></label></p>",
                type: 'error'
            });
        }
    }));
}

function InsertaNotificacion(idLlamada, idUsuario, fecha, hora) {
    var json = {};
    if (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).hasOwnProperty("tipo_usuario") && JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).hasOwnProperty("tipo_servicio")) {
        json = {
            "idLlamada": idLlamada,
            "idUsuario": idUsuario,
            "fecha": fecha,
            "hora": hora,
            "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
            "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio
        };
    } else {
        json = {
            "idLlamada": idLlamada,
            "idUsuario": idUsuario,
            "fecha": fecha,
            "hora": hora
        };
    }
    return Promise.resolve($.ajax({
        type: 'POST',
        url: 'InsertaNotificacion',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(json),
        success: function (response) {


        },
        error: function (err) {


        }
    }));
}

///////////////////////////////Incidentes Cercano*********

function insertarIncidenteCercano(Incidente) {

    console.log(Incidente);
    ArrayIncidentesCercanos.push(Incidente);


    if ($("#SinIncidentes").length) {
        document.getElementById("SinIncidentes").parentNode.removeChild(document.getElementById("SinIncidentes"));
    }


    if (!$("#" + Incidente.folio).length) {
        console.log("AGREGANDO...");

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

        if (Incidente.incidente.Prioridad === "Urgente") {
            image = new google.maps.MarkerImage(
                    PathRecursos + 'Img/IconoMap/red_dot.png',
                    null, // size
                    null, // origin
                    new google.maps.Point(8, 8), // anchor (move to center of marker)
                    new google.maps.Size(16, 16) // scaled size (required for Retina display icon)
                    );
        } else if (Incidente.incidente.Prioridad === "Rápida") {
            image = new google.maps.MarkerImage(
                    PathRecursos + 'Img/IconoMap/orange_dot.png',
                    null, // size
                    null, // origin
                    new google.maps.Point(8, 8), // anchor (move to center of marker)
                    new google.maps.Size(16, 16) // scaled size (required for Retina display icon)
                    );
        } else if (Incidente.incidente.Prioridad === "Normal" || Incidente.incidente.Prioridad === "Improcedente" || Incidente.incidente.Prioridad === "Baja") {
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



            document.getElementById("folioExterno").value = Incidente.folioExterno;
            document.getElementById("folioExterno").disabled = false;
            document.getElementById("DescripcionLugar").value = Incidente.DescripcionLugar;
            document.getElementById("AreaReporte").value = Incidente.AreaReporte;
            document.getElementById("EstablecerIncidente").style.display = "none";



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
                    //document.getElementById(id).checked = 1;
                }
            }

            document.getElementById("aheadingOne").click();
            document.getElementById("collapseThree").className = "collapse show";
            document.getElementById("headingZero").style = "display:none;";
            document.getElementById("headingOne").style = "display:none;";
            //$('#notificarDependencias').submit();
            Swal.fire({
                title: "Notificaciones Automaticas",
                //text: 'El reporte se ha guardado correctamente',
                html: "<p style=\"color:white;font: bold 12px Arial; padding: 10px; padding-top:20px;margin: 0;\">Las dependencias correspondientes ya han sido notificadas por este incidente, y estan atendiendolo...</p>",
                showConfirmButton: true,
                timer: 2500
            });

//            var swal2popup = document.getElementsByClassName("swal2-popup");
//            if (swal2popup.length) {
//                swal2popup[0].style="display: flex; width: 20%;";
//            }
//            var swal2header = document.getElementsByClassName("swal2-header");
//            if (swal2header.length) {
//                swal2header[0].style.background = "#40464f";
//            }
//            var swal2icon = document.getElementsByClassName("swal2-info");
//            if (swal2icon.length) {
//                swal2icon[0].style = "display:flex; border-color: #9de0f6; color: #3fc3ee; margin: 5%;";
//            }
////            var swal2icontext = document.getElementsByClassName("swal2-icon-text");
////            if (swal2icontext.length) {
////                swal2icontext[2].style = "margin-left: auto; margin-right: auto; display: table;";
////            }
//            var swal2title = document.getElementsByClassName("swal2-title");
//            if (swal2title.length) {
//                swal2title[0].style.display = "none";
//            }
//            var swal2actions = document.getElementsByClassName("swal2-actions");
//            if (swal2actions.length) {
//                swal2actions[0].style = "width: 100%; z-index: 0; background: white; margin: 0;border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;padding: 5%;";
//            }

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
}
function NuevoIncidente() {
    incidente_establecido = false;
    var contenedor = document.createElement("div");
    contenedor.style = "height: auto; background: #4db2d7; border-radius: 10px; display: inline-block; margin: 5px 10px; vertical-align: bottom; width: calc( 100% - 20px); box-shadow: -3px 3px 20px 0px black; cursor: pointer; ";
    var row = document.createElement("div");
    row.className = "row col-12 m-0 p-0";
    var div1 = document.createElement("div");
    div1.className = "col-12";
    var incidentep = document.createElement("p");
    incidentep.style = "color: black; padding: 0; margin: 5px 10px 0px; font: 14px Arial; width: 100%;";
    incidentep.innerHTML = "Generar nuevo reporte";
    var folio = document.createElement("p");
    folio.style = "color: black; padding: 0; margin: 0px 20px 5px; font: 10px Arial;";
    folio.innerHTML = getHora();
    //var div2 = document.createElement("div");
    //                div2.className = "col-3 pr-0";
    //                var boton = document.createElement("input");
    //                boton.style = "height: 100%; border-top-right-radius: 10px; border-bottom-right-radius: 10px; border: none; background-color: #ffffff; color: white; background-image: linear-gradient(90deg, #ffffff00, #00a5b8);  width: 100%;";
    //                boton.value = "Seleccionar";

    var loading = document.createElement("div");
    loading.id = "loadingIncidentes";
    loading.style = "background: #dfe1df; margin: 5px; border-radius: 4px;";
    var img = document.createElement("img");
    img.src = PathRecursos + 'gif/loader.webp';
    img.style = "display: block; margin-left: auto; margin-right: auto; width: 60px; padding: 5px;";

    var p = document.createElement("p");
    p.innerHTML = "Buscando incidentes cercanos";
    p.style = "text-align: center; font: 12px Arial; padding-bottom: 10px;";

    loading.appendChild(img);
    loading.appendChild(p);
    div1.appendChild(incidentep);
    div1.appendChild(folio);
    //div2.appendChild(boton);
    row.appendChild(div1);
    //row.appendChild(div2);
    contenedor.appendChild(row);
    document.getElementById("collapseZero").appendChild(contenedor);
    document.getElementById("collapseZero").appendChild(loading);


    contenedor.addEventListener("click", function () {
        document.getElementById("headingOne").style = "display:block;";
        NuevoReporte = true;


        vue.value = [];

        document.getElementById("nivelemergencia").value = "";
        document.getElementById("folio").value = "";
        document.getElementById("FolioIncidentes").value = "";
        incidente = "";

        FolioIncidentes = null;
        Folio = null;
        $("#headingOne").style = "display:block";
        document.getElementById("aheadingZero").click();
        document.getElementById("collapseThree").className = "collapse show";

    });
}
function SinIncidentes() {
    var contenedor = document.createElement("div");
    contenedor.style = "height: auto; background: #ffffff; border-radius: 3px; display: inline-block; margin: 5px 10px;  width: calc( 100% - 20px); ";
    contenedor.id = "SinIncidentes";
    var row = document.createElement("div");
    row.className = "row col-12 m-0 p-0";
    var div1 = document.createElement("div");
    div1.className = "col-12";
    var incidentep = document.createElement("p");
    incidentep.style = "color:#b5b5b5; padding: 0; margin: 5px 10px 0px; font: 14px Arial; width: 100%; ";
    incidentep.innerHTML = "No hay incidentes cercanos...<br>";
    var folio = document.createElement("p");
    folio.style = "color: #717171; padding: 0; margin: 5px 20px 5px; font: 10px Arial;";
    folio.innerHTML = getFecha() + " - " + getHora();
    //var div2 = document.createElement("div");
    //                div2.className = "col-3 pr-0";
    //                var boton = document.createElement("input");
    //                boton.style = "height: 100%; border-top-right-radius: 10px; border-bottom-right-radius: 10px; border: none; background-color: #ffffff; color: white; background-image: linear-gradient(90deg, #ffffff00, #00a5b8);  width: 100%;";
    //                boton.value = "Seleccionar";

    div1.appendChild(incidentep);
    div1.appendChild(folio);
    //div2.appendChild(boton);
    row.appendChild(div1);
    //row.appendChild(div2);
    contenedor.appendChild(row);
    document.getElementById("collapseZero").appendChild(contenedor);


    contenedor.addEventListener("click", function () {

    });
}


function playAudio() {
    var audioElement = document.createElement('audio');
    audioElement.id = "audioRE";
    // indicamos el archivo de audio a cargar
    audioElement.setAttribute('src', '/' + DEPENDENCIA + '/resources/Audio/Notificacion/notReporte.ogg');
    if (!checkCookieOperador()) {
        // Si deseamos que una vez cargado empieze a sonar...
        audioElement.setAttribute('autoplay', 'autoplay');
    }
    document.getElementById("test").appendChild(audioElement);

    setTimeout(function () {
        var audio = document.getElementById("audioRE");
        audio.parentNode.removeChild(audio);
    }, 1000);
}
var elementosMapDinamicos = {};

function initMapDinamico(idUsuario, id, lat, lng) {
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    var map = new google.maps.Map(document.getElementById('map' + id), {zoom: 5, center: {lat: 19.503329, lng: -99.185714}/*,mapTypeId:'satellite'*/, styles: [{featureType: 'administrative', elementType: 'geometry', stylers: [{visibility: "off"}, {"weight": 1}]}, {featureType: 'administrative', elementType: 'geometry.fill', stylers: [{visibility: "on"}]}, {featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{visibility: "off"}]}, {featureType: 'administrative', elementType: 'labels', stylers: [{color: '#000000'}, {visibility: "off"}]}, {featureType: 'administrative.country', elementType: 'geometry', stylers: [{color: '#a6a6a6'}, {visibility: "on"}, {"weight": 1.5}]}, {featureType: 'administrative.country', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.country', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.land_parcel', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.land_parcel', elementType: 'labels', stylers: [{visibility: "on"}]}, {featureType: 'administrative.land_parcel', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.locality', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.locality', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.locality', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.neighborhood', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.neighborhood', elementType: 'labels', stylers: [{color: '#696969'}, {visibility: "simplified"}]}, {featureType: 'administrative.neighborhood', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.province', elementType: 'geometry', stylers: [{visibility: "on"}, {"weight": 1.5}]}, {featureType: 'administrative.province', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.province', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: "landscape", stylers: [{color: '#D5D8DC'}]}, {featureType: 'landscape', elementType: 'geometry', stylers: [{color: '#D5D8DC'}]}, {featureType: 'landscape', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'landscape', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{color: '#526081'}, {visibility: "off"}]}, {featureType: 'landscape.natural.landcover', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.landcover', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'road', elementType: 'geometry', stylers: [{visibility: "simplified"}]}, {featureType: 'road', elementType: 'labels', stylers: [{visibility: "simplified"}]}, {featureType: 'road', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'water', elementType: 'geometry', stylers: [{color: '#F2F4F4'}, {visibility: "on"}]}, {featureType: 'water', elementType: 'labels', stylers: [{visibility: "off"}]}]});
    map.setTilt(45);
    geocoder = new google.maps.Geocoder;
    var ubicacion = {lat: lat, lng: lng};
    var integrante = BuscarIntegranteDataG(idUsuario);
    if (integrante === null) {
        ConsultaIntegrante(idUsuario).then(function (response) {
            if (response.hasOwnProperty("idUsuarios_Movil")) {
                integrante = response;
                var icon = integrante.icon;
                var marker;
                if (icon !== null && icon !== "" && icon !== undefined) {
                    var icono = {
                        url: icon, // url
                        scaledSize: new google.maps.Size(25, 25), // scaled size
                        origin: new google.maps.Point(0, 0), // origin
                        anchor: new google.maps.Point(13, 25) // anchor
                    };
                    marker = new google.maps.Marker({
                        position: ubicacion,
                        map: map,
                        icon: icono,
                        id: id
                    });
                } else {
                    marker = new google.maps.Marker({
                        position: ubicacion,
                        map: map,
                        id: id
                    });
                }
                elementosMapDinamicos[id] = {
                    "marker": marker,
                    "map": map
                };
            }
        });
    } else {
        var icon = integrante.icon;
        var marker;
        if (icon !== null && icon !== "" && icon !== undefined) {
            var icono = {
                url: icon, // url
                scaledSize: new google.maps.Size(25, 25), // scaled size
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(13, 25) // anchor
            };
            marker = new google.maps.Marker({
                position: ubicacion,
                map: map,
                icon: icono,
                id: id
            });
        } else {
            marker = new google.maps.Marker({
                position: ubicacion,
                map: map,
                id: id
            });
        }
        elementosMapDinamicos[id] = {
            "marker": marker,
            "map": map
        };
    }


    //geocodeLatLngDinamico(marker,geocoder,infowindow,map);

}
function ConsultaIntegrante(idUsuario) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/ConsultaIntegrante',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "idUsuario": idUsuario
        }),
        success: function (response) {
        },
        error: function (err) {

        }
    }));
}
function initMapLlamadasS(id) {
    var map = new google.maps.Map(document.getElementById('map' + id), {zoom: 5, center: {lat: 19.503329, lng: -99.185714}/*,mapTypeId:'satellite'*/, styles: [{featureType: 'administrative', elementType: 'geometry', stylers: [{visibility: "off"}, {"weight": 1}]}, {featureType: 'administrative', elementType: 'geometry.fill', stylers: [{visibility: "on"}]}, {featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{visibility: "off"}]}, {featureType: 'administrative', elementType: 'labels', stylers: [{color: '#000000'}, {visibility: "off"}]}, {featureType: 'administrative.country', elementType: 'geometry', stylers: [{color: '#a6a6a6'}, {visibility: "on"}, {"weight": 1.5}]}, {featureType: 'administrative.country', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.country', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.land_parcel', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.land_parcel', elementType: 'labels', stylers: [{visibility: "on"}]}, {featureType: 'administrative.land_parcel', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.locality', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.locality', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.locality', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.neighborhood', elementType: 'geometry', stylers: [{visibility: "on"}]}, {featureType: 'administrative.neighborhood', elementType: 'labels', stylers: [{color: '#696969'}, {visibility: "simplified"}]}, {featureType: 'administrative.neighborhood', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'administrative.province', elementType: 'geometry', stylers: [{visibility: "on"}, {"weight": 1.5}]}, {featureType: 'administrative.province', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'administrative.province', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: "landscape", stylers: [{color: '#D5D8DC'}]}, {featureType: 'landscape', elementType: 'geometry', stylers: [{color: '#D5D8DC'}]}, {featureType: 'landscape', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'landscape', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{color: '#526081'}, {visibility: "off"}]}, {featureType: 'landscape.natural.landcover', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.landcover', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'landscape.natural.terrain', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'poi', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'road', elementType: 'geometry', stylers: [{visibility: "simplified"}]}, {featureType: 'road', elementType: 'labels', stylers: [{visibility: "simplified"}]}, {featureType: 'road', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'geometry', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'labels', stylers: [{visibility: "off"}]}, {featureType: 'transit', elementType: 'labels.icon', stylers: [{visibility: "off"}]}, {featureType: 'water', elementType: 'geometry', stylers: [{color: '#F2F4F4'}, {visibility: "on"}]}, {featureType: 'water', elementType: 'labels', stylers: [{visibility: "off"}]}]});
    map.setTilt(45);
    elementosMapDinamicos[id] = {
        "map": map
    };
}

function geocodeLatLngDinamico(marker, geocoder, infowindow, map) {
    var lat = marker.getPosition().lat();
    var lng = marker.getPosition().lng();
    var latlng = {lat: lat, lng: lng};
    var GeoCodeResult;
    var direccion;
    geocoder.geocode({'location': latlng}, function (results, status) {
//        console.log(status);
//        console.log(results);
//        console.log(map);
        if (status === 'OK') {
            if (results[0]) {
                GeoCodeResult = results[0].formatted_address;
                direccion = GeoCodeResult;
                infowindow.setContent("<div style=\"margin: 3px;font: 13px Arial;color: black;\">" + GeoCodeResult + "</div>");
                infowindow.open(map, marker);
                marker.addListener("click", function () {
                    infowindow.open(map, marker);
                });
                map.setZoom(16);
                map.setCenter(latlng);
                elementosMapDinamicos[marker.id].infowindow = infowindow;
            }
        } else {
            elementosMapDinamicos[marker.id].infowindow = "";
        }
    });
}
function habilitarMaximizarVideo() {
    var inputM = document.createElement("input");
    inputM.type = "button";
    inputM.id = "maximizarVideo";
    inputM.className = "maximizarVideo";
    document.getElementById("GRID").appendChild(inputM);
    var inpM = $(inputM);
    inpM.click(function () {
        inpM.toggleClass("active");
        if (inpM.hasClass("active")) {
            console.log("Active");
            $("aside").css({
                "display": "none"
            });
            $("header").css({
                "display": "none"
            });
            $("footer").css({
                "display": "none"
            });
            $("section").css({
                "height": "100%",
                "width": "100%",
                "top": "0",
                "left": "0",
                "background": "black"
            });
            $("#side1").css({
                "display": "none"
            });
            $("#hamburgerMenu").parent().css({
                "display": "none"
            });
            $("#side2").css({
                "width": "100%",
                "padding": "0",
                "height": "100%"
            });
            $("#publishers").css({
                "display": "none"
            });
            $("#GRID").css({
                "height": "100%"
            });
            $("#loading").css({
                "position": "absolute",
                "height": "20%",
                "width": "10%",
                "left": "45%",
                "top": "30%"
            });

        } else {
            console.log("Not Active");
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
        }
    });
}


function mensajeIndividual(idUsuario) {
    var firebase = BuscarIntegranteDataG(idUsuario.toString()).FireBaseKey;
    Swal.fire({
        title: 'Enviar mensaje',
        html: //-------------------------TITULO
                //-------------------------Body 
                '<label class="sweetalrt" style="padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 75%;">Mensaje:</label>' +
                '<textarea id="swal-input" class="multiselect__textarea" rows="10" cols="50" maxlength="250"></textarea>',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            return [
                document.getElementById('swal-input').value
            ];
        }
    }).then((result) => {

        if (result.value) {
            if (result.value[0] !== "") {
                console.log(result.value[0]);
                FireBaseChat(firebase, result.value[0]);
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 1000
                });
                Toast.fire({
                    type: 'success',
                    title: 'Enviando mensaje...'
                }).then();

            }
        }
    });
}
function Agregar_ModalImagenes(msj) {
    var item = document.createElement("div");
    item.className = "carousel-item";
    item.style.backgroundImage = "url(\"" + msj.value + "\")"
    item.id = msj.idFile;
    $("#CntImgCarrusel").append(item);
}
function modalImagenes() {
    console.log("modalImagenes");
    var contenedor = document.createElement("div");
    contenedor.className = "modalImagenes";
    contenedor.id = "modalImagenes";
    contenedor.style.display = "none";
    var carouselExampleControls = document.createElement("div");
    carouselExampleControls.id = "carouselExampleControls";
    carouselExampleControls.className = "carousel slide carruselImagenes";
    var carrusel = document.createElement("div");
    carrusel.className = "carousel-inner  h-100";
    carrusel.id = "CntImgCarrusel";



    var prev = document.createElement("a");
    prev.className = "carousel-control-prev";
    prev.setAttribute("href", "#carouselExampleControls");
    prev.setAttribute("role", "button");
    prev.setAttribute("data-slide", "prev");
    var span1prev = document.createElement("span");
    span1prev.className = "carousel-control-prev-icon";
    span1prev.setAttribute("aria-hidden", "true");
    var span2prev = document.createElement("span");
    span2prev.className = "sr-only";
    span2prev.innerHTML = "Previous";
    prev.appendChild(span1prev);
    prev.appendChild(span2prev);


    var next = document.createElement("a");
    next.className = "carousel-control-next";
    next.setAttribute("href", "#carouselExampleControls");
    next.setAttribute("role", "button");
    next.setAttribute("data-slide", "next");
    var span1next = document.createElement("span");
    span1next.className = "carousel-control-next-icon";
    span1next.setAttribute("aria-hidden", "true");
    var span2next = document.createElement("span");
    span2next.className = "sr-only";
    span2next.innerHTML = "Next";
    next.appendChild(span1next);
    next.appendChild(span2next);

    var cerrar = document.createElement("input");
    cerrar.type = "button";
    cerrar.className = "Cerrar_ModalImagenes";
    cerrar.value = "X";

    contenedor.appendChild(cerrar);

    cerrar.addEventListener("click", function () {
        contenedor.style.display = "none";
    });


    carouselExampleControls.appendChild(carrusel);
    carouselExampleControls.appendChild(prev);
    carouselExampleControls.appendChild(next);
    contenedor.appendChild(carouselExampleControls);
    $("body").append(contenedor);


}

function RequestGET(url) {
    return Promise.resolve($.ajax({
        type: 'GET',
        url: '/' + DEPENDENCIA + url,
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            console.log(url);
            console.log(response);
            console.log("/*********************************************/");
        },
        error: function (err) {
            console.error(err);
        }
    }));
}
function RequestPOST(url, json) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(json),
        success: function (response) {
            console.log(url);
            console.log(response);
            console.log("/*********************************************/");
        },
        error: function (err) {
            console.error(err);
        }
    }));
}



function buildJSON() {
    let json = {};
    let inp_text = $("input[type=text]");
    for (var i = 0; i < inp_text.length; i++) {
        //Revisar si la llave ya existe 
        let id = inp_text[i].id;
        if (json.id) {
            console.log("Duplicidad de ID's'------> " + id);
        } else {
            json[id] = inp_text[i].value;
        }
    }
    let inp_number = $("input[type=number]");
    for (var i = 0; i < inp_number.length; i++) {
        //Revisar si la llave ya existe 
        let id = inp_number[i].id;
        if (json.id) {
            console.log("Duplicidad de ID's'------> " + id);
        } else {
            json[id] = inp_number[i].value;
        }
    }
    let select = $("select");
    for (var i = 0; i < select.length; i++) {
        //Revisar si la llave ya existe 
        let id = select[i].id;
        if (json.id) {
            console.log("Duplicidad de ID's'------> " + id);
        } else {
            json[id] = select[i].value;
        }
    }
    let inp_hidden = $("input[type=hidden]");
    for (var i = 0; i < inp_hidden.length; i++) {
        //Revisar si la llave ya existe 
        let id = inp_hidden[i].id;
        if (id !== "config" &&
                id !== "AllUsrs" &&
                id !== "NameAdministrador" &&
                id !== "IdAdministrador" &&
                id !== "data" &&
                id !== "FireBaseAuthorization" &&
                id !== "apikey" &&
                id !== "sesion" &&
                id !== "token" &&
                id !== "llamada" &&
                id !== "idStream" &&
                id !== "origen" &&
                id !== "modo" &&
                id !== "modoLlamada" &&
                id !== "idelementos" &&
                id !== "elementos" &&
                id !== "iconUsr") {
            if (json.id) {
                console.log("Duplicidad de ID's'------> " + id);
            } else {
                json[id] = inp_hidden[i].value;
            }
        }

    }
    let inp_password = $("input[type=password]");
    for (var i = 0; i < inp_password.length; i++) {
        //Revisar si la llave ya existe 
        let id = inp_password[i].id;
        if (json.id) {
            console.log("Duplicidad de ID's'------> " + id);
        } else {
            json[id] = inp_password[i].value;
        }
    }
    return  json;
}


function buildJSON_Section(id) {
    let json = {};
    let inp_text = $("#" + id + " input[type=text]");
    for (var i = 0; i < inp_text.length; i++) {
        //Revisar si la llave ya existe 
        let id = inp_text[i].id;
        if (json.id) {
            console.log("Duplicidad de ID's'------> " + id);
        } else {
            json[id] = inp_text[i].value.replace(/"/g, "&quot;");
            json[id] = json[id].replace(/'/g, "&quot;");
        }
    }
    let inp_number = $("#" + id + " input[type=number]");
    for (var i = 0; i < inp_number.length; i++) {
        //Revisar si la llave ya existe 
        let id = inp_number[i].id;
        if (json.id) {
            console.log("Duplicidad de ID's'------> " + id);
        } else {
            json[id] = inp_number[i].value.replace(/"/g, "&quot;");
            json[id] = json[id].replace(/'/g, "&quot;");
        }
    }
    let select = $("#" + id + " select");
    for (var i = 0; i < select.length; i++) {
        //Revisar si la llave ya existe 
        let id = select[i].id;
        if (json.id) {
            console.log("Duplicidad de ID's'------> " + id);
        } else {
            json[id] = select[i].value.replace(/"/g, "&quot;");
            json[id] = json[id].replace(/'/g, "&quot;");
        }
    }
    let inp_hidden = $("#" + id + " input[type=hidden]");
    for (var i = 0; i < inp_hidden.length; i++) {
        //Revisar si la llave ya existe 
        let id = inp_hidden[i].id;
        if (id !== "config" &&
                id !== "AllUsrs" &&
                id !== "NameAdministrador" &&
                id !== "IdAdministrador" &&
                id !== "data" &&
                id !== "FireBaseAuthorization" &&
                id !== "apikey" &&
                id !== "sesion" &&
                id !== "token" &&
                id !== "llamada" &&
                id !== "idStream" &&
                id !== "origen" &&
                id !== "modo" &&
                id !== "modoLlamada" &&
                id !== "idelementos" &&
                id !== "elementos" &&
                id !== "iconUsr") {
            if (json.id) {
                console.log("Duplicidad de ID's'------> " + id);
            } else {
                json[id] = inp_hidden[i].value.replace(/"/g, "&quot;");
                json[id] = json[id].replace(/'/g, "&quot;");
            }
        }

    }
    let inp_password = $("#" + id + " input[type=password]");
    for (var i = 0; i < inp_password.length; i++) {
        //Revisar si la llave ya existe 
        let id = inp_password[i].id;
        if (json.id) {
            console.log("Duplicidad de ID's'------> " + id);
        } else {
            json[id] = inp_password[i].value.replace(/"/g, "&quot;");
            json[id] = json[id].replace(/'/g, "&quot;");
        }
    }
    let text_area = $("#" + id + " textarea");
    for (var i = 0; i < text_area.length; i++) {
        //Revisar si la llave ya existe 
        let id = text_area[i].id;
        if (json.id) {
            console.log("Duplicidad de ID's'------> " + id);
        } else {
            json[id] = text_area[i].value.replace(/"/g, "");
            json[id] = json[id].replace(/'/g, "");
        }
    }
    return  json;
}

function acceso_externo(url) {
    RequestPOST("/API/cuenta360/access_token", {
        "token": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).token,
        "id360": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys
    }).then(function (response) {
        if (response.success) {
            //access_token
            let path = url + "API/cuenta360/access_token/" + JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys + "/" + response.access_token;
            window.location.replace(path);
//            window.open(path);
        }

    });
}

function load_file_img(id) {
    // id es del file
    //mandar a subir el archivo regresa url
    document.getElementById(id).addEventListener('change', (evt) => {
        $("#guardando_logo").removeClass("d-none");
        var params = {
            Bucket: BucketName,
            Prefix: 'Logotipos'
        };
        s3.listObjects(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                swal.fire({
                    text: "Error de conexión con el servidor."
                });
            } else {
                console.log(data);   // successful response
                numFiles = data.Contents.length;
                var files = evt.target.files; // FileList object

                var uploadFiles = files;
                var upFile = files[0];
                if (upFile) {
                    var bucket = new AWS.S3({params: {Bucket: BucketName + "/Logotipos"}});
                    for (var i = 0; i < uploadFiles.length; i++) {
                        upFile = uploadFiles[i];
                        var params = {
                            Body: upFile,
                            Key: numFiles + upFile.name,
                            ContentType: upFile.type
                        };
                        bucket.upload(params).on('httpUploadProgress', function (evt) {
                            console.log(evt);

                        }).send(function (err, data) {
                            if (err) {
                                console.log(err, err.stack); // an error occurred
                                swal.fire({
                                    text: "Error al subir la imagen al servidor."
                                });
                            } else {
                                console.log(data);           // successful response
                                //colocar el css de id+_img

                                $("#" + id + "_logotipo").val(data.Location);
                                $("#" + id + "_logotipo_preview").text("");
                                $("#" + id + "_logotipo_preview").css({
                                    "background-image": "url(" + data.Location + ")",
                                    "background-size": "contain",
                                    "background-position": "center",
                                    "background-repeat": "no-repeat"
                                });

                            }
                            $("#guardando_logo").addClass("d-none");
                            $('#' + id).val(null);
                        });
                    }
                } else {
                    alert("Seleccione un archivo para subir al bucket");
                }
            }
        });
    }, false);

}

function fullcontainer_screen() {
    var fc = $("#bloquefull");
    $.each(fc, function (i) {
        fc[i].remove();
    })
    var full = document.createElement("div");
    full.className = "bloquefull";
    full.id = "bloquefull";
    document.getElementById("GRID").appendChild(full);
    full.scrollIntoView();

//      full.addEventListener("click", function () {
//            $("#bloquefull").remove();
//      });
    return "bloquefull";
}


function validarFecha(fecha) {
    var dtCh = "/";
    var minYear = 1900;
    var maxYear = 2100;
    function isInteger(s) {
        var i;
        for (i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            if (((c < "0") || (c > "9")))
                return false;
        }
        return true;
    }
    function stripCharsInBag(s, bag) {
        var i;
        var returnString = "";
        for (i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            if (bag.indexOf(c) == -1)
                returnString += c;
        }
        return returnString;
    }
    function daysInFebruary(year) {
        return (((year % 4 == 0) && ((!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28);
    }
    function DaysArray(n) {
        for (var i = 1; i <= n; i++) {
            this[i] = 31
            if (i == 4 || i == 6 || i == 9 || i == 11) {
                this[i] = 30
            }
            if (i == 2) {
                this[i] = 29
            }
        }
        return this
    }
    function isDate(dtStr) {
        var daysInMonth = DaysArray(12)
        var pos1 = dtStr.indexOf(dtCh)
        var pos2 = dtStr.indexOf(dtCh, pos1 + 1)
        var strDay = dtStr.substring(0, pos1)
        var strMonth = dtStr.substring(pos1 + 1, pos2)
        var strYear = dtStr.substring(pos2 + 1)
        strYr = strYear
        if (strDay.charAt(0) == "0" && strDay.length > 1)
            strDay = strDay.substring(1)
        if (strMonth.charAt(0) == "0" && strMonth.length > 1)
            strMonth = strMonth.substring(1)
        for (var i = 1; i <= 3; i++) {
            if (strYr.charAt(0) == "0" && strYr.length > 1)
                strYr = strYr.substring(1)
        }
        month = parseInt(strMonth)
        day = parseInt(strDay)
        year = parseInt(strYr)
        if (pos1 == -1 || pos2 == -1) {
            return false
        }
        if (strMonth.length < 1 || month < 1 || month > 12) {
            return false
        }
        if (strDay.length < 1 || day < 1 || day > 31 || (month == 2 && day > daysInFebruary(year)) || day > daysInMonth[month]) {
            return false
        }
        if (strYear.length != 4 || year == 0 || year < minYear || year > maxYear) {
            return false
        }
        if (dtStr.indexOf(dtCh, pos2 + 1) != -1 || isInteger(stripCharsInBag(dtStr, dtCh)) == false) {
            return false
        }
        return true
    }
    if (isDate(fecha)) {
        return true;
    } else {
        return false;
    }
}