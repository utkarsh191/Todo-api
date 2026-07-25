const Todo = require("../models/todo");

exports.createTodo = async (req, res) => {
  try{
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
}catch (error) {
  return res.status(500).json({
    success: false,
    message: "Server Error",
  });
 }
};

exports.getAllTodos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const todos = await Todo.find({
      user: req.user.id,
    })
      .skip(skip)
      .limit(limit);

    const totalTodos = await Todo.countDocuments({
      user: req.user.id,
    });

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalTodos / limit),
      totalTodos,
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

exports.getSingleTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message:"Todo not found",
      });
    }

    return res.status(200).json({
      success: true,
      todo,
    });
  } catch (error) {
    return res.status(500).json({
    success: false,
    message: "Server Error",
    });
  }
};

const todo = await Todo.findOneAndUpdate({
_id: req.params.id,
user: req.user.id,
},
{
  title,
  description,
  completed,
},
{
  new: true,
}
);

exports.updateTodo = async(req,res) => {
  try{
    const { title, description, completed } = req.body;

    const todo = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        title,
        description,
        completed,
      },
      {
        new: true,
      }
    );

    if(!todo) {
      return res.status(404).json({
        success: false,
        message: " Todo not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo,
    });
  } catch (error) {
    return res.status(500).json({
    success: false,
    message: "Server Error",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if(!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: " Server Error",
    });
  }
};
