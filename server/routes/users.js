const express = require('express')
const router = express.Router()
const {getQueryParams} = require('../httpUtil')
const {loginUser} = require('../database/mongo.queries/user.info')


router.get('/isUser', async (req, res) => {
    const {email, password} = getQueryParams(req)
    const approved = await loginUser(email, password)
    res.json({isUser: approved})
    res.end()
})

module.exports = router