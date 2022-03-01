
import hud from "./hud.js";
import ship from "./object3D/ship.js";
import bullet from "./object3D/bullet.js";
import meteor from "./object3D/meteor.js"

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

        // Create the scene
        this.scene = new THREE.Scene();
    
        // Create the camera
        this.camera = new THREE.PerspectiveCamera( 90, this.model.render_config.w / this.model.render_config.h, 1, 10000 );

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
        this.model.scene_object.background.skybox = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000 ), skybox_material );
        this.scene.add( this.model.scene_object.background.skybox );

        // Added title
        const title = this.model.preloaded_mesh.title.clone();
        title.scale.set( 40, 40, 40 );
        title.position.y = 30;
        title.rotation.x = THREE.Math.degToRad( 90 );
        this.model.scene_object.background.title = title;
        this.scene.add( this.model.scene_object.background.title );

        // Added earth
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
        this.model.scene_object.background.earth = earth;
        this.scene.add( this.model.scene_object.background.earth );

        // Added stage lights
        //this.scene_object.lights.ambiant_light = new THREE.AmbientLight( 0xffffff, 7 );
        const directional_light = new THREE.DirectionalLight( 0xffffff, 5 );
        directional_light.position.z = 10;
        directional_light.position.x = -40; 
        directional_light.position.y = 15;       
        directional_light.position.multiplyScalar( 5.0 );
        directional_light.shadow.mapSize.width = 512;
        directional_light.shadow.mapSize.width = 512;
        directional_light.castShadow = true;
        //this.scene.add( this.scene_object.lights.ambiant_light );
        this.model.scene_object.lights.directional_light = directional_light;
        this.scene.add( this.model.scene_object.lights.directional_light );
        const dir_helper = new THREE.DirectionalLightHelper( directional_light, 1 );
        this.scene.add( dir_helper );

        // Added the player
        const player_mesh = this.model.preloaded_mesh.ship_14.clone();
        player_mesh.rotation.x = THREE.Math.degToRad( 90 );
        player_mesh.rotation.y = THREE.Math.degToRad( 180 );
        console.log(player_mesh.material);
        //player_mesh.material = new THREE.MeshStandardMaterial().copy( player_mesh.material );
        this.model.scene_object.foreground.player = new ship( player_mesh );
        this.scene.add( this.model.scene_object.foreground.player );

        console.log(player_mesh);

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
        this.model.scene_object.background.skybox = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000 ), skybox_material );
        this.scene.add( this.model.scene_object.background.skybox );

        // Added earth
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
        this.model.scene_object.background.earth = earth;
        this.scene.add( this.model.scene_object.background.earth );

        // Added stage lights
        //this.scene_object.lights.ambiant_light = new THREE.AmbientLight( 0xffffff, 7 );
        const directional_light = new THREE.DirectionalLight( 0xffffff, 1 );
        directional_light.position.z = 10;
        directional_light.position.x = -40; 
        directional_light.position.y = 15;       
        directional_light.position.multiplyScalar(5.0);
        directional_light.shadow.mapSize.width = 512;
        directional_light.shadow.mapSize.width = 512;
        directional_light.castShadow = true;
        //this.scene.add( this.scene_object.lights.ambiant_light );
        this.model.scene_object.lights.directional_light = directional_light;
        this.scene.add( this.model.scene_object.lights.directional_light );

        // Added the player
        const player_mesh = this.model.preloaded_mesh.ship_14.clone();
        player_mesh.rotation.x = THREE.Math.degToRad( 90 );
        player_mesh.rotation.y = THREE.Math.degToRad( 180 );
        player_mesh.geometry.normalizeNormals();
        this.model.scene_object.foreground.player = new ship( player_mesh );
        this.scene.add( this.model.scene_object.foreground.player );

        const horinzontal_fov = 2 * THREE.Math.radToDeg( Math.atan( Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.aspect ) );
        // compute the width and the height at z = 0
        const width = Math.tan( THREE.Math.degToRad( horinzontal_fov ) / 2 ) * this.camera.position.z * 2;
        const height = Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.position.z * 2;
        //this.scene.add( new meteor( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.floor( Math.random() * width ) - width / 2, Math.floor( Math.random() * height ) - height / 2, 3 ) );
        if ( !this.model.scene_object.foreground.meteor )
            this.model.scene_object.foreground.meteor = new Array();
        for ( let i = 0; i < 8; i++ ) {
            const meteor_object = new meteor( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.floor( Math.random() * width ) - width / 2, 
                                        Math.floor( Math.random() * height ) - height / 2, 3 );
            this.model.scene_object.foreground.meteor.push( meteor_object );
            this.scene.add( meteor_object );
        }

        // Place the camera
        this.camera.position.set( 0, 0, 90 );
    }

    /**
     * Update the scene
     */
    update() {
        this.clear_dead_bullet();
        Object.keys( this.model.scene_object.foreground ).forEach( ( key ) => {
            if ( Array.isArray( this.model.scene_object.foreground[ key ] ) ) {
                this.model.scene_object.foreground[key].forEach( ( object ) => {
                    object.update();
                });
            } else {
                this.model.scene_object.foreground[ key ].update();
            }
        });
        if ( this.model.game_status.detect_exit_screen )
            this.screen_exit_detection();
        if ( this.model.game_status.detect_collision )
            this.collision_detection();
        if ( this.model.game_status.camera_follow_player ) {
            this.camera.position.x = this.model.scene_object.foreground.player.position.x;
            this.camera.position.y = this.model.scene_object.foreground.player.position.y;
            /*this.camera.rotation.x = this.model.scene_object.foreground.player.position.x;
            this.camera.rotation.y = this.model.scene_object.foreground.player.position.y;
            console.log( this.camera );*/
        } else if ( this.model.game_status.everything_mouve ) {
            this.camera.position.x = this.model.scene_object.foreground.player.position.x;
            this.camera.position.y = this.model.scene_object.foreground.player.position.y;
            Object.keys( this.model.scene_object.foreground ).forEach( ( key ) => {
                if ( Array.isArray( this.model.scene_object.foreground[ key ] ) ) {
                    this.model.scene_object.foreground[ key ].forEach( ( object ) => {
                        object.position.x -= this.camera.position.x;
                        object.position.y -= this.camera.position.y;
                    });
                } else {
                    this.model.scene_object.foreground[ key ].position.x -= this.camera.position.x;
                    this.model.scene_object.foreground[ key ].position.y -= this.camera.position.y;
                }
            });
            this.camera.position.x = 0;
            this.camera.position.y = 0;
        }
    }
    
    /**
     * Rotate the player ship on the left
     */
    rotate_player_left() {
        this.model.scene_object.foreground.player.rotate_axies( 0, 0, THREE.Math.radToDeg( 0.05 ) );
    }

    /**
     * Rotate the player ship on the right
     */
    rotate_player_right() {
        this.model.scene_object.foreground.player.rotate_axies( 0, 0, THREE.Math.radToDeg( -0.05 ) );
    }

    /**
     * Spawn a bullet on the player ship position and direction
     */
    shoot() {
        const ammo = new bullet( this.model.scene_object.foreground.player.rotation.z, this.model.scene_object.foreground.player.position.x, 
            this.model.scene_object.foreground.player.position.y, this.model.scene_object.foreground.player );
        if ( !this.model.scene_object.foreground.bullet )
            this.model.scene_object.foreground.bullet = new Array();
        this.model.scene_object.foreground.bullet.push( ammo );
        this.scene.add( ammo );
    }

    /**
     * Set the max speed of the player ship
     * @param {number} max_speed 
     */
    set_player_max_speed( max_speed ) {
        this.model.scene_object.foreground.player.max_speed = max_speed;
    }

    /**
     * Incresse the speed of the player ship
     */
    speed_up_player() {
        this.model.scene_object.foreground.player.speed_up();
    }

    set_phong_materials() {
        const player_mat = this.model.scene_object.foreground.player.mesh.material;
        console.log(player_mat);
        const phong_mat = new THREE.MeshStandardMaterial().copy(player_mat);
        //THREE.MeshStandardMaterial.prototype.copy.call( phong_mat, player_mat );
        this.model.scene_object.foreground.player.mesh.material = phong_mat;
    }

    /**
     * Detects if a bullet is dead. If she is dead she is removed from the scene.
     */
    clear_dead_bullet() {
        if ( this.model.scene_object.foreground.bullet ) {
            const dead_bullet = [];
            this.model.scene_object.foreground.bullet.forEach( ( bullet ) => {
                if ( bullet.is_dead ) {
                    dead_bullet.push( bullet );
                }
            });
            dead_bullet.forEach( (bullet) => {
                const index = this.model.scene_object.foreground.bullet.indexOf( bullet );
                if ( index > -1 ) {
                    this.model.scene_object.foreground.bullet.splice( index, 1 );
                    this.scene.remove( bullet );
                }
            });
        }
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
        Object.keys( this.model.scene_object.foreground ).forEach( key => {
            const e = this.model.scene_object.foreground[ key ];
            const replace_object = ( object ) => {
                // x axies
                if ( object.position.x > this.camera.position.x + width / 2 ) {
                    object.position.x -= width;
                } else if ( object.position.x < this.camera.position.x + -width / 2 ) {
                    object.position.x += width;
                }
                // y axis
                if ( object.position.y > this.camera.position.y + height / 2 ) {
                    object.position.y -= height;
                } else if ( object.position.y < this.camera.position.y + -height / 2 ) {
                    object.position.y += height;
                }
            }
            // teleporte on the other side if the object is not in the camera frustum view
            if ( Array.isArray( e ) ) {
                e.forEach( object => {
                    replace_object( object );
                } );
            } else {
                replace_object( e );
            }
        } );
    }

    
    /**
     * Detect a collision between 2 object in the scene
     */
    collision_detection() {
        const collisions = [];
        const scene_object = [];
        Object.keys( this.model.scene_object.foreground ).forEach( key => {
            if ( Array.isArray( this.model.scene_object.foreground[ key ] ) ) {
                this.model.scene_object.foreground[ key ].forEach( e => {
                    scene_object.push( e );
                });
            } else {
                scene_object.push( this.model.scene_object.foreground[ key ] );
            }
        })
        scene_object.forEach( ( obj1, index ) => {
            if ( obj1.BB && obj1.BS ) {
                scene_object.slice( index + 1, scene_object.length ).forEach( obj2 => {
                    if ( obj2.BB && obj2.BS ) {
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
                            collisions.push( [ obj1, obj2 ] );
                        }
                    }
                } );
            }
        } );
        collisions.forEach( e => {
            e[ 0 ].handle_collision( e[ 1 ] );
            e[ 1 ].handle_collision( e[ 0 ] );
        } );
    }


    /**
     * Clear the scene
     */
    clear_scene() {
        // Remove all background object
        Object.keys( this.model.scene_object.background ).forEach( key => {
            this.scene.remove( this.model.scene_object.background[ key ] );
            delete( this.model.scene_object.background[ key ] );
        });
        // Remove all foreground object
        Object.keys( this.model.scene_object.foreground ).forEach( key => {
            if ( Array.isArray( this.model.scene_object.foreground[ key ] ) ) {
                this.model.scene_object.foreground[ key ].forEach( e => {
                    this.scene.remove( e );
                } );
            } else {
                this.scene.remove( this.model.scene_object.foreground[ key ] );
            }
            delete( this.model.scene_object.foreground[ key ] )
        });
        // Remove all light
        Object.keys( this.model.scene_object.lights ).forEach( key => {
            this.scene.remove( this.model.scene_object.lights[ key ] );
            delete( this.model.scene_object.lights[ key ] )
        });
        // reset the hud
        this.hud.clear();
    }
}

export default vue;