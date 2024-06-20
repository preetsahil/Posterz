const User = require("../models/User");
const axios = require("axios");

const isUser = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.status(401).send("Authorization header is required");
  }

  const accessToken = req.headers.authorization.split(" ")[1];
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
    if (user) {
      req._id = user._id;
    }
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid Oauth Token" });
  }
};

module.exports = isUser;
