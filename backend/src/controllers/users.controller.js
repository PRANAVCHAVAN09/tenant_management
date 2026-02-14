const User = require("../models/users.model");
const Role = require("../models/roles.model");
const Site = require("../models/sites.model");
const asyncHandler = require("../utlis/asyncHandler");


// CREATE USER
exports.createUser = asyncHandler(async (req, res) => {

    const { name, email, role, site } = req.body;

    if (!name || !email || !role || !site) {
        res.status(400);
        throw new Error("All fields are required");
    }

    // email unique
    const exists = await User.findOne({ email });
    if (exists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // role exists
    const roleExists = await Role.findById(role);
    if (!roleExists) {
        res.status(404);
        throw new Error("Invalid role");
    }

    // site exists
    const siteExists = await Site.findById(site);
    if (!siteExists) {
        res.status(404);
        throw new Error("Invalid site");
    }

    const user = await User.create({
        name,
        email,
        role,
        site
    });

    res.status(201).json(user);
});


// GET USERS 
exports.getUsers = asyncHandler(async (req, res) => {

    let { page = 1, limit = 5, search = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {
        name: { $regex: search, $options: "i" }
    };

    const users = await User.find(query)
        .populate("role", "name")
        .populate("site", "name location")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
        total,
        page,
        pages: Math.ceil(total / limit),
        users
    });
});


// GET SINGLE USER
exports.getUserById = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id)
        .populate("role", "name")
        .populate("site", "name location");

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    res.json(user);
});


// UPDATE USER
exports.updateUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.site = req.body.site || user.site;

    await user.save();

    res.json(user);
});


// DEACTIVATE USER 
exports.deactivateUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // toggle status
    user.status = user.status === "active" ? "inactive" : "active";

    await user.save();

    res.json({
        message: `User ${user.status === "active" ? "activated" : "deactivated"} successfully`,
        user
    });
});
