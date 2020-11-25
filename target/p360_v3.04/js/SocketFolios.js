
var Websocket_Folios;
NuevoIncidente();
function OpenSocketFolios(JsonIncidente) {
    /* global DEPENDENCIA, OT, WEBSOCKET, WEBSOCKETFOLIOS, hostdir, Longitud, Latitud, map */
    var enviado = false;
    var incidentesCercanos = false;
    Websocket_Folios = new WebSocket(WEBSOCKETFOLIOS);
    var HoraServidor = null;
    var FechaServidor = null;
   
    Websocket_Folios.onmessage = function (event) {
       
        var jsonData = JSON.parse(JSON.parse(event.data).message);
        var respuesta = jsonData;
       
        HoraServidor = jsonData.horaServidor;
        FechaServidor = jsonData.fechaServidor;
        JsonIncidente = "{" + "\"horaServidor\":\"" + HoraServidor + "\",\"fechaServidor\":\"" + FechaServidor + "\"," + JsonIncidente.slice(1);
       
        if (!enviado)
        {
           
          
            Websocket_Folios.send(JsonIncidente);
            enviado = true;
        } else if (!incidentesCercanos) {
            if ($("#loadingIncidentes").length) {
                document.getElementById("loadingIncidentes").parentNode.removeChild(document.getElementById("loadingIncidentes"));
            }
                       
            if (Object.keys(respuesta).length === 0) {

                SinIncidentes();
            }
            for (var i = 0; i < Object.keys(respuesta).length; i++) {
                insertarIncidenteCercano(respuesta[i]);
            }
            incidentesCercanos = true;
        } else {
            var LatitudIncidente = jsonData.lat;
            var LongitudIncidente = jsonData.lng;
            var rad = Math.PI / 180;
            var d = (6372795.477598) * Math.acos(Math.sin(LatitudIncidente * rad) * Math.sin(Latitud * rad) + Math.cos(LatitudIncidente * rad) * Math.cos(Latitud * rad) * Math.cos((LongitudIncidente * rad) - (Longitud * rad)));
            if (d < 500) {
                insertarIncidenteCercano(JSON.stringify(jsonData));
            }
        }
    };
    Websocket_Folios.onopen = function () {
      
        Websocket_Folios.send(document.getElementById("user").innerHTML);
    };
    Websocket_Folios.onclose = function () {
      
    };
    Websocket_Folios.onerror = function () {
        //location.reload();
        console.error("Error al crear socket para consulta de folios");
    };
}
