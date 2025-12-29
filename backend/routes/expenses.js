const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

router.get('/:tripId', async (req, res) => {
    try {
        const expenses = await Expense.find({ tripId: req.params.tripId });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/', async (req, res) => {
    const expense = new Expense({
        tripId: req.body.tripId,
        title: req.body.title,
        amount: req.body.amount,
        category: req.body.category,
        date: req.body.date
    });

    try {
        const newExpense = await expense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
