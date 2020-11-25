/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global WEBSOCKETREPORTE */
var reportes = "";
var RWebSocket = new WebSocket(WEBSOCKETREPORTE);


RWebSocket.onmessage = function (message) {
    var s = JSON.parse(message.data);
  
   
    try {
        var r = JSON.parse(s.message);

        if (r.idReporte) {
            //var re = "rep"+r.folio;
            insertarReportesCiudadanos(r);
        }
    } catch (e) {
        
    }
    if (s.message.includes("id")) {
        
        
        reportes = JSON.parse(s.message);
        
       
    } else if (s.message.includes($('#user').text()) || s.message === "Eliminar: {}" || s.message === "{}") {
       
    } else {
        $('#rep' + s.message).css("display", "none");
    }
    



};

RWebSocket.onopen = function () {
  
    RWebSocket.send(document.getElementById("user").innerHTML);
    
    // websocket.send(document.getElementById("user").innerHTML);
};
function sendMessageE(message) {
    RWebSocket.send(message);
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