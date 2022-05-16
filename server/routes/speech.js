const proxy = require('express-http-proxy')
const express = require('express')
const axios = require('axios')
const router = express.Router()

const Timestamp = require('../models/Timestamp')
const { getUserID } = require("../httpUtil");

router.post('/save', async (req, res) => {
    const data = req.body.data
    const userId = getUserID(req)
    const doesExist = await Timestamp.exists({ userId })
    if (doesExist) {
        await Timestamp.findOneAndUpdate( { userId }, { data })
    } else {
        await Timestamp.create({ data, userId})
    }
    res.sendStatus(200)
})

router.get('/get', async (req, res) => {
    const userId = getUserID(req)
    let data = []
    const timestamp = await Timestamp.findOne({ userId })
    if (timestamp) data = timestamp.data
    res.status(200).json(data)
})


module.exports = router


