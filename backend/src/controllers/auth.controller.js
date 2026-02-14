const asyncHandler = require("../utlis/asyncHandler");
const Admin = require("../models/admin.model");
const { generateAccessToken, generateRefreshToken } = require("../utlis/generateTokens");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,                 // HTTPS only in production
  sameSite: isProduction ? "none" : "lax", // CRITICAL for Vercel ↔ Render
  path: "/"
};







// REGISTER ADMIN (only once)
exports.registerAdmin = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    // check existing admin
    const existing = await Admin.findOne({ email });

    if (existing) {
        ``
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

    console.log(accessToken,"611" , refreshToken,"622")
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // admin.refreshToken = hashedRefreshToken;
    // await admin.save();

    await Admin.findByIdAndUpdate(
        admin._id,
        { refreshToken: hashedRefreshToken },
        { new: true }
    );
    // 5. Send response
    res
        .cookie("accessToken", accessToken, {
             ...cookieOptions,
            maxAge: 15 * 60 * 1000
        })
        .cookie("refreshToken", refreshToken, {
              ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .json({

        admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email
        }});
});

exports.refreshToken = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies.refreshToken;


    if (!refreshToken) {
        res.status(401);
        throw new Error("Refresh token required");
    }


    let decoded;
    try {


        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        console.error("Refresh token verification failed:", err);
        res.status(403);
        throw new Error("Invalid or expired refresh token");
    }


    console.log("Decoded refresh token:", decoded);
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

 res
  .cookie("accessToken", newAccessToken, {
       ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000
  })
  .status(200)
  .json({ message: "Access token refreshed" });
});

exports.checkAuth = (req, res) => {
  res.status(200).json({
    authenticated: true
  });
};


exports.logout = (req, res) => {
res.clearCookie("accessToken", cookieOptions);
res.clearCookie("refreshToken", cookieOptions);

  res.json({ message: "Logged out" });
};
