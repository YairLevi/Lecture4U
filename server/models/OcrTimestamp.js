const mongoose = require('mongoose')


const ocrTimestampSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: () => Date.now()
    },
    name: String,
    file: mongoose.SchemaTypes.ObjectId,
})


module.exports = mongoose.model("OcrTimestamp", ocrTimestampSchema)