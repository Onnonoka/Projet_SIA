
import animation from "./animation.js";

class dematerialize_animation extends animation {

    constructor(context) {
        super(60*10)
        this.context = context;
    }

    step() {
        super.step();
        if (this.is_started) {
            if (this.animation_time < this.animation_duration - 1) {
                if (this.animation_duration - this.animation_time < 60 * 2) {
                    if ((this.animation_duration - this.animation_time) % (60 / 3) === 0) {
                        if (this.context.mesh.material.transparent === true) {
                            this.context.mesh.material.opacity = 1;
                            this.context.mesh.material.transparent = false;
                        } else {
                            this.context.mesh.material.opacity = 0.4;
                            this.context.mesh.material.transparent = true;
                        }
                    }
                } else {
                    this.context.mesh.material.opacity = 0.4;
                    this.context.mesh.material.transparent = true;
                }
            } else if (this.animation_time >= this.animation_duration - 1 ) {
                this.context.mesh.material.opacity = 1;
                this.context.mesh.material.transparent = false;
            }
        }
    }
}

export default dematerialize_animation;