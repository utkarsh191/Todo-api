const asyncHandler = require("../utilss/asyncHandler");
const sendMail = require("../utils/sendMail");

exports.sendTestMail = asyncHandler(async (req,res) =>{
  await sendMail(
    process.env,EMAIL,
    "Test EMAIL",
    "<h1>Email sent successfully from Node.js 🚀</h1>"
  );

  res.status(200).json({
    success: true,
    message: "Test email sent successfully",
    });
});