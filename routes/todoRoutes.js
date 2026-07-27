const express = require("express");
const router = express.Router();

const {
  createTodo,
  getAllTodos,
  getSingleTodo,
  updateTodo,
  delete: deleteTodo,
} = require("../controllers/todoController");

const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const {
  createTodoSchema,
  updateTodoSchema,
} = require("../validation/todoValidation");


router.post("/", authMiddleware, validate(createTodoSchema), createTodo);
router.get("/", authMiddleware, getAllTodos);
router.get("/:id", authMiddleware, getSingleTodo);
router.put("/:id", authMiddleware,validate(updateTodoSchema), updateTodo);
router.delete("/:id", authMiddleware, deleteTodo);

module.exports = router;