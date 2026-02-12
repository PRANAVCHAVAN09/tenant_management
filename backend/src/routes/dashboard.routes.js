const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");

router.get("/", (req, res) => {
    res.send("Dashboard route working");
});

router.get("/stats", verifyToken, dashboardController.getDashboardStats);

module.exports = router;
