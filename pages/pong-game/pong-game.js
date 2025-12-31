let pongListenersAdded = false;

let pongGameState = {
    ballX: 490, ballY: 290,
    ballSpeedX: 3, ballSpeedY: 3,
    baseSpeed: 3,
    p1Y: 250, p2Y: 250,
    p1Score: 0, p2Score: 0,
    paddleHeight: 100,
    gameRunning: false,
    keys: {}
};

function initPongGame() {
    const startBtn = document.getElementById('pong-start-btn');
    if (!startBtn) return;

    pongGameState.gameRunning = false;
    pongGameState.p1Score = 0;
    pongGameState.p2Score = 0;
    updateScoreDisplay();

    const newStartBtn = startBtn.cloneNode(true);
    startBtn.parentNode.replaceChild(newStartBtn, startBtn);
    newStartBtn.addEventListener('click', startPongMatch);
    
    if (!pongListenersAdded) {
        document.addEventListener('keydown', (e) => {
            if(["ArrowUp", "ArrowDown", "KeyW", "KeyS"].includes(e.code)) {
                e.preventDefault(); 
            }
            pongGameState.keys[e.code] = true;
        });

        document.addEventListener('keyup', (e) => {
            pongGameState.keys[e.code] = false;
        });
        
        pongListenersAdded = true;
    }
    
    setPongDifficulty(3, 100);
}

function startPongMatch() {
    if (pongGameState.gameRunning) return;
    pongGameState.gameRunning = true;
    requestAnimationFrame(updatePongFrame);
}

function setPongDifficulty(speed, height) {
    pongGameState.baseSpeed = speed;
    pongGameState.paddleHeight = height;
    
    const pLeft = document.getElementById('pong-paddle-left');
    const pRight = document.getElementById('pong-paddle-right');
    
    if (pLeft && pRight) {
        pLeft.style.height = height + 'px';
        pRight.style.height = height + 'px';
    }

    if (!pongGameState.gameRunning) {
        resetPongPosition();
    }
}

function handlePongInput() {
    const step = 8;
    const board = document.getElementById('pong-board');
    if (!board) return;
    
    const boardHeight = board.clientHeight;

    if (pongGameState.keys['KeyW'] && pongGameState.p1Y > 0) {
        pongGameState.p1Y -= step;
    }
    if (pongGameState.keys['KeyS'] && pongGameState.p1Y < boardHeight - pongGameState.paddleHeight) {
        pongGameState.p1Y += step;
    }

    if (pongGameState.keys['ArrowUp'] && pongGameState.p2Y > 0) {
        pongGameState.p2Y -= step;
    }
    if (pongGameState.keys['ArrowDown'] && pongGameState.p2Y < boardHeight - pongGameState.paddleHeight) {
        pongGameState.p2Y += step;
    }
}

function updatePongFrame() {
    if (!pongGameState.gameRunning) return;

    const ball = document.getElementById('pong-ball');
    const pLeft = document.getElementById('pong-paddle-left');
    const pRight = document.getElementById('pong-paddle-right');
    const board = document.getElementById('pong-board');
    
    if (!ball || !pLeft || !pRight || !board) {
        pongGameState.gameRunning = false;
        return;
    }

    handlePongInput();

    const boardWidth = board.clientWidth;
    const boardHeight = board.clientHeight;

    pongGameState.ballX += pongGameState.ballSpeedX;
    pongGameState.ballY += pongGameState.ballSpeedY;

    if (pongGameState.ballY <= 0) {
        pongGameState.ballY = 0;
        pongGameState.ballSpeedY *= -1;
    } else if (pongGameState.ballY >= (boardHeight - 16)) {
        pongGameState.ballY = boardHeight - 16;
        pongGameState.ballSpeedY *= -1;
    }

    if (pongGameState.ballX <= 27 && 
        pongGameState.ballY >= pongGameState.p1Y && 
        pongGameState.ballY <= pongGameState.p1Y + pongGameState.paddleHeight) {
        pongGameState.ballSpeedX = Math.abs(pongGameState.baseSpeed);
    }

    if (pongGameState.ballX >= (boardWidth - 43) && 
        pongGameState.ballY >= pongGameState.p2Y && 
        pongGameState.ballY <= pongGameState.p2Y + pongGameState.paddleHeight) {
        pongGameState.ballSpeedX = -Math.abs(pongGameState.baseSpeed);
    }

    if (pongGameState.ballX < 0) {
        pongGameState.p2Score++;
        updateScoreDisplay();
        endPongPoint();
    } else if (pongGameState.ballX > boardWidth) {
        pongGameState.p1Score++;
        updateScoreDisplay();
        savePongAchievement(); 
        endPongPoint();
    }

    ball.style.left = pongGameState.ballX + 'px';
    ball.style.top = pongGameState.ballY + 'px';
    pLeft.style.top = pongGameState.p1Y + 'px';
    pRight.style.top = pongGameState.p2Y + 'px';

    if (pongGameState.gameRunning) {
        requestAnimationFrame(updatePongFrame);
    }
}

function updateScoreDisplay() {
    const p1Display = document.getElementById('pong-player1-score');
    const p2Display = document.getElementById('pong-player2-score');
    if(p1Display) p1Display.textContent = pongGameState.p1Score;
    if(p2Display) p2Display.textContent = pongGameState.p2Score;
}

function endPongPoint() {
    pongGameState.gameRunning = false;
    resetPongPosition();
}

function resetPongPosition() {
    const board = document.getElementById('pong-board');
    if (!board) return;

    const boardWidth = board.clientWidth;
    const boardHeight = board.clientHeight;

    pongGameState.ballX = boardWidth / 2 - 8;
    pongGameState.ballY = boardHeight / 2 - 8;
    
    let directionX = Math.random() > 0.5 ? 1 : -1;
    let directionY = Math.random() > 0.5 ? 1 : -1;

    pongGameState.ballSpeedX = pongGameState.baseSpeed * directionX;
    pongGameState.ballSpeedY = pongGameState.baseSpeed * directionY;
    
    const ball = document.getElementById('pong-ball');
    if (ball) {
        ball.style.left = pongGameState.ballX + 'px';
        ball.style.top = pongGameState.ballY + 'px';
    }
}

function savePongAchievement() {
    const username = getCookie("loggedUser");
    if (!username) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex !== -1) {
        if (!users[userIndex].achievements) users[userIndex].achievements = {};
        
        const currentHighScore = users[userIndex].achievements.pongScore || 0;
        if (pongGameState.p1Score > currentHighScore) {
            users[userIndex].achievements.pongScore = pongGameState.p1Score;
            localStorage.setItem("users", JSON.stringify(users));
        }
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

initPongGame();