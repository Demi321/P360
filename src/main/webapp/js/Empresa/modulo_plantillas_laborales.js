/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


agregar_menu("Plantilla Laboral");
registro_plantilla_laboral("Plantilla Laboral");
/* Cambios fernando */
//agregar_menu("Mis Plantillas Laborales");
//Agregamos las sucursales registradas en la empresa
RequestGET("/API/lineamientos/listado_sucursales/" + sesion_cookie.tipo_usuario).then((response) => {
    if (response.length > 1) {
        $("#num_sucursales").text(response.length + ' Sucursales');
    } else {
        $("#num_sucursales").text(response.length + ' Sucursal');
    }
    for (var i = 0; i < response.length; i++) {
//                    agregar_listado_sucursal(response[i]);
        let json = response[i];
        //console.log(json);
        //MisSucursales_listado
        let option = document.createElement("option");
        option.value = json.id;
        option.innerHTML = json.nombre_edificio;
        if (sesion_cookie.tipo_servicio === "0") {
            $("#MisPlantillasLaborales_listado").append(option);
        } else {
            if (json.id === sesion_cookie.tipo_servicio) {
                $("#MisPlantillasLaborales_listado").append(option);
            }
        }
    }


    $("#MisPlantillasLaborales_listado").change((e) => {
        console.log(e.target.value);
        $("#listado_areas_sucursal").empty();
        RequestPOST("/API/empresas360/consulta_empleados", {
            tipo_usuario: sesion_cookie.tipo_usuario,
            tipo_servicio: e.target.value
        }).then((response) => {
            console.log(response);

            //Crear tabla de empleados por area dinamicamente
            let areas = {};
            let empleados_areas = new Array();
            let div_principal = null;
            $.each(response.empleados, (i) => {
                let json = response.empleados[i];
                if (!areas.hasOwnProperty(json.tipo_area)) {
                    empleados_areas.push(json);
                    areas[json.tipo_area] = empleados_areas;
                    empleados_areas = new Array();
                } else {
                    areas[json.tipo_area].push(json);
                }
            });

            $.each(areas, (i) => {
                let area = areas[i];
                div_principal = document.createElement("div");
                div_principal.className = 'row col-12 m-0 mb-5';
                div_principal.id = 'MisPlantillasLaborales_'+i;
                let nombre_area = document.createElement("label");
                nombre_area.className = 'col-12 p-0 pb-2 pl-2';
                nombre_area.style = 'border-bottom: solid 2px #cccccc; font: bold 1.5rem Arial;';
                nombre_area.id = 'nombre_area'+i;
                let div_cont_titulos = document.createElement("div");
                div_cont_titulos.className = 'row col-12 m-0 mb-3';
                let div_titulos = document.createElement("div");
                div_titulos.className = 'row col-12 m-0 pl-5';
                div_titulos.style = 'border-bottom: solid 1px #cccccc;';
                let nombre = document.createElement("label");
                nombre.className = 'col-3 my-2 p-0';
                nombre.style = 'font: bold 1.2rem Arial;';
                nombre.innerHTML = 'Nombre';
                let correo = document.createElement("label");
                correo.className = 'col-3 my-2 p-0';
                correo.style = 'font: bold 1.2rem Arial;';
                correo.innerHTML = 'Correo Electrónico';
                let puesto = document.createElement("label");
                puesto.className = 'col-2 my-2 p-0';
                puesto.style = 'font: bold 1.2rem Arial;';
                puesto.innerHTML = 'Puesto';
                let n_empreado = document.createElement("label");
                n_empreado.className = 'col-3 my-2 p-0';
                n_empreado.style = 'font: bold 1.2rem Arial;';
                n_empreado.innerHTML = 'Número de Empleado';
                let blanco = document.createElement("label");
                blanco.className = 'col my-2 p-0';

                div_cont_titulos.appendChild(nombre);
                div_cont_titulos.appendChild(correo);
                div_cont_titulos.appendChild(puesto);
                div_cont_titulos.appendChild(n_empreado);
                div_cont_titulos.appendChild(blanco);
                div_principal.appendChild(nombre_area);
                div_principal.appendChild(div_cont_titulos);
                $("#listado_areas_sucursal").append(div_principal);
                let n_a = true;
                $.each(area, (j) => {
                    let json = area[j];
                    console.log("agregando informacion en la tabla");
                    if (n_a) {
                        $("#nombre_area"+json.tipo_area).text("Area "+json.area);
                        n_a = false;
                    }
                    let div_cont_val = document.createElement("div");
                    div_cont_val.className = 'row col-12 m-0 mb-3';
                    let val_nombre = document.createElement("label");
                    val_nombre.className = 'col-3 my-2 p-0';
                    val_nombre.style = 'font: normal 1rem Arial;';
                    val_nombre.innerHTML = json.nombre + " " + json.apellidopaterno + " " + json.apellidomaterno;
                    let val_correo = document.createElement("label");
                    val_correo.className = 'col-3 my-2 p-0';
                    val_correo.style = 'font: normal 1rem Arial;';
                    val_correo.innerHTML = json.correo;
                    let val_puesto = document.createElement("label");
                    val_puesto.className = 'col-2 my-2 p-0';
                    val_puesto.style = 'font: normal 1rem Arial;';
                    val_puesto.innerHTML = json.puesto;
                    let val_n_empleado = document.createElement("label");
                    val_n_empleado.className = 'col-3 my-2 p-0';
                    val_n_empleado.style = 'font: normal 1rem Arial;';
                    val_n_empleado.innerHTML = json.numerodeempleado;
                    let detalle = document.createElement("label");
                    detalle.className = 'col my-2 p-0';
                    detalle.style = 'font: normal 1rem Arial;cursor:pointer;';
                    detalle.innerHTML = 'Ver detalles';

                    div_cont_val.appendChild(val_nombre);
                    div_cont_val.appendChild(val_correo);
                    div_cont_val.appendChild(val_puesto);
                    div_cont_val.appendChild(val_n_empleado);
                    div_cont_val.appendChild(detalle);

                    div_principal.appendChild(div_cont_val);

                    $("#MisPlantillasLaborales_"+json.tipo_area).append(div_principal);
                });
            });
        });
    });

    RequestPOST("/API/empresas360/estadisticos_empleados",{
            tipo_usuario: sesion_cookie.tipo_usuario
        }).then((response)=>{
        $("#MisPlantillasLaborales_num_emleados").text(response.total);
        $("#MisPlantillasLaborales_p_completo").text(response.completo);
        $("#MisPlantillasLaborales_p_proceso").text(response.proceso);
        $("#MisPlantillasLaborales_p_scompletar").text(response.sin_completar);
    });
});
/*******************/