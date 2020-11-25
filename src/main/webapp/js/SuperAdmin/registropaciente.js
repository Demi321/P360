/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global DEPENDENCIA, Promise, Swal */

$("#Cancelar").on("click", function () {
    var hostdir = window.location.protocol + "//" + window.location.host;
    var path = hostdir + "/" + DEPENDENCIA + "/Administrador";
    window.location.replace(path);
});

$("#formPaciente").on("submit", function (e) {
    e.preventDefault();
    console.log("bingo!!");
    var json = {
        "nombre": $("#nombre").val(),
        "apellido_paterno": $("#apellido_paterno").val(),
        "apellido_materno": $("#apellido_materno").val(),
        "direccion": $("#direccion").val(),
        "telefono": $("#telefono").val(),
        "edad": $("#edad").val()
    };
    registrarPaciente(json).then(function (response) {
        if (response.procede) {
            Swal.fire({
                title: 'Exito',
                html: response.mensaje,
                showCancelButton: false,
                showConfirmButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Continuar'
            }).then((result) => {
                $("#divid").removeClass("d-none");
                $("#idpaciente").val(response.serie_paciente);
                $("#Registrar").text("Nuevo Paciente");
                $("#Registrar").on("click",function(){
                    window.location.reload();
                });
            });
            changeSwal();
        } else {
            Swal.fire({
                title: 'Alto',
                html: response.mensaje,
                showCancelButton: false,
                showConfirmButton: false,
                timer: 1500
            });
            changeSwal();
        }
    });
});

function registrarPaciente(json) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/registrarPaciente',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(json),
        success: function (response) {
        },
        error: function (err) {
            console.log(err);
        }
    }));
}

function changeSwal() {
    if ($("#swal2-content").length) {
        document.getElementById("swal2-content").style = "display: block; color: white; padding-top: 20px;";
    }
    if ($(".swal2-confirm").length) {
        var swal2confirm = document.getElementsByClassName("swal2-confirm")[0];
        swal2confirm.style = "background-color: #dc3545;";
    }
}