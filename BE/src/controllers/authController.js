import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendMail.js";
import {
  RESET_PASSWORD_SECRET,
  RESET_PASSWORD_EXPIRES,
  FRONTEND_URL,
  JWT_SECRET,
} from "../configs/enviroments.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      fullname: user.fullname,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const authController = {
 // ...existing code...
register: async (req, res) => {
  const { fullname, email, password, phoneNumber, address , role} = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      role: role === "admin" ? "admin" : "user",
    });

    await newUser.save();

    // Tạo token cho user mới
    const token = generateToken(newUser);

    // Trả về thông tin user (không bao gồm password) và token, có trường id
    res.status(201).json({
      message: "Đăng ký thành công",
      token,
      user: newUser.toJSON(), // Đảm bảo có trường id
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
},

login: async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: user.toJSON(), // Đảm bảo có trường id
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
},
// ...existing code...

  oauthCallback: async (req, res) => {
    const user = req.user; // Passport đã gán user vào req.user
    if (!user) {
      return res.status(400).json({ message: "OAuth thất bại" });
    }

    const token = generateToken(user);
    res.redirect(`${FRONTEND_URL}/oauth-success?token=${token}`);
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Email không tồn tại" });
      }

      const token = jwt.sign({ id: user._id }, RESET_PASSWORD_SECRET, {
        expiresIn: RESET_PASSWORD_EXPIRES,
      });

      const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;

      await sendEmail(
        email,
        "Đặt lại mật khẩu",
        `Click vào link sau để đặt lại mật khẩu: ${resetLink}`
      );

      res.status(200).json({ message: "Link đặt lại mật khẩu đã được gửi qua email" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  },

  resetPassword: async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
      const decoded = jwt.verify(token, RESET_PASSWORD_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.status(200).json({ message: "Mật khẩu đã được cập nhật" });
    } catch (error) {
      res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
  },

  updateUser: async (req, res) => {
    const { id } = req.params;
    const { fullname, phoneNumber, address } = req.body;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { fullname, phoneNumber, address },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      res.json({ message: "Cập nhật thành công", user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;

    try {
      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      res.json({ message: "Xóa người dùng thành công" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  },

  getUserById: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findById(id).select("-password");

      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  },
};

export default authController;
