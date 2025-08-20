import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/enviroments.js";

// Middleware xác thực JWT
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Kiểm tra header Authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập hoặc token không hợp lệ" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
  _id: decoded.userId, // Phải khớp với lúc tạo token
  email: decoded.email,
  role: decoded.role,
};// Gắn thông tin người dùng vào request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// Middleware kiểm tra quyền admin
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Truy cập bị từ chối: Chỉ admin mới được phép" });
  }
  next();
};
