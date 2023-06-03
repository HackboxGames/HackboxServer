async function mod(){
    let json = await fetch("/hackbox/mods/jackbox-talks/");
    let text = await json.text();
    console.log(text);
    console.log("Jackbox Talks Mod Loaded");
}

export default function register() {
    window.addEventListener("jackbox-talks", mod);
}