const jackboxTalks = require("./jackbox-talks/jackbox-talks.js");

module.exports = (game, file, data) => {
    switch (game) {
        case "jackboxtalks":
            return jackboxTalks(file, data);
        default:
            return data;
    }
}