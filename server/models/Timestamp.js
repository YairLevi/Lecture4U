const mongoose = require('mongoose')

const timestampSchema = new mongoose.Schema({
    userId: mongoose.SchemaTypes.ObjectId,
    data: [Object]
})

module.exports = mongoose.model('Timestamp', timestampSchema)