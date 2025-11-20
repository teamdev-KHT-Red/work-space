import { Model } from './Model.js';
import { View } from './View.js';
import { Controller } from './Controller.js';

const init = () => {
    const model = new Model();
    //ここはViewにmodelを渡すのでは
    const view = new View(model);
    model.addObserver(view);
    new Controller(model);
    model.startGame();
}

window.addEventListener('load', init); 