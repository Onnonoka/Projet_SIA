"use strict";

/**
 * Abstract class of a screen. It corresponds to a state of the program. 
 * The display procedure must be redefined.
 */
class screen {

    /**
     * Construtor
     * @param {Object} screenManager the screenManager to use
     */
    constructor( title, screenManager ) {
        this.screenManager = screenManager;
        this.title = title;

        // create the scene
        this.scene = new THREE.Scene();
    
        // create the camera
        this.camera = new THREE.PerspectiveCamera( 75, this.screenManager.w / this.screenManager.h, 0.1, 1000 );  
        this.set_camera_position(0, 0, 30);
    }

    set_camera_size( w, h ) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
    }

    set_camera_position(x, y, z) {
        this.camera.position.set(x, y, z);
    } 

    render() {
        this.screenManager.renderer.render(this.scene, this.camera);
    }

    display() {
        throw new Error('You have to implement the method display!');
    }

}

export default screen;