

class animation {
    animation_time = 0;

    animation_duration = 0;

    context = null;

    is_started = false;
    is_stoped = false;
    is_finished = false;

    constructor(duration) {
        this.animation_duration = duration;
        this.context = context;
    }

    start() {
        if (this.is_finished) {
            throw("A finished animation must me reset before restart");
        }
        this.is_started = true;
    }

    pause() {
        if (this.is_started) {
            this.is_stoped = true;
        }
    }

    step() {
        if (this.is_started) {
            this.animation_time++;
            if (this.animation_time === this.duration) {
                this.is_started = false;
                this.is_finished = true;
            }
        }
    }

    reset() {
        this.animation_time = 0;
    }

    set_duration(duration) {
        if (this.is_started) {
            throw("animation duration can not be set in animation.");
        }
        this.duration = duration;
    }

}