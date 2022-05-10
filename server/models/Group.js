const mongoose = require('mongoose')


const groupSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: 'This is the group description.'
    },
    userIds: [mongoose.SchemaTypes.ObjectId],
    files: [mongoose.SchemaTypes.ObjectId],
    comments: [mongoose.SchemaTypes.ObjectId]
})


module.exports = mongoose.model("Group", groupSchema)