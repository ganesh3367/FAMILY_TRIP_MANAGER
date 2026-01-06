const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const jsonStorage = require('../utils/jsonStorage');

// Get activities for a trip
router.get('/:tripId', async (req, res) => {
    try {
        if (global.isOfflineMode) {
            const data = jsonStorage.get('activities', { tripId: req.params.tripId });
            return res.json(data);
        }
        const activities = await Activity.find({ tripId: req.params.tripId }).sort({ date: 1, timeSlot: 1 });
        res.json(activities);
    } catch (error) {
        console.error('Fetch Activities Error:', error);
        res.status(500).json({ error: 'Failed to retrieve itinerary activities.' });
    }
});

// Add a new activity
router.post('/', async (req, res) => {
    const { tripId, title } = req.body;

    if (!tripId || !title) {
        return res.status(400).json({ error: 'Trip ID and title are required for activities.' });
    }

    try {
        if (global.isOfflineMode) {
            const newAct = jsonStorage.create('activities', req.body);
            return res.status(201).json(newAct);
        }

        const activity = new Activity({
            tripId,
            title,
            date: req.body.date,
            timeSlot: req.body.timeSlot,
            location: req.body.location,
            completed: req.body.completed || false
        });

        const savedActivity = await activity.save();
        res.status(201).json(savedActivity);
    } catch (error) {
        console.error('Create Activity Error:', error);
        res.status(400).json({ error: 'Could not add activity to your itinerary.' });
    }
});

// Update an activity
router.patch('/:id', async (req, res) => {
    try {
        if (global.isOfflineMode) {
            const updated = jsonStorage.update('activities', req.params.id, req.body);
            if (!updated) return res.status(404).json({ error: 'Activity not found.' });
            return res.json(updated);
        }

        const activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ error: 'Activity not found.' });

        const fields = ['completed', 'title', 'date', 'timeSlot', 'location'];
        fields.forEach(field => {
            if (req.body[field] !== undefined) activity[field] = req.body[field];
        });

        const updatedActivity = await activity.save();
        res.json(updatedActivity);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update activity.' });
    }
});

module.exports = router;
