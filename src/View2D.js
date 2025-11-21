export class View2D {

    constructor(model) {
        this.COLS = 10;
        this.ROWS = 20;
        this.BLOCK_SIZE = 30;
        this.model = model;
        

    }

        // Modelからデータを受信
    update(data){
        this.draw(data);
    }

    draw(board){
        
    }

    
    }
    
