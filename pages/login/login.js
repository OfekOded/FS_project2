(() => {

  const form = document.getElementById("loginForm");
  const errorBox = document.getElementById("login-error");

  form.addEventListener("submit", e => {
    e.preventDefault();

    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username);

    if (!user) return showError("משתמש לא קיים");

    // בדיקת חסימה
    if (user.blockedUntil && Date.now() < user.blockedUntil) {
      const min = Math.ceil((user.blockedUntil - Date.now()) / 60000);
      return showError(`המשתמש חסום לעוד ${min} דקות`);
    }

    // בדיקת סיסמה
    if (user.password !== password) {
      user.attempts = (user.attempts || 0) + 1;

      if (user.attempts >= 3) {
        user.blockedUntil = Date.now() + 5 * 60 * 1000;
        user.attempts = 0;
        save(users);
        return showError("נחסמת ל־5 דקות");
      }

      save(users);
      return showError("סיסמה שגויה");
    }

    // הצלחה
    user.attempts = 0;
    user.blockedUntil = null;
    user.lastLogin = new Date().toISOString();

    save(users);
    setCookie("loggedUser", username, 1);

    loadPage("home");
  });

  function save(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  function showError(msg) {
    errorBox.textContent = msg;
  }

  function setCookie(name, value, hours) {
    const exp = new Date(Date.now() + hours * 3600000).toUTCString();
    document.cookie = `${name}=${value}; expires=${exp}; path=/`;
  }

})();
