import { EVENTS } from "./events.js";

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

        // ★Bootstrapモーダルの初期化
        // （index2d.htmlで読み込んでいるBootstrapの機能を使います）
        this.pauseModal = new bootstrap.Modal(document.getElementById('pauseModal'));

        // イベントハンドラーの登録
        this.handlers = {
            [EVENTS.UPDATE_BOARD]: (data) => this.draw(data),
            [EVENTS.GAME_OVER]:    () => this.gameOver(),
            [EVENTS.SCORE_CHANGED]:(data) => console.log("Score:", data), // ここでHTMLの#scoreを書き換えてもOK
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

    // ゲームオーバー処理
    gameOver(){
        this.bgm.pause();
        this.bgm.currentTime = 0;
        alert("GAME OVER"); // 仮のアラート
    }

    // ポーズ状態の切り替え（モーダル表示・BGM制御）
    isPaused(isPaused){
        if(isPaused){
            this.bgm.pause();
            this.pauseModal.show(); // モーダルを開く
        } else {
            this.bgm.play();
            this.pauseModal.hide(); // モーダルを閉じる
        }
    }

    // --- 画面切り替え用メソッド ---

    // スタート画面を隠す
    hideStartScreen(){
        const titleScreen = document.getElementById('title-screen');
        if(titleScreen){
            titleScreen.classList.add('d-none');
            titleScreen.classList.remove('d-flex');
        }        
    }

    // ゲーム画面を表示する
    showGameScreen(){
        const gameScreen = document.getElementById('game-screen');
        if(gameScreen){
            gameScreen.classList.remove('d-none');
            gameScreen.classList.add('d-flex');
        }
        // BGM開始
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
    // タイトル画面に戻る（モーダルから呼ばれる）
    showTitleScreen(){
        const titleScreen = document.getElementById('title-screen');
        const gameScreen = document.getElementById('game-screen');
        
        // モーダルを閉じる
        this.pauseModal.hide();

        // 画面を切り替える
        if(gameScreen) {
            gameScreen.classList.add('d-none');
            gameScreen.classList.remove('d-flex');
        }
        if(titleScreen){
            titleScreen.classList.remove('d-none');
            titleScreen.classList.add('d-flex');
        }
        
        // BGM停止
        this.bgm.pause();
        this.bgm.currentTime = 0;
    }
}
