
var NuevasCoordenadasCamino;

var bordes;

function SetLine(rutaObject) {
    RutaCamino0.setMap(null);
    RutaCamino1.setMap(null);
    RutaCamino2.setMap(null);
    RutaCamino3.setMap(null);
    RutaCamino4.setMap(null);
    RutaCamino5.setMap(null);
    RutaCamino6.setMap(null);
    RutaCamino7.setMap(null);
    RutaCamino8.setMap(null);
    RutaCamino9.setMap(null);

    var arrayR0 = new Array();
    var arrayR1 = new Array();
    var arrayR2 = new Array();
    var arrayR3 = new Array();
    var arrayR4 = new Array();
    var arrayR5 = new Array();
    var arrayR6 = new Array();
    var arrayR7 = new Array();
    var arrayR8 = new Array();
    var arrayR9 = new Array();
    var arrayRuta = new Array();





    for (var i = 0; i < rutaObject.length; i++) {
        
        if(i>rutaObject.length-100){
          arrayR0.push(rutaObject[i]);  
        }
        if(i>rutaObject.length-200){
          arrayR1.push(rutaObject[i]);  
        }
        if(i>rutaObject.length-300){
          arrayR2.push(rutaObject[i]);  
        }
        if(i>rutaObject.length-400){
          arrayR3.push(rutaObject[i]);  
        }
        if(i>rutaObject.length-500){
          arrayR4.push(rutaObject[i]);  
        }
        if(i>rutaObject.length-600){
          arrayR5.push(rutaObject[i]);  
        }
        if(i>rutaObject.length-700){
          arrayR6.push(rutaObject[i]);  
        }
        if(i>rutaObject.length-800){
          arrayR7.push(rutaObject[i]);  
        }
        if(i>rutaObject.length-900){
          arrayR8.push(rutaObject[i]);  
        }
        arrayR9.push(rutaObject[i]);

    }



    RutaCamino0 = new google.maps.Polyline({path: arrayR0, geodesic: true, strokeColor: '#2B7BF3', strokeOpacity: 0.3, strokeWeight: 4});
    RutaCamino1 = new google.maps.Polyline({path: arrayR1, geodesic: true, strokeColor: '#4180DE', strokeOpacity: 0.25, strokeWeight: 4});
    RutaCamino2 = new google.maps.Polyline({path: arrayR2, geodesic: true, strokeColor: '#4B83D7', strokeOpacity: 0.22, strokeWeight: 4});
    RutaCamino3 = new google.maps.Polyline({path: arrayR3, geodesic: true, strokeColor: '#5A89CE', strokeOpacity: 0.18, strokeWeight: 4});
    RutaCamino4 = new google.maps.Polyline({path: arrayR4, geodesic: true, strokeColor: '#6085BB', strokeOpacity: 0.15, strokeWeight: 4});
    RutaCamino5 = new google.maps.Polyline({path: arrayR5, geodesic: true, strokeColor: '#40516B', strokeOpacity: 0.12, strokeWeight: 4});
    RutaCamino6 = new google.maps.Polyline({path: arrayR6, geodesic: true, strokeColor: '#2a3648', strokeOpacity: 0.1, strokeWeight: 4});
    RutaCamino7 = new google.maps.Polyline({path: arrayR7, geodesic: true, strokeColor: '#2c3441', strokeOpacity: 0.1, strokeWeight: 4});
    RutaCamino8 = new google.maps.Polyline({path: arrayR8, geodesic: true, strokeColor: '#2f3236', strokeOpacity: 0.1, strokeWeight: 4});
    RutaCamino9 = new google.maps.Polyline({path: arrayR9, geodesic: true, strokeColor: '#303132', strokeOpacity: 0.2, strokeWeight: 4});

    // Creando la ruta en el mapa
    RutaCamino0.setMap(map);
    RutaCamino1.setMap(map);
    RutaCamino2.setMap(map);
    RutaCamino3.setMap(map);
    RutaCamino4.setMap(map);
    RutaCamino5.setMap(map);
    RutaCamino6.setMap(map);
    RutaCamino7.setMap(map);
    RutaCamino8.setMap(map);
    RutaCamino9.setMap(map);


}

function SetRectangle()
{
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

// Sets the map on all markers in the array.

