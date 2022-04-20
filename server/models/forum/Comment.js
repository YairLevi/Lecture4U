const mongoose = require('mongoose')


const commentSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: () => Date.now()
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('Comment', commentSchema)