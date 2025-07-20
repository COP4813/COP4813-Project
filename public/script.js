// Grab all needed variables
const userId = localStorage.getItem('userId');
const container = document.querySelector(".auth-section");
const loginBtn = document.querySelector(".loginBtn");
const signUpBtn = document.querySelector(".signUpBtn");

// Send user to correct sing up or login page
signUpBtn.addEventListener("click", () => {
    window.location.href = "signUp.html";
})

loginBtn.addEventListener("click", () => {
    window.location.href = "login.html";
})

// If user is signed in, do the following
if(userId && userId != '686d2969d78018395167bf70'){
    container.remove();
    const buttonsContainer = document.createElement("div");
    buttonsContainer.innerHTML = `
        <button class = "loginBtn">Add Budget +</button>
        <button class = "loginBtn" id="addTaskBtn">Add Task +</button>
        <button class = "signOutBtn">Sign Out</button>
    `;
    document.body.appendChild(buttonsContainer);

    // budget button
    const addBudgetBtn = document.getElementById("addBudgetBtn");
    addBudgetBtn.addEventListener("click", () => {
        window.location.href = "budgets.html";
    });

    // task button
    const addTaskBtn = document.getElementById("addTaskBtn");
    addTaskBtn.addEventListener("click", () => {
        window.location.href = "tasks.html";
    });
    
    // Signs user out
    const signOutBtn = document.querySelector(".signOutBtn");
    signOutBtn.addEventListener("click", async () => {
        try {
            // Notify backend user is logging out
            await fetch(`/users/${userId}/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (err) {
            console.error('Error marking user inactive:', err);
        }

        // Clear localStorage and redirect
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("email");

        window.location.href = "index.html";
    });

}







