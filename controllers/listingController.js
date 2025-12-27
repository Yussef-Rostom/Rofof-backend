const Listing = require("../models/Listing");

// @desc    Get all listings with filtering, pagination, and sorting
// @route   GET /api/listings
// @access  Public
const getAllListings = async (req, res) => {
  try {
    const { search, category, priceMin, priceMax, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = { status: "Available" };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) {
        query.price.$gte = priceMin;
      }
      if (priceMax) {
        query.price.$lte = priceMax;
      }
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const listings = await Listing.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("seller", "fullName email sellerStats.totalSales");

    const totalListings = await Listing.countDocuments(query);

    res.json({ listings, totalPages: Math.ceil(totalListings / limit), currentPage: page });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get featured listings
// @route   GET /api/listings/featured
// @access  Public
const getFeaturedListings = async (req, res) => {
  try {
    const listings = await Listing.find({ status: "Available" })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("seller", "fullName email sellerStats.totalSales");

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get listing by ID
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("seller", "fullName email profile sellerStats.totalSales");

    if (listing) {
      res.json(listing);
    } else {
      res.status(404).json({ message: "Listing not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a listing
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res) => {
  try {
    const { title, author, category, condition, price, description, imageUrls } = req.body;

    const newListing = new Listing({
      title,
      author,
      category,
      condition,
      price,
      description,
      imageUrls,
      seller: req.user._id,
    });

    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a listing
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = async (req, res) => {
  try {
    const { title, author, category, condition, price, description, status, imageUrls } = req.body;
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized" });
    }

    listing.title = title || listing.title;
    listing.author = author || listing.author;
    listing.category = category || listing.category;
    listing.condition = condition || listing.condition;
    listing.price = price || listing.price;
    listing.description = description || listing.description;
    listing.status = status || listing.status;

    if (imageUrls) {
      listing.imageUrls = imageUrls;
    }

    if (req.files) {
      const newImageUrls = req.files.map(file => file.path);
      listing.imageUrls = listing.imageUrls.concat(newImageUrls);
    }

    const updatedListing = await listing.save();
    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await listing.deleteOne();
    res.json({ message: "Listing removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all listing categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Listing.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get listings by logged in user
// @route   GET /api/listings/my-listings
// @access  Private
const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user._id }).populate("seller", "fullName email sellerStats.totalSales");
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllListings,
  getFeaturedListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getCategories,
  getMyListings,
};