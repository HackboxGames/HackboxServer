const pack7 = require('./Party Pack 7/pack7.js');

module.exports = (pack, game, file, data) => {
    switch (pack) {
        case "pp7":
            return pack7(game, file, data);
        default:
            return data;
    }
}
