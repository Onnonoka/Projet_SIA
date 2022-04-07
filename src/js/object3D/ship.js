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

    animations = new Array();
    
    /**
     * Constructor
     */
    constructor( ship ) {
        super( "ship", ship );
        
        // mesh parameter
        const size = new THREE.Vector3();
        this.BB.getSize(size);
        this.position.z = size.y / 2;

        // shield paramter
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
        const booster_geometry = new THREE.ConeGeometry(0.5, 10, 8);
        const booster_material = new THREE.MeshStandardMaterial( {
            color: 0x3d91ff,
            emissive: 0x3d91ff,
            emissiveIntensity: 5
        } );
        this.booster = new THREE.Mesh(booster_geometry, booster_material);
        this.booster.rotation.set(0, 0, THREE.Math.degToRad(180));
        this.booster.position.set(0, -size.x / 2 - 6.5, 0.7);
        this.booster.scale.set(0, 0, 0);
        this.booster_light = new THREE.PointLight( 0x2ba0ff, 5, 15 );
        this.booster_light.position.set(0, -size.x / 2, 0.7);
        //this.booster_light.visible = false;
        this.add(this.booster);
        this.add(this.booster_light);
        const bullet_geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
        const bullet_material = new THREE.MeshStandardMaterial( {
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 100
        } );
        this.bullet_mesh = new THREE.Mesh(bullet_geometry, bullet_material);
        this.bullet_light = new THREE.PointLight( 0x00ff00, 5, 10 );



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
        if (this.max_speed === 0.35) {
            this.booster.scale.set(0, 0, 0);
            this.booster_light.intensity = 0;
            //this.booster_light.visible = false;
        } else {
            let size = new THREE.Vector3();
            this.mesh.geometry.boundingBox.getSize(size);
            const direction = new THREE.Vector3(Math.sin( this.rotation.z ), Math.cos( this.rotation.z ), 0).normalize();
            const speed_direction = this.speed.clone().multiply(direction);
            this.booster.scale.set(1, speed_direction.length() / 0.65, 1);
            this.booster.position.set(0, -size.x / 2 - 6.5 * this.booster.scale.y, 0.7);
            this.booster_light.intensity = 5 * this.booster.scale.y;
            this.booster_light.visible = true;
        }
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
            const ammo = new bullet( this.bullet_mesh.clone(), this.bullet_light.clone() );
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
                    const mesh_size = new THREE.Vector3();
                    this.BB.getSize( mesh_size );
                    this.visible = true;
                    this.position.set( 0, 0, mesh_size.y / 2 );
                    this.rotation.set( 0, 0, 0 );
                    this.speed.set( 0, 0, 0 );
                }, 500 );
            }
        } else if ( target.type === "power_up" && this.visible ) {
            target.action.bind( this )();
        }
    }
}

export default ship;