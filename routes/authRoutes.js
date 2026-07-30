const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  verifyOTP,
  resendOTP,
} = require("../controllers/authController");

const validate = require("../middleware/validate");
const { signupSchema, loginSchema} = require("../validation/authValidation");

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

router.post("/signup", validate(signupSchema),signup);
router.post("/login", validate(loginSchema), login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

module.exports = router;