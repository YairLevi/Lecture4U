const path = require("path");
const File = require('../models/File')
const storage = require('../cloud/storage')
const { bucketName } = require('../cloud/storage')
const fs = require("fs");


module.exports = {
    getFileData: async function (id, expires = new Date().addHours(100)) {
        const details = { _id: id }

        const fileObject = await File.findById(id)
        const bucket = storage.bucket(fileObject.bucket)
        const file = bucket.file(fileObject.file)

        details.url = await file.getSignedUrl({ action: 'read', expires: expires })
        details.name = fileObject.file.split('/').slice(-1).pop()

        return details
    },

    uploadFile: async function (file, path) {
        const bucket = storage.bucket(bucketName)
        const didExist = await bucket.file(path).exists()
        await bucket.upload(file.path, { destination: path })
        fs.unlinkSync(file.path)
        if (didExist[0]) {
            const file = await File.findOne({ file: path })
            return file._id
        }
        const fileObject = await File.create({ bucket: bucketName, file: path })
        return fileObject._id
    },

    deleteListOfFilesById: async function (fileIds) {
        for (const fileId of fileIds) {
            const file = await File.findById(fileId)
            const bucket = storage.bucket(file.bucket)
            await bucket.deleteFiles({ prefix: file.file })
            await File.findByIdAndDelete(fileId)
        }
    },

    deleteCourseFolder: async function (courseId) {
        const path = `courseId-${courseId}/`
        const bucket = storage.bucket(bucketName)
        await bucket.deleteFiles({ prefix: path })
    },

    deleteByPrefix: async function (prefix) {
        const bucket = storage.bucket(bucketName)
        await bucket.deleteFiles({ prefix })
    },

    deleteFile: async function (fileId) {
        const file = await File.findById(fileId)
        const bucket = storage.bucket(file.bucket)
        await bucket.file(file.file).delete()
        await File.findByIdAndDelete(fileId)
    },
}