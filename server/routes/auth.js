const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = express.Router()
const threeDaysInSeconds = 60 * 60 * 24 * 3
const jwtName = 'jwt'

router.get('/login', async (req, res) => {
    const token = req.cookies.jwt
    if (!token) return res.sendStatus(400)
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) return console.error(err.message)
        const user = await User.findById(decodedToken._id)
        if (!user) return res.sendStatus(400)
        res.sendStatus(200)
    })
})

router.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const user = await User.login(email, password)
    if (!user) return res.sendStatus(400)
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: threeDaysInSeconds })
    res.cookie(jwtName, token, { maxAge: threeDaysInSeconds * 1000 })
    res.sendStatus(200)
})

router.post('/register', async (req, res) => {
    try {
        const details = req.body
        const isTaken = await User.isTaken({ email: details.email })
        if (isTaken) return res.sendStatus(400)
        await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
        })
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