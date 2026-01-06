const express = require('express');
const router = express.Router();
const Transport = require('../models/Transport');
const jsonStorage = require('../utils/jsonStorage');

// Get transport options for a trip
router.get('/trip/:tripId', async (req, res) => {
    try {
        if (global.isOfflineMode) {
            const data = jsonStorage.get('transport', { tripId: req.params.tripId });
            return res.json(data);
        }
        const transport = await Transport.find({ tripId: req.params.tripId });
        res.json(transport);
    } catch (error) {
        console.error('Fetch Transport Error:', error);
        res.status(500).json({ error: 'Failed to retrieve transportation details.' });
    }
});

// Add new transport info
router.post('/', async (req, res) => {
    const { tripId, type } = req.body;

    if (!tripId || !type) {
        return res.status(400).json({ error: 'Trip ID and transport type are required.' });
    }

    try {
        if (global.isOfflineMode) {
            const newTrans = jsonStorage.create('transport', req.body);
            return res.status(201).json(newTrans);
        }

        const transport = new Transport({
            tripId,
            type,
            departureLocation: req.body.departureLocation,
            arrivalLocation: req.body.arrivalLocation,
            departureTime: req.body.departureTime,
            arrivalTime: req.body.arrivalTime,
            cost: req.body.cost || 0
        });

        const savedTransport = await transport.save();
        res.status(201).json(savedTransport);
    } catch (error) {
        console.error('Create Transport Error:', error);
        res.status(400).json({ error: 'Could not log transportation details.' });
    }
});

module.exports = router;
