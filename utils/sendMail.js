const transporter = require("../config/mail");

const sendMail = async(to,subject, html) => {
  await transporter.sendMail({
    from:process.env.EMAIL,
    to,
    subject,
    html,
  });
};

module.exports = sendMail;