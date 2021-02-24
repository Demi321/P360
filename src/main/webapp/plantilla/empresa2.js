$(window).on("load", function () {
    $("#blockpage").removeClass("d-flex");
    $("#blockpage").addClass("d-none");
    var sidebar = $("#sidebar");
    $("#sidebar").remove();
    $("aside").append(sidebar);

    //Seccion para activar el drag de las categorias
    //$('#sidebar .accordion').attr("draggable","true");
    var dragSrcEl = null;

    function handleDragStart(e) {
        //Cerrar todos los acordeones
        $(".collapse_sidebar_cntr").removeClass("show");
        // Target (this) element is the source node.
        dragSrcEl = this.parentNode;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.parentNode.outerHTML);

        this.classList.add('dragElem');
    }
    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        this.parentNode.classList.add('over');

        e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

        return false;
    }

    function handleDragEnter(e) {
        // this / e.target is the current hover target.
    }

    function handleDragLeave(e) {
        this.parentNode.classList.remove('over');  // this / e.target is previous target element.
    }

    function handleDrop(e) {
        // this/e.target is current target element.

        if (e.stopPropagation) {
            e.stopPropagation(); // Stops some browsers from redirecting.
        }
        // Don't do anything if dropping the same column we're dragging.
        if (dragSrcEl != this.parentNode) {
            // Set the source column's HTML to the HTML of the column we dropped on.
            //alert(this.outerHTML);
            //dragSrcEl.innerHTML = this.innerHTML;
            //this.innerHTML = e.dataTransfer.getData('text/html');
            this.parentNode.parentNode.removeChild(dragSrcEl);
            var dropHTML = e.dataTransfer.getData('text/html');
            this.parentNode.insertAdjacentHTML('beforebegin', dropHTML);
            var dropElem = this.parentNode.previousSibling.firstChild;

            addDnDHandlers(dropElem);

        }
        this.parentNode.classList.remove('over');
        return false;
    }

    function handleDragEnd(e) {
        // this/e.target is the source node.
        this.parentNode.classList.remove('over');

        /*[].forEach.call(cols, function (col) {
         col.classList.remove('over');
         });*/
    }

    function addDnDHandlers(elem) {
        elem.addEventListener('dragstart', handleDragStart, false);
        elem.addEventListener('dragenter', handleDragEnter, false)
        elem.addEventListener('dragover', handleDragOver, false);
        elem.addEventListener('dragleave', handleDragLeave, false);
        elem.addEventListener('drop', handleDrop, false);
        elem.addEventListener('dragend', handleDragEnd, false);

    }

    var cols = document.querySelectorAll('#sidebar div.collapse_sidebar');
    [].forEach.call(cols, addDnDHandlers);


    //inicializar mapas
    //initMaps();

    //grafica de home de empleado ***********
    if ($("#menu_section_HomeEmpleado").length) {
        $("#menu_section_HomeEmpleado").click(() => {
            console.log("bingo:onload");
            chart_productividad();
        });
        chart_productividad();
    }
    $(".modulo_menu")[0].click();

//    if ($("#menu_section_EstadísticaGlobal").length) {
//        $("#menu_section_EstadísticaGlobal").click(() => {
//            piechart1();
//            piechart2();
//            piechart3();
//            line_chart_sintomas();
//            chart_barras();
//            chart_aislamiento1();
//            chart_aislamiento2();
//            chart_aislamiento3();
//            chart_aislamiento4();
//            chart_aislamiento5();
//        });
//        piechart1();
//        piechart2();
//        piechart3();
//        line_chart_sintomas();
//        chart_barras();
//        chart_aislamiento1();
//        chart_aislamiento2();
//        chart_aislamiento3();
//        chart_aislamiento4();
//        chart_aislamiento5();
//    }
//    

//Solucion a la parte responsiva
    showToggle();//

    //revisar si aun bno se han cargado sucursales 
    if (!sucursales_usuario.length) {
        console.log("redirigir a colaboradores")
        swal.fire({
            title: "Bienvenido a tu plataforma empresarial",
            text: "Comienza registrado una sucursal.",
            confirmButtonText: "Ir",
            allowOutsideClick: false
        }).then((result) => {
            console.log(result)
            if (!$("#collapseConfiguración").hasClass("show")) {
                $("#headingConfiguración a").click();
            }
            $("#menu_section_RegistrarSucursal").click();
        });
    } else
    // revisar si aun no se han registrado usuarios nuevos     
    if (!directorio_usuario.length) {
        console.log("redirigir a colaboradores")
        swal.fire({
            title: "Bienvenido a tu plataforma empresarial",
            text: "Muy bien, ya cuentas con: "+ sucursales_usuario.length +" "+ (sucursales_usuario.length === 1 ? " sucursal registrada" : " sucursales registradas")+". ¡Ahora continua invitando a tus colaboradores!...",
            confirmButtonText: "Ir",
            allowOutsideClick: false
        }).then((result) => {
            console.log(result)
            if (!$("#collapseRecursosHumanos").hasClass("show")) {
                $("#headingRecursosHumanos a").click();
            }
            $("#menu_section_PlantillaLaboral").click();
        });
    }
});


//Calculo de edad del directorio_usuario
for (var i = 0; i < directorio_usuario.length; i++) {
    let usr = directorio_usuario[i];
    if (usr.fecha_nacimiento !== null && usr.fecha_nacimiento !== "" && usr.fecha_nacimiento !== undefined) {
        fecha = usr.fecha_nacimiento;
        var hoy = new Date();
        var cumpleanos = new Date(fecha);
        var edad = hoy.getFullYear() - cumpleanos.getFullYear();
        var m = hoy.getMonth() - cumpleanos.getMonth();

        if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
            edad--;
        }
        directorio_usuario[i].edad = edad;
    } else {
        directorio_usuario[i].edad = null;
    }
}

//Homologacion para las etiquetas de Sexo
for (var i = 0; i < directorio_usuario.length; i++) {
    let usr = directorio_usuario[i];
    if (usr.genero !== null && usr.genero !== "" && usr.genero !== undefined) {
        if (usr.genero === "Masculino" || usr.genero === "masculino" || usr.genero === "m" || usr.genero === "M") {
            directorio_usuario[i].genero = "Hombre";
        }
        if (usr.genero.includes("f") || usr.genero.includes("F")) {
            directorio_usuario[i].genero = "Mujer";
        }
        if (usr.genero === "Selecciona") {
            directorio_usuario[i].genero = null;
        }
    } else {
        directorio_usuario[i].genero = null;
    }
}