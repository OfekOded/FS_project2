function runGameLogic() {
    let gameState = {
        score: 0,
        time: 30, // Default start time
        speed: 1100, // Default speed
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
        
        // Reset Time Display based on current difficulty
        const timeDisplay = document.getElementById("wam-time");
        if (timeDisplay) timeDisplay.textContent = gameState.time;

        moleInterval = setInterval(() => {
            gameState.moles.forEach(m => m.classList.remove("up"));
            const randomMole = gameState.moles[Math.floor(Math.random() * 9)];
            if(randomMole) randomMole.classList.add("up");
        }, gameState.speed);

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

    function stopGame() {
        clearInterval(gameInterval);
        clearInterval(moleInterval);
        gameState.running = false;
        gameState.moles.forEach(m => m.classList.remove("up"));
        
        // Reset time display back to setting default
        const timeDisplay = document.getElementById("wam-time");
        if (timeDisplay) timeDisplay.textContent = gameState.time;
    }

    // New Logic: Matches Pong style
    window.setWhackDifficulty = (btnElement, speed, time) => {
        if (gameState.running) return;
        
        gameState.speed = speed;
        gameState.time = time;
        
        // Update UI Visuals
        document.querySelectorAll('.wam-diff-btn').forEach(b => b.classList.remove('active'));
        if(btnElement) btnElement.classList.add('active');
        
        // Update Time Display immediately
        const tDisplay = document.getElementById("wam-time");
        if(tDisplay) tDisplay.textContent = gameState.time;
    };

    if (startBtn) {
        startBtn.onclick = startGame;
    }

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

    function saveScore(finalScore) {
        const name = getCookie("loggedUser");
        if (!name) return;
        
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(u => u.username === name);
        
        if (userIndex > -1) {
            const user = users[userIndex];

            if (!user.achievements) user.achievements = {};
            
            const currentBest = user.achievements.wamScore || 0;
            if (finalScore > currentBest) {
                user.achievements.wamScore = finalScore;
                const best = document.getElementById("wam-best");
                if (best) best.textContent = finalScore;
            }

            if (!user.activities) user.activities = [];

            user.activities.unshift({
                game: "Whack-a-Mole",
                score: finalScore,
                date: new Date().toISOString()
            });

            if (user.activities.length > 5) {
                user.activities.pop();
            }

            users[userIndex] = user;
            localStorage.setItem("users", JSON.stringify(users));
        }
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    createBoard();
    loadScore();
    // Default Init
    const defaultTimeDisplay = document.getElementById("wam-time");
    if(defaultTimeDisplay) defaultTimeDisplay.textContent = gameState.time;
}

runGameLogic();