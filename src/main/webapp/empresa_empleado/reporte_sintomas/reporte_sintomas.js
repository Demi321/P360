/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


const init_reporte_sintomas = (id_usuario, tipo_usuario, tipo_servicio, tipo_area) => {

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