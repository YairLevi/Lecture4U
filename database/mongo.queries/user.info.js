const PATH = '../.env'
require('dotenv').config({path: PATH})
const {makeUserProps, errorInFunc, toString} = require('../util')
const {MongoClient} = require('mongodb')
const url = process.env.db_url
const db_main = process.env.db_main
const coll = process.env.coll_credentials
const client = new MongoClient(url)
const params = ['_id', 'password', 'firstName', 'lastName', 'email', 'phoneNumber']

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
    return client.db(db_main).collection(coll)
}

// get a user. null if user doesn't exist
async function getUser(userId) {
    return await getCollection().findOne({_id: userId})
}

// return false or true if the user is successfully logged in
async function loginUser(userId, password) {
    const object = toString({userId: userId, password: password})
    const userData = await getUser(object.userId)
    return userData !== null && userData.password == object.password
}

/**
 * add a new user with credentials {props} to the database
 * @param props: ID, password, firstName, lastName, email, phoneNumber
 * @returns {Promise<void>}
 */
async function addUser(...props) {
    const collection = getCollection()
    const userProps = makeUserProps(props, params)
    try {
        await collection.insertOne(userProps)
        console.log(`added user ${userProps._id}`)
    } catch (e) {
        errorInFunc('addUser', `User already exists with ID ${userProps._id}`)
    }
}

// update a user's credential {key} with new value {value}
async function updateValue(userId, key, value) {
    const db = client.db(db_main)
    const collection = db.collection(coll)
    let userData = await getUser(userId)
    if (userData) await collection.updateOne({_id: userId}, {$set: {key: value}})
    else console.log(`No user with id ${userId}`)
}

async function deleteUser(userId) {
    const db = client.db(db_main)
    const collection = db.collection(coll)
    return (await collection.deleteOne({_id: userId})).deletedCount > 0
}