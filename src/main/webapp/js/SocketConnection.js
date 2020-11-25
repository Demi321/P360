
/* global DEPENDENCIA, OT, WEBSOCKET */

var websocket = new WebSocket(WEBSOCKET);

//var HoraServidor = null;
var FechaServidor = null;


websocket.onmessage = function (message) {
   
    var jsonData = JSON.parse(message.data);
   

    if (jsonData) {
        //var llamada = jsonData.message.split(",");

        if (jsonData.message) {
          
            var jsn = {
                "h_recepcion": getFecha()+" "+getHora()
            };
          
            var llamada = JSON.parse(jsonData.message);
            llamada.RegistroLlamada.time = jsn;
            tarjeta(llamada);
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
function sendMessage(message) {
    websocket.send(message);
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

websocket.onerror = function () {
    console.error(websocket);
    //location.reload();
};



