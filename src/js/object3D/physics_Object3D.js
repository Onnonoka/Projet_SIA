

class physics_Object3D extends THREE.Group {

    max_linear_speed = 0.65;
    max_rotation_speed = 0.05;

    // Linear and rotation speed of the object
    linear_magnitude = 0;
    rotation_magnitude = 0;

    // Direction of the object
    direction = new THREE.Vector2();

    // Velocity of the object
    linear_velocity = new THREE.Vector2();
    rotation_velocity = new THREE.Vector3();

    // The force experienced by the object at a time
    linear_force = new THREE.Vector2();
    rotation_force = new THREE.Vector3();

    // physics properties
    mass = 0;

    constructor() {
        super();
    }

    update() {
        const force_linear_velocity = this.get_direction().multiply( this.linear_force );
        //const force_rotation_velocity = this.get_direction().multiply( this.linear_force );
        if ( this.force_linear_velocity.length < this.max_linear_speed )
            this.linear_velocity.add( force_linear_velocity );
        if ( this.force_rotation_velocity.length < this.max_rotation_speed )
            this.rotation_velocity.add( force_rotation_velocity );
        this.position.add( this.linear_velocity );
        this.rotation.add( this.rotation_velocity );
        this.linear_force.set( 0, 0, 0 );
        this.linear_velocity.set( 0, 0, 0 );
    }

    get_direction() {
        this.direction.set( Math.sin( this.rotation.z ), Math.cos( this.rotation.z ) ).normalize();
        return this.direction.clone();
    }

}

export default physics_Object3D;