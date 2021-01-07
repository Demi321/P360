/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global bodymovin, JSONlottie, AWS, RequestPOST, getCookie, DEPENDENCIA, google, map, infowindow, RequestGET, Swal, WebSocketGeneral, sesion_cookie */
/*Cambios prueba Fernando*/
let url_ext = "https://seguridadsanitaria.calro360.com/lineamientos";
if (sesion_cookie.tipo_servicio === "0") {
    agregar_menu("Moinitoreo de Sucursales", '<i class="fas fa-user-lock"></i>', "Seguridad Sanitaria", url_ext);
    agregar_menu("Lineamientos de Seguridad Estatales", '<i class="fas fa-user-lock"></i>', "Seguridad Sanitaria", url_ext);
    agregar_menu("Protocolos y Procedimientos", '<i class="fas fa-user-shield"></i>', "Seguridad Sanitaria", url_ext);
    agregar_menu("Brigadistas", '<i class="fas fa-user-shield"></i>', "Seguridad Sanitaria", url_ext);
    agregar_menu("Asignación de Superviciones", '<i class="fas fa-users-cog"></i>', "Seguridad Sanitaria", url_ext);
    agregar_menu("Reportes de Supervisión", '<i class="fas fa-file-alt"></i>', "Seguridad Sanitaria", url_ext);
    agregar_menu("Reportes de Supervisión - Agregado", '<i class="fas fa-file-alt"></i>', "Seguridad Sanitaria", url_ext);
} else {
    agregar_menu("Seguridad Sanitaria", '<i class="far fa-building"></i>', "Seguridad Sanitaria", url_ext);
    agregar_menu("Reporte de Evidencias", '<i class="fas fa-file-alt"></i>', "Seguridad Sanitaria", url_ext);
    agregar_menu("Lineamientos de Seguridad Estatales", '<i class="fas fa-user-lock"></i>', "Seguridad Sanitaria", url_ext);
    agregar_menu("Protocolos y Procedimientos", '<i class="fas fa-user-shield"></i>', "Seguridad Sanitaria", url_ext);
    agregar_menu("Reporte Consolidado", '<i class="fas fa-file-alt"></i>', "Seguridad Sanitaria", url_ext);
    agregar_menu("Brigadistas", '<i class="fas fa-user-shield"></i>', "Seguridad Sanitaria", url_ext);
    agregar_menu("Asignación de Superviciones", '<i class="fas fa-users-cog"></i>', "Seguridad Sanitaria", url_ext);
    agregar_menu("Reporte de Supervisión", '<i class="fas fa-file-alt"></i>', "Seguridad Sanitaria", url_ext);
    agregar_menu("Reporte de Supervisión - Agregado", '<i class="fas fa-file-alt"></i>', "Seguridad Sanitaria", url_ext);
}
/************************************************************************/