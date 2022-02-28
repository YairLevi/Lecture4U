const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})

userSchema.pre('save', async function (next) {
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

module.exports = mongoose.model('User', userSchema)