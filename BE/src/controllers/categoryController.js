import Category from '../models/Category.js';

// Get all categories
export const getAllCategories = async (_req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      message: "Lấy danh sách danh mục thành công",
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// Get category by ID
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục"
      });
    }
    res.status(200).json({
      success: true,
      message: "Lấy chi tiết danh mục thành công",
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// Add category
export const addCategory = async (req, res, next) => {
  try {
    const existingCategory = await Category.findOne({ name: req.body.name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Tên danh mục đã tồn tại"
      });
    }

    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json({
      success: true,
      message: "Danh mục đã được thêm thành công",
      data: newCategory
    });
  } catch (error) {
    next(error);
  }
};

// Update category
export const updateCategory = async (req, res, next) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục"
      });
    }

    res.status(200).json({
      success: true,
      message: "Danh mục đã được cập nhật thành công",
      data: updatedCategory
    });
  } catch (error) {
    next(error);
  }
};

// Delete category
export const deleteCategory = async (req, res, next) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục"
      });
    }
    res.status(200).json({
      success: true,
      message: "Danh mục đã được xóa"
    });
  } catch (error) {
    next(error);
  }
};
