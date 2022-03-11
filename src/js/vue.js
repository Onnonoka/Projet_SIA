
import hud from "./hud.js";
import ship from "./object3D/ship.js";
import meteor from "./object3D/meteor.js"
import rapide_fire from "./object3D/rapide_fire.js";
import shield from "./object3D/shield.js";
import extra_life from "./object3D/extra_life.js";
import dematerialize from "./object3D/dematerialize.js";
import spot_light from "./object3D/spot_light.js";
import level_1 from "./level_1.js";
import level_2 from "./level_2.js";

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

        this.lvl_1 = new level_1( this.scene, this.camera, this.hud );
        this.lvl_2 = new level_2( this.scene, this.camera, this.hud );

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
        this.clear_scene();
        this.model.player = this.lvl_1.build( this.model );
        this.model.game_status.in_lvl = true;
    }

    generate_lvl_2() {
        this.clear_scene();
        this.model.player = this.lvl_2.build( this.model );
        this.model.game_status.in_lvl = true;
    }

    /**
     * Update the scene
     */
    update() {
        this.lvl_1.update();
        this.lvl_2.update();
    }

    set_phong_materials() {
        const player_mat = this.model.scene_object.foreground.player.mesh.material;
        const phong_mat = new THREE.MeshStandardMaterial().copy(player_mat);
        this.model.scene_object.foreground.player.mesh.material = phong_mat;
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