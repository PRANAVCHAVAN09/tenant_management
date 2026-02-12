const asyncHandler = require("../utlis/asyncHandler");
const Admin = require("../models/admin.model");
const { generateAccessToken, generateRefreshToken } = require("../utlis/generateTokens");
const bcrypt = require("bcryptjs");






// REGISTER ADMIN (only once)
exports.registerAdmin = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    // check existing admin
    const existing = await Admin.findOne({ email });

    if (existing) {``
        res.status(400);
        throw new Error("Admin already exists");
    }

    await Admin.create({ name, email, password });

    res.status(201).json({
        success: true,
        message: "Admin registered successfully"
    });

});


exports.loginAdmin = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    // 1. Check admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
        res.status(401);
        throw new Error("Invalid credentials");
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        res.status(401);
        throw new Error("Invalid credentials");
    }

    // 3. Generate tokens
    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    // 4. Hash refresh token before saving (security)
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    admin.refreshToken = hashedRefreshToken;
    await admin.save();

    // 5. Send response
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

    // 1. token provided?
    if (!refreshToken) {
        res.status(401);
        throw new Error("Refresh token required");
    }

    // 2. verify JWT signature
    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        res.status(403);
        throw new Error("Invalid or expired refresh token");
    }

    // 3. find admin
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.refreshToken) {
        res.status(403);
        throw new Error("Access denied");
    }

    // 4. compare hashed token stored in DB
    const isMatch = await bcrypt.compare(refreshToken, admin.refreshToken);

    if (!isMatch) {
        res.status(403);
        throw new Error("Refresh token mismatch");
    }

    // 5. generate NEW access token
    const newAccessToken = generateAccessToken(admin);

    // 6. send new access token
    res.json({
        accessToken: newAccessToken
    });
});
