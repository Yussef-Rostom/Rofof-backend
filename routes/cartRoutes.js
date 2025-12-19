const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');
const {
    validateAddToCart,
    validateUpdateCartItem,
    validateRemoveFromCart,
} = require('../middlewares/cartValidation');

router.use(protect);

router.route('/')
    .get(getCart)
    .post(validateAddToCart, addToCart)
    .delete(clearCart);

router.route('/:itemId')
    .put(validateUpdateCartItem, updateCartItem)
    .delete(validateRemoveFromCart, removeFromCart);

module.exports = router;
