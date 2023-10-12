import * as THREE from 'three';

import animation from "./animation.js";

class death_animation extends animation {

    constructor(context) {
        super(60*2);
        this.context = context;
    }

    step() {
        super.step();
        if (this.is_started) {
            this.context.mesh.visible = false;
            this.context.booster.visible = false;
            if (this.animation_time >= this.animation_duration - 1) {
                const mesh_size = new THREE.Vector3();
                this.context.BB.getSize( mesh_size );
                this.context.position.set( 0, 0, mesh_size.y / 2 );
                this.context.rotation.set( 0, 0, 0 );
                this.context.speed.set( 0, 0, 0 );
                this.context.mesh.visible = true;
                this.context.booster.visible = true;
            }
        }
    }
}

export default death_animation;