const mongoose = require('mongoose')


const assignmentSchema = new mongoose.Schema({
    name: String,
    text: String,
    dueDate: {
        type: Date,
        required: true
    },
    number: Number,
    files: [mongoose.SchemaTypes.ObjectId]
})


module.exports = mongoose.model('Assignment', assignmentSchema)