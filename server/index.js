require('dotenv').config({ path: './.env' })
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
const mailRouter = require('./routes/mail')

const PORT = process.env.SERVER_PORT
const HOST = process.env.SERVER_ADDR
const app = express()
const server = require('http').Server(app)

app.use(cors({ origin: `http://${process.env.CLIENT_ADDR}:${process.env.CLIENT_PORT}`, credentials: true, }))
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
app.use('/mail', mailRouter)

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

Date.prototype.getMonthAndDay = function () {
    const day = this.getDate()
    const month = this.toLocaleString('default', { month: 'short' })
    return `${month} ${day}`
}


server.listen(PORT, HOST, callback = () => console.log(`server started on port ${PORT}`))
// app.listen(PORT, HOST, () => console.log('test here!!!'))

const Document = require("./models/Document")


const io = require("socket.io")(server, {
    cors: {
        origin: `http://${process.env.CLIENT_ADDR}:${process.env.CLIENT_PORT}`,
        methods: ['GET', 'POST']
    }
})

const defaultValue = ""

const doc_dict = {}

io.on("connection", socket => {
    socket.on("get-document", async documentId => {

        // needs to use DB for returning the same documentId when in same group (using groupId?)

        const document = await Document.findById(documentId)
        socket.join(documentId)
        socket.emit("load-document", document.data)

        doc_dict[documentId] = document.data
        // console.log(doc_dict)

        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })
        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentId, { data })
        })
    })
})