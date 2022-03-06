import movable_mesh from "./movable_mesh.js";

class bullet extends movable_mesh {

    /**
     * Constructor
     * @param {number} rotate_z the z rotation at spawn
     * @param {number} position_x the x position at spawn
     * @param {number} position_y the y position at spawn
     * @param {movable_mesh} source the class who create the bullet
     */
    constructor() {
        const geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
        const material = new THREE.MeshStandardMaterial( {
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 100
        } );
        const mesh = new THREE.Mesh( geometry, material );

        // Creating the mesh and the texture
        const light = new THREE.PointLight( 0x00ff00, 5, 10 );

        super( "bullet", mesh );
        this.add( light );

        // set the basic parameter of the bullet
        this.scale.set( 0.075, 0.1, 0.075 );

        setTimeout( () => {
            this.is_dead = true;
        }, 1000 );
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
    }

}

export default bullet;