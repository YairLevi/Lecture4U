require('dotenv').config({ path: './env/.env' })
const express = require("express")
const cors = require('cors')
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')
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
