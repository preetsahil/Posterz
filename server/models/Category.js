const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastModifyBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      unique: true,
      minlength: 1,
      maxlength: 20,
    },
    key: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      fileName: String,
      publicId: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
