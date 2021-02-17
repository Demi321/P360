/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const init_cuestionario_tamizaje = (json) => {
    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;
    $("#cuestionario_tamizaje_form").submit((e) => {
        e.preventDefault();
        let json = buildJSON_Section("cuestionario_tamizaje_form");
        let keys = Object.keys(json);
        $.each(keys, (i) => {
            let new_key = keys[i].toString().split("cuestionario_tamizaje_")[1];
            json[new_key] = json[keys[i]];
            delete json[keys[i]];
        });
        json.id360 = id_usuario;
        json.tipo_usuario = tipo_usuario;
        json.tipo_servicio = tipo_servicio;
        json.tipo_area = tipo_area;
        console.log(json);
        RequestPOST("/API/empresas360/cuestionario_tamizaje", json).then((response) => {
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