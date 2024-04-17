const Task = require('../models/Task');
const Column = require('../models/Column');

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createTask = async (req, res) => {
    const { title, description, columnId } = req.body;

    try {
        const column = await Column.findById(columnId);
        if (!column) {
            return res.status(400).json({ msg: 'Column not found' });
        }

        const newTask = new Task({ title, description, column: columnId });
        await newTask.save();

        column.tasks.push(newTask);
        await column.save();

        res.json(newTask);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateTask = async (req, res) => {
    const { title, description } = req.body;

    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        task.title = title || task.title;
        task.description = description || task.description;

        await task.save();

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        await task.remove();

        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.moveTask = async (req, res) => {
    const { targetColumnId } = req.body;
    const taskId = req.params.id;

    try {
        // Find the task by ID
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        // Find the target column
        const targetColumn = await Column.findById(targetColumnId);
        if (!targetColumn) {
            return res.status(400).json({ msg: 'Target column not found' });
        }

        // Remove task from current column
        const sourceColumn = await Column.findById(task.column);
        sourceColumn.tasks.pull(taskId);
        await sourceColumn.save();

        // Add task to target column
        targetColumn.tasks.push(task);
        task.column = targetColumnId;
        await task.save();
        await targetColumn.save();

        res.json({ msg: 'Task moved successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
