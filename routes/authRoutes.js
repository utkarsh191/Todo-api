const express = require("express");
const router = express.Router();

const { createTodo } = require("../controllers/todoController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createTodo);

module.exports = router;