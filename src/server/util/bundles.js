const fs = require("fs");
const path = require("path");

const hackbox = require("../mods/hackbox.js");

async function modBundle(bundle) {
    let data = await fetch("https://bundles.jackbox.tv/main/pp7-jackboxtalks/" + gameAssetFiles.bundles["jackbox-talks"].css[0]);
    data = await data.text();
    let moddedData = hackbox("pp7", bundle, gameAssetFiles.bundles["jackbox-talks"].css[0], data);
    fs.mkdirSync(path.resolve(bundlesDirectory, "Party Pack 7", "Talking Points", "assets"), { recursive: true });
    fs.writeFileSync(path.resolve(bundlesDirectory, "Party Pack 7", "Talking Points", gameAssetFiles.bundles["jackbox-talks"].css[0]), moddedData);
    gameAssetBundles["Party Pack 7"]["Talking Points"].push(gameAssetFiles.bundles["jackbox-talks"].css[0]);
    console.log(gameAssetBundles["Party Pack 7"]["Talking Points"]);
}

async function modBundles() {
    for (let pack in gameAssets) {
        fs.mkdirSync(path.resolve(bundlesDirectory, pack), { recursive: true });
        gameAssetBundles[pack] = {};
        for (let game in gameAssets[pack]) {
            fs.mkdirSync(path.resolve(bundlesDirectory, pack, game), { recursive: true });
            gameAssetBundles[pack][game] = [];
            console.log(`Modding ${game}...`);
            await modBundle("jackboxtalks");
        }
    }
}

module.exports = {
    modBundle, modBundles
}