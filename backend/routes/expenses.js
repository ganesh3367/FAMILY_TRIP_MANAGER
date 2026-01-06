const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const jsonStorage = require('../utils/jsonStorage');

// Get expenses for a trip
router.get('/:tripId', async (req, res) => {
    try {
        if (global.isOfflineMode) {
            const data = jsonStorage.get('expenses', { tripId: req.params.tripId });
            return res.json(data);
        }
        const expenses = await Expense.find({ tripId: req.params.tripId });
        res.json(expenses);
    } catch (error) {
        console.error('Fetch Expenses Error:', error);
        res.status(500).json({ error: 'Failed to retrieve expenses for this journey.' });
    }
});

// Add a new expense
router.post('/', async (req, res) => {
    const { tripId, title, amount } = req.body;

    if (!tripId || !title || amount === undefined) {
        return res.status(400).json({ error: 'Trip ID, title, and amount are required.' });
    }

    try {
        if (global.isOfflineMode) {
            const newExp = jsonStorage.create('expenses', req.body);
            return res.status(201).json(newExp);
        }

        const expense = new Expense({
            tripId,
            title,
            amount,
            category: req.body.category || 'General',
            date: req.body.date || new Date()
        });

        const savedExpense = await expense.save();
        res.status(201).json(savedExpense);
    } catch (error) {
        console.error('Create Expense Error:', error);
        res.status(400).json({ error: 'Could not log this expense.' });
    }
});

// Delete an expense
router.delete('/:id', async (req, res) => {
    try {
        if (global.isOfflineMode) {
            jsonStorage.delete('expenses', req.params.id);
            return res.json({ message: 'Expense record removed.' });
        }
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense record removed.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete expense record.' });
    }
});

module.exports = router;
