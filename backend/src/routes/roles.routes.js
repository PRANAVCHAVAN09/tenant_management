const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const roleController = require("../controllers/roles.controller");

router.get("/", (req, res) => {
    res.send("Roles route working");
});

router.post("/createRole", verifyToken, roleController.createRole);
router.get("/getRoles", verifyToken, roleController.getRoles);
router.put("/:id", verifyToken, roleController.updateRole);
router.delete("/:id", verifyToken, roleController.deleteRole);

module.exports = router;
