import movable_mesh from "./movable_mesh.js";

class fire_meteor extends movable_mesh {

    time = 0;

    /**
     * Constructor
     * @param {number} rotate_z the z rotation at spawn
     * @param {number} position_x the x position at spawn
     * @param {number} position_y the y position at spawn
     * @param {movable_mesh} source the class who create the bullet
     */
    constructor( mesh ) {        // bullet parameter
        super( "bullet", mesh );
        
        // set the basic parameter of the bullet
        this.mesh.scale.set( 0.075, 0.1, 0.075 );
        this.is_affected_by_physics = false;
        this.sounds.sound = new Audio("src/medias/sounds/laser_2.mp3");
        this.sounds.sound.volume = 0.01;
        this.sounds.sound.play();

    }

    /**
     * Manages the collision between 2 objects
     * @param {movable_mesh} target the movable_mesh with which there is a collision
     */
    handle_collision( target ) {
        if ( target !== this.source ) {
            this.is_dead = true;
        }
    }

    /**
     * Update the bullet
     */
    update() {
        this.mouve_axies( this.speed.x, this.speed.y, this.speed.z );
        this.step();
    }

    step() {
        this.time++;
        if (this.time >= 80) {
            this.is_dead = true;
        }
    }

}

export default fire_meteor;