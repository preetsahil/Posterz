const mongoose = require("mongoose");

const connectdb = async (req, res) => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log(`database connected ${connect.connection.host}`);
  } catch (error) {
    console.log(`ERROR ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectdb;
