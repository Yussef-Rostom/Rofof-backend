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

router.use(protect);

router.route('/')
    .post(createOrder);

router.route('/my-orders')
    .get(getMyOrders);

router.route('/my-sales')
    .get(getMySales);

router.route('/:id')
    .get(getOrderById);

router.route('/:id/status')
    .put(updateOrderStatus);

module.exports = router;
