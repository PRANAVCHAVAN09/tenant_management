const asyncHandler = require("../utlis/asyncHandler");
const Admin = require("../models/admin.model");
const { generateAccessToken, generateRefreshToken } = require("../utlis/generateTokens");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



exports.registerAdmin = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
        res.status(400);
        throw new Error("Admin already exists");
    }

    await Admin.create({ name, email, password });

    res.status(201).json({
        message: "Admin registered successfully"
    });
});


exports.loginAdmin = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
        res.status(401);
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        res.status(401);
        throw new Error("Invalid credentials");
    }

   
    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);


    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await Admin.findByIdAndUpdate(
        admin._id,
        { refreshToken: hashedRefreshToken },
        { new: true }
    );

    res.json({
        accessToken,
        refreshToken,
        admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email
        }
    });
});



exports.refreshToken = asyncHandler(async (req, res) => {

    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(401);
        throw new Error("Refresh token required");
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        res.status(403);
        throw new Error("Invalid or expired refresh token");
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.refreshToken) {
        res.status(403);
        throw new Error("Access denied");
    }

    const isMatch = await bcrypt.compare(refreshToken, admin.refreshToken);
    if (!isMatch) {
        res.status(403);
        throw new Error("Refresh token mismatch");
    }

    const newAccessToken = generateAccessToken(admin);

    res.json({ accessToken: newAccessToken });
});






exports.logout = asyncHandler(async (req, res) => {
 
    const adminId = req.admin.id;
    await Admin.findByIdAndUpdate(adminId, { refreshToken: null });

    res.json({ message: "Logged out successfully" });
});
