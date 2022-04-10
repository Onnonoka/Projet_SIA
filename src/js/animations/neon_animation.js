import animation from "./animation.js";

class neon_animation extends animation {

    constructor(context) {
        super(60*6);
        this.context = context;
    }

    step() {
        super.step();
        if (this.is_started) {
            this.context.material.emissiveIntensity = 1;
        }
    }
}

export default neon_animation;