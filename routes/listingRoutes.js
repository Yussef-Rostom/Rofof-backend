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
const { validateCreateListing, validateUpdateListing } = require('../middlewares/listingValidation');

router.route('/')
    .get(getAllListings)
    .post(protect, validateCreateListing, createListing);

router.route('/featured').get(getFeaturedListings);
router.route('/categories').get(getCategories);
router.route('/my-listings').get(protect, getMyListings);

router.route('/:id')
    .get(getListingById)
    .put(protect, validateUpdateListing, updateListing)
    .delete(protect, deleteListing);

module.exports = router;