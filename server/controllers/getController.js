const Category = require("../models/Category");
const Product = require("../models/Product");

const productController = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("categories")
      .populate("createdBy")
      .populate("lastModifyBy");
    return res.status(200).send({ products });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
const categoryController = async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate("products")
      .populate("createdBy")
      .populate("lastModifyBy");
    return res.status(200).send({ categories });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  productController,
  categoryController,
};
