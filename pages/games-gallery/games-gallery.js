function launchGame(gameId) {
    if (gameId === 'pong') {
        loadPage('pong-game');
    } else if (gameId === 'whack') {
        loadPage('whack-a-mole');
    }

    loadComponent("navbar-container", "components/navbar", "navbar")
    

}
function initGamesGallery() {
    loadComponent("navbar-container", "components/navbar", "navbar")
 
}
initGamesGallery();