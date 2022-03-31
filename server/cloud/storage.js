const { Storage } = require("@google-cloud/storage");
const path = require("path");

const storage = new Storage({
    keyFilename: path.join(__dirname, '../avid-battery-339118-75042e644d3f.json')
});

module.exports = storage
