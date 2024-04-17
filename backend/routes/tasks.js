const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Route for getting all tasks
router.get('/', taskController.getAllTasks);

// Route for creating a task
router.post('/', taskController.createTask);

// Route for updating a task
router.put('/:id', taskController.updateTask);

// Route for deleting a task
router.delete('/:id', taskController.deleteTask);

// Route for moving a task to another column
router.put('/move/:id', taskController.moveTask);

module.exports = router;
