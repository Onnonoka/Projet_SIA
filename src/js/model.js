

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

    game_data = {
        score: 0,
        level: 1,
        life: 3
    };

    game_status = {
        in_start_menu: false,
        in_lvl: false,
        current_lvl: 0,
        in_animation: false,

        detect_collision: false,
        camera_follow_player: false,
        everything_mouve: false
    }

    /**
     * Constructor
     */
    constructor() {
        this.render_config.container = document.querySelector( '#app' );
        this.render_config.w = this.render_config.container.clientWidth;
        this.render_config.h = this.render_config.container.clientHeight;

        // Render settings
        const renderConfig = { antialias: true, alpha: true };
        const renderer = new THREE.WebGLRenderer( renderConfig );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( this.render_config.w, this.render_config.h );
        renderer.toneMapping = THREE.ReinhardToneMapping;
        this.render_config.container.appendChild( renderer.domElement );
        this.renderer = renderer;

        // Create the scene
        this.scene = new THREE.Scene();

        // Create the camera
        this.camera = new THREE.PerspectiveCamera( 70, this.render_config.w / this.render_config.h, 1, 10000 );
        
        const render_pass = new THREE.RenderPass( this.scene, this.camera );
        const bloom_pass = new THREE.UnrealBloomPass({x: 1024, y: 1024}, 1, 0.0, 0.5);

        const bloom_composer = new THREE.EffectComposer( this.renderer );
        const final_composer = new THREE.EffectComposer( this.renderer );

        bloom_composer.renderToScreen = true;
        bloom_composer.addPass(render_pass);
        bloom_composer.addPass(bloom_pass);
        final_composer.addPass(render_pass);
        this.bloom_composer = bloom_composer;
        this.final_composer = final_composer;

        // Preload all 3d model for the game
        Promise.all([
            this.load_mesh( "earth_cloud", "earth_cloud" ),
            this.load_mesh( "earth_ground", "earth_6" ),
            this.load_mesh( "planete_1", "planete_1" ),
            this.load_mesh( "title", "title" ),
            this.load_mesh( "ship_14", "ship_14" ),
            this.load_mesh( "rock_1", "rock_1" ),
            this.load_mesh( "rock_2", "rock_2" )
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
            mtlLoader.setPath( "src/medias/models/" );
            mtlLoader.load( path + ".mtl", ( materials ) => {
                materials.preload();

                // Load obj file
                objLoader.setMaterials( materials );
                objLoader.setPath( "src/medias/models/" );
                objLoader.load( path + ".obj", ( object ) => {
                    this.preloaded_mesh[ name ] = object.children[ 0 ];
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
            const sides = [ "Front", "Back", "Up", "Down", "Right", "Left" ];
            const pathStings = sides.map(side => {
                return basePath + path + "/" + side + fileType;
            });
            const TextureArray = pathStings.map( image => {
                return new THREE.TextureLoader().load( image );
            });
            const materialArray = TextureArray.map( texture => {
                return new THREE.MeshBasicMaterial( { map: texture, side: THREE.BackSide } );
            });
            this.preloaded_materials[ name ] = materialArray;
            resolve();
        } );
    }

    get_meteor_number() {
        return this.scene.children.filter( element => { element.is_collidable_object && element.type === "meteor" }).length;
    }
}

export default model;