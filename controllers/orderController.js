const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Listing = require("../models/Listing");

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.listing"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const orders = [];

    for (const item of cart.items) {
      const listing = await Listing.findById(item.listing._id);
      if (!listing || listing.status !== "Available") {
        return res
          .status(400)
          .json({ message: `Sorry, ${item.listing.title} is no longer available` });
      }

      const order = new Order({
        buyer: req.user.id,
        seller: listing.seller,
        listingInfo: {
          listingId: listing._id,
          title: listing.title,
          price: listing.price,
          quantity: item.quantity,
          author: listing.author,
        },
        shippingAddress,
        totalPrice: listing.price * item.quantity,
      });


      listing.status = "Sold";
      await listing.save();

      const savedOrder = await order.save();
      orders.push(savedOrder);

    }

    cart.items = [];
    await cart.save();

    res.status(201).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyer", "fullName email")
      .populate("seller", "fullName email")
      .populate("listingInfo.listingId", "author");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.buyer._id.toString() !== req.user.id.toString() &&
      order.seller._id.toString() !== req.user.id.toString()
    ) {
      return res.status(401).json({ message: "Not authorized" });
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

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.seller.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user.id }).populate('listingInfo.listingId', 'author');
        const ordersToReturn = orders.map(order => {
            const orderObj = order.toObject();
            if (orderObj.listingInfo && orderObj.listingInfo.listingId) {
                orderObj.listingInfo.author = orderObj.listingInfo.listingId.author;
            }
            return orderObj;
        });
        res.json(ordersToReturn);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// @desc    Get logged in user sales
// @route   GET /api/orders/my-sales
// @access  Private
const getMySales = async (req, res) => {
    try {
        const sales = await Order.find({ seller: req.user.id }).populate('listingInfo.listingId', 'author');
        const salesToReturn = sales.map(sale => {
            const saleObj = sale.toObject();
            if (saleObj.listingInfo && saleObj.listingInfo.listingId) {
                saleObj.listingInfo.author = saleObj.listingInfo.listingId.author;
            }
            return saleObj;
        });
        res.json(salesToReturn);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
  getMySales,
};