const gameBoard = document.getElementById('game-board');
const board_width = 10;
const board_height = 20;
for (let i =0; i< board_width*board_height; i++){
    const cell = document.createElement('div');
    cell.classList.add('cell');
    gameBoard.appendChild(cell);
}

