let wamState = {
    score: 0,
    time: 0,
    speed: 1000,
    timer: null,
    moleTimer: null,
    moles: [],
    gameRunning: false
};

function initWhackAMole() {
    const board = document.getElementById("wam-board");
    const startBtn = document.getElementById("wam-start-btn");
    const container = document.querySelector(".wam-container");
    const hammer = document.getElementById("wam-hammer");

    // עצירה יזומה של משחקים קודמים אם רצים ברקע
    stopWamTimers();

    if (!board || !container) return;

    // Load Best Score
    const bestScore = localStorage.getItem("wam-best-score") || 0;
    const bestDisplay = document.getElementById("wam-best");
    if(bestDisplay) bestDisplay.textContent = bestScore;

    // Create Board
    board.innerHTML = '';
    wamState.moles = [];
    for (let i = 0; i < 9; i++) {
        const hole = document.createElement("div");
        hole.className = "wam-hole";
        const mole = document.createElement("div");
        mole.className = "wam-mole";
        
        // מונע גרירה של האלמנט (שיפור UX)
        mole.setAttribute('draggable', false);

        mole.addEventListener("mousedown", () => handleMoleHit(mole)); 

        hole.appendChild(mole);
        board.appendChild(hole);
        wamState.moles.push(mole);
    }

    // Default Difficulty
    const diffBtn = document.querySelector('.wam-diff-btn');
    if(diffBtn) setWhackDifficulty('easy', diffBtn);

    // Events
    if (startBtn) {
        // שימוש ב-replaceWith כדי לנקות מאזינים ישנים
        const newBtn = startBtn.cloneNode(true);
        startBtn.parentNode.replaceChild(newBtn, startBtn);
        newBtn.addEventListener("click", startWhackGame);
    }
    
    // Hammer Movement - הוספנו בדיקה שהאלמנטים קיימים
    container.onmousemove = (e) => {
        if(hammer) {
            hammer.style.left = e.clientX + "px";
            hammer.style.top = e.clientY + "px";
        }
    };

    container.onmousedown = () => {
        if(hammer) {
            hammer.classList.add("hit");
            setTimeout(() => hammer.classList.remove("hit"), 100);
        }
    };
}

function setWhackDifficulty(level, btnElement) {
    if (wamState.gameRunning) return;

    document.querySelectorAll('.wam-difficulty .wam-diff-btn').forEach(btn => btn.classList.remove('active'));
    if(btnElement) btnElement.classList.add('active');

    if (level === "easy") { wamState.speed = 1200; wamState.time = 30; }
    else if (level === "medium") { wamState.speed = 800; wamState.time = 25; }
    else if (level === "hard") { wamState.speed = 500; wamState.time = 20; }
    
    const timeDisplay = document.getElementById("wam-time");
    if(timeDisplay) timeDisplay.textContent = wamState.time;
}

function startWhackGame() {
    if (wamState.gameRunning) return;
    wamState.gameRunning = true;
    
    const activeBtn = document.querySelector('.wam-difficulty .wam-diff-btn.active');
    const level = activeBtn ? activeBtn.textContent.toLowerCase() : 'easy';
    setWhackDifficulty(level, activeBtn);

    wamState.score = 0;
    const scoreDisplay = document.getElementById("wam-score");
    if(scoreDisplay) scoreDisplay.textContent = "0";
    
    stopWamTimers();
    
    wamState.moleTimer = setInterval(showRandomMole, wamState.speed);
    
    wamState.timer = setInterval(() => {
        if (!document.getElementById("wam-board")) {
            stopWamTimers();
            return;
        }

        wamState.time--;
        const timeDisplay = document.getElementById("wam-time");
        if(timeDisplay) timeDisplay.textContent = wamState.time;
        
        if (wamState.time <= 0) endWhackGame();
    }, 1000);
}

function stopWamTimers() {
    clearInterval(wamState.timer);
    clearInterval(wamState.moleTimer);
    wamState.gameRunning = false;
}

function showRandomMole() {
    if (!document.getElementById("wam-board")) {
        stopWamTimers();
        return;
    }

    wamState.moles.forEach(m => m.classList.remove("up"));
    const randomMole = wamState.moles[Math.floor(Math.random() * wamState.moles.length)];
    randomMole.classList.add("up");
}

function handleMoleHit(mole) {
    if (!mole.classList.contains("up")) return;
    
    wamState.score++;
    const scoreDisplay = document.getElementById("wam-score");
    if(scoreDisplay) scoreDisplay.textContent = wamState.score;
    
    mole.classList.remove("up");
}

function endWhackGame() {
    stopWamTimers();
    wamState.moles.forEach(m => m.classList.remove("up"));

    const currentBest = Number(localStorage.getItem("wam-best-score")) || 0;
    
    setTimeout(() => {
        if (wamState.score > currentBest) {
            localStorage.setItem("wam-best-score", wamState.score);
            const bestDisplay = document.getElementById("wam-best");
            if(bestDisplay) bestDisplay.textContent = wamState.score;
            alert(`NEW RECORD! Score: ${wamState.score}`);
        } else {
            alert(`Game Over! Score: ${wamState.score}`);
        }
    }, 100);
}

initWhackAMole();