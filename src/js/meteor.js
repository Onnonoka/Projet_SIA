import movable_mesh from "./movable_mesh.js";

class meteor extends movable_mesh {

    constructor(speed_x, speed_y, pos_x, pos_y) {
        super( "meteor" );

        // Creating the mesh
        const geometry = new THREE.DodecahedronGeometry( 10, 0 );
        const material = new THREE.MeshPhongMaterial( {color: 0xffff00} );
        this.mesh = new THREE.Mesh( geometry, material );
        // add the mesh to the group
        this.add( this.mesh );

        this.speed.x = 0;
        this.speed.y = 0;
        this.mouve_axies( 20, 20, 0 );

        this.BB = new THREE.Box3().setFromObject( this );
        this.BS = new THREE.Sphere();
        this.BB.getBoundingSphere( this.BS );


        // animate the meteor
        this.animate();

    }

    animate() {
        this.BB.setFromObject( this );
        requestAnimationFrame( this.animate.bind( this ) );

        this.rotate_axies( THREE.Math.radToDeg(0.01), THREE.Math.radToDeg(0.01), 0 );
    }
}

export default meteor;