import Variant from "../models/variant.js"; // Đường dẫn đúng với file model



// Get all variants
export const getAllVariants = async (req, res, next) => {
  try {
    const variants = await Variant.find().populate('productId')
    res.status(200).json({
      success: true,
      data: variants
    });
  } catch (error) {
    next(error);
  }
};

//Addvariant
export const addVariant = async (req, res, next) => {
  try {
    const newVariant = new Variant(req.body);
    await newVariant.save();

    // Populate sau khi lưu
    const populatedVariant = await Variant.findById(newVariant._id).populate('productId');

    res.status(201).json({
      success: true,
      data: populatedVariant
    });
  } catch (error) {
    next(error);
  }
};

// Update variant
export const updateVariant = async (req, res, next) => {
    try {
        const updatedVariant = await Variant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!updateVariant) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy biến thể"
            })
        }
        res.status(200).json({
            success: true,
            data: updatedVariant
        })

    } catch (error) {
        next(error);
    }
}
// Delete variant
export const deleteVariant = async (req, res, next) => {
    try {
        const {id} = req.params
        const deletedVariant = await Variant.findByIdAndDelete(req.params.id);
        if (!deletedVariant) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy biến thể"
            });
        }
        res.status(200).json({
            success: true,
            message: "Biến thể đã được xóa thành công"
        });
    } catch (error) {
        next(error);
    }
}
export const getVariantById = async (req, res, next) => {
  try {
    const variant = await Variant.findById(req.params.id).populate('productId');
    if (!variant) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy biến thể' });
    }
    res.status(200).json({ success: true, data: variant });
  } catch (error) {
    next(error);
  }
};
