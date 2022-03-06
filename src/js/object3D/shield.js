import power_up from "./power_up.js";

class shield extends power_up {

    constructor() {
        super();
    }

    action() {
        this.shield.visible = true;
        this.shield_light.visible = true;
        setTimeout( () => {
            const interval = setInterval( () => {
                if (  this.shield.visible === true ) {
                    this.shield.visible = false;
                    this.shield_light.visible = false;
                } else {
                    this.shield.visible = true;
                    this.shield_light.visible = true;
                }
            }, 200 );

            setTimeout( () => {
                clearInterval( interval );
                this.shield.visible = false;
                this.shield_light.visible = false;
            }, 2000);
        }, 8000 );
    }
}

export default shield;