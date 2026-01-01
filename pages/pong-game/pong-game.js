let pongGameState = {
    ballX: 490, ballY: 290,
    ballSpeedX: 4, ballSpeedY: 4,
    baseSpeed: 4,
    p1Y: 250, p2Y: 250,
    p1Score: 0, p2Score: 0,
    guestMaxScore: 5,
    paddleHeight: 100,
    gameRunning: false,
    keys: {}
};

function initPongGame() {
    const startBtn = document.getElementById('pong-start-btn');
    if (!startBtn) return;

    pongGameState.gameRunning = false;
    resetScores();
    resetPongPosition();

    startBtn.onclick = startPongMatch;
    
    document.addEventListener('keydown', (e) => {
        if(["ArrowUp", "ArrowDown", "KeyW", "KeyS"].includes(e.code)) {
            e.preventDefault(); 
        }
        pongGameState.keys[e.code] = true;
    });

    document.addEventListener('keyup', (e) => {
        pongGameState.keys[e.code] = false;
    });
}

function startPongMatch() {
    if (pongGameState.gameRunning) return;
    
    resetScores();
    pongGameState.gameRunning = true;
    requestAnimationFrame(updatePongFrame);
    
    const startBtn = document.getElementById('pong-start-btn');
    startBtn.textContent = "SURVIVE THE GUEST...";
    startBtn.style.opacity = "0.7";
}

function resetScores() {
    pongGameState.p1Score = 0;
    pongGameState.p2Score = 0;
    updateScoreDisplay();
}

function setDifficulty(btnElement, speed, height) {
    pongGameState.baseSpeed = speed;
    pongGameState.paddleHeight = height;
    
    const pLeft = document.getElementById('pong-paddle-left');
    const pRight = document.getElementById('pong-paddle-right');
    
    if (pLeft && pRight) {
        pLeft.style.height = height + 'px';
        pRight.style.height = height + 'px';
    }

    document.querySelectorAll('.pong-diff-btn').forEach(btn => btn.classList.remove('active'));
    if(btnElement) btnElement.classList.add('active');

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
        pongGameState.ballY + 16 >= pongGameState.p1Y && 
        pongGameState.ballY <= pongGameState.p1Y + pongGameState.paddleHeight) {
        
        pongGameState.ballSpeedX = Math.abs(pongGameState.baseSpeed);
        pongGameState.ballX = 28; 
    }

    if (pongGameState.ballX >= (boardWidth - 43) && 
        pongGameState.ballY + 16 >= pongGameState.p2Y && 
        pongGameState.ballY <= pongGameState.p2Y + pongGameState.paddleHeight) {
        
        pongGameState.ballSpeedX = -Math.abs(pongGameState.baseSpeed);
        pongGameState.ballX = boardWidth - 44; 
    }

    if (pongGameState.ballX < 0) {
        pongGameState.p2Score++;
        updateScoreDisplay();
        resetAfterPoint();
    } else if (pongGameState.ballX > boardWidth) {
        pongGameState.p1Score++;
        updateScoreDisplay();
        resetAfterPoint();
    }

    if (pongGameState.p2Score >= pongGameState.guestMaxScore) {
        endGame();
        return;
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
    
    if(p2Display) {
        p2Display.textContent = `${pongGameState.p2Score} / 5`; 
        
        if (pongGameState.p2Score >= 4) {
            p2Display.style.color = "#FF3B3B"; 
        } else {
            p2Display.style.color = "var(--accent-purple)";
        }
    }
}

function resetAfterPoint() {
    resetPongPosition();
}

function endGame() {
    pongGameState.gameRunning = false;
    
    const startBtn = document.getElementById('pong-start-btn');
    if(startBtn) {
        startBtn.textContent = "GAME OVER - TRY AGAIN";
        startBtn.style.opacity = "1";
    }

    saveGameResults(pongGameState.p1Score);
    
    setTimeout(() => alert(`GAME OVER! Final Score: ${pongGameState.p1Score}`), 100);
}

function resetPongPosition() {
    const board = document.getElementById('pong-board');
    if (!board) return;

    const boardWidth = board.clientWidth;
    const boardHeight = board.clientHeight;

    pongGameState.ballX = boardWidth / 2 - 8;
    pongGameState.ballY = boardHeight / 2 - 8;
    
    let directionX = Math.random() > 0.5 ? 1 : -1;
    let directionY = (Math.random() * 2 - 1); 

    pongGameState.ballSpeedX = pongGameState.baseSpeed * directionX;
    pongGameState.ballSpeedY = pongGameState.baseSpeed * directionY;
    
    const ball = document.getElementById('pong-ball');
    const pLeft = document.getElementById('pong-paddle-left');
    const pRight = document.getElementById('pong-paddle-right');

    if (ball) {
        ball.style.left = pongGameState.ballX + 'px';
        ball.style.top = pongGameState.ballY + 'px';
    }
    
    pongGameState.p1Y = boardHeight / 2 - pongGameState.paddleHeight / 2;
    pongGameState.p2Y = boardHeight / 2 - pongGameState.paddleHeight / 2;
    
    if(pLeft) pLeft.style.top = pongGameState.p1Y + 'px';
    if(pRight) pRight.style.top = pongGameState.p2Y + 'px';
}

function saveGameResults(playerScore) {
    const name = getCookie("loggedUser");
    if (!name) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.username === name);

    if (userIndex !== -1) {
        const user = users[userIndex];

        if (!user.achievements) user.achievements = {};
        const currentHighScore = user.achievements.pongScore || 0;
        
        if (playerScore > currentHighScore) {
            user.achievements.pongScore = playerScore;
        }

        if (!user.activities) user.activities = [];
        
        user.activities.unshift({
            game: "Pong Survival",
            score: playerScore,
            date: new Date().toISOString()
        });

        if (user.activities.length > 20) {
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

initPongGame();