/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Directorio;
var tel_a_agregar = new Array();
ConsultarDirectorio().then(function (directorio) {
//    for (var i = 0; i < directorio.directorio.length; i++) {
//        //console.info(directorio.directorio[i].urlServicio);
//        for (var j = 0; j < directorio.dependencias.length; j++) {
//            if (directorio.dependencias[j].url === directorio.directorio[i].urlServicio) {
//                directorio.directorio[i].aliasServicio = directorio.dependencias[j].alias;
//                break;
//            } else if (j === directorio.dependencias.length - 1) {
//                console.error("No hubo match");
//            }
//        }
//
//    }

    Directorio = directorio.directorio;
    //console.info(Directorio);
});

function ConsultarDirectorio() {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/ConsultarDirectorio',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "fecha": getFecha(),
            "hora": getHora(),
            "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
            "tipo_servicio":JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
            "tipo_area":JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area
        }),
        success: function (response) {
            //console.info(response);
        },
        error: function (err) {
            //alert("No hay ubicacion para el usuario:" + idUsuarios_Movil);
            console.error(err)
        }
    }));

}


function vuemodel() {
    tel_a_agregar = new Array();

    var json = Directorio;


// register globally

    vue = new Vue({
        components: {
            Multiselect: window.VueMultiselect.default
        },
        data: {

            value: [
            ],
            options: json


        },
        methods: {
            customLabel(option) {
                return  option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno;
            },
            onSelect(op) {

                tel_a_agregar.push(op);
                //console.info(tel_a_agregar);



            },
            onClose() {
                //console.info(this.value);
            },
            onRemove(op) {
                var i = tel_a_agregar.indexOf(op);
                tel_a_agregar.splice(i, 1);
                //console.info(op);
                //console.info(tel_a_agregar);
            }

        }
    }).$mount('#agregarTels');

    estiloSwal();
}
function estiloSwal() {

//    var popup = document.getElementsByClassName("swal2-popup");
//    //console.info(popup);
//    if(popup.length)
//    popup[0].style = "display: flex; margin: 0; padding: 0; border-radius:10px;     background: #40474f;";


//    var header = document.getElementsByClassName("swal2-header");
//    //console.info(header);
//    if(header.length)
//    header[0].style = "background: white; border-top-left-radius: 10px; border-top-right-radius: 10px;";


//    var title = document.getElementsByClassName("swal2-title");
//    //console.info(title);
//    if(title.length)
//    title[0].style = "display:flex;width:90%;font:13px arial;color:#2f2f2f;margin:5px;";

//    var actionButtons = document.getElementsByClassName("swal2-actions");
//    if(actionButtons.length)
//    actionButtons[0].style = "display:flex;z-index: 0; ";
//    var confirm = document.getElementsByClassName("swal2-confirm");
//    //console.info(confirm);
//    if(confirm.length)
//    confirm[0].style = "width:40%;background:#dc3545;border-radius:15px;height:25px;margin:15px;padding:0;";
//    var cancel = document.getElementsByClassName("swal2-cancel");
//    //console.info(cancel);
//    if(cancel.length)
//    cancel[0].style = "width:40%;background:#93939;border-radius:15px;height:25px;margin:15px;padding:0;";

//    var multiselect = document.getElementsByClassName("multiselect");
//    //console.info(multiselect);
//    if (multiselect.length)
//    multiselect[0].style = "border-radius: 0; border-bottom: solid 2px white; width: 84%; margin-left: auto; margin-right: auto;";
//    var tags = document.getElementsByClassName("multiselect__tags");
//    //console.info(tags);
//    if(tags.length)
//    tags[0].style = "    max-height: 150px;overflow-y: scroll; background: none; border: none;";
//    var single = document.getElementsByClassName("multiselect__single");
//    //console.info(single);
//    if(single.length)
//    single[0].style = "background: none; color: white; font: bold 12px arial;";
//    

}
function vuemodel2() {

    var json = Directorio;


// register globally

    vue = new Vue({
        components: {
            Multiselect: window.VueMultiselect.default
        },
        data() {
            return {
                value: [],
                options: [
                    {name: 'Vue.js', code: 'vu'},
                    {name: 'Javascript', code: 'js'},
                    {name: 'Open Source', code: 'os'}
                ]
            }
        },
        methods: {
            addTag(newTag) {
                const tag = {
                    name: newTag,
                    code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
                }
                this.options.push(tag)
                this.value.push(tag)
            }
        }
    }).$mount('#test');
}

function vuemodel3() {

}