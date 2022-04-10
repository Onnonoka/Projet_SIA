

class hud {

    constructor() {
        this.container = document.getElementById( "hud" );
        this.score_container = document.getElementById( "score" );
        this.life_container = document.getElementById( "life" );
        this.weapon_container = document.getElementById( "weapon" );
        this.message_container = document.getElementById( "message" );
        this.action_request_container = document.getElementById( "action_request" );
        this.fade_screen = document.getElementById( "fade_screen" );
        this.help = document.getElementById("help_screen");
        this.top_left = document.getElementById("top-left");
        this.top_right = document.getElementById("top-right");
        this.bottom_left = document.getElementById("bottom-left");
        this.bottom_right = document.getElementById("bottom-right");
        this.help_visible = false;
    }

    set_message( message = "" ) {
        this.message_container.innerHTML = message;
    }

    set_score( score = "" ) {
        this.score_container.innerHTML = score;
    }

    set_life( life = "" ) {
        //this.life_container.innerHTML = life;
    }

    set_weapon( weapon = "" ) {
        //this.weapon_container.innerHTML = weapon;
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

    displayHelp() {
        if (this.help.style.display === 'flex') {
            this.help.style.display = 'none';
            this.help_visible = false;
        } else {
            this.help.style.display = 'flex';
            this.help_visible = true;
        }
    }

    display_hud() {
        this.top_left.style.display = 'flex';
        this.top_right.style.display = 'flex';
        this.bottom_left.style.display = 'flex';
        this.bottom_right.style.display = 'flex';
    }
    
    start_hud_anim() {
        this.display_hud();
        document.getElementById("top-left-bg").classList.add("top-left-anim");
        document.getElementById("top-right-bg").classList.add("top-right-anim");
        document.getElementById("bottom-left-bg").classList.add("bottom-left-anim");
        document.getElementById("bottom-right-bg").classList.add("bottom-right-anim");
    }

}

export default hud;