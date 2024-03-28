const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 3000;

// MongoDB Connection URI
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to the database");
    db = client.db("Bankdatenverwaltungssystem");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

connectToDatabase();

// Middleware to parse JSON bodies
app.use(express.json());

// Erlaube Anfragen von allen Ursprüngen
app.use(cors());

// Routes
app.get("/users", async (req, res) => {
  const users = await db.collection("user").find().toArray();
  res.json(users);
});

app.get("/accounts", async (req, res) => {
  const accounts = await db.collection("konten").find().toArray();
  res.json(accounts);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
app.post("/users", async (req, res) => {
  try {
    const newUser = req.body;
    const result = await db.collection("user").insertOne(newUser);
    res.json(result.ops[0]);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;
  const result = await db
    .collection("user")
    .updateOne({ _id: userId }, { $set: updatedUser });
  res.json({ message: `${result.modifiedCount} user(s) updated` });
});
app.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const result = await db.collection("user").deleteOne({ _id: userId });
  res.json({ message: `${result.deletedCount} user(s) deleted` });
});
app.post("/accounts", async (req, res) => {
  const newAccount = req.body;
  const result = await db.collection("konten").insertOne(newAccount);
  res.json(result.ops[0]);
});
app.put("/accounts/:id", async (req, res) => {
  const accountId = req.params.id;
  const updatedAccount = req.body;
  const result = await db
    .collection("konten")
    .updateOne({ _id: accountId }, { $set: updatedAccount });
  res.json({ message: `${result.modifiedCount} account(s) updated` });
});
app.delete("/accounts/:id", async (req, res) => {
  const accountId = req.params.id;
  const result = await db.collection("konten").deleteOne({ _id: accountId });
  res.json({ message: `${result.deletedCount} account(s) deleted` });
});
