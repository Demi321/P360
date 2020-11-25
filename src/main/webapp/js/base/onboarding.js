/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function(){
    var getUrl = window.location;
    var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
    var baseRecursos = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1]+"/resources/local_v3";
    var slideIndex = 0;
    //showSlides();
    function showSlides() {
        var i;
        var slides = document.getElementsByClassName("banner");
        var dots = document.getElementsByClassName("bannerdot");
        for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";  
        }
        slideIndex++;
        if (slideIndex > slides.length) {slideIndex = 1}    
        for (i = 0; i < dots.length; i++) {
          dots[i].className = dots[i].className.replace(" activebn", "");
        }
        slides[slideIndex-1].style.display = "block";  
        dots[slideIndex-1].className += " activebn";
        setTimeout(showSlides, 8000); // Change image every 5 seconds
    }
/**** ALERT REGISTRO USUARIO **** ALERT REGISTRO USUARIO **** ALERT REGISTRO USUARIO ****/    
    $('#registroa').click(function() {
        Swal.fire({
            title: '',
            width: 900,
            html:'<div class="col-12 row" style="background-image:url('+baseRecursos+'/images/onboarding/360webonboard3.png);\n\
                    background-position: top;height: 70vh;padding: 0px;margin: 0px;">'+
                    '<div class="col-12" style="background-color:rgba(255,255,255,1);top:0vh;position:absolute;color: black;padding:20px;">'+
                        '<h1 style="font-weight: bold;margin:0px;color:da291c;">¡Bienvenido Empresario!</h1>'+
                        '<span>Organiza tu día, tu empresa y a los miembros de tu equipo en un solo lugar,'+
                        ' ahora tenemos para ti la nueva oficina digital que va a todo lugar.</span>'+
                    '</div>'+
                '</div>',        
            showCloseButton: true,
            showConfirmButton:false,
            //timer:9000,
            onClose: () => {
               //location.href = baseUrl+"/registro";
            },
            padding: '2em',
            background: '#fff',
            backdrop: `rgba(0,0,0,0.75)`,
            customClass:{
                title: 'alrtRegIni'
            }
        })
    });
/**** ALERT REGISTRO EMPRESA **** ALERT REGISTRO EMPRESA **** ALERT REGISTRO EMPRESA ****/    
    $('#ingresoa').click(function() {
        Swal.fire({
            title: '',
            width: 900,
            html:'<div class="col-12 row" style="background-image:url('+baseRecursos+'/images/onboarding/360webonboard1.png);\n\
                    background-position: left;height: 70vh;padding: 0px;margin: 0px;">'+
                    '<div class="col-12" style="background-color:rgba(255,0,0,0.5);bottom:5vh;position:absolute;color: white;padding:20px;">'+
                        '<h1 style="font-weight: bold;margin:0px;">Bienvenido a tu oficina: Completa algunos datos y disfruta de tus nuevas herramientas</h1>'+
                        '<span>Ingresa la información que permitirá dar de alta a tu sucursal en 360 y tu red de trabajo'+
                        ' se formará en algunos pasos.</span>'+
                    '</div>'+
                '</div>',
            showCloseButton: true,
            showConfirmButton:false,
            //timer:9000,
            onClose: () => {
                //location.href = baseUrl+"/registro";
            },
            padding: '2em',
            background: '#fff',
            backdrop: `rgba(0,0,0,0.75)`,
            customClass:{
                title: 'alrtRegIni'
            }
        })
    });
    $('#ingresoab').click(function() {
        Swal.fire({
            title: '',
            width: 900,
            html:'<div class="col-12 row" style="background-image:url('+baseRecursos+'/images/onboarding/360webonboard1.png);\n\
                    background-position: left;height: 70vh;padding: 0px;margin: 0px;">'+
                    '<div class="col-12" style="background-color:rgba(255,0,0,0.5);bottom:5vh;position:absolute;color: white;padding:20px;">'+
                        '<h1 style="font-weight: bold;margin:0px;">Empresario: Completa algunos datos y disfruta de tus nuevas herramientas</h1>'+
                        '<span>Ingresa la información que permitirá dar de alta a tu empresa y sucursales en 360, tu red de trabajo'+
                        ' se formará en algunos pasos.</span>'+
                    '</div>'+
                '</div>',
            showCloseButton: true,
            showConfirmButton:false,
            //timer:9000,
            onClose: () => {
                //location.href = baseUrl+"/registro";
            },
            padding: '2em',
            background: '#fff',
            backdrop: `rgba(0,0,0,0.75)`,
            customClass:{
                title: 'alrtRegIni'
            }
        })
    });    
/*****ALERT COLABORADORES*****ALERT COLABORADORES*****ALERT COLABORADORES*****/    
    $('#ingresob').click(function() {
        Swal.fire({
            title: '',
            width: 900,
            html:'<div class="col-12 row" style="background-image:url('+baseRecursos+'/images/onboarding/360webonboard2.png);\n\
                    background-position: top;height: 70vh;padding: 0px;margin: 0px;">'+
                    '<div class="col-12" style="background-color:rgba(255,0,0,0.5);bottom:5vh;position:absolute;color: white;padding:20px;">'+
                        '<h1 style="font-weight: bold;margin:0px;">Invitar a tus colaboradores</h1>'+
                        '<span>Invita a tu equipo de trabajo a unirse a la Plataforma 360. Crece tu red interna y externa</span>'+
                    '</div>'+
                '</div>',
            showCloseButton: true,
            showConfirmButton:false,
            //timer:9000,
            onClose: () => {
                //location.href = baseUrl+"/registro";
            },
            padding: '2em',
            background: '#fff',
            backdrop: `rgba(0,0,0,0.75)`,
            customClass:{
                title: 'alrtRegIni'
            }
        })
    });
/**** ALERT REGISTRO SUCURSAL **** ALERT REGISTRO SUCURSAL **** ALERT REGISTRO SUCURSAL ****/
    $('#ingresoc').click(function() {
        Swal.fire({
            title: '',
            width: 900,
            html:'<div class="col-12 row" style="background-image:url('+baseRecursos+'/images/onboarding/360webonboard1.png);\n\
                    background-position: left;height: 70vh;padding: 0px;margin: 0px;">'+
                    '<div class="col-12" style="background-color:rgba(255,0,0,0.5);bottom:5vh;position:absolute;color: white;padding:20px;">'+
                        '<h1 style="font-weight: bold;margin:0px;">Ahora agrega sucursales y comienza a invitar a tu equipo.</h1>'+
                        '<span>Agrega una, dos, 10, 20 sucursales, donde sea que esté o sin importar el número de colaboradores'+
                        ' con los que cuentes agrégalos en este paso y muy pronto todos estarán invitados.</span>'+
                    '</div>'+
                '</div>',
            showCloseButton: true,
            showConfirmButton:false,
            //timer:9000,
            onClose: () => {
                //location.href = baseUrl+"/registro";
            },
            padding: '2em',
            background: '#fff',
            backdrop: `rgba(0,0,0,0.75)`,
            customClass:{
                title: 'alrtRegIni'
            }
        })
    });
/**** ALERT INVITACION SUCURSAL **** ALERT INVITACION SUCURSAL **** ALERT INVITACION SUCURSAL ****/  
    $('#ingresod').click(function() {
        Swal.fire({
            title: '',
            width: 900,
            html:'<div class="col-12 row" style="background-image:url('+baseRecursos+'/images/onboarding/360webonboard2.png);\n\
                    background-position: top;height: 70vh;padding: 0px;margin: 0px;">'+
                    '<div class="col-12" style="background-color:rgba(255,0,0,0.5);bottom:5vh;position:absolute;color: white;padding:20px;">'+
                        '<h1 style="font-weight: bold;margin:0px;">Invitar a tus sucursales</h1>'+
                        '<span>Invita a tu equipo laboral a unirse a la Plataforma 360. Crece tu red de trabajo</span>'+
                    '</div>'+
                '</div>',
            showCloseButton: true,
            showConfirmButton:false,
            //timer:9000,
            onClose: () => {
                //location.href = baseUrl+"/registro";
            },
            padding: '2em',
            background: '#fff',
            backdrop: `rgba(0,0,0,0.75)`,
            customClass:{
                title: 'alrtRegIni'
            }
        })
    });
/**** ALERT ONBOARDING PERSONA **** ALERT ONBOARDING PERSONA **** ALERT ONBOARDING PERSONA ****/
    $('#registrof').click(function() {
        Swal.fire({
            title: '<img src="'+baseRecursos+'/images/base/Claro360_Logo_Header_negro.png">',
            width: 900,
            html:'<div class="col-12 banner personaa fade text-center">'+
                '<h1 style="">TU MUNDO MÁS SIMPLE, MÁS FÁCIL</h1>'+
                '<div class="col-12 contD">'+
                    '<span>Claro 360 es el único portal de servicios digitales que facilita tu vida y te ofrece comunicación, cuidado de la salud y mucho más.</span>'+
                    '<h2 style="font-weight: bold;margin:0px;">Descubre tu 360</h2>'+
                '</div>'+
            '</div>'+
            '<div class="col-12 banner personab fade text-center">'+
                '<h1>Realiza Tus Pagos sin Salir de Casa</h1>'+
                '<div class="col-12 contD">'+
                    '<span>Paga todos tus servicios, haz recargas telefónicas, transferencias bancarias, recargas de TAG y otros servicios de forma rápida en donde te encuentres.</span>'+
                '</div>'+
            '</div>'+
            '<div class="col-12 banner personac fade text-center">'+
                '<h1>Expertos 360</h1>'+
                '<div class="col-12 contD">'+
                    '<span>Comunícate con un especialista de la salud y recibe asesoría médica remota desde cualquier lugar, consulta el catálogo de médico, selecciona uno y solicita una cita.</span>'+
                '</div>'+
            '</div>'+
            '<div class="col-12 banner personad fade text-center">'+
                '<h1>Videovigilancia</h1>'+
                '<div class="col-12 contD">'+
                    '<span>Mantén seguro tu hogar y a tu familia con el monitoreo de cámaras de video vigilancia en tiempo real.</span>'+
                '</div>'+
            '</div>'+
            '<div class="col-12 bannerspn" style="text-align:center;height: 0px;top: -5px;">'+
                '<span class="bannerdot"></span>'+
                '<span class="bannerdot"></span> '+
                '<span class="bannerdot"></span> '+
                '<span class="bannerdot"></span> '+
            '</div>',
            showCloseButton: true,
            showConfirmButton:false,
            //timer:9000,
            onClose: () => {
                //location.href = baseUrl+"/registro";
            },
            padding: '1em',
            background: '#fff',
            backdrop: `rgba(0,0,0,0.75)`,
            customClass:{
                title: 'alrtRegIni'
            }
        })
        showSlides();
    });
/**** ALERT ONBOARDING EMPRESA **** ALERT ONBOARDING EMPRESA **** ALERT ONBOARDING EMPRESA ****/
    $('#ingresoa').click(function() {
        Swal.fire({
            title: '<img src="'+baseRecursos+'/images/base/Claro360_Logo_Header_negro.png">',
            width: 900,
            html:'<div class="col-12 banner empresaa fade text-center">'+
                '<h1 style="">TU MUNDO MÁS SIMPLE, MÁS FÁCIL</h1>'+
                '<div class="col-12 contD">'+
                    '<span>Bienvenido a tu nuevo portal empresa: Administra tus actividades diarias y ponte en contacto con tu grupo de trabajo desde la única aplicación que hace de tus labores una tarea fácil e inteligente.</span>'+
                '</div>'+
            '</div>'+
            '<div class="col-12 banner empresab fade text-center">'+
                '<h1>TRABAJO <br> Entrada y Sálida</h1>'+
                '<div class="col-12 contD">'+
                    '<span>Comienza o termina tus jornadas puntualmente, mientras te mantienes visible para todo tu grupo de trabajo, activando o desactivando tu estatus laboral con solo ingresar a la aplicación.</span>'+
                '</div>'+
            '</div>'+
            '<div class="col-12 banner empresac fade text-center">'+
                '<h1>Comunicación</h1>'+
                '<div class="col-12 contD">'+
                    '<span>Mantente en contacto con todo el personal y equipo de trabajo fácilmente. <br> Realiza chats o videollamadas en tiempo real desde tu agenda o lista de contactos personalizada, crea grupos de trabajo o departamentos, todo con un solo clic y sin salir de la aplicación.</span>'+
                '</div>'+
            '</div>'+
            '<div class="col-12 banner empresad fade text-center">'+
                '<h1>Protocolos de Seguridad Sanitaria</h1>'+
                '<div class="col-12 contD">'+
                    '<span>Elabora el proceso que te permitirá conocer si tu centro de trabajo esta preparado para operar con las nuevas reglas, si cuentan con el Equipo de Protección Personal, capacitación, control en la distancia entre colaborades, el uso de mascarilla o en el seguimiento a distancia, esto y mucho más desde una consola de administración, nutrida por los datos recibidos de la app.</span>'+
                '</div>'+
            '</div>'+
            '<div class="col-12 bannerspn" style="text-align:center;height: 0px;top: -5px;">'+
                '<span class="bannerdot"></span>'+
                '<span class="bannerdot"></span> '+
                '<span class="bannerdot"></span> '+
                '<span class="bannerdot"></span> '+
            '</div>',
            showCloseButton: true,
            showConfirmButton:false,
            //timer:9000,
            onClose: () => {
                //location.href = baseUrl+"/registro";
            },
            padding: '1em',
            background: '#fff',
            backdrop: `rgba(0,0,0,0.75)`,
            customClass:{
                title: 'alrtRegIni'
            }
        })
        showSlides();
    });    
/**** ALERT ONBOARDING CORPORATIVO **** ALERT ONBOARDING CORPORATIVO **** ALERT ONBOARDING CORPORATIVO ****/
    $('#ingresox').click(function() {
        Swal.fire({
            title: '<img src="'+baseRecursos+'/images/base/Claro360_Logo_Header_negro.png">',
            width: 900,
            html:'<div class="col-12 banner corporativoa fade text-center">'+
                '<h1 style="">TU MUNDO MÁS SIMPLE, MÁS FÁCIL</h1>'+
                '<div class="col-12 contD">'+
                    '<span>Bienvenido a su nuevo portal empresa: Monitoree a sus instalaciones mediante herramientas de video y análisis, apoye con esto las nuevas reglas de sanidad requeridos para sus actividades y apoye a sus colaboraderes en el correcto uso de Equipo de Protección Personal con el que cuentan actualmente.</span>'+
                '</div>'+
            '</div>'+
            '<div class="col-12 banner corporativob fade text-center">'+
                '<h1>Comunicación</h1>'+
                '<div class="col-12 contD">'+
                    '<span>Cuenta con herramientas para recibir llamadas desde la app móvil de sus empleados, también intégrese a juntas y reuniones con sólo un clic desde su consola web y optimice el tiempo invertido en juntas laborales sin importar la distancia.</span>'+
                '</div>'+
            '</div>'+
            '<div class="col-12 banner corporativoc fade text-center">'+
                '<h1>Salud</h1>'+
                '<div class="col-12 contD">'+
                    '<span>Brinda y recibe consultas médicas directamente con nuestros profesionales registrados. Selecciona al Médico 360 de tu preferencia desde el catálogo, concreta la cita y en segundos podrás recibir la mejor atención de salud directamente a tu teléfono personal.</span>'+
                '</div>'+
            '</div>'+
            '<div class="col-12 banner corporativod fade text-center">'+
                '<h1>Seguridad Sanitaria en el Entorno Laboral</h1>'+
                '<div class="col-12 contD">'+
                    '<span>Cuente con las herramientas tecnológicas para la detección de contagios y recolecte información útil para sus propios protocolos sanitarios.</span>'+
                '</div>'+
            '</div>'+
            '<div class="col-12 bannerspn" style="text-align:center;height: 0px;top: -5px;">'+
                '<span class="bannerdot"></span>'+
                '<span class="bannerdot"></span> '+
                '<span class="bannerdot"></span> '+
                '<span class="bannerdot"></span> '+
            '</div>',
            showCloseButton: true,
            showConfirmButton:false,
            //timer:9000,
            onClose: () => {
                //location.href = baseUrl+"/registro";
            },
            padding: '1em',
            background: '#fff',
            backdrop: `rgba(0,0,0,0.75)`,
            customClass:{
                title: 'alrtRegIni'
            }
        })
        showSlides();
    });   
/**** ALERT ONBOARDING GOBIERNO **** ALERT ONBOARDING GOBIERNO **** ALERT ONBOARDING GOBIERNO ****/
    $('#registroz').click(function() {
        Swal.fire({
            title: '<img src="'+baseRecursos+'/images/base/Claro360_Logo_Header_negro.png">',
            width: 900,
            html:'<div class="col-12 banner gobiernoa fade text-center">'+
                '<h1 style="">Reporte Ciudadano</h1>'+
                '<div class="col-12 contD">'+
                    '<span>Brinde seguridad a la ciudadanía y atienda sus llamados de emergencia mediante la recepción de reportes de diversos siniestros y el envío de unidades especiales de atención en tiempo real.</span>'+
                '</div>'+
            '</div>'+
            '<div class="col-12 banner gobiernob fade text-center">'+
                '<h1>Programa Interno</h1>'+
                '<div class="col-12 contD">'+
                    '<span>Prevenga riesgos y proteja a los habitantes de su gestión con las herramientas de seguimiento a fenómenos perturbadores de los servicios de Protección Civil de su comunidad y los propios de forma simultánea.</span>'+
                '</div>'+
            '</div>'+
            '<div class="col-12 banner gobiernoc fade text-center">'+
                '<h1>Emergencias</h1>'+
                '<div class="col-12 contD">'+
                    '<span>Reciba y administre todos los llamados de emergencia durante su gestión y optimice el tiempo en el que se desplazan los elementos de atención durante los llamados gracias a los catálogos de Protección Civil.</span>'+
                '</div>'+
            '</div>'+
            '<div class="col-12 banner gobiernod fade text-center">'+
                '<h1>Seguridad Sanitaria en el Entorno Laboral</h1>'+
                '<div class="col-12 contD">'+
                    '<span>Cuente con las herramientas tecnológicas para la detección de contagios y recolecte información útil para sus propios protocolos sanitarios.</span>'+
                '</div>'+
            '</div>'+
            '<div class="col-12 bannerspn" style="text-align:center;height: 0px;top: -5px;">'+
                '<span class="bannerdot"></span>'+
                '<span class="bannerdot"></span> '+
                '<span class="bannerdot"></span> '+
                '<span class="bannerdot"></span> '+
            '</div>',
            showCloseButton: true,
            showConfirmButton:false,
            //timer:9000,
            onClose: () => {
                //location.href = baseUrl+"/registro";
            },
            padding: '1em',
            background: '#fff',
            backdrop: `rgba(0,0,0,0.75)`,
            customClass:{
                title: 'alrtRegIni'
            }
        })
        showSlides();
    });    
});