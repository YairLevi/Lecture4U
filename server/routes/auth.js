const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { getFileData } = require("../cloud/files");
const router = express.Router()
const timeLimit = 60 * 60 * 24 * 100
const jwtName = 'jwt'
const bcryptjs = require('bcryptjs')


router.get('/login', async (req, res) => {
    const token = req.cookies.jwt
    if (!token) return res.sendStatus(400)
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) return console.error(err.message)
        const user = await User.findById(decodedToken._id)
        if (!user) return res.sendStatus(400)
        const userCopy = user._doc
        userCopy.profileImage = await getFileData(userCopy.profileImage)
        res.status(200).json(userCopy)
    })
})

router.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const user = await User.login(email, password)
    if (!user) return res.sendStatus(400)
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: timeLimit })
    res.cookie(jwtName, token, { maxAge: timeLimit * 1000 })
    const userCopy = user._doc
    userCopy.profileImage = await getFileData(userCopy.profileImage)
    res.status(200).json(userCopy)
})

router.post('/register', async (req, res) => {
    try {
        const isTaken = await User.isTaken({ email: req.body.email })
        if (isTaken) return res.sendStatus(400)
        await User.create({...req.body, })
        res.sendStatus(200)
    } catch (e) {
        res.sendStatus(400)
    }
})

router.get('/logout', (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 1 })
        res.sendStatus(200)
    } catch (e) {
        res.sendStatus(500)
    }
})


module.exports = router