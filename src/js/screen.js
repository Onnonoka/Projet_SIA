"use strict";

/**
 * Abstract class of a screen. It corresponds to a state of the program. 
 * The display procedure must be redefined.
 */
class screen {

    static screens = {};

    /**
     * Construtor
     * @param {string} title the title of the screen
     * @param {screenManager} screenManager the screenManager to use
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
     * @param {number} w width of the container
     * @param {number} h height of the container
     */
    set_camera_size( w, h ) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();

    }

    /**
     * set the camera position
     * @param {number} x the x translation of the camera
     * @param {number} y the y translation of the camera
     * @param {number} z the z translation of the camera
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
     * Detect a collision between 2 object in the scene
     */
    detect_collision() {
        let collisions = [];
        this.scene.children.forEach( (obj1, index) => {
            if ( obj1.BB && obj1.BS ) {
                this.scene.children.slice( index + 1, this.scene.children.length ).forEach( obj2 => {
                    if ( obj2.BB && obj2.BS ) {
                        // Compute bounding box
                        let obj1_BB = obj1.BB.clone().applyMatrix4( obj1.mesh.matrixWorld );
                        let obj2_BB = obj2.BB.clone().applyMatrix4( obj2.mesh.matrixWorld );
                        
                        // Compute bounding Sphere
                        let obj1_BS = obj1.BS.clone().applyMatrix4( obj1.mesh.matrixWorld );
                        let obj2_BS = obj2.BS.clone().applyMatrix4( obj2.mesh.matrixWorld );
                        
                        // Compute collisions
                        let collisionB = obj1_BB.intersectsBox( obj2_BB );
                        let collisionS = obj1_BS.intersectsSphere( obj2_BS );

                        if ( collisionB && collisionS ) {
                            collisions.push( [ obj1, obj2 ] );
                        }
                    }
                } );
            }
        } );
        for ( let i = 0; i < collisions.length; i++ ) {
            collisions[i][0].handle_collision( collisions[i][1] );
            collisions[i][1].handle_collision( collisions[i][0] );
        }
    }

    /**
     * abstract function. Must be defined before use
     */
    display() {
        throw new Error('You have to implement the method display before using this class!');

    }

    /**
     * abstract function. Must be defined before use
     */
    animate() {
        throw new Error('You have to implement the method animate before using this class!');

    }

}

export default screen;