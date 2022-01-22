

/**
 * Class used to make the link between the different screens and the rendering canvas.
 */
class screenManager {
    
    option = {
        show_fps: false,
        bgm_volume: 100,
        bge_volume: 100
    };

    screens = {};

    /**
     * Construtor
     * @param {string} selector selector where the render will be
     */
    constructor( selector ) {
        // Creating the render area container
        this.container = document.querySelector(selector);
        this.w = this.container.clientWidth;
        this.h = this.container.clientHeight;
    
        // Render settings
        const renderConfig = {antialias: true, alpha: true};
        this.renderer = new THREE.WebGLRenderer(renderConfig);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.w, this.h);
        this.container.appendChild(this.renderer.domElement);

        window.addEventListener('resize', this.resize);
        
    }

    /**
     * Updates rendering to new container size
     */
    resize() {
        this.w = this.container.clientWidth;
        this.h = this.container.clientHeight;
        this.current_screen.set_camera_size(this.w, this.h);
        this.renderer.setSize(this.w, this.h);
    }

    /**
     * 
     * @returns returns the program parameters
     */
    get_option() {
        return this.option;
    }

    /**
     * Change the screen to display
     * @param {Object} s the new screen to display
     */
    set_screen( s ) {
        this.current_screen = s;
        this.current_screen.set_camera_size(this.w, this.h);
        this.current_screen.display();
    }

    /**
     * Change the display state of the fps window
     * @param {Boolean} v the value to display or not the fps
     */
    set_fps( v ) {
        this.option.show_fps = v;
    }

    /**
     * Change background music volume
     * @param {Number} v the new volume in range [0 - 100]
     */
    set_bgm_volume( v ) {
        this.option.bgm_volume = v;
    }

    /**
     * Change the volume of sound effects
     * @param {Number} v the new volume in range [0 - 100]
     */
    set_bge_volume( v ) {
        this.option.bge_volume = v;
    }

}

export default screenManager;