import game_level from "./game_level.js";
import ship from "./object3D/ship.js";
import meteor from "./object3D/meteor.js";
import rapide_fire from "./object3D/rapide_fire.js";
import shield from "./object3D/shield.js";
import extra_life from "./object3D/extra_life.js";
import dematerialize from "./object3D/dematerialize.js";

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

        const horinzontal_fov = 2 * THREE.Math.radToDeg( Math.atan( Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.aspect ) );
        // compute the width and the height at z = 0
        const width = Math.tan( THREE.Math.degToRad( horinzontal_fov ) / 2 ) * this.camera.position.z * 2;
        const height = Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.position.z * 2;
        for ( let i = 0; i < 8; i++ ) {
            const meteor_object = new meteor( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.floor( Math.random() * width ) - width / 2, 
                                        Math.floor( Math.random() * height ) - height / 2, 3 );
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
}

export default level_1;