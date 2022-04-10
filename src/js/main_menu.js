import {game_level} from "./game_level.js";
import ship from "./object3D/ship.js";
import fade_animation from "./animations/fade_animation.js";
import power_up from "./object3D/power_up.js";
import neon_animation from "./animations/neon_animation.js";

class main_menu extends game_level {
    
    constructor(scene, camera, hud) {
        super(scene, camera, hud);
    }

    build(model) {
        // Creation of the skybox
        const skybox_material = [ ...model.preloaded_materials.skybox_3 ];
        const skybox = new THREE.Mesh( new THREE.BoxGeometry( 1000, 1000, 1000 ), skybox_material );
        this.skybox = skybox;
        this.scene.add( skybox );

        // Added title
        const title = model.preloaded_mesh.title.clone();
        title.material = new THREE.MeshBasicMaterial().copy(title.material);
        title.scale.set( 40, 40, 40 );
        title.position.y = 30;
        title.rotation.x = THREE.Math.degToRad( 90 );
        this.scene.add( title );

        // Added stage lights
        /*const ambiant_light = new THREE.AmbientLight( 0xffffff, 1.0 );
        this.scene.add( ambiant_light );*/
        const directional_light = new THREE.DirectionalLight( 0xffffff, 1.0 );
        directional_light.position.z = -30;
        directional_light.position.x = 40; 
        directional_light.position.y = -15;
        this.scene.add( directional_light );
        this.scene.add( directional_light.target );
        const point_light = new THREE.SpotLight( 0xffffff, 1, 200, THREE.Math.degToRad(20) );
        point_light.position.set(0, 0, 90);
        point_light.target.position.set(-100, 30, 0);
        point_light.moving_left = false;
        this.point_light = point_light;
        //this.scene.add(point_light);
        this.scene.add(point_light.target);

        // Added the player
       /* const player_mesh = model.preloaded_mesh.ship_14.clone();
        player_mesh.rotation.x = THREE.Math.degToRad( 90 );
        player_mesh.rotation.y = THREE.Math.degToRad( 180 );
        const player = new ship( player_mesh );
        model.player = player;
        this.scene.add( player );*/ 
        const planete = model.preloaded_mesh.planete_1.clone();
        planete.scale.set(80, 80, 80);
        planete.position.set(-500, 0, -1200);
        planete.rotation.x = 0.5;
        this.planete = planete;
        this.scene.add(planete);

        // Set the hud
        this.hud.set_action_request( "Press start" );

        // Place the camera
        this.camera.position.set( 0, 0, 90 );
        
        this.sound = new Audio("src/medias/sounds/bgm_main_menu.mp3");
        this.sound.volume = 0.2;
        this.sound.loop = true;

        this.animations.fade = new fade_animation(this);
        this.animations.fade.callback = () => {
            this.handle_win();
            this.sound.pause();
        }

        this.animations.title_neon_effect = new neon_animation(title);

        this.sound.play();
        
        game_level.current_lvl = this.index;
    }

    update() {
        super.update();
        this.planete.rotation.y += 0.0001;
        this.skybox.rotation.y += 0.00001
        if (this.point_light.moving_left) {
            this.point_light.target.position.x += 1;
            if (this.point_light.target.position.x >= 100) {
                this.point_light.moving_left = false;
            }
        } else {
            this.point_light.target.position.x -= 1;
            if (this.point_light.target.position.x <= -100) {
                this.point_light.moving_left = true;
            }
        }
    }

    change_screen() {
        if (!this.animations.fade.is_started) {
            this.animations.fade.reset();
            this.animations.fade.start();
        }
    }

    is_win() {
        return false;
    }

    is_loose() {
        return false;   
    }
}

export default main_menu;