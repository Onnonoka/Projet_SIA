import * as THREE from 'three';

import movable_mesh from "./movable_mesh.js";

class danger_area extends movable_mesh {

    time = 0;

    /**
     * Constructor
     * @param {number} rotate_z the z rotation at spawn
     * @param {number} position_x the x position at spawn
     * @param {number} position_y the y position at spawn
     * @param {movable_mesh} source the class who create the bullet
     */
    constructor(radius) {

        const circle_geometrie = new THREE.CircleGeometry( radius, 32 );
        const torus_geometrie = new THREE.TorusGeometry( radius, 0.4, 16, 100 );  
        const light_red_mat = new THREE.MeshPhongMaterial( {
            color: 0xcc0000,
            emissive: 0xff0000,
            emissiveIntensity: 5,
            transparent: true,
            opacity: 0.1
        } );
        const dark_red_mat = new THREE.MeshPhongMaterial( {
            color: 0xcc0000,
            emissive: 0xff0000,
            emissiveIntensity: 5,
            transparent: true,
            opacity: 0.4
        } );
        const circle = new THREE.Mesh(circle_geometrie, light_red_mat);
        const torus = new THREE.Mesh(torus_geometrie, dark_red_mat);

        super( "burning_meteor", circle );
        this.add(torus);
        this.is_affected_by_physics = false;

    }

    update() {
    }
    handle_collision(target) {
    }

}

export default danger_area;