const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");

const app = express();

const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true }

mongoose.connect("mongodb://localhost:27017/events-app", dbOptions, (err) => {
  if (err) {
    console.log("not connected ❌")
  } else {
    console.log("connected ✅")
  }
})

// models
const Event = require("./models/Event")

app.use(cors({
  origin: "http://localhost:8080"
}))

app.post("/seed", async (req, res) => {
  await Event.deleteMany();
  const file = fs.readFileSync("history.json", {encoding: "utf8"});
  const { result } = JSON.parse(file);
  await Event.insertMany(result);
  res.send("events seeded");
})

app.get("/events", async (req, res) => {
  const events = await Event.find();
  res.send({
    length: events.length,
    events
  })
})

app.listen(5000, () => "listening on port 5000")