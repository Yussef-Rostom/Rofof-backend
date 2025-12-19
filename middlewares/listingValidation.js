const { body, validationResult } = require("express-validator");

// Helper middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateCreateListing = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 100 })
        .withMessage("Title must be less than 100 characters")
        .escape(),
    body("author")
        .trim()
        .notEmpty()
        .withMessage("Author is required")
        .escape(),
    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required")
        .escape(),
    body("condition")
        .trim()
        .notEmpty()
        .withMessage("Condition is required")
        .isIn(["New", "Like New", "Good", "Fair", "Acceptable"])
        .withMessage("Condition must be one of: New, Like New, Good, Fair, Acceptable"),
    body("price")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters")
        .escape(),
    body("imageUrls")
        .optional()
        .isArray()
        .withMessage("Image URLs must be an array of strings"),
    body("imageUrls.*")
        .optional()
        .isURL()
        .withMessage("Invalid image URL"),
    handleValidationErrors,
];

const validateUpdateListing = [
    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty")
        .isLength({ max: 100 })
        .withMessage("Title must be less than 100 characters")
        .escape(),
    body("author")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Author cannot be empty")
        .escape(),
    body("category")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Category cannot be empty")
        .escape(),
    body("condition")
        .optional()
        .trim()
        .isIn(["New", "Like New", "Good", "Fair", "Acceptable"])
        .withMessage("Condition must be one of: New, Like New, Good, Fair, Acceptable"),
    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters")
        .escape(),
    body("status")
        .optional()
        .trim()
        .isIn(["Available", "Pending", "Sold"])
        .withMessage("Status must be one of: Available, Pending, Sold"),
    body("imageUrls")
        .optional()
        .isArray()
        .withMessage("Image URLs must be an array of strings"),
    body("imageUrls.*")
        .optional()
        .isURL()
        .withMessage("Invalid image URL"),
    handleValidationErrors,
];

module.exports = {
    validateCreateListing,
    validateUpdateListing,
};
