export class Controller {

    constructor(model) {
        this.model = model;
        this.initializeEventListener();
    }

    initializeEventListener() {
        document.addEventListener('keydown', this.handleKeyPress);
    }

    handleKeyPress = (event) => {
        switch (event.keyCode) {
            case 37:
                this.model.moveLeft();
                break;
            case 39:
                this.model.moveRight();
                break;
            case 40:
                this.model.moveDown();
                break;
            case 38:
                this.model.rotate();
                break;
            // case 32:
            //     this.model.hardDrop();
            //     break;
            // case 80:
            //     this.model.togglePause();
            //     break;
        }
    }

}
