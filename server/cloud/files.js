const { Storage } = require("@google-cloud/storage");
const path = require("path");
const File = require('../models/File')
const storage = require('../cloud/storage')


module.exports = {
    getFileData: async function (id) {
        const details = {}

        const fileObject = await File.findById(id)
        const bucket = storage.bucket(fileObject.bucket)
        const file = bucket.file(fileObject.file)

        details.url = await file.getSignedUrl({ action: 'read', expires: new Date().addHours(1) })
        details.name = fileObject.file.split('/').slice(-1).pop()

        return details
    }
}