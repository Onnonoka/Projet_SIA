import movable_mesh from "./movable_mesh.js";

class bullet extends movable_mesh {

    constructor( rotate_z, position_x, position_y ) {
        super();
        const geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        this.cylinder = new THREE.Mesh( geometry, material );
        this.scale.x = 0.05;
        this.scale.y = 0.05;
        this.scale.z = 0.05;
        this.add( this.cylinder );

        this.rotate_axies(0, 0, THREE.Math.radToDeg(rotate_z));
        this.mouve_axies(position_x, position_y, 0);
        this.set_speed(-1 * Math.sin( this.rotation.z ), 1 * Math.cos( this.rotation.z ), 0);
        this.hp = 100;
        this.animate();
    }

    animate() {
        if (this.hp > 0)
            requestAnimationFrame( this.animate.bind( this ) );
        else
            this.parent.remove(this);

        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        this.hp--;

    }
}

export default bullet;