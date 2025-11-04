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

// QUAN TRỌNG: Route "/add" phải đặt TRƯỚC route "/:id" để tránh conflict
productRoutes.get("/", getAllProducts);
productRoutes.post("/add", addProduct);
productRoutes.get("/:id", getProductById);
productRoutes.put("/:id", updateProduct);
productRoutes.delete("/:id", deleteProduct);

export default productRoutes;
