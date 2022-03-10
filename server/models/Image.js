const mongoose = require('mongoose')


const imageSchema = new mongoose.Schema({
    bucket: {
        type: String,
        required: true,
    },
    file: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('Image', imageSchema)