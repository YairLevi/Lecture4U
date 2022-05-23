const mongoose = require('mongoose')


const eventSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    title: String,
    args: []
})


module.exports = mongoose.model('Event', eventSchema)