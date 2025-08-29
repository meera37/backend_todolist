const Todo = require("../model/todoModel");

// Create a todo 
exports.createTodo = async (req, res) => {
  try {
    const { title, description, status, assignedTo } = req.body;

    const todo = new Todo({
      user: req.payload.userId,       
      assignedBy: req.payload.userId, 
      assignedTo: assignedTo || null,  
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
    const todos = await Todo.find()
      .populate("assignedBy", "username email")
      .populate("assignedTo", "username email");

    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update my todo
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, assignedBy: req.payload.userId }, 
      { title, description, status },
      { new: true }
    );

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete my todo
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({
      _id: id,
      assignedBy: req.payload.userId,
    });

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Assign an existing todo to another user
exports.assignTodo = async (req, res) => {
  try {
    const { id } = req.params; // todo id
    const { assignedTo } = req.body; // assignee userId

    const todo = await Todo.findOne({ _id: id, assignedBy: req.payload.userId });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found or not authorized" });
    }

    todo.assignedTo = assignedTo;
    await todo.save();

    res.json({ message: "Task assigned successfully", todo });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get tasks I assigned to others
exports.getAssignedByMe = async (req, res) => {
  try {
    const todos = await Todo.find({ assignedBy: req.payload.userId })
      .populate("assignedTo", "username email") // <-- change here
      .sort({ createdAt: -1 });

    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get tasks assigned to me
exports.getAssignedToMe = async (req, res) => {
  try {
    const todos = await Todo.find({ assignedTo: req.payload.userId })
      .populate("assignedBy", "username email") // <-- change here
      .sort({ createdAt: -1 });

    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Dashboard API (combined response)
exports.getDashboardTodos = async (req, res) => {
  try {
    const userId = req.payload.userId;

    const assignedByMe = await Todo.find({ assignedBy: userId })
      .populate("assignedTo", "username email") // <-- change here
      .sort({ createdAt: -1 });

    const assignedToMe = await Todo.find({ assignedTo: userId })
      .populate("assignedBy", "username email") // <-- change here
      .sort({ createdAt: -1 });

    res.json({ assignedByMe, assignedToMe });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
