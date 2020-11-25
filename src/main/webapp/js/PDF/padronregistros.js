/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global parseFloat */

var pdf;
var anchoHoja = 279;
var altoHoja = 216;
var margenSup = 10;
var margenInf = 10;
var margenI = 10;
var margenD = 10;
var posV = margenSup;
var posH = margenI;

var dispositivosDemo = new Array(
        "5526695594",
        "2381314184",
        "5512345678",
        "5529631918",
        "5579071343",
        "5579071346",
        "5579071348",
        "5587459327",
        "5612665915",
        "5517053210",
        "5512303034",
        "5533333366",
        "5599999966",
        "5566163068",
        "5521212121",
        "5512304583",
        "5536799372"
        );

if ($("#registros").length) {
    var registros = JSON.parse($("#registros").val());
    console.log(registros);
    GenerarPDF(registros);
}



function GenerarPDF(registros) {
    pdf = new jsPDF(
            {
                orientation: 'l',
                unit: 'mm',
                format: 'letter',
                putOnlyUsedFonts: true
            });
    agregarTitulo("Registro de usuarios registrados en la plataforma de: " + config.t1 + ".");
    for (var i = 0; i < registros.orden.length; i++) {
        posV += 4;
        titulo2(registros.orden[i]);
        columnas();
        if (registros[registros.orden[i]].length == 0) {
            sinregistros();
        } else {
            for (var j = 0; j < registros[registros.orden[i]].length; j++) {
                var procede = true;
                console.log(registros[registros.orden[i]][j].nombre.toString().toLowerCase());
                if (
                        registros[registros.orden[i]][j].nombre.toString().toLowerCase()==="micro" ||
                        registros[registros.orden[i]][j].nombre.toString().toLowerCase()==="pica" ||
                        registros[registros.orden[i]][j].nombre.toString().toLowerCase()==="yerbas" ||
                        registros[registros.orden[i]][j].nombre.toString().toLowerCase()==="global" ||
                        registros[registros.orden[i]][j].nombre.toString().toLowerCase()==="tio" ||
                        registros[registros.orden[i]][j].nombre.toString().toLowerCase()==="donpi"
                        
                        ) {
                    procede = false;
                } else {
                    for (var k = 0; k < dispositivosDemo.length; k++) {


                        if (dispositivosDemo[k] === registros[registros.orden[i]][j].idUsuarios_Movil) {
                            procede = false;
                            break;
                        }
                    }
                }

                if (procede) {
                    agregarRegistro(registros[registros.orden[i]][j]);
                }

            }

        }

    }
    pieDocumento();
    visualizarPDF();
}
var x;
function agregarTitulo(texto) {
    //90 z-14
    console.log(texto);
    console.log(posV);
    console.log(posH);
    pdf.setFontSize(14);
    pdf.setFont('helvetica');
    pdf.setFontType('bold');
    x = pdf.splitTextToSize(texto, (anchoHoja - margenI - margenD));
    //pdf.text(posH, posV, texto);
    for (var i = 0; i < x.length; i++) {
        pdf.text(x[i], anchoHoja / 2, posV, 'center');
        if (i < x.length - 1) {
            posV += 6;
        } else {
            posV += 2;
        }
    }
}

function visualizarPDF() {
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
}

function titulo2(text) {
    if (posV + 26 > (216 - margenInf)) {
        agregarpagina();
    }
    //tamaño 8
    pdf.setDrawColor(0);
    pdf.setFillColor(0, 0, 0);
    pdf.roundedRect(margenI, posV, anchoHoja - margenD - margenI, 8, 2, 2, 'FD');
    pdf.roundedRect(margenI, posV + 4, anchoHoja - margenD - margenI, 4, 0, 0, 'FD');
    posV += 5;
    pdf.setFontSize(12);
    pdf.setFont('helvetica');
    pdf.setFontType('bold');
    pdf.setTextColor(255);
    pdf.text(text, anchoHoja / 2, posV, 'center');
    posV += 3;
}
function columnas() {
    /*Telefono Nombre Registro - Fecha Hora Ultima conexion - Fecha Hora ultima posicion Latitud Longitud*/
    //tamaño 10
    pdf.setDrawColor(0);
    pdf.setFillColor(255);
    var anchof = anchoHoja - margenD - margenI;
    anchof = anchof / 30;
    pdf.rect(margenI, posV, anchof * 5, 10);
    pdf.rect(margenI + (anchof * 5), posV, anchof * 10, 10);
    pdf.rect(margenI + (anchof * 15), posV, anchof * 5, 10);
    pdf.rect(margenI + (anchof * 20), posV, anchof * 5, 10);
    pdf.rect(margenI + (anchof * 25), posV, anchof * 5, 10);

    posV += 4;

    pdf.setFontSize(9);
    pdf.setFont('helvetica');
    pdf.setFontType('normal');
    pdf.setTextColor(0);

    pdf.text("Registro", margenI + (anchof * 17.5), posV, 'center');
    pdf.text("Ultima Conexión", margenI + (anchof * 22.5), posV, 'center');
    pdf.text("Ultima Posición", margenI + (anchof * 27.5), posV, 'center');

    posV += 1;
    pdf.rect(margenI + (anchof * 15), posV, anchof * 2.5, 5);
    pdf.rect(margenI + (anchof * 15), posV, anchof * 5, 5);
    pdf.rect(margenI + (anchof * 20), posV, anchof * 2.5, 5);
    pdf.rect(margenI + (anchof * 20), posV, anchof * 5, 5);
    pdf.rect(margenI + (anchof * 25), posV, anchof * 2.5, 5);
    pdf.rect(margenI + (anchof * 25), posV, anchof * 5, 5);

    posV += 1;
    pdf.setFontSize(10);
    pdf.text("Teléfono", margenI + (anchof * 2.5), posV, 'center');
    pdf.text("Nombre de usuario", margenI + (anchof * 10), posV, 'center');

    posV += 2.5;
    pdf.setFontSize(8);
    pdf.text("Fecha", margenI + (anchof * 16.25), posV, 'center');
    pdf.text("Hora", margenI + (anchof * 18.75), posV, 'center');
    pdf.text("Fecha", margenI + (anchof * 21.25), posV, 'center');
    pdf.text("Hora", margenI + (anchof * 23.75), posV, 'center');
    pdf.text("Latitud", margenI + (anchof * 26.25), posV, 'center');
    pdf.text("Longitud", margenI + (anchof * 28.75), posV, 'center');

    posV += 1.5;
}
function sinregistros() {
    //tamaño 15
    pdf.setDrawColor(0);
    pdf.setFillColor(255);
    pdf.rect(margenI, posV, anchoHoja - margenD - margenI, 10);
    posV += 6;
    pdf.setFontSize(11);
    pdf.setFont('helvetica');
    pdf.setFontType('normal');
    pdf.setTextColor(100);
    pdf.text("Sin registros.", anchoHoja / 2, posV, 'center');
    posV += 4;
}

function agregarRegistro(reg) {
    if (posV + 6 > (216 - margenInf)) {
        agregarpagina();
    }
    console.log(reg);
    var anchof = anchoHoja - margenD - margenI;
    anchof = anchof / 30;

    pdf.rect(margenI + anchof * 0, posV, anchof * 5, 6);
    pdf.rect(margenI + anchof * 5, posV, anchof * 10, 6);
    pdf.rect(margenI + anchof * 15, posV, anchof * 2.5, 6);
    pdf.rect(margenI + anchof * 17.5, posV, anchof * 2.5, 6);
    pdf.rect(margenI + anchof * 20, posV, anchof * 2.5, 6);
    pdf.rect(margenI + anchof * 22.5, posV, anchof * 2.5, 6);
    pdf.rect(margenI + anchof * 25, posV, anchof * 2.5, 6);
    pdf.rect(margenI + anchof * 27.5, posV, anchof * 2.5, 6);

    posV += 4;

    pdf.setFontSize(8);
    pdf.setFont('helvetica');
    pdf.setFontType('normal');
    pdf.setTextColor(0);

    pdf.text(margenI + 2 + anchof * 0, posV, reg.idUsuarios_Movil);
    pdf.text(margenI + 2 + anchof * 5, posV, reg.nombre + " " + reg.apellido_paterno + " " + reg.apellido_materno);
    pdf.text(margenI + 2 + anchof * 15, posV, reg.Fecha_Registro !== null ? reg.Fecha_Registro : "");
    pdf.text(margenI + 2 + anchof * 17.5, posV, reg.Hora_Registro !== null ? reg.Hora_Registro : "");
    pdf.text(margenI + 2 + anchof * 20, posV, reg.Fecha_Ultimo_Registro !== null ? reg.Fecha_Ultimo_Registro : "");
    pdf.text(margenI + 2 + anchof * 22.5, posV, reg.Hora_Ultimo_Registro !== null ? reg.Hora_Ultimo_Registro : "");
    pdf.text(margenI + 2 + anchof * 25, posV, (parseFloat(reg.Latitud).toFixed(7))).toString();
    pdf.text(margenI + 2 + anchof * 27.5, posV, (parseFloat(reg.Longitud)).toFixed(7)).toString();

    posV += 2;
}

function agregarpagina() {
    pdf.addPage();
    posV = margenSup;
    posH = margenI;
}

function pieDocumento() {
    var date = new Date();
    pdf.setFontSize(8);
    pdf.setFont('times');
    pdf.setFontType('normal');
    pdf.setTextColor(80);

    for (var i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
        pdf.setPage(i);
        pdf.text("Registro de usuarios registrados en la plataforma de: " + config.t1 + ".      " + getFecha() + " " + getHora() + "       " + i + "/" + pdf.internal.getNumberOfPages(), anchoHoja - margenD, altoHoja - (margenInf / 2), 'right');
    }

}
