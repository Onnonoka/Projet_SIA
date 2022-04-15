

class animation {
    animation_time = 0;
    animation_duration = 0;
    breakpoint = -1

    reverse = false;

    is_started = false;
    is_stoped = false;
    is_finished = false;

    loop = false;

    sounds = {};

    constructor(duration) {
        this.animation_duration = duration;
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

    update() {
        if (this.is_started) {
            if (this.reverse) {
                this.reverse_step();
            } else {
                this.step();
            }
        }
    }

    step() {
        if (this.is_started && !this.is_stoped) {
            this.animation_time++;
            if (this.breakpoint === this.animation_time) {
                this.is_stoped = true;
            } else if (this.animation_time >= this.animation_duration) {
                this.is_started = false;
                this.is_finished = true;
            }
        }
        if (this.is_stoped) {
            if (this.breakpoint_callback) {
                this.breakpoint_callback();
            }
        }
        if (this.is_finished) {
            if (this.callback) {
                this.callback();
            }
        }
        if (this.is_finished || this.is_stoped) {
            if (this.loop) {
                this.reset();
                this.is_started = true;
            }
        }
    }

    reverse_step() {
        if (this.is_started && !this.is_stoped) {
            this.animation_time--;
            if (this.breakpoint === this.animation_time) {
                this.is_stoped = true;
            } else if (this.animation_time <= 0) {
                this.is_started = false;
                this.is_finished = true;
            }
        }
        if (this.is_stoped) {
            if (this.breakpoint_callback) {
                this.breakpoint_callback();
            }
        }
        if (this.is_finished) {
            if (this.callback) {
                this.callback();
            }
        }
        if (this.is_finished || this.is_stoped) {
            if (this.loop) {
                this.reset();
                this.go_to(this.animation_duration);
                this.is_started = true;
            }
        }
    }

    reset() {
        this.animation_time = 0;
        this.breakpoint = 0;
        this.is_started = false;
        this.is_finished = false;
        this.is_stoped = false;
        this.reverse = false;
    }

    set_breakpoint(duration) {
        this.breakpoint = duration;
    }

    go_to(duration) {
        if (duration > this.animation_duration) {
            throw("duration can not be more than the animation time");
        }
        this.animation_time = duration;
    }

    mute(mute) {
        if (this.sounds.sound) {
            this.sounds.sound.muted = mute;
        }
    }

    callback = null;

    breakpoint_callback = null;

}

export default animation;