
import animation from "./animation.js";

class shield_animation extends animation {

    constructor(context) {
        super(60*10);
        this.context = context;        
        // mesh parameter
        const size = new THREE.Vector3();
        this.context.BB.getSize(size);

        // shield paramter
        const shield_geometry = new THREE.SphereGeometry( this.context.BS.radius, 32, 16 );
        const shield_material = new THREE.MeshPhongMaterial( {
            color: 0x2ba0ff,
            emissive: 0x2ba0ff,
            emissiveIntensity: 5,
            transparent: true,
            opacity: 0.2,
            shininess: 1000
        } );
        this.shield = new THREE.Mesh( shield_geometry, shield_material );
        this.shield.scale.set( 1, 1.3, 1 );
        this.shield_light = new THREE.PointLight( 0x2ba0ff, 5, 15 );
        this.shield.geometry.computeBoundingBox();
        this.shield.geometry.computeBoundingSphere();
        this.shield.visible = false;
        this.shield_light.visible = false;
        this.context.add( this.shield );
        this.context.add( this.shield_light );
    }

    step() {
        super.step();
        if (this.is_started) {
            if (this.animation_time < this.animation_duration - 1) {
                if (this.animation_duration - this.animation_time < 60 * 2) {
                    if ((this.animation_duration - this.animation_time) % (60 / 3) === 0) {
                        if (this.shield.visible === true) {
                            this.shield.visible = false;
                            this.shield_light.visible = false;
                        } else {
                            this.shield.visible = true;
                            this.shield_light.visible = true;
                        }
                    }
                } else {
                    this.shield.visible = true;
                    this.shield_light.visible = true;
                }
            } else if (this.animation_time >= this.animation_duration - 1 ) {
                this.shield.visible = false;
                this.shield_light.visible = false;
            }
        }
    }
}

export default shield_animation;