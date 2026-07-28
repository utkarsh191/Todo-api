exports.uploadImages = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Files uploaded successfully",
    files: req.files,
  });
};

exports.uploadProfileAndCover = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile and Cover uploaded successfully",
    files: req.files,
  });
};