const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const siteController = require("../controllers/sites.controller");


router.get("/", (req, res) => {
    res.send("Sites route working");
});


router.post("/createSite", verifyToken, siteController.createSite);
router.get("/paginatedSites", verifyToken, siteController.getSites);
router.get("/getAllSites", verifyToken, siteController.getSites);

router.get("/timezones", verifyToken, siteController.getTimezones);
router.get("/:id", verifyToken, siteController.getSiteById);
router.put("/:id", verifyToken, siteController.updateSite);
router.delete("/:id", verifyToken, siteController.deleteSite);


module.exports = router;
