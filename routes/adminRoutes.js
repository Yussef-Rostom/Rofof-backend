const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getUsers,
    getUserById,
    updateUserStatus,
    resetUserPassword,
    getListings,
    getListingById,
    deleteListing,
    updateListing,
    getOrders,
    getOrderById,
    updateOrderStatus,
    changeUserRole,
    getUserListingsAdmin,
    getUserOrdersAdmin,
    addUser,
    removeUser,
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');

router.use(protect, admin);

router.get('/dashboard', getDashboardStats);

router.route('/users').get(getUsers).post(addUser);
router.route('/users/:id')
    .get(getUserById)
    .put(updateUserStatus)
    .delete(removeUser);
router.put('/users/:id/role', changeUserRole);
router.post('/users/:id/reset-password', resetUserPassword);
router.get('/users/:id/listings', getUserListingsAdmin);
router.get('/users/:id/orders', getUserOrdersAdmin);

router.route('/listings').get(getListings);
router.route('/listings/:id')
    .get(getListingById)
    .delete(deleteListing)
    .put(updateListing);

router.route('/orders').get(getOrders);
router.route('/orders/:id')
    .get(getOrderById)
    .put(updateOrderStatus);

module.exports = router;
