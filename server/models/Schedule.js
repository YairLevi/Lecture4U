const mongoose = require('mongoose')


const scheduleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    schedule: {
        type: [Object],
        required: true
    }
})


module.exports = mongoose.model('Schedule', scheduleSchema)