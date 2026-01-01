document.addEventListener("DOMContentLoaded", loadUserProfile);

function loadUserProfile() {
    const loggedUser = getCookie("loggedUser");
    if (!loggedUser) {
        window.location.href = "/index.html"; 
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = users.find(u => u.username === loggedUser);

    if (currentUser) {
        // Basic Info
        document.getElementById("profile-username").textContent = currentUser.username;
        
        if (currentUser.lastLogin) {
            const date = new Date(currentUser.lastLogin);
            document.getElementById("last-seen-date").textContent = date.toLocaleDateString();
        }

        // Extract Data safely
        const achievements = currentUser.achievements || {};
        const activities = currentUser.activities || [];
        
        const pongScore = achievements.pongScore || 0;
        const wamScore = achievements.wamScore || 0;
        const totalCombinedScore = pongScore + wamScore;
        const totalGamesPlayed = activities.length;

        // Update Stats DOM
        document.getElementById("total-games-count").textContent = totalGamesPlayed;
        document.getElementById("total-score-sum").textContent = totalCombinedScore;
        
        document.getElementById("best-pong").textContent = pongScore;
        document.getElementById("best-wam").textContent = wamScore;

        // Calculate & Set Rank
        const rankElement = document.getElementById("player-rank");
        if (totalCombinedScore > 100) rankElement.textContent = "LEGEND";
        else if (totalCombinedScore > 50) rankElement.textContent = "MASTER";
        else if (totalCombinedScore > 20) rankElement.textContent = "PRO";
        else if (totalCombinedScore > 0) rankElement.textContent = "PLAYER";
        else rankElement.textContent = "ROOKIE";

        // Render Activity List
        renderActivityList(activities);
    }
}

function renderActivityList(activities) {
    const list = document.getElementById("activity-list");
    list.innerHTML = ""; 

    if (!activities || activities.length === 0) {
        list.innerHTML = "<li style='color: var(--text-muted); justify-content: center;'>No recent matches found</li>";
        return;
    }

    // Show last 5 games
    activities.slice(0, 5).forEach(act => {
        const li = document.createElement("li");
        const dateStr = new Date(act.date).toLocaleDateString();
        
        li.innerHTML = `
            <div class="act-meta">
                <span class="act-name">${act.game}</span>
                <span class="act-date">${dateStr}</span>
            </div>
            <span class="act-score">${act.score} PTS</span>
        `;
        list.appendChild(li);
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}