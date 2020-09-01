import Keyboard from '../modules/KeyboardState.js';
import InputRounter from '../modules/InputRounter.js';

export function setupKeyboard(window) {
    const input = new Keyboard();
    const router = new InputRounter();

    input.listenTo(window);

    input.addMapping('KeyP', keyState => {
        if (keyState) {
            router.route(entity => entity.jump.start());
        } else {
            router.route(entity => entity.jump.cancel());
        }
    });

    input.addMapping('KeyO', keyState => {
        router.route(entity => entity.turbo(keyState));
    });

    input.addMapping('KeyD', keyState => {
        router.route(entity => entity.go.dir += keyState ? 1 : -1);
    });

    input.addMapping('KeyA', keyState => {
        router.route(entity => entity.go.dir += keyState ? -1 : 1);
    });

    return router;
}
