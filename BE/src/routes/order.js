import { Router } from "express";
import {
  getAllOrders,
  getOrderById,
  addOrder,
  updateOrderStatus,
  deleteOrder,
  getMyOrders,
} from "../controllers/orderController.js";
import { isAdmin, verifyToken } from "../middlewares/authMiddleware.js";

const orderRoutes = Router();

orderRoutes.use(verifyToken);

orderRoutes.get("/", isAdmin, getAllOrders);

orderRoutes.get("/my-orders", getMyOrders); 


orderRoutes.get("/:id", getOrderById);

orderRoutes.post("/", addOrder);

orderRoutes.put("/:id", updateOrderStatus);

orderRoutes.delete("/:id", deleteOrder);


export default orderRoutes;
