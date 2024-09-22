const mongoose = require('mongoose');

// Define the TodoSchema
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TODO_User', // Reference the User model
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  }
});

// Create a Todo model based on the schema
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
