
/**
 * Abstract class to define element in the scene
 */
 class movable_mesh extends THREE.Group {

    speed = new THREE.Vector3( 0, 0,0 );

    /**
     * 
     * @param {strings} type the type of the mesh
     */
    constructor( type ) {
        super();
        this.type = type;
        this.BB = new THREE.Box3().setFromObject( this );

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
     * Set the speed of the group
     * @param {number} x the x speed
     * @param {number} y the y speed
     * @param {number} z the z speed
     */
    set_speed( x, y, z ) {
        this.speed.x = x;
        this.speed.y = y;
        this.speed.z = z;

    }

    /**
     * detect a collision between 2 object in the scene
     */
    detect_collision() {
        let i = 0;
        while ( this.parent && this.parent.children[i] ) {
            if ( this.parent.children[i] !== this && this.parent.children[i].BB ) {
                let otherBB = this.parent.children[i].BB;
            
                let collisionB = this.BB.intersectsBox( otherBB );
                
                if (collisionB) {
                    this.parent.children[i].handle_collision( this );
                    this.handle_collision( this.parent.children[i] );
                }
            }
            i++;
        }
    }

    /**
     * 
     */
    animate() {
        throw new Error('You have to implement the method animate!');
    }
    
    handle_collision( target ) {
        throw new Error('You have to implement the method handle_collision!');
        
    }

}

export default movable_mesh;