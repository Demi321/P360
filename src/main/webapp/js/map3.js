/* global google, GeoCodeResult */

var Latitud;
var Longitud;
var GeoCodeResult;
var direccion = "";

function initMap() {
    // Creamos un objeto mapa y especificamos el elemento DOM donde se va a mostrar.
    map = new google.maps.Map(
            document.getElementById('map'), {zoom: 5, center: {lat: 19.503329, lng: -99.185714}/*, mapTypeId: 'satellite'*/, styles: [
            {
                featureType: 'administrative',
                elementType: 'geometry',
                stylers: [{visibility: "off"}, {"weight": 1}]
            },
            {
                featureType: 'administrative',
                elementType: 'geometry.fill',
                stylers: [{visibility: "on"}]
            },
            {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'administrative',
                elementType: 'labels',
                stylers: [{color: '#000000'}, {visibility: "off"}]
            },
            {
                featureType: 'administrative.country',
                elementType: 'geometry',
                stylers: [{color: '#a6a6a6'}, {visibility: "on"}, {"weight": 1.5}]
            },
            {
                featureType: 'administrative.country',
                elementType: 'labels',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'administrative.country',
                elementType: 'labels.icon',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'administrative.land_parcel',
                elementType: 'geometry',
                stylers: [{visibility: "on"}]
            },
            {
                featureType: 'administrative.land_parcel',
                elementType: 'labels',
                stylers: [{visibility: "on"}]
            },
            {
                featureType: 'administrative.land_parcel',
                elementType: 'labels.icon',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'administrative.locality',
                elementType: 'geometry',
                stylers: [{visibility: "on"}]
            },
            {
                featureType: 'administrative.locality',
                elementType: 'labels',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'administrative.locality',
                elementType: 'labels.icon',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'administrative.neighborhood',
                elementType: 'geometry',
                stylers: [{visibility: "on"}]
            },
            {
                featureType: 'administrative.neighborhood',
                elementType: 'labels',
                stylers: [{color: '#696969'}, {visibility: "simplified"}]
            },
            {
                featureType: 'administrative.neighborhood',
                elementType: 'labels.icon',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'administrative.province',
                elementType: 'geometry',
                stylers: [{visibility: "on"}, {"weight": 1.5}]
            },
            {
                featureType: 'administrative.province',
                elementType: 'labels',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'administrative.province',
                elementType: 'labels.icon',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: "landscape",
                stylers: [{color: '#D5D8DC'}]
            },
            {
                featureType: 'landscape',
                elementType: 'geometry',
                stylers: [{color: '#D5D8DC'}]
            },
            {
                featureType: 'landscape',
                elementType: 'labels',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'landscape',
                elementType: 'labels.icon',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'landscape.man_made',
                elementType: 'geometry',
                stylers: [{color: '#526081'}, {visibility: "off"}]
            },
            {
                featureType: 'landscape.natural.landcover',
                elementType: 'geometry',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'landscape.natural.landcover',
                elementType: 'labels.icon',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'landscape.natural.terrain',
                elementType: 'geometry',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'landscape.natural.terrain',
                elementType: 'labels',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'landscape.natural.terrain',
                elementType: 'labels.icon',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'poi',
                elementType: 'labels.icon',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{visibility: "simplified"}]
            },
            {
                featureType: 'road',
                elementType: 'labels',
                stylers: [{visibility: "simplified"}]
            },
            {
                featureType: 'road',
                elementType: 'labels.icon',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'transit',
                elementType: 'labels',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'transit',
                elementType: 'labels.icon',
                stylers: [{visibility: "off"}]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{color: '#F2F4F4'}, {visibility: "on"}]
            },
            {
                featureType: 'water',
                elementType: 'labels',
                stylers: [{visibility: "off"}]
            }

        ]});

    map.setTilt(45);


    geocoder = new google.maps.Geocoder;
    infowindow = new google.maps.InfoWindow({maxWidth: 300});
    Latitud = parseFloat($('#lat').val());
    Longitud = parseFloat($('#lng').val());
    
    
    geocodeLatLng(geocoder, map, infowindow, 2260);

}

function geocodeLatLng(geocoder, map, infowindow, Alt) {

    var latlng = {lat: Latitud, lng: Longitud};
    
    if (Latitud === "NaN" || Longitud === "NaN") {
        ;
    } else {
        geocoder.geocode({'location': latlng}, function (results, status) {
            
            if (status === 'OK') {
                
                if (results[0]) {
                    
                    var marker1 = new google.maps.Marker({
                        position: latlng,
                        draggable: true,
                        animation: google.maps.Animation.BOUNCE
                    });
                    map.setZoom(18);
                    map.setCenter(latlng);
                    marker1.setMap(map);
                    google.maps.event.addListener(marker1, 'dragend', function (event) {
                        $('#lat').val(event.latLng.lat());
                        $('#lng').val(event.latLng.lng());
                        
                        
                        Latitud = parseFloat($('#lat').val());
                        Longitud = parseFloat($('#lng').val());
                        marker1.setMap();
                        geocodeLatLng(geocoder, map, infowindow, 2260);
                    });
                    GeoCodeResult = results[0].formatted_address;
                    direccion = GeoCodeResult;
                    $("#direccion").attr("value", direccion);
                    
                    infowindow.setContent(GeoCodeResult);
                    infowindow.open(map, marker1);
                    google.maps.event.addListener(marker1, 'click', function () {
                        infowindow.setContent(GeoCodeResult);
                        infowindow.open(map, marker1);
                    });


//                    for (var i = 0; i < results.length; i++) {
//                        if (CP !== null)
//                            break;
//                        for (var j = 0; j < results[i].address_components.length; j++) {
//                            if (CP !== null)
//                                break;
//                            for (var z = 0; z < results[i].address_components[j].types.length; z++) {
//                                if (results[i].address_components[j].types[z] === "postal_code") {
//                                    
//                                    CP = results[i].address_components[j].short_name;
//                                    //alert(CP);
//                                }
//                            }
//
//                        }
//                    }
//
//                    for (var i = 0; i < results.length; i++) {
//                        if (estado !== null)
//                            break;
//                        for (var j = 0; j < results[i].address_components.length; j++) {
//                            
//                            if (estado !== null)
//                                break;
//                            for (var z = 0; z < results[i].address_components[j].types.length; z++) {
//
//                                if (results[i].address_components[j].types[z] === "administrative_area_level_1") {
//                                    
//                                    estado = results[i].address_components[j].short_name;
//                                    //alert(estado);
//                                }
//                            }
//
//                        }
//                    }
//                    GeoCodeResult = results[0].formatted_address;
//                    direccion = GeoCodeResult;
//                    infowindow.setContent(GeoCodeResult + " Altura aprox: " + parseInt(Alt) + " m.");
//                    infowindow.open(map, marker);

                } else {
                    
                }
            } else {
                
            }
        });
    }
}
