
const Column = require('../models/Column');

exports.getAllColumns = async (req, res) => {
    try {
        const columns = await Column.find().populate('tasks');
        res.json(columns);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createColumn = async (req, res) => {
    const { title } = req.body;

    try {
        const newColumn = new Column({ title });
        await newColumn.save();
        res.json(newColumn);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateColumn = async (req, res) => {
    const { title } = req.body;

    try {
        let column = await Column.findById(req.params.id);
        if (!column) {
            return res.status(404).json({ msg: 'Column not found' });
        }

        column.title = title || column.title;

        await column.save();

        res.json(column);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteColumn = async (req, res) => {
    try {
        const column = await Column.findById(req.params.id);
        if (!column) {
            return res.status(404).json({ msg: 'Column not found' });
        }

        await column.remove();

        res.json({ msg: 'Column removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
