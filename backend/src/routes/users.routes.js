const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const userController = require("../controllers/users.controller");

router.get("/", (req, res) => {
    res.send("users route working");
});

router.post("/createUser", verifyToken, userController.createUser);
router.get("/getAllUsers", verifyToken, userController.getUsers);
router.get("/:id", verifyToken, userController.getUserById);
router.put("/:id", verifyToken, userController.updateUser);
router.patch("/:id/deactivate", verifyToken, userController.deactivateUser);

module.exports = router;
