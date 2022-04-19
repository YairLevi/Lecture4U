const mongoose = require('mongoose')


const commentSchema = new mongoose.Schema({
    createdAt: Date,
    author: mongoose.SchemaTypes.ObjectId,
    text: String
})


module.exports = mongoose.model('Comment', commentSchema)