const mongoose = require('mongoose')
const Image = require('./Image')
const Unit = require('./Unit')
const Subject = require("./Subject");
const { getFileData } = require('../cloud/files')
const Submission = require('./assignments/Submission')
const User = require('./User')
const Assignment = require('./assignments/Assignment')
const { clone } = require("../mongooseUtil");


const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    teacher: mongoose.SchemaTypes.ObjectId,
    description: String,
    units: [mongoose.SchemaTypes.ObjectId],
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    discussions: [mongoose.SchemaTypes.ObjectId],
    image: {
        type: Image.schema,
        immutable: true
    },
    students: [mongoose.SchemaTypes.ObjectId],
    assignments: [mongoose.SchemaTypes.ObjectId],
    access: Object,
})

courseSchema.methods.getCourseData = async function () {
    const courseData = { ...this._doc }
    courseData.units = []

    for (const unitId of this.units) {
        const unit = await Unit.findById(unitId)
        const unitData = { ...unit._doc }
        unitData.subjects = []

        for (const subjectId of unit.subjects) {
            const subject = await Subject.findById(subjectId)
            const subjectData = { ...subject._doc }
            subjectData.files = []

            for (const fileId of subject.files) {
                const details = await getFileData(fileId)
                subjectData.files.push(details)
            }

            unitData.subjects.push(subjectData)
        }

        courseData.units.push(unitData)
    }

    if (courseData.teacher) {
        courseData.teacher = await clone(User, courseData.teacher)
        courseData.teacher.profileImage = await getFileData(courseData.teacher.profileImage)
    }

    return courseData
}

courseSchema.methods.getAssignmentsOfUser = async function (userId) {
    const assignmentsObjects = await Promise.all(this.assignments.map(assignmentId => Assignment.findById(assignmentId)))
    return await Promise.all(assignmentsObjects.map(async object => {
        const assignment = object._doc
        assignment.submissions = await Promise.all(assignment.submissions
            .filter(async submissionId => {
                const submission = await Submission.findById(submissionId)
                return submission.userIds.includes(userId)
            }))
        assignment.submissions = await Promise.all(assignment.submissions
            .map(async submissionId => {
                const submission = (await Submission.findById(submissionId))._doc
                submission.userIds = await Promise.all(submission.userIds.map(async user => {
                    const u = await clone(User, user)
                    u.profileImage = await getFileData(u.profileImage)
                    return u
                }))
                submission.files = await Promise.all(submission.files.map(fileId => getFileData(fileId)))
                return submission
            }))
        assignment.files = await Promise.all(assignment.files.map(fileId => getFileData(fileId)))
        return assignment
    }))
}

courseSchema.methods.getAssignments = async function () {
    return await Promise.all(this.assignments.map(
        async assignmentId => {
            const assignment = (await Assignment.findById(assignmentId))._doc
            assignment.files = await Promise.all(assignment.files.map(fileId => getFileData(fileId)))
            return assignment
        }
    ))
}

module.exports = mongoose.model('Course', courseSchema)