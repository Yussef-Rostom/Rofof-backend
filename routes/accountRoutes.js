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
} = require('../controllers/accountController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/profile')
    .get(getProfile)
    .put(updateProfile);

router.put('/email', updateEmail);
router.put('/password', updatePassword);

router.get('/listings', getUserListings);
router.get('/orders/incoming', getIncomingOrders);
router.get('/orders/purchases', getPurchaseHistory);

module.exports = router;
