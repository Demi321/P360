/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const init_perfil = (json) => {
    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;
    if (perfil_usuario.nombre !== "" && perfil_usuario.nombre !== undefined && perfil_usuario.nombre !== "null" && perfil_usuario.nombre !== null) {
        $(".nombre_completo").text(perfil_usuario.nombre);
    }
    if (perfil_usuario.apellido_paterno !== "" && perfil_usuario.apellido_paterno !== undefined && perfil_usuario.apellido_paterno !== "null" && perfil_usuario.apellido_paterno !== null) {
        $(".nombre_completo").text($(".nombre_completo")[0].innerHTML + " " + perfil_usuario.apellido_paterno);
    }
    if (perfil_usuario.apellido_materno !== "" && perfil_usuario.apellido_materno !== undefined && perfil_usuario.apellido_materno !== "null" && perfil_usuario.apellido_materno !== null) {
        $(".nombre_completo").text($(".nombre_completo")[0].innerHTML + " " + perfil_usuario.apellido_materno);
    }

    $("#img").css({
        "background-image": "url(" + perfil_usuario.img + ")",
        "background-size": "contain",
        "background-position": "center",
        "background-repeat": "no-repeat"
    });

    $("#nombre_empresa").val(empresa_usuario.razon_social);
    $("#puesto").val(perfil_usuario.puesto);
    $("#num_empleado").val(perfil_usuario.num_empleado);
    $("#fecha_nacimiento").val(perfil_usuario.fecha_nacimiento !== null ? perfil_usuario.fecha_nacimiento : "");
    $(".miperfil #genero").val(perfil_usuario.genero!== null ?perfil_usuario.genero:"");
    if (perfil_usuario.genero !== null) {

        if (perfil_usuario.genero.toString().toUpperCase().includes("H") || perfil_usuario.genero.toString().toUpperCase() === "MASCULINO") {
            $("#sexo").val("Masculino");
        } else if (perfil_usuario.genero.toString().toUpperCase().includes("F") || perfil_usuario.genero.toString().toUpperCase() === "MUJER") {
            $("#sexo").val("Femenino");
        }
    }

    $("#horario_entrada").val(perfil_usuario.horario_entrada);
    $("#horario_salida").val(perfil_usuario.horario_salida);
    let mi_sucursal = null;
    for (var i = 0; i < sucursales_usuario.length; i++) {
        if (tipo_servicio === sucursales_usuario[i].id) {
            mi_sucursal = sucursales_usuario[i];
            break;
        }
    }
    if (mi_sucursal !== null) {
        $("#nombre_sucursal").val(mi_sucursal.nombre_edificio);
        $("#nombre_area").val(perfil_usuario.area);

    }



    $(".miperfil").append($('<input type="button" class="btn btn-danger px-4 mx-auto" value="Actualizar información" id="update_info_horario_empleado">'));
    $("#update_info_horario_empleado").click(() => {
        let json = {
            "horario_entrada": $(".miperfil #horario_entrada").val(),
            "horario_salida": $(".miperfil #horario_salida").val(),
            "fecha_nacimiento": $(".miperfil #fecha_nacimiento").val(),
            "genero": $(".miperfil #genero").val(),
            "id360": id_usuario
        }
        console.log(json);
        RequestPOST("/API/cuenta360/registro_modulo", json).then((response) => {
            console.log(response);
            swal.fire({
                text: response.mensaje
            });
        });
    });
}