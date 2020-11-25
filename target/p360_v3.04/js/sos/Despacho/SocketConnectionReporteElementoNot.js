/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global WEBSOCKETREPORTEELEMENTO, TraeReporteID, DEPENDENCIA */
var reportes = "";
var RENWebSocket = new WebSocket(WEBSOCKETREPORTEELEMENTO);




var TamBackup = false;
var Backup = false;
var arregloReportes = new Array();

//var audioElement = document.createElement('audio');
//audioElement.id = "audioRE";
//// indicamos el archivo de audio a cargar
//audioElement.setAttribute('src', '/' + DEPENDENCIA + '/resources/Audio/notReporte.ogg');
//if (!checkCookieOperador()) {
//    // Si deseamos que una vez cargado empieze a sonar...
//    audioElement.setAttribute('autoplay', 'autoplay');
//}
//document.getElementById("divTamBackup").appendChild(audioElement);


RENWebSocket.onmessage = function (message) {
    var s = JSON.parse(message.data);
  
   

    if (!TamBackup) {
        var tam = {
            "Tam": true,
            "TamBackup": "TamBackup"
        };
        sendMessageRE(JSON.stringify(tam));
        TamBackup = true;
    }

    // if (document.getElementById("TamBackup").value !== null) {
    var t = 0;
   
    //}
    if (!s.message.includes("~")) {

        if (JSON.parse(s.message).Nuevo) {
            t = parseInt(document.getElementById("TamBackup").textContent);



            var audioElement = document.createElement('audio');
            audioElement.id = "audioRE";
            // indicamos el archivo de audio a cargar
            audioElement.setAttribute('src', '/' + DEPENDENCIA + '/resources/Audio/Notificacion/notReporte.ogg');
            if (!checkCookieOperador()) {
                // Si deseamos que una vez cargado empieze a sonar...
                audioElement.setAttribute('autoplay', 'autoplay');
            }
            document.getElementById("divTamBackup").appendChild(audioElement);

            t += 1;
            //document.getElementById("notToast").innerHTML = "Reporte nuevo.<br>Tienes " + t + " reportes sin resolver";
            $(document).ready(function () {

                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000
                });

                Toast.fire({
                    type: 'info',
                    title: 'Reporte Nuevo. <br>Tienes ' + t + ' reporte(s) sin resolver'
                });

                $("div.swal2-container").attr("style", "margin-top: 3.5rem;margin-right: 1rem;");
                document.getElementById("swal2-content").style = "font:bold 12px Arial";
//                $('#myBtn').click(function () {
//                $('.toast').toast({delay: 2000});
//                $('.toast').toast('show');
//                });
            });
            if (t > 99) {
                document.getElementById("TamBackup").innerHTML = "+" + 99;
                document.getElementById("TamBackup").setAttribute("title", t);
                setTimeout(function () {
                    var audio = document.getElementById("audioRE");
                    audio.parentNode.removeChild(audio);
                }, 1000);

            } else {
                document.getElementById("TamBackup").innerHTML = t;
                setTimeout(function () {
                    var audio = document.getElementById("audioRE");
                    audio.parentNode.removeChild(audio);
                }, 1000);
            }
        }
        if (JSON.parse(s.message).hasOwnProperty("Elimina")) {
            t = parseInt(document.getElementById("TamBackup").textContent);
            t -= 1;
            if (t <= 99) {
                document.getElementById("TamBackup").innerHTML = t;
            } else {
                document.getElementById("TamBackup").innerHTML = "+" + 99;
                document.getElementById("TamBackup").setAttribute("title", t);
            }

        }


        if (JSON.parse(s.message).Tam) {

            t = JSON.parse(s.message).TamBackup;
            if (parseInt(t) > 0) {

//           

                //document.getElementById("notToast").innerHTML = "Reporte nuevo.<br>Tienes " + t + " reportes sin resolver";
                $(document).ready(function () {

                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000
                    });


                    Toast.fire({
                        type: 'info',
                         title: 'Reporte Nuevo. <br>Tienes ' + t + ' reporte(s) sin resolver'                        
                    });

                    $("div.swal2-container").attr("style", "margin-top: 3.5rem;margin-right: 1rem;");
                    document.getElementById("swal2-content").style = "font:bold 12px Arial";
                });

                var audioElement = document.createElement('audio');
                audioElement.id = "audioRE";
                // indicamos el archivo de audio a cargar
                audioElement.setAttribute('src', '/' + DEPENDENCIA + '/resources/Audio/Notificacion/notReporte.ogg');
                if (!checkCookieOperador()) {
                    // Si deseamos que una vez cargado empieze a sonar...
                    audioElement.setAttribute('autoplay', 'autoplay');
                    //audioElement.setAttribute('preload', 'auto');
                }
                document.getElementById("test").appendChild(audioElement);

                if (t > 99) {
                    document.getElementById("TamBackup").innerHTML = "+" + 99;
                    document.getElementById("TamBackup").setAttribute("title", t);
                    setTimeout(function () {
                        var audio = document.getElementById("audioRE");
                        audio.parentNode.removeChild(audio);
                    }, 1000);

                } else {

                    document.getElementById("TamBackup").innerHTML = t;
                    setTimeout(function () {
                        var audio = document.getElementById("audioRE");
                        audio.parentNode.removeChild(audio);
                    }, 1000);
                }
                
                document.getElementById("TamBackup").style.display="unset";
            }else{
                document.getElementById("TamBackup").style.display="none";
            }




        }
    }
};




RENWebSocket.onopen = function () {
  
    RENWebSocket.send(document.getElementById("user").innerHTML);
    
    // websocket.send(document.getElementById("user").innerHTML);
};
function sendMessageRE(message) {
   
    RENWebSocket.send(message);
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

function getHora() {
    var hoy = new Date();
    var hora = hoy.getHours();
    var min = hoy.getMinutes();
    var seg = hoy.getSeconds();
    hora = hora < 10 ? '0' + hora : hora;
    min = min < 10 ? '0' + min : min;
    seg = seg < 10 ? '0' + seg : seg;
    var h = hora + ":" + min + ":" + seg;
    return h;
}