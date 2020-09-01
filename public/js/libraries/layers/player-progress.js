import {findPlayers} from "../player.js";

function getPlayer(level) {
    for (const entity of findPlayers(level)) {
        return entity;
    }
}

export function createPlayerProgressLayer(font, level) {
    const size = font.size;
    
    const spriteBuffer = document.createElement('canvas');
    spriteBuffer.width = 32;
    spriteBuffer.height = 32;
    const spriteBufferContext = spriteBuffer.getContext('2d');

    return function drawPlayerProgress(context) {
        const player = getPlayer(level);
        font.print('WORLD' + level.name, context, size * 12, size * 12);

        player.draw(spriteBufferContext);
        context.drawImage(spriteBuffer, size * 12, size * 15);
    };
}
