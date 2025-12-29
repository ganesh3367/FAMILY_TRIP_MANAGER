const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

router.get('/', async (req, res) => {
    try {
        const trips = await Trip.find().sort({ createdAt: -1 });
        res.json(trips);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const trip = new Trip({
        title: req.body.title,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        budget: req.body.budget
    });

    try {
        const newTrip = await trip.save();
        res.status(201).json(newTrip);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Not found' });
        res.json(trip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Not found' });

        if (req.body.title) trip.title = req.body.title;
        if (req.body.description) trip.description = req.body.description;
        if (req.body.status) trip.status = req.body.status;
        if (req.body.isArchived !== undefined) trip.isArchived = req.body.isArchived;

        const updated = await trip.save();
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Trip.findByIdAndDelete(req.params.id);
        res.json({ message: 'Removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
