const User = require("../models/users.model");
const Role = require("../models/roles.model");
const Site = require("../models/sites.model");
const asyncHandler = require("../utlis/asyncHandler");

exports.getDashboardStats = asyncHandler(async (req, res) => {


    const totalUsers = await User.countDocuments();


    const activeUsers = await User.countDocuments({ status: "active" });

 
    const totalRoles = await Role.countDocuments();

    const totalSites = await Site.countDocuments();

    res.json({
        totalUsers,
        activeUsers,
        totalRoles,
        totalSites
    });
});
