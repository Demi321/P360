/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function materia_grupo(id){
         let json = {};
        json.id_grupo = id;
        json.id_usuario = 1;

        $(".celdamateria").remove();
        RequestPOST("/API/consulta/materia", json).then((response) => {
            console.log(response);
            
            //recargar por access token 
            if (response.success) {
                console.log(response.materia.length)
                for(var i = 0;i < response.materia.length  ;i++){
                    $("#materia_calificacion").append("<option class='celdamateria' onclick='listarAlumnos()' value="+response.materia[i].id_materia+">"+response.materia[i].nombre_materia+"</option>");
                }
            }
        });
    }
    
    function listarAlumnos(){
        let json = {};
        json.id_materia = $("#materia_calificacion").val();
        json.id_grupo = $("#grupo_calificacion").val();

        $(".celdaAlumnos").remove();
        RequestPOST("/API/consulta/calificacion_alumnos", json).then((response) => {
            console.log(response);
            
            //recargar por access token 
            if (response.success) {
                //console.log(response.materia.length)
                for(var i = 0;i < response.alumnos.length  ;i++){
                    $("#tablaAlumnos > tbody:last").append("<tr class='celdaAlumnos'> <td>"+response.alumnos[i].nombre_grupo+"</td><td>"+response.alumnos[i].nombre_materia+"</td><td>Alumno "+response.alumnos[i].id_usuario+"</td><td><button class='btn btn-success' title='Calificar' onclick='calificar("+i+","+response.alumnos[i].id_usuario+","+response.alumnos[i].id_materia+","+response.alumnos[i].id_grupo+")'><span>Calificar</span></button></td>  </tr>");
                }
            }
        });
        //alert("MATERIA: "+$("#materia_calificacion").val()+"--------GRUPO: "+$("#grupo_calificacion").val());
    }
    
    function calificar(bandera,id_usuario,id_materia,id_grupo){
        
        var id_materia = id_materia;
        var id_grupo = id_grupo;
        var id_usuario = id_usuario;

       // $(".celdaAlumnos").remove();
        $('#contenidoSection').load('calificar_alumno?id_grupo='+id_grupo+'&id_materia='+id_materia+'&id_usuario='+id_usuario)
       // alert("Bandera:"+bandera+"-- alumno: "+id_usuario+"-- materia: "+id_materia+"--- grupo:"+id_grupo+"--- Calif: "+$("#calificacion_alumno"+bandera).val());
    }
    
      function calificarAlumno(id_usuario,id_materia,id_grupo){
        let json = {};
        json.id_materia = id_materia;
        json.id_grupo = id_grupo;
        json.id_usuario = id_usuario;
        json.calificacion = $("#calificacion_alumno").val();

        $(".celdaAlumnos").remove();
        RequestPOST("/API/registra/calificacion_alumnos", json).then((response) => {
            console.log(response);
            
            //recargar por access token 
            if (response.success) {
                //console.log(response.materia.length)
                for(var i = 0;i < response.alumnos.length  ;i++){
                    $("#tablaAlumnos > tbody:last").append("<tr class='celdaAlumnos'> <td>"+response.alumnos[i].nombre_grupo+"</td><td>"+response.alumnos[i].nombre_materia+"</td><td>Alumno "+response.alumnos[i].id_usuario+"</td><td><button class='btn btn-success' title='Calificar' onclick='calificar("+i+","+response.alumnos[i].id_usuario+","+response.alumnos[i].id_materia+","+response.alumnos[i].id_grupo+")'><span>Calificar</span></button></td>  </tr>");
                }
            }
        });
        //alert("MATERIA: "+$("#materia_calificacion").val()+"--------GRUPO: "+$("#grupo_calificacion").val());
    }