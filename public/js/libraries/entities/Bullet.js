import Entity, {Sides, Trait} from '../../modules/Entity.js';
import Killable from '../../modules/traits/Killable.js';
import {loadSpriteSheet} from '../loaders.js';
import Velocity from '../../modules/traits/Velocity.js';
import Gravity from '../../modules/traits/Gravity.js';

export function loadBullet() {
    return loadSpriteSheet('bullet')
    .then(createBulletFactory);
}


class Behavior extends Trait {
    constructor() {
        super('behavior');
        this.gravity = new Gravity();
    }

    collides(us, them) {
        if (us.killable.dead) {
            return;
        }

        if (them.stomper) {
            if (them.vel.y > us.vel.y) {
                us.killable.kill();
                us.vel.set(100, -200);
            } else {
                them.killable.kill();
            }
        }
    }

    update(entity, gameContext, level) {
        if(entity.killable.dead) {
            this.gravity.update(entity, gameContext, level);
        }
    }
}


function createBulletFactory(sprite) {
    function drawBullet(context) {
        sprite.draw('bullet', context, 0, 0);
    }

    return function createBullet() {
        const bullet = new Entity();
        bullet.size.set(16, 14);
        bullet.vel.set(80, 0);

        bullet.addTrait(new Behavior());
        bullet.addTrait(new Killable());
        bullet.addTrait(new Velocity());

        bullet.draw = drawBullet;

        return bullet;
    };
}
