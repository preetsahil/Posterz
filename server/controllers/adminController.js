const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Order = require("../models/Order");
const cloudinary = require("cloudinary").v2;

function removeSpaces(str) {
  return str.replace(/\s/g, "");
}

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
      return res
        .status(404)
        .send("User is not registered, use google Login to register");
    }
    if (user.password) {
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        return res.status(401).send("Incorrect Password");
      }
    } else {
      return res
        .status(404)
        .send("Password Doesn't exist, need to generate password via website");
    }
    const { password: _, _id, ...userWithoutSensitiveInfo } = user._doc;

    if (user.isAdmin) {
      const adminToken = jwt.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN_SECRET_ADMIN,
        {
          expiresIn: "1d",
        }
      );
      const refreshToken = jwt.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN_SECRET_ADMIN,
        {
          expiresIn: "1y",
        }
      );
      res.cookie("jwt_refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 31536000000,
        sameSite: "None",
      });
      return res
        .status(200)
        .send({ adminToken, user: userWithoutSensitiveInfo });
    } else {
      return res
        .status(403)
        .send("Access Denied! Request for the Admin Permissions");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
const addCategoryController = async (req, res) => {
  try {
    let { title, key, image, selectedProd, fileName } = req.body;

    if (!title) {
      return res.status(400).send("title is required");
    }
    if (!key) {
      return res.status(400).send("key is required");
    }

    key = removeSpaces(key);

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
          } catch (err) {}
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
    let { title, key, desc, price, image, selectedCat, isTopPick, fileName } =
      req.body;
    if (!title) {
      return res.status(400).send("title is required");
    }
    if (!key) {
      return res.status(400).send("key is required");
    }
    key = removeSpaces(key);

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

    if (Object.keys(selectedCat).length !== 0) {
      try {
        const category = await Category.findOne({ _id: selectedCat._id });
        await Category.updateOne(
          { _id: selectedCat._id },
          { $push: { products: product._id } }
        );
        await Product.updateOne(
          { _id: product._id },
          { $set: { categories: selectedCat._id } }
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
      { $unset: { categories: "" } }
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
    let { id, title, key, fileName, image, selectedProd } = req.body;
    const ctgy = await Category.findOne({ _id: id });
    if (!ctgy) {
      return res.status(400).send("this category doesn't exist");
    }
    key = removeSpaces(key);

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
        folder: "category",
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
              $unset: { categories: "" },
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
    let {
      id,
      title,
      key,
      desc,
      price,
      image,
      selectedCat,
      isTopPick,
      fileName,
    } = req.body;

    const prod = await Product.findOne({ _id: id });
    if (!prod) {
      return res.status(400).send("this product doesn't exist");
    }
    key = removeSpaces(key);

    if (prod.title !== title) {
      prod.title = title;
    }
    if (prod.key !== key) {
      prod.key = key;
    }
    if (prod.desc !== desc) {
      prod.desc = desc;
    }
    if (prod.price !== price) {
      prod.price = price;
    }
    if (prod.isTopPick !== isTopPick) {
      prod.isTopPick = isTopPick;
    }
    prod.lastModifyBy = req._id;
    let cloudImg;
    if (image) {
      cloudImg = await cloudinary.uploader.upload(image, {
        folder: "product",
      });
    }
    prod.image.publicId = cloudImg?.public_id;
    prod.image.url = cloudImg?.url;
    if (prod.image.fileName !== fileName) {
      prod.image.fileName = fileName;
    }

    if (prod.categories) {
      await Category.updateOne(
        { _id: prod.categories },
        { $pull: { products: prod._id } }
      );
      await Product.updateOne(
        { _id: prod._id },
        { $unset: { categories: "" } }
      );
    }

    await prod.save();

    if (Object.keys(selectedCat).length !== 0) {
      try {
        const category = await Category.findOne({ _id: selectedCat._id });
        if (!category) {
          console.log("Category not found: " + category);
          return;
        }
        await Category.updateOne(
          { _id: selectedCat._id },
          { $push: { products: prod._id } }
        );
        await Product.updateOne(
          { _id: prod._id },
          { $set: { categories: selectedCat._id } }
        );
      } catch (error) {}
    }

    return res.status(200).send({ prod });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const statsController = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $match: { order_status: "success" } },
      { $unwind: "$item" },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ["$item.price", "$item.quantity"] },
          },
          categoryStats: {
            $push: {
              category: "$item.category",
              quantity: "$item.quantity",
              revenue: { $multiply: ["$item.price", "$item.quantity"] },
            },
          },
          productStats: {
            $push: {
              title: "$item.title",
              quantity: "$item.quantity",
              revenue: { $multiply: ["$item.price", "$item.quantity"] },
            },
          },
        },
      },
    ]);
    const totalOrders=await Order.aggregate([
      { $match: { order_status: "success" } },
      {
        $count: "totalOrdersCount"
      },
    ])

    const categoryStats = {};
    const productStats = {};

    stats[0].categoryStats.forEach(({ category, quantity, revenue }) => {
      if (!categoryStats[category]) {
        categoryStats[category] = { totalQuantity: 0, totalRevenue: 0 };
      }
      categoryStats[category].totalQuantity += quantity;
      categoryStats[category].totalRevenue += revenue;
    });
    stats[0].productStats.forEach(({ title, quantity, revenue }) => {
      if (!productStats[title]) {
        productStats[title] = { totalQuantity: 0, totalRevenue: 0 };
      }
      productStats[title].totalQuantity += quantity;
      productStats[title].totalRevenue += revenue;
    });

    const findMostAndLeastFrequent = (map, key) => {
      let maxValue = -Infinity,
        minValue = Infinity;
      let mostFrequent = [],
        leastFrequent = [];

      for (const stat in map) {
        if (map[stat][key] > maxValue) {
          maxValue = map[stat][key];
          mostFrequent = [stat];
        } else if (map[stat][key] === maxValue) {
          mostFrequent.push(stat);
        }

        if (map[stat][key] < minValue) {
          minValue = map[stat][key];
          leastFrequent = [stat];
        } else if (map[stat][key] === minValue) {
          leastFrequent.push(stat);
        }
      }

      return { mostFrequent, leastFrequent };
    };

    const categoryFrequency = findMostAndLeastFrequent(
      categoryStats,
      "totalQuantity"
    );
    const productFrequency = findMostAndLeastFrequent(
      productStats,
      "totalQuantity"
    );

    return res.status(200).send({
      totalOrders: totalOrders[0].totalOrdersCount,
      totalRevenue: stats[0].totalRevenue,
      categoryStats,
      productStats,
      mostFrequentCategories: categoryFrequency.mostFrequent,
      leastFrequentCategories: categoryFrequency.leastFrequent,
      mostFrequentProducts: productFrequency.mostFrequent,
      leastFrequentProducts: productFrequency.leastFrequent,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const userController = async (req, res) => {
  const id = req._id;
  const { name, isAdmin, currentPassword, password, confirmPassword } =
    req.body;
  try {
    const user = await User.findOne({ _id: id });
    if (!isAdmin) {
      user.isAdmin = false;
    }
    if (user.name !== name) {
      user.name = name;
    }
    if (
      currentPassword.length !== 0 &&
      confirmPassword.length !== 0 &&
      password.length !== 0
    ) {
      const matched = await bcrypt.compare(currentPassword, user.password);
      if (!matched) {
        return res.status(400).send("current password incorrect");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    await user.save();

    const { password: _, _id, ...userWithoutSensitiveInfo } = user._doc;
    return res.status(200).send({ user: userWithoutSensitiveInfo });
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
  statsController,
  userController,
};
