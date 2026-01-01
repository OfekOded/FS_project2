document.addEventListener("DOMContentLoaded", loadUserProfile);

function loadUserProfile() {
    const loggedUser = getCookie("loggedUser");
    if (!loggedUser) {
        window.location.replace("/home.html"); 
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = users.find(u => u.username === loggedUser);

    if (currentUser) {
        document.getElementById("profile-username").textContent = currentUser.username;
        
        const emailEl = document.getElementById("profile-email");
        if (emailEl && currentUser.email) {
            emailEl.textContent = currentUser.email;
        }

        if (currentUser.lastLogin) {
            const date = new Date(currentUser.lastLogin);
            document.getElementById("last-seen-date").textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }

        const achievements = currentUser.achievements || {};
        const activities = currentUser.activities || [];
        
        const pongScore = achievements.pongScore || 0;
        const wamScore = achievements.wamScore || 0;
        const totalCombinedScore = pongScore + wamScore;
        const totalGamesPlayed = activities.length;

        document.getElementById("total-games-count").textContent = totalGamesPlayed;
        document.getElementById("total-score-sum").textContent = totalCombinedScore;
        
        document.getElementById("best-pong").textContent = pongScore;
        document.getElementById("best-wam").textContent = wamScore;

        const rankElement = document.getElementById("player-rank");
        if (totalCombinedScore > 200) rankElement.textContent = "LEGEND";
        else if (totalCombinedScore > 100) rankElement.textContent = "MASTER";
        else if (totalCombinedScore > 50) rankElement.textContent = "PRO";
        else if (totalCombinedScore > 20) rankElement.textContent = "PLAYER";
        else rankElement.textContent = "ROOKIE";

        renderActivityList(activities);
        renderGlobalLeaderboard(users, loggedUser);
    }
}

function renderActivityList(activities) {
    const list = document.getElementById("activity-list");
    list.innerHTML = ""; 

    if (!activities || activities.length === 0) {
        list.innerHTML = "<li style='color: var(--text-muted); justify-content: center;'>No recent matches found</li>";
        return;
    }

    const recentActivities = activities.slice().reverse().slice(0, 10);

    recentActivities.forEach(act => {
        const li = document.createElement("li");
        const dateObj = new Date(act.date);
        const dateStr = dateObj.toLocaleDateString();
        const timeStr = dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        li.innerHTML = `
            <div class="act-meta">
                <span class="act-name">${act.game}</span>
                <span class="act-date">${dateStr} | ${timeStr}</span>
            </div>
            <span class="act-score">${act.score} PTS</span>
        `;
        list.appendChild(li);
    });
}

function renderGlobalLeaderboard(users, currentUser) {
    const tbody = document.getElementById("leaderboard-body");
    tbody.innerHTML = "";

    const leaderboardData = users.map(u => {
        const ach = u.achievements || {};
        const total = (ach.pongScore || 0) + (ach.wamScore || 0);
        return { username: u.username, totalScore: total };
    });

    leaderboardData.sort((a, b) => b.totalScore - a.totalScore);

    leaderboardData.forEach((player, index) => {
        const tr = document.createElement("tr");
        if (player.username === currentUser) {
            tr.classList.add("active-user");
        }

        tr.innerHTML = `
            <td><span class="rank-num">#${index + 1}</span></td>
            <td>${player.username}</td>
            <td>${player.totalScore}</td>
        `;
        tbody.appendChild(tr);
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}