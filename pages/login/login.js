function initLoginProcess() {
    const loginForm = document.getElementById("login-entry-form");
    if (!loginForm) return;

    loginForm.addEventListener("submit", executeLogin);
}

function executeLogin(event) {
    event.preventDefault();

    const usernameInput = document.getElementById("user-login-id");
    const passwordInput = document.getElementById("user-login-pass");
    const feedbackBox = document.getElementById("login-feedback-msg");

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        updateLoginStatus(feedbackBox, "Please enter both username and password");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username);

    if (!user) {
        updateLoginStatus(feedbackBox, "Account not found");
        return;
    }

    if (user.blockedUntil && Date.now() < user.blockedUntil) {
        const remainingMinutes = Math.ceil((user.blockedUntil - Date.now()) / 60000);
        updateLoginStatus(feedbackBox, `Account locked. Wait ${remainingMinutes}m`);
        return;
    }

    if (user.password !== password) {
        user.attempts = (user.attempts || 0) + 1;

        if (user.attempts >= 3) {
            user.blockedUntil = Date.now() + 5 * 60 * 1000;
            user.attempts = 0;
            localStorage.setItem("users", JSON.stringify(users));
            updateLoginStatus(feedbackBox, "Max attempts reached. Locked for 5m");
            return;
        }

        localStorage.setItem("users", JSON.stringify(users));
        updateLoginStatus(feedbackBox, "Invalid credentials");
        return;
    }

    user.attempts = 0;
    user.blockedUntil = null;
    user.lastLogin = new Date().toISOString();
    localStorage.setItem("users", JSON.stringify(users));

    document.cookie = `loggedUser=${username}; path=/; max-age=3600`;

    loadPage("games-gallery");
}

function updateLoginStatus(element, message) {
    element.textContent = message;
    element.className = "login-status-text login-error-state";
    
    setTimeout(() => {
        element.textContent = "";
        element.className = "login-status-text";
    }, 3000);
}

initLoginProcess();