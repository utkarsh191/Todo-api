const Todo = require("../models/todo");
const asyncHandler = require("../utils/asyncHandler");

exports.createTodo = asyncHandler(async (req, res) => {
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
});


exports.getAllTodos = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    //search
    const search = req.query.search || "";
    //filter
    const completed = req.query.completed;
    //sort
    const sort = req.query.sort || "-createdAt";

    //query object
    const query = {
      user: req.user.id,
      isDeleted: false,
    };

    if(search) {
      query.$or = [
        { title: { $regex: search, $options: "i"} },
        { description: { $regex: search,$options: "i"} },
      ];
    }

    if(completed !== undefined) {
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
});

exports.getSingleTodo = asyncHandler(async (req, res) => {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id,
      isDeleted: false,
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
});

exports.updateTodo = asyncHandler(async(req,res) => {
    const { title, description, completed } = req.body;

    const todo = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
        isDeleted: false,
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
});

exports.delete = asyncHandler(async (req, res) => {

    const todo = await Todo.findOne({
        _id: req.params.id,
        user: req.user.id,
        isDeleted: false,
    });

    if (!todo) {
        return res.status(404).json({
            success: false,
            message: "Todo not found",
        });
    }

    // Soft Delete
    todo.isDeleted = true;
    todo.deletedAt = new Date();

    await todo.save();

    return res.status(200).json({
        success: true,
        message: "Todo deleted successfully",
    });
});