import movable_mesh from "./movable_mesh.js";
import bullet from "./bullet.js";

/**
 * 
 */
class controler_ship extends movable_mesh {

    key_Arrow_Left = false;
    key_Arrow_Right = false;
    key_Arrow_Up = false;
    key_Space = false;

    fire_on_cooldown = false;

    max_speed = 0.35;

    
    /**
     * Constructor
     */
    constructor() {
        super( "controler_ship" );

        // Creating the mesh and the texture
        const geometry = new THREE.ConeGeometry( 1, 2, 4 );
        const material = new THREE.MeshPhongMaterial( {color: 0xffff00} );
        this.mesh = new THREE.Mesh( geometry, material );

        // add the mesh too the groupe
        this.add( this.mesh );

        // add the bounding box
        this.BB = new THREE.Box3().setFromObject( this );

        // add controle to the ship
        window.onkeydown = (e) => {
            if ( e.repeat === false ) {
                if ( e.key === 'ArrowLeft' )
                    this.key_Arrow_Left = true;
                else if ( e.key === 'ArrowRight' )
                    this.key_Arrow_Right = true;
                else if ( e.key === 'ArrowUp' ) {
                    this.key_Arrow_Up = true;
                    this.max_speed = 0.5;
                } else if (e.key === " ")
                    this.key_Space = true;
            }
            
        };

        window.onkeyup = ( e ) => {
            if ( e.key === "ArrowLeft" )
                this.key_Arrow_Left = false;
            if ( e.key === "ArrowRight" ) 
                this.key_Arrow_Right = false;
            if ( e.key === "ArrowUp" ) {
                this.key_Arrow_Up = false;
                this.max_speed = 0.35;
            }
            if ( e.key === " " )
                this.key_Space = false;
            
        };

        // animate the ship
        this.animate();
    }

    /**
     * shoot a bullet
     */
    shoot() {
        if ( !this.fire_on_cooldown ) {
            let ammo = new bullet(this.rotation.z, this.position.x, this.position.y, this );
            this.parent.add( ammo );
            const helperBB = new THREE.Box3Helper( ammo.BB, 0xffff00 );
            this.parent.add( helperBB );
            this.fire_on_cooldown = true;
            setTimeout( () => {
                this.fire_on_cooldown = false;
            }, 500 );
        }
        
    }

    /**
     * Accelerate
     */
    speed_up() {
        this.speed.x -= 0.01 * Math.sin( this.rotation.z );
        this.speed.y += 0.01 * Math.cos( this.rotation.z );

    }

    /**
     * Normalizes the speed of the ship according to its maximum speed
     */
    normalize_speed() {
        if ( this.speed.length() > this.max_speed ) {
            this.speed.normalize();
            this.speed.x *= this.max_speed;
            this.speed.y *= this.max_speed;
            this.speed.z *= this.max_speed;
        }
    }

    update() {
        this.BB.setFromObject( this );
        // object animation
        if ( this.key_Arrow_Left )
        this.rotate_axies( 0, 0, THREE.Math.radToDeg( 0.05 ) );
        if ( this.key_Arrow_Right )
        this.rotate_axies( 0, 0, THREE.Math.radToDeg( -0.05 ) );
        if ( this.key_Arrow_Up )
        this.speed_up();
        if ( this.key_Space )
        this.shoot();
        this.normalize_speed();
        this.mouve_axies( this.speed.x, this.speed.y, this.speed.z );

    }

    /**
     * Animate the ship
     */
    animate() {
        requestAnimationFrame( this.animate.bind( this ) );
        this.update();

        // mesh animation
        this.rotate_mesh( 0, THREE.Math.radToDeg(0.05), 0 );
    }

}

export default controler_ship;