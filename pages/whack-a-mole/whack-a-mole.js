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

    // Load Best Score
    document.getElementById("wam-best").textContent = localStorage.getItem("wam-best-score") || 0;

    // Create Board
    board.innerHTML = '';
    wamState.moles = [];
    for (let i = 0; i < 9; i++) {
        const hole = document.createElement("div");
        hole.className = "wam-hole";
        const mole = document.createElement("div");
        mole.className = "wam-mole";

        mole.addEventListener("mousedown", () => handleMoleHit(mole)); // mousedown is faster than click

        hole.appendChild(mole);
        board.appendChild(hole);
        wamState.moles.push(mole);
    }

    // Default Difficulty
    setWhackDifficulty('easy', document.querySelector('.wam-diff-btn'));

    // Events
    if (startBtn) startBtn.addEventListener("click", startWhackGame);
    
    // Hammer Movement
    container.addEventListener("mousemove", (e) => {
        hammer.style.left = e.clientX + "px";
        hammer.style.top = e.clientY + "px";
    });

    container.addEventListener("mousedown", () => {
        hammer.classList.add("hit");
        setTimeout(() => hammer.classList.remove("hit"), 100);
    });
}

function setWhackDifficulty(level, btnElement) {
    if (wamState.gameRunning) return; // אי אפשר לשנות באמצע משחק

    // Update UI
    document.querySelectorAll('.wam-difficulty .wam-diff-btn').forEach(btn => btn.classList.remove('active'));
    if(btnElement) btnElement.classList.add('active');

    // Update Logic
    if (level === "easy") { wamState.speed = 1200; wamState.time = 30; }
    else if (level === "medium") { wamState.speed = 800; wamState.time = 25; }
    else if (level === "hard") { wamState.speed = 500; wamState.time = 20; }
    
    document.getElementById("wam-time").textContent = wamState.time;
}

function startWhackGame() {
    if (wamState.gameRunning) return;
    wamState.gameRunning = true;
    
    // Reset Score logic (reuse logic from setDifficulty to reset time)
    const activeBtn = document.querySelector('.wam-difficulty .wam-diff-btn.active');
    const level = activeBtn ? activeBtn.textContent.toLowerCase() : 'easy';
    setWhackDifficulty(level, activeBtn);

    wamState.score = 0;
    document.getElementById("wam-score").textContent = "0";
    
    clearInterval(wamState.timer);
    clearInterval(wamState.moleTimer);
    
    wamState.moleTimer = setInterval(showRandomMole, wamState.speed);
    wamState.timer = setInterval(() => {
        wamState.time--;
        document.getElementById("wam-time").textContent = wamState.time;
        if (wamState.time <= 0) endWhackGame();
    }, 1000);
}

function showRandomMole() {
    wamState.moles.forEach(m => m.classList.remove("up"));
    const randomMole = wamState.moles[Math.floor(Math.random() * wamState.moles.length)];
    randomMole.classList.add("up");
}

function handleMoleHit(mole) {
    if (!mole.classList.contains("up")) return;
    
    wamState.score++;
    document.getElementById("wam-score").textContent = wamState.score;
    mole.classList.remove("up");
}

function endWhackGame() {
    wamState.gameRunning = false;
    clearInterval(wamState.timer);
    clearInterval(wamState.moleTimer);
    wamState.moles.forEach(m => m.classList.remove("up"));

    const currentBest = Number(localStorage.getItem("wam-best-score")) || 0;
    if (wamState.score > currentBest) {
        localStorage.setItem("wam-best-score", wamState.score);
        document.getElementById("wam-best").textContent = wamState.score;
        alert(`NEW RECORD! Score: ${wamState.score}`);
    } else {
        alert(`Game Over! Score: ${wamState.score}`);
    }
}

initWhackAMole();