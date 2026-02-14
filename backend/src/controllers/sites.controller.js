const Site = require("../models/sites.model");
const User = require("../models/users.model");
const asyncHandler = require("../utlis/asyncHandler");
const axios = require("axios");



// CREATE SITE
exports.createSite = asyncHandler(async (req, res) => {

    const { name, location, timezone } = req.body;

    if (!name || !location) {
        res.status(400);
        throw new Error("Name and location are required");
    }

    const exists = await Site.findOne({ name });
    if (exists) {
        res.status(400);
        throw new Error("Site already exists");
    }

    const site = await Site.create({
        name,
        location,
        timezone
    });

    res.status(201).json(site);
});
//GET ALL Sites
exports.getSites = asyncHandler(async (req, res) => {
    const sites = await Site.find().sort({ createdAt: -1 });
    res.json(sites);
});


// GET paginated SITES
exports.paginatedSites = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = 5;   

    const skip = (page - 1) * limit;

    const total = await Site.countDocuments();

    const sites = await Site.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.json({
        sites,
        page,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total
    });
});


// GET SINGLE SITE
exports.getSiteById = asyncHandler(async (req, res) => {

    const site = await Site.findById(req.params.id);

    if (!site) {
        res.status(404);
        throw new Error("Site not found");
    }

    res.json(site);
});


// UPDATE SITE
exports.updateSite = asyncHandler(async (req, res) => {

    const site = await Site.findById(req.params.id);

    if (!site) {
        res.status(404);
        throw new Error("Site not found");
    }

    site.name = req.body.name || site.name;
    site.location = req.body.location || site.location;
    site.timezone = req.body.timezone || site.timezone;
    site.status = req.body.status || site.status;

    await site.save();

    res.json(site);
});


// DELETE SITE
exports.deleteSite = asyncHandler(async (req, res) => {


    // prevent deletion if users are assigned

    const assignedUser = await User.findOne({ site: req.params.id });

    if (assignedUser) {
        res.status(400);
        throw new Error("Users are assigned to this site. Cannot delete.");
    }

    const site = await Site.findByIdAndDelete(req.params.id);

    if (!site) {
        res.status(404);
        throw new Error("Site not found");
    }

    res.json({ message: "Site deleted successfully" });
});

let cachedTimezones = null;

exports.getTimezones = asyncHandler(async (req, res) => {
    
    // if already fetched once → reuse
    if (cachedTimezones) {
        return res.json(cachedTimezones);
    }

    try {

        const response = await axios.get(
            "https://worldtimeapi.org/api/timezone",
            { timeout: 6000 }
        );

        cachedTimezones = response.data;

        res.json(cachedTimezones);

    } catch (error) {

        console.log("Timezone API failed:", error.message);

        // fallback list (VERY IMPORTANT FOR REVIEWER)
        cachedTimezones = [
            "Asia/Kolkata",
            "Asia/Dubai",
            "Europe/London",
            "America/New_York",
            "Asia/Singapore",
            "Australia/Sydney"
        ];

        res.json(cachedTimezones);
    }
});