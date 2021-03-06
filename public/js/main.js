import Level from "./modules/Level.js";
import Timer from "./modules/Timer.js";
import { createLevelLoader } from "./libraries/loaders/level.js";
import { loadFont } from "./libraries/loaders/font.js";
import { loadEntities } from "./libraries/entities.js";
import { createPlayer, createPlayerEnv } from "./libraries/player.js";
import { setupKeyboard } from "./libraries/input.js";
import { createColorLayer } from "./libraries/layers/color.js";
import { createCollisionLayer } from "./libraries/layers/collision.js";
import { createDashboardLayer } from "./libraries/layers/dashboard.js";
import SceneRunner from "./modules/SceneRunner.js";
import { createPlayerProgressLayer } from "./libraries/layers/player-progress.js";
import TimeScene from "./modules/TimeScene.js";
import Scene from "./modules/Scene.js";
import {createTextLayer} from './libraries/layers/text.js'

async function main(canvas) {
  const videoContext = canvas.getContext("2d");
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([
    loadEntities(audioContext),
    loadFont(),
  ]);

  const loadLevel = await createLevelLoader(entityFactory);

  const sceneRunner = new SceneRunner();

  const mario = createPlayer(entityFactory.mario());
  window.mario = mario;
  mario.player.name = "MARIO";
  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(mario);

  async function runLevel(name) {
    const loadScreen = new Scene();
    loadScreen.comp.layers.push(createColorLayer("#000"));
    loadScreen.comp.layers.push(createTextLayer(font, `Loading ${name}...`));
    sceneRunner.addScene(loadScreen);
    sceneRunner.runNext();

    const level = await loadLevel(name);

    level.events.listen(Level.EVENT_TRIGGER, (spec, trigger, touches) => {
      if (spec.type === "goto") {
        for (const entity of touches) {
          if (entity.player) {
            runLevel(spec.name);
            return;
          }
        }
      }
    });

    const playerProgressLayer = createPlayerProgressLayer(font, level);
    const dashboardLayer = createDashboardLayer(font, level);

    mario.pos.set(0, 0);
    level.entities.add(mario);

    const playerEnv = createPlayerEnv(mario);
    level.entities.add(playerEnv);

    level.comp.layers.push(createCollisionLayer(level));
    level.comp.layers.push(dashboardLayer);
    sceneRunner.addScene(level);

    sceneRunner.runNext();
  }

  const gameContext = {
    audioContext,
    videoContext,
    entityFactory,
    deltaTime: null,
  };

  const timer = new Timer(1 / 60);
  timer.update = function update(deltaTime) {
    gameContext.deltaTime = deltaTime;
    sceneRunner.update(gameContext);
  };

  timer.start();

  runLevel("debug-progression");
}

const canvas = document.getElementById("screen");

const start = () => {
  window.removeEventListener("click", start);
  main(canvas);
};

window.addEventListener("click", start);
