import movable_mesh from "./movable_mesh.js";


class wireframe_object extends movable_mesh {

    constructor( object ) {
        super("wireframe", object.mesh.clone());
        const mat = new THREE.MeshBasicMaterial().copy(this.mesh.material);
        this.mesh.material.dispose();
        this.mesh.material = mat;
        this.mesh.material.color = new THREE.Color(0x00ff00);
        this.mesh.material.map = null;
        this.mesh.material.polygonOffset = true;
        this.mesh.material.polygonOffsetFactor = 1; // positive value pushes polygon further away
        this.mesh.material.polygonOffsetUnits = 1;
        this.mesh.material.wireframe = true;
        this.mesh.material.transparent = true;
        this.position.set(object.position.x, object.position.y, object.position.z);
        this.rotation.set(object.rotation.x, object.rotation.y, object.rotation.z);
        this.scale.set(object.scale.x, object.scale.y, object.scale.z);
        this.is_collidable_object = false;
        this.is_affected_by_physics = false;
    }

    update() {
        this.mesh.material.opacity -= 1/180;
        if ( this.mesh.material.opacity <= 0 )
            this.is_dead = true;
    }
}

export default wireframe_object;