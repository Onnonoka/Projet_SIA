import mouvable_mesh from "./movable_mesh.js";

class power_up extends mouvable_mesh {

    constructor() {
        const geometrie = new THREE.BoxGeometry( 10, 10, 10 );
        const material = new THREE.MeshPhongMaterial( {color: 0xff0000} );
        super("power_up", new THREE.Mesh( geometrie, material ));
        this.position.set( 20, 20, 0 );
        setTimeout( () => {
            this.is_dead = true;
        }, 10000 );
    }

    update() {
        this.rotate_mesh( 0, THREE.Math.radToDeg( 0.05 ), 0 );
    }

    handle_collision( target ) {
        if ( target.type === "ship" ) {
            this.is_dead = true;
        }
    }

    action() {
        this.fire_rate /= 2;
        setTimeout( () => {
            this.fire_rate *= 2;
        }, 5000 );
    }
}

export default power_up;