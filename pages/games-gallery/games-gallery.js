function launchGame(gameId) {
    if (gameId === 'pong') {
        loadPage('pong-game');
    } else if (gameId === 'memory') {
        alert("Memory Matrix is coming soon!");
    }
}