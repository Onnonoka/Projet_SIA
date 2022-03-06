import power_up from "./power_up.js";

class rapide_fire extends power_up {

    constructor() {
        super();
    }

    action() {
        this.fire_rate /= 2;
        setTimeout( () => {
            this.fire_rate *= 2;
        }, 5000 );
    }
}

export default rapide_fire;