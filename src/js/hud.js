

class hud {

    
    is_end_menu_open = false;

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

    set_life(life = 3) {
        this.life_container.innerHTML = "";
        for (let i = 3 - life; i > 0; i--) {
            this.life_container.innerHTML += `<img class="heart-empty" src="src/medias/images/heart-regular.svg"/>`;
        }
        if (life > 4) {
            life = 4;
        }
        for (let i = life; i > 0; i--) {
            this.life_container.innerHTML += `<img class="heart-full" src="src/medias/images/heart-solid.svg"/>`;
        }
    }

    set_weapon( weapon = "" ) {
        //this.weapon_container.innerHTML = weapon;
    }

    set_action_request( message = "" ) {
        if (message === "") {
            this.action_request_container.style.display = "none";
        } else {
            this.action_request_container.style.display = "flex";
        }
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
        document.getElementById("score").classList.add("top-left-anim");
        document.getElementById("top-right-bg").classList.add("top-right-anim");
        document.getElementById("life").classList.add("top-right-anim-scaleless");
        document.getElementById("bottom-left-bg").classList.add("bottom-left-anim");
        document.getElementById("bottom-right-bg").classList.add("bottom-right-anim");
    }

    display_end_game_menu(score, life) {
        this.is_end_menu_open = true;
        document.getElementById("end_game").style.display = "flex";
        let heart_container = document.getElementById("heart");
        for (let i = life; i > 0; i--) {
            heart_container.innerHTML += `<img class="heart-empty" src="src/medias/images/heart-regular.svg"/>`;
        }
        document.getElementById("final_score").innerHTML = score;
    }

    clear_hud() {
        this.help_visible = false;
        this.help.style.display = 'none';
        this.top_left.style.display = 'none';
        this.top_right.style.display = 'none';
        this.bottom_left.style.display = 'none';
        this.bottom_right.style.display = 'none';
        document.getElementById("end_game").style.display = "none";
        document.getElementById("heart").innerHTML = "";
        document.getElementById("final_score").innerHTML = "";
        document.getElementById("top-left-bg").classList.remove("top-left-anim");
        document.getElementById("score").classList.remove("top-left-anim");
        document.getElementById("top-right-bg").classList.remove("top-right-anim");
        document.getElementById("life").classList.remove("top-right-anim-scaleless");
        document.getElementById("bottom-left-bg").classList.remove("bottom-left-anim");
        document.getElementById("bottom-right-bg").classList.remove("bottom-right-anim");

    }

}

export default hud;