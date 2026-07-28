const errorHandler = (err, req, res, next) => {
  //File type validation error
  if(err.message === "Only JPG, JPEG and PNG files are allowed.") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  //baaki sab errors

  res.status(500).json({
    success: false,
    message: err.message || "internal server error",
  });
};

module.exports = errorHandler;