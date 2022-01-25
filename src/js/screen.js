"use strict";

/**
 * Abstract class of a screen. It corresponds to a state of the program. 
 * The display procedure must be redefined.
 */
class screen {

    static screens = {};

    /**
     * Construtor
     * @param {Object} screenManager the screenManager to use
     */
    constructor( title, screenManager ) {
        this.title = title;
        this.screenManager = screenManager;

        // create the scene
        this.scene = new THREE.Scene();
    
        // create the camera
        this.camera = new THREE.PerspectiveCamera( 75, this.screenManager.w / this.screenManager.h, 0.1, 1000 );  
        this.set_camera_position(0, 0, 0);

        // Save the screen for links
        screen.screens[title] = this;

    }

    /**
     * set the camera size
     * @param {Number} w width of the container
     * @param {Number} h height of the container
     */
    set_camera_size( w, h ) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();

    }

    /**
     * set the camera position
     * @param {Number} x the x translation of the camera
     * @param {Number} y the y translation of the camera
     * @param {Number} z the z translation of the camera
     */
    set_camera_position(x, y, z) {
        this.camera.position.set(x, y, z);

    } 

    /**
     * renders the scene and the camera
     */
    render() {
        if (this.screenManager.get_screen() === this)
            this.screenManager.render(this.scene, this.camera);

    }

    /**
     * abstract function. Must be defined before use
     */
    display() {
        throw new Error('You have to implement the method display!');

    }

}

export default screen;