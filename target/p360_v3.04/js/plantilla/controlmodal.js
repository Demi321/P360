/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function funcion_aparecer(){
    //Con esto hacemos referencia al modal y lo guardamos
    var miModal = document.getElementById('miModal');
    //Acá hacemos aparecer al modal
    $("#miModal").fadeIn("3000");
    miModal.style.display = 'block';
    document.getElementById("iconMenu").className="glbl glbl-close";
    document.getElementById("accionMenu").setAttribute("onclick","funcion_cerrar()");
    document.getElementById("iconMenu2").className="glbl glbl-close";
    document.getElementById("accionMenu2").setAttribute("onclick","funcion_cerrar()");
    
}

function funcion_cerrar(){
  $("#miModal").fadeIn("slow");
    //Con esto hacemos referencia al modal y lo guardamos
    var miModal = document.getElementById('miModal');
    //Acá hacemos invisible al modal

    miModal.style.display = 'none';
    document.getElementById("iconMenu").className="glbl glbl-menu";
    document.getElementById("accionMenu").setAttribute("onclick","funcion_aparecer()");
    document.getElementById("iconMenu2").className="glbl glbl-menu";
    document.getElementById("accionMenu2").setAttribute("onclick","funcion_aparecer()");
}


