const { body, param, validationResult } = require("express-validator");
const mongoose = require("mongoose");

// Helper middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateAddUser = [
    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required")
        .escape(),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("role")
        .optional()
        .trim()
        .isIn(["user", "admin"])
        .withMessage("Role must be 'user' or 'admin'"),
    handleValidationErrors,
];

const validateUpdateUserStatus = [
    param("id")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Invalid User ID format");
            }
            return true;
        }),
    body("status")
        .trim()
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["Active", "Suspended"]) // Assuming these are the statuses based on typical patterns
        .withMessage("Status must be 'Active' or 'Suspended'"),
    handleValidationErrors,
];

const validateChangeUserRole = [
    param("id")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Invalid User ID format");
            }
            return true;
        }),
    body("role")
        .trim()
        .notEmpty()
        .withMessage("Role is required")
        .isIn(["user", "admin"])
        .withMessage("Role must be 'user' or 'admin'"),
    handleValidationErrors,
];

const validateResetUserPassword = [
    param("id")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Invalid User ID format");
            }
            return true;
        }),
    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters long"),
    handleValidationErrors,
];

const validateIdParam = [
    param("id")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Invalid ID format");
            }
            return true;
        }),
    handleValidationErrors,
];

module.exports = {
    validateAddUser,
    validateUpdateUserStatus,
    validateChangeUserRole,
    validateResetUserPassword,
    validateIdParam,
};
