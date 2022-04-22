
const bg = document.getElementById("img-bg");
const bg2 = document.getElementById("img-bg-2");
const bg3 = document.getElementById("img-bg-3");

const paralax = (event) => {

    //console.log(event);

    //const xPersent = window.screen.width / event.screenX;
    
    const xPersent = event.screenX / window.screen.width;
    bg.style.transform = `translateX(${xPersent * 100 * 0.01 + "%"}) scale(1.1, 1)`;
    bg2.style.transform = `translateX(${xPersent * 100 * 0.05 + "%"})`;
    bg3.style.transform = `translateX(${xPersent * 100 * 0.1 + "%"})`;
}

window.onmousemove = paralax;