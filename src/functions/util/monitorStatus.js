import { getFrame } from "../util.js";

let status = "home";

function signalGameMods(){
    const frame = getFrame();
    const div = frame.find(".pt-page").first();
    if (div.hasClass("jackbox-talks")){
        window.dispatchEvent(new Event('jackbox-talks'));
    } else {
        console.log("Unknown Game Detected");
        window.dispatchEvent(new Event('game'));
    }
}

function checkStatus() {
    const frame = getFrame();
    const app = frame.find("#app").first();
    if (app.find(".sign-in").length > 0 && status != "home") {
        status = "home";
        window.dispatchEvent(new Event('home'));
    } else if (app.find(".app-root").length > 0 && status != "game") {
        status = "game";
        signalGameMods();
    }
}

export default function monitorStatus() {
    return new Promise((resolve, reject) => {
        
        const frame = document.getElementById("jackbox").document || document.getElementById("jackbox").contentWindow.document;
        
        const observer = new MutationObserver(checkStatus);
        
        observer.observe(frame.body, {
            childList: true,
            subtree: true
        });

        window.dispatchEvent(new Event('home'));

        resolve();

    });
}