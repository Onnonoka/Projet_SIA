import { radToDeg } from 'three/src/math/mathutils';

import {game_level, CAMERA} from "./game_level.js";


class controler {
    type = "controler";

    /**
     * Constructor
     * @param {object} model the model
     * @param {object} vue the vue
     */
    constructor( model, vue ) {
        if ( model.type !== "model" )
            throw ( "The model is not and model object!" );
        if ( vue.type !== "vue" )
            throw ( "The vue is not and vue object!" );

        this.model = model;
        this.vue = vue;

        this.can_press = true;

        // going to be deleted
        //-------------------------------------------------------------------------------------------------
        /*this.controls = new THREE.TrackballControls( this.vue.camera, this.model.render_config.container );
        this.controls.target = new THREE.Vector3(0, 0, 0);
        this.controls.panSpeed = 1;
        this.controls.autoRotate = true;*/
        //-------------------------------------------------------------------------------------------------

        // Key controle
        window.onkeydown = e => {
            if ( e.repeat === false ) {
                this.model.key_press[ e.key ] = true;
                if (e.key === "Escape") {
                    this.vue.pause = !this.vue.pause;
                    if (this.vue.pause) {
                        this.vue.hud.set_message("PAUSE");
                    } else {
                        this.vue.hud.set_message("");
                    }
                } else if (e.key === "m") {
                    this.vue.change_mat(this.vue.scene);
                } else if (e.key === "o") {
                    this.vue.post_process_render = !this.vue.post_process_render;
                } else if (e.key === "0") {
                    if (game_level.lvls[game_level.current_lvl]) {
                        game_level.lvls[game_level.current_lvl].camera_status = CAMERA.CAMERA_FIX;
                    }
                } else if (e.key === "1") {
                    if (game_level.lvls[game_level.current_lvl]) {
                        game_level.lvls[game_level.current_lvl].camera_status = CAMERA.CAMERA_FOLLOW;
                    }
                } else if (e.key === "2") {
                    if (game_level.lvls[game_level.current_lvl]) {
                        game_level.lvls[game_level.current_lvl].camera_status = CAMERA.CAMERA_FIX_PLAYER_FIX;
                    }
                } else if (e.key === "i") {
                    if (!this.model.player.is_immune) {
                        this.model.player.active_dematerialize(true, 1*60);
                    } else {
                        this.model.player.animations.dematerialize.callback();
                    }
                } else if (e.key === "j") {
                    if (game_level.lvls[game_level.current_lvl]?.spawn_power_up) {
                        this.model.scene.add(game_level.lvls[game_level.current_lvl].spawn_power_up());
                    }
                } else if (e.key === "k") {
                    if (game_level.lvls[game_level.current_lvl]?.cheat_code_clear_meteor) {
                        game_level.lvls[game_level.current_lvl].cheat_code_clear_meteor();
                    }
                } else if (e.key === "h") {
                    if (this.vue.hud.help_visible) {
                        this.vue.pause = false;
                    } else {
                        this.vue.pause = true;
                    }
                    this.vue.hud.displayHelp();
                } else if (e.key === "f") {
                    this.vue.fullscreen();
                } else if (e.key === "s") {
                    this.vue.mute();
                } else if (e.key === "p") {
                    window.print();
                } else if (e.key === " " && this.model.game_status.is_loose) {
                    this.model.game_status.is_loose = false;
                    game_level.lvls[game_level.current_lvl].stopAudio();
                    this.vue.hud.clear_hud();
                    this.vue.generate_menu();
                    this.can_press = false;
                    setTimeout( () => {this.can_press = true}, 1000 );
                }
            }
        };
        window.onkeyup = e => {
            this.model.key_press[ e.key ] = false;
        };

        // On resize
        window.addEventListener( 'resize', this.vue.resize.bind( this.vue ) );
    }

    start() {
        if ( this.model.preloaded_mesh.is_loaded && this.model.preloaded_materials.is_loaded ) {
            this.vue.generate_menu();
            this.animate();
        } else {
            setTimeout( this.start.bind( this ), 0 );
        }
    }

    animate() {
        requestAnimationFrame( this.animate.bind( this ) );
        // Going to be deleted
        //--------------------------------------------------
        //this.controls.update();
        //--------------------------------------------------
        this.vue.render();
        this.vue.update();
        this.handle_key();
    }

    handle_key() {
        // Handle key press in the menu
        if ( this.model.game_status.in_start_menu ) {
            if ( this.model.key_press[ " " ] && this.can_press) {
                if (game_level.lvls[game_level.current_lvl]?.change_screen) {
                    game_level.lvls[game_level.current_lvl].change_screen();
                }
            }
        // Handle key press in game
        } else if ( this.model.game_status.in_lvl ) {
            if (!this.vue.pause) {
                // key space
                if ( this.model.key_press[ " " ] ) {
                    this.model.player.shoot();
                }
                // key left
                if ( this.model.key_press[ "ArrowLeft" ] ) {
                    this.model.player.rotate_axies( 0, 0, radToDeg( 0.05 ) );
                }
                // key right
                if ( this.model.key_press[ "ArrowRight" ] ) {
                    this.model.player.rotate_axies( 0, 0, radToDeg( -0.05 ) );
                }
                // key up
                if ( this.model.key_press[ "ArrowUp" ] ) {
                    this.model.player.max_speed = 0.6;
                    this.model.player.speed_up();
                } else {
                    this.model.player.max_speed = 0.35;
                }
                // key down
                if ( this.model.key_press[ "ArrowDown" ] ) {
                    this.model.player.max_speed = 0.6;
                    this.model.player.speed_down();
                }
            }
        }
    }
}

export default controler;