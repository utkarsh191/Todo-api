const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const generateOTP = require("../utils/generateOTP");
const sendMail = require("../utils/sendMail");
const otpTemplate = require("../templates/otpTemplate");
const RefreshToken = require("../models/RefreshToken");
const generateTokens = require("../utils/generateTokens");


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

exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Check if email is already verified
  if (user.isVerified) {
    return res.status(400).json({
      message: "Email is already verified",
    });
  }

  // Delete old OTP if it exists
  await Otp.deleteMany({ email });

  // Generate new OTP
  const otp = generateOTP();

  // Set expiry time (5 minutes)
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Save new OTP
  await Otp.create({
    email,
    otp,
    expiresAt,
  });

  // Send OTP email
  await sendMail(
    email,
    "Email Verification OTP",
    otpTemplate(otp)
  );

  return res.status(200).json({
    success: true,
    message: "OTP sent successfully",
  });
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Delete old OTP
  await Otp.deleteMany({ email });

  // Generate new OTP
  const otp = generateOTP();

  // OTP expiry (5 minutes)
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Save OTP
  await Otp.create({
    email,
    otp,
    expiresAt,
  });

  // Send OTP email
  await sendMail(
    email,
    "Reset Password OTP",
    otpTemplate(otp)
  );

  return res.status(200).json({
    success: true,
    message: "Password reset OTP sent successfully",
  });
};

exports.verifyForgotOTP = async (req, res) => {
  const { email, otp } = req.body;

  // Find OTP
  const otpRecord = await Otp.findOne({ email, otp });

  if (!otpRecord) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  // Check Expiry
  if (otpRecord.expiresAt < new Date()) {
    return res.status(400).json({
      message: "OTP has expired",
    });
  }

  return res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  // Find User
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Hash New Password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update Password
  user.password = hashedPassword;

  await user.save();

  // Delete OTP
  await Otp.deleteMany({ email });

  return res.status(200).json({
    success: true,
    message: "Password reset successfully",
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

const { accessToken, refreshToken } = generateTokens(user);

// Save Refresh Token in Database
await RefreshToken.create({
  user: user._id,
  token: refreshToken,
});

return res.status(200).json({
  success: true,
  message: "Login successful",
  accessToken,
  refreshToken,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
});
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Find logged-in user
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Check old password
  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    return res.status(400).json({
      message: "Old password is incorrect",
    });
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  user.password = hashedPassword;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};