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
    files: [mongoose.SchemaTypes.ObjectId]
})


module.exports = mongoose.model('Subject', subjectSchema)
