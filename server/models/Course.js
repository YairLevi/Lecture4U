const mongoose = require('mongoose')
const uuid = require('uuid')
const Image = require('./Image')

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    staff: [String],
    description: String,
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    code: {
        type: String,
        immutable: true,
        default: () => uuid.v4()
    },
    image: Image.schema
})



module.exports = mongoose.model('Course', courseSchema)
