// db.js
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = `${process.env.MONGO_DB}`;

async function connectToDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    const client = new MongoClient(url, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    console.log("Connected to mongoDB!");
    await client.connect();
    dbInstance = client.db(dbName);
    return dbInstance;
  } catch (error) {
    console.error("Failed to connect to mongoDB", error);
    process.exit(1);
  }

  // Task 2: Connect to database giftDB and store in variable dbInstance
  //{{insert code}}

  // Task 3: Return database instance
  // {{insert code}}
}

module.exports = connectToDatabase;
