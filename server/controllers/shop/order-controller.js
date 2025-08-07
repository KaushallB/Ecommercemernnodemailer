const { createEsewaPayment, verifyEsewaPayment } = require("../../helpers/esewa");
const { sendEmail } = require("../../helpers/email");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const User = require("../../models/User");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    // Create new order first
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod: paymentMethod || "esewa",
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    });

    await newlyCreatedOrder.save();

    // Get user details for email
    const user = await User.findById(userId);

    // Send confirmation email
    if (user && user.email) {
      try {
        await sendEmail(user.email, 'orderConfirmation', {
          orderId: newlyCreatedOrder._id,
          customerName: user.userName,
          orderDate: orderDate,
          paymentMethod: paymentMethod || "esewa",
          totalAmount,
          orderStatus: "pending",
          cartItems,
          addressInfo
        });
      } catch (emailError) {
        console.log("Email sending failed:", emailError);
        // Don't fail the order if email fails
      }
    }

    // Handle different payment methods
    if (paymentMethod === "cod") {
      // For Cash on Delivery, no payment processing needed
      // Clear the cart after successful order creation
      await Cart.findByIdAndDelete(cartId);
      
      res.status(201).json({
        success: true,
        orderId: newlyCreatedOrder._id,
        message: "Order placed successfully with Cash on Delivery. You will receive an email confirmation shortly."
      });
    } else {
      // For eSewa payment
      const esewaPaymentData = createEsewaPayment({
        totalAmount,
        productCode: newlyCreatedOrder._id.toString(),
        productDeliveryCharge: 0,
        productServiceCharge: 0,
      });

      res.status(201).json({
        success: true,
        paymentData: esewaPaymentData.paymentData,
        esewaUrl: esewaPaymentData.esewaUrl,
        orderId: newlyCreatedOrder._id,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { oid, amt, refId, orderId } = req.body;

    // Verify eSewa payment
    const verificationResult = verifyEsewaPayment({ oid, amt, refId });

    if (!verificationResult.isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    let order = await Order.findById(orderId || oid);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = refId;
    order.payerId = "esewa";

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
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

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

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

const getOrderDetails = async (req, res) => {
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

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
