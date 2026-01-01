function initNavbar() {
    checkLoginStatus();
    
    const logoBtn = document.getElementById('nav-logo-btn');
    if (logoBtn) {
        logoBtn.addEventListener('click', handleLogoClick);
    }

    const loginBtn = document.getElementById('nav-login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = '/pages/login/login.html';
        });
    }

    const logoutBtn = document.querySelector('.btn-logout'); 
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout); 
    }
}

function handleLogoClick() {
    const loggedUser = getCookie("loggedUser");
    
    if (loggedUser) {
        window.location.href = '/pages/games-gallery/games-gallery.html';
    } else {
        window.location.href = '/index.html';
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
    document.cookie = "loggedUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/index.html';
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

initNavbar();