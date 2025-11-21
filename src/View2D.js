export class View2D {

    constructor() {
        this.COLS = 10;
        this.ROWS = 20;
        this.BLOCK_SIZE = 30;
    
    }

        // Modelからデータを受信
    update(data){
        this.draw(data);
    }

    draw(board){
        
    }

    hideStartScreen(){
        const titleScreen = document.getElementById('title-screen');
        if(titleScreen){
            titleScreen.classList.add('d-none');
            titleScreen.classList.remove('d-flex');
        }        
    }

    showGameScreen(){
        const gameScreen = document.getElementById('game-screen');
        if(gameScreen){
            gameScreen.classList.remove('d-none');
            gameScreen.classList.add('d-flex');
        }
    }

    
    }
    
