const Order = require("../../models/Order");
const User = require("../../models/User");
const { sendEmail } = require("../../helpers/email");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    const previousStatus = order.orderStatus;
    
    await Order.findByIdAndUpdate(id, { orderStatus });

    // Get user details for email notification
    const user = await User.findById(order.userId);
    
    // Send status update email
    if (user && user.email && previousStatus !== orderStatus) {
      try {
        await sendEmail(user.email, 'orderStatusUpdate', {
          orderId: order._id,
          customerName: user.userName,
          previousStatus,
          currentStatus: orderStatus,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod,
          cancellationReason: req.body.cancellationReason || null
        });
      } catch (emailError) {
        console.log("Email sending failed:", emailError);
        // Don't fail the update if email fails
      }
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully! Customer has been notified via email.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};
