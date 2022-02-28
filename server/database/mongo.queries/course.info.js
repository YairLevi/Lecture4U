require('dotenv').config({ path: '../../env/.env' })
const mongoose = require('mongoose')
const User = require('../../models/User')

mongoose.connect(process.env.URL)

async function f() {
    try {
        const u = await User.create({
            firstName: 'a',
            lastName: 'b',
            email: 'b@b.b',
            password: 'b',
        })
    } catch (e) {
        console.log(e.message)
    }
    await mongoose.disconnect()
}
f()



