const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  //File type validation error
  if(err.message === "Only JPG, JPEG and PNG files are allowed.") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

    // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size should not exceed 2 MB.",
      });
    }
  }

  //baaki sab errors

  res.status(500).json({
    success: false,
    message: err.message || "internal server error",
  });
};

module.exports = errorHandler;