//const checkBtn = document.querySelector("#checkbox");
const addTodo = document.querySelector(".add");
const todoListWrapper = document.querySelector(".todo-list");
const listItemsUl = document.querySelector(".list-items");
const numOfitems = document.querySelector(".items");
const activeBtn = document.querySelector(".btn.active");
const allBtn = document.querySelector(".btn.all");
const completedBtn = document.querySelector(".btn.completed");
const clearBtn = document.querySelector(".btn.clear");
let todoList = getTodoList() || [];
let draggableItem = null;
let draggableItems = [];
let dragStartIndex;

function init() {
  displayTodoList(todoList);
  assignDraggableitems();
  updateNumOfItems();
  addTodo.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      let listItem = {
        id: Math.floor(Math.random() * 100),
        value: e.target.value,
        status: "active",
      };
      addTodoList(listItem);
      addTodo.value = "";
      displayTodoList(todoList);
      assignDraggableitems();
      updateNumOfItems();
    }
  });
  listItemsUl.addEventListener("click", (e) => {
    if (e.target.nodeName == "INPUT") {
      let status = "";
      let id = e.target.getAttribute("id");
      let item = document.querySelector(`[name='${id}'] .right .item-content`);
      if (e.target.checked) {
        item.style.textDecoration = " line-through";
        item.style.opacity = 0.4;
        status = "completed";
      } else {
        item.style.textDecoration = " none";
        item.style.opacity = 1;
        status = "active";
      }
      updateListItem(id, status);
    }
    if (e.target.nodeName == "BUTTON") {
      let parent = e.target.parentNode;
      let id = parent.getAttribute("name");
      deleteTodo(Number(id));
      updateNumOfItems();
    }
  });

  activeBtn.addEventListener("click", (e) => {
    let activeList = getActiveTodo();
    displayTodoList(activeList);
  });
  allBtn.addEventListener("click", (e) => {
    displayTodoList(todoList);
  });
  completedBtn.addEventListener("click", (e) => {
    let completedList = getCompletedTodo();
    displayTodoList(completedList);
  });
  clearBtn.addEventListener("click", (e) => {
    clearCompletedTodo();
    updateNumOfItems();
  });
  dropedContainerEvent();
}

init();

function getTodoList() {
  let list = JSON.parse(localStorage.getItem("todoList"));
  return list;
}

function displayTodoList(list) {
  if (list.length !== 0) {
    todoListWrapper.classList.remove("hidden");
    let html = "";
    html = list
      .map((item) => {
        return `  <li name="${item.id}" draggable ="true">
                <div class="right">
                  <div class="round">
                    <input type="checkbox"  id="${item.id}" ${(checked =
          item.status === "completed" ? "checked" : "")} />
                    <label for="${item.id}"></label>
                  </div>
                  <span class="item-content ${
                    item.status === "completed" ? "status-completed" : ""
                  }">${item.value}</span>
                </div>
                <button class="btn delete-btn"><img src="images/icon-cross.svg" /></button>
              </li> `;
      })
      .join("");
    listItemsUl.innerHTML = html;
  } else {
    listItemsUl.innerHTML = "";
  }
}

function addTodoList(item) {
  todoList.push(item);
  localStorage.setItem("todoList", JSON.stringify(todoList));
}
function updateNumOfItems() {
  numOfitems.innerText = todoList.length;
}

function updateTodoList(list) {
  localStorage.setItem("todoList", JSON.stringify(list));
}
function updateListItem(id, status) {
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].id === Number(id)) {
      todoList[i].status = status;
    }
  }
  updateTodoList(todoList);
}

function getActiveTodo() {
  let activeList = todoList.filter((item) => {
    return item.status === "active";
  });
  return activeList;
}
function getCompletedTodo() {
  let completedList = todoList.filter((item) => {
    return item.status === "completed";
  });
  return completedList;
}

function clearCompletedTodo() {
  todoList = todoList.filter((item) => {
    return item.status !== "completed";
  });
  updateTodoList(todoList);
  displayTodoList(todoList);
}

function deleteTodo(id) {
  todoList = todoList.filter((item) => {
    return item.id !== id;
  });
  updateTodoList(todoList);
  displayTodoList(todoList);
}
function dragStart() {
  draggableItem = this;
  draggableItem.style.opacity = 0.5;
  dragStartIndex = +this.getAttribute("name");
}
function dragEnd() {
  draggableItem.style.opacity = 1;
  draggableItem = null;
}
function dragOver(e) {
  e.preventDefault();
}
function dragEnter() {
  this.classList.add("over");
}
function dragLeave() {
  this.classList.remove("over");
}
async function dragDrop() {
  this.classList.remove("over");
  const dragEndIndex = +this.getAttribute("name");
  swapItems(dragStartIndex, dragEndIndex);
  updateTodoList(todoList);
  displayTodoList(todoList);
  assignDraggableitems();
  dropedContainerEvent();
}
function assignDraggableitems() {
  draggableItems = listItemsUl.querySelectorAll("li");
  addDragDropEvent(draggableItems);
}
function addDragDropEvent(items) {
  items.forEach((item) => {
    item.addEventListener("dragstart", dragStart);
    item.addEventListener("dragend", dragEnd);
    item.addEventListener("dragover", dragOver);
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragleave", dragLeave);
    item.addEventListener("drop", dragDrop);
  });
}
function dropedContainerEvent() {
  // listItemsUl.addEventListener("dragover", dragOver);
  // listItemsUl.addEventListener("dragenter", dragEnter);
  // listItemsUl.addEventListener("dragleave", dragLeave);
  // listItemsUl.addEventListener("drop", dragDrop);
}

function swapItems(start, end) {
  let itemOne = todoList.find((item) => item.id === +start);
  let itemTwo = todoList.find((item) => item.id === +end);
  let index1 = todoList.indexOf(itemOne);
  let index2 = todoList.indexOf(itemTwo);
  let temp = itemOne;
  todoList[index1] = todoList[index2];
  todoList[index2] = temp;
}
