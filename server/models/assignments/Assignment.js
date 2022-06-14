const mongoose = require('mongoose')
const Submission = require("./Submission");
const User = require("../User");
const { getFileData } = require("../../cloud/files");
const { clone } = require("../../mongooseUtil");


const assignmentSchema = new mongoose.Schema({
    name: String,
    text: String,
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    courseId: mongoose.SchemaTypes.ObjectId,
    dueDate: {
        type: Date,
        required: true
    },
    number: {
        type: Number,
        default: null,
    },
    files: [mongoose.SchemaTypes.ObjectId],
    submissions: [mongoose.SchemaTypes.ObjectId]
})

assignmentSchema.methods.getSubmissions = async function () {
    const submissions = this._doc.submissions
    return await Promise.all(submissions
        .map(async submissionId => {
            const submission = (await Submission.findById(submissionId))._doc
            submission.userIds = await Promise.all(submission.userIds.map(async userId => {
                const user = await clone(User, userId)
                user.profileImage = await getFileData(user.profileImage)
                return user
            }))
            submission.files = await Promise.all(submission.files.map(fileId => getFileData(fileId)))
            return submission
        }))
}


module.exports = mongoose.model('Assignment', assignmentSchema)