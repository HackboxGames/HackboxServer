const path = require("path");

module.exports = (data) => {
    let assets = gameAssets["Party Pack 7"]["Talking Points"];
    for (let i = 0; i < assets.length; i++) {
        let id = path.parse(assets[i]).name;
        let startingPoint = data.indexOf(`.photo-${id}-thumb`);
        let urlStartingPoint = data.indexOf("url(", startingPoint) + 4;
        let urlEndingPoint = data.indexOf(")", urlStartingPoint);
        let url = data.substring(urlStartingPoint, urlEndingPoint);
        data = data.replace(url, `/hackbox/mods/pp7/jackbox-talks/assets/${id}.jpg`);
    }
    return data;
}