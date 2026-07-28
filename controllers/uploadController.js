exports.uploadImages = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Files uploaded successfully",
    files: req.files,
  });
};