const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    courses: [String],
    myCourses: [String],
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: mongoose.SchemaTypes.ObjectId,
    groups: [mongoose.SchemaTypes.ObjectId],
    dashboard: mongoose.SchemaTypes.ObjectId,
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.statics.isTaken = function (email) {
    return this.where({ email }).length > 0
}

userSchema.statics.login = async function (email, password) {
    try {
        const user = await this.findOne({ email })
        const auth = await bcrypt.compare(password, user.password)
        if (!auth) return null
        return user
    } catch (e) {
        return null
    }
}

// INSTANCE METHODS

userSchema.methods.getCourses = async function () {
    return this.courses
}

userSchema.methods.editProfile = async function (body) {
    this.firstName = body.firstName
    this.lastName = body.lastName
    this.email = body.email
    if (body.password) this.password = body.password
    await this.save()
}


module.exports = mongoose.model('User', userSchema)