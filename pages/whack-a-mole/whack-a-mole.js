// פונקציה ראשית שעוטפת הכל
function runGameLogic() {
    
    // 1. ניקוי אגרסיבי: עצירת כל טיימר שרץ בדפדפן תחת השם שלנו
    if (window.wamTimers) {
        clearInterval(window.wamTimers.game);
        clearInterval(window.wamTimers.moles);
    }
    
    // 2. יצירת אובייקט גלובלי חדש ונקי
    window.wamTimers = { game: null, moles: null };
    
    // משתני המשחק
    let gameState = {
        score: 0,
        time: 30,
        speed: 1000,
        running: false,
        moles: []
    };

    const board = document.getElementById("wam-board");
    const container = document.querySelector(".wam-container");
    const startBtn = document.getElementById("wam-start-btn");

    // אם הלוח עדיין לא צויר - עוצרים (לא אמור לקרות בגלל ה-setTimeout למטה)
    if (!board || !container) return;

    // --- אתחול הלוח ---
    function createBoard() {
        board.innerHTML = ''; // מחיקת שאריות
        gameState.moles = [];
        
        for (let i = 0; i < 9; i++) {
            const hole = document.createElement("div");
            hole.className = "wam-hole";
            const mole = document.createElement("div");
            mole.className = "wam-mole";
            mole.setAttribute('draggable', false);
            
            // אירוע לחיצה על חפרפרת
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

    // --- תזוזת הפטיש ---
    container.onmousemove = (e) => {
        const hammer = document.getElementById("wam-hammer");
        if(hammer) {
            hammer.style.left = e.clientX + "px";
            hammer.style.top = e.clientY + "px";
        }
    };
    
    container.onmousedown = () => {
        const hammer = document.getElementById("wam-hammer");
        if(hammer) {
            hammer.classList.add("hit");
            setTimeout(() => hammer.classList.remove("hit"), 100);
        }
    };

    // --- לוגיקת משחק ---
    function startGame() {
        if (gameState.running) return;
        
        // ניקוי לפני התחלה
        if (window.wamTimers.game) clearInterval(window.wamTimers.game);
        if (window.wamTimers.moles) clearInterval(window.wamTimers.moles);

        gameState.running = true;
        gameState.score = 0;
        document.getElementById("wam-score").textContent = "0";
        
        // קביעת רמת קושי
        setDifficulty();

        // הפעלת טיימרים
        window.wamTimers.moles = setInterval(() => {
            if (!document.getElementById("wam-board")) return stopGame(); // בטיחות
            
            gameState.moles.forEach(m => m.classList.remove("up"));
            const randomMole = gameState.moles[Math.floor(Math.random() * 9)];
            if(randomMole) randomMole.classList.add("up");
            
        }, gameState.speed);

        window.wamTimers.game = setInterval(() => {
            if (!document.getElementById("wam-board")) return stopGame(); // בטיחות

            gameState.time--;
            const timeDisplay = document.getElementById("wam-time");
            if (timeDisplay) timeDisplay.textContent = gameState.time;

            if (gameState.time <= 0) {
                stopGame();
                saveScore();
                setTimeout(() => alert(`Time's up! Score: ${gameState.score}`), 100);
            }
        }, 1000);
    }

    function stopGame() {
        clearInterval(window.wamTimers.game);
        clearInterval(window.wamTimers.moles);
        gameState.running = false;
        gameState.moles.forEach(m => m.classList.remove("up"));
    }

    function setDifficulty() {
        // מציאת הכפתור הפעיל או ברירת מחדל
        const activeBtn = document.querySelector('.wam-diff-btn.active');
        const level = activeBtn ? activeBtn.textContent.trim().toLowerCase() : 'easy';
        
        if (level === 'easy') { gameState.speed = 1100; gameState.time = 30; }
        else if (level === 'medium') { gameState.speed = 800; gameState.time = 25; }
        else if (level === 'hard') { gameState.speed = 500; gameState.time = 20; }
        
        const tDisplay = document.getElementById("wam-time");
        if(tDisplay) tDisplay.textContent = gameState.time;
    }

    // חיבור כפתורים (באופן שלא משכפל מאזינים)
    if (startBtn) {
        startBtn.onclick = startGame; // דורס מאזינים קודמים
    }

    window.setWhackDifficulty = (level, btn) => {
        if (gameState.running) return;
        document.querySelectorAll('.wam-diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        setDifficulty();
    };

    function loadScore() {
        const user = getCookieUser();
        const best = document.getElementById("wam-best");
        if (user && best && user.achievements) {
            best.textContent = user.achievements.wamScore || 0;
        }
    }

    function saveScore() {
        const user = getCookieUser();
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(u => u.username === user.username);
        
        if (userIndex > -1) {
            const currentBest = users[userIndex].achievements?.wamScore || 0;
            if (gameState.score > currentBest) {
                if (!users[userIndex].achievements) users[userIndex].achievements = {};
                users[userIndex].achievements.wamScore = gameState.score;
                localStorage.setItem("users", JSON.stringify(users));
                const best = document.getElementById("wam-best");
                if (best) best.textContent = gameState.score;
            }
        }
    }

    function getCookieUser() {
        const name = document.cookie.split('; ').find(row => row.startsWith('loggedUser='))?.split('=')[1];
        if (!name) return null;
        const users = JSON.parse(localStorage.getItem("users")) || [];
        return users.find(u => u.username === name);
    }

    // הרצה
    createBoard();
    loadScore();
    setDifficulty(); // עדכון ראשוני של הזמן
}

// *** התיקון הקריטי: ***
// אנחנו מפעילים את הכל בדיליי של 50 מילישניות
// זה מבטיח שה-HTML נטען ב-100% לפני שהקוד מנסה למצוא את הלוח
setTimeout(runGameLogic, 50);