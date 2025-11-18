const blockTypes= [
    // 1. Iミノ（水色）: 細長い棒
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    // 2. Lミノ（オレンジ）: L字
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    // 3. Jミノ（青）: 逆L字
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    // 4. Tミノ（紫）: T字
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    // 5. Oミノ（黄色）: 四角
    [
        [1, 1],
        [1, 1]
    ],
    // 6. Zミノ（赤）: Z字
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    // 7. Sミノ（緑）: 逆Z字
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ]
];

const blockColor = [
    "#6CF", // Iミノ (水色)
    "#F92", // Lミノ (オレンジ)
    "#66F", // Jミノ (青)
    "#C5C", // Tミノ (紫)
    "#FD2", // Oミノ (黄色)
    "#F44", // Zミノ (赤)
    "#5B5"  // Sミノ (緑)
];

const gameBoard = document.getElementById('game-board');
const board_width = 10;
const board_height = 20;
for (let i =0; i< board_width*board_height; i++){
    const cell = document.createElement('div');
    cell.classList.add('cell');
    gameBoard.appendChild(cell);
}

