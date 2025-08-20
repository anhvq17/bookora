import Discount from "../models/discount.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

// Lấy tất cả mã giảm giá
export const getAllDiscounts = async (_req, res, next) => {
  try {
    const discounts = await Discount.find();
    res.json({ success: true, data: discounts });
  } catch (error) {
    next(error);
  }
};

// Lấy mã giảm giá theo ID
export const getDiscountById = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "ID mã giảm giá không hợp lệ",
    });
  }

  try {
    const discount = await Discount.findById(id);
    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy mã giảm giá",
      });
    }

    res.json({ success: true, data: discount });
  } catch (error) {
    next(error);
  }
};

// Thêm mã giảm giá mới
export const addDiscount = async (req, res, next) => {
  try {
    const {
        code,
      productID,
      variantID,
      discount_type,
      discount_value,
      status,
      date
    } = req.body;

    // Kiểm tra trùng productID + variantID nếu cần
    const existingDiscount = await Discount.findOne({ code, productID, variantID });
    if (existingDiscount) {
      return res.status(400).json({
        success: false,
        message: "Khuyến mãi đã tồn tại cho sản phẩm và biến thể này",
      });
    }

    // (Tuỳ ý kiểm tra Product tồn tại nếu muốn)
    // const product = await Product.findById(productID);
    // if (!product) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Sản phẩm không tồn tại",
    //   });
    // }

    const newDiscount = new Discount({
        code,
      productID,
      variantID,
      discount_type,
      discount_value,
      status,
      date,
    });

    await newDiscount.save();

    res.status(201).json({
      success: true,
      data: newDiscount,
    });
  } catch (error) {
    next(error);
  }
};


// Cập nhật mã giảm giá
// Cập nhật mã giảm giá
export const updateDiscount = async (req, res, next) => {
  try {
    const {
      code,
      productID,
      variantID,
      discount_type,
      discount_value,
      status,
      date
    } = req.body;

    const { id } = req.params;

    // Kiểm tra trùng (trừ chính bản ghi đang cập nhật)
    const existingDiscount = await Discount.findOne({
      code,
      productID,
      variantID,
      _id: { $ne: id } // exclude current record
    });

    if (existingDiscount) {
      return res.status(400).json({
        success: false,
        message: "Khuyến mãi đã tồn tại cho sản phẩm và biến thể này",
      });
    }

    // Cập nhật
    const updatedDiscount = await Discount.findByIdAndUpdate(
      id,
      {
        code,
        productID,
        variantID,
        discount_type,
        discount_value,
        status,
        date
      },
      { new: true }
    );

    if (!updatedDiscount) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy mã khuyến mãi",
      });
    }

    res.json({
      success: true,
      data: updatedDiscount,
    });
  } catch (error) {
    next(error);
  }
};


// Xóa mã giảm giá
export const deleteDiscount = async (req, res, next) => {
  try {
    const deletedDiscount = await Discount.findByIdAndDelete(req.params.id);
    if (!deletedDiscount) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy mã khuyến mại",
      });
    }

    res.json({
      success: true,
      message: "Xóa mã giảm giá thành công",
    });
  } catch (error) {
    next(error);
  }
};
