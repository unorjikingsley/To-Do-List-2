/* eslint-disable no-use-before-define */

import './index.css';
import completeStatus from './status.js';

let tasks = [];
if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
}
function displayTasks() {
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = '';
  tasks.sort((a, b) => a.index - b.index);

  tasks.forEach((task, i) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} />
      <span class="taskdesc" contenteditable="true">${task.description}</span>
      <i class="bi bi-three-dots-vertical"></i>
    `;

    const checkbox = listItem.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      // toggleCompleted(i);
      const completed = checkbox.checked;
      toggleCompleted(i, completed);
      if (completed) {
        completeStatus(i);
      }
    });

    const taskDesc = listItem.querySelector('.taskdesc');
    taskDesc.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        // 13 is the keycode for Enter key
        e.preventDefault();
        const newDescription = taskDesc.textContent.trim();
        editTask(i, newDescription);
        taskDesc.blur();
      }
    });

    taskDesc.addEventListener('focus', () => {
      taskDesc.style.outline = 'none';
      taskDesc.style.border = 'none';
    });

    const dotsIcon = listItem.querySelector('.bi-three-dots-vertical');
    dotsIcon.addEventListener('click', () => {
      let contextMenu = listItem.querySelector('.context-menu');

      if (!contextMenu) {
        contextMenu = document.createElement('ul');
        contextMenu.classList.add('btn-clr');
        contextMenu.innerHTML = `
      <button class="context-menu-item-o">Edit</button>
      <button class="context-menu-item-t">Delete</button>
      `;
        contextMenu.classList.add('context-menu');
        listItem.appendChild(contextMenu);

        const contextMenuItems = listItem.querySelector('.context-menu-item-o');
        contextMenuItems.addEventListener('click', () => {
          const taskDesc = listItem.querySelector('.taskdesc');
          taskDesc.setAttribute('contenteditable', 'true');
          taskDesc.style.outline = 'none';
          taskDesc.focus();
        });

        const contextMenuItemsTwo = listItem.querySelector('.context-menu-item-t');
        contextMenuItemsTwo.addEventListener('click', () => {
          todoList.removeChild(listItem);
          deleteTask(i);
        });
      } else {
        listItem.removeChild(contextMenu);
      }

      document.addEventListener('click', (e) => {
        if (!listItem.contains(e.target)) {
          listItem.removeChild(contextMenu);
        }
      },
      { once: true });
    });

    todoList.appendChild(listItem);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('your-todo');
    const newTaskDescription = input.value.trim();
    if (newTaskDescription) {
      addTask(newTaskDescription);
      displayTasks();
      input.value = '';
    }
  });

  const clearAllButton = document.getElementById('clear-all');
  clearAllButton.addEventListener('click', () => {
    tasks = tasks.filter((task) => !task.completed);
    tasks.forEach((task, i) => {
      task.index = i;
    });
    saveTasks();
    displayTasks();
  });
});

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask(description) {
  const task = {
    description,
    completed: false,
    index: tasks.length + 1, // set the index property to the current length of the task array
  };
  tasks.push(task);
  displayTasks();
  saveTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  tasks.forEach((task, i) => {
    task.index = i;
  });
  displayTasks();
  saveTasks();
}

function editTask(index, newDescription) {
  tasks[index].description = newDescription;
  displayTasks();
  saveTasks();
}

function toggleCompleted(index, completed) {
  tasks[index].completed = completed;
  saveTasks();
}

document.addEventListener('DOMContentLoaded', () => {
  displayTasks();
});