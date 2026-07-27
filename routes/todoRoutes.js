const express = require("express");
const router = express.Router();

const {
  createTodo,
  getAllTodos,
  getSingleTodo,
  updateTodo,
  delete: deleteTodo,
  restoreTodo,
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
// Restore Todo
router.patch("/restore/:id", authMiddleware, restoreTodo);

// Soft Delete Todo
router.delete("/:id", authMiddleware, deleteTodo);

module.exports = router;