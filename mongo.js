const { MongoClient } = require('mongodb');

const url = "mongodb+srv://YairLevi:240301Yl@cluster0.p28mf.mongodb.net/";
const client = new MongoClient(url);

// Database Name
const dbName = 'myFirstDatabase';

class MongoConnection {

}

async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('documents');

    // the following code examples can be pasted here...

    const findResult = await collection.find({}).toArray();
    console.log('Found documents =>', findResult[0]['firstName']);

    try {
        await collection.insertOne({item: "card", qty: 15});
    } catch (e) {
        console.log(e);
    }
    return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
