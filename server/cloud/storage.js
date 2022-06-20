const { Storage } = require("@google-cloud/storage");
const path = require("path");

const bucketName = process.env.BUCKET_NAME
const storage = new Storage({
    keyFilename: path.join(__dirname, '../../steam-treat-347709-462a24be0c62.json')
});

module.exports = storage
module.exports.bucketName = bucketName