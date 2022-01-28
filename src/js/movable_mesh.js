

class movable_mesh extends THREE.Group {

    speed = {
        x : 0,
        y : 0,
        z : 0
    };

    constructor() {
        super();

    }

    rotate_mesh( x, y, z) {
        this.mesh.rotation.x = (this.mesh.rotation.z + Math.PI / 180 * x) % (2 * Math.PI);
        this.mesh.rotation.y = (this.mesh.rotation.z + Math.PI / 180 * y) % (2 * Math.PI);
        this.mesh.rotation.z = (this.mesh.rotation.z + Math.PI / 180 * z) % (2 * Math.PI);

    }

    mouve_mesh( x, y, z) {
        this.mesh.position.x += x;
        this.mesh.position.y += y;
        this.mesh.position.z += z;

    } 

    rotate_axies( x, y, z) {
        this.rotation.x = (this.rotation.z + Math.PI / 180 * x) % (2 * Math.PI);
        this.rotation.y = (this.rotation.z + Math.PI / 180 * y) % (2 * Math.PI);
        this.rotation.z = (this.rotation.z + Math.PI / 180 * z) % (2 * Math.PI);

    }

    mouve_axies( x, y, z) {
        this.position.x += x;
        this.position.y += y;
        this.position.z += z;

    }

    set_speed( x, y, z ) {
        this.speed.x = x;
        this.speed.y = y;
        this.speed.z = z;
        
    }

}

export default movable_mesh;