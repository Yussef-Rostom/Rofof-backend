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
const {
    validateAddUser,
    validateUpdateUserStatus,
    validateChangeUserRole,
    validateResetUserPassword,
    validateIdParam,
} = require('../middlewares/adminValidation');

router.use(protect, admin);

router.get('/dashboard', getDashboardStats);

router.route('/users').get(getUsers).post(validateAddUser, addUser);
router.route('/users/:id')
    .get(validateIdParam, getUserById)
    .put(validateUpdateUserStatus, updateUserStatus)
    .delete(validateIdParam, removeUser);
router.put('/users/:id/role', validateChangeUserRole, changeUserRole);
router.post('/users/:id/reset-password', validateResetUserPassword, resetUserPassword);
router.get('/users/:id/listings', validateIdParam, getUserListingsAdmin);
router.get('/users/:id/orders', validateIdParam, getUserOrdersAdmin);

router.route('/listings').get(getListings);
router.route('/listings/:id')
    .get(validateIdParam, getListingById)
    .delete(validateIdParam, deleteListing)
    .put(validateIdParam, updateListing);

router.route('/orders').get(getOrders);
router.route('/orders/:id')
    .get(validateIdParam, getOrderById)
    .put(validateIdParam, updateOrderStatus);

module.exports = router;
