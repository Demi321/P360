/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(window).on("load", function () {
    console.log("loaded");
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

    $('#iconServ').click(function () {
        $('.servicios').addClass('d-none');
        $('.segmentos').removeClass('activo');
        //$('#'+this.id).addClass('activo');
//        document.getElementById("menuServicios").style.height = "auto";
//        document.getElementById("menuServicios").style.display = "block";
        $("#menuServicios").toggleClass("show_servicios");
//        document.getElementById("servicios").classList.remove('d-none');
//        setTimeout(function () {
//            $('.servicios').addClass('d-none');
//            $('.segmentos').removeClass('activo');
//            document.getElementById("menuServicios").style.height = "0px";
//            document.getElementById("menuServicios").style.display = "none";
//        }, 10000);
    });


    $(document).click((e) => {
        if (e.target.id !== "servicios" && e.target.id !== "iconServ" && e.target.nodeName !== "path" && e.target.nodeName !== "svg" && e.target.className !== "expand_menu" && e.target.className !== "expanded_menu") {
            $("#menuServicios").removeClass("show_servicios");
        } else {
            $("#cbmenuToggle").prop("checked", false);
        }

        if (e.target.className === "expand_menu") {
            $(".expand_menu").addClass("d-none");
            $("#servicios_grid").css({
                "max-height": "calc(100%)"
            });
            $("#menuServicios").css({
                "max-height": "calc(100% - 90px)"
            });
        }
        if (e.target.className === "expanded_menu") {
            $(".expand_menu").removeClass("d-none");
            $("#servicios_grid").removeAttr("style")
            $("#menuServicios").removeAttr("style")
            document.getElementById("servicios_grid").scrollIntoView();
        }
    });
    //var sesion_cookie = JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA));
    console.log(sesion_cookie);
    if (sesion_cookie === "") {

        $("#logo360").click(() => {
            acceso_externo("https://claro360.com/plataforma360/");
        });
        $("#hdrinicio").click(() => {
            acceso_externo("https://claro360.com/plataforma360/");
        });
        $("#hdrpersona").click(() => {
            personalizar_header("persona");
            //acceso_externo("https://claro360.com/");
        });
        $("#hdrempresa").click(() => {
            personalizar_header("empresa");
            acceso_externo("https://claro360.com/");
        });
        $("#hdrcorporativo").click(() => {
            personalizar_header("corporativo");
            acceso_externo("https://claro360.com/");
        });
        $("#hdrgobierno").click(() => {
            personalizar_header("gobierno");
            acceso_externo("https://claro360.com/");
        });
        $("#hdrstore").click(() => {
            acceso_externo("https://claro360.com/");
        });

    } else {
        $("#logo360").click(() => {
            acceso_externo("https://claro360.com/plataforma360/");
        });
        $("#hdrinicio").click(() => {
            acceso_externo_ruta("https://claro360.com/plataforma360/", "home");
        });
        $("#hdrpersona").click(() => {
            acceso_externo_ruta("https://claro360.com/plataforma360/", "persona");
            //acceso_externo("https://claro360.com/");
        });
        $("#hdrempresa").click(() => {
            acceso_externo_ruta("https://claro360.com/plataforma360/", "empresa");
            //acceso_externo("https://claro360.com/");
        });
        $("#hdrcorporativo").click(() => {
            acceso_externo_ruta("https://claro360.com/plataforma360/", "corporativo");
            //acceso_externo("https://claro360.com/");
        });
        $("#hdrgobierno").click(() => {
            acceso_externo_ruta("https://claro360.com/plataforma360/", "gobierno");
            //acceso_externo("https://claro360.com/");
        });
        $("#hdrstore").click(() => {
            acceso_externo_ruta("https://claro360.com/plataforma360/", "app");
        });
        /*Cambios fernando*/
        if (sesion_cookie.gc) {
            if (sesion_cookie.gc.toString() === "1") {
                $("#logo360").removeClass("d-none");
                $("#logo360").css({
                    "background-image": "url('" + sesion_cookie.logotipo_empresa + "')"
                });
            } else {
                $("#logo360").removeClass("d-none");
            }
        } else {
            $("#logo360").removeClass("d-none");
        }
        /******************/
    }


});

