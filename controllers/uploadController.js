const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

exports.uploadImages = asyncHandler(async (req, res) => {
  const result = await cloudinary.uploader.upload(req.files[0].path);

  fs.unlinkSync(req.files[0].path);

  res.status(200).json({
    success: true,
    message: "Files uploaded successfully",
    imageUrl: result.secure_url,
    publicId: result.public_id,
  });
});

exports.uploadProfileAndCover = asyncHandler(async(req, res) => {

  const profileResult = await cloudinary.uploader.upload(
    req.files.profile[0].path
  );

  const coverResult = await cloudinary.uploader.upload(
    req.files.cover[0].path
  );

  fs.unlinkSync(req.files.profile[0].path);
  fs.unlinkSync(req.files.cover[0].path);

  res.status(200).json({
    success: true,
    message: "Profile and Cover uploaded successfully",
    
    profileImage: profileResult.secure_url,
    profilePublicId: profileResult.public_id,

    coverImage: coverResult.secure_url,
    coverPublicId: coverResult.public_id,

  });
});

exports.registerUser = asyncHandler(async (req, res) => {

  const user = await User.create(req.body);

  res.status(200).json({
    success: true,
    message: "User registered successfully",
    user,
  });
});

exports.uploadAnyFiles = asyncHandler(async (req, res) => {

  const uploadedFiles = [];

  for (const file of req.files) {

    const result = await cloudinary.uploader.upload(file.path);

    uploadedFiles.push({
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

    fs.unlinkSync(file.path);
  }

  res.status(200).json({
    success: true,
    message: "Files uploaded successfully",
    files: uploadedFiles,
  });

});