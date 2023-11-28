const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
// import { BabyName } from "./babyNames";
var cors = require("cors");
var app = express();

app.use(cors());
app.use(bodyParser.json());

const DEFAULT_PORT = 3000;
let PORT = process.env.PORT || DEFAULT_PORT;

const mongoURI =
  "mongodb+srv://provvi:mongo-password@cluster0.nr78vkf.mongodb.net/?retryWrites=true&w=majority";

async function connectToMongo() {
  const client = new MongoClient(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  return client.db();
}

function startServer() {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Check if the port is already in use
const server = require("http").createServer();
server.listen(PORT, "0.0.0.0");

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use, trying another port...`);
    PORT = PORT === DEFAULT_PORT ? DEFAULT_PORT + 1 : DEFAULT_PORT;
    startServer();
  } else {
    throw err;
  }
});

server.on("listening", () => {
  server.close();
  startServer();
});

app.get("/babyNames", async (req, res) => {
  const db = await connectToMongo();
  const collection = db.collection("babyNames");
  const babyNames = await collection.find().toArray();
  res.json(babyNames);
});

// Endpoint to update popularity
app.post("/updatePopularity/:name/:increment", async (req, res) => {
  try {
    const db = await connectToMongo();
    const collection = db.collection("babyNames");

    const { name, increment } = req.params;

    // Update popularity based on the increment value
    const updatedName = await collection.findOneAndUpdate(
      { name },
      { $inc: { popularity: parseInt(increment, 10) } },
      { returnDocument: "after" } // Return the updated document
    );

    // Send the updated name back to the client
    res.json(updatedName.value);
  } catch (error) {
    console.error("Error updating popularity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addBabyName", async (req, res) => {
  console.log(req.body); // Log the entire request body
  const { name, gender } = req.body;

  const db = await connectToMongo();
  const collection = db.collection("babyNames");

  // Check if the name already exists
  const existingName = await collection.findOne({ name });
  if (existingName) {
    return res.status(400).send("Name already exists");
  }

  // Insert the new baby name into the database
  await collection.insertOne({ name, gender, popularity: 0 });

  res.send("Baby name added successfully");
});

app.get("/getRandomBabyName", async (req, res) => {
  const db = await connectToMongo();
  const collection = db.collection("babyNames");

  // Get a random baby name from the collection
  const randomBabyName = await collection
    .aggregate([{ $sample: { size: 1 } }])
    .toArray();

  res.json(randomBabyName[0]);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
