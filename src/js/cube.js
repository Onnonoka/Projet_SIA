
class cube extends THREE.Group {
    speed_x = 0;
    speed_y = 0;
    speed_z = 0;

    key_L = false;
    key_R = false;
    key_U = false;

    constructor() {
        super();

        let mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath("src/medias/models/");
        mtlLoader.load( 'Intergalactic_Spaceship-(Wavefront).mtl', ( materials ) => {
            materials.preload();

            let objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.setPath("src/medias/models/");
            objLoader.load( 'Intergalactic_Spaceship-(Wavefront).obj', ( object ) => {
                this.mesh = object.children[0];
                this.add( this.mesh );
                this.mesh.rotation.x = Math.PI / 180 * 90;
                this.mesh.rotation.y = Math.PI / 180 * 180;
                this.animate();

            });

        });

        window.onkeydown = (e) => {
            if ( e.repeat === false ) {
                if ( e.key == 'ArrowLeft' ) {
                    this.key_L = true;
                    this.rotate_left();
                } else if ( e.key == 'ArrowRight' ) {
                    this.key_R = true;
                    this.rotate_right();
                } else if ( e.key == 'ArrowUp' ) {
                    this.key_U = true;
                    this.speed_up();
                }
            }
            
        };

        window.onkeyup = ( e ) => {
            if ( e.key === "ArrowLeft" )
                this.key_L = false;
            if ( e.key === "ArrowRight" )
                this.key_R = false;
            if ( e.key === "ArrowUp" )
                this.key_U = false;
            
        };
    }

    rotate_left() {
        if ( this.key_L )
            requestAnimationFrame( this.rotate_left.bind( this ) );
        this.rotation.z = (this.rotation.z + Math.PI * 1/70) % (2 * Math.PI);

    }

    rotate_right() {
        if ( this.key_R )
            requestAnimationFrame( this.rotate_right.bind( this ) );
        this.rotation.z = (this.rotation.z - Math.PI * 1/70) % (2 * Math.PI);

    }

    speed_up() {
        if ( this.key_U )
            requestAnimationFrame( this.speed_up.bind( this ) );
        this.speed_x -= 0.01 * Math.sin( this.rotation.z );
        this.speed_y += 0.01 * Math.cos( this.rotation.z );

    }

    animate() {
        requestAnimationFrame( this.animate.bind( this ) );

        //this.rotation.y += 0.01;

        this.position.x += this.speed_x;
        this.position.y += this.speed_y;

    }

}

export default cube;