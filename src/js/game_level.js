
import meteor from "./object3D/meteor.js";

class CAMERA {
    static CAMERA_FIX = 0;
    static CAMERA_FOLLOW = 1;
    static CAMERA_FIX_PLAYER_FIX = 2;
}

class game_level {

    static lvls = new Array();
    static current_lvl = -1;

    camera_status = CAMERA.CAMERA_FIX;

    muted = false;
    sounds = {};

    animations = {};

    time = 0;

    score = 0;
    player = {};

    materials = {};

    constructor( scene, camera, hud ) {
        this.scene = scene;
        this.camera = camera;
        this.hud = hud;
        game_level.lvls.push( this );
        this.index = game_level.lvls.indexOf( this );
    }
    
    /**
     * Update the scene
     */
    update() {
        // Update scene object
        this.scene.children.forEach( obj => {
            if ( obj.update) {
                obj.update();
            }
        });
        this.screen_exit_detection();
        this.update_camera();
        this.detect_collision();
        this.remove_dead_object();
        this.hud.set_score( this.score );
        this.hud.set_life( this.player.life );
        if ( this.is_win() ) {
            this.handle_win();
        } else if ( this.is_loose() ) {
            this.handle_loose();
        }
        Object.keys(this.animations).forEach(key => {
            this.animations[key].update();
        });
        this.step();
    }
    
    step() {
        this.time++;
    }

    /**
     * Detect a collision between 2 object in the scene
     */
    detect_collision() {
        const collisions = [];
        for ( let index = 0; index < this.scene.children.length; index++ ) {
            const obj1 = this.scene.children[index];
            if ( obj1.is_collidable_object && !obj1.is_dead ) {
                for ( let i = index + 1; i < this.scene.children.length; i++ ) {
                    const obj2 = this.scene.children[i];
                    if ( obj2.is_collidable_object && !obj2.is_dead ) {
                        // Compute bounding box
                        const obj1_BB = obj1.BB.clone().applyMatrix4( obj1.mesh.matrixWorld );
                        const obj2_BB = obj2.BB.clone().applyMatrix4( obj2.mesh.matrixWorld );
                        
                        // Compute bounding Sphere
                        const obj1_BS = obj1.BS.clone().applyMatrix4( obj1.mesh.matrixWorld );
                        const obj2_BS = obj2.BS.clone().applyMatrix4( obj2.mesh.matrixWorld );
                        
                        // Compute collisions
                        const collisionB = obj1_BB.intersectsBox( obj2_BB );
                        const collisionS = obj1_BS.intersectsSphere( obj2_BS );

                        if ( collisionB && collisionS ) {
                            collisions.push( {obj1: obj1, obj2: obj2} );
                        }
                    }
                }
            }
        }
        collisions.forEach( objects => {
            this.resolve_collision(objects.obj1, objects.obj2);
            objects.obj1.handle_collision( objects.obj2 );
            objects.obj2.handle_collision( objects.obj1 );
        });
    }

    /**
     * Update the camera
     * Do nothing if no parameter is given
     */
    update_camera() {
        // Update the camera
        if ( this.camera_status === CAMERA.CAMERA_FOLLOW ) {
            this.camera.position.x = this.player.position.x;
            this.camera.position.y = this.player.position.y;
        }
        if ( this.camera_status === CAMERA.CAMERA_FIX_PLAYER_FIX ) {
            this.camera.position.x = this.player.position.x;
            this.camera.position.y = this.player.position.y;
            this.scene.children.forEach( obj => {
                if (obj != this.camera) {
                    obj.position.x -= this.camera.position.x;
                    obj.position.y -= this.camera.position.y;
                }
            });
            this.camera.position.x = 0;
            this.camera.position.y = 0;
        }
    }

    /**
     * Detects if a collidable object is dead. If it's a dead object he is removed from the scene.
     */
    remove_dead_object() {
        const dead_object = [];
        this.scene.children.forEach( obj => {
            if ( obj.is_dead ) 
                dead_object.push( obj );
        });
        dead_object.forEach( obj => {
            if ( obj.type === "meteor" ) {
                this.score += 100;
                console.log( obj.type, "removed" );
            }
            this.dispose( obj );
        });
    }

    /**
     * Detects if an object leaves the screen. If the object comes out it is replaced on the other side
     */
    screen_exit_detection() {
        // compute the horizontal field of view
        const horinzontal_fov = 2 * THREE.Math.radToDeg( Math.atan( Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.aspect ) );
        // compute the width and the height at z = 0
        const width = Math.tan( THREE.Math.degToRad( horinzontal_fov ) / 2 ) * this.camera.position.z * 2;
        const height = Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.position.z * 2;
        for ( let obj of this.scene.children ) {
            if ( obj.is_collidable_object ) {
                // x axies
                if ( obj.position.x > this.camera.position.x + width / 2 ) {
                    obj.position.x -= width;
                } else if ( obj.position.x < this.camera.position.x + -width / 2 ) {
                    obj.position.x += width;
                }
                // y axis
                if ( obj.position.y > this.camera.position.y + height / 2 ) {
                    obj.position.y -= height;
                } else if ( obj.position.y < this.camera.position.y + -height / 2 ) {
                    obj.position.y += height;
                }
            }
        }
    }

    dispose( object ) {
        if ( object.geometry ) {
            object.geometry.dispose();
        }
        if ( object.material ) {
            if ( object.material instanceof Array ) {
                // for better memory management and performance
                object.material.forEach( material => material.dispose() );
            } else {
                // for better memory management and performance
                object.material.dispose();
            }
        }
        if ( object.parent ) {
            object.parent.remove( object );
        }
        if ( object.children.length > 0 ) {
            object.children.forEach( child => this.dispose( child ) );
        }
    }

    resolve_collision(obj1, obj2) {
        if (obj1.is_affected_by_physics && obj2.is_affected_by_physics) {
            if (!obj1.is_immune && !obj2.is_immune) {
                const obj1_direction = obj1.speed.clone().normalize();
                const obj1_magnitude_speed = obj1.speed.length();
                const obj2_direction = obj2.speed.clone().normalize();
                const obj2_magnitude_speed = obj2.speed.length();
                const collision_normal = new THREE.Vector3(obj1.position.x - obj2.position.x, obj1.position.y - obj2.position.y, 0).normalize();
                obj1_direction.add(collision_normal);
                obj1_direction.setLength(obj1_magnitude_speed);
                obj1.speed.copy(obj1_direction);
                collision_normal.multiplyScalar(-1);
                obj2_direction.add(collision_normal);
                obj2_direction.setLength(obj2_magnitude_speed);
                obj2.speed.copy(obj2_direction);
                obj1.update();
                obj2.update();
            }
        }
    }

    handle_win() {
        if (this.win_callback) {
            this.win_callback();
        }
    }

    handle_loose() {
        if (this.loose_callback) {
            this.loose_callback();
        }
    }

    /**
     * Clear the scene
     */
    clear_scene() {
        const scene_object = [ ...this.scene.children ];
        // Remove all background object
        scene_object.forEach( obj => {
            this.dispose( obj );
        });
        this.hud.clear();
    }

    spawn_meteor(model) {
        const horinzontal_fov = 2 * THREE.Math.radToDeg( Math.atan( Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.aspect ) );
        // compute the width and the height at z = 0
        const width = Math.tan( THREE.Math.degToRad( horinzontal_fov ) / 2 ) * this.camera.position.z * 2;
        const height = Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.position.z * 2;
        let mesh;
        switch(Math.floor(Math.random() * 2)) {
            case 0 :
                mesh = model.preloaded_mesh.rock_3.clone();
                break;
            case 1 :
                mesh = model.preloaded_mesh.rock_4.clone();
                break;
        }
        let posx, posy;
        if (Math.round(Math.random()) === 1) {
            posx = Math.floor( Math.random() * width );
            posy = height / 2;
        } else {
            posx = width / 2;
            posy = Math.floor( Math.random() * height );
        }
        return new meteor(mesh, Math.random() * 2 - 1, Math.random() * 2 - 1, posx, posy, 3);
    }

    cheat_code_clear_meteor() {
        const meteors = new Array();
        this.scene.children.forEach( child => {
            if (child.type === "meteor") {
                meteors.push(child);
            }
        });
        meteors.forEach( obj => {
            this.scene.remove(obj);
            this.dispose(obj);
        });
    }

    mute(mute) {
        this.muted = mute;
        Object.keys(this.sounds).forEach( key => {
            this.sounds[key].muted = this.muted;
        });
        Object.keys(this.animations).forEach( key => {
            this.animations[key].mute(this.muted);
        });
        this.scene.children.forEach( child => {
            if (child.mute) {
                child.mute(this.muted);
            }
        });
    }

    stopAudio() {
        Object.keys(this.sounds).forEach( key => {
            this.sounds[key].pause();
        });
    }

}

export {game_level, CAMERA};