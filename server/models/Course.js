const mongoose = require('mongoose')
const Image = require('./Image')

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    teacher: String,
    description: String,
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    image: {
        type: Image.schema,
        immutable: true
    }
})



module.exports = mongoose.model('Course', courseSchema)
