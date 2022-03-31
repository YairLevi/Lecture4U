const jwt = require("jsonwebtoken");
const { Storage } = require('@google-cloud/storage')
const path = require("path");




const storage = new Storage({
    keyFilename: path.join(__dirname, 'avid-battery-339118-75042e644d3f.json')
});

module.exports = {
    getQueryParams: function (req) {
        var params = {};
        var baseUrl = req.protocol + '://' + req.get('host') + '/';
        var rawUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        var url = new URL(rawUrl, baseUrl);
        var keyIter = url.searchParams.keys();
        var valIter = url.searchParams.values();
        var current = null;
        while ((current = keyIter.next().value) !== undefined)
            params[current] = valIter.next().value;
        return params;
    },
    getImageURL: async function (imageObj) {
        const _bucket = storage.bucket(imageObj.bucket)
        const file = _bucket.file(imageObj.file)
        return await file.getSignedUrl({
            action: "read",
            expires: new Date().addHours(1)
        })
    },
    getRandomImage: function () {
        const defaultImages = [
            'default-course-img-1.png',
            'default-course-img-2.png',
            'default-course-img-3.png',
        ]
        return defaultImages[Math.floor(Math.random() * defaultImages.length)];
    },
    getUserID: function (req) {
        let id = null
        try {
            const token = req.cookies.jwt
            if (!token) return console.log('token is Null')
            jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
                if (err) return console.log(err.message)
                id = decodedToken._id
            })
        } catch (err) {
            console.log(err.message)
        }
        return id
    },
}