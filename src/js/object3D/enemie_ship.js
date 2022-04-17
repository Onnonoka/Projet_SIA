import movable_mesh from "./movable_mesh.js";
import bullet from "./bullet.js";

/**
 * 
 */
class enemie_ship extends movable_mesh {

    fire_on_cooldown = false;
    fire_rate = 120;
    time = 0;

    max_speed = 0.15;

    
    /**
     * Constructor
     */
    constructor(mesh, target) {
        
        super( "enemie_ship", mesh );
        this.target = target;
        const bullet_geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
        const bullet_material = new THREE.MeshStandardMaterial( {
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 100
        } );
        this.bullet_mesh = new THREE.Mesh(bullet_geometry, bullet_material);
    }


    update() {
        const d_target = this.target.position.clone();
        if (d_target.length() === 0) {
            d_target.set(0, 1, 0);
        }
        d_target.z = 0;
        d_target.y -= this.position.y;
        d_target.x -= this.position.x;
        d_target.normalize();
        d_target.applyAxisAngle(new THREE.Vector3(0, 0, 1), -this.rotation.z);
        if (d_target.x > 0) {
            this.rotation.z = (this.rotation.z - 0.01) % (Math.PI * 2);
        } else if (d_target.x < 0) {
            this.rotation.z = (this.rotation.z + 0.01) % (Math.PI * 2);
        }
        if (d_target.angleTo(new THREE.Vector3(0, 1, 0)) < THREE.Math.degToRad(5)) {
            this.shoot();
        }
        if (this.position.distanceTo(this.target.position) > 25) {
            this.speed.x -= 0.01 * Math.sin( this.rotation.z );
            this.speed.y += 0.01 * Math.cos( this.rotation.z );
        } else if (this.position.distanceTo(this.target.position) < 20) {
            this.speed.x += 0.01 * Math.sin( this.rotation.z );
            this.speed.y -= 0.01 * Math.cos( this.rotation.z );
        }
        this.normalize_speed(this.max_speed);
        this.mouve_axies(this.speed.x, this.speed.y, this.speed.z);
        if (this.on_cooldown) {
            this.time++;
            if (this.time === this.fire_rate) {
                this.on_cooldown = false;
                this.time = 0;
            }
        }
    }

    shoot() {
        if ( !this.on_cooldown ) {
            const ammo = new bullet( this.bullet_mesh.clone());
            ammo.mute(this.muted);
            ammo.position.set(this.position.x, this.position.y, this.position.z);
            ammo.rotation.set( 0, 0, this.rotation.z );
            ammo.source = this;
            ammo.speed.set( -2 * Math.sin( this.rotation.z ), 2 * Math.cos( this.rotation.z ), 0 );
            this.shoot_left = !this.shoot_left;
            this.parent.add( ammo );
            this.on_cooldown = true;
        }
    }

    handle_collision(target) {
        if (target.type === "bullet" && target.source !== this) {
            this.is_dead = true;
        } else if (target.type === "meteor") {
            this.is_dead = true;
        }
    }

}

export default enemie_ship;