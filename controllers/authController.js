const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const generateOTP = require("../utils/generateOTP");
const sendMail = require("../utils/sendMail");
const otpTemplate = require("../templates/otpTemplate");

exports.signup = async (req, res) => {
  const { name, email, password} = req.body;

  const existingUser = await User.findOne({ email });

  if(existingUser) {
    return res.status(400).json({  // 400 menas client sent invalid data.
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();  

  const otp = generateOTP();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.create({
   email,
   otp,
   expiresAt,
  });

  await sendMail(
  email,
  "Email Verification OTP",
  otpTemplate(otp)
);

  return res.status(201).json({     //A new resource (the user) was successfully created.
    message: "user registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email:user.email,
      role: user.role,
    },
    });
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const otpRecord = await Otp.findOne({ email, otp });

  if (!otpRecord) {
  return res.status(400).json({
    message: "Invalid OTP",
  });
}

if (otpRecord.expiresAt < new Date()) {
  return res.status(400).json({
    message: "OTP has expired",
  });
}

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  user.isVerified = true;
  await user.save();

  await Otp.deleteOne({ _id: otpRecord._id });

  return res.status(200).json({
  success: true,
  message: "Email verified successfully",
});
};

exports.login = async(req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (!user.isVerified) {
  return res.status(400).json({
    message: "Please verify your email first",
  });
}


  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  } 

  const token = jwt.sign(
    {id: user._id},
    process.env.JWT_SECRET,
    {expiresIn: "1d"}
  );

  return res.status(200).json({
    message: "login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};