
document.addEventListener("DOMContentLoaded", () => {

    const board = document.getElementById("board");
    const scoreEl = document.getElementById("score");
    const timeEl = document.getElementById("time");
    const bestEl = document.getElementById("best");
    const difficulty = document.getElementById("difficulty");
    const startBtn = document.getElementById("startBtn");
    const hitSound = document.getElementById("hitSound");
    const hammer = document.getElementById("hammer");

    let score = 0;
    let time = 0;
    let speed = 1000;
    let timer, moleTimer;
    let moles = [];

    bestEl.textContent = localStorage.getItem("bestScore") || 0;

    /* Create board */
    for (let i = 0; i < 9; i++) {
        const hole = document.createElement("div");
        hole.className = "hole";

        const mole = document.createElement("div");
        mole.className = "mole";

        mole.addEventListener("click", () => {
            if (!mole.classList.contains("up")) return;

            score++;
            scoreEl.textContent = score;

            hitSound.currentTime = 0;
            hitSound.play();

            mole.classList.remove("up");

            // Shake hole
            hole.classList.add("hit");
            setTimeout(() => hole.classList.remove("hit"), 150);

            animateHammer();
        });

        hole.appendChild(mole);
        board.appendChild(hole);
        moles.push(mole);
    }

    /* Difficulty settings */
    function setDifficulty() {
        const d = difficulty.value;
        if (d === "easy") {
            speed = 1200;
            time = 30;
        } else if (d === "medium") {
            speed = 800;
            time = 25;
        } else if (d === "hard") {
            speed = 450;
            time = 20;
        }
    }

    function showMole() {
        moles.forEach(m => m.classList.remove("up"));
        const mole = moles[Math.floor(Math.random() * moles.length)];
        mole.classList.add("up");
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
        localStorage.setItem("bestScore", best);
        bestEl.textContent = best;

        alert(`Game Over!\nScore: ${score}`);
    }

    /* Hammer animation */
    function animateHammer() {
        hammer.classList.add("hit");
        setTimeout(() => hammer.classList.remove("hit"), 90);
    }

    /* Hammer follows mouse */
    document.addEventListener("mousemove", (e) => {
        hammer.style.left = e.clientX + "px";
        hammer.style.top = e.clientY + "px";
    });

    startBtn.addEventListener("click", startGame);

});
