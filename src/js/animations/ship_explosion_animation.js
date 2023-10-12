import * as THREE from 'three';

import animation from "./animation.js";

class ship_explosion_animation extends animation {

    size = new THREE.Vector3();

    constructor(context, maxScale, sound, color) {
        super(60);
        this.context = context;
        this.maxScale = maxScale;
        this.context.mesh.geometry.boundingBox.getSize(this.size);
        const torus_geometry = new THREE.TorusGeometry(this.size.x, 1, 4, 30);
        const sphere_geometry = new THREE.SphereGeometry(this.size.x, 30, 30);
        const mat = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 1,
            transparent: true,
            opacity: 0
        });
        this.torus = new THREE.Mesh(torus_geometry, mat);
        this.sphere = new THREE.Mesh(sphere_geometry, mat);
        this.torus.visible = false;
        this.sphere.visible = false;
        this.material = mat;
        this.context.add(this.torus);
        this.context.add(this.sphere);
        this.sounds.sound = new Audio("src/medias/sounds/explosion_3.mp3");
        this.sounds.sound.volume = sound;
    }

    step() {
        super.step();
        if (this.is_started) {
            this.context.is_lock = true;
            this.torus.visible = true;
            this.sphere.visible = true;
            if (this.animation_duration - this.animation_time > 0) {
                const current = ((this.maxScale - this.sphere.scale.x) / this.animation_duration) * this.animation_time;
                this.torus.scale.set(current * current, current * current, current * current);
                this.sphere.scale.set(current, current, current);
                this.material.opacity = 1 - (1 / (this.animation_duration - 1)) * this.animation_time;
            } else if (this.animation_time === this.animation_duration - 1) {
                this.torus.visible = false;
                this.sphere.visible = false;
            }
        }
    }
    
    reset() {
        super.reset();
        this.material.opacity = 0;
        this.torus.scale.set(1, 1, 1);
        this.sphere.scale.set(1, 1, 1);
    }

    start() {
        super.start();
        this.sounds.sound.play();
    }
}

export default ship_explosion_animation;