const mongoose = require('mongoose')


const submissionSchema = new mongoose.Schema({
    userIds: {
        type: [mongoose.SchemaTypes.ObjectId],
        required: true,
    },
    files: [mongoose.SchemaTypes.ObjectId],
    date: {
        type: Date,
        default: () => Date.now(),
    },
    text: String,
    grade: {
        type: Number,
        default: -1
    }
})


module.exports = mongoose.model('Submission', submissionSchema)