const { body, validationResult } = require("express-validator");

// Helper middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateRegistration = [
    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 2 })
        .withMessage("Full name must be at least 2 characters long")
        .escape(), // Basic sanitization
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please include a valid email address")
        .normalizeEmail(), // Canonicalize email
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    handleValidationErrors,
];

const validateLogin = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
    handleValidationErrors,
];

module.exports = {
    validateRegistration,
    validateLogin,
};
