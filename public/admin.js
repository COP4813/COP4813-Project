// Function to fetch users
async function getUsers() {
	try {
		const response = await fetch('/users');
		if (!response.ok) throw new Error('Failed to fetch users');
		const users = await response.json();

		const userList = document.getElementById('userList');
		userList.innerHTML = ''; // clear existing users

		users.forEach(user => {
			const li = document.createElement('li');
			li.classList.add('list-group-item', 'user-item');

			// User text
			const userText = document.createElement('span');
			userText.textContent = user.username || user.email;

			// Trash icon
			const trashIcon = document.createElement('span');
			trashIcon.textContent = '🗑';
			trashIcon.style.cursor = 'pointer';
			trashIcon.style.marginLeft = '10px';
			trashIcon.title = 'Delete user';

			// On click, delete user
			trashIcon.addEventListener('click', () => deleteUser(user._id));

			li.appendChild(userText);
			li.appendChild(trashIcon);
			userList.appendChild(li);
		});
	} catch (error) {
		console.error(error);
		alert('Error loading users');
	}
}
// Function to delete user when trash icon clicked
async function deleteUser(userId) {
	if (!confirm('Are you sure you want to delete this user?')) return;

	try {
		const response = await fetch(`/users/${userId}`, { method: 'DELETE' });
		if (!response.ok) throw new Error('Failed to delete user');
		alert('User deleted successfully');
		getUsers(); // refresh user list
	} catch (error) {
		console.error(error);
		alert('Error deleting user');
	}
}

// Function to fetch all tasks
async function getTasks() {
	try {
		const response = await fetch('/tasks/all');
		if (!response.ok) throw new Error('Failed to fetch tasks');
		const tasks = await response.json();

		const taskList = document.getElementById('taskList');
		taskList.innerHTML = '';

		tasks.forEach(task => {
			const li = document.createElement('li');
			li.classList.add('list-group-item', 'task-item');

			const taskInfo = document.createElement('div');
			taskInfo.style.flex = '1';
			
			const taskTitle = document.createElement('span');
			taskTitle.textContent = task.title;
			taskTitle.style.fontWeight = '500';
			
			const taskMeta = document.createElement('small');
			taskMeta.style.display = 'block';
			taskMeta.style.color = '#666';
			taskMeta.textContent = `${task.userId.email} • ${task.status} • ${task.priority}`;
			
			taskInfo.appendChild(taskTitle);
			taskInfo.appendChild(taskMeta);

			const trashIcon = document.createElement('span');
			trashIcon.classList.add('trash-icon');
			trashIcon.textContent = '🗑';
			trashIcon.style.cursor = 'pointer';
			trashIcon.title = 'Delete task';

			trashIcon.addEventListener('click', () => deleteTask(task._id));

			li.appendChild(taskInfo);
			li.appendChild(trashIcon);
			taskList.appendChild(li);
		});
	} catch (error) {
		console.error(error);
	}
}

// Function to delete task
async function deleteTask(taskId) {
	if (!confirm('Are you sure you want to delete this task?')) return;

	try {
		const response = await fetch(`/tasks/${taskId}`, { method: 'DELETE' });
		if (!response.ok) throw new Error('Failed to delete task');
		getTasks();
	} catch (error) {
		console.error(error);
		alert('Error deleting task');
	}
}

// fetch users as soon as page loads
window.onload = () => {
	fetch('/check-auth')
		.then(res => {
			if (!res.ok) {
				// Redirect to login if not authorized
				window.location.href = '/login.html';
			} else {
				// If authorized, fetch users and tasks
				getUsers();
				getTasks();
			}
		})
		.catch(err => {
			console.error('Auth check failed:', err);
			window.location.href = '/login.html';
		});
}

// Signs admin out
    const signOutBtn = document.querySelector(".signOutBtn");
    signOutBtn.addEventListener("click", () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("email");

        window.location.href = "index.html";
    });