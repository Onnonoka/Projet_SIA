

class physics_Object3D extends THREE.Group {

    linear_magnitude = 0;
    rotation_magnitude = 0;

    direction = new THREE.Vector2();

    linear_velocity = new THREE.Vector2();
    rotation_velocity = new THREE.Vector3();
    force = 0;

    constructor() {
        super();
    }

    update() {
        const force_velocity = this.get_direction().multiplyScalar( force );
        if ( this.force_velocity < this.max_speed )
            this.linear_velocity.add( force_velocity );

        this.position.add( this.linear_velocity );
        this.force.set( 0, 0, 0 );
    }

    get_direction() {
        this.direction.set( Math.sin( this.rotation.z ), Math.cos( this.rotation.z ) ).normalize();
        return this.direction.clone();
    }
}
export default physics_Object3D;