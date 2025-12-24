let pongGameState = {
    ballX: 0, ballY: 0,
    ballSpeedX: 5, ballSpeedY: 5,
    playerY: 160, aiY: 160,
    playerScore: 0, aiScore: 0,
    gameRunning: false,
    difficulty: 5
};

function initPongGame() {
    const startBtn = document.getElementById('pong-start-btn');
    if (!startBtn) return;

    startBtn.addEventListener('click', startPongMatch);
    document.addEventListener('keydown', handlePongInput);
    
    resetPongPosition();
}

function startPongMatch() {
    if (pongGameState.gameRunning) return;
    pongGameState.gameRunning = true;
    requestAnimationFrame(updatePongFrame);
}

function setPongDifficulty(level) {
    pongGameState.difficulty = level;
    pongGameState.ballSpeedX = pongGameState.ballSpeedX > 0 ? level : -level;
    pongGameState.ballSpeedY = pongGameState.ballSpeedY > 0 ? level : -level;
}

function handlePongInput(e) {
    const step = 25;
    if (e.key === 'ArrowUp' && pongGameState.playerY > 0) {
        pongGameState.playerY -= step;
    } else if (e.key === 'ArrowDown' && pongGameState.playerY < 320) {
        pongGameState.playerY += step;
    }
}

function updatePongFrame() {
    if (!pongGameState.gameRunning) return;

    const board = document.getElementById('pong-board');
    const ball = document.getElementById('pong-ball');
    const pLeft = document.getElementById('pong-paddle-left');
    const pRight = document.getElementById('pong-paddle-right');

    pongGameState.ballX += pongGameState.ballSpeedX;
    pongGameState.ballY += pongGameState.ballSpeedY;

    if (pongGameState.ballY <= 0 || pongGameState.ballY >= 385) {
        pongGameState.ballSpeedY *= -1;
    }

    if (pongGameState.ballX <= 22 && pongGameState.ballY > pongGameState.playerY && pongGameState.ballY < pongGameState.playerY + 80) {
        pongGameState.ballSpeedX *= -1;
    }

    let aiCenter = pongGameState.aiY + 40;
    if (aiCenter < pongGameState.ballY - 10) pongGameState.aiY += pongGameState.difficulty - 1;
    else if (aiCenter > pongGameState.ballY + 10) pongGameState.aiY -= pongGameState.difficulty - 1;

    if (pongGameState.ballX >= 763 && pongGameState.ballY > pongGameState.aiY && pongGameState.ballY < pongGameState.aiY + 80) {
        pongGameState.ballSpeedX *= -1;
    }

    if (pongGameState.ballX < 0) {
        pongGameState.aiScore++;
        endPongPoint();
    } else if (pongGameState.ballX > 800) {
        pongGameState.playerScore++;
        savePongAchievement();
        endPongPoint();
    }

    ball.style.left = pongGameState.ballX + 'px';
    ball.style.top = pongGameState.ballY + 'px';
    pLeft.style.top = pongGameState.playerY + 'px';
    pRight.style.top = pongGameState.aiY + 'px';

    document.getElementById('pong-player-score').textContent = pongGameState.playerScore;
    document.getElementById('pong-ai-score').textContent = pongGameState.aiScore;

    requestAnimationFrame(updatePongFrame);
}

function endPongPoint() {
    pongGameState.gameRunning = false;
    resetPongPosition();
}

function resetPongPosition() {
    pongGameState.ballX = 390;
    pongGameState.ballY = 190;
    const ball = document.getElementById('pong-ball');
    if (ball) {
        ball.style.left = '390px';
        ball.style.top = '190px';
    }
}

function savePongAchievement() {
    const username = getCookie("loggedUser");
    if (!username) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex !== -1) {
        if (!users[userIndex].achievements) users[userIndex].achievements = {};
        users[userIndex].achievements.pongScore = pongGameState.playerScore;
        localStorage.setItem("users", JSON.stringify(users));
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

initPongGame();