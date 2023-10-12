import * as THREE from 'three';
import { degToRad } from 'three/src/math/Mathutils';
import { radToDeg } from 'three/src/math/Mathutils';

import movable_mesh from "./movable_mesh.js";
import ship_explosion_animation from "../animations/ship_explosion_animation.js";

class meteor extends movable_mesh {

    size = 0;

    /**
     * Constructor
     * @param {number} speed_x the initial speed on x cord
     * @param {number} speed_y the initial speed on x cord
     * @param {number} pos_x the initial x cord
     * @param {number} pos_y the initial y cord
     * @param {number} size The number of times it can decay
     */
    constructor( mesh, speed_x = 0, speed_y = 0, pos_x = 0, pos_y = 0, size = 1 ) {
        
        /*const geometrie = new THREE.DodecahedronGeometry( 3, 0);
        const material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
        const mesh = new THREE.Mesh( geometrie, material );*/
        super( "meteor", mesh );
        this.size = size;

        // meteor placement and speed
        this.scale.set( this.size, this.size, this.size );
        this.speed.set( speed_x, speed_y, 0 );
        this.speed.setLength( 0.3 / size );
        this.mouve_axies( pos_x, pos_y, 0 );
        this.animations.explosion = new ship_explosion_animation(this, 3, 0.02, 0x2e2e2e);
        this.animations.explosion.callback = () => {
            this.animations.explosion.reset();
            this.is_dead = true;
        }
    }

    update( time ) {
        this.rotate_mesh( radToDeg( Math.random() / 100 ) * (4 - this.size), radToDeg(  Math.random() / 100 ) * (4 - this.size), 0 );
        this.mouve_axies( this.speed.x, this.speed.y, this.speed.z);
        Object.keys(this.animations).forEach(key => {
            this.animations[key].update();
        });
    }

    handle_collision( target ) {
        if ( target.type === "bullet" ) {
            if ( this.size > 1 ) {
                const speed = this.speed.clone().add( target.speed );
                const pos = this.position;
                this.parent.add( new meteor( this.mesh.clone(), speed.x, speed.y, pos.x, pos.y, this.size - 1 ) );
                this.parent.add( new meteor( this.mesh.clone(), -speed.y, speed.x, pos.x, pos.y, this.size - 1 ) );
                this.parent.add( new meteor( this.mesh.clone(), speed.y, -speed.x, pos.x, pos.y, this.size - 1 ) );
            }
            this.mesh.visible = false;
            this.scale.set(1, 1, 1);
            this.speed.set(0, 0, 0);
            this.animations.explosion.start();
            this.is_affected_by_physics = false;
            this.is_collidable_object = false;
        } 
    }
}

export default meteor;