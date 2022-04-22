import {game_level} from "./game_level.js";
import ship from "./object3D/ship.js";
import fade_animation from "./animations/fade_animation.js";
import power_up from "./object3D/power_up.js";
import neon_animation from "./animations/neon_animation.js";
import danger_area from "./object3D/danger_area.js";

class main_menu extends game_level {
    
    constructor(scene, camera, hud) {
        super(scene, camera, hud);
    }

    build(model) {
        // Creation of the skybox
        const skybox_material = [ ...model.preloaded_materials.skybox_3 ];
        const skybox = new THREE.Mesh( new THREE.BoxGeometry( 3000, 3000, 3000 ), skybox_material );
        this.skybox = skybox;
        this.scene.add( skybox );
        console.log(skybox);

        // Added title
        const title = model.preloaded_mesh.title.clone();
        title.material = new THREE.MeshBasicMaterial().copy(title.material);
        title.scale.set( 30, 30, 30 );
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

        const planete = model.preloaded_mesh.planete_1.clone();
        planete.scale.set(80, 80, 80);
        planete.position.set(-500, 0, -1200);
        planete.rotation.x = 0.5;
        this.planete = planete;
        this.scene.add(planete);

        // Set the hud
        this.hud.set_action_request( "Press space" );

        // Place the camera
        this.camera.position.set( 0, 0, 90 );
        
        this.sounds.sound = new Audio("src/medias/sounds/bgm_pause.mp3");
        this.sounds.sound.volume = 0.2;
        this.sounds.sound.loop = true;

        this.animations.fade = new fade_animation(this);
        this.animations.fade.callback = () => {
            this.handle_win();
            this.sounds.sound.pause();
        }

        this.animations.title_neon_effect = new neon_animation(title);

        this.sounds.sound.play();
        
        game_level.current_lvl = this.index;
    }

    update() {
        super.update();
        this.planete.rotation.y += 0.0001;
        this.skybox.rotation.y += 0.00001
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