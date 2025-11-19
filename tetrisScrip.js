// --- 1. ブロックの形を定義 ---
const blockTypes = [
    // 1. Iミノ（水色）
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    // 2. Lミノ（オレンジ）
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    // 3. Jミノ（青）
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    // 4. Tミノ（紫）
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    // 5. Oミノ（黄色）
    [
        [1, 1],
        [1, 1]
    ],
    // 6. Zミノ（赤）
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    // 7. Sミノ（緑）
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ]
];

// --- 2. ブロックの色を定義 ---
const blockColor = [
    "#6CF", // Iミノ (水色)
    "#F92", // Lミノ (オレンジ)
    "#66F", // Jミノ (青)
    "#C5C", // Tミノ (紫)
    "#FD2", // Oミノ (黄色)
    "#F44", // Zミノ (赤)
    "#5B5"  // Sミノ (緑)
];

// --- 3. 盤面（マス目）の生成 ---
const gameBoard = document.getElementById('game-board');
const board_width = 10;
const board_height = 20; 

// 200個のマス目を作る
for (let i = 0; i < board_width * board_height; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    gameBoard.appendChild(cell);
}

// --- 4. 描画の準備 ---
// 全部のセルを取得してリストにする
const cells = document.querySelectorAll('.cell');

// 今のブロックの状態
let currentTetro = blockTypes[0]; // Iミノ
let currentColor = blockColor[0]; // 色のリストから0番目（水色）を取る
let currentX = 3;                 // 横の位置
let currentY = 0;                 // 縦の位置

// --- 5. ブロックを描画する関数 ---
function draw() {
    // ブロックの形をループで調べる
    for (let y = 0; y < currentTetro.length; y++) {
        for (let x = 0; x < currentTetro[y].length; x++) {
            
            // もし「1（ブロックがある）」なら
            if (currentTetro[y][x] === 1) {
                
                // 盤面の座標 (X, Y) を計算
                let targetX = currentX + x;
                let targetY = currentY + y;
                
                // 座標を通し番号 (0~199) に変換
                let index = targetX + (targetY * board_width);
                
                // 色を塗る
                cells[index].style.backgroundColor = currentColor;
            }
        }
    }
}


draw();
// --- 6. ブロックを消す関数 (drawの逆) ---
function undraw() {
    for (let y = 0; y < currentTetro.length; y++) {
        for (let x = 0; x < currentTetro[y].length; x++) {
            if (currentTetro[y][x] === 1) {
                let targetX = currentX + x;
                let targetY = currentY + y;
                let index = targetX + (targetY * board_width);
                
                // 色を空っぽにする（CSSの色に戻す）
                cells[index].style.backgroundColor = '';
            }
        }
    }
}

// --- 7. 自動落下のための関数 (修正版) ---
function moveDown() {
    undraw(); // 1. いったん今の場所を消す

    // 2. 「下に1歩動ける？」と聞く
    if (canMove(0, 1)) {
        currentY++; // 動けるなら座標を更新
    } else {
        // 動けない＝床か他のブロックにぶつかった！
        // ここで「固定する処理」をあとで書きます
        // 今はとりあえず動かずにその場で再描画
        draw();
        resetTetro();

    }

    draw(); // 3. 新しい場所（または動かなかった場所）に描く
}

// --- 8. タイマーセット (1000ミリ秒 = 1秒ごとに moveDown を実行) ---
setInterval(moveDown, 1000);

// --- 9. 移動できるかチェックする関数 ---
// moveX: 横に動く量, moveY: 縦に動く量, newTetro: ブロックの形(回転用)
function canMove(moveX, moveY, newTetro = currentTetro) {
    for (let y = 0; y < newTetro.length; y++) {
        for (let x = 0; x < newTetro[y].length; x++) {
            if (newTetro[y][x] === 1) {
                // 1. 次の移動先の座標を計算
                let targetX = currentX + x + moveX;
                let targetY = currentY + y + moveY;

                // 2. 壁・床のチェック
                // (左端より左 OR 右端より右 OR 底より下 ならダメ)
                if (targetX < 0 || targetX >= board_width || targetY >= board_height) {
                    return false; // 「動けません！」と報告
                }

                // 3. 他のブロックとの衝突チェック
                // (もし盤面の中にいて、かつ色が塗られていたらダメ)
                // ※ undraw()した後に呼ぶので、色が残っている＝他のブロック
                let index = targetX + (targetY * board_width);
                if (cells[index] && cells[index].style.backgroundColor !== '') {
                    return false; // 「誰かいるので動けません！」
                }
            }
        }
    }
    return true; // 全チェックOKなら「動けます！」
}

// --- 11. 新しいブロックを生成し、状態をリセットする関数 ---
function resetTetro() {
    // 1. ランダムにブロックを選ぶ (0から6の数字をランダムに生成)
    const randomIndex = Math.floor(Math.random() * blockTypes.length);
    
    // 2. 新しいブロックと色を設定
    currentTetro = blockTypes[randomIndex];
    currentColor = blockColor[randomIndex];
    
    // 3. 位置を初期位置に戻す
    currentX = 3;
    currentY = 0;
}