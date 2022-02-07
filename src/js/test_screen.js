"use strict";

import screen from "./screen.js";
import cube from "./cube.js";
import controler_ship from "./controler_ship.js";
import meteor from "./meteor.js";

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
        //this.cube = new cube();
        //this.scene.add(this.cube);
        this.controler_ship = new controler_ship();
        this.scene.add( this.controler_ship );
        this.light = new THREE.DirectionalLight( 0xffffff, 1 );
        this.light.position.z = 5;
        this.light.castShadow = true;
        this.scene.add( this.light );
        this.metor = new meteor(0, 0, 20, 20, 3 );
        this.scene.add( this.metor );
        console.log(this.metor.position);
        //this.scene.add(  new meteor(0, 0, -20, 20, 3 ) );
        this.set_camera_position( 0, 0, 90 );
        console.log( this.scene.children );
        this.animate();

    }

    /**
     * Animates the scene, the scene must already be set up
     */
    animate() {
        requestAnimationFrame( this.animate.bind( this ) );
        this.detect_collision();
        this.scene.children.forEach( e => {
            if (e.animate) {
                e.animate();
            }
        });

        this.render();

    }
    
}

export default testScreen;