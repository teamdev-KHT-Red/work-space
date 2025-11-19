import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class View {

    constructor(model) {
        this.COLS = 10;
        this.ROWS = 20;
        this.BLOCK_SIZE = 30;
        this.model = model;
        // this.canvas = document.getElementById('game-canvas');
        // this.ctx = this.canvas.getContext('2d');
        // this.initCanvas();

        this.cubes = [];
        this.geometry = new THREE.BoxGeometry( 1, 1, 1 );

        this.initCore();
        this.initLights();
        this.initEnvironment();
        this.initControls();

        this.renderLoop();
    }

    initCore() {
        this.canvas = document.querySelector('#c');
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.set(-15, 3, 30);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas});
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true;
    }

    initLights() {
        this.light = new THREE.DirectionalLight(0xFFFFFF, 2);
        this.light.position.set(-1, 2, 4);
        this.light.castShadow = true;
        
        // 影の調整
        this.light.shadow.camera.left = -50;
        this.light.shadow.camera.right = 50;
        this.light.shadow.camera.top = 50;
        this.light.shadow.camera.bottom = -50;
        this.light.shadow.mapSize.width = 2048;
        this.light.shadow.mapSize.height = 2048;
        
        this.scene.add(this.light);
    }
    
    initEnvironment() {
        // 地面
        const planeGeometry = new THREE.PlaneGeometry( 1000, 1000 );
        const planeMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x808080,
            side: THREE.DoubleSide
        });
        this.ground = new THREE.Mesh(planeGeometry, planeMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.position.set(4.5, -19.5, -0.5);
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
        
        // 壁（共通設定）
        const wallGeometry = new THREE.BoxGeometry(50, 20, 1);
        const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
        
        // 左の壁
        this.leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
        this.leftWall.castShadow = true;
        this.leftWall.position.set(-25.5, -9.5, 0);
        this.scene.add(this.leftWall);

        // 右の壁
        this.rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
        this.rightWall.castShadow = true;
        this.rightWall.position.set(34.5, -9.5, 0);
        this.scene.add(this.rightWall);
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.target.set(4.5, -9, 0);
        this.controls.update();
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
        this.cubes.forEach(cube => this.scene.remove(cube));
        this.cubes = [];
        board.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.makeInstance(this.geometry, value, x, -y);
                }
            });
        });
    }

    renderLoop() {
        this.controls.update(); 
        this.renderer.render( this.scene, this.camera );
        requestAnimationFrame(this.renderLoop.bind(this));
    }

    makeInstance(geometry, colorName, x, y){
        const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(colorName) });
        const cube = new THREE.Mesh( geometry, material );
        this.scene.add(cube);
        cube.position.x = x;
        cube.position.y = y;
        cube.castShadow = true;
        this.cubes.push(cube);
        return cube;
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