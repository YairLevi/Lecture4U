const { makeUserProps, errorInFunc, toString } = require('../util')
const { MongoClient } = require('mongodb')
const url = process.env.URL
console.log(url)
const database = process.env.DB_NAME
const user_info_collection = process.env.USER_INFO_COLLECTION
const client = new MongoClient(url)
const params = ['firstName', 'lastName', 'email', 'password']

// connect to the database
async function connect() {
    try {
        await client.connect()
        console.log('Connected Successfully.')
    } catch (err) {
        errorInFunc('connect')
    }
}

connect().then()

// get the user data collection
function getCollection() {
    return client.db(database).collection(user_info_collection)
}

// get a user. null if user doesn't exist
async function getUser(email) {
    return await getCollection().findOne({ email: email })
}

// return false or true if the user is successfully logged in
async function loginUser(email, password) {
    const object = toString({ email: email, password: password })
    const userData = await getUser(object.email)
    return userData !== null && userData.password == object.password
}

/**
 * add a new user with credentials {props} to the database
 * @param props: firstName, lastName, password, email
 * @returns {Promise<void>}
 */
async function addUser(...props) {
    const collection = getCollection()
    const userProps = makeUserProps(props, params)
    try {
        await collection.insertOne(userProps)
        console.log(`added user ${userProps.email}`)
    } catch (e) {
        errorInFunc('addUser', `User already exists with email ${userProps.email}`)
    }
}

// update a user's credential {key} with new value {value}
async function updateUser(email, key, value) {
    const collection = getCollection()
    const userData = await getUser(email)
    if (userData) await collection.updateOne({ email: email }, { $set: { key: value } })
    else errorInFunc('updateValue', `No user with mail ${email}`)
}

// delete a user by email
async function deleteUser(email) {
    const collection = getCollection()
    const result = await collection.deleteOne({ email: email })
    return result.deletedCount > 0
}

module.exports = { deleteUser, updateUser, addUser, loginUser }