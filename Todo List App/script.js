const taskInput = document.getElementById('task-input');
const deadlineInput = document.getElementById('task-deadline');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const clearAllBtn = document.getElementById('clear-all');
const themeToggle = document.getElementById('theme-toggle');
const filters = document.querySelectorAll('.filter');

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadTheme();
    startCountdownUpdater();
});

addBtn.addEventListener('click', addTask);
clearAllBtn.addEventListener('click', clearAllTasks);
themeToggle.addEventListener('click', toggleTheme);

// Add Task on Enter key 
taskInput.addEventListener('keypress', e => {
    if(e.key === 'Enter') addBtn.click();
});

// Open datetime picker when clicking anywhere on the input
deadlineInput.addEventListener('click', () => {
    if (typeof deadlineInput.showPicker === 'function') {
        deadlineInput.showPicker();
    } else {
        deadlineInput.focus();
    }
});

// Add Task
function addTask() {
    const taskText = taskInput.value.trim();
    const deadline = deadlineInput.value;

    if (!taskText) return alert('Please enter a task!');
    if (!deadline) return alert('Please set a deadline');

    const li = createTaskElement(taskText, false, deadline);
    taskList.appendChild(li);

    saveTasks();
    taskInput.value = '';
    deadlineInput.value = '';
}

// Create task element
function createTaskElement(text, completed = false, deadline = '') {

    const li = document.createElement('li');
    li.deadline = deadline;

    const taskSpan = document.createElement('span');
    taskSpan.textContent = text;
    taskSpan.classList.add('task-text');
    if(completed) li.classList.add('completed');
    li.appendChild(taskSpan);

    const deadlineDiv = document.createElement('div');
    deadlineDiv.classList.add('deadline');
    deadlineDiv.textContent = `📅 ${new Date(deadline).toLocaleString()}`;
    li.appendChild(deadlineDiv);

    const countdownDiv = document.createElement('div');
    countdownDiv.classList.add('countdown','green-timer');
    li.appendChild(countdownDiv);

    // Toggle complete on task text click
    taskSpan.addEventListener('click', () => {
        li.classList.toggle('completed');
        saveTasks();
    });

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '✏️';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', e => {
        e.stopPropagation();

        const currentText = taskSpan.textContent;
        const currentDeadline = li.deadline;

        const newText = prompt('Edit your task:', currentText);
        if(newText === null || newText.trim() === '') return;

        const newDeadline = prompt('Edit deadline (YYYY-MM-DDTHH:MM)', currentDeadline);
        if(!newDeadline || isNaN(new Date(newDeadline))) {
            alert('Invalid deadline format! Use YYYY-MM-DDTHH:MM'); return;
        }

        taskSpan.textContent = newText.trim();
        li.deadline = newDeadline;
        deadlineDiv.textContent = `📅 ${new Date(newDeadline).toLocaleString()}`;
        saveTasks();
    });

    // Delete Button
    const delBtn = document.createElement('button');
    delBtn.innerHTML = `<i class="fa-solid fa-trash" style="color:red"></i>`;
    delBtn.classList.add('delete-btn');
    delBtn.addEventListener('click', e => {
        e.stopPropagation();
        li.remove();
        saveTasks();
    });

    // Button container
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('task-actions');
    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(delBtn);
    li.appendChild(btnContainer);

    return li;
}

// Save tasks
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#task-list li').forEach(li => {
        tasks.push({
            text: li.querySelector('.task-text').textContent, 
            completed: li.classList.contains('completed'),
            deadline: li.deadline
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load Tasks
function loadTasks() {
    const saved = JSON.parse(localStorage.getItem('tasks')) || [];
    saved.forEach(t => taskList.appendChild(createTaskElement(t.text, t.completed, t.deadline)));
    applyFilter('all');
}

// Clear all
function clearAllTasks() {
    if(confirm('Are you sure you want to delete all tasks?')){
        taskList.innerHTML = '';
        localStorage.removeItem('tasks');
    }
}

// Filters
filters.forEach(btn => {
    btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.dataset.filter);
    });
});

function applyFilter(filter) {
    const items = document.querySelectorAll('#task-list li');
    items.forEach(item => {
        switch(filter) {
            case 'all': item.style.display = 'flex'; break;
            case 'active': item.style.display = item.classList.contains('completed') ? 'none' : 'flex'; break;
            case 'completed': item.style.display = item.classList.contains('completed') ? 'flex' : 'none'; break;
        }
    });
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark');
    const darkMode = document.body.classList.contains('dark');
    themeToggle.textContent = darkMode ? '☀️' : '🌙';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
}

function loadTheme() {
    const theme = localStorage.getItem('theme');
    if(theme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = '☀️';
    }
}

// Countdown updater
function startCountdownUpdater() {
    setInterval(() => {
        document.querySelectorAll('#task-list li').forEach(li => {
            const countdownDiv = li.querySelector('.countdown');
            const deadline = new Date(li.deadline);
            const now = new Date();
            const diff = deadline - now;

            if(!countdownDiv || isNaN(deadline)) return;

            if(diff <= 0){
                countdownDiv.textContent = 'Overdue!';
                countdownDiv.classList.add('overdue');
                countdownDiv.classList.remove('green-timer','warning');
            } else {
                const hours = Math.floor(diff / 1000 / 60 / 60);
                const mins = Math.floor((diff / 1000 / 60) % 60);
                const secs = Math.floor((diff / 1000) % 60);

                countdownDiv.textContent = `⌛ ${hours}h ${mins}m ${secs}s left`;
                countdownDiv.classList.remove('overdue','warning');

                if(diff < 3600000) countdownDiv.classList.add('warning'); // <1 hour
            }
        });
    }, 1000);
}
