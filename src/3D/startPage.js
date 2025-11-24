import { Model } from '../Model.js';
import { View } from './View.js';
import { Controller } from '../Controller.js';

const init = () => {
    const model = new Model();
    const view = new View();
    model.addObserver(view);
    new Controller(model);
    model.startGame();
}

window.addEventListener('load', init); 