import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

// Đổi tên biến thành productRoutes để tránh trùng
const productRoutes = Router();

productRoutes.get("/", getAllProducts);
productRoutes.get("/:id", getProductById);
productRoutes.post("/add", addProduct);
productRoutes.put("/:id", updateProduct);
productRoutes.delete("/:id", deleteProduct);

export default productRoutes;
