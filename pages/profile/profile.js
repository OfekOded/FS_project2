// בעת טעינת הדף – טוען את פרופיל המשתמש המחובר
document.addEventListener("DOMContentLoaded", loadUserProfile);

// טוען נתוני משתמש מה-cookie וה-localStorage ומציג פרופיל, הישגים ודירוג
function loadUserProfile() {
    const loggedUser = getCookie("loggedUser");
    if (!loggedUser) {
        window.location.replace("/home.html");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = users.find(u => u.username === loggedUser);

    if (currentUser) {
        // פרטי משתמש בסיסיים
        document.getElementById("profile-username").textContent = currentUser.username;

        // הצגת אימייל אם קיים
        const emailEl = document.getElementById("profile-email");
        if (emailEl && currentUser.email) emailEl.textContent = currentUser.email;

        // תאריך התחברות אחרון
        if (currentUser.lastLogin) {
            const date = new Date(currentUser.lastLogin);
            document.getElementById("last-seen-date").textContent =
                date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }

        // חישוב סטטיסטיקות והישגים
        const achievements = currentUser.achievements || {};
        const activities = currentUser.activities || [];

        const pongScore = achievements.pongScore || 0;
        const wamScore = achievements.wamScore || 0;
        const totalScore = pongScore + wamScore;

        document.getElementById("total-games-count").textContent = activities.length;
        document.getElementById("total-score-sum").textContent = totalScore;
        document.getElementById("best-pong").textContent = pongScore;
        document.getElementById("best-wam").textContent = wamScore;

        // קביעת דרגת שחקן לפי ניקוד
        const rank = document.getElementById("player-rank");
        if (totalScore > 200) rank.textContent = "LEGEND";
        else if (totalScore > 100) rank.textContent = "MASTER";
        else if (totalScore > 50) rank.textContent = "PRO";
        else if (totalScore > 20) rank.textContent = "PLAYER";
        else rank.textContent = "ROOKIE";

        renderActivityList(activities);
        renderGlobalLeaderboard(users, loggedUser);
    }
}

// מציג עד 10 משחקים אחרונים של המשתמש
function renderActivityList(activities) {
    const list = document.getElementById("activity-list");
    list.innerHTML = "";

    if (!activities.length) {
        list.innerHTML = "<li>No recent matches found</li>";
        return;
    }

    activities.slice().reverse().slice(0, 10).forEach(act => {
        const li = document.createElement("li");
        const d = new Date(act.date);
        li.innerHTML = `
            <span>${act.game}</span>
            <span>${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
            <span>${act.score} PTS</span>
        `;
        list.appendChild(li);
    });
}

// בונה טבלת דירוג כללית לפי ניקוד מצטבר
function renderGlobalLeaderboard(users, currentUser) {
    const tbody = document.getElementById("leaderboard-body");
    tbody.innerHTML = "";

    users
        .map(u => ({
            username: u.username,
            total: (u.achievements?.pongScore || 0) + (u.achievements?.wamScore || 0)
        }))
        .sort((a, b) => b.total - a.total)
        .forEach((p, i) => {
            const tr = document.createElement("tr");
            if (p.username === currentUser) tr.classList.add("active-user");
            tr.innerHTML = `<td>#${i + 1}</td><td>${p.username}</td><td>${p.total}</td>`;
            tbody.appendChild(tr);
        });
}

// מחזיר ערך Cookie לפי שם
function getCookie(name) {
    const parts = (`; ${document.cookie}`).split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
}
