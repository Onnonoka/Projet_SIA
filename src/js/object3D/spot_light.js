

class spot_light extends THREE.Group {

    lights = new Array();
    is_dead = false;
    constructor() {
        super();
        //console.log( this instanceof THREE.Object3D);
    }

    update() {
        //console.log(this.parent.children);
        /*this.parent.children.forEach( e => {
            if ( e.is_collidable_object && e.type !== "meteor" && e !== this) {
                if ( !this.as_light( e ) ) {
                    this.add_light( e );
                }
            }
        });*/
        /*const index = this.lights.map( e, index => {
            if ( !e.target || e.target.is_dead ) 
                return index;
        });
        index.forEach( e => 
            this.remove( this.lights[e]) 
        );
        this.lights.forEach( e => {
            e.position.set( e.target.position.x, e.target.position.y, 90 );
        });*/
    }
    
    as_light( object ) {
        return this.lights.find( e => e.target === object ) !== undefined;
    }

    add_light( target ) {
        console.log(object.type, " adding light ");
        const light = new THREE.SpotLight( target.material.color, 1, 0, THREE.Math.degToRad(20), 0.9, 0 );
        light.target = target;
        light.position.set( target.position.x, target.position.y, 90 );
        this.lights.push( light );
        this.add( light );
    }
}

export default spot_light;