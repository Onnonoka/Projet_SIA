import movable_mesh from "./movable_mesh.js";

class burning_meteor extends movable_mesh {

    time = 0;

    /**
     * Constructor
     * @param {number} rotate_z the z rotation at spawn
     * @param {number} position_x the x position at spawn
     * @param {number} position_y the y position at spawn
     * @param {movable_mesh} source the class who create the bullet
     */
    constructor( mesh ) {        // bullet parameter
        super( "burning_meteor", mesh );

        const burning_rock_light = new THREE.PointLight(0xE7A503, 1, 100);
        this.mesh.scale.set(80, 80, 80);
        this.add(burning_rock_light);
        this.speed.set(0, 0, -0.5);
        this.is_affected_by_physics = false;
    }

    /**
     * Manages the collision between 2 objects
     * @param {movable_mesh} target the movable_mesh with which there is a collision
     */
    handle_collision( target ) {
        
    }

    /**
     * Update the bullet
     */
    update() {
        this.mouve_axies( this.speed.x, this.speed.y, this.speed.z );
        this.rotation.x += 0.001;
        this.rotation.y += 0.001;
        if (this.position.z <= 0) {
            if (this.danger_zone) {
                this.danger_zone.is_dead = true;
            }
            this.scale.x -= 0.001;
            this.scale.y -= 0.001;
            this.scale.z -= 0.001;
            if (this.scale.x <= 0) {
                this.is_dead = true;
            }
        }
    }

    setDanger_zone(obj) {
        this.danger_zone = obj;
    }

}

export default burning_meteor;