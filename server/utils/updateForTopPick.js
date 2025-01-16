const Order = require("../models/Order");
const Product = require("../models/Product");

const updateForTopPick = async () => {
    const stats = await Order.aggregate([
      { $match: { order_status: "success" } },
      { $unwind: "$item" },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ["$item.price", "$item.quantity"] },
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
    const productStats = {};
    stats[0].productStats.forEach(({ title, quantity, revenue }) => {
      if (!productStats[title]) {
        productStats[title] = { totalQuantity: 0, totalRevenue: 0 };
      }
      productStats[title].totalQuantity += quantity;
      productStats[title].totalRevenue += revenue;
    });

    const findMostFrequent = (map, key) => {
      let maxValue = -Infinity;
      let mostFrequent = [];

      for (const stat in map) {
        if (map[stat][key] > maxValue) {
          maxValue = map[stat][key];
          mostFrequent = [stat];
        } else if (map[stat][key] === maxValue) {
          mostFrequent.push(stat);
        }
      }

      return mostFrequent;
    };

    const productFrequency = findMostFrequent(
      productStats,
      "totalQuantity"
    );

    const updateTopPickStatus = async (product) => {
      const prod = await Product.findOne({ title: product });
      if (prod && productStats[product].totalQuantity > 10 && !prod.isTopPick) {
        prod.isTopPick = true;
        await prod.save();
      }
    };
    await Promise.all(
      productFrequency.map(updateTopPickStatus)
    );
  }
module.exports = updateForTopPick;
