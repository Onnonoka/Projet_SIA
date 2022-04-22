import {game_level} from "./game_level.js";
import ship from "./object3D/ship.js";
import power_up from "./object3D/power_up.js";
import fade_animation from "./animations/fade_animation.js";
import start_lvl_animation from "./animations/start_lvl_animation.js";
import end_lvl_animation from "./animations/end_lvl_animation.js";
import text_animations from "./animations/text_animations.js";
import enemie_ship from "./object3D/enemie_ship.js";
import burning_meteor from "./object3D/burning_meteor.js";
import danger_area from "./object3D/danger_area.js";

class level_3 extends game_level {

    constructor( scene, camera, hud ) {
        super( scene, camera, hud );
    }

    build( model ) {
        // Creation of the skybox
        const skybox_material = [ ...model.preloaded_materials.skybox_1 ];
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
        this.player = player;
        
        for ( let i = 0; i < 5; i++ ) {
            const meteor_object = this.spawn_meteor(model);
            this.scene.add( meteor_object );
        }
        this.burning_rock = model.preloaded_mesh.burning_rock.clone();
        this.enemie_ship = model.preloaded_mesh.enemie_ship.clone();
        this.enemie_ship.rotation.x = THREE.Math.degToRad( 90 );
        this.enemie_ship.rotation.y = THREE.Math.degToRad( 180 );

        // Place the camera
        this.camera.position.set( 0, 0, 110 );
        this.hud.set_life(this.player.life);

        this.animations.start = new start_lvl_animation(this);
        this.animations.start.callback = () => {
            this.sounds.bgm.play();
        }
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
        this.animations.next = new text_animations(this);
        this.animations.next.callback = () => {
            this.animations.fade.start();
        }
        this.animations.next.start();
        this.sounds.warning = new Audio("src/medias/sounds/warning.mp3");
        this.sounds.warning.volume = 0.8;
        this.sounds.warning.muted = this.muted;
        this.sounds.bgm = new Audio("src/medias/sounds/bgm_lvl3.mp3");
        this.sounds.bgm.volume = 0.1;
        this.sounds.bgm.muted = this.muted;
        this.soundLoopInterval = setInterval( () => {
            if (this.sounds.bgm.currentTime >= this.sounds.bgm.duration - 1) {
                console.log("looped");
                this.sounds.bgm.currentTime = 48;
            }
        }, 0);

        this.score = 0;

        game_level.current_lvl = this.index;

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
        if (this.time % (60*60) === 0) {
            this.spawn_enemie();
        }
        if (this.time % (60*40) === 0) {
            this.spawn_burning_rock();
            this.sounds.warning.play();
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
        if (!this.animations.end.is_started && !this.hud.is_end_menu_open) {
            this.animations.end.reset();
            this.animations.end.callback = () => {
                this.stopAudio();
                super.handle_win();
            }
            this.animations.end.start();
        }
    }

    spawn_enemie() {
        const enemie = new enemie_ship(this.enemie_ship.clone(), this.player);
        const horinzontal_fov = 2 * THREE.Math.radToDeg( Math.atan( Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.aspect ) );
        // compute the width and the height at z = 0
        const width = Math.tan( THREE.Math.degToRad( horinzontal_fov ) / 2 ) * this.camera.position.z * 2;
        const height = Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.position.z * 2;
        let posx, posy;
        if (Math.round(Math.random()) === 1) {
            posx = Math.floor( Math.random() * width );
            posy = height / 2;
        } else {
            posx = width / 2;
            posy = Math.floor( Math.random() * height );
        }
        enemie.position.set(posx,  posy, 0);
        this.scene.add(enemie);
    }

    spawn_burning_rock() {
        const horinzontal_fov = 2 * THREE.Math.radToDeg( Math.atan( Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.aspect ) );
        // compute the width and the height at z = 0
        const width = Math.tan( THREE.Math.degToRad( horinzontal_fov ) / 2 ) * this.camera.position.z * 2;
        const height = Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.position.z * 2;

        const burning_rock = new burning_meteor(this.burning_rock.clone());
        burning_rock.position.set(Math.floor( Math.random() * width ), Math.floor( Math.random() * height ), this.camera.position.z * 1.5);
        this.scene.add(burning_rock);
        const danger_zone = new danger_area(burning_rock.mesh.geometry.boundingSphere.radius * burning_rock.mesh.scale.x);
        danger_zone.position.set(burning_rock.position.x, burning_rock.position.y, 0);
        burning_rock.setDanger_zone(danger_zone);
        this.scene.add(danger_zone);
    }

}

export default level_3;