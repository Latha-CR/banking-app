const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// TEST API
app.post("/api/login", (req, res) => {
  res.json({ message: "Login success" });
});

// SERVE FRONTEND
app.use(express.static(path.join(__dirname, "../frontend")));

// FIXED ROUTE (NO ERROR)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// PORT
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});