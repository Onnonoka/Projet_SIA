import ship from "./ship.js";

/**
 * 
 */
class enemie_ship extends ship {

    fire_on_cooldown = false;

    max_speed = 0.15;

    
    /**
     * Constructor
     */
    constructor() {
        
        const geometry = new THREE.ConeGeometry( 1, 2, 4 );
        const material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
        super( "enemie_ship", new THREE.Mesh( geometry, material ) );
    }


    update() {
        // object animation
        //console.log(this);
        let controler_ship_position = this.parent.children.filter( e => e.type === "controler_ship" )[0].position.clone();
        let distance_to_controler_ships = this.position.distanceTo( controler_ship_position );
        let x = controler_ship_position.x - this.position.x;
        let y = controler_ship_position.y - this.position.y;
        let angle = Math.asin( x / distance_to_controler_ships );
        if ( isNaN( angle ) )
            angle = 0;
        //let angle_2 = this.parent.children.filter( e => e.type === "controler_ship" )[0].position.angleTo( this.position );
        //console.log( "angle", THREE.Math.radToDeg( angle ) );
        //console.log( "rotation", THREE.Math.radToDeg( this.rotation.z ) )
        //console.log(THREE.Math.radToDeg(angle), THREE.Math.radToDeg(this.rotation.z) );
        //console.log( "angle_dist", THREE.Math.radToDeg( this.rotation.z - angle ) );
        if ( y > 0 ) {
            if ( this.rotation.z + angle < 0 ) {
                console.log("inf y sup");
                this.rotate_axies( 0, 0, THREE.Math.radToDeg( 0.01 ) );
            } else if ( this.rotation.z + angle > 0 ) {
                console.log("sup y sup");
                this.rotate_axies( 0, 0, THREE.Math.radToDeg( -0.01 ) );
            }

        } else {
            if ( this.rotation.z + -angle - Math.PI > 0 || this.rotation.z + -angle - Math.PI > Math.PI ) {
                console.log("sup y inf");
                this.rotate_axies( 0, 0, THREE.Math.radToDeg( -0.01 ) );
            } else if ( this.rotation.z + -angle - Math.PI < 0  ) {
                console.log("inf y inf");
                this.rotate_axies( 0, 0, THREE.Math.radToDeg( 0.01 ) );
            }

        }
        
        //console.log( THREE.Math.radToDeg( angle ) );
        //this.rotation.z = angle_2;
        /*if ( y < this.position.y) {
            this.rotation.z -= Math.PI;
        }*/
        //console.log(x);
        //console.log(distance_between_ships);
        //if ( distance_between_ships > 10 )
        //console.log( this.rotation.toVector3(), this.parent.children.filter( e => e.type === "controler_ship" )[0].position );
        //console.log(this.rotation.toVector3().angleTo( this.parent.children.filter( e => e.type === "controler_ship" )[0].position ) );
        //console.log(this.rotation.toVector3().angleTo( this.parent.children.filter( e => e.type === "controler_ship" )[0].rotation.toVector3() ))

        /*if ( this.key_Arrow_Right )
            this.rotate_axies( 0, 0, THREE.Math.radToDeg( -0.05 ) );
        if ( this.key_Arrow_Up )
            this.speed_up();
        if ( this.key_Space )
            this.shoot();*/
        //this.normalize_speed( this.max_speed );
        //this.mouve_axies( this.speed.x, this.speed.y, this.speed.z );

        // mesh animation
        //this.rotate_mesh( 0, THREE.Math.radToDeg(0.05), 0 );

    }

    handle_collision( target ) {
        if ( target.type === "bullet" ) {
            if ( target.source !== this ) {
                console.log( "handle_ship_collision_with_bullet" ); 

            }
        } else if ( target.type === "meteor" ) {
            this.clear();
            console.log( "handle_ship_collision_with_meteor" ); 

        }
    }

}

export default enemie_ship;