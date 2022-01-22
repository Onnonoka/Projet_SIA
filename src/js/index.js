"uses strict";

import screenManager from "./screenManager.js";
import testScreen from "./test_screen.js";

const selector = '#app';

let screen_manager, screen;

const go = () => {
    console.log("go");
    
    screen_manager = new screenManager(selector);
    screen = new testScreen(screen_manager);
    screen_manager.set_screen(screen);
}


window.addEventListener('load', go);