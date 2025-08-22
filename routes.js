const express = require('express')

const AuthController = require('./controllers/AuthController')
const jwtMiddleware = require('./middleware/jwtMiddleware')
const TodoController = require("./controllers/todoController");

const route = new express.Router()

route.post('/register',AuthController.registerController)
route.post('/login',AuthController.loginController)

route.post("/todos", jwtMiddleware, TodoController.createTodo);
route.get("/todos", jwtMiddleware, TodoController.getTodos);
route.put("/todos/:id", jwtMiddleware, TodoController.updateTodo);
route.delete("/todos/:id", jwtMiddleware, TodoController.deleteTodo);


module.exports = route