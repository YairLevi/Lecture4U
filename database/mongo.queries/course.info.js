const PATH = '../.env';
require('dotenv').config({path: PATH});
const { MongoClient } = require('mongodb');
const assert = require("assert");
const url = process.env.db_url;
const client = new MongoClient(url);
const db_main = process.env.db_main;
const coll = process.env.coll_credentials;
const params = ['_id', 'password', 'email', 'firstName', 'lastName'];


async function makeProps() {

}

async function addCourse(props) {

}