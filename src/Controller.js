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
        if (event.keyCode === 13) {
            this.model.togglePause();
            return;
        }
        if (this.model.gameOver || this.model.isPaused) return;

        switch (event.keyCode) {
            // 左(ArrowLeft)
            case 37:
                this.model.moveLeft();
                break;
            // 右(ArrowRight)
            case 39:
                this.model.moveRight();
                break;
            // 下(ArrowDown)
            case 40:
                this.model.moveDown();
                break;
            // 回転(ArrowUp)
            case 38:
                this.model.rotate();
                break;
            // ハードドロップ(Space)
            case 32:
                this.model.hardDrop();
                break;
                
            // ポーズ(Enter)
            case 13:
                this.model.togglePause();
                break;
            
            // ホールド(Shift)
            case 16:
                this.model.holdCurrentPiece(); 
                break;
        }
    }

}
