import { Model } from './Model.js';
import { View2D } from './View2D.js';
import { Controller } from './Controller.js';

const init = () => {
    // HTMLの要素を取得
    const startBtn = document.getElementById('start-btn');
    const titleScreen = document.getElementById('title-screen');
    const gameScreen = document.getElementById('game-screen');

    // スタートボタンが押されたら実行
    startBtn.addEventListener('click', () => {
        
        // 1. 画面を切り替える
        titleScreen.classList.add('d-none');      // タイトルを隠す
        titleScreen.classList.remove('d-flex');   // レイアウト崩れ防止
        
        gameScreen.classList.remove('d-none');    // ゲーム画面を表示
        gameScreen.classList.add('d-flex');       // 中央揃えにする

        // 2. ゲームを起動する
        const model = new Model();
        const view = new View2D(model);
        
        model.addObserver(view);
        new Controller(model);
        
        model.startGame();
    });
}

window.addEventListener('load', init);indow.addEventListener('load', init);indow.addEventListener('load', init);