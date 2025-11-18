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

// --- 7. 自動落下のための関数 ---
function moveDown() {
    undraw();      // 1. まず古い場所を消す
    currentY++;    // 2. 座標を下にずらす
    draw();        // 3. 新しい場所に描く
}

// --- 8. タイマーセット (1000ミリ秒 = 1秒ごとに moveDown を実行) ---
setInterval(moveDown, 1000);