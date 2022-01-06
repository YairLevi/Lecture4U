const path = require("path")
const express = require("express");
const app = express(); // create express app
const PORT = 8000;
// add middlewares
app.use(express.static(path.join(__dirname, "..", "client", "build")));

// start express server on port 5000
app.listen(PORT, () => {
    console.log("server started on port 8000");
});
