const { body, validationResult } = require("express-validator");

// Helper middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateUpdateProfile = [
    body("fullName")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Full name cannot be empty")
        .isLength({ min: 2, max: 50 })
        .withMessage("Full name must be between 2 and 50 characters")
        .escape(),
    body("bio")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Bio cannot exceed 500 characters")
        .escape(),
    body("avatarUrl")
        .optional()
        .trim()
        .isURL()
        .withMessage("Invalid avatar URL"),
    handleValidationErrors,
];

const validateUpdateEmail = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please include a valid email address")
        .normalizeEmail(),
    handleValidationErrors,
];

const validateUpdatePassword = [
    body("oldPassword")
        .notEmpty()
        .withMessage("Old password is required"),
    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters long")
        .custom((value, { req }) => {
            if (value === req.body.oldPassword) {
                throw new Error("New password must be different from the old password");
            }
            return true;
        }),
    handleValidationErrors,
];

module.exports = {
    validateUpdateProfile,
    validateUpdateEmail,
    validateUpdatePassword,
};
