import {loadMario} from './entities/Mario.js';
import {loadGoomba} from './entities/Goomba.js';
import {loadKoopa} from './entities/Koopa.js';

export function loadEntities() {
    const entitiesFactory = {};
    
    return Promise.all([
        loadMario().then(factory => entitiesFactory['mario'] = factory),
        loadGoomba().then(factory => entitiesFactory['goomba'] = factory),
        loadKoopa().then(factory => entitiesFactory['koopa'] = factory),
    ])
    .then(() => entitiesFactory);
}