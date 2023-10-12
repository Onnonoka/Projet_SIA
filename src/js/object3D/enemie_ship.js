import * as THREE from 'three';
import { degToRad } from 'three/src/math/mathutils';

import movable_mesh from "./movable_mesh.js";
import bullet from "./bullet.js";
import ship_explosion_animation from "../animations/ship_explosion_animation.js";

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
        const size = new THREE.Vector3();
        this.BB.getSize(size);
        this.position.z = size.y / 2;
        const bullet_geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
        const bullet_material = new THREE.MeshStandardMaterial( {
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 100
        } );
        this.bullet_mesh = new THREE.Mesh(bullet_geometry, bullet_material);
        const booster_geometry = new THREE.ConeGeometry(0.5, 5, 8);
        const booster_material = new THREE.MeshStandardMaterial( {
            color: 0x3d91ff,
            emissive: 0x3d91ff,
            emissiveIntensity: 5
        } );
        this.booster = new THREE.Mesh(booster_geometry, booster_material);
        this.booster.rotation.set(0, 0, degToRad(180));
        this.booster.position.set(0, -size.x / 2 - 6.5, 0.7);
        this.booster.scale.set(0, 0, 0);
        this.booster_light = new THREE.PointLight( 0x2ba0ff, 5, 15 );
        this.booster_light.position.set(0, -size.x / 2, 0.7);
        //this.booster_light.visible = false;
        this.add(this.booster);
        this.add(this.booster_light);
        this.animations.explosion = new ship_explosion_animation(this, 4.5, 0.1, 0xffffff);
        this.animations.explosion.callback = () => {
            this.animations.explosion.reset();
            this.is_dead = true;
        }
    }


    update() {
        if (!this.is_dead) {
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
            if (d_target.angleTo(new THREE.Vector3(0, 1, 0)) < degToRad(5)) {
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
            let size = new THREE.Vector3();
            this.mesh.geometry.boundingBox.getSize(size);
            const direction = new THREE.Vector3(Math.sin( this.rotation.z ), Math.cos( this.rotation.z ), 0).normalize();
            const speed_direction = this.speed.clone().multiply(direction);
            this.booster.scale.set(1, speed_direction.length() / 0.65, 1);
            this.booster.position.set(0, -size.x / 2 - 6.5 * this.booster.scale.y, 0.7);
            this.booster_light.intensity = 5 * this.booster.scale.y;
        }
        Object.keys(this.animations).forEach(key => {
            this.animations[key].update();
        });
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
        if ((target.type === "bullet" && target.source !== this) || target.type === "meteor") {
            this.animations.explosion.start();
            this.mesh.visible = false;
            this.speed.set(0, 0, 0);
        }
    }

}

export default enemie_ship;