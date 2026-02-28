
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// Environment variables for admin auth
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

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

// Admin authentication endpoint
app.post("/api/auth/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Username and password are required" 
      });
    }
    
    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return res.json({ 
        success: true, 
        message: "Authentication successful",
        role: "admin"
      });
    }
    
    // Generic error message for security
    return res.status(401).json({ 
      success: false, 
      message: "Invalid credentials" 
    });
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Authentication service unavailable" 
    });
  }
});

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