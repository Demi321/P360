/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global perfil_usuario, sucursales_usuario, sesion_cookie, RequestPOST, swal, RequestGET */

const init_areasdetrabajo = (id_usuario, tipo_usuario, tipo_servicio, tipo_area) => {
    if (perfil_usuario !== null && perfil_usuario !== undefined && perfil_usuario !== "") {

        //rellenar info
        //img num_empleado puesto horario_entrada horario_salida
        if (perfil_usuario.img !== "" && perfil_usuario.img !== undefined && perfil_usuario.img !== "null" && perfil_usuario.img !== null) {
            $("#modulo_section_MiPerfil #img").css({
                "background-image": "url(" + perfil_usuario.img + ")",
                "background-size": "contain",
                "background-position": "center",
                "background-repeat": "no-repeat"
            });
        }
        if (perfil_usuario.num_empleado !== "" && perfil_usuario.num_empleado !== undefined && perfil_usuario.num_empleado !== "null" && perfil_usuario.num_empleado !== null) {
            $("#modulo_section_MiPerfil #num_empleado").val(perfil_usuario.num_empleado);
        }
        if (perfil_usuario.puesto !== "" && perfil_usuario.puesto !== undefined && perfil_usuario.puesto !== "null" && perfil_usuario.puesto !== null) {
            $("#modulo_section_MiPerfil #puesto").val(perfil_usuario.puesto);
        }
        if (perfil_usuario.horario_entrada !== "" && perfil_usuario.horario_entrada !== undefined && perfil_usuario.horario_entrada !== "null" && perfil_usuario.horario_entrada !== null) {
            $("#modulo_section_MiPerfil #horario_entrada").val(perfil_usuario.horario_entrada);
        }
        if (perfil_usuario.horario_salida !== "" && perfil_usuario.horario_salida !== undefined && perfil_usuario.horario_salida !== "null" && perfil_usuario.horario_salida !== null) {
            $("#modulo_section_MiPerfil #horario_salida").val(perfil_usuario.horario_salida);
        }
        if (perfil_usuario.nombre !== "" && perfil_usuario.nombre !== undefined && perfil_usuario.nombre !== "null" && perfil_usuario.nombre !== null) {
            $(".nombre_completo").text(perfil_usuario.nombre);
        }
        if (perfil_usuario.apellido_paterno !== "" && perfil_usuario.apellido_paterno !== undefined && perfil_usuario.apellido_paterno !== "null" && perfil_usuario.apellido_paterno !== null) {
            $(".nombre_completo").text($(".nombre_completo")[0].innerHTML + " " + perfil_usuario.apellido_paterno);
        }
        if (perfil_usuario.apellido_materno !== "" && perfil_usuario.apellido_materno !== undefined && perfil_usuario.apellido_materno !== "null" && perfil_usuario.apellido_materno !== null) {
            $(".nombre_completo").text($(".nombre_completo")[0].innerHTML + " " + perfil_usuario.apellido_materno);
        }
    }

    if (sucursales_usuario !== null && sucursales_usuario !== undefined && sucursales_usuario !== "") {

        for (var i = 0; i < sucursales_usuario.length; i++) {
//                    agregar_listado_sucursal(response[i]);
            let json = sucursales_usuario[i];
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
    }


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
};

function agregar_area(json) {
    //areas_registradas
    let div = document.createElement("div");
    div.className = "p-0 py-2 col-12";
    let card = document.createElement("div");
    card.className = "card";
    let card_header = document.createElement("div");
    card_header.className = "card-header text-dark text-left";
    card_header.style = "background: none; font-size: 1.5rem;";
    card_header.innerHTML = '<i class="fas fa-minus-circle"></i>';
    card_header.innerHTML += json.nombre + " - " + json.area;
    let card_body = document.createElement("div");
    card_body.className = "card-body text-dark text-left px-4";
    card_body.style = "background: no-repeat; border: none; font-size: 1.4rem;";
    let card_body_div = document.createElement("div");
    card_body_div.style = "font-size: 1.4rem; align-items: center; display: flex; padding: 10px 5px;";
    card_body_div.innerHTML = 'Codigo de invitación: <strong style="font-size: 1.4rem; padding: 5px 20px;">ALG4-R482-SDF2-B254</strong><i class="fas fa-share-alt" style="font-size: 2rem;margin-left: 20px;color: #17a2b8;cursor: pointer;" tittle="Compartir Código"></i>';
    let p = document.createElement("p");
    p.className = "card-text";
    p.innerHTML = 'Comparte el codigo de invitación a los encargados del area: <strong>' + json.area + '</strong>';

    card_body.appendChild(card_body_div);
    card_body.appendChild(p);
    card.appendChild(card_header);
    card.appendChild(card_body);
    div.appendChild(card);
    $("#area_jornadas").append("<option value='"+json.id+"'>"+json.nombre + " - " + json.area+"</option>");
    $("#areas_registradas").append(div);
}