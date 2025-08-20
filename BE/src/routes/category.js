import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const categoryRoutes = Router();

// Category routes
categoryRoutes.get("/", getAllCategories);
categoryRoutes.get("/:id", getCategoryById);
categoryRoutes.post("/add", addCategory);
categoryRoutes.put("/:id", updateCategory);
categoryRoutes.delete("/:id", deleteCategory);

export default categoryRoutes;
