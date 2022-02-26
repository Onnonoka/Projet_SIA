

class controler {
    type = "controler";

    /**
     * Constructor
     * @param {object} model the model
     * @param {object} vue the vue
     */
    constructor( model, vue ) {
        if ( model.type !== "model" )
            throw ("The model is not and model object!");
        if ( vue.type !== "vue" )
            throw ("The vue is not and vue object!");

        this.model = model;
        this.vue = vue;

        // going to be deleted
        //-------------------------------------------------------------------------------------------------
        this.controls = new THREE.TrackballControls( this.vue.camera, this.model.render_config.container );
        this.controls.target = new THREE.Vector3(0, 0, 0);
        this.controls.panSpeed = 1;
        this.controls.autoRotate = true;
        //-------------------------------------------------------------------------------------------------

        // Creating the render area container
        const w = this.model.render_config.w;
        const h = this.model.render_config.h;
        
        // Render settings
        const renderConfig = { antialias: true, alpha: true };
        const renderer = new THREE.WebGLRenderer( renderConfig );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( w, h );
        this.model.render_config.container.appendChild( renderer.domElement );

        // Store the render
        this.model.set_renderer( renderer );

        // Key controle
        window.onkeydown = (e) => {
            if ( e.repeat === false )
                this.model.key_press[e.key] = true;
        };
        window.onkeyup = (e) => {
            this.model.key_press[e.key] = false;
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
        console.log("rendered");
        this.vue.update();
        this.handle_key();
        // Going to be deleted
        //--------------------------------------------------
        this.controls.update();
        //--------------------------------------------------
        this.vue.render();

    }

    handle_key() {
        if ( this.model.game_status.in_start_menu ) {
            if ( this.model.key_press[" "] ) {
                this.model.game_status.in_start_menu = false;
                this.vue.clear_scene();
                this.vue.generate_lvl_1();
                this.model.game_status.in_lvl = true;
                this.model.current_lvl = 1;
                setTimeout( () => {
                    this.model.player_data.on_cooldown = false
                }, 500 );
            }
        } else if ( this.model.game_status.in_lvl ) {
            if ( this.model.key_press[" "] ) {
                if ( !this.model.player_data.on_cooldown ) {
                    this.vue.shoot();
                    this.model.player_data.on_cooldown = true;
                    setTimeout( () => {
                        this.model.player_data.on_cooldown = false;
                    }, 500 );
                }
            }
            if ( this.model.key_press["ArrowLeft"] ) {
                this.vue.rotate_player_left();
            }
            if ( this.model.key_press["ArrowRight"] ) {
                this.vue.rotate_player_right();
            }
            if ( this.model.key_press["ArrowUp"] ) {
                this.vue.set_player_max_speed( 0.6 );
                this.vue.speed_up_player();
            } else {
                this.vue.set_player_max_speed( 0.35 );
            }
        }
    }
}

export default controler;