const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    updateEmail,
    updatePassword,
    getUserListings,
    getIncomingOrders,
    getPurchaseHistory,
    getOrderDetails,
} = require('../controllers/accountController');
const { protect } = require('../middlewares/authMiddleware');
const {
    validateUpdateProfile,
    validateUpdateEmail,
    validateUpdatePassword
} = require('../middlewares/accountValidation');

router.use(protect);

router.route('/profile')
    .get(getProfile)
    .put(validateUpdateProfile, updateProfile);

router.put('/email', validateUpdateEmail, updateEmail);
router.put('/password', validateUpdatePassword, updatePassword);

router.get('/listings', getUserListings);
router.get('/orders/incoming', getIncomingOrders);
router.get('/orders/purchases', getPurchaseHistory);
router.get('/orders/:id', getOrderDetails);

module.exports = router;
