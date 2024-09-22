const { json } = require('body-parser');
const express = require('express');
const { createTodo, UpdataTodo, GetallTodos, DeleteTodo } = require('../cotroller/TodoController');
const router = express.Router();

router.post("/createTodo",createTodo)
router.put("/updateTodo/:id", UpdataTodo)
router.get("/getall",GetallTodos);
router.delete("/deletTodo/:id",DeleteTodo)

module.exports = router