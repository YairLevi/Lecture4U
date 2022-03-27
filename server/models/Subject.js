const mongoose = require("mongoose");


const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    text: String,
    files: [String]
})
module.exports.Subject = mongoose.model('Subject', subjectSchema)
