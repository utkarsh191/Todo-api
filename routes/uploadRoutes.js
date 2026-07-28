const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
 
const { uploadImages } = require("../controllers/uploadController");

router.post("/", upload.array("image", 5), uploadImages);

module.exports = router;