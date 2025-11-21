import { Model } from './Model.js';
import { View2D } from './View2D.js';
import { Controller } from './Controller.js';

const init = () => {
    // 1. HTMLの要素を取得（あなたのHTMLのIDに合わせています）
    const startBtn = document.getElementById('start-btn'); // ボタン
    const titleScreen = document.getElementById('title-screen'); // タイトル画面
    const gameScreen = document.getElementById('game-screen'); // ゲーム画面

    // 2. ボタンがクリックされたら...
    startBtn.addEventListener('click', () => {
        
        // --- 画面切り替え ---
        // タイトル画面を隠す
        titleScreen.classList.add('d-none');
        // タイトル画面から d-flex も消さないとレイアウトが崩れることがあるので消す
        titleScreen.classList.remove('d-flex');

        // ゲーム画面を表示する
        gameScreen.classList.remove('d-none');
        // ゲーム画面をフレックスボックスにして中央揃えを有効にする
        gameScreen.classList.add('d-flex');


        // --- ゲーム起動 ---
        const model = new Model();
        const view = new View2D(model); // ここで <canvas id="c"> を探しに行きます
        
        model.addObserver(view);
        new Controller(model);
        model.startGame();
    });
}

window.addEventListener('load', init);