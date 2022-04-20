const mongoose = require('mongoose')


const discussionSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: () => Date.now()
    },
    mostRecent: {
        type: Date,
        default: () => Date.now()
    },
    title: String,
    author: mongoose.SchemaTypes.ObjectId,
    question: String,
    comments: [mongoose.SchemaTypes.ObjectId]
})


module.exports = mongoose.model('Discussion', discussionSchema)