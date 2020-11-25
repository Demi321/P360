/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global DEPENDENCIA */

var Usuarios = new Array;
Usuarios.push(document.getElementById("id1").value);
Usuarios.push(document.getElementById("id2").value);
Usuarios.push(document.getElementById("id3").value);
Usuarios.push(document.getElementById("id4").value);

for (i = 0; i < Usuarios.length; i++)
{
    $.ajax({
        type: 'POST',
        url: '/'+DEPENDENCIA+'/Consulta',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "idUsuarios_Movil": Usuarios[i]
        }),
        success: function (response) {

           

            document.getElementById(response["idUsuarios_Movil"]).setAttribute("src", response["img"]);
//            document.getElementById("NombrePerfil").innerHTML = response["nombre"];
//            document.getElementById("ApellidoP").innerHTML = response["apellido_paterno"];
//            document.getElementById("ApellidoM").innerHTML = response["apellido_materno"];


        },
        error: function (err) {
            alert("Error el usuario no esta registrado en la base de datos");
        }
    });
}


