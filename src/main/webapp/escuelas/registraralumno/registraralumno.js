/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* Accion para registrar y activar una empresa */

$("#form_RegistrarAlumno").submit((e) => {
    e.preventDefault();

    let json = buildJSON_Section("form_RegistrarAlumno");
   // json.logotipo = json.upFile_logo_nueva_empresa_logotipo;
    //json.id360 = sesion_cookie.id_usuario;
    console.log(json);
    RequestPOST("/API/registro/alumno_grupo", json).then((response) => {
        console.log(response);
        swal.fire({
            text: response.mensaje
        }).then(() => {
            //recargar por access token 
            if (response.success) {
                var id = response.id
                $('#base_modulo_RegistrarSucursal').load('registro_alumno')
                /*let url = window.location.protocol + "//" + window.location.host + "/" + DEPENDENCIA + "/";
                acceso_externo(url);*/
            }
        });
    });
});

function eliminarAlumno(alumno){
    
        let json = {};
        json.id_alumno = alumno;
        
        console.log(json);
       RequestPOST("/API/elimina/alumno_horario", json).then((response) => {
            console.log(response);
            swal.fire({
                text: response.mensaje
            }).then(() => {
                //recargar por access token 
                if (response.success) {
                    var id = response.id
                    $('#base_modulo_RegistrarSucursal').load('registro_alumno')
                    /*let url = window.location.protocol + "//" + window.location.host + "/" + DEPENDENCIA + "/";
                    acceso_externo(url);*/
                }
            });
        });
    }