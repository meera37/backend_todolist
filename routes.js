const express = require('express')

const AuthController = require('./controllers/AuthController')
const jwtMiddleware = require('./middleware/jwtMiddleware')
const TodoController = require("./controllers/todoController");

const route = new express.Router()

route.post('/register',AuthController.registerController)
route.post('/login',AuthController.loginController)
route.get("/users", jwtMiddleware, AuthController.getUsers);


route.post("/todos", jwtMiddleware, TodoController.createTodo);
route.get("/todos", jwtMiddleware, TodoController.getTodos);
route.put("/todos/:id", jwtMiddleware, TodoController.updateTodo);
route.delete("/todos/:id", jwtMiddleware, TodoController.deleteTodo);

route.put("/todos/:id/assign", jwtMiddleware, TodoController.assignTodo);
route.get("/todos/assigned/by-me", jwtMiddleware, TodoController.getAssignedByMe);
route.get("/todos/assigned/to-me", jwtMiddleware, TodoController.getAssignedToMe);

module.exports = route