function runGameLogic() {
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

    if (!board || !container) return;

    let gameInterval = null;
    let moleInterval = null;

    function createBoard() {
        board.innerHTML = '';
        gameState.moles = [];
        
        for (let i = 0; i < 9; i++) {
            const hole = document.createElement("div");
            hole.className = "wam-hole";
            const mole = document.createElement("div");
            mole.className = "wam-mole";
            mole.setAttribute('draggable', false);
            
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

    function startGame() {
        if (gameState.running) return;
        
        gameState.running = true;
        gameState.score = 0;
        document.getElementById("wam-score").textContent = "0";
        
        setDifficulty();

        moleInterval = setInterval(() => {
            gameState.moles.forEach(m => m.classList.remove("up"));
            const randomMole = gameState.moles[Math.floor(Math.random() * 9)];
            if(randomMole) randomMole.classList.add("up");
        }, gameState.speed);

        gameInterval = setInterval(() => {
            gameState.time--;
            const timeDisplay = document.getElementById("wam-time");
            if (timeDisplay) timeDisplay.textContent = gameState.time;

            if (gameState.time <= 0) {
                stopGame();
                saveScore(); // כאן מתבצעת השמירה
                setTimeout(() => alert(`Time's up! Score: ${gameState.score}`), 100);
            }
        }, 1000);
    }

    function stopGame() {
        clearInterval(gameInterval);
        clearInterval(moleInterval);
        gameState.running = false;
        gameState.moles.forEach(m => m.classList.remove("up"));
    }

    function setDifficulty() {
        const activeBtn = document.querySelector('.wam-diff-btn.active');
        const level = activeBtn ? activeBtn.textContent.trim().toLowerCase() : 'easy';
        
        if (level === 'easy') { gameState.speed = 1100; gameState.time = 30; }
        else if (level === 'medium') { gameState.speed = 800; gameState.time = 25; }
        else if (level === 'hard') { gameState.speed = 500; gameState.time = 20; }
        
        const tDisplay = document.getElementById("wam-time");
        if(tDisplay) tDisplay.textContent = gameState.time;
    }

    if (startBtn) {
        startBtn.onclick = startGame;
    }

    window.setWhackDifficulty = (level, btn) => {
        if (gameState.running) return;
        document.querySelectorAll('.wam-diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        setDifficulty();
    };

    function loadScore() {
        const name = document.cookie.split('; ').find(row => row.startsWith('loggedUser='))?.split('=')[1];
        if (!name) return;
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.username === name);
        const best = document.getElementById("wam-best");
        if (user && best) {
            best.textContent = user.achievements?.wamScore || 0;
        }
    }

    // --- זו הפונקציה ששונתה ---
   function saveScore() {
        const name = document.cookie.split('; ').find(row => row.startsWith('loggedUser='))?.split('=')[1];
        if (!name) return;
        
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(u => u.username === name);
        
        if (userIndex > -1) {
            const user = users[userIndex];

            // 1. שמירת שיא (High Score)
            if (!user.achievements) user.achievements = {};
            
            const currentBest = user.achievements.wamScore || 0;
            if (gameState.score > currentBest) {
                user.achievements.wamScore = gameState.score;
                const best = document.getElementById("wam-best");
                if (best) best.textContent = gameState.score;
            }

            // 2. שמירת היסטוריה - הגבלה ל-5
            if (!user.activities) user.activities = [];

            user.activities.unshift({
                game: "Whack-a-Mole",
                score: gameState.score,
                date: new Date().toISOString()
            });

            // השינוי: שומרים רק 5 אחרונים
            if (user.activities.length > 5) {
                user.activities.pop();
            }

            users[userIndex] = user;
            localStorage.setItem("users", JSON.stringify(users));
        }
    }

    createBoard();
    loadScore();
    setDifficulty();
}

runGameLogic();