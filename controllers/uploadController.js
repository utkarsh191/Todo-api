const cloudinary = require("../config/cloudinary");

exports.uploadImages = async (req, res) => {
  const result = await cloudinary.uploader.upload(req.files[0].path);
  console.log(result);
  res.status(200).json({
    success: true,
    message: "Files uploaded successfully",
    imageUrl: result.secure_url,
    publicId: result.public_id,
  });
};

exports.uploadProfileAndCover = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile and Cover uploaded successfully",
    files: req.files,
  });
};

exports.registerUser = (req, res) => {
  res.status(200).json({
    success: true,
    message: "User registered successfully",
    data: req.body,
  });
};

exports.uploadAnyFiles = (req, res) => {
  res.status(200).json({
    success:true,
    message: "Files uploaded successfully",
    files: req.files,
  });
}