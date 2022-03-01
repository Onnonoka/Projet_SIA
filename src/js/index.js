"uses strict";

import model from "./model.js";
import vue from "./vue.js";
import controler from "./controler.js";

const go = () => {
    console.log("go");
    
    /*screen_manager = new screenManager( selector );
    screen = new game_screen( screen_manager );
    screen_manager.set_screen( screen );*/
    const m = new model();
    const v = new vue( m );
    const c = new controler( m, v );
    c.start();
    
}


window.addEventListener('load', go);