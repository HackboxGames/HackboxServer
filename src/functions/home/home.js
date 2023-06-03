import replaceLogo from "./replaceLogo";
import addModSettingsButton from "./addModSettingsButton";
import addGithub from "./addGithub";
import removeHackboxLoading from "./removeHackboxLoading";

function mod() {
    console.log("running home mod");
    replaceLogo();
    console.log("replaced logo");
    addModSettingsButton();
    console.log("added mod settings button");
    addGithub();
    console.log("added github link");
    removeHackboxLoading();
    console.log("removed hackbox loading");
}

export default function register() {
    console.log("registering home mod");
    mod();
    console.log("registered home mod");
    //window.addEventListener("home", mod);
}