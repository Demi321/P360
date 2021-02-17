/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


const init_reporte_sintomas = (json) => {
    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;
    $("#reporte_sintomas_form").submit((e) => {
        e.preventDefault();
        let json = buildJSON_Section("reporte_sintomas_form");
        let keys = Object.keys(json);
        $.each(keys, (i) => {
            let new_key = keys[i].toString().split("reporte_sintomas_")[1];
            json[new_key] = json[keys[i]];
            delete json[keys[i]];
        });
        json.id360 = id_usuario;
        json.tipo_usuario = tipo_usuario;
        json.tipo_servicio = tipo_servicio;
        console.log(json);
        RequestPOST("/API/Reporte_Sintomas", json).then((response) => {
            console.log(response);
            swal.fire({
                text: response.mensaje
            });
            if (response.success) {
                //limpiamos el formulario
                $("#reporte_sintomas_form").trigger("reset");
            }
        });
    });
}
$("#reporte_sintomas_form input[type=checkbox]").on("change", (e) => {
    console.log(e.target.checked)
    if (e.target.checked) {
        if (e.target.id !== "reporte_sintomas_sintoma_ninguno") {
            $("#reporte_sintomas_sintoma_ninguno").prop('checked', false);
        } else {
            $("#reporte_sintomas_form input[type=checkbox]").prop('checked', false);
            $("#reporte_sintomas_sintoma_ninguno").prop('checked', true);
        }
    }
});
$("#reporte_sintomas_sintoma_ninguno").prop('checked', true);