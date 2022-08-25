const taskInput = document.querySelector(".task-input input");
filters = document.querySelectorAll(".filters span");
taskBox = document.querySelector(".task-box");
clearAll = document.querySelector(".clear-btn");

let editID;
let isEditedTask = false;

//getting localstorage in todolist
let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn =>{
    btn.addEventListener("click", ()=>{
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});
function showTodo(filter){
    let li = "";
    if(todos){
    todos.forEach((todo, id) =>{
        let isCompleted = todo.status == "completed" ? "checked" : "";
        if(filter == todo.status || filter=="all"){
      li += `  <li class="task">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                        <p class="${isCompleted}">${todo.name}</p>
                    </label>
      <div class="settings">
          <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
          <ul class="task-menu">
             <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
             <li onclick='deleteTask(${id})'><i class="uil uil-trash"></i>Delete</li>
          </ul>
      </div>
  </li>`;
        }
    });
  }
    taskBox.innerHTML = li || `<span>You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
    showTodo("all");

function showMenu(selectedTask){
    //getting task menu div
   let taskMenu = selectedTask.parentElement.lastElementChild;
   taskMenu.classList.add("show");
   document.addEventListener("click", e=>{
           if(e.target.tagName != "I" || e.target != selectedTask){
            taskMenu.classList.remove("show");
           }
   });

}

function deleteTask(deleteID){
    isEditedTask = false;
    todos.splice(deleteID, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

clearAll.addEventListener("click", ()=>{
    isEditedTask = false;
   todos.splice(0, todos.length);
   localStorage.setItem("todo-list", JSON.stringify(todos));
   showTodo();
});

function editTask(taskID, taskName){
    editID = taskID;
    isEditedTask = true;
    taskInput.value = taskName;
}

function updateStatus(selectedTask){
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked){
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    }else{
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
     localStorage.setItem("todo-list", JSON.stringify(todos));
}
  

taskInput.addEventListener("keyup", e=>{
    let userTask = taskInput.value.trim();
    if(e.key == "Enter" && userTask){
        if(!isEditedTask){
        if(!todos){
            //if todos isn't exist, pass an empty array to todos
            todos = [];
        }
        let taskInfo = {name: userTask, status: "pending"};
        todos.push(taskInfo);
    }
        else{
            isEditedTask = false;
            todos[editID].name = userTask;
        }
        taskInput.value="";
        
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo();
    }
});