const jwt = require("jsonwebtoken");
const User = require("../models/User");
const axios = require("axios");
const isAdmin = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.status(401).send("Authorization header is required");
  }
  const accessToken = req.headers.authorization.split(" ")[1];

  const Oauth_refresh_token = req.cookies.refresh_token;
  const Jwt_refresh_token = req.cookies.jwt_refresh_token;

  if ((Oauth_refresh_token && Jwt_refresh_token) || Oauth_refresh_token) {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );
      const { email } = response.data;
      const user = await User.findOne({ email });
      if (!user.isAdmin) {
        return res
          .status(403)
          .send("Access Denied! Request for the Admin Permissions");
      }
      if (user) {
        req._id = user._id;
      }
      next();
    } catch (error) {
      return res.status(401).send({ message: "Invalid Oauth Token" });
    }
  } else if (Jwt_refresh_token) {
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET_ADMIN
      );
      const user = await User.findOne({ _id: decoded._id });
      if (!user.isAdmin) {
        return res
          .status(403)
          .send("Access Denied! Request for the Admin Permissions");
      }
      req._id = decoded._id;
      next();
    } catch (e) {
      return res.status(401).send({ message: "Invalid JWT Token" });
    }
  } else {
    return res.status(401).send({ message: "Both cookies expire" });
  }
};
module.exports = isAdmin;
