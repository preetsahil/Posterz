const Order = require("../models/Order");
const Product = require("../models/Product");

const updateForTopPick = async () => {
  const orders = await Order.find({ order_status: "success" });
  let productStats = {};

  await Promise.all(
    orders.map(async (order) => {
      await Promise.all(
        order.item.map(async (product) => {
          const quantity = product.quantity;
          const price = product.price;
          const revenue = quantity * price;

          const prod = await Product.findOne({ title: product.title });
          if (prod) {
            if (!productStats[product.title]) {
              productStats[product.title] = {
                totalQuantity: 0,
                totalRevenue: 0,
              };
            }
            productStats[product.title].totalQuantity += quantity;
            productStats[product.title].totalRevenue += revenue;
          }
        })
      );
    })
  );

  const findMaxOrderedProduct = (stats, key) => {
    const max = Math.max(...Object.values(stats).map((stat) => stat[key]));
    return Object.keys(stats).filter(
      (category) => stats[category][key] === max
    );
  };

  const mostFrequentProducts = findMaxOrderedProduct(
    productStats,
    "totalQuantity"
  );

  await Promise.all(
    mostFrequentProducts.map(async (product) => {
      if (productStats[product].totalQuantity > 10) {
        const prod = await Product.findOne({ title: product });
        if (prod && !prod.isTopPick) {
          prod.isTopPick = true;
          await prod.save();
        }
      }
    })
  );
};

module.exports = updateForTopPick;
