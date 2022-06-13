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
const speechRouter = require('./routes/speech')
const forumRouter = require('./routes/forum')
const scheduleRouter = require('./routes/calendar')
const groupsRouter = require('./routes/groups')
const profileRouter = require('./routes/profile')
const dashboardRouter = require('./routes/dashboard')
const ocrRouter = require('./routes/ocr')

const PORT = 8000
const HOST = 'localhost'
const app = express()
const server = require('http').Server(app)
const threeDaysInSeconds = 60 * 60 * 24 * 3
const jwtName = 'jwt'

app.use(cors({ origin: process.env.CLIENT, credentials: true, }))
app.use(cookieParser())
app.use(express.json())
app.use('/', authRouter)
app.use('/dashboard', dashboardRouter)
app.use('/speech', speechRouter)
app.use('/course', courseRouter)
app.use('/forum', forumRouter)
app.use('/schedule', scheduleRouter)
app.use('/groups', groupsRouter)
app.use('/profile', profileRouter)
app.use('/ocr', ocrRouter)

const bucketName = 'lecture4u-1';

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

Date.prototype.getMonthAndDay = function () {
    const day = this.getDate()
    const month = this.toLocaleString('default', { month: 'short' })
    return `${month} ${day}`
}
/////////////

var nodemailer = require('nodemailer');
const emailValidator = require('deep-email-validator')

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lecture4u.contact@gmail.com',
        pass: 'fzyszriionujquyz'
    }
});


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

server.listen(PORT, HOST, callback = () => console.log(`server started on port ${PORT}`))


const Document = require("./models/Document")


const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST']
    }
})

const defaultValue = ""

let doc_dict = {}

io.on("connection", socket => {
    console.log('here')
    socket.on("get-document", async documentId => {

        // needs to use DB for returning the same documentId when in same group (using groupId?)

        const document = await findOrCreateDocument(documentId)
        socket.join(documentId)
        socket.emit("load-document", document.data)

        doc_dict[documentId] = document.data
        console.log(doc_dict)

        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })
        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentId, { data })
        })
    })
})

async function findOrCreateDocument(id) {
    if (id == null) return
    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: defaultValue })
}