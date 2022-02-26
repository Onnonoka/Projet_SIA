

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

    set_score( score = "0 0 0 0" ) {
        this.score_container.innerHTML = score;
    }

    set_life( life = "0" ) {
        this.life_container.innerHTML = life;
    }

    set_weapon( weapon = "00" ) {
        this.weapon_container.innerHTML = weapon;
    }

    set_action_request( message = "" ) {
        this.action_request_container.innerHTML = message;
    }

}

export default hud;