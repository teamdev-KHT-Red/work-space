import { Model } from './Model.js';
import { View2D } from './View2D.js';
import { Controller } from './Controller.js';

const init = () => {
    const model = new Model();
    const view = new View2D();
    model.addObserver(view);
    new Controller(model, view);
}

window.addEventListener('load', init);indow.addEventListener('load', init);indow.addEventListener('load', init);