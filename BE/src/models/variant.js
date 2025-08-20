import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
    {
            productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", 
      required: true,
    },
    sku: {
  type: String,
  unique: true, // nhưng nên dùng với partial index nếu không bắt buộc
  sparse: true  // hoặc dùng `sparse` để tránh lỗi nếu thiếu
},


        format: {
            type: String,
            enum: ["Bìa cứng", "Bìa mềm"],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        stock_quantity: {
            type: Number,
            default: 0,
        },
        
    },
     {
    timestamps: true 
  }
);
const Variant = mongoose.model("Variant", variantSchema);
export default Variant;