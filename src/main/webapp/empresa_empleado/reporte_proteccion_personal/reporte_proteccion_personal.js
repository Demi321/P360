/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const init_reporte_proteccion_personal = (json) => {
    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;
    let inp_checkbox = $("#reporte_proteccion_personal_form input[type=checkbox]");
    for (var i = 0; i < inp_checkbox.length; i++) {
        //Revisar si la llave ya existe 
        inp_checkbox[i].addEventListener('change', (e) => {
            let id = e.target.id;
            id = id.replace("reporte_proteccion_personal_proteccion_", "reporte_proteccion_personal_piezas_");
            console.log(id);
            if (e.target.checked) {
                //Mostramos el input del numero
                $("#" + id).removeClass("d-none");
            } else {
                //ocultamos el input del numero y ponemos su value en 0
                $("#" + id).addClass("d-none");
                $("#" + id).val(0);
            }
        });
    }

    let ultima_prueba = $("#reporte_proteccion_personal_form #reporte_proteccion_personal_prueba_covid");
    ultima_prueba.on("change", (e) => {
        console.log(e.target.value);
        if (e.target.value.toString() === "1") {
            $("#ultima_prueba_titulo").removeClass("d-none");
            $("#ultima_prueba").removeClass("d-none");
            $("#resultado_prueba_titulo").removeClass("d-none");
            $("#resultado_prueba").removeClass("d-none");
        } else {
            $("#ultima_prueba_titulo").addClass("d-none");
            $("#ultima_prueba").addClass("d-none");
            $("#resultado_prueba_titulo").addClass("d-none");
            $("#resultado_prueba").addClass("d-none");

            $("#reporte_proteccion_personal_prueba_reciente").val("0");
            $("#reporte_proteccion_personal_resultado_prueba").val("0");

        }
    });


    $("#reporte_proteccion_personal_form").submit((e) => {
        e.preventDefault();
        let json = buildJSON_Section("reporte_proteccion_personal_form");
        let keys = Object.keys(json);
        $.each(keys, (i) => {
            let new_key = keys[i].toString().split("reporte_proteccion_personal_")[1];
            json[new_key] = json[keys[i]];
            delete json[keys[i]];
        });
        json.id360 = id_usuario;
        json.tipo_usuario = tipo_usuario;
        json.tipo_servicio = tipo_servicio;
        json.tipo_area = tipo_area;
        console.log(json);
        RequestPOST("/API/Reporte_EquipoProteccion", json).then((response) => {
            console.log(response);
            swal.fire({
                text: response.mensaje
            });
            if (response.success) {
                //limpiamos el formulario
                $("#reporte_proteccion_personal_form").trigger("reset");
            }
        });
    });
}