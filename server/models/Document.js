const { Schema, model } = require("mongoose")

const Document = new Schema({
    name: String,
    createdAt: {
        type: Date,
        default: () => Date.now()
    },
    data: Object
})

module.exports = model("Document", Document)
