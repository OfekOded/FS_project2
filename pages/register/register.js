
function initRegister() {
    const registerForm = document.querySelector(".register-form");
    if (!registerForm) return;

    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("reg-username").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const password = document.getElementById("reg-pass").value;
        const confirmPassword = document.getElementById("reg-pass-confirm").value;
        const termsCheckbox = document.getElementById("terms");

        // --- בדיקות תקינות (אותו דבר כמו מקודם) ---
        if (password !== confirmPassword) {
            alert("הסיסמאות אינן תואמות!");
            return;
        }
        if (!termsCheckbox.checked) {
            alert("חובה לאשר את התקנון");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        if (users.find(u => u.username === username)) {
            alert("שם המשתמש תפוס");
            return;
        }

        // --- יצירת המשתמש ---
        const newUser = {
            username: username,
            email: email,
            password: password,
            attempts: 0,
            blockedUntil: null,
            lastLogin: new Date().toISOString() // מעדכנים שנכנס הרגע
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        // --- כאן השינוי: כניסה אוטומטית ---
        
        // 1. שומרים את הקוקי (בדיוק כמו בלוגין)
        // הערה: וודא שהפונקציה setCookie זמינה בקובץ הזה!
        setCookie("loggedUser", username, 1); 

        // 2. הודעה קצרה ומעבר למשחק
        alert("נרשמת בהצלחה! מתחילים...");
        loadPage("games-gallery"); 
    });
}

initRegister();
// תוסיף את זה מחוץ ל-initRegister אם זה לא קיים כבר
function setCookie(name, value, hours) {
  const expires = new Date(Date.now() + hours * 3600000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}