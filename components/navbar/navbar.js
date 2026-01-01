function initNavbar() {
    checkLoginStatus();
    
    // לוגיקה ללוגו
    const logoBtn = document.getElementById('nav-logo-btn');
    if (logoBtn) {
        logoBtn.addEventListener('click', handleLogoClick);
    }

    // לוגיקה ל-Login
    const loginBtn = document.getElementById('nav-login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const isInternal = window.location.href.includes('/pages/');
            window.location.href = isInternal ? '../../pages/login/login.html' : 'pages/login/login.html';
        });
    }

    // לוגיקה ל-Logout
    const logoutBtn = document.querySelector('.btn-logout'); 
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout); 
    }

    // === חדש: לוגיקה ל-Profile ===
    const profileBtn = document.getElementById('open-profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', openProfileModal);
    }
    
    setupModalClose();
}

function handleLogoClick() {
    const loggedUser = getCookie("loggedUser");
    const isInternal = window.location.href.includes('/pages/');
    
    if (loggedUser) {
        window.location.href = isInternal ? '../../pages/games-gallery/games-gallery.html' : 'pages/games-gallery/games-gallery.html';
    } else {
        window.location.href = isInternal ? '../../index.html' : 'index.html';
    }
}

function checkLoginStatus() {
    const guestNav = document.getElementById('nav-guest');
    const userNav = document.getElementById('nav-user');
    const usernameDisplay = document.getElementById('nav-username');

    if (!guestNav || !userNav) return;

    const loggedUser = getCookie("loggedUser");

    if (loggedUser) {
        guestNav.style.display = 'none';
        userNav.style.display = 'flex';
        if (usernameDisplay) {
            usernameDisplay.textContent = loggedUser;
        }
    } else {
        guestNav.style.display = 'flex';
        userNav.style.display = 'none';
    }
}

function handleLogout() {
    // מחיקת קוקיז
    document.cookie = "loggedUser=; path=/; max-age=0";
    document.cookie = "loggedUser=; max-age=0";
    
    // חזרה לדף הבית
    const isInternal = window.location.href.includes('/pages/');
    window.location.href = isInternal ? '../../index.html' : 'index.html';
}

// === פונקציות הפרופיל החדשות ===

function openProfileModal() {
    fillProfileData();
    const modal = document.getElementById('profile-modal');
    if (modal) modal.style.display = 'block';
}

function setupModalClose() {
    const modal = document.getElementById('profile-modal');
    const closeBtn = document.getElementById('close-profile-btn');

    // סגירה ב-X
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }

    // סגירה בלחיצה בחוץ
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function fillProfileData() {
    const loggedUser = getCookie("loggedUser");
    if (!loggedUser) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === loggedUser);

    if (user) {
        document.getElementById("modal-username").textContent = user.username;
        document.getElementById("modal-login-count").textContent = user.loginCount || "0";
        if (user.lastLogin) document.getElementById("modal-last-login").textContent = new Date(user.lastLogin).toLocaleDateString();

        const achievements = user.achievements || {};
        document.getElementById("modal-best-pong").textContent = achievements.pongScore || "0";
        document.getElementById("modal-best-wam").textContent = achievements.wamScore || "0";

        const list = document.getElementById("modal-activity-list");
        if (list) {
            list.innerHTML = "";
            const activities = user.activities || [];
            if (activities.length === 0) {
                list.innerHTML = "<li style='text-align:center; color:#aaa;'>No games played yet.</li>";
            } else {
                activities.forEach(act => {
                    const li = document.createElement("li");
                    li.innerHTML = `<span>${act.game}</span><span style="color: #FFD700;">${act.score}</span>`;
                    list.appendChild(li);
                });
            }
        }
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// הרצת הקוד
document.addEventListener("DOMContentLoaded", () => {
    // בדיקה קצרה לוודא שה-HTML נטען
    const checkInterval = setInterval(() => {
        if (document.getElementById('nav-guest')) {
            clearInterval(checkInterval);
            initNavbar();
        }
    }, 100);
});
initNavbar();