const Category = require("../models/Category");
const Product = require("../models/Product");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
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
    const categories = await Category.find({})      .populate("products")
      .populate("createdBy")
      .populate("lastModifyBy");
    return res.status(200).send({ categories });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
const orderController = async (req, res) => {
  const { amount, products } = req.body;
  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: Number(amount * 100),
    currency: "INR",
  };
  try {
    const order = await instance.orders.create(options);
    const o1 = await Order.create({ orderId: order.id });
    o1.order_status = "pending";
    await Promise.all(
      products.map(async (product) => {
        const prod = await Product.find({ key: product.key });
        o1.item.push({
          title: product.title,
          price: product.price,
          quantity: product.quantity,
          key: product.key,
          category: product.category,
        });
      })
    );
    await o1.save();
    return res.status(200).send({ order });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: "failed to create order" });
  }
};
const paymentController = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    res.redirect(" http://localhost:5173/payment/failed");
  }

  const order = await Order.findOne({ orderId: razorpay_order_id });
  order.order_status = "success";
  await order.save();

  res.redirect("http://localhost:5173/payment/success");
};

const searchController = async (req, res) => {
  try {
    const { query, categoryId } = req.body;
    let products;
    if (categoryId) {
      products = await Product.find({
        categories: categoryId,
        title: { $regex: query, $options: "i" },
      });
    } else {
      products = await Product.find({
        title: { $regex: query, $options: "i" },
      });
    }
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(200).send(error.message);
  }
};

module.exports = {
  productController,
  categoryController,
  orderController,
  paymentController,
  searchController,
};
