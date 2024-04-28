const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUpController = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    if (!name) {
      return res.status(400).send("name is required");
    }
    if (!email) {
      return res.status(400).send("email is required");
    }
    if (!password) {
      return res.status(400).send("password is required");
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User is alreaddy registered");
    }
    const users = await User.find();
    const hashedPassword = await bcrypt.hash(password, 10);
    if (users.length === 0) {
      await User.create({
        email,
        name,
        password: hashedPassword,
        isAdmin: true,
      });
    } else {
      await User.create({
        email,
        name,
        password: hashedPassword,
        isAdmin: true,
      });
    }
    const user = await User.findOne({ email });

    const accessToken = generateAccessToken({
      _id: user._id,
    });
    const refreshToken = generateRefreshToken({
      _id: user._id,
    });
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res.status(200).send({ accessToken, user });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send("email is required");
    }
    if (!password) {
      return res.status(400).send("password is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not registered");
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(403).send("Incorrect Password");
    }

    const accessToken = generateAccessToken({
      _id: user._id,
    });
    const refreshToken = generateRefreshToken({
      _id: user._id,
    });
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res.status(200).send({ accessToken, user });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.status(200).send("User logged Out");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    return token;
  } catch (error) {
    return res.status(500, error.message);
  }
};
const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    return res.status(500, error.message);
  }
};

module.exports = {
  signUpController,
  loginController,
  logoutController,
};
