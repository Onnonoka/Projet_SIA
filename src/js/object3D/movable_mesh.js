
/**
 * Abstract class to define element in the scene
 */
class movable_mesh extends THREE.Group {

    mesh = {};

    speed = new THREE.Vector3( 0, 0, 0 );

    is_dead = false;
    muted = false;
    sounds = {};

    is_collidable_object = true;
    is_affected_by_physics = true;

    /**
     * Constructor
     * @param {string} type the type of the mesh
     */
    constructor( type, mesh ) {

        super();
        if (type !== undefined && mesh instanceof THREE.Object3D) {
            this.type = type;
            this.mesh = mesh;
            this.add( mesh );
            this.compute_hit_box();
        }
    }

    /**
     * compute the hit box of this object
     */
    compute_hit_box() {

        this.mesh.geometry.computeBoundingBox();
        this.mesh.geometry.computeBoundingSphere();
        
        this.BB = this.mesh.geometry.boundingBox.clone();
        this.BS = this.mesh.geometry.boundingSphere.clone();
    }

    /**
     * Rotate the mesh without rotating the axies
     * @param {number} x the x rotation
     * @param {number} y the y rotation
     * @param {number} z the z rotation
     */
    rotate_mesh( x, y, z) {

        this.mesh.rotation.x = (this.mesh.rotation.x + Math.PI / 180 * x) % (2 * Math.PI);
        this.mesh.rotation.y = (this.mesh.rotation.y + Math.PI / 180 * y) % (2 * Math.PI);
        this.mesh.rotation.z = (this.mesh.rotation.z + Math.PI / 180 * z) % (2 * Math.PI);
    }

    /**
     * Mouve the mesh without mouve the axies from his position
     * @param {number} x the x mouvement
     * @param {number} y the y mouvement
     * @param {number} z the z mouvement
     */
    mouve_mesh( x, y, z) {

        this.mesh.position.x += x;
        this.mesh.position.y += y;
        this.mesh.position.z += z;
    } 

    /**
     * Rotate the axies and rotate the mesh
     * @param {number} x the x rotation
     * @param {number} y the y rotation
     * @param {number} z the z rotation
     */
    rotate_axies( x, y, z) {

        this.rotation.x = (this.rotation.x + Math.PI / 180 * x) % (2 * Math.PI);
        this.rotation.y = (this.rotation.y + Math.PI / 180 * y) % (2 * Math.PI);
        this.rotation.z = (this.rotation.z + Math.PI / 180 * z) % (2 * Math.PI);
    }

    /**
     * Mouve the axies and the mesh from his current position
     * @param {number} x the x mouvement
     * @param {number} y the y mouvement
     * @param {number} z the z mouvement
     */
    mouve_axies( x, y, z) {

        this.position.x += x;
        this.position.y += y;
        this.position.z += z;
    }
    
    /**
     * Normalizes the speed of the ship according to its maximum speed
     */
    normalize_speed( max_speed) {

        if ( this.speed.length() > max_speed ) {
            this.speed.setLength( max_speed );
        }
    }

    /**
     * clear the class and delete the instance
     */
    clear() {

        delete( this.BB );
        delete( this.BS );
        delete( this.speed );
        this.remove( this.mesh );
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        delete( this.mesh );
        delete( this ); 
    }
    
    handle_collision( target ) {

        throw new Error('You have to implement the method handle_collision before using the class!');
    }

    update() {

        throw new Error('You have to implement the method update before using the class!');
    }

    mute(mute) {
        this.muted = mute;
        Object.keys(this.sounds).forEach( key => {
            this.sounds[key].muted = this.muted;
        });
    }

}

export default movable_mesh;