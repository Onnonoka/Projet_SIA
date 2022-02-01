import movable_mesh from "./movable_mesh.js";


class controler_ship extends movable_mesh {
    
    constructor() {
        super( "controler_ship" );

        // Creating the mesh and the texture
        const geometry = new THREE.ConeGeometry( 5, 4, 20 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        this.mesh = new THREE.Mesh( geometry, material );

        // add the mesh too the groupe
        this.add( this.mesh );
        
    }

    shoot() {
        let ammo = new bullet(this.rotation.z, this.position.x, this.position.y );
        this.parent.add( ammo );
        
    }

}

export default controler_ship;