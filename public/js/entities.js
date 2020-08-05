import Entity from './modules/Entity.js';
import Go from './modules/traits/Go.js';
import Jump from './modules/traits/Jump.js';
import { loadSpriteSheet } from './loaders.js';

export function createMario() {
    return loadSpriteSheet('mario')
    .then(sprite => {
        const mario = new Entity();
        mario.size.set(14, 16);

        mario.addTrait(new Go());
        mario.addTrait(new Jump());

        const frames = ['run-1', 'run-2', 'run-3'];

        function routeFrame(mario) {
            if(mario.go.dir !== 0){
                return 'run-1';
            }
            return 'idle';
        }

        mario.draw = function drawMario(context) {
            sprite.draw(routeFrame(this), context, 0, 0);
        }

        return mario;
    });
}