exports.uploadImage = (req, res) => {
  res.json({
    message: "File uploaded successfully",
    file: req.file,
  });
};