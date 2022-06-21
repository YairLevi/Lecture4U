const { Storage } = require("@google-cloud/storage");
const path = require("path");

const bucketName = process.env.BUCKET_NAME
const storage = new Storage({
    keyFilename: path.join(__dirname, '../../protean-trilogy-335015-7b854e39cda4.json')
});

module.exports = storage
module.exports.bucketName = bucketName