function saveHighscore(score) {
    try {
        const savedScore = localStorage.getItem('gameHighscore');
        const currentSavedScore = savedScore ? parseInt(savedScore) : 0;
        
        if (score > currentSavedScore) {
            localStorage.setItem('gameHighscore', score);
            console.log('New highscore saved:', score);
        }
    } catch (error) {
        console.error('Failed to save highscore:', error);
    }
}

function loadHighscore() {
    try {
        const savedScore = localStorage.getItem('gameHighscore');
        return savedScore ? parseInt(savedScore) : 0;
    } catch (error) {
        console.error('Failed to load highscore:', error);
        return 0;
    }
}

