import Product from "../models/Product.js";
import mongoose from "mongoose";

// Lấy tất cả sản phẩm
export const getAllProducts = async (req, res, next) => {
	try {
		const { search } = req.query;

		// Nếu có tham số search: lọc theo tên (chứa, không phân biệt hoa thường)
		let query = {};
		if (typeof search === "string" && search.trim() !== "") {
			query = {
				name: { $regex: search.trim(), $options: "i" }
			};
		}

		const products = await Product.find(query);
		res.json({ success: true, data: products });
	} catch (error) {
		next(error);
	}
};

// Lấy sản phẩm theo ID
export const getProductById = async (req, res, next) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({
				success: false, message: "Không tìm thấy sản phẩm"
			});
		}
		res.json({ success: true, data: product });
	} catch (error) {
		next(error);
	}
};

// Thêm sản phẩm mới
export const addProduct = async (req, res, next) => {
	try {
		const { name, price, category, imageUrl, stock } = req.body;
		
		if (!name || !price || !category || !imageUrl) {
			return res.status(400).json({
				success: false,
				message: "Vui lòng điền đầy đủ thông tin: tên, giá, danh mục, và hình ảnh"
			});
		}

		const productData = {
			name,
			price: Number(price),
			category,
			imageUrl,
			images: req.body.images || [],
			stock: stock ? Number(stock) : 0,
			description: req.body.description || '',
			status: req.body.status || 'Sẵn',
			discountPercent: req.body.discountPercent || 0,
			rating: req.body.rating || 0,
			reviews: req.body.reviews || [],
			publisher: req.body.publisher || '',
			releaseDate: req.body.releaseDate || null,
			language: req.body.language || '',
			pages: req.body.pages || null,
			age: req.body.age || '',
			dimensions: req.body.dimensions || '',
			variants: req.body.variants || []
		};

		const newProduct = new Product(productData);
		await newProduct.save();

		res.status(201).json({
			success: true,
			message: "Thêm sản phẩm thành công",
			data: newProduct
		});
	} catch (error) {
		if (error.name === 'ValidationError') {
			return res.status(400).json({
				success: false,
				message: "Dữ liệu không hợp lệ",
				error: error.message
			});
		}
		next(error);
	}
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res, next) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({ success: false, message: "ID không hợp lệ" });
		}
		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);
		if (!updatedProduct) {
			return res.status(404).json({
				success: false, message: "Không tìm thấy sản phẩm"
			});
		}
		res.json({ success: true, data: updatedProduct });
	} catch (error) {
		next(error);
	}
};

// Xoá sản phẩm
export const deleteProduct = async (req, res, next) => {
	try {
		const deletedProduct = await Product.findByIdAndDelete(req.params.id);
		if (!deletedProduct) {
			return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
		}
		res.json({
			success: true, message: "Xóa sản phẩm thành công"
		});
	} catch (error) {
		next(error);
	}
};
