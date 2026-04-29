require("dotenv").config(); // Load environment variables first
const User = require("./models/User");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // Allow only our Next.js client
  credentials: true,               // Allow cookies and auth headers
}));
app.use(express.json());

// 🔗 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // 🔗 Import JSON Web Token library

// ✅ Register route
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 0. Check if the user already exists to prevent duplicates
    // We query the database to see if the email is already in use.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "A user with this email already exists ⚠️" });
    }

    // 1. Generate a salt (random data added to the hashing process to ensure unique hashes)
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // 2. Hash the password mathematically using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Store the user with the securely hashed password
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully ✅" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong ❌" });
  }
});

// ✅ Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Locate the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password ❌" });
    }

    // 2. Verify the mathematical hash
    // bcrypt.compare hashes the incoming password with the stored salt and compares the two hashes
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password ❌" });
    }

    // 3. Generate a JSON Web Token (JWT)
    // This token acts as a digital passport, allowing the user to access protected routes later.
    // The 'secret' should ideally be stored in a .env file.
    const payload = {
      user: {
        id: user._id,
      },
    };

    // Sign the token: package the payload, sign it with a secret key, and set an expiration time (e.g., 1 hour)
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // 🔐 Now securely loading from .env
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;

        // 4. Successful Authentication - Send the token back to the client
        res.status(200).json({
          message: "Login successful ✅",
          token, // The client will store this and send it back with future requests
          user: { id: user._id, username: user.username, email: user.email }
        });
      }
    );

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong ❌" });
  }
});

const auth = require("./middleware/auth");

// 🛡️ Protected Route: Get Logged In User
// This route acts as a secure airlock. Only valid Bearer tokens can pass.
app.get("/api/user", auth, async (req, res) => {
  try {
    // Because the auth middleware successfully ran, we now have access to req.user.id
    // We query the database but use .select("-password") to ensure we NEVER send the hash back.
    const user = await User.findById(req.user.id).select("-password -__v");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error ❌");
  }
});

//  Keep this LAST
app.listen(5000, () => {
  console.log("Server running on port 5000");
});