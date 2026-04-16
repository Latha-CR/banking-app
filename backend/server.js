const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Dummy login API (for demo)
app.post("/api/login", (req, res) => {
  res.json({ message: "Login success" });
});

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Default route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// PORT
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});