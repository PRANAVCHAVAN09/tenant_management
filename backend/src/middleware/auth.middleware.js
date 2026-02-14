const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {


    const authHeader = req.headers.authorization;



    if (!authHeader || !authHeader.startsWith("Bearer ")) {
         res.status(401)
          throw new Error("Invalid credentials");
    }

  
    const token = authHeader.split(" ")[1];

    try {
     
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.admin = decoded;

        next();

    } catch (err) {
           res.status(401)
          throw new Error("Invalid credentials");

    }
};

module.exports = verifyToken;
