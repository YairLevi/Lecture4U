const path = require("path");
const File = require('../models/File')
const storage = require('../cloud/storage')
const { bucketName } = require('../cloud/storage')
const fs = require("fs");


module.exports = {
    getFileData: async function (id, expires=new Date().addHours(1)) {
        const details = {}

        const fileObject = await File.findById(id)
        const bucket = storage.bucket(fileObject.bucket)
        const file = bucket.file(fileObject.file)

        details.url = await file.getSignedUrl({ action: 'read', expires: expires })
        details.name = fileObject.file.split('/').slice(-1).pop()

        return details
    },

    uploadFile: async function (file, path) {
        const bucket = storage.bucket('lecture4u-3')
        await bucket.upload(file.path, { destination: path })
        const fileObject = await File.create({ bucket: 'lecture4u-3', file: path })
        return fileObject._id
    }
}