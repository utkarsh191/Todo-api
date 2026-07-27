const Joi = require("joi");

const createTodoSchema = Joi.object({
  title: Joi.string().min(3).max(50).required(),

  description: Joi.string().max(500).allow(""),

  completed: Joi.boolean(),
});

const updateTodoSchema = Joi.object({
  title: Joi.string().min(3).max(50),

  description: Joi.string().max(500).allow(""),

  completed: Joi.boolean(),
});

module.exports = {
  createTodoSchema,
  updateTodoSchema,
};