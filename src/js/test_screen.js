"use strict";

import screen from "./screen.js";

class testScreen extends screen {

    constructor( screenManager ) {
        super( 'testScreen', screenManager);
    }

    display() {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new THREE.Mesh( geometry, material );
        this.scene.add( this.cube );
        this.set_camera_position(0, 0, 5);
        this.animate();
    }

    animate() {
        console.log(this);
        requestAnimationFrame( this.animate );

        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        this.render();
    }
    
}

export default testScreen;