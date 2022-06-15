const express = require('express')
const router = express.Router()
const multer = require("multer")


const File = require('../models/File')
const Unit = require('../models/Unit')
const Subject = require('../models/Subject')
const Course = require('../models/Course')
const Assignment = require('../models/assignments/Assignment')
const Submission = require('../models/assignments/Submission')

const { deleteFile, uploadFile } = require("../cloud/files");
const { addDashboardEvent, events } = require("../eventUtil");
const { getUserID } = require("../httpUtil");

const upload = multer({ dest: 'temp/' })


function generateStoragePath(courseId, unitId, subjectId, fileName) {
    return `courseId-${courseId}/unitId-${unitId}/subjectId-${subjectId}/${fileName}`
}

function submissionPath(courseId, assignmentId, submissionId, fileName) {
    return `courseId-${courseId}/assignmentId-${assignmentId}/submissions/submissionId-${submissionId}/${fileName}`
}


router.post('/unit', async (req, res) => {
    const { courseId, unitId, name, text } = {...req.body}
    const unit = await Unit.findByIdAndUpdate(unitId, { name, text })
    await unit.save()

    const course = await Course.findById(courseId)
    for (const studentId of course.students) {
        await addDashboardEvent(studentId, events.updated_material, course.name)
    }
    res.sendStatus(200)
})


router.post('/subject', upload.array("files"), async (req, res) => {
    const { courseId, unitId, subjectId, name, text } = {...req.body}
    const currentFilesIds = JSON.parse(req.body.currentFiles).map(fileObj => fileObj._id)

    const subject = await Subject.findById(subjectId)
    for (const fileId of subject.files) {
        if (!currentFilesIds.includes(fileId.toString())) {
            await deleteFile(fileId)
            subject.files.splice(subject.files.indexOf(fileId), 1)
        }
    }

    for (const file of req.files) {
        const path = generateStoragePath(courseId, unitId, subjectId, file.originalname)
        const fileId = await uploadFile(file, path)
        subject.files.push(fileId)
    }

    subject.name = name
    subject.text = text

    const course = await Course.findById(courseId)
    for (const studentId of course.students) {
        await addDashboardEvent(studentId, events.updated_material, course.name)
    }

    await subject.save()
    res.sendStatus(200)
})

router.post('/submission', upload.array('files'), async (req, res) => {
    const { courseId, assignmentId, submissionId, text } = {...req.body}
    const currentFilesIds = JSON.parse(req.body.currentFiles).map(fileObj => fileObj._id)

    const submission = await Submission.findById(submissionId)
    for (const fileId of submission.files) {
        if (!currentFilesIds.includes(fileId.toString())) {
            await deleteFile(fileId)
            submission.files.splice(submission.files.indexOf(fileId), 1)
        }
    }

    for (const file of req.files) {
        const path = submissionPath(courseId, assignmentId, submissionId, file.originalname)
        const fileId = await uploadFile(file, path)
        submission.files.push(fileId)
    }

    submission.text = text
    submission.date = Date.now()
    await submission.save()

    const userId = getUserID(req)
    const assignment = await Assignment.findById(assignmentId)
    const course = await Course.findById(courseId)
    await addDashboardEvent(userId, events.submitted_assignment, assignment.name, course.name)

    res.sendStatus(200)
})


module.exports = router