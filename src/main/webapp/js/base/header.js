/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function(){
    /*$('.segmentos').mouseover(function() {
        $('.servicios').addClass('d-none');
        $('.segmentos').removeClass('activo');
        $('#'+this.id).addClass('activo');
        document.getElementById("menuServicios").style.height="auto";
        document.getElementById("menuServicios").style.display="block";
        document.getElementById("ul"+this.id).classList.remove('d-none');
        setTimeout(function(){
            $('.servicios').addClass('d-none');
            $('.segmentos').removeClass('activo');
            document.getElementById("menuServicios").style.height="0px";
            document.getElementById("menuServicios").style.display="none";
        }, 10000);        
    });
    $('.segmentosV').mouseover(function() {
        $('.segmentos').removeClass('activo');
        document.getElementById("menuServicios").style.height="0px";
        document.getElementById("menuServicios").style.display="none";
    });
    $('.menuServicios').click(function() {
        $( '.servicios' ).addClass('d-none');
        $('.segmentos').removeClass('activo');
        document.getElementById("menuServicios").style.height="0px";
        document.getElementById("menuServicios").style.display="none";
    }); */
    
    $('#iconServ').click(function() {
        $('.servicios').addClass('d-none');
        $('.segmentos').removeClass('activo');
        //$('#'+this.id).addClass('activo');
        document.getElementById("menuServicios").style.height="auto";
        document.getElementById("menuServicios").style.display="block";
        document.getElementById("servicios").classList.remove('d-none');
        setTimeout(function(){
            $('.servicios').addClass('d-none');
            $('.segmentos').removeClass('activo');
            document.getElementById("menuServicios").style.height="0px";
            document.getElementById("menuServicios").style.display="none";
        }, 10000);
    });        
});