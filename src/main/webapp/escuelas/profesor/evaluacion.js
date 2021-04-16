/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


 function materia_grupo(id){
         let json = {};
        json.id_grupo = id;

        $(".celdaAlumnos").remove();
        RequestPOST("/API/consulta/alumnos", json).then((response) => {
            console.log(response);
            
            //recargar por access token 
            if (response.success) {
                //console.log(response.materia.length)
                for(var i = 0;i < response.alumnos.length  ;i++){
                    $("#tablaAlumnos > tbody:last").append("<tr class='celdaAlumnos'> <td>"+response.alumnos[i].nombre_grupo+"</td><td>Alumno "+response.alumnos[i].id_usuario+"</td><td><button class='btn btn-secondary' title='Ver evaluación' onclick='tareasEntregadas("+response.alumnos[i].id_usuario+")'><span>Ver</span></button></td>  </tr>");
                }
            }
        });
    }
    function tareasEntregadas (id_usuario){
        $('#contenidoSection').load('ver_tarea_entregada_alumno?id_usuario='+id_usuario)
    }