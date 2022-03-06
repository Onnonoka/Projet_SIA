import power_up from "./power_up.js";

class dematerialize extends power_up {

    constructor() {
        super();
    }

    action() {
        this.mesh.material.opacity = 0.4;
        this.mesh.material.transparent = true;
        this.is_immune = true;
        setTimeout( () => {
            const interval = setInterval( () => {
                if (  this.mesh.material.transparent === true ) {
                    this.mesh.material.opacity = 1;
                    this.mesh.material.transparent = false;
                } else {
                    this.mesh.material.opacity = 0.4;
                    this.mesh.material.transparent = true;
                }
            }, 200 );
            setTimeout( () => {
                clearInterval( interval );
                this.mesh.material.opacity = 1;
                this.mesh.material.transparent = false;
                this.is_immune = false;
            }, 2000);
        }, 8000 );
    }
}

export default dematerialize;