const mongoose = require('mongoose')
const Image = require('./Image')
const { Unit } = require('./Unit')



const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    teacher: String,
    description: String,
    units: [mongoose.SchemaTypes.ObjectId],
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    image: {
        type: Image.schema,
        immutable: true
    }
})

courseSchema.methods.getCourseData = async function () {
    const data = {
        name: this.name,
        teacher: this.teacher,
        description: this.description
    }
    data.units = []
    for (const unitId of this.units) {
        const unit = await Unit.findById(unitId)
        data.units.push(unit)
    }
    return data
}

module.exports.Course = mongoose.model('Course', courseSchema)