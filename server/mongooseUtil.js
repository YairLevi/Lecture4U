const Unit = require('./models/Unit')
const Subject = require("./models/Subject");
const File = require('./models/File')

module.exports = {
    mapAsync: async function (list, func) {
        return await Promise.all(list.map(func))
    },
    clone: async function (model, id) {
        return (await model.findById(id))._doc
    },
    deleteIdsFromModel: async function (model, arrIds) {
        for (const id of arrIds) await model.findByIdAndDelete(id)
    },
    deleteUnit: async function(unitId) {
        const unit = await Unit.findById(unitId)
        for (const subjectId of unit.subjects) {
            const subject = await Subject.findById(subjectId)
            for (const fileId of subject.files) {
                await File.findByIdAndDelete(fileId)
            }
            await Subject.findByIdAndDelete(subjectId)
        }
        await Unit.findByIdAndDelete(unitId)
    }
}