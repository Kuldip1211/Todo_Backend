const mongoose = require('mongoose');

// Define the UserSchema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  }
});

// Create a User model based on the schema
const User = mongoose.model('TODO_User', userSchema);

module.exports = User;
