let pongGameState = {
    ballX: 490, ballY: 290,
    ballSpeedX: 3, ballSpeedY: 3,
    baseSpeed: 3,
    p1Y: 250, p2Y: 250,
    p1Score: 0, p2Score: 0,
    paddleHeight: 100,
    gameRunning: false,
    keys: {},
    winningScore: 3 // הוספנו: משחקים עד 3
};

function initPongGame() {
    const startBtn = document.getElementById('pong-start-btn');
    if (!startBtn) return;

    pongGameState.gameRunning = false;
    pongGameState.p1Score = 0;
    pongGameState.p2Score = 0;
    pongGameState.keys = {}; 
    updateScoreDisplay();

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
    
    setPongDifficulty(3, 100);
}

function startPongMatch() {
    if (pongGameState.gameRunning) return;
    
    // איפוס ניקוד בתחילת משחק חדש
    pongGameState.p1Score = 0;
    pongGameState.p2Score = 0;
    updateScoreDisplay();
    
    pongGameState.gameRunning = true;
    resetPongPosition(); // מתחילים מהאמצע
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

    // קירות למעלה ולמטה
    if (pongGameState.ballY <= 0) {
        pongGameState.ballY = 0;
        pongGameState.ballSpeedY *= -1;
    } else if (pongGameState.ballY >= (boardHeight - 16)) {
        pongGameState.ballY = boardHeight - 16;
        pongGameState.ballSpeedY *= -1;
    }

    // פגיעה במחבט שחקן 1
    if (pongGameState.ballX <= 27 && 
        pongGameState.ballY >= pongGameState.p1Y && 
        pongGameState.ballY <= pongGameState.p1Y + pongGameState.paddleHeight) {
        pongGameState.ballSpeedX = Math.abs(pongGameState.baseSpeed);
    }

    // פגיעה במחבט שחקן 2
    if (pongGameState.ballX >= (boardWidth - 43) && 
        pongGameState.ballY >= pongGameState.p2Y && 
        pongGameState.ballY <= pongGameState.p2Y + pongGameState.paddleHeight) {
        pongGameState.ballSpeedX = -Math.abs(pongGameState.baseSpeed);
    }

    // --- בדיקת גולים וניצחון (החלק ששונה) ---
    
    // שחקן 2 הבקיע
    if (pongGameState.ballX < 0) {
        pongGameState.p2Score++;
        updateScoreDisplay();
        checkWinCondition(); // בדיקה אם נגמר המשחק
    } 
    // שחקן 1 הבקיע
    else if (pongGameState.ballX > boardWidth) {
        pongGameState.p1Score++;
        updateScoreDisplay();
        checkWinCondition(); // בדיקה אם נגמר המשחק
    }

    ball.style.left = pongGameState.ballX + 'px';
    ball.style.top = pongGameState.ballY + 'px';
    pLeft.style.top = pongGameState.p1Y + 'px';
    pRight.style.top = pongGameState.p2Y + 'px';

    if (pongGameState.gameRunning) {
        requestAnimationFrame(updatePongFrame);
    }
}

// פונקציה חדשה: בודקת אם מישהו הגיע ל-3 נקודות
function checkWinCondition() {
    if (pongGameState.p1Score >= pongGameState.winningScore || 
        pongGameState.p2Score >= pongGameState.winningScore) {
        
        // המשחק נגמר
        pongGameState.gameRunning = false;
        
        // שמירה להיסטוריה רק אם המשחק נגמר
        savePongToHistory(); 
        
        alert(`Game Over! Score: ${pongGameState.p1Score} - ${pongGameState.p2Score}`);
    } else {
        // המשחק ממשיך - רק מאפסים את הכדור
        resetPongPosition();
    }
}

function updateScoreDisplay() {
    const p1Display = document.getElementById('pong-player1-score');
    const p2Display = document.getElementById('pong-player2-score');
    if(p1Display) p1Display.textContent = pongGameState.p1Score;
    if(p2Display) p2Display.textContent = pongGameState.p2Score;
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
}

// --- הפונקציה החדשה והחשובה לשמירה בפרופיל ---
function savePongToHistory() {
    const loggedUser = document.cookie.split('; ').find(row => row.startsWith('loggedUser='))?.split('=')[1];
    if (!loggedUser) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.username === loggedUser);

    if (userIndex !== -1) {
        const user = users[userIndex];

        // --- 1. עדכון שיא אישי (High Score) ---
        if (!user.achievements) user.achievements = {};
        
        // נבדוק אם הניקוד הנוכחי גבוה מהשיא הקיים
        const currentBest = user.achievements.pongScore || 0;
        if (pongGameState.p1Score > currentBest) {
            user.achievements.pongScore = pongGameState.p1Score;
        }

        // --- 2. עדכון היסטוריה (Recent Activity) ---
        if (!user.activities) user.activities = [];

        user.activities.unshift({
            game: "Pong",
            score: `${pongGameState.p1Score} - ${pongGameState.p2Score}`,
            date: new Date().toISOString()
        });

        // הגבלה ל-5 משחקים אחרונים בלבד
        if (user.activities.length > 5) {
            user.activities.pop(); // מוחק את הישן ביותר
        }

        // שמירה
        users[userIndex] = user;
        localStorage.setItem("users", JSON.stringify(users));
    }
}

initPongGame();