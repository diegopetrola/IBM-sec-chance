const express = require("express");
const router = express.Router();
const connectToDatabase = require("../models/db");

// Search for gifts
router.get("/", async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("secondChanceItems");
    let query = {};

    // Add the name filter to the query if the name parameter is not empty
    if (req.query.name && req.query.name.trim() !== "") {
      query.name = { $regex: req.query.name, $options: "i" }; // Using regex for partial match, case-insensitive
    }
    // Add other filters to the query
    if (req.query.category) query.category = req.query.category;
    if (req.query.condition) query.condition = req.query.condition || null;
    if (req.query.age_years)
      query.age_years = req.query.age_years
        ? { $lte: parseInt(req.query.age_years) }
        : null;

    console.log(query);
    const gifts = await collection.find(query).toArray();

    res.json(gifts);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
