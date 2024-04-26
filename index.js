const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// mongoDB database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ahe248t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const db = client.db("TouristDB");
        const countriesCollection = db.collection('countries');
        const touristSpotsCollection = db.collection('touristSpots');

        app.get('/tourist-spots', async (req, res) => {
            const cursor = touristSpotsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/tourist-spots', async (req, res) => {
            const touristInfo = req.body;
            // console.log(touristInfo);
            const result = await touristSpotsCollection.insertOne(touristInfo);
            console.log(result);
            res.send(result);
        })

        // app.get('/users', async (req, res) => {
        //     const cursor = userCollection.find();
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })

        // app.get('/users/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) };
        //     const result = await userCollection.findOne(query);
        //     res.send(result);
        // })

        // app.post("/users", async (req, res) => {
        //     const user = req.body;
        //     console.log("new user", user);
        //     const result = await userCollection.insertOne(user);
        //     res.send(result);
        // })

        // app.put('/users/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const userData = req.body;
        //     console.log("UPDATE USER", id, userData)
        //     const filter = { _id: new ObjectId(id) };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             name: userData.name,
        //             email: userData.email
        //         }
        //     }
        //     const result = await userCollection.updateOne(filter, updateDoc, options);
        //     res.send(result);
        // })

        // app.delete('/users/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log("DELETE USER", id);
        //     const query = { _id: new ObjectId(id) };
        //     const result = await userCollection.deleteOne(query)
        //     res.send(result);
        // })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Your Server is Running');
})

app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}/`);
})