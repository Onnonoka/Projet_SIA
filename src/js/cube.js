

class cube extends THREE.Mesh {
    speed_x = 0;
    speed_y = 0;

    constructor() {
        const geometry = new THREE.ConeGeometry(0.5, 1, 5);
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        super( geometry, material );
        console.log(this);
        this.animate();

        window.onkeydown = (e) => {
            console.log(e);
            if (e.key == 'ArrowLeft')
                this.speed_x -= 0.01;
            if (e.key == 'ArrowRight')
                this.speed_x += 0.01;
            if (e.key == 'ArrowUp')
                this.speed_y += 0.01;
            if (e.key == 'ArrowDown')
                this.speed_y -= 0.01;
            
        };
    }

    animate() {
        requestAnimationFrame( this.animate.bind( this ) );

        /*this.rotation.x += 0.01;
        this.rotation.y += 0.01;*/

        this.position.x += this.speed_x;
        this.position.y += this.speed_y;

    }

}

export default cube;