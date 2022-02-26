"use strict";

/**
 * Abstract class of a screen. It corresponds to a state of the program. 
 * The display procedure must be redefined.
 */
class screen {

    static screens = {};
    // meshs
    mesh = {};
    // texture
    texture = {};

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
        this.camera = new THREE.PerspectiveCamera( 90, this.screenManager.w / this.screenManager.h, 1, 10000 );  
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
        collisions.forEach( e => {
            e[0].handle_collision( e[1] );
            e[1].handle_collision( e[0] );
        } );
    }

    /**
     * 
     */
    make_in_screen() {
        // compute the horizontal field of view
        const horinzontal_fov = 2 * THREE.Math.radToDeg( Math.atan( Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.aspect ) );
        // compute the width and the height at z = 0
        const width = Math.tan( THREE.Math.degToRad( horinzontal_fov ) / 2 ) * this.camera.position.z * 2;
        const height = Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.position.z * 2;
        this.scene.children.forEach( e => {
            // teleporte on the other side if the object is not in the camera frustum view
            // x axies
            if ( e.position.x > this.camera.position.x + width / 2 ) {
                e.position.x -= width;
            } else if ( e.position.x < this.camera.position.x + -width / 2 ) {
                e.position.x += width;
            }
            // y axis
            if ( e.position.y > this.camera.position.y + height / 2 ) {
                e.position.y -= height;
            } else if ( e.position.y < this.camera.position.y + -height / 2 ) {
                e.position.y += height;
            }
        } );
    }

    /**
     * Async load of 3D .obj model
     * @param {*} name 
     * @param {*} path 
     * @returns 
     */
    load_model( name, path ) {
        let mtlLoader = new THREE.MTLLoader();
        let objLoader = new THREE.OBJLoader();
        return new Promise( (resolve) => {
            mtlLoader.setPath("src/medias/models/");
            mtlLoader.load( path + ".mtl", ( materials ) => {
                materials.preload();

                objLoader.setMaterials( materials );
                objLoader.setPath("src/medias/models/");
                objLoader.load( path + ".obj", ( object ) => {
                    this.mesh[name] = object.children[0];
                    resolve();
                });
            });
        })
    }

    load_skybox( name, path ) {
        return new Promise( (resolve) => {
            const basePath = "../src/medias/images/";
            const fileType = ".png";
            const sides = ["Front", "Back", "Up", "Down", "Right", "Left"];
            const pathStings = sides.map(side => {
                return basePath + path + "/" + side + fileType;
            });
            const TextureArray = pathStings.map(image => {
                return new THREE.TextureLoader().load(image);
            });
            const materialArray = TextureArray.map(texture => {
                return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
            });
            console.log(materialArray);
            this.texture[name] = materialArray;
            resolve();
        } );
        
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