"use strict";

import screen from "./screen.js";
import cube from "./cube.js";
import controler_ship from "./ship.js";
import meteor from "./meteor.js";
import enemie_ship from "./enemie_ship.js";
import hud from "./hud.js";

/**
 * test screen, class inherited from screen, example of definition of display and animation
 */
class test_screen extends screen {

    camera_type = 1;
    life = 3;
    score = 0;
    level = 1;
    is_started = false;

    // key
    key = {}

    /**
     * Construtor
     * @param {Object} screenManager the screenManager to use send to the upper class
     */
    constructor( screenManager ) {
        super( 'testscreen', screenManager );   

        // going to be deleted
        this.controls = new THREE.TrackballControls(this.camera, screenManager.container);
        this.controls.target = new THREE.Vector3(0, 0, 0);
        this.controls.panSpeed = 1;
        const axesHelper = new THREE.AxesHelper( 5 );
        this.scene.add( axesHelper );
        this.hud = new hud();
        this.hud.set_message( "Press space" );
        this.hud.set_score( "0000" );
        // Laod materials
        this.load( "Enemie_ship.mtl", "Raven_sketchfab.obj" );

        // Creating the skybox
        // Loading skybox texture
        const basePath = "../src/medias/images/Skybox_2/";
        const fileType = ".png";
        const sides = ["Front", "Back", "Up", "Down", "Right", "Left"];
        const pathStings = sides.map(side => {
            return basePath + side + fileType;
        });
        const TextureArray = pathStings.map(image => {
            let texture = new THREE.TextureLoader().load(image);
            return texture;
        });
        const materialArray = TextureArray.map(texture => {
            return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
        })
        
        this.skybox = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000 ), materialArray );
        //this.skybox.rotation.y = 90;
        this.scene.add( this.skybox );

        // creating the controler ship
        this.controler_ship = new controler_ship();
        this.scene.add( this.controler_ship );
        // creating the light
        this.light = new THREE.DirectionalLight( 0xffffff, 1 );
        this.light_2 = new THREE.AmbientLight( 0xffffff, 1 );
        this.scene.add(this.light_2);
        //this.light.castShadow = true;
        //this.light.rotation.x = THREE.Math.degToRad( 180 );
        //this.light.rotation.y = THREE.Math.degToRad( 90 );
        this.light.position.z =  100;
        this.light.position.x = -50;
        //this.light.position.y = 10;
        this.scene.add( this.light );
        console.log( this.light );
        const helper = new THREE.DirectionalLightHelper( this.light, 5 );
        this.scene.add( helper );
        this.set_camera_position( 0, 0, 20);
        //this.camera.rotation.x = THREE.Math.degToRad(90);
        
        //console.log(this.camera);

             
        // Key controle
        window.onkeydown = (e) => {
            if ( e.repeat === false )
                this.key[e.key] = true;
        };
        window.onkeyup = (e) => {
            this.key[e.key] = false;
        };

        this.animate();

    }

    /**
     * Redefining the display function of the inherited class
     */
    display() {
        

    }

    update() {
        this.handle_key_controle();
        this.scene.children.forEach( e => {
            if (e.animate) {
                e.animate();
            }
        });
        this.controls.update();
        //this.skybox.rotation.y += 0.001;
        this.skybox.rotation.y += 0.0001;
        //this.make_in_screen();
        this.detect_collision();
    }

    /**
     * Animates the scene, the scene must already be set up
     */
    animate() {
        requestAnimationFrame( this.animate.bind( this ) );
        // PLay the animation
        this.render();
        this.update();

    }

    handle_key_controle(  ) {
        if ( !this.is_started ) {
            if ( this.key[" "] ) {
                this.is_started = true;
                this.hud.set_message();
            }
        } else {
            if ( this.key[" "] ) {
                this.controler_ship.shoot();
            }
        }
    }

}

export default test_screen;