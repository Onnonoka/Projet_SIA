import movable_mesh from "./movable_mesh.js";

/**
 * 
 */
class ship extends movable_mesh {

    fire_on_cooldown = false;

    is_affected_by_gravity = false;

    max_speed = 0.35;

    
    /**
     * Constructor
     */
    constructor( ship ) {
        super( "ship", ship );
    }

    /**
     * Accelerate
     */
    speed_up() {
        this.speed.x -= 0.01 * Math.sin( this.rotation.z );
        this.speed.y += 0.01 * Math.cos( this.rotation.z );

    }

    update() {
        this.normalize_speed( this.max_speed );
        this.mouve_axies(this.speed.x, this.speed.y, this.speed.z);

    }

    handle_collision( target ) {
        if ( target.type === "bullet" ) {
            if ( target.source !== this ) {
                console.log( "handle_ship_collision_with_bullet" ); 

            }
        } else if ( target.type === "meteor" ) {
            this.clear();
            console.log( "handle_ship_collision_with_meteor" ); 

        }
    }

}

export default ship;