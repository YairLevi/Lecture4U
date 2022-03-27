require('dotenv').config({ path: './env/.env' })
const express = require("express")
const multer = require('multer')
const cors = require('cors')
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')
const fs = require('fs')
const path = require("path");
const mongoose = require("mongoose");
mongoose.connect(process.env.URL)

const authRouter = require('./routes/auth')
const courseRouter = require('./routes/course')

const PORT = 8000
const HOST = 'localhost'
const app = express()
const threeDaysInSeconds = 60 * 60 * 24 * 3
const jwtName = 'jwt'

app.use(cors({ origin: process.env.CLIENT, credentials: true, }))
app.use(cookieParser())
app.use(express.json())
app.use('/', authRouter)
app.use('/course', courseRouter)
app.use(express.static(__dirname + '/static'));

const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    keyFilename: path.join(__dirname, 'avid-battery-339118-75042e644d3f.json')
});

const bucketName = 'lecture4u-1';

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

app.get('/video', async (req, res) => {
    const reqVideo = 'VID_20190724_211512.mp4'
    const bucket = storage.bucket(bucketName);
    const videoFile = bucket.file(reqVideo)
    const metadata = await videoFile.getSignedUrl({
        action: "read",
        expires: new Date().addHours(1)
    })
    console.log(metadata)
    res.json({ url: metadata })
})

app.get('/test', async (req, res) => {
    const reqVideo = 'default-course-img-1.png'
    const bucket = storage.bucket(bucketName);
    const videoFile = bucket.file(reqVideo)
    const metadata = await videoFile.getSignedUrl({
        action: "read",
        expires: new Date().addHours(1)
    })
    res.json({ url: metadata })
})

app.listen(PORT, HOST, () => console.log(`server started on port ${PORT}`))
