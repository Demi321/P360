/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global WEBSOCKETREPORTEELEMENTO, TraeReporteID, DEPENDENCIA */
var reportes = "";
var REWebSocket = new WebSocket(WEBSOCKETREPORTEELEMENTO);




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


REWebSocket.onmessage = function (message) {
    var s = JSON.parse(message.data);
  
    



    if (!Backup) {
        var back = {
            "Back": true,
            "Backup": "Backup"
        };
        sendMessageRE(JSON.stringify(back));
        Backup = true;
    }


    if (!s.message.includes("~")) {
        if (JSON.parse(s.message).Back) {
            arregloReportes = JSON.parse(JSON.parse(s.message).Backup);
            $.each(arregloReportes, function (i) {
                insertarReportesElementos(arregloReportes[i]);
            });
        } 


        if (JSON.parse(s.message).hasOwnProperty("quitar_reporte")) {
            var id = JSON.parse(s.message).id;
           
            $("#" + id).remove();
        }

        if (JSON.parse(s.message).hasOwnProperty("Nuevo")) {
            $(document).ready(function () {

                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000
                });


                Toast.fire({
                    type: 'info',
                    title: '',
                    html: '<div>\n\
                                Reporte Nuevo. <br>\n\
                          </div>'
                });

                $("div.swal2-container").attr("style","margin-top: 3.5rem;margin-right: 1rem;");
                document.getElementById("swal2-content").style = "font:bold 12px Arial";
            });
            var audioElement = document.createElement('audio');
            audioElement.id = "audioRE";
            // indicamos el archivo de audio a cargar
            audioElement.setAttribute('src', '/' + DEPENDENCIA + '/resources/Audio/Notificacion/notReporte.ogg');
            if (!checkCookieOperador()) {
                // Si deseamos que una vez cargado empieze a sonar...
                audioElement.setAttribute('autoplay', 'autoplay');
            }
            document.getElementById("test").appendChild(audioElement);

            insertarReportesElementos(JSON.parse(s.message).Reporte);

            setTimeout(function () {
                var audio = document.getElementById("audioRE");
                audio.parentNode.removeChild(audio);
            }, 1000);
        }
    }
   




};




REWebSocket.onopen = function () {
  
    REWebSocket.send(document.getElementById("user").innerHTML);
    
};
function sendMessageRE(message) {
   
    REWebSocket.send(message);
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