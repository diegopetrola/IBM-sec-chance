const express = require("express");
const connectToDatabase = require("../models/db");
const router = express.Router();
const logger = require("../logger");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const db = await connectToDatabase();
    const collection = db.collection("users");
    const existingEmail = await collection.findOne({ email: email });

    if (existingEmail) {
      logger.error("Email already exists");
      return res.status(400).json({ error: "Email already exists" });
    }
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);
    const newUser = await collection.insertOne({
      email,
      firstName,
      lastName,
      password: hash,
      createdAt: new Date(),
    });
    const payload = {
      user: {
        id: newUser.insertedId,
      },
    };

    const authtoken = jwt.sign(payload, process.env.JWT_SECRET);
    logger.info("User registered successfully");
    res.json({ authtoken, email });
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
