const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(String(process.env.MONOGO_URI));
        console.log("MongoDB Connected");
    } catch (error) {
        console.log("DB connection error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
