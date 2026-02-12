const jwt = require("jsonwebtoken");

const generateAccessToken = (admin) => {
    return jwt.sign(
        { id: admin._id, email: admin.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );
};

const generateRefreshToken = (admin) => {
    return jwt.sign(
        { id: admin._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
    );
};

module.exports = { generateAccessToken, generateRefreshToken }