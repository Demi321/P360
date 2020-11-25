
var config;
if ($("#config").length) {
      if ($("#config").val() !== "") {
            config = JSON.parse($("#config").val());
      } else {
            config = {
//                  "logo3pdf": null,
//                  "lottie": "https://recursos360.ml/911/json/lottie360.json",
//                  "logo2": null,
//                  "logo1": null,
//                  "logo1pdf": "https://recursos360.ml/911/Img/Logos/911.png",
//                  "proyecto": "plataforma360",
//                  "iconMap": null,
//                  "t2pdf": "Aguascalientes",
//                  "alias_proyecto": "Aguascalientes",
//                  "dep_base": false,
//                  "lg2": "7",
//                  "lg1": "12",
//                  "logo_principal": "https://recursos360.ml/911/Img/Logos/911.png",
//                  "lg3": null,
//                  "logo2pdf": "https://recursos360.ml/911/Img/Logos/Claro%20360.png",
//                  "logo_footer": "https://recursos360.ml/911/Img/Logos/Claro%20360.png",
//                  "favicon": "https://recursos360.ml/911/Img/favicon360.png",
//                  "pv1": "15",
//                  "ah2": "37",
//                  "ah1": "18",
//                  "pv3": null,
//                  "pv2": "17",
//                  "ah3": null,
//                  "t1pdf": "Plataforma Emergencia",
//                  "ph1": "12",
//                  "catalogo": "https://recursos360.ml/911/json/incidentes.json",
//                  "ph3": null,
//                  "socket": "wss://agu.sos911.ml/plataforma360/SocketNotifications",
//                  "ph2": "165",
//                  "recursos": "https://recursos360.ml/911",
//                  "t1": "Sistema de Monitoreo y Control",
//                  "logo_modal": "https://recursos360.ml/911/Img/Logos/Claro%20360.png",
//                  "t2": "Aguascalientes",
//                  "tfooter": "© 360 HQ S.A de C.V 2019. Todos los derechos reservados",
//                  "t3": "SOS 911 ·"
            };
      }

      //console.log(config);
}
var hostdir = window.location.protocol + "//" + window.location.host;
var DEPENDENCIA_BASE = config.dep_base;

//Nombre del proyecto el cual servira de direccion para las request
var DEPENDENCIA = config.proyecto;
//con este nombre aparecera en el menu de los marcadores
var DEPENDENCIA_ALIAS = config.alias_proyecto;
var PATHWEBSOCKET = config.socket;
var ALIAS = "" + DEPENDENCIA_ALIAS;
var MSJ = "Se añadió al chat.";
var URL_Incidentes = "https://incidente.ml/api/incidente";
//icono por default para mapa
var DEPENDENCIA_ICON = config.recursos + '/Img/IconoMap/icon.png';
//Tiempo en regresar una llamada despues de eliminarla al intentar atender
var TIMETORETURNACALL = 15000;

var PathRecursos = config.recursos + "/";

var imagen1 = false;
var imagen2 = false;
var imagen3 = false;
var img1;
var himg1;
var vimg1;
var anchoimg1;
var altoimg1;
var img2;
var himg2;
var vimg2;
var anchoimg2;
var altoimg2;
var img3;
var himg3;
var vimg3;
var anchoimg3;
var altoimg3;

if (config.logo1pdf !== null) {
      imagen1 = true;
      img1 = config.logo1pdf;
      himg1 = parseInt(config.ph1);
      vimg1 = parseInt(config.pv1);
      anchoimg1 = parseInt(config.ah1);
      altoimg1 = parseInt(config.lg1);
}

if (config.logo2pdf !== null) {
      imagen2 = true;
      img2 = config.logo2pdf;
      himg2 = parseInt(config.ph2);
      vimg2 = parseInt(config.pv2);
      anchoimg2 = parseInt(config.ah2);
      altoimg2 = parseInt(config.lg2);
}

if (config.logo3pdf !== null) {
      imagen3 = true;
      img3 = config.logo3pdf;
      himg3 = parseInt(config.ph3);
      vimg3 = parseInt(config.pv3);
      anchoimg3 = parseInt(config.ah3);
      altoimg3 = parseInt(config.lg3);
}

var cabecera1 = config.t1pdf;
var cabecera2 = config.t2pdf;

////////////////Variables Globales//////////////////

var cards = 0;
var CardV = 12;
var dataG;
var data;
var connectionCount = 0;
var chat = new Array();
var count = 1;
var countPublishers = 1;
var vue;
var map;
var map2;
var map3;
var map4;
var map5;
var RutaCamino;
var RutaCamino0;
var RutaCamino1;
var RutaCamino2;
var RutaCamino3;
var RutaCamino4;
var RutaCamino5;
var RutaCamino6;
var RutaCamino7;
var RutaCamino8;
var RutaCamino9;
var geocoder;
var geocoder2;
var geocoder3;
var geocoder4;
var geocoder5;
var infowindow;
var infowindow2;
var infowindow3;
var infowindow4;
var infowindow5;
var rango;
var Circle = null;
var Longitud;
var Latitud;
var Altitud = 0;
var CP = null;
var direccion = "";
var estado = null;
var estadoLong = null;
var municipio = null;
var colonia = null;
var markers = new Array();
var ultimo;
var m = new Array;
var image = DEPENDENCIA_ICON;
var ArrayIncidentesCercanos = new Array();
var marcador;
var marcador2;
var marcador3;
var marcador4;
var marcador5;
var catalogo = config.catalogo;
var JSONlottie = config.lottie;