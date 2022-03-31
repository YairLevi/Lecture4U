const mongoose = require("mongoose");


const unitSchema = new mongoose.Schema({
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
    subjects: [mongoose.SchemaTypes.ObjectId]
})

module.exports = mongoose.model('Unit', unitSchema)