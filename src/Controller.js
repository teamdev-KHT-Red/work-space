import { EVENTS, GAME_STATES } from "./events.js"

export class Controller {

    constructor(model) {
        this.model = model;
        this.initializeEventListener();
    }

    initializeEventListener() {
        document.addEventListener('keydown', this.handleKeyPress);

        //スタート
        const startBtn = document.getElementById('start-btn');
        if(startBtn){
            startBtn.addEventListener('click', () => this.model.startGame());
        }

        //ゲームに戻る
        const resumeBtn = document.getElementById('resume-btn');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => this.model.resumeGame());
        }

        //タイトルに戻る
        const titleBtn = document.getElementById('title-btn');
        if(titleBtn) {
            titleBtn.addEventListener('click', () => this.model.quitToTitle());
        }

        //リセット
        const resetBtn = document.getElementById('reset-btn');
        if(resetBtn) {
            resetBtn.addEventListener('click', () => this.model.startGame());
        }

        //設定
        const settingBtn = document.getElementById('setting-btn');
        if(settingBtn) {
            settingBtn.addEventListener('click', () => this.model.pauseGame());
        }

        //メニューを閉じる
        const menuCloseBtn = document.getElementById('menu-close-btn');
        if(menuCloseBtn) {
            menuCloseBtn.addEventListener('click', () => this.model.resumeGame());
        }

        //リトライ
        const retryBtn = document.getElementById('retry-btn');
        if(retryBtn) {
            retryBtn.addEventListener('click', () => this.model.startGame());
        }

        //ゲームオーバーからタイトルに戻る
        const titleGameOverBtn = document.getElementById('title-gameover-btn');
        if(titleGameOverBtn) {
            titleGameOverBtn.addEventListener('click', () => this.model.quitToTitle());
        }
    }

    handleKeyPress = (event) => {
        if (this.model.state !== GAME_STATES.PLAYING) {
            if (this.model.state === GAME_STATES.PAUSED && event.code === 'Enter') {
                this.model.resumeGame();
            }
            return;
        }

        const { code } = event;
        if (code === 'Enter') {
            this.model.pauseGame();
            return;
        }

        switch (code) {
            case 'ArrowLeft':  this.model.moveLeft();       break;
            case 'ArrowRight': this.model.moveRight();      break;
            case 'ArrowDown':  this.model.moveDown();       break;
            case 'ArrowUp':    this.model.rotate();         break;
            case 'Space':      this.model.hardDrop();       break;
            case 'ShiftLeft':
            case 'ShiftRight': this.model.holdCurrentPiece(); break;
        }
    }

}
