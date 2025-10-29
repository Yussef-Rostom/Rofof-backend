const User = require("../models/User");
const bcrypt = require('bcryptjs');
const Listing = require("../models/Listing");
const Order = require("../models/Order");

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    res.json({ totalUsers, totalListings, totalOrders, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findById(req.params.id);

        if (user) {
            user.status = status;
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Reset user password
// @route   POST /api/admin/users/:id/reset-password
// @access  Private/Admin
const resetUserPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const user = await User.findById(req.params.id);

        if (user) {
            user.password = newPassword;
            await user.save();
            res.json({ message: "Password reset successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all listings
// @route   GET /api/admin/listings
// @access  Private/Admin
const getListings = async (req, res) => {
    try {
        const listings = await Listing.find().populate("seller", "fullName email");
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get listing by ID
// @route   GET /api/admin/listings/:id
// @access  Private/Admin
const getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate("seller", "fullName email");
        if (listing) {
            res.json(listing);
        } else {
            res.status(404).json({ message: "Listing not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Delete a listing
// @route   DELETE /api/admin/listings/:id
// @access  Private/Admin
const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (listing) {
            await listing.remove();
            res.json({ message: "Listing removed" });
        } else {
            res.status(404).json({ message: "Listing not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Update a listing
// @route   PUT /api/admin/listings/:id
// @access  Private/Admin
const updateListing = async (req, res) => {
    try {
        const { title, author, category, condition, price, description, status } = req.body;
        const listing = await Listing.findById(req.params.id);

        if (listing) {
            listing.title = title || listing.title;
            listing.author = author || listing.author;
            listing.category = category || listing.category;
            listing.condition = condition || listing.condition;
            listing.price = price || listing.price;
            listing.description = description || listing.description;
            listing.status = status || listing.status;

            const updatedListing = await listing.save();
            res.json(updatedListing);
        } else {
            res.status(404).json({ message: "Listing not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("buyer", "fullName email").populate("seller", "fullName email");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("buyer", "fullName email").populate("seller", "fullName email");
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: { status: status } },
            { new: true, runValidators: true } // `new: true` returns the updated document, `runValidators: true` runs validators on update
        );

        if (updatedOrder) {
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const changeUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);

        if (user) {
            if (user._id.toString() === req.user.id.toString()) {
                return res.status(400).json({ message: "Cannot change your own role" });
            }
            if (!["user", "admin"].includes(role)) {
                return res.status(400).json({ message: "Invalid role specified" });
            }
            user.role = role;
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getUserOrdersAdmin = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.params.id })
            .populate("buyer", "fullName email")
            .populate("seller", "fullName email");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all listings for a specific user
// @route   GET /api/admin/users/:id/listings
// @access  Private/Admin
const getUserListingsAdmin = async (req, res) => {
    try {
        const listings = await Listing.find({ seller: req.params.id }).populate("seller", "fullName email");
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc    Add a new user
// @route   POST /api/admin/users
// @access  Private/Admin
const addUser = async (req, res) => {
    const { fullName, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role: role || "user", // Default role to 'user' if not provided
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc    Remove a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const removeUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user._id.toString() === req.user.id.toString()) {
                return res.status(400).json({ message: "Cannot delete your own account" });
            }
            await User.findByIdAndDelete(req.params.id);
            res.json({ message: "User removed" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
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
};