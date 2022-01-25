"use strict";

import screen from "./screen.js";
import cube from "./cube.js";

/**
 * test screen, class inherited from screen, example of definition of display and animation
 */
class testScreen extends screen {

    /**
     * Construtor
     * @param {Object} screenManager the screenManager to use send to the upper class
     */
    constructor( screenManager ) {
        super( 'testscreen', screenManager );

    }

    /**
     * Redefining the display function of the inherited class
     */
    display() {
        this.cube = new cube();
        this.scene.add( this.cube );
        this.set_camera_position( 0, 0, 5 );
        this.animate();

    }

    /**
     * Animates the scene, the scene must already be set up
     */
    animate() {
        requestAnimationFrame( this.animate.bind( this ) );

        this.render();

    }
    
}

export default testScreen;