import power_up from "./power_up.js";

class extra_file extends power_up {

    constructor() {
        super();
    }

    action() {
        this.life++;
        console.log( this.life, "life");
    }
}

export default extra_file;