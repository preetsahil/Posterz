const User = require("../models/User");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;

const verifyController = async (req, res) => {
  try {
    const { userDetails } = req.body;

    if (userDetails.length !== 0) {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userDetails.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${userDetails.access_token}`,
            Accept: "application/json",
          },
        }
      );
      const { email, name, picture } = response.data;

      const user = await User.findOne({ email });
      if (user) {
        return res.status(200).send({ user });
      }

      let cloudImg;
      if (picture) {
        cloudImg = await cloudinary.uploader.upload(picture, {
          folder: "user",
        });
      }
      const newUser = new User({
        email,
        name,
        avatar: {
          publicId: cloudImg?.public_id,
          url: cloudImg?.url,
        },
      });
      await newUser.save();
      return res.status(200).send({ user: newUser });
    } else {
      return res.status(400).send("Access token not found");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  verifyController,
};
