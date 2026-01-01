function initRegistration() {
    const signupForm = document.getElementById("signup-form");
    if (!signupForm) return;

    signupForm.addEventListener("submit", processRegistration);
}

function processRegistration(event) {
    event.preventDefault();

    const usernameInput = document.getElementById("signup-user");
    const emailInput = document.getElementById("signup-email");
    const passInput = document.getElementById("signup-pass");
    const confirmInput = document.getElementById("signup-confirm");
    const termsCheck = document.getElementById("signup-terms");
    const feedbackBox = document.getElementById("signup-feedback");

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passInput.value;
    const confirmPass = confirmInput.value;

    if (!username || !email || !password || !confirmPass) {
        setRegMessage(feedbackBox, "All fields are required", "reg-error");
        return;
    }

    if (password !== confirmPass) {
        setRegMessage(feedbackBox, "Passwords do not match", "reg-error");
        return;
    }

    if (!termsCheck.checked) {
        setRegMessage(feedbackBox, "You must accept the terms", "reg-error");
        return;
    }

    const currentUsers = JSON.parse(localStorage.getItem("users")) || [];
    
    const userExists = currentUsers.some(u => u.username === username);
    if (userExists) {
        setRegMessage(feedbackBox, "Username is already taken", "reg-error");
        return;
    }

    const newUserObj = {
        username: username,
        email: email,
        password: password,
        attempts: 0,
        blockedUntil: null,
        lastLogin: new Date().toISOString()
    };

    currentUsers.push(newUserObj);
    localStorage.setItem("users", JSON.stringify(currentUsers));

    document.cookie = `loggedUser=${username}; path=/; max-age=3600`;

    setRegMessage(feedbackBox, "Registration Successful! Redirecting...", "reg-success");

    setTimeout(() => {
        window.location.href = "../games-gallery/games-gallery.html";
    }, 1500);
}

function setRegMessage(element, text, className) {
    element.textContent = text;
    element.className = `reg-status-message ${className}`;
}

initRegistration();