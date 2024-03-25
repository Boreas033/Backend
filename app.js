// app.js

const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB Connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to the database');
        db = client.db('Bankdatenverwaltungssystem');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

connectToDatabase();

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.get('/users', async (req, res) => {
    const users = await db.collection('user').find().toArray();
    res.json(users);
});

app.get('/accounts', async (req, res) => {
    const accounts = await db.collection('konten').find().toArray();
    res.json(accounts);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
