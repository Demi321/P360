/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global DEPENDENCIA, hostdir, Promise */

//alert("hola");

$("#agregarDependencia").submit(function (e) {
    e.preventDefault();
   
    AgregarDependencia();
});


var dep = DependenciasAsociadas();
dep.then(function (data) {
   
    var DepAsoc = JSON.parse(data);
   
    for (var i = 0; i < DepAsoc.length; i++) {
        var div = document.createElement("div");
        div.className = "col-10 mx-auto mt-1 mb-2";
        div.style = "background: white; border-radius: 5px;";

        var form = document.createElement("form");
        form.className = "form-inline";
        form.method = "POST";
        form.action = "#";
        form.id = "form" + DepAsoc[i].id;

        var divswitch = document.createElement("div");
        divswitch.className = "custom-control custom-switch";

        var inputswitch = document.createElement("input");
        inputswitch.type = "checkbox";
        inputswitch.className = "custom-control-input";
        inputswitch.id = DepAsoc[i].id;
        if (parseInt(DepAsoc[i].activo)) {
            inputswitch.checked = true;
        } else {
            inputswitch.checked = false;
        }

        var label = document.createElement("label");
        label.htmlFor = DepAsoc[i].id;
        label.className = "custom-control-label";

        var inputAlias = document.createElement("input");
        inputAlias.type = "text";
        inputAlias.className = "form-control";
        inputAlias.value = DepAsoc[i].alias;
        inputAlias.style = "max-width: 50%; margin-left: 15px; border: none; background: white; color: black; ";
        inputAlias.disabled = true;

        var submit = document.createElement("input");
        submit.type = "submit";
        submit.className = "BorrarDependencia";
        submit.title = "Eliminar dependencia";
        submit.value = "";

        
        var img =document.createElement("img");
        img.src=DepAsoc[i].icon;
        img.style="position: absolute; width: 20px; left: -24px; top: 5px;";


        divswitch.appendChild(inputswitch);
        divswitch.appendChild(label);
        form.appendChild(divswitch);
        form.appendChild(inputAlias);
        form.appendChild(submit);
      
        if(DepAsoc[i].icon!==""  && DepAsoc[i].icon!==undefined && DepAsoc[i].icon!==null && DepAsoc[i].icon!=="null"){
          div.appendChild(img);  
        }
        div.appendChild(form);
        document.getElementById("dependencias").appendChild(div);

        CheckerListener(DepAsoc[i].id, DepAsoc[i].alias);
        BorrarDependenciaListener(DepAsoc[i].id, DepAsoc[i].alias);

    }

    function BorrarDependenciaListener(id, alias) {
        $("#form" + id).submit(function (e) {
            e.preventDefault();

            const Toast = Swal.mixin({
                toast: false,
                position: 'center'
            });
            Toast.fire({
                html: "<h1 style=\"color: #D7D7D7;\">Eliminar dependencia</h1><p style=\"color: white;font-size: 15px;\">Está acción eliminara del menu la dependencia: <br><label style=\"color: bisque;font-size: 15px;margin: 0;\">" + alias + "</label><br>Si desea continuar presione en \"Eliminar\" <br><label style=\"color: bisque;font-size: 15px;margin: 0;\"></label></p>",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                allowOutsideClick: true,
                confirmButtonText: 'Eliminar!'
            }).then((result) => {
                if (result.value) {

                    DependenciaCambiarEstado(id, 2).then(function (data) {
                        if (data.success) {
                            const Toast = Swal.mixin({
                                toast: true,
                                position: 'center',
                                showConfirmButton: false,
                                timer: 1500
                            });

                            Toast.fire({
                                type: 'success',
                                title: alias + 'se ha eliminado correctamente: '
                            }).then(function () {
                                window.location.reload();

                            });
                        } else {
                            const Toast = Swal.mixin({
                                toast: true,
                                position: 'center',
                                showConfirmButton: false,
                                timer: 1500
                            });

                            Toast.fire({
                                type: 'error',
                                title: 'No se pudo eliminar ' + alias
                            }).then(function () {
                                window.location.reload();

                            });
                        }
                    });
                }
            });


        });
    }

    function CheckerListener(id, alias) {

        $("#" + id).change(function () {
           
            //e.preventDefault();
            
            if ($(this).is(':checked')) {
                
                const Toast = Swal.mixin({
                    toast: false,
                    position: 'center'
                });
                Toast.fire({
                    html: "<h1 style=\"color: #D7D7D7;\">Habilitar dependencia</h1><p style=\"color: white;font-size: 15px;\">Está a punto de habilitar la dependencia: <br><label style=\"color: bisque;font-size: 15px;margin: 0;\">" + alias + "</label><br>Si desea continuar presione en \"Habilitar\" <br><label style=\"color: bisque;font-size: 15px;margin: 0;\"></label></p>",
                    type: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    allowOutsideClick: true,
                    confirmButtonText: 'Habilitar!'
                }).then((result) => {
                    if (result.value) {

                        DependenciaCambiarEstado(id, 1).then(function (data) {
                            if (data.success) {
                                const Toast = Swal.mixin({
                                    toast: true,
                                    position: 'center',
                                    showConfirmButton: false,
                                    timer: 1000
                                });

                                Toast.fire({
                                    type: 'success',
                                    title: 'Habilitando: ' + alias
                                }).then(function () {
                                    window.location.reload();

                                });
                            } else {
                                const Toast = Swal.mixin({
                                    toast: true,
                                    position: 'center',
                                    showConfirmButton: false,
                                    timer: 1000
                                });

                                Toast.fire({
                                    type: 'error',
                                    title: 'No se pudo habilitar ' + alias
                                }).then(function () {
                                    window.location.reload();

                                });
                            }
                        });



                    } else {
                        document.getElementById(id).checked = false;
                    }
                });

            } else {
                
                const Toast = Swal.mixin({
                    toast: false,
                    position: 'center'
                });
                Toast.fire({
                    html: "<h1 style=\"color: #D7D7D7;\">Deshabilitar dependencia</h1><p style=\"color: white;font-size: 15px;\">Está a punto de deshabilitar la dependencia: <br><label style=\"color: bisque;font-size: 15px;margin: 0;\">" + alias + "</label><br>Si desea continuar presione en \"Deshabilitar\" <br><label style=\"color: bisque;font-size: 15px;margin: 0;\"></label></p>",
                    type: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    allowOutsideClick: true,
                    confirmButtonText: 'Deshabilitar!'
                }).then((result) => {
                    if (result.value) {

                        DependenciaCambiarEstado(id, 0).then(function (data) {
                            if (data.success) {
                                const Toast = Swal.mixin({
                                    toast: true,
                                    position: 'center',
                                    showConfirmButton: false,
                                    timer: 1000
                                });

                                Toast.fire({
                                    type: 'success',
                                    title: 'Habilitando: ' + alias
                                }).then(function () {
                                    window.location.reload();

                                });
                            } else {
                                const Toast = Swal.mixin({
                                    toast: true,
                                    position: 'center',
                                    showConfirmButton: false,
                                    timer: 1000
                                });

                                Toast.fire({
                                    type: 'error',
                                    title: 'No se pudo habilitar ' + alias
                                }).then(function () {
                                    window.location.reload();

                                });
                            }
                        });



                    } else {
                        document.getElementById(id).checked = false;
                    }
                });
            }
        });
    }


});

function DependenciaCambiarEstado(id, estado) {
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/DependenciaCambiarEstado',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "activo": estado,
            "id": id
        }),
        success: function (data) {
           
            
        },
        error: function (err) {
           
        }
    }));
}

function DependenciasAsociadas() {
    return Promise.resolve($.ajax({
        type: 'GET',
        url: '/' + DEPENDENCIA + '/DependenciasAsociadas',
        success: function (data) {
            
            
        },
        error: function (err) {
          
        }
    }));
}

function AgregarDependencia() {

    var alias = document.getElementById("DependenciaAlias").value;
    const Toast = Swal.mixin({
        toast: false,
        position: 'center'
    });
    Toast.fire({
        html: "<h1 style=\"color: #D7D7D7;\">Agregar dependencia</h1><p style=\"color: white;font-size: 15px;\">Está acción agregara al menu la dependencia: <br><label style=\"color: bisque;font-size: 15px;margin: 0;\">" + alias + "</label><br>Si desea continuar presione en \"Agregar\" <br><label style=\"color: bisque;font-size: 15px;margin: 0;\"></label></p>",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        allowOutsideClick: true,
        confirmButtonText: 'Agregar!'
    }).then((result) => {
        if (result.value) {
            var nombre = document.getElementById("DependenciaNombre").value;

            var url = document.getElementById("DependenciaURL").value;
            
            var icon = document.getElementById("DependenciaIcon").value;

            return Promise.resolve($.ajax({
                type: 'POST',
                url: '/' + DEPENDENCIA + '/AgregarDependencia',
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "nombre": nombre,
                    "alias": alias,
                    "url": url,
                    "icon":icon
                }),
                success: function (data) {
                   
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'center',
                        showConfirmButton: false,
                        timer: 1000
                    });

                    Toast.fire({
                        type: 'success',
                        title: 'Se agrego: ' + alias
                    }).then(function () {
                        window.location.reload();

                    });
                },
                error: function (err) {
                   
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'center',
                        showConfirmButton: false,
                        timer: 1000
                    });

                    Toast.fire({
                        type: 'error',
                        title: 'No se pudo agregar: ' + alias
                    }).then(function () {
                       // window.location.reload();

                    });
                }
            }));
        }
    });

}