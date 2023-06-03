require('module-alias/register');
const next = require('next');
const express = require("express");
const proxy = require('express-http-proxy');
const parseHTML = require('node-html-parser').parse;
const fs = require("fs");
const path = require("path");

const dev = process.env.NODE_ENV !== 'production';
const nextapp = next({ dev });
const handle = nextapp.getRequestHandler();

const { modBundles } = require("./util/bundles.js");

const hackbox = require("./mods/hackbox.js");

let versionCheckedSinceLastRestart = false;

global.rootDirectory = path.resolve(path.normalize("../"));
global.bundlesDirectory = path.resolve(rootDirectory, "bundles");
global.modsDirectory = path.resolve(rootDirectory, "mods");
global.hbDirectory = path.resolve(path.normalize("./"))

global.gameAssetFiles = {};
global.gameAssetBundles = {};
global.gameAssets = {};

async function start() {
    console.clear();
    console.log("Hackbox Server Booting");
    await loadBundles();
    await loadAssets();
    await prepareNextjs();
    await hostWebsite();
    console.log("Hackbox Server Available");
}

function loadBundles() {
    return new Promise((resolve, reject) => {
        console.log("Loading Bundles...");
        try {
            gameAssetFiles = JSON.parse(fs.readFileSync(path.resolve(bundlesDirectory, "gameAssetFiles.json")));
        } catch (err) {
            console.log("gameAssetFiles.json not found");
        }
        console.log("Bundles Loaded!");
        resolve();
    });
}

function loadAssets() {
    return new Promise((resolve, reject) => {
        console.log("Loading Assets...");
        let packs = fs.readdirSync(modsDirectory);
        for (let pack of packs) {
            gameAssets[pack] = {};
            let games = fs.readdirSync(path.resolve(modsDirectory, pack));
            for (let game of games) {
                gameAssets[pack][game] = [];
                let assets = fs.readdirSync(path.resolve(modsDirectory, pack, game, "assets"));
                for (let asset of assets) {
                    gameAssets[pack][game].push(asset);
                }
            }
        }
        console.log("Assets Loaded!");
        resolve();
    });
}

function prepareNextjs() {
    return new Promise(async (resolve, reject) => {
        console.log("Preparing Next.js...");
        await nextapp.prepare();
        console.log("Next.js is ready!");
        resolve();
    });
}

function reqNeedsJackboxProxy(req) {
    let pth = path.resolve(hbDirectory, req.url.substring(1));
    let a = path.resolve(hbDirectory, "src", "app", req.url.substring(1));
    let required = true;
    if (fs.existsSync(pth)) {
        required = false;
    }
    if (fs.existsSync(a)) {
        required = false;
    }
    if (req.url == "/") {
        required = false;
    }
    if (req.url.startsWith("/_next")) {
        required = false;
    }
    return required;
}

function searchForGameAssetFiles(data) {
    if (!versionCheckedSinceLastRestart) {
        let startingPoint = data.indexOf('main:{');
        let endingPoint = data.indexOf("}}}", startingPoint);
        let rawString = data.substring(startingPoint + 5, endingPoint + 3);
        let parsedString = rawString.replace(/(([a-z])\w+):/g, '"$1":');
        let recentGameAssetFiles = JSON.parse(parsedString);
        if (!gameAssetFiles.hasOwnProperty("version") || gameAssetFiles.version != recentGameAssetFiles.version) {
            gameAssetFiles = recentGameAssetFiles;
            fs.writeFileSync(path.resolve(bundlesDirectory, "gameAssetFiles.json"), JSON.stringify(gameAssetFiles, null, 4));
            modBundles();
        }
        versionCheckedSinceLastRestart = true;
    }
}

function serveHBAssets(req, res) {
    let assetPath = path.resolve(hbDirectory, "src", req.url.substring(1));
    return res.sendFile(assetPath);
}

function serveModdedAssets(req, res) {
    let rawAssetPath = req.url.substring(req.url.indexOf("/hackbox/mods") + 14);
    let fixedAssetPath = rawAssetPath.replace("pp7", "Party Pack 7").replace("jackbox-talks", "Talking Points");
    let assetPath = path.resolve(modsDirectory, fixedAssetPath);
    return res.sendFile(assetPath);
}

function serveModdedBundles(req, res) {
    let rawBundlePath = req.url.substring(req.url.indexOf("/bundles/main") + 14);
    let fixedBundlePath = rawBundlePath.replace("pp7", "Party Pack 7").replace("jackboxtalks", "Talking Points").replace("-", "/");
    let bundlePath = path.resolve(bundlesDirectory, fixedBundlePath);
    if (fs.existsSync(bundlePath)) {
        return res.sendFile(bundlePath);
    }
    req.url = req.url.replace("/bundles", "");
    return proxy("https://bundles.jackbox.tv", {
        // userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        //     return moddedGameAssets(userReq, proxyResData.toString('utf8'));
        // }
    })(req, res);
}

function moddedGameAssets(req, data) {
    let bundle = req.url.split("/")[2];
    if (bundle != "@connect") {
        let pack = bundle.split("-")[0];
        let game = bundle.split("-")[1];
        let file = req.url.substring(req.url.indexOf(bundle) + bundle.length + 1);
        data = hackbox(pack, game, file, data);
    }
    return data
}

function hostWebsite() {
    return new Promise(async (resolve, reject) => {
        const server = express();
        
        server.all("*", (req, res) => {
            if (req.url.startsWith("/hbassets")) {
                return serveHBAssets(req, res);
            } else if (req.url.startsWith("/hackbox/mods")) {
                return serveModdedAssets(req, res);
            } else if (req.url.startsWith("/bundles")) {
                return serveModdedBundles(req, res);
            } else if (reqNeedsJackboxProxy(req)) {
                return proxy("https://jackbox.tv", {
                    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
                        if (userReq.url == "/proxy/jackbox/") {
                            const html = parseHTML(proxyResData.toString('utf8'));
                            const body = html.querySelector("body");
                            body.appendChild(parseHTML('<div id="hackbox-loader" style="position:fixed;top:0;left:0;width:100%;height:100%;background-color:black;z-index:1;"></div>'));
                            return html.toString();
                        } else if (userReq.url.endsWith(".js")) {
                            searchForGameAssetFiles(proxyResData.toString('utf8'));
                            return proxyResData.toString('utf8').replace("https://bundles.jackbox.tv", "/bundles");
                        }
                        return proxyResData;
                }})(req, res);
            }
            return handle(req, res);
        });

        server.listen(4444, () => {
            console.log("Hackbox Website listening on port 4444");
            resolve();
        });

    });
}

start();