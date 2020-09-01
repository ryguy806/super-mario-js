import {Trait} from '../Entity.js';
import Stomper from './Stomper.js';

const COIN_LIVES_THRESHOLD = 100;

export default class Player extends Trait {
    constructor() {
        super('player');
        this.name = "UNNAMED";
        this.coins = 0;
        this.lives = 3;
        this.score = 0;

        this.listen(Stomper.EVENT_STOMP, () => {
            this.score += 100;
            console.log('Score', this.score);
        });
    }

    addCoins(count){
        this.coins += count;
        this.queue(entity => entity.sounds.add('coin'));
        this.score += 100;
        while(this.coins >= COIN_LIVES_THRESHOLD){
            this.addLives(1);
            this.coins = COIN_LIVES_THRESHOLD;
        }
    }

    addLives(count) {
        this.lives += count;
    }
}
