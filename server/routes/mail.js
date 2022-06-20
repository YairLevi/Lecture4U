const express = require('express')
const nodemailer = require("nodemailer");
const router = express.Router()


const mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_EMAIL_PASSWORD
    }
})
const createMailOptions = (subject, content) => {
    return {
        to: process.env.MAIN_EMAIL_ADDR,
        subject: subject,
        text: content
    }
}


router.post('/contact', async (req, res) => {
    const { subject, content } = { ...req.body }
    const options = createMailOptions('Contact mail - ' + subject, content)
    await mailer.sendMail(options)
    res.sendStatus(200)
})


router.post('/support', async (req, res) => {
    const { subject, content } = { ...req.body }
    const options = createMailOptions('Support mail - ' + subject, content)
    await mailer.sendMail(options)
    res.sendStatus(200)
})


module.exports = router