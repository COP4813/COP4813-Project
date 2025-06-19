const signUpButton = document.querySelector('.signUpBtn');

signUpButton.addEventListener("click", () => {
    // Grab values when the button is clicked
    const email = document.querySelector('.email').value;
    const password = document.querySelector('.password').value;


    fetch('http://localhost:3000/users', {
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