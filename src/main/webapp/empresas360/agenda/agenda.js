/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var date = new Date();
var usuario_id = 1; //TU LO MOFICAS
var zona_horaria = "America/Mexico_City";//TU LO MODIFICAS
var eventos_usuario = []
function getEventos() {
    fetch("https://agenda360.ml/api/eventos/usuario", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'usuario_id': usuario_id,
            'zona_horaria': zona_horaria
        })
    }).then(response => response.json()).then((data) => {
        console.log(data)
        let events = data.data
        eventos_usuario = events.map(function (event) {
            return {
                'id': event.id,
                'title': event.titulo,
                'start': event.inicio,
                'end': event.fin,
                'evento': event
            }
        })
    });
}
function showEvent(evento_id) {
    fetch("https://agenda360.ml/api/eventos/" + evento_id)
            .then(response => response.json())
            .then((data) => {
                evento = data.data
                body_html = `
    				<div class="row">
    					<div class="col-12 col-md-4 mt-2">
    						<label>Titulo</label>
    						<input class="form-control" type="text" readonly="" value="${evento.titulo}">
    					</div>
    					<div class="col-12 col-md-4 mt-2">
    						<label>Descripción</label>
    						<textarea class="form-control" readonly="">${evento.descripcion ? evento.descripcion : "N/A" }</textarea>
    					</div>
    					<div class="col-12 col-md-4 mt-2">
    						<label>Fecha Inicio</label>
    						<input class="form-control" type="text" readonly="" value="${evento.fechainicio ? evento.fechainicio : "N/A"}">
    					</div>
    					<div class="col-12 col-md-4 mt-2">
    						<label>Hora Inicio</label>
    						<input class="form-control" type="text" readonly="" value="${evento.horainicio ? evento.horainicio : "N/A"}">
    					</div>
    					<div class="col-12 col-md-4 mt-2">
    						<label>Fecha Fin</label>
    						<input class="form-control" type="text" readonly="" value="${evento.fechafin ? evento.fechafin : "N/A"}">
    					</div>
    					<div class="col-12 col-md-4 mt-2">
    						<label>Hora Fin</label>
    						<input class="form-control" type="text" readonly="" value="${evento.horafin ? evento.horafin : "N/A"}">
    					</div>
    					<div class="col-12 col-md-4 mt-2">
    						<label>Fecha Recordatorio</label>
    						<input class="form-control" type="text" readonly="" value="${evento.fecharecordatorio ? evento.fecharecordatorio : "N/A"}">
    					</div>
    					<div class="col-12 col-md-4 mt-2">
    						<label>Hora Recordatorio</label>
    						<input class="form-control" type="text" readonly="" value="${evento.horarecordatorio ? evento.horarecordatorio : "N/A"}">
    					</div>
    					<div class="col-12 col-md-4 mt-2">
    						<label>Temporizador</label>
    						<input class="form-control" type="text" readonly="" value="${evento.temporizador ? evento.temporizador : "N/A"}">
    					</div>
    					<div class="col-12 col-md-4 mt-2">
    						<label>Recurrente</label>
    						<input class="form-control" type="text" readonly="" value="${evento.recurrente ? evento.recurrente : "N/A"}">
    					</div>
    					<div class="col-12 col-md-4 mt-2">
    						<label>Periodo</label>
    						<input class="form-control" type="text" readonly="" value="${evento.periodo ? evento.periodo : "N/A"}">
    					</div>
    					<div class="col-12 col-md-4 mt-2">
    						<label>URL</label>
    						<input class="form-control" type="text" readonly="" value="${evento.url ? evento.url : "N/A"}">
    					</div>
    					<div class="col-12 mt-3 d-flex justify-content-between">
							
							<button type="button" class="btn btn-warning" onclick="showUpdateForm(${evento.id})">Editar</button>
							<button type="button" class="btn btn-danger" onclick="showDeleteForm(${evento.id})">Eliminar</button>
    					</div>
    				</div>
    				`
                $("#bodyEvento").empty().append(body_html);
                eventoModal.toggle()

            });
}

function showUpdateForm(evento_id) {
    fetch("https://agenda360.ml/api/eventos/" + evento_id)
            .then(response => response.json())
            .then((data) => {
                evento = data.data
                $("#evento_id").val(evento.id)
                $("#update_titulo").val(evento.titulo ? evento.titulo : "")
                $("#update_descripcion").val(evento.descripcion ? evento.descripcion : "")
                $("#update_direccion").val(evento.direccion ? evento.direccion : "")
                $("#update_latitud").val(evento.latitud ? evento.latitud : "")
                $("#update_longitud").val(evento.longitud ? evento.longitud : "")
                $("#update_tipoevento").val(evento.tipoevento ? evento.tipoevento : "")
                $("#update_fecharegistro").val(evento.fecharegistro ? evento.fecharegistro : "")
                $("#update_fechainicio").val(evento.fechainicio ? evento.fechainicio : "")
                $("#update_horainicio").val(evento.horainicio ? evento.horainicio : "")
                $("#update_fechafin").val(evento.fechafin ? evento.fechafin : "")
                $("#update_horafin").val(evento.horafin ? evento.horafin : "")
                $("#update_fecharecordatorio").val(evento.fecharecordatorio ? evento.fecharecordatorio : "")
                $("#update_horarecordatorio").val(evento.horarecordatorio ? evento.horarecordatorio : "")
                $("#update_temporizador").val(evento.temporizador ? evento.temporizador : "")
                $("#update_recurrente").val(evento.recurrente ? evento.recurrente : "")
                $("#update_periodo").val(evento.periodo ? evento.periodo : "")
                $("#update_url").val(evento.url ? evento.url : "")
                updateModal.toggle()
            });
}

function showDeleteForm(evento_id) {

    $("#evento").val(evento_id);
    deleteModal.toggle()

}
const init_agenda = (id_usuario, tipo_usuario, tipo_servicio, tipo_area) => {

    $(document).ready(function () {
        let fecha = date.toISOString().split('T')[0];
        fetch("https://agenda360.ml/api/eventos/dia", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                'usuario_id': usuario_id,
                'fecha': fecha,
                'zona_horaria': zona_horaria
            })
        }).then(response => response.json()).then((data) => {
            let events = data.data
            let body_html = '<div class="container">';
            events.forEach(evento => {
                body_html += `
    				<div class="row">
    					<div class="col-12 col-md-4 mt-2">
    						<label>Titulo</label>
    						<input class="form-control" type="text" readonly="" value="${evento.titulo}">
    					</div>
    					<div class="col-12 col-md-4 mt-2">
    						<label>Descripción</label>
    						<textarea class="form-control" readonly="">${evento.descripcion ? evento.descripcion : "N/A" }</textarea>
    					</div>
    					<div class="col-12 col-md-4 mt-2">
    						<label>Fecha Inicio</label>
    						<input class="form-control" type="text" readonly="" value="${evento.fechainicio}">
    					</div>
    					<div class="col-12 col-md-4 mt-2">
    						<label>Hora Inicio</label>
    						<input class="form-control" type="text" readonly="" value="${evento.horainicio}">
    					</div>
    					<div class="col-12 col-md-4 mt-2">
    						<label>Fecha Fin</label>
    						<input class="form-control" type="text" readonly="" value="${evento.fechafin}">
    					</div>
    					<div class="col-12 col-md-4 mt-2">
    						<label>Hora Fin</label>
    						<input class="form-control" type="text" readonly="" value="${evento.horafin}">
    					</div>
    					<div class="col-12 col-md-4 mt-2">
    						<label>Fecha Recordatorio</label>
    						<input class="form-control" type="text" readonly="" value="${evento.fecharecordatorio}">
    					</div>
    					<div class="col-12 col-md-4 mt-2">
    						<label>Hora Recordatorio</label>
    						<input class="form-control" type="text" readonly="" value="${evento.horarecordatorio}">
    					</div>
    					<div class="col-12 mt-3 d-flex justify-content-between">
							<button type="button" class="btn btn-info" onclick="showEvent(${evento.id})">Ver</button>
							<button type="button" class="btn btn-warning" onclick="showUpdateForm(${evento.id})">Editar</button>
							<button type="button" class="btn btn-danger" onclick="showDeleteForm(${evento.id})">Eliminar</button>
    					</div>
    				</div>
    				<hr>
    				`
            });
            body_html += "</div>"
            $("#bodyEventosDia").append(body_html);
        });
        $(".fc-dayGridMonth-button").click()
    })




// FULL CALENDAR
    document.addEventListener('DOMContentLoaded', function () {
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
            defaultDate: new Date(),
            plugins: ['dayGrid', 'interaction', 'timeGrid', 'list'],

            header: {
                left: "prev,next today,MiBoton",
                center: "title",
                right: 'timeGridDay,timeGridWeek,dayGridMonth'
            },
            customButtons: {
                MiBoton: {
                    text: "Nuevo",
                    click: function () {
                        nuevoModal.toggle()
                    }
                }
            },
            dateClick: function (info) {

                nuevoModal.toggle()
            },
            eventClick: function (info) {
                console.log(info);
                console.log(info.event.id);
                showEvent(info.event.id);
            },
            events: function (fetchInfo, successCallback, failureCallback) {
                fetch("https://agenda360.ml/api/eventos/usuario", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        'usuario_id': usuario_id,
                        'zona_horaria': zona_horaria
                    })
                }).then(response => response.json()).then((data) => {
                    console.log(data)
                    let events = data.data
                    var eventos = events.map(function (event) {
                        return {
                            'id': event.id,
                            'title': event.titulo,
                            'start': event.inicio,
                            'end': event.fin,
                            'evento': event
                        }
                    })
                    successCallback(eventos)

                });
            }
        });

        calendar.setOption('locale', 'Es');
        calendar.render();
    });


    var nuevoModal = new bootstrap.Modal(document.getElementById('nuevoModal'), {
        keyboard: false
    })
    var eventoModal = new bootstrap.Modal(document.getElementById('showEventoModal'), {
        keyboard: false
    })
    var updateModal = new bootstrap.Modal(document.getElementById('updateModal'), {
        keyboard: false
    })
    var deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'), {
        keyboard: false
    })

    $("#nuevoEvento").on("submit", function (event) {
        event.preventDefault();
        // data = 
        // console.log(data);
        fetch("https://agenda360.ml/api/eventos", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                'usuario_id': usuario_id,
                'titulo': $("#titulo").val(),
                'descripcion': $("#descripcion").val(),
                'direccion': $("#direccion").val(),
                'latitud': $("#latitud").val(),
                'longitud': $("#longitud").val(),
                'tipoevento': $("#tipoevento").val(),
                'fecharegistro': $("#fecharegistro").val(),
                'fechainicio': $("#fechainicio").val(),
                'fechafin': $("#fechafin").val(),
                'horainicio': $("#horainicio").val(),
                'horafin': $("#horafin").val(),
                'fecharecordatorio': $("#fecharecordatorio").val(),
                'horarecordatorio': $("#horarecordatorio").val(),
                'temporizador': $("#temporizador").val(),
                'recurrente': $("#recurrente").val(),
                'periodo': $("#periodo").val(),
                'url': $("#url").val()
            })
        }).then(response => response.json()).then(data => {
            console.log(data)
            nuevoModal.toggle()
            location.reload();

        });
    })

    $("#updateEvento").on("submit", function (event) {
        event.preventDefault()
        let evento_id = $("#evento_id").val();
        fetch("https://agenda360.ml/api/eventos/" + evento_id, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                'usuario_id': usuario_id,
                '_method': "PUT",
                'titulo': $("#update_titulo").val(),
                'descripcion': $("#update_descripcion").val(),
                'direccion': $("#update_direccion").val(),
                'latitud': $("#update_latitud").val(),
                'longitud': $("#update_longitud").val(),
                'tipoevento': $("#update_tipoevento").val(),
                'fecharegistro': $("#update_fecharegistro").val(),
                'fechainicio': $("#update_fechainicio").val(),
                'fechafin': $("#update_fechafin").val(),
                'horainicio': $("#update_horainicio").val(),
                'horafin': $("#update_horafin").val(),
                'fecharecordatorio': $("#update_fecharecordatorio").val(),
                'horarecordatorio': $("#update_horarecordatorio").val(),
                'temporizador': $("#update_temporizador").val(),
                'recurrente': $("#update_recurrente").val(),
                'periodo': $("#update_periodo").val(),
                'url': $("#update_url").val()
            })
        }).then(response => response.json()).then(data => {
            console.log(data)
            updateModal.toggle()
            location.reload();
        });
    })

    $("#deleteEvento").on("submit", function (event) {
        event.preventDefault();
        let evento_id = $("#evento").val();
        fetch("https://agenda360.ml/api/eventos/" + evento_id, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                "_method": "DELETE"
            })
        }).then(response => response.json()).then(data => {
            console.log(data)
            deleteModal.toggle();
            location.reload();
        });

    })
}

