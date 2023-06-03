import * as UTIL from '../util.js';

export default function addGithub() {
    const recent = UTIL.getFrame().find(".recent").first();
    if (recent.length > 0) return;
    const bottomDiv = UTIL.getFrame().find(".constrain").last();
    const bottomDivData = Object.keys(bottomDiv.data())[0].substring(2).toLowerCase();
    const newDiv = UTIL.$(document.createElement("div"));
    newDiv.attr("id", "credits");
    newDiv.css("display", "flex");
    const githubLink = UTIL.$(document.createElement("a"));
    const bottomLogo = UTIL.getFrame().find("a.bottom-logo").first();
    githubLink.attr(`data-v-${bottomDivData}`, "");
    githubLink.addClass("bottom-logo");
    githubLink.css("background-image", "url('/hbassets/hackbox-github.png')");
    githubLink.attr("target", "_blank");
    githubLink.attr("href", "https://github.com/MeAwesome");
    githubLink.text("MeAwesome");
    bottomLogo.detach();
    newDiv.append(bottomLogo);
    newDiv.append(githubLink);
    bottomDiv.append(newDiv);
}