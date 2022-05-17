const mongoose = require('mongoose')
const Submission = require("./Submission");
const User = require("../User");
const { getFileData } = require("../../cloud/files");


const assignmentSchema = new mongoose.Schema({
    name: String,
    text: String,
    courseId: mongoose.SchemaTypes.ObjectId,
    dueDate: {
        type: Date,
        required: true
    },
    number: Number,
    files: [mongoose.SchemaTypes.ObjectId],
    submissions: [mongoose.SchemaTypes.ObjectId]
})

assignmentSchema.methods.getSubmissions = async function () {
    const submissions = this._doc.submissions
    return await Promise.all(submissions
        .map(async submissionId => {
            const submission = (await Submission.findById(submissionId))._doc
            submission.userIds = await Promise.all(submission.userIds.map(userId => User.findById(userId)))
            submission.files = await Promise.all(submission.files.map(fileId => getFileData(fileId)))
            return submission
        }))
}


module.exports = mongoose.model('Assignment', assignmentSchema)