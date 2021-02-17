/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var init_saludeneltrabajo = (json) => {
    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;
    //el id servira vara hacer referencia a la vista donde se colocara el contenido de la vista * todo se generara de forma dinamica
    $(".saludeneltrabajo_"+id).append(id);
};

