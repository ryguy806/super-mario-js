import Timer from './modules/Timer.js';
import {createLevelLoader} from './libraries/loaders/level.js';
import {loadFont} from './libraries/loaders/font.js';
import {loadEntities} from './libraries/entities.js';
import {createPlayer, createPlayerEnv} from './libraries/player.js';
import {setupKeyboard} from './libraries/input.js';
import {createCollisionLayer} from './libraries/layers/collision.js';
import {createDashboardLayer} from './libraries/layers/dashboard.js';
import {createPlayerProgressLayer} from './libraries/layers/player-progress.js';

async function main(canvas) {
    const videoContext = canvas.getContext('2d');
    const audioContext = new AudioContext();

    const [entityFactory, font] = await Promise.all([
        loadEntities(audioContext),
        loadFont(),
    ]);

    const loadLevel = await createLevelLoader(entityFactory);

    const level = await loadLevel('1-2');

    const playerProgressLayer = createPlayerProgressLayer(font, level);
    const dashboardLayer = createDashboardLayer(font, level);

    const mario = createPlayer(entityFactory.mario());
    mario.player.name = "MARIO";
    level.entities.add(mario);

    const playerEnv = createPlayerEnv(mario);
    level.entities.add(playerEnv);

    level.comp.layers.push(createCollisionLayer(level));
    level.comp.layers.push(dashboardLayer);
    level.comp.layers.push(playerProgressLayer);

    const inputRouter = setupKeyboard(window);
    inputRouter.addReceiver(mario);

    const gameContext = {
        audioContext,
        videoContext,
        entityFactory,
        deltaTime: null,
    };

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime) {
        gameContext.deltaTime = deltaTime;
        level.update(gameContext);
        level.draw(gameContext);
    }

    timer.start();
}

const canvas = document.getElementById('screen');

const start = () => {
    window.removeEventListener('click', start);
    main(canvas);
};

window.addEventListener('click', start);
