import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  default: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Với tài khoản đăng ký bằng email/password
    password: {
      type: String,
      required: function () {
        // Nếu không có google/facebook/github thì mới yêu cầu password
        return !this.googleId && !this.facebookId && !this.githubId;
      },
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    address: [
      {
        type: addressSchema,
        required: false,
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
    },
    // OAuth fields
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    githubId: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Thêm virtual id
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Đảm bảo virtuals xuất hiện khi chuyển sang JSON
userSchema.set("toJSON", {
  virtuals: true,
});

const User = mongoose.model("User", userSchema);

export default User;
