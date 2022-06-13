const express = require('express')
const router = express.Router()

const User = require('../models/User')
const Course = require('../models/Course')
const Subject = require('../models/Subject')
const Assignment = require('../models/assignments/Assignment')
const Discussion = require('../models/forum/Discussion')
const Dashboard = require('../models/Dashboard')
const Unit = require('../models/Unit')

const { getUserID } = require("../httpUtil");
const Schedule = require("../models/Schedule");


router.get('/get-dashboard-data', async (req, res) => {
    // const a = {
    //     assignments: {
    //         count: 1,
    //         mostUrgent: {
    //             date: Date.now(),
    //             courseName: 'name'
    //         }
    //     },
    //     subjects: {
    //         count: 1,
    //         mostRecent: {
    //             date: Date.now(),
    //             courseName: 'name',
    //         }
    //     },
    //     discussions: {
    //         count: 1,
    //         mostRecent: {
    //             date: Date.now(),
    //             courseName: 'name'
    //         }
    //     },
    //     recentLogin: Date
    // }
    const userId = getUserID(req)
    const user = await User.findById(userId)
    if (!user.dashboard) {
        user.dashboard = (await Dashboard.create({ userId }))._id
    }
    await user.save()
    const dashboard = await Dashboard.findById(user.dashboard)
    console.log('getting dashboard data...')
    const data = await dashboard.getDashboardData()
    console.log('getting dashboard events...')
    data.events = await dashboard.getEvents()
    console.log('getting dashboard schedule...')
    const sched = await Schedule.findOne({ userId })
    if (sched) data.schedule = sched.schedule
    console.log('getting ratings...')
    data.ratings = {}
    data.access = {}
    for (const courseId of user.myCourses) {
        const course = await Course.findById(courseId)
        if (!course) continue
        data.access[course.name] = {}
        for (const date of Object.keys(course.access ? course.access : {})) {
            data.access[course.name][date] = Object.keys(course.access[date]).length
        }
        console.log(course.name)
        data.ratings[course.name] = {}
        for (const unitId of course.units) {
            const unit = await Unit.findById(unitId)
            for (const subjectId of unit.subjects) {
                const subject = await Subject.findById(subjectId)
                const obj = { 1:0, 2:0, 3:0, 4:0, 5:0 }
                for (const item of subject.ratings) {
                    obj[item.rating]++
                }
                data.ratings[course.name][subject.name] = obj
            }
        }
    }

    console.log('sending data')
    res.status(200).json(data)
})


module.exports = router