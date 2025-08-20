import Cart from "../models/Cart.js"
import Product from "../models/Product.js"
import Variant from "../models/variant.js"

// Hàm tính tổng tiền và phí ship
export const calculateCartSummary = (cart) => {
  let totalAmount = 0
  for (const item of cart.items) {
    const productPrice = item.product_id?.price || 0
    const variantPrice = item.variant_id?.price || 0
    const price = productPrice + variantPrice
    totalAmount += price * item.quantity
  }
  const shippingFee = totalAmount >= 500_000 ? 0 : 30000
  return { totalAmount, shippingFee }
}

export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user_id: req.user._id })
      .populate('items.product_id', 'name imageUrl price stock')
      .populate('items.variant_id', 'format price stock_quantity')

    if (!cart) {
      return res.json({
        user_id: req.user._id,
        items: [],
        totalAmount: 0,
        shippingFee: 0
      })
    }

    const { totalAmount, shippingFee } = calculateCartSummary(cart)
    res.json({ ...cart.toObject(), totalAmount, shippingFee })
  } catch (err) {
    next(err)
  }
}

export const addToCart = async (req, res, next) => {
  try {
    const { product_id, variant_id, quantity } = req.body
    if (!product_id || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" })
    }

    // Kiểm tra tồn kho
    let availableStock = 0
    if (variant_id) {
      const variant = await Variant.findById(variant_id)
      if (!variant) return res.status(404).json({ message: "Không tìm thấy phiên bản sản phẩm" })
      availableStock = variant.stock_quantity
    } else {
      const product = await Product.findById(product_id)
      if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" })
      availableStock = product.stock
    }

    let cart = await Cart.findOne({ user_id: req.user._id })
    if (!cart) cart = new Cart({ user_id: req.user._id, items: [] })

    const existing = cart.items.find(item =>
      item.product_id.toString() === product_id &&
      (!variant_id || item.variant_id?.toString() === variant_id)
    )

    const totalQuantity = existing ? existing.quantity + quantity : quantity
    if (totalQuantity > availableStock) {
      return res.status(400).json({ message: `Vượt quá số lượng còn lại (${availableStock})` })
    }

    if (existing) {
      existing.quantity += quantity
    } else {
      cart.items.push({ product_id, variant_id, quantity })
    }

    await cart.save()
    await cart.populate('items.product_id items.variant_id')

    const { totalAmount, shippingFee } = calculateCartSummary(cart)
    res.status(200).json({ ...cart.toObject(), totalAmount, shippingFee })
  } catch (err) {
    next(err)
  }
}

export const updateQuantity = async (req, res, next) => {
  try {
    const { product_id, variant_id, quantity } = req.body
    if (!product_id || quantity == null || quantity < 0) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" })
    }

    let availableStock = 0
    if (variant_id) {
      const variant = await Variant.findById(variant_id)
      if (!variant) return res.status(404).json({ message: "Không tìm thấy phiên bản sản phẩm" })
      availableStock = variant.stock_quantity
    } else {
      const product = await Product.findById(product_id)
      if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" })
      availableStock = product.stock
    }

    const cart = await Cart.findOne({ user_id: req.user._id })
    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" })

    const item = cart.items.find(item =>
      item.product_id.toString() === product_id &&
      (!variant_id || item.variant_id?.toString() === variant_id)
    )

    if (!item) return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" })

    if (quantity > availableStock) {
      return res.status(400).json({ message: `Số lượng vượt quá tồn kho (${availableStock})` })
    }

    if (quantity === 0) {
      cart.items = cart.items.filter(i =>
        i.product_id.toString() !== product_id ||
        (variant_id && i.variant_id?.toString() !== variant_id)
      )
    } else {
      item.quantity = quantity
    }

    await cart.save()
    await cart.populate('items.product_id items.variant_id')

    const { totalAmount, shippingFee } = calculateCartSummary(cart)
    res.json({ ...cart.toObject(), totalAmount, shippingFee })
  } catch (err) {
    next(err)
  }
}

export const removeFromCart = async (req, res, next) => {
  try {
    const { product_id, variant_id } = req.body
    const cart = await Cart.findOne({ user_id: req.user._id })

    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' })

    cart.items = cart.items.filter(
      (item) =>
        item.product_id.toString() !== product_id ||
        (variant_id && item.variant_id?.toString() !== variant_id)
    )

    await cart.save()
    await cart.populate('items.product_id items.variant_id')

    const { totalAmount, shippingFee } = calculateCartSummary(cart)
    res.json({ ...cart.toObject(), totalAmount, shippingFee })
  } catch (err) {
    next(err)
  }
}

export const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user_id: req.user._id }, { items: [] })
    res.json({ message: 'Đã xóa toàn bộ giỏ hàng', totalAmount: 0, shippingFee: 0 })
  } catch (err) {
    next(err)
  }
}
export const checkCartStock = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user_id: req.user._id })
      .populate('items.product_id', 'name stock')
      .populate('items.variant_id', 'format stock_quantity');

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ valid: true, message: 'Giỏ hàng trống' });
    }

    const errors = [];

    for (const item of cart.items) {
      const productName = item.product_id?.name || 'Sản phẩm không tên';
      let stock = 0;

      if (item.variant_id) {
        stock = item.variant_id.stock_quantity;
        if (item.quantity > stock) {
          errors.push(`${productName} (${item.variant_id.format}) chỉ còn ${stock} sản phẩm`);
        }
      } else {
        stock = item.product_id.stock;
        if (item.quantity > stock) {
          errors.push(`${productName} chỉ còn ${stock} sản phẩm`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ valid: false, message: 'Một số sản phẩm không đủ hàng', errors });
    }

    res.json({ valid: true, message: 'Tất cả sản phẩm đều đủ hàng' });
  } catch (err) {
    next(err);
  }
};



