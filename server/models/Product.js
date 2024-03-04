const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      minlength: 1,
      maxlength: 20,
    },
    desc: {
      type: String,
    },
    key: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      publicId: {
        type: String,
        // required:true,
      },
      url: {
        type: String,
        // required:true,
      },
    },

    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    isTopPick: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
