document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
});

function loadUserProfile() {
    // 1. השגת שם המשתמש מה-Cookie
    const loggedUser = getCookie("loggedUser");

    if (!loggedUser) {
        window.location.href = "../../index.html"; 
        return;
    }

    // 2. שליפת הנתונים
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = users.find(u => u.username === loggedUser);

    if (currentUser) {
        // --- פרטים אישיים ---
        document.getElementById("profile-username").textContent = currentUser.username;
        
        if (currentUser.lastLogin) {
            const date = new Date(currentUser.lastLogin);
            document.getElementById("last-login").textContent = date.toLocaleString();
        }

        document.getElementById("login-count").textContent = currentUser.loginCount || "N/A";

        // --- שיאים (High Scores) ---
        const achievements = currentUser.achievements || {};
        
        // הצגת שיא פונג (אם אין, מציג 0)
        document.getElementById("best-pong").textContent = achievements.pongScore || "0";
        
        // הצגת שיא חפרפרת (אם אין, מציג 0)
        document.getElementById("best-wam").textContent = achievements.wamScore || "0";


        // --- פעילות אחרונה (Activities) ---
        const activityList = document.getElementById("activity-list");
        activityList.innerHTML = ""; 

        const activities = currentUser.activities || []; 

        if (activities.length === 0) {
            activityList.innerHTML = "<li style='justify-content:center'>No games played yet. Go play!</li>";
        } else {
            activities.forEach(act => {
                const li = document.createElement("li");
                
                // המרת תאריך למשהו קריא (תאריך ושעה)
                const dateObj = new Date(act.date);
                const dateString = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

                li.innerHTML = `
                    <span class="activity-name">${act.game}</span>
                    <span class="activity-score">Score: ${act.score}</span>
                    <span class="activity-date">${dateString}</span>
                `;
                activityList.appendChild(li);
            });
        }
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}