/* 
 *  Document   : Toggle Effect
 *  Created on : 26 jul 2019, 16:25:53
 *  Author     : Moises Juárez
 */
var position;
if (/Android|webOS|iPhone|iPad|BackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log("device");
    readDeviceOrientation();
    showToggle();
    window.onorientationchange = readDeviceOrientation;

} else {
    console.log("pc");
    position = screen.orientation.type;
    showToggle();


    window.onorientationchange = function () {
        console.log("onorientationchange");
        if (screen.orientation.type !== position)
        {
            position = screen.orientation.type;
            console.log(position);
            showToggle();

        }
    };


    window.onresize = function () {
        console.log("onresize");
        if (screen.orientation.type !== position)
        {
            position = screen.orientation.type;
            console.log(position);
            showToggle();

        }
    };
}

$('#cbmenuToggle').change(function () {
    if ($("#toggle").parent().hasClass("toggleactive")) {
        $("#toggle").parent().removeClass("toggleactive");
    }
});

$("#toggle").click(function () {
    $("#cbmenuToggle").prop("checked", false);
    $("#toggle").parent().css("transition", "0.6s");
    if ($("#toggle").parent().hasClass("toggleactive")) {
        $("#toggle").parent().removeClass("toggleactive");
    } else if ($("#toggle").hasClass("toggleActive")) {
        $("#toggle").parent().addClass("toggleactive");
    }
});



function showToggle() {
    $("aside").removeClass("aside_compressed");
        $("section").removeClass("section_compressed");
        $("#toggle span").removeClass("compressed");
        $("#sidebar .menu_sidebar").removeClass("compressed");
    $("body aside").css("transition", "unset");
    console.log(position);
    if (position.includes("portrait")) {
        $("#toggle i").addClass("d-none");
        $("#toggle svg").addClass("d-none");
        $("body aside").css({
            "height": "50px",
            "width": "100%",
            "bottom": "30px",
            "top": "unset",
            "transform": "none"
        });
        $("body section").css({
            "height": "calc( 100% - 140px)",
            "width": "100%",
            "top": "60px",
            "left": "0"
        });
        $("#toggle").addClass("toggleActive");
        if ($("body section").hasClass("modificador_modal_superior_body")) {
            $("body section").css({
                "height": "calc( 100% - 240px)",
                "width": "100%",
                "top": "60px",
                "left": "0"
            });
        }

    }
    if (position.includes("landscape")) {
        $("#toggle i").removeClass("d-none");
        $("#toggle svg").removeClass("d-none");
        if ($("body aside").hasClass("toggleactive")) {
            $("body aside").removeClass("toggleactive")
        }
        $("body aside").removeAttr("style");
        $("body section").removeAttr("style");
        $("#toggle").removeAttr("style");
        $("#toggle").removeClass("toggleActive");
    }

}

function readDeviceOrientation() {
    console.log("readDeviceOrientation");

    if (screen.orientation !== undefined) {
        position = screen.orientation.type;
        console.log(position);
        showToggle();
    } else {
        if (Math.abs(window.orientation) === 90) {
            // Landscape
            position = "landscape";
        } else {
            // Portrait
            position = "portrait";
        }
        showToggle();
    }
}

function onKeyboardOnOff(isOpen, $obj) {
    console.log(isOpen);
    // Write down your handling code
    if (isOpen) {
        $obj[0].scrollIntoView(false);
        // keyboard is open
        console.log("Keyboard OPEN");
        document.querySelector('footer').style.display = 'none';
        document.querySelector('aside').style.display = 'none';
        document.querySelector('section').style = "height: calc(100% - 60px); width: 100%; top: 60px; left: 0px;";

    } else {

        document.querySelector('footer').style.display = 'unset';
        document.querySelector('aside').style.display = 'unset';
        document.querySelector('section').style = "height: calc(100% - 140px); width: 100%; top: 60px; left: 0px;";

        // keyboard is closed
        console.log("Keyboard CLOSE");
    }
}

$("section").on('focus blur', 'select, textarea, input[type=text], input[type=date], input[type=password], input[type=email], input[type=number]', function (e) {
    var $obj = $(this);
//    console.log($obj);
    var nowWithKeyboard = (e.type === 'focusin');
    if (position.includes("portrait")) {
        onKeyboardOnOff(nowWithKeyboard, $obj);
    }
});
$("section").on('focusout', 'select, textarea, input[type=text], input[type=date], input[type=password], input[type=email], input[type=number]', function (e) {
    var $obj = $(this);
    //console.log($obj);
    var nowWithKeyboard = (e.type === 'focusin');
    if (position.includes("portrait")) {
        onKeyboardOnOff(nowWithKeyboard, $obj);
    }
});

$(() => {
    $("#toggle div").click(() => {
        console.log("clicked");
        $("aside").toggleClass("aside_compressed");
        $("section").toggleClass("section_compressed");
        $("#toggle span").toggleClass("compressed");
        $("#sidebar .menu_sidebar").toggleClass("compressed");
        
        /*Parche el pirata*/
        if (window.location.href.includes("Llamada")) {
            $("#sidebar").toggleClass("d-none");
            $("#directorio").toggleClass("position-relative");
            $("#toggle").toggleClass("height-fit-content");
        }
        /******************/
        /*        aside {
         display: none;
         }
         section{
         width: 100%;
         left: 0%;
         height: calc( 100% - 90px) !important;
         transition: none;
         }*/
    });
});