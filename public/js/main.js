import Camera from './modules/Camera.js';
import Timer from './modules/Timer.js';
import {loadLevel} from './libraries/loaders/level.js';
import {setupKeyboard} from './libraries/input.js';
import {createCollisionLayer} from './libraries/layers.js';
import { loadEntities } from './libraries/entities.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
    loadLevel('1-1'),
    loadEntities(),
])
.then(([level, factory]) => {

    console.log(factory);
    const camera = new Camera();
    window.camera = camera;

    const mario = factory.mario();
    mario.pos.set(64, 64);
    
    const goomba = factory.goomba();
    goomba.pos.x = 220;
    level.entities.add(goomba);

    const koopa = factory.koopa();
    koopa.pos.x = 260;
    level.entities.add(goomba);

    level.entities.add(mario);

    level.comp.layers.push(createCollisionLayer(level));

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