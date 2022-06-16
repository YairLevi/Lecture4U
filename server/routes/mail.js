const express = require('express')
const nodemailer = require("nodemailer");
const router = express.Router()


const mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lecture4u.contact@gmail.com',
        pass: 'fzyszriionujquyz'
    }
})
const createMailOptions = (subject, content) => {
    return {
        to: 'lecture4u.email@gmail.com',
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