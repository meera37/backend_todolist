const Todo = require("../model/todoModel");

exports.createTodo = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const todo = new Todo({
      user: req.payload.userId, 
      title,
      description,
      status,
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.payload.userId });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, user: req.payload.userId }, 
      { title, description, status },
      { new: true }
    );

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({
      _id: id,
      user: req.payload.userId,
    });

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
