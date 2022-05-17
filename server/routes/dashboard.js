const express = require('express')
const router = express.Router()

const User = require('../models/User')
const Course = require('../models/Course')
const Assignment = require('../models/assignments/Assignment')
const Discussion = require('../models/forum/Discussion')
const Dashboard = require('../models/Dashboard')

const { getUserID } = require("../httpUtil");


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
    const data = await dashboard.getDashboardData()
    res.status(200).json(data)
})


module.exports = router