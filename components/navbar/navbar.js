function initNavbar() {
    console.log("Navbar initialized!"); 

    checkLoginStatus();
    
    const logoBtn = document.getElementById('nav-logo-btn');
    if (logoBtn) {
        logoBtn.addEventListener('click', () => {
            const loggedUser = getCookie("loggedUser");
            if (loggedUser) {
                window.location.href = '/pages/games-gallery/games-gallery.html';
            } else {
                window.location.href = '/index.html';
            }
        });
    }

    const regBtn = document.getElementById('nav-register-btn');
    if (regBtn) {
        regBtn.addEventListener('click', () => {
            window.location.href = '/pages/register/register.html';
        });
    } else {
        console.error("Register button not found!"); // יעזור לנו לדעת אם האלמנט חסר
    }

    // כפתור התנתקות
    const logoutBtn = document.querySelector('.btn-logout'); 
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout); 
    }

    // כפתור הפרופיל
    const profileBtn = document.getElementById('nav-profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            window.location.href = '/pages/profile/profile.html';
        });
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
    document.cookie = "loggedUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    window.location.href = '/index.html';
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// --- השינוי הקריטי נמצא כאן למטה ---

// בודק אם ה-HTML כבר קיים ומריץ מיד
if (document.getElementById('nav-guest')) {
    initNavbar();
} else {
    // במקרה נדיר שהסקריפט רץ לפני שה-HTML סיים להיכנס ל-DOM
    setTimeout(initNavbar, 100);
}