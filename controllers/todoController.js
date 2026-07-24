const Todo = require("../models/todo");

exports.createTodo = async (req, res) => {
  const { title, description } = req.body;

  const todo = new Todo({
    title,
    description,
    user: req.user.id,
  });

  await todo.save();

  return res.status(201).json({
    message: "Todo created successfully",
    todo,
  });
};

exports.getAllTodos = async(req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id});

    return res.status(200).json({
      success: true,
      count: todos.length,
      todos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false, 
      message: "Server Error",
    });
  }
};
