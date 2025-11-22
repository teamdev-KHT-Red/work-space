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
                // this.model.startGame();
                window.focus();
            });
        }
    }

    handleKeyPress = (event) => {
        switch (event.keyCode) {
            case 37:
                this.model.moveLeft();
                break;
            case 39:
                this.model.moveRight();
                break;
            case 40:
                this.model.moveDown();
                break;
            case 38:
                this.model.rotate();
                break;
            case 32:
                this.model.hardDrop();
                break;
            // case 80:
            //     this.model.togglePause();
            //     break;
        }
    }

}
