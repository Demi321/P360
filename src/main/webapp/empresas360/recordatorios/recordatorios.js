/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const init_recordatorios = (json) => {
    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;
    
    
    
    var recordatorios = '{ "recordatorios" : [' +
         '{"id":1, "titulo_recordatorio":"Junta", "descripcion_recordatorio":"Junta con equipo MC", "idUsuario":"8521478", "hora_recordatorio":"12:13","fecha_recordatorio":"17/02/2021"},'+
         '{"id":2, "titulo_recordatorio":"Junta", "descripcion_recordatorio":"Junta con equipo MC", "idUsuario":"8521478", "hora_recordatorio":"01:30","fecha_recordatorio":"17/02/2021"},'+
         '{"id":3, "titulo_recordatorio":"Junta", "descripcion_recordatorio":"Junta con equipo MC", "idUsuario":"8521478", "hora_recordatorio":"17:10","fecha_recordatorio":"17/02/2021"}'+
         ']}';

    // var element = document.getElementById("calendar");
    // caleandar(element);
     //-------------Document ready-----------
    $(document).ready(
        function(){
            // traer los recordatorios almacenados en el servidor 
    //agregarlos

    var taskInput = document.getElementById("nombre_recordatorio");//Add a new task.
    var descriptionInput = document.getElementById("descripcion_recordatorio");
    var dateInput = document.getElementById("fecha_recordatorio");
    var timeInput = document.getElementById("hora_recordatorio");
    //var addButton = document.getElementById("add_task");//first button
    var incompleteTaskHolder = document.getElementById("incomplete-tasks");//ul of #incomplete-tasks
    var completedTasksHolder = document.getElementById("completed-tasks");//completed-tasks


//New task list item
    var createNewTaskElement = function (taskString,descriptionString,date,time) {

        var listItem = document.createElement("li");

        //conteiner check
        var div_check = document.createElement("div");
        //conteiner data
        var div_data = document.createElement("div");
        //conteiner buttons
        var div_buttons = document.createElement("div");

        //input (checkbox)
        var checkBox = document.createElement("input");//checkbx
        //label tittle
        var label = document.createElement("label");//label
        //p description
        var p = document.createElement("p");
        //span fecha
        var span_fecha = document.createElement("span");
        //span hora
        var span_hora = document.createElement("span");
        //input (text)
        var editInput = document.createElement("input");//text
        //input (text)
        var editp = document.createElement("input");//text
        //button.edit
        var editButton = document.createElement("button");//edit button

        //button.delete
        var deleteButton = document.createElement("button");//delete button

        listItem.className = "row col-12 m-0";
        div_check.className = "col-2 col-sm-2 col-md-1 p-0 d-flex align-items-center justify-content-center";
        div_data.className = "row m-0 col-10 col-sm-10 col-md-9 p-0";
        div_buttons.className = "col-12 col-sm-12 col-md-2 p-0";

        p.className = "col-12 p-0 descripcion";
        span_fecha.className = "fecha";
        span_hora.className = "hora";


        label.innerText = taskString;
        label.className = "col-12 p-0";
        
        p.innerText = descriptionString;
        span_fecha.innerText = date;
        span_hora.innerText = time;

        //Each elements, needs appending
        checkBox.type = "checkbox";
        editInput.type = "text";
        editInput.className="col-12 tittle";
        editp.type = "text";
        editp.className="col-12 description";

        editButton.innerText = "Editar";
        editButton.className = "edit";
        deleteButton.innerText = "Eliminar";
        deleteButton.className = "delete";

        //and appending.
        div_check.appendChild(checkBox);
        div_data.appendChild(label);
        div_data.appendChild(editInput);
        div_data.appendChild(p);
        div_data.appendChild(editp);
        div_data.appendChild(span_fecha);
        div_data.appendChild(span_hora);
        div_buttons.appendChild(editButton);
        div_buttons.appendChild(deleteButton);
        
        listItem.appendChild(div_check);
        listItem.appendChild(div_data);
        listItem.appendChild(div_buttons);
        
        return listItem;
    }

    var addTask = function () {
        console.log("Add Task...");
        //Create a new list item with the text from the #new-task:
        var listItem = createNewTaskElement(taskInput.value,descriptionInput.value,dateInput.value,timeInput.value);
        var jsonData = {};
        jsonData["id"]="4";
        jsonData["titulo_recordatorio"]=taskInput.value;
        jsonData["descripcion_recordatorio"]=descriptionInput.value;
        jsonData["hora_recordatorio"]=timeInput.value;
        jsonData["fecha_recordatorio"]= formatearFecha(dateInput.value);
        console.log(jsonData);
        console.log(timeInput.value);
        recordatorios_array.push(jsonData);
        //lista.append("<li>"+ titulo +"</li>");
        console.log(listItem);
        console.log(recordatorios_array);
        //Append listItem to incompleteTaskHolder
        incompleteTaskHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskCompleted);

        taskInput.value = "";
        descriptionInput.value = "";
        dateInput.value = "";
        timeInput.value = "";

    }

    function formatearFecha(fecha){
        var arreglo = fecha.split("-");
        var fecha_formateada = arreglo[2] + "/" + arreglo[1] + "/" + arreglo[0];
        return fecha_formateada;
    }

//Edit an existing task.

    var editTask = function () {
        console.log("Edit Task...");
        console.log("Change 'edit' to 'save'");


        var listItem = this.parentNode.parentNode;
        console.log(listItem);
        var editInput = listItem.querySelector('input[type=text].tittle');
        var editp = listItem.querySelector('input[type=text].description');
        var label = listItem.querySelector("label");
        var p = listItem.querySelector("p");
        var editButton = listItem.querySelector("button.edit");
        console.log(editButton);
        var containsClass = listItem.classList.contains("editMode");
        //If class of the parent is .editmode
        if (containsClass) {

            //switch to .editmode
            //label becomes the inputs value.
            label.innerText = editInput.value;
            p.innerText = editp.value;
            editButton.innerHTML = "Editar";
            editButton.className="edit";
        } else {
            editInput.value = label.innerText;
            editp.value = p.innerText;
            editButton.innerHTML = "Guardar";
             editButton.className="edit guardar";
        }

        //toggle .editmode on the parent.
        listItem.classList.toggle("editMode");
    }




//Delete task.
    var deleteTask = function () {
        console.log("Delete Task...");

        var listItem = this.parentNode.parentNode;
        console.log(listItem);
        var ul = listItem.parentNode;
        //Remove the parent list item from the ul.
        ul.removeChild(listItem);

    }


//Mark task completed
    var taskCompleted = function () {
        console.log("Complete Task...");

        //Append the task list item to the #completed-tasks
        var listItem = this.parentNode.parentNode;
        console.log(listItem);
        completedTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskIncomplete);

    }


    var taskIncomplete = function () {
        console.log("Incomplete Task...");
//Mark task as incomplete.
        //When the checkbox is unchecked
        //Append the task list item to the #incomplete-tasks.
        var listItem = this.parentNode.parentNode;
        console.log(listItem);
        incompleteTaskHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskCompleted);
    }



    var ajaxRequest = function () {
        console.log("AJAX Request");
    }

//The glue to hold it all together.


//Set the click handler to the addTask function.
//    addButton.onclick = addTask;
//    addButton.addEventListener("click", addTask);
//    addButton.addEventListener("click", ajaxRequest);
    $("#agrega_recordatorio").submit((e) => {
        e.preventDefault();
        console.log("enviado");
        //var jsonData = {};
        //console.log(jsonData);
        addTask();
//        lista.append("<li>" + titulo + "</li>");
        $("#agrega_recordatorio").trigger("reset");
    });

    var bindTaskEvents = function (taskListItem, checkBoxEventHandler) {
        console.log("bind list item events");
        console.log(taskListItem);
//select ListItems children
        var checkBox = taskListItem.querySelector("input[type=checkbox]");
        var label = taskListItem.querySelector("label");
        var editButton = taskListItem.querySelector("button.edit");
        var deleteButton = taskListItem.querySelector("button.delete");


        //Bind editTask to edit button.
        editButton.onclick = editTask;
        label.onclick = editTask;
        //Bind deleteTask to delete button.
        deleteButton.onclick = deleteTask;
        //Bind taskCompleted to checkBoxEventHandler.
        checkBox.onchange = checkBoxEventHandler;
    }

//cycle over incompleteTaskHolder ul list items
    //for each list item
    for (var i = 0; i < incompleteTaskHolder.children.length; i++) {

        //bind events to list items chldren(tasksCompleted)
        bindTaskEvents(incompleteTaskHolder.children[i], taskCompleted);
    }
//cycle over completedTasksHolder ul list items
    for (var i = 0; i < completedTasksHolder.children.length; i++) {
        //bind events to list items chldren(tasksIncompleted)
        bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
    }

 
            $("#fecha_recordatorio").mask("00/00/0000");
            $("#hora_recordatorio").mask("00:00");
            var recordatorios_json = JSON.parse(recordatorios);
            var recordatorios_array = recordatorios_json.recordatorios;
            var audioElement = document.createElement('audio');
            audioElement.setAttribute('src', "https://empresas.claro360.com/p360_v4_dev_moises/empresas360/recordatorios/SD_ALERT_3.mp3");
            audioElement.addEventListener('ended', function() {
                this.play();
            }, false);
            audioElement.addEventListener("canplay",function(){
       console.log("ready to play");
    });
           var alarma_activa = false;
            console.log("ready");
           llena_lista_recordatorios();
        $(".cld-days li").attr("data-bs-toggle","modal");
        $(".cld-days li").attr('data-bs-target','#exampleModal');
        //setInterval(checa_recordatorios,1000);

     function llena_lista_recordatorios(){
        var lista = $("#lista_recordatorios");
        lista.empty();
            for(var j=0; j<recordatorios_array.length; j++){
                var temp = $("<li><p> "+ recordatorios_array[j].Titulo_recordatorio + ": " + recordatorios_array[j].Descripcion_recordatorio +"</p></li>");
                    //console.log("add " + temp);
                    lista.append(temp);
            }
     }

     function checa_recordatorios(){
         console.log("checking");
         if(!alarma_activa){
             console.log("alarma por activar");
            var current = new Date();
            var hora = get_tiempo(current);
            var fecha = get_fecha(current);
            //console.log("checking");
            for(var i = 0; i<recordatorios_array.length; i++){ 
                //console.log(i);
                //console.log(recordatorios_array[i].hora_recordatorio);
                console.log(fecha);
                console.log(recordatorios_array[i].fecha_recordatorio);
                if(recordatorios_array[i].hora_recordatorio===hora && fecha===recordatorios_array[i].fecha_recordatorio){
                    console.log("entró");
                    var index = i;
                    alarma_activa=true;
                    audioElement.play();
                    Swal.fire({
                    title: '<h4>Recordatorio '+ recordatorios_array[i].Titulo_recordatorio +'</h4>',
                    html: '<hr class="swa-hr">\
                            <p style="font-size: 1.25rem; color: #000; ">'+ recordatorios_array[i].Descripcion_recordatorio +' \n\
                            </p> \n\
                            <button class="btn btn-warning aplazar" minutes="5" id_alarma="'+ recordatorios_array[i].id +'">Aplazar 5 mins.</button> \n\
                            <button class="btn btn-info aplazar" minutes="10" id_alarma="'+ recordatorios_array[i].id +'">Aplazar 10 mins.</button> \n\
                            <button class="btn btn-info aplazar" minutes="15" id_alarma="'+ recordatorios_array[i].id +'">Aplazar 15 mins.</button>',
                    showCancelButton: false,
                    confirmButtonText: 'Descartar',
                    background: '#fff',
                    width: '25%',
                    padding: '0',
                    customClass: {
                        confirmButton: 'btn-danger',
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        audioElement.pause();
                        console.log(index);
                        recordatorios_array.splice(index, 1);
                        //console.log(recordatorios);
                        alarma_activa=false;
                        llena_lista_recordatorios();
                        console.log(recordatorios_array);
                    }
                });
        
                }
            }
        }
     }

     $(document).on("click",".aplazar", function(){
        console.log("click");
        var mins = $(this).attr("minutes");
        var temp = $(this).attr("id_alarma");
        for(var i = 0; i<recordatorios_array.length; i++){
            if(recordatorios_array[i].id === temp){
                var time_split = recordatorios_array[i].hora_recordatorio.split(":");
              
                var hora_aplazada = suma_mins(parseInt(time_split[0]),parseInt(time_split[1]),parseInt(mins));
                //console.log(hora_aplazada);
                //console.log(recordatorios_array);
                recordatorios_array[i].hora_recordatorio = hora_aplazada;
                console.log(recordatorios_array);
                audioElement.pause();
                swal.close();
                //recordatorios_array.splice(index, 1);
                alarma_activa=false;
                i= recordatorios_array.length;
            }
        }
        console.log(temp);
    });

    function suma_mins(hora,min, tmp_aplazar){
        var sum_mins = min + tmp_aplazar;
        if(sum_mins>59){
            sum_mins -= 60;
            hora += 1;
            if(sum_mins.toString().length < 2) {sum_mins = "0" + sum_mins;}
            return hora + ":" + sum_mins;
        }else{
            if(sum_mins.toString().length < 2) {sum_mins = "0" + sum_mins;}
            return hora + ":" + sum_mins;
        }
    }

     function get_fecha(date){
        var dia = date.getDate();
        var mes = date.getMonth() + 1;
        if(mes.toString().length < 2) {mes = "0" + mes;}
        var year = date.getFullYear();
        var fecha = dia + "/" + mes + "/" + year;
        return fecha;
     }

     function get_tiempo(date){
        var hora = date.getHours();
        var mins = date.getMinutes();
        var seconds = date.getSeconds();
        if(hora.toString().length < 2) {hora = "0" + hora;}
        if(mins.toString().length < 2) {mins = "0" + mins;}
        //if(seconds.toString().length < 2) {seconds = "0" + seconds;}
        var tiempo = hora + ":" + mins;
        //console.log("seconds: " + seconds);
        return tiempo;
     }


     $("#agregar_recordatorio").on("change", (e) => {
        console.log(e.target.checked);
        if (e.target.checked) {
            $(".recordatorios .detail").css({height: "80px"});
        } else {
            $(".recordatorios .detail").css({height: "0px"});
        }
    });

    /* $("#agrega_recordatorio").submit((e)=>{
        e.preventDefault();
         console.log("enviado");
        var jsonData = {};
        addTask();
        var lista = $("#lista_recordatorios");
        var fecha = $("#fecha").val();
        $("#fecha").empty();
        var hora = $("#hora_recordatorio").val();
        var titulo = $("#nombre_recordatorio").val();
        var descripcion = $("#descripcion_recordatorio").val();
        jsonData["Titulo_recordatorio"]=titulo;
        jsonData["Descripcion_recordatorio"]=descripcion;
        jsonData["hora_recordatorio"]=hora;
        jsonData["fecha_recordatorio"]=fecha;
        console.log(jsonData);
        recordatorios_array.push(jsonData);
        lista.append("<li>"+ titulo +"</li>");
        $("#agrega_recordatorio").trigger("reset");
     }).catch(console.log(e));*/

     

    });
   
   
};