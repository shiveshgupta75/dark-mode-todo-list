document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const addTaskButton = document.getElementById("add-task-btn");
  const todoList = document.getElementById("todo-list");

  // Create task count and empty list message elements
  const taskCountDisplay = document.createElement("div");
  taskCountDisplay.id = "task-count";
  todoList.after(taskCountDisplay);

  const emptyMsg = document.createElement("p");
  emptyMsg.id = "empty-msg";
  emptyMsg.textContent = "🎉 No tasks yet!";
  todoList.after(emptyMsg);

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => renderTask(task));
  updateUI();

  addTaskButton.addEventListener("click", () => {
    const taskText = todoInput.value.trim();
    if (taskText === "") return;

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };

    tasks.push(newTask);
    saveTasks();
    renderTask(newTask);
    todoInput.value = "";
    updateUI();
  });

  function renderTask(task) {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <span>${task.text}</span>
      <button>delete</button>
    `;

    // Toggle complete on click
    li.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") return;
      task.completed = !task.completed;
      li.classList.toggle("completed");
      saveTasks();
    });

    // Delete task
    li.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation();
      tasks = tasks.filter((t) => t.id !== task.id);
      li.remove();
      saveTasks();
      updateUI();
    });

    todoList.appendChild(li);
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function updateUI() {
    taskCountDisplay.textContent = `📝 Total Tasks: ${tasks.length}`;
    emptyMsg.style.display = tasks.length === 0 ? "block" : "none";
  }
});
