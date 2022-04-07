import game_level from "./game_level.js";
import ship from "./object3D/ship.js";

class main_menu extends game_level {
    
    constructor(scene, camera, hud) {
        super(scene, camera, hud);
    }

    build(model) {
        // Creation of the skybox
        const skybox_material = [ ...model.preloaded_materials.skybox_2 ];
        const skybox = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000 ), skybox_material );
        this.scene.add( skybox );

        // Added title
        const title = model.preloaded_mesh.title.clone();
        title.scale.set( 40, 40, 40 );
        title.position.y = 30;
        title.rotation.x = THREE.Math.degToRad( 90 );
        this.scene.add( title );

        // Added earth
        const earth = new THREE.Group();
        const earth_ground = model.preloaded_mesh.earth_ground.clone( false );
        const earth_cloud = model.preloaded_mesh.earth_cloud.clone( false );
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
        const player_mesh = model.preloaded_mesh.ship_14.clone();
        player_mesh.rotation.x = THREE.Math.degToRad( 90 );
        player_mesh.rotation.y = THREE.Math.degToRad( 180 );
        const player = new ship( player_mesh );
        model.player = player;
        this.scene.add( player );

        // Set the hud
        this.hud.set_action_request( "Press start" );

        // Place the camera
        this.camera.position.set( 0, 0, 90 );
    }

    update() {
        this.step();
    }
}

export default main_menu;