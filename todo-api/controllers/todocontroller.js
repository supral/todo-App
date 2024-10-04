const Todo = require('../models/todoModel');

// Create a new todo item
const createTodo = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    // Validate input
    if (!title || !description || !dueDate) {
      return res.status(400).json({ message: 'Title, description, and due date are required' });
    }

    const newTodo = await Todo.create({
      title,
      description,
      dueDate,
      status,
      userId: req.user.id,
    });

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error creating todo', error: error.message });
  }
};

// Get todos with pagination
const getTodos = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const todos = await Todo.findAll({
      where: { userId: req.user.id },
      offset: (page - 1) * limit,
      limit: parseInt(limit),
    });

    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error: error.message });
  }
};

// Get a single todo by ID
const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);

    if (!todo || todo.userId !== req.user.id) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todo', error: error.message });
  }
};

// Update a todo
const updateTodo = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    const todo = await Todo.findByPk(req.params.id);

    if (!todo || todo.userId !== req.user.id) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.dueDate = dueDate || todo.dueDate;
    todo.status = status || todo.status;

    await todo.save();
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error updating todo', error: error.message });
  }
};

// Delete a todo item
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);

    if (!todo || todo.userId !== req.user.id) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    await todo.destroy();
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error: error.message });
  }
};

module.exports = { createTodo, getTodos, getTodoById, updateTodo, deleteTodo };
