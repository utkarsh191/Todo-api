const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
 
const { uploadImages , uploadProfileAndCover,  registerUser,} = require("../controllers/uploadController");



router.post("/", upload.array("image", 5), uploadImages);

router.post("/profile-cover", upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  uploadProfileAndCover
);

router.post(
  "/register",
  upload.none(),
  registerUser
);

module.exports = router;