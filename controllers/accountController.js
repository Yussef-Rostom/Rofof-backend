const User = require("../models/User");
const Listing = require("../models/Listing");
const Order = require("../models/Order");

// @desc    Get user profile
// @route   GET /api/account/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/account/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, avatarUrl } = req.body;
    const user = await User.findById(req.user.id);

    if (user) {
      user.fullName = fullName || user.fullName;
      user.profile.bio = bio || user.profile.bio;
      user.profile.avatarUrl = avatarUrl || user.profile.avatarUrl;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user email
// @route   PUT /api/account/email
// @access  Private
const updateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findById(req.user.id);

    if (user) {
      user.email = email;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/account/password
// @access  Private
const updatePassword = async (req, res) => {
  try {

    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (user && (await user.comparePassword(oldPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ user, message: "Password updated successfully" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all listings by user
// @route   GET /api/account/listings
// @access  Private
const getUserListings = async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user.id });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get incoming orders for user
// @route   GET /api/account/orders/incoming
// @access  Private
const getIncomingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user.id }).populate("buyer seller", "fullName email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get purchase history of user
// @route   GET /api/account/orders/purchases
// @access  Private
const getPurchaseHistory = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id }).populate("seller buyer", "fullName email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get order details by ID
// @route   GET /api/account/orders/:id
// @access  Private
const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyer", "fullName email")
      .populate("seller", "fullName email")
      .populate("listingInfo.listingId", "author");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is buyer or seller
    if (
      order.buyer._id.toString() !== req.user.id.toString() &&
      order.seller._id.toString() !== req.user.id.toString()
    ) {
      return res.status(401).json({ message: "Not authorized to view this order" });
    }

    const orderToReturn = order.toObject();
    if (orderToReturn.listingInfo && orderToReturn.listingInfo.listingId) {
      orderToReturn.listingInfo.author = orderToReturn.listingInfo.listingId.author;
      delete orderToReturn.listingInfo.listingId;
    }

    res.json(orderToReturn);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateEmail,
  updatePassword,
  getUserListings,
  getIncomingOrders,
  getPurchaseHistory,
  getOrderDetails,
};