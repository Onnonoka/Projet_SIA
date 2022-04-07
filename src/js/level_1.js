import game_level from "./game_level.js";
import ship from "./object3D/ship.js";
import shield from "./object3D/shield.js";

class level_1 extends game_level {

    constructor( scene, camera, hud ) {
        super( scene, camera, hud );
    }

    build( model ) {
        // Creation of the skybox
        const skybox_material = [ ...model.preloaded_materials.skybox_2 ];
        const skybox = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000 ), skybox_material );
        this.scene.add( skybox );

        // Added stage lights
        const ambiant_light = new THREE.AmbientLight( 0xffffff, 1.0 );
        const directional_light = new THREE.DirectionalLight( 0xffffff, 1.0 );
        this.scene.add( ambiant_light );
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
        this.scene.add( player );
        
        for ( let i = 0; i < 8; i++ ) {
            const meteor_object = this.spawn_meteor();
            this.scene.add( meteor_object );
        }

        const upgrade2 = new shield();
        this.scene.add( upgrade2 );

        // Place the camera
        this.camera.position.set( 0, 0, 90 );

        const gridHelper = new THREE.GridHelper( 10000, 1000 );
        gridHelper.rotation.x = THREE.Math.degToRad( 90 );
        this.scene.add( gridHelper );

        game_level.current_lvl = this.index;

        this.player = player;

        return player;
    }

    is_win() {
        return this.scene.children.filter( e => e.type === "meteor" ).length === 0;
    }

    is_loose() {
        return this.player.is_dead;
    }

    step() {
        super.step();
        if (this.time % (60*60) === 0) {
            const bonus = this.spawn_power_up();
            this.scene.add(bonus);
        }
    }

}

export default level_1;