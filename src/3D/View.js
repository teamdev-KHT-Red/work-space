import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EVENTS } from '../events.js';

export class View {

    constructor() {
        this.COLS = 10;
        this.ROWS = 20;
        this.BLOCK_SIZE = 30;

        this.cubes = [];
        this.geometry = new THREE.BoxGeometry( 1, 1, 1 );

        
        this.initCore();
        this.initLights();
        this.initEnvironment();
        this.initControls();

        this.renderLoop();
        this.handlers = {
            [EVENTS.UPDATE_BOARD]: (data) => this.draw(data),
            [EVENTS.GAME_OVER]:        () => this.gameOver(),
            [EVENTS.SCORE_CHANGED]:(data) => console.log(data),
            [EVENTS.IS_PAUSED]:    (data) => console.log(data)
        };
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
        
        this.light.shadow.camera.left = -50;
        this.light.shadow.camera.right = 50;
        this.light.shadow.camera.top = 50;
        this.light.shadow.camera.bottom = -50;
        this.light.shadow.mapSize.width = 2048;
        this.light.shadow.mapSize.height = 2048;
        
        this.scene.add(this.light);
    }
    
    initEnvironment() {
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
        
        const wallGeometry = new THREE.BoxGeometry(50, 20, 1);
        const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
        
        this.leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
        this.leftWall.castShadow = true;
        this.leftWall.position.set(-25.5, -9.5, 0);
        this.scene.add(this.leftWall);

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

    update(event, data){
        if (this.handlers[event]) {
            this.handlers[event](data);
        } else {
            console.warn(`[${event}]は登録されていません。`);
        }
    }

    draw(board){
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
        if(colorName == 'grey'){
            material.transparent = true;
            material.opacity = 0.8;
        }
        const cube = new THREE.Mesh( geometry, material );
        this.scene.add(cube);
        cube.position.x = x;
        cube.position.y = y;
        cube.castShadow = true;
        this.cubes.push(cube);
        return cube;
    }
}