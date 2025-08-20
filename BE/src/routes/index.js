import { Router } from "express";

// Controllers
import authController from "../controllers/authController.js";

// Middlewares
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

// Route modules
import productRoutes from "./product.js";
import discountRoutes from "./discount.js";
import categoryRoutes from "./category.js";
import orderRoutes from "./order.js";
import variantRoutes from "./variant.js";
import cartRoutes from "./cart.js";

const routes = Router();

// API resource routes
routes.use("/products", productRoutes);
routes.use("/discounts", discountRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/orders", orderRoutes);
routes.use("/variants", variantRoutes);
routes.use('/cart', cartRoutes)

// Auth routes
routes.post("/register", authController.register);
routes.post("/login", authController.login);

// Forgot / Reset password
routes.post("/forgot-password", authController.forgotPassword);
routes.post("/reset-password/:token", authController.resetPassword);

// User routes (protected)
routes.get("/users", verifyToken, authController.getAllUsers);
routes.get("/users/:id", verifyToken, authController.getUserById);
routes.put("/users/:id", verifyToken, authController.updateUser);
routes.delete("/users/:id", verifyToken, isAdmin, authController.deleteUser);

export default routes;
