const express = require('express')
const jwt = require('jsonwebtoken')
const { Storage } = require('@google-cloud/storage')
const path = require("path");
const { getQueryParams, getUserID, getImageURL, removeFromDashboard } = require('../httpUtil')

const createRouter = require('./course.create')
const updateRouter = require('./course.update')

const router = express.Router()
router.use('/create', createRouter)
router.use('/update', updateRouter)

const bucket = 'lecture4u-1'
const storage = new Storage({
    keyFilename: path.join(__dirname, '..', 'avid-battery-339118-75042e644d3f.json')
})

const Image = require('../models/Image')
const Course = require('../models/Course')
const Unit = require('../models/Unit')
const Subject = require('../models/Subject')
const Comment = require('../models/forum/Comment')
const User = require('../models/User')
const Assignment = require('../models/assignments/Assignment')
const Submission = require('../models/assignments/Submission')
const Dashboard = require('../models/Dashboard')
const Discussion = require('../models/forum/Discussion')
const File = require('../models/File')


const { getFileData, deleteCourseFolder, deleteFile, deleteByPrefix } = require("../cloud/files");
const { addDashboardEvent, events } = require("../eventUtil");
const { clone, deleteIdsFromModel, deleteUnit } = require("../mongooseUtil");
const mongoose = require("mongoose");


router.get('/teacher', async (req, res) => {
    const userId = getUserID(req)
    if (!userId) return res.sendStatus(500)

    const user = await User.findById(userId)
    const courses = user.myCourses
    const list = []

    for (const course of courses) {
        const obj = {}
        const courseObj = await Course.findById(course)
        if (courseObj == null) {
            console.log(course)
            continue
        }
        obj.id = courseObj._id
        obj.name = courseObj.name
        if (courseObj.teacher) {
            obj.teacher = await clone(User, courseObj.teacher)
            obj.teacher.profileImage = await getFileData(obj.teacher.profileImage)
        }
        obj.description = courseObj.description
        obj.image = await getImageURL(courseObj.image)
        list.push(obj)
    }

    res.json(list)
})

router.get('/student', async (req, res) => {
    const userId = getUserID(req)
    if (!userId) return res.sendStatus(500)

    const user = await User.findById(userId)
    const courses = user.courses
    const list = []

    for (const course of courses) {
        const obj = {}
        const courseObj = await Course.findById(course)
        obj.id = courseObj._id
        obj.name = courseObj.name
        if (courseObj.teacher) {
            obj.teacher = await clone(User, courseObj.teacher)
            obj.teacher.profileImage = await getFileData(obj.teacher.profileImage)
        }
        obj.description = courseObj.description
        obj.image = await getImageURL(courseObj.image)
        list.push(obj)
    }

    res.json(list)
})

router.post('/enroll', async (req, res) => {
    const courseId = req.body.courseId
    const userId = getUserID(req)
    try {
        const course = await Course.findById(courseId)
        const user = await User.findById(userId)
        if (user.myCourses.includes(courseId))
            return res.sendStatus(403)
        user.courses.push(course._id)
        course.students.push(userId)
        await user.save()
        await course.save()
        await addDashboardEvent(userId, events.course_added, course.name)
        res.sendStatus(200)
    } catch (e) {
        console.log(e.message)
        res.sendStatus(404)
    }
})

router.get('/data', async (req, res) => {
    try {
        const userId = getUserID(req)
        const user = await User.findById(userId)
        const dashboard = await Dashboard.findById(user.dashboard)
        const code = req.query.code
        const course = await Course.findById(code)

        if (!course.students.includes(userId) && course.teacher != userId) {
            return res.sendStatus(400)
        }

        for (const subjectId of dashboard.subjects) {
            for (const unitId of course.units) {
                const unit = await Unit.findById(unitId)
                if (unit.subjects.includes(subjectId)) {
                    await removeFromDashboard(userId, 'subjects', subjectId)
                }
            }
        }

        const material = await course.getCourseData()
        if (userId !== course.teacher) {
            const today = new Date().getMonthAndDay()
            let access = course.access
            if (!access) access = {}
            if (!access[today]) access[today] = {}
            access[today][userId] = true
            await Course.updateOne({ _id: course._id }, { $set: { access: access } })
            await course.save()
        }

        res.status(200).json(material)
    } catch (e) {
        console.log(e.message)
        res.sendStatus(400)
    }
})

router.get('/members', async (req, res) => {
    try {
        const courseId = req.query.courseId
        const course = await Course.findById(courseId)
        const members = await Promise.all(course.students.map(async userId => {
            const user = await clone(User, userId)
            if (user.profileImage)
                user.profileImage = await getFileData(user.profileImage)
            return user
        }))
        res.status(200).json(members)
    } catch (e) {
        console.log('at /members\n' + e.message)
        res.sendStatus(400)
    }
})

router.get('/assignments', async (req, res) => {
    try {
        const userId = getUserID(req)
        const courseId = req.query.courseId

        const course = await Course.findById(courseId)
        const assignments = await course.getAssignmentsOfUser(userId)

        res.status(200).json(assignments)

    } catch (e) {
        console.log('at /assignments\n' + e.message)
        res.sendStatus(400)
    }
})

router.get('/teacher/assignments', async (req, res) => {
    try {
        const userId = getUserID(req)
        const course = await Course.findById(req.query.courseId)
        const assignments = await course.getAssignments()
        res.status(200).json(assignments)
    } catch (e) {
        console.log('at /teacher/assignments\n' + e.message)
        res.sendStatus(400)
    }
})

router.get('/teacher/submissions', async (req, res) => {
    try {
        const assignmentId = req.query.assignmentId
        const assignment = await Assignment.findById(assignmentId)
        const submissions = await assignment.getSubmissions()
        res.status(200).json(submissions)
    } catch (e) {
        console.log('at /teacher/assignments\n' + e.message)
        res.sendStatus(400)
    }
})

router.delete('/delete', async (req, res) => {
    const courseId = req.body.courseId
    const course = await Course.findById(courseId)
    const owner = await User.findById(getUserID(req))

    for (const userId of course.students) {
        const user = await User.findById(userId)
        const index = user.courses.indexOf(courseId);
        if (index > -1) user.courses.splice(index, 1)
        await user.save()
    }

    const index = owner.myCourses.indexOf(courseId);
    if (index > -1) owner.myCourses.splice(index, 1)
    await owner.save()

    for (const discussionId of course.discussions) {
        const discussion = await Discussion.findById(discussionId)
        await deleteIdsFromModel(Comment, discussion.comments)
        await Discussion.findByIdAndDelete(discussionId)
    }

    for (const unitId of course.units) {
        await deleteUnit(unitId)
    }

    for (const assignmentId of course.assignments) {
        const assignment = await Assignment.findById(assignmentId)
        await deleteIdsFromModel(File, assignment.files)
        for (const submissionId of assignment.submissions) {
            const submission = await Submission.findById(submissionId)
            await deleteIdsFromModel(File, submission.files)
        }
        await Assignment.findByIdAndDelete(assignmentId)
    }

    await deleteCourseFolder(courseId)
    await Course.findOneAndDelete({ _id: courseId })

    await addDashboardEvent(getUserID(req), events.deleted_course, course.name)
    res.sendStatus(200)
})

router.delete('/leave', async (req, res) => {
    const courseId = req.body.courseId
    const course = await Course.findById(courseId)
    const userId = getUserID(req)
    const user = await User.findById(userId)

    user.courses.splice(user.courses.indexOf(courseId), 1)
    course.students.splice(course.students.indexOf(userId), 1)

    await course.save()
    await user.save()
    await addDashboardEvent(userId, events.left_course, course.name)

    res.sendStatus(200)
})


router.get('/exist', async (req, res) => {
    const courseId = req.query.courseId
    const course = await Course.findOne({ _id: courseId })
    if (course) return res.status(200)
    else return res.status(400)
})


// maybe move deletes to other file ?

router.delete('/unit', async (req, res) => {
    const courseId = req.body.courseId
    const unitId = req.body.unitId
    const unit = await Unit.findById(unitId)

    for (const subjectId of unit.subjects) {
        const subject = await Subject.findById(subjectId)
        for (const fileId of subject.files) {
            await deleteFile(fileId)
        }
        await Subject.findByIdAndDelete(subjectId)
    }
    await Unit.findByIdAndDelete(unitId)
    const course = await Course.findById(courseId)
    course.units.splice(course.units.indexOf(unitId), 1)
    await course.save()

    res.sendStatus(200)
})

router.delete('/subject', async (req, res) => {
    const unitId = req.body.unitId
    const subjectId = req.body.subjectId

    const subject = await Subject.findById(subjectId)
    for (const fileId of subject.files) {
        await deleteFile(fileId)
    }

    const unit = await Unit.findById(unitId)
    unit.subjects.splice(unit.subjects.indexOf(subjectId), 1)
    await Subject.findByIdAndDelete(subjectId)
    await unit.save()

    res.sendStatus(200)
})

router.post('/rate', async (req, res) => {
    let { rating, subjectId } = { ...req.body }
    const userId = getUserID(req)
    const subject = await Subject.findById(subjectId)
    if (!subject.ratings) subject.ratings = {}
    subject.ratings = subject.ratings.filter(item => item.user != userId)
    subject.ratings.push({ user: userId, rating: Number(rating) })
    await subject.save()
    res.sendStatus(200)
})

router.post('/grade', async (req, res) => {
    const { grade, submissionId } = { ...req.body }
    const submission = await Submission.findById(submissionId)
    submission.grade = grade
    await submission.save()
    res.sendStatus(200)
})


module.exports = router