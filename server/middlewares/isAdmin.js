const jwt = require("jsonwebtoken");
const User = require("../models/User");
const isAdmin = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.status(401).send("Authorization header is required");
  }

  const adminToken = req.headers.authorization.split(" ")[1];
  //validate the admin token
  try {
    const decoded = jwt.verify(
      adminToken,
      process.env.ACCESS_TOKEN_SECRET_ADMIN
    );
    req._id = decoded._id;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).send("Invalid admin key");
  }
};
module.exports = isAdmin;
