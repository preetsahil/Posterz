const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Category = require("../models/Category");
const Product = require("../models/Product");
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send("email is required");
    }
    if (!password) {
      return res.status(400).send("password is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User is not registered");
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(403).send("Incorrect Password");
    }

    if (user.isAdmin) {
      const adminToken = jwt.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN_SECRET_ADMIN,
        {
          expiresIn: "1d",
        }
      );
      return res.status(200).send({ adminToken, user });
    } else {
      return res
        .status(404)
        .send("Access Denied! Request for the Admin Permissions");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
const addCategoryController = async (req, res) => {
  try {
    const { title, key, image } = req.body;

    if (!title) {
      return res.status(400).send("title is required");
    }
    if (!key) {
      return res.status(400).send("key is required");
    }
    // if (!image) {
    //   return res.status(400).send("image is required");
    // }

    const category = await Category.create({
      title,
      key,
      // image:{
      //   publicId:
      //   url:
      // }
    });

    return res.status(200).send(category);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const addProductController = async (req, res) => {
  try {
    const { title, key, desc, price, image, category, isTopPick } = req.body;
    if (!title) {
      return res.status(400).send("title is required");
    }
    if (!key) {
      return res.status(400).send("key is required");
    }
    // if (!image) {
    //   return res.status(400).send("image is required");
    // }
    if (!price) {
      return res.status(400).send("price not set");
    }
    if (!category) {
      return res.status(400).send("category not selected ");
    }

    const ctgy = await Category.findOne({ title: category });

    if (!ctgy) {
      return res
        .status(400)
        .send(
          "Their is no such category,please create category for this first! "
        );
    }

    const ctgyId = ctgy._id;

    const product = await Product.create({
      title,
      key,
      desc,
      price,
      isTopPick,
      // image:{
      //   publicId:
      //   url:
      // }
      category: ctgyId,
    });

    ctgy.product.push(product._id);
    await ctgy.save();

    return res.status(200).send({ product });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteCategoryController = async (req, res) => {
  try {
    const { key } = req.body;
    const ctgy = await Category.findOne({ key });
    if (!ctgy) {
      return res.status(400).send("this category doesn't exist");
    }

    await Product.deleteMany({ category: ctgy._id });
    await ctgy.deleteOne();

    return res.status(200).send("Category is deleted");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteProductController = async (req, res) => {
  try {
    const { key } = req.body;
    const prod = await Product.findOne({ key });
    if (!prod) {
      return res.status(400).send("this product doesn't exist");
    }

    await Category.updateMany({}, { $pull: { product: prod._id } });
    await prod.deleteOne();

    return res.status(200).send("Product is deleted");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
const updateCategoryController = async (req, res) => {
  try {
    return res.status(200).send("update category");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const updateProductController = async (req, res) => {
  try {
    return res.status(200).send("update products");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
module.exports = {
  loginController,
  addCategoryController,
  addProductController,
  deleteCategoryController,
  deleteProductController,
  updateCategoryController,
  updateProductController,
};
