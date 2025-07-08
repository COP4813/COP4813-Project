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

// fetch users as soon as page loads
window.onload = () => {
	fetch('/check-auth')
		.then(res => {
			if (!res.ok) {
				// Redirect to login if not authorized
				window.location.href = '/login.html';
			} else {
				// If authorized, fetch users
				getUsers();
			}
		})
		.catch(err => {
			console.error('Auth check failed:', err);
			window.location.href = '/login.html';
		});
}