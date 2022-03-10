require('dotenv').config({ path: './env/.env' })
const express = require("express")
const cors = require('cors')
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')
const fs = require('fs')
const path = require("path");
const mongoose = require("mongoose");
mongoose.connect(process.env.URL)

const authRouter = require('./routes/auth')

const PORT = 8000
const HOST = 'localhost'
const app = express()
const threeDaysInSeconds = 60 * 60 * 24 * 3
const jwtName = 'jwt'

app.use(cors({ origin: process.env.CLIENT, credentials: true, }))
app.use(cookieParser())
app.use(express.json())
app.use('/', authRouter)

const { Storage } = require('@google-cloud/storage');
const {execSync} = require("child_process");

const storage = new Storage({
    keyFilename: path.join(__dirname, 'avid-battery-339118-75042e644d3f.json')
});

const bucketName = 'lecture4u-1';

app.get('/video', async (req, res) => {
    const range = req.headers.range
    if (!range) return res.status(400).send('Requires range header')
    const reqVideo = 'VID_20190724_211512.mp4'
    const bucket = storage.bucket(bucketName);
    const videoFile = bucket.file(reqVideo)
    const metadata = await videoFile.getMetadata()
    const videoSize = metadata[0].size
    const CHUNK_SIZE = 10 ** 6 // roughly 1MB
    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
    const contentLength = end - start + 1
    const headers = {
        'Content-range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-ranges': 'bytes',
        'Content-length': contentLength,
        'Content-type': 'video/mp4'
    }
    res.writeHead(206, headers)
    const videoStream = videoFile.createReadStream({ start, end })
    videoStream.pipe(res)
})

app.get('/executeOCR', (req, res) => {
    const execSync = require('child_process').execSync;
    execSync('python ./../OCR/src/main.py');
    const path = 'errors.txt'
    try {fs.unlinkSync(path)}
    catch(err) {console.error(err)}
    res.sendStatus(200)
})


// app.get('/login', (req, res) => {
//     const token = req.cookies.jwt
//     if (!token) return res.sendStatus(400)
//     jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
//         if (err) return console.log(err.message)
//         const user = await User.findById(decodedToken._id)
//         if (!user) return res.sendStatus(400)
//         res.sendStatus(200)
//     })
// })
//
// app.post('/login', async (req, res) => {
//     const email = req.body.email
//     const password = req.body.password
//     const user = await User.login(email, password)
//     if (!user) return res.sendStatus(400)
//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: threeDaysInSeconds })
//     res.cookie(jwtName, token, { maxAge: threeDaysInSeconds * 1000 })
//     res.sendStatus(200)
// })

app.listen(PORT, HOST, () => console.log(`server started on port ${PORT}`))
