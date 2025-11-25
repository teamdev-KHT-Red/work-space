export class Controller {

    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.initializeEventListener();
        this.initializeTitleScreen();
    }

    initializeEventListener() {
        document.addEventListener('keydown', this.handleKeyPress);
    }

    initializeTitleScreen() {
        const startBtn = document.getElementById('start-btn');
        if(startBtn){
            startBtn.addEventListener('click', () => {
                this.view.hideStartScreen();
                this.view.showGameScreen();
                this.model.startGame();
            });
        }
    }

    handleKeyPress = (event) => {
        if (!this.model.isGameRunning) return;

        const { code } = event;

        if (code === 'Enter') {
            this.model.togglePause();
            return;
        }

        if (this.model.isPaused || this.model.gameOver) return;

        switch (code) {
            case 'ArrowLeft':  this.model.moveLeft();       break;
            case 'ArrowRight': this.model.moveRight();      break;
            case 'ArrowDown':  this.model.moveDown();       break;
            case 'ArrowUp':    this.model.rotate();         break;
            case 'Space':      this.model.hardDrop();       break;
            case 'ShiftLeft':
            case 'ShiftRight': this.model.holdCurrentPiece(); break;
        }
    }

}
