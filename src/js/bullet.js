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

        // create a ray to detect colision
        this.BB = new THREE.Box3().setFromObject( this );

        // animate the bullet
        this.animate();

    }

    detect_colision() {
        if ( this.parent ) {
            //console.log(this);
            //let thisBS = new THREE.Sphere();
            //this.BB.getBoundingSphere( thisBS );
            for ( let i = 0; i < this.parent.children.length; i++ ) {
                if ( this.parent.children[i].type === "meteor" ) {
                    let otherBB = this.parent.children[i].BB;
                    //let otherBS = new THREE.Sphere();
                    //otherBB.getBoundingSphere( otherBS );
                    //console.log(otherBS);
                    
                    //let otherBS = new THREE.Box3().setFromObject( this.parent.children[i] );
                    let collisionB = this.BB.intersectsBox( otherBB );
                    //let collisionS = thisBS.intersectsSphere( otherBS );
                    if (collisionB) {
                        this.visible = false;
                        console.log(collisionB); // if collision true
                    }

                }
            }
        }
    }

    destroy() {
        console.log(this.type, "is destroyed");
        this.parent.remove(this);
        delete(this);

    }

    /**
     * Animate the bullet
     */
    animate() {
        this.BB.setFromObject( this )
        // kill the bullet if hp = 0
        if (this.hp > 0) {
            requestAnimationFrame( this.animate.bind( this ) );
            this.detect_colision();
        } else {
            this.parent.remove( this );
            delete( this );
        }

        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        this.hp--;

    }
}

export default bullet;