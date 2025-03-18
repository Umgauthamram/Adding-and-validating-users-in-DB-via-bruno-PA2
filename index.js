const express = require("express");
const { resolve } = require("path");
const mongoose = require("mongoose");
const userModel = require("./user.model.js");
const bcrypt = require("bcrypt");

const app = express();
const port = 3010;

app.use(express.static("static"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"));
});

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://gauthamramum:1234@assignments.thlix.mongodb.net/",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("Database connected.");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", user.password);

    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ success: false, message: "Couldn't login due to a server error." });
  }
});

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

startServer();
