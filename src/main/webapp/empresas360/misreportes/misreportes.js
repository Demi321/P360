/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const init_misreportes = (json) => {
    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;
    
    //el id del json de entrada corresponde al id_menu
    //consultar si el tutorial de la vista ya fue consultada 
    RequestPOST("/API/empresas360/consulta_vistatutorial",{
        "id360":perfil_usuario.id360,
        "id_menu":json.id
    }).then((response)=>{
        console.log("Estatus de la vista tutorial de mis reportes");
        console.log(response);
    });
};
