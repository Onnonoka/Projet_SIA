
import animation from "./animation.js";
import { CAMERA } from "../game_level.js";

class end_lvl_animation extends animation {

    y_start = 0;

    constructor(context) {
        super(60*3)
        this.context = context;
        this.camera = context.camera;
        this.sounds.sound = new Audio("src/medias/sounds/jump_start_1.mp3");
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
            this.context.player.is_collidable_object = false;
            this.context.player.is_affected_by_physics = false;
            this.context.player.is_lock = true; 
            if (this.animation_time < 30) {
                let z_rotation_force = 0;
                if (this.context.player.rotation.z !== 0) {
                    z_rotation_force = (THREE.Math.radToDeg(this.context.player.rotation.z) % 360) - THREE.Math.radToDeg(this.context.player.rotation.z) / (30 - this.animation_time);
                }
                this.context.player.rotation.set(this.context.player.rotation.x, this.context.player.rotation.y, THREE.Math.degToRad(z_rotation_force));
            } else if (this.animation_time === 30) {
                this.context.player.rotation.set(this.context.player.rotation.x, this.context.player.rotation.y, 0);
            } else if (this.animation_time <= 120 + 30) {
                this.context.player.max_speed = 1;
                this.context.player.speed.set(0, 1, 0);
                this.context.player.speed.setLength(((this.animation_time - 30) / 60));
                this.context.player.mesh.scale.set(1, 1, 1 + ((this.animation_time - 30) / 60) * 0.2);
                this.context.player.booster.scale.set(1, ((this.animation_time - 30) / 60) * 0.8 , 1);
                this.context.player.booster.position.set(0, -size.x / 2 - 6.5 * this.context.player.booster.scale.y, 0.7);
                this.y_start = this.context.player.position.y;
            } else if (this.animation_time <= 60*3) {
                this.context.camera_status = CAMERA.CAMERA_FIX;
                const y_dist = height * 2 - this.y_start;
                this.context.player.position.set(this.context.player.position.x, this.context.player.position.y + (y_dist / 30) , this.context.player.position.z);
                this.context.player.scale.set(1, 1 + ((5 - 1) / 30) * (this.animation_time - 90), 1);
                this.context.player.booster.scale.set(1, 1 , 1);
                this.context.player.booster.position.set(0, -size.x / 2 - 6.5, 0.7);
            }
        }
    }

    start() {
        this.sounds.sound.play();
        super.start();
    }

}

export default end_lvl_animation;