const PATH = '../.env';
require('dotenv').config({path: PATH});
const { MongoClient } = require('mongodb');
const assert = require("assert");
const url = process.env.db_url;
const client = new MongoClient(url);
const db_main = process.env.db_main;
const coll = process.env.coll_credentials;
const params = ['_id', 'password', 'email', 'firstName', 'lastName'];


// error in function console.log
function errorInFunc(name) {
    console.log(`Error in: ${name}()`);
}

// make json of params with props as values
function makeUserProps(props) {
    if (props.length != params.length) {
        console.log(`makeUserProps: Got ${props.length} arguments, but needed ${params.length}`);
        return undefined;
    }
    let object = {};
    params.forEach((key, idx) => {
       object[key] = props[idx];
    });
    return object;
}

// connect to the database
async function connect() {
    try {
        await client.connect();
        console.log('Connected Successfully.');
    } catch (err) {
        errorInFunc('connect');
    }
}

// get a user. null if user doesn't exist
async function getUser(userId) {
    try {
        const db = client.db(db_main);
        const collection = db.collection(coll);
        return await collection.findOne({id: userId});
    } catch (err) {
        errorInFunc('getUser');
    }
}

// return false or true if the user is successfully logged in
async function loginUser(userId, password) {
    try {
        const userData = await getUser(userId);
        if (userData === null) {
            console.log(`No user with id ${userId}`);
            return false;
        }
        return userData.password == password;
    } catch (err) {
        errorInFunc('loginUser');
    }
}

// add a new user with credentials {props} to the database
async function addUser(...props) {
    try {
        const db = client.db(db_main);
        const collection = db.collection(coll);
        await collection.insertOne(makeUserProps(props));
        console.log(`added user ${props._id}`);
    } catch (err) {
        errorInFunc('addUser');
    }
}

// update a user's credential {key} with new value {value}
async function updateValue(userId, key, value) {
    const db = client.db(db_main);
    const collection = db.collection(coll);
    let userData = await getUser(userId);
    if (userData) collection.updateOne({_id: userId}, {$set: {key: value}});
    else console.log(`No user with id ${userId}`);
}