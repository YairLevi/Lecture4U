const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { getFileData } = require("../cloud/files")
const emailValidator = require('deep-email-validator')
const nodemailer = require('nodemailer')
const router = express.Router()
const timeLimit = 60 * 60 * 24 * 100
const jwtName = 'jwt'

// Helper Objects

const SECURITY_CODE_SIZE = 10
const TIME_LIMIT = 1000 * 60
const DELETE_CODES_TIMEFRAME = 30 * 60 * 1000

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
const resetCodes = {}
const codeMailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lecture4u.contact@gmail.com',
        pass: 'fzyszriionujquyz'
    }
})
const createMailOptions = (email, code) => {
    return {
        to: email,
        subject: 'Password Reset',
        html: `<p>Your Code is:<br/>${code}</p>`
    }
}

setInterval(() => {
    for (const key of Object.keys(resetCodes)) {
        if (Date.now() - resetCodes[key].createdAt > TIME_LIMIT)
            delete resetCodes[key]
    }
}, DELETE_CODES_TIMEFRAME)

// Routes

router.get('/login', async (req, res) => {
    const token = req.cookies.jwt
    if (!token) return res.sendStatus(400)
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) return console.error(err.message)
        const user = await User.findById(decodedToken._id)
        if (!user) return res.sendStatus(400)
        const userCopy = user._doc
        if (userCopy.profileImage) {
            userCopy.profileImage = await getFileData(userCopy.profileImage)
        }
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
    if (userCopy.profileImage) {
        userCopy.profileImage = await getFileData(userCopy.profileImage)
    }
    res.status(200).json(userCopy)
})

router.post('/register', async (req, res) => {
    try {
        const isTaken = await User.isTaken({ email: req.body.email })
        if (isTaken) return res.sendStatus(400)
        await User.create({ ...req.body, })
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

router.get('/exist-user', async (req, res) => {
    const email = req.query.email
    const user = await User.findOne({ email })
    if (user) res.sendStatus(200)
    else res.sendStatus(400)
})

router.get('/mail-validate', async (req, res) => {
    const email = req.query.email
    const result = await emailValidator.validate(email)
    if (result.valid) res.sendStatus(200)
    else res.sendStatus(400)
})

router.get('/generate-code', async (req, res) => {
    const email = req.query.email
    const code = genRanHex(SECURITY_CODE_SIZE)
    const createdAt = Date.now()
    resetCodes[email] = { code, createdAt }
    const mailOptions = createMailOptions(email, code)
    await codeMailer.sendMail(mailOptions)
    res.sendStatus(200)
})

router.get('/check-code', async (req, res) => {
    const email = req.query.email
    const code = req.query.code
    if (Date.now() - resetCodes[email].createdAt > TIME_LIMIT) {
        return res.sendStatus(405)
    } else if (code !== resetCodes[email].code) {
        return res.sendStatus(400)
    }
    res.sendStatus(200)
})

router.post('/reset-password', async (req, res) => {
    const newPassword = req.body.password
    const email = req.body.email
    console.log(email)
    const user = await User.findOne({ email })
    user.password = newPassword
    await user.save()
    res.sendStatus(200)
})


module.exports = router