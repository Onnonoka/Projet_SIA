
class dematerialize_animation extends animation {

    constructor(context, duration) {
        super(duration)
        this.context = context;
    }

    step() {
        super.step();
        if (this.is_started) {
            if (this.animation_time < this.animation_duration) {
                this.context.mesh.material.opacity = 0.4;
                this.context.mesh.material.transparent = true;
            } else if (this.animation_time >= this.animation_duration ) {
                this.context.mesh.material.opacity = 1;
                this.context.mesh.material.transparent = false;
            }
        }
        
        const interval = setInterval( () => {
            if (  this.mesh.material.transparent === true ) {
                this.mesh.material.opacity = 1;
                this.mesh.material.transparent = false;
            } else {
                this.mesh.material.opacity = 0.4;
                this.mesh.material.transparent = true;
            }
        }, 200 );
        setTimeout( () => {
            clearInterval( interval );
            this.mesh.material.opacity = 1;
            this.mesh.material.transparent = false;
            this.is_immune = false;
            this.is_affected_by_physics = true;
        }, 2000);
    }, 8000 );
    }
}