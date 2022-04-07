
import hud from "./hud.js";
import game_level from "./game_level.js";
import level_1 from "./level_1.js";
import level_2 from "./level_2.js";
import main_menu from "./main_menu.js";

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

        this.scene = this.model.scene;
        this.camera = this.model.camera;
        // Create the hud
        this.hud = new hud();

        this.main_menu = new main_menu( this.scene, this.camera, this.hud );
        this.lvl_1 = new level_1( this.scene, this.camera, this.hud );
        this.lvl_2 = new level_2( this.scene, this.camera, this.hud );

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
        this.model.renderer.render( this.scene, this.camera );
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
        this.model.game_status.in_lvl = true;
    }

    generate_lvl_2() {
        this.clear_scene();
        this.model.player = this.lvl_2.build( this.model );
        this.model.game_status.in_lvl = true;
    }

    /**
     * Update the scene
     */
    update() {
        const current_level = game_level.current_lvl;
        if (current_level >= 0 && game_level.lvls[current_level].status !== 'pause') {
            game_level.lvls[current_level].update();
            if (game_level.lvls[current_level].status === 'win') {
                if (game_level.lvls[current_level] === this.lvl_1) {
                    this.generate_lvl_2();
                } else if (game_level.lvls[current_level] === this.lvl_2) {
                    this.generate_lvl_3();
                }
            }
        }
    }

    set_phong_materials() {
        const player_mat = this.model.scene_object.foreground.player.mesh.material;
        const phong_mat = new THREE.MeshStandardMaterial().copy(player_mat);
        this.model.scene_object.foreground.player.mesh.material = phong_mat;
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
}

export default vue;