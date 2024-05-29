const nodemailer = require("nodemailer");
const customError = require("../errors/customError");

const sendMail = async (subject, message, send_to, sent_from, reply_to) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_EMAIL_ACCOUNT,
      pass: process.env.GOOGLE_EMAIL_PASS,
    },
  });

  let mail = {
    from: sent_from || "AURA Social Media Team",
    to: send_to,
    subject: subject,
    html: message,
    replyTo: reply_to, // if reply is being sent
  };

  return transporter
    .sendMail(mail)
    .then(() => true)
    .catch((err) => {
      throw new customError(500, err.message || "error sending mail");
    });
};

module.exports = sendMail;
