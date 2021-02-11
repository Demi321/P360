/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const init_plantillalaboral = (id_usuario, tipo_usuario, tipo_servicio, tipo_area) => {

}
registro_plantilla_laboral("PlantillaLaboral");
function registro_plantilla_laboral(nombre) {
    let div_contendor = document.createElement("div");
    div_contendor.className = 'row col-12 m-0 p-2 pt-3';
    let h3_title = document.createElement("h3");
    h3_title.innerHTML = 'Registrar nuevo personal';
    div_contendor.appendChild(h3_title);

    let div_form = document.createElement("div");
    div_form.className = 'col-12 p-0';
    let form_registro = document.createElement("form");
    form_registro.id = 'form_registro_personal';
    form_registro.className = 'row m-0 p-0 col-12=';

    let select_sucursal = document.createElement("select");
    select_sucursal.className = "form-control-plaintext input p-2 text-dark m-0 mb-1 col-sm-12 col-md-7";
    select_sucursal.style = "font: bold 1rem Arial; border: none; background: none; border-bottom: solid 2px #495057;";
    select_sucursal.required = true;
    select_sucursal.innerHTML = '<option disabled="" selected="" value="">Selecciona una sucursal</option>';
    select_sucursal.id = "PlantillaLaboral_listado_sucursales";

    let div_s = document.createElement("div");
    div_s.className = 'col-1';

    let select_area = document.createElement("select");
    select_area.className = "form-control-plaintext input p-2 text-dark m-0 mb-1 col-sm-12 col-md-4";
    select_area.style = "font: bold 1rem Arial; border: none; background: none; border-bottom: solid 2px #495057;";
    select_area.required = true;
    select_area.innerHTML = '<option disabled="" selected="" value="">Selecciona una área</option>';
    select_area.id = "PlantillaLaboral_listado_areas";
//    if(sesion_cookie.tipo_servicio==="0"){
//        select.appendChild('<option  value="0"></option>');
//    }
    form_registro.appendChild(select_sucursal);
    form_registro.appendChild(div_s);
    form_registro.appendChild(select_area);

    form_registro.appendChild(form_info_plantilla_laboral("Puesto", "PlantillaLaboral_puesto", "text"));
    form_registro.appendChild(form_info_plantilla_laboral("Número de empleado", "PlantillaLaboral_num_empleado", "text"));
    form_registro.appendChild(form_info_plantilla_laboral("Nombre", "PlantillaLaboral_nombre", "text"));

    let div = document.createElement("div");
    div.className = 'form-group row m-0 p-2 col-12';
    let label = document.createElement("label");
    label.for = "PlantillaLaboral_apellidopaterno";
    label.className = 'col-sm-2 col-form-label';
    label.innerHTML = "Apellidos:";
    div.appendChild(label);
    let div2 = document.createElement("div");
    div2.className = 'col-sm-5';
    let input = document.createElement("input");
    input.type = "text";
    input.className = 'form-control-plaintext input';
    input.id = "PlantillaLaboral_apellidopaterno";
    input.placeholder = "Apellido Paterno";
    div2.appendChild(input);

    let div3 = document.createElement("div");
    div3.className = 'col-sm-5';
    let input1 = document.createElement("input");
    input1.type = "text";
    input1.className = 'form-control-plaintext  input';
    input1.id = "PlantillaLaboral_apellidomaterno";
    input1.placeholder = "Apellido Materno";
    div3.appendChild(input1);

    div.appendChild(div2);
    div.appendChild(div3);

    form_registro.appendChild(div);

    form_registro.appendChild(form_info_plantilla_laboral("Correo Electrónico", "PlantillaLaboral_correo", "text"));

    let div_btn = document.createElement("div");
    div_btn.className = 'form-group row m-0 p-2';
    let div_btn2 = document.createElement("div");
    div_btn2.className = 'col-sm-12';
    let btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'btn btn-danger mb-2';
    btn.innerHTML = 'Registrar';
    div_btn2.appendChild(btn);
    div_btn.appendChild(div_btn2);

    form_registro.appendChild(div_btn);
    div_form.appendChild(form_registro);
    let hr = document.createElement("hr");
    div_form.appendChild(hr);

    div_contendor.appendChild(div_form);

    let div_doc = document.createElement("div");
    div_doc.className = 'col-12 p-0';
    let h3_doc = document.createElement("h3");
    h3_doc.innerHTML = 'Subir documento (Excel) de plantilla laboral';
    div_doc.appendChild(h3_doc);
    let form_doc = document.createElement("form");
    form_doc.id = 'form_registro_personal_file';
    form_doc.appendChild(form_info_plantilla_laboral("Seleccionar Archivo", "file_plantilla_laboral", "file"));

    let div_btn_doc = document.createElement("div");
    div_btn_doc.className = 'form-group row m-0 p-2';
    let div_empty = document.createElement("div");
    div_empty.className = 'col-sm-12';
    div_empty.id = "registros_file";
    let div_btn2_doc = document.createElement("div");
    div_btn2_doc.className = 'col-sm-12';
    div_btn2_doc.innerHTML = '<p>El documento debe ser un archivo con extensión csv ó xlsx y debe contener como minimo las columnas <strong>Número de sucursal, Área, Puesto, Nombre, Apellido Paterno, Apellido Materno, Correo</strong> puedes descargar una plantilla <a target="_blank" href="https://lineamientos.s3.amazonaws.com/plantilla.xlsx">aquí.</a></p>';
    let btn_doc = document.createElement('button');
    btn_doc.type = 'submit';
    btn_doc.className = ' d-none btn btn-danger mb-2';
    btn_doc.innerHTML = 'Subir Archivo';
    div_btn2_doc.appendChild(btn_doc);
//            div_btn_doc.appendChild(div_empty);
    div_btn_doc.appendChild(div_btn2_doc);
    form_doc.innerHTML += '<div class="col-12"><p style="    color: #343a40;    font: normal 0.9rem Arial;">* En este apartado encontraras el listado de las sucursales registradas junto con el <strong style="    font: inherit;    font-weight: bolder;">número de sucursal asignado por la plataforma</strong>, este número es importante para realizar el registro de tu plantilla laboral ya que es solicitado en el documento que subiras</p></div>';
    form_doc.appendChild(div_btn_doc);

    div_doc.appendChild(form_doc);

    div_contendor.appendChild(div_doc);

    $(".plantillalaboral").append(div_contendor);
    $(".plantillalaboral").append(div_empty);

    $("#form_registro_personal").submit(function (e) {
        e.preventDefault();
        //        let inputs = $("[id^=docente_]");
        if ($("#PlantillaLaboral_listado_sucursales").val() !== null
                && $("#PlantillaLaboral_listado_areas").val() !== null) {

            let json = buildJSON_Section("form_registro_personal");
            console.log(json);
            let keys = Object.keys(json);
            for (var i = 0; i < keys.length; i++) {
                let key = keys[i].split("PlantillaLaboral_");
                key = key[1];
                json[key] = json[keys[i]];
                delete json[keys[i]];
            }
            json.tipo_usuario = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
            json.tipo_servicio = json.listado_sucursales;
            delete json["listado_sucursales"];
            json.tipo_area = json.listado_areas;
            json.id360 = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario;
            json.numerodeempleado = json.num_empleado;

            delete json["listado_areas"];
            json.area = $("#PlantillaLaboral_listado_areas option:selected").text();
            let jsonObj = [[json]];
            RequestPOST("/API/registro_invitacion", jsonObj).then(function (response) {
                swal.fire({
                    text: response.mensaje
                }).then(function () {
                    if (response.success) {
                        document.location.reload();
                    }
                });

            });
        } else {
            Swal.fire({
                text: "Debe seleccionar una sucursal y un área para poder registrar su plantilla laboral."
            });
        }
    });




    for (var i = 0; i < sucursales_usuario.length; i++) {
//                    agregar_listado_sucursal(sucursales_usuario[i]);
        let json = sucursales_usuario[i];
        console.log(json);
        //MisSucursales_listado
        let option = document.createElement("option");
        option.value = json.id;
        option.innerHTML = json.nombre_edificio;
        if (sesion_cookie.tipo_servicio === "0") {
            $("#PlantillaLaboral_listado_sucursales").append(option);
        } else {
            if (json.id === sesion_cookie.tipo_servicio) {
                $("#PlantillaLaboral_listado_sucursales").append(option);
            }
        }

    }
    //Agregar listener 
    $("#PlantillaLaboral_listado_sucursales").change((e) => {
        console.log(e.target.value);
        //cambiar los valores del area  deacuerdo al value seleccionado 
        //Solicitar areas
        //agregar tipo servicio
        $("#PlantillaLaboral_listado_areas").val("");
        $("#PlantillaLaboral_listado_areas").empty();
        let option = document.createElement("option");
        option.value = "";
        option.innerHTML = "Selecciona una área";
        option.disabled = "true";
        option.selected = "true";
        $("#PlantillaLaboral_listado_areas").append(option);
        //agregamos la opcion por default 
        RequestGET("/API/empresas360/listado_areas/" + sesion_cookie.tipo_usuario + "/" + e.target.value).then((rsp) => {
            console.log(rsp);

            for (var i = 0; i < rsp.length; i++) {
                let json = rsp[i];
//                    agregar_area(rsp);
                let option = document.createElement("option");
                option.value = json.id;
                option.innerHTML = json.area;
                $("#PlantillaLaboral_listado_areas").append(option);
            }
        });
    });

    let sucursales_div = document.createElement("div");
    sucursales_div.className = 'row col-12 m-0';
    let sucursales_div_2 = document.createElement("div");
    sucursales_div_2.className = 'col-12 m-0';
    let label_id = document.createElement("label");
    label_id.innerHTML = 'Número de sucursal';
    label_id.className = 'col-3 m-0';
    label_id.style = 'font-weight: bold;border-right: solid 1px;border-bottom: 1px solid;text-align: center;';
    let label_nombre = document.createElement("label");
    label_nombre.innerHTML = 'Nombre de sucursal';
    label_nombre.className = 'col-9 m-0';
    label_nombre.style = 'font-weight: bold;border-bottom: 1px solid;text-align: center;';
    sucursales_div_2.appendChild(label_id);
    sucursales_div_2.appendChild(label_nombre);
    sucursales_div.appendChild(sucursales_div_2);
    $("#modulo_section_PlantillaLaboral div")[0].appendChild(sucursales_div);
    $.each(sucursales_usuario, (i) => {
        let sucursales_div_3 = document.createElement("div");
        sucursales_div_3.className = 'col-12 m-0';
        let label_1 = document.createElement("label");
        label_1.innerHTML = sucursales_usuario[i].id;
        label_1.className = 'col-3 m-0 py-1';
        label_1.style = 'border-right: solid 1px;text-align: center;';
        let label_2 = document.createElement("label");
        label_2.innerHTML = sucursales_usuario[i].nombre_edificio;
        label_2.className = 'col-9 m-0 py-1';
        label_2.style = 'text-align: left;padding-left: 20px;';
        sucursales_div_3.appendChild(label_1);
        sucursales_div_3.appendChild(label_2);
        sucursales_div.appendChild(sucursales_div_3);
        $("#modulo_section_PlantillaLaboral div")[0].appendChild(sucursales_div);
    });

    //$("#menu_section_" + nombre.replace(/\s/g, "")).click();

}
$("#file_plantilla_laboral").change(function (e) {
    fileReader(e);
});
//        var json_file={};
function fileReader(oEvent) {
    console.log("En la funcion fileReader");
    json_file = {};

    var oFile = oEvent.target.files[0];
    var sFilename = oFile.name;

    var reader = new FileReader();
    var result = {};
    if (sFilename.toString().includes(".csv") || sFilename.toString().includes(".xlsx")) {
        let h1 = document.createElement("h1");
        h1.innerHTML = "Procesando Archivo";
        let dots = 0;
        let interval = setInterval(function () {
            if (dots === 10) {
                dots = 0;
                h1.innerHTML = "Procesando Archivo";
            }
            h1.innerHTML += ".";
            dots++;

        }, 500);

        $("#registros_file").append(h1);

        reader.onload = function (e) {
            var data = e.target.result;
            console.log(data);
            data = new Uint8Array(data);
            var workbook = XLSX.read(data, {type: 'array', cellDates: true});
            //            console.log(workbook);
            var result = {};
            workbook.SheetNames.forEach(function (sheetName) {
                var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {raw: true});
                if (roa.length)
                    result[sheetName] = roa;
            });
            // see the result, caution: it works after reader event is done.
            console.log(result);
            if (validar_info(result)) {
                let keys_archivo = Object.keys(result);
                let info_completa = new Array();
                $.each(keys_archivo, function (i) {
                    let info_hoja = result[keys_archivo[i]];
                    let info_completa_hoja = new Array();
                    $.each(info_hoja, function (j) {
                        let alias = Object.keys(info_hoja[j]);
                        let keys_hoja = transforma_arreglo(Object.keys(info_hoja[j]));
                        let json = {};
                        $.each(alias, function (k) {
                            if (info_hoja[j][alias[k]].toString().includes("(hora ")) {
                                var hoy = new Date(info_hoja[j][alias[k]].toString());
                                var dd = hoy.getDate();
                                var mm = hoy.getMonth() + 1; //January is 0!
                                var yyyy = hoy.getFullYear();
                                if (dd < 10) {
                                    dd = '0' + dd;
                                }
                                if (mm < 10) {
                                    mm = '0' + mm;
                                }
                                var fecha = yyyy + '-' + mm + '-' + dd;
                                json[keys_hoja[k]] = fecha;
                            } else {
                                json[keys_hoja[k]] = info_hoja[j][alias[k]];
                            }
                        });
                        json.alias = alias;
                        json.tipo_usuario = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
                        json.tipo_servicio = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio;
                        json.id360 = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario;
                        info_completa_hoja.push(json);
                    });
                    info_completa.push(info_completa_hoja);
                });
                console.log(info_completa);
                clearInterval(interval);
                mostrar_resultados(info_completa);
//                        RequestPOST("/API/registro_invitacion",info_completa).then(function(response){
//                            console.log(response);
//                        });

            } else {
                Swal.fire({
                    title: 'Archivo incompleto',
                    text: "EL archivo debe contener la informacion mínima: Nombre, Apellido paterno, Apellido materno y Correo."
                });
            }
        };
        reader.readAsArrayBuffer(oFile);
    } else {
        Swal.fire({
            title: 'Extención Inválida',
            text: "El archivo debe de ser un csv ó xlsx."
        });
    }
}
function mostrar_resultados(json) {

    $("#registros_file").empty();
    $("#registros_file").css({
        "position": "absolute",
        "top": "0",
        "left": "0",
        "background": "#343a40",
        "height": "100%",
        "width": "100%",
        "z-index": "100"
    });
    console.log(json);
    let div = document.createElement("div");
    div.className = "row col-12 m-0 p-2";
    div.style = "max-height: 100%; overflow: scroll;";

    let head = document.createElement("div");
    head.className = "row m-0 p-0 col-12 mb-4 mt-3";
    div.style = "font-size: 1.5rem;";

    let espacio1 = document.createElement("div");
    espacio1.className = "col-1";
    espacio1.style = "font-size: 1.5rem;";

    espacio1.innerHTML = '<i style="cursor:pointer;" class="fas fa-arrow-left"></i>';

    let espacio2 = document.createElement("div");
    espacio2.className = "col";

    let espacio3 = document.createElement("div");
    espacio3.className = "col-4";

    let registrar = document.createElement("input");
    registrar.type = "button";
    registrar.value = "Registrar";
    registrar.className = "btn btn-danger";

    let num = document.createElement("div");
    num.className = "col-1";
    num.innerHTML = '<strong>#</strong>';

    let nombre = document.createElement("div");
    nombre.className = "col-3";
    nombre.innerHTML = '<strong>Nombre</strong>';

    let apellido_paterno = document.createElement("div");
    apellido_paterno.className = "col-2";
    apellido_paterno.innerHTML = '<strong>Apellido Paterno</strong>';

    let apellido_materno = document.createElement("div");
    apellido_materno.className = "col-2";
    apellido_materno.innerHTML = '<strong>Apellido Materno</strong>';

    let correo = document.createElement("div");
    correo.className = "col-4";
    correo.innerHTML = '<strong>Correo</strong>';

    let hr = document.createElement("hr");
    hr.className = "col-12 border";

    espacio3.appendChild(registrar);
    head.appendChild(espacio1);
    head.appendChild(espacio2);
    head.appendChild(espacio3);

    div.appendChild(head);
    div.appendChild(num);
    div.appendChild(nombre);
    div.appendChild(apellido_paterno);
    div.appendChild(apellido_materno);
    div.appendChild(correo);
    div.appendChild(hr);

    $("#registros_file").append(div);

    espacio1.addEventListener("click", function () {
        $("#registros_file").empty();
        $("#registros_file").removeAttr("style");
    });
    registrar.addEventListener("click", function () {
        RequestPOST("/API/registro_invitacion", json).then(function (response) {
            swal.fire({
                text: response.mensaje
            }).then(function () {
                if (response.success) {
                    document.location.reload();
//                            $("#registros_file").empty();
//                            $("#registros_file").removeAttr("style");
                }
            });
        });

    });

//            let correos = new Array();
    let cont = 0;
    for (var k = 0; k < json.length; k++) {
        let arr = json[k];

        for (var i = 0; i < arr.length; i++) {
            let reg = arr[i];
//                    if (!correos.includes(reg.correo)) {
//                        correos.push(reg.correo);
            cont++;
            let reg_num = document.createElement("div");
            reg_num.className = "col-1";
            reg_num.innerHTML = cont;

            let reg_nombre = document.createElement("div");
            reg_nombre.className = "col-3";
            reg_nombre.innerHTML = reg.nombre;

            let reg_apellido_paterno = document.createElement("div");
            reg_apellido_paterno.className = "col-2";
            reg_apellido_paterno.innerHTML = reg.apellidopaterno;

            let reg_apellido_materno = document.createElement("div");
            reg_apellido_materno.className = "col-2";
            reg_apellido_materno.innerHTML = reg.apellidomaterno;

            let reg_correo = document.createElement("div");
            reg_correo.className = "col-4";
            reg_correo.innerHTML = reg.correo;

            let reg_hr = document.createElement("hr");
            reg_hr.className = "col-12 border-top";

            div.appendChild(reg_num);
            div.appendChild(reg_nombre);
            div.appendChild(reg_apellido_paterno);
            div.appendChild(reg_apellido_materno);
            div.appendChild(reg_correo);
            div.appendChild(reg_hr);
//                    }
        }
    }

}
function validar_info(info_archivo) {
    let procede = true;
    let keys_archivo = Object.keys(info_archivo);
    $.each(keys_archivo, function (i) {
        let info_hoja = info_archivo[keys_archivo[i]];
        console.log(info_hoja);
        $.each(info_hoja, function (j) {
            //                let alias = Object.keys(info_hoja[j]);
            let keys_hoja = transforma_arreglo(Object.keys(info_hoja[j]));
            if (!keys_hoja.includes("nombre")
                    || !keys_hoja.includes("apellidopaterno")
                    || !keys_hoja.includes("apellidomaterno")
                    || !keys_hoja.includes("correo")) {
                procede = false;
                return false;
            }
        });
        if (!procede) {
            return false;
        }
    });

    return procede;
}
function transforma_arreglo(arreglo) {
    let arreglo_mod = new Array();
    $.each(arreglo, function (i) {
        let val = arreglo[i];

        //Comvertimos el valor a minuscula
        val = val.toString().toLowerCase();
        if (val.toString().includes("correo") || val.toString().includes("mail")) {
            val = "correo";
        }
        //cambiamos las letras con acento por letras sin acento
        val = val.normalize('NFD')
                .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2")
                .normalize();
        //Quitamos los caracteres epeciales
        val = val.replace(/[^\w\s]/gi, '');
        //Quitamos los espcacios
        val = val.replace(/ /gi, '');
        arreglo_mod.push(val);
    });
    return arreglo_mod;
}
function form_info(valor, id, tipo) {
    let div = document.createElement("div");
    div.className = 'form-group row m-0 p-2';
    let label = document.createElement("label");
    label.for = id;
    label.className = 'col-sm-2 col-form-label';
    label.innerHTML = valor + ":";
    div.appendChild(label);
    let div2 = document.createElement("div");
    div2.className = 'col-sm-10';
    let input = document.createElement("input");
    input.type = tipo;
    input.className = 'form-control-plaintext input';
    input.id = id;
    input.placeholder = valor;
    div2.appendChild(input);
    div.appendChild(div2);
    return div;
}
/*******************/