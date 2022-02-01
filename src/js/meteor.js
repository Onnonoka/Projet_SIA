import movable_mesh from "./movable_mesh.js";

class meteor extends movable_mesh {

    constructor(speed_x, speed_y, pos_x, pos_y) {
        super( "meteor" );

        // Creating the mesh
        const geometry = new THREE.DodecahedronGeometry( 10, 0 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        this.dodecahedron = new THREE.Mesh( geometry, material );
        // add the mesh to the group
        this.add( this.dodecahedron );

        // animate the meteor
        this.animate();

    }
}

export default meteor;