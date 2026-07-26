const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [3,"Title must be at least 3 characters long."],
    maxlength:[50, " Title cannot exceed 50 character"]
  },

  description: {
    type: String,
    required: true,
    default: "",
    maxlength:[500, " Title cannot exceed 500 character"]
  },

  completed: {
    type: Boolean,
    default: false,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required."]
  },
},
{
  timestamps: true,
}
);

module.exports = mongoose.model("Todo", todoSchema);