function initNavbar() {
    checkLoginStatus();
    
    const logoBtn = document.getElementById('nav-logo-btn');
    if (logoBtn) {
        logoBtn.addEventListener('click', () => {
            const loggedUser = getCookie("loggedUser");
            if (loggedUser) {
                window.location.href = '/pages/games-gallery/games-gallery.html';
            } else {
                window.location.href = '/home.html';
            }
        });
    }

    const regBtn = document.getElementById('nav-register-btn');
    if (regBtn) {
        regBtn.addEventListener('click', () => {
            window.location.href = '/pages/register/register.html';
        });
    }

    const logoutBtn = document.querySelector('.btn-logout'); 
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout); 
    }

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
    window.location.replace('/home.html');
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

window.addEventListener("pageshow", function (event) {
    var historyTraversal = event.persisted || 
                           (typeof window.performance != "undefined" && 
                            window.performance.navigation.type === 2);
    if (historyTraversal) {
        window.location.reload();
    }
});

if (document.getElementById('nav-guest')) {
    initNavbar();
} else {
    setTimeout(initNavbar, 100);
}