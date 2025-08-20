import mongoose from "mongoose";

const { Schema } = mongoose;

const discountSchema = new Schema(
  {
    code:{
      type: String,
      require: true
    },
  
    productID: {
      type: String,
      required: true,
    },
    variantID: {
      type: String,
      required: true,
    },
   discount_type: {
      type: String,
      enum: ["%", "vnd"],
      default: "%",
    },
    discount_value: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    
    date:{
      type:[Date],
      required:true
    }
    
    
  },
  { timestamps: true }
);

const Discount = mongoose.model("Discount", discountSchema);

export default Discount;