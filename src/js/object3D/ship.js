import movable_mesh from "./movable_mesh.js";
import bullet from "./bullet.js";
import dematerialize_animation from "../animations/dematerialize_animation.js";
import shield_animation from "../animations/shield_animation.js";
import death_animation from "../animations/death_animation.js";
import animation from "../animations/animation.js";
import ship_explosion_animation from "../animations/ship_explosion_animation.js";

/**
 * 
 */
class ship extends movable_mesh {

    max_speed = 0.35;

    on_cooldown = false;
    shoot_left = true;
    fire_rate = 30;

    is_immune = false;
    is_protected = false;

    is_lock = false;

    life = 3

    animations = {};
    time = 0;
    
    /**
     * Constructor
     */
    constructor( ship ) {
        super( "ship", ship );
        
        // mesh parameter
        const size = new THREE.Vector3();
        this.BB.getSize(size);
        this.position.z = size.y / 2;

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

        this.animations.dematerialize = new dematerialize_animation(this);
        this.animations.dematerialize.callback = () => {
            this.animations.dematerialize.reset();
            this.animations.dematerialize.go_to(this.animations.dematerialize.animation_duration - 2);
            this.animations.dematerialize.is_started = true;
            this.animations.dematerialize.step();
            this.animations.dematerialize.is_started = false;
            this.animations.dematerialize.reset();
            this.is_immune = false;
            this.is_affected_by_physics = true;
        }
        this.animations.shield = new shield_animation(this);
        this.animations.shield.callback = () => {
            this.animations.shield.reset();
            this.is_protected = false;
            this.BB = this.mesh.geometry.boundingBox;
            this.BS = this.mesh.geometry.boundingSphere;
        }
        this.animations.death = new death_animation(this);
        this.animations.death.callback = () => {
            this.is_collidable_object = true;
            this.is_affected_by_physics = true;
            this.is_lock = false;
            this.animations.death.reset();
            this.active_dematerialize();    
        }
        this.animations.rapide_fire = new animation(60*5);
        this.animations.rapide_fire.callback = () => {
            this.animations.rapide_fire.reset();
            this.fire_rate *= 2;
        }
        this.animations.explosion = new ship_explosion_animation(this);
        this.animations.explosion.callback = () => {
            this.animations.explosion.reset();
        }
        this.sounds.sound = new Audio("src/medias/sounds/booster_1.mp3");
        this.sounds.sound.loop = true;
        this.sounds.sound.play();
        setInterval(() => {
            if (this.sounds.sound.currentTime >= this.sounds.sound.duration - 1) {
                this.sounds.sound.currentTime = 0; 
            }
        }, 0);

    }

    /**
     * Accelerate
     */
    speed_up() {
        if (!this.is_lock) {
            this.speed.x -= 0.01 * Math.sin( this.rotation.z );
            this.speed.y += 0.01 * Math.cos( this.rotation.z );
        }
    }

    /**
     * Deccelerate
     */
    speed_down() {
        if (!this.is_lock) {
            this.speed.x += 0.01 * Math.sin( this.rotation.z );
            this.speed.y -= 0.01 * Math.cos( this.rotation.z );
        }
    }

    update() {
        this.normalize_speed( this.max_speed );
        this.mouve_axies(this.speed.x, this.speed.y, this.speed.z);
        if (this.max_speed === 0.35) {
            this.booster.scale.set(0, 0, 0);
            this.booster_light.intensity = 0;
        } else {
            let size = new THREE.Vector3();
            this.mesh.geometry.boundingBox.getSize(size);
            const direction = new THREE.Vector3(Math.sin( this.rotation.z ), Math.cos( this.rotation.z ), 0).normalize();
            const speed_direction = this.speed.clone().multiply(direction);
            this.booster.scale.set(1, speed_direction.length() / 0.65, 1);
            this.booster.position.set(0, -size.x / 2 - 6.5 * this.booster.scale.y, 0.7);
            this.booster_light.intensity = 5 * this.booster.scale.y;
            
        }
        this.sounds.sound.volume = 0.1 * this.booster.scale.y;
        if (this.on_cooldown) {
            this.time++;
            if (this.time >= this.fire_rate) {
                this.on_cooldown = false;
                this.time = 0;
            }
        }
        Object.keys(this.animations).forEach(key => {
            this.animations[key].update();
        });
    }

    /**
     * Spawn a bullet on the player ship position and direction
     */
    shoot() {
        console.log(this.fire_rate, this.on_cooldown);
            if ( !this.on_cooldown && this.visible && !this.is_lock ) {
                const mesh_size = new THREE.Vector3();
                this.BB.getSize( mesh_size );
                let bullet_x = Math.sin( THREE.Math.degToRad( 90 - THREE.Math.radToDeg(this.rotation.z) )  ) *  (mesh_size.x / 2 - 0.4);
                let bullet_y = Math.cos( THREE.Math.degToRad( 90 - THREE.Math.radToDeg(this.rotation.z) )  ) *  (mesh_size.x / 2 - 0.4);
                const ammo = new bullet( this.bullet_mesh.clone(), this.bullet_light.clone() );
                ammo.mute(this.muted);
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
            }
    }

    handle_collision( target ) {
        if ( ( target.type === "bullet" && target.source !== this || target.type === "meteor" || target.type === "burning_meteor" ) && this.visible && !this.is_immune && !this.is_protected ) {
            this.life--;
            this.speed.set( 0, 0, 0 );
            Object.keys(this.animations).forEach(key => {
                if (this.animations[key].is_started) {
                    this.animations[key].reset();
                    if (this.animations[key].callback) {
                        this.animations[key].callback();
                    }
                }
                
            });
            this.is_lock = true;
            this.is_affected_by_physics = false;
            this.is_collidable_object = false;
            if ( this.life < 1 ) {
                this.animations.explosion.callback = () => {
                    this.is_dead = true;
                }
            }
            this.animations.death.start();
            this.animations.explosion.start();
        } else if ( target.type === "power_up" && this.visible ) {
            console.log(target.action);
            switch(target.action) {
                case "dematerialize" : 
                    this.active_dematerialize();
                    break;
                case "shield" :
                    this.active_shield();
                    break;
                case "extra_life" :
                    this.active_extra_life();
                    break;
                case "rapide_fire" : 
                    this.active_rapide_fire();
                    break;
            }
        }
    }

    active_dematerialize(loop, breakpoint) {
        this.is_immune = true;
        this.is_affected_by_physics = false;
        this.animations.dematerialize.reset();
        this.animations.dematerialize.loop = loop? loop : false;
        if (breakpoint) {
            console.log(breakpoint, "OK");
            this.animations.dematerialize.set_breakpoint(breakpoint);
        }
        this.animations.dematerialize.start();
        console.log(this.animations.dematerialize);
    }

    active_shield(duration) {
        this.is_protected = true;
        this.BB = this.animations.shield.shield.geometry.boundingBox;
        this.BS = this.animations.shield.shield.geometry.boundingSphere;
        if (duration !== undefined) {
            this.animations.shield.set_duration(duration);
        }
        this.animations.shield.start();
    }

    active_extra_life() {
        this.life++;
    }

    active_rapide_fire(duration) {
        this.fire_rate /= 2;
        this.animations.rapide_fire.reset();
        if (duration !== undefined) {
            this.animations.rapide_fire.set_duration(duration);
        }
        this.animations.rapide_fire.start();
    }

    rotate_axies( x, y, z) {
        if (!this.is_lock) {
            super.rotate_axies(x, y, z);
        }
    }

}

export default ship;