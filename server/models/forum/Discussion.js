const mongoose = require('mongoose')


const discussionSchema = new mongoose.Schema({
    createdAt: Date,
    mostRecent: Date,
    course: [mongoose.SchemaTypes.ObjectId],
    title: String,
    author: mongoose.SchemaTypes.ObjectId,
    question: String,
    comments: [mongoose.SchemaTypes.ObjectId]
})


module.exports = mongoose.model('Discussion', discussionSchema)