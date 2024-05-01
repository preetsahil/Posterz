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
    const { title, key, image, selectedProd, fileName } = req.body;

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
    const createdBy = req._id;

    const category = await Category.create({
      createdBy,
      title,
      key,
      image: {
        fileName,
        publicId: cloudImg?.public_id,
        url: cloudImg?.url,
      },
      lastModifyBy: createdBy,
    });
    if (selectedProd) {
      await Promise.all(
        selectedProd.map(async (prod) => {
          try {
            const product = await Product.findOne({ _id: prod._id });
            if (!product) {
              console.log("product not found : " + prod);
              return;
            }
            await Product.updateOne(
              { _id: prod._id },
              { $set: { categories: category._id } }
            );
            await Category.updateOne(
              { _id: category._id },
              { $push: { products: prod._id } }
            );
          } catch (err) {
            console.log(err.message);
          }
        })
      );
    }

    return res.status(200).send(category);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const addProductController = async (req, res) => {
  try {
    const { title, key, desc, price, image, selectedCat, isTopPick, fileName } =
      req.body;
    if (!title) {
      return res.status(400).send("title is required");
    }
    if (!key) {
      return res.status(400).send("key is required");
    }
    if (!image) {
      return res.status(400).send("image is required");
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

    const createdBy = req._id;

    const product = await Product.create({
      createdBy,
      title,
      key,
      desc,
      price,
      isTopPick,
      image: {
        fileName,
        publicId: cloudImg?.public_id,
        url: cloudImg?.url,
      },
      lastModifyBy: createdBy,
    });

    if (selectedCat.length > 0) {
      const cat = selectedCat[0];
      try {
        const category = await Category.findOne({ _id: cat._id });
        if (!category) {
          console.log("Category not found: " + category);
          return;
        }
        await Category.updateOne(
          { _id: cat },
          { $push: { products: product._id } }
        );
        await Product.updateOne(
          { _id: product._id },
          { $set: { categories: cat._id } }
        );
      } catch (error) {}
    }

    return res.status(200).send(product);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteCategoryController = async (req, res) => {
  try {
    const id = req.params.id;
    const ctgy = await Category.findOne({ _id: id });
    if (!ctgy) {
      return res.status(400).send("this category doesn't exist");
    }
    await Product.updateMany(
      { categories: ctgy._id },
      { $set: { categories: null } }
    );
    await Category.deleteOne({ _id: id });

    return res.status(200).send({ id });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteProductController = async (req, res) => {
  try {
    const id = req.params.id;
    const prod = await Product.findOne({ _id: id });
    if (!prod) {
      return res.status(400).send("this product doesn't exist");
    }
    if (prod.categories) {
      await Category.updateOne(
        { _id: prod.categories },
        { $pull: { products: prod._id } }
      );
    }
    await prod.deleteOne();
    return res.status(200).send({ id });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
const updateCategoryController = async (req, res) => {
  try {
    const { id, title, key, fileName, image, selectedProd } = req.body;
    const ctgy = await Category.findOne({ _id: id });
    if (!ctgy) {
      return res.status(400).send("this category doesn't exist");
    }
    if (ctgy.title !== title) {
      ctgy.title = title;
    }
    if (ctgy.key !== key) {
      ctgy.key = key;
    }
    ctgy.lastModifyBy = req._id;

    //upload image
    let cloudImg;
    if (image) {
      cloudImg = await cloudinary.uploader.upload(image, {
        folder: "product",
      });
    }
    ctgy.image.publicId = cloudImg?.public_id;
    ctgy.image.url = cloudImg?.url;
    if (ctgy.image.fileName !== fileName) {
      ctgy.image.fileName = fileName;
    }

    if (ctgy.products.length > 0) {
      await Promise.all(
        ctgy.products.map(async (id) => {
          await Product.updateOne(
            { _id: id },
            {
              $set: { categories: null },
            }
          );
        })
      );
      ctgy.products = [];
    }
    await ctgy.save();

    if (selectedProd) {
      await Promise.all(
        selectedProd.map(async (prod) => {
          try {
            const product = await Product.findOne({ _id: prod._id });
            if (!product) {
              console.log("product not found : " + prod);
              return;
            }

            if (product.categories) {
              await Category.updateOne(
                { _id: product.categories },
                { $pull: { products: prod._id } }
              );
            }

            await Product.updateOne(
              { _id: prod._id },
              { $set: { categories: ctgy._id } }
            );

            await Category.updateOne(
              { _id: ctgy._id },
              { $push: { products: prod._id } }
            );
          } catch (err) {
            console.log(err.message);
          }
        })
      );
    }

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
