import { EVENTS, GAME_STATES } from "./events.js";

export class View2D {

    constructor(model) {
        this.COLS = 10;
        this.ROWS = 20;
        this.BLOCK_SIZE = 30;
        this.model = model;

        // HTML要素の取得
        this.canvas = document.getElementById('c');
        this.ctx = this.canvas.getContext('2d');
        this.bgm = document.getElementById('bgm');

        // キャンバスサイズ設定
        this.canvas.width = this.COLS * this.BLOCK_SIZE;
        this.canvas.height = this.ROWS * this.BLOCK_SIZE;

        //htmlのホールドとネクストミノ
        this.holdCanvas = document.getElementById("holdCanvas");
        this.holdCtx = this.holdCanvas.getContext("2d");

        this.nextCanvas = document.getElementById("nextCanvas");
        this.nextCtx = this.nextCanvas.getContext("2d");

        this.titleScreen = document.getElementById('title-screen');
        this.gameScreen = document.getElementById('game-screen');

        this.score = document.getElementById('score');

        // Bootstrapモーダルの初期化
        // （index2d.htmlで読み込んでいるBootstrapの機能を使います）
        this.pauseModal = new bootstrap.Modal(document.getElementById('pauseModal'));
        this.gameOverModal = new bootstrap.Modal(document.getElementById('gameOverModal'));
        
        // イベントハンドラーの登録
        this.handlers = {
            [EVENTS.UPDATE_BOARD]: (data) => this.draw(data),
            [EVENTS.SCORE_CHANGED]:(data) => this.scoreChanged(data),
            
            //drawMini関数にてホールドとネクストのミニミノを描画
            [EVENTS.NEXT_PIECE]:   (data) => this.drawMini(this.nextCtx, data),
            [EVENTS.HOLD_PIECE]:   (data) => this.drawMini(this.holdCtx, data),

            //描画する画面を判断するためのStateをModelから取得
            [EVENTS.STATE_CHANGED]: ({ state, options }) => this.renderState(state, options)
        };
    }

    // Modelからの通知受け取り窓口
    update(event, data){
        if (this.handlers[event]) {
            this.handlers[event](data);
        }
    }

    // 描画メソッド
    draw(board){
        // 全消去
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // ブロック描画
        board.forEach((row, y) => {
            row.forEach((color, x) => {
                if (color) {
                    this.drawBlock(x, y, color);
                }
            });
        });
    }

    // 1ブロック描画
    drawBlock(x, y, color) {
        const px = x * this.BLOCK_SIZE;
        const py = y * this.BLOCK_SIZE;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(px, py, this.BLOCK_SIZE, this.BLOCK_SIZE);

        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(px, py, this.BLOCK_SIZE, this.BLOCK_SIZE);
    }

    //ミニ枠にホールドとネクストピースの描画
    drawMini(ctx, piece) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (!piece) return;

        const size = 20; 
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

    scoreChanged(score){
        this.score.innerText = score;
    }

    renderState(state, options = {}) {
        this.resetScreens();

        switch (state) {
            case GAME_STATES.TITLE:
                this.titleScreen.classList.remove('d-none');
                this.titleScreen.classList.add('d-flex');
                this.bgm.pause();
                this.bgm.currentTime = 0;
                break;

            case GAME_STATES.PLAYING:
                this.gameScreen.classList.remove('d-none');
                this.gameScreen.classList.add('d-flex');
                if (options.resetMusic) {
                    this.bgm.currentTime = 0; 
                    this.bgm.play();
                } else {
                    this.bgm.play();
                }
                break;

            case GAME_STATES.PAUSED:
                this.gameScreen.classList.remove('d-none');
                this.gameScreen.classList.add('d-flex');
                this.pauseModal.show();
                this.bgm.pause();
                break;

            case GAME_STATES.GAME_OVER:
                this.gameScreen.classList.remove('d-none');
                this.gameScreen.classList.add('d-flex');
                this.gameOverModal.show();
                this.bgm.pause();
                break;
        }
    }

    resetScreens() {
        this.titleScreen.classList.add('d-none');
        this.titleScreen.classList.remove('d-flex');
        this.gameScreen.classList.add('d-none');
        this.gameScreen.classList.remove('d-flex');

        this.pauseModal.hide();
        this.gameOverModal.hide();
    }
}
