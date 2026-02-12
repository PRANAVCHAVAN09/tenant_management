const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");


router.get("/", (req, res) => {
    res.send("Auth route working");
});

// register
router.post("/register", authController.registerAdmin);

// login
router.post("/login", authController.loginAdmin);

//refresh token
router.post("/refresh", authController.refreshToken); 




module.exports = router;
