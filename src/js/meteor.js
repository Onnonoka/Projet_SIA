import movable_mesh from "./movable_mesh.js";

class meteor extends movable_mesh {

    /**
     * Constructor
     * @param {number} speed_x the initial speed on x cord
     * @param {number} speed_y the initial speed on x cord
     * @param {number} pos_x the initial x cord
     * @param {number} pos_y the initial y cord
     * @param {number} size The number of times it can decay
     */
    constructor(speed_x = 0, speed_y = 0, pos_x = 0, pos_y = 0, size = 1) {
        super( "meteor" );
        this.size = size;

        // Creating the mesh
        const geometry = new THREE.DodecahedronGeometry( this.size * 3, 0 );
        const material = new THREE.MeshPhongMaterial( {color: 0xffff00} );
        this.mesh = new THREE.Mesh( geometry, material );
        // add the mesh to the group
        this.add( this.mesh );
        
        // Computing the hit box of the mesh
        this.compute_hit_box();

        // meteor placement and speed
        this.set_speed( speed_x, speed_y, 0 );
        this.normalize_speed( 0.3 / size );
        this.mouve_axies( pos_x, pos_y, 0 );

        //console.log(this.position);
        // animate the meteor
        this.animate();

    }

    update() {
        this.rotate_mesh( THREE.Math.radToDeg( 0.01 ), THREE.Math.radToDeg( 0.01 ), 0 );
        this.mouve_axies( this.speed.x, this.speed.y, this.speed.z);

    }

    handle_collision( target ) {
        if ( target.type === "bullet" ) {
            if ( this.size > 1 ) {
                let child_speed = new THREE.Vector3().copy( this.speed ).add( target.speed );
                this.parent.add( new meteor( child_speed.x, child_speed.y, this.position.x, this.position.y, this.size - 1 ) );
                this.parent.add( new meteor( -child_speed.y, child_speed.x, this.position.x, this.position.y, this.size - 1 ) );
                this.parent.add( new meteor( child_speed.y, -child_speed.x, this.position.x, this.position.y, this.size - 1 ) );
            }
            this.clear();
        }
    }
}

export default meteor;