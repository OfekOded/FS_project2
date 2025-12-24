function launchGame(gameId) {
    if (gameId === 'pong') {
        loadPage('pong-game');
    } else if (gameId === 'whack') {
        loadPage('whack-a-mole');
    }
}