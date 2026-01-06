const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const jsonStorage = require('../utils/jsonStorage');

// Get todos for a trip
router.get('/:tripId', async (req, res) => {
    try {
        if (global.isOfflineMode) {
            const data = jsonStorage.get('todos', { tripId: req.params.tripId });
            return res.json(data);
        }
        const todos = await Todo.find({ tripId: req.params.tripId });
        res.json(todos);
    } catch (error) {
        console.error('Fetch Todos Error:', error);
        res.status(500).json({ error: 'Failed to retrieve checklist items.' });
    }
});

// Add a new todo
router.post('/', async (req, res) => {
    const { tripId, task } = req.body;

    if (!tripId || !task) {
        return res.status(400).json({ error: 'Trip ID and task description are required.' });
    }

    try {
        if (global.isOfflineMode) {
            const newTodo = jsonStorage.create('todos', req.body);
            return res.status(201).json(newTodo);
        }

        const todo = new Todo({
            tripId,
            task,
            completed: req.body.completed || false
        });

        const savedTodo = await todo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        console.error('Create Todo Error:', error);
        res.status(400).json({ error: 'Could not create checklist item.' });
    }
});

// Update a todo
router.patch('/:id', async (req, res) => {
    try {
        if (global.isOfflineMode) {
            const updated = jsonStorage.update('todos', req.params.id, req.body);
            if (!updated) return res.status(404).json({ error: 'Item not found.' });
            return res.json(updated);
        }

        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ error: 'Item not found.' });

        if (req.body.completed !== undefined) todo.completed = req.body.completed;
        if (req.body.task) todo.task = req.body.task;

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update checklist item.' });
    }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
    try {
        if (global.isOfflineMode) {
            jsonStorage.delete('todos', req.params.id);
            return res.json({ message: 'Item removed.' });
        }
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item removed.' });
    } catch (error) {
        res.status(500).json({ error: 'Could not remove checklist item.' });
    }
});

module.exports = router;
