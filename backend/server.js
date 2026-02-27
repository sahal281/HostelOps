
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// Mongo connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const Complaint = mongoose.model("Complaint", {
  title: String,
  description: String,
  priority: String,
  status: { type: String, default: "Pending" }
});

// Routes

// create complaint
app.post("/api/complaint", async (req, res) => {
  const data = await Complaint.create(req.body);
  res.json(data);
});

// get all complaints
app.get("/api/complaints", async (req, res) => {
  const data = await Complaint.find();
  res.json(data);
});

// update status
app.patch("/api/complaint/:id", async (req, res) => {
  const updated = await Complaint.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

app.get("/", (req, res) => {
  res.send("Backend working successfully");
});

app.get("/api/health", (req,res)=>{
  res.json({status:"OK"});
});

app.listen(5000, () => console.log("Server running on port 5000"));
app.get("/", (req, res) => {
  res.send("Backend working ");
});