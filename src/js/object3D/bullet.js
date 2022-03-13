import movable_mesh from "./movable_mesh.js";

class bullet extends movable_mesh {

    local_time = 0;

    /**
     * Constructor
     * @param {number} rotate_z the z rotation at spawn
     * @param {number} position_x the x position at spawn
     * @param {number} position_y the y position at spawn
     * @param {movable_mesh} source the class who create the bullet
     */
    constructor( hex_color ) {        // bullet parameter
        const geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
        const material = new THREE.MeshStandardMaterial( {
            color: hex_color,
            emissive: hex_color,
            emissiveIntensity: 100
        } );
        const mesh = new THREE.Mesh( geometry, material );
        super( "bullet", mesh );
        
        const light = new THREE.PointLight( hex_color, 5, 10 );
        this.add(light);

        // set the basic parameter of the bullet
        this.scale.set( 0.075, 0.1, 0.075 );

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
    update( time ) {
        this.mouve_axies( this.speed.x, this.speed.y, this.speed.z );
        this.step();
    }

    step() {
        this.local_time++;
        if (this.local_time === 80)
            this.is_dead = true;
    }

}

export default bullet;