const jwt = require("jsonwebtoken");
const Todo = require("../schema/Todoschema");
require('dotenv').config(); 

// Creation of todo
const createTodo = async (req, res) => {
  const cook = req.cookies;

  if (!cook || !cook.authToken) {
    return res.json({
      message: "First register and login",
    });
    
  }

  const decoded = jwt.verify(cook.authToken, process.env.JWTSECRET);

  // Access the ID from the decoded token
  const userId = decoded._id;

  const { title, description, completed } = req.body;

  const NewTodo = await Todo.create({
    title,
    description,
    completed,
    user: userId,
  });

  res.json(NewTodo);
};

const UpdataTodo = async (req, res) => {
  const cook = req.cookies;

  if (!cook || !cook.authToken) {
    return res.json({
      message: "First register and login",
    });
  }

  
  const decoded = jwt.verify(cook.authToken, process.env.JWTSECRET);

  // Access the ID from the decoded token
  const userId = decoded._id;

  const { id } = req.params; // Todo ID will be passed as a URL parameter
  const { title, description, completed } = req.body;

  const todo = await Todo.findOne({ _id: id });

  if (!todo) {
    return res.status(404).json({
      message: "Todo not found or you don't have permission to update it",
    });
  }

  const updatedTodo = await Todo.findByIdAndUpdate(
    id,
    { title, description, completed, user: userId },
    { new: true }
  ).lean(); // Use lean() to return a plain JS object

  res.json(updatedTodo);
};


// get all todos from user
const GetallTodos = async(req,res)=>{
  const cook = req.cookies;

  if (!cook || !cook.authToken) {
    return res.json({
      message: "First register and login",
    });
  }

  
  const decoded = jwt.verify(cook.authToken, `${process.env.JWTSECRET}`);

  // Access the ID from the decoded token
  const userId = decoded._id;

  const td = await Todo.find({ user : userId});

  res.json({
    td
  }).status(200)

}

// delet the todos 

const DeleteTodo = async(req,res)=>{
  const cook = req.cookies;

  if (!cook || !cook.authToken) {
    return res.json({
      message: "First register and login",
    });
  }

  const { id } = req.params; // Todo ID will be passed as a URL parameter

  const todo = await Todo.findOneAndDelete({ _id: id });

  if (!todo) {
    return res.status(404).json({
      message: "Todo not found or you don't have permission to update it",
    });
  }

  res.status(200).json({
    massage : "DEleted",
    todo
  })
}
module.exports = { createTodo ,UpdataTodo,GetallTodos, DeleteTodo };
