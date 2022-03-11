import movable_mesh from "./movable_mesh.js";
import bullet from "./bullet.js";

/**
 * 
 */
class ship extends movable_mesh {

    max_speed = 0.35;

    on_cooldown = false;
    shoot_left = true;
    fire_rate = 500;

    is_immune = false;

    life = 3
    
    /**
     * Constructor
     */
    constructor( ship ) {
        super( "ship", ship );

        const size = new THREE.Vector3();
        this.BB.getSize(size);
        this.position.z = size.y / 2;

        const shield_geometry = new THREE.SphereGeometry( this.BS.radius, 32, 16 );
        const shield_material = new THREE.MeshStandardMaterial( {
            color: 0x2ba0ff,
            emissive: 0x2ba0ff,
            emissiveIntensity: 5,
            transparent: true,
            opacity: 0.2
        } );
        this.shield = new THREE.Mesh( shield_geometry, shield_material );
        this.shield.scale.set( 1, 1.3, 1 );
        this.shield_light = new THREE.PointLight( 0x2ba0ff, 5, 15 );
        this.shield.geometry.computeBoundingBox();
        this.shield.geometry.computeBoundingSphere();
        this.shield.active = false;
        this.shield.visible = false;
        this.shield_light.visible = false;
        this.add( this.shield );
        this.add( this.shield_light );

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
        //console.log("spot_light", this.spot_light);
        //console.log("this", this.position);
        this.normalize_speed( this.max_speed );
        this.mouve_axies(this.speed.x, this.speed.y, this.speed.z);
    }

    /**
     * Spawn a bullet on the player ship position and direction
     */
    shoot() {
        if ( !this.on_cooldown && this.visible ) {
            const mesh_size = new THREE.Vector3();
            this.BB.getSize( mesh_size );
            let bullet_x = Math.sin( THREE.Math.degToRad( 90 - THREE.Math.radToDeg(this.rotation.z) )  ) *  (mesh_size.x / 2 - 0.4);
            let bullet_y = Math.cos( THREE.Math.degToRad( 90 - THREE.Math.radToDeg(this.rotation.z) )  ) *  (mesh_size.x / 2 - 0.4);
            const ammo = new bullet();
            if ( this.shoot_left ) {
                bullet_x -= Math.cos( THREE.Math.degToRad( 90 - THREE.Math.radToDeg(this.rotation.z) )  ) * -2.5;
                bullet_y += Math.sin( THREE.Math.degToRad( 90 - THREE.Math.radToDeg(this.rotation.z) )  ) * -2.5;
                ammo.position.set( this.position.x - bullet_x, this.position.y - bullet_y, 0 );
            } else {
                bullet_x -= Math.cos( THREE.Math.degToRad( 90 - THREE.Math.radToDeg(this.rotation.z) )  ) * 2.5;
                bullet_y += Math.sin( THREE.Math.degToRad( 90 - THREE.Math.radToDeg(this.rotation.z) )  ) * 2.5;
                ammo.position.set( this.position.x + bullet_x, this.position.y + bullet_y, 0 );
            }
            ammo.rotation.set( 0, 0, this.rotation.z );
            ammo.source = this;
            ammo.speed.set( -2 * Math.sin( this.rotation.z ), 2 * Math.cos( this.rotation.z ), 0 );
            this.shoot_left = !this.shoot_left;
            this.parent.add( ammo );
            this.on_cooldown = true;
            setTimeout( () => {
                this.on_cooldown = false;
            }, this.fire_rate );
        }
    }

    handle_collision( target ) {
        if ( ( target.type === "bullet" && target.source !== this || target.type === "meteor" ) && this.visible && !this.is_immune && !this.shield.active ) {
            this.visible = false;
            this.life--;
            this.speed.set( 0, 0, 0 );
            if ( this.life < 1 ) {
                this.is_dead = true;
            } else {
                setTimeout( () => {
                    this.visible = true;
                    this.position.set( 0, 0, 0 );
                    this.rotation.set( 0, 0, 0 );
                    this.speed.set( 0, 0, 0 );
                }, 500 );
            }
        } else if ( target.type === "power_up" && this.visible ) {
            target.action.bind( this )();
        } else if ( target.type === "meteor" && this.visible ) {
            if ( this.shield.active ) {
                const vec_dist = new THREE.Vector3( target.position.x - this.position.x, target.position.y - this.position.y, 0 ).multiplyScalar( target.size );
                const vec_speed = this.speed.clone().multiplyScalar( 4 ).add( vec_dist );
                this.speed.set( -vec_speed.x, -vec_speed.y, -vec_speed.z );
                this.speed.setLength( target.speed.length() );
            }
        }
    }
}

export default ship;