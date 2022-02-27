

class hud {

    constructor() {
        this.container = document.getElementById( "hud" );
        this.score_container = document.getElementById( "score" );
        this.life_container = document.getElementById( "life" );
        this.weapon_container = document.getElementById( "weapon" );
        this.message_container = document.getElementById( "message" );
        this.action_request_container = document.getElementById( "action_request" );

    }

    set_message( message = "" ) {
        this.message_container.innerHTML = message;
    }

    set_score( score = "" ) {
        this.score_container.innerHTML = score;
    }

    set_life( life = "" ) {
        this.life_container.innerHTML = life;
    }

    set_weapon( weapon = "" ) {
        this.weapon_container.innerHTML = weapon;
    }

    set_action_request( message = "" ) {
        this.action_request_container.innerHTML = message;
    }

    clear() {
        this.set_message();
        this.set_score();
        this.set_life();
        this.set_weapon();
        this.set_action_request();
    }

}

export default hud;