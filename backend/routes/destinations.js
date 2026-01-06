const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const jsonStorage = require('../utils/jsonStorage');

// Get destinations for a trip
router.get('/:tripId', async (req, res) => {
    try {
        if (global.isOfflineMode) {
            const data = jsonStorage.get('destinations', { tripId: req.params.tripId });
            return res.json(data);
        }
        const destinations = await Destination.find({ tripId: req.params.tripId }).sort({ order: 1 });
        res.json(destinations);
    } catch (error) {
        console.error('Fetch Destinations Error:', error);
        res.status(500).json({ error: 'Failed to retrieve destinations.' });
    }
});

// Add a new destination
router.post('/', async (req, res) => {
    const { tripId, name } = req.body;

    if (!tripId || !name) {
        return res.status(400).json({ error: 'Trip ID and destination name are required.' });
    }

    try {
        if (global.isOfflineMode) {
            const newDest = jsonStorage.create('destinations', req.body);
            return res.status(201).json(newDest);
        }

        const destination = new Destination({
            tripId,
            name,
            country: req.body.country,
            arrivalDate: req.body.arrivalDate,
            departureDate: req.body.departureDate,
            lat: req.body.lat,
            lng: req.body.lng,
            origin: req.body.origin,
            distance: req.body.distance,
            duration: req.body.duration,
            order: req.body.order || 0
        });

        const savedDestination = await destination.save();
        res.status(201).json(savedDestination);
    } catch (error) {
        console.error('Create Destination Error:', error);
        res.status(400).json({ error: 'Could not add this destination.' });
    }
});

module.exports = router;
