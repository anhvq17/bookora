import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
    },
    name: String,
    image: String,
    quantity: {
      type: Number,
      required: true,
    },
    price: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      city: String,
      district: String,
      detail: String,
    },
    addressNote: String,
    shippingMethod: {
      type: String,
      enum: ["standard", "express"],
      default: "standard",
    },
    paymentMethod:{
type: String,
enum: ['cash', 'momo','vnpay'],
default: 'cash'
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered","completed", "cancelled", "refunded"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid"],
      default: "unpaid",
    },
    statusReason: {
      type: String,
      default: '',
    },
    note: String,
    items: [orderItemSchema],
    totalAmount: Number,
    shippingFee: {
      type: Number,
      default: 0,
    },
    discount_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discount",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
