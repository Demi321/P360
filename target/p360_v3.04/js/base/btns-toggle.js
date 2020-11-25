jQuery(document).ready(function ($) {

    const ventanaSesion = $('#ventanaSesion');
    const btnAbrir = $('#btn-abrir');
    const btnCerrar = $('#btn-cerrar');
    const servicios = $('#submenu');
    const menuServicios = $('#menuServicios');
    const menuSeg = $('#btn-menuSeg');
    const menuResponsivo = $('#menuResponsivo');
    const body = $('body');


    //Aqui siempre se mantiene oculto el boton de cerrar
    btnCerrar.hide();

    //Botones para abrir y cerrar la ventana de congtacto y cierre de sesión
    btnAbrir.click(function () {
        ventanaSesion.addClass("cerrarAncho");
        btnAbrir.hide();
        btnCerrar.show();
    });

    btnCerrar.click(function () {
        ventanaSesion.removeClass("cerrarAncho");
        btnCerrar.hide();
        btnAbrir.show();
    });

    servicios.click(function () {
        menuServicios.toggleClass('menuSerciciosActive');
        menuResponsivo.removeClass('menuResponsivoActive');
    });

    menuSeg.click(function () {
        menuResponsivo.toggleClass('menuResponsivoActive');
        menuServicios.removeClass('menuSerciciosActive');
    });
    
    menuSeg.click(function () {
        menuSeg.toggleClass('toggleActive');
        //menuSeg.removeClass('menuSerciciosActive');
    });
    
    $(function(){ 
        $(document).ready(function(){ 
            $('.collapse').on('show.bs.collapse',function(){
                    $('.collapse.show').collapse('toggle');
                    //console.log('ACTIVA#p'+this.id);
                    $('#p'+this.id).addClass("toggleActiveS");
            });
            $('.collapse').on('hide.bs.collapse',function(){
                    //$('.collapse').collapse('toggle');
                    //console.log('DESACT#p'+this.id);
                    $('#p'+this.id).removeClass("toggleActiveS");
            });
        });

    });
});



$(".segmentos").click(function () {
    //console.log(this);
    $(".servicios").addClass("d-none");
    $("#menuServicios #" + this.id).removeClass("d-none");
    $(".segmento").removeClass("persona");
    $(".segmento").removeClass("empresa");
    $(".segmento").removeClass("corporativo");
    $(".segmento").removeClass("gobierno");
    $(".segmento").addClass(this.id);

});
personalizar_header();
function personalizar_header() {
    let segmento = window.location.href.split("/");
    segmento = segmento[segmento.length - 1];
    segmento = segmento.split("#");
    segmento = segmento[0];
    $(".segmento").addClass(segmento);
}
