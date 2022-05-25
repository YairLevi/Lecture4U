const express = require('express')
const jwt = require('jsonwebtoken')
const path = require("path");
const fs = require('fs')
const { getQueryParams, getRandomImage, getUserID, updateAllStudentDashboards, removeFromDashboard } = require('../httpUtil')
const storage = require('../cloud/storage')

const router = express.Router()
const bucket = 'lecture4u-3'

const Image = require('../models/Image')
const Course = require('../models/Course')
const Unit = require('../models/Unit')
const Subject = require('../models/Subject')
const File = require('../models/File')
const User = require('../models/User')
const Assignment = require('../models/assignments/Assignment')
const Submission = require('../models/assignments/Submission')

const multer = require('multer')
const { uploadFile } = require("../cloud/files");
const { mapAsync } = require("../mongooseUtil");
const { addDashboardEvent, events } = require("../eventUtil");
const { use } = require("express/lib/router");
const upload = multer({ dest: 'temp/' })

function generateStoragePath(courseId, unitId, subjectId, fileName) {
    return `courseId-${courseId}/unitId-${unitId}/subjectId-${subjectId}/${fileName}`
}

function assignmentPath(courseId, assignmentId, fileName) {
    return `courseId-${courseId}/assignmentId-${assignmentId}/${fileName}`
}

function submissionPath(courseId, assignmentId, submissionId, fileName) {
    return `courseId-${courseId}/assignmentId-${assignmentId}/submissions/submissionId-${submissionId}/${fileName}`
}


router.post('/', async (req, res) => {
    try {
        const name = req.body.name
        const teacher = req.body.teacher
        const description = req.body.description
        const image = await Image.create({ bucket: bucket, file: getRandomImage() })
        const course = await Course.create({ name, teacher, description, image })
        const user = await User.findById(getUserID(req))
        user.myCourses.push(course._id)
        await user.save()
        await addDashboardEvent(getUserID(req), events.new_course, name)
        res.sendStatus(200)
    } catch (err) {
        console.log(err.message)
        res.sendStatus(500)
    }
})

router.post('/unit', async (req, res) => {
    try {
        const { courseId, name, text } = { ...req.body }
        const course = await Course.findById(courseId)
        const unit = await Unit.create({ name, text })
        course.units.push(unit._id)
        await course.save()
        for (const studentId of course.students) {
            await addDashboardEvent(studentId, events.new_material, course.name)
        }
        res.sendStatus(200)
    } catch (e) {
        console.log(e.message)
        res.sendStatus(400)
    }
})

router.post('/subject', upload.array("files"), async (req, res) => {
    try {
        const { courseId, unitId, name, text } = { ...req.body }

        const unit = await Unit.findById(unitId)
        const subject = await Subject.create({ courseId, name, text })
        subject.files = await mapAsync(req.files, async file => {
            const filePath = generateStoragePath(courseId, unitId, subject._id, file.originalname)
            return await uploadFile(file, filePath)
        })
        await subject.save()
        await updateAllStudentDashboards(courseId, 'subjects', subject._id)

        unit.subjects.push(subject._id)
        await unit.save()

        const course = await Course.findById(courseId)
        for (const studentId of course.students) {
            await addDashboardEvent(studentId, events.new_material, course.name)
        }

        res.sendStatus(200)
    } catch (e) {
        console.log(e.message)
        res.sendStatus(400)
    }
})

router.post('/assignment', upload.array('files'), async (req, res) => {
    try {
        const { courseId, name, text, dueDate, number } = { ...req.body }
        const course = await Course.findById(courseId)

        const assignment = await Assignment.create({ name, text, courseId, dueDate, number })
        assignment.files = await mapAsync(req.files, async file => {
            const filePath = assignmentPath(courseId, assignment._id, file.originalname)
            return await uploadFile(file, filePath)
        })
        await assignment.save()
        await updateAllStudentDashboards(courseId, 'assignments', assignment._id)

        if (!course.assignments) course.assignments = []
        course.assignments.push(assignment._id)
        await course.save()

        for (const studentId of course.students) {
            await addDashboardEvent(studentId, events.new_assignment, course.name)
        }

        res.sendStatus(200)
    } catch (e) {
        console.log(e.message)
        res.sendStatus(400)
    }
})

router.post('/submit', upload.array('files'), async (req, res) => {
    try {
        const userId = getUserID(req)
        const courseId = req.body.courseId
        const course = await Course.findById(courseId)
        const assignment = await Assignment.findById(req.body.assignmentId)
        const submission = await Submission.create({ userIds: [userId] })
        submission.text = req.body.text
        submission.files = await mapAsync(req.files, async file => {
            const filePath = submissionPath(courseId, assignment._id, submission._id, file.originalname)
            return await uploadFile(file, filePath)
        })
        await submission.save()
        assignment.submissions.push(submission._id)
        await assignment.save()
        await removeFromDashboard(userId, 'assignments', req.body.assignmentId)
        await addDashboardEvent(userId, events.submitted_assignment, assignment.name, course.name)
        res.sendStatus(200)

    } catch (e) {
        console.log(`at /submit: ${e.message}`)
        res.sendStatus(400)
    }
})


module.exports = router