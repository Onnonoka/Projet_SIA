

class movable_mesh extends THREE.Mesh {

    constructor( geometry, material ) {
        super( geometry, material );

        this.speed_x = 0;
        this.speed_y = 0;

    }

    rotate_left() {
        this.rotate.z += 0.01;

    }

    rotate_right() {
        this.rotate.z -= 0.01;

    }

    speed_up() {
        this.speed_x = 0;
        this.speed_y = 0;

    }

    

}

export default movable_mesh;