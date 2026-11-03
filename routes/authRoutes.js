const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// ================= REGISTER API =================
router.post("/register", async (req, res) => {
    try {
        console.log("\nRegistration Request Received");
        const { username, password } = req.body || {};
        console.log("Username Received:", username);

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log("User Already Exists:", username);
            return res.status(409).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username: username, password: hashedPassword });
        await newUser.save();

        console.log("--------------------------------");
        console.log("REGISTRATION SUCCESSFUL");
        console.log("Username:", username);
        console.log("Password: Securely Hashed");
        console.log("--------------------------------");

        res.status(201).json({ message: "Registration Successful", username: username });
    } catch (error) {
        console.log("REGISTRATION ERROR:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ================= LOGIN API =================
router.get("/login", async (req, res) => {
    try {
        const { username, password } = req.query;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            console.log("Login Failed: User not found");
            return res.status(404).json({ message: "Username not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        console.log("--------------------------------");
        console.log("USER DATA FETCHED FROM MONGODB");
        console.log("Username:", user.username);
        console.log("Password Verification:", isMatch ? "Correct" : "Incorrect");

        if (!isMatch) {
            console.log("LOGIN FAILED");
            return res.status(401).json({ message: "Incorrect password" });
        }

        console.log("LOGIN SUCCESSFUL");
        console.log("--------------------------------");

        res.status(200).json({ message: "Login Successful", username: user.username, status: "Logged In" });
    } catch (error) {
        console.log("LOGIN ERROR:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;
