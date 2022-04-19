const proxy = require('express-http-proxy')
const express = require('express')
const axios = require('axios')
const router = express.Router()


router.get('/transcribe_score', async (req, res) => {
    const response = await axios.get('http://localhost:5000/transcribe_score', req)
    console.log(response)
    res.json(response)
})


module.exports = router