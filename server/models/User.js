const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/]
    },
    avatar: {
      publicId: String,
      url: String,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,          
  }
);

module.exports = mongoose.model("User", userSchema);
