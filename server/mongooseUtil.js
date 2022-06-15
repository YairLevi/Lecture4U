
module.exports = {
    mapAsync: async function (list, func) {
        return await Promise.all(list.map(func))
    },
    clone: async function (model, id) {
        return (await model.findById(id))._doc
    },
    deleteIdsFromModel: async function (model, arrIds) {
        for (const id of arrIds) await model.findByIdAndDelete(id)
    }
}