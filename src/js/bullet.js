import movable_mesh from "./movable_mesh.js";

class bullet extends movable_mesh {

    /**
     * Constructor
     * @param {number} rotate_z the z rotation at spawn
     * @param {number} position_x the x position at spawn
     * @param {number} position_y the y position at spawn
     * @param {object} source the class who create the bullet
     */
    constructor( rotate_z, position_x, position_y, source ) {
        super( "bullet" );
        this.source = source;

        // Creating the mesh and the texture
        const geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        this.mesh = new THREE.Mesh( geometry, material );

        // add the mesh too the groupe
        this.add( this.mesh );

        // set the basic parameter of the bullet
        this.scale.x = 0.05;
        this.scale.y = 0.05;
        this.scale.z = 0.05;
        this.rotate_axies(0, 0, THREE.Math.radToDeg( rotate_z ));
        this.mouve_axies( position_x, position_y, 0 );
        this.set_speed( -1 * Math.sin( this.rotation.z ), 1 * Math.cos( this.rotation.z ), 0 );
        this.hp = 100;

        this.mesh.geometry.computeBoundingBox();
        this.BB = new THREE.Box3().copy( this.mesh.geometry.boundingBox ).applyMatrix4( this.mesh.matrixWorld );
        console.log(this.mesh.geometry.boundingBox);

        // animate the bullet
        this.animate();

    }

    handle_collision( target ) {
        if ( target !== this.source ) {
            this.hp = 0;
        }
    }

    destroy() {
        this.parent.remove(this);
        this.BB.makeEmpty();
        delete(this);

    }

    update() {
        this.BB.setFromObject( this );
        this.detect_collision();

        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        this.hp--;
    }

    /**
     * Animate the bullet
     */
    animate() {
        if (this.hp <= 0) {
            this.destroy();
        } else {
            this.update();
            requestAnimationFrame( this.animate.bind( this ) );
        }

    }
}

export default bullet;