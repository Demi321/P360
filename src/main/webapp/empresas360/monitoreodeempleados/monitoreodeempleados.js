/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const init_monitoreodeempleados = (id_usuario, tipo_usuario, tipo_servicio, tipo_area) => {

}

var idSys = document.getElementById("IdAdministrador").value;

var Grupos = BuscarGrupos(idSys);
var Usuarios = new Array;
DatosProyecto();
var flag = false;

var usuariosActivos = 0;
var numUsuarios;
//Vue.component("multiselect", window.VueMultiselect.default);
var dataG;

DataGrupos().then(function (data) {
    lottieAnimation.destroy();
    $("#LoadingLottie").remove();
    InsertarSeparador("Grupos Personalizados");
    var firebaseArray = new Array();
    dataG = data;
    numUsuarios = dataG.integrantes.length;
    for (var i = 0; i < numUsuarios; i++) {
        ////**console.log(dataG.integrantes[i]);
        if (dataG.integrantes[i].gps.hasOwnProperty("fecha")) {
            if (dataG.integrantes[i].gps.fecha !== "" /*&& dataG.integrantes[i].gps.fecha === getFecha()*/) {
                if (dataG.integrantes[i].gps.lat === null || dataG.integrantes[i].gps.lng === null) {
                    ////**console.log(dataG.integrantes[i]);
                    dataG.integrantes[i].gps.fecha = "";
                    dataG.integrantes[i].gps.hora = "";
                    dataG.integrantes[i].gps.lat = "";
                    dataG.integrantes[i].gps.lng = "";
                    dataG.integrantes[i].gps.ult.lat = "";
                    dataG.integrantes[i].gps.ult.lng = "";
                }
                if (dataG.integrantes[i].gps.lat !== "") {
                    usuariosActivos += 1;
                }
            } else {
                dataG.integrantes[i].gps.fecha = "";
                dataG.integrantes[i].gps.hora = "";
                dataG.integrantes[i].gps.lat = "";
                dataG.integrantes[i].gps.lng = "";
                dataG.integrantes[i].gps.ult.lat = "";
                dataG.integrantes[i].gps.ult.lng = "";
            }
        }
    }
    for (var i = 0; i < dataG.GruposPersonalizados.length; i++) {
        //InsertarGrupo(dataG.GruposPersonalizados[i].idgruposUsuarioSys, dataG.GruposPersonalizados[i].nombre);
        InsertarGrupo(dataG.GruposPersonalizados[i].idgruposUsuarioSys, dataG.GruposPersonalizados[i].nombre, dataG.GruposPersonalizados[i].integrantes);
        firebaseArray = new Array();
        idUsers = new Array();
        jsonArray = new Array();
        if (!dataG.GruposPersonalizados[i].integrantes) {
            dataG.GruposPersonalizados[i].integrantes = new Array();
        }
        for (var j = 0; j < dataG.GruposPersonalizados[i].integrantes.length; j++) {
            var integrante;
            for (var k = 0; k < dataG.integrantes.length; k++) {
                if (dataG.integrantes[k].id360 === dataG.GruposPersonalizados[i].integrantes[j]) {
                    integrante = dataG.integrantes[k];
                    if (integrante.FireBaseKey !== null && integrante.FireBaseKey !== "null" && integrante.FireBaseKey !== "") {
                        var jsonFirebase = {};
                        jsonFirebase[integrante.idUsuarios_Movil] = integrante.FireBaseKey;
                        firebaseArray.push("'" + integrante.FireBaseKey + "'");
                        idUsers.push("'" + integrante.idUsuarios_Movil + "'");
                        jsonArray.push(jsonFirebase);
                    }
                    break;
                }

            }
            //**console.log("Buscando...");
            //**console.log(dataG.GruposPersonalizados[i].integrantes[j]);
            //**console.log(integrante);
            if (integrante !== undefined) {
                if (integrante.success) {
                    InsertarIntegrante(dataG.GruposPersonalizados[i].idgruposUsuarioSys, dataG.GruposPersonalizados[i].nombre, integrante);
                } else {
                    console.warn("usuario sin perfil");
                    //**console.log(integrante);
                }
            } else {
                console.warn("Integrante no encontrado en array de integrantes...");
            }
        }
        //**console.log(dataG.GruposPersonalizados[i]);
        flag = false;
        SeleccionarGrupo(dataG.GruposPersonalizados[i]);
        NuevoIntegrante(dataG.GruposPersonalizados[i].idgruposUsuarioSys, dataG.GruposPersonalizados[i].nombre);
        EditarGrupo(dataG.GruposPersonalizados[i].idgruposUsuarioSys);
        LlamadaGrupal(dataG.GruposPersonalizados[i].idgruposUsuarioSys, firebaseArray, idUsers, JSON.stringify(jsonArray));
        ChatGrupal(dataG.GruposPersonalizados[i].idgruposUsuarioSys, firebaseArray, idUsers, JSON.stringify(jsonArray));
    }

    InsertarSeparador("Grupos Automáticos");
    //Crear nuevo div para dividir los grupos automaticos 
    let div_ga = document.createElement("div");
    div_ga.id = "div_ga";
    document.getElementById("accordion").appendChild(div_ga);
    for (var i = 0; i < dataG.GruposAutomaticos.length; i++) {
        //InsertarGrupo(dataG.GruposAutomaticos[i].idgruposUsuarioSys, dataG.GruposAutomaticos[i].nombre);
        InsertarGrupoA(dataG.GruposAutomaticos[i].idgruposUsuarioSys, dataG.GruposAutomaticos[i].nombre, dataG.GruposAutomaticos[i].integrantes);
        firebaseArray = new Array();
        idUsers = new Array();
        jsonArray = new Array();
        if (!dataG.GruposAutomaticos[i].integrantes) {
            dataG.GruposAutomaticos[i].integrantes = new Array();
        }
        for (var j = 0; j < dataG.GruposAutomaticos[i].integrantes.length; j++) {
            var integrante;
            for (var k = 0; k < dataG.integrantes.length; k++) {
                if (dataG.integrantes[k].id360 === dataG.GruposAutomaticos[i].integrantes[j]) {
                    integrante = dataG.integrantes[k];
                    if (integrante.FireBaseKey !== null && integrante.FireBaseKey !== "null" && integrante.FireBaseKey !== "") {
                        var jsonFirebase = {};
                        jsonFirebase[integrante.idUsuarios_Movil] = integrante.FireBaseKey;
                        firebaseArray.push("'" + integrante.FireBaseKey + "'");
                        idUsers.push("'" + integrante.idUsuarios_Movil + "'");
                        jsonArray.push(jsonFirebase);
                    }
                    break;
                }
            }
            //**console.log("Buscando...");
            //**console.log(dataG.GruposAutomaticos[i].integrantes[j]);
            //**console.log(integrante);
            if (integrante !== undefined) {
                if (integrante.success) {
                    //**console.log(dataG.GruposAutomaticos[i]);
                    InsertarIntegrante(dataG.GruposAutomaticos[i].idgruposUsuarioSys, dataG.GruposAutomaticos[i].nombre, integrante);
                } else {
                    console.warn("usuario sin perfil");
                    //**console.log(integrante);
                }
            } else {
                console.warn("Integrante no encontrado en array de integrantes...");
            }
        }
        //**console.log(dataG.GruposAutomaticos[i]);
        flag = false;
        SeleccionarGrupo(dataG.GruposAutomaticos[i]);
        //
        //NuevoIntegrante(dataG.GruposAutomaticos[i].idgruposUsuarioSys, dataG.GruposAutomaticos[i].nombre);
        //EditarGrupo(dataG.GruposAutomaticos[i].idgruposUsuarioSys);
        LlamadaGrupal(dataG.GruposAutomaticos[i].idgruposUsuarioSys, firebaseArray, idUsers, JSON.stringify(jsonArray));
        ChatGrupal(dataG.GruposAutomaticos[i].idgruposUsuarioSys, firebaseArray, idUsers, JSON.stringify(jsonArray));
    }
    //SeleccionarGrupoGeneral(dataG.integrantes);
    var GA = document.getElementById("linkGA").firstChild;
    document.getElementById("linkGA").style = "display: inline-block;width: max-content;";
    var span = document.createElement("span");
    span.innerHTML = "Registrados: " + numUsuarios + " Activos: " + usuariosActivos;
    span.style = "position: absolute;    right: 5px;    top: 25%;    font: 10px Arial;";
    GA.appendChild(span);


    CrearNuevoGrupo();
    var ga = document.getElementById("Grupos Automáticos");
    var gp = document.getElementById("Grupos Personalizados");

    try {
        colocarMarcadores(dataG.integrantes);
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    } catch (e) {

    }
    ga.addEventListener("click", function () {
        var auto = document.getElementById("inputGruposAutomáticos");
        if (!auto.checked) {
            auto.checked = true;
        } else {
            auto.checked = false;
        }
        HabilitaChecks("GruposAutomáticos");
    });
    gp.addEventListener("click", function () {
        var perso = document.getElementById("inputGruposPersonalizados");
        if (!perso.checked) {
            perso.checked = true;
        } else {
            perso.checked = false;
        }
        HabilitaChecks("GruposPersonalizados");
    });
    ga.click();
    //////////////////////////
    for (var i = 0; i < dataG.GruposPersonalizados.length; i++) {
        firebaseArray = new Array();
        idUsers = new Array();
        jsonArray = new Array();
        if (!dataG.GruposPersonalizados[i].integrantes) {
            dataG.GruposPersonalizados[i].integrantes = new Array();
        }
        for (var j = 0; j < dataG.GruposPersonalizados[i].integrantes.length; j++) {
            var integrante;
            for (var k = 0; k < dataG.integrantes.length; k++) {
                if (dataG.integrantes[k].id360 === dataG.GruposPersonalizados[i].integrantes[j]) {
                    integrante = dataG.integrantes[k];
                    if (integrante.FireBaseKey !== null && integrante.FireBaseKey !== "null" && integrante.FireBaseKey !== "") {
                        var jsonFirebase = {};
                        firebaseArray = new Array();
                        idUsers = new Array();
                        jsonArray = new Array();
                        jsonFirebase[integrante.idUsuarios_Movil] = integrante.FireBaseKey;
                        firebaseArray.push("'" + integrante.FireBaseKey + "'");
                        idUsers.push("'" + integrante.idUsuarios_Movil + "'");
                        jsonArray.push(jsonFirebase);
                        //Insertar boton de llamada personal
                        if (integrante.success) {
                            LlamadaGrupal(dataG.GruposPersonalizados[i].idgruposUsuarioSys + "_" + integrante.id360, firebaseArray, idUsers, JSON.stringify(jsonArray));
                        } else {
                            console.warn("usuario sin perfil");
                            //**console.log(integrante);
                        }
                    }
                    break;
                }
            }
        }
    }
    for (var i = 0; i < dataG.GruposAutomaticos.length; i++) {
        firebaseArray = new Array();
        idUsers = new Array();
        jsonArray = new Array();
        if (!dataG.GruposAutomaticos[i].integrantes) {
            dataG.GruposAutomaticos[i].integrantes = new Array();
        }
        for (var j = 0; j < dataG.GruposAutomaticos[i].integrantes.length; j++) {
            var integrante;
            for (var k = 0; k < dataG.integrantes.length; k++) {
                if (dataG.integrantes[k].id360 === dataG.GruposAutomaticos[i].integrantes[j]) {
                    integrante = dataG.integrantes[k];
                    if (integrante.FireBaseKey !== null && integrante.FireBaseKey !== "null" && integrante.FireBaseKey !== "") {
                        var jsonFirebase = {};
                        firebaseArray = new Array();
                        idUsers = new Array();
                        jsonArray = new Array();
                        jsonFirebase[integrante.idUsuarios_Movil] = integrante.FireBaseKey;
                        firebaseArray.push("'" + integrante.FireBaseKey + "'");
                        idUsers.push("'" + integrante.idUsuarios_Movil + "'");
                        jsonArray.push(jsonFirebase);
                        //Insertar boton para llamada individual
                        if (integrante.success) {
                            LlamadaGrupal(dataG.GruposAutomaticos[i].idgruposUsuarioSys + "_" + integrante.id360, firebaseArray, idUsers, JSON.stringify(jsonArray));
                        } else {
                            console.warn("usuario sin perfil");
                            //**console.log(integrante);
                        }
                    }
                    break;
                }
            }
        }
    }
    let directorio = dataG.integrantes;
    //**console.log(directorio);
    for (var i = 0; i < directorio.length; i++) {
        if (directorio[i].failure) {
            directorio.splice(i, 1);
            i--;
        }
    }
    new Vue({
        el: "#buscarContactos_monitoreo",
        components: {
            Multiselect: window.VueMultiselect.default
        },
        data() {
            return {
                value: [],
                options: directorio
            }
        },
        methods: {
            customLabel(option) {
                return option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno + " ";
            },
            onClosed(value) {
                ////**console.log(value);
            },

            onTag(value) {
                ////**console.log(value);
            },

            onRemove(value) {
                ////**console.log(value);
            },
            onTouch(value) {
                ////**console.log(value);
                this._data.value = null;
            },
            onInput(value) {
                //**console.log(value);
                $(".avada_kedavra").removeClass("avada_kedavra");
                let element = $("#div_ga #" + value.id360);
                //**console.log(element);
                //**console.log(element[0]);
                //validar que el grupo no este ya abierto 
                let c = element.parent().parent().parent()[0].className;
                if (!c.includes("show")) {
                    element.parent().parent().parent().parent().find("button").click();
                }
                element.parent().click();
                setTimeout(() => {
                    element[0].scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }, 500);
                element.addClass("avada_kedavra");
            }
        }
    });
    for (var i = 0; i < directorio.length; i++) {
        let user = directorio[i];
        try {
            contacto_chat(user);
        } catch (q) {
            console.warn(q)
        }

    }

});
function EditarGrupo(id_Grupo) {

    var div = document.createElement("div");
    div.className = "col-1 p-0 m-0";
    div.style = "    width: 100%;height: 100%;position: absolute;right: 0;";



    var botoneditar = document.createElement("input");
    botoneditar.type = "button";
    botoneditar.value = "";
    botoneditar.className = "edit";
    botoneditar.id = "editar" + id_Grupo;

    div.appendChild(botoneditar);


    document.getElementById("heading" + id_Grupo).appendChild(div);

    botoneditar.addEventListener("click", function () {
        if (div.className === "col-1 p-0 m-0 active") {
            div.style.background = "none";
            div.className = "col-1 p-0 m-0";

            document.getElementById("BotonformGrupo" + id_Grupo).style.display = "none";

            var integrantes = document.getElementsByClassName("DG" + id_Grupo);
            for (var i = 0; i < integrantes.length; i++) {
                integrantes[i].style.display = "none";
            }
        } else {

            div.style.background = "black";
            div.className = "col-1 p-0 m-0 active";

            document.getElementById("BotonformGrupo" + id_Grupo).style.display = "unset";

            var integrantes = document.getElementsByClassName("DG" + id_Grupo);
            for (var i = 0; i < integrantes.length; i++) {
                integrantes[i].style.display = "unset";
            }
        }

    });

}
function LlamadaGrupal(id_Grupo, firebaseArray, idUsers, jsonArray) {
    //**console.log(id_Grupo);
    var div = document.createElement("div");
    div.className = "col-1 p-0 m-0 call_individual";
    div.style = "width:100%;height:33px;";
    if (firebaseArray.length) {
        var botoncall = document.createElement("input");
        botoncall.type = "button";
        botoncall.value = "";
        botoncall.className = "call";
        botoncall.id = "call" + id_Grupo;
        botoncall.title = "llamar";
//        botoncall.setAttribute("onclick", "iniciarllamada([" + firebaseArray + "],[" + idUsers + "]," + jsonArray + ")");
        /*Cambios prueba fernando*/
        botoncall.setAttribute("onclick", "iniciarllamada_360([" + idUsers + "])");
        /*************************/
        div.appendChild(botoncall);

    }
    document.getElementById("heading" + id_Grupo).appendChild(div);
}

function ChatGrupal(id_Grupo, firebaseArray, idUsers, jsonArray) {

    var div = document.createElement("div");
    div.className = "col-1 p-0 m-0";
    div.style = "width:100%;height:33px;";
    if (firebaseArray.length) {
        var botonMsg = document.createElement("input");
        botonMsg.type = "button";
        botonMsg.value = "";
        botonMsg.className = "MsgGrupal";
        botonMsg.id = "MsgGrupal" + id_Grupo;
        botonMsg.title = "Enviar Mensaje Grupal";
        botonMsg.setAttribute("onclick", "chatGrupal([" + firebaseArray + "],[" + idUsers + "]," + jsonArray + ")");
        div.appendChild(botonMsg);

    }
    document.getElementById("heading" + id_Grupo).appendChild(div);
}


function iniciarllamada_360(idUsers) {
    let array_users = new Array();
    $.each(idUsers, (i) => {
        array_users.push({id360: idUsers[i]});
    });
    //**console.log("array users ----->");
    //**console.log(array_users);
    let json = {
        "id360": sesion_cookie.id_usuario,
        "to_id360": array_users,
        "type": "200",
        "tipo": "llamadaS"
    };
    const Toast = Swal.mixin({
        toast: true,
        position: 'center'
    });
    Toast.fire({
        html: "<h1 style=\"color: #D7D7D7;\">Solicitar Llamada</h1><p style=\"color: white;font-size: 15px;\">Está a punto de solicitar una llamada grupal <br><label style=\"color: bisque;font-size: 15px;margin: 0;\"></label><br>Si desea continuar presione en llamar <br><label style=\"color: bisque;font-size: 15px;margin: 0;\"></label></p>",

        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Llamar!'
    }).then((result) => {
        if (result.value) {
            const Toast = Swal.mixin({
                toast: true,
                position: 'center',
                showConfirmButton: false,
                timer: 1000
            });
            Toast.fire({
                type: 'success',
                title: 'Solicitando llamada'
            }).then(function () {
                RequestPOST("/API/notificacion/llamada360", json).then((response) => {
                    //**console.log(response);
                    if (response.success) {
                        RegistroNotificaciones(idUsers, response.registro_llamada.idLlamada).then(function (RespuestaNotificados) {
                            //**console.log(RespuestaNotificados);
                            for (var i = 0; i < response.receptores.length; i++) {
                                if (!response.receptores[i].web && response.receptores[i].movil.success.toString() === '0') {
                                    RegistrarEnvioCancelado(RespuestaNotificados[response.receptores.id360]);
                                }
                            }
                        });
                        var div = document.createElement("div");
                        div.id = "div" + "idUsuarios_Movil";
                        //div.style="visibility: hidden";

                        var form = document.createElement("form");
                        form.method = "POST";
                        form.action = "/" + DEPENDENCIA + "/OperadorEmpresa";
                        form.target = "_blank";
                        form.id = "LlamadaSaliente";


                        var apikey = document.createElement("input");
                        apikey.type = "hidden";
                        apikey.id = response.credenciales.apikey;
                        apikey.value = response.credenciales.apikey;
                        apikey.name = "apikey";

                        var sesion = document.createElement("input");
                        sesion.type = "hidden";
                        sesion.id = response.credenciales.idsesion;
                        sesion.value = response.credenciales.idsesion;
                        sesion.name = "session";

                        var token = document.createElement("input");
                        token.type = "hidden";
                        token.id = response.credenciales.token;
                        token.value = response.credenciales.token;
                        token.name = "token";

                        var idLlamada = document.createElement("input");
                        idLlamada.type = "hidden";
                        idLlamada.id = response.registro_llamada.idLlamada;
                        idLlamada.value = response.registro_llamada.idLlamada;
                        idLlamada.name = "idLlamada";
                        var modo = document.createElement("input");
                        modo.type = "hidden";
                        modo.id = "modo";
                        modo.value = "201";
                        modo.name = "modo";

                        var fecha = document.createElement("input");
                        fecha.type = "hidden";
                        fecha.id = "fecha";
                        fecha.value = getFecha();
                        fecha.name = "fecha";

                        var hora = document.createElement("input");
                        hora.type = "hidden";
                        hora.id = "hora";
                        hora.value = getHora();
                        hora.name = "hora";

                        var idSys = document.createElement("input");
                        idSys.type = "hidden";
                        idSys.id = "idSys";
                        idSys.value = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys;
                        idSys.name = "idSys";

                        var origen = document.createElement("input");
                        origen.type = "hidden";
                        origen.id = "origen";
                        origen.value = DEPENDENCIA;
                        origen.name = "origen";

                        var integrantes = document.createElement("input");
                        integrantes.type = "hidden";
                        integrantes.id = "integrantes";
                        integrantes.value = idUsers;
                        integrantes.name = "integrantes";

                        var tipo_usuario = document.createElement("input");
                        tipo_usuario.type = "hidden";
                        tipo_usuario.id = "tipo_usuario";
                        tipo_usuario.value = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
                        tipo_usuario.name = "tipo_usuario";

                        var tipo_servicio = document.createElement("input");
                        tipo_servicio.type = "hidden";
                        tipo_servicio.id = "tipo_servicio";
                        tipo_servicio.value = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio;
                        tipo_servicio.name = "tipo_servicio";


                        var submit = document.createElement("input");
                        submit.type = "submit";
                        submit.value = "Atender";
                        submit.style = "background-color: #585858 ;  border: 1px solid #2E2E2E; border-radius:4px; color: gray;   text-align: center;  text-decoration: none;   font-size: 16px;  margin-left:1%; ";
                        form.appendChild(apikey);
                        form.appendChild(sesion);
                        form.appendChild(token);
                        form.appendChild(idLlamada);
                        form.appendChild(modo);
                        form.appendChild(origen);
                        form.appendChild(fecha);
                        form.appendChild(hora);
                        form.appendChild(idSys);
                        form.appendChild(integrantes);
                        form.appendChild(tipo_usuario);
                        form.appendChild(tipo_servicio);
                        form.appendChild(submit);
                        div.appendChild(form);
                        document.body.appendChild(div);

                        form.submit();
                        document.getElementById("div" + "idUsuarios_Movil").parentNode.removeChild(document.getElementById("div" + "idUsuarios_Movil"));

                    } else {
                        swal.fire({
                            text: "Los usuarios no fueron notificados"
                        });
                    }
                });
            });
        }
    });
    estiloSwal();
    var header = document.getElementsByClassName("swal2-header");
    //console.info(header);
    if (header.length)
        header[0].style = "background:none;";
}
function iniciarllamada(firebaseArray, idUsers, jsonArray) {

    var notificados = {};
    for (var i = 0; i < jsonArray.length; i++) {
        var json = jsonArray[i];

        var idJson = Object.keys(json);
        notificados[idJson] = json[idJson];
    }


    const Toast = Swal.mixin({
        toast: true,
        position: 'center'
    });
    Toast.fire({
        html: "<h1 style=\"color: #D7D7D7;\">Solicitar Llamada</h1><p style=\"color: white;font-size: 15px;\">Está a punto de solicitar una llamada grupal <br><label style=\"color: bisque;font-size: 15px;margin: 0;\"></label><br>Si desea continuar presione en llamar <br><label style=\"color: bisque;font-size: 15px;margin: 0;\"></label></p>",

        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Llamar!'
    }).then((result) => {
        if (result.value) {
            const Toast = Swal.mixin({
                toast: true,
                position: 'center',
                showConfirmButton: false,
                timer: 1000
            });

            Toast.fire({
                type: 'success',
                title: 'Solicitando llamada'
            }).then(function () {





                GenerarTicket("llamadaS").then(function (response) {

                    var IDLlamada = response.ticket;

                    GenerarCredenciales().then(function (credenciales) {


                        RegistroNotificaciones(idUsers, IDLlamada).then(function (RespuestaNotificados) {
                            //**console.log(RespuestaNotificados);
                            var idNotificados = Object.keys(RespuestaNotificados);
                            var idUsrs = Object.keys(notificados);

                            for (var i = 0; i < idUsrs.length; i++) {

                                if (notificados[idUsrs[i]] !== "" && notificados[idUsrs[i]] !== null && notificados[idUsrs[i]] !== "null") {
                                    var elemento = BuscarIntegranteDataG(idUsrs[i]);
                                    if (!elemento.gps.estatus) {
                                        FireBaseSolicitudVideo(notificados[idUsrs[i]], credenciales.apikey, credenciales.idsesion, credenciales.token, RespuestaNotificados[idUsrs[i]]);
                                    } else {
                                        RegistrarEnvioCancelado(RespuestaNotificados[idUsrs[i]]);
                                    }

                                }

                            }
                        });

                        var div = document.createElement("div");
                        div.id = "div" + "idUsuarios_Movil";
                        //div.style="visibility: hidden";

                        var form = document.createElement("form");
                        form.method = "POST";
                        form.action = "/" + DEPENDENCIA + "/OperadorEmpresa";
                        form.target = "_blank";
                        form.id = "LlamadaSaliente";


                        var apikey = document.createElement("input");
                        apikey.type = "hidden";
                        apikey.id = credenciales.apikey;
                        apikey.value = credenciales.apikey;
                        apikey.name = "apikey";

                        var sesion = document.createElement("input");
                        sesion.type = "hidden";
                        sesion.id = credenciales.idsesion;
                        sesion.value = credenciales.idsesion;
                        sesion.name = "session";

                        var token = document.createElement("input");
                        token.type = "hidden";
                        token.id = credenciales.token;
                        token.value = credenciales.token;
                        token.name = "token";

                        var idLlamada = document.createElement("input");
                        idLlamada.type = "hidden";
                        idLlamada.id = IDLlamada;
                        idLlamada.value = IDLlamada;
                        idLlamada.name = "idLlamada";
                        var modo = document.createElement("input");
                        modo.type = "hidden";
                        modo.id = "modo";
                        modo.value = "201";
                        modo.name = "modo";

                        var fecha = document.createElement("input");
                        fecha.type = "hidden";
                        fecha.id = "fecha";
                        fecha.value = getFecha();
                        fecha.name = "fecha";

                        var hora = document.createElement("input");
                        hora.type = "hidden";
                        hora.id = "hora";
                        hora.value = getHora();
                        hora.name = "hora";

                        var idSys = document.createElement("input");
                        idSys.type = "hidden";
                        idSys.id = "idSys";
                        idSys.value = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys;
                        idSys.name = "idSys";

                        var origen = document.createElement("input");
                        origen.type = "hidden";
                        origen.id = "origen";
                        origen.value = DEPENDENCIA;
                        origen.name = "origen";

                        var integrantes = document.createElement("input");
                        integrantes.type = "hidden";
                        integrantes.id = "integrantes";
                        integrantes.value = idUsers;
                        integrantes.name = "integrantes";

                        var tipo_usuario = document.createElement("input");
                        tipo_usuario.type = "hidden";
                        tipo_usuario.id = "tipo_usuario";
                        tipo_usuario.value = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
                        tipo_usuario.name = "tipo_usuario";

                        var tipo_servicio = document.createElement("input");
                        tipo_servicio.type = "hidden";
                        tipo_servicio.id = "tipo_servicio";
                        tipo_servicio.value = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio;
                        tipo_servicio.name = "tipo_servicio";


                        var submit = document.createElement("input");
                        submit.type = "submit";
                        submit.value = "Atender";
                        submit.style = "background-color: #585858 ;  border: 1px solid #2E2E2E; border-radius:4px; color: gray;   text-align: center;  text-decoration: none;   font-size: 16px;  margin-left:1%; ";
                        form.appendChild(apikey);
                        form.appendChild(sesion);
                        form.appendChild(token);
                        form.appendChild(idLlamada);
                        form.appendChild(modo);
                        form.appendChild(origen);
                        form.appendChild(fecha);
                        form.appendChild(hora);
                        form.appendChild(idSys);
                        form.appendChild(integrantes);
                        form.appendChild(tipo_usuario);
                        form.appendChild(tipo_servicio);
                        form.appendChild(submit);
                        div.appendChild(form);
                        document.body.appendChild(div);

                        form.submit();
                        document.getElementById("div" + "idUsuarios_Movil").parentNode.removeChild(document.getElementById("div" + "idUsuarios_Movil"));

                    });
                });
            });


        }
    });
    estiloSwal();
    var header = document.getElementsByClassName("swal2-header");
    //console.info(header);
    if (header.length)
        header[0].style = "background:none;";


}
function chatGrupal(firebaseArray, idUsers, jsonArray) {


    var notificados = {};
    for (var i = 0; i < jsonArray.length; i++) {
        var json = jsonArray[i];

        var idJson = Object.keys(json);
        notificados[idJson] = json[idJson];
    }






    Swal.fire({
        title: 'Enviar mensaje',
        html: //-------------------------TITULO
                //-------------------------Body 
                '<label class="sweetalrt" style="padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 75%;">Mensaje:</label>' +
                '<textarea id="swal-input" class="multiselect__textarea" rows="10" cols="50" maxlength="250"></textarea>',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            return [
                document.getElementById('swal-input').value
            ];
        }
    }).then((result) => {

        if (result.value) {
            if (result.value[0] !== "") {
                //**console.log(result.value[0]);
                var idUsrs = Object.keys(notificados);
                for (var i = 0; i < idUsrs.length; i++) {

                    if (notificados[idUsrs[i]] !== "" && notificados[idUsrs[i]] !== null && notificados[idUsrs[i]] !== "null") {
                        FireBaseChat(notificados[idUsrs[i]], result.value[0]);
                    }

                }
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 1000
                });
                Toast.fire({
                    type: 'success',
                    title: 'Enviando mensaje...'
                }).then();

            }
        }
    });




}
function SeleccionarGrupo(data) {
    var a = document.getElementById("link" + data.idgruposUsuarioSys);
    a.addEventListener("click", function () {
        var gpo = document.getElementById("input" + data.idgruposUsuarioSys);
        if (!gpo.checked) {
            gpo.click();
        } else {
            gpo.click();
        }
    });
}

function SeleccionarGrupoGeneral(data) {
    var a = document.getElementById("linkGA");
    a.addEventListener("click", function () {

        if (markers.length) {
            for (var i = 0; i < markers.length; i++) {
                //if (markers[i].id !== "elemento"+data.integrantes[i]) {
                markers[i].setMap(null);
                // }

            }
        }

        var jsonIntegrantes = new Array();
        for (var i = 0; i < data.integrantes.length; i++) {
            for (var k = 0; k < dataG.integrantes.length; k++) {
                if (dataG.integrantes[k].idUsuarios_Movil === data.integrantes[i]) {
                    jsonIntegrantes.push(dataG.integrantes[k]);
                    break;
                }

            }
        }
        colocarMarcadores(jsonIntegrantes);


    });
}
function RegistroNotificaciones(idUsers, idLlamada) {
    var json = {};
    if (JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).hasOwnProperty("tipo_usuario") && JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).hasOwnProperty("tipo_servicio")) {
        json = {
            "idUsuarios_Movil": idUsers,
            "idLlamada": idLlamada,
            "fecha": getFecha(),
            "hora": getHora(),
            "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
            "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio
        };
    } else {
        json = {
            "idUsuarios_Movil": idUsers,
            "idLlamada": idLlamada,
            "fecha": getFecha(),
            "hora": getHora()
        };
    }

    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/LlamadaSaliente/RegistrarNotificaciones',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(json),
        success: function (response) {
        },
        error: function (err) {
        }
    }));

}

function CrearNuevoGrupo() {
//form para crear un nuevo grupo


    var form = document.createElement("form");
    form.id = "formNuevoGrupo";
    form.className = "formNuevoGrupo";
    form.action = "/" + DEPENDENCIA + "/NuevoGrupo";
    form.method = "POST";
    form.style = "    display: contents;";

    var boton = document.createElement("input");
    boton.type = "submit";
    boton.value = "";
    boton.className = "AddNewGroup";
    //boton.style = "filter:invert(0.5)";


    form.appendChild(boton);

    document.getElementById("old_toggle").appendChild(form);

    $("#formNuevoGrupo").submit(function (e) {

        e.preventDefault();
        SweetAlertNuevoGrupo(idSys);
    });
}
function SweetAlertNuevoGrupo(idSys) {




    Swal.fire({
        title: 'Crear nuevo grupo',
        html: //-------------------------TITULO
                //-------------------------Body 
                '<label class="sweetalrt" style="padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 75%;">Nombre del grupo</label>' +
                '<input id="swal-input" class="multiselect__input multiselect__input2 p-1" value="" autocomplete="off">',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            return [
                document.getElementById('swal-input').value
            ];
        }
    }).then((result) => {

        if (result.value) {
            if (result.value[0] !== "") {
                var json = {
                    "idSys": idSys,
                    "grupo": result.value[0]
                };
                agregarGrupo(json).then(function (response) {

                    Swal.fire({
                        title: 'Crear nuevo grupo',
                        html: //-------------------------TITULO
                                //-------------------------Body 
                                '<label class="sweetalrt" style="display: contents; padding: 5px; color: #fff; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;">' + "Grupo: <label style=\"font: bold 13px arial; margin-left: 5px;margin-right: 5px;\">" + response.grupo + "</label><br>" + response.estado + '</label>',

                    }).then(function () {
                        window.location.reload();
                    });
                    estiloSwal();
                    var cancel = document.getElementsByClassName("swal2-cancel");
                    if (cancel.length)
                        cancel[0].style = "display:none;";
                    if ($("#swal2-content").length)
                        document.getElementById("swal2-content").style = "padding-top: 1rem;";
                });
            }
        }
    });
    estiloSwal();

    document.querySelector('#swal-input').addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) { // 13 is enter
            //$("#BusquedaFolioExterno").click();

            if (document.getElementById("swal-input").value !== "") {

                var confirmar = document.getElementsByClassName("swal2-confirm");

                confirmar[0].click();
            }
        }
    });

}
function agregarGrupo(json) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/NuevoGrupo',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(json),
        success: function (response) {


        },
        error: function (err) {

        }
    }));

}
function NuevoIntegrante(id_Grupo, NombreGrupo) {
    //**console.log("NuevoIntegrante");
    //**console.log(id_Grupo);
    //**console.log(NombreGrupo);
    //**console.log("NuevoIntegrante");
//    var divnew = document.createElement("div");
//    divnew.id = "nuevo integrante";
//    divnew.className="col-1";
    var pnew = document.createElement("p");
    pnew.className = "";
    pnew.style = "height: 100%; margin: 0; padding: 20%;";
    var form = document.createElement("form");
    form.id = "formNuevoIntegrante" + id_Grupo;
    form.className = "formNuevoIntegrante" + id_Grupo;
    form.action = "/" + DEPENDENCIA + "/NuevoIntegrante";
    form.method = "POST";
    form.className = "col-1 m-0 p-0";
    var newlabel = document.createElement("label");
    newlabel.id = "label" + id_Grupo;
    newlabel.innerHTML = "   Añade un nuevo integrante a: " + NombreGrupo;
    newlabel.style = "display:none;font-size: 10px;margin-left:12%; color:black";
    var input = document.createElement("input");
    input.id = "idUsuarios_Movil" + id_Grupo;
    input.name = "idUsuarios_Movil";
    input.style = "color:black; width: calc(94% - 30px);  border:none;border-bottom:2px solid #ccc; background:none;";
    input.type = "hidden";
    input.placeholder = "Inserta su número telefonico";
    var input_id = document.createElement("input");
    input_id.value = id_Grupo;
    input_id.type = "hidden";
    input_id.name = "id_Grupo";
    var input_Nom = document.createElement("input");
    input_Nom.value = NombreGrupo;
    input_Nom.type = "hidden";
    input_Nom.name = "NombreGrupo";
    var boton = document.createElement("input");
    boton.type = "submit";
    boton.value = "";
    boton.className = "AddToGroup";
    span = document.createElement("span");
    //span.innerHTML="${Alerta}";
    pnew.appendChild(newlabel);
    pnew.appendChild(boton);
    pnew.appendChild(input);
    pnew.appendChild(input_id);
    pnew.appendChild(input_Nom);
    form.appendChild(pnew);
    //form.appendChild(span);
    //divnew.appendChild(form);
    document.getElementById("heading" + id_Grupo).appendChild(form);
    $("#formNuevoIntegrante" + id_Grupo).submit(function (e) {
        e.preventDefault();
        SweetAlertNuevoIntegrante(id_Grupo, NombreGrupo);
    });
}
function SweetAlertNuevoIntegrante(id_Grupo, NombreGrupo) {





    Swal.fire({
        title: 'Agregar Nuevo Integrante',
        html: //-------------------------TITULO
                //-------------------------Body 
                '<label class="sweetalrt" style="padding: 5px; color: #ff8200; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;">Teléfono</label>' +
                '<div class="col-12" id="agregarTels">' +
                '<multiselect ' +
                'placeholder="Agrega Integrantes"' +
                'v-model="value" ' +
                ':options="options"' +
                'track-by="id"' +
                ':multiple="true"' +
                ':taggable="false"' +
                ':close-on-select="false"' +
                ':custom-label="customLabel" ' +
                ':select-label="\'Seleccionar\'" ' +
                ':selected-Label="\'Seleccionado\'"' +
                ':deselect-Label="\'Remover\'"' +
                ':hide-selected="true"' +
                '@select="onSelect"' +
                '@Close="onClose"' +
                '@Remove="onRemove">' +
                '</multiselect>' +
                '<pre class="language-json" style="display:none"><code>{{ value  }}</code></pre>' +
                '</div>',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            return [

                //document.getElementById('swal-input5').value,
                //document.getElementById('swal-input6').value
            ];
        }
    }).then((result) => {
        if (result.value) {
            if (tel_a_agregar.length)
            {

                var json = {};
                json.usuarios = JSON.stringify(tel_a_agregar);
                json.idGrupo = id_Grupo;


                agregarIntegrantesGrupo(json).then(function (response) {
                    if (response.length) {
                        Swal.fire({
                            title: 'Agregar Integrantes',
                            html: //-------------------------TITULO
                                    //-------------------------Body 
                                    '<div id="response"></div>' +
                                    '<label class="sweetalrt" style="display: contents; padding: 5px; color: #fff; font: 12px arial; margin-top: 25px; margin-bottom: 10px; margin-left: auto;  margin-right: auto; width: 80%;"><br>Integrantes agregados correctamente:</label>',

                        }).then(function () {
                            window.location.reload();
                        });
                        estiloSwal();
                        var cancel = document.getElementsByClassName("swal2-cancel");
                        if (cancel.length)
                            cancel[0].style = "display:none;";
                        if ($("#swal2-content").length)
                            document.getElementById("swal2-content").style = "padding-top: 1rem;";
                        for (var i = 0; i < response.length; i++) {
                            if (response[i].estado) {

                            }
                        }
                    }

                });

            }
        }

    });

    vuemodel();


    //vuemodel2();
}
function agregarIntegrantesGrupo(jsonArray) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/NuevosIntegrantes',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(jsonArray),
        success: function (response) {


        },
        error: function (err) {

        }
    }));

}
function InsertarGrupo(id_Grupo, NombreGrupo, integrantes) {
    //**console.log("InsertarGrupo");
    //**console.log(id_Grupo);
    //**console.log(NombreGrupo);

    var div = document.createElement("div");
    div.className = "card";
    div.style = "border:none;    border-bottom: solid 2px white;";

    var header = document.createElement("div");
    header.className = "card-header m-0 p-0 row col-12";
    header.id = "heading" + id_Grupo;
    header.style = "background: #0097a9;border:none;";

    var checkDiv = document.createElement("div");
    checkDiv.className = "col-1 p-0";
    checkDiv.id = "checkDiv" + id_Grupo;
    checkDiv.style = "margin-top: auto; margin-bottom: auto;";

    var h2 = document.createElement("h2");
    h2.className = "col-7";
    h2.style = "margin-top: auto;margin-bottom: auto;";

    var button = document.createElement("button");
    button.className = "m-0 p-0 btn btn-link collapsed";
    button.type = "buttom";
    button.setAttribute("data-toggle", "collapse");
    button.setAttribute("data-target", "#collapse" + id_Grupo);
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", "collapse" + id_Grupo);

    button.style = "width: 100%; text-align: left;";

    header.appendChild(checkDiv);
    h2.appendChild(button);
    header.appendChild(h2);
    div.appendChild(header);

    var collapse = document.createElement("div");
    collapse.id = "collapse" + id_Grupo;
    collapse.className = "collapse ";
    collapse.setAttribute("aria-labelledby", "heading" + id_Grupo);
    collapse.setAttribute("data-parent", "#accordion");

    var body = document.createElement("div");
    body.className = "card-body p-0 m-0";
    body.id = id_Grupo;
    body.style = "background: #40474f;";

    collapse.appendChild(body);
    div.appendChild(collapse);

    document.getElementById("accordion").appendChild(div);

    var form = document.createElement("form");
    form.id = "formGrupo" + id_Grupo;
    form.className = "formGrupo" + id_Grupo;
    form.action = "/" + DEPENDENCIA + "/EliminarGrupo";
    form.method = "POST";
    var input_id = document.createElement("input");
    input_id.value = id_Grupo;
    input_id.type = "hidden";
    input_id.name = "id_Grupo";
    var input_Nom = document.createElement("input");
    input_Nom.value = NombreGrupo;
    input_Nom.type = "hidden";
    input_Nom.name = "NombreGrupo";
    //var div = document.createElement("div");
    //div.id = id_Grupo;
    var label = document.createElement("h4");
    label.innerHTML = NombreGrupo;
    label.style = "color:white; font: bold 12px arial; text-overflow: ellipsis;overflow: hidden;white-space: nowrap;";
    var boton = document.createElement("input");
    boton.type = "button";
    boton.id = "BotonformGrupo" + id_Grupo;
    boton.value = "";
    boton.className = "DeleteGroup";
    boton.style.display = "none";
    var p = document.createElement("p");
    p.className = "p-0 m-0";
    //p.style="border-bottom: solid 2px white;";
    var a = document.createElement("a");
    a.href = "#";
    a.id = "link" + id_Grupo;
    a.style = "display: inline-block";
    a.appendChild(label);
    p.appendChild(input_id);
    p.appendChild(input_Nom);
    p.appendChild(boton);
    p.appendChild(a);
    form.appendChild(p);
    button.appendChild(form);

    var edit = document.createElement("input");
    edit.className = "DeleteFromGroup";
    edit.id = "edit" + id_Grupo;

    InsertaCheck(id_Grupo, integrantes);
    $("#BotonformGrupo" + id_Grupo).click(function () {
        const Toast = Swal.fire({
            title: "¿Estas seguro?",
            html: "<p style=\"color: white;font-size: 15px; padding: 0; margin: 0; margin-top: 40px;\">Esta acion eliminara el grupo: <label style=\"color: bisque;font-size: 15px;\">" + NombreGrupo + "</label></p>",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, estoy seguro!'
        }).then((result) => {
            if (result.value) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 1000
                });
                Toast.fire({
                    type: 'success',
                    title: 'Eliminado correctamente'
                }).then(function () {
                    $("#formGrupo" + id_Grupo).submit();
                });
            }
        });
    });

}
function InsertarGrupoA(id_Grupo, NombreGrupo, integrantes) {
    //**console.log("InsertarGrupo");
    //**console.log(id_Grupo);
    //**console.log(NombreGrupo);

    var div = document.createElement("div");
    div.className = "card";
    div.style = "border:none;    border-bottom: solid 2px white;";

    var header = document.createElement("div");
    header.className = "card-header m-0 p-0 row col-12";
    header.id = "heading" + id_Grupo;
    header.style = "background: #0097a9;border:none;";

    var checkDiv = document.createElement("div");
    checkDiv.className = "col-1 p-0";
    checkDiv.id = "checkDiv" + id_Grupo;
    checkDiv.style = "margin-top: auto; margin-bottom: auto;";

    var h2 = document.createElement("h2");
    h2.className = "col-9";
    h2.style = "margin-top: auto;margin-bottom: auto;";

    var button = document.createElement("button");
    button.className = "m-0 p-0 btn btn-link collapsed";
    button.type = "buttom";
    button.setAttribute("data-toggle", "collapse");
    button.setAttribute("data-target", "#collapse" + id_Grupo);
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", "collapse" + id_Grupo);

    button.style = "width: 100%; text-align: left;";

    header.appendChild(checkDiv);
    h2.appendChild(button);
    header.appendChild(h2);
    div.appendChild(header);

    var collapse = document.createElement("div");
    collapse.id = "collapse" + id_Grupo;
    collapse.className = "collapse ";
    collapse.setAttribute("aria-labelledby", "heading" + id_Grupo);
    collapse.setAttribute("data-parent", "#accordion");

    var body = document.createElement("div");
    body.className = "card-body p-0 m-0";
    body.id = id_Grupo;
    body.style = "background: #40474f;";

    collapse.appendChild(body);
    div.appendChild(collapse);

    document.getElementById("div_ga").appendChild(div);

    var form = document.createElement("form");
    form.id = "formGrupo" + id_Grupo;
    form.className = "formGrupo" + id_Grupo;
    form.action = "/" + DEPENDENCIA + "/EliminarGrupo";
    form.method = "POST";
    var input_id = document.createElement("input");
    input_id.value = id_Grupo;
    input_id.type = "hidden";
    input_id.name = "id_Grupo";
    var input_Nom = document.createElement("input");
    input_Nom.value = NombreGrupo;
    input_Nom.type = "hidden";
    input_Nom.name = "NombreGrupo";
    //var div = document.createElement("div");
    //div.id = id_Grupo;
    var label = document.createElement("h4");
    label.innerHTML = NombreGrupo;
    label.style = "color:white; font: bold 12px arial; text-overflow: ellipsis;overflow: hidden;white-space: nowrap;";
    var boton = document.createElement("input");
    boton.type = "button";
    boton.id = "BotonformGrupo" + id_Grupo;
    boton.value = "";
    boton.className = "DeleteGroup";
    boton.style.display = "none";
    var p = document.createElement("p");
    p.className = "p-0 m-0";
    //p.style="border-bottom: solid 2px white;";
    var a = document.createElement("a");
    a.href = "#";
    a.id = "link" + id_Grupo;
    a.style = "display: inline-block";
    a.appendChild(label);
    p.appendChild(input_id);
    p.appendChild(input_Nom);
    p.appendChild(boton);
    p.appendChild(a);
    form.appendChild(p);
    button.appendChild(form);

    var edit = document.createElement("input");
    edit.className = "DeleteFromGroup";
    edit.id = "edit" + id_Grupo;

    InsertaCheck(id_Grupo, integrantes);
    $("#BotonformGrupo" + id_Grupo).click(function () {
        const Toast = Swal.fire({
            title: "¿Estas seguro?",
            html: "<p style=\"color: white;font-size: 15px; padding: 0; margin: 0; margin-top: 40px;\">Esta acion eliminara el grupo: <label style=\"color: bisque;font-size: 15px;\">" + NombreGrupo + "</label></p>",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, estoy seguro!'
        }).then((result) => {
            if (result.value) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 1000
                });
                Toast.fire({
                    type: 'success',
                    title: 'Eliminado correctamente'
                }).then(function () {
                    $("#formGrupo" + id_Grupo).submit();
                });
            }
        });
    });

}


function InsertarSeparador(Titulo) {
    var div = document.createElement("div");
    div.className = "card";
    div.style = "border:none;    border-bottom: solid 2px white;";
    div.id = Titulo;
    var header = document.createElement("div");
    header.className = "card-header m-0 p-0 row col-12";
    header.id = "heading";
    header.style = "background: #fe8201;border:none;";

    var h2 = document.createElement("h2");
    h2.className = "mb-0 col-11";

    var button = document.createElement("button");
    button.className = "m-0 p-0 btn btn-link collapsed";
    button.type = "buttom";
    button.setAttribute("data-toggle", "collapse");
    button.setAttribute("data-target", "#collapse");
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", "collapse");
    button.style = "width: 100%; text-align: left;";

    var checkDiv = document.createElement("div");
    checkDiv.className = "col-1 p-0";
    checkDiv.id = "checkDiv" + Titulo.replace(" ", "");
    checkDiv.style = "margin-top: auto; margin-bottom: auto;";

    header.appendChild(checkDiv);
    h2.appendChild(button);
    header.appendChild(h2);
    div.appendChild(header);

    var collapse = document.createElement("div");
    collapse.id = "collapse";
    collapse.className = "collapse ";
    collapse.setAttribute("aria-labelledby", "heading");
    collapse.setAttribute("data-parent", "#accordion");

    var body = document.createElement("div");
    body.className = "card-body p-0 m-0";
    body.style = "background: #40474f;";

    collapse.appendChild(body);
    div.appendChild(collapse);

    document.getElementById("accordion").appendChild(div);

    var form = document.createElement("form");
    // form.id = "formGrupo";
    form.className = "formGrupo";
    form.action = "/" + DEPENDENCIA + "/EliminarGrupo";
    form.method = "POST";
    var input_id = document.createElement("input");
    input_id.type = "hidden";
    input_id.name = "id_Grupo";
    var input_Nom = document.createElement("input");
    input_Nom.value = "Grupos Automáticos";
    input_Nom.type = "hidden";
    input_Nom.name = "NombreGrupo";
    //var div = document.createElement("div");
    //div.id = id_Grupo;
    var label = document.createElement("h4");
    label.innerHTML = Titulo;
    label.style = "color:white; font: bold 12px arial;";
    var boton = document.createElement("input");
    boton.type = "button";
    // boton.id = "BotonformGrupo"+ id_Grupo;
    boton.value = "";
    boton.className = "DeleteGroup";
    boton.style.display = "none";
    var p = document.createElement("p");
    p.className = "p-0 m-0";
    //p.style="border-bottom: solid 2px white;";
    var a = document.createElement("a");
    if (Titulo === "Grupos Personalizados") {
        a.href = "#";
        a.id = "link";
        a.style = "display: inline-block";
    } else {
        a.href = "#";
        a.id = "linkGA";
        a.style = "display: inline-block";
    }

    a.appendChild(label);
    p.appendChild(input_id);
    p.appendChild(input_Nom);
    p.appendChild(boton);
    p.appendChild(a);
    form.appendChild(p);
    button.appendChild(form);

    InsertaCheck(Titulo.replace(" ", ""), []);

    var edit = document.createElement("input");
    edit.className = "DeleteFromGroup";
    edit.id = "edit";
}



function InsertarGrupoPersonalizado(id_Grupo, NombreGrupo) {
    var div = document.createElement("div");
    div.className = "card";
    div.style = "border:none;    border-bottom: solid 2px white;";

    var header = document.createElement("div");
    header.className = "card-header m-0 p-0 row col-12";
    header.id = "heading" + id_Grupo;
    header.style = "background: #0097a9;border:none;";

    var h2 = document.createElement("h2");
    h2.className = "mb-0 col-9";

    var button = document.createElement("button");
    button.className = "m-0 p-0 btn btn-link collapsed";
    button.type = "buttom";
    button.setAttribute("data-toggle", "collapse");
    button.setAttribute("data-target", "#collapse" + id_Grupo);
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", "collapse" + id_Grupo);

    button.style = "width: 100%; text-align: left;";

    h2.appendChild(button);
    header.appendChild(h2);
    div.appendChild(header);

    var collapse = document.createElement("div");
    collapse.id = "collapse" + id_Grupo;
    collapse.className = "collapse ";
    collapse.setAttribute("aria-labelledby", "heading" + id_Grupo);
    collapse.setAttribute("data-parent", "#accordion");

    var body = document.createElement("div");
    body.className = "card-body p-0 m-0";
    body.id = id_Grupo;
    body.style = "background: #40474f;";
    //body.innerHTML="Bingo";

    collapse.appendChild(body);
    div.appendChild(collapse);

    document.getElementById("accordion").appendChild(div);

    var form = document.createElement("form");
    form.id = "formGrupo" + id_Grupo;
    form.className = "formGrupo" + id_Grupo;
    form.action = "/" + DEPENDENCIA + "/EliminarGrupo";
    form.method = "POST";
    var input_id = document.createElement("input");
    input_id.value = id_Grupo;
    input_id.type = "hidden";
    input_id.name = "id_Grupo";
    var input_Nom = document.createElement("input");
    input_Nom.value = NombreGrupo;
    input_Nom.type = "hidden";
    input_Nom.name = "NombreGrupo";
    //var div = document.createElement("div");
    //div.id = id_Grupo;
    var label = document.createElement("h4");
    label.innerHTML = NombreGrupo;
    label.style = "color:white; font: bold 12px arial;";
    var boton = document.createElement("input");
    boton.type = "button";
    boton.id = "BotonformGrupo" + id_Grupo;
    boton.value = "";
    boton.className = "DeleteGroup";
    boton.style.display = "none";
    var p = document.createElement("p");
    p.className = "p-0 m-0";
    //p.style="border-bottom: solid 2px white;";
    var a = document.createElement("a");
    a.href = "#";
    a.id = "link" + id_Grupo;
    a.style = "display: inline-block";
    a.appendChild(label);
    p.appendChild(input_id);
    p.appendChild(input_Nom);
    p.appendChild(boton);
    p.appendChild(a);
    form.appendChild(p);
    button.appendChild(form);



    var edit = document.createElement("input");
    edit.className = "DeleteFromGroup";
    edit.id = "edit" + id_Grupo;

    //document.getElementById("grupos").appendChild(div);
    $("#BotonformGrupo" + id_Grupo).click(function () {
        const Toast = Swal.fire({
            title: "¿Estas seguro?",
            html: "<p style=\"color: white;font-size: 15px; padding: 0; margin: 0; margin-top: 40px;\">Esta acion eliminara el grupo: <label style=\"color: bisque;font-size: 15px;\">" + NombreGrupo + "</label></p>",

            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, estoy seguro!'
        }).then((result) => {
            if (result.value) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 1000
                });

                Toast.fire({
                    type: 'success',
                    title: 'Eliminado correctamente'
                }).then(function () {
                    $("#formGrupo" + id_Grupo).submit();
                });


            }
        });
    });

}
function MostrarGrupo(id_Grupo, NombreGrupo) {

}
function InsertarIntegrante(id_Grupo, NombreGrupo, integrante) {

    var NombreUsuario = integrante.nombre + " " + integrante.apellido_paterno + " " + integrante.apellido_materno;
    var idUsuario_Movil = integrante.id360;
    var p = document.createElement("p");
    p.className = "p-2 m-0 position-relative";
    p.style = "border-bottom: 2px solid white;";
    p.id = "heading" + id_Grupo + "_" + integrante.id360;
    var input_nombre = document.createElement("input");
    input_nombre.value = NombreUsuario;
    input_nombre.id = idUsuario_Movil;
    input_nombre.style = "cursor: pointer; background:none; background: none; color: gray; width:75%; border: none; font:bold 13px arial; color: whitesmoke;";
    input_nombre.disabled = true;


    var formDelete = document.createElement("form");
    formDelete.id = "formEliminarIntegrante" + idUsuario_Movil + "Grupo" + id_Grupo;
    formDelete.className = "formEliminarIntegrante" + idUsuario_Movil + "Grupo" + id_Grupo;
    formDelete.action = "/" + DEPENDENCIA + "/EliminarIntegrante";
    formDelete.method = "POST";
    formDelete.style = "display:contents;";

    var input_idUsr = document.createElement("input");
    input_idUsr.value = idUsuario_Movil;
    input_idUsr.type = "hidden";
    input_idUsr.name = "idUsuarios_Movil";

    var input_grupo = document.createElement("input");
    input_grupo.value = id_Grupo;
    input_grupo.type = "hidden";
    input_grupo.name = "id_Grupo";

    var boton = document.createElement("input");
    boton.type = "button";
    boton.id = "BotonformEliminarIntegrante" + idUsuario_Movil + "Grupo" + id_Grupo;
    boton.value = "";
    boton.className = "DeleteFromGroup DG" + id_Grupo;
    boton.title = "Eliminar integrante del grupo";
    boton.style.display = "none";

    formDelete.appendChild(input_idUsr);
    formDelete.appendChild(input_grupo);
    formDelete.appendChild(boton);


    var formCall = document.createElement("form");
    formCall.method = "POST";
    formCall.action = "/" + DEPENDENCIA + "/OperadorEmpresa";
    formCall.target = "_blank";
    formCall.id = "call" + idUsuario_Movil + "Grupo" + id_Grupo;
    formCall.style = "display:none;";

    var input_id = document.createElement("input");
    input_id.value = idUsuario_Movil;
    input_id.type = "hidden";
    input_id.name = "idUsuarios_Movil";
    //input_id.id = "idUsuarios_Movil";

    var input_idcall = document.createElement("input");
    input_idcall.value = idUsuario_Movil;
    input_idcall.type = "hidden";
    input_idcall.name = "id";

    var botoncall = document.createElement("input");
    botoncall.type = "submit";
    botoncall.value = "";
    botoncall.className = "call";
    botoncall.id = "call" + idUsuario_Movil;
    botoncall.title = "llamar";

    formCall.appendChild(input_idcall);
    formCall.appendChild(input_id);
    formCall.appendChild(botoncall);

    var formCalendar = document.createElement("form");
    formCalendar.style = "display:contents;";
    formCalendar.action = "RutaHistorico";
    formCalendar.target = "_blank";
    formCalendar.method = "POST";

    var calendario = document.createElement("input");
    //calendario.style="background: url(resources/Img/calendar.png);background-repeat: no-repeat;background-position:center; background-size: cover;-moz-background-size: cover;-webkit-background-size: cover; -o-background-size: cover;width: 25px;height: 25px;border: none;vertical-align: middle; cursor:pointer;";
    calendario.className = "Calendar";
    calendario.type = "submit";
    calendario.value = "";
    calendario.title = "Rutas anteriores";

    formCalendar.appendChild(input_id);
    formCalendar.appendChild(calendario);
    p.appendChild(formDelete);
    p.appendChild(input_nombre);
    p.appendChild(formCalendar);
    p.appendChild(formCall);
    document.getElementById(id_Grupo).appendChild(p);

    $("#call" + idUsuario_Movil + "Grupo" + id_Grupo).submit(function (e) {
        if (document.getElementById("call" + idUsuario_Movil).className === "call") {
            e.preventDefault();
            const Toast = Swal.mixin({
                toast: true,
                position: 'center'
            });
            Toast.fire({
                html: "<h1 style=\"color: #D7D7D7;\">Solicitar Llamada</h1><p style=\"color: white;font-size: 15px;\">Está a punto de solicitar una llamada a: <br><label style=\"color: bisque;font-size: 15px;margin: 0;\">" + NombreUsuario + "</label><br>Si desea continuar presione en llamar <br><label style=\"color: bisque;font-size: 15px;margin: 0;\"></label></p>",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Llamar!'
            }).then((result) => {
                if (result.value) {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'center',
                        showConfirmButton: false,
                        timer: 1000
                    });
                    Toast.fire({
                        type: 'success',
                        title: 'Solicitando llamada'
                    }).then(function () {
                        /*Cambios prueba fernando*/
                        //FireBaseKey(idUsuario_Movil, 1, "", "", "", DEPENDENCIA);//Descomentar si no funciona
                        Iniciar_llamada_saliente(idUsuario_Movil);
                        /************************/
                    });
                }
            });
        }
    });
    $("#BotonformEliminarIntegrante" + idUsuario_Movil + "Grupo" + id_Grupo).click(function () {
        const Toast = Swal.fire({
            title: "¿Estas seguro?",
            html: "<p style=\"color: white;font-size: 15px;padding: 0;margin: 0;margin-top: 40px;\">Esta acion hara que el integrante:<br><label style=\"color: #ff8200;font:bold 15px arial;margin: 5px;\">" + NombreUsuario + "</label><br>ya no se visualice en el grupo: <br><label style=\"color: #ff8200;font:bold 15px arial;margin: 5px;\">" + NombreGrupo + "</label></p>",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, estoy seguro!'
        }).then((result) => {
            if (result.value) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 1000
                });
                Toast.fire({
                    type: 'success',
                    title: 'Eliminado correctamente'
                }).then(function () {
                    $("#formEliminarIntegrante" + idUsuario_Movil + "Grupo" + id_Grupo).submit();
                });
            }
        });
    });
    if (integrante.gps.lat === "") {
        input_nombre.style = "background:none;color: gray; width:75%; border:none; ";
        if (!flag) {
            var check = document.getElementById("input" + id_Grupo);
            check.setAttribute("disabled", true);
        }
    } else {
        flag = true;
        var check = document.getElementById("input" + id_Grupo);
        check.removeAttribute("disabled");
        p.addEventListener("click", function () {
            var id = new Array();
            id.push(integrante);
            colocarMarcadores(id);
        });
    }
}

/*Cambios prueba fernando*/
function Iniciar_llamada_saliente(idUsuario_Movil) {
    let json = {
        "id360": sesion_cookie.id_usuario,
        "to_id360": [
            {"id360": idUsuario_Movil}
        ],
        "type": "200",
        "tipo": "llamadaS"
    };
    RequestPOST("/API/notificacion/llamada360", json).then((response) => {
        //**console.log(response);
        if (response.success) {
            var idUsers = new Array();
            idUsers.push(idUsuario_Movil.toString());
            RegistroNotificaciones(idUsers, response.registro_llamada.idLlamada).then(function (RespuestaNotificados) {

                var div = document.createElement("div");
                div.id = "div" + idUsuario_Movil;
                //div.style="visibility: hidden";

                var form = document.createElement("form");
                form.method = "POST";
                form.action = "/" + DEPENDENCIA + "/OperadorEmpresa";
                form.target = "_blank";
                form.id = "LlamadaSaliente" + response.receptores[0].id360;

                var id = document.createElement("input");
                id.type = "hidden";
                id.id = "nombre" + response.receptores[0].id360;
                id.style = "width: 39%;   margin-left: 1% ;  border: 1px solid #ccc;  border-radius: 4px;  box-sizing: border-box;";
                id.value = response.receptores[0].id360; //idUsr;
                id.name = "id";

                var apikey = document.createElement("input");
                apikey.type = "hidden";
                apikey.id = response.credenciales.apikey;
                apikey.value = response.credenciales.apikey;
                apikey.name = "apikey";

                var sesion = document.createElement("input");
                sesion.type = "hidden";
                sesion.id = response.credenciales.idsesion;
                sesion.value = response.credenciales.idsesion;
                sesion.name = "session";

                var token = document.createElement("input");
                token.type = "hidden";
                token.id = response.credenciales.token;
                token.value = response.credenciales.token;
                token.name = "token";

                var idLlamada = document.createElement("input");
                idLlamada.type = "hidden";
                idLlamada.id = response.registro_llamada.idLlamada;
                idLlamada.value = response.registro_llamada.idLlamada;
                idLlamada.name = "idLlamada";
                var modo = document.createElement("input");
                modo.type = "hidden";
                modo.id = "modo";
                modo.value = "201";
                modo.name = "modo";

                var fecha = document.createElement("input");
                fecha.type = "hidden";
                fecha.id = "fecha";
                fecha.value = getFecha();
                fecha.name = "fecha";

                var hora = document.createElement("input");
                hora.type = "hidden";
                hora.id = "hora";
                hora.value = getHora();
                hora.name = "hora";

                var idSys = document.createElement("input");
                idSys.type = "hidden";
                idSys.id = "idSys";
                idSys.value = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys;
                idSys.name = "idSys";

                var origen = document.createElement("input");
                origen.type = "hidden";
                origen.id = "origen";
                origen.value = DEPENDENCIA;
                origen.name = "origen";

                var integrantes = document.createElement("input");
                integrantes.type = "hidden";
                integrantes.id = "integrantes";
                integrantes.value = idUsuario_Movil;
                integrantes.name = "integrantes";

                var tipo_usuario = document.createElement("input");
                tipo_usuario.type = "hidden";
                tipo_usuario.id = "tipo_usuario";
                tipo_usuario.value = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario;
                tipo_usuario.name = "tipo_usuario";

                var tipo_servicio = document.createElement("input");
                tipo_servicio.type = "hidden";
                tipo_servicio.id = "tipo_servicio";
                tipo_servicio.value = JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio;
                tipo_servicio.name = "tipo_servicio";


                var submit = document.createElement("input");
                submit.type = "submit";
                submit.value = "Atender";
                submit.style = "background-color: #585858 ;  border: 1px solid #2E2E2E; border-radius:4px; color: gray;   text-align: center;  text-decoration: none;   font-size: 16px;  margin-left:1%; ";
                form.appendChild(id);
                form.appendChild(apikey);
                form.appendChild(sesion);
                form.appendChild(token);
                form.appendChild(idLlamada);
                form.appendChild(modo);
                form.appendChild(origen);
                form.appendChild(fecha);
                form.appendChild(hora);
                form.appendChild(idSys);
                form.appendChild(integrantes);
                form.appendChild(tipo_usuario);
                form.appendChild(tipo_servicio);
                form.appendChild(submit);
                div.appendChild(form);

                document.body.appendChild(div);

                form.submit();
                document.getElementById("div" + idUsuario_Movil).parentNode.removeChild(document.getElementById("div" + idUsuario_Movil));
            });
        } else {
            swal.fire({
                text: "El usuario no pudo ser notificado"
            });
        }
    });
}
/*************************/

function BuscarGrupos(id_UsrSys) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/BuscarGrupos',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "idUsuario_Sys": id_UsrSys
        }),
        success: function (response) {


        },
        error: function (err) {
            //.log("NO se encontraron grupos para: " + id_UsrSys);
        }
    }));

}

function ElimiarGrupoDOM(id_Grupo) {
    var grupo = document.getElementById("grupo" + id_Grupo);
    grupo.parentNode.removeChild(grupo);
}
function ElimiarMiembroEnGrupoDOM(id_Grupo, idUsuarios_Movil) {
    var grupo = document.getElementById("grupo" + id_Grupo);
    var miembro = document.getElementById(idUsuarios_Movil);
    grupo.removeChild(miembro);
}


function DataGrupos() {

    let json = {
        "idUsuarioSys": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).idUsuario_Sys,
        "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
        "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
        "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area
    };
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": '/' + DEPENDENCIA + "/API/empresas360/GruposPersonalizados",
        contentType: "application/json",
        "method": "POST",
        "data": JSON.stringify(json),
        success: function (response) {

        },
        error: function (err) {

        }
    };
    return Promise.resolve($.ajax(settings));

}



var lottieLoader = document.createElement("div");
lottieLoader.id = "lottie";
lottieLoader.id = "LoadingLottie";
document.getElementById("old_sidebar").appendChild(lottieLoader);

var lottieAnimation = bodymovin.loadAnimation({
    container: lottieLoader, // ID del div
    path: JSONlottie, // Ruta fichero .json de la animación
    renderer: 'svg', // Requerido
    loop: true, // Opcional
    autoplay: true, // Opcional
    name: "Hello World" // Opcional
});

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Directorio;
var tel_a_agregar = new Array();
ConsultarDirectorio().then(function (directorio) {
//    for (var i = 0; i < directorio.directorio.length; i++) {
//        //console.info(directorio.directorio[i].urlServicio);
//        for (var j = 0; j < directorio.dependencias.length; j++) {
//            if (directorio.dependencias[j].url === directorio.directorio[i].urlServicio) {
//                directorio.directorio[i].aliasServicio = directorio.dependencias[j].alias;
//                break;
//            } else if (j === directorio.dependencias.length - 1) {
//                console.error("No hubo match");
//            }
//        }
//
//    }

    Directorio = directorio.directorio;
    //console.info(Directorio);
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
            "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
            "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
            "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area
        }),
        success: function (response) {
            //console.info(response);
        },
        error: function (err) {
            //alert("No hay ubicacion para el usuario:" + idUsuarios_Movil);
            console.error(err)
        }
    }));

}


function vuemodel() {
    tel_a_agregar = new Array();

    var json = Directorio;


// register globally

    vue = new Vue({
        components: {
            Multiselect: window.VueMultiselect.default
        },
        data: {

            value: [
            ],
            options: json


        },
        methods: {
            customLabel(option) {
                return  option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno;
            },
            onSelect(op) {

                tel_a_agregar.push(op);
                //console.info(tel_a_agregar);



            },
            onClose() {
                //console.info(this.value);
            },
            onRemove(op) {
                var i = tel_a_agregar.indexOf(op);
                tel_a_agregar.splice(i, 1);
                //console.info(op);
                //console.info(tel_a_agregar);
            }

        }
    }).$mount('#agregarTels');

    estiloSwal();
}
function estiloSwal() {

//    var popup = document.getElementsByClassName("swal2-popup");
//    //console.info(popup);
//    if(popup.length)
//    popup[0].style = "display: flex; margin: 0; padding: 0; border-radius:10px;     background: #40474f;";


//    var header = document.getElementsByClassName("swal2-header");
//    //console.info(header);
//    if(header.length)
//    header[0].style = "background: white; border-top-left-radius: 10px; border-top-right-radius: 10px;";


//    var title = document.getElementsByClassName("swal2-title");
//    //console.info(title);
//    if(title.length)
//    title[0].style = "display:flex;width:90%;font:13px arial;color:#2f2f2f;margin:5px;";

//    var actionButtons = document.getElementsByClassName("swal2-actions");
//    if(actionButtons.length)
//    actionButtons[0].style = "display:flex;z-index: 0; ";
//    var confirm = document.getElementsByClassName("swal2-confirm");
//    //console.info(confirm);
//    if(confirm.length)
//    confirm[0].style = "width:40%;background:#dc3545;border-radius:15px;height:25px;margin:15px;padding:0;";
//    var cancel = document.getElementsByClassName("swal2-cancel");
//    //console.info(cancel);
//    if(cancel.length)
//    cancel[0].style = "width:40%;background:#93939;border-radius:15px;height:25px;margin:15px;padding:0;";

//    var multiselect = document.getElementsByClassName("multiselect");
//    //console.info(multiselect);
//    if (multiselect.length)
//    multiselect[0].style = "border-radius: 0; border-bottom: solid 2px white; width: 84%; margin-left: auto; margin-right: auto;";
//    var tags = document.getElementsByClassName("multiselect__tags");
//    //console.info(tags);
//    if(tags.length)
//    tags[0].style = "    max-height: 150px;overflow-y: scroll; background: none; border: none;";
//    var single = document.getElementsByClassName("multiselect__single");
//    //console.info(single);
//    if(single.length)
//    single[0].style = "background: none; color: white; font: bold 12px arial;";
//    

}
function vuemodel2() {

    var json = Directorio;


// register globally

    vue = new Vue({
        components: {
            Multiselect: window.VueMultiselect.default
        },
        data() {
            return {
                value: [],
                options: [
                    {name: 'Vue.js', code: 'vu'},
                    {name: 'Javascript', code: 'js'},
                    {name: 'Open Source', code: 'os'}
                ]
            }
        },
        methods: {
            addTag(newTag) {
                const tag = {
                    name: newTag,
                    code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
                }
                this.options.push(tag)
                this.value.push(tag)
            }
        }
    }).$mount('#test');
}
initMap();
