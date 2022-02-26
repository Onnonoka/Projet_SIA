
import hud from "./hud.js";
import ship from "./ship.js";
import bullet from "./bullet.js";

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
        this.model.renderer.setSize(this.model.render_config.w, this.model.render_config.h);
    }

    /**
     * Renders the scene and the camera
     */
    render() {
        this.model.renderer.render(this.scene, this.camera);
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
        const directional_light = new THREE.DirectionalLight( 0xffffff, 7 );
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
        player_mesh.rotation.y = THREE.Math.degToRad(180);
        this.model.scene_object.foreground.player = new ship( player_mesh );
        this.scene.add( this.model.scene_object.foreground.player );

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
        const directional_light = new THREE.DirectionalLight( 0xffffff, 7 );
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
        player_mesh.rotation.y = THREE.Math.degToRad(180);
        this.model.scene_object.foreground.player = new ship( player_mesh );
        this.scene.add( this.model.scene_object.foreground.player );

        // Set the hud
        this.hud.set_action_request( "" );

        // Place the camera
        this.camera.position.set( 0, 0, 90 );
    }

    /**
     * Update the scene
     */
    update() {
        const bullet_dead = [];
        Object.keys( this.model.scene_object.foreground ).forEach( ( key ) => {
            if ( key === "bullet" ) {
                this.model.scene_object.foreground[key].forEach( ( bullet, index ) => {
                    bullet.update();
                    if ( bullet.is_dead ) {
                        bullet_dead.push( bullet );
                    }
                });
            } else {
                this.model.scene_object.foreground[key].update();
            }
        });
        bullet_dead.forEach( (bullet) => {
            const index = this.model.scene_object.foreground.bullet.indexOf( bullet );
            if (index > -1) {
                this.model.scene_object.foreground.bullet.splice(index, 1);
                this.scene.remove( bullet );
            }
        });
    }
    
    /**
     * Rotate the player ship on the left
     */
    rotate_player_left() {
        this.model.scene_object.foreground.player.rotate_axies( 0, 0, THREE.Math.radToDeg(0.05) );
    }

    /**
     * Rotate the player ship on the right
     */
    rotate_player_right() {
        this.model.scene_object.foreground.player.rotate_axies( 0, 0, THREE.Math.radToDeg(-0.05) );
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

    /**
     * Clear the scene
     */
    clear_scene() {
        Object.keys( this.model.scene_object.background ).forEach( (key) => {
            this.scene.remove( this.model.scene_object.background[key] );
            delete( this.model.scene_object.background[key] );
        });
        Object.keys( this.model.scene_object.foreground ).forEach( (key) => {
            this.scene.remove( this.model.scene_object.foreground[key] );
            delete( this.model.scene_object.foreground[key] )
        });
        Object.keys( this.model.scene_object.lights ).forEach( (key) => {
            this.scene.remove( this.model.scene_object.lights[key] );
            delete( this.model.scene_object.lights[key] )
        });
    }
}

export default vue;