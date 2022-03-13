

class game_level {

    static lvls = new Array();
    static current_lvl = -1;

    camera_follow_player = false;
    camera_stay_center = true;

    status = "running"; // can be running | win | loose | pause
    time = 0;

    score = 0;
    player = {};

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
        // Update if the lvl not pause
        if ( game_level.current_lvl === this.index && this.status !== "pause" ) {
            // Update scene object
            this.scene.children.forEach( obj => {
                if ( obj.is_collidable_object && !obj.is_dead ) {
                    obj.update( this.time );
                }
            });
            this.screen_exit_detection();
            this.update_camera();
            this.detect_collision();
            this.remove_dead_object();
            this.hud.set_score( this.score );
            if ( this.is_win() ) {
                this.status = "win";
            } else if ( this.is_loose() ) {
                this.status = "loose";
            }
            this.step();
        }
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
            objects.obj1.handle_collision( objects.obj2 );
            objects.obj2.handle_collision( objects.obj1 );
        });
    }

    resolve_collision(objec1, object2) {

    }

    /**
     * Update the camera
     * Do nothing if no parameter is given
     */
    update_camera() {
        // Update the camera
        if ( this.camera_follow_player ) {
            this.camera.position.x = this.model.player.position.x;
            this.camera.position.y = this.model.player.position.y;
        }
        if ( this.camera_stay_center ) {
            this.scene.children.forEach( obj => {
                if ( obj.is_collidable_object ) {
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
                //console.log( this.model.game_data.score );
                console.log( obj.type, "removed" );
            } else if ( obj.type === "ship" ) {
                //this.vue.generate_game_over();
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

}

export default game_level;