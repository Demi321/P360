/* global Promise, DEPENDENCIA */
var servicios;

//var tipo_usuario = getCookie("username_v3.2_" + DEPENDENCIA) === "" ? "0" : JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_usuario;
//var tipo_servicio = getCookie("username_v3.2_" + DEPENDENCIA) === "" ? "0" : JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).tipo_servicio;
var tipo_usuario = 0;
var tipo_servicio = 0;
traeServicios(tipo_usuario, tipo_servicio).then(function (response) {
    servicios = response;
    modalAgregaServicio("agregaServicio");
    (function () {
        var formulario = document.formulario_registro,
                elementos = formulario.elements;
        var select = document.createElement("select");
        select.id = "tipoUser";
        select.className = "browser-default custom-select";
        select.style = "border-radius: 20px;";
        var op = document.createElement("option");
        op.innerHTML = "Selecciona un tipo de usuario";
        op.setAttribute("value", "0");
        op.setAttribute("selected", "true");
        select.appendChild(op);
        var tiposUsers = servicios.tipos_usuarios;
        $.each(tiposUsers, function (i) {
            var option = document.createElement("option");
            option.innerHTML = tiposUsers[i].tipo_usuario;
            option.setAttribute("value", tiposUsers[i].id);
            select.appendChild(option);
        });
        document.getElementById("typeUser").appendChild(select);
        var selectServ = document.createElement("select");
        selectServ.id = "tipoServ";
        selectServ.className = "browser-default custom-select";
        selectServ.style = "border-radius: 20px;";
        var opS = document.createElement("option");
        opS.innerHTML = "Selecciona un tipo de servico";
        opS.setAttribute("value", "0");
        opS.setAttribute("selected", "true");
        selectServ.appendChild(opS);
        $("#tipoUser").change(function () {
            $("#tipoServ").empty();
            var opS = document.createElement("option");
            opS.innerHTML = "Selecciona un tipo de servico";
            opS.setAttribute("value", "0");
            opS.setAttribute("selected", "true");
            selectServ.appendChild(opS);
            var servUSer = servicios.servicios_usuarios;
            $.each(servUSer, function (i) {
                if ($("#tipoUser").val() === servUSer[i].idTipoUsuario) {
                    var optionS = document.createElement("option");
                    optionS.innerHTML = servUSer[i].nombre;
                    optionS.setAttribute("value", servUSer[i].id);
                    selectServ.appendChild(optionS);
                }
            });
        });
        document.getElementById("servUser").appendChild(selectServ);
        var validarInputs = function () {
            for (var i = 0; i < elementos.length; i++) {
                // Identificamos si el elemento es de tipo texto, email, password, radio o checkbox
                if (elementos[i].type === "text" || elementos[i].type === "url" || elementos[i].type === "email" || elementos[i].type === "password") {
                    // Si es tipo texto, email o password vamos a comprobar que esten completados los input
                    if (elementos[i].value.length <= 3) {

                        elementos[i].className = elementos[i].className + " error";
                        return false;
                    } else {
                        elementos[i].className = elementos[i].className.replace(" error", "");
                    }
                }
            }

            // Comprobando que las contraseñas coincidan
            if (elementos.Pass.value !== elementos.Pass2.value) {
                elementos.Pass.value = "";
                elementos.Pass2.value = "";
                elementos.Pass.className = elementos.Pass.className + " error";
                elementos.Pass2.className = elementos.Pass2.className + " error";
                return false;
            } else {
                elementos.Pass.className = elementos.Pass.className.replace(" error", "");
                elementos.Pass2.className = elementos.Pass2.className.replace(" error", "");
            }

            return true;
        };
        var validarCheckbox = function () {
            //var opciones = document.getElementsByName('terminos'),
//            var resultado = false;
            var resultado = true;
//            if (!document.getElementById("terminos").checked) {
//                //document.getElementById("span").textContent="prueba";
//                document.getElementById("terminos").parentNode.className = document.getElementById("terminos").parentNode.className + " error";
//            } else {
//                resultado = true;
//            }
            return resultado;
        };
        var validarSelect = function () {
            var res = false, res2 = false;

            if ($("#tipoUser").val() === "0") {
                $("#tipoUser").css({
                    "border": "solid 1px #e8e8e8",
                    "background": "#ba7775"
                });
            }
            if ($("#tipoServ").val() === "0") {
                $("#tipoServ").css({
                    "border": "solid 1px #e8e8e8",
                    "background": "#ba7775"
                });
            }
            if ($("#tipoUser").val() !== "0") {
                $("#tipoUser").removeAttr("style");
                $("#tipoUser").css({
                    "border-radius": "20px"
                });
                res = true;
            }
            if ($("#tipoServ").val() !== "0") {
                $("#tipoServ").removeAttr("style");
                $("#tipoServ").css({
                    "border-radius": "20px"
                });
                res2 = true;
            }

            var resp = res && res2 ? true : false;
            console.log(resp);
            return resp;
        };
        var enviar = function (e) {
            if (!validarInputs()) {

                e.preventDefault();
            } else if (!validarCheckbox()) {

                e.preventDefault();
            } else if (!validarSelect()) {
                e.preventDefault();
            } else {
                e.preventDefault();
                var DatosRegistro = {};
                for (var i = 0; i < elementos.length; i++) {
                    if (elementos[i].type === "text" || elementos[i].type === "email" || elementos[i].type === "password") {
                        var key = elementos[i].id;
                        var valor = elementos[i].value;
                        DatosRegistro[key] = valor;
                    }

                }
//                DatosRegistro.Confirma = document.getElementById("confirma").checked;
                DatosRegistro.Confirma = "false";
                //DatosRegistro.RegistradoPor = getCookie("username_v3.2_" + DEPENDENCIA)==="" ? "NULL" : JSON.parse(getCookie("username_v3.2_" + DEPENDENCIA)).idUsuario_Sys;
                DatosRegistro.RegistradoPor = "NULL";
                DatosRegistro.tipo_usuario = $("#tipoUser").val();
                DatosRegistro.tipo_servicio = $("#tipoServ").val();
                
                

                var verifica = Verifica(DatosRegistro);

                verifica.then(function (respuesta) {
                    if (respuesta.procede) {
                        alert(respuesta.mensaje);
//                        location.reload();
                        var hostdir = window.location.protocol + "//" + window.location.host;
                        var path = hostdir + "/" + DEPENDENCIA + "/Login";
                        window.location.replace(path);

                    } else {
                        alert(respuesta.mensaje);
                        document.getElementById("Correo").value = "";
                        document.getElementById("Correo").parentNode.className = document.getElementById("Correo").parentNode.className + " error";
                    }
                });


            }
        };
        var focusInput = function () {
            this.parentElement.children[1].className = "label active";
            this.parentElement.children[0].className = this.parentElement.children[0].className.replace("error", "");
        };
        var blurInput = function () {
            if (this.value <= 0) {
                this.parentElement.children[1].className = "label";
                this.parentElement.children[0].className = this.parentElement.children[0].className + " error";
            }
        };
// --- Eventos ---
        formulario.addEventListener("submit", enviar);
        for (var i = 0; i < elementos.length; i++) {
            if (elementos[i].type === "text" || elementos[i].type === "url" || elementos[i].type === "email" || elementos[i].type === "password") {
                elementos[i].addEventListener("focus", focusInput);
                elementos[i].addEventListener("blur", blurInput);
            }
        }

    }());
});
// Recorrer los elementos y hacer que onchange ejecute una funcion para comprobar el valor de ese input



function Verifica(datos) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/Verifica',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(datos),
        success: function (response) {


        },
        error: function (err) {


        }
    }));
}

function CrearRegistro(DatosRegistro) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/CreaRegistro',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DatosRegistro),
        success: function (response) {
        },
        error: function (err) {
        }
    }));
}



function traeServicios(tipo_usuario, tipo_servicio) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/traeServicios',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "tipo_usuario": tipo_usuario,
            "tipo_servicio": tipo_servicio
        }),
        success: function (response) {
            console.log(response);
        },
        error: function (err) {
            console.log(err);
        }
    }));
}

function modalAgregaServicio(nombre) {
    creaModal(nombre);
    $("#RegistraServicio").attr("data-toggle", "modal");
    $("#RegistraServicio").attr("data-target", "#modal-" + nombre);
    var iframe = document.createElement("iframe");
    iframe.style = "height:100%;width: 100%;display:block;";
    iframe.src = "RegistroInstitucion";


    var modalS = document.getElementById('modal-' + nombre);
    var spanS = document.getElementById("CloseFrame-" + nombre);
    muestra_modal(modalS, spanS);
    modalS.appendChild(iframe);
}

function muestra_modal(modal, span) {
    modal.style = "background-color: black; margin: auto;  border: 1px solid rgb(64, 69, 79); width: 90%; height: 90%; position:relative; margin-top:2%;";
    span.style = "width: 7%;color: black;opacity: unset;text-align: end;padding-right: 0.5rem;cursor: pointer;margin-left: auto;font-size: 2.5rem;";

    Span(span, modal);
    Wonclic(modal);
}

function Span(span, modal) {
    span.onclick = function () {
//        modal.style.display = "none";
//        $(".modal-backdrop").remove();
        location.reload();
    };
}

function Wonclic(modal) {
    window.onclick = function (event) {
        if (event.target === modal) {
//            modal.style.display = "none";
//            $(".modal-backdrop").remove();
            location.reload();
        }
    };
}