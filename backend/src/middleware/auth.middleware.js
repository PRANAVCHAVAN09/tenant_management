const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401);
        throw new Error("No token provided");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        res.status(401);
        throw new Error("Token expired or invalid");
    }
};

module.exports = verifyToken;