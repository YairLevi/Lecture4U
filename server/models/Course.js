const mongoose = require('mongoose')
const Image = require('./Image')
const Unit = require('./Unit')
const Subject = require("./Subject");
const { getFileData } = require('../cloud/files')


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
    const courseData = {...this._doc}
    courseData.units = []

    for (const unitId of this.units) {
        const unit = await Unit.findById(unitId)
        const unitData = {...unit._doc}
        unitData.subjects = []

        for (const subjectId of unit.subjects) {
            const subject = await Subject.findById(subjectId)
            const subjectData = {...subject._doc}
            subjectData.files = []

            for (const fileId of subject.files) {
                const details = await getFileData(fileId)
                subjectData.files.push(details)
            }

            unitData.subjects.push(subjectData)
        }

        courseData.units.push(unitData)
    }

    return courseData
}

module.exports = mongoose.model('Course', courseSchema)