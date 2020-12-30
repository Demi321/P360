/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global swal, sesion_cookie, RequestPOST */

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
    let card = $('<div class="card m-2" style="width: 18rem;" id="nota_' + info_nota.id_nota + '"></div>');
    let card_body = $('<div class="card-body card-body-nota"></div>');
    if (info_nota.titulo.replace(/ /g, "").length > 0) {
        let card_title = $('<input class="card-title card-title-nota" disabled="true" value="' + info_nota.titulo + '">');
        card_body.append(card_title);
    }
    let card_nota = $('<textarea class="card-text" disabled="true"></textarea>');
    card_nota.val(info_nota.nota);
    let card_footer = $('<div class="col-12 card-footer-nota"></div>');
    let card_edit = $('<i class="fas fa-edit card-footer-nota-edit" id="card_edit" title="Editar Nota"></i>');
    let card_accept = $('<i class="far fa-check-square card-footer-nota-edit d-none" id="card_accept" title="Guardar Cambio"></i>');
    let card_delete = $('<i class="fas fa-trash-alt card-footer-nota-delete" id="card_delete" title="Eliminar Nota"></i>');
    card_footer.append(card_edit);
    card_footer.append(card_accept);
    card_footer.append(card_delete);
    card_body.append(card_nota);
    card_body.append(card_footer);

    card.append(card_body);
    $("#contenido_cards").append(card);

    //Añadir listeners para editar y eliminar una card
    card_edit.click(() => {
        //habilitar el titulo y la nota, asi como el boton para validar los cambios
        if (card_title.length) {
            card_title.removeAttr("disabled");
        }
        card_nota.removeAttr("disabled");
        card_edit.addClass("d-none");
        card_accept.removeClass("d-none");
    });
    card_accept.click(() => {
        let json = {
            id_nota: info_nota.id_nota,
            nota: card_nota.val()
        };
        if (card_title.length) {
            json.titulo = card_title.val();
        }
        RequestPOST("/API/empresas360/edit_note", json).then((response) => {
            console.log(response);
            swal.fire({
                text: response.mensaje
            }).then(() => {
                if (response.success) {
                    if (card_title.length) {
                        card_title.attr("disabled", "true");
                    }
                    card_nota.attr("disabled", "true");
                    card_edit.removeClass("d-none");
                    card_accept.addClass("d-none");
                }
            });
        });
    });
}