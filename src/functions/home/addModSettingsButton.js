import * as UTIL from '../util.js';

export default function addModSettingsButton() {
    const fieldset = UTIL.getFrame().find("fieldset");
    const fieldData = Object.keys(fieldset.data())[0].substring(1).toLowerCase();
    const settingsButton = UTIL.$(document.createElement("button"));
    settingsButton.text("MOD SETTINGS");
    settingsButton.attr(`data-v-${fieldData}`, "");
    settingsButton.attr("id", "button-settings");
    settingsButton.on("click", () => {
        window.location.href = "/settings";
    });
    fieldset.append(settingsButton);
}