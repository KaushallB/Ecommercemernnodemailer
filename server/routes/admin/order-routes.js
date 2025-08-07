const express = require("express");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} = require("../../controllers/admin/order-controller");

const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.get("/get", getAllOrdersOfAllUsers); // Remove auth for now to show orders
router.get("/details/:id", getOrderDetailsForAdmin); // Remove auth for now to show order details
router.put("/update/:id", authMiddleware, updateOrderStatus);

module.exports = router;
