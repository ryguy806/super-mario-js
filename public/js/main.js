import Camera from './modules/Camera.js';
import Timer from './modules/Timer.js';
import {loadLevel} from './libraries/loaders/level.js';
import {createMario} from './libraries/entities.js';
import {setupKeyboard} from './libraries/input.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
    createMario(),
    loadLevel('1-1'),
])
.then(([mario, level]) => {
    const camera = new Camera();
    window.camera = camera;

    mario.pos.set(64, 64);

    level.entities.add(mario);

    const input = setupKeyboard(mario);
    input.listenTo(window);

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime) {
        level.update(deltaTime);

        if(mario.pos.x > 100) {
            camera.pos.x = mario.pos.x - 100;
        }

        level.comp.draw(context, camera);
    }

    timer.start();
});