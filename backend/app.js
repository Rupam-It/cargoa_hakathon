const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const crypto = require("crypto");

// Initialize Express App
const app = express();
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", (err) => console.error("MongoDB connection error:", err));

// Event Log Schema
const eventLogSchema = new mongoose.Schema({
  event_type: { type: String, required: true },
  timestamp: { type: String, required: true },
  source_app_id: { type: String, required: true },
  data_payload: { type: Object, required: true },
  previous_hash: { type: String, required: true },
  hash: { type: String, required: true },
});

const EventLog = mongoose.model("EventLog", eventLogSchema);

// Hashing Function
function generateHash(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

// API Endpoints

// 1. Log an Event
app.post("/api/logs", async (req, res) => {
  try {
    const { event_type, timestamp, source_app_id, data_payload } = req.body;

    if (!event_type || !timestamp || !source_app_id || !data_payload) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get the latest log to fetch the previous hash
    const latestLog = await EventLog.findOne().sort({ _id: -1 });
    const previousHash = latestLog ? latestLog.hash : "0";

    // Create the new log
    const logData = { event_type, timestamp, source_app_id, data_payload, previous_hash: previousHash };
    const hash = generateHash(JSON.stringify(logData));
    logData.hash = hash;

    // Save to MongoDB
    const newLog = new EventLog(logData);
    await newLog.save();

    res.status(201).json({ message: "Log created successfully", log: newLog });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// 2. Query Logs
app.get("/api/logs", async (req, res) => {
  try {
    const { event_type, start_time, end_time, source_app_id, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (event_type) filter.event_type = event_type;
    if (source_app_id) filter.source_app_id = source_app_id;
    if (start_time && end_time) {
      filter.timestamp = { $gte: start_time, $lte: end_time };
    }

    const logs = await EventLog.find(filter)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({ logs });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// 3. Verify Log Chain
app.get("/api/logs/verify", async (req, res) => {
  try {
    const logs = await EventLog.find().sort({ _id: 1 });
    let isChainValid = true;

    for (let i = 1; i < logs.length; i++) {
      const currentLog = logs[i];
      const previousLog = logs[i - 1];

      // Check if the previous hash matches
      if (currentLog.previous_hash !== previousLog.hash) {
        isChainValid = false;
        break;
      }

      // Recompute the hash to ensure integrity
      const logData = { ...currentLog.toObject(), hash: undefined };
      const recomputedHash = generateHash(JSON.stringify(logData));
      if (currentLog.hash !== recomputedHash) {
        isChainValid = false;
        break;
      }
    }

    res.status(200).json({ isChainValid });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
