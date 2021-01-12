/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global swal, sesion_cookie, RequestPOST, RequestGET */

agregar_menu("Notas", '<i class="fas fa-sticky-note"></i>', "Trabajo");



function add_note() {
    console.log("Añadiendo nueva nota");
    swal.fire({
        title: "Agregar nueva nota",
        html: '<label class="w-100 text-left">Título</label>\n\
              <input type="text" placeholder="Título (opcional)" id="titulo_nota" class="w-100">\n\
              <label class="w-100 text-left">Nota</label>\n\
              <textarea rows="5" cols="15" id="nota"></textarea>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Agregar Nota",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
            return [
                $("#titulo_nota").val(),
                $("#nota").val()
            ];
        }
    }).then((result) => {
        console.log(result);
        if (result.value) {
            let titulo = result.value[0];
            let nota = result.value[1];
            if (nota.replace(/ /g, "").length > 0) {
                //Guardamos la nota en BD
                let json = {
                    id360: sesion_cookie.id_usuario,
                    tipo_usuario: sesion_cookie.tipo_usuario,
                    tipo_servicio: sesion_cookie.tipo_servicio,
                    tipo_area: sesion_cookie.tipo_area,
                    titulo: titulo,
                    nota: nota
                };
                RequestPOST("/API/empresas360/add_note", json).then((response) => {
                    console.log(response);
                    swal.fire({
                        text: response.mensaje
                    }).then(() => {
                        if (response.success) {
                            json.id_nota = response.id_nota;
                            inserta_nota(json);
                        }
                    });
                });
            } else {
                swal.fire({
                    text: "No puede agregar notas vacias. Por favor añada texto a la nota."
                });
            }
        }
    });
}

function inserta_nota(info_nota) {
    /*
     <div class="card m-2" style="width: 18rem;">
     <div class="card-body card-body-nota">
     <input class="card-title card-title-nota" disabled='true'>
     <textarea class="card-text" disabled="true"></textarea>
     <div class="col-12 card-footer-nota">
     <i class="fas fa-edit card-footer-nota-edit"></i>
     <i class="fas fa-trash-alt card-footer-nota-delete"></i>
     </div>
     </div>
     </div>
     */
    let card = $('<div class="card m-2 mb-5 mr-5" style="width: 18rem;" id="nota_' + info_nota.id_nota + '"></div>');
    let card_body = $('<div class="card-body card-body-nota"></div>');
    if (info_nota.titulo !== null) {
        if (info_nota.titulo.replace(/ /g, "").length > 0) {
            let card_title = $('<input class="card-title card-title-nota" id="card_title_' + info_nota.id_nota + '" disabled="true" value="' + info_nota.titulo + '">');
            card_body.append(card_title);
        }
    }
    let card_nota = $('<textarea class="card-text" id="card_note_' + info_nota.id_nota + '" disabled="true"></textarea>');
    card_nota.val(info_nota.nota);
    let card_footer = $('<div class="col-12 card-footer-nota"></div>');
    let card_edit = $('<i class="fas fa-edit card-footer-nota-edit" id="card_edit_' + info_nota.id_nota + '" title="Editar Nota" onclick="edit_note(' + info_nota.id_nota + ')"></i>');
    let card_accept = $('<i class="far fa-check-square card-footer-nota-edit d-none" id="card_accept_' + info_nota.id_nota + '" title="Guardar Cambio" onclick="save_note(' + info_nota.id_nota + ')"></i>');
    let card_delete = $('<i class="fas fa-trash-alt card-footer-nota-delete" id="card_delete_' + info_nota.id_nota + '" title="Eliminar Nota" onclick="delete_note(' + info_nota.id_nota + ')"></i>');
    card_footer.append(card_edit);
    card_footer.append(card_accept);
    card_footer.append(card_delete);
    card_body.append(card_nota);
    card_body.append(card_footer);

    card.append(card_body);
    $("#contenido_cards").append(card);
    //agregar_listeners_card(info_nota.id_nota);
    //Añadir listeners para editar y eliminar una card

}
function edit_note(id_nota) {
    console.log("editando nota");
    console.log(id_nota);
    if ($("#card_title_" + id_nota).length) {
        $("#card_title_" + id_nota).removeAttr("disabled");
    }
    $("#card_note_" + id_nota).removeAttr("disabled");
    $("#card_edit_" + id_nota).addClass("d-none");
    $("#card_accept_" + id_nota).removeClass("d-none");
}
function save_note(id_nota) {
    console.log("editando nota");
    console.log(id_nota);
    let json = {
        id_nota: id_nota,
        nota: $("#card_note_" + id_nota).val()
    };
    if ($("#card_title_" + id_nota).length) {
        titulo = $("#card_title_" + id_nota).val();
    }
    RequestPOST("/API/empresas360/edit_note", json).then((response) => {
        console.log(response);
        swal.fire({
            text: response.mensaje
        }).then(() => {
            if (response.success) {
                if ($("#card_title_" + id_nota).length) {
                    $("#card_title_" + id_nota).attr("disabled", "true");
                }
                $("#card_note_" + id_nota).attr("disabled", "true");
                $("#card_edit_" + id_nota).removeClass("d-none");
                $("#card_accept_" + id_nota).addClass("d-none");
            }
        });
    });
}
function delete_note(id_nota) {
    console.log("editando nota");
    console.log(id_nota);
    swal.fire({
        title: "Eliminar nota",
        text: "¿Seguro que desea eliminar esta nota?",
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        console.log(result);
        if (result.value) {
            let json = {
                id_nota:id_nota
            };
            RequestPOST("/API/empresas360/delete_note",json).then((response) => {
                swal.fire({
                    text:response.mensaje
                }).then(()=>{
                    if (response.success) {
                        //Eliminar nota
                        $("#nota_"+id_nota).remove();
                    }
                });
            });
        }
    });
}

function get_notas(){
    RequestGET("/API/empresas360/get_notas/"+sesion_cookie.id_usuario).then((response)=>{
        console.log(response);
        $.each(response,(i)=>{
            inserta_nota(response[i]);
        });
    });
}
get_notas();