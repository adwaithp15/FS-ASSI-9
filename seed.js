require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully");

        const hashedPassword = await bcrypt.hash("adwaith123", 10);

        await User.findOneAndUpdate(
            { username: "adwaithp" },
            { username: "adwaithp", password: hashedPassword },
            { upsert: true, returnDocument: "after" }
        );

        console.log("Default User (adwaithp) Inserted Successfully");
    } catch (error) {
        console.log(error);
    } finally {
        await mongoose.connection.close();
    }
}

seedData();
