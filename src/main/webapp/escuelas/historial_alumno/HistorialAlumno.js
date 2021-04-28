/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 function historial_alumno(id){
       let json = {};
        json.id_usuario = id;

        $(".celdaAlumnos").remove();
        RequestPOST("/API/historial/alumno_historial", json).then((response) => {
            console.log(response);
            
            //recargar por access token 
            if (response.success) {
                //console.log(response.materia.length)
              for(var i = 0;i < response.historial.length  ;i++){
                    $("#tablaHistorialAlumno > tbody:last").append("<tr class='celdaAlumnos'> <td>"+response.historial[i].nombre_materia+"</td><td>"+response.historial[i].nombre_periodo+"</td><td>"+response.historial[i].recurse+"</td><td>"+response.historial[i].calificacion+"</td> </tr>");
                }
            }
        });
    }

