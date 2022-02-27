

class model {
    type = "model";

    key_press = {};

    preloaded_mesh = {
        is_loaded: false
    };

    preloaded_materials = {
        is_loaded: false
    };

    render_config = {
        container: {}
    };

    scene_object = {
        background: {},
        foreground: {},
        lights: {}
    };

    game_data = {
        score: 0,
        level: 1,
        life: 3
    };

    player_data = {
        on_cooldown: true
    }

    game_status = {
        in_start_menu: false,
        in_lvl: false,
        current_lvl: 0,
        in_animation: false,

        detect_exit_screen: false,
        detect_collision: false,
        camera_follow_player: true
    }

    /**
     * Constructor
     */
    constructor() {
        this.render_config.container = document.querySelector( '#app' );
        this.render_config.w = this.render_config.container.clientWidth;
        this.render_config.h = this.render_config.container.clientHeight;

        // Preload all 3d model for the game
        Promise.all([
            this.load_mesh( "earth_cloud", "earth_cloud" ),
            this.load_mesh( "earth_ground", "earth_6" ),
            this.load_mesh( "planete_2", "planete_2" ),
            this.load_mesh( "title", "title" ),
            this.load_mesh( "ship_14", "ship_14" )
        ]).then( () => {
            this.preloaded_mesh.is_loaded = true;
        } );

        // Preload all materials for the game
        Promise.all([
            this.load_skybox( "skybox_1", "Skybox_1" ),
            this.load_skybox( "skybox_2", "Skybox_2" ),
            this.load_skybox( "skybox_3", "Skybox_3" )
        ]).then( () => {
            this.preloaded_materials.is_loaded = true;
        } );
    }

    
    /**
     * Async load of 3D .obj mesh
     * @param {string} name the name with which the mesh will be stored
     * @param {string} path the mesh path
     * @returns Promise, resolve when the load is complete
     */
     load_mesh( name, path ) {
        const mtlLoader = new THREE.MTLLoader();
        const objLoader = new THREE.OBJLoader();
        return new Promise( (resolve) => {
            // Load mtl file
            mtlLoader.setPath("src/medias/models/");
            mtlLoader.load( path + ".mtl", ( materials ) => {
                materials.preload();

                // Load obj file
                objLoader.setMaterials( materials );
                objLoader.setPath("src/medias/models/");
                objLoader.load( path + ".obj", ( object ) => {
                    this.preloaded_mesh[name] = object.children[0];
                    resolve();
                });
            });
        })
    }

    /**
     * Async load of skybox materials
     * @param {string} name the name with which the skybox material will be stored
     * @param {string} path the skybox material path
     * @returns Promise, resolve when the load is complete
     */
    load_skybox( name, path ) {
        return new Promise( (resolve) => {
            const basePath = "../src/medias/images/";
            const fileType = ".png";
            const sides = ["Front", "Back", "Up", "Down", "Right", "Left"];
            const pathStings = sides.map(side => {
                return basePath + path + "/" + side + fileType;
            });
            const TextureArray = pathStings.map(image => {
                return new THREE.TextureLoader().load(image);
            });
            const materialArray = TextureArray.map(texture => {
                return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
            });
            this.preloaded_materials[name] = materialArray;
            resolve();
        } );
        
    }

    /**
     * Store render data and config
     * @param {object} renderer the renderer
     */
    set_renderer( renderer ) {
        this.renderer = renderer;
    }
}

export default model;