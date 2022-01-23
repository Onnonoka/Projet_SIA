"use strict";

import screen from "./screen.js";

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
0
    }

    /**
     * Redefining the display function of the inherited class
     */
    display() {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new THREE.Mesh( geometry, material );
        this.scene.add( this.cube );
        this.set_camera_position( 0, 0, 5 );
        this.animate();

    }

    /**
     * Animates the scene, the scene must already be set up
     */
    animate() {
        requestAnimationFrame( this.animate.bind( this ) );

        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        this.render();

    }
    
}

export default testScreen;