const mongoose = require('mongoose')


const ocrTimestampHistorySchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: () => Date.now()
    },
    timestampHistory: [mongoose.SchemaTypes.ObjectId]
})


module.exports = mongoose.model("OcrTimestampHistory", ocrTimestampHistorySchema)