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
        console.log(listItem);
        //Append listItem to incompleteTaskHolder
        incompleteTaskHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskCompleted);

        taskInput.value = "";
        descriptionInput.value = "";
        dateInput.value = "";
        timeInput.value = "";

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
        var jsonData = buildJSON_Section("agrega_recordatorio");
        console.log(jsonData);
        addTask();
//        var lista = $("#lista_recordatorios");
//        var fecha = $("#fecha").val();
//        $("#fecha").empty();
//        var hora = $("#hora_recordatorio").val();
//        var titulo = $("#nombre_recordatorio").val();
//        var descripcion = $("#descripcion_recordatorio").val();
//        jsonData["Titulo_recordatorio"] = titulo;
//        jsonData["Descripcion_recordatorio"] = descripcion;
//        jsonData["hora_recordatorio"] = hora;
//        jsonData["fecha_recordatorio"] = fecha;
//        console.log(jsonData);
//        recordatorios_array.push(jsonData);
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


    $("#agregar_recordatorio").on("change", (e) => {
        console.log(e.target.checked);
        if (e.target.checked) {
            $(".recordatorios .detail").css({height: "80px"});
        } else {
            $(".recordatorios .detail").css({height: "0px"});
        }
    });






}

 