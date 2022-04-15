
import animation from "./animation.js";

class start_lvl_animation extends animation {

    constructor(context) {
        super(60*2)
        this.context = context;
        this.camera = context.camera;
        this.sounds.sound = new Audio("src/medias/sounds/jump_end_1.mp3");
        this.sounds.sound.volume = 0.1;
    }

    step() {
        super.step();
        if (this.is_started) {
            const horinzontal_fov = 2 * THREE.Math.radToDeg( Math.atan( Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.aspect ) );
            // compute the width and the height at z = 0
            const width = Math.tan( THREE.Math.degToRad( horinzontal_fov ) / 2 ) * this.camera.position.z * 2;
            const height = Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.position.z * 2;
            const size = new THREE.Vector3();
            this.context.player.mesh.geometry.boundingBox.getSize(size);
            this.context.player.is_lock = true;
            this.context.player.is_collidable_object = false;
            this.context.player.is_affected_by_physics = false;
            this.context.player.booster.scale.set(1, 1, 1);
            this.context.player.booster.position.set(0, -size.x / 2 - 6.5, 0.7);
            this.context.player.rotation.set(0, 0, 0);
            if (this.animation_time < 60) {
                this.context.player.position.set(0, height, this.context.player.position.z);
            } else if (this.animation_time <= 90) {
                this.context.player.position.set(0, -((height)) * (1 - ((this.animation_time - 60) / 30) ), this.context.player.position.z);
                this.context.player.scale.set(1, 15 - (14 * (this.animation_time - 60) / 30) , this.context.player.scale.z);
            } else if (this.animation_time < this.animation_duration - 1) {
                this.context.player.booster.scale.set(1, 1 - ((this.animation_time - 90) / 30) , 1);
                this.context.player.booster.position.set(0, -size.x / 2 - 6.5 * this.context.player.booster.scale.y, 0.7);
                this.context.player.speed.set(0, 1, 0);
                this.context.player.speed.setLength((1 - ((this.animation_time - 90) / 30)) * 1);
            } else {
                this.context.player.booster.scale.set(0, 0, 0);
                this.context.player.booster.position.set(0, 0, 0);
                this.context.player.is_collidable_object = true;
                this.context.player.is_affected_by_physics = true;
                this.context.player.is_lock = false;
            }
        }
    }

    start() {
        super.start();
        this.sounds.sound.play();
    }
}

export default start_lvl_animation;