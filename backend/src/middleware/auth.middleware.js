const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const token = req.cookies.accessToken;

    console.log("COOKIE TOKEN:", token);

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.admin = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ message: "Token expired or invalid" });
    }
};

module.exports = verifyToken;
