import {game_level} from "./game_level.js";
import ship from "./object3D/ship.js";
import scan from "./object3D/scan.js";
import power_up from "./object3D/power_up.js";
import fade_animation from "./animations/fade_animation.js";
import light_reduce_animation from "./animations/light_reduce_animation.js";
import start_lvl_animation from "./animations/start_lvl_animation.js";
import end_lvl_animation from "./animations/end_lvl_animation.js";
import text_animations from "./animations/text_animations.js";

class level_2 extends game_level {

    lights = new Array();

    sound_state = 0;
    soundInterval = null;

    constructor( scene, camera, hud ) {
        super( scene, camera, hud );
    }

    build( model ) {
        // Adding the skybox
        const skybox_material = [ ...model.preloaded_materials.skybox_2 ].map( e => {
            const phong_mat = new THREE.MeshPhongMaterial();
            THREE.MeshBasicMaterial.prototype.copy.call( phong_mat, e );
            return phong_mat;
        });
        const skybox = new THREE.Mesh( new THREE.BoxGeometry( 1000, 1000, 1000 ), skybox_material );
        skybox.position.set( 0, 0, 500 );
        this.scene.add( skybox );

        // Added the player
        const player_mesh = model.preloaded_mesh.ship_14.clone();
        player_mesh.rotation.x = THREE.Math.degToRad( 90 );
        player_mesh.rotation.y = THREE.Math.degToRad( 180 );
        const player = new ship( player_mesh );
        player.position.set(0, 10000, player.position.z);
        this.scene.add( player );

        const player_spot_light = new THREE.SpotLight( 0xffffff, 1, 0, THREE.Math.degToRad(90), 0.3, 0 );
        player_spot_light.position.set( 0, 0, 90 );
        player_spot_light.target = player;
        this.player_spot_light = player_spot_light;
        this.lights.push( player_spot_light );
        this.scene.add( player_spot_light );
        const player_point_light = new THREE.PointLight( 0xffffff, 5, 30 );
        player_point_light.target = player;
        this.lights.push( player_point_light );
        this.scene.add( player_point_light );

        for ( let i = 0; i < 8; i++ ) {
            const meteor_object = this.spawn_meteor(model);
            this.scene.add( meteor_object );
        }

        // Place the camera
        this.camera.position.set( 0, 0, 110 );

        game_level.current_lvl = this.index;

        this.animations.global_light = new light_reduce_animation(this);
        this.animations.start = new start_lvl_animation(this);
        this.animations.start.callback = () => {
            this.animations.global_light.start();
        }
        this.animations.fade = new fade_animation(this);
        this.animations.fade.reverse = true;
        this.animations.fade.go_to(this.animations.fade.animation_duration);
        this.animations.fade.callback = () => {
            this.animations.start.start();
        }
        this.animations.end = new end_lvl_animation(this);
        this.animations.end.callback = () => {
            this.animations.fade.reset();
            this.animations.fade.start();
        }
        this.animations.next = new text_animations(this);
        this.animations.next.callback = () => {
            this.animations.fade.start();
        }
        this.animations.next.start();

        this.sounds.sound1 = new Audio("src/medias/sounds/radar_1.mp3");
        this.sounds.sound2 = new Audio("src/medias/sounds/bgm_lvl2_1.mp3");
        this.sounds.sound1.volume = 0.1;  
        this.sounds.sound2.volume = 0.1;

        this.player = player;

        return player;
    }

    update() {
        super.update();
        const dead_target_light = new Array();
        this.lights.forEach( light => {
            if ( light.target && !light.target.is_dead ) {
                light.position.set( light.target.position.x, light.target.position.y, light.position.z );
                //light.lookAt(light.target.position);
            } else {
                dead_target_light.push( light );
            }
        });
        dead_target_light.forEach( dead_light => {
            const index = this.lights.indexOf( dead_light );
            if ( index > -1 ) {
                this.lights.splice( index, 1 );
                this.scene.remove( dead_light );
            }
        });
        this.scene.children.forEach( e => {
            if ( e.is_collidable_object && e.type === "ship") {
                if ( this.lights.find( light => light.target === e ) === undefined ) {
                    const light = new THREE.SpotLight( e.mesh.material.color, 1, 0, THREE.Math.degToRad(10), 0.3, 0 );
                    light.target = e;
                    light.position.set( e.position.x, e.position.y, this.camera.position.z );
                    this.lights.push( light );
                    this.scene.add( light );
                }
            }
        });
    }

    step() {
        super.step();
        if (this.time % 300 === 0) {
            this.lunch_scan();
            if (this.sounds.sound1.currentTime <= 0) {
                this.sounds.sound1.play();
            } else if (this.sounds.sound2.paused) {
                this.sounds.sound2.play();
                this.soundLoopInterval = setInterval(() => {
                    if (this.sounds.sound2.currentTime >= this.sounds.sound2.duration - 1) {
                        console.log("looped");
                        this.sounds.sound2.currentTime = 13.71;
                    }
                }, 0);
            }
        }
        if (this.time % (60*60) === 0) {
            const bonus = this.spawn_power_up();
            this.scene.add(bonus);
        }
    }

    lunch_scan() {
        const player_position = this.player.position.clone();
        this.scene.add(new scan(player_position));
    }

    is_win() {
        return this.scene.children.filter( e => e.type === "meteor" ).length === 0;
    }

    is_loose() {
        return this.player.is_dead;
    }
    
    spawn_power_up() {
        const horinzontal_fov = 2 * THREE.Math.radToDeg( Math.atan( Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.aspect ) );
        // compute the width and the height at z = 0
        const width = Math.tan( THREE.Math.degToRad( horinzontal_fov ) / 2 ) * this.camera.position.z * 2;
        const height = Math.tan( THREE.Math.degToRad( this.camera.fov ) / 2 ) * this.camera.position.z * 2;
        let bonus;
        switch(Math.floor(Math.random() * 4)) {
            case 0 :
                bonus = new power_up("dematerialize", 0xeeeeee);
                break;
            case 1 :
                bonus = new power_up("extra_life", 0xFF2020);
                break;
            case 2 :
                bonus = new power_up("rapide_fire", 0x00ff00);
                break;
            case 3 :
                bonus = new power_up("shield", 0x0074FF);
                break;
        }
        bonus.position.set(Math.floor( Math.random() * width ),  Math.random() * height);
        return bonus;
    }

    handle_win() {
        if (!this.animations.end.is_started) {
            this.animations.end.reset();
            this.animations.fade.callback = () => {
                this.stopAudio();
                super.handle_win();
            }
            this.animations.end.start();
        }
    }

}

export default level_2;