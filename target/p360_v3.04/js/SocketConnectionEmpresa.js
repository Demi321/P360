
/* global DEPENDENCIA, OT, WEBSOCKET */

//var websocket = new WebSocket("wss://demoglobal.ml/Emergencia/ServerNotifications");
//var websocket = new WebSocket("ws://localhost:8080/Emergencia/ServerNotifications");

//var websocket = new WebSocket("wss://demoglobal.ml/'+DEPENDENCIA+'/ServerNotifications");
var websocket = new WebSocket(WEBSOCKET);


websocket.onmessage = function (message) {


    /*if (jsonData.message !== null) {
        var llamada = jsonData.message.split(",");

        if (llamada.length > 1) {
            initializeSession(llamada);
        } else
        {
            var sesion = jsonData.message.split("~");
            HoraServidor = sesion[1];
            FechaServidor = sesion[2];
           
            /
        }
    }
    */
    
    
    
    var jsonData = JSON.parse(message.data);
    if (jsonData) {
        //var llamada = jsonData.message.split(",");

        if (jsonData.message) {
          
            var jsn = {
                "h_recepcion": getHora()
            };
          
            var llamada = JSON.parse(jsonData.message);
            llamada.RegistroLlamada.time = jsn;
           initializeSession(llamada);
        } else
        {
            var sesion = jsonData.System.split("~");
            HoraServidor = sesion[1];
            FechaServidor = sesion[2];
           
            
        }
    }

};
websocket.onopen = function () {
  
    websocket.send(document.getElementById("user").innerHTML);
};
function sendMessageE(message) {
    websocket.send(message);
}

function getHora() {
    var hoy = new Date();
    var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    return hora;
}

