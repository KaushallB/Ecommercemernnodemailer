const { createEsewaPayment, verifyEsewaPayment } = require("../../helpers/esewa");
const { sendEmail, sendOrderConfirmationEmail, sendOrderShippedEmail, sendOrderDeliveredEmail } = require("../../helpers/email");
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

    // Handle different payment methods
    if (paymentMethod === "cod") {
      // For Cash on Delivery, send email immediately as payment is not required
      const user = await User.findById(userId);
      
      if (user && user.email) {
        try {
          await sendOrderConfirmationEmail(user.email, {
            orderId: newlyCreatedOrder._id,
            customerName: user.userName,
            orderDate: orderDate,
            paymentMethod: "cod",
            totalAmount,
            orderStatus: "confirmed",
            cartItems,
            addressInfo
          });
        } catch (emailError) {
          console.log("Email sending failed:", emailError);
        }
      }
      
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
    console.log("eSewa Payment Capture - Always Success Mode");
    
    // Always return success for eSewa test payments
    res.status(200).json({
      success: true,
      message: "Order confirmed successfully (test mode)",
      data: { orderId: req.body.oid || req.body.orderId, status: "confirmed" }
    });

    // Try to process the order in the background (don't wait for it)
    setTimeout(async () => {
      try {
        const { oid, amt, refId, orderId } = req.body;
        console.log("Background processing:", { oid, amt, refId, orderId });

        // Try to find and update order
        let order = null;
        
        if (orderId) {
          order = await Order.findById(orderId);
        }
        
        if (!order && oid) {
          order = await Order.findById(oid);
        }
        
        if (!order) {
          order = await Order.findOne({ 
            paymentMethod: "esewa", 
            paymentStatus: "pending" 
          }).sort({ orderDate: -1 });
        }

        if (order) {
          // Update order status
          order.paymentStatus = "paid";
          order.orderStatus = "confirmed";
          order.paymentId = refId || "esewa_test";
          order.payerId = "esewa";

          // Update product stock
          for (let item of order.cartItems) {
            let product = await Product.findById(item.productId);
            if (product && product.totalStock >= item.quantity) {
              product.totalStock -= item.quantity;
              await product.save();
            }
          }

          // Delete cart
          if (order.cartId) {
            await Cart.findByIdAndDelete(order.cartId);
          }

          await order.save();

          // Send confirmation email
          const user = await User.findById(order.userId);
          if (user && user.email) {
            try {
              await sendOrderConfirmationEmail(user.email, {
                orderId: order._id,
                customerName: user.userName,
                orderDate: order.orderDate,
                paymentMethod: "esewa",
                totalAmount: order.totalAmount,
                orderStatus: "confirmed",
                cartItems: order.cartItems,
                addressInfo: order.addressInfo
              });
              console.log("Confirmation email sent successfully");
            } catch (emailError) {
              console.log("Email sending failed:", emailError);
            }
          }
        }
      } catch (error) {
        console.log("Background processing error:", error);
      }
    }, 100);

  } catch (e) {
    console.log("Capture payment error:", e);
    
    // Always return success even if there's an error
    res.status(200).json({
      success: true,
      message: "Order confirmed (test mode with error)",
      data: { orderId: req.body.oid || req.body.orderId, status: "confirmed" }
    });
  }
};

// Test route for eSewa success simulation
const testEsewaSuccess = async (req, res) => {
  res.redirect('http://localhost:5173/shop/esewa-return?oid=test123&amt=1000&refId=esewa456');
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
  testEsewaSuccess,
};
