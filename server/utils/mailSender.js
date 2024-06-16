const nodemailer = require("nodemailer");

const mailSender = (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port:587,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    transporter.sendMail({
      from: '"Sahil 👻" <sahilcloud56@gmail.com>',
      to: email,
      subject: title,
      html: body,
    });
  } catch (error) {
    return res.status(500).send("Error in email server");
  }
};

module.exports = mailSender;
