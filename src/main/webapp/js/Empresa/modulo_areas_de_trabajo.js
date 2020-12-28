/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


mostrar_info_perfil();
agregar_menu("Áreas de Trabajo",'<i class="fas fa-users"></i>',"Recursos Humanos");
RequestGET("/API/lineamientos/listado_sucursales/" + sesion_cookie.tipo_usuario).then((response) => {

    for (var i = 0; i < response.length; i++) {
//                    agregar_listado_sucursal(response[i]);
        let json = response[i];
        //console.log(json);
        //MisSucursales_listado
        let option = document.createElement("option");
        option.value = json.id;
        option.innerHTML = json.nombre_edificio;
        if (sesion_cookie.tipo_servicio === "0") {
            $("#AreasdeTrabajo_listado_sucursales").append(option);
        } else {
            if (json.id === sesion_cookie.tipo_servicio) {
                $("#AreasdeTrabajo_listado_sucursales").append(option);
            }
        }

    }
    //Agregar listener 
    $("#AreasdeTrabajo_listado_sucursales").change((e) => {
        //console.log(e.target.value);
        //agregar tipo servicio
        $("#AreasdeTrabajo_tipo_usuario").val(e.target.value);
    });
    $("#listado_Areas").empty();
    RequestGET("/API/empresas360/catalogo_areas").then((areas) => {
        for (var i = 0; i < areas.length; i++) {
//                    agregar_listado_sucursal(response[i]);
            let json = areas[i];
            //console.log(json);
            //MisSucursales_listado
            let option = document.createElement("option");
            option.value = json.nombre;

            $("#listado_Areas").append(option);

        }
    });
});
$("#registrar_area").submit((e) => {
    e.preventDefault();
    let json = buildJSON_Section("registrar_area");
    json.area = json.AreasdeTrabajo_listado_Areas;
    json.tipo_servicio = json.AreasdeTrabajo_listado_sucursales;
    json.id360 = sesion_cookie.id_usuario;
    json.tipo_usuario = sesion_cookie.tipo_usuario;
    console.log(json);
    RequestPOST("/API/empresas360/registro/tipo_area", json).then((rsp) => {
        swal.fire({
            text: rsp.mensaje
        });
        if (rsp.success) {
            agregar_area(rsp);
        }
    });
});

RequestGET("/API/empresas360/listado_areas/" + sesion_cookie.tipo_usuario + "/" + sesion_cookie.tipo_servicio).then((rsp) => {
    console.log(rsp);
    for (var i = 0; i < rsp.length; i++) {
        let json = rsp[i];
        agregar_area(json);
    }
});