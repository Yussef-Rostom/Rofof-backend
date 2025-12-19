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

const validateAddToCart = [
    body("listingId")
        .notEmpty()
        .withMessage("Listing ID is required")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Invalid Listing ID format");
            }
            return true;
        }),
    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive integer"),
    handleValidationErrors,
];

const validateUpdateCartItem = [
    param("itemId")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Invalid Cart Item ID format");
            }
            return true;
        }),
    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 0 })
        .withMessage("Quantity must be a non-negative integer"),
    handleValidationErrors,
];

const validateRemoveFromCart = [
    param("itemId")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Invalid Cart Item ID format");
            }
            return true;
        }),
    handleValidationErrors,
];

module.exports = {
    validateAddToCart,
    validateUpdateCartItem,
    validateRemoveFromCart,
};
