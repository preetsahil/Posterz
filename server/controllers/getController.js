const Category = require("../models/Category");
const Product = require("../models/Product");

const productController = async (req, res) => {
  try {
    const { isTopPick, category, sort, id } = req.query;
    if (category && sort === "price") {
      const products = await Product.find({ categories: category })
        .sort({ price: 1 })
        .populate("categories");
      return res.status(200).send({ products });
    }
    if (category && sort === "createdAt") {
      const products = await Product.find({ categories: category })
        .sort({ createdAt: -1 })
        .populate("categories");
      return res.status(200).send({ products });
    }
    if (sort === "price") {
      const products = await Product.find({})
        .sort({ price: 1 })
        .populate("categories");
      return res.status(200).send({ products });
    }
    if (sort === "createdAt") {
      const products = await Product.find({})
        .sort({ createdAt: -1 })
        .populate("categories");
      return res.status(200).send({ products });
    }
    if (isTopPick) {
      const products = await Product.find({ isTopPick: true }).populate(
        "categories"
      );
      return res.status(200).send({ products });
    }
    if (id) {
      const product = await Product.find({ key: id }).populate("categories");
      return res.status(200).send({ product });
    }
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
