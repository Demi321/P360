
/* global ALIAS, DEPENDENCIA, Promise, DEPENDENCIA_ALIAS, cabecera1, altoimg3, imagen3, altoimg2, imagen2, altoimg1, anchoimg1, himg1, vimg1, img1, imagen1, anchoimg2, himg2, vimg2, img2, anchoimg3, himg3, img3, vimg3, cabecera2 */
var json = JSON.parse(document.getElementById("jsonReporte").value);

var readyImg1 = imagen1 ? false : true;
var readyImg2 = imagen2 ? false : true;
var readyImg3 = imagen3 ? false : true;


const toDataURL = url => fetch(url)
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                }));

if (imagen1) {
    toDataURL(img1).then(dataUrl => {
        img1 = dataUrl;
        readyImg1 = true;
        if (readyImg1 && readyImg2 && readyImg3) {
            generar(json);
            //GenerarPDF();
        }
        return 0;
    });
}
if (imagen2) {
    toDataURL(img2).then(dataUrl => {
        img2 = dataUrl;
        readyImg2 = true;
        if (readyImg1 && readyImg2 && readyImg3) {
            generar(json);
            //GenerarPDF();
        }
        return 0;
    });
}
if (imagen3) {
    toDataURL(img3).then(dataUrl => {
        img3 = dataUrl;
        readyImg3 = true;
        if (readyImg1 && readyImg2 && readyImg3) {
            generar(json);
            //GenerarPDF();
        }
        return 0;
    });
}


var Imagen = '';
var arregloImg = new Array();
var dpi = 0.264583;
var width = 195 * dpi;
var height = 260 * dpi;
var total = 0;

function generar(reporte) {
    console.log("Generando PDF...");
    guardaImg(reporte);
}

function GenerarPDF() {
    var doc = new jsPDF()
    doc.setFontSize(40)
    doc.text(35, 25, 'Paranyan loves jsPDF');
    //doc.addImage(img1, 'JPEG', 15, 40, 180, 160);
    console.log(himg1);
    console.log(vimg1);
    console.log(anchoimg1);
    console.log(altoimg1);
    doc.addImage(img1, 'JPEG', himg1, vimg1, anchoimg1, altoimg1, null, "SLOW", 0);
    doc.addImage(img2, 'JPEG', himg1, vimg1+20, anchoimg1, altoimg1, null, "SLOW", 0);
    //doc.addImage(img1, 'JPEG', 12, 15, 18, 12, null, "SLOW", 0);
    source = document.getElementById("pdf")
            , specialElementHandlers = {
                // element with id of "bypass" - jQuery style selector
                '#bypassme': function (element, renderer) {
                    // true = "handled elsewhere, bypass text extraction"
                    return true;
                }
            };
    margins = {
        top: 40,
        bottom: 30,
        left: 15,
        width: 186
    };
    doc.fromHTML(
            source,
            margins.left, // x coord
            margins.top, {// y coord
                'width': margins.width // max width of content on PDF
                , 'elementHandlers': specialElementHandlers
            },
            function (dispose) {
                // dispose: object with X, Y of the last line add to the PDF 
                //          this allow the insertion of new lines after html
                var iframe = document.createElement('iframe');
                iframe.setAttribute('style', 'position:absolute;right:0; top:0; bottom:0; height:100%; width:100%;');
                document.body.appendChild(iframe);
                iframe.src = doc.output('datauristring');
            },
            margins
            );
}
function generar2(reporte) {


    if (JSON.stringify(reporte).includes(null)) {
        reporte = JSON.stringify(reporte).replace(/null/gi, '""');
        reporte = JSON.parse(reporte);
    }




    //if (save) {
    if (reporte.RegistroLlamada.idLlamada !== "") {
        var origen = "app movil";




        var t_transmision_usuario = "";
        var t_transmision_operador = "";
        var t_transmision = "";
        var t_captura = "";

        var bitacora = reporte.RegistroLlamada.bitacora;
        var h_recepcion1 = validaKey(bitacora, "h_recepcion");
        var h_atencion_inicio1 = validaKey(bitacora, "h_atencion_inicio");
        var h_conexion_operador1 = validaKey(bitacora, "h_conexion_operador");
        var h_conexion_usuario1 = validaKey(bitacora, "h_conexion_usuario");
        var h_captura_reporte1 = validaKey(bitacora, "h_captura_reporte");
        var h_desconexion_usuario1 = validaKey(bitacora, "h_desconexion_usuario");
        var h_desconexion_operador1 = validaKey(bitacora, "h_desconexion_operador");

        var h_recepcion2 = formatoFecha(h_recepcion1);
        var h_atencion_inicio2 = formatoFecha(h_atencion_inicio1);
        var h_conexion_operador2 = formatoFecha(h_conexion_operador1);
        var h_conexion_usuario2 = formatoFecha(h_conexion_usuario1);
        var h_captura_reporte2 = formatoFecha(h_captura_reporte1);
        var h_desconexion_usuario2 = formatoFecha(h_desconexion_usuario1);
        var h_desconexion_operador2 = formatoFecha(h_desconexion_operador1);


        var nuevaFecha = formatoFecha(h_recepcion1);





        if (!reporte.RegistroLlamada.bitacora.hasOwnProperty("vacio")) {


//           
//           
//           
//           
//           
//           
//           

            var h_recepcion = new Date(h_recepcion1.toString());
            var h_atencion_inicio = new Date(h_atencion_inicio1.toString());
            var h_conexion_operador = new Date(h_conexion_operador1.toString());
            var h_conexion_usuario = new Date(h_conexion_usuario1.toString());
            var h_desconexion_usuario = new Date(h_desconexion_usuario1.toString());
            var h_desconexion_operador = new Date(h_desconexion_operador1.toString());
            var h_captura_reporte = null;
            if (reporte.ReporteLlamada.fecha !== "" && reporte.ReporteLlamada.hora !== "") {
                h_captura_reporte = new Date(reporte.ReporteLlamada.fecha + " " + reporte.ReporteLlamada.hora);
            } else {
                h_captura_reporte = new Date(h_captura_reporte1);
            }

            var t_transmision_usuario = RestarDate(h_conexion_usuario, h_desconexion_usuario);
            var t_transmision_operador = RestarDate(h_conexion_operador, h_desconexion_operador);
            var t_transmision = RestarDate(h_atencion_inicio, h_desconexion_operador);

            var t_captura = RestarDate(h_conexion_operador, h_captura_reporte);
            if (t_transmision_usuario.includes("NaN")) {
                t_transmision_usuario = "";
            }
            if (t_transmision_operador.includes("NaN")) {
                t_transmision_operador = "";
            }
            if (t_transmision.includes("NaN")) {
                t_transmision = "";
            }
            if (t_captura.includes("NaN")) {
                t_captura = "";
            }

        }




        var margenI = 8;
        var margenD = 8;
        var anchoHoja = 216;
        var centro = anchoHoja / 2;



        var m = 0;

        var pdf = new jsPDF('p', 'mm', 'letter', false);


        var pagina = 1;

        //pensar como hacer esto
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        //pdf.text(107, 275, pagina.toString());
        pagina += 1;
        //agregamos el Folio
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(175, 275, "Folio:");
        //agregamos el valor Folio
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(185, 275, reporte.infoTickets.folioexterno);
        //agregamos el campo Fecha
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(12, 275, "Fecha:");
        //agregamos el valor Fecha
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(23, 275, formatoFecha((getFecha() + " " + getHora()).toString()));
        //Agregamos la linea que va arriba del pie de pagina
        pdf.setLineWidth(.4);
        pdf.setDrawColor(64, 71, 79);
        pdf.line(12, 270, 200, 270);

        if (imagen1) {
            console.log("agregando imagen");
            pdf.addImage(img1, 'JPEG', himg1, vimg1, anchoimg1, altoimg1, null, "SLOW", 0);
        }
        if (imagen2) {
            console.log("agregando imagen");
            pdf.addImage(img2, 'JPEG', himg2, vimg2, anchoimg2, altoimg2, null, "SLOW", 0);
        }
        if (imagen3) {
            console.log("agregando imagen");
            pdf.addImage(img3, 'JPEG', himg3, vimg3, anchoimg3, altoimg3, null, "SLOW", 0);
        }

        //Agregamos el titulo "Gobierno del Estado de Sinaloa"
        pdf.setFontSize(14);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(61, 71, 79);
        var l = pdf.splitTextToSize(cabecera1, (anchoHoja - margenI - margenD));


        //pdf.text(75, 22, );
        pdf.text(l, centro, 22, 'center');
        //Agregamos el titulo "C4i Sinaloa"
        pdf.setFontSize(14);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(61, 71, 79);
        //pdf.text(88, 27, "Ciudad de México");
        var l = pdf.splitTextToSize(cabecera2, (anchoHoja - margenI - margenD));
        //pdf.text(75, 22, );
        pdf.text(l, centro, 27, 'center');
        //Agregamos la linea que va debajo de la imagen
        pdf.setLineWidth(.4);
        pdf.setDrawColor(64, 71, 79);
        pdf.line(8, 33, 208, 33);
        //Agregamos datos del primer recuadro             
        //Se agrega el campo Municipio junto con su valor y su respectiva linea
        //Municipio
        v = 52;
        h = 20;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Municipio:");
        //Valor ID
        //v = 52;
        h = 50;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, reporte.RegistroLlamada.municipio);
        //pdf.text(h, v, "C4 SINALOA");
        //Campo Hora con su valor y su linea
        //Hora
        //v = 48;
        h = 165;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, formatoFecha((getFecha() + " " + getHora()).toString()));
        //Campo Fecha del: con su valor y su linea
        //Fecha del:
        v = 58;
        h = 20;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Fecha del:");
        //Valor Fecha del:
        v = 58;
        h = 50;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, "");
        //Campo al: con su valor y su linea
        //al:
        v = 58;
        h = 85;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "al:");
        //Valor al:
        v = 58;
        h = 90;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, "");
        //Campo Folio del: con su valor y su linea
        //Folio del:
        v = 64;
        h = 20;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Folio del:");
        //Valor Folio del:
        v = 64;
        h = 50;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, "");
        //Campo al: con su valor y su linea
        //al:
        v = 64;
        h = 85;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "al:");
        //Valor al:
        v = 64;
        h = 90;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, "");
        //Campo Número Telefónico con su valor y su linea
        //Número Telefónico:
        v = 70;
        h = 20;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Número Telefónico:");
        //Valor Número Telefónico:
        v = 70;
        h = 50;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, reporte.RegistroLlamada.usuario_movil);
        //Campo Origen: con su valor y su linea
        //Origen:
        v = 76;
        h = 20;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Origen:");
        //Valor Origen:
        v = 76;
        h = 50;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, origen.toUpperCase());

        //Campo Tipo de llamada: con su valor y su linea
        //Origen:
        v = 76;
        h = 85;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Tipo:");
        //Valor Origen:
        v = 76;
        h = 95;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, reporte.RegistroLlamada.modo_llamada_inicial);


        //Campo Prioridad: con su valor
        //Prioridad:
        v = 82;
        h = 20;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Prioridad:");
        //Valor Prioridad:
        v = 82;
        h = 50;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, reporte.ReporteLlamada.prioridad.toString().toUpperCase());
        //Campo Motivo: con su valor y su linea
        //Motivo:
        v = 88;
        h = 20;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Motivo:");
        //Valor Motivo:
        v = 88;
        h = 50;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, reporte.ReporteLlamada.temergencia);
        //Campo Operador: con su valor y su linea
        //Operador:
        v = 94;
        h = 20;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Operador:");
        //Valor Operador:
        v = 94;
        h = 50;
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, reporte.RegistroLlamada.Nombre + " " + reporte.RegistroLlamada.apellidos);
        //Agregamos el recuadro que engloba toda esta informacion
        var ancho = v - 36;
        pdf.setDrawColor(64, 71, 79);
        pdf.rect(15, 41, 185, ancho);
        //Agregamos el recuadro que muestra el titulo
        //pdf.setFillColor(64, 71, 79);
        pdf.setFillColor(94, 97, 99);
        pdf.rect(15, 41, 185, 5, 'FD');
        //Agregamos el titulo a esta seccion
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(255, 255, 255);
        //pdf.text(55, 44.5, "Reporte Descriptivo de la Llamada por Motivo del Radio Operador");

        var l = pdf.splitTextToSize("Reporte Descriptivo de la Llamada por Motivo del Radio Operador", (anchoHoja - 15 - 15));
        //pdf.text(75, 22, );
        pdf.text(l, centro, 44.5, 'center');



        //Agregamos el recuadro que muestra el titulo de la segunda seccion
        //pdf.setFillColor(64, 71, 79);
        pdf.setFillColor(94, 97, 99);
        pdf.rect(15, 102, 185, 5, 'FD');

        //Agregamos el titulo de la segunda seccion
        pdf.setFontSize(9);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(255, 255, 255);
        //pdf.text(92.5, 105.5, "Datos de la Llamada");

        var l = pdf.splitTextToSize("Datos de la Llamada", (anchoHoja - 15 - 15));
        //pdf.text(75, 22, );
        pdf.text(l, centro, 105.5, 'center');

        //Campo Folio: con su valor y su recuadro
        //Folio:
        v = v + 18;
        h = 20;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Folio:");
        //Valor Folio:
        //v = 94;
        h = 35;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, reporte.infoTickets.folioexterno);
        //Recuadro de Folio:
        pdf.setLineWidth(.1);
        pdf.setDrawColor(146, 151, 163);
        pdf.rect(32, v - 3.5, 30, 5);
        //Campo Fecha: con su valor y su recuadro
        //Fecha:
        //v = v+20;
        h = 65;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Fecha:");
        //Valor Fecha:
        //v = 94;
        h = 77;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, formatoFecha((reporte.RegistroLlamada.fecha + " " + reporte.RegistroLlamada.hora).toString()));
        //Recuadro de Fecha:
        pdf.setLineWidth(.1);
        pdf.setDrawColor(146, 151, 163);
        pdf.rect(75, v - 3.5, 30, 5);
        //Campo Origen: con su valor y su recuadro
        //Origen:
        //v = v+20;
        h = 108;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Origen:");
        //Valor Origen:
        //v = 94;
        h = 120;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, origen.toUpperCase());
        //Recuadro de Origen:
        pdf.setLineWidth(.1);
        pdf.setDrawColor(146, 151, 163);
        pdf.rect(119, v - 3.5, 30, 5);
        //Campo Prioridad: con su valor y su recuadro
        //Prioridad:
        //v = v+20;
        h = 152;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Prioridad:");
        //Valor Prioridad:
        //v = 94;
        h = 167;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, reporte.ReporteLlamada.prioridad.toString().toUpperCase());
        //Recuadro de Prioridad:
        pdf.setLineWidth(.1);
        pdf.setDrawColor(146, 151, 163);
        pdf.rect(166, v - 3.5, 34, 5);
        //Campo Motivo: con su valor y su recuadro
        //Motivo:
        v = v + 6;
        h = 20;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Motivo:");
        //Valor Motivo:
        //v = 94;
        h = 35;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, reporte.ReporteLlamada.temergencia);
        //Recuadro de Motivo:
        pdf.setLineWidth(.1);
        pdf.setDrawColor(146, 151, 163);
        pdf.rect(32, v - 3.5, 168, 5);
        //Campo Lugar:
        //Lugar:
        v = v + 6;
        h = 20;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Lugar:");
        //Valor Lugar:
        //v = v+10;
        h = 35;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        //descLugar = "Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba ";
        var descLugar = pdf.splitTextToSize(reporte.ReporteLlamada.descripcionLugar, 164);
        pdf.text(h, v, descLugar.toString().toUpperCase());
        //Recuadro para Lugar:
        var v2 = v;
        v = v + (6 * descLugar.length);
        if (descLugar.length === 1) {
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(32, v2 - 3.5, 168, 5);
        } else {
            ancho = v - 130;
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(32, v2 - 3.5, 168, ancho);
        }
        if (reporte.RegistroLlamada.colonia !== "" && reporte.RegistroLlamada.colonia !== null && reporte.RegistroLlamada.colonia !== undefined) {
            //Campo Colonia: con su valor y su recuadro
            //Colonia:
            //v = v+6;
            h = 20;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "Colonia:");
            //Valor Colonia:
            //v = 94;
            h = 35;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(h, v, reporte.RegistroLlamada.colonia);
            //Recuadro de Colonia:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(32, v - 3.5, 75, 5);
        } else {
            //Campo Colonia: con su valor y su recuadro
            //Colonia:
            //v = v+6;
            h = 20;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "Colonia:");
            //Valor Colonia:
            //v = 94;
            h = 35;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(h, v, "");
            //Recuadro de Colonia:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(32, v - 3.5, 75, 5);
        }


        if (reporte.RegistroLlamada.estado !== "" && reporte.RegistroLlamada.estado !== null && reporte.RegistroLlamada.estado !== undefined) {
            //Campo Estado: con su valor y su recuadro
            //Estado:
            //v = v+6;
            h = 115;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "Estado:");
            //Valor Estado:
            //v = 94;
            h = 130;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(h, v, reporte.RegistroLlamada.estado);
            //Recuadro de Estado:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(126, v - 3.5, 74, 5);
        } else {
            //Campo Estado: con su valor y su recuadro
            //Estado:
            //v = v+6;
            h = 115;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "Estado:");
            //Valor Estado:
            //v = 94;
            h = 130;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(h, v, "");
            //Recuadro de Estado:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(126, v - 3.5, 74, 5);
        }

        //Campo Descripción:

        //Descripción:
        v = v + 6;
        h = 20;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Descripción:");
        //Valor Descripción:
        v = v + 6;
        h = 40;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        //Rep = "bauna pruebaaa Estooa Esto es unEsto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una pruebaEsto es una prueba Esto es una prueba Esto es una pruebaEsto es una pruebaEstoesunapruebaEsto sunapruebaEsto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una pruebaEsto es una prueba Esto es una prueba Esto es una pruebaEsto es una pruebaEstoesunapruebaEsto sunapruebaEsto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una pruebaEsto es una prueba Esto es una prueba Esto es una pruebaEsto es una pruebaEstoesunapruebaEsto sunapruebaEsto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una pruebaEsto es una pruebaEstoesunapruebaEsto sunapruebaEsto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una pruebaEsto es una prueba Esto es una prueba Esto es una pruebaEsto es una pruebaEstoesunapruebaEsto sunapruebaEsto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una pruebaEsto es una prueba Esto es una prueba Esto es una pruebaEsto es una pruebaEstoesunapruebaEsto sunapruebaEsto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una pruebaEsto es una prueba Esto es una prueba Esto es una pruebaEsto es una pruebaEstoesunapruebaEsto sunapruebaEsto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una pruebaEsto es una prueba Esto es una prueba Esto es una pruebaEsto es una pruebaEstoesunapruebaEsto sunapruebaEsto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba Esto es una prueba ";
        var Rep = pdf.splitTextToSize(reporte.ReporteLlamada.reporte, 158);
        //A continuacion se agrega el reporte escrito por el operador dependiendo de cuanto abarque este
        //Es decir si abarca mas de del resto de la primer hora se crea una nueva hoja y se agrega la 
        //continuacion del reporte y asi sucesivamente
        if (Rep.length > 40) {
            var Rep2 = Rep.slice(0, 40);
            var Rep3 = Rep.slice(40, Rep.length);
            v = v - 6;
            pdf.text(h, v, Rep2);
            var v2 = v;
            v = v + (3.2 * Rep2.length);
            if (Rep2.length === 1) {
                pdf.setLineWidth(.1);
                pdf.setDrawColor(146, 151, 163);
                pdf.rect(38, v2 - 3.5, 162, 5);
            } else {
                ancho = v - 134;
                pdf.setLineWidth(.1);
                pdf.setDrawColor(146, 151, 163);
                pdf.rect(38, v2 - 3.5, 162, ancho);
            }

//                var v2 = v;
//                v = v + (4.5*Rep2.length);
//                if(Rep2.length === 1){
//                    pdf.setLineWidth(.1);
//                    pdf.setDrawColor(146, 151, 163);
//                    pdf.rect(38, v2-3.5, 168, 5);
//                }else{
//                    ancho = v - v2;
//                    pdf.setLineWidth(.1);
//                    pdf.setDrawColor(146, 151, 163);
//                    pdf.rect(7, v2-6, 200, ancho);
//                }

            v = 52;
            //h = 20;
            v2 = 35;
            pdf.addPage();

            if (imagen1) {
                console.log("agregando imagen");
                pdf.addImage(img1, 'JPEG', himg1, vimg1, anchoimg1, altoimg1, null, "SLOW", 0);
            }
            if (imagen2) {
                console.log("agregando imagen");
                pdf.addImage(img2, 'JPEG', himg2, vimg2, anchoimg2, altoimg2, null, "SLOW", 0);
            }
            if (imagen3) {
                console.log("agregando imagen");
                pdf.addImage(img3, 'JPEG', himg3, vimg3, anchoimg3, altoimg3, null, "SLOW", 0);
            }

            //Agregamos el titulo "Gobierno del Estado de Sinaloa"
            pdf.setFontSize(14);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(61, 71, 79);
            var l = pdf.splitTextToSize(cabecera1, (anchoHoja - margenI - margenD));

            //pdf.text(75, 22, );
            pdf.text(l, centro, 22, 'center');
            //Agregamos el titulo "C4i Sinaloa"
            pdf.setFontSize(14);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(61, 71, 79);
            var l = pdf.splitTextToSize(cabecera2, (anchoHoja - margenI - margenD));
            //pdf.text(75, 22, );
            pdf.text(l, centro, 27, 'center');
            //pdf.text(88, 27, "Ciudad de México");
            //Agregamos la linea que va debajo de la imagen
            pdf.setLineWidth(.4);
            pdf.setDrawColor(64, 71, 79);
            pdf.line(7, 33, 208, 33);
            //añadimos el numero de pagina
            //var total = pdf.internal.getNumberOfPages();
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            //pdf.text(107, 275, pagina.toString());
            pagina += 1;
            //agregamos el Folio
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(175, 275, "Folio:");
            //agregamos el valor Folio
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(185, 275, reporte.infoTickets.folioexterno);
            //agregamos el campo Fecha
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(12, 275, "Fecha:");
            //agregamos el valor Fecha
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(23, 275, formatoFecha((getFecha() + " " + getHora()).toString()));
            //Agregamos la linea que va arriba del pie de pagina
            pdf.setLineWidth(.4);
            pdf.setDrawColor(64, 71, 79);
            pdf.line(12, 270, 200, 270);
            var numReps = Math.trunc(Rep3.length / 67);

            if (numReps !== 0) {
                for (var i = 0; i < numReps; i++) {
                    var aux = Rep3.slice(0, 67);
                    Rep3 = Rep3.slice(67, Rep3.length);
                    v = v - 6;
                    pdf.text(h, v, aux);
                    v2 = v;
                    v = v + (3.3 * aux.length);
                    if (aux.length === 1) {
                        pdf.setLineWidth(.1);
                        pdf.setDrawColor(146, 151, 163);
                        pdf.rect(38, v2 - 3.5, 162, 5);
                    } else {
                        ancho = v - v2;
                        pdf.setLineWidth(.1);
                        pdf.setDrawColor(146, 151, 163);
                        pdf.rect(38, v2 - 3.5, 162, ancho);
                    }

//                        var v2 = v;
//                        v = v + (4.15*aux.length);
//                        if(aux.length === 1){
//                            pdf.setLineWidth(.1);
//                            pdf.setDrawColor(146, 151, 163);
//                            pdf.rect(7, v2-6, 200, 10);
//                        }else{
//                            ancho = v - v2;
//                            pdf.setLineWidth(.1);
//                            pdf.setDrawColor(146, 151, 163);
//                            pdf.rect(7, v2-6, 200, ancho);
//                        }

                    v = 52;
                    //h = 20;
                    v2 = 35;
                    pdf.addPage();
                    if (imagen1) {
                        console.log("agregando imagen");
                        pdf.addImage(img1, 'JPEG', himg1, vimg1, anchoimg1, altoimg1, null, "SLOW", 0);
                    }
                    if (imagen2) {
                        console.log("agregando imagen");
                        pdf.addImage(img2, 'JPEG', himg2, vimg2, anchoimg2, altoimg2, null, "SLOW", 0);
                    }
                    if (imagen3) {
                        console.log("agregando imagen");
                        pdf.addImage(img3, 'JPEG', himg3, vimg3, anchoimg3, altoimg3, null, "SLOW", 0);
                    }
                    //
                    //Agregamos el titulo "Gobierno del Estado de Sinaloa"
                    pdf.setFontSize(14);
                    pdf.setFont('helvetica');
                    pdf.setFontType('bold');
                    pdf.setTextColor(61, 71, 79);
                    //pdf.text(65, 22, "Gobierno del Estado de Sinaloa");
                    var l = pdf.splitTextToSize(cabecera1, (anchoHoja - margenI - margenD));

                    //pdf.text(75, 22, );
                    pdf.text(l, centro, 22, 'center');
                    //Agregamos el titulo "C4i Sinaloa"
                    pdf.setFontSize(14);
                    pdf.setFont('helvetica');
                    pdf.setFontType('bold');
                    pdf.setTextColor(61, 71, 79);
                    //pdf.text(88, 27, "Ciudad de México");
                    var l = pdf.splitTextToSize(cabecera2, (anchoHoja - margenI - margenD));
                    //pdf.text(75, 22, );
                    pdf.text(l, centro, 27, 'center');
                    //Agregamos la linea que va debajo de la imagen
                    pdf.setLineWidth(.4);
                    pdf.setDrawColor(64, 71, 79);
                    pdf.line(7, 33, 208, 33);
                    //añadimos el numero de pagina
                    //var total = pdf.internal.getNumberOfPages();
                    pdf.setFontSize(8);
                    pdf.setFont('helvetica');
                    pdf.setFontType('bold');
                    pdf.setTextColor(64, 71, 79);
                    //pdf.text(107, 275, pagina.toString());
                    pagina += 1;
                    //agregamos el Folio
                    pdf.setFont('helvetica');
                    pdf.setFontType('bold');
                    pdf.setTextColor(64, 71, 79);
                    pdf.text(175, 275, "Folio:");
                    //agregamos el valor Folio
                    pdf.setFont('helvetica');
                    pdf.setFontType('normal');
                    pdf.setTextColor(146, 151, 163);
                    pdf.text(185, 275, reporte.infoTickets.folioexterno);
                    //agregamos el campo Fecha
                    pdf.setFont('helvetica');
                    pdf.setFontType('bold');
                    pdf.setTextColor(64, 71, 79);
                    pdf.text(12, 275, "Fecha:");
                    //agregamos el valor Fecha
                    pdf.setFont('helvetica');
                    pdf.setFontType('normal');
                    pdf.setTextColor(146, 151, 163);
                    pdf.text(23, 275, formatoFecha((getFecha() + " " + getHora()).toString()));
                    //Agregamos la linea que va arriba del pie de pagina
                    pdf.setLineWidth(.4);
                    pdf.setDrawColor(64, 71, 79);
                    pdf.line(12, 270, 200, 270);
                }
                if (Rep3.length !== 0) {
                    pdf.setFontSize(8);
                    pdf.setFont('helvetica');
                    pdf.setFontType('normal');
                    pdf.setTextColor(146, 151, 163);
                    Rep3 = pdf.splitTextToSize(Rep3, 158);
                    v = v - 6;
                    pdf.text(h, v, Rep3);
                    v2 = v;
                    v = v + (3.5 * Rep3.length);
                    if (Rep3.length === 1) {
                        pdf.setLineWidth(.1);
                        pdf.setDrawColor(146, 151, 163);
                        pdf.rect(38, v2 - 3.5, 162, 5);
                    } else {
                        ancho = v - v2;
                        pdf.setLineWidth(.1);
                        pdf.setDrawColor(146, 151, 163);
                        pdf.rect(38, v2 - 3.5, 162, ancho);
                    }
                }
            } else {
                v = v - 6;
                pdf.text(h, v, Rep3);
                v2 = v;
                v = v + (3.3 * Rep3.length);
                if (Rep3.length === 1) {
                    pdf.setLineWidth(.1);
                    pdf.setDrawColor(146, 151, 163);
                    pdf.rect(38, v2 - 3.5, 162, 5);
                } else {
                    ancho = v - v2;
                    pdf.setLineWidth(.1);
                    pdf.setDrawColor(146, 151, 163);
                    pdf.rect(38, v2 - 3.5, 162, ancho);
                }


//                    var v2 = v;
//                    v = v + (5*Rep3.length);
//                    if(Rep3.length === 1){
//                        pdf.setLineWidth(.1);
//                        pdf.setDrawColor(146, 151, 163);
//                        pdf.rect(7, v2-6, 200, 10);
//                    }else{
//                        ancho = v - v2;
//                        pdf.setLineWidth(.1);
//                        pdf.setDrawColor(64, 71, 79);
//                        pdf.rect(7, v2-6, 200, ancho);
//                    }
            }
        } else {
            v = v - 6;
            pdf.text(h, v, Rep);
            v2 = v;
            v = v + (3.5 * Rep.length);
            if (Rep.length === 1) {
                pdf.setLineWidth(.1);
                pdf.setDrawColor(146, 151, 163);
                pdf.rect(38, v2 - 3.5, 162, 5);
            } else {
                ancho = v - v2;
                pdf.setLineWidth(.1);
                pdf.setDrawColor(146, 151, 163);
                pdf.rect(38, v2 - 3.5, 162, ancho);
            }

//                var v2 = v;
//                //v = v + (5.5*Rep.length);
//                if(Rep.length === 1){
//                    pdf.setLineWidth(.1);
//                    pdf.setDrawColor(146, 151, 163);
//                    pdf.rect(38, v2-3.5, 168, 5);
//                }else{
//                    ancho = v - v2;
//                    pdf.setLineWidth(.1);
//                    pdf.setDrawColor(146, 151, 163);
//                    pdf.rect(7, v2-6, 200, ancho);
//                }
            if ((260 - v) <= 30) {
                v = 25;
                v2 = 35;
                pdf.addPage();
                if (imagen1) {
                    console.log("agregando imagen");
                    pdf.addImage(img1, 'JPEG', himg1, vimg1, anchoimg1, altoimg1, null, "SLOW", 0);
                }
                if (imagen2) {
                    console.log("agregando imagen");
                    pdf.addImage(img2, 'JPEG', himg2, vimg2, anchoimg2, altoimg2, null, "SLOW", 0);
                }
                if (imagen3) {
                    console.log("agregando imagen");
                    pdf.addImage(img3, 'JPEG', himg3, vimg3, anchoimg3, altoimg3, null, "SLOW", 0);
                }
                //Agregamos el titulo "Gobierno del Estado de Sinaloa"
                pdf.setFontSize(14);
                pdf.setFont('helvetica');
                pdf.setFontType('bold');
                pdf.setTextColor(61, 71, 79);
                //pdf.text(65, 22, "Gobierno del Estado de Sinaloa");
                var l = pdf.splitTextToSize(cabecera1, (anchoHoja - margenI - margenD));

                //pdf.text(75, 22, );
                pdf.text(l, centro, 22, 'center');
                //Agregamos el titulo "C4i Sinaloa"
                pdf.setFontSize(14);
                pdf.setFont('helvetica');
                pdf.setFontType('bold');
                pdf.setTextColor(61, 71, 79);
                //pdf.text(88, 27, "Ciudad de México");
                var l = pdf.splitTextToSize(cabecera2, (anchoHoja - margenI - margenD));
                //pdf.text(75, 22, );
                pdf.text(l, centro, 27, 'center');
                //Agregamos la linea que va debajo de la imagen
                pdf.setLineWidth(.4);
                pdf.setDrawColor(64, 71, 79);
                pdf.line(7, 33, 208, 33);
                //añadimos el numero de pagina
                //var total = pdf.internal.getNumberOfPages();
                pdf.setFontSize(8);
                pdf.setFont('helvetica');
                pdf.setFontType('bold');
                pdf.setTextColor(64, 71, 79);
                //pdf.text(107, 275, pagina.toString());
                pagina += 1;
                //agregamos el Folio
                pdf.setFont('helvetica');
                pdf.setFontType('bold');
                pdf.setTextColor(64, 71, 79);
                pdf.text(175, 275, "Folio:");
                //agregamos el valor Folio
                pdf.setFont('helvetica');
                pdf.setFontType('normal');
                pdf.setTextColor(146, 151, 163);
                pdf.text(185, 275, reporte.infoTickets.folioexterno);
                //agregamos el campo Fecha
                pdf.setFont('helvetica');
                pdf.setFontType('bold');
                pdf.setTextColor(64, 71, 79);
                pdf.text(12, 275, "Fecha:");
                //agregamos el valor Fecha
                pdf.setFont('helvetica');
                pdf.setFontType('normal');
                pdf.setTextColor(146, 151, 163);
                pdf.text(23, 275, formatoFecha((getFecha() + " " + getHora()).toString()));
                //Agregamos la linea que va arriba del pie de pagina
                pdf.setLineWidth(.4);
                pdf.setDrawColor(64, 71, 79);
                pdf.line(12, 270, 200, 270);
            }
        }

        //Campo Denunciante: con su valor y su recuadro
        //Denunciante:
        v = v + 2.5;
        h = 20;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Denunciante:");
        //Valor Denunciante:
        //v = 94;
        h = 40;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, reporte.PerfilUsuario.nombre + " " + reporte.PerfilUsuario.apellido_paterno + " " + reporte.PerfilUsuario.apellido_materno);
        //Recuadro de Denunciante:
        pdf.setLineWidth(.1);
        pdf.setDrawColor(146, 151, 163);
        pdf.rect(38, v - 3.5, 100, 5);
        //Campo Teléfono: con su valor y su recuadro
        //Teléfono:
        //v = v+2.5;
        h = 150;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Teléfono:");
        //Valor Teléfono:
        //v = 94;
        h = 165;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, reporte.RegistroLlamada.usuario_movil);
        //Recuadro de Teléfono:
        pdf.setLineWidth(.1);
        pdf.setDrawColor(146, 151, 163);
        pdf.rect(164, v - 3.5, 36, 5);
        //Campo Dirección: con su valor y su recuadro
        //Dirección:
        v = v + 6;
        h = 20;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Dirección:");
        //Valor Dirección:
        //v = 94;
        h = 40;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        var direccion = pdf.splitTextToSize(reporte.RegistroLlamada.direccion, 65);
        pdf.text(h, v, direccion);
        //Recuadro de Dirección:
        ancho = 4 * direccion.length;
        pdf.setLineWidth(.1);
        pdf.setDrawColor(146, 151, 163);
        pdf.rect(38, v - 3.5, 69, ancho);
        //Campo Tiempo: con su valor y su recuadro
        //Tiempo:
        //v = v+6;
        h = 120;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Tiempo:");
        //Valor Tiempo:
        //v = 94;
        var time = new Date(reporte.RegistroLlamada.fecha + " " + reporte.RegistroLlamada.hora);
        var time2 = new Date(reporte.RegistroLlamada.fecha + " " + reporte.RegistroLlamada.atendida);

        h = 136;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, RestarDate(time, time2));
        //Recuadro de Tiempo:
        pdf.setLineWidth(.1);
        pdf.setDrawColor(146, 151, 163);
        pdf.rect(132, v - 3.5, 20, 5);
        //Campo Hora: con su valor y su recuadro
        //Hora:
        //v = v+20;
        h = 163;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Hora:");
        //Valor Hora:
        //v = 94;
        h = 172;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        pdf.text(h, v, formatoFecha((reporte.RegistroLlamada.fecha + " " + reporte.RegistroLlamada.hora).toString()));
        //Recuadro de Hora:
        pdf.setLineWidth(.1);
        pdf.setDrawColor(146, 151, 163);
        pdf.rect(171, v - 3.5, 29, 5);
        //Campo Chat del incidente:
        //Chat del incidente:

        v = v + ancho;
        h = 20;
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('bold');
        pdf.setTextColor(64, 71, 79);
        pdf.text(h, v, "Chat del incidente:");
        //Primera linea para Chat del incidente:
        v = v + 6;
        pdf.setLineWidth(.1);
        pdf.setDrawColor(146, 151, 163);
        //hacemos v2 igual al valor actual de v
        v2 = v;
        //Valor Chat del incidente:
        v = v + 4;
        //Para la letra del chat
        pdf.setFontSize(8);
        pdf.setFont('helvetica');
        pdf.setFontType('normal');
        pdf.setTextColor(146, 151, 163);
        var h2 = 115;
        h = 25;
        var cadO;
        var cadU;
        var c3 = reporte.RegistroLlamada.chat;


        for (var i in c3) {
            try {
                c3[i] = JSON.parse(c3[i]);
            } catch (e) {
                console.log(e);
            }
            console.log(c3[i]);
            if (c3[i].tipo === "texto") {
                var c2 = c3[i].value.split(":");
                if (c3[i].value.includes(ALIAS)) {
                    if (v < 250) {
                        //if (c3[i].tipo === "texto") {
                        cadO = pdf.splitTextToSize(c3[i].username + ": " + c2[1], 80);
                        pdf.text(h, v, cadO);
                        if (i === 0 && c3[i].length - 1 !== 0) {
                            v = v + (5 * cadO.length);
                            pdf.line(20, v2, 200, v2); //Para agregar la linea superior
                        } else {
                            v = v + (3 * cadO.length);
//                          
//                          
//                           
//                          
//                           
//                          
//                          
//                          
//                          
                            if (parseInt(i) === c3.length - 1) {
//                              
                                pdf.line(20, v2, 200, v2); //Para agregar la linea superior
                                pdf.line(20, v2, 20, v); //Para agregar la linea izquierda
                                pdf.line(200, v2, 200, v); //Para agregar la linea derechs
                                pdf.line(20, v, 200, v); //Para agregar la linea inferior
                            }
                        }
                        //}
                    } else {
                        pdf.setLineWidth(.1);
                        pdf.setDrawColor(64, 71, 79);
                        pdf.line(20, v2, 200, v2); //Para agregar la linea superior
                        pdf.line(20, v2, 20, v2 + (265 - v2)); //Para agregar la linea izquierda
                        pdf.line(200, v2, 200, v2 + (265 - v2)); //Para agregar la linea derecha
                        pdf.line(20, v2 + (265 - v2), 200, v2 + (265 - v2)); //Para agregar la linea inferior

                        pdf.addPage();

                        if (imagen1) {
                            console.log("agregando imagen");
                            pdf.addImage(img1, 'JPEG', himg1, vimg1, anchoimg1, altoimg1, null, "SLOW", 0);
                        }

                        if (imagen2) {
                            console.log("agregando imagen");
                            pdf.addImage(img2, 'JPEG', himg2, vimg2, anchoimg2, altoimg2, null, "SLOW", 0);
                        }

                        if (imagen3) {
                            console.log("agregando imagen");
                            pdf.addImage(img3, 'JPEG', himg3, vimg3, anchoimg3, altoimg3, null, "SLOW", 0);
                        }
                        //Agregamos el titulo "Gobierno del Estado de Sinaloa"
                        pdf.setFontSize(14);
                        pdf.setFont('helvetica');
                        pdf.setFontType('bold');
                        pdf.setTextColor(61, 71, 79);
                        //pdf.text(65, 22, "Gobierno del Estado de Sinaloa");
                        var l = pdf.splitTextToSize(cabecera1, (anchoHoja - margenI - margenD));

                        //pdf.text(75, 22, );
                        pdf.text(l, centro, 22, 'center');
                        //Agregamos el titulo "C4i Sinaloa"
                        pdf.setFontSize(14);
                        pdf.setFont('helvetica');
                        pdf.setFontType('bold');
                        pdf.setTextColor(61, 71, 79);
                        //pdf.text(88, 27, "Ciudad de México");
                        var l = pdf.splitTextToSize(cabecera2, (anchoHoja - margenI - margenD));
                        //pdf.text(75, 22, );
                        pdf.text(l, centro, 27, 'center');
                        //Agregamos la linea que va debajo de la imagen
                        pdf.setLineWidth(.4);
                        pdf.setDrawColor(64, 71, 79);
                        pdf.line(7, 33, 208, 33);
                        //añadimos el numero de pagina
                        //var total = pdf.internal.getNumberOfPages();
                        pdf.setFontSize(8);
                        pdf.setFont('helvetica');
                        pdf.setFontType('bold');
                        pdf.setTextColor(64, 71, 79);
                        //pdf.text(107, 275, pagina.toString());
                        pagina += 1;
                        //agregamos el Folio
                        pdf.setFont('helvetica');
                        pdf.setFontType('bold');
                        pdf.setTextColor(64, 71, 79);
                        pdf.text(175, 275, "Folio:");
                        //agregamos el valor Folio
                        pdf.setFont('helvetica');
                        pdf.setFontType('normal');
                        pdf.setTextColor(146, 151, 163);
                        pdf.text(185, 275, reporte.infoTickets.folioexterno);
                        //agregamos el campo Fecha
                        pdf.setFont('helvetica');
                        pdf.setFontType('bold');
                        pdf.setTextColor(64, 71, 79);
                        pdf.text(12, 275, "Fecha:");
                        //agregamos el valor Fecha
                        pdf.setFont('helvetica');
                        pdf.setFontType('normal');
                        pdf.setTextColor(146, 151, 163);
                        pdf.text(23, 275, formatoFecha((getFecha() + " " + getHora()).toString()));
                        //Agregamos la linea que va arriba del pie de pagina
                        pdf.setLineWidth(.4);
                        pdf.setDrawColor(64, 71, 79);
                        pdf.line(12, 270, 200, 270);
                        //Para la letra del chat
                        pdf.setFontSize(8);
                        pdf.setFont('helvetica');
                        pdf.setFontType('normal');
                        pdf.setTextColor(146, 151, 163);
                        v = 52;
                        v2 = v - 5;
                        //if (c3[i].tipo === "texto") {
                        cadO = pdf.splitTextToSize(c3[i].username + ": " + c2[1], 80);
                        pdf.text(h, v, cadO);
                        v = v + (5 * cadO.length);
                        if (parseInt(i) === c3.length - 1) {
                            pdf.line(20, v2, 200, v2);
                            pdf.line(20, v2, 20, v); //Para agregar la linea izquierda
                            pdf.line(200, v2, 200, v); //Para agregar la linea derechs
                            pdf.line(20, v, 200, v); //Para agregar la linea inferior
                        }
                        //}

                    }
                } else {
                    if (c3[i].value.includes("Operador")) {
                        if (v < 250) {
                            cadU = pdf.splitTextToSize(c3[i].value, 80);
                            pdf.text(h2, v, cadU);
                            v = v + (5 * cadU.length);
                            if (parseInt(i) === c3.length - 1) {
                                pdf.line(20, v2, 200, v2);
                                pdf.line(20, v2, 20, v); //Para agregar la linea izquierda
                                pdf.line(200, v2, 200, v); //Para agregar la linea derechs
                                pdf.line(20, v, 200, v); //Para agregar la linea inferior
                            }
                        } else {
                            pdf.setLineWidth(.1);
                            pdf.setDrawColor(64, 71, 79);
                            pdf.line(20, v2, 200, v2); //Para agregar la linea superior
                            pdf.line(20, v2, 20, v2 + (265 - v2)); //Para agregar la linea izquierda
                            pdf.line(200, v2, 200, v2 + (265 - v2)); //Para agregar la linea derecha
                            pdf.line(20, v2 + (265 - v2), 200, v2 + (265 - v2)); //Para agregar la linea inferior

                            pdf.addPage();
                            if (imagen1) {
                                console.log("agregando imagen");
                                pdf.addImage(img1, 'JPEG', himg1, vimg1, anchoimg1, altoimg1, null, "SLOW", 0);
                            }
                            if (imagen2) {
                                console.log("agregando imagen");
                                pdf.addImage(img2, 'JPEG', himg2, vimg2, anchoimg2, altoimg2, null, "SLOW", 0);
                            }
                            if (imagen3) {
                                console.log("agregando imagen");
                                pdf.addImage(img3, 'JPEG', himg3, vimg3, anchoimg3, altoimg3, null, "SLOW", 0);
                            }

                            //Agregamos el titulo "Gobierno del Estado de Sinaloa"
                            pdf.setFontSize(14);
                            pdf.setFont('helvetica');
                            pdf.setFontType('bold');
                            pdf.setTextColor(61, 71, 79);
                            //pdf.text(65, 22, "Gobierno del Estado de Sinaloa");
                            var l = pdf.splitTextToSize(cabecera1, (anchoHoja - margenI - margenD));

                            //pdf.text(75, 22, );
                            pdf.text(l, centro, 22, 'center');
                            //Agregamos el titulo "C4i Sinaloa"
                            pdf.setFontSize(14);
                            pdf.setFont('helvetica');
                            pdf.setFontType('bold');
                            pdf.setTextColor(61, 71, 79);
                            //pdf.text(88, 27, "Ciudad de México");
                            var l = pdf.splitTextToSize(cabecera2, (anchoHoja - margenI - margenD));
                            //pdf.text(75, 22, );
                            pdf.text(l, centro, 27, 'center');
                            //Agregamos la linea que va debajo de la imagen
                            pdf.setLineWidth(.4);
                            pdf.setDrawColor(64, 71, 79);
                            pdf.line(7, 33, 208, 33);
                            //añadimos el numero de pagina
                            //var total = pdf.internal.getNumberOfPages();
                            pdf.setFontSize(8);
                            pdf.setFont('helvetica');
                            pdf.setFontType('bold');
                            pdf.setTextColor(64, 71, 79);
                            //pdf.text(107, 275, pagina.toString());
                            pagina += 1;
                            //agregamos el Folio
                            pdf.setFont('helvetica');
                            pdf.setFontType('bold');
                            pdf.setTextColor(64, 71, 79);
                            pdf.text(175, 275, "Folio:");
                            //agregamos el valor Folio
                            pdf.setFont('helvetica');
                            pdf.setFontType('normal');
                            pdf.setTextColor(146, 151, 163);
                            pdf.text(185, 275, reporte.infoTickets.folioexterno);
                            //agregamos el campo Fecha
                            pdf.setFont('helvetica');
                            pdf.setFontType('bold');
                            pdf.setTextColor(64, 71, 79);
                            pdf.text(12, 275, "Fecha:");
                            //agregamos el valor Fecha
                            pdf.setFont('helvetica');
                            pdf.setFontType('normal');
                            pdf.setTextColor(146, 151, 163);
                            pdf.text(23, 275, formatoFecha((getFecha() + " " + getHora()).toString()));
                            //Agregamos la linea que va arriba del pie de pagina
                            pdf.setLineWidth(.4);
                            pdf.setDrawColor(64, 71, 79);
                            pdf.line(12, 270, 200, 270);
                            //Para la letra del chat
                            pdf.setFontSize(8);
                            pdf.setFont('helvetica');
                            pdf.setFontType('normal');
                            pdf.setTextColor(146, 151, 163);
                            v = 52;
                            v2 = v - 5;
                            cadU = pdf.splitTextToSize(c3[i].value, 80);
                            pdf.text(h2, v, cadU);
                            v = v + (5 * cadU.length);
                            if (parseInt(i) === c3.length - 1) {
                                pdf.line(20, v2, 20, v); //Para agregar la linea izquierda
                                pdf.line(200, v2, 200, v); //Para agregar la linea derechs
                                pdf.line(20, v, 200, v); //Para agregar la linea inferior
                            }
                        }

                    } else
                    if (c3[i].value.includes("clientDisconnected")) {
                        if (v < 250) {
                            //if (c3[i].tipo === "texto") {
                            cadU = pdf.splitTextToSize(reporte.PerfilUsuario.nombre + ": " + c2[0], 80);
                            pdf.text(h2, v, reporte.PerfilUsuario.nombre + " se desconecto");
                            v = v + (5 * cadU.length);
                            if (parseInt(i) === c3.length - 1) {
                                pdf.line(20, v2, 200, v2);
                                pdf.line(20, v2, 20, v); //Para agregar la linea izquierda
                                pdf.line(200, v2, 200, v); //Para agregar la linea derechs
                                pdf.line(20, v, 200, v); //Para agregar la linea inferior
                            }
                            //}
                        } else {
                            pdf.setLineWidth(.1);
                            pdf.setDrawColor(64, 71, 79);
                            pdf.line(20, v2, 200, v2); //Para agregar la linea superior
                            pdf.line(20, v2, 20, v2 + (265 - v2)); //Para agregar la linea izquierda
                            pdf.line(200, v2, 200, v2 + (265 - v2)); //Para agregar la linea derecha
                            pdf.line(20, v2 + (265 - v2), 200, v2 + (265 - v2)); //Para agregar la linea inferior

                            pdf.addPage();
                            if (imagen1) {
                                console.log("agregando imagen");
                                pdf.addImage(img1, 'JPEG', himg1, vimg1, anchoimg1, altoimg1, null, "SLOW", 0);
                            }
                            if (imagen2) {
                                console.log("agregando imagen");
                                pdf.addImage(img2, 'JPEG', himg2, vimg2, anchoimg2, altoimg2, null, "SLOW", 0);
                            }
                            if (imagen3) {
                                console.log("agregando imagen");
                                pdf.addImage(img3, 'JPEG', himg3, vimg3, anchoimg3, altoimg3, null, "SLOW", 0);
                            }

                            //Agregamos el titulo "Gobierno del Estado de Sinaloa"
                            pdf.setFontSize(14);
                            pdf.setFont('helvetica');
                            pdf.setFontType('bold');
                            pdf.setTextColor(61, 71, 79);
                            //pdf.text(65, 22, "Gobierno del Estado de Sinaloa");
                            var l = pdf.splitTextToSize(cabecera1, (anchoHoja - margenI - margenD));

                            //pdf.text(75, 22, );
                            pdf.text(l, centro, 22, 'center');
                            //Agregamos el titulo "C4i Sinaloa"
                            pdf.setFontSize(14);
                            pdf.setFont('helvetica');
                            pdf.setFontType('bold');
                            pdf.setTextColor(61, 71, 79);
                            //pdf.text(88, 27, "Ciudad de México");
                            var l = pdf.splitTextToSize(cabecera2, (anchoHoja - margenI - margenD));
                            //pdf.text(75, 22, );
                            pdf.text(l, centro, 27, 'center');
                            //Agregamos la linea que va debajo de la imagen
                            pdf.setLineWidth(.4);
                            pdf.setDrawColor(64, 71, 79);
                            pdf.line(7, 33, 208, 33);
                            //añadimos el numero de pagina
                            //var total = pdf.internal.getNumberOfPages();
                            pdf.setFontSize(8);
                            pdf.setFont('helvetica');
                            pdf.setFontType('bold');
                            pdf.setTextColor(64, 71, 79);
                            //pdf.text(107, 275, pagina.toString());
                            pagina += 1;
                            //agregamos el Folio
                            pdf.setFont('helvetica');
                            pdf.setFontType('bold');
                            pdf.setTextColor(64, 71, 79);
                            pdf.text(175, 275, "Folio:");
                            //agregamos el valor Folio
                            pdf.setFont('helvetica');
                            pdf.setFontType('normal');
                            pdf.setTextColor(146, 151, 163);
                            pdf.text(185, 275, reporte.infoTickets.folioexterno);
                            //agregamos el campo Fecha
                            pdf.setFont('helvetica');
                            pdf.setFontType('bold');
                            pdf.setTextColor(64, 71, 79);
                            pdf.text(12, 275, "Fecha:");
                            //agregamos el valor Fecha
                            pdf.setFont('helvetica');
                            pdf.setFontType('normal');
                            pdf.setTextColor(146, 151, 163);
                            pdf.text(23, 275, formatoFecha((getFecha() + " " + getHora()).toString()));
                            //Agregamos la linea que va arriba del pie de pagina
                            pdf.setLineWidth(.4);
                            pdf.setDrawColor(64, 71, 79);
                            pdf.line(12, 270, 200, 270);
                            //Para la letra del chat
                            pdf.setFontSize(8);
                            pdf.setFont('helvetica');
                            pdf.setFontType('normal');
                            pdf.setTextColor(146, 151, 163);
                            v = 52;
                            v2 = v - 5;
                            //if (c3[i].tipo === "texto") {
                            pdf.text(h2, v, reporte.PerfilUsuario.nombre + " se desconecto");
                            v = v + (5 * cadU.length);
                            if (parseInt(i) === c3.length - 1) {
                                pdf.line(20, v2, 20, v); //Para agregar la linea izquierda
                                pdf.line(200, v2, 200, v); //Para agregar la linea derechs
                                pdf.line(20, v, 200, v); //Para agregar la linea inferior
                            }
                            //}

                        }
                    } else {
                        if (v < 250) {
                            //if (c3[i].tipo === "texto") {
                            cadU = pdf.splitTextToSize(c3[i].value, 80);
                            pdf.text(h2, v, c3[i].username + ": " + cadU);
                            v = v + (5 * cadU.length);
                            if (parseInt(i) === c3.length - 1) {
                                pdf.line(20, v2, 200, v2);
                                pdf.line(20, v2, 20, v); //Para agregar la linea izquierda
                                pdf.line(200, v2, 200, v); //Para agregar la linea derechs
                                pdf.line(20, v, 200, v); //Para agregar la linea inferior
                            }
                            /*} else {
                             var imagen = buscarImg(c3[i].id)
                             imagen.then(function (response) {
                             var img = "data:image/png;base64," + response.src;
                             pdf.text(h2, v, c3[i].username + ":");
                             v = v + 5;
                             console.log("agregando imagen"); pdf.addImage(img, 'PNG', h2, v, 50, v + 45);
                             v = v + 45;
                             });
                             
                             
                             }*/

                            //c[i] = nom + ": " + c[i];
                            //var c = nom + ": " + c2[0];

                        } else {
                            pdf.setLineWidth(.1);
                            pdf.setDrawColor(64, 71, 79);
                            pdf.line(20, v2, 200, v2); //Para agregar la linea superior
                            pdf.line(20, v2, 20, v2 + (265 - v2)); //Para agregar la linea izquierda
                            pdf.line(200, v2, 200, v2 + (265 - v2)); //Para agregar la linea derecha
                            pdf.line(20, v2 + (265 - v2), 200, v2 + (265 - v2)); //Para agregar la linea inferior

                            pdf.addPage();
                            if (imagen1) {
                                console.log("agregando imagen");
                                pdf.addImage(img1, 'JPEG', himg1, vimg1, anchoimg1, altoimg1, null, "SLOW", 0);
                            }
                            if (imagen2) {
                                console.log("agregando imagen");
                                pdf.addImage(img2, 'JPEG', himg2, vimg2, anchoimg2, altoimg2, null, "SLOW", 0);
                            }
                            if (imagen3) {
                                console.log("agregando imagen");
                                pdf.addImage(img3, 'JPEG', himg3, vimg3, anchoimg3, altoimg3, null, "SLOW", 0);
                            }


                            //Agregamos el titulo "Gobierno del Estado de Sinaloa"
                            pdf.setFontSize(14);
                            pdf.setFont('helvetica');
                            pdf.setFontType('bold');
                            pdf.setTextColor(61, 71, 79);
                            //pdf.text(65, 22, "Gobierno del Estado de Sinaloa");
                            var l = pdf.splitTextToSize(cabecera1, (anchoHoja - margenI - margenD));

                            //pdf.text(75, 22, );
                            pdf.text(l, centro, 22, 'center');
                            //Agregamos el titulo "C4i Sinaloa"
                            pdf.setFontSize(14);
                            pdf.setFont('helvetica');
                            pdf.setFontType('bold');
                            pdf.setTextColor(61, 71, 79);
                            //pdf.text(88, 27, "Ciudad de México");
                            var l = pdf.splitTextToSize(cabecera2, (anchoHoja - margenI - margenD));
                            //pdf.text(75, 22, );
                            pdf.text(l, centro, 27, 'center');
                            //Agregamos la linea que va debajo de la imagen
                            pdf.setLineWidth(.4);
                            pdf.setDrawColor(64, 71, 79);
                            pdf.line(7, 33, 208, 33);
                            //añadimos el numero de pagina
                            //var total = pdf.internal.getNumberOfPages();
                            pdf.setFontSize(8);
                            pdf.setFont('helvetica');
                            pdf.setFontType('bold');
                            pdf.setTextColor(64, 71, 79);
                            //pdf.text(107, 275, pagina.toString());
                            pagina += 1;
                            //agregamos el Folio
                            pdf.setFont('helvetica');
                            pdf.setFontType('bold');
                            pdf.setTextColor(64, 71, 79);
                            pdf.text(175, 275, "Folio:");
                            //agregamos el valor Folio
                            pdf.setFont('helvetica');
                            pdf.setFontType('normal');
                            pdf.setTextColor(146, 151, 163);
                            pdf.text(185, 275, reporte.infoTickets.folioexterno);
                            //agregamos el campo Fecha
                            pdf.setFont('helvetica');
                            pdf.setFontType('bold');
                            pdf.setTextColor(64, 71, 79);
                            pdf.text(12, 275, "Fecha:");
                            //agregamos el valor Fecha
                            pdf.setFont('helvetica');
                            pdf.setFontType('normal');
                            pdf.setTextColor(146, 151, 163);
                            pdf.text(23, 275, formatoFecha((getFecha() + " " + getHora()).toString()));
                            //Agregamos la linea que va arriba del pie de pagina
                            pdf.setLineWidth(.4);
                            pdf.setDrawColor(64, 71, 79);
                            pdf.line(12, 270, 200, 270);
                            //Para la letra del chat
                            pdf.setFontSize(8);
                            pdf.setFont('helvetica');
                            pdf.setFontType('normal');
                            pdf.setTextColor(146, 151, 163);
                            v = 52;
                            v2 = v - 5;
                            pdf.line(20, v2, 200, v2);
                            //c[i] = nom + ": " + c[i];
                            var c = reporte.PerfilUsuario.nombre + ": " + c2[0];
                            //if (c3[i].tipo === "texto") {
                            cadU = pdf.splitTextToSize(c3[i].value, 80);
                            pdf.text(h2, v, c3[i].username + ": " + cadU);
                            //cadU = pdf.splitTextToSize(c, 80);
                            //pdf.text(h2, v, cadU);
                            v = v + (5 * cadU.length);
                            if (parseInt(i) === c3.length - 1) {
                                pdf.line(20, v2, 20, v); //Para agregar la linea izquierda
                                pdf.line(200, v2, 200, v); //Para agregar la linea derechs
                                pdf.line(20, v, 200, v); //Para agregar la linea inferior
                            }
                            /*} else {
                             var imagen = buscarImg(c3[i].id)
                             imagen.then(function (response) {
                             var img = "data:image/png;base64," + response.src;
                             pdf.text(h2, v, c3[i].username + ":");
                             v = v + 5;
                             console.log("agregando imagen"); pdf.addImage(img, 'PNG', h2, v, 50, v + 45);
                             v = v + 45;
                             });
                             
                             
                             }*/

                        }
                    }
                }
            }
//             else {
//                if (v < 250) {
//                    //if (c3[i].tipo === "texto") {
//                    /*cadU = pdf.splitTextToSize(c3[i].value, 80);
//                     pdf.text(h2, v, c3[i].username + ": " + cadU);
//                     v = v + (5 * cadU.length);
//                     if (i === c3[i].length - 1) {
//                     pdf.line(20, v2, 200, v2);
//                     pdf.line(20, v2, 20, v); //Para agregar la linea izquierda
//                     pdf.line(200, v2, 200, v); //Para agregar la linea derechs
//                     pdf.line(20, v, 200, v); //Para agregar la linea inferior
//                     }
//                     } else {*/
//
////                    var t = Imagen;
////                    var image = new Image();
////                    image.onload = function () {
////                      
////                         console.log("agregando imagen"); pdf.addImage(Imagen, 'JPEG', h2, v, 10, 10);
////
////                      
////                    };
////                    image.src = t;
////                  
//                    if ((v + 65) < 250) {
//                        pdf.text(h2, v, reporte.PerfilUsuario.nombre + ":");
//                        v = v + 5;
//
////                        var image = new Image();
////                        image.onload = function () {
//
//
//
//
//                        //if(parseFloat(c3[i].w) > 85){
//
//                        // }
//                        //var w = (width* dpi);
//                        //var h = (height * dpi);
//
//                        console.log("agregando imagen");
//                        pdf.addImage(arregloImg[m].src, 'PNG', h2, v, width, height, undefined, "slow");
//                        v = v + height + 5;
//                        m++;
//                        //};
//                        //image.src = arregloImg[m].src;
//
//
//                    } else {
//                        pdf.setLineWidth(.1);
//                        pdf.setDrawColor(64, 71, 79);
//                        pdf.line(20, v2, 200, v2); //Para agregar la linea superior
//                        pdf.line(20, v2, 20, v2 + (265 - v2)); //Para agregar la linea izquierda
//                        pdf.line(200, v2, 200, v2 + (265 - v2)); //Para agregar la linea derecha
//                        pdf.line(20, v2 + (265 - v2), 200, v2 + (265 - v2)); //Para agregar la linea inferior
//
//                        pdf.addPage();
//                        if (imagen1) {
//                            console.log("agregando imagen");
//                            pdf.addImage(img1, 'JPEG', himg1, vimg1, anchoimg1, altoimg1, null, "SLOW", 0);
//                        }
//                        if (imagen2) {
//                            console.log("agregando imagen");
//                            pdf.addImage(img2, 'JPEG', himg2, vimg2, anchoimg2, altoimg2, null, "SLOW", 0);
//                        }
//                        if (imagen3) {
//                            console.log("agregando imagen");
//                            pdf.addImage(img3, 'JPEG', himg3, vimg3, anchoimg3, altoimg3, null, "SLOW", 0);
//                        }
//
//                        //Agregamos el titulo "Gobierno del Estado de Sinaloa"
//                        pdf.setFontSize(14);
//                        pdf.setFont('helvetica');
//                        pdf.setFontType('bold');
//                        pdf.setTextColor(61, 71, 79);
//                        //pdf.text(65, 22, "Gobierno del Estado de Sinaloa");
//                        var l = pdf.splitTextToSize(cabecera1, (anchoHoja - margenI - margenD));
//
//                        //pdf.text(75, 22, );
//                        pdf.text(l, centro, 22, 'center');
//                        //Agregamos el titulo "C4i Sinaloa"
//                        pdf.setFontSize(14);
//                        pdf.setFont('helvetica');
//                        pdf.setFontType('bold');
//                        pdf.setTextColor(61, 71, 79);
//                        //pdf.text(88, 27, "Ciudad de México");
//                        var l = pdf.splitTextToSize(cabecera2, (anchoHoja - margenI - margenD));
//                        //pdf.text(75, 22, );
//                        pdf.text(l, centro, 27, 'center');
//                        //Agregamos la linea que va debajo de la imagen
//                        pdf.setLineWidth(.4);
//                        pdf.setDrawColor(64, 71, 79);
//                        pdf.line(7, 33, 208, 33);
//                        //añadimos el numero de pagina
//                        //var total = pdf.internal.getNumberOfPages();
//                        pdf.setFontSize(8);
//                        pdf.setFont('helvetica');
//                        pdf.setFontType('bold');
//                        pdf.setTextColor(64, 71, 79);
//                        //pdf.text(107, 275, pagina.toString());
//                        pagina += 1;
//                        //agregamos el Folio
//                        pdf.setFont('helvetica');
//                        pdf.setFontType('bold');
//                        pdf.setTextColor(64, 71, 79);
//                        pdf.text(175, 275, "Folio:");
//                        //agregamos el valor Folio
//                        pdf.setFont('helvetica');
//                        pdf.setFontType('normal');
//                        pdf.setTextColor(146, 151, 163);
//                        pdf.text(185, 275, reporte.infoTickets.folioexterno);
//                        //agregamos el campo Fecha
//                        pdf.setFont('helvetica');
//                        pdf.setFontType('bold');
//                        pdf.setTextColor(64, 71, 79);
//                        pdf.text(12, 275, "Fecha:");
//                        //agregamos el valor Fecha
//                        pdf.setFont('helvetica');
//                        pdf.setFontType('normal');
//                        pdf.setTextColor(146, 151, 163);
//                        pdf.text(23, 275, formatoFecha((getFecha() + " " + getHora()).toString()));
//                        //Agregamos la linea que va arriba del pie de pagina
//                        pdf.setLineWidth(.4);
//                        pdf.setDrawColor(64, 71, 79);
//                        pdf.line(12, 270, 200, 270);
//                        //Para la letra del chat
//                        pdf.setFontSize(8);
//                        pdf.setFont('helvetica');
//                        pdf.setFontType('normal');
//                        pdf.setTextColor(146, 151, 163);
//                        v = 52;
//                        v2 = v - 5;
//                        pdf.line(20, v2, 200, v2);
//                        //c[i] = nom + ": " + c[i];
//                        //var c = nom + ": " + c2[0];
//                        //if (c3[i].tipo === "texto") {
//                        //cadU = pdf.splitTextToSize(c3[i].value, 80);
//                        pdf.text(h2, v, reporte.PerfilUsuario.nombre + ": ");
//                        v = v + 5;
//                        //cadU = pdf.splitTextToSize(c, 80);
//                        //pdf.text(h2, v, cadU);
//                        //v = v + (5 * cadU.length);
//                        if (parseInt(i) === c3.length - 1) {
//                            pdf.line(20, v2, 20, v); //Para agregar la linea izquierda
//                            pdf.line(200, v2, 200, v); //Para agregar la linea derechs
//                            pdf.line(20, v, 200, v); //Para agregar la linea inferior
//                        }
//                        /* } else {*/
//                        // console.log("agregando imagen"); pdf.addImage(Imagen, 'JPEG', h2, v, 50, v + 40);
//                        // m++;
//
//
//                        //var w = (width* dpi);
//                        //var h = (height * dpi);
//
//                        console.log("agregando imagen");
//                        pdf.addImage(arregloImg[m].src, 'PNG', h2, v, width, height, undefined, "slow");
//                        v = v + height + 5;
//                        m++;
//
//                        // }
//                    }
//
//                    // v = v + 5;
//
//                    //var image = buscarImg(c3[i].id);
//                    //image.then(function (response) {
//
//                    //console.log("data:image/png;base64,"+response.src.replace(/\n/gi, ""));
//
//                    //for (var i = m; i <= m; i++) {
//
//
//                    //}
//
//
//
//                    // console.log("agregando imagen"); pdf.addImage(arregloImg[m], 'PNG', h2, v, 50, 50, undefined, "slow");
//                    //var doc = new jsPDF('p', 'pt', 'a4', false);
//                    //doc.addImage("data:image/png;base64,"+response.src.replace(/\n/gi, ""), 'PNG', h2, v, 50, 50,undefined,"slow");
//                    //doc.save( "type" + '.pdf');
//
//                    //});
//                    //Imagen = Imagen.toString().replace(/\n/gi, "");
//
//
//                    //
//                    //
//                    // console.log("agregando imagen"); pdf.addImage(Imagen, 'PNG', h2, v, 15, 15,undefined,"none");
//
//
//
//
//                    //v = v + 20;
//
//                    // console.log("agregando imagen"); pdf.addImage(image.src.toString(), 'JPEG', h2, v, 10,  10);
//
//
//
//
//
//                    //m++;
//
//                } else {
//                    pdf.setLineWidth(.1);
//                    pdf.setDrawColor(64, 71, 79);
//                    pdf.line(20, v2, 200, v2); //Para agregar la linea superior
//                    pdf.line(20, v2, 20, v2 + (265 - v2)); //Para agregar la linea izquierda
//                    pdf.line(200, v2, 200, v2 + (265 - v2)); //Para agregar la linea derecha
//                    pdf.line(20, v2 + (265 - v2), 200, v2 + (265 - v2)); //Para agregar la linea inferior
//
//                    pdf.addPage();
//                    if (imagen1) {
//                        console.log("agregando imagen");
//                        pdf.addImage(img1, 'JPEG', himg1, vimg1, anchoimg1, altoimg1, null, "SLOW", 0);
//                    }
//                    if (imagen2) {
//                        console.log("agregando imagen");
//                        pdf.addImage(img2, 'JPEG', himg2, vimg2, anchoimg2, altoimg2, null, "SLOW", 0);
//                    }
//                    if (imagen3) {
//                        console.log("agregando imagen");
//                        pdf.addImage(img3, 'JPEG', himg3, vimg3, anchoimg3, altoimg3, null, "SLOW", 0);
//                    }
//                    //Agregamos el titulo "Gobierno del Estado de Sinaloa"
//                    pdf.setFontSize(14);
//                    pdf.setFont('helvetica');
//                    pdf.setFontType('bold');
//                    pdf.setTextColor(61, 71, 79);
//                    //pdf.text(65, 22, "Gobierno del Estado de Sinaloa");
//                    var l = pdf.splitTextToSize(cabecera1, (anchoHoja - margenI - margenD));
//
//                    //pdf.text(75, 22, );
//                    pdf.text(l, centro, 22, 'center');
//                    //Agregamos el titulo "C4i Sinaloa"
//                    pdf.setFontSize(14);
//                    pdf.setFont('helvetica');
//                    pdf.setFontType('bold');
//                    pdf.setTextColor(61, 71, 79);
//                    //pdf.text(88, 27, "Ciudad de México");
//                    var l = pdf.splitTextToSize(cabecera2, (anchoHoja - margenI - margenD));
//                    //pdf.text(75, 22, );
//                    pdf.text(l, centro, 27, 'center');
//                    //Agregamos la linea que va debajo de la imagen
//                    pdf.setLineWidth(.4);
//                    pdf.setDrawColor(64, 71, 79);
//                    pdf.line(7, 33, 208, 33);
//                    //añadimos el numero de pagina
//                    //var total = pdf.internal.getNumberOfPages();
//                    pdf.setFontSize(8);
//                    pdf.setFont('helvetica');
//                    pdf.setFontType('bold');
//                    pdf.setTextColor(64, 71, 79);
//                    //pdf.text(107, 275, pagina.toString());
//                    pagina += 1;
//                    //agregamos el Folio
//                    pdf.setFont('helvetica');
//                    pdf.setFontType('bold');
//                    pdf.setTextColor(64, 71, 79);
//                    pdf.text(175, 275, "Folio:");
//                    //agregamos el valor Folio
//                    pdf.setFont('helvetica');
//                    pdf.setFontType('normal');
//                    pdf.setTextColor(146, 151, 163);
//                    pdf.text(185, 275, reporte.infoTickets.folioexterno);
//                    //agregamos el campo Fecha
//                    pdf.setFont('helvetica');
//                    pdf.setFontType('bold');
//                    pdf.setTextColor(64, 71, 79);
//                    pdf.text(12, 275, "Fecha:");
//                    //agregamos el valor Fecha
//                    pdf.setFont('helvetica');
//                    pdf.setFontType('normal');
//                    pdf.setTextColor(146, 151, 163);
//                    pdf.text(23, 275, formatoFecha((getFecha() + " " + getHora()).toString()));
//                    //Agregamos la linea que va arriba del pie de pagina
//                    pdf.setLineWidth(.4);
//                    pdf.setDrawColor(64, 71, 79);
//                    pdf.line(12, 270, 200, 270);
//                    //Para la letra del chat
//                    pdf.setFontSize(8);
//                    pdf.setFont('helvetica');
//                    pdf.setFontType('normal');
//                    pdf.setTextColor(146, 151, 163);
//                    v = 52;
//                    v2 = v - 5;
//                    pdf.line(20, v2, 200, v2);
//                    //c[i] = nom + ": " + c[i];
//                    //var c = nom + ": " + c2[0];
//                    //if (c3[i].tipo === "texto") {
//                    //cadU = pdf.splitTextToSize(c3[i].value, 80);
//                    pdf.text(h2, v, reporte.PerfilUsuario.nombre + ": ");
//                    v = v + 5;
//                    //cadU = pdf.splitTextToSize(c, 80);
//                    //pdf.text(h2, v, cadU);
//                    //v = v + (5 * cadU.length);
//                    if (parseInt(i) === c3.length - 1) {
//                        pdf.line(20, v2, 20, v); //Para agregar la linea izquierda
//                        pdf.line(200, v2, 200, v); //Para agregar la linea derechs
//                        pdf.line(20, v, 200, v); //Para agregar la linea inferior
//                    }
//                    /* } else {*/
//                    // console.log("agregando imagen"); pdf.addImage(Imagen, 'JPEG', h2, v, 50, v + 40);
//                    // m++;
//
//
//                    //var w = (width* dpi);
//                    //var h = (height * dpi);
//
//                    console.log("agregando imagen");
//                    pdf.addImage(arregloImg[m].src, 'PNG', h2, v, width, height, undefined, "slow");
//                    v = v + height + 5;
//                    m++;
//
//                    // }
//
//                }
//            }
        }
        var resta = 265 - v;



        if (resta > 50) {



            v = v + 3;
            //Agregamos el recuadro que muestra el titulo de la tercer seccion
            //pdf.setFillColor(64, 71, 79);
            pdf.setFillColor(94, 97, 99);
            pdf.rect(15, v, 185, 5, 'FD');
            //Agregamos el titulo de la tercer seccion
            pdf.setFontSize(9);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(255, 255, 255);
            //pdf.text(92.5, v + 3.5, "Tiempos de la Llamada");

            var l = pdf.splitTextToSize("Tiempos de la Llamada", (anchoHoja - 15 - 15));
            //pdf.text(75, 22, );
            pdf.text(l, centro, v + 3.5, 'center');

            //Campo Recibida por Usuario:
            //Campo Recibida por Usuario:
            v = v + 10;
            h = 30;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "Recibida por Usuario:");
            //Valor Recibida por Usuario:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(65, v, reporte.RegistroLlamada.id_usuario_sys);
            //Recuadro Recibida por Usuario:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(61, v - 3.5, 110, 5);
            //Campo H.Recepción:
            v = v + 6;
            h = 41.3;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "H.Recepción:");
            //Valor H.Recepción:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(65, v, h_recepcion2);

            //Recuadro H.Recepción:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(61, v - 3.5, 38, 5);
            //Campo H.Transmisión:
            v = v + 6;
            h = 38.8;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "H.Transmisión:");
            //Valor H.Transmisión:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(65, v, h_atencion_inicio2);

            //Recuadro H.Transmisión:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(61, v - 3.5, 38, 5);
            //Campo T.Transmisión:
            //v = v+6;
            h = 120.8;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "T.Transmisión:");
            //Valor T.Transmisión:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(145, v, t_transmision);
            //Recuadro T.Transmisión:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(142, v - 3.5, 29, 5);
            //Campo H.Captura:
            v = v + 6;
            h = 44.9;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "H.Captura:");
            //Valor H.Captura:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(65, v, formatoFecha((reporte.ReporteLlamada.fecha + " " + reporte.ReporteLlamada.hora).toString()));
            //Recuadro H.Captura:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(61, v - 3.5, 38, 5);
            //Campo T.Captura:
            //v = v+6;
            h = 126.9;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "T.Captura:");
            //Valor T.Captura:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(145, v, t_captura);
            //Recuadro T.Captura:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(142, v - 3.5, 29, 5);




            //Campo H.Conexion_Usuario:
            v = v + 6;
            h = 30.6;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "H.Conexión_Usuario:");
            //Valor H.Conexión_Usuario:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(65, v, h_conexion_usuario2);


            //Recuadro H.Conexión_Usuario:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(61, v - 3.5, 38, 5);

            v = v + 6;
            h = 26;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "H.Desconexión_Usuario:");
            //Valor H.Conexión_Usuario:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(65, v, h_desconexion_usuario2);


            //Recuadro H.Conexión_Usuario:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(61, v - 3.5, 38, 5);
            //Campo T.Transmisión_Usuario:
            //v = v+6;
            h = 108.7;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "T.Transmisión_Usuario:");
            //Valor T.Transmisión_Usuario:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(145, v, t_transmision_usuario);
            //Recuadro T.Transmisión_Usuario:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(142, v - 3.5, 29, 5);

            //Campo H.Conexión_Operador:
            v = v + 6;
            h = 28.5;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "H.Conexión_Operador:");
            //Valor H.Conexión_Operador:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(65, v, h_conexion_operador2);

            //Recuadro H.Conexión_Operador:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(61, v - 3.5, 38, 5);

            v = v + 6;
            h = 24;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "H.Desconexión_Operador:");
            //Valor H.Conexión_Operador:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(65, v, h_desconexion_operador2);


            //Recuadro H.Conexión_Operador:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(61, v - 3.5, 38, 5);
            //Campo T.Transmisión_Operador:
            //v = v+6;
            h = 106.5;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "T.Transmisión_Operador:");
            //Valor T.Transmisión_Operador:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(145, v, t_transmision_operador);
            //Recuadro T.Captura:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(142, v - 3.5, 29, 5);
        } else {

            v = 40;
            v2 = 35;
            pdf.addPage();
            if (imagen1) {

                console.log("agregando imagen");
                pdf.addImage(img1, 'JPEG', himg1, vimg1, anchoimg1, altoimg1, null, "SLOW", 0);
            }
            if (imagen2) {
                console.log("agregando imagen");
                pdf.addImage(img2, 'JPEG', himg2, vimg2, anchoimg2, altoimg2, null, "SLOW", 0);
            }
            if (imagen3) {
                console.log("agregando imagen");
                pdf.addImage(img3, 'JPEG', himg3, vimg3, anchoimg3, altoimg3, null, "SLOW", 0);
            }
            //Agregamos el titulo "Gobierno del Estado de Sinaloa"
            pdf.setFontSize(14);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(61, 71, 79);
            //pdf.text(65, 22, "Gobierno del Estado de Sinaloa");
            var l = pdf.splitTextToSize(cabecera1, (anchoHoja - margenI - margenD));

            //pdf.text(75, 22, );
            pdf.text(l, centro, 22, 'center');
            //Agregamos el titulo "C4i Sinaloa"
            pdf.setFontSize(14);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(61, 71, 79);
            //pdf.text(88, 27, "Ciudad de México");
            var l = pdf.splitTextToSize(cabecera2, (anchoHoja - margenI - margenD));
            //pdf.text(75, 22, );
            pdf.text(l, centro, 27, 'center');
            //Agregamos la linea que va debajo de la imagen
            pdf.setLineWidth(.4);
            pdf.setDrawColor(64, 71, 79);
            pdf.line(7, 33, 208, 33);
            //añadimos el numero de pagina
            //var total = pdf.internal.getNumberOfPages();
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            //pdf.text(107, 275, pagina.toString());
            pagina += 1;
            //agregamos el Folio
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(175, 275, "Folio:");
            //agregamos el valor Folio
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(185, 275, reporte.infoTickets.folioexterno);
            //agregamos el campo Fecha
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(12, 275, "Fecha:");
            //agregamos el valor Fecha
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(23, 275, formatoFecha((getFecha() + " " + getHora()).toString()));
            //Agregamos la linea que va arriba del pie de pagina
            pdf.setLineWidth(.4);
            pdf.setDrawColor(64, 71, 79);
            pdf.line(12, 270, 200, 270);
            //Agregamos el recuadro que muestra el titulo de la tercer seccion
            //pdf.setFillColor(64, 71, 79);
            pdf.setFillColor(94, 97, 99);
            pdf.rect(15, v, 185, 5, 'FD');
            //Agregamos el titulo de la tercer seccion
            pdf.setFontSize(9);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(255, 255, 255);
            //pdf.text(92.5, v + 3.5, "Tiempos de la Llamada");

            var l = pdf.splitTextToSize("Tiempos de la Llamada", (anchoHoja - 15 - 15));
            //pdf.text(75, 22, );
            pdf.text(l, centro, v + 3.5, 'center');

            //Campo Recibida por Usuario:
            v = v + 10;
            h = 30;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "Recibida por Usuario:");
            //Valor Recibida por Usuario:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(65, v, reporte.RegistroLlamada.id_usuario_sys);
            //Recuadro Recibida por Usuario:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(61, v - 3.5, 110, 5);
            //Campo H.Recepción:
            v = v + 6;
            h = 41.3;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "H.Recepción:");
            //Valor H.Recepción:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(65, v, h_recepcion2);


            //Recuadro H.Recepción:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(61, v - 3.5, 38, 5);
            //Campo H.Transmisión:
            v = v + 6;
            h = 38.8;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "H.Transmisión:");
            //Valor H.Transmisión:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(65, v, h_atencion_inicio2);


            //Recuadro H.Transmisión:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(61, v - 3.5, 38, 5);
            //Campo T.Transmisión:
            //v = v+6;
            h = 120.8;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "T.Transmisión:");
            //Valor T.Transmisión:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(145, v, t_transmision);
            //Recuadro T.Transmisión:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(142, v - 3.5, 29, 5);
            //Campo H.Captura:
            v = v + 6;
            h = 44.9;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "H.Captura:");
            //Valor H.Captura:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(65, v, formatoFecha((reporte.ReporteLlamada.fecha + " " + reporte.ReporteLlamada.hora).toString()));
            //Recuadro H.Captura:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(61, v - 3.5, 38, 5);
            //Campo T.Captura:
            //v = v+6;
            h = 126.9;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "T.Captura:");
            //Valor T.Captura:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(145, v, t_captura);
            //Recuadro T.Captura:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(142, v - 3.5, 29, 5);




            //Campo H.Conexion_Usuario:
            v = v + 6;
            h = 30.6;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "H.Conexión_Usuario:");
            //Valor H.Conexión_Usuario:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(65, v, h_conexion_usuario2);


            //Recuadro H.Conexión_Usuario:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(61, v - 3.5, 38, 5);

            v = v + 6;
            h = 26;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "H.Desconexión_Usuario:");
            //Valor H.Conexión_Usuario:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(65, v, h_desconexion_usuario2);


            //Recuadro H.Conexión_Usuario:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(61, v - 3.5, 38, 5);
            //Campo T.Transmisión_Usuario:
            //v = v+6;
            h = 108.7;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "T.Transmisión_Usuario:");
            //Valor T.Transmisión_Usuario:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(145, v, t_transmision_usuario);
            //Recuadro T.Transmisión_Usuario:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(142, v - 3.5, 29, 5);

            //Campo H.Conexión_Operador:
            v = v + 6;
            h = 28.5;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "H.Conexión_Operador:");
            //Valor H.Conexión_Operador:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(65, v, h_conexion_operador2);


            //Recuadro H.Conexión_Operador:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(61, v - 3.5, 38, 5);

            v = v + 6;
            h = 24;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "H.Desconexión_Operador:");
            //Valor H.Conexión_Operador:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(65, v, h_desconexion_operador2);


            //Recuadro H.Conexión_Operador:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(61, v - 3.5, 38, 5);
            //Campo T.Transmisión_Operador:
            //v = v+6;
            h = 106.5;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('bold');
            pdf.setTextColor(64, 71, 79);
            pdf.text(h, v, "T.Transmisión_Operador:");
            //Valor T.Transmisión_Operador:
            //v = v+10;
            //h = 100;
            pdf.setFontSize(8);
            pdf.setFont('helvetica');
            pdf.setFontType('normal');
            pdf.setTextColor(146, 151, 163);
            pdf.text(145, v, t_transmision_operador);
            //Recuadro T.Captura:
            pdf.setLineWidth(.1);
            pdf.setDrawColor(146, 151, 163);
            pdf.rect(142, v - 3.5, 29, 5);
        }

        total = pdf.internal.getNumberOfPages();
        for (var i = 1; i < pagina; i++) {
            pdf.setPage(i);
            pdf.text(107, 275, i + "/" + total);
        }


    } else {
        document.write("<h1 style='text-align:center; padding-top: 200;'>Reporte no Encontrado</h1>");
    }
    source = document.getElementById("pdf")
            , specialElementHandlers = {
                // element with id of "bypass" - jQuery style selector
                '#bypassme': function (element, renderer) {
                    // true = "handled elsewhere, bypass text extraction"
                    return true;
                }
            };
    margins = {
        top: 40,
        bottom: 30,
        left: 15,
        width: 186
    };
    pdf.fromHTML(
            source,
            margins.left, // x coord
            margins.top, {// y coord
                'width': margins.width // max width of content on PDF
                , 'elementHandlers': specialElementHandlers
            },
            function (dispose) {
                // dispose: object with X, Y of the last line add to the PDF 
                //          this allow the insertion of new lines after html
                var iframe = document.createElement('iframe');
                iframe.setAttribute('style', 'position:absolute;right:0; top:0; bottom:0; height:100%; width:100%;');
                document.body.appendChild(iframe);
                iframe.src = pdf.output('datauristring');
            },
            margins
            );
    //Añadimos el numero de la primer pagina
    // }







}

function RestarDate(date1, date2) {

    //La diferencia se da en milisegundos así que debes dividir entre 1000
    var time = ((date2 - date1) / 1000);
    // resultado 5;

    var hours = Math.floor(time / 3600);
    var minutes = Math.floor((time % 3600) / 60);
    var seconds = time % 60;
    //Anteponiendo un 0 a los minutos si son menos de 10 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    //Anteponiendo un 0 a los segundos si son menos de 10 o String(minutes).padStart(2, '0')
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var result = hours + ":" + minutes + ":" + seconds;




    return (result);
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
    //Anteponiendo un 0 a la hora si son menos de 10 
    hora = hora < 10 ? '0' + hora : hora;
    //Anteponiendo un 0 a los minutos si son menos de 10 
    min = min < 10 ? '0' + min : min;
    //Anteponiendo un 0 a los segundos si son menos de 10 
    seg = seg < 10 ? '0' + seg : seg;


    var h = hora + ':' + min + ':' + seg;
    return h;
}


function guardaImg(reporte) {


    //reporte = JSON.parse(reporte);

    var s = 0;
    var count = 0;
    var pos = new Array();
    if (reporte.RegistroLlamada.chat.includes("imagen")) {
        //var chat2 = JSON.parse(chat);
        for (var j in reporte.RegistroLlamada.chat) {
            if (reporte.RegistroLlamada.chat[j].tipo === "imagen") {
                pos.push(j);
                count++;

            }
        }
        for (var j = 0; j < pos.length; j++) {


            buscarImg(reporte.RegistroLlamada.chat[pos[j]].id).then(function () {
                count--;
                if (count === 0) {

                    arregloImg = sortJSON(arregloImg, 'id', 'asc');



                    generar2(reporte/*folioexterno,id, Folio, fecha, hora, direccion, estado, municipio, colonia, codigopostal, chat, estadoI, estadoF, usuarioSys, Nombre, Apellidos, idMovil, horaA, horaF, tlugar, nPiso, descLugar, temergencia, prioridad, Rep, nom, ap, am, bitacora,folioexterno_reporte,hora_reporte,fecha_reporte*/);
                }
            });
        }
    } else {
        generar2(reporte/*folioexterno,id, Folio, fecha, hora, direccion, estado, municipio, colonia, codigopostal, chat, estadoI, estadoF, usuarioSys, Nombre, Apellidos, idMovil, horaA, horaF, tlugar, nPiso, descLugar, temergencia, prioridad, Rep, nom, ap, am, bitacora,folioexterno_reporte,hora_reporte,fecha_reporte*/);
    }



    return true;
}


function buscarImg(id) {

    id = parseInt(id);

    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/CosultaImg',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "id": id
        }),
        success: function (response) {



            var ima = {
                id: response.id,
                src: 'data:image/png;base64,' + response.src.replace(/\n/gi, "")
            };
            arregloImg.push(ima);



//            var ima = {
//                id: response.id,
//                src: 'data:image/png;base64,' + response.src.replace(/\n/gi, "")
//            };
//            arregloImg.push(ima);
        },
        error: function (err) {


        }
    }));
}


function sortJSON(data, key, orden) {
    return data.sort(function (a, b) {
        var x = a[key],
                y = b[key];

        if (orden === 'asc') {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }

        if (orden === 'desc') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}

function validaKey(bitacora, key) {
//   
    if (bitacora.hasOwnProperty(key))
        return bitacora[key];
    else
        return "";
}


function formatoFecha(fechacompleta) {
    if (fechacompleta !== "") {
        var completa = fechacompleta.split(" ");
        var fecha = completa[0].split("-");
        var fechaNueva = fecha[2] + "/" + fecha[1] + "/" + fecha[0];
        var fechacompletaNueva = fechaNueva + " " + completa[1];
        return fechacompletaNueva;
    } else {
        return fechacompleta;
    }
}