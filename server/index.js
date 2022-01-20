require('dotenv').config({path: './env/.env'})
const path = require("path")
const express = require("express");
const app = express(); // create express app
const PORT = 8000;
const {getQueryParams} = require('./httpUtil')
const userRouter = require('./routes/users')

// add middlewares
app.use(express.static(path.join(__dirname, "..", "client", "build")))

app.use('/users', userRouter)

app.get('*', function(req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, '../client/build/')})
})

// start express server on port 5000
app.listen(PORT, () => {
    console.log("server started on port 8000")
})
