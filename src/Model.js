import { EVENTS } from "./events.js"

export class Model {

    constructor() {
        this.COLS = 10;
        this.ROWS = 20;
        this.score = 0;//点数計算用の変数を設定。
        this.board = Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(0));
        this.currentPiece = null;
        this.holdPiece = null; //ホールドピース
        this.canHold = true; //ホールド可能か判定
        this.dropStart = Date.now();
        this.dropInterval = 1000;
        this.animationId = null;
        this.gameOver = false;
        this.isPaused = false;
        this.isGameRunning = false;

        this.SHAPES = [
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [1, 1],
                [1, 1]
            ],
            [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ]
        ];
        this.COLORS = [
            'cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'
        ];
        this.observers = [];
    }

    // Viewをオブザーバーとして追加
    addObserver(observer){
        this.observers.push(observer);
    }

    // Viewへのデータ送信
    notify(event, data){
        this.observers.forEach(observer => observer.update(event, data));
    }

    startGame(){
        this.currentPiece = this.createPiece();
        this.nextPiece = this.createPiece();
        this.notify(EVENTS.NEXT_PIECE, this.nextPiece);
        this.gameOver = false;
        this.isPaused = false;
        this.score = 0;
        this.isGameRunning = true;
        
        if(!this.animationId){
            this.gameLoop();
        }
    }

    // 再帰でループをし続ける
    gameLoop(){
        if (this.gameOver || this.isPaused) return;

        const now = Date.now();
        const delta = now - this.dropStart;
        
        if (delta > this.dropInterval) {
            this.moveDown();
            this.dropStart = now;
        }

        this.notify(EVENTS.UPDATE_BOARD, this.getDisplayBoard());

        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }

    createPiece(){
        const shapeIndex = Math.floor(Math.random() * this.SHAPES.length);
        const shape = this.SHAPES[shapeIndex];
        const color = this.COLORS[shapeIndex];
        
        return {
            typeId: shapeIndex,
            shape,
            color,
            x: Math.floor(this.COLS / 2) - Math.floor(shape[0].length / 2),
            y: 0
        };
    }

    spawnNextPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createPiece();
        this.notify(EVENTS.NEXT_PIECE, this.nextPiece);
    }

    // ミノの位置を取得して、ボードと結合したものを返す。
    getDisplayBoard(){
        const displayBoard = this.board.map(row => [...row]);

        if (this.currentPiece) {
            const ghostY = this.getGhostY();

            this.currentPiece.shape.forEach((row, y) => {
                    row.forEach((value, x) => {
                        if (value) {
                            const boardY = ghostY + y;
                            const boardX = this.currentPiece.x + x;
                            if (boardY >= 0) {
                                if (displayBoard[boardY][boardX] === 0) {
                                    displayBoard[boardY][boardX] = 'grey'; 
                                }
                            }
                        }
                    });
                });
        
            this.currentPiece.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) {
                        const boardY = this.currentPiece.y + y;
                        const boardX = this.currentPiece.x + x;
                        if (boardY >= 0) {
                            displayBoard[boardY][boardX] = this.currentPiece.color;
                        }
                    }
                });
            });
        }

        return displayBoard;
    }

    // 下端 or ミノに当たったら、ボードと現在操作中のミノをマージして、ボードを更新する。
    mergePiece(){
        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    const boardY = this.currentPiece.y + y;
                    const boardX = this.currentPiece.x + x;
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            });
        });
    }

    // currentPieceの当たり判定
    // someはtrueが出るまで判定し続けるメソッド
    checkCollision() {
        return this.currentPiece.shape.some((row, y) => {
            return row.some((value, x) => {
                if (!value) return false;
                const newX = this.currentPiece.x + x;
                const newY = this.currentPiece.y + y;
                return (newX < 0 || newX >= this.COLS || newY >= this.ROWS || (newY >= 0 && this.board[newY][newX]));
            });
        });
    }

    // 揃ったラインを削除
    clearLines() {
        //同一で消えたラインの計算。
        let lines = 0;

        for (let y = this.ROWS - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.COLS).fill(0));
                lines++//消去ラインのカウント
                y++;                
            }
        }
        //点数加点表。同時に消えたライン数に応じて変化。
        if(lines > 0) {
            switch(lines) {
                case 1:
                    this.score += 100;
                    break;
                case 2:   
                    this.score += 300;
                    break;
                case 3:
                    this.score += 500;
                    break;
                case 4:
                    this.score += 800;
                    break;
                default: this.score += 800 + (lines - 4) * 200; 
                    break;               
            }
            this.notify(EVENTS.SCORE_CHANGED, this.score);
        }
    }

    getGhostY() {
        const originalY = this.currentPiece.y;
        while (!this.checkCollision()) {
            this.currentPiece.y++;
        }
        this.currentPiece.y--;
        const ghostY = this.currentPiece.y;
        this.currentPiece.y = originalY;
        return ghostY;
    }

    // テトリミノの移動メソッド
    moveDown() {
        this.currentPiece.y++;
        
        if (this.checkCollision()) {
            this.currentPiece.y--;
            this.mergePiece();
            this.clearLines();
            this.spawnNextPiece();
            this.canHold = true;//ホールドフラグをリセット

            //テトリミノがボードの頂点に到達した場合ゲームオーバーの実行
            if(this.currentPiece.y == 0 && this.checkCollision()) {
                this.gameOver = true;
                this.notify(EVENTS.GAME_OVER, this.gameOver);
                this.isGameRunning = false;
                return;
            }
        }
    }

    moveLeft() {
        this.currentPiece.x--;
        if (this.checkCollision()) {
            this.currentPiece.x++;
        }
    }

    moveRight() {
        this.currentPiece.x++;
        if (this.checkCollision()) {
            this.currentPiece.x--;
        }
    }

    rotate() {
        const originalShape = this.currentPiece.shape;
        const rows = originalShape.length;
        const cols = originalShape[0].length;
        const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));
        
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                rotated[x][rows - 1 - y] = originalShape[y][x];
            }
        }
        
        this.currentPiece.shape = rotated;
        
        if (this.checkCollision()) {
            this.currentPiece.x--;
            if (this.checkCollision()) {
                this.currentPiece.x += 2;
                if (this.checkCollision()) {
                    this.currentPiece.x--;
                    this.currentPiece.shape = originalShape;
                }
            }
        }
    }

    hardDrop(){
        while (!this.checkCollision()) {
            this.currentPiece.y++;
        }
        this.currentPiece.y--;
        this.mergePiece();
        this.clearLines();
        this.spawnNextPiece();
        this.canHold = true; //ホールドフラグをリセット
    }
    // テトリミノの移動メソッド ここまで   

    //ホールド処理
    holdCurrentPiece(){
        if(!this.canHold) return;
        this.currentPiece.shape = this.SHAPES[this.currentPiece.typeId];

        if(!this.holdPiece) {
            this.holdPiece = this.currentPiece;
            this.spawnNextPiece();
        } else {
            const temp = this.currentPiece;
            this.currentPiece = this.holdPiece;
            this.holdPiece = temp;
            //入れ替えたピースの座標をリセット
            this.currentPiece.x = Math.floor(this.COLS / 2) - Math.floor(this.currentPiece.shape[0].length / 2);
            this.currentPiece.y = 0;
        }

        this.canHold = false;
        this.notify(EVENTS.HOLD_PIECE, this.holdPiece);
    }

    togglePause(){
        this.isPaused = !this.isPaused;
        if(!this.isPaused){
            this.dropStart = Date.now();
            this.gameLoop();
        }
        this.notify(EVENTS.IS_PAUSED, this.isPaused);
    }
}
