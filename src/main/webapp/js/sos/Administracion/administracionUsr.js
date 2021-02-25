/* global Promise, DEPENDENCIA */

dataG_FULL().then(function (response) {
    dataG = response;
});
var Directorio;
var Usuario360;
var tel_a_agregar = new Array();
var usuario360_buscar = new Array();
ConsultarDirectorio().then(function (directorio) {
    for (var i = 0; i < directorio.directorio.length; i++) {
        //console.info(directorio.directorio[i].urlServicio);
        for (var j = 0; j < directorio.dependencias.length; j++) {
            if (directorio.dependencias[j].url === directorio.directorio[i].urlServicio) {
                directorio.directorio[i].aliasServicio = directorio.dependencias[j].alias;
                break;
            } else if (j === directorio.dependencias.length - 1) {
                console.error("No hubo match");
            }
        }
    }
    Directorio = directorio.directorio;
    console.info(Directorio);
    vuemodel();
});

function ConsultarDirectorio() {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/ConsultarDirectorio',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "fecha": getFecha(),
            "hora": getHora(),
            "tipo_usuario": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
            "tipo_servicio":JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio
        }),
        success: function (response) {
        },
        error: function (err) {
            console.error(err);
        }
    }));
}
function vuemodel() {
//    console.log("vuemodel");
//    console.log(Directorio);
    var json = Directorio;
    for (var i = 0; i < json.length; i++) {
        var elemento = BuscarIntegranteDataG(json[i].idUsuario);
        if (elemento.gps.estatus) {
            json.splice(i, 1);
            i--;
        }
    }
    vue = new Vue({
        components: {
            Multiselect: window.VueMultiselect.default
        },
        data: {
            value: [],
            options: json
        },
        methods: {
            customLabel(option) {

                return  option.Nombre + " " + option.idUsuario + " " + option.aliasServicio;
            },
            onChange(value) {
            },
            onSelect(op) {
                tel_a_agregar = new Array();
                console.log(op.idUsuario);
                tel_a_agregar.push(op);
//                tel_a_agregar = op.idUsuario;
            },
            onTouch() {
            }
        }
    }).$mount('#agregarTels');
}

document.getElementById("buscarIntegrante").addEventListener("click", function () {
    var cookie = getCookie("username_v3.2_" + DEPENDENCIA);
    if (cookie.length > 0) {
        if (tel_a_agregar !== "") {
            TraeInfoIntegrante(tel_a_agregar[0].idUsuario).then(function (response) {
                if (response.procede) {
                    console.log(response.integrante);
                    var integrante = response.integrante;

                    $(".divImgPerfil").css({
                        "background-image": "url('"+integrante.img+"')"
                    });
                    $("#id").val(integrante.idUsuarios_Movil);
                    $("#NombrePerfil").val(integrante.nombre+" "+integrante.apellido_paterno+" "+integrante.apellido_materno);
                    $("#DireccionPerfil").val(integrante.direccion);
                    $("#Fecha_nacimiento").val(integrante.fecha_nacimiento);
                    $("#TelPerfil").val(integrante.telefono);
                    $("#CorreoPerfil").val(integrante.correo);
                    $("#GenPerfil").val(integrante.genero);
                    $("#RhPerfil").val(integrante.rh);
                    $("#CondicionMedica").val(integrante.condicion_medica);
                    $("#AlergiasPerfil").val(integrante.alergias);
                    $("#ContactoNombre").val(integrante.contacto_nombre);
                    $("#ContactoNumero").val(integrante.contacto_telefono);

                    document.getElementById("bajaUsr").addEventListener("click", function () {
                        const Toast = Swal.fire({
                            title: "Deshabilitar",
                            html: "<p style=\"color: white;font-size: 15px; padding: 0; margin: 0; margin-top: 40px;margin-bottom: 40px;\">Seguro que desea deshabilitar a\n\
                               <br>" + integrante.nombre + " " + integrante.apellido_paterno + " " + integrante.apellido_materno + "</p>",
                            position: 'center',
                            showCancelButton: true,
                            focusConfirm: false,
                            confirmButtonText: "Confirmar",
                            cancelButtonText: "Cancelar"
                        }).then((result) => {
                            console.log(result);
                            if (result.value) {
                                var json = {
                                    "idUsuario": integrante.idUsuarios_Movil
                                };
                                $.ajax({
                                    type: 'POST',
                                    url: '/' + DEPENDENCIA + '/API/DeshabilitarUsr_Directorio',
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "json",
                                    data: JSON.stringify(json),
                                    success: function (response) {
                                        if (response.procede) {
                                            const Toast = Swal.mixin({
                                                toast: true,
                                                position: 'center',
                                                showConfirmButton: false,
                                                timer: 1000
                                            });
                                            Toast.fire({
                                                type: 'success',
                                                title: 'Usuario dado de baja'
                                            });
                                        }
                                        location.reload();
                                    },
                                    error: function (err) {
                                        console.log(err);
                                    }
                                });
                            } else {
                                window.location.reload();
                            }
                        });
                    });
                    document.getElementById("cancelar").addEventListener("click", function () {
                        console.log("cancelando");
                        $(".divImgPerfil").css({
                            "background-image": "url('')"
                        });
                        $("#id").val("");
                        $("#NombrePerfil").val("");
                        $("#DireccionPerfil").val("");
                        $("#Fecha_nacimiento").val("");
                        $("#TelPerfil").val("");
                        $("#CorreoPerfil").val("");
                        $("#GenPerfil").val("");
                        $("#RhPerfil").val("");
                        $("#CondicionMedica").val("");
                        $("#AlergiasPerfil").val("");
                        $("#ContactoNombre").val("");
                        $("#ContactoNumero").val("");
                    });
                } else {
                    console.log(response.mensaje);
                }
            });
        }
    } else {
        location.reload();
    }
});

function TraeInfoIntegrante(idUsuario) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/TraeInfoIntegrante',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "idUsuario": idUsuario
        }),
        success: function (response) {
        },
        error: function (err) {
            console.error(err);
        }
    }));
}

function BusquedaPorModulo() {

    return Promise.resolve($.ajax({
        type: 'GET',
         url: '/' + DEPENDENCIA + '/API/ListarModulos',
        contentType: "application/json; charset=utf-8",
        dataType: "json",        
        success: function (response){
        },
        error: function (err) {
            console.error("BusquedaFolioExterno");
            //clearInterval(intervalo);
            document.getElementById("botonbuscarproyectos").disabled = false;
            const Toast = Swal.mixin({
                toast: true,
                position: 'bottom-start',
                showConfirmButton: false,
                timer: 2000
            });

            Toast.fire({
                type: 'error',
                html: '<p style="font:14px Arial">Error al realizar la busqueda</p>'
            });
            document.getElementsByClassName("swal2-container")[0].style = "position: absolute; justify-content: center;overflow-y: auto; width: 100%; height: 140%; top: 0;";
            document.getElementById("ContainerBusquedaProyectos").appendChild(document.getElementsByClassName("swal2-container")[0]);
        }
    }));
}
BusquedaUsuarioControlador().then(function (res) {
    Usuario360 = res;
    vueCuenta360();
});
function BusquedaUsuarioControlador() {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/UsuariosControlador',
        contentType: "application/json; charset=utf-8",
        dataType: "json",  
        data: JSON.stringify({
            "tipo_usuario": JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario,
            "tipo_servicio":JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio
        }),
        success: function (response){
        },
        error: function (err) {            
        }
    }));
}
function vueCuenta360(){
    var json = Usuario360;
    vue = new Vue({
        components: {
            Multiselect: window.VueMultiselect.default
        },
        data: {
            value: [],
            options: json
        },
        methods: {
            customLabel(option) {                
                return  option.nombre;
            },
            onChange(value) {
            },
            onSelect(op) {                                
                usuario360_buscar = op;                
            },
            onTouch() {
            }
        }
    }).$mount('#agregarUsuarios360');
}
document.getElementById("buscarUsuarios360").addEventListener("click", function () {
    $("#contenidoSection").empty();
    BusquedaPorModulo().then(function (response) {        
            
        if (response !== null) {             
            var group = document.createElement("div");
            group.className = "input-group col-12 m-0 p-0 mb-2 ";
            var input_group = document.createElement("div");
            input_group.className = "input-group-prepend";
            var input_group_text = document.createElement("div");
            input_group_text.className = "input-group-text bg-light border-0 m-0 p-0";
            var input = document.createElement("input");
            input.type = "checkbox";
            input.style = "width: 25px; height: 25px;margin: 5px;margin-left: 10px;margin-right: 0;";
            input.id = "checkAll";
            var card = document.createElement("div");
            card.className = "card col border-0";
            var body = document.createElement("div");
            body.className = "card-body";
            var body_title = document.createElement("h5");
            body_title.className = "card-title m-0";
            body_title.innerHTML = "Modulos encontrados: " + response.length;
            var init = document.createElement("input");
            init.type = Button;
            init.value = "Guardar";
            init.style = "font:bold 8px Poppins; float:right; cursor:pointer;";
            init.className = "btn btn-secondary";
            var body_paragraph = document.createElement("p");
            input_group_text.appendChild(input);
            input_group.appendChild(input_group_text);
            group.appendChild(input_group);
            body_paragraph.className = "card-text";
            body_paragraph.innerHTML = "";
            body.appendChild(body_title);
            body_title.appendChild(init);
            body.appendChild(body_paragraph);
            card.appendChild(body);
            group.appendChild(card);
            document.getElementById("contenidoSection").appendChild(group);                        
            for (var i = 0; i < response.length; i++) {
                agregarModulos360(response[i]);
            }
            $("#checkAll").change(function () {
                for (var i = 0; i < response.length; i++) {
                    $("#check" + response[i].id).prop('checked', this.checked);
                }

            });
            var ArrayInit = new Array();
            init.addEventListener("click", function () {
                ArrayInit = new Array();                
                for (var i = 0; i < response.length; i++) {
                    if (document.getElementById("check" + response[i].id).checked) {
                        ArrayInit.push(response[i].id);
                    }
                }                       
                Swal.fire({
                    title: '<strong>Guardando </strong>',
                    html: "<label class=\"sweetAlTextLabel \">\n\
                            Antes de guardar un rol es nesesario asegurarse de que ese usuarios, sea correcto el rol que se le esta otrogando.</label>",
                    focusConfirm: true,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.value) {
                        var div1 = document.createElement("div");
                        div1.style = "position:absolute;height:100%;width:100%;background:#000000b5;top:0;left:0;z-index:100;";
                        div1.id = "consoleContainer";
                        var div2 = document.createElement("div");
                        div2.id = "console";
                        div2.style = "overflow: scroll;position:relative;height:90%;margin:auto;margin-top:4%;color:white;font-size:15px;font-family:LucidaConsole,Lucidasans-serif;";
                        div2.className = "col-8";
                        div1.appendChild(div2);
                        document.body.appendChild(div1);
                        var p = document.createElement("p");
                        p.innerHTML = "<strong>Guardando Roles a los Usuarios...</strong>";
                        div2.appendChild(p);
                        p.scrollIntoView();
                        var n = 0;
                        GuardarUsuarios360(ArrayInit, response, n,div2);
                    }
                });
            });
        }
    });
});
function agregarModulos360(modulo) {
    var cadena = usuario360_buscar.modulos;
    var tam = cadena.length;
    var ar = cadena.split(",", tam);    
    var group = document.createElement("div");
    group.className = "input-group col-12 m-0 p-0 mb-2 ";
    var input_group = document.createElement("div");
    input_group.className = "input-group-prepend";
    var input_group_text = document.createElement("div");
    input_group_text.className = "input-group-text bg-dark border-0 m-0 p-0";
    var input = document.createElement("input");
    input.type = "checkbox";
    input.style = "width: 25px; height: 25px;margin: 5px;filter: invert(1) saturate(0.5); margin-left: 10px;margin-right: 0;";
    input.id = "check" + modulo.id;        
    var card = document.createElement("div");
    card.className = "card text-white bg-dark col border-0";
    var header = document.createElement("div");
    header.className = "card-header";
    header.innerHTML = modulo.nombre;
    var body = document.createElement("div");
    body.className = "card-body";
    var body_title = document.createElement("h5");
    body_title.className = "card-title";
    body_title.innerHTML = modulo.nombre;    
    var body_paragraph = document.createElement("p");
    input_group_text.appendChild(input);
    input_group.appendChild(input_group_text);
    group.appendChild(input_group);
    body_paragraph.className = "card-text";
    body_paragraph.innerHTML = "";
    body.appendChild(body_title);
    body.appendChild(body_paragraph);
    card.appendChild(header);
    card.appendChild(body);
    group.appendChild(card);    
    document.getElementById("contenidoSection").appendChild(group);        
    for (var j = 0; j < ar.length; j++){        
       if(modulo.id === ar[j]){           
            $("#check" + modulo.id).prop("checked", true);
            //$("#check"+ modulo.id).attr("checked", true);
        }else {}
    }
}
function GuardarUsuarios360(ArrayInit, response, n,div2) {    
    if (n < ArrayInit.length) {
        for (var j = 0; j < response.length; j++) {
            if (ArrayInit[n] === response[j].id) {
                var p = document.createElement("p");
                p.innerHTML = "Guardando Roles: <strong>" + response[j].nombre + "</strong> ";
                div2.appendChild(p);
                p.scrollIntoView();           
                inicializarUsuarios360(ArrayInit, usuario360_buscar).then(function (respuesta) {
                    n++;                   
                    var p = document.createElement("p");
                    p.innerHTML = "Mensaje "+" --->   "+respuesta.mensaje+"<br>";
                    div2.appendChild(p);
                    p.scrollIntoView();
                    GuardarUsuarios360(ArrayInit, response, n,div2);
                });
            }
        }

    } else {
        var boton = document.createElement("input");
        boton.type = "button";
        boton.value = "Finalizar";
        boton.className="btn btn-light p-2 pl-4 pr-4 ml-4 mb-4";
        div2.appendChild(boton);
        boton.scrollIntoView();
        boton.addEventListener("click", function () {
            $("#consoleContainer").remove();
        });
    }
}
function inicializarUsuarios360(value, usuarios360){    
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/GuardarModulos360',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "id360":usuarios360.id360,                  
            "idModulo":usuarios360.idModulo,
            "modulo":"plataforma360",
            "url":usuarios360.url,
            "tipo_usuario":usuarios360.tipo_usuario,
            "tipo_servicio":usuarios360.tipo_servicio,
            "modulos": value, 
            "modulo_principal":usuarios360.modulo_principal                        
        }),
        success: function (response) {            
        },
        error: function (err) {
            console.log(err);
            var p = document.createElement("p");
            p.innerHTML = err.status + " " + err.statusText;
            document.getElementById("console").appendChild(p);
            p.scrollIntoView();
        }
    }));
}