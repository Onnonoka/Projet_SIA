import mouvable_mesh from "./movable_mesh.js";

class power_up extends mouvable_mesh {

    constructor() {
        const geometrie = new THREE.BoxGeometry( 10, 10, 10 );
        const material = new THREE.MeshStandardMaterial( {
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 2,
        } );
        super("power_up", new THREE.Mesh( geometrie, material ));
        this.position.set( 20, 20, 0 );
        setTimeout( () => {
            this.is_dead = true;
        }, 10000 );
        this.is_affected_by_physics = false;
    }

    update() {
        this.rotate_mesh( 0, THREE.Math.radToDeg( 0.05 ), 0 );
        this.mouve_axies(this.speed.x, this.speed.y, this.speed.z);
    }

    handle_collision( target ) {
        if ( target.type === "ship" ) {
            this.is_dead = true;
        }
    }

    action() {
        throw new Error('You have to implement the method action before using the class!');
    }
}

export default power_up;