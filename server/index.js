// imports
require('dotenv').config({ path: './.env' })
const express = require("express")
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require("mongoose");

// routers defined in ./routes
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

// connect to mongodb
mongoose.connect(process.env.URL)

// run server
const PORT = process.env.SERVER_PORT
const HOST = process.env.SERVER_ADDR
const app = express()
const server = require('http').Server(app)

// use routers and middleware (cors)
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

// listen on port
server.listen(PORT, HOST, callback = () => console.log(`server started on port ${PORT}`))
// app.listen(PORT, HOST, () => console.log('test here!!!'))

const Document = require("./models/Document")

// create io
const io = require("socket.io")(server, {
    cors: {
        origin: `http://${process.env.CLIENT_ADDR}:${process.env.CLIENT_PORT}`,
        methods: ['GET', 'POST']
    }
})

// for faster receive
const doc_dict = {}

// io connections
io.on("connection", socket => {
    socket.on("get-document", async documentId => {
        const document = await Document.findById(documentId)
        socket.join(documentId)
        socket.emit("load-document", document.data)
        doc_dict[documentId] = document.data

        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })
        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentId, { data })
        })
    })
})




// Helper prototypes

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

Date.prototype.getMonthAndDay = function () {
    const day = this.getDate()
    const month = this.toLocaleString('default', { month: 'short' })
    return `${month} ${day}`
}
