import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  additionalPrice: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 0,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Sẵn", "Hết"],
      default: "Sẵn",
    },
    variants: {
      type: [variantSchema],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
