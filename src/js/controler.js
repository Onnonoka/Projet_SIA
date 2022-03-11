

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

        // going to be deleted
        //-------------------------------------------------------------------------------------------------
        /*this.controls = new THREE.TrackballControls( this.vue.camera, this.model.render_config.container );
        this.controls.target = new THREE.Vector3(0, 0, 0);
        this.controls.panSpeed = 1;
        this.controls.autoRotate = true;*/
        //-------------------------------------------------------------------------------------------------

        // Key controle
        window.onkeydown = e => {
            if ( e.repeat === false )
                this.model.key_press[ e.key ] = true;
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
            this.model.game_status.in_start_menu = true;
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
            if ( this.model.key_press[ " " ] ) {
                this.vue.clear_scene();
                this.vue.generate_lvl_1();
                this.model.game_status.detect_collision = true;
                this.model.player.on_cooldown = true;
                setTimeout( () => {
                    this.model.player.on_cooldown = false;
                }, 500 );
            }
        // Handle key press in game
        } else if ( this.model.game_status.in_lvl ) {
            // key space
            if ( this.model.key_press[ " " ] ) {
                this.model.player.shoot();
            }
            // key left
            if ( this.model.key_press[ "ArrowLeft" ] ) {
                this.model.player.rotate_axies( 0, 0, THREE.Math.radToDeg( 0.05 ) );
            }
            // key right
            if ( this.model.key_press[ "ArrowRight" ] ) {
                this.model.player.rotate_axies( 0, 0, THREE.Math.radToDeg( -0.05 ) );
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
            /*if ( this.model.scene.children.filter( e => e.type === "meteor" ).length === 0 ) {
                this.vue.clear_scene();
                switch (this.model.game_status.current_lvl) {
                    case 1: this.vue.generate_lvl_2();
                        break;
                    case 2: this.vue.generate_lvl_3();
                        break;
                    case 3: this.vue.generate_score_board();
                        break;
                }
                this.vue.generate_menu();
                this.model.game_status.in_start_menu = true;
            } else if ( this.model.player.is_dead )
                this.vue.generate_game_over();
            */
        }
        // handle key all the time
        // key m
        if ( this.model.key_press[ "m" ] ) {
            this.vue.set_phong_materials();
        }
    }
}

export default controler;