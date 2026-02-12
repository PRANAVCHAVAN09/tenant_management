const Role = require("../models/roles.model");
const User = require("../models/users.model"); // needed to block deletion
const asyncHandler = require("../utlis/asyncHandler");


// CREATE ROLE
exports.createRole = asyncHandler(async (req, res) => {
    const { name, permissions } = req.body;

    if (!name) {
        res.status(400);
        throw new Error("Role name is required");
    }

    const exists = await Role.findOne({ name });
    if (exists) {
        res.status(400);
        throw new Error("Role already exists");
    }

    const role = await Role.create({ name, permissions });

    res.status(201).json(role);
});


// GET ALL ROLES
exports.getRoles = asyncHandler(async (req, res) => {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.json(roles);
});


// UPDATE ROLE
exports.updateRole = asyncHandler(async (req, res) => {
    const role = await Role.findById(req.params.id);

    if (!role) {
        res.status(404);
        throw new Error("Role not found");
    }

    role.name = req.body.name || role.name;
    role.permissions = req.body.permissions || role.permissions;
    role.status = req.body.status || role.status;

    await role.save();

    res.json(role);
});


// DELETE ROLE (IMPORTANT LOGIC)
exports.deleteRole = asyncHandler(async (req, res) => {

    // check if any user using this role
    const assignedUser = await User.findOne({ role: req.params.id });

    if (assignedUser) {
        res.status(400);
        throw new Error("Role assigned to users. Cannot delete.");
    }

    const role = await Role.findByIdAndDelete(req.params.id);

    if (!role) {
        res.status(404);
        throw new Error("Role not found");
    }

    res.json({ message: "Role deleted successfully" });
});
