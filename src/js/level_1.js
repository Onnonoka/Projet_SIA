import {game_level} from "./game_level.js";
import ship from "./object3D/ship.js";
import power_up from "./object3D/power_up.js";
import fade_animation from "./animations/fade_animation.js";
import start_lvl_animation from "./animations/start_lvl_animation.js";
import end_lvl_animation from "./animations/end_lvl_animation.js";

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
        player.position.set(0, 10000, player.position.z);
        player.is_lock = true;
        this.scene.add( player );
        
        for ( let i = 0; i < 1; i++ ) {
            const meteor_object = this.spawn_meteor(model);
            this.scene.add( meteor_object );
        }

        // Place the camera
        this.camera.position.set( 0, 0, 110 );

        const gridHelper = new THREE.GridHelper( 10000, 1000 );
        gridHelper.rotation.x = THREE.Math.degToRad( 90 );
        this.scene.add( gridHelper );

        this.animations.start = new start_lvl_animation(this);
        this.animations.fade = new fade_animation(this);
        this.animations.fade.reverse = true;
        this.animations.fade.go_to(this.animations.fade.animation_duration);
        this.animations.fade.callback = () => {
            this.animations.start.start();
            this.hud.start_hud_anim();
        }
        this.animations.end = new end_lvl_animation(this);
        this.animations.end.callback = () => {
            this.animations.fade.reset();
            this.animations.fade.start();
        }
        this.animations.fade.start();

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
        if (this.time % (60*30) === 0) {
            const bonus = this.spawn_power_up();
            this.scene.add(bonus);
        }
    }
    
    spawn_power_up() {
        const horinzontal_fov = 2 * THREE.Math.radToDeg( Math.atan( Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.aspect ) );
        // compute the width and the height at z = 0
        const width = Math.tan( THREE.Math.degToRad( horinzontal_fov ) / 2 ) * this.camera.position.z * 2;
        const height = Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.position.z * 2;
        let bonus;
        switch(Math.floor(Math.random() * 4)) {
            case 0 :
                bonus = new power_up("dematerialize", 0xeeeeee);
                break;
            case 1 :
                bonus = new power_up("extra_life", 0xFF2020);
                break;
            case 2 :
                bonus = new power_up("rapide_fire", 0x00ff00);
                break;
            case 3 :
                bonus = new power_up("shield", 0x0074FF);
                break;
        }
        bonus.position.set(Math.floor( Math.random() * width ),  Math.random() * height);
        return bonus;
    }

    handle_win() {
        if (!this.animations.end.is_started) {
            this.animations.end.reset();
            this.animations.fade.callback = () => {
                super.handle_win();
            }
            this.animations.end.start();
        }
    }

}

export default level_1;