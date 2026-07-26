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

    //search
    const search = req.query.search || "";

    const completed = req.query.completed;

    const sort = req.query.sort || "-createdAt";

    //query object
    const query = {
      user: req.user.id,
    };

    if(search) {
      query.$or = [
        { title: { $regex: search, $options: "i"} },
        { description: { $regex: search,$options: "i"} },
      ];
    }

    if(completed != undefined) {
      query.completed = completed === "true";
    }


    const todos = await Todo.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalTodos = await Todo.countDocuments(query);

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
    console.log(error);

    return res.status(500).json({
    success: false,
    message: "Server Error",
    });
  }
};

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