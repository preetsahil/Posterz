const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { error } = require("../utils/responseWrapper");
const requireUser = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.send(error(401, "Authorization header is required"));
  }

  const accessToken = req.headers.authorization.split(" ")[1];
  //validate the access token
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req._id = decoded._id;
    //after user is deleted it might be the case access token is still valid that's why their is call needed to
    //database if user actually exist or not
    const user = await User.findById(req._id);
    if (!user) {
      return res.send(error(404, "User not found"));
    }
    next();
  } catch (e) {
    console.log(e);
    return res.send(error(401, "Invalid access key"));
  }
};
module.exports = requireUser;
