document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const dueDateInput = document.getElementById('due-date');
    const prioritySelect = document.getElementById('priority');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const searchInput = document.getElementById('search');
    const toggleThemeButton = document.getElementById('toggle-theme');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            taskItem.classList.add(`priority-${task.priority}`);
            taskItem.innerHTML = `
                <span>${task.text}</span>
                <span class="due-date">${task.dueDate ? `Due: ${task.dueDate}` : ''}</span>
                <button class="edit-task" data-index="${index}">Edit</button>
                <button class="delete-task" data-index="${index}">Delete</button>
            `;
            taskList.appendChild(taskItem);
        });
        saveTasks();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function addTask() {
        const text = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = prioritySelect.value;

        if (text) {
            tasks.push({ text, dueDate, priority });
            taskInput.value = '';
            dueDateInput.value = '';
            renderTasks();
        }
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        renderTasks();
    }

    function editTask(index) {
        const newText = prompt('Edit task:', tasks[index].text);
        if (newText !== null) {
            tasks[index].text = newText;
            renderTasks();
        }
    }

    function searchTasks() {
        const query = searchInput.value.toLowerCase();
        const items = taskList.getElementsByTagName('li');
        Array.from(items).forEach(item => {
            const text = item.querySelector('span').textContent.toLowerCase();
            item.style.display = text.includes(query) ? '' : 'none';
        });
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
    }

    addTaskButton.addEventListener('click', addTask);
    searchInput.addEventListener('input', searchTasks);

    taskList.addEventListener('click', event => {
        if (event.target.classList.contains('delete-task')) {
            deleteTask(event.target.dataset.index);
        } else if (event.target.classList.contains('edit-task')) {
            editTask(event.target.dataset.index);
        }
    });

    toggleThemeButton.addEventListener('click', toggleTheme);

    function updateDateTime() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        document.getElementById('current-datetime').textContent = now.toLocaleDateString('en-US', options);
    }

    setInterval(updateDateTime, 1000); 
    updateDateTime(); 
    renderTasks(); 
});
