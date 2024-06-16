const User = require("../models/User");
const axios = require("axios");
const otpGenerator = require("otp-generator");
const OTP = require("../models/Otp");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
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

const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("user is not registered");
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    await OTP.create({
      email,
      otp,
    });

    mailSender(
      email,
      "Request Admin Access",
      `<h1>Please confirm your OTP</h1>
       <p>Here is your OTP code: ${otp}</p>`
    );

    return res
      .status(200)
      .send({ message: "OTP sent Successfully, Check your gmail", otp });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const verifyOtpController = async (req, res) => {
  try {
    const { otp, email, password } = req.body;
    const user = await User.findOne({ email });
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).send("The OTP is not valid, try again");
    }
    if (user.isAdmin) {
      return res.status(409).send("you already have Admin Access");
    }
    user.isAdmin = true;
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    return res
      .status(200)
      .send({
        message: "OTP Verified And Password created for Admin Access",
        user,
      });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  verifyController,
  sendOtpController,
  verifyOtpController,
};
