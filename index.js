const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


// database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nzlp2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {

    try {
        await client.connect();
        const database = client.db('jobTask');
        const personCollection = database.collection('person');


        // Post Api
        app.post('/person', async (req, res) => {
            const newPerson = req.body;
            const result = await personCollection.insertOne(newPerson);
            res.send(result);
            console.log(newPerson);

        });


        // Get Api
        app.get('/persons', async (req, res) => {
            const cursor = personCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // Update Api
        app.put('/person', async (req, res) => {
            const newPerson = req.body;
            const { name, address, phone } = newPerson;
            const updatedPerson = { name, address, phone };
            const filter = { _id: ObjectId(newPerson._id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: updatedPerson
            }
            const result = await personCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

    }

    finally {
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('simple crud operation');
});

app.listen(port, () => {
    console.log(`listening at ${port}`);
});