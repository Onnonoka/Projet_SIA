import movable_mesh from "./movable_mesh.js";
import bullet from "./bullet.js";

/**
 * 
 */
class ship extends movable_mesh {

    // is_affected_by_gravity = false;

    max_speed = 0.35;

    on_cooldown = false;

    life = 3
    
    /**
     * Constructor
     */
    constructor( ship ) {
        super( "ship", ship );

        const size = new THREE.Vector3();
        this.BB.getSize(size);
        this.position.z = size.y / 2;
    }

    /**
     * Accelerate
     */
    speed_up() {
        this.speed.x -= 0.01 * Math.sin( this.rotation.z );
        this.speed.y += 0.01 * Math.cos( this.rotation.z );
    }

    /**
     * Deccelerate
     */
    speed_down() {
        this.speed.x += 0.01 * Math.sin( this.rotation.z );
        this.speed.y -= 0.01 * Math.cos( this.rotation.z );
    }

    update() {
        this.normalize_speed( this.max_speed );
        this.mouve_axies(this.speed.x, this.speed.y, this.speed.z);
    }

    /**
     * Spawn a bullet on the player ship position and direction
     */
    shoot() {
        if ( !this.on_cooldown ) {
            /*const mesh_size = new THREE.Vector3();
            this.BB.getSize( mesh_size );
            console.log(mesh_size);
            const bullet_x = Math.sin(this.rotation.z) *  mesh_size.x / 2;
            const bullet_y = Math.cos(this.rotation.z) *  mesh_size.x / 2;*/
            const ammo = new bullet( this.rotation.z, this.position.x, this.position.y, this );
            this.parent.add( ammo );
            this.on_cooldown = true;
            setTimeout( () => {
                this.on_cooldown = false;
            }, 500 );
        }
    }

    handle_collision( target ) {
        if ( target.type === "bullet" && target.source !== this || target.type === "meteor" ) {
            console.log( this );
            this.visible = false;
            setTimeout( () => {
                this.visible = true;
                this.position.set( 0, 0, 0 );
                this.speed.set( 0, 0, 0 );
                this.life--;
            }, 500 );
        }
    }
}

export default ship;