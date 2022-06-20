const express = require('express')
const jwt = require('jsonwebtoken')
const { getQueryParams, getUserID, getImageURL } = require('../httpUtil')

const router = express.Router()

const Image = require('../models/Image')
const Course = require('../models/Course')
const Unit = require('../models/Unit')
const Subject = require('../models/Subject')
const User = require('../models/User')
const Schedule = require('../models/Schedule')
const mongoose = require("mongoose");
const { addDashboardEvent, events } = require("../eventUtil");


router.post('/save_task_scheduling', async (req, res) => {
    try {
        const userId = getUserID(req)
        const schedule = await Schedule.findOne({ userId })
        if (!schedule) {
            await Schedule.create({ userId, schedule: req.body })
        } else {
            schedule.schedule = req.body
            await schedule.save()
        }
        await addDashboardEvent(userId, events.calendar_update)
        res.sendStatus(200)
    } catch (e) {
        console.error('at save_task_scheduling:\n')
        console.log(e.message)
        res.sendStatus(400)
    }
})


router.get('/get_task_scheduling', async (req, res) => {
    try {
        const userId = getUserID(req)
        const schedule = await Schedule.findOne({ userId })
        if (!schedule) res.json([])
        else res.json(schedule.schedule)
    } catch (e) {
        console.error('at get_task_scheduling:\n')
        console.log(e.message)
        res.sendStatus(400)
    }
})


module.exports = router