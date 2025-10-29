const express = require('express');
const router = express.Router();
const {
    getAllListings,
    getFeaturedListings,
    getListingById,
    createListing,
    updateListing,
    deleteListing,
    getCategories,
    getMyListings,
} = require('../controllers/listingController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getAllListings)
    .post(protect, createListing);

router.route('/featured').get(getFeaturedListings);
router.route('/categories').get(getCategories);
router.route('/my-listings').get(protect, getMyListings);

router.route('/:id')
    .get(getListingById)
    .put(protect, updateListing)
    .delete(protect, deleteListing);

module.exports = router;