
import movable_mesh from "./movable_mesh.js";
import wireframe_object from "./wireframe_object.js";

class scan extends movable_mesh {

    already_scan = new Array();

    constructor( intitial_position ) {
        const geometry = new THREE.RingGeometry(100, 110, 30);
        const material = new THREE.MeshStandardMaterial( {
            color: 0x0000ff,
            emissive: 0x0000ff,
            emissiveIntensity: 100,
            opacity: 1,
            transparent: true
        } );
        const mesh = new THREE.Mesh(geometry, material);
        super("scan", mesh);
        this.scale.set(0, 0, 0);
        this.position.set( intitial_position.x, intitial_position.y, intitial_position.z);
        this.is_affected_by_physics = false;
    }

    update() {
        this.scale.set( this.scale.x + 0.005, this.scale.y + 0.005, 1);
        this.mesh.material.opacity -= 1/180;
        if ( this.mesh.material.opacity <= 0 )
            this.is_dead = true;
    }

    handle_collision( target ) {
        if (target.type === "meteor" && target.is_collidable_object && !this.already_scan.find( e => e === target )) {
            const wireframe_target = new wireframe_object(target);
            this.parent.add(wireframe_target);
            //console.log(wireframe_target);
            this.already_scan.push(target);
        }
    }
}

export default scan;