import mouvable_mesh from "./movable_mesh.js";

class power_up extends mouvable_mesh {

    constructor(action, color) {
        const CylinderGeometry = new THREE.CylinderGeometry( 5, 5, 15, 32);
        const CylinderMaterial = new THREE.MeshStandardMaterial( {
            color: color,
            emissive: color,
            emissiveIntensity: 0,
        } );
        const center_mesh = new THREE.Mesh( CylinderGeometry, CylinderMaterial );
        super("power_up", center_mesh);
        const SphereGeometry = new THREE.SphereGeometry(5, 32, 15);
        const SphereMaterial = new THREE.MeshStandardMaterial( {
            color: 0xeeeeee,
            emissive: 0xeeeeee,
            emissiveIntensity: 5,
        } );
        const topSphere = new THREE.Mesh( SphereGeometry, SphereMaterial );
        const bottomSphere = new THREE.Mesh( SphereGeometry.clone(), SphereMaterial );
        topSphere.position.y = 7.5;
        bottomSphere.position.y = -7.5;
        this.sphereMat = SphereMaterial;
        this.add(topSphere);
        this.add(bottomSphere);
        this.rotation.y = Math.random() * Math.PI;   
        this.scale.set(0.2, 0.2, 0.2);
        this.fadeOut = true;
        setTimeout( () => {
            this.is_dead = true;
        }, 10000 );
        this.is_affected_by_physics = false;
        this.action = action;
    }

    update() {
        this.rotation.z += 0.01;
        if (this.fadeOut) {
            this.sphereMat.emissiveIntensity -= 0.1;
            if (this.sphereMat.emissiveIntensity <= 0) {
                this.fadeOut = false;
            }
        } else {
            this.sphereMat.emissiveIntensity += 0.1;
            if (this.sphereMat.emissiveIntensity >= 5) {
                this.fadeOut = true;
            }
        }
        this.mouve_axies(this.speed.x, this.speed.y, this.speed.z);
    }

    handle_collision( target ) {
        if ( target.type === "ship" ) {
            this.is_dead = true;
        }
    }

}

export default power_up;