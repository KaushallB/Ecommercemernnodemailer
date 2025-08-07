const express = require("express");

const {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} = require("../../controllers/admin/products-controller");

const { upload } = require("../../helpers/cloudinary");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload); // Remove auth for now
router.post("/add", addProduct); // Remove auth for now  
router.put("/edit/:id", editProduct); // Remove auth for now
router.delete("/delete/:id", deleteProduct); // Remove auth for now
router.get("/get", fetchAllProducts); // Remove auth for now to show products

module.exports = router;
