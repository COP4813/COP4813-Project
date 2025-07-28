const signUpButton = document.querySelector('.signUpBtn');

signUpButton.addEventListener("click", () => {
    const email = document.querySelector('.email').value;
    const password = document.querySelector('.password').value;

    // Check password length
    if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return; // Stop execution
    }

    fetch('https://cop4813-project.onrender.com/users', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('userId', data._id);
        console.log('User created:', data);
        window.location.href = "index.html";
    })
    .catch(error => {
        console.error('Error creating user:', error);
    });
});


