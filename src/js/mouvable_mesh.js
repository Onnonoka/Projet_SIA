

class movable_mesh extends THREE.Mesh {

    constructor( geometry, material ) {
        super( geometry, material );

        this.speed_x = 0;
        this.speed_y = 0;

    }

    rotate_left() {
        this.rotation.z = (this.rotation.z + Math.PI * 1/70) % (2 * Math.PI);

    }

    rotate_right() {
        this.rotation.z = (this.rotation.z - Math.PI * 1/70) % (2 * Math.PI);

    }

    speed_up() {
        this.speed_x -= 0.01 * Math.sin(this.rotation.z);
        this.speed_y += 0.01 * Math.cos(this.rotation.z);

    }    

}

export default movable_mesh;