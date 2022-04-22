
import hud from "./hud.js";
import {game_level} from "./game_level.js";
import level_1 from "./level_1.js";
import level_2 from "./level_2.js";
import level_3 from "./level_3.js";
import main_menu from "./main_menu.js";

class vue {
    type = "vue";

    pause = false;
    is_fullscreen = false;

    muted = false;

    post_process_render = true;

    stored_mat = {};

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

        const audio = new Audio("src/medias/sounds/game_over.mp3");
        audio.volume = 0.2;

        this.main_menu = new main_menu( this.scene, this.camera, this.hud );
        this.main_menu.win_callback = () => {
            this.generate_lvl_1();
        }
        this.lvl_1 = new level_1( this.scene, this.camera, this.hud );
        this.lvl_1.win_callback = () => {
            this.generate_lvl_2();
        }
        this.lvl_2 = new level_2( this.scene, this.camera, this.hud );
        this.lvl_2.win_callback = () => {
            this.generate_lvl_3();
        }
        this.lvl_3 = new level_3( this.scene, this.camera, this.hud );
        this.lvl_3.win_callback = () => {
            this.model.game_status.is_loose = true;
            this.hud.display_end_game_menu(this.lvl_3.score, this.lvl_3.player.life);
            this.hud.set_action_request( "Press space" );
            audio.play();
        }
        this.lvl_1.loose_callback = () => {
            this.model.game_status.is_loose = true;
            this.hud.display_end_game_menu(this.lvl_1.score, 0);
            this.hud.set_action_request( "Press space" );
            audio.play();
        }
        this.lvl_2.loose_callback = () => {
            this.model.game_status.is_loose = true;
            this.hud.display_end_game_menu(this.lvl_2.score, 0);
            this.hud.set_action_request( "Press space" );
            audio.play();
        }
        this.lvl_3.loose_callback = () => {
            this.model.game_status.is_loose = true;
            this.hud.display_end_game_menu(this.lvl_3.score, 0);
            this.hud.set_action_request( "Press space" );
            audio.play();
        }

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
        if (this.post_process_render) {
            this.model.bloom_composer.render();
        } else {
            this.model.renderer.render( this.scene, this.camera );
        }
    }

    /**
     * Generates the main menu
     */
    generate_menu() {
        this.clear_scene();
        this.main_menu.build( this.model );
        this.model.game_status.in_lvl = false;
        this.model.game_status.in_start_menu = true;
    }

    /**
     * Generate the first level of the game
     */
    generate_lvl_1() {
        this.clear_scene();
        this.model.player = this.lvl_1.build( this.model );
        this.lvl_1.mute(this.muted);
        this.model.game_status.in_lvl = true;
    }

    generate_lvl_2() {
        const old_lvl = game_level.lvls[game_level.current_lvl];
        this.clear_scene();
        this.model.player = this.lvl_2.build( this.model );
        this.lvl_2.player.life = old_lvl.player.life;
        this.lvl_2.score = old_lvl.score;
        this.lvl_2.mute(this.muted);
        this.model.game_status.in_lvl = true;
    }

    generate_lvl_3() {
        const old_lvl = game_level.lvls[game_level.current_lvl];
        this.clear_scene();
        this.model.player = this.lvl_3.build( this.model );
        this.lvl_3.player.life = old_lvl.player.life;
        this.lvl_3.score = old_lvl.score;
        this.lvl_3.mute(this.muted);
        this.model.game_status.in_lvl = true;
    }

    /**
     * Update the scene
     */
    update() {
        const current_level = game_level.current_lvl;
        if (!this.pause) {
            if (game_level.lvls.length > 0 && current_level >= 0) {
                game_level.lvls[current_level].update();
            }
        }
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

    store_mat(uuid, mat) {
        this.stored_mat[ uuid ] = mat;
    }

    restore_mat(obj) {
        if ( this.stored_mat[ obj.uuid ] ) {
            obj.material = this.stored_mat[ obj.uuid ];
            delete this.stored_mat[ obj.uuid ];
        }
    }

    fullscreen() {
        var elem = document.getElementById("game");
        if (this.is_fullscreen) {
            if (elem.exitFullscreen) {
                elem.exitFullscreen();
            } else if (elem.webkitExitFullscreen) {
                elem.webkitExitFullscreen();
            } else if (elem.mozCancelFullScreen) {
                elem.mozCancelFullScreen();
            } else if (elem.msExitFullscreen) {
                elem.msExitFullscreen();
            }
        } else {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullScreen) {
                elem.webkitRequestFullScreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        }
        this.resize();
    }

    mute() {
        this.muted = !this.muted;
        game_level.lvls[game_level.current_lvl].mute(this.muted);
    }

    change_mat(scene) {
        scene.children.forEach(child => {
            if (child.isMesh) {
                if (this.stored_mat[child.uuid]) {
                    const child_mat = child.material;
                    this.restore_mat(child);
                    this.stored_mat[ child.uuid ] = child_mat;
                } else {
                    const child_mat = child.material;
                    this.stored_mat[ child.uuid ] = child_mat;
                    if (child_mat instanceof THREE.MeshPhongMaterial || child_mat instanceof THREE.MeshStandardMaterial) {
                        child.material = new THREE.MeshBasicMaterial();
                        THREE.MeshBasicMaterial.prototype.copy.call(child.material, child_mat);
                    }
                }   
            } else if (child.children) {
                this.change_mat(child);
            }
        });
    }
}

export default vue;