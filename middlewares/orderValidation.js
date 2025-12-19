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

const validateCreateOrder = [
    body("shippingAddress")
        .notEmpty()
        .withMessage("Shipping address is required")
        .isObject()
        .withMessage("Shipping address must be an object"),
    body("shippingAddress.street")
        .trim()
        .notEmpty()
        .withMessage("Street is required")
        .escape(),
    body("shippingAddress.city")
        .trim()
        .notEmpty()
        .withMessage("City is required")
        .escape(),
    body("shippingAddress.state")
        .trim()
        .notEmpty()
        .withMessage("State is required")
        .escape(),
    body("shippingAddress.country")
        .trim()
        .notEmpty()
        .withMessage("Country is required")
        .escape(),
    handleValidationErrors,
];

const validateUpdateOrderStatus = [
    param("id")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Invalid Order ID format");
            }
            return true;
        }),
    body("status")
        .trim()
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"])
        .withMessage("Status must be one of: Pending, Processing, Shipped, Delivered, Cancelled"),
    handleValidationErrors,
];

const validateOrderId = [
    param("id")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Invalid Order ID format");
            }
            return true;
        }),
    handleValidationErrors,
];

module.exports = {
    validateCreateOrder,
    validateUpdateOrderStatus,
    validateOrderId,
};
