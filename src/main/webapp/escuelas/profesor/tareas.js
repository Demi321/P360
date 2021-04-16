/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$("#form_RegistrarTarea").submit((e) => {
        e.preventDefault();

        let json = buildJSON_Section("form_RegistrarTarea");
        json.fecha_entrega = $("#fecha_tarea").val(); 
       // json.logotipo = json.upFile_logo_nueva_empresa_logotipo;
        //json.id360 = sesion_cookie.id_usuario;
        console.log(json);
        RequestPOST("/API/registro/tarea", json).then((response) => {
            console.log(response);
            swal.fire({
                text: response.mensaje
            }).then(() => {
                //recargar por access token 
                if (response.success) {
                    $('#base_modulo_tareas').load('tareas_profesor')
                }
            });
        });
    });
    
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
                    $("#materia_tarea").append("<option class='celdamateria' value="+response.materia[i].id_materia+">"+response.materia[i].nombre_materia+"</option>");
                }
            }
        });
    }
    
    function calificar_tarea(id_evaluacion, id_grupo){
        $('#contenidoSection').load('calificar_tarea?id_grupo='+id_grupo+'&id_evaluacion='+id_evaluacion)
    }
    
    function calificar(id_usuario, id_evaluacion,id_grupo){
        var json = {};
        json.id_usuario = id_usuario;
        json.id_evaluacion = id_evaluacion;
        json.calificacion = $("#calificacion_tarea").val();
        
         RequestPOST("/API/calificar/tarea", json).then((response) => {
            console.log(response);
            swal.fire({
                text: response.mensaje
            }).then(() => {
                if(response.success === true){
                    //alert(response.url);
                   $('#contenidoSection').load('calificar_tarea?id_grupo='+id_grupo+'&id_evaluacion='+id_evaluacion)
                }
                //recargar por access token 
                
            });
        });
    }
    
    function ver_documento(usuario,tarea){
        var json = {};
        json.id_usuario = usuario;
        json.id_evaluacion = tarea;
       // json.logotipo = json.upFile_logo_nueva_empresa_logotipo;
        //json.id360 = sesion_cookie.id_usuario;
        console.log(json);
        RequestPOST("/API/revisar/tarea", json).then((response) => {
            console.log(response);
            swal.fire({
                text: response.mensaje
            }).then(() => {
                if(response.success === true && response.url !== null){
                    //alert(response.url);
                    window.open(response.url, '_blank');
                }
                //recargar por access token 
                
            });
        });
      //  alert(usuario+" user === tarea "+tarea);
    }
    function ver_tarea_alumno(id_usuario,id_evaluacion){
        $('#contenidoSection').load('ver_tarea_alumno?id_usuario='+id_usuario+'&id_evaluacion='+id_evaluacion)
    }