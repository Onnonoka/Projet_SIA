
import hud from "./hud.js";
import ship from "./object3D/ship.js";
import meteor from "./object3D/meteor.js"
import rapide_fire from "./object3D/rapide_fire.js";
import shield from "./object3D/shield.js";
import extra_life from "./object3D/extra_life.js";
import dematerialize from "./object3D/dematerialize.js";

class vue {
    type = "vue";

    /**
     * Constructor
     * @param {object} model 
     */
    constructor( model ) {
        if ( model.type !== "model" )
            throw ("The model is not and model object!");

        this.model = model;

        this.scene = this.model.scene;
        this.camera = this.model.camera;
        // Create the hud
        this.hud = new hud();

    }

    /**
     * Updates rendering to new container size
     */
    resize() {
        this.model.render_config.w = this.model.render_config.container.clientWidth;
        this.model.render_config.h = this.model.render_config.container.clientHeight;
        this.camera.aspect = this.model.render_config.w / this.model.render_config.h;
        this.camera.updateProjectionMatrix();
        this.model.renderer.setSize( this.model.render_config.w, this.model.render_config.h );
    }

    /**
     * Renders the scene and the camera
     */
    render() {
        this.model.renderer.render( this.scene, this.camera );
    }

    /**
     * Generates the main menu
     */
    generate_menu() {
        // Creation of the skybox
        const skybox_material = [ ...this.model.preloaded_materials.skybox_2 ];
        const skybox = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000 ), skybox_material );
        this.scene.add( skybox );

        // Added title
        const title = this.model.preloaded_mesh.title.clone();
        title.scale.set( 40, 40, 40 );
        title.position.y = 30;
        title.rotation.x = THREE.Math.degToRad( 90 );
        this.scene.add( title );

        // Added earth
        const earth = new THREE.Group();
        const earth_ground = this.model.preloaded_mesh.earth_ground.clone( false );
        const earth_cloud = this.model.preloaded_mesh.earth_cloud.clone( false );
        earth.add( earth_ground );
        earth.add( earth_cloud );
        earth_cloud.scale.set( 1.01, 1.01, 1.01 );
        earth.scale.set( 160, 160, 160 );
        earth.rotation.x = THREE.Math.degToRad( -90 );
        earth.position.z = -1000;
        //this.scene_object.background.earth.position.x = -500;
        //this.scene_object.background.earth.position.y = 500;
        this.scene.add( earth );

        // Added stage lights
        const ambiant_light = new THREE.AmbientLight( 0xffffff, 1.0 );
        this.scene.add( ambiant_light );
        const directional_light = new THREE.DirectionalLight( 0xffffff, 1.0 );
        directional_light.position.z = 10;
        directional_light.position.x = -40; 
        directional_light.position.y = 15;
        this.scene.add( directional_light );
        this.scene.add( directional_light.target );

        // Added the player
        const player_mesh = this.model.preloaded_mesh.ship_14.clone();
        player_mesh.rotation.x = THREE.Math.degToRad( 90 );
        player_mesh.rotation.y = THREE.Math.degToRad( 180 );
        const player = new ship( player_mesh );
        this.model.player = player;
        this.scene.add( player );

        // Set the hud
        this.hud.set_action_request( "Press start" );

        // Place the camera
        this.camera.position.set( 0, 0, 90 );
    }

    /**
     * Generate the first level of the game
     */
    generate_lvl_1() {
        // Creation of the skybox
        const skybox_material = [ ...this.model.preloaded_materials.skybox_2 ];
        const skybox = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000 ), skybox_material );
        this.scene.add( skybox );

        /*// Added earth
        const earth = new THREE.Group();
        const earth_ground = this.model.preloaded_mesh.earth_ground.clone();
        const earth_cloud = this.model.preloaded_mesh.earth_cloud.clone();
        earth.add( earth_ground );
        earth.add( earth_cloud );
        earth_cloud.scale.set( 1.01, 1.01, 1.01 );
        earth.scale.set( 160, 160, 160 );
        earth.rotation.x = THREE.Math.degToRad( -90 );
        earth.position.z = -1000;
        //this.scene_object.background.earth.position.x = -500;
        //this.scene_object.background.earth.position.y = 500;
        this.scene.add( earth );*/

        // Added stage lights
        const ambiant_light = new THREE.AmbientLight( 0xffffff, 1.0 );
        const directional_light = new THREE.DirectionalLight( 0xffffff, 1.0 );
        /*const spot_light = new THREE.SpotLight( 0xffffff, 1, 0, THREE.degToRad( 20 ), 1 );
        spot_light.position.set( this.camera.position.x, this.camera.position.y, this.camera.position.z );
        this.scene.add( spot_light );
        console.log( spot_light );*/
        this.scene.add( ambiant_light );
        directional_light.position.z = 10;
        directional_light.position.x = -40; 
        directional_light.position.y = 15;
        this.scene.add( directional_light );
        this.scene.add( directional_light.target );

        // Added the player
        const player_mesh = this.model.preloaded_mesh.ship_14.clone();
        player_mesh.rotation.x = THREE.Math.degToRad( 90 );
        player_mesh.rotation.y = THREE.Math.degToRad( 180 );
        const player = new ship( player_mesh );
        this.model.player = player;
        this.scene.add( player );

        const horinzontal_fov = 2 * THREE.Math.radToDeg( Math.atan( Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.aspect ) );
        // compute the width and the height at z = 0
        const width = Math.tan( THREE.Math.degToRad( horinzontal_fov ) / 2 ) * this.camera.position.z * 2;
        const height = Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.position.z * 2;
        for ( let i = 0; i < 8; i++ ) {
            const meteor_object = new meteor( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.floor( Math.random() * width ) - width / 2, 
                                        Math.floor( Math.random() * height ) - height / 2, 3 );
            this.scene.add( meteor_object );
        }

        /*const upgrade = new rapide_fire();
        this.scene.add( upgrade );*/
        const upgrade2 = new shield();
        this.scene.add( upgrade2 );
        /*const upgrade3 = new extra_life();
        this.scene.add( upgrade3 );
        const upgrade4 = new dematerialize();
        this.scene.add( upgrade4 );*/

        // Place the camera
        this.camera.position.set( 0, 0, 90 );

        this.model.game_status.in_lvl = true;
        this.model.current_lvl = 1;

        const gridHelper = new THREE.GridHelper( 10000, 1000 );
        gridHelper.rotation.x = THREE.Math.degToRad( 90 );
        this.scene.add( gridHelper );
    }

    /**
     * Update the scene
     */
    update() {
        // Update scene object
        this.scene.children.forEach( obj => {
            if ( obj.is_collidable_object && !obj.is_dead ) {
                obj.update();
            }
        });
        this.hud.set_score( this.model.game_data.score );
        this.screen_exit_detection();
        this.update_camera();
        if ( this.model.game_status.detect_collision )
            this.detect_collision();
        this.remove_dead_object();
    }

    /**
     * Update the camera
     * Do nothing if no parameter is given
     */
    update_camera() {
        // Update the camera
        if ( this.model.game_status.camera_follow_player ) {
            this.camera.position.x = this.model.player.position.x;
            this.camera.position.y = this.model.player.position.y;
        } else if ( this.model.game_status.everything_mouve ) {
            this.camera.position.x = this.model.player.position.x;
            this.camera.position.y = this.model.player.position.y;
            this.model.scene_object.foreground.forEach( obj => {
                if ( obj.is_collidable_object ) {
                    obj.position.x -= this.camera.position.x;
                    obj.position.y -= this.camera.position.y;
                }
            });
            this.camera.position.x = 0;
            this.camera.position.y = 0;
        }
    }

    set_phong_materials() {
        const player_mat = this.model.scene_object.foreground.player.mesh.material;
        const phong_mat = new THREE.MeshStandardMaterial().copy(player_mat);
        this.model.scene_object.foreground.player.mesh.material = phong_mat;
    }

    /**
     * Detects if a collidable object is dead. If it's a dead object he is removed from the scene.
     */
    remove_dead_object() {
        const dead_object = [];
        this.scene.children.forEach( obj => {
            if ( obj.is_collidable_object && obj.is_dead ) 
                dead_object.push( obj );
        });
        dead_object.forEach( obj => {
            if ( obj.type === "meteor" ) {
                this.model.game_data.score += 100;
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
                            collisions.push( {obj1: obj1, obj2, obj2} );
                        }
                    }
                }
            }
        }
        collisions.forEach( objects => {
            objects.obj1.handle_collision( objects.obj2 );
            objects.obj2.handle_collision( objects.obj1 );
        })
    }

    /**
     * Clear the scene
     */
    clear_scene() {
        this.model.game_status.in_start_menu = false;
        this.model.game_status.in_lvl = false;
        const scene_object = [ ...this.scene.children ];
        // Remove all background object
        scene_object.forEach( obj => {
            this.dispose( obj );
        });
        this.hud.clear();
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

export default vue;