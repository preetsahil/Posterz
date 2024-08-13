const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "sahilcloud56@gmail.com",
    pass: "zivj xyjn csbz cpjg"
  },
  pool: true,
  rateLimit: true,
  maxConnections: 5,
  maxMessages: 10,
});

const mailSender = async (email, title, body) => {
  try {
    const info = await transporter.sendMail({
      from: '"Sahil 👻" <sahilcloud56@gmail.com>',
      to: email,
      subject: title,
      html: body,
    });
    return info;
  } catch (error) {
    throw new Error("Error in email server");
  }
};

module.exports = mailSender;
