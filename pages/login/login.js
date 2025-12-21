function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  const errorBox = document.getElementById("login-error");

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.username === username);

  if (!user) return showError(errorBox, "User does not exist");

  if (user.blockedUntil && Date.now() < user.blockedUntil) {
    const minutesLeft = Math.ceil((user.blockedUntil - Date.now()) / 60000);
    return showError(errorBox, `User is blocked for ${minutesLeft} more minutes`);
  }

  if (user.password !== password) {
    user.attempts = (user.attempts || 0) + 1;

    if (user.attempts >= 3) {
      user.blockedUntil = Date.now() + 5 * 60 * 1000; 
      user.attempts = 0;
      saveUsers(users);
      return showError(errorBox, "You are blocked for 5 minutes");
    }

    saveUsers(users);
    return showError(errorBox, "Wrong password");
  }

  user.attempts = 0;
  user.blockedUntil = null;
  user.lastLogin = new Date().toISOString();

  saveUsers(users);
  setCookie("loggedUser", username, 1);

  loadPage("home");
}

function showError(errorBox, message) {
  errorBox.textContent = message;
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function setCookie(name, value, hours) {
  const expires = new Date(Date.now() + hours * 3600000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function initLogin() {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", handleLogin);
}

initLogin();
