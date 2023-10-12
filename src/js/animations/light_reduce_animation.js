import { degToRad } from 'three/src/math/mathutils';

import animation from "./animation.js";

class light_reduce_animation extends animation {

    constructor(context) {
        super(60*10);
        this.context = context;
    }

    step() {
        super.step();
        if (this.is_started) {
            this.context.player_spot_light.angle = degToRad(90 - ((90 - 20) / 600) * this.animation_time);
        }
    }
}

export default light_reduce_animation;