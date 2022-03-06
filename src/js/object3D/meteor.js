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
    constructor( speed_x = 0, speed_y = 0, pos_x = 0, pos_y = 0, size = 1 ) {
        
        const geometrie = new THREE.DodecahedronGeometry( 3, 0);
        const material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
        const mesh = new THREE.Mesh( geometrie, material );
        super( "meteor", mesh );
        this.size = size;

        // meteor placement and speed
        this.scale.set( this.size, this.size, this.size );
        this.speed.set( speed_x, speed_y, 0 );
        this.speed.setLength( 0.3 / size );
        this.mouve_axies( pos_x, pos_y, 0 );
    }

    update() {
        this.rotate_mesh( THREE.Math.radToDeg( 0.001 ), THREE.Math.radToDeg( 0.001 ), 0 );
        this.mouve_axies( this.speed.x, this.speed.y, this.speed.z);
    }

    handle_collision( target ) {
        if ( target.type === "bullet" ) {
            if ( this.size > 1 ) {
                const speed = this.speed.clone().add( target.speed );
                const pos = this.position;
                this.parent.add( new meteor( speed.x, speed.y, pos.x, pos.y, this.size - 1 ) );
                this.parent.add( new meteor( -speed.y, speed.x, pos.x, pos.y, this.size - 1 ) );
                this.parent.add( new meteor( speed.y, -speed.x, pos.x, pos.y, this.size - 1 ) );
            }
            this.is_dead = true;
        } else if ( target.type === "meteor" ) {
            /*this.speed.set( -this.speed.x, -this.speed.y, -this.speed.z );
            this.speed.setLength( 0.3 / this.size );
            this.mouve_axies( this.speed.x, this.speed.y, this.speed.z );*/
        }
    }
}

export default meteor;