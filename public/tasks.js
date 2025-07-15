const userId = localStorage.getItem('userId');
let tasks = [];
let currentFilter = 'all';
let editingTaskId = null;

if (!userId) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupFilterButtons();
    setupFormSubmit();
});

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });
}

function setupFormSubmit() {
    const form = document.getElementById('taskForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const taskData = {
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            priority: document.getElementById('taskPriority').value,
            status: document.getElementById('taskStatus').value,
            dueDate: document.getElementById('taskDueDate').value,
            userId: userId
        };
        
        try {
            if (editingTaskId) {
                const response = await fetch(`/tasks/${editingTaskId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });
                
                if (!response.ok) throw new Error('Failed to update task');
                
                const updatedTask = await response.json();
                const index = tasks.findIndex(t => t._id === editingTaskId);
                if (index !== -1) tasks[index] = updatedTask;
            } else {
                const response = await fetch('/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });
                
                if (!response.ok) throw new Error('Failed to create task');
                
                const newTask = await response.json();
                tasks.unshift(newTask);
            }
            
            renderTasks();
            closeTaskModal();
        } catch (error) {
            console.error('Error saving task:', error);
            alert('Failed to save task. Please try again.');
        }
    });
}

async function loadTasks() {
    try {
        const response = await fetch(`/tasks?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        
        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    const emptyState = document.getElementById('emptyState');
    
    const filteredTasks = currentFilter === 'all' 
        ? tasks 
        : tasks.filter(task => task.status === currentFilter);
    
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    tasksList.innerHTML = filteredTasks.map(task => {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const isOverdue = dueDate && dueDate < new Date() && task.status !== 'completed';
        
        return `
            <div class="task-card">
                <div class="task-card-header">
                    <h3 class="task-title">${escapeHtml(task.title)}</h3>
                    <span class="task-priority priority-${task.priority}">${task.priority}</span>
                </div>
                
                ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
                
                <div class="task-footer">
                    <div>
                        <span class="task-status status-${task.status}">${formatStatus(task.status)}</span>
                        ${dueDate ? `<span class="due-date ${isOverdue ? 'overdue' : ''}"> • Due ${formatDate(dueDate)}</span>` : ''}
                    </div>
                    
                    <div class="task-actions">
                        <button class="task-btn edit-btn" onclick="editTask('${task._id}')">Edit</button>
                        <button class="task-btn delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openTaskModal() {
    document.getElementById('taskModal').classList.add('active');
    document.getElementById('modalTitle').textContent = 'Create New Task';
    document.getElementById('taskForm').reset();
    editingTaskId = null;
}

function closeTaskModal() {
    document.getElementById('taskModal').classList.remove('active');
    document.getElementById('taskForm').reset();
    editingTaskId = null;
}

function editTask(taskId) {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;
    
    editingTaskId = taskId;
    document.getElementById('modalTitle').textContent = 'Edit Task';
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskStatus').value = task.status;
    
    if (task.dueDate) {
        const date = new Date(task.dueDate);
        document.getElementById('taskDueDate').value = date.toISOString().split('T')[0];
    }
    
    document.getElementById('taskModal').classList.add('active');
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        const response = await fetch(`/tasks/${taskId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete task');
        
        tasks = tasks.filter(t => t._id !== taskId);
        renderTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
    }
}

function signOut() {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    window.location.href = 'index.html';
}

function formatStatus(status) {
    return status.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatDate(date) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}