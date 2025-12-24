function initWhackAMole() {
    const board = document.getElementById("wam-board");
    const scoreEl = document.getElementById("wam-score");
    const timeEl = document.getElementById("wam-time");
    const bestEl = document.getElementById("wam-best");
    const difficulty = document.getElementById("wam-difficulty");
    const startBtn = document.getElementById("wam-start-btn");
    const hammer = document.getElementById("wam-hammer");
    const container = document.querySelector(".wam-container");

    let score = 0;
    let time = 0;
    let speed = 1000;
    let timer, moleTimer;
    let moles = [];

    bestEl.textContent = localStorage.getItem("wam-best-score") || 0;

    board.innerHTML = '';
    moles = [];
    for (let i = 0; i < 9; i++) {
        const hole = document.createElement("div");
        hole.className = "wam-hole";
        const mole = document.createElement("div");
        mole.className = "wam-mole";

        mole.addEventListener("click", () => {
            if (!mole.classList.contains("up")) return;
            score++;
            scoreEl.textContent = score;
            mole.classList.remove("up");
            animateHammer();
        });

        hole.appendChild(mole);
        board.appendChild(hole);
        moles.push(mole);
    }

    function setDifficulty() {
        const d = difficulty.value;
        if (d === "easy") { speed = 1200; time = 30; }
        else if (d === "medium") { speed = 800; time = 25; }
        else if (d === "hard") { speed = 500; time = 20; }
    }

    function showMole() {
        moles.forEach(m => m.classList.remove("up"));
        const randomMole = moles[Math.floor(Math.random() * moles.length)];
        randomMole.classList.add("up");
    }

    function startGame() {
        score = 0;
        setDifficulty();
        scoreEl.textContent = score;
        timeEl.textContent = time;
        clearInterval(timer);
        clearInterval(moleTimer);
        moleTimer = setInterval(showMole, speed);
        timer = setInterval(() => {
            time--;
            timeEl.textContent = time;
            if (time <= 0) endGame();
        }, 1000);
    }

    function endGame() {
        clearInterval(timer);
        clearInterval(moleTimer);
        moles.forEach(m => m.classList.remove("up"));
        const best = Math.max(score, Number(bestEl.textContent));
        localStorage.setItem("wam-best-score", best);
        bestEl.textContent = best;
        alert(`Time's up! Your score: ${score}`);
    }

    function animateHammer() {
        hammer.classList.add("hit");
        setTimeout(() => hammer.classList.remove("hit"), 100);
    }

    container.addEventListener("mousemove", (e) => {
        hammer.style.left = e.clientX + "px";
        hammer.style.top = e.clientY + "px";
    });

    startBtn.addEventListener("click", startGame);
}

initWhackAMole();