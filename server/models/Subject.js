const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    courseId: mongoose.SchemaTypes.ObjectId,
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    text: String,
    files: [mongoose.SchemaTypes.ObjectId],
    ratings: [{
        user: mongoose.SchemaTypes.ObjectId,
        rating: Number,
    }],
})


module.exports = mongoose.model('Subject', subjectSchema)
