export class View2D {

    constructor(model) {
        this.COLS = 10;
        this.ROWS = 20;
        this.BLOCK_SIZE = 30;
        this.model = model;

        
        this.canvas = document.getElementById('c');
        this.ctx = this.canvas.getContext('2d');

        // キャンバスのサイズを計算して設定 (300px x 600px)
        this.canvas.width = this.COLS * this.BLOCK_SIZE;
        this.canvas.height = this.ROWS * this.BLOCK_SIZE;
    }

    update(data){
        this.draw(data);
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
}
