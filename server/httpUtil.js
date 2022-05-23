const jwt = require("jsonwebtoken");
const path = require("path");
const storage = require('./cloud/storage')
const User = require('./models/User')
const Course = require('./models/Course')
const Dashboard = require('./models/Dashboard')

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
            jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
                if (err) return console.log(err.message)
                id = decodedToken._id
            })
        } catch (err) {
            console.log(err.message)
        }
        return id
    },
    updateAllStudentDashboards: async function (courseId, list, objectId) {
        const course = await Course.findById(courseId)
        for (const userId of course.students) {
            const user = await User.findById(userId)
            if (!user.dashboard) continue
            const dashboard = await Dashboard.findById(user.dashboard)
            dashboard[list].push(objectId)
            await dashboard.save()
        }
    },
    removeFromDashboard: async function (userId, list, objectId) {
        const user = await User.findById(userId)
        const dashboard = await Dashboard.findById(user.dashboard)
        const index = dashboard[list].indexOf(objectId)
        if (index > -1) dashboard[list].splice(dashboard[list].indexOf(objectId), 1)
        await dashboard.save()
    }
}