import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class View2D {

    constructor(model) {
        this.COLS = 10;
        this.ROWS = 20;
        this.BLOCK_SIZE = 30;
        this.model = model;
        // this.canvas = document.getElementById('game-canvas');
        // this.ctx = this.canvas.getContext('2d');
        // this.initCanvas();

        
    }

    

    // キャンバスの初期化 2d
    // initCanvas(){
    //     if (this.ctx) {
    //         this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    //         this.ctx.lineWidth = 1;
    //     } else {
    //         console.error('コンテキストの取得に失敗しました。');
    //     }
    // }

        // Modelからデータを受信
    update(data){
        this.draw(data);
    }

    draw(board){
        //2d
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // this.drawGrid();

        // board.forEach((row, y) => {
        //     row.forEach((value, x) => {
        //         if (value) {
        //             this.drawBlock(x, y, value);
        //         }
        //     });
        // });
        //2d
        
        //ここから3D
        //cubesを全部消してcubeをpushする。
        
    }

    renderLoop() {
        this.controls.update(); 
        this.renderer.render( this.scene, this.camera );
        requestAnimationFrame(this.renderLoop.bind(this));
    }

    
    }
    
    // drawBlock(x, y, color, context = this.ctx) {
    //     context.fillStyle = color;
    //     context.fillRect(x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE);
    //     context.strokeStyle = '#000';
    //     context.strokeRect(x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE);
    // }

    //2d
    // drawGrid(){
    //     for (let x = 0; x <= 10; x++) {
    //         this.ctx.beginPath();
    //         this.ctx.moveTo(x * 30, 0);
    //         this.ctx.lineTo(x * 30, 20 * 30);
    //         this.ctx.stroke();
    //     }

    //     for (let y = 0; y <= 20; y++) {
    //         this.ctx.beginPath();                                                                                           
    //         this.ctx.moveTo(0, y * 30);
    //         this.ctx.lineTo(10 * 30, y * 30);
    //         this.ctx.stroke();
    //     }
    // }
}