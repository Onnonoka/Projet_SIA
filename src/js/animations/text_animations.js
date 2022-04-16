import animation from "./animation.js";

class fade_animation extends animation {

    constructor(context) {
        super(60 * 2);
        this.context = context;
        this.sounds.next = new Audio("src/medias/sounds/next_level.mp3");
    }

    step() {
        super.step();
        if (this.is_started) {
            this.context.hud.set_message("Next level");
            if (this.animation_time >= 90) {
                this.context.hud.message_container.style.opacity = 1 - (1 / 30) * (this.animation_time - 90);
            }
            if (this.animation_time === this.animation_duration - 1) {
                this.context.hud.set_message("");
                this.context.hud.message_container.style.opacity = 1;
            }
        }
    }

    start() {
        super.start();
        this.sounds.next.play();
    }
}

export default fade_animation;