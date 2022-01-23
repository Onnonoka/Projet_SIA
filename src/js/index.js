"uses strict";

import screenManager from "./screenManager.js";
import testScreen from "./test_screen.js";
import mesh from "./mesh.js";

const selector = '#app';

let screen_manager, screen, test;

const go = () => {
    console.log("go");
    
    screen_manager = new screenManager(selector);
    screen = new testScreen(screen_manager);
    screen_manager.set_screen(screen);
    test = new mesh();
}


window.addEventListener('load', go);