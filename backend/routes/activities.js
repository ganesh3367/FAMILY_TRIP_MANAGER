const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

router.get('/:tripId', async (req, res) => {
    try {
        const activities = await Activity.find({ tripId: req.params.tripId }).sort({ date: 1, timeSlot: 1 });
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const activity = new Activity({
        tripId: req.body.tripId,
        title: req.body.title,
        date: req.body.date,
        timeSlot: req.body.timeSlot,
        location: req.body.location,
        completed: req.body.completed
    });

    try {
        const newActivity = await activity.save();
        res.status(201).json(newActivity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
