import animation from "./animation.js";

class fade_animation extends animation {

    constructor(context) {
        super(30);
        this.context = context;
    }

    step() {
        super.step();
        if (this.is_started) {
            this.context.hud.fade_screen.style.opacity = this.animation_time / (this.animation_duration - 1);
        }
    }

    reverse_step() {
        super.reverse_step();
        if (this.is_started) {
            this.context.hud.fade_screen.style.opacity = this.animation_time / (this.animation_duration - 1);
        }
    }
}

export default fade_animation;