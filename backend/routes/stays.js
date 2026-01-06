const express = require('express');
const router = express.Router();
const Stay = require('../models/Stay');
const jsonStorage = require('../utils/jsonStorage');

// Get stays for a trip
router.get('/trip/:tripId', async (req, res) => {
    try {
        if (global.isOfflineMode) {
            const data = jsonStorage.get('stays', { tripId: req.params.tripId });
            return res.json(data);
        }
        const stays = await Stay.find({ tripId: req.params.tripId });
        res.json(stays);
    } catch (error) {
        console.error('Fetch Stays Error:', error);
        res.status(500).json({ error: 'Failed to retrieve accommodation details.' });
    }
});

// Add new stay info
router.post('/', async (req, res) => {
    const { tripId, name } = req.body;

    if (!tripId || !name) {
        return res.status(400).json({ error: 'Trip ID and accommodation name are required.' });
    }

    try {
        if (global.isOfflineMode) {
            const newStay = jsonStorage.create('stays', req.body);
            return res.status(201).json(newStay);
        }

        const stay = new Stay({
            tripId,
            name,
            type: req.body.type || 'Hotel',
            address: req.body.address,
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut,
            cost: req.body.cost || 0
        });

        const savedStay = await stay.save();
        res.status(201).json(savedStay);
    } catch (error) {
        console.error('Create Stay Error:', error);
        res.status(400).json({ error: 'Could not log accommodation details.' });
    }
});

module.exports = router;
