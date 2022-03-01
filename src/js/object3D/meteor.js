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
    constructor( speed_x = 0, speed_y = 0, pos_x = 0, pos_y = 0, size = 1, mesh) {
        const geometrie = new THREE.DodecahedronGeometry( 3, 0);
        const material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
        super( "meteor", new THREE.Mesh( geometrie, material ) );
        this.size = size;

        // meteor placement and speed
        this.scale.set(this.size, this.size, this.size);
        this.set_speed( speed_x, speed_y, 0 );
        this.normalize_speed( 0.3 / size );
        this.mouve_axies( pos_x, pos_y, 0 );

    }

    update() {
        this.rotate_mesh( THREE.Math.radToDeg( 0.001 ), THREE.Math.radToDeg( 0.001 ), 0 );
        this.mouve_axies( this.speed.x, this.speed.y, this.speed.z);

    }

    handle_collision( target ) {
        if ( target.type === "bullet" ) {
            if ( this.size > 1 ) {
                let child_speed = this.speed.clone().add( target.speed );
                this.parent.add( new meteor( child_speed.x, child_speed.y, this.position.x, this.position.y, this.size - 1, this.mesh.clone() ) );
                this.parent.add( new meteor( -child_speed.y, child_speed.x, this.position.x, this.position.y, this.size - 1 ), this.mesh.clone() );
                this.parent.add( new meteor( child_speed.y, -child_speed.x, this.position.x, this.position.y, this.size - 1 ), this.mesh.clone() );
            }
            this.clear();
        }
    }
}

export default meteor;