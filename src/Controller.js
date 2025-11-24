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
                
                //スタートボタン入力で音楽開始。
                const bgm = document.getElementById('bgm');
                bgm.currentTime = 0;
                bgm.play();
                
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
                
            //ポーズ処理
            case 13:
                this.model.togglePause();
                break;
            
            //ホールド処理
            case 16:
                this.model.holdCurrentPiece(); 
                break;

            //ポーズ処理
            // case 13:
            //     if(this.model.animationId === null){
            //         this.model.animationId = requestAnimationFrame(() => this.model.gameLoop());
                    
            //         const bgm = document.getElementById('bgm');
            //         bgm.play();

            //         console.log("Resume");
            //     }else{
            //         this.model.gamePausing();    
            //     }
            //     break;
        }
    }

}
