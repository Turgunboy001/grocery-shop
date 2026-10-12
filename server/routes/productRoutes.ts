import express from "express";
import {
  createProduct,
  deleteProduct,
  getFlashDeals,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const productRoutes = express.Router();

productRoutes.get("/flash-deals", getFlashDeals);
productRoutes.get("/", getProducts);
productRoutes.get("/:id", getProduct);
productRoutes.post("/", auth, admin, createProduct);
productRoutes.put("/:id", auth, admin, updateProduct);
productRoutes.delete("/:id", auth, admin, deleteProduct);

export default productRoutes;
