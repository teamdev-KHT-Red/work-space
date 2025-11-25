import { EVENTS } from "./events.js";

export class View2D {

    constructor() {
        this.COLS = 10;
        this.ROWS = 20;
        this.BLOCK_SIZE = 30;
        
        this.canvas = document.getElementById('c');
        this.ctx = this.canvas.getContext('2d');
        this.bgm = document.getElementById('bgm');

        // キャンバスのサイズを計算して設定 (300px x 600px)
        this.canvas.width = this.COLS * this.BLOCK_SIZE;
        this.canvas.height = this.ROWS * this.BLOCK_SIZE;

        //htmlのホールドとネクストミノ
        this.holdCanvas = document.getElementById("holdCanvas");
        this.holdCtx = this.holdCanvas.getContext("2d");

        this.nextCanvas = document.getElementById("nextCanvas");
        this.nextCtx = this.nextCanvas.getContext("2d");

        this.handlers = {
            [EVENTS.UPDATE_BOARD]: (data) => this.draw(data),
            [EVENTS.GAME_OVER]:        () => this.gameOver(),
            [EVENTS.SCORE_CHANGED]:(data) => console.log(data),
            [EVENTS.IS_PAUSED]:    (data) => this.isPaused(data),
            
            //drawMini関数にてホールドとネクストのミニミノを描画
            [EVENTS.NEXT_PIECE]:   (data) => this.drawMini(this.nextCtx, data),
            [EVENTS.HOLD_PIECE]:   (data) => this.drawMini(this.holdCtx, data)
            /*
            [EVENTS.NEXT_PIECE]:   (data) => console.log(data),
            [EVENTS.HOLD_PIECE]:   (data) => console.log(data)
            */
        };
    }

    update(event, data){
        if (this.handlers[event]) {
            this.handlers[event](data);
        } else {
            console.warn(`[${event}]は登録されていません。`);
        }
    }

    draw(board){
        // 1. 画面を全消去（リセット）
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 2. 配列をループしてブロックを描く
        board.forEach((row, y) => {
            row.forEach((color, x) => {
                if (color) {
                    this.drawBlock(x, y, color);
                }
            });
        });
    }

    // 1マスのブロックを描く処理
    drawBlock(x, y, color) {
        const px = x * this.BLOCK_SIZE;
        const py = y * this.BLOCK_SIZE;

        // 色を塗る
        this.ctx.fillStyle = color;
        this.ctx.fillRect(px, py, this.BLOCK_SIZE, this.BLOCK_SIZE);

        // 枠線を描く
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(px, py, this.BLOCK_SIZE, this.BLOCK_SIZE);
    }

    // 仮のゲームオーバー処理
    gameOver(){
        // 音楽停止
        this.bgm.pause();
        this.bgm.currentTime = 0;
        alert("GAME OVER");
    }

    //仮のポーズ処理
    isPaused(isPaused){
        if(isPaused){
            this.bgm.pause();
        } else {
            this.bgm.play();
        }
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
            window.focus();
        }

        // 音楽開始
        this.bgm.currentTime = 0;
        this.bgm.play();
    }

    //ミニ枠にホールドとネクストピースの描画
    drawMini(ctx, piece) {
        if (!piece) return;

        const size = 20; 
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const pieceWidth  = piece.shape[0].length * size;
        const pieceHeight = piece.shape.length * size;
        const offsetX = (ctx.canvas.width - pieceWidth) / 2;
        const offsetY = (ctx.canvas.height - pieceHeight) / 2

        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    ctx.fillStyle = piece.color;
                    ctx.fillRect(offsetX + x * size, offsetY + y * size, size, size);

                    ctx.strokeStyle = "black";
                    ctx.strokeRect(offsetX + x * size, offsetY + y * size, size, size);
                }
            });
        });
    }

}
