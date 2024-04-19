const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Category = require("../models/Category");
const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;

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
    const { title, key, image, selectedProd } = req.body;

    if (!title) {
      return res.status(400).send("title is required");
    }
    if (!key) {
      return res.status(400).send("key is required");
    }

    if (!image) {
      return res.status(400).send("image is required");
    }

    //upload image
    let cloudImg;
    if (image) {
      cloudImg = await cloudinary.uploader.upload(image, {
        folder: "category",
      });
    }

    const category = await Category.create({
      title,
      key,
      image: {
        publicId: cloudImg?.public_id,
        url: cloudImg?.url,
      },
    });
    if (selectedProd) {
      selectedProd.map(async (prod) => {
        const product = await Product.findOne({ _id: prod._id });
        if (!product) {
          return res.status(400).send("Product not found: " + product);
        }
        product.categories.push(category._id);
        category.products.push(product._id);
        await product.save();
        await category.save();
      });
    }

    return res.status(200).send(category);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const addProductController = async (req, res) => {
  try {
    const { title, key, desc, price, image, categories, isTopPick } = req.body;
    if (!title) {
      return res.status(400).send("title is required");
    }
    if (!key) {
      return res.status(400).send("key is required");
    }

    if (!price) {
      return res.status(400).send("price not set");
    }

    let cloudImg;
    if (image) {
      cloudImg = await cloudinary.uploader.upload(image, {
        folder: "product",
      });
    }
    const product = await Product.create({
      title,
      key,
      desc,
      price,
      isTopPick,
      image: {
        publicId: cloudImg?.public_id,
        url: cloudImg?.url,
      },
    });

    if (categories) {
      categories.map(async (cat) => {
        const category = await Category.findOne({ _id: cat._id });
        if (!category) {
          return res.status(400).send("Category not found: " + category);
        }
        category.products.push(product._id);
        product.categories.push(category._id);
        await category.save();
        await product.save();
      });
    }

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
    const { id, title, key, image, products } = req.body;
    const ctgy = await Category.findOne({ _id: id });
    if (!ctgy) {
      return res.status(400).send("this category doesn't exist");
    }
    ctgy.title = title;
    ctgy.key = key;
    //upload image
    //  ctgy.image.publicId=
    //  ctgy.image.url=
    if (products.length < ctgy.product.length) {
      let productToRemove = [];

      productToRemove = ctgy.product.filter(
        (item) => !products.includes(item._id.toString())
      );
      await Product.updateMany(
        {
          _id: { $in: productToRemove },
        },
        { $pull: { category: ctgy._id } }
      );
      ctgy.product = products;

      await ctgy.save();
      return res.status(200).send({ ctgy });
    }

    if (ctgy.product && ctgy.product.length > 0) {
      let productToAdd = [];

      productToAdd = products.filter(
        (item) => !ctgy.product.map((cat) => cat._id.toString()).includes(item)
      );
      await Product.updateMany(
        {
          _id: { $in: productToAdd },
        },
        { $addToSet: { category: ctgy._id } }
      );
      ctgy.product = products;
    } else {
      await Product.updateMany(
        {
          _id: { $in: products },
        },
        { $addToSet: { category: ctgy._id } }
      );
      ctgy.product = products;
    }
    await ctgy.save();
    return res.status(200).send({ ctgy });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const updateProductController = async (req, res) => {
  try {
    const { id, title, key, desc, price, image, isTopPick, categories } =
      req.body;

    const prod = await Product.findOne({ _id: id });
    prod.title = title;
    prod.key = key;
    prod.desc = desc;
    prod.price = price;
    //upload image
    //  prod.image.publicId=
    //  prod.image.url=
    prod.isTopPick = isTopPick;

    if (categories.length < prod.category.length) {
      let categoryToRemove = [];

      categoryToRemove = prod.category.filter(
        (item) => !categories.includes(item._id.toString())
      );
      await Category.updateMany(
        {
          _id: { $in: categoryToRemove },
        },
        { $pull: { product: prod._id } }
      );
      prod.category = categories;

      await prod.save();
      return res.status(200).send({ prod });
    }

    if (prod.category && prod.category.length > 0) {
      let categoryToAdd = [];

      categoryToAdd = categories.filter(
        (item) => !prod.category.map((cat) => cat._id.toString()).includes(item)
      );
      await Category.updateMany(
        {
          _id: { $in: categoryToAdd },
        },
        { $addToSet: { product: prod._id } }
      );
      prod.category = categories;
    } else {
      await Category.updateMany(
        {
          _id: { $in: categories },
        },
        { $addToSet: { product: prod._id } }
      );
      prod.category = categories;
    }

    await prod.save();

    return res.status(200).send({ prod });
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
