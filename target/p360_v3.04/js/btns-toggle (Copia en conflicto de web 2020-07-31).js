//Este archivo es para el funcionamiento de los botones del layoutBase
jQuery(document).ready(function ($) {

    const ventanaSesion = $('#ventanaSesion');
    const btnAbrir = $('#btn-abrir');
    const btnCerrar = $('#btn-cerrar');
    const btnMenuAbrir = $('#menuAbrir');
    const btnMenuCerrar = $('#menuCerrar');
    const contenidoMenu = $('#contenido');
    const btnChat = $('#chat-btn');
    const btnSoluciones = $('#soluciones-btn');
    const servicios = $('#submenu');
    const menuServicios = $('#menuServicios');
    const menuSeg = $('#btn-menuSeg');
    const menuResponsivo = $('#menuResponsivo');

    //Aqui siempre se mantiene oculto el boton de cerrar
    btnCerrar.hide();
    btnMenuCerrar.hide();

    //Botones para abrir y cerrar la ventana de congtacto y cierre de sesión
    btnAbrir.click(function () {
        ventanaSesion.addClass("cerrarAncho");
        btnAbrir.hide();
        btnCerrar.show();

        //Si la vetana de contacto esta activo esconde el sidebar solo en tamaño responsivo
        if (screen.width < 1200) {
            contenidoMenu.addClass("menuInactivo");
            btnMenuCerrar.hide();
            btnMenuAbrir.show();
        }
    });

    btnCerrar.click(function () {
        ventanaSesion.removeClass("cerrarAncho");
        btnCerrar.hide();
        btnAbrir.show();
    });



    //Botones para abrir y cerrar el contenido del sidebar en tamaño responsivo
    btnMenuAbrir.click(function () {
        btnMenuAbrir.hide();
        btnMenuCerrar.show();
        contenidoMenu.removeClass("menuInactivo").addClass("menuActive");

        //Si la el sidebar esta activo esconde la ventana de contacto solo en tamaño responsivo
        if (screen.width < 1200) {
            ventanaSesion.removeClass("cerrarAncho");
            //para cambiar los botones cuando se esconda la ventana de contacto
            if (btnCerrar.show()) {
                btnCerrar.hide();
                btnAbrir.show();
            }
        }
    });

    btnMenuCerrar.click(function () {
        btnMenuCerrar.hide();
        btnMenuAbrir.show();
        contenidoMenu.removeClass("menuActive").addClass("menuInactivo");
    });



    //Efecto del boton del chat
    btnChat.click(function () {
        btnSoluciones.toggleClass("solucionesActive");
    });


    //meu servicios
    servicios.click(function () {
        menuServicios.toggleClass('menuSerciciosActive');
        menuResponsivo.removeClass('menuResponsivoActive');
    });

    menuSeg.click(function () {
        menuResponsivo.toggleClass('menuResponsivoActive');
        menuServicios.removeClass('menuSerciciosActive');
    });
    
    

});




$(".segmentos").click(function(){
    console.log(this);
    $(".servicios").addClass("d-none");
    $("#menuServicios #"+ this.id).removeClass("d-none");
    $(".segmento").removeClass("persona");
    $(".segmento").removeClass("empresa");
    $(".segmento").removeClass("corporativo");
    $(".segmento").removeClass("gobierno");
    $(".segmento").addClass(this.id);
});