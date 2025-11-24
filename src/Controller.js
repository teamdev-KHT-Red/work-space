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
                
                //this.model.startGame();
                window.focus();
            });
        }
    }

    handleKeyPress = (event) => {
        switch (event.keyCode) {
            //ポーズ中の移動を無効にするために各キーにif(this.model.animationId != null)を追加。
            case 37:
                if(this.model.animationId != null)this.model.moveLeft();
                break;
            case 39:
                if(this.model.animationId != null)this.model.moveRight();
                break;
            case 40:
                if(this.model.animationId != null)this.model.moveDown();
                break;
            case 38:
                if(this.model.animationId != null)this.model.rotate();
                break;
            case 32:
                if(this.model.animationId != null)this.model.hardDrop();
                break;
            // case 80:
            //     this.model.togglePause();
            //     break;
            
            //ホールド処理
            case 16:
                if(this.model.animationId != null)this.model.holdCurrentPiece(); 
                break;

            //ポーズ処理
            case 13:
                if(this.model.animationId == null){
                    this.model.animationId =requestAnimationFrame(() => this.model.gameLoop());
                    
                    const bgm = document.getElementById('bgm');
                    bgm.play();

                    console.log("Resume");
                }else{
                    this.model.gamePausing();    
                }
                break;
        }
    }

}
