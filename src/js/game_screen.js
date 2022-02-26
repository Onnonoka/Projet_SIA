"use strict";

import screen from "./screen.js";
import cube from "./cube.js";
import ship from "./ship.js";
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

    background = {};

    // key
    key = {};

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
        this.controls.autoRotate = true;
        
        // Laod materials
        Promise.all([
            this.load_model( "controler_ship", "ship_9" ),
            this.load_model( "earth", "earth" ),
            this.load_skybox( "0", "Skybox_1" ),
            this.load_skybox( "1", "Skybox_2" ),
            this.load_skybox( "2", "Skybox_3" ),
            this.load_model( "rock", "rock_2" )
        ]).then( () => {
            this.mesh.controler_ship.scale.set(0.5, 0.5, 0.5);
            this.hud = new hud();
            this.hud.set_message( "Press space" );
            this.hud.set_score( "0000" );
            // Key controle
            window.onkeydown = (e) => {
                if ( e.repeat === false )
                    this.key[e.key] = true;
            };
            window.onkeyup = (e) => {
                this.key[e.key] = false;
            };

            this.display();
            this.animate();

        } );

    }

    /**
     * Redefining the display function of the inherited class
     */
    display() {

        // creating the controler ship
        this.controler_ship = new ship( this.mesh.controler_ship );
        this.scene.add( this.controler_ship );
        /*this.background.earth = this.mesh.earth.clone();
        this.scene.add( this.background.earth );*/
        // creating the light
        this.light = new THREE.DirectionalLight( 0xffffff, 1 );
        this.light_2 = new THREE.AmbientLight( 0xffffff, 1 );
        this.scene.add(this.light_2);
        this.light.position.z = 100;
        this.light.position.x = -50;
        this.scene.add( this.light );
        const helper = new THREE.DirectionalLightHelper( this.light, 5 );
        this.scene.add( helper );
        this.set_camera_position( 0, 0, 90);
        this.skybox = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000 ), this.texture["1"] );
        this.scene.add( this.skybox );

    }

    update() {
        this.controls.update();
        this.scene.children.forEach( e => {
            if (e.animate) {
                e.animate();
            }
        });
        //this.scene.rotation.y += 0.001;
        //this.controler_ship.rotation.y += 0.0001;
        //this.skybox.rotation.y += 0.0001;
    }

    /**
     * Animates the scene, the scene must already be set up
     */
    animate() {
        requestAnimationFrame( this.animate.bind( this ) );
        // PLay the animation
        this.handle_key_controle();
        this.update();
        this.render();
        this.make_in_screen();
        this.detect_collision();

    }

    handle_key_controle(  ) {
        if ( !this.is_started ) {
            if ( this.key[" "] ) {
                this.is_started = true;
                this.hud.set_message();
                this.spawn_rock();
            }
        } else {
            console.log(this.key);
            if ( this.controler_ship.is_alive) {
                if ( this.key[" "] ) {
                    this.controler_ship.shoot();
                }
                if ( this.key["ArrowUp"] ) {
                    this.controler_ship.max_speed = 0.6
                    this.controler_ship.speed_up();
                } else {                
                    this.controler_ship.max_speed = 0.35
                }
                if ( this.key["ArrowLeft"] ) {
                    this.controler_ship.rotate_axies( 0, 0, THREE.Math.radToDeg(0.05) );
                }
                if ( this.key["ArrowRight"] ) {
                    this.controler_ship.rotate_axies( 0, 0, THREE.Math.radToDeg(-0.05) );
                }
            }
        }
    }

    spawn_rock() {
        const horinzontal_fov = 2 * THREE.Math.radToDeg( Math.atan( Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.aspect ) );
        // compute the width and the height at z = 0
        const width = Math.tan( THREE.Math.degToRad( horinzontal_fov ) / 2 ) * this.camera.position.z * 2;
        const height = Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.position.z * 2;
        //this.scene.add( new meteor( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.floor( Math.random() * width ) - width / 2, Math.floor( Math.random() * height ) - height / 2, 3 ) );
        
        
        for ( let i = 0; i < 8; i++ ) {
            this.scene.add( new meteor( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.floor( Math.random() * width ) - width / 2, Math.floor( Math.random() * height ) - height / 2, 3, this.mesh["rock"] ) );
        }
    }

}

export default test_screen;