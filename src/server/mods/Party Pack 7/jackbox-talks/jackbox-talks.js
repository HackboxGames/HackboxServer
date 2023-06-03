const path = require("path");
const fs = require("fs");
const modCSS = require("./modCSS.js");

module.exports = (file, data) => {
    let ext = file.split(".").pop();
    switch (ext) {
        case "css":
            if (gameAssetBundles["Party Pack 7"]["Talking Points"].includes(file)){
                return fs.readFileSync(path.resolve(bundlesDirectory, "Party Pack 7", "Talking Points", file));
            }
            console.log("modding jackbox-talks css");
            return modCSS(data);
        case "js":
            //console.log("modding jackbox-talks javascript");
            return data;
        default:
            return data;
    }
}