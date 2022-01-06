const path = require("path")
const express = require("express");
const app = express(); // create express app

// add middlewares
app.use(express.static(path.join(__dirname, "..", "client", "build")));

// start express server on port 5000
app.listen(5000, () => {
    console.log("server started on port 5000");
});
