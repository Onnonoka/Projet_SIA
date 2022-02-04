"use strict";

import screen from "./screen.js";
import cube from "./cube.js";
import controler_ship from "./controler_ship.js";
import meteor from "./meteor.js";

/**
 * test screen, class inherited from screen, example of definition of display and animation
 */
class testScreen extends screen {

    meteors = [];

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
        this.controler_ship = new controler_ship();
        this.scene.add( this.controler_ship );
        const helper = new THREE.Box3Helper( this.controler_ship.BB, 0xffff00 );
        this.scene.add( helper );
        this.light = new THREE.DirectionalLight( 0xffffff, 1 );
        this.light.position.z = 5;
        this.light.castShadow = true;
        this.scene.add( this.light );
        this.meteors.push( new meteor() );
        this.scene.add(this.meteors[0]);
        const helperBB = new THREE.Box3Helper( this.meteors[0].BB, 0xffff00 );
        this.scene.add( helperBB );
        this.set_camera_position( 0, 0, 90 );
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