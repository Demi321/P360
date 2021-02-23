/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global jornada_usuario, perfil_usuario */
let clock = () => {
    let date = new Date();
    let hrs = date.getHours();
    let mins = date.getMinutes();
    let secs = date.getSeconds();
    let period = "AM";
    if (hrs === 0) {
        hrs = 12;
    } else if (hrs > 12) {
        hrs = hrs - 12;
        period = "PM";
    } else if (hrs === 12) {
        period = "PM";
    }
    hrs = hrs < 10 ? "0" + hrs : hrs;
    mins = mins < 10 ? "0" + mins : mins;
    secs = secs < 10 ? "0" + secs : secs;

    let time = `${hrs}:${mins}:${secs}:${period}`;
    document.getElementById("clock").innerText = time;
    setTimeout(clock, 1000);
};

let vue_contactos = (directorio) => {
    console.log(directorio);
    //eliminar al usuario del directorio 
    for (var i = 0; i < directorio.length; i++) {
        if (directorio[i].id360 === directorio.id_usuario) {
            directorio.splice(i,1);
        }
    }
    for (var i = 0; i < directorio.length; i++) {
        card_contacto(directorio[i]);

    }

    new Vue({
        el: "#directorio_contactos",
        components: {
            Multiselect: window.VueMultiselect.default
        },
        data() {
            return {
                value: [],
                options: directorio
            };
        },
        methods: {
            customLabel(option) {
                return option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno + " ";
            },
            onClosed(value) {
                //console.log(value);

            },

            onTag(value) {
                //console.log(value);
            },

            onRemove(value) {
                //console.log(value);
            },

            onInput(value) {
                if (value !== null) {

                    document.getElementsByClassName("home_empleado")[0].scrollIntoView();
                    document.getElementById("menu_sidebar" + value.id360).scrollIntoView();
                }
            },
            onOpen(value) {
                this.value = null;
            }
        }
    });
};

let card_contacto = (contacto) => {
    if (contacto.id360.toString() !== sesion_cookie.id_usuario.toString()) {
        //El collapse re enviara cuando deseemos enviar el menu dentro de un contenedor 
        let root = "cards_contactos";
        if (contacto.tipo_area !== null && contacto.tipo_area !== "" && contacto.tipo_area !== undefined) {
            //comprobar que exista el collapse
            if (!$("#accordion_directorio" + contacto.tipo_area.replace(/\s/g, "")).length) {
                {
                    //en caso de que no exista lo agregamos
                    let acordion = $('<div class="accordion w-100" id="accordion_directorio' + contacto.tipo_area.replace(/\s/g, "") + '"></div>');
                    let heading = $('<div class="collapse_sidebar shadow-none btn p-0" id="heading_directorio_' + contacto.tipo_area.replace(/\s/g, "") + '"></div>');
                    let collapse_a = $('<a class="collapse_sidebar shadow-none btn collapsedXO" data-toggle="collapseXO" data-target="#collapse_directorio_' + contacto.tipo_area.replace(/\s/g, "") + '" aria-expanded="false" aria-controls="collapse_directorio_' + contacto.tipo_area.replace(/\s/g, "") + '">' + contacto.area + '<i class="fas fa-caret-down"></i></a>').addClass("collapse_sidebar shadow-none btn collapsedXO");
                    heading.append(collapse_a);
                    acordion.append(heading);

                    let collapse_container = $('<div id="collapse_directorio_' + contacto.tipo_area.replace(/\s/g, "") + '" class="collapse_sidebar_cntr collapseXO" aria-labelledby="heading_directorio_' + contacto.tipo_area.replace(/\s/g, "") + '" data-parent="#accordion_directorio' + contacto.tipo_area.replace(/\s/g, "") + '"></div>');
                    acordion.append(collapse_container);
                    $("#" + root).append(acordion);
                }
            }
            root = "collapse_directorio_" + contacto.tipo_area.replace(/\s/g, "");
        }
        let contenedor = document.createElement("div");
        contenedor.className = "menu_sidebar";
        contenedor.id = "menu_sidebar" + contacto.id360;
        let estatus = document.createElement("div");
        if (contacto.en_jornada === "1") {
            estatus.className = "activo";
        } else {
            estatus.className = "inactivo";
        }
        contenedor.appendChild(estatus);
        let div = document.createElement("div");
        div.className = "d-flex align-items-center";
        let img = document.createElement("div");
        if (contacto.img === undefined || contacto.img === null || contacto.img === "") {
            contacto.img = "https://bucketmoviles121652-dev.s3.amazonaws.com/public/MobileCard/perfil.png";
        }
        img.style = "height: 30px;width: 30px;margin-right: 10px;padding:15px;border-radius: 30px;background-image:url('" + contacto.img + "'); background-size: cover;  background-repeat: no-repeat;  background-position: center;";
        let nombre = document.createElement("div");
        nombre.innerHTML = contacto.nombre + " " + contacto.apellido_paterno + " " + contacto.apellido_materno;
        nombre.style = "font: bold 0.9rem Arial;color: #495057;";
        let puesto = document.createElement("div");
        puesto.innerHTML = contacto.puesto;
        puesto.style = "font: 0.75rem Arial;color: #5b636b;";
        let info = document.createElement("div");
        info.className = "d-inline";
        div.appendChild(img);
        info.appendChild(nombre);
        info.appendChild(puesto);
        div.appendChild(info);
        let actions = document.createElement("div");
        actions.className = "p-1 pt-2 directorio_home_empleado d-none ";
        let video = document.createElement("div");
        video.innerHTML = '<i class="fas fa-video"></i>';
        video.className = "action_button";
        video.title = "Iniciar una videollamada con: " + contacto.nombre + " " + contacto.apellido_paterno + " " + contacto.apellido_materno;
        let audio = document.createElement("div");
        audio.innerHTML = '<i class="fas fa-phone-alt"></i>';
        audio.className = "action_button";
        audio.title = "Iniciar una llamada con: " + contacto.nombre + " " + contacto.apellido_paterno + " " + contacto.apellido_materno;

        let chat = document.createElement("div");
        chat.innerHTML = '<i class="fas fa-comment-alt"></i>';
        chat.className = "action_button";
        chat.title = "Iniciar una conversación con: " + contacto.nombre + " " + contacto.apellido_paterno + " " + contacto.apellido_materno;

        actions.appendChild(video);
        actions.appendChild(audio);
        actions.appendChild(chat);

        contenedor.appendChild(div);
        contenedor.appendChild(actions);
        div.id = "menu_section_directorio_" + contacto.tipo_area.replace(/\s/g, "");
        $("#" + root).append(contenedor);
        div.addEventListener("click", () => {
            $(".directorio_home_empleado").removeClass("d-flex");
            $(".directorio_home_empleado").addClass("d-none");
            actions.className = "p-1 pt-2 d-flex directorio_home_empleado";
        });
        let div2 = document.createElement("div");
        div2.className = "modulo_section d-none";
        div2.id = "modulo_section_directorio_" + contacto.tipo_area;//quitale los espacios si llegara a tener 
//            div2.innerHTML = nombre;

        $("#contenidoSection").append(div2);
    } else {
        console.warn("No se colocao la card por pertenecer al mismo usuario.")
    }
};

function analog_clock() {
    var weekday = new Array(7),
            d = new Date(),
            h = d.getHours(),
            m = d.getMinutes(),
            s = d.getSeconds(),
            date = d.getDate(),
            month = d.getMonth() + 1,
            year = d.getFullYear(),
            hDeg = h * 30 + m * (360 / 720),
            mDeg = m * 6 + s * (360 / 3600),
            sDeg = s * 6,
            hEl = document.querySelector('.hour-hand'),
            mEl = document.querySelector('.minute-hand'),
            sEl = document.querySelector('.second-hand'),
            dateEl = document.querySelector('.date'),
            dayEl = document.querySelector('.day');

    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var day = weekday[d.getDay()];

    if (month < 9) {
        month = "0" + month;
    }

    hEl.style.transform = "rotate(" + hDeg + "deg)";
    mEl.style.transform = "rotate(" + mDeg + "deg)";
    sEl.style.transform = "rotate(" + sDeg + "deg)";
//  dateEl.innerHTML = date+"/"+month+"/"+year;
//  dayEl.innerHTML = day;


}
function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}
function getFriday(d) {
    d = new Date(d);
    var day = d.getDay(), diff = d.getDate() - day + (5); // adjust when day is sunday
    return new Date(d.setDate(diff));
}
//Reportes

let reporte_trabajo = (b) => {
    let contenedor = $("<div></div>").addClass("row col-12 m-0 p-1 reporte");
    let titulo = $("<div>Reporte de Trabajo</div>").addClass("col-12 p-0 text-white titulo");
    let icono = $('<div></div>').addClass("col-4 p-0 text-white icono");
    icono.css({
        "background-image": "url(https://empresas.claro360.com/p360_v4_dev_moises/SVG/reporte_trabajo.svg)",
        "background-size": "contain",
        "background-position": "center",
        "background-repeat": "no-repeat"
    });
    let info = $("<div></div>").addClass("col-8 p-0 text-white info");
    contenedor.append(titulo);
    contenedor.append(icono);
    if (b) {
        contenedor.addClass("bg-success");
        let icon = $('<div><i class="fas fa-check-circle"></i></div>').addClass("col-12 p-0 text-white icon");
        let nota = $("<div>Realizado</div>").addClass("col-12 p-0 text-white nota");
        let blank = $("<div></div>").addClass("col-12 p-0");
        info.append(icon);
        info.append(nota);
        info.append(blank);
        contenedor.append(info);
    } else {
        let icon = $('<div><i class="fas fa-times-circle"></i></div>').addClass("col-12 p-0 text-danger icon");
        let nota = $("<div>Sin realizar</div>").addClass("col-12 p-0 text-danger nota");
        let btn = $('<button type="button" class="btn btn-danger col-12 p-0">Realizar reporte</button>');
        btn.click(() => {
            //menu_section_ReportedeActividades
            if ($("#menu_section_ReporteActividades").length) {
                $("#menu_section_ReporteActividades").click();
            }
        });

        info.append(icon);
        info.append(nota);
        contenedor.append(info);
        contenedor.append(btn);
    }
    contenedor.click(() => {
        //menu_section_ReportedeActividades
        if ($("#menu_section_ReporteActividades").length) {
            $("#menu_section_ReporteActividades").click();
        }
    });


    $("#reporte1").append(contenedor);
};

let reporte_sintomas = (b) => {
    let contenedor = $("<div></div>").addClass("row col-12 m-0 p-1 reporte");
    let titulo = $("<div>Reporte de Síntomas</div>").addClass("col-12 p-0 text-white titulo");
    let icono = $('<div></div>').addClass("col-4 p-0 text-white icono");
    icono.css({
        "background-image": "url(https://empresas.claro360.com/p360_v4_dev_moises/SVG/reporte_sintomas.svg)",
        "background-size": "contain",
        "background-position": "center",
        "background-repeat": "no-repeat"
    });
    let info = $("<div></div>").addClass("col-8 p-0 text-white info");
    contenedor.append(titulo);
    contenedor.append(icono);
    if (b) {
        contenedor.addClass("bg-success");
        let icon = $('<div><i class="fas fa-check-circle"></i></div>').addClass("col-12 p-0 text-white icon");
        let nota = $("<div>Realizado</div>").addClass("col-12 p-0 text-white nota");
        let blank = $("<div></div>").addClass("col-12 p-0");
        blank.css({
            height: "20px"
        });
        info.append(icon);
        info.append(nota);
        info.append(blank);
        contenedor.append(info);
    } else {
        let icon = $('<div><i class="fas fa-times-circle"></i></div>').addClass("col-12 p-0 text-danger icon");
        let nota = $("<div>Sin realizar</div>").addClass("col-12 p-0 text-danger nota");
        let btn = $('<button type="button" class="btn btn-danger col-12 p-0">Realizar reporte</button>');
        btn.click(() => {
            //menu_section_ReportedeActividades
            if ($("#menu_section_ReporteSintomas").length) {
                $("#menu_section_ReporteSintomas").click();
            }
        });

        info.append(icon);
        info.append(nota);
        contenedor.append(info);
        contenedor.append(btn);
    }
    contenedor.click(() => {
        //menu_section_ReportedeActividades
        if ($("#menu_section_ReporteSintomas").length) {
            $("#menu_section_ReporteSintomas").click();
        }
    });

    $("#reporte2").append(contenedor);
};

let reporte_proteccion_personal = (b) => {
    let contenedor = $("<div></div>").addClass("row col-12 m-0 p-1 reporte");
    let titulo = $("<div>Equipo de Protección Personal</div>").addClass("col-12 p-0 text-white titulo");
    let icono = $('<div></div>').addClass("col-4 p-0 text-white icono");
    icono.css({
        "background-image": "url(https://empresas.claro360.com/p360_v4_dev_moises/SVG/equipo_proteccion_personal.svg)",
        "background-size": "contain",
        "background-position": "center",
        "background-repeat": "no-repeat"
    });
    let info = $("<div></div>").addClass("col-8 p-0 text-white info");
    contenedor.append(titulo);
    contenedor.append(icono);
    if (b) {
        contenedor.addClass("bg-success");
        let icon = $('<div><i class="fas fa-check-circle"></i></div>').addClass("col-12 p-0 text-white icon");
        let nota = $("<div>Realizado</div>").addClass("col-12 p-0 text-white nota");
        let blank = $("<div></div>").addClass("col-12 p-0");
        blank.css({
            height: "20px"
        });
        info.append(icon);
        info.append(nota);
        info.append(blank);
        contenedor.append(info);
    } else {
        contenedor.addClass("bg-warning");
        let icon = $('<div><i class="fas fa-exclamation-circle"></i></div>').addClass("col-12 p-0 text-white icon");
        let nota = $("<div>Alerta</div>").addClass("col-12 p-0 text-white nota");
        let blank = $("<div></div>").addClass("col-12 p-0");
//        let btn = $('<button type="button" class="btn btn-danger col-12 p-0">Realizar reporte</button>');
        blank.css({
            height: "20px"
        });
        info.append(icon);
        info.append(nota);
        info.append(blank);
        contenedor.append(info);
//        contenedor.append(btn);
    }
    contenedor.click(() => {
        //menu_section_ReportedeActividades
        if ($("#menu_section_ReporteProteccionPersonal").length) {
            $("#menu_section_ReporteProteccionPersonal").click();
        }
    });


    $("#reporte3").append(contenedor);
};

let reporte_seguridad_sanitaria = (b) => {
    let contenedor = $("<div></div>").addClass("row col-12 m-0 p-1 reporte");
    let titulo = $("<div>Reporte de Seguridad Sanitaria</div>").addClass("col-12 p-0 text-white titulo");
    let icono = $('<div></div>').addClass("col-4 p-0 text-white icono");
    icono.css({
        "background-image": "url(https://empresas.claro360.com/p360_v4_dev_moises/SVG/reporte_seguridad_sanitaria.svg)",
        "background-size": "contain",
        "background-position": "center",
        "background-repeat": "no-repeat"
    });
    let info = $("<div></div>").addClass("col-8 p-0 text-white info");
    contenedor.append(titulo);
    contenedor.append(icono);
    if (b) {
        contenedor.addClass("bg-success");
        let icon = $('<div><i class="fas fa-check-circle"></i></div>').addClass("col-12 p-0 text-white icon");
        let nota = $("<div>Realizado</div>").addClass("col-12 p-0 text-white nota");
        let blank = $("<div></div>").addClass("col-12 p-0");
        blank.css({
            height: "20px"
        });
        info.append(icon);
        info.append(nota);
        info.append(blank);
        contenedor.append(info);
    } else {
        let icon = $('<div><i class="fas fa-times-circle"></i></div>').addClass("col-12 p-0 text-danger icon");
        let nota = $("<div>Sin realizar</div>").addClass("col-12 p-0 text-danger nota");
        let btn = $('<button type="button" class="btn btn-danger col-12 p-0">Realizar reporte</button>');
        btn.click(() => {
            //menu_section_ReportedeActividades
            if ($("#menu_section_ReporteSeguridadSanitaria").length) {
                $("#menu_section_ReporteSeguridadSanitaria").click();
            }
        });
        info.append(icon);
        info.append(nota);
        contenedor.append(info);
        contenedor.append(btn);
    }
    contenedor.click(() => {
        //menu_section_ReportedeActividades
        if ($("#menu_section_ReporteSeguridadSanitaria").length) {
            $("#menu_section_ReporteSeguridadSanitaria").click();
        }
    });

    $("#reporte4").append(contenedor);
};

//reporte_trabajo(false);
//reporte_sintomas(true);
//reporte_proteccion_personal(false);
//reporte_seguridad_sanitaria(false);
const FunClima = (variable_municipio) => {
    try {


        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + variable_municipio + "&appid=fbc6b3bdbb075a992d5f2d897ac46294&units=metric")
                .then(response => response.json())
                .then(data => obj = data)
                .then(() => {
                    if (obj.main) {

                        console.log(obj)
                        ClimaAPI = obj.main.temp;
                        Imagen = obj.weather[0].icon;
                        Clima = $(".clima");
                        ImagenUrl = "https://openweathermap.org/img/w/" + Imagen + ".png";
                        let img = $("<img src=\"" + ImagenUrl + "\"></img>");
                        let t = $("<span>" + ClimaAPI + "°</span>");
                        t.css({
                            "font": "bold 2rem Arial",
                            "color": "#666"
                        });
                        Clima.append(img);
                        Clima.append(t);
                        //ImgClima = document.getElementById("clima_icon").src = ImagenUrl;
                        //Clima.innerHTML = ClimaAPI+"°";
                    }
                });

    } catch (e) {
        console.warn(e);
    }
}
google.load("visualization", "1", {packages: ["corechart"]});

google.setOnLoadCallback(chart_productividad);
let chart_productividad_active = false;
function chart_productividad() {
    $("#home_empleado_productividad_porcentaje").text(rendimiento_usuario);
    rendimiento_usuario = parseFloat(rendimiento_usuario);
    var p = rendimiento_usuario !== null ? rendimiento_usuario : 100;
    var f = rendimiento_usuario !== null ? 100 - rendimiento_usuario : 0;

    f = f < 0 ? 0 : f;
    var data = google.visualization.arrayToDataTable([
        ['Content', 'Size'],
        ['Photos', p],
        ['Free Space', f]
    ]);

    var options = {

        chartArea: {
            "backgroundColor": "none",
            "fill": "none",
            width: '100%',
            height: '100%'
        },
        backgroundColor: "none",
        "fill": "none",
        pieHole: 0.8,
        pieSliceBorderColor: "none",
        colors: ['#8bc34a', '#eaeaea'],
        legend: {
            position: "none"
        },
        pieSliceText: "none",
        tooltip: {
            trigger: "none"
        },
        width: '100%',
        height: '100%'
    };

    var chart = new google.visualization
            .PieChart(document.getElementById('chart_productividad'));
    console.log("Colocando grafica");
    chart.draw(data, options);
}
var rendimiento_usuario = null;
const init_home_empleado = (json) => {
    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;
//colocar imagen del usuario 
    $("#home_empleado_img").css({
        "background-image": "url(" + perfil_usuario.img + ")",
        "background-size": "contain",
        "background-position": "center",
        "background-repeat": "no-repeat"
    });

    if (jornada_usuario.success) {
        $("#hora_entrada").text(jornada_usuario.hora_inicio_jornada);
        jornada_usuario.hasOwnProperty("ultimo_descanso") ? $("#inicio_descanso").text(jornada_usuario.ultimo_descanso.hora_descanso) : "";
        jornada_usuario.hasOwnProperty("ultimo_descanso") ? $("#final_descanso").text(jornada_usuario.ultimo_descanso.hora_reincorporacion) : "";
        jornada_usuario.hasOwnProperty("hora_termino_jornada") ? $("#salida").text(jornada_usuario.hora_termino_jornada) : "";
    }
    if (jornada_usuario.estatus_jornada === "iniciada") {
        $(".home_empleado #iniciar_jornada").addClass("d-none");
        $(".home_empleado #reanudar_jornada").addClass("d-none");
        $(".home_empleado #finalizar_jornada").addClass("d-none");
    } else if (jornada_usuario.estatus_jornada === "pausada") {
        $(".home_empleado #iniciar_jornada").addClass("d-none");
        $(".home_empleado #pausar_jornada").addClass("d-none");
        $(".home_empleado #finalizar_jornada").addClass("d-none");
    } else if (jornada_usuario.estatus_jornada === "reanudada") {
        $(".home_empleado #iniciar_jornada").addClass("d-none");
        //dudas
    } else if (jornada_usuario.estatus_jornada === "finalizada") {
        $(".home_empleado #pausar_jornada").addClass("d-none");
        $(".home_empleado #reanudar_jornada").addClass("d-none");
        //dudas
    }




    clock();
//consultar contactos
    vue_contactos(directorio_usuario);


    var dialLines = document.getElementsByClassName('diallines');
    var clockEl = document.getElementsByClassName('clock')[0];

    for (var i = 1; i < 60; i++) {
        clockEl.innerHTML += "<div class='diallines'></div>";
        dialLines[i].style.transform = "rotate(" + 6 * i + "deg)";
    }



    setInterval("analog_clock()", 100);

    var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
    var diasSemana = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");
    var f = new Date();
    document.getElementById("today").innerHTML = diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();


    var l = getMonday(new Date());

    var v = getFriday(new Date());
    document.getElementById("intervalo_semanal").innerHTML = diasSemana[l.getDay()] + " " + f.getDate() + " al " + diasSemana[v.getDay()] + " " + v.getDate() + " de " + meses[f.getMonth()];


// revisar productividad

    RequestPOST("/API/empresas360/rendimiento_laboral", {
        "ids": [
            {
                "id360": perfil_usuario.id360
            }
        ],
        "fecha_inicio_semana": `${l.getFullYear()}-${(l.getMonth() + 1) < 10 ? "0" + (l.getMonth() + 1) : (l.getMonth() + 1)}-${l.getDate() < 10 ? "0" + l.getDate() : l.getDate()}`,
        "fecha_actual": getFecha()
    }).then((response) => {
        console.log(response);
        if (response.success) {
            console.log(response.info[perfil_usuario.id360]);
            let hoy = new Date();
            let dias_trabajados = hoy.getDay();//los dias que deberian ser trabajados
            let dias_registrados = response.info[perfil_usuario.id360].total_conexiones;
            let horas_registradas = response.info[perfil_usuario.id360].total_horas_trabajadas;
            let horas_trabajadas = dias_trabajados * 8;
            let productividad = ((response.info[perfil_usuario.id360]["total_horas_trabajadas"]) / horas_trabajadas) * 100;
            rendimiento_usuario = productividad.toFixed(2);
            try {
                chart_productividad();
            } catch (e) {
                console.log(e);
            }


            $("#retardos").text(response.info[perfil_usuario.id360]["total_retardos"]);
            console.log(response.info[perfil_usuario.id360]["total_retardos"]);
            if (response.info[perfil_usuario.id360]["total_retardos"] > 0) {
                $("#retardos_ok").addClass("d-none");
                $("#retardos_no_ok").removeClass("d-none");
            } else {
                $("#retardos_no_ok").addClass("d-none");
                $("#retardos_ok").removeClass("d-none");
            }
            $("#dias_laborables").text(dias_registrados);
            $("#horas_laborables").text(horas_registradas);
            $("#faltas").text(response.info[perfil_usuario.id360]["total_faltas"]);
            console.log(response.info[perfil_usuario.id360]["total_faltas"]);
            if (response.info[perfil_usuario.id360]["total_faltas"] > 0) {
                $("#faltas_ok").addClass("d-none");
                $("#faltas_no_ok").removeClass("d-none");
            } else {
                $("#faltas_no_ok").addClass("d-none");
                $("#faltas_ok").removeClass("d-none");
            }

        }
    });



    if (location_user !== null) {
        if (location_user.municipio !== null) {
            $("#home_empleado_municipio").text(" " + location_user.municipio);
            $("#home_empleado_municipio").text(" " + location_user.colonia);
        }
        if (location_user.estado !== null) {
            $("#home_empleado_estado").text(" - " + location_user.estado_long);
        }
    }

//RequestPOST("/API/empresas360/get_ids_reportes",{
//    "id360":perfil_usuario.id360
//}).then((response)=>{
//    console.log(response);
//})
    reporte_trabajo(reportes_usuario.has_reporte_trabajo);
    reporte_sintomas(reportes_usuario.has_reporte_sintomas);
    reporte_proteccion_personal(reportes_usuario.has_equipo_proteccion);
    reporte_seguridad_sanitaria(reportes_usuario.has_reporte_seguridad_sanitaria);


//listener de los botones de la jornada
    $("#iniciar_jornada").click(() => {
        $("#menu_section_EntradaySalida").click();
        $("#entrada_salida_iniciar_jornada").click();

    });
    $("#pausar_jornada").click(() => {
        $("#menu_section_EntradaySalida").click();
        $("#entrada_salida_pausar_jornada").click();
    });
    $("#reanudar_jornada").click(() => {
        $("#menu_section_EntradaySalida").click();
        $("#entrada_salida_reanudar_jornada").click();
    });
    $("#finalizar_jornada").click(() => {
        $("#menu_section_EntradaySalida").click();
        $("#entrada_salida_finalizar_jornada").click();
    });



    $(window).resize(function () {
        chart_productividad();
    });
    if (perfil_usuario.en_jornada === "0") {
        $("#home_empleado_estatus_descanso").removeClass("d-none");
        $("#home_empleado_estatus_activo").addClass("d-none");
    } else {
        $("#home_empleado_estatus_descanso").addClass("d-none");
        $("#home_empleado_estatus_activo").removeClass("d-none");
    }
    if (location_user !== null) {
        if (location_user.estado_long) {

            FunClima(location_user.estado_long);
        }
    }
}

if (perfil_usuario.nombre !== "" && perfil_usuario.nombre !== undefined && perfil_usuario.nombre !== "null" && perfil_usuario.nombre !== null) {
    $(".home_empleado_nombre_empleado").text(perfil_usuario.nombre);
}
if (perfil_usuario.apellido_paterno !== "" && perfil_usuario.apellido_paterno !== undefined && perfil_usuario.apellido_paterno !== "null" && perfil_usuario.apellido_paterno !== null) {
    $(".home_empleado_nombre_empleado").text($(".home_empleado_nombre_empleado")[0].innerHTML + " " + perfil_usuario.apellido_paterno);
}
if (perfil_usuario.apellido_materno !== "" && perfil_usuario.apellido_materno !== undefined && perfil_usuario.apellido_materno !== "null" && perfil_usuario.apellido_materno !== null) {
    $(".home_empleado_nombre_empleado").text($(".home_empleado_nombre_empleado")[0].innerHTML + " " + perfil_usuario.apellido_materno);
}