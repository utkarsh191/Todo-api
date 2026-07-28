const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

exports.login = async(req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
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