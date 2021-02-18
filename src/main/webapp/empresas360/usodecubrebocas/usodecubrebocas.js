/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
let json_uso_cubrebocas = null;
const init_usodecubrebocas = (json) => {
    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;




    $(window).on("load", function () {
        $(".usodecubrebocas .parte1").addClass("d-none");
        $(".usodecubrebocas .parte2").addClass("d-none");
        $(".usodecubrebocas .parte3").addClass("d-none");
        $(".usodecubrebocas .parte1").removeClass("d-none");

        //Listener para formulario parte1
        $("#uso_cubrebocas_form1").submit((e) => {
            e.preventDefault();
            $(".usodecubrebocas .parte1").addClass("d-none");
            $(".usodecubrebocas .parte2").addClass("d-none");
            $(".usodecubrebocas .parte3").addClass("d-none");
            $(".usodecubrebocas .parte2").removeClass("d-none");
            let json = buildJSON_Section("uso_cubrebocas_form1");
            console.log(json);
            console.log(JSON.stringify(json));
            json_uso_cubrebocas = json;
        });

        //Listener para formulario parte2
        $("#uso_cubrebocas_form2").submit((e) => {
            e.preventDefault();
            $(".usodecubrebocas .parte1").addClass("d-none");
            $(".usodecubrebocas .parte2").addClass("d-none");
            $(".usodecubrebocas .parte3").addClass("d-none");
            $(".usodecubrebocas .parte3").removeClass("d-none");
            let json = buildJSON_Section("uso_cubrebocas_form2");
            console.log(json);
            console.log(JSON.stringify(json));
            var Obj = $.extend(json_uso_cubrebocas, json);
            json_uso_cubrebocas = Obj;
        });
        //Listener para formulario parte3
        $("#uso_cubrebocas_form3").submit((e) => {
            e.preventDefault();
            $(".usodecubrebocas .parte1").addClass("d-none");
            $(".usodecubrebocas .parte2").addClass("d-none");
            $(".usodecubrebocas .parte3").addClass("d-none");
            $(".usodecubrebocas .parte1").removeClass("d-none");
            let json = buildJSON_Section("uso_cubrebocas_form3");
            console.log(json);
            console.log(JSON.stringify(json));
            var Obj = $.extend(json_uso_cubrebocas, json);
            json_uso_cubrebocas = Obj;
            console.log(json_uso_cubrebocas);
            console.log(JSON.stringify(json_uso_cubrebocas));


            json = json_uso_cubrebocas;
            let keys = Object.keys(json);
            $.each(keys, (i) => {
                let new_key = keys[i].toString().split("uso_cubrebocas_")[1];
                json[new_key] = json[keys[i]];
                delete json[keys[i]];
            });
            json.id360 = id_usuario;
            json.tipo_usuario = tipo_usuario;
            json.tipo_servicio = tipo_servicio;
            json.tipo_area = tipo_area;
            console.log(json);
            

            json_uso_cubrebocas = null;
            $("#uso_cubrebocas_form1")[0].reset();
            $("#uso_cubrebocas_form2")[0].reset();
            $("#uso_cubrebocas_form3")[0].reset();
        });
    });
};

