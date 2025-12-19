const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrderById,
    updateOrderStatus,
    getMyOrders,
    getMySales,
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
const {
    validateCreateOrder,
    validateUpdateOrderStatus,
    validateOrderId,
} = require('../middlewares/orderValidation');

router.use(protect);

router.route('/')
    .post(validateCreateOrder, createOrder);

router.route('/my-orders')
    .get(getMyOrders);

router.route('/my-sales')
    .get(getMySales);

router.route('/:id')
    .get(validateOrderId, getOrderById);

router.route('/:id/status')
    .put(validateUpdateOrderStatus, updateOrderStatus);

module.exports = router;
