const User = require("./models/User");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔗 Connect to MongoDB
mongoose.connect("mongodb+srv://muqeetk42:12Zuna34@cluster0.qnqtp1o.mongodb.net/Fitness-App")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully ✅" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong ❌" });
  }
});