/**
 * runGameLogic()
 * ----------------
 * פונקציה ראשית המפעילה את כל לוגיקת המשחק Whack-a-Mole.
 * היא יוצרת את הלוח, מנהלת חפרפרות, זמן, ניקוד ואינטראקציה עם המשתמש,
 * ומאפשרת שמירה וטעינה של הניקוד מה-localStorage וה-cookies.
 */
function runGameLogic() {
    // --- Game State ---
    // אובייקט שמכיל את מצב המשחק הנוכחי
    let gameState = {
        score: 0,          // ניקוד נוכחי
        time: 30,          // זמן התחלתי במשחק (שניות)
        speed: 1100,       // מהירות הופעת חפרפרות (מילישניות)
        running: false,    // האם המשחק רץ כרגע
        moles: []          // מערך החפרפרות בלוח
    };

    // --- DOM Elements ---
    const board = document.getElementById("wam-board");        // אזור הלוח
    const container = document.querySelector(".wam-container"); // קונטיינר המשחק
    const startBtn = document.getElementById("wam-start-btn"); // כפתור התחלת המשחק

    if (!board || !container) return; // עצירה אם הלוח או הקונטיינר לא קיימים

    let gameInterval = null; // Interval לניהול הזמן
    let moleInterval = null; // Interval לניהול החפרפרות

    // יוצר את הלוח עם 9 חורים ו-9 חפרפרות
    function createBoard() {
        board.innerHTML = '';
        gameState.moles = [];
        
        for (let i = 0; i < 9; i++) {
            const hole = document.createElement("div");
            hole.className = "wam-hole";

            const mole = document.createElement("div");
            mole.className = "wam-mole";
            mole.setAttribute('draggable', false);
            
            // בודקעם אם החפרפת למעלה כאשר אנחנו לוחצים עליה. אם כן מעלים את הניקוד.
            mole.onmousedown = () => {
                if (mole.classList.contains("up")) {
                    gameState.score++;
                    document.getElementById("wam-score").textContent = gameState.score;
                    mole.classList.remove("up");
                }
            };

            hole.appendChild(mole);
            board.appendChild(hole);
            gameState.moles.push(mole);
        }
    }

    // מעקב אחרי העכבר להזזת הפטיש
    container.onmousemove = (e) => {
        const hammer = document.getElementById("wam-hammer");
        if(hammer) {
            hammer.style.left = e.clientX + "px";
            hammer.style.top = e.clientY + "px";
        }
    };
    
    // אנימציה קצרה לפטיש בלחיצה
    container.onmousedown = () => {
        const hammer = document.getElementById("wam-hammer");
        if(hammer) {
            hammer.classList.add("hit");
            setTimeout(() => hammer.classList.remove("hit"), 100);
        }
    };

    // --- Start Game ---
    function startGame() {
        if (gameState.running) return; // אם המשחק כבר רץ

        gameState.running = true;
        gameState.score = 0;
        document.getElementById("wam-score").textContent = "0";

        // הצגת הזמן ההתחלתי בהתאם לקושי
        const timeDisplay = document.getElementById("wam-time");
        if (timeDisplay) timeDisplay.textContent = gameState.time;

        // Interval לחפרפרות
        moleInterval = setInterval(() => {
            gameState.moles.forEach(m => m.classList.remove("up")); // מוריד חפרפרות קודמות
            const randomMole = gameState.moles[Math.floor(Math.random() * 9)];
            if(randomMole) randomMole.classList.add("up"); // מרים חפרפרת אקראית
        }, gameState.speed);

        // Interval לניהול הזמן
        let currentTime = gameState.time;
        gameInterval = setInterval(() => {
            currentTime--;
            if (timeDisplay) timeDisplay.textContent = currentTime;

            if (currentTime <= 0) {
                stopGame();
                saveScore(gameState.score);
                setTimeout(() => alert(`Time's up! Score: ${gameState.score}`), 100);
            }
        }, 1000);
    }

    // --- Stop Game ---
    function stopGame() {
        clearInterval(gameInterval);
        clearInterval(moleInterval);
        gameState.running = false;
        gameState.moles.forEach(m => m.classList.remove("up"));

        // איפוס תצוגת הזמן
        const timeDisplay = document.getElementById("wam-time");
        if (timeDisplay) timeDisplay.textContent = gameState.time;
    }

    // --- Set Difficulty ---
    // מאפשר שינוי מהירות וזמן לפי כפתור (EASY / MEDIUM / HARD)
    window.setWhackDifficulty = (btnElement, speed, time) => {
        if (gameState.running) return; // לא ניתן לשנות בזמן משחק

        gameState.speed = speed;
        gameState.time = time;

        // עדכון כפתורי UI
        document.querySelectorAll('.wam-diff-btn').forEach(b => b.classList.remove('active'));
        if(btnElement) btnElement.classList.add('active');

        // עדכון תצוגת הזמן מיד
        const tDisplay = document.getElementById("wam-time");
        if(tDisplay) tDisplay.textContent = gameState.time;
    };

    // התחלת המשחק בלחיצה על הכפתור
    if (startBtn) {
        startBtn.onclick = startGame;
    }

    // --- Load & Save Score ---
    function loadScore() {
        const name = getCookie("loggedUser");
        if (!name) return;
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.username === name);
        const best = document.getElementById("wam-best");
        if (user && best) {
            best.textContent = user.achievements?.wamScore || 0;
        }
    }
    //שמירת שיא + 5 משחקים אחרונים
    function saveScore(finalScore) {
        const name = getCookie("loggedUser");
        if (!name) return;
        
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(u => u.username === name);
        
        if (userIndex > -1) {
            const user = users[userIndex];

            if (!user.achievements) user.achievements = {};
            
            // שמירה אם הניקוד הנוכחי גבוה מהכי טוב
            const currentBest = user.achievements.wamScore || 0;
            if (finalScore > currentBest) {
                user.achievements.wamScore = finalScore;
                const best = document.getElementById("wam-best");
                if (best) best.textContent = finalScore;
            }

            // שמירת פעילויות אחרונות
            if (!user.activities) user.activities = [];
            user.activities.unshift({
                game: "Whack-a-Mole",
                score: finalScore,
                date: new Date().toISOString()
            });
            if (user.activities.length > 5) user.activities.pop();

            users[userIndex] = user;
            localStorage.setItem("users", JSON.stringify(users));
        }
    }

    // --- Helper: Get Cookie ---
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // --- Initialize ---
    createBoard(); // יצירת הלוח
    loadScore();   // טעינת הניקוד הכי טוב
    const defaultTimeDisplay = document.getElementById("wam-time");
    if(defaultTimeDisplay) defaultTimeDisplay.textContent = gameState.time;
}

// הפעלת המשחק
runGameLogic();
