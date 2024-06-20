const User = require("../models/User");
const axios = require("axios");
const otpGenerator = require("otp-generator");
const OTP = require("../models/Otp");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");

const getUserInfo = async (access_token) => {
  const response = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};

const OAuthController = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).send("Authorization code not found");
    }

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("client_id", process.env.GOOGLE_CLIENT_ID);
    params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET),
      params.append("redirect_uri", process.env.REDIRECT_URL);

    const response = await axios.post(
      `https://oauth2.googleapis.com/token`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.cookie("refresh_token", response.data.refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: 31536000000,
    });

    const userInfo = await getUserInfo(response.data.access_token);
    const { email, name, picture } = userInfo;

    const user = await User.findOne({ email }).select("-password");
    if (user) {
      return res
        .status(200)
        .send({ user, accessToken: response.data.access_token });
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
    return res
      .status(200)
      .send({ user: newUser, accessToken: response.data.access_token });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    return res
      .status(500)
      .send(error.response ? error.response.data : error.message);
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
      return res.status(400).send("OTP expired, try again");
    }
    if (user.isAdmin) {
      return res.status(409).send("you already have Admin Access");
    }
    user.isAdmin = true;
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).send({
      message: "OTP Verified And Password created for Admin Access",
      user,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: true,
    });
    return res.status(200).send("user logged out");
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

const refreshOAuthController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(401).send("refresh token is required");
    }

    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("client_id", process.env.GOOGLE_CLIENT_ID);
    params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET),
      params.append("refresh_token", refreshToken);
    const response = await axios.post(
      `https://oauth2.googleapis.com/token`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return res.status(200).send({ accessToken: response.data.access_token });
  } catch (error) {
    console.log(error.response.data);
    return res
      .status(error.response.status)
      .send({ error: error.response.data });
  }
};

const refreshJWTController = async (req, res) => {
  const refreshToken = req.cookies.jwt_refresh_token;
  if (!refreshToken) {
    return res.status(401).send("refresh token is required");
  }
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_ADMIN
    );
    const _id = decoded._id;
    const user = await User.findOne({ _id });

    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET_ADMIN,
      {
        expiresIn: "1d",
      }
    );
    console.log("refresh access token");
    return res.status(200).send({ accessToken });
  } catch (error) {
    return res.status(401).send("Refresh Token Invalid");
  }
};

module.exports = {
  OAuthController,
  logoutController,
  sendOtpController,
  verifyOtpController,
  refreshOAuthController,
  refreshJWTController,
};
